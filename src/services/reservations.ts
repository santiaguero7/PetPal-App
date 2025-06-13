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

export async function getPetPalReservations() {
  const token = await getToken();
  const res = await fetch('https://petpal-backend-production.up.railway.app/api/reservations/petpal/1', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const json = await res.json();
  console.log('Respuesta reservas PetPal:', json);
  return json.data;
};


export async function updateReservationStatus(
  id: number,
  status: 'accepted' | 'rejected'
): Promise<{ message: string }> {
  const token = await getToken();
  const { data } = await api.put(
    `/reservations/${id}/status`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
}

