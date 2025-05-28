// AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// SafeAreaView no es necesario aquí si solo usas insets
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import AddPetScreen from './screens/AddPetScreen'; // Asegúrate de que esté definido en RootStackParamList si es una pantalla del Stack
import SearchScreen from './screens/SearchScreen';
import ServicesScreen from './screens/ServicesScreen';
import PetPalHomeScreen from './screens/PetPalHomeScreen';
import PetPalProfileScreen from './screens/PetPalProfileScreen';
import PetPalRequestScreen from './screens/PetPalRequestsScreen'; // Corregido nombre de import si el archivo es PetPalRequest.tsx

// Tipo para el stack principal
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined; // Representa el flujo de MainTabs
  PetPalHome: undefined; // Representa el flujo de PetPalTabs
  AddPet: undefined; // Si AddPet es una pantalla a la que se navega desde los tabs, podría necesitar parámetros
  // Si PetPalProfile o PetPalRequest son también pantallas del Stack a las que se navega directamente, añádelas aquí.
  // Por ahora, asumimos que son solo parte de PetPalTabs.
};

// Tipos para los tabs de usuario general
export type MainTabParamList = {
  Inicio: undefined;
  Buscar: undefined;
  Servicios: undefined;
  Perfil: undefined;
};

// Tipos para los tabs de PetPal
export type PetPalTabParamList = {
  InicioPetPal: undefined; // Renombrado para evitar colisión si se usara un solo TabParamList
  Solicitudes: undefined;
  PerfilPetPal: undefined; // Renombrado para evitar colisión
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const MainAppTab = createBottomTabNavigator<MainTabParamList>();
const PetPalAppTab = createBottomTabNavigator<PetPalTabParamList>();

function MainTabs() {
  const insets = useSafeAreaInsets();

  return (
    <MainAppTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6FCF97',
        tabBarInactiveTintColor: '#BDBDBD',
        tabBarStyle: {
          backgroundColor: '#E8F6EF',
          borderTopWidth: 0,
          height: 50 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: { fontSize: 13, marginBottom: 6 },
      }}
    >
      <MainAppTab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={28} />,
        }}
      />
      <MainAppTab.Screen
        name="Buscar"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="magnify" color={color} size={28} />,
        }}
      />
      <MainAppTab.Screen
        name="Servicios"
        component={ServicesScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="clipboard-list" color={color} size={28} />,
        }}
      />
      <MainAppTab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="account" color={color} size={28} />,
        }}
      />
    </MainAppTab.Navigator>
  );
}

function PetPalTabs() {
  const insets = useSafeAreaInsets();

  return (
    <PetPalAppTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6FCF97',
        tabBarInactiveTintColor: '#BDBDBD',
        tabBarStyle: {
          backgroundColor: '#E8F6EF',
          borderTopWidth: 0,
          height: 50 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: { fontSize: 13, marginBottom: 6 },
      }}
    >
      {/* Es común que la pantalla "Inicio" de PetPal sea diferente */}
      <PetPalAppTab.Screen
        name="InicioPetPal" // Usando el nombre de PetPalTabParamList
        component={PetPalHomeScreen}
        options={{
          title: 'Inicio', // Título que se muestra en el tab
          tabBarIcon: ({ color }) => <Icon name="home-assistant" color={color} size={28} />, // Icono diferente para distinguir?
        }}
      />
      <PetPalAppTab.Screen
        name="Solicitudes"
        component={PetPalRequestScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="bell-ring" color={color} size={28} />, // Icono para solicitudes
        }}
      />
      <PetPalAppTab.Screen
        name="PerfilPetPal" // Usando el nombre de PetPalTabParamList
        component={PetPalProfileScreen}
        options={{
          title: 'Perfil', // Título que se muestra en el tab
          tabBarIcon: ({ color }) => <Icon name="account-tie" color={color} size={28} />, // Icono diferente para distinguir?
        }}
      />
    </PetPalAppTab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        {/* La ruta 'Home' renderiza el conjunto de tabs para clientes */}
        <Stack.Screen name="Home" component={MainTabs} />
        {/* La ruta 'PetPalHome' renderiza el conjunto de tabs para PetPals */}
        <Stack.Screen name="PetPalHome" component={PetPalTabs} />
        
        {/* AddPetScreen parece ser una pantalla a la que se navega, no un tab. */}
        {/* Si se accede desde ambos tipos de usuarios, está bien aquí. */}
        {/* Si es específica de un rol y se accede desde un tab, debería estar dentro del TabNavigator correspondiente */}
        {/* o asegurarse que la navegación a ella pase los parámetros correctos si es necesario. */}
        <Stack.Screen
          name="AddPet"
          component={AddPetScreen}
          // options={{ headerShown: true, title: "Añadir Mascota" }} // Ejemplo si necesitas header
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}