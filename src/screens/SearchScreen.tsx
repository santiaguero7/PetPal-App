import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../themes/colors';
import ScreenHeader from '../components/ScreenHeader';
import { PetsContext } from '../context/PetsContext';

// Simula datos de cuidadores
const caretakers = [
  {
    id: 1,
    nombre: 'Ana López',
    experiencia: '3 años',
    distancia: '1.2 km',
    servicios: ['Paseo de perros', 'Cuidado en casa'],
    ubicacion: 'Palermo',
    especies: ['Perro'],
  },
  {
    id: 2,
    nombre: 'Carlos Ruiz',
    experiencia: '5 años',
    distancia: '2.5 km',
    servicios: ['Paseo de perros'],
    ubicacion: 'Belgrano',
    especies: ['Perro'],
  },
  {
    id: 3,
    nombre: 'María Gómez',
    experiencia: '2 años',
    distancia: '3.1 km',
    servicios: ['Cuidado en casa', 'Hospedaje'],
    ubicacion: 'Recoleta',
    especies: ['Gato'],
  },
];

const SERVICE_OPTIONS = [
  { key: 'Paseo de perros', label: 'Paseo' },
  { key: 'Cuidado en casa', label: 'Cuidado' },
];

import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Perfil: { caretakerId: number };
};

type SearchScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Perfil'>;
};

export default function SearchScreen({ navigation }: SearchScreenProps) {
  const petsContext = useContext(PetsContext);
  const pets = petsContext?.pets || [];
  const [mascotaSeleccionada, setMascotaSeleccionada] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [servicioSeleccionado, setServicioSeleccionado] = useState('');
  const [showMascotas, setShowMascotas] = useState(false);
  const [showServicios, setShowServicios] = useState(false);

  const mascota = pets.find(m => m.id === mascotaSeleccionada);

  // Filtrado por mascota, servicio y ubicación
  const filteredCaretakers = caretakers.filter((c) => {
    const matchesServicio = servicioSeleccionado ? c.servicios.includes(servicioSeleccionado) : true;
    const matchesUbicacion = !ubicacion || c.ubicacion.toLowerCase().includes(ubicacion.toLowerCase());
    const matchesEspecie = !mascota || c.especies.includes(mascota.especie);
    return matchesServicio && matchesUbicacion && matchesEspecie;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView
        contentContainerStyle={{ padding: 18, backgroundColor: colors.background }}
        showsVerticalScrollIndicator={true}
      >
        <ScreenHeader title="Buscar PetPals" subtitle="Encuentra cuidadores cerca de ti" />

        {/* Filtros en 3 recuadros uno debajo del otro */}
        <View style={styles.filterColumn}>
          {/* Selector de mascota */}
          <View style={styles.filterBoxColumn}>
            <TouchableOpacity
              style={styles.filterSelectColumn}
              onPress={() => setShowMascotas(!showMascotas)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  mascota ? styles.filterSelectText : styles.filterSelectTextPlaceholder
                ]}
              >
                {mascota ? mascota.nombre : 'Selecciona tu mascota'}
              </Text>
              <Icon name={showMascotas ? 'chevron-up' : 'chevron-down'} size={22} color={colors.primary} />
            </TouchableOpacity>
            {showMascotas && (
              <View style={styles.dropdownColumn}>
                {pets.map(m => (
                  <TouchableOpacity
                    key={m.id}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setMascotaSeleccionada(m.id);
                      setShowMascotas(false);
                    }}
                  >
                    <Text style={{ color: colors.primary }}>{m.nombre}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Selector de servicio */}
          <View style={styles.filterBoxColumn}>
            <TouchableOpacity
              style={styles.filterSelectColumn}
              onPress={() => setShowServicios(!showServicios)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  servicioSeleccionado ? styles.filterSelectText : styles.filterSelectTextPlaceholder
                ]}
              >
                {servicioSeleccionado
                  ? SERVICE_OPTIONS.find(s => s.key === servicioSeleccionado)?.label
                  : 'Tipo de servicio'}
              </Text>
              <Icon name={showServicios ? 'chevron-up' : 'chevron-down'} size={22} color={colors.primary} />
            </TouchableOpacity>
            {showServicios && (
              <View style={styles.dropdownColumn}>
                {SERVICE_OPTIONS.map(s => (
                  <TouchableOpacity
                    key={s.key}
                    style={styles.dropdownOption}
                    onPress={() => {
                      setServicioSeleccionado(s.key);
                      setShowServicios(false);
                    }}
                  >
                    <Text style={{ color: colors.primary }}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Selector de ubicación */}
          <View style={styles.filterBoxColumn}>
            <View style={styles.filterSelectColumn}>
              <TextInput
                style={[
                  styles.filterSelectText,
                  !ubicacion && styles.filterSelectTextPlaceholder,
                  { flex: 1, paddingVertical: 0, paddingHorizontal: 0, backgroundColor: 'transparent', borderWidth: 0 }
                ]}
                placeholder="Ubicación"
                value={ubicacion}
                onChangeText={setUbicacion}
                placeholderTextColor={colors.primary}
                underlineColorAndroid="transparent"
              />
            </View>
          </View>
        </View>

        {/* Listado de cuidadores */}
        <View style={{ marginTop: 18 }}>
          {filteredCaretakers.length === 0 && (
            <Text style={{ color: '#888', textAlign: 'center', marginTop: 30 }}>No se encontraron cuidadores.</Text>
          )}
          {filteredCaretakers.map((c) => (
            <View key={c.id} style={styles.caretakerCard}>
              <Icon name="account" size={32} color={colors.primary} style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.caretakerName}>{c.nombre}</Text>
                <Text style={styles.caretakerInfo}>{c.experiencia} • {c.distancia} • {c.ubicacion}</Text>
                <Text style={styles.caretakerServices}>{c.servicios.join(', ')}</Text>
                <TouchableOpacity
                  style={[styles.tabBtn, { marginTop: 8, alignSelf: 'flex-start' }]}
                  onPress={() => Alert.alert('Solicitud enviada', `Solicitaste a ${c.nombre} para tu mascota ${mascota?.nombre}`)}
                >
                  <Text style={styles.tabBtnText}>Solicitar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
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
    borderColor: '#219653', // Verde oscuro
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
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
  tabBtn: { backgroundColor: '#E8F6EF', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18, alignItems: 'center' },
  tabBtnText: { color: '#219653', fontWeight: 'bold' },
  caretakerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, elevation: 1 },
  caretakerName: { fontWeight: 'bold', color: '#22223B', fontSize: 16 },
  caretakerInfo: { color: '#6FCF97', fontSize: 13 },
  caretakerServices: { color: '#888', fontSize: 13 },
});