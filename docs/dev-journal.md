# 📓 Dev Journal — MiUNE 2.0
## Bitácora de 11 Semanas de Desarrollo con IA

*Andrea — UNE Bootcamp de Desarrollo de Software 2026*

---

## 🗓️ Semana 1 — Fundamentos y Arquitectura Inicial

**Lo aprendido:** Inicialización de un proyecto Node.js con Express desde cero. Entendí la diferencia entre un servidor estático y una REST API, cómo funcionan las rutas, los controladores y la estructura MVC.

**Decisiones tomadas:** Elegí Express por su minimalismo y facilidad de prototipado. Definí la separación en `/controllers`, `/routes`, `/models` y `/middleware` desde el primer día para evitar el caos en el código.

**Uso de IA:** Le pedí a la IA que me explicara el patrón MVC de forma visual y que generara la estructura de carpetas base. El prompt más útil fue: *"Explícame cómo usar el patrón MVC en Express con un ejemplo de un API de documentos"*.

---

## 🗓️ Semana 2 — Prisma ORM y PostgreSQL

**Lo aprendido:** Cómo se define un schema de base de datos relacional usando Prisma. Aprendí a escribir modelos, relaciones `one-to-many`, las diferencias entre `migrate` y `db push`, y cómo hacer queries complejas con `findMany`, `include` y filtros dinámicos.

**Decisiones tomadas:** Opté por Supabase como proveedor PostgreSQL por su generosa capa gratuita y su panel de control intuitivo. El modelo final tiene 3 tablas clave: `Usuario`, `Categoria` y `Documento`.

**Reto:** El campo de `enum UserRole` al principio causaba errores al hacer el seed por incompatibilidades del adaptador Prisma. Se resolvió con un `prisma db push --accept-data-loss` y regenerando el cliente.

**Uso de IA:** Le pedí que generara el `schema.prisma` completo basado en los requisitos del módulo documental. La IA también me ayudó a escribir el archivo `seed.js` con datos realistas.

---

## 🗓️ Semana 3 — Modelos Dinámicos y Primeras Rutas

**Lo aprendido:** Diferencia entre queries estáticas y dinámicas. Implementé paginación (`page`, `pageSize`), filtrado por múltiples parámetros y ordenamiento (`sortBy`, `sortOrder`) en los modelos de Prisma.

**Decisiones tomadas:** Centralicé toda la lógica de base de datos en archivos `/models/*.js` separados de los controladores. Esto hizo el código mucho más limpio y testeable.

**Uso de IA:** *"¿Cómo implemento paginación dinámica con Prisma que soporte filtros combinados de título and estado and categoriaId?"*. La IA generó toda la función `getAll` con el patrón `where: { AND: [...] }`.

---

## 🗓️ Semana 4 — Autenticación JWT y Sistema de Roles

**Lo aprendido:** El ciclo completo de autenticación: hash de contraseña con `bcrypt`, firma de token con `jsonwebtoken`, verificación con middleware, y control de acceso por roles (RBAC).

**Decisiones tomadas:** Implementé dos middlewares separados: `authenticateToken` (verifica la firma del JWT) y `requireRole` (verifica que el payload del JWT contenga el rol necesario). Esta separación permite reutilizarlos de forma independiente.

**Reto mayor:** Entender cómo el payload del JWT puede quedar desactualizado en el `localStorage` del navegador después de un re-seed de la base de datos. Aprendí que la solución siempre es forzar un nuevo login para regenerar el token.

**Uso de IA:** *"Genera un middleware de autenticación JWT para Express que verifique la firma y maneje correctamente el error TokenExpiredError"*.

---

## 🗓️ Semana 5 — Uploads, Rate Limiting y Caché Redis

**Lo aprendido:** Cómo `Multer` intercepta peticiones `multipart/form-data` antes de que lleguen al controlador. La diferencia entre `diskStorage` (local) y `CloudinaryStorage` (nube). Cómo `express-rate-limit` protege contra ataques de fuerza bruta. Cómo Redis actúa como una memoria caché intermedia entre Express y PostgreSQL.

**Decisiones tomadas:** Implementé dos limitadores de tasa distintos: uno global (100 req/15min) y uno específico para `/auth` (5 req/hora). Para Redis, el middleware de caché se activa solo en `GET` y se invalida automáticamente en mutaciones `POST/PUT/DELETE`.

**Reto:** Redis devolvía un error `TypeError: Invalid protocol` porque la URL del `.env` no incluía el protocolo `redis://`. La IA detectó el problema inmediatamente revisando el stack trace.

**Uso de IA:** *"¿Cómo implemento un middleware de caché con Redis que guarde las respuestas GET y se invalide solo en mutaciones?"*.

---

## 🗓️ Semana 6 — Documentación Swagger y Testing Jest

**Lo aprendido:** Cómo `swagger-jsdoc` parsea los comentarios JSDoc con notación `@swagger` y construye automáticamente una UI de documentación interactiva. Cómo escribir tests de integración con `Jest` y `Supertest` que levanten la app sin un servidor real.

**Decisiones tomadas:** Documenté todas las rutas con anotaciones Swagger detalladas. Escribí 15 tests de integración cubriendo flujos completos de autenticación, RBAC, paginación, filtros y caché.

**Uso de IA:** *"Escribe 15 tests de integración con Jest y Supertest para una API REST de documentos académicos que incluya auth JWT, paginación, filtros y caché Redis"*.

---

## 🗓️ Semanas 7-8 — Frontend: React + Vite + Glassmorphism

**Lo aprendido:** Cómo inicializar un proyecto React con Vite. La filosofía de Zustand como alternativa minimalista a Redux. El patrón de Axios interceptors para inyectar el JWT automáticamente en cada petición y redirigir al login si el servidor devuelve 401. Framer Motion para animaciones de entrada y salida de componentes.

**Decisiones tomadas:** Diseño Dark Mode con efectos Glassmorphism usando CSS Custom Properties (variables). Lazy Loading de componentes con `React.lazy` y `<Suspense>` para optimizar la carga inicial.

**Uso de IA:** *"Crea una página de Login moderna con diseño Glassmorphism en dark mode usando React y Framer Motion. Debe conectarse a un backend Express con JWT"*.

---

## 🗓️ Semana 9 — Dashboard Interactivo y Rutas Anidadas

**Lo aprendido:** El patrón de Nested Routes en React Router 6 usando `<Outlet />`. Cómo `<NavLink>` aplica estilos activos automáticamente según la ruta actual. Cómo hacer múltiples llamadas API en paralelo con `Promise.all`.

**Decisiones tomadas:** Crear un módulo `Overview`, `DocumentosList`, `CategoriasList` como sub-vistas del `Dashboard`. El sidebar navega entre ellas sin recargar la página — experiencia de SPA real.

**Reto:** El dashboard original era una fachada estática con números hardcodeados (24 documentos, 5 categorías). Se refactorizó completamente para extraer los datos reales de la API.

---

## 🗓️ Semana 10 — Formularios CRUD y Validaciones

**Lo aprendido:** Cómo construir formularios que envíen datos como `multipart/form-data` usando la API nativa de JavaScript `FormData`. La diferencia entre enviar JSON plano y un formulario con archivo adjunto. Cómo `express-validator` sanitiza y valida los campos del cuerpo de una petición con `body()` y `validationResult()`.

**Decisiones tomadas:** Migré completamente de `Joi` a `express-validator` para la validación de inputs. `DocumentoForm.jsx` es un componente inteligente que detecta si es modo creación o edición basándose en la presencia del `id` en los parámetros de la URL.

**Reto mayor:** Cloudinary retornó un error `429 Too Many Requests` bloqueando todas las subidas. Se implementó un *bypass local* con `multer.diskStorage` para continuar el desarrollo sin depender de la cuota de la API externa.

---

## 🗓️ Semana 11 — Debugging Avanzado, Documentación Final y Despliegue

**Lo aprendido:** Cómo usar `Supertest` directamente en scripts de depuración independientes de los tests para aislar errores 500. Cómo leer stack traces de Prisma para identificar errores de conexión (`ECONNREFUSED`, `Tenant or user not found`). El flujo completo de despliegue en Render (backend) y Vercel (frontend).

**Errores resueltos con IA:**
1. `Invalid protocol` — Redis URL sin prefijo `redis://`
2. `Tenant or user not found` — Supabase en modo pausa, resuelto despertando el proyecto
3. `Unknown argument role` — Seed usando `role` en vez de `role` (campo del schema desincronizado)
4. `Error 500 login` — JWT_SECRET ausente en el `.env`
5. `403 Forbidden` — Token JWT desactualizado en localStorage después del re-seed
6. `Invalid cloud_name` — Nombre de Cloudinary incorrecto en el `.env`

**Reflexión Final:**

Este bootcamp me enseñó que el desarrollo de software profesional no es solo escribir código, sino tomar decisiones de arquitectura, depurar errores crípticos, gestionar herramientas externas y documentar correctamente para que otros puedan entender y mantener tu trabajo. 

La IA actuó como un compañero técnico que aceleró dramáticamente cada fase: generando código boilerplate, detectando errores en stack traces, sugiriendo patrones de diseño y redactando documentación. Pero las decisiones sobre qué construir, cómo estructurarlo y qué problemas priorizar siempre fueron mías.

El mayor aprendizaje no fue ninguna tecnología específica, sino el proceso iterativo de construir → probar → fallar → entender → mejorar. Ese ciclo es el núcleo de la ingeniería de software.

---

*Bitácora completada — Abril 2026 | UNE Bootcamp de Desarrollo*
