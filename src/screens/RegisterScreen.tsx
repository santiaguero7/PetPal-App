import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../themes/colors';
import { registerUser } from '../services/auth';
import { saveToken } from '../storage/token';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  // Estados de carga y visibilidad
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showRepeatPass, setShowRepeatPass] = useState(false);

  // Datos del formulario
  const [rol, setRol] = useState<'trabajador' | 'cliente'>('cliente');
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  
  // Datos extra (Asegúrate que tu backend los reciba)
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [barrio, setBarrio] = useState('');
  const [direccion, setDireccion] = useState('');

  // Refs
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const repeatPasswordRef = useRef<TextInput>(null);
  const dniRef = useRef<TextInput>(null);
  const telefonoRef = useRef<TextInput>(null);
  const ciudadRef = useRef<TextInput>(null);
  const barrioRef = useRef<TextInput>(null);
  const direccionRef = useRef<TextInput>(null);

  const handleRegister = async () => {
    if (!email.trim() || !nombre.trim() || !password.trim() || !repeatPassword.trim()) {
      Alert.alert('Faltan datos', 'Por favor completá los campos obligatorios');
      return;
    }

    if (password !== repeatPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
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

      await saveToken(res.token);
      
      Alert.alert('¡Bienvenido!', `Hola ${res.user.name}, tu cuenta fue creada con éxito.`, [
        {
          text: 'Continuar',
          onPress: () => {
             if (res.user.role === 'petpal') {
                navigation.replace('PetPalHome');
              } else {
                navigation.replace('Home');
              }
          }
        }
      ]);

    } catch (error: any) {
      Alert.alert('Error en el registro', error.message || 'Intentalo más tarde');
    } finally {
      setIsLoading(false);
    }
  };

  // Componente reutilizable para Inputs
const renderInput = (
    label: string,
    value: string,
    setter: (t: string) => void,
    icon: string,
    placeholder: string,
    // AQUÍ ESTABA EL ERROR: Agregamos " | null" al tipo
    ref?: React.RefObject<TextInput | null>, 
    nextRef?: React.RefObject<TextInput | null>,
    keyboardType: 'default' | 'email-address' | 'number-pad' = 'default',
    isSecure: boolean = false,
    toggleSecure?: () => void,
    isLast: boolean = false
  ) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <Icon name={icon} size={20} color={colors.secondary} style={styles.inputIcon} />
        <TextInput
          // TypeScript puede quejarse al pasar el ref al componente si es muy estricto,
          // así que lo aseguramos como RefObject<TextInput>
          ref={ref as React.RefObject<TextInput>} 
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={setter}
          placeholderTextColor="#A0A0A0"
          keyboardType={keyboardType}
          secureTextEntry={isSecure}
          returnKeyType={isLast ? 'done' : 'next'}
          onSubmitEditing={() => {
            if (nextRef?.current) {
              nextRef.current.focus();
            } else if (isLast) {
              Keyboard.dismiss();
            }
          }}
          blurOnSubmit={isLast}
        />
        {toggleSecure && (
          <TouchableOpacity onPress={toggleSecure} style={{ padding: 5 }}>
            <Icon name={isSecure ? "eye-off-outline" : "eye-outline"} size={20} color="#A0A0A0" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" backgroundColor="#F6FFF8" />
      
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        extraScrollHeight={50}
      >
        
        {/* Header Simple */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Crear Cuenta</Text>
            <Text style={styles.headerSubtitle}>Únete a la comunidad PetPal</Text>
          </View>
        </View>

        {/* Selección de Rol - Estilo Tarjetas */}
        <Text style={styles.sectionTitle}>¿Cómo vas a usar PetPal?</Text>
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleCard, rol === 'cliente' && styles.roleCardActive]}
            onPress={() => setRol('cliente')}
            activeOpacity={0.8}
          >
            <Icon 
              name="face-man-profile" 
              size={32} 
              color={rol === 'cliente' ? '#FFF' : colors.primary} 
            />
            <Text style={[styles.roleText, rol === 'cliente' && styles.roleTextActive]}>
              Cliente
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, rol === 'trabajador' && styles.roleCardActive]}
            onPress={() => setRol('trabajador')}
            activeOpacity={0.8}
          >
            <Icon 
              name="briefcase-outline" 
              size={32} 
              color={rol === 'trabajador' ? '#FFF' : colors.primary} 
            />
            <Text style={[styles.roleText, rol === 'trabajador' && styles.roleTextActive]}>
              PetPal
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.roleInfoContainer}>
          <Text style={styles.roleDescription}>
            {rol === 'trabajador' 
              ? 'Ofrece tus servicios de paseo y cuidado.' 
              : 'Encuentra cuidadores y paseadores de confianza.'}
          </Text>
        </View>

        {/* Formulario */}
        <View style={styles.formSection}>
          
          {/* Datos de Cuenta */}
          <Text style={styles.groupTitle}>Datos de Cuenta</Text>
          {renderInput('Nombre Completo', nombre, setNombre, 'account-outline', 'Juan Pérez', undefined, emailRef)}
          {renderInput('Correo Electrónico', email, setEmail, 'email-outline', 'hola@petpal.com', emailRef, passwordRef, 'email-address')}
          
          {renderInput('Contraseña', password, setPassword, 'lock-outline', '••••••••', passwordRef, repeatPasswordRef, 'default', !showPass, () => setShowPass(!showPass))}
          
          {renderInput('Repetir Contraseña', repeatPassword, setRepeatPassword, 'lock-check-outline', '••••••••', repeatPasswordRef, dniRef, 'default', !showRepeatPass, () => setShowRepeatPass(!showRepeatPass))}

          {/* Datos Personales */}
          <View style={styles.divider} />
          <Text style={styles.groupTitle}>Información Personal</Text>
          
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              {renderInput('DNI', dni, setDni, 'card-account-details-outline', '12345678', dniRef, telefonoRef, 'number-pad')}
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              {renderInput('Teléfono', telefono, setTelefono, 'phone-outline', '351...', telefonoRef, ciudadRef, 'number-pad')}
            </View>
          </View>

          <View style={styles.row}>
             <View style={{ flex: 1, marginRight: 8 }}>
                {renderInput('Ciudad', ciudad, setCiudad, 'city-variant-outline', 'Córdoba', ciudadRef, barrioRef)}
             </View>
             <View style={{ flex: 1, marginLeft: 8 }}>
                {renderInput('Barrio', barrio, setBarrio, 'map-marker-outline', 'Centro', barrioRef, direccionRef)}
             </View>
          </View>

          {renderInput('Dirección', direccion, setDireccion, 'home-map-marker', 'Av. Colón 1234', direccionRef, undefined, 'default', false, undefined, true)}

        </View>

        {/* Botón de Registro */}
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
             <ActivityIndicator color="#FFF" />
          ) : (
             <>
               <Text style={styles.submitButtonText}>Crear Cuenta</Text>
               <Icon name="chevron-right" size={24} color="#FFF" style={{ marginLeft: 8 }} />
             </>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
           <Text style={{ color: '#666' }}>¿Ya tienes cuenta? </Text>
           <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Inicia Sesión</Text>
           </TouchableOpacity>
        </View>

      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F6FFF8', // Mismo fondo soft que Login
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: Platform.OS === 'android' ? 20 : 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  backButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.secondary,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 15,
    marginLeft: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    // Sombras suaves
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  roleCardActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    elevation: 6,
    shadowOpacity: 0.3,
  },
  roleText: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '600',
    color: colors.secondary,
  },
  roleTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  roleInfoContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  roleDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    backgroundColor: '#E8F5E9', // Verde muy clarito
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  formSection: {
    marginBottom: 20,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 15,
    marginTop: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 16, // Pill shape
    paddingHorizontal: 15,
    height: 52,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    height: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 20,
    width: '80%',
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 10,
    marginBottom: 30,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});