import React, { createContext, useContext, useState } from 'react';

// Tipo para mascotas (id, nombre, especie)
export type Pet = {
  id: string;
  nombre: string;
  especie: string;
  tamano: 'chica' | 'mediana' | 'grande';
  raza: string;
  edad: string;
  descripcion?: string;
};

type PetsContextType = {
  pets: Pet[];
  addPet: (pet: Omit<Pet, 'id'>) => void;
  editPet: (id: string, pet: Omit<Pet, 'id'>) => void;
  removePet: (id: string) => void;
};

const PetsContext = createContext<PetsContextType | undefined>(undefined);

// Proveedor del contexto (envuelve la app)
export const PetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([
    {
      id: '1',
      nombre: 'Firulais',
      especie: 'Perro',
      tamano: 'grande',
      raza: 'Labrador',
      edad: '5',
      descripcion: '', 
    },
    {
      id: '2',
      nombre: 'Misu',
      especie: 'Gato',
      tamano: 'chica',
      raza: 'Sin especificar',
      edad: '2',
      descripcion: '',
    },
  ]);

  // Agrega mascota y auto-genera ID
  const addPet = (pet: Omit<Pet, 'id'>) => {
    setPets(prev => [
      ...prev,
      { ...pet, descripcion: pet.descripcion || '', id: (Date.now() + Math.random()).toString() }
    ]);
  };

  const editPet = (id: string, pet: Omit<Pet, 'id'>) => {
    setPets(prev => prev.map(p => p.id === id ? { ...p, ...pet } : p));
  };

  const removePet = (id: string) => {
    setPets(prev => prev.filter(p => p.id !== id));
  };

  return (
    <PetsContext.Provider value={{ pets, addPet, editPet, removePet }}>
      {children}
    </PetsContext.Provider>
  );
};

// Hook para usar el contexto (lanza error si no hay Provider)
export const usePets = () => {
  const context = useContext(PetsContext);
  if (!context) throw new Error('Usar dentro de PetsProvider');
  return context;
};

export { PetsContext };