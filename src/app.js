const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const documentoRoutes = require("./routes/documentoRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const { globalLimiter } = require("./middleware/rateLimiter");
const setupSwagger = require("./lib/swagger");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(globalLimiter);

// Servir la carpeta de bypass estático (para acceder a urlArchivo)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

setupSwagger(app);

app.use("/api/auth", authRoutes);
app.use("/api/documentos", documentoRoutes);
app.use("/api/categorias", categoriaRoutes);

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: "Bienvenido a la API del Módulo Documental MiUNE 2.0" });
});

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Ruta no encontrada" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(
      `Servidor corriendo en modo ${process.env.NODE_ENV} en el puerto ${PORT}`,
    );
  });
}

module.exports = app;
