// 📁 backend/middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'secretoSuperSeguro';

/**
 * Middleware para proteger rutas autenticadas.
 * Verifica el token JWT enviado en el encabezado Authorization.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('⚠️ No se proporcionó un token válido en el header Authorization.');
    return res.status(401).json({ error: 'No se proporcionó un token válido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    
    // 📌 Log de depuración
    console.log('✅ Token verificado con éxito:', decoded);

    req.usuario = decoded; // { id, rol }
    next();
  } catch (error) {
    console.error('❌ Error al verificar token:', error.message);
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;
