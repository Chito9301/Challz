const express = require('express');
const router = express.Router();

// Importar el modelo Media (ver Paso 2)
const Media = require('../models/media');

// Ruta POST para registrar media
router.post('/register', async (req, res) => {
  try {
    const {
      url,
      userId,
      username,
      userPhotoURL,
      title,
      description,
      type,
      hashtags,
      challengeId,
      challengeTitle,
    } = req.body;

    if (!url || !userId) {
      return res.status(400).json({ error: 'URL y userId son obligatorios' });
    }

    const newMedia = new Media({
      url,
      userId,
      username,
      userPhotoURL,
      title,
      description,
      type,
      hashtags,
      challengeId,
      challengeTitle,
      createdAt: new Date(),
      views: 0,
      likes: 0,
      comments: 0,
    });

    await newMedia.save();
    res.status(201).json({ message: 'Media registrada exitosamente', media: newMedia });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno al registrar media' });
  }
});

module.exports = router;
