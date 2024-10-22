const { Sequelize } = require('sequelize');

// Configura la conexión a la base de datos SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Archivo de la base de datos
});

// Probar la conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida con SQLite.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
})();

module.exports = sequelize;
