import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

const TOKEN_KEY = 'user_token';

export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.error('Error al guardar el token:', e);
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (e) {
    console.error('Error al obtener el token:', e);
    return null;
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (e) {
    console.error('Error al eliminar el token:', e);
  }
};

export interface DecodedToken {
  id: number;
  role: string;
  iat: number;
  exp: number;
}

// Función para decodificar el JWT y extraer el payload tipado
export const decodeToken = (token: string): DecodedToken => {
  return jwtDecode<DecodedToken>(token);
};



