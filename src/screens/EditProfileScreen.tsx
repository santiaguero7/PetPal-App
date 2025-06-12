import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, ScrollView, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import { commonStyles } from '../themes/commonStyles';
import { getUserById, updateUser } from '../services/users';
import { getToken } from '../storage/token';
import ScreenHeader from '../components/ScreenHeader';
import { jwtDecode } from 'jwt-decode';

import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  EditProfile: undefined;
  // Agrega aquí otras pantallas si es necesario
};

type EditProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditProfile'
>;

interface EditProfileScreenProps {
  navigation: EditProfileScreenNavigationProp;
}

export default function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [dni, setDni] = useState('');
  const [direccion, setDireccion] = useState('');
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
  const barrioRef = useRef<TextInput>(null);
  const telefonoRef = useRef<TextInput>(null);
  const ciudadRef = useRef<TextInput>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await getToken();
      if (!token) {
        Alert.alert('Error', 'No se pudo obtener el token de usuario.');
        setLoading(false);
        return;
      }
      const decoded: any = jwtDecode(token);
      setUserId(decoded.id);
      const user = await getUserById(decoded.id);
      setNombre(user.name || '');
      setEmail(user.email || '');
      setDni(user.dni || '');
      setDireccion(user.direccion || '');
      setBarrio(user.barrio || '');
      setTelefono(user.telefono || '');
      setCiudad(user.ciudad || '');
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    if (
      !email.trim() ||
      !nombre.trim() ||
      !dni.trim() ||
      !direccion.trim() ||
      !barrio.trim() ||
      !telefono.trim() ||
      !ciudad.trim()
    ) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    if (password && password !== repeatPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    if (userId === null) {
      Alert.alert('Error', 'No se pudo obtener el ID de usuario.');
      return;
    }
    try {
      await updateUser(userId, {
        name: nombre,
        email,
        password: password || undefined, // Solo si se quiere cambiar
        dni,
        direccion,
        barrio,
        telefono,
        ciudad,
      });
      Alert.alert('¡Perfil actualizado!');
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar');
    }
  };

  if (loading) return <Text style={{ margin: 30, textAlign: 'center' }}>Cargando...</Text>;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={{ height: Platform.OS === 'ios' ? 48 : StatusBar.currentHeight || 24 }} />
      <ScrollView
        contentContainerStyle={{ padding: 18, backgroundColor: '#F6FFF8' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader title="Editar perfil" subtitle="Actualiza tus datos personales" />

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
            autoCapitalize="words"
          />
          <TextInput
            ref={emailRef}
            style={commonStyles.input}
            placeholder="Correo"
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
            placeholder="Nueva contraseña (opcional)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => repeatPasswordRef.current?.focus()}
            autoCapitalize="none"
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
            autoCapitalize="none"
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
            onSubmitEditing={() => telefonoRef.current?.focus()}
            autoCapitalize="none"
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
            autoCapitalize="none"
          />
          <TextInput
            ref={ciudadRef}
            style={commonStyles.input}
            placeholder="Ciudad"
            value={ciudad}
            onChangeText={setCiudad}
            placeholderTextColor="#888"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => barrioRef.current?.focus()}
            autoCapitalize="words"
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
            onSubmitEditing={() => direccionRef.current?.focus()}
            autoCapitalize="words"
          />
          <TextInput
            ref={direccionRef}
            style={commonStyles.input}
            placeholder="Dirección"
            value={direccion}
            onChangeText={setDireccion}
            placeholderTextColor="#888"
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={() => Keyboard.dismiss()}
            autoCapitalize="words"
          />
        </View>

        <TouchableOpacity style={commonStyles.button} onPress={handleSave}>
          <Icon name="content-save" size={24} color={colors.white} />
          <Text style={commonStyles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}