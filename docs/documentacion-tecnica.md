# 📐 Documentación Técnica — MiUNE 2.0

---

## 🔗 Swagger / OpenAPI

La documentación interactiva de todos los endpoints está auto-generada con `swagger-jsdoc` y disponible en:

**Local:** `http://localhost:3000/api/docs`  
**Producción:** `https://miune-docs-api.onrender.com/api/docs`

---

## 🏗️ Diagrama de Arquitectura del Sistema

```mermaid
graph TB
    subgraph "Cliente (Vercel)"
        A[React 18 + Vite]
        B[Zustand Store]
        C[Axios Interceptors]
        D[React Router DOM]
    end

    subgraph "API REST (Render / Node.js)"
        E[Express Server :3000]
        F[Rate Limiter Middleware]
        G[Auth Middleware - JWT]
        H[Cache Middleware - Redis]
        I[Validation Middleware]
        J[Upload Middleware - Multer]
        K[/api/auth]
        L[/api/documentos]
        M[/api/categorias]
        N[Controllers]
        O[Prisma ORM]
    end

    subgraph "Infraestructura Cloud"
        P[(PostgreSQL - Supabase)]
        Q[(Redis - Redis Cloud)]
        R[☁️ Cloudinary / Local FS]
        S[📖 Swagger UI - /api/docs]
    end

    A --> C
    C -->|Bearer JWT| E
    B --> A
    D --> A

    E --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    J --> L
    J --> M
    K --> N
    L --> N
    M --> N
    N --> O
    O --> P
    H <-->|GET Cache| Q
    J -->|File Upload| R
    E --> S
```

---

## 🗃️ Diagrama Entidad-Relación (ERD)

```mermaid
erDiagram
    USUARIO ||--o{ DOCUMENTO : "crea (autor)"
    CATEGORIA ||--o{ DOCUMENTO : "clasifica"

    USUARIO {
        int     id          PK
        string  nombre
        string  email       UK
        string  password    "hash bcrypt"
        enum    role        "USER | ADMIN"
        boolean activo
        datetime createdAt
        datetime updatedAt
    }

    CATEGORIA {
        int     id          PK
        string  nombre      UK
        string  descripcion "nullable"
        boolean activa
        datetime createdAt
        datetime updatedAt
    }

    DOCUMENTO {
        int     id          PK
        string  titulo
        string  tipo        "MIME type"
        string  peso        "ej: 1.5MB"
        string  estado      "borrador|publicado|archivado"
        string  resumen     "nullable"
        string  urlArchivo  "nullable"
        int     usuarioId   FK
        int     categoriaId FK
        datetime createdAt
        datetime updatedAt
    }
```

---

## 🔐 Flujo de Autenticación JWT

```mermaid
sequenceDiagram
    participant C as 🖥️ Cliente
    participant API as ⚙️ Express API
    participant DB as 🗄️ PostgreSQL

    C->>API: POST /api/auth/login (email, password)
    API->>DB: SELECT usuario WHERE email = ?
    DB-->>API: { id, nombre, role, password_hash }
    API->>API: bcrypt.compare(password, hash)
    API->>API: jwt.sign({ id, email, role }, SECRET)
    API-->>C: { token, data: { id, nombre, role } }
    
    Note over C: Guarda token en Zustand / localStorage

    C->>API: GET /api/documentos (Authorization: Bearer TOKEN)
    API->>API: jwt.verify(token, SECRET) → { id, email, role }
    API->>DB: SELECT * FROM Documento
    DB-->>API: [ ...documentos ]
    API-->>C: { success: true, data: [...], total, page }
```

---

## ⚡ Flujo de Caché Redis

```mermaid
sequenceDiagram
    participant C as 🖥️ Cliente
    participant API as ⚙️ Express
    participant R as 🔴 Redis
    participant DB as 🗄️ PostgreSQL

    C->>API: GET /api/categorias
    API->>R: GET "categorias:/api/categorias"
    R-->>API: null (cache miss)
    API->>DB: SELECT * FROM Categoria
    DB-->>API: [ ...categorias ]
    API->>R: SET "categorias:/api/categorias" (TTL: 3600s)
    API-->>C: { data: [...] }

    C->>API: GET /api/categorias (segunda llamada)
    API->>R: GET "categorias:/api/categorias"
    R-->>API: [ ...categorias ] (cache HIT ⚡)
    API-->>C: { data: [...] }

    C->>API: POST /api/categorias (crear nueva)
    API->>R: DEL "categorias:*" (invalidar caché)
    API->>DB: INSERT INTO Categoria
    DB-->>API: nueva categoría
    API-->>C: { success: true, data: {...} }
```

---

## 📦 Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | Cadena de conexión PostgreSQL | `postgresql://user:pass@host:5432/db` |
| `REDIS_URL` | URL del servidor Redis | `redis://user:pass@host:6379` |
| `JWT_SECRET` | Clave secreta para firmar JWT | `cadena_larga_aleatoria_segura` |
| `JWT_EXPIRES_IN` | Duración del token | `24h` |
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` / `production` |
| `CLOUDINARY_CLOUD_NAME` | Nombre del cloud en Cloudinary | `mi_cloud_name` |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary | `123456789` |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary | `abc123xyz` |

---

## 📊 Validaciones de Input (express-validator)

| Campo | Regla |
|-------|-------|
| `titulo` | Requerido, 3–150 caracteres |
| `tipo` | Enum: `pdf`, `docx`, `xlsx`, `jpeg`, `png`, `webp` |
| `estado` | Enum: `borrador`, `publicado`, `archivado` |
| `peso` | Requerido, string (calculado automáticamente por Multer) |
| `categoriaId` | Entero positivo requerido |
| `usuarioId` | Entero positivo requerido |
| `email` | Formato email válido |
| `password` | Mín. 8 chars, 1 mayúscula, 1 número |

---

*Documentación Técnica — MiUNE 2.0 | UNE Bootcamp 2026*
