import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../themes/colors';

type Props = {
  nombre: string;
  especie: string;
  tamano?: string;
  raza?: string;
  edad: string;
  descripcion?: string;
};

export default function PetCard({ nombre, especie, tamano, raza, edad, descripcion }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.nombre}>{nombre} ({especie})</Text>
      {tamano && <Text style={styles.info}>Tamaño: {tamano}</Text>}
      {raza && <Text style={styles.info}>Raza: {raza}</Text>}
      <Text style={styles.info}>Edad: {edad} años</Text>
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