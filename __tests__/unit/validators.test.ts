/**
 * ===========================================
 * 11 TESTS UNITARIOS - PetPal App
 * ===========================================
 * 
 * Tests simples y fáciles de entender.
 * Para ejecutar: npm run test:unit
 * 
 * ===========================================
 */

// ============================================
// FUNCIONES A TESTEAR
// ============================================

// 1. Validar email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 2. Validar contraseña (mínimo 6 caracteres)
const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// 3. Validar peso de mascota (entre 0 y 200 kg)
const isValidPetWeight = (weight: number): boolean => {
  return weight > 0 && weight <= 200;
};

// 4. Validar edad de mascota (entre 0 y 30 años)
const isValidPetAge = (age: number): boolean => {
  return age >= 0 && age <= 30;
};

// 5. Validar tipo de mascota (solo dog o cat)
const isValidPetType = (type: string): boolean => {
  return type === 'dog' || type === 'cat';
};

// 6. Validar DNI argentino (7-8 dígitos)
const isValidDni = (dni: string): boolean => {
  const dniRegex = /^\d{7,8}$/;
  return dniRegex.test(dni);
};

// 7. Calcular precio total
const calculateTotalPrice = (pricePerHour: number, hours: number): number => {
  if (pricePerHour <= 0 || hours <= 0) return 0;
  return pricePerHour * hours;
};

// 8. Validar coordenadas geográficas
const isValidCoordinates = (lat: number, lng: number): boolean => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

// 9. Calcular días entre fechas
const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// 10. Validar nombre (entre 2 y 100 caracteres)
const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

// 11. Sanitizar email (minúsculas y sin espacios)
const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

// ============================================
// LOS 11 TESTS UNITARIOS
// ============================================

// TEST 1: Email válido
test('TEST 1: Email válido debe retornar true', () => {
  expect(isValidEmail('usuario@example.com')).toBe(true);
});

// TEST 2: Email inválido
test('TEST 2: Email sin @ debe retornar false', () => {
  expect(isValidEmail('usuarioexample.com')).toBe(false);
});

// TEST 3: Contraseña válida
test('TEST 3: Contraseña de 6+ caracteres debe ser válida', () => {
  expect(isValidPassword('123456')).toBe(true);
});

// TEST 4: Contraseña inválida
test('TEST 4: Contraseña de 5 caracteres debe ser inválida', () => {
  expect(isValidPassword('12345')).toBe(false);
});

// TEST 5: Peso de mascota válido
test('TEST 5: Peso de 25kg debe ser válido', () => {
  expect(isValidPetWeight(25)).toBe(true);
});

// TEST 6: Tipo de mascota válido
test('TEST 6: Tipo "dog" debe ser válido', () => {
  expect(isValidPetType('dog')).toBe(true);
});

// TEST 7: Tipo de mascota inválido
test('TEST 7: Tipo "bird" debe ser inválido', () => {
  expect(isValidPetType('bird')).toBe(false);
});

// TEST 8: DNI válido
test('TEST 8: DNI de 8 dígitos debe ser válido', () => {
  expect(isValidDni('12345678')).toBe(true);
});

// TEST 9: Cálculo de precio
test('TEST 9: 2 horas a $500 debe ser $1000', () => {
  expect(calculateTotalPrice(500, 2)).toBe(1000);
});

// TEST 10: Coordenadas válidas
test('TEST 10: Coordenadas de Buenos Aires deben ser válidas', () => {
  expect(isValidCoordinates(-34.6037, -58.3816)).toBe(true);
});

// TEST 11: Sanitizar email
test('TEST 11: Email debe quedar en minúsculas sin espacios', () => {
  expect(sanitizeEmail('  Usuario@EXAMPLE.COM  ')).toBe('usuario@example.com');
});
