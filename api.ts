// src/api.ts (o donde tengas este archivo)
import axios from 'axios';

// 1. Leemos la variable de Vercel. Si no existe (ej: tu PC local), usa localhost.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  // 2. Le agregamos el "/api" al final automáticamente
  baseURL: `${BASE_URL}/api`, 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;