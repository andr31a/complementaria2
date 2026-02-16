# 📂 API REST - Módulo de Gestión Documental (MiUNE 2.0)

![Node.js](https://img.shields.io/badge/Node.js-v20-green) ![Express](https://img.shields.io/badge/Express-v4.18-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 📖 Descripción

API REST backend desarrollada con **Node.js** y **Express** para gestionar el ciclo de vida de los documentos (creación, lectura, actualización y eliminación) dentro del sistema de la Coordinación de Sistemas de MiUNE 2.0.

Este microservicio permite centralizar manuales, reportes y normativas, asegurando la integridad de los datos mediante validaciones robustas antes de su almacenamiento.

## 🛠️ Tecnologías Utilizadas

- **Runtime:** Node.js
- **Framework:** Express.js
- **Validación:** Joi
- **Seguridad/Utilidades:** Cors, Dotenv
- **Entorno de Desarrollo:** Nodemon

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- npm

### Pasos

1.  **Clonar el repositorio**

    ```bash
    git clone https://github.com/andr31a/miune-docs-api
    cd miune-docs-api
    ```

2.  **Instalar dependencias**

    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**
    Crea un archivo `.env` en la raíz del proyecto basándote en el ejemplo:

    ```bash
    cp .env.example .env
    ```

    Asegúrate de que tu `.env` tenga:

    ```env
    PORT=3000
    NODE_ENV=development
    ```

4.  **Iniciar el servidor**
    ```bash
    npm run dev
    ```
    El servidor correrá en: `http://localhost:3000`

## 🔗 API Endpoints

La URL base es: `/api/documentos`

### 1. Obtener todos los documentos

- **Método:** `GET`
- **URL:** `/`
- **Respuesta Exitosa (200 OK):**
  ```json
  {
    "success": true,
    "count": 3,
    "data": [
      {
        "id": "uuid-generado...",
        "titulo": "Manual de Usuario",
        "tipo": "application/pdf",
        "peso": "2.5MB",
        "estado": "publicado"
      }
    ]
  }
  ```

### 2. Obtener un documento por ID

- **Método:** `GET`
- **URL:** `/:id`
- **Respuesta Exitosa (200 OK):** Objeto del documento.
- **Error (404 Not Found):** Si el ID no existe.

### 3. Crear un nuevo documento

- **Método:** `POST`
- **URL:** `/`
- **Body (JSON):**
  ```json
  {
    "titulo": "Nuevo Reglamento 2026",
    "tipo": "application/pdf",
    "peso": "1.5MB",
    "estado": "borrador"
  }
  ```
- **Validaciones:**
  - `titulo`: Requerido, min 3 chars.
  - `tipo`: Solo 'application/pdf', 'application/docx', 'application/xlsx'.
  - `estado`: Solo 'borrador' o 'publicado'.

### 4. Actualizar un documento

- **Método:** `PUT`
- **URL:** `/:id`
- **Body (JSON):** (Campos opcionales)
  ```json
  {
    "titulo": "Nuevo Reglamento Corregido",
    "estado": "publicado"
  }
  ```

### 5. Eliminar un documento

- **Método:** `DELETE`
- **URL:** `/:id`
- **Respuesta Exitosa (200 OK):** `{ "success": true, "data": {} }`

## 📂 Estructura del Proyecto

```text
miune-docs-api/
├── src/
│   ├── controllers/   # Lógica de los endpoints
│   ├── middleware/    # Validaciones y manejo de errores
│   ├── models/        # Modelo de datos (Array en memoria)
│   ├── routes/        # Definición de rutas
│   ├── utils/         # Clases de utilidad (AppError)
│   └── app.js         # Configuración de Express
├── .env               # Variables de entorno (No subir a Git)
├── .env.example       # Plantilla de variables
└── package.json
```
