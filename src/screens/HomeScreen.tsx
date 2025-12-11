import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllPetpals } from '../services/petpals';
import PetPalCard from '../components/PetPalCard';

import type { StackNavigationProp } from '@react-navigation/stack';

// Tipos de navegación
type RootStackParamList = {
  Home: undefined;
  Buscar: { id?: string } | undefined;
  Servicios: undefined;
  Profile: undefined; 
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [petpals, setPetpals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulación de usuario
  const userName = "Nicolás"; 

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
      case 'all': return 'Todos';
      default: return size;
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6FFF8" />
      
      {/* Fondo Decorativo Superior */}
      <View style={styles.topDecoration} />

      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          
          {/* 1. Header Personalizado */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greetingText}>Hola, {userName} 👋</Text>
              <Text style={styles.subtitleText}>¿Qué necesita tu mascota hoy?</Text>
            </View>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile' as any)}
            >
              <Icon name="account" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* 2. Banner Hero */}
          <View style={styles.heroBanner}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Encuentra el cuidador perfecto</Text>
              <Text style={styles.heroSubtitle}>Amor y seguridad para tus peludos.</Text>
              <TouchableOpacity
                style={styles.heroButton}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('Buscar')}
              >
                <Text style={styles.heroButtonText}>Buscar Ahora</Text>
                <Icon name="magnify" size={20} color={colors.primary} style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            </View>
            <Icon name="dog-side" size={80} color="rgba(255,255,255,0.3)" style={styles.heroIcon} />
          </View>

          {/* 3. Servicios Rápidos (Burbujas) */}
          <Text style={styles.sectionHeader}>Servicios</Text>
          <View style={styles.servicesContainer}>
            
            <TouchableOpacity 
              style={styles.serviceItem} 
              onPress={() => navigation.navigate('Servicios')}
              activeOpacity={0.8}
            >
              <View style={[styles.serviceIconBox, { backgroundColor: '#E3F2FD' }]}>
                <Icon name="dog-service" size={32} color="#1976D2" />
              </View>
              <Text style={styles.serviceLabel}>Paseo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.serviceItem} 
              onPress={() => navigation.navigate('Servicios')}
              activeOpacity={0.8}
            >
              <View style={[styles.serviceIconBox, { backgroundColor: '#F3E5F5' }]}>
                <Icon name="home-heart" size={32} color="#8E24AA" />
              </View>
              <Text style={styles.serviceLabel}>Cuidado</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.serviceItem} 
              activeOpacity={0.8}
            >
              <View style={[styles.serviceIconBox, { backgroundColor: '#FFF3E0' }]}>
                <Icon name="history" size={32} color="#F57C00" />
              </View>
              <Text style={styles.serviceLabel}>Historial</Text>
            </TouchableOpacity>

          </View>

          {/* 4. Cuidadores Destacados */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionHeader}>Cuidadores cerca de ti</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Buscar')}>
              <Text style={styles.seeAllText}>Ver todos</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
          ) : (
            <View>
               {petpals.length === 0 ? (
                 <View style={styles.emptyState}>
                   <Icon name="emoticon-sad-outline" size={40} color="#CCC" />
                   <Text style={styles.emptyText}>No encontramos cuidadores por ahora.</Text>
                 </View>
               ) : (
                  <View style={styles.cardsList}>
                    {petpals.slice(0, 3).map((p) => (
                      <View key={p.id} style={{ marginBottom: 16 }}>
                         <PetPalCard
                            petpal={p}
                            translateSize={translateSize}
                            // CORRECCIÓN 1: Agregamos .toString() aquí
                            onPressProfile={(id) => navigation.navigate('Buscar', { id: id.toString() })}
                            // CORRECCIÓN 2: Agregamos .toString() aquí también
                            onRequest={() => navigation.navigate('Buscar', { id: p.id.toString() })} 
                         />
                      </View>
                    ))}
                  </View>
               )}
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topDecoration: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#F6FFF8',
    zIndex: -1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#333',
    letterSpacing: -0.5,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  heroBanner: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 30,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  heroContent: {
    flex: 1,
    zIndex: 1,
  },
  heroTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 28,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 16,
  },
  heroButton: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  heroIcon: {
    position: 'absolute',
    right: -10,
    bottom: -15,
    transform: [{ rotate: '-15deg' }],
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  servicesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  serviceItem: {
    alignItems: 'center',
  },
  serviceIconBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  cardsList: {
    paddingBottom: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyText: {
    color: '#999',
    marginTop: 10,
  },
});