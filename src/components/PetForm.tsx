import React from 'react';
import { View, Text, TextInput } from 'react-native';
import ModalSelector from 'react-native-modal-selector';

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
  pet_type, setPetType, // 🔧 este es el nombre correcto
  weight, setPeso,
  breed, setRaza,
  age, setEdad,
  descripcion, setDescripcion,
  styles
}: Props) {
  return (
    <>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la mascota"
        value={name}
        onChangeText={setNombre}
      />

      <Text style={styles.label}>Tipo</Text>
      <ModalSelector
        data={[
          { key: 'dog', label: 'Perro' },
          { key: 'cat', label: 'Gato' }
        ]}
        initValue="Selecciona tipo"
        onChange={option => setPetType(option.key as 'dog' | 'cat')} // 🔧 antes usaba setTipo
        selectStyle={styles.input}
        selectTextStyle={{ color: '#22223B', fontSize: 16 }}
      >
        <TextInput
          style={styles.input}
          editable={false}
          placeholder="Selecciona tipo"
          value={pet_type === 'dog' ? 'Perro' : 'Gato'}
          pointerEvents="none"
        />
      </ModalSelector>

      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput
        style={styles.input}
        placeholder="Peso en kilogramos"
        value={weight !== undefined && weight !== null ? weight.toString() : ''}
        onChangeText={setPeso}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Raza</Text>
      <TextInput
        style={styles.input}
        placeholder="Raza"
        value={breed}
        onChangeText={setRaza}
      />

      <Text style={styles.label}>Edad</Text>
      <TextInput
        style={styles.input}
        placeholder="Edad (en años)"
        value={age !== undefined && age !== null ? age.toString() : ''}
        onChangeText={setEdad}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción breve de la mascota"
        value={descripcion || ''}
        onChangeText={setDescripcion}
        maxLength={40}
      />
    </>
  );
}


