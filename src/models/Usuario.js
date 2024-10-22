const { DataTypes } = require('sequelize');
const sequelize = require('./database');

const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Sincronizar el modelo con la base de datos
(async () => {
  await sequelize.sync({ force: false });
  console.log('Tabla Usuario sincronizada.');
})();

module.exports = Usuario;
