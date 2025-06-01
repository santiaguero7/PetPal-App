import api from '../../api';
import { getToken } from '../storage/token';
import axios from 'axios';

const API_URL = 'https://petpal-backend-production.up.railway.app/api';

export const getMyPets = async () => {
  const token = await getToken();
  const response = await api.get('/pets/user', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const updatePetById = async (petId: number, updatedData: any) => {
  const token = await getToken();
  const res = await axios.put(`${API_URL}/pets/${petId}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const deletePetById = async (petId: number) => {
  const token = await getToken();
  const res = await axios.delete(`${API_URL}/pets/${petId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const createPet = async (petData: any) => {
  const token = await getToken();
  const response = await fetch(`${API_URL}/pets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(petData),
  });

  if (!response.ok) throw new Error('Error creando mascota');

  return response.json();
};


