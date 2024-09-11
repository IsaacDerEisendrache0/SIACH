const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const app = express();
const port = 5000;

app.use(express.json());

// Ruta para registrar un nuevo usuario
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const data = fs.readFileSync('users.json', 'utf-8');
    const users = JSON.parse(data);

    // Verificar si el usuario ya existe
    const userExists = users.users.find(user => user.username === username);
    if (userExists) {
      return res.json({ success: false, message: 'Usuario ya existe' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const newUser = {
      id: users.users.length + 1,
      username,
      password: hashedPassword,
    };

    // Agregar el nuevo usuario al array
    users.users.push(newUser);

    // Guardar los cambios en el archivo users.json
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));

    return res.json({ success: true, message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error('Error al leer el archivo JSON', err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const data = fs.readFileSync('users.json', 'utf-8');
    const users = JSON.parse(data);

    // Buscar el usuario en la lista de usuarios
    const user = users.users.find(user => user.username === username);
    if (!user) {
      return res.json({ success: false, message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña ingresada con la almacenada
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Contraseña incorrecta' });
    }

    // Si la contraseña es correcta, devolver un mensaje de éxito
    return res.json({ success: true, message: 'Login exitoso', user: user.username });
  } catch (err) {
    console.error('Error al leer el archivo JSON', err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
