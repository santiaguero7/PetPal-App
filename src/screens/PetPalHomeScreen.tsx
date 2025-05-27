import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import ScreenHeader from '../components/ScreenHeader';

export default function PetPalHomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 18, backgroundColor: colors.background }}>
        <ScreenHeader title="PetPal Trabajador" subtitle="Gestiona tus servicios y solicitudes" />

        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>¡Bienvenido, PetPal!</Text>
          <Text style={styles.bannerText}>
            Aquí puedes ver tus servicios, solicitudes y editar tu perfil profesional.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Accesos rápidos</Text>
        <View style={styles.servicesRow}>
          <TouchableOpacity style={styles.serviceCard} onPress={() => navigation.navigate({ name: 'PetPalRequest', params: undefined })}>
            <Icon name="clipboard-list" size={28} color={colors.primary} />
            <Text style={styles.serviceTitle}>Solicitudes</Text>
            <Text style={styles.serviceDesc}>Gestiona tus reservas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceCard} onPress={() => navigation.navigate({ name: 'PetPalProfile', params: undefined })}>
            <Icon name="account" size={28} color={colors.primary} />
            <Text style={styles.serviceTitle}>Mi Perfil</Text>
            <Text style={styles.serviceDesc}>Edita tu información</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#6FCF97',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  bannerText: {
    color: '#fff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22223B',
    marginVertical: 12,
  },
  servicesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: '#E8F6EF',
    borderRadius: 14,
    alignItems: 'center',
    padding: 14,
  },
  serviceTitle: {
    fontWeight: 'bold',
    color: '#219653',
    marginTop: 6,
    textAlign: 'center',
  },
  serviceDesc: {
    color: '#555',
    fontSize: 13,
    marginTop: 2,
    textAlign: 'center',
  },
});