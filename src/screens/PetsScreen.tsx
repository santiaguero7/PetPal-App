import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Alert, Modal, TextInput, Keyboard } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { usePets } from '../context/PetsContext';

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

type Props = NativeStackScreenProps<RootStackParamList, 'Pets'>;

export default function PetsScreen({ navigation }: Props) {
  const { pets, removePet, editPet } = usePets();
  const [editModal, setEditModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState<string | null>(null);
  const [tamano, setTamano] = useState<string | null>(null);
  const [raza, setRaza] = useState<string | null>(null);
  const [edad, setEdad] = useState('');

  const handleEdit = (pet: any) => {
    setSelectedPet(pet);
    setNombre(pet.nombre);
    setEspecie(pet.especie);
    setTamano(pet.tamano);
    setRaza(pet.raza);
    setEdad(pet.edad);
    setEditModal(true);
  };

  const handleSaveEdit = () => {
    if (
      selectedPet &&
      nombre.trim() &&
      especie &&
      edad.trim() &&
      (especie !== 'Perro' || (tamano && raza))
    ) {
      editPet(selectedPet.id, {
        nombre,
        especie,
        tamano: especie === 'Perro' ? (tamano as 'chica' | 'mediana' | 'grande') : 'mediana',
        raza: especie === 'Perro' ? (raza || '') : '',
        edad,
      });
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
              Tamaño: {item.tamano} | Raza: {item.raza} | Edad: {item.edad}
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
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
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
              onSubmitEditing={() => Keyboard.dismiss()}
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
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8, borderRadius: 4, backgroundColor: '#fff' },
  selector: { marginBottom: 8 },
  selectorButton: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, backgroundColor: '#fff' },
  selectorText: { color: '#333', fontSize: 16 },
  label: { fontWeight: 'bold', marginTop: 16, marginBottom: 4 },
});