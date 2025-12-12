import api from '../../api';
import { getToken } from '../storage/token';

// 🟢 CREAR RESERVA (Con profile_id obligatorio)
export const createReservation = async (payload: {
  petpal_id: number;
  profile_id: number;
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

// 🟢 OBTENER HISTORIAL (Unificado)
export async function getReservationHistory() {
  const token = await getToken();
  
  const res = await api.get('/reservations/history', {
    headers: { Authorization: `Bearer ${token}` },
  });
  
  return res.data.data; 
};

// Alias para compatibilidad
export const getPetPalReservations = getReservationHistory;

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