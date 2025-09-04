===========================
Workflow: API CI
===========================

Este workflow ejecuta un ciclo de integración continuo (CI) para nuestra API.

---------------------------------------------------
1. Activación
---------------------------------------------------

name: API CI  # Nombre del workflow

on:
  push:
    paths:
      - "./api/**"                     # Se ejecuta solo si se modifica algo en ./api
      - ".github/workflows/api-ci.yml" # O si se modifica el workflow mismo

---------------------------------------------------
2. Directorio de trabajo por defecto
---------------------------------------------------

defaults:
  run:
    working-directory: ./api           # Todas las acciones run se ejecutan en ./api

---------------------------------------------------
3. Linter
---------------------------------------------------

lint:
  runs-on: ubuntu-latest               # Ejecuta en un runner Ubuntu
  steps:
    - Checkout repo
    - Setup Node.js v20
    - Instalar dependencias: npm ci
    - Ejecutar ESLint: npm run lint || true
      # ⚠️ || true evita que falle el workflow si hay errores de lint

---------------------------------------------------
4. Unit Tests
---------------------------------------------------

unit-test:
  runs-on: ubuntu-latest
  needs: lint                          # Solo se ejecuta si el linter pasa
  steps:
    - Checkout repo
    - Setup Node.js v20
    - Instalar dependencias: npm ci
    - Ejecutar tests unitarios: npm run test

---------------------------------------------------
5. E2E Tests con MongoDB
---------------------------------------------------

e2e:
  runs-on: ubuntu-latest
  needs: unit-test                     # Solo si unit tests pasaron
  container:
    image: node:20                      # Contenedor Node 20

  services:
    mongo-e2e:
      image: mongo:6.0                  # MongoDB 6.0
      ports:
        - 27018:27017                   # Puerto host -> contenedor
      env:
        MONGO_INITDB_ROOT_USERNAME: test
        MONGO_INITDB_ROOT_PASSWORD: test123
        MONGO_INITDB_DATABASE: demo_e2e

  steps:
    - Checkout repo
    - Instalar dependencias: npm ci
    - Ejecutar E2E: npm run test:E2E
      env:
        MONGO_DB_NAME: demo_e2e
        MONGO_URL: mongodb://test:test123@mongo-e2e:27017/demo_e2e?authSource=admin&writeConcern=majority

---------------------------------------------------
Resumen
---------------------------------------------------

- Flujo: Lint → Unit Tests → E2E Tests
- Cada job depende del anterior usando `needs`
- MongoDB se ejecuta como servicio para los tests E2E
- defaults.working-directory simplifica rutas
- Opcional: agregar caching de npm para acelerar builds
- Nota importante: solo Linux (`ubuntu-latest`) corre de manera estándar y estable en GitHub Actions. 
  Mac o Windows se pueden usar, pero no es lo habitual y puede requerir adaptaciones en scripts o paths.
