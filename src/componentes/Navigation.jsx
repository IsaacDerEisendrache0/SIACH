import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();
  
  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirige a la página de inicio de sesión después de cerrar sesión
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  const showNavigation = !(location.pathname === '/login' || location.pathname === '/main');

  return (
    <nav className="navbar">
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
          <button
            className="btn btn-danger ms-2" // Añadir margen a la izquierda para separación
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </>
      )}
    </nav>
  );
}

export default Navigation;
