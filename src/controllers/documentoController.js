const documentoModel = require("../models/documentoModel");
const AppError = require("../utils/AppError");

// @desc    Obtener todos los documentos
// @route   GET /api/documentos
exports.getAll = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const pageSize = Number.parseInt(req.query.pageSize, 10) || 10;
    
    const filters = {
      titulo: req.query.titulo,
      estado: req.query.estado,
      categoriaId: req.query.categoriaId
    };

    const sort = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder
    };

    const { documentos, total } = await documentoModel.getAll(page, pageSize, filters, sort);

    res.status(200).json({
      success: true,
      count: documentos.length,
      total,
      page,
      pageSize,
      data: documentos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener un documento por ID
// @route   GET /api/documentos/:id
exports.getById = async (req, res, next) => {
  try {
    const documentoId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(documentoId)) {
      return next(new AppError("El ID del documento debe ser numérico", 400));
    }

    const documento = await documentoModel.getById(documentoId);

    if (!documento) {
      return res.status(404).json({
        success: false,
        message: `Documento no encontrado con el id ${documentoId}`,
      });
    }

    res.status(200).json({
      success: true,
      data: documento,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Crear un nuevo documento
// @route   POST /api/documentos
exports.create = async (req, res, next) => {
  try {
    const nuevoDocumento = await documentoModel.create(req.body);

    res.status(201).json({
      success: true,
      data: nuevoDocumento,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Actualizar un documento existente
// @route   PUT /api/documentos/:id
exports.update = async (req, res, next) => {
  try {
    const documentoId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(documentoId)) {
      return next(new AppError("El ID del documento debe ser numérico", 400));
    }

    const documentoActualizado = await documentoModel.update(documentoId, req.body);

    if (!documentoActualizado) {
      return res.status(404).json({
        success: false,
        message: `Documento no encontrado con el id ${documentoId}`,
      });
    }

    res.status(200).json({
      success: true,
      data: documentoActualizado,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar un documento
// @route   DELETE /api/documentos/:id
exports.deleteResource = async (req, res, next) => {
  try {
    const documentoId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(documentoId)) {
      return next(new AppError("El ID del documento debe ser numérico", 400));
    }

    const eliminado = await documentoModel.remove(documentoId);

    if (!eliminado) {
      return res.status(404).json({
        success: false,
        message: `Documento no encontrado con el id ${documentoId}`,
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
