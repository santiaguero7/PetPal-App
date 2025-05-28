import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import { commonStyles } from '../themes/commonStyles';
import ModalSelector from 'react-native-modal-selector';
import { registerUser } from '../services/auth';
import { saveToken } from '../storage/token';


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
  const [barrio, setBarrio] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');

  // Referencias para los inputs
  const nombreRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const repeatPasswordRef = useRef<TextInput>(null);
  const dniRef = useRef<TextInput>(null);
  const direccionRef = useRef<TextInput>(null);
  const provinciaRef = useRef<TextInput>(null);
  const barrioRef = useRef<TextInput>(null);
  const telefonoRef = useRef<TextInput>(null);
  const ciudadRef = useRef<TextInput>(null);



const handleRegister = async () => {
  if (
    !email.trim() ||
    !nombre.trim() ||
    !password.trim() ||
    !repeatPassword.trim() ||
    !dni.trim() ||
    !direccion.trim() ||
    !provincia.trim() ||
    !barrio.trim() ||
    !telefono.trim() ||
    !ciudad.trim()
  ) {
    Alert.alert('Error', 'Completa todos los campos');
    return;
  }

  if (password !== repeatPassword) {
    Alert.alert('Error', 'Las contraseñas no coinciden');
    return;
  }

  try {
    const apiRole = rol === 'trabajador' ? 'petpal' : 'client';

    const res = await registerUser(
      nombre,
      email,
      password,
      apiRole,
      dni,
      direccion,
      barrio,    
      telefono,  
      ciudad     
    );

    await saveToken(res.token); // ✅ guardamos el token
    Alert.alert('¡Registro exitoso!', `Bienvenido/a ${res.user.name}`);

    // Redirige según el rol:
    if (res.user.role === 'petpal') {
      navigation.replace('PetPalHome');
    } else {
      navigation.replace('Home');
    }
  } catch (error: any) {
    Alert.alert('Error en el registro', error.message || 'Intentalo más tarde');
  }
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 120} // Aumenta el offset
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        scrollEnabled
      >
        {/* Icono principal centrado */}
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
          <Text style={{ color: '#555', fontSize: 14, marginBottom: 0, marginTop: 1, marginLeft: 10 }}>
            {ROL_DESCRIPCIONES[rol]}
          </Text>
        </View>

        <View style={{ marginTop: 18 }}>
          <TextInput
            ref={nombreRef}
            style={commonStyles.input}
            placeholder="Nombre"
            value={nombre}
            onChangeText={setNombre}
            placeholderTextColor="#888"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <TextInput
            ref={emailRef}
            style={commonStyles.input}
            placeholder="Ingresá tu correo"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#888"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <TextInput
            ref={passwordRef}
            style={commonStyles.input}
            placeholder="Ingresá tu contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => repeatPasswordRef.current?.focus()}
          />
          <TextInput
            ref={repeatPasswordRef}
            style={commonStyles.input}
            placeholder="Repetir contraseña"
            value={repeatPassword}
            onChangeText={setRepeatPassword}
            secureTextEntry
            placeholderTextColor="#888"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => dniRef.current?.focus()}
          />
          <TextInput
            ref={dniRef}
            style={commonStyles.input}
            placeholder="DNI"
            value={dni}
            onChangeText={setDni}
            keyboardType="number-pad"
            placeholderTextColor="#888"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => direccionRef.current?.focus()}
          />
          <TextInput
            ref={direccionRef}
            style={commonStyles.input}
            placeholder="Dirección"
            value={direccion}
            onChangeText={setDireccion}
            placeholderTextColor="#888"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => provinciaRef.current?.focus()}
          />
          <TextInput
            ref={provinciaRef}
            style={commonStyles.input}
            placeholder="Provincia"
            value={provincia}
            onChangeText={setProvincia}
            placeholderTextColor="#888"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => barrioRef.current?.focus()}
          />
          <TextInput
            ref={barrioRef}
            style={commonStyles.input}
            placeholder="Barrio"
            value={barrio}
            onChangeText={setBarrio}
            placeholderTextColor="#888"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => telefonoRef.current?.focus()}
          />
          <TextInput
            ref={telefonoRef}
            style={commonStyles.input}
            placeholder="Teléfono"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="number-pad"
            placeholderTextColor="#888"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => ciudadRef.current?.focus()}
          />
          <TextInput
            ref={ciudadRef}
            style={commonStyles.input}
            placeholder="Ciudad"
            value={ciudad}
            onChangeText={setCiudad}
            placeholderTextColor="#888"
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={() => Keyboard.dismiss()}
          />
        </View>

        <TouchableOpacity style={commonStyles.button} onPress={handleRegister}>
          <Icon name="account-plus" size={24} color={colors.white} />
          <Text style={commonStyles.buttonText}>Registrarme</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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