import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { commonStyles } from '../themes/commonStyles';
import { colors } from '../themes/colors';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, MainTabParamList } from '../navigation';
import PetCard from '../components/PetCard';
import PetForm from '../components/PetForm';
import ScreenHeader from '../components/ScreenHeader';
import { getUserById } from '../services/users';
import { getToken, removeToken } from '../storage/token';
import { jwtDecode } from 'jwt-decode';
import { getMyPets, updatePetById, deletePetById } from '../services/pets';
import { RefreshControl } from 'react-native';


const menuItems = [
  { icon: 'account-cog', label: 'Configuración de cuenta' },
  { icon: 'credit-card', label: 'Métodos de pago' },
  { icon: 'heart', label: 'Favoritos' },
  { icon: 'help-circle', label: 'Centro de ayuda' },
  { icon: 'cog', label: 'Preferencias' },
];

type ProfileScreenNavigationProp = BottomTabScreenProps<MainTabParamList, 'Perfil'> & {
  navigation: BottomTabScreenProps<MainTabParamList, 'Perfil'>['navigation'] &
  StackNavigationProp<RootStackParamList>;
};
type Props = ProfileScreenNavigationProp;

export default function ProfileScreen({ navigation }: Props) {
  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState<any>({
    name: '',
    breed: '',
    age: 0,
    weight: null,
    pet_type: 'dog'
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await getToken();
        if (!token) return;
        const decoded: any = jwtDecode(token);
        const userData = await getUserById(decoded.id);
        setUser(userData);
      } catch (error) {
        console.error('Error cargando usuario:', error);
      }
    };
    fetchUser();
  }, []);
  const loadPets = async () => {
    try {
      const data = await getMyPets();
      setPets(data);
    } catch (error) {
      console.error('Error trayendo mascotas del usuario:', error);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);
  const onRefresh = async () => {
    setRefreshing(true);
    await loadPets();
    setRefreshing(false);
  };



  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getMyPets();
        setPets(data);
      } catch (error) {
        console.error('Error trayendo mascotas del usuario:', error);
      }
    };
    fetchPets();
  }, []);

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          await removeToken?.();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  const handleEditPet = async () => {
    if (!selectedPet) return;
    try {
      await updatePetById(selectedPet.id, editValues);
      const updatedPets = await getMyPets();
      setPets(updatedPets);
      setEditMode(false);
      setSelectedPet(null);
    } catch (error) {
      console.error('Error actualizando mascota:', error);
    }
  };

  const handleDeletePet = async () => {
    if (!selectedPet) return;
    Alert.alert('Eliminar mascota', '¿Seguro que quieres eliminar esta mascota?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePetById(selectedPet.id);
            const updatedPets = await getMyPets();
            setPets(updatedPets);
            setEditMode(false);
            setSelectedPet(null);
          } catch (error) {
            console.error('Error eliminando mascota:', error);
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

        <ScreenHeader title="Mi Perfil" subtitle="Registra tus mascotas y tus datos" />

        <View style={styles.profileCard}>
          <View style={styles.profileHeader} />
          <View style={styles.avatarBox}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name?.substring(0, 2).toUpperCase() || 'US'}</Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>Editar perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tus mascotas</Text>
            <TouchableOpacity style={styles.addPetBtn} onPress={() => navigation.navigate('AddPet')}>
              <Icon name="plus" size={18} color={colors.primary} />
              <Text style={styles.addPetBtnText}>Agregar</Text>
            </TouchableOpacity>
          </View>

          {pets.length === 0 ? (
            <Text style={{ color: colors.text, marginBottom: 12 }}>No tienes mascotas registradas.</Text>
          ) : (
            pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={{ marginBottom: 12 }}
                onPress={() => {
                  setSelectedPet(pet);
                  setEditMode(false);
                  setEditValues(pet);
                }}
                activeOpacity={0.8}
              >
                <PetCard {...pet} />
              </TouchableOpacity>
            ))
          )}
        </View>

        <Modal
          visible={!!selectedPet}
          transparent
          animationType="slide"
          onRequestClose={() => {
            setEditMode(false);
            setSelectedPet(null);
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalFormContent}>
              {selectedPet && !editMode && (
                <>
                  <PetCard {...selectedPet} />
                  <TouchableOpacity
                    style={[commonStyles.button, { flexDirection: 'row', justifyContent: 'center', marginBottom: 0 }]}
                    onPress={() => setEditMode(true)}
                  >
                    <Icon name="pencil" size={20} color={colors.white} style={{ marginRight: 8 }} />
                    <Text style={commonStyles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[commonStyles.button, { backgroundColor: '#EB5757', marginTop: 8 }]}
                    onPress={handleDeletePet}
                  >
                    <Icon name="delete" size={20} color={colors.white} style={{ marginRight: 8 }} />
                    <Text style={commonStyles.buttonText}>Eliminar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[commonStyles.button, { backgroundColor: colors.secondary, marginTop: 10 }]}
                    onPress={() => {
                      setEditMode(false);
                      setSelectedPet(null);
                    }}
                  >
                    <Text style={commonStyles.buttonText}>Cerrar</Text>
                  </TouchableOpacity>
                </>
              )}
              {selectedPet && editMode && (
                <>
                  <PetForm
                    name={editValues.name}
                    setNombre={(v: string) => setEditValues({ ...editValues, name: v })}
                    pet_type={editValues.pet_type}
                    setPetType={(v: 'dog' | 'cat') => setEditValues({ ...editValues, pet_type: v })}
                    weight={editValues.weight}
                    setPeso={(v: string) => setEditValues({ ...editValues, weight: parseFloat(v) || null })}
                    breed={editValues.breed}
                    setRaza={(v: string) => setEditValues({ ...editValues, breed: v })}
                    age={editValues.age}
                    setEdad={(v: string) => setEditValues({ ...editValues, age: parseInt(v) || 0 })}
                    descripcion={editValues.descripcion}
                    setDescripcion={(v: string) => setEditValues({ ...editValues, descripcion: v })}
                    styles={{ input: commonStyles.input, label: commonStyles.label }}
                  />

                  <TouchableOpacity
                    style={[commonStyles.button, { backgroundColor: colors.primary, marginTop: 8 }]}
                    onPress={handleEditPet}
                  >
                    <Text style={commonStyles.buttonText}>Guardar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[commonStyles.button, { backgroundColor: colors.secondary }]}
                    onPress={() => setEditMode(false)}
                  >
                    <Text style={commonStyles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
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
    borderTopLeftRadius: 32,    // <--- agrega esto
    borderTopRightRadius: 32,   // <--- agrega esto
  },
  avatarBox: { alignItems: 'center', marginTop: -20 }, // menos superposición
  avatar: {
    height: 56, // más chico
    width: 56,
    borderRadius: 28, // mantiene el redondeado
    backgroundColor: '#E8F6EF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff'
  },
  avatarText: { color: '#219653', fontWeight: 'bold', fontSize: 22 }, // más chico
  profileInfo: { alignItems: 'center', marginTop: 4, marginBottom: 8 }, // menos espacio
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#22223B' }, // más chico
  profileEmail: { color: '#888', marginBottom: 4, fontSize: 13 }, // más chico
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
});