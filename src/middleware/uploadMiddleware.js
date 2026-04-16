const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Crear la carpeta uploads al vuelo en caso de que no exista
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Ruta donde se guardará localmente
  },
  filename: function (req, file, cb) {
    // Generador de nombres únicos para evitar choques de archivos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Aceptamos de todo porque Cloudinary no nos limita aquí
  cb(null, true);
};

// Instanciamos el manejador local puro
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite generoso (10MB)
  }
});

module.exports = upload;
