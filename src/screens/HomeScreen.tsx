import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { colors } from '../themes/colors';

// Define el tipo para las props de navegación específicas de la pantalla Home
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Tipo para las props del componente
type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Icon name="paw" size={60} color="#6EC1E4" style={{ alignSelf: 'center', marginBottom: 8 }} />
      <Text style={styles.title}>¡Bienvenido a PetPal!</Text>
      <Text style={styles.subtitle}>Tu espacio para cuidar y mimar a tus mascotas</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Icon name="account" size={24} color="#fff" />
        <Text style={styles.buttonText}>Mi Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Pets')}>
        <Icon name="dog" size={24} color="#fff" />
        <Text style={styles.buttonText}>Mis Mascotas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonAccent}
        onPress={() =>
          Alert.alert('Cerrar sesión', '¿Estás seguro que deseas salir?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Salir', style: 'destructive', onPress: () => navigation.replace('Login') },
          ])
        }
      >
        <Icon name="logout" size={24} color="#22223B" />
        <Text style={styles.buttonTextAccent}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E3F6FC', justifyContent: 'center', padding: 24 },
  title: {
    fontSize: 36,
    color: '#6EC1E4',
    fontFamily: 'Baloo2-Bold',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#22223B',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Baloo2-Regular',
  },
  button: {
    backgroundColor: '#6EC1E4',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#6EC1E4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Baloo2-Bold',
    marginLeft: 10,
  },
  buttonAccent: {
    backgroundColor: '#FFD166',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#FFD166',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonTextAccent: {
    color: '#22223B',
    fontSize: 20,
    fontFamily: 'Baloo2-Bold',
    marginLeft: 10,
  },
});