import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, Keyboard } from 'react-native';

const dogBreeds = [
  'Sin raza', 'Labrador Retriever', 'Bulldog', 'Poodle', 'Beagle', 'Dachshund', 'Boxer', 'Golden Retriever', 'Chihuahua', 'Pug', 'Pastor Alemán'
];
const catBreeds = [
  'Sin raza','Persa', 'Siamés', 'Maine Coon', 'Bengala', 'Ragdoll', 'Sphynx', 'British Shorthair', 'Abisinio', 'Birmano', 'Azul Ruso'
];

type Props = {
  name: string;
  setNombre: (v: string) => void;
  pet_type: 'dog' | 'cat';
  setPetType: (v: 'dog' | 'cat') => void;
  weight: number | null;
  setPeso: (v: string) => void;
  breed: string;
  setRaza: (v: string) => void;
  age: number;
  setEdad: (v: string) => void;
  descripcion?: string;
  setDescripcion: (v: string) => void;
  styles: any;
};

export default function PetForm({
  name, setNombre,
  pet_type, setPetType,
  weight, setPeso,
  breed, setRaza,
  age, setEdad,
  descripcion, setDescripcion,
  styles
}: Props) {
  const pesoRef = useRef<TextInput>(null);
  const edadRef = useRef<TextInput>(null);
  const descripcionRef = useRef<TextInput>(null);

  const [modalTipo, setModalTipo] = useState(false);
  const [modalRaza, setModalRaza] = useState(false);

  return (
    <View>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la mascota"
        value={name}
        onChangeText={setNombre}
        returnKeyType="done" // Cambiado a "done"
        onSubmitEditing={() => Keyboard.dismiss()} // Cierra el teclado
        blurOnSubmit={true}
      />

      <Text style={styles.label}>Tipo</Text>
      <TouchableOpacity
        style={[styles.input, { justifyContent: 'center' }]}
        onPress={() => setModalTipo(true)}
        activeOpacity={0.7}
      >
        <Text style={{ color: pet_type ? '#22223B' : '#888' }}>
          {pet_type === 'dog' ? 'Perro' : 'Gato'}
        </Text>
      </TouchableOpacity>
      <Modal visible={modalTipo} transparent animationType="fade">
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={1}
          onPressOut={() => setModalTipo(false)}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 14,
              padding: 20,
              width: 250,
              borderWidth: 2,
              borderColor: '#219653',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 40,
                height: 5,
                backgroundColor: '#219653',
                borderRadius: 3,
                marginBottom: 16,
                opacity: 0.5,
              }}
            />
            <TouchableOpacity onPress={() => { setPetType('dog'); setModalTipo(false); }}>
              <Text style={{ fontSize: 18, padding: 10 }}>Perro</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setPetType('cat'); setModalTipo(false); }}>
              <Text style={{ fontSize: 18, padding: 10 }}>Gato</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalTipo(false)}>
              <Text style={{ color: '#219653', textAlign: 'right', marginTop: 10 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={styles.label}>Raza</Text>
      <TouchableOpacity
        style={[styles.input, { justifyContent: 'center' }]}
        onPress={() => setModalRaza(true)}
        activeOpacity={0.7}
      >
        <Text style={{ color: breed ? '#22223B' : '#888' }}>
          {breed || 'Seleccionar raza'}
        </Text>
      </TouchableOpacity>
      <Modal visible={modalRaza} transparent animationType="fade">
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'center', alignItems: 'center' }}
          activeOpacity={1}
          onPressOut={() => setModalRaza(false)}
        >
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 14,
              padding: 20,
              width: 250,
              maxHeight: 350,
              borderWidth: 2,
              borderColor: '#219653',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 40,
                height: 5,
                backgroundColor: '#219653',
                borderRadius: 3,
                marginBottom: 16,
                opacity: 0.5,
              }}
            />
            <FlatList
              data={pet_type === 'dog' ? dogBreeds : catBreeds}
              keyExtractor={(item) => item}
              style={{ alignSelf: 'stretch' }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { setRaza(item); setModalRaza(false); }}>
                  <Text style={{ fontSize: 17, padding: 10, textAlign: 'center' }}>{item}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator
            />
            <TouchableOpacity onPress={() => setModalRaza(false)}>
              <Text style={{ color: '#219653', textAlign: 'right', marginTop: 10 }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput
        ref={pesoRef}
        style={styles.input}
        placeholder="Peso en kilogramos"
        value={weight !== undefined && weight !== null ? weight.toString() : ''}
        onChangeText={setPeso}
        keyboardType="numeric"
        returnKeyType="next"
        onSubmitEditing={() => edadRef.current?.focus()}
        blurOnSubmit={false}
      />

      <Text style={styles.label}>Edad</Text>
      <TextInput
        ref={edadRef}
        style={styles.input}
        placeholder="Edad"
        value={age ? age.toString() : ''}
        onChangeText={setEdad}
        keyboardType="numeric"
        returnKeyType="next"
        onSubmitEditing={() => descripcionRef.current?.focus()}
        blurOnSubmit={false}
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        ref={descripcionRef}
        style={styles.input}
        placeholder="Descripción breve de la mascota"
        value={descripcion || ''}
        onChangeText={setDescripcion}
        maxLength={40}
        returnKeyType="done" 
        onSubmitEditing={() => Keyboard.dismiss()}
        blurOnSubmit={true}
      />
    </View>
  );
}


