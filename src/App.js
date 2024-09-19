import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Norma17 from './Norma_17/norma_17'; 
import Norma04 from './Norma_004/norma_004'; 
import Norma030 from './Norma_030/norma_030'; 
import Login from './componentes/Loginlogin'; 
import CarouselComponent from './componentes/CarouselComponent'; // Importa el componente del carrusel
import LogoutButton from './componentes/LogoutButton'; // Importa el botón de logout
import { getAuth, signOut } from 'firebase/auth';

// Componente de Navegación
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
          <Link to="/carousel">
            <button className="btn btn-primary">Ver Carrusel</button> {/* Botón para navegar al carrusel */}
          </Link>
        </>
      )}
    </div>
  );
}

// Página Principal (Main Page) con el botón de logout
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
      <LogoutButton handleLogout={handleLogout} /> {/* Usa el componente LogoutButton */}
    </div>
  );
}

// Página de Inicio
function HomePage() {
  const [selectedNorma, setSelectedNorma] = useState('');

  const handleSelectNorma = (norma) => {
    setSelectedNorma(norma);
  };

  return (
    <div className="container mt-5">
      <h1 className="text">Bienvenido a la Página de Inicio</h1>

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
          <li>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => handleSelectNorma('N-030')}
            >
              N-030
            </button>
          </li>
        </ul>
      </div>

      {selectedNorma === 'N-017' && (
        <div className="mt-3">
          <h3>N-017 Seleccionada:</h3>
          <Norma17 />
        </div>
      )}

      {selectedNorma === 'Evaluación de Riesgos' && (
        <div className="mt-3">
          <h3>N-004 Seleccionada:</h3>
          <Norma04 />
        </div>
      )}

      {selectedNorma === 'N-030' && (
        <div className="mt-3">
          <h3>N-030 Seleccionada:</h3>
          <Norma030 />
        </div>
      )}
    </div>
  );
}

// Footer
function Footer() {
  return (
    <footer className="footer mt-5">
      <p>© 2024 Mi Aplicación. Todos los derechos reservados.</p>
    </footer>
  );
}

// Componente principal de la aplicación
function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="App-header">
          <Navigation />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/main" element={<Main />} /> {/* Ruta actualizada para la página principal */}
            <Route path="/norma030" element={<Norma030 />} />
            <Route path="/carousel" element={<CarouselComponent />} /> {/* Nueva ruta para el carrusel */}
          </Routes>
        </header>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
