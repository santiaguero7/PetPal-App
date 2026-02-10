/**
 * ===========================================
 * TESTS UNITARIOS - Services Reales PetPal
 * ===========================================
 *
 * Testea las funciones REALES de src/services/
 * (auth, users, pets, reservations) con mocks de api y token.
 *
 * Para ejecutar: npm run test:unit
 * ===========================================
 */

// ============================================
// MOCKS (deben ir antes de los imports)
// ============================================
jest.mock('../../api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock('../../src/storage/token', () => ({
  getToken: jest.fn(),
}));

// ============================================
// IMPORTS REALES DE SERVICES
// ============================================
import { registerUser, loginUser } from '../../src/services/auth';
import { getMe, getUserById, updateUser } from '../../src/services/users';
import { getMyPets, createPet, updatePetById, deletePetById } from '../../src/services/pets';
import { createReservation, getReservationHistory, updateReservationStatus } from '../../src/services/reservations';

import api from '../../api';
import { getToken } from '../../src/storage/token';

// Tipamos los mocks para acceder a mockResolvedValue, etc.
const mockedApi = api as jest.Mocked<typeof api>;
const mockedGetToken = getToken as jest.MockedFunction<typeof getToken>;

// ============================================
// AUTH SERVICE
// ============================================
describe('Auth Service - src/services/auth.ts', () => {
  beforeEach(() => jest.clearAllMocks());

  test('registerUser: envía POST /auth/register con todos los campos', async () => {
    const fakeResponse = { id: 1, name: 'Juan', email: 'juan@mail.com' };
    mockedApi.post.mockResolvedValueOnce({ data: fakeResponse });

    const result = await registerUser(
      '', 'juan@mail.com', 'Pass123', 'client',
      '12345678', 'Calle 123', 'Palermo', '1122334455', 'Buenos Aires',
      -34.6037, -58.3816, null
    );

    expect(mockedApi.post).toHaveBeenCalledWith('/auth/register', {
      name: 'Juan',
      email: 'juan@mail.com',
      password: 'Pass123',
      role: 'client',
      dni: '12345678',
      direccion: 'Calle 123',
      barrio: 'Palermo',
      telefono: '1122334455',
      ciudad: 'Buenos Aires',
      latitude: -34.6037,
      longitude: -58.3816,
      profile_picture: null,
    });
    expect(result).toEqual(fakeResponse);
  });

  test('loginUser: envía POST /auth/login y retorna data', async () => {
    const fakeToken = { token: 'abc123', user: { id: 1 } };
    mockedApi.post.mockResolvedValueOnce({ data: fakeToken });

    const result = await loginUser('juan@mail.com', 'Pass123');

    expect(mockedApi.post).toHaveBeenCalledWith('/auth/login', {
      email: 'juan@mail.com',
      password: 'Pass123',
    });
    expect(result).toEqual(fakeToken);
  });

  test('loginUser: propaga error si la API falla', async () => {
    mockedApi.post.mockRejectedValueOnce(new Error('Credenciales inválidas'));

    await expect(loginUser('bad@mail.com', 'wrong')).rejects.toThrow('Credenciales inválidas');
  });
});

describe('Users Service - src/services/users.ts', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getMe: envía GET /users/me con token y retorna perfil', async () => {
    mockedGetToken.mockResolvedValueOnce('token-123');
    const fakeUser = { id: 1, name: 'Juan', email: 'juan@mail.com' };
    mockedApi.get.mockResolvedValueOnce({ data: fakeUser });

    const result = await getMe();

    expect(mockedApi.get).toHaveBeenCalledWith('/users/me', {
      headers: { Authorization: 'Bearer token-123' },
    });
    expect(result).toEqual(fakeUser);
  });

  test('getMe: lanza error si no hay token', async () => {
    mockedGetToken.mockResolvedValueOnce(null);

    await expect(getMe()).rejects.toThrow('Token no disponible');
    expect(mockedApi.get).not.toHaveBeenCalled();
  });

  test('getUserById: envía GET /users/:id con token', async () => {
    mockedGetToken.mockResolvedValueOnce('token-abc');
    const fakeUser = { id: 5, name: 'María' };
    mockedApi.get.mockResolvedValueOnce({ data: fakeUser });

    const result = await getUserById(5);

    expect(mockedApi.get).toHaveBeenCalledWith('/users/5', {
      headers: { Authorization: 'Bearer token-abc' },
    });
    expect(result).toEqual(fakeUser);
  });

  test('updateUser: envía PUT /users/:id con data y token', async () => {
    mockedGetToken.mockResolvedValueOnce('token-xyz');
    const updatedData = { name: 'Juan Carlos', barrio: 'Recoleta' };
    mockedApi.put.mockResolvedValueOnce({ data: { ...updatedData, id: 1 } });

    const result = await updateUser(1, updatedData);

    expect(mockedApi.put).toHaveBeenCalledWith('/users/1', updatedData, {
      headers: { Authorization: 'Bearer token-xyz' },
    });
    expect(result).toEqual({ ...updatedData, id: 1 });
  });
});

describe('Pets Service - src/services/pets.ts', () => {
  beforeEach(() => jest.clearAllMocks());

  test('getMyPets: envía GET /pets/user/me con token', async () => {
    mockedGetToken.mockResolvedValueOnce('token-pets');
    const fakePets = [{ id: 1, name: 'Firulais', type: 'dog' }];
    mockedApi.get.mockResolvedValueOnce({ data: fakePets });

    const result = await getMyPets();

    expect(mockedApi.get).toHaveBeenCalledWith('/pets/user/me', {
      headers: { Authorization: 'Bearer token-pets' },
    });
    expect(result).toEqual(fakePets);
  });

  test('createPet: envía POST /pets con datos de mascota', async () => {
    mockedGetToken.mockResolvedValueOnce('token-pets');
    const petData = { name: 'Luna', type: 'cat', weight: 4, age: 2 };
    mockedApi.post.mockResolvedValueOnce({ data: { id: 2, ...petData } });

    const result = await createPet(petData);

    expect(mockedApi.post).toHaveBeenCalledWith('/pets', petData, {
      headers: { Authorization: 'Bearer token-pets' },
    });
    expect(result.name).toBe('Luna');
  });

  test('updatePetById: envía PUT /pets/:id con datos actualizados', async () => {
    mockedGetToken.mockResolvedValueOnce('token-pets');
    const updatedData = { name: 'Firulais Jr', weight: 30 };
    mockedApi.put.mockResolvedValueOnce({ data: { id: 1, ...updatedData } });

    const result = await updatePetById(1, updatedData);

    expect(mockedApi.put).toHaveBeenCalledWith('/pets/1', updatedData, {
      headers: { Authorization: 'Bearer token-pets' },
    });
    expect(result.name).toBe('Firulais Jr');
  });

  test('deletePetById: envía DELETE /pets/:id con token', async () => {
    mockedGetToken.mockResolvedValueOnce('token-pets');
    mockedApi.delete.mockResolvedValueOnce({ data: { message: 'Eliminada' } });

    const result = await deletePetById(3);

    expect(mockedApi.delete).toHaveBeenCalledWith('/pets/3', {
      headers: { Authorization: 'Bearer token-pets' },
    });
    expect(result.message).toBe('Eliminada');
  });
});

describe('Reservations Service - src/services/reservations.ts', () => {
  beforeEach(() => jest.clearAllMocks());

  test('createReservation: envía POST /reservations con payload completo', async () => {
    mockedGetToken.mockResolvedValueOnce('token-res');
    const payload = {
      petpal_id: 10,
      profile_id: 1,
      pet_id: 2,
      service_type: 'dog walker' as const,
      date_start: '2026-03-10',
      date_end: '2026-03-10',
    };
    mockedApi.post.mockResolvedValueOnce({ data: { id: 50, ...payload, status: 'pending' } });

    const result = await createReservation(payload);

    expect(mockedApi.post).toHaveBeenCalledWith('/reservations', payload, {
      headers: { Authorization: 'Bearer token-res' },
    });
    expect(result.status).toBe('pending');
  });

  test('getReservationHistory: retorna historial del usuario', async () => {
    mockedGetToken.mockResolvedValueOnce('token-res');
    const fakeHistory = [{ id: 1, status: 'accepted' }, { id: 2, status: 'completed' }];
    mockedApi.get.mockResolvedValueOnce({ data: { data: fakeHistory } });

    const result = await getReservationHistory();

    expect(mockedApi.get).toHaveBeenCalledWith('/reservations/history', {
      headers: { Authorization: 'Bearer token-res' },
    });
    expect(result).toHaveLength(2);
  });

  test('updateReservationStatus: envía PUT con nuevo estado', async () => {
    mockedGetToken.mockResolvedValueOnce('token-res');
    mockedApi.put.mockResolvedValueOnce({ data: { message: 'Reserva aceptada' } });

    const result = await updateReservationStatus(50, 'accepted');

    expect(mockedApi.put).toHaveBeenCalledWith(
      '/reservations/50/status',
      { status: 'accepted' },
      { headers: { Authorization: 'Bearer token-res' } }
    );
    expect(result.message).toBe('Reserva aceptada');
  });
});
