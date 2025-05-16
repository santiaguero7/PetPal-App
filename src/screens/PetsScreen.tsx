import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, Modal, TextInput, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { usePets } from '../context/PetsContext';

const RAZAS = [
  'Sin especificar', 'Labrador', 'Golden Retriever', 'Bulldog', 'Caniche', 'Beagle', 'Pastor Alemán', 'Dálmata', 'Boxer', 'Schnauzer', 'Otro'
];

type Props = NativeStackScreenProps<RootStackParamList, 'Pets'>;

export default function PetsScreen({ navigation }: Props) {
  const { pets, removePet, editPet } = usePets();
  const [editModal, setEditModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [tamano, setTamano] = useState<'chica' | 'mediana' | 'grande'>('mediana');
  const [raza, setRaza] = useState(RAZAS[0]);
  const [edad, setEdad] = useState('');
  const [color, setColor] = useState('');

  const handleEdit = (pet: any) => {
    setSelectedPet(pet);
    setNombre(pet.nombre);
    setEspecie(pet.especie);
    setTamano(pet.tamano);
    setRaza(pet.raza);
    setEdad(pet.edad);
    setColor(pet.color);
    setEditModal(true);
  };

  const handleSaveEdit = () => {
    if (selectedPet && nombre.trim() && especie.trim() && tamano && raza && edad.trim() && color.trim()) {
      editPet(selectedPet.id, { nombre, especie, tamano, raza, edad, color });
      setEditModal(false);
      setSelectedPet(null);
    } else {
      Alert.alert('Error', 'Completa todos los campos');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Eliminar mascota',
      '¿Estás seguro que deseas eliminar esta mascota?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => removePet(id) },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Mascotas</Text>
      <FlatList
        data={pets}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.petItem}>
            <Text style={styles.petName}>{item.nombre} ({item.especie})</Text>
            <Text style={styles.petDetails}>
              Tamaño: {item.tamano} | Raza: {item.raza} | Edad: {item.edad} | Color: {item.color}
            </Text>
            <View style={styles.row}>
              <Button title="Editar" onPress={() => handleEdit(item)} />
              <Button title="Eliminar" color="red" onPress={() => handleDelete(item.id)} />
            </View>
          </View>
        )}
      />
      <Button title="Agregar Mascota" onPress={() => navigation.navigate('AddPet')} />

      {/* Modal de edición */}
      <Modal visible={editModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Editar Mascota</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Especie"
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
            <Button title="Guardar" onPress={handleSaveEdit} />
            <Button title="Cancelar" color="red" onPress={() => setEditModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  petItem: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  petName: { fontWeight: 'bold', fontSize: 16 },
  petDetails: { fontSize: 14, color: '#555', marginBottom: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000099' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '80%' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 },
  picker: { height: 40, marginBottom: 12, backgroundColor: '#f9f9f9' }, // Estilo solo para Picker
  label: { fontSize: 16, marginBottom: 8 }
});