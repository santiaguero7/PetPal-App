import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import ScreenHeader from '../components/ScreenHeader';

const solicitudes = [
  // Simula solicitudes, luego reemplaza por fetch real
  {
    id: 1,
    cliente: 'Juan Pérez',
    mascota: 'Rocco',
    servicio: 'Paseo de perros',
    fecha: '28 Mayo 2025',
    estado: 'pendiente',
  },
  {
    id: 2,
    cliente: 'Ana Torres',
    mascota: 'Luna',
    servicio: 'Cuidado en casa',
    fecha: '30 Mayo 2025',
    estado: 'aceptada',
  },
];

export default function PetPalRequestScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 18, backgroundColor: colors.background }}>
        <ScreenHeader title="Solicitudes" subtitle="Gestiona tus reservas" />
        {solicitudes.length === 0 ? (
          <Text style={{ color: '#888', textAlign: 'center', marginTop: 30 }}>No tienes solicitudes.</Text>
        ) : (
          solicitudes.map((s) => (
            <View key={s.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="account" size={28} color={colors.primary} style={{ marginRight: 10 }} />
                <View>
                  <Text style={styles.cliente}>{s.cliente}</Text>
                  <Text style={styles.servicio}>{s.servicio} - {s.mascota}</Text>
                  <Text style={styles.fecha}>{s.fecha}</Text>
                </View>
              </View>
              <View style={styles.actionsRow}>
                <Text style={[styles.estado, s.estado === 'pendiente' ? styles.estadoPendiente : styles.estadoAceptada]}>
                  {s.estado.charAt(0).toUpperCase() + s.estado.slice(1)}
                </Text>
                {s.estado === 'pendiente' && (
                  <>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Text style={styles.actionBtnText}>Aceptar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtnOutline}>
                      <Text style={styles.actionBtnOutlineText}>Rechazar</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 14, marginBottom: 16, padding: 14, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  cliente: { fontWeight: 'bold', color: colors.primary, fontSize: 16 },
  servicio: { color: '#22223B', fontSize: 14 },
  fecha: { color: '#888', fontSize: 13 },
  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  estado: { fontWeight: 'bold', fontSize: 13, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  estadoPendiente: { backgroundColor: '#F2C94C', color: '#fff' },
  estadoAceptada: { backgroundColor: '#6FCF97', color: '#fff' },
  actionBtn: { backgroundColor: colors.primary, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 16 },
  actionBtnText: { color: '#fff', fontWeight: 'bold' },
  actionBtnOutline: { borderWidth: 1, borderColor: colors.primary, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 16, backgroundColor: '#fff' },
  actionBtnOutlineText: { color: colors.primary, fontWeight: 'bold' },
});