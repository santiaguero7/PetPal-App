import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import ScreenHeader from '../components/ScreenHeader';
import { getPetPalReservations, updateReservationStatus } from '../services/reservations';

// Tipos definidos
type ReservationStatus = 'pending' | 'accepted' | 'completed' | 'rejected';

type Reservation = {
  id: number;
  client_name: string;
  client_photo?: string; // Por si el back lo envía a futuro
  pet_name: string;
  pet_photo?: string;
  service_type?: 'dog walker' | 'caregiver'; // Ideal si el back lo envía
  date_start: string;
  status: ReservationStatus;
  price?: number;
};

export default function PetPalRequestsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null); // Para bloquear botones al actualizar
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  const loadReservations = async () => {
    try {
      const data = await getPetPalReservations();
      // Aseguramos que sea array
      setReservations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      // Opcional: Mostrar toast en lugar de Alert intrusivo
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

  const handleStatus = async (id: number, status: 'accepted' | 'rejected') => {
    setUpdatingId(id);
    try {
      await updateReservationStatus(id, status);
      // Optimistic update o recarga
      await loadReservations();
      if (status === 'accepted') {
        Alert.alert('¡Excelente!', 'Has aceptado el trabajo. Se ha añadido a tu agenda.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo actualizar la reserva. Intenta nuevamente.');
    } finally {
      setUpdatingId(null);
    }
  };

  // --- FILTROS ---
  // Pendientes
  const pendingList = reservations.filter(r => r.status === 'pending');
  // Historial (Aceptadas, Completadas, Rechazadas) ordenadas por fecha reciente
  const historyList = reservations
    .filter(r => r.status !== 'pending')
    .sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime());

  const currentList = activeTab === 'pending' ? pendingList : historyList;

  // --- HELPERS VISUALES ---
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
    });

  const fmtTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case 'pending': return '#F39C12'; // Naranja
      case 'accepted': return colors.primary; // Verde
      case 'completed': return '#2980B9'; // Azul
      case 'rejected': return '#E74C3C'; // Rojo
      default: return '#999';
    }
  };

  const getStatusLabel = (status: ReservationStatus) => {
    switch (status) {
      case 'pending': return 'Pendiente de respuesta';
      case 'accepted': return 'Confirmada';
      case 'completed': return 'Finalizada';
      case 'rejected': return 'Rechazada';
      default: return status;
    }
  };

  // --- RENDERIZADO DE TARJETA ---
  const renderCard = (r: Reservation) => {
    const statusColor = getStatusColor(r.status);
    const isUpdating = updatingId === r.id;

    return (
      <View 
        key={r.id} 
        style={[
          styles.card, 
          { borderLeftColor: statusColor, borderLeftWidth: 5 } // Indicador lateral de color
        ]}
      >
        {/* Header Tarjeta: Fecha y Estado */}
        <View style={styles.cardHeader}>
          <View style={styles.dateContainer}>
             <Icon name="calendar-clock" size={16} color="#666" style={{ marginRight: 6 }} />
             <Text style={styles.dateText}>{fmtDate(r.date_start)} • {fmtTime(r.date_start)}</Text>
          </View>
          {activeTab === 'history' && (
             <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>{getStatusLabel(r.status)}</Text>
             </View>
          )}
        </View>

        {/* Cuerpo: Info Cliente/Mascota */}
        <View style={styles.cardBody}>
           <View style={styles.avatarContainer}>
              <Icon name="account" size={24} color={colors.primary} />
           </View>
           <View style={styles.infoContent}>
              <Text style={styles.clientName}>{r.client_name}</Text>
              <View style={styles.petRow}>
                 <Icon name="paw" size={14} color={colors.secondary} style={{marginRight: 4}} />
                 <Text style={styles.petName}>Mascota: {r.pet_name}</Text>
              </View>
              {/* Si tuvieras el tipo de servicio */}
              {r.service_type && (
                 <Text style={styles.serviceType}>
                    {r.service_type === 'dog walker' ? 'Paseo' : 'Cuidado'}
                 </Text>
              )}
           </View>
           <View style={styles.idBadge}>
              <Text style={styles.idText}>#{r.id}</Text>
           </View>
        </View>

        {/* Acciones (Solo para pendientes) */}
        {r.status === 'pending' && (
          <View style={styles.actionsContainer}>
            {isUpdating ? (
              <ActivityIndicator color={colors.primary} style={{ padding: 10 }} />
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.btnReject]}
                  onPress={() => handleStatus(r.id, 'rejected')}
                  activeOpacity={0.7}
                >
                  <Icon name="close" size={18} color="#E74C3C" style={{ marginRight: 6 }} />
                  <Text style={[styles.btnText, { color: '#E74C3C' }]}>Rechazar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionBtn, styles.btnAccept]}
                  onPress={() => handleStatus(r.id, 'accepted')}
                  activeOpacity={0.7}
                >
                  <Icon name="check" size={18} color="#FFF" style={{ marginRight: 6 }} />
                  <Text style={[styles.btnText, { color: '#FFF' }]}>Aceptar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ScreenHeader 
          title="Solicitudes" 
          subtitle="Gestiona tu trabajo" 
          icon="bell-ring-outline" 
        />

        {/* --- TABS --- */}
        <View style={styles.tabsContainer}>
           <TouchableOpacity 
             style={[styles.tabButton, activeTab === 'pending' && styles.tabActive]} 
             onPress={() => setActiveTab('pending')}
           >
              <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>
                 Pendientes {pendingList.length > 0 && `(${pendingList.length})`}
              </Text>
           </TouchableOpacity>
           <TouchableOpacity 
             style={[styles.tabButton, activeTab === 'history' && styles.tabActive]} 
             onPress={() => setActiveTab('history')}
           >
              <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
                 Agenda / Historial
              </Text>
           </TouchableOpacity>
        </View>

        {/* --- LISTA --- */}
        {loading ? (
          <View style={styles.centerBox}>
             <ActivityIndicator size="large" color={colors.primary} />
             <Text style={{ marginTop: 10, color: '#999' }}>Cargando solicitudes...</Text>
          </View>
        ) : currentList.length === 0 ? (
          <View style={styles.emptyState}>
             <Icon 
               name={activeTab === 'pending' ? "inbox-outline" : "history"} 
               size={50} 
               color="#DDD" 
             />
             <Text style={styles.emptyTitle}>
                {activeTab === 'pending' ? 'Estás al día' : 'Sin historial aún'}
             </Text>
             <Text style={styles.emptySubtitle}>
                {activeTab === 'pending' 
                   ? 'No tienes nuevas solicitudes pendientes de respuesta.' 
                   : 'Aquí aparecerán tus trabajos aceptados y finalizados.'}
             </Text>
          </View>
        ) : (
          <View style={styles.list}>
             {currentList.map(renderCard)}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centerBox: {
    marginTop: 50,
    alignItems: 'center',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // List
  list: {
    gap: 16,
  },

  // Card Design
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    // Sombra
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 4, // Espacio extra
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Body
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F9F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  petRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  petName: {
    fontSize: 14,
    color: '#666',
  },
  serviceType: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 2,
    fontWeight: '500',
  },
  idBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  idText: {
    fontSize: 10,
    color: '#999',
    fontWeight: 'bold',
  },

  // Actions
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  btnReject: {
    backgroundColor: '#FDEDEC', // Rojo muy suave
    borderWidth: 1,
    borderColor: '#FADBD8',
  },
  btnAccept: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 6,
    maxWidth: '80%',
  },
});