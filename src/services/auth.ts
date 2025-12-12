import api from '../../api';

// Actualizamos para recibir coordenadas y foto opcional
export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: 'client' | 'petpal',
  dni: string,
  direccion: string,
  barrio: string,
  telefono: string,
  ciudad: string,
  // 📍 Nuevos campos para Geolocalización
  latitude?: number | null,
  longitude?: number | null,
  profile_picture?: string | null
) => {
  const response = await api.post('/auth/register', {
    name,
    email,
    password,
    role,
    dni,
    direccion,
    barrio,
    telefono,
    ciudad, // Nota: Asegúrate que tu backend reciba ciudad si la usas, o se ignorará
    latitude,  // ✅ Se envía al backend
    longitude, // ✅ Se envía al backend
    profile_picture
  });
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};