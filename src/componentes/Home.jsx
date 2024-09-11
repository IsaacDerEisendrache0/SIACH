// src/componentes/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <h1>Bienvenido a la Página de Inicio</h1>
      <p>Esta es la página de inicio de tu aplicación.</p>
      <div className="home-links">
        <Link to="/login">
          <button className="btn btn-primary">Iniciar Sesión</button>
        </Link>
        <Link to="/main">
          <button className="btn btn-primary">Ir a Main</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;
