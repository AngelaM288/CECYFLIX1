// backend/routes/pelicula.js

const express = require('express');
const router = express.Router();
const Pelicula = require('../models/Pelicula'); // Ruta correcta al modelo

// Ruta para obtener todas las películas
router.get('/', async (req, res) => {
  try {
    const peliculas = await Pelicula.find();
    res.json(peliculas);
  } catch (error) {
    console.error('Error al obtener las películas:', error);
    res.status(500).json({ error: 'Error al obtener las películas' });
  }
});

module.exports = router;

