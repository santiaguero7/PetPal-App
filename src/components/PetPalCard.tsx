import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import { PetpalAd } from '../types/interfaces';
// Asegúrate de tener este servicio creado como lo definimos antes
import { getPetPalSchedule, getDaySlots, Schedule, TimeSlot } from '../services/availability';

// --- DICCIONARIOS VISUALES ---
const SERVICE_LABELS: Record<string, string> = { 'dog walker': 'Paseador', 'caregiver': 'Cuidador' };
const SIZE_LABELS: Record<string, string> = { small: 'Pequeños', medium: 'Medianos', large: 'Grandes', all: 'Todos los tamaños' };
const DAYS_MAP = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

interface PetPalCardProps {
  petpal: PetpalAd;
  onPressProfile: (id: number) => void;
  onRequest: (id: number, date: Date) => void;
}

const PetPalCard: React.FC<PetPalCardProps> = ({ petpal, onPressProfile, onRequest }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showBooking, setShowBooking] = useState(false); // Antes showPicker
  
  // Estados para la Grilla de Horarios
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isWorkingDay, setIsWorkingDay] = useState(true);

  // Estados para información general (Agenda semanal)
  const [weeklySchedule, setWeeklySchedule] = useState<Schedule[]>([]);
  const [loadingWeekly, setLoadingWeekly] = useState(false);

  // Helpers
  const displayTitle = petpal.title && petpal.title !== 'Mi Servicio' 
    ? petpal.title 
    : `${SERVICE_LABELS[petpal.service_type] || 'Servicio'} en ${petpal.location}`;
  
  const sizeLabel = SIZE_LABELS[petpal.size_accepted] || petpal.size_accepted;

  // 1. Cargar agenda general al abrir modal
  useEffect(() => {
    if (modalVisible) {
      setLoadingWeekly(true);
      getPetPalSchedule(petpal.user_id)
        .then(data => setWeeklySchedule(data))
        .catch(err => console.error("Error loading schedule", err))
        .finally(() => setLoadingWeekly(false));
      
      // También cargamos los slots de "hoy" por defecto
      loadSlotsForDate(new Date());
    }
  }, [modalVisible, petpal.user_id]);

  // 2. Función para cargar slots de un día específico
  const loadSlotsForDate = async (date: Date) => {
    setLoadingSlots(true);
    setSelectedTime(null); // Reseteamos selección
    try {
      const dateStr = date.toISOString().split('T')[0];
      const data = await getDaySlots(petpal.user_id, dateStr);
      setIsWorkingDay(data.working);
      setSlots(data.slots);
    } catch (error) {
      console.error("Error loading slots:", error);
      setIsWorkingDay(false);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleDateChange = (_: any, date?: Date) => {
    // En Android el picker se cierra al seleccionar
    // En iOS se mantiene abierto, así que no cambiamos showBooking
    if (date) {
      setSelectedDate(date);
      loadSlotsForDate(date);
    }
  };

  const handleConfirm = () => {
    if (!selectedTime) return;
    
    // Construir la fecha final combinando el día seleccionado + la hora del slot
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const finalDate = new Date(selectedDate);
    finalDate.setHours(hours, minutes, 0, 0);

    setModalVisible(false);
    setShowBooking(false);
    onRequest(petpal.id, finalDate);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.cardContainer} 
        onPress={() => setModalVisible(true)} 
        activeOpacity={0.95}
      >
        <View style={styles.leftColumn}>
          <View style={styles.avatarContainer}>
            {petpal.profile_picture ? (
              <Image source={{ uri: petpal.profile_picture }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: petpal.pet_type === 'dog' ? '#E3F2FD' : '#F3E5F5' }]}>
                <Icon name={petpal.pet_type === 'dog' ? 'dog' : 'cat'} size={26} color={petpal.pet_type === 'dog' ? '#1976D2' : '#8E24AA'} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.serviceTitle} numberOfLines={1}>{displayTitle}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.userName} numberOfLines={1}>por {petpal.user_name || 'PetPal'}</Text>
            <Icon name="star" size={12} color="#FFC107" style={{ marginLeft: 6 }} />
            <Text style={styles.ratingText}>5.0</Text>
          </View>
          <View style={styles.locationRow}>
            <Icon name="map-marker-radius-outline" size={14} color={colors.secondary} />
            <Text style={styles.locationText} numberOfLines={1}>
               {petpal.location}
               {petpal.distance !== undefined && <Text style={styles.distanceText}> • a {petpal.distance.toFixed(1)} km</Text>}
            </Text>
          </View>
          <View style={styles.tagsRow}>
            <View style={[styles.pill, styles.pricePill]}>
              <Text style={styles.priceText}>
                {petpal.price_per_hour ? `$${petpal.price_per_hour}/h` : petpal.price_per_day ? `$${petpal.price_per_day}/día` : 'Consultar'}
              </Text>
            </View>
            <View style={[styles.pill, styles.sizePill]}>
              <Text style={styles.sizeText}>{sizeLabel}</Text>
            </View>
          </View>
        </View>
        <View style={styles.arrowContainer}><Icon name="chevron-right" size={24} color="#E0E0E0" /></View>
      </TouchableOpacity>

      {/* --- MODAL DETALLE Y RESERVA --- */}
      <Modal visible={modalVisible} animationType="fade" transparent onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalCard}>
                <TouchableOpacity style={styles.closeIconBtn} onPress={() => setModalVisible(false)}>
                   <Icon name="close" size={22} color="#555" />
                </TouchableOpacity>

                <View style={styles.modalHeader}>
                   <View style={[styles.modalIconCircle, { backgroundColor: petpal.service_type === 'dog walker' ? '#E8F6EF' : '#F3E5F5' }]}>
                      <Icon name={petpal.service_type === 'dog walker' ? 'dog-service' : 'home-heart'} size={36} color={petpal.service_type === 'dog walker' ? colors.primary : '#8E24AA'} />
                   </View>
                   <Text style={styles.modalTitle}>{displayTitle}</Text>
                   <Text style={styles.modalSubtitle}>Servicio profesional de {petpal.user_name}</Text>
                </View>

                {/* VISUALIZADOR DE HORARIOS SEMANAL (Solo informativo) */}
                {!showBooking && (
                  <View style={styles.scheduleContainer}>
                    <Text style={styles.scheduleTitle}>Horarios Habituales</Text>
                    {loadingWeekly ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : weeklySchedule.length > 0 ? (
                      <View style={styles.daysRow}>
                        {weeklySchedule.map((s, i) => (
                          <View key={i} style={styles.dayBadge}>
                            <Text style={styles.dayText}>{DAYS_MAP[s.day_of_week]}</Text>
                            <Text style={styles.hoursText}>{s.start_time.slice(0,5)}</Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.infoText}>Disponibilidad flexible. ¡Coordina tu reserva!</Text>
                    )}
                  </View>
                )}

                {/* ÁREA DE ACCIÓN */}
                <View style={styles.footerActions}>
                  {!showBooking ? (
                    <TouchableOpacity 
                      style={styles.btnMain} 
                      activeOpacity={0.8} 
                      onPress={() => setShowBooking(true)}
                    >
                      <Text style={styles.btnMainText}>Solicitar Reserva</Text>
                      <Icon name="calendar-cursor" size={20} color="#FFF" />
                    </TouchableOpacity>
                  ) : (
                    // --- ZONA DE BOOKING INTERACTIVO ---
                    <View style={styles.bookingWrapper}>
                       <View style={styles.pickerHeader}>
                          <Text style={styles.pickerLabel}>1. Elige el día</Text>
                          {/* Picker de FECHA (No hora) */}
                          <View style={{ height: 40, width: 120, marginLeft: 10 }}>
                             <DateTimePicker
                                value={selectedDate}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                                minimumDate={new Date()}
                                locale="es-ES"
                                accentColor={colors.primary}
                              />
                          </View>
                       </View>

                       <Text style={[styles.pickerLabel, { marginTop: 10, marginBottom: 8 }]}>2. Elige un horario disponible</Text>
                       
                       {/* GRILLA DE SLOTS */}
                       <View style={styles.slotsContainer}>
                          {loadingSlots ? (
                             <ActivityIndicator color={colors.primary} style={{ margin: 20 }} />
                          ) : !isWorkingDay ? (
                             <View style={styles.dayClosedContainer}>
                                <Icon name="store-off" size={24} color="#E74C3C" />
                                <Text style={styles.dayClosedText}>No trabaja este día</Text>
                             </View>
                          ) : slots.length === 0 ? (
                             <Text style={styles.infoText}>No quedan turnos disponibles hoy.</Text>
                          ) : (
                             <View style={styles.slotsGrid}>
                                {slots.map((slot, idx) => (
                                   <TouchableOpacity
                                      key={idx}
                                      disabled={slot.status === 'busy'}
                                      onPress={() => setSelectedTime(slot.time)}
                                      style={[
                                         styles.slotChip,
                                         slot.status === 'busy' ? styles.slotBusy : styles.slotFree,
                                         selectedTime === slot.time && styles.slotSelected
                                      ]}
                                   >
                                      <Text style={[
                                         styles.slotText,
                                         slot.status === 'busy' && styles.slotTextBusy,
                                         selectedTime === slot.time && styles.slotTextSelected
                                      ]}>
                                         {slot.time}
                                      </Text>
                                   </TouchableOpacity>
                                ))}
                             </View>
                          )}
                       </View>

                       <TouchableOpacity 
                          style={[styles.btnConfirm, !selectedTime && styles.btnDisabled]} 
                          onPress={handleConfirm}
                          disabled={!selectedTime}
                        >
                          <Text style={styles.btnMainText}>
                            {selectedTime ? `Confirmar ${selectedTime}` : 'Selecciona una hora'}
                          </Text>
                        </TouchableOpacity>
                    </View>
                  )}
                </View>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  // ... CARD STYLES (Conservamos los mismos de antes) ...
  cardContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 24, padding: 14, marginBottom: 14, shadowColor: '#6FCF97', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 4, borderWidth: 1, borderColor: '#F5F5F5' },
  leftColumn: { marginRight: 14 },
  avatarContainer: { position: 'relative' },
  avatarPlaceholder: { height: 60, width: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  avatarImage: { height: 60, width: 60, borderRadius: 30, borderWidth: 2, borderColor: '#F0F0F0' },
  cardContent: { flex: 1, justifyContent: 'center' },
  serviceTitle: { fontSize: 16, fontWeight: '800', color: '#22223B', marginBottom: 2, letterSpacing: 0.3 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  userName: { fontSize: 12, color: '#666', fontWeight: '500' },
  ratingText: { fontSize: 11, fontWeight: '700', color: '#444', marginLeft: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  locationText: { fontSize: 12, color: '#888', marginLeft: 4, flex: 1 },
  distanceText: { color: colors.secondary, fontWeight: '700' },
  tagsRow: { flexDirection: 'row', gap: 8 },
  pill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' },
  pricePill: { backgroundColor: '#E8F6EF' },
  priceText: { color: colors.primary, fontSize: 11, fontWeight: '700' },
  sizePill: { backgroundColor: '#F0F4F8' },
  sizeText: { color: '#555', fontSize: 11, fontWeight: '600' },
  arrowContainer: { paddingLeft: 5 },

  // ... MODAL BASE ...
  modalOverlay: { flex: 1, backgroundColor: 'rgba(34, 34, 59, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 28, padding: 24, width: '100%', alignItems: 'center', elevation: 10 },
  closeIconBtn: { position: 'absolute', top: 20, right: 20, zIndex: 10, backgroundColor: '#F5F5F5', padding: 8, borderRadius: 50 },
  modalHeader: { alignItems: 'center', marginBottom: 20, marginTop: 10, width: '100%' },
  modalIconCircle: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#22223B', textAlign: 'center', marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: '#888', fontWeight: '500' },

  // ... INFO SEMANAL ...
  scheduleContainer: { marginTop: 10, width: '100%', alignItems: 'center', padding: 12, backgroundColor: '#FAFAFA', borderRadius: 16 },
  scheduleTitle: { fontSize: 12, fontWeight: '700', color: '#999', marginBottom: 10, textTransform: 'uppercase' },
  daysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  dayBadge: { alignItems: 'center', backgroundColor: '#FFF', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, borderWidth: 1, borderColor: '#EEE' },
  dayText: { fontSize: 12, fontWeight: 'bold', color: colors.primary },
  hoursText: { fontSize: 10, color: '#666' },
  infoText: { fontSize: 13, color: '#666', fontStyle: 'italic', textAlign: 'center' },

  // ... BOOKING INTERACTIVO ...
  footerActions: { width: '100%', marginTop: 10 },
  btnMain: { backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 20, shadowColor: colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5, gap: 8 },
  btnMainText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },

  bookingWrapper: {
    width: '100%',
    backgroundColor: '#F8F9FA',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pickerLabel: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#444' 
  },
  
  // GRILLA DE SLOTS
  slotsContainer: {
    minHeight: 80,
    justifyContent: 'center',
    marginBottom: 16,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start', // Alinear a la izquierda para lectura natural
  },
  slotChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 70,
    alignItems: 'center',
  },
  // ESTADOS DE SLOT
  slotFree: {
    backgroundColor: '#FFF',
    borderColor: colors.primary,
  },
  slotBusy: {
    backgroundColor: '#FFEBEE', // Rojo suave
    borderColor: '#FFCDD2',
    opacity: 0.5,
  },
  slotSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    transform: [{ scale: 1.05 }], // Pequeño pop visual
  },
  // TEXTOS DE SLOT
  slotText: { 
    color: colors.primary, 
    fontWeight: 'bold', 
    fontSize: 13 
  },
  slotTextBusy: { 
    color: '#E53935', 
    textDecorationLine: 'line-through' 
  },
  slotTextSelected: { 
    color: '#FFF' 
  },
  
  dayClosedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 20,
  },
  dayClosedText: {
    color: '#E74C3C',
    fontWeight: 'bold',
  },

  btnConfirm: { 
    backgroundColor: colors.secondary, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 14, 
    borderRadius: 16, 
    width: '100%',
  },
  btnDisabled: { 
    backgroundColor: '#CFD8DC' 
  },
});

export default PetPalCard;