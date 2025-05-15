import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  // Aquí puedes mostrar los datos del usuario
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>
      {/* Muestra aquí los datos del usuario */}
      <Text>Nombre: Juan Pérez</Text>
      <Text>Email: juan@email.com</Text>
      <Text>Tipo: Cuidador</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
});