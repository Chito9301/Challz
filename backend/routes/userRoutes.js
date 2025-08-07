const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Ajusta ruta

// Ruta para obtener todos los usuarios
router.get('/users', userController.getAllUsers);

// Ruta para obtener un usuario específico por id
router.get('/users/:id', userController.getUserById);

module.exports = router;
