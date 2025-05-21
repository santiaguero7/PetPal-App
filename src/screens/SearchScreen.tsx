import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';

// Simula datos de cuidadores
const caretakers = [
  {
    id: 1,
    nombre: 'Ana López',
    experiencia: '3 años',
    distancia: '1.2 km',
    servicios: ['Paseo de perros', 'Cuidado en casa'],
  },
  {
    id: 2,
    nombre: 'Carlos Ruiz',
    experiencia: '5 años',
    distancia: '2.5 km',
    servicios: ['Paseo de perros'],
  },
  {
    id: 3,
    nombre: 'María Gómez',
    experiencia: '2 años',
    distancia: '3.1 km',
    servicios: ['Cuidado en casa', 'Hospedaje'],
  },
];

const TABS = [
  { key: 'all', label: 'Todos' },
  { key: 'walking', label: 'Paseo' },
  { key: 'sitting', label: 'Cuidado' },
  { key: 'boarding', label: 'Hospedaje' },
];

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Filtrado por búsqueda y tab
  const filteredCaretakers = caretakers.filter((c) => {
    const matchesSearch =
      c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.servicios.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'walking' && c.servicios.includes('Paseo de perros')) ||
      (activeTab === 'sitting' && c.servicios.includes('Cuidado en casa')) ||
      (activeTab === 'boarding' && c.servicios.includes('Hospedaje'));
    return matchesSearch && matchesTab;
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Buscar</Text>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => {/* Aquí puedes abrir un modal de filtros */}}
        >
          <Icon name="filter-variant" size={22} color={colors.primary} />
          <Text style={styles.filterBtnText}>Filtrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Icon name="magnify" size={20} color="#BDBDBD" style={{ marginLeft: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="Buscar cuidador o servicio..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#BDBDBD"
        />
      </View>

      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabBtn,
              activeTab === tab.key && styles.tabBtnActive,
            ]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[
              styles.tabBtnText,
              activeTab === tab.key && styles.tabBtnTextActive,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginTop: 18 }}>
        {filteredCaretakers.length === 0 && (
          <Text style={{ color: '#888', textAlign: 'center', marginTop: 30 }}>No se encontraron cuidadores.</Text>
        )}
        {filteredCaretakers.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={styles.caretakerCard}
            onPress={() => navigation.navigate('Perfil', { caretakerId: c.id })}
          >
            <Icon name="account" size={32} color={colors.primary} style={{ marginRight: 12 }} />
            <View>
              <Text style={styles.caretakerName}>{c.nombre}</Text>
              <Text style={styles.caretakerInfo}>{c.experiencia} • {c.distancia}</Text>
              <Text style={styles.caretakerServices}>{c.servicios.join(', ')}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FFF8', padding: 18 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#22223B' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F6EF', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  filterBtnText: { color: colors.primary, marginLeft: 6, fontWeight: 'bold' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, marginBottom: 16, paddingVertical: 4 },
  input: { flex: 1, paddingHorizontal: 10, fontSize: 16, color: '#22223B', height: 40 },
  tabsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, gap: 8 },
  tabBtn: { flex: 1, backgroundColor: '#E8F6EF', borderRadius: 20, paddingVertical: 8, alignItems: 'center' },
  tabBtnActive: { backgroundColor: '#6FCF97' },
  tabBtnText: { color: '#219653', fontWeight: 'bold' },
  tabBtnTextActive: { color: '#fff' },
  caretakerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 10, elevation: 1 },
  caretakerName: { fontWeight: 'bold', color: '#22223B', fontSize: 16 },
  caretakerInfo: { color: '#6FCF97', fontSize: 13 },
  caretakerServices: { color: '#888', fontSize: 13 },
});