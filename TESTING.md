# 📋 Documentación de Testing - PetPal App
## Trabajo Práctico Integrador

---

## 📁 Estructura de Tests

```
PetPal-App/
├── __tests__/
│   ├── unit/                    # Tests unitarios (10 tests)
│   │   └── validators.test.ts
│   ├── integration/             # Tests de integración
│   │   └── services.test.ts
│   └── e2e/                     # Tests end-to-end
│       └── flows.test.ts
├── jest.config.js               # Configuración de Jest
├── jest.setup.js                # Setup global
└── .github/
    └── workflows/
        └── ci-cd.yml            # Pipeline CI/CD
```

---

## 🚀 Comandos para Ejecutar Tests

```bash
# Instalar dependencias (primera vez)
npm install

# Ejecutar TODOS los tests
npm test

# Ejecutar solo tests UNITARIOS
npm run test:unit

# Ejecutar solo tests de INTEGRACIÓN
npm run test:integration

# Ejecutar solo tests E2E
npm run test:e2e

# Ejecutar tests con cobertura
npm run test:all

# Modo watch (desarrollo)
npm run test:watch
```

---

## 📊 Reportes Generados

Después de ejecutar los tests, se generan estos reportes:

| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| **Cobertura HTML** | `coverage/lcov-report/index.html` | Reporte visual de cobertura |
| **JUnit XML** | `reports/junit.xml` | Para integración con CI/CD |
| **HTML Report** | `reports/test-report.html` | Reporte visual de tests |

---

## ❌ CÓMO HACER QUE LOS TESTS FALLEN

### Para demostrar al profesor que el pipeline se detiene cuando falla un test:

---

### 🔴 Opción 1: Romper un Test UNITARIO

**Archivo:** `__tests__/unit/validators.test.ts`

**Línea a cambiar (aproximadamente línea 40):**

```typescript
// ANTES (pasa ✅)
test('✅ Acepta email válido con formato correcto', () => {
  expect(isValidEmail('usuario@example.com')).toBe(true);
});

// DESPUÉS (falla ❌)
test('✅ Acepta email válido con formato correcto', () => {
  expect(isValidEmail('usuario@example.com')).toBe(false);  // ← Cambiar true por false
});
```

**Resultado esperado:**
```
FAIL  __tests__/unit/validators.test.ts
  ✕ Acepta email válido con formato correcto
    Expected: false
    Received: true
```

---

### 🔴 Opción 2: Romper un Test de INTEGRACIÓN

**Archivo:** `__tests__/integration/services.test.ts`

**Línea a cambiar (aproximadamente línea 45):**

```typescript
// ANTES (pasa ✅)
expect(response.data.token).toBe('jwt-token-12345');

// DESPUÉS (falla ❌)
expect(response.data.token).toBe('token-incorrecto');  // ← Cambiar el valor esperado
```

**Resultado esperado:**
```
FAIL  __tests__/integration/services.test.ts
  ✕ Login exitoso retorna token y datos del usuario
    Expected: "token-incorrecto"
    Received: "jwt-token-12345"
```

---

### 🔴 Opción 3: Romper la Validación

**Archivo:** `src/utils/validators.ts`

**Línea a cambiar (aproximadamente línea 10):**

```typescript
// ANTES (funciona ✅)
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// DESPUÉS (rompe ❌)
export const isValidEmail = (email: string): boolean => {
  return false;  // ← Siempre retorna false, rompe todos los tests de email
};
```

---

## ⚙️ Configuración de GitHub Actions

### Para que el Pipeline FALLE cuando un test falla:

En `.github/workflows/ci-cd.yml`, la clave es:

```yaml
- name: 🧪 Ejecutar Tests Unitarios
  run: npm run test:unit -- --ci --coverage
  continue-on-error: false  # ❌ ESTO HACE QUE FALLE EL PIPELINE
```

El parámetro `continue-on-error: false` (que es el default) asegura que:
- ✅ Si todos los tests pasan → El job continúa
- ❌ Si un test falla → El job se detiene y los jobs posteriores NO se ejecutan

---

## 🔧 Configurar Ambientes en GitHub

### Paso 1: Crear ambiente de QA
1. Ir a tu repositorio en GitHub
2. Settings → Environments → New environment
3. Nombre: `qa`
4. No necesita aprobación

### Paso 2: Crear ambiente de Aprobación
1. Settings → Environments → New environment
2. Nombre: `production-approval`
3. ✅ Marcar "Required reviewers"
4. Agregar tu usuario como reviewer

### Paso 3: Crear ambiente de Producción
1. Settings → Environments → New environment
2. Nombre: `production`

---

## 🎯 Flujo del Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                         PULL REQUEST / PUSH                      │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  JOB 1: TESTS UNITARIOS                                          │
│  ─────────────────────                                           │
│  • Ejecuta: npm run test:unit                                    │
│  • Genera: Reporte de cobertura                                  │
│  • Si FALLA → ❌ Pipeline se detiene aquí                        │
└─────────────────────────────────────────────────────────────────┘
                                  │ ✅ Pasa
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  JOB 2: BUILD                                                    │
│  ───────────                                                     │
│  • Compila la aplicación                                         │
│  • Genera artefacto para deploy                                  │
└─────────────────────────────────────────────────────────────────┘
                                  │ ✅ Pasa
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  JOB 3: DEPLOY QA + TESTS INTEGRACIÓN                            │
│  ────────────────────────────────────                            │
│  • Despliega a ambiente QA                                       │
│  • Ejecuta: npm run test:integration                             │
│  • Si FALLA → ❌ Pipeline se detiene aquí                        │
└─────────────────────────────────────────────────────────────────┘
                                  │ ✅ Pasa
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  JOB 4: APROBACIÓN MANUAL                                        │
│  ────────────────────────                                        │
│  • ⏸️ ESPERA aprobación de un reviewer                           │
│  • No continúa hasta que alguien apruebe                         │
└─────────────────────────────────────────────────────────────────┘
                                  │ ✅ Aprobado
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  JOB 5: DEPLOY PRODUCCIÓN                                        │
│  ───────────────────────                                         │
│  • 🌟 Despliega a ambiente PRODUCCIÓN                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Resumen de Tests Implementados

### Tests Unitarios (10 tests principales)

| # | Nombre | Qué valida |
|---|--------|------------|
| 1 | `isValidEmail` | Formato de email válido |
| 2 | `isValidPassword` | Contraseña mínimo 6 caracteres |
| 3 | `isStrongPassword` | Contraseña fuerte (mayúscula, minúscula, número) |
| 4 | `isValidPetWeight` | Peso de mascota entre 0 y 200 kg |
| 5 | `isValidPetAge` | Edad de mascota entre 0 y 30 años |
| 6 | `isValidPetType` | Tipo solo "dog" o "cat" |
| 7 | `isValidDni` | DNI argentino 7-8 dígitos |
| 8 | `calculateTotalPrice` | Cálculo de precio por horas |
| 9 | `isValidCoordinates` | Coordenadas lat/lng válidas |
| 10 | `calculateDaysBetween` | Días entre dos fechas |

### Tests de Integración

- Login exitoso/fallido
- Registro de usuario
- CRUD de mascotas
- Gestión de reservas
- Obtención de perfil

### Tests E2E (Flujos)

- Flujo completo de registro
- Flujo de login
- Crear mascota
- Crear reserva
- Búsqueda de PetPals
- Gestión de reservas (aceptar/rechazar)
- Editar perfil

---

## 🔴 Checklist para la Presentación

- [ ] Tests unitarios funcionando (`npm run test:unit`)
- [ ] Tests de integración funcionando (`npm run test:integration`)
- [ ] Reportes visibles en `coverage/` y `reports/`
- [ ] GitHub Actions configurado
- [ ] Ambientes QA y PROD creados en GitHub
- [ ] Aprobación manual configurada
- [ ] Saber cómo hacer fallar un test para demostración
