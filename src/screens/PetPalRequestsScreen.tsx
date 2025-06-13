import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import ScreenHeader from '../components/ScreenHeader';
import { getPetPalReservations, updateReservationStatus } from '../services/reservations';

type Reservation = {
  id: number;
  client_name: string;
  pet_name: string;
  date_start: string;
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
};

export default function PetPalRequestsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await getPetPalReservations();
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      Alert.alert('Error', 'No se pudieron cargar las solicitudes');
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleStatus = async (id: number, status: 'accepted' | 'rejected') => {
    try {
      await updateReservationStatus(id, status);
      loadReservations();
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la reserva');
    }
  };

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 18, backgroundColor: colors.background }}>
        <ScreenHeader title="Solicitudes" subtitle="Gestiona las reservas que te solicitaron" />

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
        ) : reservations.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No tienes solicitudes pendientes.</Text>
          </View>
        ) : (
          reservations.map(r => (
            <View key={r.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name="account" size={28} color={colors.primary} style={styles.avatarIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>Reserva #{r.id}</Text>
                  <Text style={styles.cardLabel}>Cliente: <Text style={styles.cardValue}>{r.client_name}</Text></Text>
                  <Text style={styles.cardLabel}>Mascota: <Text style={styles.cardValue}>{r.pet_name}</Text></Text>
                  <Text style={styles.cardLabel}>Fecha: <Text style={styles.cardValue}>{fmtDate(r.date_start)} {fmtTime(r.date_start)}</Text></Text>
                  <Text style={styles.cardLabel}>Estado: <Text style={[
                    styles.cardStatus,
                    r.status === 'pending'
                      ? styles.statusPending
                      : r.status === 'accepted'
                      ? styles.statusAccepted
                      : r.status === 'completed'
                      ? styles.statusCompleted
                      : styles.statusRejected
                  ]}>
                    {r.status === 'pending'
                      ? 'Pendiente'
                      : r.status === 'accepted'
                      ? 'Aceptada'
                      : r.status === 'completed'
                      ? 'Completada'
                      : 'Rechazada'}
                  </Text></Text>
                </View>
              </View>
              {r.status === 'pending' && (
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                    onPress={() => handleStatus(r.id, 'accepted')}
                  >
                    <Text style={styles.actionBtnText}>Aceptar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, { backgroundColor: '#EB5757' }]}
                    onPress={() => handleStatus(r.id, 'rejected')}
                  >
                    <Text style={styles.actionBtnText}>Rechazar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  avatarIcon: {
    marginRight: 14,
    marginTop: 2,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#22223B',
    marginBottom: 2,
  },
  cardLabel: {
    color: '#555',
    fontSize: 13,
    marginBottom: 1,
  },
  cardValue: {
    color: '#219653',
    fontWeight: 'bold',
  },
  cardStatus: {
    fontWeight: 'bold',
  },
  statusPending: {
    color: '#F2994A',
  },
  statusAccepted: {
    color: colors.primary,
  },
  statusCompleted: {
    color: colors.secondary,
  },
  statusRejected: {
    color: '#EB5757',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: colors.muted, marginBottom: 16 },
});