import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import { commonStyles } from '../themes/commonStyles';

interface UserCardProps {
  user: {
    name?: string;
    email?: string;
    dni?: string;
    telefono?: string;
    direccion?: string;
    barrio?: string;
    ciudad?: string;
  };
  onEdit?: () => void;
  onClose?: () => void;
}

export default function UserCard({ user, onEdit, onClose }: UserCardProps) {
  return (
    <View style={styles.modalFormContent}>
      <View style={{ alignItems: 'center', marginBottom: 16 }}>
        <Icon name="account-circle" size={54} color={colors.primary} />
        <Text style={[styles.profileName, { fontSize: 20, marginTop: 8 }]}>{user?.name}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
      </View>
      <View style={{ marginBottom: 12 }}>
        <Text style={styles.label}>DNI: <Text style={styles.profileEmail}>{user?.dni}</Text></Text>
        <Text style={styles.label}>Teléfono: <Text style={styles.profileEmail}>{user?.telefono}</Text></Text>
        <Text style={styles.label}>Dirección: <Text style={styles.profileEmail}>{user?.direccion}</Text></Text>
        <Text style={styles.label}>Barrio: <Text style={styles.profileEmail}>{user?.barrio}</Text></Text>
        <Text style={styles.label}>Ciudad: <Text style={styles.profileEmail}>{user?.ciudad}</Text></Text>
      </View>
      {onEdit && (
        <TouchableOpacity
          style={[commonStyles.button, { backgroundColor: colors.primary, marginBottom: 10 }]}
          onPress={onEdit}
        >
          <Text style={commonStyles.buttonText}>Editar perfil</Text>
        </TouchableOpacity>
      )}
      {onClose && (
        <TouchableOpacity
          style={[commonStyles.button, { backgroundColor: colors.secondary }]}
          onPress={onClose}
        >
          <Text style={commonStyles.buttonText}>Cerrar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalFormContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    width: '92%',
    minWidth: 300,
    maxWidth: 400,
    alignItems: 'stretch',
    elevation: 2,
  },
  profileName: { fontSize: 16, fontWeight: 'bold', color: '#22223B' },
  profileEmail: { color: '#888', marginBottom: 4, fontSize: 13 },
  label: {
    fontSize: 14,
    color: '#22223B',
    marginBottom: 4,
  },
});