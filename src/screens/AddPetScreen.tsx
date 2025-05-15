import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'AddPet'>;

export default function AddPetScreen({ navigation }: Props) {
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');

  const handleAddPet = () => {
    // Aquí iría la lógica para guardar la mascota
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agregar Mascota</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la mascota"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Tipo (perro, gato, etc.)"
        value={tipo}
        onChangeText={setTipo}
      />
      <Button title="Guardar" onPress={handleAddPet} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 },
});