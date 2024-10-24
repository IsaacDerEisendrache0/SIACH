// Importar los módulos necesarios
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// Crear una instancia de la aplicación de Express
const app = express();
const PORT = 5000; // Puerto donde se ejecutará el servidor

// Middleware
app.use(cors()); // Habilitar CORS para permitir solicitudes desde el frontend
app.use(express.json()); // Habilitar la lectura de JSON en las solicitudes

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./tablas.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
  }
});

// Crear la tabla 'tablas_guardadas' si no existe
db.run(`CREATE TABLE IF NOT EXISTS tablas_guardadas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  contenido TEXT
)`);

// Ruta para guardar una tabla en la base de datos
app.post('/guardar-tabla', (req, res) => {
  const { nombre, contenido } = req.body;

  // Validar que los campos no estén vacíos
  if (!nombre || !contenido) {
    return res.status(400).json({ error: 'El nombre y el contenido son obligatorios.' });
  }

  // Insertar los datos en la tabla 'tablas_guardadas'
  db.run(`INSERT INTO tablas_guardadas (nombre, contenido) VALUES (?, ?)`, [nombre, contenido], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ id: this.lastID, message: 'Tabla guardada exitosamente.' });
    }
  });
});

// Ruta para obtener todas las tablas guardadas
app.get('/tablas', (req, res) => {
  db.all(`SELECT * FROM tablas_guardadas`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Ruta para obtener una tabla específica por su ID
app.get('/tabla/:id', (req, res) => {
  const { id } = req.params;

  db.get(`SELECT * FROM tablas_guardadas WHERE id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (!row) {
      res.status(404).json({ error: 'Tabla no encontrada.' });
    } else {
      res.json(row);
    }
  });
});

// Ruta para eliminar una tabla específica por su ID
app.delete('/tabla/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM tablas_guardadas WHERE id = ?`, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Tabla no encontrada.' });
    } else {
      res.json({ message: 'Tabla eliminada exitosamente.' });
    }
  });
});

// Ruta para actualizar una tabla específica por su ID
app.put('/tabla/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, contenido } = req.body;

  // Validar que los campos no estén vacíos
  if (!nombre || !contenido) {
    return res.status(400).json({ error: 'El nombre y el contenido son obligatorios.' });
  }

  // Actualizar los datos en la tabla 'tablas_guardadas'
  db.run(
    `UPDATE tablas_guardadas SET nombre = ?, contenido = ? WHERE id = ?`,
    [nombre, contenido, id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (this.changes === 0) {
        res.status(404).json({ error: 'Tabla no encontrada.' });
      } else {
        res.json({ message: 'Tabla actualizada exitosamente.' });
      }
    }
  );
});

// Iniciar el servidor en el puerto especificado
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
