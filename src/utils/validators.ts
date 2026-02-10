/**
 * Utilidades de validación para PetPal
 * Estas funciones puras son fáciles de testear
 */

// ============================================
// VALIDACIONES DE EMAIL
// ============================================
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ============================================
// VALIDACIONES DE CONTRASEÑA
// ============================================
export const isValidPassword = (password: string): boolean => {
  // Mínimo 6 caracteres
  return password.length >= 6;
};

export const isStrongPassword = (password: string): boolean => {
  // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongRegex.test(password);
};

// ============================================
// VALIDACIONES DE MASCOTAS
// ============================================
export const isValidPetWeight = (weight: number): boolean => {
  return weight > 0 && weight <= 200; // Max 200kg
};

export const isValidPetAge = (age: number): boolean => {
  return age >= 0 && age <= 30; // Max 30 años
};

export const isValidPetType = (type: string): boolean => {
  return type === 'dog' || type === 'cat';
};

// ============================================
// VALIDACIONES DE USUARIO
// ============================================
export const isValidDni = (dni: string): boolean => {
  // DNI argentino: 7-8 dígitos
  const dniRegex = /^\d{7,8}$/;
  return dniRegex.test(dni);
};

export const isValidPhone = (phone: string): boolean => {
  // Teléfono argentino: 10-15 dígitos
  const phoneRegex = /^\d{10,15}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

export const isValidName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 100;
};

// ============================================
// VALIDACIONES DE RESERVAS
// ============================================
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
};

export const isFutureDate = (date: string): boolean => {
  const inputDate = new Date(date);
  const now = new Date();
  return inputDate > now;
};

// ============================================
// VALIDACIONES DE PRECIO
// ============================================
export const isValidPrice = (price: number): boolean => {
  return price > 0 && price <= 100000;
};

// ============================================
// CÁLCULOS DE PRECIO
// ============================================
export const calculateTotalPrice = (
  pricePerHour: number,
  hours: number
): number => {
  if (pricePerHour <= 0 || hours <= 0) return 0;
  return pricePerHour * hours;
};

export const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// ============================================
// VALIDACIONES DE UBICACIÓN
// ============================================
export const isValidLatitude = (lat: number): boolean => {
  return lat >= -90 && lat <= 90;
};

export const isValidLongitude = (lng: number): boolean => {
  return lng >= -180 && lng <= 180;
};

export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return isValidLatitude(lat) && isValidLongitude(lng);
};

// ============================================
// FORMATO Y SANITIZACIÓN
// ============================================
export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const formatPhoneNumber = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
};
