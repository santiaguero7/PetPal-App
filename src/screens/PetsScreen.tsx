import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

// Define las propiedades de navegación para esta pantalla
// Indica que PetsScreen pertenece al stack de navegación y está asociada a la ruta 'Pets'
type Props = NativeStackScreenProps<RootStackParamList, 'Pets'>;

export default function PetsScreen({ navigation }: Props) {
  // Estado que almacena la lista de mascotas
  // Cada mascota tiene: id (identificador único), nombre y especie
  const [pets, setPets] = useState([
    { id: '1', nombre: 'Firulais', especie: 'Perro' },
    { id: '2', nombre: 'Misu', especie: 'Gato' },
    { id: '3', nombre: 'Pico', especie: 'Loro' },
    { id: '4', nombre: 'Nube', especie: 'Conejo' }, 
  ]);

  return (
    <View style={styles.container}>
      {/* Título de la pantalla */}
      <Text style={styles.title}>Mis Mascotas</Text>
      
      {/* Lista de mascotas usando FlatList (óptima para listas largas) */}
      <FlatList
        data={pets} // Datos a mostrar (array de mascotas)
        keyExtractor={item => item.id} // Extrae el id como clave única
        renderItem={({ item }) => ( // Cómo renderizar cada item
          <View style={styles.petItem}>
            {/* Muestra nombre y especie de cada mascota */}
            <Text>{item.nombre} ({item.especie})</Text>
            {/* Espacio reservado para futuros botones de editar/eliminar */}
          </View>
        )}
      />
      
      {/* Botón para navegar a la pantalla de agregar mascota */}
      <Button 
        title="Agregar Mascota" 
        onPress={() => navigation.navigate('AddPet')} 
      />
    </View>
  );
}

// Estilos del componente
const styles = StyleSheet.create({
  container: { 
    flex: 1, // Ocupa todo el espacio disponible
    padding: 16 // Espaciado interno
  },
  title: { 
    fontSize: 24, // Tamaño de fuente grande
    marginBottom: 16, // Espacio inferior
    textAlign: 'center' // Texto centrado
  },
  petItem: { 
    padding: 12, // Espaciado interno para cada item
    borderBottomWidth: 1, // Línea divisoria inferior
    borderColor: '#eee' // Color claro para la línea divisoria
  },
});