import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { usePets } from '../context/PetsContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPet'>;

const RAZAS = [
  'Sin especificar', 'Labrador', 'Golden Retriever', 'Bulldog', 'Caniche', 'Beagle', 'Pastor Alemán', 'Dálmata', 'Boxer', 'Schnauzer', 'Otro'
];

export default function AddPetScreen({ navigation }: Props) {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [tamano, setTamano] = useState<'chica' | 'mediana' | 'grande'>('mediana');
  const [raza, setRaza] = useState(RAZAS[0]);
  const [edad, setEdad] = useState('');
  const [color, setColor] = useState('');
  const { addPet } = usePets();

  const handleAddPet = () => {
    if (nombre.trim() && especie.trim() && raza && tamano && edad.trim() && color.trim()) {
      addPet({ nombre, especie, tamano, raza, edad, color });
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
        <TextInput
          style={styles.input}
          placeholder="Nombre de la mascota"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Especie (perro, gato, etc.)"
          value={especie}
          onChangeText={setEspecie}
        />
        <Text style={styles.label}>Tamaño</Text>
        <Picker
          selectedValue={tamano}
          onValueChange={itemValue => setTamano(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Chica" value="chica" />
          <Picker.Item label="Mediana" value="mediana" />
          <Picker.Item label="Grande" value="grande" />
        </Picker>
        <Text style={styles.label}>Raza</Text>
        <Picker
          selectedValue={raza}
          onValueChange={itemValue => setRaza(itemValue)}
          style={styles.picker}
        >
          {RAZAS.map(r => (
            <Picker.Item key={r} label={r} value={r} />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Edad (en años)"
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
        <TextInput
          style={styles.input}
          placeholder="Color"
          value={color}
          onChangeText={setColor}
        />
        <Button title="Guardar" onPress={handleAddPet} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  label: { fontWeight: 'bold', marginTop: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 },
  picker: { height: 40, marginBottom: 12, backgroundColor: '#f9f9f9' }, // Nuevo estilo solo para Picker
});