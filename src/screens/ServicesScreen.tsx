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
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../themes/colors';
import ScreenHeader from '../components/ScreenHeader'; // Usamos el header animado nuevo
import { getToken } from '../storage/token';
import { jwtDecode } from 'jwt-decode';
import api from '../../api'; // Asegúrate que la ruta a tu api sea correcta

// Definición de tipos
type ReservationStatus = 'pending' | 'accepted' | 'completed' | 'rejected' | 'cancelled';

type Reservation = {
  id: number;
  petpal_id: number;
  petpal_name: string;
  petpal_photo?: string; // Agregado por si el back lo manda
  pet_id: number;
  pet_name: string;
  client_name: string;
  date_start: string;
  service_type: 'dog walker' | 'caregiver'; // Agregado para icono
  status: ReservationStatus;
  price?: number;
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
      const decoded: any = jwtDecode(token);
      
      // Asumiendo que el ID del cliente viene en el token
      const client_id = decoded.id; 
      
      const resp = await api.get(`/reservations/client/${client_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Validamos que venga data
      if(resp.data && Array.isArray(resp.data.data)){
         setReservations(resp.data.data);
      } else {
         setReservations([]);
      }

    } catch (err: any) {
      if (err.response?.status !== 404) {
        console.error(err);
        // Opcional: silenciar error visual si es solo que no hay datos
        // Alert.alert('Error', 'No se pudieron cargar tus reservas');
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

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO (FIX) ---
  
  const now = new Date();

  // Función auxiliar para saber si una fecha ya pasó
  const isPastDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date < now;
  };

  // 1. Filtrar Pasadas: Fecha anterior a hoy O Estado finalizado (Completado/Rechazado/Cancelado)
  const pastList = reservations.filter(r => {
    return isPastDate(r.date_start) || ['completed', 'rejected', 'cancelled'].includes(r.status);
  }).sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime()); // Descendente (más reciente primero)

  // 2. Filtrar Próximas: Fecha futura Y Estado activo (Pendiente/Aceptado)
  const upcomingList = reservations.filter(r => {
    return !isPastDate(r.date_start) && ['pending', 'accepted'].includes(r.status);
  }).sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime()); // Ascendente (más cercana primero)

  const activeList = tab === 'upcoming' ? upcomingList : pastList;

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

  const getStatusConfig = (status: ReservationStatus) => {
    switch (status) {
      case 'accepted':
        return { label: 'Confirmada', color: '#27AE60', bg: '#E8F8F5', icon: 'check-circle-outline' };
      case 'pending':
        return { label: 'Pendiente', color: '#F39C12', bg: '#FEF9E7', icon: 'clock-outline' };
      case 'rejected':
        return { label: 'Rechazada', color: '#E74C3C', bg: '#FDEDEC', icon: 'close-circle-outline' };
      case 'completed':
        return { label: 'Finalizada', color: '#2980B9', bg: '#EAF2F8', icon: 'flag-checkered' };
      default:
        return { label: status, color: '#7F8C8D', bg: '#F2F3F4', icon: 'help-circle-outline' };
    }
  };

  // --- RENDER CARD ---
  const renderCard = (r: Reservation) => {
    const statusConfig = getStatusConfig(r.status);
    const isDogWalker = r.service_type === 'dog walker';

    return (
      <View key={r.id} style={styles.cardContainer}>
        
        {/* Cabecera de la Tarjeta */}
        <View style={styles.cardHeader}>
           <View style={styles.dateBadge}>
              <Text style={styles.dateDay}>{new Date(r.date_start).getDate()}</Text>
              <Text style={styles.dateMonth}>
                {new Date(r.date_start).toLocaleDateString('es-ES', { month: 'short' }).toUpperCase()}
              </Text>
           </View>
           
           <View style={styles.headerInfo}>
             <View style={styles.rowBetween}>
               <Text style={styles.serviceTitle}>
                  {isDogWalker ? 'Paseo' : 'Cuidado'} de {r.pet_name}
               </Text>
               <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                  <Icon name={statusConfig.icon} size={12} color={statusConfig.color} style={{marginRight:4}} />
                  <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
               </View>
             </View>
             <Text style={styles.timeText}>{fmtDate(r.date_start)} • {fmtTime(r.date_start)}</Text>
           </View>
        </View>

        <View style={styles.divider} />

        {/* Cuerpo de la Tarjeta (Info PetPal) */}
        <View style={styles.cardBody}>
           <View style={styles.petpalRow}>
              <View style={styles.avatarContainer}>
                 {r.petpal_photo ? (
                    <Image source={{ uri: r.petpal_photo }} style={styles.avatarImage} />
                 ) : (
                    <Icon name="account" size={24} color={colors.primary} />
                 )}
              </View>
              <View>
                 <Text style={styles.labelSmall}>Cuidador/a</Text>
                 <Text style={styles.petpalName}>{r.petpal_name}</Text>
              </View>
           </View>

           {/* Acciones Rápidas */}
           <View style={styles.actionsContainer}>
              {(r.status === 'pending' || r.status === 'accepted') && !isPastDate(r.date_start) ? (
                 <>
                   <TouchableOpacity style={[styles.btnSmall, styles.btnOutline]}>
                      <Text style={[styles.btnText, {color: '#E74C3C'}]}>Cancelar</Text>
                   </TouchableOpacity>
                   <TouchableOpacity style={[styles.btnSmall, styles.btnPrimary]}>
                      <Text style={[styles.btnText, {color: '#FFF'}]}>Mensaje</Text>
                   </TouchableOpacity>
                 </>
              ) : (
                 <TouchableOpacity style={[styles.btnSmall, styles.btnSecondary]}>
                    <Text style={[styles.btnText, {color: colors.primary}]}>Ver Detalle</Text>
                 </TouchableOpacity>
              )}
           </View>
        </View>

      </View>
    );
  };

  return (
    <SafeAreaView style={styles.mainContainer} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ScreenHeader 
          title="Mis Reservas" 
          subtitle="Historial y próximos servicios"
          icon="calendar-clock" 
        />

        {/* Tabs Segmentados */}
        <View style={styles.tabContainer}>
           <TouchableOpacity 
             style={[styles.tabButton, tab === 'upcoming' && styles.tabActive]} 
             onPress={() => setTab('upcoming')}
             activeOpacity={0.8}
           >
              <Text style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}>Próximas</Text>
           </TouchableOpacity>
           <TouchableOpacity 
             style={[styles.tabButton, tab === 'past' && styles.tabActive]} 
             onPress={() => setTab('past')}
             activeOpacity={0.8}
           >
              <Text style={[styles.tabText, tab === 'past' && styles.tabTextActive]}>Pasadas</Text>
           </TouchableOpacity>
        </View>

        {/* Lista */}
        {loading ? (
          <View style={styles.centerBox}>
             <ActivityIndicator size="large" color={colors.primary} />
             <Text style={styles.loadingText}>Cargando reservas...</Text>
          </View>
        ) : activeList.length === 0 ? (
          <View style={styles.emptyState}>
             <Icon name={tab === 'upcoming' ? "calendar-blank" : "history"} size={60} color="#E0E0E0" />
             <Text style={styles.emptyTitle}>
                {tab === 'upcoming' ? 'Sin planes por ahora' : 'Aún no tienes historial'}
             </Text>
             <Text style={styles.emptySubtitle}>
                {tab === 'upcoming' 
                   ? 'Cuando reserves un servicio, aparecerá aquí.' 
                   : 'Aquí verás el historial de tus servicios finalizados.'}
             </Text>
          </View>
        ) : (
          <View style={styles.list}>
             {activeList.map(renderCard)}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
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
  loadingText: {
    marginTop: 10,
    color: '#999',
  },
  
  // Tabs
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: colors.primary, // #6FCF97
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontWeight: '600',
    color: '#888',
    fontSize: 14,
  },
  tabTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // Card
  list: {
    gap: 16,
  },
  cardContainer: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dateBadge: {
    backgroundColor: '#F6FFF8',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E8F6EF',
  },
  dateDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  dateMonth: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '600',
  },
  headerInfo: {
    flex: 1,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timeText: {
    fontSize: 13,
    color: '#888',
  },
  
  // Status Badge
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginVertical: 12,
  },

  // Card Body
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  petpalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 36,
    height: 36,
  },
  labelSmall: {
    fontSize: 10,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  petpalName: {
    fontSize: 14,
    color: '#444',
    fontWeight: '600',
  },

  // Actions
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  btnSmall: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnSecondary: {
    backgroundColor: '#E8F6EF',
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: '#E74C3C',
    backgroundColor: '#FFF',
  },
  btnText: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
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
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});