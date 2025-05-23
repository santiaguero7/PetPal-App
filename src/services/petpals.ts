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
