const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return next(new AppError("No autorizado: Token no proporcionado", 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return next(new AppError("No autorizado: Token expirado", 401));
      }
      return next(new AppError("No autorizado: Token inválido", 401));
    }

    req.user = user;
    next();
  });
};

exports.requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError("No autorizado: Usuario no autenticado", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("Prohibido: No tienes permisos suficientes", 403));
    }

    next();
  };
};
