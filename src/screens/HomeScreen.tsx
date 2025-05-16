import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

// Define el tipo para las props de navegación específicas de la pantalla Home
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Tipo para las props del componente
type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  // Función que maneja el logout con confirmación
  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },  // Botón de cancelar
        { 
          text: 'Cerrar sesión', 
          style: 'destructive',  // Estilo visual para acción destructiva
          onPress: () => navigation.replace('Login')  // Navega a Login al confirmar
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a PetPal</Text>
      
      {/* Botón para navegar al perfil */}
      <Button title="Mi Perfil" onPress={() => navigation.navigate('Profile')} />
      
      {/* Botón para navegar a la lista de mascotas */}
      <Button title="Mis Mascotas" onPress={() => navigation.navigate('Pets')} />
      
      {/* Botón de logout con color rojo */}
      <Button title="Cerrar sesión" color="red" onPress={handleLogout} />
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',  // Centra los elementos horizontalmente
    padding: 16 
  },
  title: { 
    fontSize: 24, 
    marginBottom: 24,  // Espaciado inferior para el título
    textAlign: 'center' 
  },
});