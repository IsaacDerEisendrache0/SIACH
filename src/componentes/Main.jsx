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
      navigate('/login'); // Redirige a la página de inicio de sesión después de cerrar sesión
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
