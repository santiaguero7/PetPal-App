export interface User {
  id: string;
  nombre: string;
  email: string;
  password: string;
  tipo: 'cuidador' | 'paseador' | 'cliente';
  telefono?: string;
  direccion?: string;
  // agrega más campos según lo necesites
}

export interface Pet {
  id: string;
  nombre: string;
  especie: string;
  raza?: string;
  edad?: number;
  peso?: number;
  caracteristicas?: string;
  // agrega más campos según lo necesites
}