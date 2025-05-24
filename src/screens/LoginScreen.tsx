import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Keyboard, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { colors } from '../themes/colors';
import { commonStyles } from '../themes/commonStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { loginUser } from '../services/auth';
import { saveToken } from '../storage/token';


// Define los props del componente usando tipos de React Navigation
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  // Estados para manejar el email y contraseña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInput>(null);

  // Función que maneja el login 
const handleLogin = async () => {
  if (!email.trim() || !password.trim()) {
    alert('Por favor ingresá correo y contraseña');
    return;
  }

  try {
    const res = await loginUser(email, password);
    await saveToken(res.token); // ✅ guardar token localmente
    navigation.replace('Home');
  } catch (error: any) {
    alert(error.message || 'Ocurrió un error al iniciar sesión');
  }
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={[commonStyles.container, { justifyContent: 'center', flexGrow: 1, paddingTop: 10}]}
        keyboardShouldPersistTaps="handled"
      >
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
            fontFamily: 'System',
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
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current?.focus()}
          autoCorrect={false}
          autoFocus={false}
        />

        {/* Input para contraseña */}
        <Text style={commonStyles.label}>Contraseña</Text>
        <TextInput
          ref={passwordRef}
          style={commonStyles.input}
          placeholder="Ingresá tu contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={colors.muted}
          returnKeyType="done"
          blurOnSubmit={true}
          onSubmitEditing={() => Keyboard.dismiss()}
          autoCorrect={false}
          autoFocus={false}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

