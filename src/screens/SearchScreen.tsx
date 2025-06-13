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
  StyleSheet
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
  service_type: 'dog walker' | 'caregiver';
  price_per_hour: number;
  price_per_day: number | null;
  experience: string;
  location: string;
  pet_type: 'dog' | 'cat';
  size_accepted: 'small' | 'medium' | 'large' | 'all';
};

const SERVICE_OPTIONS = [
  { key: 'Paseo de perros', label: 'Paseo' },
  { key: 'Cuidado en casa', label: 'Cuidado' },
];

export default function SearchScreen({ navigation }: any) {
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [showPets, setShowPets] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [petpals, setPetpals] = useState<Petpal[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const selectedPet = pets.find(p => p.id === selectedPetId);
  const sizeLabel = (w: number | null) =>
    w == null ? 'Desconocido' : w < 8 ? 'Chico' : w < 15 ? 'Mediano' : 'Grande';

  const weightToSizeLabel = (w: number | null): string =>
    w === null ? 'Desconocido' : w < 8 ? 'Chico' : w < 15 ? 'Mediano' : 'Grande';

  const translateSize = (size: string): string => {
    switch (size) {
      case 'small': return 'Chico';
      case 'medium': return 'Mediano';
      case 'large': return 'Grande';
      case 'all': return 'Todos';
      default: return 'Desconocido';
    }
  };
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

      // formatea sólo YYYY-MM-DD y hora fija (ej: a las 10am)
      const dateOnly = date.toISOString().split('T')[0];
      const date_start = `${dateOnly}T10:00:00`;
      const date_end   = `${dateOnly}T11:00:00`;

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




  // Carga mascotas
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

  // Búsqueda de PetPals
  // 1) Cuando cambias de mascota, reseteá la lista de petpals
  useEffect(() => {
    setPetpals([]);
  }, [selectedPetId]);

  // 2) Búsqueda de PetPals cuando estén todos los filtros listos
  useEffect(() => {
    const fetchPetpals = async () => {
      // Si no hay mascota o servicio, no hacemos nada (pero no limpiamos el array)
      if (!selectedPetId || !service) return;

      setLoading(true);
      const svc = service === 'Paseo de perros' ? 'dog walker' : 'caregiver';

      try {
        const results = await searchPetpalsByMascota(selectedPetId, location, svc);
        console.log('▶︎ Petpals encontrados:', results);
        setPetpals(results);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchPetpals();
  }, [selectedPetId, location, service]);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ padding: 18 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ScreenHeader title="Buscar PetPals" subtitle="Conecta con cuidadores cerca" />

        {/* Selector Mascota */}
        <View style={styles.filterColumn}>
          <View style={styles.filterBoxColumn}>
            <TouchableOpacity style={styles.filterSelectColumn} onPress={() => setShowPets(!showPets)}>
              <Text style={selectedPet ? styles.filterSelectText : styles.filterSelectTextPlaceholder}>
                {selectedPet
                  ? `${selectedPet.name} (${selectedPet.pet_type === 'dog' ? 'Perro' : 'Gato'} – ${sizeLabel(selectedPet.weight)})`
                  : 'Selecciona tu mascota'}
              </Text>
              <Icon name={showPets ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
            </TouchableOpacity>
            {showPets && (
              <View style={styles.dropdownColumn}>
                {pets.map(m => (
                  <TouchableOpacity
                    key={m.id}
                    style={styles.dropdownOption}
                    onPress={() => { setSelectedPetId(m.id); setShowPets(false); }}
                  >
                    <Text style={{ color: colors.primary }}>{m.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Selector Servicio */}
        <View style={styles.filterColumn}>
          <View style={styles.filterBoxColumn}>
            <TouchableOpacity style={styles.filterSelectColumn} onPress={() => setShowServices(!showServices)}>
              <Text style={service ? styles.filterSelectText : styles.filterSelectTextPlaceholder}>
                {service ? SERVICE_OPTIONS.find(s => s.key === service)?.label : 'Tipo de servicio'}
              </Text>
              <Icon name={showServices ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
            </TouchableOpacity>
            {showServices && (
              <View style={styles.dropdownColumn}>
                {SERVICE_OPTIONS.map(s => (
                  <TouchableOpacity
                    key={s.key}
                    style={styles.dropdownOption}
                    onPress={() => { setService(s.key); setShowServices(false); }}
                  >
                    <Text style={{ color: colors.primary }}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Input Ubicación */}
        <View style={styles.filterColumn}>
          <View style={styles.filterBoxColumn}>
            <TextInput
              style={styles.filterSelectColumn}
              placeholder="Ubicación"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor={colors.primary}
            />
          </View>
        </View>

        {/* Resultados */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : petpals.length === 0 ? (
          <Text style={{ color: '#888', textAlign: 'center', marginTop: 30 }}>
            No se encontraron cuidadores.
          </Text>
        ) : (
          petpals.map(c => (
            <PetPalCard
              key={c.id}
              petpal={c}
              translateSize={translateSize}
              onPressProfile={(id) => navigation.navigate('Perfil', { caretakerId: id })}
              onRequest={requestService}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterColumn: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 10,
  },
  filterBoxColumn: {
    marginBottom: 0,
    position: 'relative',
  },
  filterSelectColumn: {
    backgroundColor: '#E8F6EF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#219653',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterSelectText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  filterSelectTextPlaceholder: {
    color: colors.primary,
    opacity: 1,
    fontWeight: 'normal',
    fontSize: 15,
  },
  dropdownColumn: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 4,
    zIndex: 10,
    paddingVertical: 4,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  caretakerCard: { /* ya no usamos PetCard */ },
  caretakerName: { /* idem */ },
  caretakerInfo: { /* idem */ },
  caretakerServices: { /* idem */ },
});