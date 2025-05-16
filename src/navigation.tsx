import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // Contenedor principal de navegación
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Creador de navegación en stack

// Importación de pantallas
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen'; 
import HomeScreen from './screens/HomeScreen'; 
import ProfileScreen from './screens/ProfileScreen'; 
import PetsScreen from './screens/PetsScreen'; 
import AddPetScreen from './screens/AddPetScreen'; 

// Define los tipos de rutas y sus parámetros (todas sin parámetros inicialmente)
export type RootStackParamList = {
  Login: undefined;    // No requiere parámetros
  Register: undefined; // No requiere parámetros  
  Home: undefined;     // Pantalla principal
  Profile: undefined;  // Perfil de usuario
  Pets: undefined;     // Listado de mascotas
  AddPet: undefined;   // Formulario de mascotas
};

const Stack = createNativeStackNavigator<RootStackParamList>(); // Crea el navegador con tipado

// Componente principal de navegación
export default function AppNavigator() {
  return (
    //* Contenedor obligatorio para la navegación *//
    //* Stack de navegación inicia en Login *//
    <NavigationContainer> 
      <Stack.Navigator initialRouteName="Login"> 
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Pets" component={PetsScreen} />
        <Stack.Screen name="AddPet" component={AddPetScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}