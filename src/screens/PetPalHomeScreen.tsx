import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
// Asegúrate de tener este tipo definido en tu navegación o ajústalo
type RootStackParamList = {
  PetPalHome: undefined;
  Solicitudes: undefined;
  PerfilPetPal: undefined;
  Login: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'PetPalHome'>;

const { width } = Dimensions.get('window');

export default function PetPalHomeScreen({ navigation }: Props) {
  // Datos simulados (luego vendrán de tu backend)
  const userName = "Santiago";
  const [stats, setStats] = useState({
    earnings: 15000,
    rating: 4.8,
    completed: 12,
  });

  // Simulación de próxima cita
  const nextService = {
    hasService: true,
    client: "Camila Torres",
    pet: "Max",
    service: "Paseo",
    time: "14:00 HS",
    address: "Av. Colón 1234",
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* HEADER FONDO VERDE */}
      <View style={styles.headerBackground}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.headerSubtitle}>Bienvenido de nuevo,</Text>
              <Text style={styles.headerTitle}>{userName}</Text>
            </View>
            <TouchableOpacity 
              style={styles.profilePicContainer}
              onPress={() => navigation.navigate('PerfilPetPal')}
            >
              {/* Si hay foto, usar Image. Si no, Icono */}
              <Icon name="account" size={30} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={styles.scrollViewOverlap} // Para que suba sobre el header
      >
        
        {/* 1. RESUMEN / ESTADÍSTICAS */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Ganancias (Mes)</Text>
            <Text style={styles.statValue}>${stats.earnings}</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Valoración</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.statValue}>{stats.rating}</Text>
              <Icon name="star" size={16} color="#FFD700" style={{ marginLeft: 4 }} />
            </View>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Completados</Text>
            <Text style={styles.statValue}>{stats.completed}</Text>
          </View>
        </View>

        {/* 2. PRÓXIMO SERVICIO (AGENDA) */}
        <Text style={styles.sectionTitle}>Tu Agenda Hoy</Text>
        {nextService.hasService ? (
          <View style={styles.nextServiceCard}>
            <View style={styles.timeBadge}>
              <Icon name="clock-outline" size={20} color="#FFF" />
              <Text style={styles.timeText}>{nextService.time}</Text>
            </View>
            <View style={styles.serviceInfo}>
              <Text style={styles.serviceClient}>
                {nextService.service} con {nextService.pet}
              </Text>
              <Text style={styles.serviceAddress}>
                <Icon name="map-marker" size={14} color="#666" /> {nextService.address}
              </Text>
              <Text style={styles.clientName}>Cliente: {nextService.client}</Text>
            </View>
            <TouchableOpacity style={styles.actionIconBtn}>
              <Icon name="chevron-right" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.emptyAgenda}>
            <Icon name="calendar-check" size={40} color="#CCC" />
            <Text style={{ color: '#888', marginTop: 8 }}>Todo libre por hoy 🎉</Text>
          </View>
        )}

        {/* 3. PANEL DE CONTROL (GRID DE BOTONES) */}
        <Text style={styles.sectionTitle}>Panel de Control</Text>
        <View style={styles.gridContainer}>
          
          {/* Botón Solicitudes (Destacado) */}
          <TouchableOpacity
            style={styles.gridButtonLarge}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Solicitudes')}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
              <Icon name="clipboard-text-outline" size={32} color="#1976D2" />
            </View>
            <View style={{ flex: 1 }}>
               <Text style={styles.gridTitle}>Solicitudes</Text>
               <Text style={styles.gridSubtitle}>Gestionar pendientes</Text>
            </View>
            {/* Badge de notificación simulado */}
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.gridRow}>
            {/* Botón Perfil */}
            <TouchableOpacity
              style={styles.gridButtonSmall}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('PerfilPetPal')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#E8F6EF' }]}>
                <Icon name="card-account-details-outline" size={28} color={colors.primary} />
              </View>
              <Text style={styles.gridTitleSmall}>Mi Perfil</Text>
            </TouchableOpacity>

            {/* Botón Historial/Finanzas (Futuro) */}
            <TouchableOpacity
              style={styles.gridButtonSmall}
              activeOpacity={0.9}
              // onPress={() => navigation.navigate('Historial')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
                <Icon name="history" size={28} color="#F57C00" />
              </View>
              <Text style={styles.gridTitleSmall}>Historial</Text>
            </TouchableOpacity>
          </View>

        </View>
        
        {/* Botón Salir */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => navigation.replace('Login')}
        >
          <Icon name="logout" size={20} color="#E53935" style={{ marginRight: 8 }} />
          <Text style={{ color: '#E53935', fontWeight: '600' }}>Cerrar Sesión</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  headerBackground: {
    backgroundColor: colors.primary, // #6FCF97
    height: 180, // Altura del header verde
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profilePicContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  // ScrollView superpuesto
  scrollViewOverlap: {
    flex: 1,
    marginTop: -50, // Efecto de superposición
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  // Stats Card
  statsCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 24,
    // Sombra fuerte
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  statValue: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  verticalDivider: {
    width: 1,
    height: '70%',
    backgroundColor: '#EEE',
  },

  // Sections
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    marginLeft: 4,
  },

  // Next Service Card
  nextServiceCard: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  timeBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginRight: 14,
  },
  timeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 2,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceClient: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  serviceAddress: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  clientName: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  actionIconBtn: {
    padding: 5,
  },
  emptyAgenda: {
    backgroundColor: '#F0F0F0',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#CCC',
  },

  // Grid Dashboard
  gridContainer: {
    gap: 12,
    marginBottom: 30,
  },
  gridButtonLarge: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridButtonSmall: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center', // Centrado para botones chicos
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8, // Para los botones chicos
    marginRight: 16, // Para el botón largo
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  gridSubtitle: {
    fontSize: 13,
    color: '#777',
  },
  gridTitleSmall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  notificationBadge: {
    backgroundColor: '#E53935',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },

  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginBottom: 20,
    opacity: 0.8,
  }
});