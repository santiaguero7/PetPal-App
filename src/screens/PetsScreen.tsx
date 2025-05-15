import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Pets'>;

export default function PetsScreen({ navigation }: Props) {
  const [pets, setPets] = useState([
    { id: '1', nombre: 'Firulais', especie: 'Perro' },
    { id: '2', nombre: 'Misu', especie: 'Gato' },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Mascotas</Text>
      <FlatList
        data={pets}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.petItem}>
            <Text>{item.nombre} ({item.especie})</Text>
            {/* Botones para editar/eliminar */}
          </View>
        )}
      />
      <Button title="Agregar Mascota" onPress={() => navigation.navigate('AddPet')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
  petItem: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
});