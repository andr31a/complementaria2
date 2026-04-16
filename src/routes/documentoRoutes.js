const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const documentoController = require("../controllers/documentoController");
const { checkCache, clearCache } = require("../middleware/cacheMiddleware");
const { validateCreate, validateUpdate } = require("../middleware/validation");
const upload = require("../middleware/uploadMiddleware");

const mapFileToBody = (req, res, next) => {
  if (req.file) {
    // Si viene de Cloudinary usa .path o .url, si viene local extraemos directo filename publico
    req.body.urlArchivo = req.file.path.startsWith('http') ? req.file.path : '/uploads/' + req.file.filename;
    req.body.tipo = req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? "application/docx" : req.file.mimetype;
    req.body.peso = (req.file.size / (1024 * 1024)).toFixed(2) + "MB";
  }
  next();
};

router
  .route("/")
  .get(checkCache("documentos"), documentoController.getAll)
  .post(
    authenticateToken,
    upload.single("archivo"),
    mapFileToBody,
    validateCreate,
    clearCache("documentos"),
    documentoController.create
  );

router
  .route("/:id")
  .get(checkCache("documentos"), documentoController.getById)
  .put(
    authenticateToken,
    upload.single("archivo"),
    mapFileToBody,
    validateUpdate,
    clearCache("documentos"),
    documentoController.update
  )
  .delete(authenticateToken, clearCache("documentos"), documentoController.deleteResource);

module.exports = router;
