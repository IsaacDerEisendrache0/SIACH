// src/componentes/Navigation.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DropdownMenu from './DropdownMenu'; // Asegúrate de que la ruta sea correcta

function Navigation() {
  const location = useLocation();
  
  // Mostrar la navegación solo si no estamos en las páginas de Login o Main
  const showNavigation = !(location.pathname === '/login' || location.pathname === '/main');

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
          <Link to="/norma-17">
            <button className="btn btn-primary">Ir a Norma 17</button>
          </Link>
          <DropdownMenu /> {/* Agrega el menú desplegable aquí */}
        </>
      )}
    </div>
  );
}

export default Navigation;
