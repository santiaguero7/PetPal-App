import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TouchableWithoutFeedback, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import ScreenHeader from '../components/ScreenHeader';
import { getUserById } from '../services/users';
import { getToken, removeToken } from '../storage/token';
import { jwtDecode } from 'jwt-decode';
import PetPalPostCard from '../components/PetPalPostCard';
import PetPalPostForm from '../components/PetPalPostForm';
import axios from 'axios';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation'; // <--- usa el global
import { getMyPetpals } from '../services/petpals';

const api = axios.create({
  baseURL: 'https://petpal-backend-production.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' },
});

const menuItems = [
  { icon: 'account-cog', label: 'Configuración de cuenta' },
  { icon: 'credit-card', label: 'Métodos de pago' },
  { icon: 'heart', label: 'Favoritos' },
  { icon: 'help-circle', label: 'Centro de ayuda' },
  { icon: 'cog', label: 'Preferencias' },
];

type PetPalProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PetPalHome'>;

interface PetPalProfileScreenProps {
  navigation: PetPalProfileScreenNavigationProp;
}

export default function PetPalProfileScreen({ navigation }: PetPalProfileScreenProps) {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState<any>(null);
  const [showPostModal, setShowPostModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const decoded: any = jwtDecode(token);
        const userData = await getUserById(decoded.id);
        setUser(userData);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const loadPosts = async () => {
    try {
      const postsArray = await getMyPetpals();
      console.log('POSTS DEL USUARIO:', postsArray);
      setPosts(postsArray);
    } catch (e) {
      setPosts([]);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            await removeToken?.();
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          }
        }
      ]
    );
  };

  const handleCreatePost = async (values: any) => {
    try {
      const token = await getToken();
      const res = await api.post('/petpals', values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('PUBLICACIÓN CREADA:', res.data);
      setShowPostModal(false);
      await loadPosts();
      Alert.alert('¡Publicación creada!');
    } catch (e) {
      Alert.alert('Error', 'No se pudo crear la publicación');
    }
  };

  const handleEditPost = async () => {
    if (!selectedPost) return;
    try {
      const token = await getToken();
      await api.put(`/petpals/${selectedPost.id}`, editValues, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await loadPosts();
      setEditMode(false);
      setSelectedPost(null);
    } catch (e) {
      Alert.alert('Error', 'No se pudo actualizar la publicación');
    }
  };

  const handleDeletePost = async () => {
    if (!selectedPost) return;
    Alert.alert('Eliminar publicación', '¿Seguro que quieres eliminar esta publicación?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await getToken();
            await api.delete(`/petpals/${selectedPost.id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            await loadPosts();
            setEditMode(false);
            setSelectedPost(null);
          } catch (e) {
            Alert.alert('Error', 'No se pudo eliminar la publicación');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: 18 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ScreenHeader title="Mi Perfil" subtitle="Tus publicaciones como PetPal" />

        <View style={styles.profileCard}>
          <View style={styles.profileHeader} />
          <View style={styles.avatarBox}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.substring(0, 2).toUpperCase() || 'PP'}</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name || 'Nombre del PetPal'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'petpal@email.com'}</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>Editar perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tus publicaciones</Text>
            <TouchableOpacity
              style={styles.addPetBtn}
              onPress={() => navigation.navigate('AddPub')}
            >
              <Icon name="plus" size={18} color={colors.primary} />
              <Text style={styles.addPetBtnText}>Agregar</Text>
            </TouchableOpacity>
          </View>

          {posts.length === 0 ? (
            <Text style={{ color: colors.text, marginBottom: 12 }}>No tienes publicaciones registradas.</Text>
          ) : (
            posts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={{ marginBottom: 12 }}
                onPress={() => {
                  setSelectedPost(post);
                  setEditMode(false);
                  setEditValues(post);
                }}
                activeOpacity={0.8}
              >
                <PetPalPostCard {...post} />
              </TouchableOpacity>
            ))
          )
          }
        </View>

        <Modal
          visible={!!selectedPost}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setEditMode(false);
            setSelectedPost(null);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setEditMode(false);
              setSelectedPost(null);
            }}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalFormContent}>
                  {selectedPost && !editMode && (
                    <PetPalPostCard
                      {...selectedPost}
                      showActions
                      onEdit={() => setEditMode(true)}
                      onDelete={handleDeletePost}
                      onClose={() => {
                        setEditMode(false);
                        setSelectedPost(null);
                      }}
                    />
                  )}
                  {selectedPost && editMode && (
                    <>
                      <PetPalPostForm
                        initialValues={editValues}
                        onSubmit={(values) => setEditValues(values)}
                        submitText="Guardar"
                      />
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary, marginTop: 8 }]}
                        onPress={handleEditPost}
                      >
                        <Text style={styles.buttonText}>Guardar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.secondary }]}
                        onPress={() => setEditMode(false)}
                      >
                        <Text style={styles.buttonText}>Cancelar</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ajustes</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, idx) => (
              <View key={item.label}>
                <TouchableOpacity style={styles.menuItem}>
                  <View style={styles.menuIconBox}>
                    <Icon name={item.icon} size={22} color={colors.primary} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </TouchableOpacity>
                {idx < menuItems.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Icon name="logout" size={18} color="#EB5757" style={{ marginRight: 8 }} />
          <Text style={styles.logoutBtnText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>PetPal v1.0.0 © 2025</Text>
      </ScrollView>

      {/* Modal para crear publicación */}
      <Modal
        visible={showPostModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPostModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowPostModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalFormContent}>
                <PetPalPostForm
                  onSubmit={handleCreatePost}
                  submitText="Publicar"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 32,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  profileHeader: {
    height: 36,
    backgroundColor: '#D1FADF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  avatarBox: { alignItems: 'center', marginTop: -20 },
  avatar: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: '#E8F6EF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff'
  },
  avatarText: { color: '#219653', fontWeight: 'bold', fontSize: 22 },
  profileInfo: { alignItems: 'center', marginTop: 4, marginBottom: 8 },
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#22223B' },
  profileEmail: { color: '#888', marginBottom: 4, fontSize: 13 },
  editBtn: {
    backgroundColor: '#6FCF97',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  editBtnText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 14 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#22223B' },
  addPetBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F6EF', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12 },
  addPetBtnText: { color: '#219653', fontWeight: 'bold', marginLeft: 4 },
  menuCard: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', elevation: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  menuIconBox: { height: 36, width: 36, borderRadius: 18, backgroundColor: '#E8F6EF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuLabel: { fontSize: 15, color: '#22223B' },
  separator: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 14 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EB5757', borderRadius: 20, paddingVertical: 10, marginBottom: 18, marginTop: 10 },
  logoutBtnText: { color: '#EB5757', fontWeight: 'bold', fontSize: 16 },
  versionText: { color: '#888', fontSize: 12, textAlign: 'center', marginBottom: 18 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFormContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    width: '92%',
    minWidth: 300,
    maxWidth: 400,
    alignItems: 'stretch',
    elevation: 2,
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});