import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Norma17 from "./Norma_17/norma_17";
import Norma04 from "./Norma_004/norma_004";
import Norma030 from "./Norma_030/norma_030";
import NormaNOMs from "./Norma_NOMs/norma_noms";
import Login from "./componentes/Loginlogin";
import SavedTables from "./Norma_17/SavedTables";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import logo from "./logos/logo.png"; // Importa el logo
import "./dashboard.css"; // Archivo CSS personalizado


// Función Navigation DEBE estar al nivel superior
function Navigation() {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return (
    <div className="navbar bg-light p-3 shadow-sm">
      <button className="btn btn-primary me-2" onClick={() => navigate("/")}>
        Inicio
      </button>
      <button
        className="btn btn-primary me-2"
        onClick={() => navigate("/saved-tables")}
      >
        Ver Tablas Guardadas
      </button>
      <button className="btn btn-danger" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}

function Dashboard() {
    const navigate = useNavigate();
    const [selectedNorma, setSelectedNorma] = useState(null);
  
    // Definimos las tablas asociadas a cada norma
    const tablasPorNorma = {
      "N-017": <Norma17 />,
      "N-004": <Norma04 />,
      "N-030": <Norma030 />,
      "Asistente NOMs": <NormaNOMs />,
    };
  
    const handleSelectNorma = (norma) => {
      setSelectedNorma(norma);
    };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>Kaiadmin</h2>
        </div>
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/")}>Dashboard</li>
          <li onClick={() => handleSelectNorma("N-017")}>Norma 017</li>
          <li onClick={() => handleSelectNorma("N-004")}>Norma 004</li>
          <li onClick={() => handleSelectNorma("N-030")}>Norma 030</li>
          <li onClick={() => handleSelectNorma("Asistente NOMs")}>
            Asistente NOMs
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <input
              type="text"
              placeholder="Search..."
              className="search-input"
            />
          </div>
          <div className="header-right">
            <button className="btn-notification">🔔</button>
            <div className="profile-info">
              <img
                src="https://via.placeholder.com/40"
                alt="User"
                className="profile-pic"
              />
              <span>Hi, User</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="dashboard-main">
          {/* Renderizamos la tabla correspondiente */}
          <div className="norma-content">
            {selectedNorma ? (
              <div className="table-container">
                <h3>{`Tabla correspondiente a la ${selectedNorma}`}</h3>
                {tablasPorNorma[selectedNorma]}
              </div>
            ) : (
              <div className="placeholder">
                <h3>Selecciona una norma para visualizar sus tablas</h3>
              </div>
            )}
          </div>
        </main>
      </div>
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
        if (window.location.pathname === "/login") {
          navigate("/");
        }
      } else {
        setIsAuthenticated(false);
        if (window.location.pathname !== "/login") {
          navigate("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  if (loading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div
      className="app-container"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <header className="App-header">
        {isAuthenticated && <Navigation />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/norma_17" element={<Norma17 />} />
          <Route path="/norma_004" element={<Norma04 />} />
          <Route path="/norma_030" element={<Norma030 />} />
          <Route path="/saved-tables" element={<SavedTables />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
