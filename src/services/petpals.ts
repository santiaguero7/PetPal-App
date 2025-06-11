// src/services/petpals.ts
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

export const searchPetpalsByMascota = async (
  mascotaId: number,
  location: string,
  service_type: string
) => {
  const token = await getToken();
  if (!token) throw new Error('Token no disponible');

  const response = await api.get(`/petpals/search/${mascotaId}`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { location, service_type },
  });

  return response.data.data;
};

export const createPetpal = async ({
  service_type,
  price_per_hour,
  price_per_day,
  experience,
  location,
  pet_type,
  size_accepted,
}: {
  service_type: 'dog walker' | 'caregiver';
  price_per_hour: number | null;
  price_per_day: number | null;
  experience: string;
  location: string;
  pet_type: 'dog' | 'cat';
  size_accepted: 'small' | 'medium' | 'large' | 'all';
}) => {
  const token = await getToken();
  if (!token) throw new Error('Token no disponible');

  const response = await api.post(
    '/petpals',
    {
      service_type,
      price_per_hour,
      price_per_day,
      experience,
      location,
      pet_type,
      size_accepted,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data;
};

export const getMyPetpals = async () => {
  const token = await getToken();
  if (!token) throw new Error('Token no disponible');
  const response = await api.get('/petpals/user', {
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