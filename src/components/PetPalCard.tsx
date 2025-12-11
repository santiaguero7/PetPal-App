import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import { commonStyles } from '../themes/commonStyles';

interface PetPalCardProps {
  petpal: any;
  onPressProfile: (id: number) => void;
  onRequest: (id: number, date: Date) => void;
  translateSize: (size: string) => string;
}

const PetPalCard: React.FC<PetPalCardProps> = ({
  petpal,
  onPressProfile,
  onRequest,
  translateSize
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [reservationDate, setReservationDate] = useState(new Date());

  const handleChangeDate = (_: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false); // En Android se cierra solo
    }
    if (date) {
      setReservationDate(date);
    }
  };

  // Función auxiliar para confirmar fecha en Android/iOS
  const confirmDate = () => {
    setShowPicker(false);
    setModalVisible(false); // Cerramos modal también al reservar
    onRequest(petpal.id, reservationDate);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.9}
      >
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          {petpal.profile_picture ? (
            <Image 
              source={{ uri: petpal.profile_picture }} 
              style={styles.avatarImage} 
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Icon name={petpal.pet_type === 'dog' ? 'dog' : 'cat'} size={28} color={colors.primary} />
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>
            {petpal.user?.name || (petpal.service_type === 'dog walker' ? 'Paseador' : 'Cuidador')}
          </Text>
          <Text style={styles.locationText}>
            <Icon name="map-marker-outline" size={14} color={colors.secondary} /> {petpal.location}
          </Text>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            <View style={styles.pillTag}>
              <Text style={styles.pillText}>
                {petpal.price_per_hour
                  ? `$${petpal.price_per_hour}/h`
                  : petpal.price_per_day
                    ? `$${petpal.price_per_day}/día`
                    : 'A convenir'}
              </Text>
            </View>
            <View style={[styles.pillTag, { backgroundColor: '#F0F4F8' }]}>
              <Text style={[styles.pillText, { color: '#555' }]}>
                 {translateSize(petpal.size_accepted)}
              </Text>
            </View>
          </View>
        </View>

        {/* Arrow Indicator */}
        <View style={styles.arrowContainer}>
           <Icon name="chevron-right" size={24} color="#DDD" />
        </View>
      </TouchableOpacity>

      {/* --- MODAL --- */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalCard}>
                
                {/* Close Button X */}
                <TouchableOpacity 
                  style={styles.closeIconBtn} 
                  onPress={() => setModalVisible(false)}
                >
                   <Icon name="close" size={20} color="#888" />
                </TouchableOpacity>

                {/* Header */}
                <View style={styles.modalHeader}>
                   <View style={styles.modalAvatarLarge}>
                      <Icon
                        name={petpal.service_type === 'dog walker' ? 'dog-service' : 'home-heart'}
                        size={40}
                        color="#FFF"
                      />
                   </View>
                   <Text style={styles.modalTitle}>
                      {petpal.service_type === 'dog walker' ? 'Paseador' : 'Cuidador'}
                   </Text>
                   <Text style={styles.modalSubtitle}>{petpal.location}</Text>
                </View>

                {/* Info List */}
                <View style={styles.infoList}>
                  
                  <View style={styles.infoRow}>
                    <View style={styles.iconBox}><Icon name="star-outline" size={20} color={colors.primary} /></View>
                    <Text style={styles.infoText}>
                      {petpal.experience || 'Sin experiencia especificada'}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.iconBox}><Icon name="cash" size={20} color={colors.primary} /></View>
                    <Text style={styles.infoText}>
                      {petpal.price_per_hour
                        ? `$${petpal.price_per_hour} por hora`
                        : petpal.price_per_day
                          ? `$${petpal.price_per_day} por día`
                          : 'Precio a convenir'}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <View style={styles.iconBox}><Icon name="paw" size={20} color={colors.primary} /></View>
                    <Text style={styles.infoText}>
                      Acepta: {petpal.pet_type === 'dog' ? 'Perros' : 'Gatos'} ({translateSize(petpal.size_accepted)})
                    </Text>
                  </View>

                </View>

                {/* Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.modalBtn, styles.btnOutline]}
                    onPress={() => {
                      setModalVisible(false);
                      onPressProfile(petpal.id);
                    }}
                  >
                    <Text style={[styles.modalBtnText, { color: colors.primary }]}>Ver Perfil Completo</Text>
                  </TouchableOpacity>

                  {!showPicker ? (
                    <TouchableOpacity
                      style={[styles.modalBtn, styles.btnPrimary]}
                      onPress={() => setShowPicker(true)}
                    >
                      <Text style={[styles.modalBtnText, { color: '#FFF' }]}>Solicitar Reserva</Text>
                    </TouchableOpacity>
                  ) : (
                    // Date Picker Logic Wrapper
                    <View style={styles.datePickerWrapper}>
                       <Text style={styles.selectDateText}>Selecciona fecha de inicio:</Text>
                       {/* Picker */}
                       <DateTimePicker
                          value={reservationDate}
                          mode="date"
                          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                          onChange={handleChangeDate}
                          minimumDate={new Date()}
                          style={{ height: 120, width: '100%' }}
                        />
                        <TouchableOpacity
                          style={[styles.modalBtn, styles.btnPrimary, { marginTop: 10 }]}
                          onPress={confirmDate}
                        >
                          <Text style={[styles.modalBtnText, { color: '#FFF' }]}>Confirmar Reserva</Text>
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
  // Card Styles
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20, // Más redondeado
    padding: 16,
    // Sombras suaves
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarPlaceholder: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: '#E8F6EF', // Fondo verde claro
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    height: 56,
    width: 56,
    borderRadius: 28,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#777',
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillTag: {
    backgroundColor: '#E8F6EF',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingLeft: 8,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)', // Fondo un poco más oscuro
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    // Sombra interna del modal
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  closeIconBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 10,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  modalAvatarLarge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  infoList: {
    width: '100%',
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#FAFAFA',
    padding: 10,
    borderRadius: 12,
  },
  iconBox: {
    width: 32,
    alignItems: 'center',
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  actionButtons: {
    width: '100%',
    gap: 12,
  },
  modalBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  btnOutline: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  datePickerWrapper: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 10,
  },
  selectDateText: {
    fontSize: 14, 
    color: '#666',
    marginBottom: 5,
    fontWeight: '600'
  }
});

export default PetPalCard;