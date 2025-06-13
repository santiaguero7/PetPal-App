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
): Promise<any> {
  const token = await getToken();
  const response = await fetch(
    `https://petpal-backend-production.up.railway.app/api/reservations/petpal/${id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update reservation status');
  }

  return response.json();
}
