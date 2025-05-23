import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import PetForm from '../components/PetForm';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { usePets } from '../context/PetsContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPet'>;

const RAZAS_PERRO = [
  { key: 0, label: 'Sin especificar' },
  { key: 1, label: 'Labrador' },
  { key: 2, label: 'Golden Retriever' },
  { key: 3, label: 'Bulldog' },
  { key: 4, label: 'Caniche' },
  { key: 5, label: 'Beagle' },
  { key: 6, label: 'Pastor Alemán' },
  { key: 7, label: 'Dálmata' },
  { key: 8, label: 'Boxer' },
  { key: 9, label: 'Schnauzer' },
  { key: 10, label: 'Otro' }
];

const RAZAS_GATO = [
  { key: 0, label: 'Sin especificar' },
  { key: 1, label: 'Persa' },
  { key: 2, label: 'Siamés' },
  { key: 3, label: 'Maine Coon' },
  { key: 4, label: 'Bengala' },
  { key: 5, label: 'Siberiano' },
  { key: 6, label: 'Ragdoll' },
  { key: 7, label: 'British Shorthair' },
  { key: 8, label: 'Sphynx' },
  { key: 9, label: 'Abisinio' },
  { key: 10, label: 'Otro' }
];

const ESPECIES = [
  { key: 'Perro', label: 'Perro' },
  { key: 'Gato', label: 'Gato' },
  { key: 'Otro', label: 'Otro' }
];

const TAMANOS = [
  { key: 'chica', label: 'Chica' },
  { key: 'mediana', label: 'Mediana' },
  { key: 'grande', label: 'Grande' }
];

export default function AddPetScreen({ navigation }: Props) {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState<string>('');
  const [tamano, setTamano] = useState<'chica' | 'mediana' | 'grande'>('mediana');
  const [raza, setRaza] = useState<string>('');
  const [edad, setEdad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const { addPet } = usePets();

  const handleAddPet = () => {
    if (
      nombre.trim() &&
      especie &&
      edad.trim() &&
      (especie !== 'Perro' || (tamano && raza))
    ) {
      addPet({
        nombre,
        especie,
        tamano: especie === 'Perro' ? tamano : 'mediana',
        raza: especie === 'Perro' ? (raza || '') : '',
        edad,
      });
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Completa todos los campos');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
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
          nombre={nombre} setNombre={setNombre}
          especie={especie} setEspecie={setEspecie}
          tamano={tamano}
          setTamano={setTamano}
          raza={raza} setRaza={setRaza}
          edad={edad} setEdad={setEdad}
          descripcion={descripcion}
          setDescripcion={setDescripcion}
          ESPECIES={ESPECIES}
          TAMANOS={TAMANOS}
          RAZAS_PERRO={RAZAS_PERRO}
          RAZAS_GATO={RAZAS_GATO}
          styles={styles}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddPet}>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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