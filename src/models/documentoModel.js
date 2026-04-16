const prisma = require("../lib/prisma");

const includeRelations = {
  usuario: {
    select: {
      id: true,
      nombre: true,
      email: true,
      role: true,
    },
  },
  categoria: {
    select: {
      id: true,
      nombre: true,
      descripcion: true,
    },
  },
};

const getAll = async (page = 1, pageSize = 10, filters = {}, sort = { sortBy: "createdAt", sortOrder: "desc" }) => {
  const skip = (page - 1) * pageSize;
  
  const where = {};
  if (filters.titulo) where.titulo = { contains: filters.titulo, mode: "insensitive" };
  if (filters.estado) where.estado = filters.estado;
  if (filters.categoriaId) where.categoriaId = Number(filters.categoriaId);

  const orderBy = { [sort.sortBy || "createdAt"]: sort.sortOrder || "desc" };

  const [documentos, total] = await Promise.all([
    prisma.documento.findMany({
      where,
      include: includeRelations,
      skip,
      take: pageSize,
      orderBy,
    }),
    prisma.documento.count({ where }),
  ]);

  return {
    documentos,
    total,
    page,
    pageSize,
  };
};

const getById = async (id) => {
  return prisma.documento.findUnique({
    where: { id },
    include: includeRelations,
  });
};

const create = async (data) => {
  return prisma.documento.create({
    data,
    include: includeRelations,
  });
};

const update = async (id, data) => {
  const documentoExistente = await prisma.documento.findUnique({ where: { id } });

  if (!documentoExistente) {
    return null;
  }

  return prisma.documento.update({
    where: { id },
    data,
    include: includeRelations,
  });
};

const remove = async (id) => {
  const documentoExistente = await prisma.documento.findUnique({ where: { id } });

  if (!documentoExistente) {
    return false;
  }

  await prisma.documento.delete({ where: { id } });
  return true;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
