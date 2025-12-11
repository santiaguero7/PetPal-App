import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../themes/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  // Aceptamos ambas nomenclaturas para flexibilidad
  nombre?: string;
  name?: string;
  especie?: string;
  pet_type?: 'dog' | 'cat' | string;
  breed?: string;
  raza?: string;
  edad?: string | number;
  age?: number;
  descripcion?: string;
  description?: string;
  weight?: number; // El PDF no menciona weight en SQL, pero lo mantenemos por tu frontend [cite: 145-150]
  
  // Acciones
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
};

export default function PetCard({
  nombre,
  name,
  pet_type,
  breed,
  raza,
  edad,
  age,
  descripcion,
  description,
  weight,
  onEdit,
  onDelete,
  showActions = false,
}: Props) {
  // 1. Normalización de datos (Single Source of Truth)
  const displayData = {
    name: name || nombre || 'Sin nombre',
    breed: breed || raza || 'Raza desconocida',
    age: age || edad,
    desc: description || descripcion,
    type: pet_type === 'cat' ? 'cat' : 'dog', // Default a perro si no se especifica
  };

  // 2. Lógica de tamaño y etiquetas
  const getSizeLabel = (w?: number) => {
    if (!w) return null;
    if (w <= 8) return 'Pequeño';
    if (w <= 15) return 'Mediano';
    return 'Grande';
  };

  const sizeLabel = getSizeLabel(weight);

  return (
    <View style={styles.cardContainer}>
      
      {/* SECCIÓN SUPERIOR: Icono e Info Principal */}
      <View style={styles.headerContent}>
        
        {/* Avatar */}
        <View style={[
          styles.avatarContainer, 
          { backgroundColor: displayData.type === 'dog' ? '#E3F2FD' : '#F3E5F5' }
        ]}>
          <Icon 
            name={displayData.type === 'dog' ? 'dog' : 'cat'} 
            size={32} 
            color={displayData.type === 'dog' ? '#1976D2' : '#8E24AA'} 
          />
        </View>

        {/* Info Texto */}
        <View style={styles.textContainer}>
          <Text style={styles.petName}>{displayData.name}</Text>
          <Text style={styles.petBreed}>{displayData.breed}</Text>
        </View>

        {/* Botón Editar (Solo Icono sutil arriba a la derecha) */}
        {showActions && onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.miniEditBtn}>
            <Icon name="pencil" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </View>

      {/* SECCIÓN MEDIA: Badges / Chips */}
      <View style={styles.statsRow}>
        {/* Chip Edad */}
        {(displayData.age !== undefined) && (
          <View style={styles.badge}>
            <Icon name="cake-variant" size={14} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={styles.badgeText}>{displayData.age} años</Text>
          </View>
        )}

        {/* Chip Peso */}
        {weight && (
          <View style={styles.badge}>
            <Icon name="weight-kilogram" size={14} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={styles.badgeText}>{weight} kg</Text>
          </View>
        )}

        {/* Chip Tamaño */}
        {sizeLabel && (
          <View style={[styles.badge, { backgroundColor: '#F0F4F8' }]}>
            <Text style={[styles.badgeText, { color: '#555' }]}>{sizeLabel}</Text>
          </View>
        )}
      </View>

      {/* Descripción (si existe) */}
      {displayData.desc ? (
        <View style={styles.descContainer}>
          <Text style={styles.descText} numberOfLines={2}>
            "{displayData.desc}"
          </Text>
        </View>
      ) : null}

      {/* SECCIÓN INFERIOR: Acciones (Solo si showActions es true) */}
      {showActions && onDelete && (
        <View style={styles.footerActions}>
          <View style={styles.divider} />
          <TouchableOpacity 
            style={styles.deleteButton} 
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Icon name="trash-can-outline" size={18} color="#E53935" />
            <Text style={styles.deleteText}>Eliminar Mascota</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // Sombras suaves estilo "PetPal"
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28, // Círculo perfecto
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  petBreed: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  miniEditBtn: {
    padding: 8,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F6EF', // Verde muy suave
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    color: colors.primary, // #6FCF97 o similar
    fontWeight: '600',
  },
  descContainer: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
  },
  descText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  // Footer Actions
  footerActions: {
    marginTop: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEE',
    marginBottom: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  deleteText: {
    color: '#E53935',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
});