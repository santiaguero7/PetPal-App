// api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://petpal-backend-production.up.railway.app/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
