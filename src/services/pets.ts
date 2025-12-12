import api from '../../api';
import { getToken } from '../storage/token';

// 🟢 OBTENER MIS MASCOTAS
export const getMyPets = async () => {
  const token = await getToken();
  // CAMBIO DE RUTA: Antes /pets/user, Ahora /pets/user/me
  const response = await api.get('/pets/user/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updatePetById = async (petId: number, updatedData: any) => {
  const token = await getToken();
  const response = await api.put(`/pets/${petId}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deletePetById = async (petId: number) => {
  const token = await getToken();
  const response = await api.delete(`/pets/${petId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createPet = async (petData: any) => {
  const token = await getToken();
  const response = await api.post('/pets', petData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};