import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { commonStyles } from '../themes/commonStyles';
import { colors } from '../themes/colors';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList, MainTabParamList } from '../navigation';
import PetCard from '../components/PetCard';
import PetForm from '../components/PetForm';
import ScreenHeader from '../components/ScreenHeader';
import { getUserById } from '../services/users';
import { getToken, removeToken } from '../storage/token';
import { jwtDecode } from 'jwt-decode';
import { getMyPets, updatePetById, deletePetById } from '../services/pets';
import { RefreshControl } from 'react-native';
import UserCard from '../components/UserCard';

const menuItems = [
  { icon: 'account-cog-outline', label: 'Configuración de cuenta', action: 'AccountSettings' },
  { icon: 'credit-card-outline', label: 'Métodos de pago', action: 'PaymentMethods' },
  { icon: 'heart-outline', label: 'Favoritos', action: 'Favorites' },
  { icon: 'help-circle-outline', label: 'Centro de ayuda', action: 'HelpCenter' },
  { icon: 'cog-outline', label: 'Preferencias', action: 'Preferences' },
];

type ProfileScreenProps = BottomTabScreenProps<MainTabParamList, 'Perfil'> & {
  navigation: StackNavigationProp<RootStackParamList>;
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  // Estados de datos
  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Estados de edición/modal mascotas
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState<any>({
    name: '',
    breed: '',
    age: 0,
    weight: null,
    pet_type: 'dog',
    description: '',
  });

  // Estado modal usuario
  const [showUserModal, setShowUserModal] = useState(false);

  // --- CARGA DE DATOS ---
  const fetchData = async () => {
    try {
      const token = await getToken();
      if (!token) return;
      const decoded: any = jwtDecode(token);
      
      // Fetch User & Pets en paralelo
      const [userData, petsData] = await Promise.all([
        getUserById(decoded.id),
        getMyPets()
      ]);

      setUser(userData);
      setPets(petsData);
    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Recargar al volver a la pantalla (focus)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchData);
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // --- ACCIONES ---

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir de PetPal?', [
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

  // Lógica Mascotas
  const handleEditPet = async () => {
    if (!selectedPet) return;
    try {
      await updatePetById(selectedPet.id, editValues);
      setEditMode(false);
      setSelectedPet(null);
      fetchData(); // Recargar lista
      Alert.alert('Éxito', 'Mascota actualizada correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la mascota');
    }
  };

  const handleDeletePet = async () => {
    if (!selectedPet) return;
    Alert.alert('Eliminar mascota', `¿Estás seguro de eliminar a ${selectedPet.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePetById(selectedPet.id);
            setEditMode(false);
            setSelectedPet(null);
            fetchData();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar la mascota');
          }
        },
      },
    ]);
  };

  // --- RENDER ---
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Mi Perfil" subtitle="Gestiona tu cuenta y mascotas" icon="account-circle-outline" />

        {/* 1. TARJETA DE PERFIL */}
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
                      {user?.name?.substring(0, 2).toUpperCase() || 'US'}
                   </Text>
                </View>
              )}
              <View style={styles.editIconBadge}>
                 <Icon name="pencil" size={12} color="#FFF" />
              </View>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'cargando...'}</Text>
              <View style={styles.roleBadge}>
                 <Icon name="shield-account" size={12} color={colors.primary} style={{ marginRight: 4 }} />
                 <Text style={styles.roleText}>{user?.role === 'petpal' ? 'Cuidador PetPal' : 'Cliente'}</Text>
              </View>
            </View>
            
            <Icon name="chevron-right" size={24} color="#CCC" style={{ marginLeft: 'auto' }} />
          </View>
        </TouchableOpacity>

        {/* 2. SECCIÓN MASCOTAS (Horizontal Scroll) */}
        <View style={styles.sectionHeader}>
           <Text style={styles.sectionTitle}>Mis Mascotas</Text>
           <TouchableOpacity 
             style={styles.addButton} 
             onPress={() => navigation.navigate('AddPet')}
           >
              <Icon name="plus" size={16} color={colors.primary} />
              <Text style={styles.addButtonText}>Agregar</Text>
           </TouchableOpacity>
        </View>

        {pets.length === 0 ? (
          <View style={styles.emptyPets}>
             <Icon name="paw-off" size={30} color="#DDD" />
             <Text style={styles.emptyText}>Aún no tienes mascotas registradas.</Text>
          </View>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.petsScroll}
          >
            {pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                style={styles.petCardWrapper}
                activeOpacity={0.8}
                onPress={() => {
                  setSelectedPet(pet);
                  setEditValues(pet);
                  setEditMode(false);
                }}
              >
                <PetCard {...pet} showActions={false} /> 
                {/* Nota: PetCard debería ser adaptable o tener un modo 'mini' si prefieres */}
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* 3. MENÚ DE AJUSTES */}
        <Text style={[styles.sectionTitle, { marginTop: 20, marginBottom: 10 }]}>Cuenta</Text>
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

        <Text style={styles.versionInfo}>PetPal App v1.0.2</Text>

      </ScrollView>

      {/* --- MODALES --- */}

      {/* Modal Editar Mascota */}
      <Modal
        visible={!!selectedPet}
        transparent
        animationType="slide"
        onRequestClose={() => { setEditMode(false); setSelectedPet(null); }}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
               <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {editMode ? 'Editar Mascota' : 'Detalle de Mascota'}
                  </Text>
                  <TouchableOpacity onPress={() => { setEditMode(false); setSelectedPet(null); }}>
                     <Icon name="close" size={24} color="#888" />
                  </TouchableOpacity>
               </View>
               
               <ScrollView style={{ maxHeight: 400 }}>
                 {selectedPet && !editMode && (
                    <PetCard 
                      {...selectedPet} 
                      showActions 
                      onEdit={() => setEditMode(true)}
                      onDelete={handleDeletePet}
                    />
                 )}

                 {selectedPet && editMode && (
                    <View style={{ paddingBottom: 20 }}>
                      <PetForm
                        name={editValues.name}
                        setNombre={(v) => setEditValues({ ...editValues, name: v })}
                        pet_type={editValues.pet_type}
                        setPetType={(v) => setEditValues({ ...editValues, pet_type: v })}
                        weight={editValues.weight}
                        setPeso={(v) => setEditValues({ ...editValues, weight: parseFloat(v) || null })}
                        breed={editValues.breed}
                        setRaza={(v) => setEditValues({ ...editValues, breed: v })}
                        age={editValues.age}
                        setEdad={(v) => setEditValues({ ...editValues, age: parseInt(v) || 0 })}
                        descripcion={editValues.descripcion}
                        setDescripcion={(v) => setEditValues({ ...editValues, descripcion: v })}
                        styles={{ input: commonStyles.input, label: commonStyles.label }}
                      />
                      <View style={styles.modalActions}>
                        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleEditPet}>
                           <Text style={styles.btnTextWhite}>Guardar Cambios</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={() => setEditMode(false)}>
                           <Text style={styles.btnTextPrimary}>Cancelar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                 )}
               </ScrollView>
            </View>
        </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Modal Editar Usuario */}
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
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  profileHeaderBg: {
    height: 60,
    backgroundColor: '#E8F6EF', // Verde claro
  },
  profileBody: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: -30, // Avatar overlap
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFF',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFF',
  },
  avatarText: {
    fontSize: 28,
    color: '#FFF',
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
    backgroundColor: '#F0F9F4',
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

  // Section Headers
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

  // Pets Scroll
  petsScroll: {
    paddingRight: 20,
    gap: 12,
  },
  petCardWrapper: {
    width: 280, // Ancho fijo para el carrusel
  },
  emptyPets: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#AAA',
    marginTop: 8,
    fontSize: 14,
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
    marginLeft: 66, // Alineado con el texto
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalActions: {
    marginTop: 20,
    gap: 10,
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnSecondary: {
    backgroundColor: '#E8F6EF',
  },
  btnTextWhite: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  btnTextPrimary: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});