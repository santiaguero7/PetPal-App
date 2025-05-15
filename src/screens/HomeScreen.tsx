import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const handleLogout = () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar sesión', style: 'destructive', onPress: () => navigation.replace('Login') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a PetPal</Text>
      <Button title="Mi Perfil" onPress={() => navigation.navigate('Profile')} />
      <Button title="Mis Mascotas" onPress={() => navigation.navigate('Pets')} />
      <Button title="Cerrar sesión" color="red" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 24, textAlign: 'center' },
});