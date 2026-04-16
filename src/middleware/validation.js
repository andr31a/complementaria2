const { body, validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

// Checker general que emite AppError si hay problemas
const catchValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg).join(", ");
    return next(new AppError(errorMessages, 400));
  }
  next();
};

const validateCreate = [
  body("titulo").trim().isLength({ min: 3, max: 150 }).withMessage("El título debe tener entre 3 y 150 caracteres"),
  body("tipo").isIn(["application/pdf", "application/docx", "application/xlsx", "image/jpeg", "image/png", "image/webp"]).withMessage("El tipo debe ser pdf, docx, xlsx o una imagen válida"),
  body("peso").notEmpty().withMessage("El peso del archivo es obligatorio"),
  body("estado").isIn(["borrador", "publicado", "archivado"]).withMessage("Estado inválido"),
  body("resumen").optional().isString().isLength({ max: 500 }),
  body("urlArchivo").optional().isString(),
  body("usuarioId").toInt().isInt({ min: 1 }).withMessage("El usuarioId es obligatorio"),
  body("categoriaId").toInt().isInt({ min: 1 }).withMessage("El categoriaId es obligatorio"),
  catchValidationErrors
];

const validateUpdate = [
  body("titulo").optional().trim().isLength({ min: 3, max: 150 }).withMessage("El título debe tener entre 3 y 150 caracteres"),
  body("tipo").optional().isIn(["application/pdf", "application/docx", "application/xlsx", "image/jpeg", "image/png", "image/webp"]),
  body("peso").optional().notEmpty(),
  body("estado").optional().isIn(["borrador", "publicado", "archivado"]),
  body("resumen").optional().isString().isLength({ max: 500 }),
  body("urlArchivo").optional().isString(),
  body("usuarioId").optional().toInt().isInt({ min: 1 }),
  body("categoriaId").optional().toInt().isInt({ min: 1 }),
  catchValidationErrors
];

const validateCategoriaCreate = [
  body("nombre").trim().isLength({ min: 3, max: 80 }).withMessage("El nombre de la categoría es obligatorio y mayor a 3 caracteres"),
  body("descripcion").optional().isString().isLength({ max: 255 }),
  body("activa").optional().isBoolean(),
  catchValidationErrors
];

const validateCategoriaUpdate = [
  body("nombre").optional().trim().isLength({ min: 3, max: 80 }).withMessage("El nombre debe tener al menos 3 caracteres"),
  body("descripcion").optional().isString().isLength({ max: 255 }),
  body("activa").optional().isBoolean(),
  catchValidationErrors
];

module.exports = {
  validateCreate,
  validateUpdate,
  validateCategoriaCreate,
  validateCategoriaUpdate,
};
