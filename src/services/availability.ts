import api from '../../api';
import { getToken } from '../storage/token';// ... imports anteriores


export interface TimeSlot {
  time: string;       // "14:00"
  status: 'busy' | 'free'; 
}

export interface DayAvailability {
  working: boolean;
  slots: TimeSlot[];
}

export const getDaySlots = async (petpalId: number, dateStr: string): Promise<DayAvailability> => {
  const token = await getToken();
  const response = await api.get('/availability/slots', {
    params: { petpalId, date: dateStr },
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export interface Schedule {
  day_of_week: number; // 0 = Domingo, 1 = Lunes...
  start_time: string;  // "09:00"
  end_time: string;    // "18:00"
}

export const getPetPalSchedule = async (petpalId: number): Promise<Schedule[]> => {
  const token = await getToken();
  const response = await api.get(`/availability/${petpalId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

