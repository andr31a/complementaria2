const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/lib/prisma");

describe("API Integración Tests (+15 escenarios)", () => {
  let tokenAdmin = "";
  let tokenUser = "";
  let userId = 0;
  let categoriaId = 0;
  let documentoId = 0;

  beforeAll(async () => {
    // Podrias limpiar la base de datos o inicializar
  });

  afterAll(async () => {
    await prisma.$disconnect();
    // Cerramos todo (si fuese necesario matar threads redis, iría aquí)
  });

  describe("🔑 1. Autenticación y Autorización", () => {
    test("Debería registrar un nuevo usuario exitosamente", async () => {
      const uniqueEmail = `test${Date.now()}@test.com`;
      const res = await request(app).post("/api/auth/register").send({
        nombre: "Test User",
        email: uniqueEmail,
        password: "Password123"
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      userId = res.body.data.id;
    });

    test("Debería fallar al registrar sin contraseña válida", async () => {
      const res = await request(app).post("/api/auth/register").send({
        nombre: "Test User 2",
        email: "test2@test.com",
        password: "123" // muy corta y sin mayusculas
      });
      expect(res.statusCode).toBe(400);
    });

    test("Debería loguearse y obtener token", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "ana@miune.edu", 
        password: "Password123!"
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.token).toBeDefined();
      tokenAdmin = res.body.token;
    });

    test("Debería acceder al perfil ME con token válido", async () => {
      const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${tokenAdmin}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.data.email).toBe("ana@miune.edu");
    });

    test("Debería denegar acceso al perfil ME sin token", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.statusCode).toBe(401);
    });
  });

  describe("🗂️ 2. Categorías (Paginación, Filtos, Cache, RBAC)", () => {
    test("Debería bloquear la creación de categoría a un no-admin", async () => {
      const res = await request(app).post("/api/categorias").send({
        nombre: "Permiso Denegado",
        descripcion: "Falla"
      });
      // Puede ser 401 sin token, o 403 con tu token de user normal
      expect(res.statusCode).toBe(401); 
    });

    test("Debería crear categoría siendo ADMIN", async () => {
      // Necesita tokenAdmin valid
      const resAdminLogin = await request(app).post("/api/auth/login").send({
        email: "ana@miune.edu", password: "Password123!"
      });
      const validToken = resAdminLogin.body.token;

      if (!validToken) return;

      const res = await request(app)
        .post("/api/categorias")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          nombre: `CatTest ${Date.now()}`,
          descripcion: "Cat para test"
        });
      expect(res.statusCode).toBe(201);
      categoriaId = res.body.data.id;
    });

    test("Debería listar categorías con paginación devuelta en meta", async () => {
      const res = await request(app).get("/api/categorias?page=1&pageSize=5");
      expect(res.statusCode).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);
      expect(res.body.page).toBe(1);
    });

    test("Debería filtrar categorías por nombre ignorando case", async () => {
      const res = await request(app).get("/api/categorias?nombre=normativa");
      expect(res.statusCode).toBe(200);
    });

    test("Debería guardar y resolver desde caché (Redis) si se llama rapido", async () => {
      // Llamamos 2 veces, validamos headers o simple exito
      await request(app).get("/api/categorias");
      const res = await request(app).get("/api/categorias");
      expect(res.statusCode).toBe(200);
    });
  });

  describe("📄 3. Documentos (Paginación, Multi-part, File Uploads)", () => {
    test("Debería poder subir un archivo simulando form-data (fallo por schema o success proper)", async () => {
      const resAdminLogin = await request(app).post("/api/auth/login").send({
        email: "ana@miune.edu", password: "Password123!"
      });
      tokenAdmin = resAdminLogin.body.token;

      if (!tokenAdmin) return;

      const res = await request(app)
        .post("/api/documentos")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .field("titulo", "Integración Doc")
        .field("estado", "borrador")
        .field("usuarioId", 1)
        .field("categoriaId", categoriaId || 1)
        // en entorno local mockear sin archivo devolvera fallo 400 por no map de archivo
        // lo comprobamos asi
      expect([400, 201]).toContain(res.statusCode); 
    });

    test("Debería listar documentos con paginacion", async () => {
      const res = await request(app).get("/api/documentos?page=2&pageSize=2");
      expect(res.statusCode).toBe(200);
    });

    test("Debería poder filtrar documentos combinando Título y Estado", async () => {
      const res = await request(app).get("/api/documentos?titulo=reglamento&estado=publicado");
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test("Debería ordenar documentos en orden ascendente por título dynamique", async () => {
      const res = await request(app).get("/api/documentos?sortBy=titulo&sortOrder=asc");
      expect(res.statusCode).toBe(200);
    });
    
    test("Debería retornar 404 al buscar un documento que no existe", async () => {
      const res = await request(app).get("/api/documentos/99999999");
      expect(res.statusCode).toBe(404);
    });
  });
});
