import React, { useRef, useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  Keyboard,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { colors } from '../themes/colors';
import { commonStyles } from '../themes/commonStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { loginUser } from '../services/auth';
import { saveToken } from '../storage/token';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);
      await saveToken(res.token);
      if (res.user.role === 'petpal') {
        navigation.replace('PetPalHome');
      } else {
        navigation.replace('Home');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al iniciar sesión');
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#F6FFF8' }}
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingTop: 150,
        paddingHorizontal: 24,
        paddingBottom: 24,
      }}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 20 : 20}
    >
      <Image
        source={require('../../assets/LogoPetPal.png')}
        style={{
          width: '100%',
          height: 170,
          resizeMode: 'contain',
          marginTop: 24,
        }}
      />

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

      <Text style={[commonStyles.label, { color: colors.secondary }]}>Correo</Text>
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
      />

      <Text style={[commonStyles.label, { color: colors.secondary }]}>Contraseña</Text>
      <TextInput
        ref={passwordRef}
        style={commonStyles.input}
        placeholder="Ingresá tu contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={colors.muted}
        returnKeyType="done"
        onSubmitEditing={() => Keyboard.dismiss()}
        autoCorrect={false}
      />

      <TouchableOpacity style={commonStyles.button} onPress={handleLogin}>
        <Text style={commonStyles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Button
        title="¿No tienes cuenta? Regístrate"
        color={colors.secondary}
        onPress={() => navigation.navigate('Register')}
      />

    </KeyboardAwareScrollView>
  );
}