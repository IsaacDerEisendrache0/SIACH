const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // Usuario por defecto en XAMPP
  password: '',       // Contraseña por defecto en XAMPP
  database: 'usuarios' // Nombre de tu base de datos
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');
});

module.exports = connection;

