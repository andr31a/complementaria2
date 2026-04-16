const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require("../middleware/authMiddleware");
const categoriaController = require("../controllers/categoriaController");
const {
  validateCategoriaCreate,
  validateCategoriaUpdate,
} = require("../middleware/validation");

const { checkCache, clearCache } = require("../middleware/cacheMiddleware");

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Lista las categorías con paginación y filtros
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Arreglo de categorías
 *   post:
 *     summary: Crea una nueva categoría (Sólo ADMIN)
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoría creada
 */
router
  .route("/")
  .get(checkCache("categorias"), categoriaController.getAll)
  .post(authenticateToken, requireRole(["ADMIN"]), validateCategoriaCreate, clearCache("categorias"), categoriaController.create);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Obtener una categoría
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos de la categoría
 *   put:
 *     summary: Actualiza una categoría (Sólo ADMIN)
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría actualizada
 *   delete:
 *     summary: Elimina una categoría (Sólo ADMIN)
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Categoría eliminada
 */
router
  .route("/:id")
  .get(checkCache("categorias"), categoriaController.getById)
  .put(authenticateToken, requireRole(["ADMIN"]), validateCategoriaUpdate, clearCache("categorias"), categoriaController.update)
  .delete(authenticateToken, requireRole(["ADMIN"]), clearCache("categorias"), categoriaController.deleteResource);

module.exports = router;