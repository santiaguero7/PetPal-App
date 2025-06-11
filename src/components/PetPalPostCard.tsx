import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../themes/colors';

type Props = {
  service_type?: string;
  price_per_hour?: number | null;
  price_per_day?: number | null;
  experience?: string;
  location?: string;
  pet_type?: string;
  size_accepted?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onClose?: () => void;
  showActions?: boolean;
};

export default function PetPalPostCard({
  service_type,
  price_per_hour,
  price_per_day,
  experience,
  location,
  pet_type,
  size_accepted,
  onEdit,
  onDelete,
  onClose,
  showActions = false,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.nombre}>
        {service_type === 'dog walker'
          ? 'Paseador'
          : service_type === 'caregiver'
          ? 'Cuidador'
          : 'Publicación'}
      </Text>
      {location && <Text style={styles.info}>Zona: {location}</Text>}
      {pet_type && <Text style={styles.info}>Tipo: {pet_type === 'dog' ? 'Perro' : 'Gato'}</Text>}
      {size_accepted && <Text style={styles.info}>Tamaño aceptado: {size_accepted}</Text>}
      {experience && <Text style={styles.info}>Experiencia: {experience}</Text>}
      {price_per_hour !== null && price_per_hour !== undefined && (
        <Text style={styles.info}>Precio/hora: ${price_per_hour}</Text>
      )}
      {price_per_day !== null && price_per_day !== undefined && (
        <Text style={styles.info}>Precio/día: ${price_per_day}</Text>
      )}
      {showActions && (
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
            <Text style={styles.actionText}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={onDelete}>
            <Text style={[styles.actionText, styles.deleteText]}>Eliminar</Text>
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
    marginBottom: 8,
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