import React, { createContext, useContext, useState } from 'react';

// Tipo para mascotas (id, nombre, especie)
type Pet = {
  id: string;
  nombre: string;
  especie: string;
  tamano: 'chica' | 'mediana' | 'grande';
  raza: string;
  edad: string;
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
    },
    {
      id: '2',
      nombre: 'Misu',
      especie: 'Gato',
      tamano: 'chica',
      raza: 'Sin especificar',
      edad: '2',
    },
  ]);

  // Agrega mascota y auto-genera ID
  const addPet = (pet: Omit<Pet, 'id'>) => {
    setPets(prev => [
      ...prev,
      { ...pet, id: (Date.now() + Math.random()).toString() }
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

const RAZAS_GATO = [
  { key: 0, label: 'Sin especificar' },
  { key: 1, label: 'Persa' },
  { key: 2, label: 'Siamés' },
  { key: 3, label: 'Maine Coon' },
  { key: 4, label: 'Bengala' },
  { key: 5, label: 'Siberiano' },
  { key: 6, label: 'Ragdoll' },
  { key: 7, label: 'British Shorthair' },
  { key: 8, label: 'Sphynx' },
  { key: 9, label: 'Abisinio' },
  { key: 10, label: 'Otro' }
];