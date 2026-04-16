const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100, // Límite de 100 peticiones por IP por cada ventana de 15mins
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.' }
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  limit: 5, // 5 intentos de auth
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Demasiados intentos erróneos, por favor inténtalo en una hora.' }
});

module.exports = {
  globalLimiter,
  authLimiter
};
