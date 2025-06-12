import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';

interface PetPalCardProps {
  name: string;
  email?: string;
  barrio?: string;
  ciudad?: string;
  telefono?: string;
  onPress?: () => void;
  style?: any;
}

export default function PetPalCard({
  name,
  email,
  barrio,
  ciudad,
  telefono,
  onPress,
  style,
}: PetPalCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, style]}
      activeOpacity={onPress ? 0.8 : 1}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.avatarBox}>
        <Icon name="account-circle" size={48} color={colors.primary} />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.name}>{name}</Text>
        {email ? <Text style={styles.email}>{email}</Text> : null}
        {barrio || ciudad ? (
          <Text style={styles.detail}>
            {barrio ? barrio : ''}{barrio && ciudad ? ', ' : ''}{ciudad ? ciudad : ''}
          </Text>
        ) : null}
        {telefono ? (
          <View style={styles.row}>
            <Icon name="phone" size={16} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={styles.detail}>{telefono}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    elevation: 1,
    marginBottom: 8,
  },
  avatarBox: {
    marginRight: 14,
  },
  infoBox: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#22223B',
    marginBottom: 2,
  },
  email: {
    color: '#888',
    fontSize: 13,
    marginBottom: 2,
  },
  detail: {
    color: '#555',
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
   marginTop: 2,
  },
});