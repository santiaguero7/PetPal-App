// src/services/reservations.ts
import api from '../../api';
import { getToken } from '../storage/token';

export const createReservation = async (payload: {
  client_id: number;
  petpal_id: number;
  pet_id: number;
  service_type: 'dog walker' | 'caregiver';
  date_start: string;
  date_end: string;
}) => {
  const token = await getToken();
  const res = await api.post('/reservations', payload, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
