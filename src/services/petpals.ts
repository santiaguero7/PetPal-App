import api from '../../api';
import { getToken } from '../storage/token';

export const getAllPetpals = async () => {
  const token = await getToken();
  if (!token) throw new Error('Token no disponible');

  const response = await api.get('/petpals', {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

// 🔍 BÚSQUEDA INTELIGENTE (Actualizada)
export const searchPetpalsByMascota = async (
  mascotaId: number,
  location: string, // Se mantiene por compatibilidad visual, pero lo importante son lat/lng
  service_type: string,
  coords?: { lat: number; lng: number } // 📍 Nuevos parámetros opcionales
) => {
  const token = await getToken();
  if (!token) throw new Error('Token no disponible');

  // Construimos la URL base
  let url = `/petpals/search/match/${mascotaId}`;
  
  // Si tenemos coordenadas, las enviamos como Query Params
  const params: any = { service_type };
  
  if (coords) {
    params.lat = coords.lat;
    params.lng = coords.lng;
  }
  // Si no hay coords, el backend usará la dirección del perfil del usuario

  const response = await api.get(url, {
    headers: { Authorization: `Bearer ${token}` },
    params: params,
  });

  // El backend nuevo devuelve: { message: "...", data: [...] }
  return response.data.data;
};

// 📝 CREAR ANUNCIO (Actualizado con Título y Geo)
export const createPetpal = async ({
  title, // 🆕 Nuevo campo obligatorio
  service_type,
  price_per_hour,
  price_per_day,
  experience,
  location,
  pet_type,
  size_accepted,
  latitude,  // 📍 Nuevo
  longitude, // 📍 Nuevo
  range_km   // 📍 Nuevo
}: {
  title: string;
  service_type: 'dog walker' | 'caregiver';
  price_per_hour: number | null;
  price_per_day: number | null;
  experience: string;
  location: string;
  pet_type: 'dog' | 'cat';
  size_accepted: 'small' | 'medium' | 'large' | 'all';
  latitude: number;
  longitude: number;
  range_km?: number;
}) => {
  const token = await getToken();
  if (!token) throw new Error('Token no disponible');

  const response = await api.post(
    '/petpals',
    {
      title,
      service_type,
      price_per_hour,
      price_per_day,
      experience,
      location,
      pet_type,
      size_accepted,
      latitude,
      longitude,
      range_km: range_km || 5 // Default 5km si no se envía
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

// 📂 MIS ANUNCIOS (Ruta corregida)
export const getMyPetpals = async () => {
  const token = await getToken();
  if (!token) throw new Error('Token no disponible');
  
  // CAMBIO DE RUTA: Antes /petpals/user, Ahora /petpals/my-ads
  const response = await api.get('/petpals/my-ads', {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  return Array.isArray(response.data) ? response.data : response.data.data ?? [];
};

export const updatePetpalById = async (id: number, data: any) => {
  const token = await getToken();
  if (!token) throw new Error('Token no disponible');
  
  const response = await api.put(`/petpals/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getPetpalById = async (id: number) => {
  const token = await getToken();
  if (!token) throw new Error('Token no disponible');

  const resp = await api.get(`/petpals/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return resp.data; 
};