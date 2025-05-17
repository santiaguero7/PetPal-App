import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
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
  const [especie, setEspecie] = useState<string | null>(null);
  const [tamano, setTamano] = useState<string | null>(null);
  const [raza, setRaza] = useState<string | null>(null);
  const [edad, setEdad] = useState('');
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
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la mascota"
          value={nombre}
          onChangeText={setNombre}
        />
        <Text style={styles.label}>Especie</Text>
        <ModalSelector
          data={ESPECIES}
          initValue="Selecciona especie"
          onChange={option => setEspecie(option.key as string)}
          style={styles.selector}
          selectStyle={styles.selectorButton}
          selectTextStyle={styles.selectorText}
        >
          <TextInput
            style={styles.input}
            editable={false}
            placeholder="Selecciona especie"
            value={especie || ''}
          />
        </ModalSelector>
        {especie === 'Perro' && (
          <>
            <Text style={styles.label}>Tamaño</Text>
            <ModalSelector
              data={TAMANOS}
              initValue="Selecciona tamaño"
              onChange={option => setTamano(option.key as string)}
              style={styles.selector}
              selectStyle={styles.selectorButton}
              selectTextStyle={styles.selectorText}
            >
              <TextInput
                style={styles.input}
                editable={false}
                placeholder="Selecciona tamaño"
                value={tamano || ''}
              />
            </ModalSelector>
            <Text style={styles.label}>Raza</Text>
            <ModalSelector
              data={RAZAS_PERRO}
              initValue="Selecciona raza"
              onChange={option => setRaza(option.label)}
              style={styles.selector}
              selectStyle={styles.selectorButton}
              selectTextStyle={styles.selectorText}
            >
              <TextInput
                style={styles.input}
                editable={false}
                placeholder="Selecciona raza"
                value={raza || ''}
              />
            </ModalSelector>
          </>
        )}
        {especie === 'Gato' && (
          <>
            <Text style={styles.label}>Raza</Text>
            <ModalSelector
              data={RAZAS_GATO}
              initValue="Selecciona raza"
              onChange={option => setRaza(option.label)}
              style={styles.selector}
              selectStyle={styles.selectorButton}
              selectTextStyle={styles.selectorText}
            >
              <TextInput
                style={styles.input}
                editable={false}
                placeholder="Selecciona raza"
                value={raza || ''}
              />
            </ModalSelector>
          </>
        )}
        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={styles.input}
          placeholder="Edad (en años)"
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
          returnKeyType="done"
        />
        <Button title="Guardar" onPress={handleAddPet} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4, marginBottom: 8, backgroundColor: '#fff' },
  selector: { marginBottom: 8 },
  selectorButton: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, backgroundColor: '#fff' },
  selectorText: { color: '#333', fontSize: 16 },
});