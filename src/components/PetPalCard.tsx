import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
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
    if (date) setReservationDate(date); // no cerrar aún
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.caretakerCard, styles.caretakerCardBorder]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.avatarCircle}>
          <Icon name={petpal.pet_type === 'dog' ? 'dog' : 'cat'} size={32} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={commonStyles.caretakerName}>
            {petpal.service_type === 'dog walker' ? 'Paseador' : 'Cuidador'} en{' '}
            <Text style={{ color: colors.secondary }}>{petpal.location}</Text>
          </Text>
          <View style={styles.caretakerTagsRow}>
            <View style={styles.caretakerTag}>
              <Icon name="cash" size={14} color={colors.primary} />
              <Text style={styles.caretakerTagText}>
                {petpal.price_per_hour
                  ? `$${petpal.price_per_hour}/h`
                  : petpal.price_per_day
                    ? `$${petpal.price_per_day}/día`
                    : 'Precio no especificado'}
              </Text>
            </View>
            <View style={styles.caretakerTag}>
              <Icon name={petpal.pet_type === 'dog' ? 'dog' : 'cat'} size={14} color={colors.primary} />
              <Text style={styles.caretakerTagText}>
                {petpal.pet_type === 'dog' ? 'Perros' : 'Gatos'}
              </Text>
            </View>
            <View style={styles.caretakerTag}>
              <Icon name="ruler" size={14} color={colors.primary} />
              <Text style={styles.caretakerTagText}>
                {translateSize(petpal.size_accepted)}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Text style={[commonStyles.modalTitle, { textAlign: 'center' }]}>
                  {petpal.service_type === 'dog walker' ? 'Paseador' : 'Cuidador'} en {petpal.location}
                </Text>

                <View style={styles.infoCenter}>
                  <Icon
                    name={petpal.pet_type === 'dog' ? 'dog' : 'cat'}
                    size={54}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.modalInfoBlock}>
                  <View style={styles.modalInfoRow}>
                    <Icon name="star" size={18} color="#FFD700" />
                    <Text style={styles.modalInfoText}>
                      {petpal.experience || 'Sin experiencia especificada'}
                    </Text>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <Icon name="cash" size={18} color={colors.primary} />
                    <Text style={styles.modalInfoText}>
                      {petpal.price_per_hour
                        ? `$${petpal.price_per_hour}/h`
                        : petpal.price_per_day
                          ? `$${petpal.price_per_day}/día`
                          : 'Precio no especificado'}
                    </Text>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <Icon
                      name={petpal.pet_type === 'dog' ? 'dog' : 'cat'}
                      size={18}
                      color={colors.primary}
                    />
                    <Text style={styles.modalInfoText}>
                      {petpal.pet_type === 'dog' ? 'Perros' : 'Gatos'}
                    </Text>
                  </View>
                  <View style={styles.modalInfoRow}>
                    <Icon name="ruler" size={18} color={colors.primary} />
                    <Text style={styles.modalInfoText}>
                      {translateSize(petpal.size_accepted)}
                    </Text>
                  </View>
                </View>

                <View style={{ width: '100%' }}>
                  <TouchableOpacity
                    style={[commonStyles.button, styles.fullWidthButton]}
                    onPress={() => {
                      setModalVisible(false);
                      onPressProfile(petpal.id);
                    }}
                  >
                    <Text style={commonStyles.buttonText}>Ver perfil</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      commonStyles.button,
                      styles.fullWidthButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() => setShowPicker(true)}
                  >
                    <Text style={commonStyles.buttonText}>Solicitar reserva</Text>
                  </TouchableOpacity>

                  {showPicker && (
                    <View style={styles.pickerContainer}>
                      <DateTimePicker
                        value={reservationDate}
                        mode="date"
                        onChange={handleChangeDate}
                        minimumDate={new Date()}
                      />
                      <TouchableOpacity
                        style={[commonStyles.button, styles.fullWidthButton, { backgroundColor: colors.primary }]}
                        onPress={() => {
                          setShowPicker(false);
                          onRequest(petpal.id, reservationDate);
                        }}
                      >
                        <Text style={commonStyles.buttonText}>Aceptar fecha</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  <TouchableOpacity
                    style={[
                      commonStyles.button,
                      styles.fullWidthButton,
                      { backgroundColor: '#e53935' },
                    ]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={commonStyles.buttonText}>Cerrar</Text>
                  </TouchableOpacity>
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
  caretakerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  caretakerCardBorder: {
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  avatarCircle: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: '#E8F6EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  caretakerTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
    marginBottom: 2
  },
  caretakerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6FFF8',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  caretakerTagText: {
    color: '#219653',
    fontSize: 13,
    marginLeft: 4
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCenter: {
    alignItems: 'center',
    marginVertical: 16,
  },
 modalInfoBlock: {
  width: '100%',
  marginBottom: 10,
  marginTop: 4,
  marginRight: 17,
},
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  modalInfoText: {
    color: '#219653',
    fontSize: 15,
    marginLeft: 8,
    flex: 1,
    textAlign: 'left',
  },
  fullWidthButton: {
    width: '100%',
    marginTop: 10,
  },
  pickerContainer: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PetPalCard;