import React, { useRef, useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  Alert,
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { colors } from '../themes/colors'; // Asegúrate que colors tenga primary, secondary, text, etc.
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { loginUser } from '../services/auth';
import { saveToken } from '../storage/token';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Atención', 'Por favor completá todos los campos');
      return;
    }

    setIsLoading(true);
    Keyboard.dismiss();

    try {
      // El backend devuelve token y user con role
      const res = await loginUser(email, password);
      await saveToken(res.token);
      
      if (res.user.role === 'petpal') {
        navigation.replace('PetPalHome');
      } else {
        navigation.replace('Home');
      }
    } catch (error: any) {
      Alert.alert('Ups', error.message || 'No pudimos iniciar sesión. Verificá tus datos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Decoración de fondo superior (Círculo orgánico) */}
      <View style={styles.topShape} />

      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Header con Logo */}
        <View style={styles.headerContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/LogoPetPal.png')}
              style={styles.logo}
            />
          </View>
          <Text style={styles.welcomeText}>¡Hola de nuevo CI-CD!</Text>
          <Text style={styles.subText}>Tu mascota te espera 🐾</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          
          {/* Input Email */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Correo Electrónico</Text>
            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={20} color={colors.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="ejemplo@petpal.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.muted || '#A0A0A0'}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
            </View>
          </View>

          {/* Input Password */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={20} color={colors.secondary} style={styles.inputIcon} />
              <TextInput
                ref={passwordRef}
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
                placeholderTextColor={colors.muted || '#A0A0A0'}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Icon 
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={colors.muted || '#A0A0A0'} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password Link - */}
          <TouchableOpacity 
            style={styles.forgotPassword} 
            onPress={() => navigation.navigate('ForgotPassword' as any)} // Asumiendo que crearás esta pantalla
          >
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Botón Principal */}
          <TouchableOpacity 
            style={styles.mainButton} 
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.mainButtonText}>Ingresar</Text>
            )}
          </TouchableOpacity>

          {/* Separador */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Botón Registro */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Fondo limpio
  },
  topShape: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#F6FFF8', // Tu color original de fondo, ahora como acento
    opacity: 0.8,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 60,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: '#fff',
    borderRadius: 30, // Forma orgánica para el logo
    padding: 10,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: 16,
    color: colors.secondary,
    marginTop: 5,
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: colors.text || '#333',
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 16, // Bordes muy redondeados (Pill shape)
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotText: {
    color: colors.secondary,
    fontWeight: '600',
    fontSize: 14,
  },
  mainButton: {
    backgroundColor: colors.primary,
    borderRadius: 20, // Botón bien redondeado
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  mainButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#A0A0A0',
    fontWeight: 'bold',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#666',
    fontSize: 15,
  },
  registerLink: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
});