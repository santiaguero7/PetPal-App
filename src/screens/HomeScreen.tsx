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
      <ScrollView
        contentContainerStyle={{ padding: 18, backgroundColor: colors.background }}
        showsVerticalScrollIndicator={true}
      >
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
          petpals.length === 0 ? (
            <Text style={{ color: '#888', textAlign: 'center', marginTop: 20 }}>No hay cuidadores disponibles.</Text>
          ) : (
            petpals.map((p) => (
              <TouchableOpacity
                key={p.id}
                style={styles.caretakerCard}
                onPress={() => navigation.navigate('Buscar')}
                activeOpacity={0.85}
              >
                <View style={styles.avatarCircle}>
                  <Icon name={p.pet_type === 'dog' ? 'dog' : 'cat'} size={32} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.caretakerName}>
                    {p.service_type === 'dog walker' ? 'Paseador' : 'Cuidador'} en <Text style={{ color: colors.secondary }}>{p.location}</Text>
                  </Text>
                  <View style={styles.caretakerTagsRow}>
                    <View style={styles.caretakerTag}>
                      <Icon name="star" size={14} color="#FFD700" />
                      <Text style={styles.caretakerTagText}>{p.experience}</Text>
                    </View>
                    <View style={styles.caretakerTag}>
                      <Icon name="cash" size={14} color={colors.primary} />
                      <Text style={styles.caretakerTagText}>
                        {p.price_per_hour ? `$${p.price_per_hour}/h` : `$${p.price_per_day}/día`}
                      </Text>
                    </View>
                    <View style={styles.caretakerTag}>
                      <Icon name={p.pet_type === 'dog' ? 'dog' : 'cat'} size={14} color={colors.primary} />
                      <Text style={styles.caretakerTagText}>{p.pet_type === 'dog' ? 'Perros' : 'Gatos'}</Text>
                    </View>
                    <View style={styles.caretakerTag}>
                      <Icon name="ruler" size={14} color={colors.primary} />
                      <Text style={styles.caretakerTagText}>{translateSize(p.size_accepted)}</Text>
                    </View>
                  </View>
                  {p.description && (
                    <Text style={styles.caretakerDesc}>
                      {p.description}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )
        )}

        <TouchableOpacity
          style={[styles.bannerButton, { alignSelf: 'center', marginTop: 16, marginBottom: 24 }]}
          onPress={() => navigation.navigate('Buscar')}
        >
          <Text style={styles.bannerButtonText}>Ver todos los cuidadores</Text>
        </TouchableOpacity>
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
  caretakerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarCircle: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: '#E8F6EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  caretakerName: { fontWeight: 'bold', color: '#22223B', fontSize: 16, marginBottom: 2 },
  caretakerTagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 2, marginBottom: 2 },
  caretakerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6FFF8',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  caretakerTagText: { color: '#219653', fontSize: 13, marginLeft: 4 },
  caretakerDesc: { color: '#555', fontSize: 13, marginTop: 4, fontStyle: 'italic' },
});
