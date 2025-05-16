import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

// Define los props del componente usando tipos de React Navigation
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  // Estados para manejar el email y contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Función que maneja el login (simulado)
  const handleLogin = () => {
    // lógica de autenticación
    navigation.replace('Home');  // Navega a Home después del login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      
      {/* Input para email */}
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"  // Teclado optimizado para emails
        autoCapitalize="none"  // Evita mayúsculas automáticas
      />
      
      {/* Input para contraseña (oculta el texto) */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry  // Oculta los caracteres ingresados
      />
      
      {/* Botón de login */}
      <Button title="Entrar" onPress={handleLogin} />
      
      {/* Botón para redirigir a registro */}
      <Button
        title="¿No tienes cuenta? Regístrate"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 },
});