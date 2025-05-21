import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';

const upcomingBookings = [
  {
    id: '1',
    service: 'Paseo de perros',
    caretaker: {
      name: 'Sarah Johnson',
      image: null, // Puedes agregar imagen si tienes
    },
    date: '22 Mayo 2025',
    time: '15:00 - 16:00',
    location: 'Tu casa',
    status: 'confirmed',
  },
];

const pastBookings = [
  {
    id: '2',
    service: 'Cuidado de mascotas',
    caretaker: {
      name: 'Michael Chen',
      image: null,
    },
    date: '15 Mayo 2025',
    time: '09:00 - 11:00',
    location: 'Tu casa',
    status: 'completed',
  },
  {
    id: '3',
    service: 'Paseo de perros',
    caretaker: {
      name: 'Emily Rodriguez',
      image: null,
    },
    date: '10 Mayo 2025',
    time: '16:30 - 17:30',
    location: 'Parque local',
    status: 'completed',
  },
];

type Booking = {
  id: string;
  service: string;
  caretaker: { name: string; image: string | null };
  date: string;
  time: string;
  location: string;
  status: string;
};

export default function ServicesScreen() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const renderBookingCard = (booking: Booking) => (
    <View key={booking.id} style={styles.card}>
      <View style={[
        styles.cardBar,
        { backgroundColor: booking.status === 'confirmed' ? '#A78BFA' : '#6FCF97' }
      ]} />
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.caretakerInfo}>
            <View style={styles.avatar}>
              <Icon name="account" size={28} color="#A78BFA" />
            </View>
            <View>
              <Text style={styles.caretakerName}>{booking.caretaker.name}</Text>
              <Text style={styles.serviceName}>{booking.service}</Text>
            </View>
          </View>
          <View>
            <Text style={[
              styles.status,
              booking.status === 'confirmed' ? styles.statusConfirmed : styles.statusCompleted
            ]}>
              {booking.status === 'confirmed' ? 'Confirmado' : 'Completado'}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Icon name="calendar" size={16} color="#A78BFA" style={{ marginRight: 6 }} />
          <Text style={styles.infoText}>{booking.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="clock-outline" size={16} color="#A78BFA" style={{ marginRight: 6 }} />
          <Text style={styles.infoText}>{booking.time}</Text>
        </View>
        <View style={styles.infoRow}>
          <Icon name="map-marker" size={16} color="#A78BFA" style={{ marginRight: 6 }} />
          <Text style={styles.infoText}>{booking.location}</Text>
        </View>
        <View style={styles.actionsRow}>
          {booking.status === 'confirmed' ? (
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

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tus contrataciones</Text>
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'upcoming' && styles.tabBtnActive]}
          onPress={() => setTab('upcoming')}
        >
          <Text style={[styles.tabBtnText, tab === 'upcoming' && styles.tabBtnTextActive]}>Próximas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'past' && styles.tabBtnActive]}
          onPress={() => setTab('past')}
        >
          <Text style={[styles.tabBtnText, tab === 'past' && styles.tabBtnTextActive]}>Pasadas</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: 18 }}>
        {tab === 'upcoming' ? (
          upcomingBookings.length > 0 ? (
            upcomingBookings.map(renderBookingCard)
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No tienes contrataciones próximas</Text>
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Buscar cuidadores</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          pastBookings.length > 0 ? (
            pastBookings.map(renderBookingCard)
          ) : (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>No tienes contrataciones pasadas</Text>
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6FFF8', padding: 18 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#22223B', marginBottom: 18 },
  tabsRow: { flexDirection: 'row', backgroundColor: '#D1FADF', borderRadius: 20, marginBottom: 10, overflow: 'hidden' }, // verde pastel claro
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabBtnActive: { backgroundColor: '#6FCF97' }, // verde pastel fuerte
  tabBtnText: { color: '#219653', fontWeight: 'bold' },
  tabBtnTextActive: { color: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 14, marginBottom: 16, overflow: 'hidden', elevation: 2 },
  cardBar: { height: 6, width: '100%' },
  cardContent: { padding: 14 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  caretakerInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { height: 40, width: 40, borderRadius: 20, backgroundColor: '#E8F6EF', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  caretakerName: { fontWeight: 'bold', color: '#22223B', fontSize: 16 },
  serviceName: { color: '#6FCF97', fontSize: 13 },
  status: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, overflow: 'hidden', textAlign: 'center' },
  statusConfirmed: { backgroundColor: '#D1FADF', color: '#219653' }, // verde pastel para confirmado
  statusCompleted: { backgroundColor: '#E8F6EF', color: '#6FCF97' }, // verde pastel claro para completado
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2, marginTop: 2 },
  infoText: { color: '#22223B', fontSize: 13 },
  actionsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 8 },
  actionBtn: { backgroundColor: '#6FCF97', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18 }, // verde pastel
  actionBtnText: { color: '#fff', fontWeight: 'bold' },
  actionBtnOutline: { borderWidth: 1, borderColor: '#6FCF97', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 18, backgroundColor: '#fff' }, // borde verde pastel
  actionBtnOutlineText: { color: '#219653', fontWeight: 'bold' },
  emptyBox: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#888', marginBottom: 16 },
});