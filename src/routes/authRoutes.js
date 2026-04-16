const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { body, validationResult } = require("express-validator");
const AppError = require("../utils/AppError");
const { authenticateToken } = require("../middleware/authMiddleware");

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(errors.array()[0].msg, 400));
  }
  next();
};

const validateRegister = [
  body("nombre").trim().isLength({ min: 2 }).withMessage("El nombre es requerido"),
  body("email").trim().isEmail().withMessage("Email inválido"),
  body("password")
    .isLength({ min: 8 }).withMessage("La contraseña debe tener al menos 8 caracteres.")
    .matches(/(?=.*[0-9])/).withMessage("La contraseña debe contener al menos un número.")
    .matches(/(?=.*[A-Z])/).withMessage("La contraseña debe contener al menos una mayúscula."),
  checkValidation
];

const validateLogin = [
  body("email").trim().isEmail().withMessage("Email inválido"),
  body("password").notEmpty().withMessage("Contraseña requerida"),
  checkValidation
];

const { authLimiter } = require("../middleware/rateLimiter");

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado
 */
router.post("/register", authLimiter, validateRegister, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT Token
 */
router.post("/login", authLimiter, validateLogin, authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Devuelve el perfil actual (Requiere token JWT)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Datos del usuario
 */
router.get("/me", authenticateToken, authController.getMe);

module.exports = router;
