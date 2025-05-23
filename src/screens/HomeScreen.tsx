import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../themes/commonStyles';
import ScreenHeader from '../components/ScreenHeader';
import { getAllPetpals } from '../services/petpals';

import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Home: undefined;
  Buscar: undefined;
  Servicios: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [petpals, setPetpals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetpals = async () => {
      try {
        const data = await getAllPetpals();
        setPetpals(data);
      } catch (error) {
        console.error('Error al obtener petpals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPetpals();
  }, []);

  const translateSize = (size: string) => {
  switch (size) {
    case 'small': return 'Pequeños';
    case 'medium': return 'Medianos';
    case 'large': return 'Grandes';
    case 'all': return 'Todos los tamaños';
    default: return size;
  }
};


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={commonStyles.container}>
        <ScreenHeader title="PetPal" subtitle="Cuida a tus amigos peludos" />

        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>¿Necesitas un cuidador?</Text>
          <Text style={styles.bannerText}>
            Conecta con amantes de mascotas cerca de ti que cuidarán a tus mascotas como familia.
          </Text>
          <TouchableOpacity
            style={styles.bannerButton}
            onPress={() => navigation.navigate('Buscar')}
          >
            <Text style={styles.bannerButtonText}>Buscar cuidadores</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Servicios</Text>
        <View style={styles.servicesRow}>
          <TouchableOpacity style={styles.serviceCard} onPress={() => navigation.navigate('Servicios')}>
            <Icon name="dog" size={28} color={colors.primary} />
            <Text style={styles.serviceTitle}>Paseo de perros</Text>
            <Text style={styles.serviceDesc}>Paseos programados</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.serviceCard} onPress={() => navigation.navigate('Servicios')}>
            <Icon name="home-heart" size={28} color={colors.primary} />
            <Text style={styles.serviceTitle}>Cuidado en casa</Text>
            <Text style={styles.serviceDesc}>Cuida tu mascota con un PetPal</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Cuidadores cercanos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Buscar')}>
            <Text style={styles.link}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <View>
            {petpals.slice(0, 3).map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.caretakerCard}
                onPress={() => navigation.navigate('Buscar')}
              >
                <Icon name="account" size={32} color={colors.primary} style={{ marginRight: 12 }} />
                <View>
                  <Text style={styles.caretakerName}>
                    🧑‍⚕️ {p.service_type === 'dog walker' ? 'Paseador' : 'Cuidador'} en {p.location}
                  </Text>
                  <Text style={styles.caretakerInfo}>📍 {p.experience}</Text>
                  <Text style={styles.caretakerInfo}>
                    💰 {p.price_per_hour ? `$${p.price_per_hour}/hora` : `$${p.price_per_day}/día`}
                  </Text>
                  <Text style={styles.caretakerInfo}>
                    🐾 {p.pet_type === 'dog' ? 'Perros' : 'Gatos'} • 📏 {translateSize(p.size_accepted)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FFF8', padding: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#22223B' },
  subtitle: { color: '#6FCF97', fontSize: 15 },
  avatar: { height: 48, width: 48, borderRadius: 24, backgroundColor: '#D1FADF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#219653', fontWeight: 'bold', fontSize: 18 },
  banner: { backgroundColor: '#6FCF97', borderRadius: 18, padding: 18, marginBottom: 18 },
  bannerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  bannerText: { color: '#fff', marginBottom: 10 },
  bannerButton: { backgroundColor: '#fff', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18, alignSelf: 'flex-start' },
  bannerButtonText: { color: '#219653', fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#22223B', marginVertical: 12 },
  servicesRow: { flexDirection: 'row', gap: 12, marginBottom: 18 },
  serviceCard: { flex: 1, backgroundColor: '#E8F6EF', borderRadius: 14, alignItems: 'center', padding: 14 },
  serviceTitle: { fontWeight: 'bold', color: '#219653', marginTop: 6, textAlign: 'center' },
  serviceDesc: { color: '#555', fontSize: 13, marginTop: 2, textAlign: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  link: { color: '#219653', fontWeight: 'bold' },
  caretakerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, elevation: 1 },
  caretakerName: { fontWeight: 'bold', color: '#22223B', fontSize: 16 },
  caretakerInfo: { color: '#777', fontSize: 13, marginTop: 2 },
});
