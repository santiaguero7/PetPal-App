// src/services/petpals.ts
import api from '../../api';
import { getToken } from '../storage/token';

export const getAllPetpals = async () => {
  const token = await getToken();

  if (!token) {
    throw new Error('Token no disponible');
  }

  const response = await api.get('/petpals', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; // array de petpals
};

export const searchPetpalsByMascota = async (
  mascotaId: number,
  location: string,
  serviceType: string
) => {
  const token = await getToken();
  const response = await api.get(`/petpals/search/${mascotaId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      location,
      service_type: serviceType,
    },
  });
  return response.data.data;
};

