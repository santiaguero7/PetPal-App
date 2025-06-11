import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Keyboard, StyleSheet, FlatList, ScrollView } from 'react-native';
import { colors } from '../themes/colors';

const serviceTypes = [
  { label: 'Paseador', value: 'dog walker' },
  { label: 'Cuidador', value: 'caregiver' },
];

const petTypes = [
  { label: 'Perro', value: 'dog' },
  { label: 'Gato', value: 'cat' },
];

const sizes = [
  { label: 'Chico', value: 'small' },
  { label: 'Mediano', value: 'medium' },
  { label: 'Grande', value: 'large' },
  { label: 'Todos', value: 'all' },
];

type Props = {
  initialValues?: any;
  onSubmit: (values: any) => void;
  submitText?: string;
  styles?: any;
};

export default function PetPalPostForm({
  initialValues = {},
  onSubmit,
  submitText = 'Publicar',
  styles = defaultStyles,
}: Props) {
  // Referencias para inputs
  const experienceRef = useRef<TextInput>(null) as React.RefObject<TextInput>;
  const locationRef = useRef<TextInput>(null) as React.RefObject<TextInput>;
  const priceHourRef = useRef<TextInput>(null) as React.RefObject<TextInput>;
  const priceDayRef = useRef<TextInput>(null) as React.RefObject<TextInput>;

  const [service_type, setServiceType] = useState(initialValues.service_type || 'dog walker');
  const [modalService, setModalService] = useState(false);

  const [price_per_hour, setPricePerHour] = useState(initialValues.price_per_hour?.toString() || '');
  const [price_per_day, setPricePerDay] = useState(initialValues.price_per_day?.toString() || '');
  const [experience, setExperience] = useState(initialValues.experience || '');
  const [location, setLocation] = useState(initialValues.location || '');

  const [pet_type, setPetType] = useState(initialValues.pet_type || 'dog');
  const [modalPetType, setModalPetType] = useState(false);

  const [size_accepted, setSizeAccepted] = useState(initialValues.size_accepted || 'medium');
  const [modalSize, setModalSize] = useState(false);

  // Para avanzar automáticamente al siguiente input
  const focusNext = (ref: React.RefObject<TextInput>) => {
    ref.current?.focus();
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 10 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View>
        {/* Tipo de servicio */}
        <Text style={styles.label}>Tipo de servicio</Text>
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => setModalService(true)}
          activeOpacity={0.7}
        >
          <Text style={{ color: '#22223B' }}>
            {serviceTypes.find((t) => t.value === service_type)?.label || 'Seleccionar'}
          </Text>
        </TouchableOpacity>
        <Modal visible={modalService} transparent animationType="fade">
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center' }}
            activeOpacity={1}
            onPressOut={() => setModalService(false)}
          >
            <View style={modalStyles.modalBox}>
              <View style={modalStyles.modalBar} />
              {serviceTypes.map((item) => (
                <TouchableOpacity key={item.value} onPress={() => { setServiceType(item.value); setModalService(false); }}>
                  <Text style={modalStyles.modalOption}>{item.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setModalService(false)}>
                <Text style={modalStyles.modalCancel}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Tipo de mascota */}
        <Text style={styles.label}>Tipo de mascota</Text>
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => setModalPetType(true)}
          activeOpacity={0.7}
        >
          <Text style={{ color: '#22223B' }}>
            {petTypes.find((t) => t.value === pet_type)?.label || 'Seleccionar'}
          </Text>
        </TouchableOpacity>
        <Modal visible={modalPetType} transparent animationType="fade">
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center' }}
            activeOpacity={1}
            onPressOut={() => setModalPetType(false)}
          >
            <View style={modalStyles.modalBox}>
              <View style={modalStyles.modalBar} />
              {petTypes.map((item) => (
                <TouchableOpacity key={item.value} onPress={() => { setPetType(item.value as 'dog' | 'cat'); setModalPetType(false); }}>
                  <Text style={modalStyles.modalOption}>{item.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setModalPetType(false)}>
                <Text style={modalStyles.modalCancel}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Tamaño aceptado */}
        <Text style={styles.label}>Tamaño aceptado</Text>
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center' }]}
          onPress={() => setModalSize(true)}
          activeOpacity={0.7}
        >
          <Text style={{ color: '#22223B' }}>
            {sizes.find((s) => s.value === size_accepted)?.label || 'Seleccionar'}
          </Text>
        </TouchableOpacity>
        <Modal visible={modalSize} transparent animationType="fade">
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center' }}
            activeOpacity={1}
            onPressOut={() => setModalSize(false)}
          >
            <View style={modalStyles.modalBox}>
              <View style={modalStyles.modalBar} />
              <FlatList
                data={sizes}
                keyExtractor={(item) => item.value}
                style={{ alignSelf: 'stretch' }}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => { setSizeAccepted(item.value); setModalSize(false); }}>
                    <Text style={modalStyles.modalOption}>{item.label}</Text>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator
              />
              <TouchableOpacity onPress={() => setModalSize(false)}>
                <Text style={modalStyles.modalCancel}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>

        {/* Experiencia */}
        <Text style={styles.label}>Experiencia</Text>
        <TextInput
          ref={experienceRef}
          style={styles.input}
        
          value={experience}
          onChangeText={setExperience}
          placeholder="Ej: 2 años paseando perros grandes y medianos"
          returnKeyType="next"
          onSubmitEditing={() => focusNext(locationRef)}
          blurOnSubmit={false}
        />

        {/* Zona */}
        <Text style={styles.label}>Zona</Text>
        <TextInput
          ref={locationRef}
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Ej: Nueva Córdoba"
          returnKeyType="next"
          onSubmitEditing={() => focusNext(priceHourRef)}
          blurOnSubmit={false}
        />

        {/* Precio por hora */}
        <Text style={styles.label}>Precio por hora</Text>
        <TextInput
          ref={priceHourRef}
          style={styles.input}
          value={price_per_hour}
          onChangeText={setPricePerHour}
          keyboardType="numeric"
          placeholder="Ej: 15"
          returnKeyType="next"
          onSubmitEditing={() => focusNext(priceDayRef)}
          blurOnSubmit={false}
        />

        {/* Precio por día */}
        <Text style={styles.label}>Precio por día</Text>
        <TextInput
          ref={priceDayRef}
          style={styles.input}
          value={price_per_day}
          onChangeText={setPricePerDay}
          keyboardType="numeric"
          placeholder="Ej: 100"
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
          blurOnSubmit={true}
        />

        {/* Botón */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => onSubmit({
            service_type,
            price_per_hour: price_per_hour ? Number(price_per_hour) : null,
            price_per_day: price_per_day ? Number(price_per_day) : null,
            experience,
            location,
            pet_type,
            size_accepted,
          })}
        >
          <Text style={styles.buttonText}>{submitText}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const defaultStyles = StyleSheet.create({
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 4, color: '#22223B' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    color: '#22223B',
    borderWidth: 1,
    borderColor: '#6FCF97'
  },
  button: {
    backgroundColor: '#6FCF97',
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

const modalStyles = StyleSheet.create({
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    width: 250,
    maxHeight: 350,
    borderWidth: 2,
    borderColor: '#219653',
    alignItems: 'center',
  },
  modalBar: {
    width: 40,
    height: 5,
    backgroundColor: '#219653',
    borderRadius: 3,
    marginBottom: 16,
    opacity: 0.5,
  },
  modalOption: {
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
  },
  modalCancel: {
    color: '#219653',
    textAlign: 'right',
    marginTop: 10,
  },
});