import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

export default function RegisterScreen() {
  // Estados para almacenar los datos del formulario
  const [nombre, setNombre] = useState(''); // Nombre completo del usuario
  const [email, setEmail] = useState(''); // Correo electrónico
  const [password, setPassword] = useState(''); // Contraseña (se muestra oculta)
  const [tipo, setTipo] = useState('cuidador'); // Tipo de usuario (cuidador/paseador)

  // Función que maneja el envío del formulario
  const handleRegister = () => {
    // (Futura implementación: validación y envío de datos al servidor)
    console.log('Datos a registrar:', { nombre, email, password, tipo });
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container} // Permite hacer scroll en pantallas pequeñas
      keyboardShouldPersistTaps="handled" // Mejor manejo del teclado en iOS/Android
    >
      {/* Título del formulario */}
      <Text style={styles.title}>Registro</Text>

      {/* Campo para nombre completo */}
      <TextInput 
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      {/* Campo para email con teclado especializado */}
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address" // Muestra teclado optimizado para emails
        autoCapitalize="none" // Evita mayúsculas automáticas
      />

      {/* Campo para contraseña (texto oculto) */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry // Oculta los caracteres
      />

      {/* Campo para seleccionar tipo de usuario */}
      <TextInput
        style={styles.input}
        placeholder="Tipo (cuidador/paseador)"
        value={tipo}
        onChangeText={setTipo}
      />

      {/* Botón de registro */}
      <Button 
        title="Registrarse" 
        onPress={handleRegister} 
      />
    </ScrollView>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    justifyContent: 'center', 
  },
  title: {
    fontSize: 24,
    marginBottom: 16, 
    textAlign: 'center' 
  },
  input: {
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 8, 
    marginBottom: 12,
    borderRadius: 4
  }
});