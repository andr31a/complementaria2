const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

exports.register = async (req, res, next) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      return next(new AppError("El email ya está registrado", 400));
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashedPassword,
        // role es USER por defecto por el schema 
      },
    });

    res.status(201).json({
      success: true,
      message: "Registro exitoso",
      data: {
        id: newUser.id,
        nombre: newUser.nombre,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar el usuario
    const user = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!user || user.activo === false) {
      return next(new AppError("Credenciales inválidas o cuenta desactivada", 401));
    }

    // Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new AppError("Credenciales inválidas", 401));
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
    );

    res.status(200).json({
      success: true,
      message: "Login exitoso",
      token,
      data: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    // req.user debe venir del middleware de autenticación
    const user = await prisma.usuario.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return next(new AppError("Usuario no encontrado", 404));
    }

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        activo: user.activo,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
