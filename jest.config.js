module.exports = {
  // Usar ts-jest para transformar TypeScript
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { isolatedModules: true }],
  },
  
  // Donde buscar los tests
  roots: ['<rootDir>/__tests__'],
  
  // Patrón para encontrar archivos de test
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.test.tsx',
  ],
  
  // Extensiones a procesar
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // Testear en Node
  testEnvironment: 'node',
  
  // Verbose output para ver cada test
  verbose: true,
  
  // Timeout para tests
  testTimeout: 10000,
  
  // Cobertura deshabilitada por defecto
  collectCoverage: false,
};
