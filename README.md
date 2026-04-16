# 📂 MiUNE 2.0 — Sistema de Gestión Documental

> Portal institucional full-stack para la gestión, clasificación y almacenamiento centralizado de documentos académicos. Construido con Node.js, Express y React como proyecto universitario de Bootcamp de Desarrollo de Software.

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql)](https://supabase.com)
[![Redis](https://img.shields.io/badge/Redis-Cloud-DC382D?logo=redis)](https://redis.io)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://prisma.io)

---

## 🚀 URLs de Producción

| Servicio | URL |
|----------|-----|
| 🌐 Frontend (Vercel) | https://miunedocsapi.vercel.app |
| ⚙️ Backend API (Render) | https://miune-docs-api.onrender.com/|
| 📖 Documentación Swagger | https://miune-docs-api.onrender.com/api/docs
 |

---

## 🔐 Credenciales de Acceso al Frontend

> Usuarios creados automáticamente por el seed (`npm run prisma:seed`). Todos comparten la misma contraseña.

| # | Nombre | Email | Contraseña | Rol | Acceso al Dashboard |
|---|--------|-------|-----------|-----|---------------------|
| 1 | Ana Pérez | `ana@miune.edu` | `Password123!` | 🔴 ADMIN | ✅ Completo (CRUD Docs + Categorías) |
| 2 | Luis Gómez | `luis@miune.edu` | `Password123!` | 🔵 USER | ✅ Solo lectura + subir documentos |
| 3 | María Torres | `maria@miune.edu` | `Password123!` | 🔵 USER | ✅ Solo lectura + subir documentos |
| 4 | Carlos Ruiz | `carlos@miune.edu` | `Password123!` | 🔵 USER | ✅ Solo lectura + subir documentos |
| 5 | Elena Díaz | `elena@miune.edu` | `Password123!` | 🔵 USER | ✅ Solo lectura + subir documentos |

> 💡 **Para evaluar el dashboard completo (CRUD), use la cuenta ADMIN:** `ana@miune.edu` / `Password123!`

---

## 🛠️ Stack Tecnológico

### Backend
| Tecnología | Uso |
|-----------|-----|
| **Node.js 20 + Express** | Servidor REST API |
| **Prisma ORM** | Mapeo de Base de Datos |
| **PostgreSQL (Supabase)** | Base de datos relacional en la nube |
| **Redis (Redis Cloud)** | Caché de respuestas GET |
| **Multer** | Manejo de uploads de archivos |
| **Cloudinary** | Almacenamiento multimedia en la nube |
| **JWT (jsonwebtoken)** | Autenticación stateless |
| **bcrypt** | Hash seguro de contraseñas |
| **express-validator** | Sanitización y validación de inputs |
| **express-rate-limit** | Rate limiting y protección anti-abuso |
| **Swagger (swagger-jsdoc)** | Documentación API auto-generada |
| **Jest + Supertest** | Suite de 15+ tests de integración |

### Frontend
| Tecnología | Uso |
|-----------|-----|
| **React 18 + Vite** | SPA con bundler ultra-rápido |
| **React Router DOM** | Enrutamiento anidado (Nested Routes) |
| **Zustand** | Estado global con persistencia localStorage |
| **Axios** | Cliente HTTP con interceptores JWT y auth 401 |
| **Framer Motion** | Animaciones y transiciones fluidas |
| **Lucide React** | Iconografía vectorial |
| **React Helmet Async** | SEO dinámico (títulos y meta-tags) |

---

## ⚡ Instalación y Uso Local

### Pre-requisitos
- Node.js v20+
- Una cuenta en [Supabase](https://supabase.com) (PostgreSQL)
- Una cuenta en [Redis Cloud](https://redis.com/redis-enterprise-cloud/overview/)

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/miune-docs-api.git
cd miune-docs-api
```

### 2. Instalar dependencias del Backend

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el `.env` con tus credenciales reales:

```env
DATABASE_URL="postgresql://usuario:password@host:5432/miune_db"
REDIS_URL="redis://usuario:password@host:puerto"
JWT_SECRET="tu_clave_secreta_super_larga"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 4. Sincronizar esquema de Base de Datos

```bash
npm run prisma:generate
npx prisma db push
```

### 5. Poblar datos de prueba

```bash
npm run prisma:seed
```

Esto crea **5 usuarios**, **5 categorías** y **6 documentos** de ejemplo.

### 6. Iniciar el servidor

```bash
npm run dev
```

API disponible en: `http://localhost:3000`  
Documentación Swagger: `http://localhost:3000/api/docs`

### 7. Iniciar el Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en: `http://localhost:5173`

---

## 🔐 Credenciales de Prueba (Seed)

| Email | Contraseña | Rol |
|-------|-----------|-----|
| `ana@miune.edu` | `Password123!` | ADMIN |
| `luis@miune.edu` | `Password123!` | USER |
| `maria@miune.edu` | `Password123!` | USER |

---

## 📡 Endpoints de la API

### Auth — `/api/auth`
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/me` | Obtener perfil del usuario actual | ✅ JWT |

### Documentos — `/api/documentos`
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/` | Crear documento (multipart/form-data) | ✅ JWT |
| PUT | `/:id` | Actualizar documento | ✅ JWT |
| DELETE | `/:id` | Eliminar documento | ✅ JWT |

**Query Params disponibles:** `?page=1&pageSize=10&titulo=reglamento&estado=publicado&sortBy=titulo&sortOrder=asc`

### Categorías — `/api/categorias`
| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/` | Crear categoría | ✅ ADMIN |
| PUT | `/:id` | Actualizar categoría | ✅ ADMIN |
| DELETE | `/:id` | Eliminar categoría | ✅ ADMIN |

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────┐
│                 CLIENTE (React / Vite)               │
│   Zustand Store ← Axios Interceptors → React Router  │
└───────────────────────┬─────────────────────────────┘
                        │ HTTP (JWT en Authorization Header)
┌───────────────────────▼─────────────────────────────┐
│                EXPRESS API (Node.js)                 │
│  Rate Limiter → Auth Middleware → Controllers        │
│  ┌─────────────┐   ┌──────────┐   ┌──────────────┐ │
│  │   /auth     │   │ /docs    │   │ /categorias  │ │
│  └─────────────┘   └──────────┘   └──────────────┘ │
└──────┬─────────────────────┬────────────────────────┘
       │                     │
┌──────▼───────┐    ┌────────▼────────┐
│  Redis Cloud │    │  Prisma ORM     │
│  (Cache GET) │    │  (Models)       │
└──────────────┘    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │ PostgreSQL      │
                    │ (Supabase)      │
                    └─────────────────┘
```

---

## 🧪 Tests

```bash
npm test
```

Suite de **15 tests de integración** usando Jest + Supertest:
- Autenticación (registro, login, perfil)
- RBAC (Control de Acceso Basado en Roles)
- Paginación y filtros de Documentos
- Paginación y filtros de Categorías
- Caché de Redis
- Uploads de archivos
- Manejo de errores 404

---

## 📁 Estructura del Proyecto

```
miune-docs-api/
├── frontend/               # React App (Vite)
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Dashboard.jsx
│       │   └── dashboard/
│       │       ├── Overview.jsx
│       │       ├── DocumentosList.jsx
│       │       ├── DocumentoForm.jsx
│       │       ├── CategoriasList.jsx
│       │       └── CategoriaForm.jsx
│       ├── store/          # Zustand
│       ├── api/            # Axios Interceptors
│       └── components/     # AuthRoutes
├── src/                    # Backend Express
│   ├── controllers/
│   ├── lib/                # Redis, Cloudinary, Swagger
│   ├── middleware/         # Auth, Cache, RateLimit, Validation, Upload
│   ├── models/
│   └── routes/
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── docs/                   # Documentación adicional
├── tests/                  # Jest + Supertest
└── uploads/                # Archivos locales (bypass Cloudinary)
```

---

## 📝 Licencia

MIT — Proyecto académico UNE 2026. Desarrollado con asistencia de IA (Antigravity / Google DeepMind).
