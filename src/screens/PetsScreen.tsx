import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, Modal, TextInput, Keyboard, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import { commonStyles } from '../themes/commonStyles';
import { usePets } from '../context/PetsContext';
import ModalSelector from 'react-native-modal-selector';

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

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Pets'>;

export default function PetsScreen({ navigation }: Props) {
  const { pets, removePet, editPet } = usePets();
  const [editModal, setEditModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [tamano, setTamano] = useState<'chica' | 'mediana' | 'grande'>('mediana');
  const [raza, setRaza] = useState(RAZAS_PERRO[0].label);
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
    if (selectedPet && nombre.trim() && especie.trim() && tamano && raza && edad.trim()) {
      editPet(selectedPet.id, { nombre, especie, tamano, raza, edad });
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
      <Text style={commonStyles.title}>Mis Mascotas</Text>
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
              <TouchableOpacity style={commonStyles.button} onPress={() => handleEdit(item)}>
                <Icon name="pencil" size={20} color={colors.white} />
                <Text style={commonStyles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={commonStyles.buttonAccent} onPress={() => handleDelete(item.id)}>
                <Icon name="delete" size={20} color={colors.text} />
                <Text style={commonStyles.buttonTextAccent}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={commonStyles.button} onPress={() => navigation.navigate('AddPet')}>
        <Icon name="plus" size={24} color={colors.white} />
        <Text style={commonStyles.buttonText}>Agregar Mascota</Text>
      </TouchableOpacity>

      {/* Modal de edición */}
      <Modal visible={editModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Editar Mascota</Text>

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
              onChange={option => {
                setEspecie(option.key as string);
                setTamano('mediana');
                setRaza('');
              }}
              selectStyle={styles.input}
              selectTextStyle={{ color: '#22223B', fontSize: 16 }}
            >
              <TextInput
                style={{ color: '#22223B', fontSize: 16, backgroundColor: 'transparent', padding: 0, margin: 0 }}
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
                  onChange={option => setTamano(option.key as 'chica' | 'mediana' | 'grande')}
                  selectStyle={styles.input}
                  selectTextStyle={{ color: '#22223B', fontSize: 16 }}
                >
                  <TextInput
                    style={{ color: '#22223B', fontSize: 16, backgroundColor: 'transparent', padding: 0, margin: 0 }}
                    editable={false}
                    placeholder="Selecciona tamaño"
                    value={TAMANOS.find(t => t.key === tamano)?.label || ''}
                  />
                </ModalSelector>
                <Text style={styles.label}>Raza</Text>
                <ModalSelector
                  data={RAZAS_PERRO}
                  initValue="Selecciona raza"
                  onChange={option => setRaza(option.label)}
                  selectStyle={styles.input}
                  selectTextStyle={{ color: '#22223B', fontSize: 16 }}
                >
                  <TextInput
                    style={{ color: '#22223B', fontSize: 16, backgroundColor: 'transparent', padding: 0, margin: 0 }}
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
                  selectStyle={styles.input}
                  selectTextStyle={{ color: '#22223B', fontSize: 16 }}
                >
                  <TextInput
                    style={{ color: '#22223B', fontSize: 16, backgroundColor: 'transparent', padding: 0, margin: 0 }}
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

            <TouchableOpacity style={styles.button} onPress={handleSaveEdit}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: '#FFD166' }]} onPress={() => setEditModal(false)}>
              <Text style={[styles.buttonText, { color: '#22223B' }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  petItem: { padding: 12, borderBottomWidth: 1, borderColor: '#eee', marginBottom: 8, backgroundColor: colors.card, borderRadius: 12 },
  petName: { fontWeight: 'bold', fontSize: 16, color: colors.text },
  petDetails: { fontSize: 14, color: '#555', marginBottom: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#00000099' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 16, width: '90%' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    color: '#22223B',
    borderWidth: 1,
    borderColor: '#6EC1E4',
    width: '100%',
    alignSelf: 'stretch',
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  label: {
    color: '#22223B',
    fontFamily: 'Baloo2-Bold',
    fontSize: 15,
    paddingLeft: 4,
    paddingBottom: 2,
    marginTop: 10,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: { color: colors.white, fontWeight: 'bold', fontSize: 16 },
});