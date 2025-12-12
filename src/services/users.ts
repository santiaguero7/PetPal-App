import api from '../../api';
import { getToken } from '../storage/token';

// 🟢 NUEVO: Obtener datos del usuario logueado (Perfil propio)
// Usa el endpoint /users/me que creamos en el backend
export const getMe = async () => {
  const token = await getToken();
  if (!token) throw new Error('Token no disponible');

  const response = await api.get('/users/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// 🟢 Obtener datos de OTRO usuario (ej: un cliente viendo el perfil de un paseador)
export const getUserById = async (id: number) => {
  const token = await getToken();

  const response = await api.get(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

// 🟢 Actualizar perfil
// Nota: Ahora el backend acepta latitude, longitude y profile_picture en 'data'
export const updateUser = async (id: number, data: any) => {
  const token = await getToken();
  
  // Puedes usar la ruta específica ID o la ruta /me. 
  // Por compatibilidad con tu código actual, mantenemos el ID.
  const response = await api.put(`/users/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};