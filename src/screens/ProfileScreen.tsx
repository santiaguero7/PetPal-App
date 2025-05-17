import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import { commonStyles } from '../themes/commonStyles';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  // Simula datos de usuario
  const usuario = {
    nombre: 'Juan Pérez',
    email: 'juan@email.com',
  };

  return (
    <View style={styles.container}>
      <Icon name="account-circle" size={80} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 8 }} />
      <Text style={commonStyles.title}>Mi Perfil</Text>
      <Text style={styles.infoLabel}>Nombre:</Text>
      <Text style={styles.infoValue}>{usuario.nombre}</Text>
      <Text style={styles.infoLabel}>Correo:</Text>
      <Text style={styles.infoValue}>{usuario.email}</Text>
      <TouchableOpacity style={commonStyles.buttonAccent} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color={colors.text} />
        <Text style={commonStyles.buttonTextAccent}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 16 },
  infoLabel: { fontWeight: 'bold', color: colors.text, fontSize: 18, marginTop: 16 },
  infoValue: { color: colors.text, fontSize: 18, marginBottom: 8 },
});