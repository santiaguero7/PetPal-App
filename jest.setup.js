// jest.setup.js
// Configuración global para todos los tests

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock de react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => ({
  Swipeable: 'Swipeable',
  DrawerLayout: 'DrawerLayout',
  State: {},
  PanGestureHandler: 'PanGestureHandler',
  BaseButton: 'BaseButton',
  Directions: {},
}));

// Silenciar warnings de console durante tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Timeout global
jest.setTimeout(10000);
