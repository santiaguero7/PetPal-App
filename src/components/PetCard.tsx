import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../themes/colors';

// Adaptado para aceptar tanto claves en español como en inglés

type Props = {
  nombre?: string;
  name?: string;
  especie?: string;
  pet_type?: 'dog' | 'cat';
  tamano?: string;
  breed?: string;
  raza?: string;
  edad?: string | number;
  age?: number;
  descripcion?: string;
};

export default function PetCard({
  nombre,
  name,
  especie,
  pet_type,
  tamano,
  breed,
  raza,
  edad,
  age,
  descripcion
}: Props) {
  const mostrarNombre = nombre || name || 'Mascota';
  const mostrarEspecie = especie || (pet_type === 'dog' ? 'Perro' : pet_type === 'cat' ? 'Gato' : '');
  const mostrarRaza = raza || breed;
  const mostrarEdad = edad || age || '?';

  return (
    <View style={styles.card}>
      <Text style={styles.nombre}>{mostrarNombre} ({mostrarEspecie})</Text>
      {tamano && <Text style={styles.info}>Tamaño: {tamano}</Text>}
      {mostrarRaza && <Text style={styles.info}>Raza: {mostrarRaza}</Text>}
      <Text style={styles.info}>Edad: {mostrarEdad} años</Text>
      {descripcion ? (
        <Text style={styles.descripcion}>{descripcion}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card || '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: colors.primary || '#6EC1E4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary || '#6EC1E4',
    marginBottom: 4,
  },
  info: {
    fontSize: 15,
    color: colors.text || '#22223B',
    marginBottom: 2,
  },
  descripcion: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
    fontStyle: 'italic',
  },
});