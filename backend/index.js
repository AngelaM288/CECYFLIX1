require('dotenv').config();
const express = require('express'); 
const cors = require('cors');
const axios = require('axios');
// const mongoose = require('mongoose'); ❌ lo puedes comentar también

const peliculasRouter = require('./routes/pelicula');

const app = express();
const PORT = process.env.PORT || 1000;

// Middleware
app.use(cors());
app.use(express.json());

// ❌ COMENTADA TEMPORALMENTE LA CONEXIÓN A MONGO
// const uri = process.env.MONGO_URI;
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('✅ Conectado a MongoDB Atlas'))
//   .catch(err => console.error('❌ Error al conectar a MongoDB:', err.message));

// Rutas
app.use('/api/peliculas', peliculasRouter);

app.post('/api/recomendaciones', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://api.openrouter.ai/api/v1/chat/completions',
      {
        model: 'openrouter/cypher-alpha:free',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const recomendacion = response.data.choices[0].message.content;
    res.json({ recomendacion });

  } catch (error) {
    console.error('Error en la API:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
