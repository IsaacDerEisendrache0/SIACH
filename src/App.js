import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Norma17 from './Norma_17/norma_17'; // Ajusta la ruta para importar desde la carpeta
import Norma04 from './Norma_004/norma_004'; // Importamos el componente de evaluación de riesgos N-004

function Navigation() {
  const location = useLocation();
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
        </>
      )}
    </div>
  );
}

function HomePage() {
  const [selectedNorma, setSelectedNorma] = useState('');

  const handleSelectNorma = (norma) => {
    setSelectedNorma(norma);
  };

  return (
    <div className="container mt-5">
      <h1 className="text">Bienvenido a la Página de Inicio</h1>

      {/* Botón desplegable para elegir normas */}
      <div className="dropdown mt-3">
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          id="normasDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Seleccionar Norma
        </button>
        <ul className="dropdown-menu" aria-labelledby="normasDropdown">
          

          <li>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => handleSelectNorma('N-017')}
            >
              N-017
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => handleSelectNorma('Evaluación de Riesgos')}
            >
              N-004
            </button>
          </li>
        </ul>
      </div>

      {/* Mostrar el contenido según la norma seleccionada */}
      {selectedNorma === 'N-017' && (
        <div className="mt-3">
          <h3>N-017 Seleccionada:</h3>
          <Norma17 /> {/* Mostrar el componente de Norma 017 */}
        </div>
      )}

      {/* Mostrar el componente de evaluación de riesgos si se selecciona esa norma */}
      {selectedNorma === 'Evaluación de Riesgos' && (
        <div className="mt-3">
          <h3>N-004 Seleccionada:</h3>
          <Norma04 /> {/* Mostrar el componente de evaluación de riesgos */}
        </div>
      )}
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer mt-5">
      <p>© 2024 Mi Aplicación. Todos los derechos reservados.</p>
    </footer>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="App-header">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/main" element={<div>Main Page</div>} />
          </Routes>
        </header>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
