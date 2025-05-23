import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { colors } from '../themes/colors';
import { commonStyles } from '../themes/commonStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
    <View style={[commonStyles.container, { justifyContent: 'center' }]}>
      {/* Icono decorativo */}
      <Icon name="paw" size={60} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 8 }} />

      {/* Título grande y centrado */}
      <Text
        style={{
          fontSize: 48,
          color: colors.primary,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 24,
          fontFamily: 'System', // O tu fuente preferida
        }}
      >
        PetPal
      </Text>

      {/* Input para email */}
      <Text style={commonStyles.label}>Correo</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Ingresá tu correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={colors.muted}
        returnKeyType="done"
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      
      {/* Input para contraseña (oculta el texto) */}
      <Text style={commonStyles.label}>Contraseña</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Ingresá tu contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry  // Oculta los caracteres ingresados
        placeholderTextColor={colors.muted}
        returnKeyType="done"
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      
      {/* Botón de login */}
      <TouchableOpacity style={commonStyles.button} onPress={handleLogin}>
        <Text style={commonStyles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      
      {/* Botón para redirigir a registro */}
      <Button
        title="¿No tienes cuenta? Regístrate"
        color={colors.secondary}
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}

