import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Asegúrate de tener la configuración de Firebase importada

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const showNavigation = !(location.pathname === '/login' || location.pathname === '/main');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirige a la página de login
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="navbar">
      {showNavigation && (
        <>
          <Link to="/">
            <button className="btn btn-primary">Inicio</button>
          </Link>
          <Link to="/login">
            <button className="btn btn-primary">Iniciar Sesión</button>
          </Link>
          <Link to="/main">
            <button className="btn btn-primary">Ir a Main</button>
          </Link>
          <Link to="/carousel">
            <button className="btn btn-primary">Ver Carrusel</button>
          </Link>
          <button className="btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button> {/* Botón de cerrar sesión */}
        </>
      )}
    </div>
  );
}

export default Navigation;
