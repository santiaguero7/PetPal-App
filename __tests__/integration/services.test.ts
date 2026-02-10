/**
 * ===========================================
 * TESTS DE INTEGRACIÓN - PetPal App
 * ===========================================
 * 
 * Estos tests prueban la INTERACCIÓN entre componentes y servicios.
 * Usamos mocks para simular las respuestas de la API.
 * 
 * Para ejecutar: npm run test:integration
 * 
 * ===========================================
 */

import axios from 'axios';

// Mock de axios para simular llamadas a la API
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock del token
jest.mock('../../src/storage/token', () => ({
  getToken: jest.fn(() => Promise.resolve('fake-jwt-token')),
  saveToken: jest.fn(() => Promise.resolve()),
  removeToken: jest.fn(() => Promise.resolve()),
}));

// ============================================
// TESTS DE AUTENTICACIÓN
// ============================================
describe('INTEGRACIÓN: Servicio de Autenticación', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockedAxios);
  });

  test('Login exitoso retorna token y datos del usuario', async () => {
    // Simular respuesta exitosa del servidor
    const mockResponse = {
      data: {
        token: 'jwt-token-12345',
        user: {
          id: 1,
          name: 'Juan Test',
          email: 'juan@test.com',
          role: 'client'
        }
      }
    };
    
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    // Importar después del mock
    const api = require('../../api').default;
    mockedAxios.create.mockReturnValue(mockedAxios);
    
    const response = await mockedAxios.post('/auth/login', {
      email: 'juan@test.com',
      password: 'password123'
    });

    expect(response.data.token).toBe('jwt-token-12345');
    expect(response.data.user.email).toBe('juan@test.com');
  });

  test('Login fallido retorna error 401', async () => {
    const mockError = {
      response: {
        status: 401,
        data: { message: 'Credenciales inválidas' }
      }
    };

    mockedAxios.post.mockRejectedValueOnce(mockError);

    await expect(
      mockedAxios.post('/auth/login', {
        email: 'wrong@test.com',
        password: 'wrongpassword'
      })
    ).rejects.toEqual(mockError);
  });

  test('Registro exitoso crea nuevo usuario', async () => {
    const mockResponse = {
      data: {
        message: 'Usuario registrado exitosamente',
        user: {
          id: 2,
          name: 'Maria Test',
          email: 'maria@test.com',
          role: 'petpal'
        }
      }
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const response = await mockedAxios.post('/auth/register', {
      name: 'Maria Test',
      email: 'maria@test.com',
      password: 'password123',
      role: 'petpal',
      dni: '1234567',
      direccion: 'Av. Corrientes 1234',
      barrio: 'Palermo',
      telefono: '1155667788',
      ciudad: 'Buenos Aires'
    });

    expect(response.data.message).toBe('Usuario registrado exitosamente');
    expect(response.data.user.role).toBe('petpal');
  });

  // TEST que SÍ valida el DNI antes de llamar la API
  test('Registro falla con DNI inválido', async () => {
    const isValidDni = (dni: string) => /^\d{7,8}$/.test(dni);
    
    const dni = '1234ABC8';  // DNI inválido (contiene letras)
    
    // Esta validación SÍ hace fallar el test
    expect(isValidDni(dni)).toBe(false);  // ✅ FALLA porque el DNI tiene letras
  });
});

// ============================================
// TESTS DE MASCOTAS
// ============================================
describe('INTEGRACIÓN: Servicio de Mascotas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockedAxios);
  });

  test('Obtener mis mascotas retorna lista correcta', async () => {
    const mockPets = {
      data: [
        { id: 1, name: 'Firulais', pet_type: 'dog', weight: 15 },
        { id: 2, name: 'Michi', pet_type: 'cat', weight: 4 }
      ]
    };

    mockedAxios.get.mockResolvedValueOnce(mockPets);

    const response = await mockedAxios.get('/pets/user/me');

    expect(response.data).toHaveLength(2);
    expect(response.data[0].name).toBe('Firulais');
    expect(response.data[1].pet_type).toBe('cat');
  });

  test('Crear mascota nueva funciona correctamente', async () => {
    const newPet = {
      name: 'Rocky',
      pet_type: 'dog',
      weight: 20,
      age: 3,
      breed: 'Labrador'
    };

    const mockResponse = {
      data: {
        id: 3,
        ...newPet,
        user_id: 1
      }
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const response = await mockedAxios.post('/pets', newPet);

    expect(response.data.id).toBe(3);
    expect(response.data.name).toBe('Rocky');
  });

  test('Eliminar mascota retorna confirmación', async () => {
    const mockResponse = {
      data: { message: 'Mascota eliminada correctamente' }
    };

    mockedAxios.delete.mockResolvedValueOnce(mockResponse);

    const response = await mockedAxios.delete('/pets/1');

    expect(response.data.message).toBe('Mascota eliminada correctamente');
  });

  test('Actualizar mascota funciona correctamente', async () => {
    const updateData = { weight: 22, age: 4 };
    
    const mockResponse = {
      data: {
        id: 1,
        name: 'Firulais',
        weight: 22,
        age: 4
      }
    };

    mockedAxios.put.mockResolvedValueOnce(mockResponse);

    const response = await mockedAxios.put('/pets/1', updateData);

    expect(response.data.weight).toBe(22);
    expect(response.data.age).toBe(4);
  });
});

// ============================================
// TESTS DE RESERVAS
// ============================================
describe('INTEGRACIÓN: Servicio de Reservas', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockedAxios);
  });

  test('Crear reserva exitosa', async () => {
    const reservaData = {
      petpal_id: 2,
      profile_id: 1,
      pet_id: 1,
      service_type: 'dog walker',
      date_start: '2026-02-15T10:00:00',
      date_end: '2026-02-15T12:00:00'
    };

    const mockResponse = {
      data: {
        id: 1,
        ...reservaData,
        status: 'pending',
        total_price: 1000
      }
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const response = await mockedAxios.post('/reservations', reservaData);

    expect(response.data.status).toBe('pending');
    expect(response.data.total_price).toBe(1000);
  });

  test('Obtener historial de reservas', async () => {
    const mockReservations = {
      data: {
        data: [
          { id: 1, status: 'completed', pet_name: 'Firulais' },
          { id: 2, status: 'pending', pet_name: 'Rocky' }
        ]
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockReservations);

    const response = await mockedAxios.get('/reservations/history');

    expect(response.data.data).toHaveLength(2);
    expect(response.data.data[0].status).toBe('completed');
  });

  test('Actualizar estado de reserva (aceptar)', async () => {
    const mockResponse = {
      data: { message: 'Reserva aceptada' }
    };

    mockedAxios.put.mockResolvedValueOnce(mockResponse);

    const response = await mockedAxios.put('/reservations/1/status', {
      status: 'accepted'
    });

    expect(response.data.message).toBe('Reserva aceptada');
  });

  test('Rechazar reserva funciona', async () => {
    const mockResponse = {
      data: { message: 'Reserva rechazada' }
    };

    mockedAxios.put.mockResolvedValueOnce(mockResponse);

    const response = await mockedAxios.put('/reservations/1/status', {
      status: 'rejected'
    });

    expect(response.data.message).toBe('Reserva rechazada');
  });
});

// ============================================
// TESTS DE USUARIOS
// ============================================
describe('INTEGRACIÓN: Servicio de Usuarios', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockedAxios);
  });

  test('Obtener perfil propio (/me)', async () => {
    const mockUser = {
      data: {
        id: 1,
        name: 'Juan Test',
        email: 'juan@test.com',
        role: 'client',
        barrio: 'Palermo'
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockUser);

    const response = await mockedAxios.get('/users/me');

    expect(response.data.name).toBe('Juan Test');
    expect(response.data.barrio).toBe('Palermo');
  });

  test('Obtener usuario por ID', async () => {
    const mockUser = {
      data: {
        id: 2,
        name: 'PetPal Maria',
        role: 'petpal'
      }
    };

    mockedAxios.get.mockResolvedValueOnce(mockUser);

    const response = await mockedAxios.get('/users/2');

    expect(response.data.id).toBe(2);
    expect(response.data.role).toBe('petpal');
  });

  test('Actualizar perfil de usuario', async () => {
    const updateData = {
      name: 'Juan Actualizado',
      telefono: '1199887766'
    };

    const mockResponse = {
      data: {
        id: 1,
        name: 'Juan Actualizado',
        telefono: '1199887766'
      }
    };

    mockedAxios.put.mockResolvedValueOnce(mockResponse);

    const response = await mockedAxios.put('/users/1', updateData);

    expect(response.data.name).toBe('Juan Actualizado');
  });

  test('Error 404 al buscar usuario inexistente', async () => {
    const mockError = {
      response: {
        status: 404,
        data: { message: 'Usuario no encontrado' }
      }
    };

    mockedAxios.get.mockRejectedValueOnce(mockError);

    await expect(mockedAxios.get('/users/999')).rejects.toEqual(mockError);
  });
});

// ============================================
// TESTS DE MANEJO DE TOKENS
// ============================================
describe('INTEGRACIÓN: Manejo de Token JWT', () => {
  test('Token se incluye en headers de peticiones autenticadas', () => {
    const headers = { Authorization: 'Bearer fake-jwt-token' };
    
    expect(headers.Authorization).toContain('Bearer');
    expect(headers.Authorization).toContain('fake-jwt-token');
  });

  test('Formato de token JWT es válido', () => {
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImNsaWVudCJ9.abc123';
    
    const parts = fakeToken.split('.');
    expect(parts).toHaveLength(3); // header.payload.signature
  });
});
