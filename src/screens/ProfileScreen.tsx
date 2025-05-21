import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { RootStackParamList, TabParamList } from '../navigation';

// Tipo combinado para permitir acceso a navegación de Stack y Tab
type ProfileScreenNavigationProp = BottomTabScreenProps<TabParamList, 'Perfil'> & {
  navigation: BottomTabScreenProps<TabParamList, 'Perfil'>['navigation'] &
              StackNavigationProp<RootStackParamList>;
};

type Props = ProfileScreenNavigationProp;

const currentUser = {
  name: "Santiago Aguero",
  email: "aguero17.2001@gmail.com",
  image: "",
  pets: [
    { id: "1", name: "Murdock", type: "Perro", breed: "Golden Retriever" },
    { id: "2", name: "Benito", type: "Gato", breed: "Maine Coon" }
  ]
};

const menuItems = [
  { icon: 'account-cog', label: "Configuración de cuenta" },
  { icon: 'credit-card', label: "Métodos de pago" },
  { icon: 'heart', label: "Favoritos" },
  { icon: 'help-circle', label: "Centro de ayuda" },
  { icon: 'cog', label: "Preferencias" },
];

export default function ProfileScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Perfil</Text>
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
          {currentUser.pets.map((pet) => (
            <View key={pet.id} style={styles.petCard}>
              <View style={styles.petAvatar}>
                <Text style={styles.petAvatarText}>{pet.name.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.petName}>{pet.name}</Text>
                <View style={styles.petInfoRow}>
                  <View style={styles.petBadge}>
                    <Text style={styles.petBadgeText}>{pet.type}</Text>
                  </View>
                  <Text style={styles.petBreed}>{pet.breed}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

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

        <TouchableOpacity style={styles.logoutBtn}>
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
    backgroundColor: colors.background,
    paddingHorizontal: 18, // Solo espacio a los lados
    // NO pongas paddingTop ni paddingBottom aquí
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#22223B', marginBottom: 18 },
  profileCard: { backgroundColor: '#fff', borderRadius: 18, marginBottom: 18, overflow: 'hidden', elevation: 2 },
  profileHeader: { height: 60, backgroundColor: '#D1FADF' },
  avatarBox: { alignItems: 'center', marginTop: -30 },
  avatar: { height: 80, width: 80, borderRadius: 40, backgroundColor: '#E8F6EF', alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#fff' },
  avatarText: { color: '#219653', fontWeight: 'bold', fontSize: 32 },
  profileInfo: { alignItems: 'center', marginTop: 8, marginBottom: 16 },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#22223B' },
  profileEmail: { color: '#888', marginBottom: 8 },
  editBtn: { backgroundColor: '#6FCF97', borderRadius: 20, paddingVertical: 6, paddingHorizontal: 18, marginTop: 6 },
  editBtnText: { color: '#fff', fontWeight: 'bold' },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: '#22223B' },
  addPetBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F6EF', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12 },
  addPetBtnText: { color: '#219653', fontWeight: 'bold', marginLeft: 4 },
  petCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, elevation: 1 },
  petAvatar: { height: 48, width: 48, borderRadius: 24, backgroundColor: '#D1FADF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  petAvatarText: { color: '#219653', fontWeight: 'bold', fontSize: 22 },
  petName: { fontWeight: 'bold', color: '#22223B', fontSize: 16 },
  petInfoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  petBadge: { backgroundColor: '#E8F6EF', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginRight: 6 },
  petBadgeText: { color: '#219653', fontWeight: 'bold', fontSize: 12 },
  petBreed: { color: '#888', fontSize: 13 },
  menuCard: { backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', elevation: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  menuIconBox: { height: 36, width: 36, borderRadius: 18, backgroundColor: '#E8F6EF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuLabel: { fontSize: 15, color: '#22223B' },
  separator: { height: 1, backgroundColor: '#F0F0F0', marginHorizontal: 14 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EB5757', borderRadius: 20, paddingVertical: 10, marginBottom: 18, marginTop: 10 },
  logoutBtnText: { color: '#EB5757', fontWeight: 'bold', fontSize: 16 },
  versionText: { color: '#888', fontSize: 12, textAlign: 'center', marginBottom: 18 },
});