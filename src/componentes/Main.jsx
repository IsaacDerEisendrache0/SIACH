// src/componentes/Main.jsx
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';

function Main() {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('Sesión cerrada correctamente');
      navigate('/login', { replace: true }); // Asegura que navega al login y no se pueda regresar con el botón de atrás
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <div className="main-container">
      <h1>Bienvenido a la Página Principal</h1>
      <LogoutButton handleLogout={handleLogout} />
    </div>
  );
}

export default Main;
