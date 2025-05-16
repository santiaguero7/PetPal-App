import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  // Pantalla de perfil del usuario (datos estáticos de ejemplo)
  // En una app real, estos datos vendrían de un estado o API
  
  return (
    <View style={styles.container}>
      {/* Título principal de la pantalla */}
      <Text style={styles.title}>Mi Perfil</Text>
      
      {/* Sección de información del usuario (actualmente hardcodeada) */}
      <Text>Nombre: Juan Pérez</Text>       
      <Text>Email: juan@email.com</Text>    
      <Text>Tipo: Cuidador</Text>           
      
      {/* Espacio para futura implementación: 
          - Foto de perfil
          - Botones de edición
          - Más datos del usuario */}
    </View>
  );
}

// Estilos de la pantalla
const styles = StyleSheet.create({
  container: { 
    flex: 1,                   
    justifyContent: 'center',    
    alignItems: 'center',       
    padding: 16                 
  },
  title: {
    fontSize: 24,               
    marginBottom: 16,         
  },
});