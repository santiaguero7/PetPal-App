import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { commonStyles } from '../themes/commonStyles';
import { colors } from '../themes/colors';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, TabParamList } from '../navigation';
import { usePets } from '../context/PetsContext';
import PetCard from '../components/PetCard';
import PetForm from '../components/PetForm';
import ScreenHeader from '../components/ScreenHeader';

// Opciones para selects (definidas aquí)
const ESPECIES = [
  { key: 'Perro', label: 'Perro' },
  { key: 'Gato', label: 'Gato' },
];
const TAMANOS = [
  { key: 'chica', label: 'Chica' },
  { key: 'mediana', label: 'Mediana' },
  { key: 'grande', label: 'Grande' },
];
const RAZAS_PERRO = [
  { key: 1, label: 'Labrador' },
  { key: 2, label: 'Golden Retriever' },
  { key: 3, label: 'Bulldog' },
];
const RAZAS_GATO = [
  { key: 1, label: 'Maine Coon' },
  { key: 2, label: 'Siames' },
  { key: 3, label: 'Persa' },
];

type ProfileScreenNavigationProp = BottomTabScreenProps<TabParamList, 'Perfil'> & {
  navigation: BottomTabScreenProps<TabParamList, 'Perfil'>['navigation'] &
    StackNavigationProp<RootStackParamList>;
};
type Props = ProfileScreenNavigationProp;

const currentUser = {
  name: "Santiago Aguero",
  email: "aguero17.2001@gmail.com",
  image: "",
};

const menuItems = [
  { icon: 'account-cog', label: "Configuración de cuenta" },
  { icon: 'credit-card', label: "Métodos de pago" },
  { icon: 'heart', label: "Favoritos" },
  { icon: 'help-circle', label: "Centro de ayuda" },
  { icon: 'cog', label: "Preferencias" },
];

export default function ProfileScreen({ navigation }: Props) {
  const { pets, editPet, removePet } = usePets();
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [editValues, setEditValues] = useState<{
    nombre: string;
    especie: string;
    tamano: 'chica' | 'mediana' | 'grande';
    raza: string;
    edad: string;
    descripcion: string;
  }>({
    nombre: '',
    especie: '',
    tamano: 'mediana',
    raza: '',
    edad: '',
    descripcion: '',
  });

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Login' }] }) }
    ]);
  };

  const handleEditPet = () => {
    if (!selectedPet) return;
    editPet(selectedPet.id, editValues);
    setEditMode(false);
    setSelectedPet(null);
  };

  const handleDeletePet = () => {
    if (!selectedPet) return;
    Alert.alert(
      'Eliminar mascota',
      '¿Seguro que quieres eliminar esta mascota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => {
            removePet(selectedPet.id);
            setEditMode(false);
            setSelectedPet(null);
          } }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={commonStyles.container}>
        <ScreenHeader title="Mi Perfil" subtitle="Registra tus mascotas y tus datos" />
        <View style={styles.profileCard}>
          <View style={styles.profileHeader} />
          <View style={styles.avatarBox}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentUser.name.substring(0, 2).toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentUser.name}</Text>
            <Text style={styles.profileEmail}>{currentUser.email}</Text>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>Editar perfil</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mascotas */}
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
                  setEditValues({
                    nombre: pet.nombre,
                    especie: pet.especie,
                    tamano: pet.tamano as 'chica' | 'mediana' | 'grande',
                    raza: pet.raza,
                    edad: pet.edad,
                    descripcion: pet.descripcion || '',
                  });
                }}
                activeOpacity={0.8}
              >
                <PetCard
                  nombre={pet.nombre}
                  especie={pet.especie}
                  tamano={pet.tamano}
                  raza={pet.raza}
                  edad={pet.edad}
                  descripcion={pet.descripcion}
                />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Modal para ver/editar mascota */}
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
                  <PetCard
                    nombre={selectedPet.nombre}
                    especie={selectedPet.especie}
                    tamano={selectedPet.tamano}
                    raza={selectedPet.raza}
                    edad={selectedPet.edad}
                    descripcion={selectedPet.descripcion}
                  />
                  <TouchableOpacity
                    style={[
                      commonStyles.button,
                      { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 0 }
                    ]}
                    onPress={() => setEditMode(true)}
                  >
                    <Icon name="pencil" size={20} color={colors.white} style={{ marginRight: 8 }} />
                    <Text style={commonStyles.buttonText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      commonStyles.button,
                      { backgroundColor: '#EB5757', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8, marginBottom: 0 }
                    ]}
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
                    nombre={editValues.nombre}
                    setNombre={v => setEditValues({ ...editValues, nombre: v })}
                    especie={editValues.especie}
                    setEspecie={v => setEditValues({ ...editValues, especie: v })}
                    tamano={editValues.tamano}
                    setTamano={v => setEditValues({ ...editValues, tamano: v as 'chica' | 'mediana' | 'grande' })}
                    raza={editValues.raza}
                    setRaza={v => setEditValues({ ...editValues, raza: v })}
                    edad={editValues.edad}
                    setEdad={v => setEditValues({ ...editValues, edad: v })}
                    descripcion={editValues.descripcion}
                    setDescripcion={v => setEditValues({ ...editValues, descripcion: v })}
                    ESPECIES={ESPECIES}
                    TAMANOS={TAMANOS}
                    RAZAS_PERRO={RAZAS_PERRO}
                    RAZAS_GATO={RAZAS_GATO}
                    styles={{
                      input: commonStyles.input,
                      label: commonStyles.label,
                    }}
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

        {/* Menú de usuario */}
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 18, // <--- así como en las otras pantallas
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#22223B', marginBottom: 18 },
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
  modalActionBtn: {
    backgroundColor: '#6FCF97',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginTop: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  closeModalBtn: {
    marginTop: 10, // Más cerca de los otros botones
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  closeModalBtnSmall: {
    marginTop: 6,
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  saveBigBtn: {
    backgroundColor: '#219653',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginTop: 12,
    alignItems: 'center',
    width: '100%',
  },
  saveBigBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E8F6EF',
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
    fontSize: 15,
    backgroundColor: '#F6FFF8',
  },
  label: {
    fontWeight: 'bold',
    color: '#22223B',
    marginTop: 8,
    marginBottom: 2,
  },
});