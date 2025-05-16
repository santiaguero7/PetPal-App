import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';
import { usePets } from '../context/PetsContext';

// Define las propiedades de navegación para esta pantalla
// Indica que AddPetScreen pertenece al stack de navegación con la ruta 'AddPet'
type Props = NativeStackScreenProps<RootStackParamList, 'AddPet'>;

export default function AddPetScreen({ navigation }: Props) {
  // Estados para almacenar los datos del formulario
  const [nombre, setNombre] = useState(''); // Guarda el nombre de la mascota
  const [tipo, setTipo] = useState('');    // Guarda el tipo/raza de la mascota
  const { addPet } = usePets();

  // Función que se ejecuta al presionar el botón Guardar
  const handleAddPet = () => {
    if (nombre && tipo) {
      addPet({ nombre, especie: tipo });
      navigation.goBack(); // Regresa a la pantalla anterior (PetsScreen)
    }
  };

  return (
    <View style={styles.container}>
      {/* Título de la pantalla */}
      <Text style={styles.title}>Agregar Mascota</Text>
      
      {/* Input para el nombre de la mascota */}
      <TextInput
        style={styles.input}
        placeholder="Nombre de la mascota"
        value={nombre}
        onChangeText={setNombre}  // Actualiza el estado 'nombre' al escribir
      />
      
      {/* Input para el tipo de mascota */}
      <TextInput
        style={styles.input}
        placeholder="Tipo (perro, gato, etc.)"
        value={tipo}
        onChangeText={setTipo}  // Actualiza el estado 'tipo' al escribir
      />
      
      {/* Botón para guardar la nueva mascota */}
      <Button 
        title="Guardar" 
        onPress={handleAddPet}  // Ejecuta la función al presionar
      />
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: { 
    flex: 1, // Ocupa todo el espacio disponible
    justifyContent: 'center', // Centra el contenido verticalmente
    padding: 16 // Espaciado interno
  },
  title: {
    fontSize: 24, // Tamaño de fuente grande
    marginBottom: 16, // Espacio inferior
    textAlign: 'center' // Texto centrado
  },
  input: {
    borderWidth: 1, // Borde del input
    borderColor: '#ccc', // Color del borde (gris claro)
    padding: 8, // Espaciado interno
    marginBottom: 12, // Espacio inferior entre inputs
    borderRadius: 4 // Bordes redondeados
  }
});