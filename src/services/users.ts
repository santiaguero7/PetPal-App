import api from '../../api';
import { getToken } from '../storage/token';

export const getUserById = async (id: number) => {
  const token = await getToken();

  const response = await api.get(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
