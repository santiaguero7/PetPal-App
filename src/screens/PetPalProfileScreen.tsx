import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import ScreenHeader from '../components/ScreenHeader';

export default function PetPalProfileScreen() {
  // Aquí deberías traer los datos del perfil del PetPal desde tu backend
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 18, backgroundColor: colors.background }}>
        <ScreenHeader title="Mi Perfil" subtitle="Información profesional" />
        <View style={styles.profileBox}>
          <Icon name="account-circle" size={80} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 12 }} />
          <Text style={styles.profileName}>Nombre del PetPal</Text>
          <Text style={styles.profileRole}>Cuidador / Paseador</Text>
          <Text style={styles.profileInfo}>Ubicación: Ciudad, Barrio</Text>
          <Text style={styles.profileInfo}>Precio por hora: $XX</Text>
          <Text style={styles.profileInfo}>Experiencia: X años</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 18,
    elevation: 2,
  },
  profileName: { fontWeight: 'bold', fontSize: 20, color: colors.primary, marginBottom: 4 },
  profileRole: { color: '#888', fontSize: 15, marginBottom: 8 },
  profileInfo: { color: '#22223B', fontSize: 15, marginBottom: 4 },
  editBtn: { marginTop: 16, backgroundColor: colors.primary, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18 },
  editBtnText: { color: '#fff', fontWeight: 'bold' },
});