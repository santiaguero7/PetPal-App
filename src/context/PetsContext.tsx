import React, { createContext, useContext, useState } from 'react';

type Pet = { id: string; nombre: string; especie: string };

type PetsContextType = {
  pets: Pet[];
  addPet: (pet: Omit<Pet, 'id'>) => void;
};

const PetsContext = createContext<PetsContextType | undefined>(undefined);

export const PetsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([
    { id: '1', nombre: 'Firulais', especie: 'Perro' },
    { id: '2', nombre: 'Misu', especie: 'Gato' },
  ]);

  const addPet = (pet: Omit<Pet, 'id'>) => {
    setPets(prev => [
      ...prev,
      { ...pet, id: (prev.length + 1).toString() }
    ]);
  };

  return (
    <PetsContext.Provider value={{ pets, addPet }}>
      {children}
    </PetsContext.Provider>
  );
};

export const usePets = () => {
  const context = useContext(PetsContext);
  if (!context) throw new Error('usePets debe usarse dentro de PetsProvider');
  return context;
};