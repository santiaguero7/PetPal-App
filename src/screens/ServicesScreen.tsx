// src/screens/ServicesScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../themes/colors';
import ScreenHeader from '../components/ScreenHeader';
import api from '../../api';
import { getToken } from '../storage/token';
import {jwtDecode} from 'jwt-decode';

type Reservation = {
  id: number;
  petpal_id: number;
  petpal_name: string;
  pet_id: number;
  pet_name: string;
  client_name: string;
  date_start: string;
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
};

export default function ServicesScreen() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) throw new Error('No hay token disponible');
      const { id: client_id }: any = jwtDecode(token);
      const resp = await api.get(`/reservations/client/${client_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(resp.data.data);
    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error(err);
        Alert.alert('Error', 'No se pudieron cargar tus reservas');
      } else {
        setReservations([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReservations();
    setRefreshing(false);
  };

  // Filtrar próximas vs pasadas
  const upcoming = reservations.filter(r =>
    r.status === 'pending' || r.status === 'accepted'
  );
  const past = reservations.filter(r => r.status === 'completed');

  // Formatos
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

  // Render de tarjeta
  const renderCard = (r: Reservation) => {
    const statusLabel =
      r.status === 'pending'
        ? 'Pendiente'
        : r.status === 'accepted'
        ? 'Confirmado'
        : 'Completado';
    const statusStyle =
      r.status === 'completed' ? styles.statusCompleted : styles.statusConfirmed;

    return (
      <View key={r.id} style={styles.card}>
        <View style={[styles.cardBar, { backgroundColor: colors.primary }]} />
        <View style={styles.cardContent}>
          {/* Título con ID de reserva */}
          <Text style={styles.reservationId}>Reserva #{r.id}</Text>

          <View style={styles.cardHeader}>
            <View style={styles.caretakerInfo}>
              <View style={styles.avatar}>
                <Icon name="account" size={28} color={colors.secondary} />
              </View>
              <View>
                <Text style={styles.caretakerName}>{r.petpal_name}</Text>
                <Text style={styles.clientName}>
                  Cliente: {r.client_name}
                </Text>
              </View>
            </View>
            <Text style={[styles.status, statusStyle]}>{statusLabel}</Text>
          </View>

          {/* Datos de la mascota */}
          <View style={styles.infoRow}>
            <Icon
              name="paw"
              size={16}
              color={colors.secondary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.infoText}>Mascota: {r.pet_name}</Text>
          </View>

          {/* Fecha y hora */}
          <View style={styles.infoRow}>
            <Icon
              name="calendar"
              size={16}
              color={colors.secondary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.infoText}>{fmtDate(r.date_start)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Icon
              name="clock-outline"
              size={16}
              color={colors.secondary}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.infoText}>{fmtTime(r.date_start)}</Text>
          </View>

          {/* Acciones */}
          <View style={styles.actionsRow}>
            {(r.status === 'pending' || r.status === 'accepted') ? (
              <>
                <TouchableOpacity style={styles.actionBtnOutline}>
                  <Text style={styles.actionBtnOutlineText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>Mensaje</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Reservar de nuevo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={{ padding: 18 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ScreenHeader
          title="Contrataciones"
          subtitle="Tus servicios reservados"
        />

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              tab === 'upcoming' && styles.tabBtnActive,
            ]}
            onPress={() => setTab('upcoming')}
          >
            <Text
              style={[
                styles.tabBtnText,
                tab === 'upcoming' && styles.tabBtnTextActive,
              ]}
            >
              Próximas
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, tab === 'past' && styles.tabBtnActive]}
            onPress={() => setTab('past')}
          >
            <Text
              style={[
                styles.tabBtnText,
                tab === 'past' && styles.tabBtnTextActive,
              ]}
            >
              Pasadas
            </Text>
          </TouchableOpacity>
        </View>

        {/* Listado */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: 40 }}
          />
        ) : (tab === 'upcoming' ? upcoming : past).length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              {tab === 'upcoming'
                ? 'No tienes contrataciones próximas'
                : 'No tienes contrataciones pasadas'}
            </Text>
            {tab === 'upcoming' && (
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>
                  Buscar cuidadores
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          (tab === 'upcoming' ? upcoming : past).map(renderCard)
        )}
      </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  tabsRow: { flexDirection: 'row', backgroundColor: colors.border, borderRadius: 20, marginBottom: 10, overflow: 'hidden' },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabBtnActive: { backgroundColor: colors.primary },
  tabBtnText: { color: colors.text, fontWeight: 'bold' },
  tabBtnTextActive: { color: '#fff' },
  card: { backgroundColor: colors.white, borderRadius: 14, marginBottom: 16, overflow: 'hidden', elevation: 2 },
  cardBar: { height: 6, width: '100%' },
  cardContent: { padding: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  caretakerInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { height: 40, width: 40, borderRadius: 20, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  caretakerName: { fontWeight: 'bold', color: colors.text, fontSize: 16 },
  serviceName: { color: colors.primary, fontSize: 13 },
  status: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', textAlign: 'center' },
  statusConfirmed: { backgroundColor: colors.border, color: colors.secondary },
  statusCompleted: { backgroundColor: colors.card, color: colors.secondary },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2, marginTop: 2 },
  infoText: { color: colors.text, fontSize: 13 },
  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 8 },
  actionBtn: { backgroundColor: colors.primary, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18 },
  actionBtnText: { color: colors.white, fontWeight: 'bold' },
  actionBtnOutline: { borderWidth: 1, borderColor: colors.primary, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18, backgroundColor: colors.white },
  actionBtnOutlineText: { color: colors.primary, fontWeight: 'bold' },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: colors.muted, marginBottom: 16 },
  // Título con ID de reserva
  reservationId: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  // Texto “Cliente: …”
  clientName: {
    fontSize: 14,
    color: colors.text,
  },
});