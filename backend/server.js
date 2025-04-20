const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const pool = require('./config/db'); // importamos la conexión
const authRoutes = require('./routes/auth'); // importamos las rutas
const animalRoutes = require('./routes/animals'); // importamos las rutas

const app = express();
const port = 4000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Ruta de prueba
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al conectarse a la base de datos' });
  }
});

// Usar rutas de autenticación
app.use('/api', authRoutes);
app.use('/api/animals', animalRoutes); 

// Iniciar servidor
app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`);
});
