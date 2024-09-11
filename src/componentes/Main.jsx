// src/componentes/Main.jsx
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Main() {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/'); // Redirige a la página de inicio después de cerrar sesión
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <div className="main-container">
      <h1>Bienvenido a la Página Principal</h1>
      <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
    </div>
  );
}

export default Main;
