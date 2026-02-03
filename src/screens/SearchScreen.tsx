import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator,
  RefreshControl, Alert, StyleSheet, Keyboard, TouchableWithoutFeedback, Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location'; // 📍 GPS

import { colors } from '../themes/colors';
import ScreenHeader from '../components/ScreenHeader';
import PetPalCard from '../components/PetPalCard';
import { getMyPets } from '../services/pets';
import { searchPetpalsByMascota } from '../services/petpals';
import { createReservation } from '../services/reservations';
import { getMe } from '../services/users';
import { PetpalAd, Pet, User } from '../types/interfaces';

const SERVICE_OPTIONS = [
  { key: 'Paseo de perros', label: 'Paseo de perros' },
  { key: 'Cuidado en casa', label: 'Cuidado en casa' },
];

export default function SearchScreen({ navigation }: any) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [showPets, setShowPets] = useState(false);
  const [showServices, setShowServices] = useState(false);
  
  const [petpals, setPetpals] = useState<PetpalAd[]>([]);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | undefined>(undefined);
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 1. Cargar Datos Iniciales y GPS
  const loadInitialData = async () => {
    try {
      // Pedir permiso de ubicación
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setUserCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      }

      // Cargar Mascotas
      const petsData = await getMyPets();
      setPets(petsData);

      // Cargar Perfil (Backup por si falla GPS)
      const myProfile: User = await getMe();
      if ((!userCoords) && myProfile.latitude && myProfile.longitude) {
        setUserCoords({ lat: myProfile.latitude, lng: myProfile.longitude });
      }
    } catch (e) {
      console.error("Error cargando datos:", e);
    }
  };
  
  useEffect(() => { loadInitialData(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  // 2. Buscar automáticamente cuando cambian los filtros
  useEffect(() => {
    const fetchPetpals = async () => {
      if (!selectedPetId || !service) return;

      setLoading(true);
      const svc = service === 'Paseo de perros' ? 'dog walker' : 'caregiver';

      try {
        const results = await searchPetpalsByMascota(selectedPetId, location, svc, userCoords);
        setPetpals(results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPetpals();
  }, [selectedPetId, location, service, userCoords]);

  // 3. Crear Reserva
  const handleRequestService = async (profileId: number, date: Date) => {
    if (!selectedPetId) {
      Alert.alert('Error', 'Debes seleccionar una mascota.');
      return;
    }
    
    const selectedAd = petpals.find(p => p.id === profileId);
    if (!selectedAd) return;

    try {
      const dateOnly = date.toISOString().split('T')[0];
      
      await createReservation({
        petpal_id: selectedAd.user_id, 
        profile_id: profileId,         
        pet_id: selectedPetId,
        service_type: service === 'Paseo de perros' ? 'dog walker' : 'caregiver',
        date_start: `${dateOnly}T10:00:00`,
        date_end: `${dateOnly}T12:00:00`
      });

      Alert.alert('¡Listo!', 'Tu reserva ha sido solicitada. Espera la confirmación.');
    } catch (err: any) {
      Alert.alert('Error', 'No se pudo crear la reserva.');
    }
  };

  const closeDropdowns = () => {
    setShowPets(false);
    setShowServices(false);
    Keyboard.dismiss();
  };

  const selectedPet = pets.find(p => p.id === selectedPetId);

  return (
    <TouchableWithoutFeedback onPress={closeDropdowns}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          keyboardShouldPersistTaps="handled"
        >
          <ScreenHeader title="Buscar PetPals" subtitle="Encuentra el cuidador ideal" />

          {/* FILTROS */}
          <View style={styles.filtersContainer}>
            <View style={styles.searchBarContainer}>
               <Icon name="map-marker" size={20} color={colors.primary} style={styles.searchIcon} />
               <TextInput
                 style={styles.searchInput}
                 placeholder="Ubicación (opcional)"
                 value={location}
                 onChangeText={setLocation}
                 placeholderTextColor="#999"
               />
            </View>

            <View style={styles.rowFilters}>
              {/* Dropdown Mascota */}
              <View style={[styles.filterGroup, { zIndex: 2000 }]}>
                <Text style={styles.label}>Mascota</Text>
                <TouchableOpacity 
                  style={[styles.dropdownTrigger, showPets && styles.dropdownActive]} 
                  onPress={() => { setShowServices(false); setShowPets(!showPets); }}
                >
                  <Text style={selectedPet ? styles.selectedText : styles.placeholderText} numberOfLines={1}>
                    {selectedPet ? selectedPet.name : 'Seleccionar'}
                  </Text>
                  <Icon name="chevron-down" size={20} color={colors.primary} />
                </TouchableOpacity>
                {showPets && (
                  <View style={styles.dropdownMenu}>
                    {pets.map(m => (
                      <TouchableOpacity key={m.id} style={styles.dropdownItem} onPress={() => { setSelectedPetId(m.id); setShowPets(false); }}>
                        <Text style={styles.itemText}>{m.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              {/* Dropdown Servicio */}
              <View style={[styles.filterGroup, { zIndex: 1000 }]}>
                <Text style={styles.label}>Servicio</Text>
                <TouchableOpacity 
                  style={[styles.dropdownTrigger, showServices && styles.dropdownActive]} 
                  onPress={() => { setShowPets(false); setShowServices(!showServices); }}
                >
                  <Text style={service ? styles.selectedText : styles.placeholderText} numberOfLines={1}>
                    {service || 'Elegir'}
                  </Text>
                  <Icon name="chevron-down" size={20} color={colors.primary} />
                </TouchableOpacity>
                {showServices && (
                  <View style={styles.dropdownMenu}>
                    {SERVICE_OPTIONS.map(s => (
                      <TouchableOpacity key={s.key} style={styles.dropdownItem} onPress={() => { setService(s.key); setShowServices(false); }}>
                        <Text style={styles.itemText}>{s.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* RESULTADOS */}
          <View style={styles.resultsHeader}>
             <Text style={styles.sectionTitle}>Resultados</Text>
             {userCoords && <Text style={{fontSize:10, color: colors.primary}}>📍 GPS Activo</Text>}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{marginTop: 20}} />
          ) : petpals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Sin resultados</Text>
              <Text style={styles.emptySubtitle}>Selecciona una mascota y servicio para buscar.</Text>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {petpals.map(ad => (
                <PetPalCard
                  key={ad.id}
                  petpal={ad}
                  // ❌ ELIMINADO: translateSize={translateSize} (Ya no se usa)
                  onPressProfile={(id) => {}} 
                  onRequest={handleRequestService} 
                />
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  filtersContainer: { marginBottom: 20 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 12, height: 50, borderWidth: 1, borderColor: '#E0E0E0', marginBottom: 16 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#333', height: '100%' },
  rowFilters: { flexDirection: 'row', gap: 12 },
  filterGroup: { flex: 1 },
  label: { fontSize: 12, fontWeight: '700', color: '#888', marginBottom: 6, textTransform: 'uppercase' },
  dropdownTrigger: { backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#E0E0E0', paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 56 },
  dropdownActive: { borderColor: colors.primary, backgroundColor: '#F6FFF8' },
  selectedText: { color: colors.primary, fontWeight: 'bold', fontSize: 14 },
  placeholderText: { color: '#999', fontSize: 14 },
  dropdownMenu: { position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 6, backgroundColor: '#FFF', borderRadius: 12, paddingVertical: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6, borderWidth: 1, borderColor: '#F0F0F0' },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  itemText: { color: '#333', fontSize: 14 },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, marginTop: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  listContainer: { gap: 16 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50, opacity: 0.8 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#555', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#999', marginTop: 6, textAlign: 'center' },
});