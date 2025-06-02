import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native';
import PetForm from '../components/PetForm';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createPet } from '../services/pets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function AddPetScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'AddPet'>) {
  const [formValues, setFormValues] = useState<{
    name: string;
    pet_type: 'dog' | 'cat';
    weight: number | null; // 👈 este tipo es importante
    breed: string;
    age: number;
    descripcion?: string;
  }>({
    name: '',
    pet_type: 'dog',
    weight: null,
    breed: '',
    age: 0,
    descripcion: '',
  });


  const handleSubmit = async () => {
    const { name, breed, age, pet_type, weight, descripcion } = formValues;
    if (!name || !breed || !age || !pet_type) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }

    try {
      await createPet({
        name,
        breed,
        age,
        pet_type,
        weight,
        description: descripcion,
      });
      Alert.alert('Mascota agregada');
      navigation.goBack();
    } catch (error) {
      console.error('Error al crear mascota:', error);
      Alert.alert('Error', 'No se pudo crear la mascota');
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#F6FFF8' }}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 20}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow-left" size={26} color="#219653" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agregar Mascota</Text>
        <View style={{ width: 26 }} />
      </View>

      <PetForm
        name={formValues.name}
        setNombre={(v) => setFormValues({ ...formValues, name: v })}
        pet_type={formValues.pet_type}
        setPetType={(v) => setFormValues({ ...formValues, pet_type: v })}
        weight={formValues.weight}
        setPeso={(v) => setFormValues({ ...formValues, weight: parseFloat(v) || null })}
        breed={formValues.breed}
        setRaza={(v) => setFormValues({ ...formValues, breed: v })}
        age={formValues.age}
        setEdad={(v) => setFormValues({ ...formValues, age: parseInt(v) || 0 })}
        descripcion={formValues.descripcion}
        setDescripcion={(v) => setFormValues({ ...formValues, descripcion: v })}
        styles={styles}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F6FFF8', justifyContent: 'center', padding: 18 },
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
    marginBottom: 24
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    color: '#219653',
    fontWeight: 'bold',
  },
});