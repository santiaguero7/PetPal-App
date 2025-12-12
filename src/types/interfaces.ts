// src/types/interfaces.ts

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'petpal';
  dni?: string;
  direccion?: string;
  barrio?: string;
  telefono?: string;
  profile_picture?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface Pet {
  id: number;
  user_id: number;
  name: string;
  breed?: string;
  age?: number;
  weight: number;
  pet_type: 'dog' | 'cat';
  description?: string;
}

// 🆕 Nuevo Modelo de Anuncio (Antes era perfil único)
export interface PetpalAd {
  id: number;
  user_id: number;
  title: string;          // Nuevo
  service_type: 'dog walker' | 'caregiver';
  price_per_hour?: number;
  price_per_day?: number;
  experience?: string;
  location: string;
  pet_type: 'dog' | 'cat';
  size_accepted: 'small' | 'medium' | 'large' | 'all';
  latitude: number;       // Nuevo
  longitude: number;      // Nuevo
  range_km: number;       // Nuevo
  status: 'active' | 'paused' | 'hidden';
  
  // Campos extra que vienen del JOIN con User
  user_name?: string;
  profile_picture?: string;
  distance?: number; // Calculado por Haversine
}

// 🆕 Nuevo Modelo de Reserva
export interface Reservation {
  id: number;
  client_id: number;
  petpal_id: number;
  profile_id: number;    // Nuevo (ID del anuncio)
  pet_id: number;
  service_type: 'dog walker' | 'caregiver';
  date_start: string;
  date_end: string;
  total_price: number;   // Nuevo
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  payment_status: 'pending' | 'approved' | 'rejected';

  // Datos expandidos para mostrar en la UI
  client_name?: string;
  petpal_name?: string;
  pet_name?: string;
  service_title?: string; // El título del anuncio contratado
}