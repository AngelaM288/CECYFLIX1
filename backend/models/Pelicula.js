
// backend/models/Pelicula.js
const mongoose = require('mongoose');

const PeliculaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  genero: String,
  descripcion: String,
  poster: String,
});

module.exports = mongoose.model('Pelicula', PeliculaSchema);
