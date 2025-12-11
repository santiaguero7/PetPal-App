import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Keyboard,
  ScrollView 
} from 'react-native';
import { colors } from '../themes/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// --- INTERFACE CORREGIDA ---
interface Props {
  initialValues?: {
    id?: number;
    service_type?: 'dog walker' | 'caregiver';
    price_per_hour?: number | null;
    price_per_day?: number | null;
    experience?: string;
    location?: string;
    pet_type?: 'dog' | 'cat';
    size_accepted?: 'small' | 'medium' | 'large' | 'all';
  };
  onSubmit: (values: any) => void; // Parent expects this
  onCancel?: () => void;
  submitText?: string;
  styles?: any; // Kept for compatibility
}

export default function PetPalPostForm({ 
  initialValues, 
  onSubmit, 
  onCancel, 
  submitText = "Guardar", 
}: Props) {
  
  // --- LOCAL STATE ---
  const [formData, setFormData] = useState({
    service_type: 'dog walker',
    price: '', // Unified input for price
    location: '',
    experience: '',
    pet_type: 'dog',
    size_accepted: 'all',
  });

  // --- LOAD INITIAL DATA ---
  useEffect(() => {
    if (initialValues) {
      // Logic: If price_per_hour exists, use it. If not, try price_per_day.
      const priceVal = initialValues.price_per_hour || initialValues.price_per_day || '';
      
      setFormData({
        service_type: initialValues.service_type || 'dog walker',
        price: priceVal.toString(),
        location: initialValues.location || '',
        experience: initialValues.experience || '',
        pet_type: initialValues.pet_type || 'dog',
        size_accepted: initialValues.size_accepted || 'all',
      });
    }
  }, [initialValues]);

  // --- SUBMIT HANDLER ---
  const handleSubmit = () => {
    Keyboard.dismiss();
    const numericPrice = parseFloat(formData.price) || 0;

    // We format the data exactly as the Backend expects it
    const payload = {
      ...formData,
      // If Walker -> fill price_per_hour, null price_per_day
      price_per_hour: formData.service_type === 'dog walker' ? numericPrice : null,
      // If Caregiver -> fill price_per_day, null price_per_hour
      price_per_day: formData.service_type === 'caregiver' ? numericPrice : null,
    };

    onSubmit(payload);
  };

  // --- RENDER HELPER FOR CHIPS ---
  const renderChip = (label: string, value: string, currentValue: string, onSelect: (v: any) => void, icon?: string) => {
    const isActive = currentValue === value;
    return (
      <TouchableOpacity 
        style={[styles.chip, isActive && styles.chipActive]} 
        onPress={() => onSelect(value)}
        activeOpacity={0.7}
      >
        {icon && (
          <Icon 
            name={icon} 
            size={18} 
            color={isActive ? '#FFF' : colors.primary} 
            style={{ marginRight: 6 }} 
          />
        )}
        <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      
      {/* 1. SERVICE TYPE */}
      <Text style={styles.label}>¿Qué servicio ofreces?</Text>
      <View style={styles.row}>
        {renderChip('Paseador', 'dog walker', formData.service_type, (v) => setFormData({...formData, service_type: v}), 'dog-service')}
        {renderChip('Cuidador', 'caregiver', formData.service_type, (v) => setFormData({...formData, service_type: v}), 'home-heart')}
      </View>

      {/* 2. LOCATION & PRICE */}
      <View style={styles.rowInputs}>
        <View style={{ flex: 2, marginRight: 12 }}>
          <Text style={styles.label}>Ubicación (Barrio)</Text>
          <View style={styles.inputContainer}>
            <Icon name="map-marker-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(t) => setFormData({...formData, location: t})}
              placeholder="Ej: Centro"
              placeholderTextColor="#CCC"
            />
          </View>
        </View>
        
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>
             {formData.service_type === 'dog walker' ? 'Precio/Hora' : 'Precio/Día'}
          </Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencyPrefix}>$</Text>
            <TextInput
              style={styles.input}
              value={formData.price}
              onChangeText={(t) => setFormData({...formData, price: t})}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#CCC"
            />
          </View>
        </View>
      </View>

      {/* 3. PET TYPE */}
      <Text style={styles.label}>Mascotas aceptadas</Text>
      <View style={styles.row}>
         {renderChip('Perros', 'dog', formData.pet_type, (v) => setFormData({...formData, pet_type: v}), 'dog')}
         {renderChip('Gatos', 'cat', formData.pet_type, (v) => setFormData({...formData, pet_type: v}), 'cat')}
      </View>

      {/* 4. SIZE */}
      <Text style={styles.label}>Tamaño máximo</Text>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollChips}>
           {renderChip('Chico', 'small', formData.size_accepted, (v) => setFormData({...formData, size_accepted: v}))}
           {renderChip('Mediano', 'medium', formData.size_accepted, (v) => setFormData({...formData, size_accepted: v}))}
           {renderChip('Grande', 'large', formData.size_accepted, (v) => setFormData({...formData, size_accepted: v}))}
           {renderChip('Todos', 'all', formData.size_accepted, (v) => setFormData({...formData, size_accepted: v}))}
        </ScrollView>
      </View>

      {/* 5. EXPERIENCE */}
      <Text style={styles.label}>Experiencia / Descripción</Text>
      <View style={[styles.inputContainer, styles.textAreaContainer]}>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.experience}
          onChangeText={(t) => setFormData({...formData, experience: t})}
          placeholder="Cuéntanos sobre tu experiencia cuidando mascotas..."
          placeholderTextColor="#CCC"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* FOOTER ACTIONS */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnPrimary} onPress={handleSubmit}>
          <Text style={styles.btnTextWhite}>{submitText}</Text>
        </TouchableOpacity>
        
        {onCancel && (
          <TouchableOpacity style={styles.btnSecondary} onPress={onCancel}>
            <Text style={styles.btnTextSecondary}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    color: '#555',
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollChips: {
    paddingRight: 20,
    gap: 8,
  },
  
  // Chips (Botones de selección)
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    minWidth: 80,
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.primary, // Verde PetPal
    borderColor: colors.primary,
  },
  chipText: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },
  chipTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },

  // Inputs
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  inputIcon: {
    marginRight: 8,
  },
  currencyPrefix: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginRight: 4,
  },
  textAreaContainer: {
    height: 100,
    paddingVertical: 10,
  },
  textArea: {
    height: '100%',
  },

  // Footer Buttons
  footer: {
    marginTop: 30,
    gap: 12,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  btnSecondary: {
    backgroundColor: '#FFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  btnTextWhite: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnTextSecondary: {
    color: '#666',
    fontWeight: '600',
    fontSize: 16,
  },
});