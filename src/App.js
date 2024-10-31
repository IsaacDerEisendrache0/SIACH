import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Norma17 from './Norma_17/norma_17';
import Norma04 from './Norma_004/norma_004';
import Norma030 from './Norma_030/norma_030';
import NormaNOMs from './Norma_NOMs/norma_noms';
import Login from './componentes/Loginlogin';
import SavedTables from './Norma_17/SavedTables';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import logo from './images/logo.png'; // Importa la imagen del logo correctamente

function Navigation() {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  return (
    <div className="navbar">
      <button className="btn btn-primary" onClick={() => navigate('/')}>Inicio</button>
      <button className="btn btn-primary" onClick={() => navigate('/saved-tables')}>
        Ver Tablas Guardadas
      </button>
      <button className="btn btn-primary" onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}

function HomePage() {
  const [selectedNorma, setSelectedNorma] = useState('');

  const handleSelectNorma = (norma) => {
    setSelectedNorma(norma);
  };

  return (
    <div className="container-fluid mt-5">
      <div className="d-flex align-items-center justify-content-center">
        <img src={logo} alt="SIACH Logo" style={{ width: '100px', marginRight: '10px' }} />
        <h1 className="text-center">Normas Oficiales Mexicanas</h1>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <div className="dropdown">
          <button className="btn btn-primary dropdown-toggle" type="button" id="normasDropdown" data-bs-toggle="dropdown" aria-expanded="false">
            Seleccionar Norma
          </button>
          <ul className="dropdown-menu" aria-labelledby="normasDropdown">
            <li><button className="dropdown-item" type="button" onClick={() => handleSelectNorma('N-017')}>N-017</button></li>
            <li><button className="dropdown-item" type="button" onClick={() => handleSelectNorma('Evaluación de Riesgos')}>N-004</button></li>
            <li><button className="dropdown-item" type="button" onClick={() => handleSelectNorma('N-030')}>N-030</button></li>
            <li><button className="dropdown-item" type="button" onClick={() => handleSelectNorma('Asistente NOMs')}>Asistente NOMs</button></li>
          </ul>
        </div>
      </div>

      {selectedNorma === 'N-017' && <div className="mt-3"><Norma17 /></div>}
      {selectedNorma === 'Evaluación de Riesgos' && <div className="mt-3"><Norma04 /></div>}
      {selectedNorma === 'N-030' && <div className="mt-3"><Norma030 /></div>}
      {selectedNorma === 'Asistente NOMs' && <div className="mt-3"><NormaNOMs /></div>}
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        if (window.location.pathname === '/login') {
          navigate('/');
        }
      } else {
        setIsAuthenticated(false);
        if (window.location.pathname !== '/login') {
          navigate('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="app-container">
      <header className="App-header">
        {isAuthenticated && <Navigation />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/norma_17" element={<Norma17 />} />
          <Route path="/norma_004" element={<Norma04 />} />
          <Route path="/norma_030" element={<Norma030 />} />
          <Route path="/saved-tables" element={<SavedTables />} />
          <Route path="/" element={<HomePage />} /> {/* Mostrar el selector de normas en la página de inicio */}
        </Routes>
      </header>
    </div>
  );
}

export default App;
