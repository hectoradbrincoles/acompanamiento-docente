const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// ✅ Registrar un nuevo usuario (solo para administradores)
router.post('/registrar', authController.registrar);

// ✅ Login de usuarios (recibe usuario y contraseña)
router.post('/login', authController.login);

// ✅ Obtener perfil del usuario autenticado (requiere token en el header)
router.get('/perfil', authMiddleware, authController.perfil);

module.exports = router;

