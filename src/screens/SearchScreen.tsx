import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../themes/colors';
import ScreenHeader from '../components/ScreenHeader';
import PetPalCard from '../components/PetPalCard';
import { getMyPets } from '../services/pets';
import { searchPetpalsByMascota } from '../services/petpals';
import { getToken } from '../storage/token';
import { jwtDecode } from 'jwt-decode';

const API_URL = 'https://petpal-backend-production.up.railway.app/api';

// --- TIPOS (Mantenemos igual) ---
type Pet = {
  id: number;
  name: string;
  breed: string;
  age: number;
  weight: number | null;
  pet_type: 'dog' | 'cat';
};

type Petpal = {
  id: number;
  user_id: number
  service_type: 'dog walker' | 'caregiver';
  price_per_hour: number;
  price_per_day: number | null;
  experience: string;
  location: string;
  pet_type: 'dog' | 'cat';
  size_accepted: 'small' | 'medium' | 'large' | 'all';
};

const SERVICE_OPTIONS = [
  { key: 'Paseo de perros', label: 'Paseo de perros' },
  { key: 'Cuidado en casa', label: 'Cuidado en casa' },
];

export default function SearchScreen({ navigation }: any) {
  // --- ESTADOS (Mantenemos igual) ---
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [showPets, setShowPets] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [petpals, setPetpals] = useState<Petpal[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // --- HELPERS (Mantenemos igual) ---
  const selectedPet = pets.find(p => p.id === selectedPetId);
  const sizeLabel = (w: number | null) =>
    w == null ? 'Desconocido' : w < 8 ? 'Chico' : w < 15 ? 'Mediano' : 'Grande';

  const translateSize = (size: string): string => {
    switch (size) {
      case 'small': return 'Chico';
      case 'medium': return 'Mediano';
      case 'large': return 'Grande';
      case 'all': return 'Todos';
      default: return 'Desconocido';
    }
  };

  // --- LÓGICA DE NEGOCIO (Mantenemos igual) ---
  const requestService = async (petpalId: number, date: Date) => {
    if (!selectedPetId) {
      Alert.alert('Error', 'Debes seleccionar una mascota primero.');
      return;
    }
    try {
      const token = await getToken();
      if (!token) throw new Error('No hay token disponible');
      const decoded: any = jwtDecode(token);
      const client_id = decoded.id;

      const dateOnly = date.toISOString().split('T')[0];
      const date_start = `${dateOnly}T10:00:00`;
      const date_end = `${dateOnly}T11:00:00`;

      const body = {
        client_id,
        petpal_id: petpalId,
        pet_id: selectedPetId,
        service_type: service === 'Paseo de perros' ? 'dog walker' : 'caregiver',
        date_start,
        date_end
      };

      const resp = await fetch(`${API_URL}/reservations/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!resp.ok) throw new Error('Error creando reserva');
      Alert.alert('¡Listo!', 'Tu reserva ha sido solicitada y está pendiente.');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err.message || 'No se pudo crear la reserva.');
    }
  };

  const loadPets = async () => {
    try {
      const data = await getMyPets();
      setPets(data);
    } catch (e) {
      console.error(e);
    }
  };
  
  useEffect(() => { loadPets(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPets();
    setRefreshing(false);
  };

  useEffect(() => {
    setPetpals([]);
  }, [selectedPetId]);

  useEffect(() => {
    const fetchPetpals = async () => {
      if (!selectedPetId || !service) return;

      setLoading(true);
      const svc = service === 'Paseo de perros' ? 'dog walker' : 'caregiver';

      try {
        const results = await searchPetpalsByMascota(selectedPetId, location, svc);
        setPetpals(results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPetpals();
  }, [selectedPetId, location, service]);

  // Cerrar dropdowns al tocar fuera o scrollear
  const closeDropdowns = () => {
    setShowPets(false);
    setShowServices(false);
    Keyboard.dismiss();
  };

  // --- RENDERIZADO ---
  return (
    <TouchableWithoutFeedback onPress={closeDropdowns}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={closeDropdowns}
        >
          <ScreenHeader title="Buscar PetPals" subtitle="Encuentra el cuidador ideal" />

          {/* SECCIÓN DE FILTROS (DISEÑO CARDS) */}
          <View style={styles.filtersContainer}>
            
            {/* 1. Input Ubicación (Search Bar Style) */}
            <View style={styles.searchBarContainer}>
               <Icon name="map-marker" size={20} color={colors.primary} style={styles.searchIcon} />
               <TextInput
                 style={styles.searchInput}
                 placeholder="¿En qué zona buscas? (Ej: Centro)"
                 value={location}
                 onChangeText={setLocation}
                 placeholderTextColor="#999"
                 onFocus={closeDropdowns}
               />
               {location.length > 0 && (
                 <TouchableOpacity onPress={() => setLocation('')}>
                    <Icon name="close-circle" size={18} color="#CCC" />
                 </TouchableOpacity>
               )}
            </View>

            <View style={styles.rowFilters}>
              {/* 2. Selector Mascota */}
              <View style={[styles.filterGroup, { zIndex: 2000 }]}>
                <Text style={styles.label}>Mascota</Text>
                <TouchableOpacity 
                  style={[styles.dropdownTrigger, showPets && styles.dropdownActive]} 
                  onPress={() => {
                    setShowServices(false); // Cierra el otro
                    setShowPets(!showPets);
                    Keyboard.dismiss();
                  }}
                  activeOpacity={0.8}
                >
                  <View style={{flex: 1}}>
                    <Text style={selectedPet ? styles.selectedText : styles.placeholderText} numberOfLines={1}>
                      {selectedPet ? selectedPet.name : 'Seleccionar'}
                    </Text>
                    {selectedPet && (
                       <Text style={styles.subText}>{sizeLabel(selectedPet.weight)}</Text>
                    )}
                  </View>
                  <Icon name={showPets ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
                </TouchableOpacity>

                {/* Dropdown Mascota */}
                {showPets && (
                  <View style={styles.dropdownMenu}>
                    {pets.length > 0 ? pets.map(m => (
                      <TouchableOpacity
                        key={m.id}
                        style={styles.dropdownItem}
                        onPress={() => { setSelectedPetId(m.id); setShowPets(false); }}
                      >
                        <Icon name={m.pet_type === 'dog' ? 'dog' : 'cat'} size={16} color={colors.primary} style={{marginRight: 8}}/>
                        <Text style={styles.itemText}>{m.name}</Text>
                      </TouchableOpacity>
                    )) : (
                      <View style={styles.dropdownItem}>
                         <Text style={{color: '#999', fontSize: 13}}>No tienes mascotas registradas</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

              {/* 3. Selector Servicio */}
              <View style={[styles.filterGroup, { zIndex: 1000 }]}>
                <Text style={styles.label}>Servicio</Text>
                <TouchableOpacity 
                  style={[styles.dropdownTrigger, showServices && styles.dropdownActive]} 
                  onPress={() => {
                    setShowPets(false); // Cierra el otro
                    setShowServices(!showServices);
                    Keyboard.dismiss();
                  }}
                  activeOpacity={0.8}
                >
                  <Text style={service ? styles.selectedText : styles.placeholderText} numberOfLines={1}>
                    {service ? SERVICE_OPTIONS.find(s => s.key === service)?.label : 'Elegir'}
                  </Text>
                  <Icon name={showServices ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
                </TouchableOpacity>

                {/* Dropdown Servicio */}
                {showServices && (
                  <View style={styles.dropdownMenu}>
                    {SERVICE_OPTIONS.map(s => (
                      <TouchableOpacity
                        key={s.key}
                        style={styles.dropdownItem}
                        onPress={() => { setService(s.key); setShowServices(false); }}
                      >
                         <Icon name={s.key.includes('Paseo') ? 'dog-service' : 'home-heart'} size={16} color={colors.primary} style={{marginRight: 8}}/>
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
             {petpals.length > 0 && <Text style={styles.resultsCount}>{petpals.length} encontrados</Text>}
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Buscando los mejores cuidadores...</Text>
            </View>
          ) : petpals.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name={(!selectedPetId || !service) ? "magnify-scan" : "emoticon-sad-outline"} size={50} color="#DDD" />
              <Text style={styles.emptyTitle}>
                {(!selectedPetId || !service) 
                  ? 'Comienza tu búsqueda' 
                  : 'No encontramos cuidadores'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {(!selectedPetId || !service) 
                  ? 'Selecciona una mascota y un servicio para ver los PetPals disponibles.' 
                  : 'Intenta cambiar la ubicación o los filtros para ver más resultados.'}
              </Text>
            </View>
          ) : (
            <View style={styles.listContainer}>
              {petpals.map(c => (
                <PetPalCard
                  key={c.id}
                  petpal={c}
                  translateSize={translateSize}
                  onPressProfile={id => navigation.navigate('Perfil', { caretakerId: id })}
                  onRequest={(_ignored, date) => requestService(c.user_id, date)}
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
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Fondo general limpio
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Contenedor de Filtros
  filtersContainer: {
    marginBottom: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 16,
    // Sombra suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },

  rowFilters: {
    flexDirection: 'row',
    gap: 12,
  },
  filterGroup: {
    flex: 1,
    position: 'relative', // Necesario para el dropdown absoluto
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dropdownTrigger: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56, // Altura cómoda para dedo
  },
  dropdownActive: {
    borderColor: colors.primary,
    backgroundColor: '#F6FFF8',
  },
  selectedText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  subText: {
    color: '#888',
    fontSize: 11,
    marginTop: 2,
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  
  // Dropdown Flotante
  dropdownMenu: {
    position: 'absolute',
    top: '100%', // Justo debajo del trigger
    left: 0,
    right: 0,
    marginTop: 6,
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 4,
    // Sombra fuerte para flotar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  itemText: {
    color: '#333',
    fontSize: 14,
  },

  // Resultados
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 12,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  resultsCount: {
    fontSize: 13,
    color: '#666',
  },
  listContainer: {
    gap: 16,
  },
  
  // Estados de Carga y Vacío
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.primary,
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
});