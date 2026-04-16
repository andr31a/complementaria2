const categoriaModel = require("../models/categoriaModel");
const AppError = require("../utils/AppError");

exports.getAll = async (req, res, next) => {
  try {
    const page = Number.parseInt(req.query.page, 10) || 1;
    const pageSize = Number.parseInt(req.query.pageSize, 10) || 10;
    
    const filters = {
      nombre: req.query.nombre,
      activa: req.query.activa,
    };

    const sort = {
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder
    };

    const { categorias, total } = await categoriaModel.getAll(page, pageSize, filters, sort);

    res.status(200).json({
      success: true,
      count: categorias.length,
      total,
      page,
      pageSize,
      data: categorias,
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const categoriaId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(categoriaId)) {
      return next(new AppError("El ID de la categoría debe ser numérico", 400));
    }

    const categoria = await categoriaModel.getById(categoriaId);

    if (!categoria) {
      return res.status(404).json({
        success: false,
        message: `Categoría no encontrada con el id ${categoriaId}`,
      });
    }

    res.status(200).json({
      success: true,
      data: categoria,
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const nuevaCategoria = await categoriaModel.create(req.body);

    res.status(201).json({
      success: true,
      data: nuevaCategoria,
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const categoriaId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(categoriaId)) {
      return next(new AppError("El ID de la categoría debe ser numérico", 400));
    }

    const categoriaActualizada = await categoriaModel.update(categoriaId, req.body);

    if (!categoriaActualizada) {
      return res.status(404).json({
        success: false,
        message: `Categoría no encontrada con el id ${categoriaId}`,
      });
    }

    res.status(200).json({
      success: true,
      data: categoriaActualizada,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteResource = async (req, res, next) => {
  try {
    const categoriaId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(categoriaId)) {
      return next(new AppError("El ID de la categoría debe ser numérico", 400));
    }

    const resultado = await categoriaModel.remove(categoriaId);

    if (!resultado.deleted && resultado.reason === "not_found") {
      return res.status(404).json({
        success: false,
        message: `Categoría no encontrada con el id ${categoriaId}`,
      });
    }

    if (!resultado.deleted && resultado.reason === "has_documents") {
      return next(
        new AppError(
          "No puedes eliminar una categoría que todavía tiene documentos asociados",
          400,
        ),
      );
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};