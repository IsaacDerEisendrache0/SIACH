// src/services/api.js

export const crearUsuario = async (nombre, email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Usuario creado:', data);
        return data;
      } else {
        console.log('Error al crear usuario');
        return null;
      }
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  };
  