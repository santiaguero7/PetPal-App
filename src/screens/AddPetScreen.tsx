import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import PetForm from '../components/PetForm';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { usePets } from '../context/PetsContext';


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
  const [especie, setEspecie] = useState<string>(''); // NO null
  const [tamano, setTamano] = useState<'chica' | 'mediana' | 'grande'>('mediana');
  const [raza, setRaza] = useState<string>(''); // en vez de string | null
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
        tamano: especie === 'Perro' ? (tamano as 'chica' | 'mediana' | 'grande') : 'mediana',
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
        <Text style={styles.title}>Agregar Mascota</Text>
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
        <Button title="Guardar" onPress={handleAddPet} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F6FC', justifyContent: 'center', padding: 16 },
  title: { fontSize: 32, color: '#6EC1E4', fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 4, color: '#22223B' },
  input: { 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 8, 
    fontSize: 16, 
    color: '#22223B', 
    borderWidth: 1, 
    borderColor: '#6EC1E4' 
  },
  button: { 
    backgroundColor: '#6EC1E4', 
    borderRadius: 8, 
    padding: 12, 
    marginVertical: 8, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginLeft: 8 },
  fotoPicker: { alignItems: 'center', marginVertical: 16 },
  fotoMascota: { width: 100, height: 100, borderRadius: 50, marginBottom: 8 },
  fotoText: { color: '#6EC1E4', fontWeight: 'bold' },
  selector: { marginBottom: 8 },
  selectorButton: { borderWidth: 1, borderColor: '#6EC1E4', borderRadius: 4, backgroundColor: '#fff' },
  selectorText: { color: '#22223B', fontSize: 16 },
});