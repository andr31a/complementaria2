require("dotenv/config");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Falta DATABASE_URL en variables de entorno");
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

async function ensureBooleanColumn(tableName, columnName, defaultValue) {
  const existsResult = await prisma.$queryRawUnsafe(
    `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
          AND column_name = $2
      ) AS "exists"
    `,
    tableName,
    columnName,
  );

  const exists = existsResult?.[0]?.exists === true;

  if (!exists) {
    await prisma.$executeRawUnsafe(
      `ALTER TABLE "${tableName}" ADD COLUMN "${columnName}" BOOLEAN NOT NULL DEFAULT ${defaultValue ? "true" : "false"}`,
    );
    console.log(`Columna creada automáticamente: ${tableName}.${columnName}`);
  }
}

async function main() {
  await ensureBooleanColumn("Usuario", "activo", true);
  await ensureBooleanColumn("Categoria", "activa", true);

  await prisma.documento.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.usuario.deleteMany();

  const defaultPassword = bcrypt.hashSync("Password123!", 10);
  const usuariosData = [
    {
      nombre: "Ana Pérez",
      email: "ana@miune.edu",
      role: "ADMIN",
      password: defaultPassword,
      activo: true,
      updatedAt: new Date(),
    },
    {
      nombre: "Luis Gómez",
      email: "luis@miune.edu",
      role: "USER",
      password: defaultPassword,
      activo: true,
      updatedAt: new Date(),
    },
    {
      nombre: "María Torres",
      email: "maria@miune.edu",
      role: "USER",
      password: defaultPassword,
      activo: true,
      updatedAt: new Date(),
    },
    {
      nombre: "Carlos Ruiz",
      email: "carlos@miune.edu",
      role: "USER",
      password: defaultPassword,
      activo: true,
      updatedAt: new Date(),
    },
    {
      nombre: "Elena Díaz",
      email: "elena@miune.edu",
      role: "USER",
      password: defaultPassword,
      activo: true,
      updatedAt: new Date(),
    },
  ];
  const usuarios = await Promise.all(
    usuariosData.map((data) => prisma.usuario.create({ data })),
  );

  const categoriasData = [
    {
      nombre: "Manuales",
      descripcion: "Guías de uso del sistema",
      activa: true,
      updatedAt: new Date(),
    },
    {
      nombre: "Normativas",
      descripcion: "Reglamentos y políticas institucionales",
      activa: true,
      updatedAt: new Date(),
    },
    {
      nombre: "Reportes",
      descripcion: "Informes de gestión y resultados",
      activa: true,
      updatedAt: new Date(),
    },
    {
      nombre: "Formularios",
      descripcion: "Formatos administrativos vigentes",
      activa: true,
      updatedAt: new Date(),
    },
    {
      nombre: "Actas",
      descripcion: "Actas de reuniones y comités",
      activa: true,
      updatedAt: new Date(),
    },
  ];
  const categorias = await Promise.all(
    categoriasData.map((data) => prisma.categoria.create({ data })),
  );

  const usuariosCreados = await prisma.usuario.findMany({
    orderBy: { id: "asc" },
  });
  const categoriasCreadas = await prisma.categoria.findMany({
    orderBy: { id: "asc" },
  });

  await prisma.documento.createMany({
    data: [
      {
        titulo: "Manual de Usuario MiUNE 2.0",
        tipo: "application/pdf",
        peso: "2.5MB",
        estado: "publicado",
        resumen: "Guía completa de uso para estudiantes y docentes",
        urlArchivo: "https://docs.miune.edu/manual-miune-2-0.pdf",
        usuarioId: usuariosCreados[0].id,
        categoriaId: categoriasCreadas[0].id,
      },
      {
        titulo: "Reglamento de Pasantías 2026",
        tipo: "application/pdf",
        peso: "1.8MB",
        estado: "publicado",
        resumen: "Normativa oficial para gestión de pasantías",
        urlArchivo: "https://docs.miune.edu/reglamento-pasantias-2026.pdf",
        usuarioId: usuariosCreados[1].id,
        categoriaId: categoriasCreadas[1].id,
      },
      {
        titulo: "Reporte de Gestión Q1",
        tipo: "application/xlsx",
        peso: "1.1MB",
        estado: "borrador",
        resumen: "Métricas del primer trimestre",
        urlArchivo: "https://docs.miune.edu/reporte-gestion-q1.xlsx",
        usuarioId: usuariosCreados[2].id,
        categoriaId: categoriasCreadas[2].id,
      },
      {
        titulo: "Formato de Solicitud de Tutor",
        tipo: "application/docx",
        peso: "0.4MB",
        estado: "publicado",
        resumen: "Plantilla de solicitud de tutor académico",
        urlArchivo: "https://docs.miune.edu/formato-solicitud-tutor.docx",
        usuarioId: usuariosCreados[3].id,
        categoriaId: categoriasCreadas[3].id,
      },
      {
        titulo: "Acta Comité Técnico Enero",
        tipo: "application/pdf",
        peso: "0.9MB",
        estado: "archivado",
        resumen: "Acta de sesión del comité técnico",
        urlArchivo: "https://docs.miune.edu/acta-comite-enero.pdf",
        usuarioId: usuariosCreados[4].id,
        categoriaId: categoriasCreadas[4].id,
      },
      {
        titulo: "Guía de Carga de Documentos",
        tipo: "application/pdf",
        peso: "1.2MB",
        estado: "publicado",
        resumen: "Buenas prácticas para carga documental",
        urlArchivo: "https://docs.miune.edu/guia-carga-documentos.pdf",
        usuarioId: usuariosCreados[0].id,
        categoriaId: categoriasCreadas[0].id,
      },
    ],
  });

  console.log(`Usuarios creados: ${usuarios.length}`);
  console.log(`Categorías creadas: ${categorias.length}`);
  console.log("Documentos creados: 6");
}

main()
  .catch((error) => {
    console.error("Error al ejecutar seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
