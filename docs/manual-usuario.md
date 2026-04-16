# 📖 Manual de Usuario — MiUNE 2.0

> Sistema de Gestión Documental Académica  
> Versión 2.0 | Universidad Nacional Experimental (UNE)

---

## ¿Qué es MiUNE 2.0?

MiUNE 2.0 es el portal digital centralizado de documentación institucional de la UNE. Permite a estudiantes y docentes acceder, gestionar y organizar documentos académicos (reglamentos, manuales, actas y formularios) de manera segura y eficiente desde cualquier dispositivo conectado a internet.

---

## Acceso al Sistema

### Iniciar Sesión

1. Abre tu navegador y navega a la URL del portal.
2. Ingresa tu **correo institucional** (ej: `usuario@miune.edu`).
3. Ingresa tu **contraseña**.
4. Haz clic en **"Entrar"**.

> 🔒 Por seguridad, la sesión expira automáticamente después de **24 horas**.

---

## Panel de Control (Dashboard)

Al iniciar sesión, verás el Panel de Control con tres secciones principales en el menú lateral izquierdo:

| Sección | Descripción |
|---------|-------------|
| 📊 **Resumen** | Estadísticas rápidas de documentos y categorías |
| 📄 **Documentos** | Gestión completa del directorio documental |
| 🗂️ **Categorías** | Administración de clasificaciones (solo ADMIN) |

---

## Gestión de Documentos

### Ver Documentos
1. Haz clic en **"Documentos"** en el menú lateral.
2. Verás una tabla con todos los documentos disponibles mostrando:
   - Título, tipo de archivo, estado y peso.
3. Los estados posibles son:
   - 🟡 **Borrador** — En preparación, no visible al público.
   - 🟢 **Publicado** — Disponible para consulta.
   - ⚫ **Archivado** — Fuera de circulación activa.

### Crear un Nuevo Documento *(requiere autenticación)*
1. Haz clic en el botón **"+ Nuevo Doc"**.
2. Rellena el formulario:
   - **Título**: Nombre descriptivo del documento.
   - **Categoría**: Selecciona a qué área pertenece.
   - **Estado**: Define si es borrador, publicado o archivado.
   - **Resumen**: Breve descripción del contenido (opcional).
   - **Archivo**: Selecciona el archivo PDF, imagen o documento Word.
3. Haz clic en **"Crear Documento y Subir"**.

> ⚠️ Formatos aceptados: PDF, JPG, PNG, WebP, DOCX. Tamaño máximo: 10MB.

### Editar un Documento *(requiere autenticación)*
1. En la tabla de documentos, busca el documento a modificar.
2. Haz clic en el enlace **"✏️ Editar"** de esa fila.
3. Modifica los campos que desees (el archivo es opcional al editar).
4. Haz clic en **"Actualizar Documento"**.

---

## Gestión de Categorías *(solo Administradores)*

### Ver Categorías
1. Haz clic en **"Categorías"** en el menú lateral.
2. Verás una tabla con todas las categorías, su estado (Activa/Inactiva) y fecha de creación.

### Crear una Nueva Categoría
1. Haz clic en **"+ Nueva Categoría"**.
2. Completa el formulario:
   - **Nombre**: Identificador único de la categoría.
   - **Descripción**: Qué tipo de documentos agrupa.
   - **Activa**: Marca si la categoría es visible.
3. Haz clic en **"Crear Categoría"**.

> 🚫 Solo usuarios con rol **ADMIN** pueden crear o modificar categorías.

---

## Seguridad

- Las contraseñas se almacenan cifradas y nunca son visibles.
- El sistema bloquea automáticamente cuentas con **5 intentos fallidos** de inicio de sesión en 1 hora.
- Toda la comunicación entre el navegador y el servidor está protegida con tokens **JWT**.
- El sistema implementa caché inteligente para agilizar las respuestas repetidas.

---

## Soporte

Para reportar problemas o solicitar acceso de administrador, contactar al área de sistemas a través de los canales institucionales de la UNE.

---

*Manual generado para el Proyecto Integrador de Bootcamp — Semana 11 | UNE 2026*
