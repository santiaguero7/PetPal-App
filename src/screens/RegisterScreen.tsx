import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import { commonStyles } from '../themes/commonStyles';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleRegister = () => {
    if (!email.trim() || !nombre.trim() || !password.trim() || !repeatPassword.trim()) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    if (password !== repeatPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    // Aquí iría tu lógica de registro
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Icon name="paw" size={48} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 8 }} />
      <Text style={commonStyles.title}>Crear cuenta</Text>
      <TextInput
        style={commonStyles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor="#888"
      />
      <TextInput
        style={commonStyles.input}
        placeholder="Ingresá tu correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#888"
        returnKeyType="done"
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="Ingresá tu contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
        returnKeyType="done"
        onSubmitEditing={() => Keyboard.dismiss()}
      />
      <TextInput
        style={commonStyles.input}
        placeholder="Repetir contraseña"
        value={repeatPassword}
        onChangeText={setRepeatPassword}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={commonStyles.button} onPress={handleRegister}>
        <Icon name="account-plus" size={24} color={colors.white} />
        <Text style={commonStyles.buttonText}>Registrarme</Text>
      </TouchableOpacity>
      <TouchableOpacity style={commonStyles.buttonAccent} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color={colors.text} />
        <Text style={commonStyles.buttonTextAccent}>Volver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 16 },
});