const User = require('../models/User'); // Ajusta la ruta según tu estructura

/**
 * Obtiene la lista de usuarios con campos seleccionados, incluyendo username.
 * Puedes ajustar los campos que quieras enviar para no exponer datos sensibles.
 */
async function getAllUsers(req, res) {
  try {
    // Consulta todos los usuarios, seleccionando sólo campos seguros para el frontend
    const users = await User.find({}, 'username email photoURL role createdAt updatedAt').lean();

    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    return res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
}

/**
 * Obtiene un usuario por id incluyendo username
 */
async function getUserById(req, res) {
  try {
    const { id } = req.params; // Id recibido por params

    // Buscar usuario por id, seleccionando campos que quieres enviar
    const user = await User.findById(id, 'username email photoURL role createdAt updatedAt').lean();

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return res.status(500).json({ error: 'Error obteniendo usuario' });
  }
}

module.exports = {
  getAllUsers,
  getUserById
};
