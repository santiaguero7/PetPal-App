import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../themes/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
  description?: string;
  // Acciones opcionales:
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
  showActions?: boolean;
  weight?: number;
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
  descripcion,
  description,
  onEdit,
  onDelete,
  onClose,
  showActions = false,
  weight,
}: Props) {
  const mostrarNombre = nombre || name || 'Mascota';
  const mostrarEspecie = especie || (pet_type === 'dog' ? 'Perro' : pet_type === 'cat' ? 'Gato' : '');
  const mostrarRaza = raza || breed;
  const mostrarEdad = edad || age || '?';
  const mostrarDescripcion = descripcion || description;

  const getSizeLabel = (w: number | null) => {
    if (w == null) return 'Desconocido';
    if (w <= 8) return 'Chico';
    if (w <= 15) return 'Mediano';
    return 'Grande';
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.petName}>{name}</Text>
        {/* Mostrar tamaño si existe */}
        {typeof weight === 'number' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}> 
          </View>
        )}
        {tamano && <Text style={styles.info}>Tamaño: {tamano}</Text>}
        {mostrarRaza && <Text style={styles.info}>Raza: {mostrarRaza}</Text>}
        <Text style={styles.petInfo}>Edad: {age} años</Text>
        <Text style={styles.petInfo}>
          Peso: {weight} kg ({getSizeLabel(weight ?? null)})
        </Text>
        {mostrarDescripcion ? (
          <Text style={styles.descripcion}>{mostrarDescripcion}</Text>
        ) : null}
      </View>

      {showActions && (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={onDelete}>
            <Text style={[styles.actionText, styles.deleteText]}>Eliminar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={onClose}>
            <Text style={styles.actionText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      )}
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
  cardContent: {
    marginBottom: 8,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary || '#6EC1E4',
    marginBottom: 4,
  },
  petInfo: {
    fontSize: 15,
    color: colors.text || '#22223B',
    marginBottom: 2,
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
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#EAFBF2',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    minWidth: 70,
  },
  actionText: {
    color: colors.primary || '#219653',
    fontWeight: 'bold',
    fontSize: 15,
  },
  deleteBtn: {
    backgroundColor: '#FFEAEA',
  },
  deleteText: {
    color: '#E74C3C',
  },
});