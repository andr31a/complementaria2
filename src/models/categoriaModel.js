const prisma = require("../lib/prisma");

const getAll = async (page = 1, pageSize = 10, filters = {}, sort = { sortBy: "nombre", sortOrder: "asc" }) => {
  const skip = (page - 1) * pageSize;
  const where = {};
  
  if (filters.nombre) where.nombre = { contains: filters.nombre, mode: "insensitive" };
  if (filters.activa !== undefined) {
    where.activa = filters.activa === "true" || filters.activa === true;
  }

  const orderBy = { [sort.sortBy || "nombre"]: sort.sortOrder || "asc" };

  const [categorias, total] = await Promise.all([
    prisma.categoria.findMany({
      where,
      skip,
      take: pageSize,
      orderBy,
      include: {
        _count: { select: { documentos: true } },
      },
    }),
    prisma.categoria.count({ where }),
  ]);

  return {
    categorias,
    total,
    page,
    pageSize,
  };
};

const getById = async (id) => {
  return prisma.categoria.findUnique({
    where: { id },
    include: {
      documentos: {
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { documentos: true },
      },
    },
  });
};

const create = async (data) => {
  return prisma.categoria.create({ data });
};

const update = async (id, data) => {
  const categoriaExistente = await prisma.categoria.findUnique({ where: { id } });

  if (!categoriaExistente) {
    return null;
  }

  return prisma.categoria.update({
    where: { id },
    data,
  });
};

const remove = async (id) => {
  const categoriaExistente = await prisma.categoria.findUnique({
    where: { id },
    include: { _count: { select: { documentos: true } } },
  });

  if (!categoriaExistente) {
    return { deleted: false, reason: "not_found" };
  }

  if (categoriaExistente._count.documentos > 0) {
    return { deleted: false, reason: "has_documents" };
  }

  await prisma.categoria.delete({ where: { id } });
  return { deleted: true };
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};