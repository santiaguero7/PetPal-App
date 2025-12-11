// src/navigation.tsx
import React from 'react';
import { Platform, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// CORRECCIÓN 1: Ruta relativa correcta (./ en lugar de ../)
import { colors } from './themes/colors';

// Import screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import AddPetScreen from './screens/AddPetScreen';
import SearchScreen from './screens/SearchScreen';
import ServicesScreen from './screens/ServicesScreen';
import PetPalHomeScreen from './screens/PetPalHomeScreen';
import PetPalProfileScreen from './screens/PetPalProfileScreen';
import PetPalRequestScreen from './screens/PetPalRequestsScreen'; 
import AddPubScreen from './screens/AddPubScreen'; 
import EditProfileScreen from './screens/EditProfileScreen';

// --- DEFINICIÓN DE TIPOS ---

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined; 
  PetPalHome: undefined;
  AddPet: undefined; 
  AddPub: undefined; 
  EditProfile: undefined;
};

export type MainTabParamList = {
  Inicio: undefined;
  Buscar: { id?: string };
  Servicios: undefined;
  Perfil: undefined;
};

export type PetPalTabParamList = {
  InicioPetPal: undefined;
  Solicitudes: undefined;
  PerfilPetPal: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const MainAppTab = createBottomTabNavigator<MainTabParamList>();
const PetPalAppTab = createBottomTabNavigator<PetPalTabParamList>();

// --- TEMA DE NAVEGACIÓN ---
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FAFAFA',
    primary: colors.primary,
  },
};

// --- COMPONENTES DE TABS ---

function MainTabs() {
  return (
    <MainAppTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
        },
      }}
    >
      {/* CORRECCIÓN 2: Usamos 'as any' para evitar conflictos de tipos estrictos */}
      <MainAppTab.Screen
        name="Inicio"
        component={HomeScreen as any}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "home" : "home-outline"} color={color} size={28} />
          ),
        }}
      />
      <MainAppTab.Screen
        name="Buscar"
        component={SearchScreen as any}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "magnify" : "magnify"} color={color} size={28} />
          ),
        }}
      />
      <MainAppTab.Screen
        name="Servicios"
        component={ServicesScreen as any}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "paw" : "paw-outline"} color={color} size={28} />
          ),
        }}
      />
      <MainAppTab.Screen
        name="Perfil"
        component={ProfileScreen as any}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "account" : "account-outline"} color={color} size={28} />
          ),
        }}
      />
    </MainAppTab.Navigator>
  );
}

function PetPalTabs() {
  return (
    <PetPalAppTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 10,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: -2,
        },
      }}
    >
      <PetPalAppTab.Screen
        name="InicioPetPal"
        component={PetPalHomeScreen as any}
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "view-dashboard" : "view-dashboard-outline"} color={color} size={28} />
          ),
        }}
      />
      <PetPalAppTab.Screen
        name="Solicitudes"
        component={PetPalRequestScreen as any}
        options={{
          tabBarBadge: 3, 
          tabBarBadgeStyle: { backgroundColor: '#E53935', fontSize: 10 },
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "clipboard-text" : "clipboard-text-outline"} color={color} size={28} />
          ),
        }}
      />
      <PetPalAppTab.Screen
        name="PerfilPetPal"
        component={PetPalProfileScreen as any}
        options={{
          title: 'Mi Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Icon name={focused ? "account-tie" : "account-tie-outline"} color={color} size={28} />
          ),
        }}
      />
    </PetPalAppTab.Navigator>
  );
}

// --- NAVEGADOR PRINCIPAL (STACK) ---

export default function AppNavigator() {
  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator 
        initialRouteName="Login" 
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right', 
          contentStyle: { backgroundColor: '#FAFAFA' }
        }}
      >
        {/* Auth Flows */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Main Flows */}
        <Stack.Screen name="Home" component={MainTabs} options={{ animation: 'fade' }} />
        <Stack.Screen name="PetPalHome" component={PetPalTabs} options={{ animation: 'fade' }} />

        {/* Sub Screens */}
        <Stack.Screen 
          name="AddPet" 
          component={AddPetScreen} 
          options={{ presentation: 'modal' }} 
        />
        <Stack.Screen name="AddPub" component={AddPubScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}