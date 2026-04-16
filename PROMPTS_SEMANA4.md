## PROMPTS UTILIZADOS - SEMANA 4

### Prompt 1: Diseño de Sistema de Auth

**Objetivo:** Obtener arquitectura general del sistema y dependencias necesarias.

**Prompt:**
Contexto: Estoy desarrollando una API REST para gestión documental (MiUNE 2.0) usando Node.js, Express, Prisma y PostgreSQL.
Necesito implementar un sistema completo de autenticación y autorización.
Funcionalidades requeridas:
1. Registro de usuarios con validación de email único y hasheo de contraseña
2. Login con email y contraseña, generar un JWT
3. Middleware para proteger rutas con roles USER y ADMIN

Proporciona:
1. Esquema Prisma de Usuario actualizado con roles y contraseña
2. Paquetes requeridos para auth y validación
3. Explicación de la estructura del controlador de Auth

**Resultado:**
- Esquema sugerido de Prisma añadiendo `password` (String) y un enum `UserRole { USER, ADMIN }` que reemplaza al viejo campo rol.
- Sugerencia de instalación de los paquetes: `bcrypt` y `jsonwebtoken`. Como mi código ya disponía de `joi` en la semana pasada, se me sugirió emplearlo.
- Se esbozaron las funciones necesarias en `authController.js` (como register, login, y devolver datos de perfil `me`).

**Modificaciones:**
- Modifiqué el `seed.js` para asegurar que el listado de prueba ahora estuvieran dentro de las opciones dictadas por el Enum de Prisma y tuvieran contraseñas introducidas con `bcrypt`.

**Aprendizajes:**
Aprendí la diferencia entre cómo un middleware detiene o permite accionar al controlador siguiente, y la importancia de proteger las credenciales encriptándolas antes de migrarlas.

---

### Prompt 2: Middlewares y Rutas de Auth

**Objetivo:** Desarrollar los middlewares de validación JWT y Roles.

**Prompt:**
Necesito crear middleware para proteger rutas en mi API Express.
Contexto: 
- Uso JWT generados con jsonwebtoken (secret está en process.env.JWT_SECRET)
- Payload del JWT contiene { id, email, role }
- Coleccionar desde token Header: "Bearer <token>"

Genera:
1. Middleware authenticateToken: Extraer, verificar validación y adjuntar decodificación a req.user o lanzar error 401.
2. Middleware requireRole: Recibe array de roles y aprueba si el request user role coincide. Rechaza error 403 de otro modo.
3. El AuthController completo.

**Resultado:**
- Funciones detalladas `authenticateToken` y `requireRole` dentro de `authMiddleware.js`.
- Utilización correcta de Joi Schema validator (`validateLogin`, `validateRegister`) inyectados en el route mapping de `authRoutes.js`.

**Modificaciones:**
- Añadí una expresión regular de validación de contraseñas de manera custom (requiriendo por lo menos números y mayúscula en Joi para el Registro de modo que esté fortalecido).

**Aprendizajes:**
Entendí que para aplicar Roles debes sí o sí encadenar primero la validación del Token (`authenticateToken`) en tu router de Express, y solo entonces enviar el segundo middleware que revise el Rol (`requireRole(['ADMIN'])`), en lugar de intentar hacer todo en una única gran función sobrecargada.
