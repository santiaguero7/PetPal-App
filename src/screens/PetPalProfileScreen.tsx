import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  RefreshControl,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import { commonStyles } from '../themes/commonStyles';
import ScreenHeader from '../components/ScreenHeader';
import { getUserById } from '../services/users';
import { getToken, removeToken } from '../storage/token';
import { jwtDecode } from 'jwt-decode';
import PetPalPostCard from '../components/PetPalPostCard';
import PetPalPostForm from '../components/PetPalPostForm';
import UserCard from '../components/UserCard';

// IMPORTACIÓN ESTRICTA DE TUS SERVICIOS
import { 
  getMyPetpals, 
  createPetpal, 
  updatePetpalById 
} from '../services/petpals';

import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../navigation';

// Menú de configuración estático
const menuItems = [
  { icon: 'account-cog-outline', label: 'Configuración de cuenta' },
  { icon: 'credit-card-outline', label: 'Métodos de pago' },
  { icon: 'heart-outline', label: 'Favoritos' },
  { icon: 'help-circle-outline', label: 'Centro de ayuda' },
  { icon: 'cog-outline', label: 'Preferencias' },
];

type PetPalProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PetPalHome'>;

interface PetPalProfileScreenProps {
  navigation: PetPalProfileScreenNavigationProp;
}

export default function PetPalProfileScreen({ navigation }: PetPalProfileScreenProps) {
  // --- ESTADOS ---
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Estados para Modal y Edición
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  
  // Guardamos los valores a editar
  const [editValues, setEditValues] = useState<any>(null);

  const [showPostModal, setShowPostModal] = useState(false); // Modal para CREAR
  const [showUserModal, setShowUserModal] = useState(false); // Modal para USUARIO

  // --- CARGA DE DATOS ---
  const loadData = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const decoded: any = jwtDecode(token);

      // Cargar Usuario
      const userData = await getUserById(decoded.id);
      setUser(userData);

      // Cargar Mis Publicaciones (Usando tu servicio getMyPetpals)
      const myPosts = await getMyPetpals();
      setPosts(Array.isArray(myPosts) ? myPosts : []);

    } catch (error) {
      console.error('Error cargando perfil:', error);
      setPosts([]); // Fallback seguro
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // --- ACCIONES ---

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          await removeToken();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  // CREAR (Usando createPetpal)
  const handleCreatePost = async (values: any) => {
    try {
      // Tu servicio createPetpal espera un objeto específico, asegúrate de que el form lo envíe
      await createPetpal(values);
      setShowPostModal(false);
      Alert.alert('¡Publicado!', 'Tu servicio ya está visible.');
      loadData(); // Recargar lista
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo crear la publicación. Revisa los datos.');
    }
  };

  // EDITAR (Usando updatePetpalById)
  const handleEditPost = async (values: any) => {
    if (!selectedPost) return;
    try {
      await updatePetpalById(selectedPost.id, values);
      setEditMode(false);
      setSelectedPost(null);
      Alert.alert('Actualizado', 'Los cambios se han guardado correctamente.');
      loadData();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'No se pudo actualizar la publicación.');
    }
  };

  // --- RENDER ---
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Perfil Profesional" subtitle="Gestiona tus servicios" icon="briefcase-account" />

        {/* 1. TARJETA DE PERFIL (USUARIO) */}
        <TouchableOpacity 
          style={styles.profileCard} 
          activeOpacity={0.9} 
          onPress={() => setShowUserModal(true)}
        >
          <View style={styles.profileHeaderBg} />
          <View style={styles.profileBody}>
            <View style={styles.avatarContainer}>
              {user?.profile_picture ? (
                 <Image source={{ uri: user.profile_picture }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                   <Text style={styles.avatarText}>
                      {user?.name?.substring(0, 2).toUpperCase() || 'P'}
                   </Text>
                </View>
              )}
              <View style={styles.editIconBadge}>
                 <Icon name="pencil" size={12} color="#FFF" />
              </View>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Cargando...'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <View style={styles.roleBadge}>
                 <Icon name="shield-check" size={12} color={colors.primary} style={{ marginRight: 4 }} />
                 <Text style={styles.roleText}>PetPal Verificado</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={24} color="#CCC" style={{ marginLeft: 'auto' }} />
          </View>
        </TouchableOpacity>

        {/* 2. SECCIÓN PUBLICACIONES */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Mis Servicios</Text>
           <TouchableOpacity 
             style={styles.addButton} 
             onPress={() => setShowPostModal(true)}
           >
              <Icon name="plus" size={16} color={colors.primary} />
              <Text style={styles.addButtonText}>Nuevo</Text>
           </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
        ) : posts.length === 0 ? (
          <View style={styles.emptyState}>
             <Icon name="bullhorn-outline" size={40} color="#DDD" />
             <Text style={styles.emptyText}>No tienes servicios activos.</Text>
             <Text style={styles.emptySubText}>¡Publica uno para empezar a recibir clientes!</Text>
          </View>
        ) : (
          <View style={styles.postsList}>
            {posts.map((post) => (
              <TouchableOpacity
                key={post.id}
                style={styles.postWrapper}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedPost(post);
                  setEditValues(post); // Cargamos datos para editar
                  setEditMode(false);  // Empezamos en modo "Ver detalles"
                }}
              >
                {/* Reutilizamos tu tarjeta visual */}
                <PetPalPostCard {...post} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* 3. AJUSTES */}
        <Text style={[styles.sectionTitle, { marginTop: 24, marginBottom: 10 }]}>Cuenta</Text>
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <View key={index}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={[styles.menuIcon, { backgroundColor: '#F5F5F5' }]}>
                   <Icon name={item.icon} size={20} color="#555" />
                </View>
                <Text style={styles.menuText}>{item.label}</Text>
                <Icon name="chevron-right" size={20} color="#DDD" />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* 4. LOGOUT */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
           <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        <Text style={styles.versionInfo}>PetPal Pro v1.0.0</Text>

      </ScrollView>

      {/* --- MODAL DETALLE / EDITAR SERVICIO --- */}
      <Modal
        visible={!!selectedPost}
        transparent
        animationType="slide"
        onRequestClose={() => { setEditMode(false); setSelectedPost(null); }}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
             <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                   <Text style={styles.modalTitle}>
                     {editMode ? 'Editar Servicio' : 'Detalle del Servicio'}
                   </Text>
                   <TouchableOpacity onPress={() => { setEditMode(false); setSelectedPost(null); }}>
                      <Icon name="close" size={24} color="#888" />
                   </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* MODO VISUALIZACIÓN */}
                  {selectedPost && !editMode && (
                     <PetPalPostCard
                       {...selectedPost}
                       showActions={true} // Asumiendo que tu Card soporta esto para mostrar botón editar
                       onEdit={() => {
                         setEditValues(selectedPost);
                         setEditMode(true);
                       }}
                       // Eliminamos onDelete porque el servicio no lo soporta
                       onClose={() => setSelectedPost(null)}
                     />
                  )}

                  {/* MODO EDICIÓN */}
                  {selectedPost && editMode && (
                     <View style={{ paddingBottom: 20 }}>
                       <PetPalPostForm
                         initialValues={editValues}
                         onSubmit={handleEditPost}
                         onCancel={() => setEditMode(false)}
                         submitText="Guardar Cambios"
                         styles={commonStyles}
                       />
                     </View>
                  )}
                </ScrollView>
             </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- MODAL CREAR SERVICIO --- */}
      <Modal
        visible={showPostModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPostModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={() => setShowPostModal(false)}>
             <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                   <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                         <Text style={styles.modalTitle}>Nuevo Servicio</Text>
                         <TouchableOpacity onPress={() => setShowPostModal(false)}>
                            <Icon name="close" size={24} color="#888" />
                         </TouchableOpacity>
                      </View>
                      
                      <ScrollView showsVerticalScrollIndicator={false}>
                        <PetPalPostForm
                          onSubmit={handleCreatePost}
                          submitText="Publicar Ahora"
                          styles={commonStyles}
                        />
                      </ScrollView>
                   </View>
                </TouchableWithoutFeedback>
             </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- MODAL EDITAR USUARIO --- */}
      <Modal
        visible={showUserModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUserModal(false)}
      >
         <View style={styles.modalOverlay}>
            <UserCard
               user={user}
               onEdit={() => {
                 setShowUserModal(false);
                 navigation.navigate('EditProfile');
               }}
               onClose={() => setShowUserModal(false)}
            />
         </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  profileHeaderBg: {
    height: 60,
    backgroundColor: colors.primary,
  },
  profileBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: -30,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E8F6EF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  avatarText: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
  },
  editIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#333',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userInfo: {
    flex: 1,
    paddingBottom: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 13,
    color: '#888',
    marginBottom: 6,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F6EF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
  },

  // Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F6EF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },

  // List
  postsList: {
    gap: 12,
  },
  postWrapper: {
    marginBottom: 4,
  },
  emptyState: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#555',
    marginTop: 10,
    fontSize: 15,
    fontWeight: '600',
  },
  emptySubText: {
    color: '#999',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },

  // Menu
  menuContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: 66,
  },

  // Footer
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#FFF0F0',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  logoutText: {
    color: '#E53935',
    fontWeight: 'bold',
    fontSize: 16,
  },
  versionInfo: {
    textAlign: 'center',
    color: '#AAA',
    fontSize: 12,
    marginTop: 20,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 24,
    padding: 20,
    elevation: 10,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});