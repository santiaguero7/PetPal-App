import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import { commonStyles } from '../themes/commonStyles';
import ModalSelector from 'react-native-modal-selector';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [rol, setRol] = useState<'trabajador' | 'cliente'>('cliente');
  const [dni, setDni] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [direccion, setDireccion] = useState('');
  const [provincia, setProvincia] = useState('');

  const handleRegister = () => {
    if (!email.trim() || !nombre.trim() || !password.trim() || !repeatPassword.trim() || !dni.trim() || !direccion.trim() || !provincia.trim()) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    if (password !== repeatPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    const datosRegistro = {
      email,
      nombre,
      password,
      rol,
      dni,
      direccion,
      provincia,
      ...(rol === 'trabajador' && {
        especialidad,
      }),
    };
    console.log(datosRegistro);
    // Aquí iría tu lógica de registro
    navigation.replace('Login');
  };

  const ROLES = [
    { key: 'trabajador', label: 'PetPal' },
    { key: 'cliente', label: 'Cliente' }
  ];

  const ROL_DESCRIPCIONES: Record<'trabajador' | 'cliente', string> = {
    trabajador: 'PetPal: Podrás ofrecer servicios, gestionar mascotas de clientes y acceder a herramientas profesionales.',
    cliente: 'Cliente: Podrás registrar tus mascotas, solicitar servicios y gestionar su información fácilmente.'
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Icon name="paw" size={48} color={colors.primary} style={{ alignSelf: 'center', marginBottom: 8 }} />

          <View style={{ marginBottom: 10 }}>
            {/* Selector de tipo de usuario */}
            <Text style={[styles.label, { marginTop: 0, fontWeight: 'bold', fontSize: 18 }]}>Tipo de usuario</Text>
            <ModalSelector
              data={ROLES}
              initValue="Selecciona tu tipo de usuario"
              onChange={option => setRol(option.key as 'trabajador' | 'cliente')}
              selectStyle={{
                ...commonStyles.input,
                borderWidth: 2,
                borderColor: colors.primary,
              }}
              selectTextStyle={{ color: colors.primary, fontSize: 16, fontWeight: 'bold' }}
            >
              <TextInput
                style={[commonStyles.input, { color: colors.primary, fontWeight: 'bold' }]}
                editable={false}
                placeholder="Selecciona tu tipo de usuario"
                value={ROLES.find(r => r.key === rol)?.label || ''}
                pointerEvents="none"
              />
            </ModalSelector>
            <Text style={{ color: '#555', fontSize: 14, marginBottom: 0, marginTop: 1, marginLeft: 10}}>
              {ROL_DESCRIPCIONES[rol]}
            </Text>
          </View>

          <View style={{ marginTop: 18 }}>
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
            <TextInput
              style={commonStyles.input}
              placeholder="DNI"
              value={dni}
              onChangeText={setDni}
              keyboardType="numeric"
            />

            {/* Botón de autenticación por cámara, después del DNI */}
            <TouchableOpacity
              style={[commonStyles.button, { backgroundColor: colors.accent, flexDirection: 'row', alignItems: 'center', marginBottom: 12 }]}
              onPress={() => Alert.alert('Función demo', 'Aquí se abriría la cámara para validar tu DNI')}
            >
              <Icon name="camera" size={22} color={colors.text} />
              <Text style={[commonStyles.buttonText, { color: colors.text, marginLeft: 8 }]}>Validar identidad con foto de DNI</Text>
            </TouchableOpacity>
            <TextInput
              style={commonStyles.input}
              placeholder="Dirección"
              value={direccion}
              onChangeText={setDireccion}
            />
            <TextInput
              style={commonStyles.input}
              placeholder="Provincia"
              value={provincia}
              onChangeText={setProvincia}
            />
          </View>

          <TouchableOpacity style={commonStyles.button} onPress={handleRegister}>
            <Icon name="account-plus" size={24} color={colors.white} />
            <Text style={commonStyles.buttonText}>Registrarme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={commonStyles.buttonAccent} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color={colors.text} />
            <Text style={commonStyles.buttonTextAccent}>Volver</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 16 },
  label: {
    color: '#22223B',
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
    alignSelf: 'flex-start',
  },
});