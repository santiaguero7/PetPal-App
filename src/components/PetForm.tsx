import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import ModalSelector from 'react-native-modal-selector';

type Props = {
  nombre: string;
  setNombre: (v: string) => void;
  especie: string;
  setEspecie: (v: string) => void;
  tamano: 'chica' | 'mediana' | 'grande';
  setTamano: (v: 'chica' | 'mediana' | 'grande') => void;
  raza: string;
  setRaza: (v: string) => void;
  edad: string;
  setEdad: (v: string) => void;
  descripcion: string;
  setDescripcion: (v: string) => void;
  ESPECIES: { key: string; label: string }[];
  TAMANOS: { key: string; label: string }[];
  RAZAS_PERRO: { key: number; label: string }[];
  RAZAS_GATO: { key: number; label: string }[];
  styles: any;
};

export default function PetForm({
  nombre, setNombre,
  especie, setEspecie,
  tamano, setTamano,
  raza, setRaza,
  edad, setEdad,
  descripcion, setDescripcion,
  ESPECIES, TAMANOS, RAZAS_PERRO, RAZAS_GATO,
  styles
}: Props) {
  return (
    <>
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
          style={styles.input}
          editable={false}
          placeholder="Selecciona especie"
          value={ESPECIES.find(e => e.key === especie)?.label || ''}
          pointerEvents="none"
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
              style={styles.input}
              editable={false}
              placeholder="Selecciona tamaño"
              value={TAMANOS.find(t => t.key === tamano)?.label || ''}
              pointerEvents="none"
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
              style={styles.input}
              editable={false}
              placeholder="Selecciona raza"
              value={raza || ''}
              pointerEvents="none"
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
              style={styles.input}
              editable={false}
              placeholder="Selecciona raza"
              value={raza || ''}
              pointerEvents="none"
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

      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        placeholder="Descripción breve de la mascota"
        value={descripcion}
        onChangeText={setDescripcion}
        maxLength={40}
      />
    </>
  );
}