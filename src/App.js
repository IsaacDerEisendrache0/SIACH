import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { auth, db } from './firebase/firebaseConfig'; // Nueva ruta de importación
import { doc, getDoc, collection, getDocs } from "firebase/firestore"; // Firestore: manejo de documentos y colecciones
import "bootstrap/dist/css/bootstrap.min.css"; // Estilos de Bootstrap
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Funcionalidades JS de Bootstrap
import Norma17 from "./Norma_17/norma_17"; // Componente Norma 17
import Norma04 from "./Norma_004/norma_004"; // Componente Norma 04
import Norma030 from "./Norma_030/norma_030"; // Componente Norma 030
import NormaNOMs from "./Norma_NOMs/norma_noms"; // Componente Norma NOMs
import Login from "./componentes/Loginlogin"; // Componente de Login
import SavedTables from "./Norma_17/SavedTables"; // Componente de tablas guardadas
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "./dashboard.css"; // Archivo CSS personalizado
import { FaTachometerAlt, FaRegFileAlt, FaRegChartBar, FaBars } from "react-icons/fa"; // Iconos de FontAwesome

function Dashboard() {
  const navigate = useNavigate();
  const [selectedNorma, setSelectedNorma] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/100");

  // Recuperar correo desde el localStorage
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    // Recuperar la imagen del localStorage al cargar la página
    if (userEmail) {
      const savedImage = localStorage.getItem(`profileImage_${userEmail}`);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, [userEmail]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageBase64 = reader.result;
        setProfileImage(imageBase64);

        // Guardar la imagen en el localStorage para el usuario actual
        if (userEmail) {
          localStorage.setItem(`profileImage_${userEmail}`, imageBase64);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userEmail"); // Limpia el correo, pero no la imagen
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const handleSelectNorma = (norma) => {
    setSelectedNorma(norma);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded((prevState) => !prevState);
  };

  const handleHome = () => {
    navigate("/");
  };

  const tablasPorNorma = {
    "N-017": <Norma17 />,
    "N-004": <Norma04 />,
    "N-030": <Norma030 />,
    "Asistente NOMs": <NormaNOMs />,
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <div className="sidebar-header">
          <h2>{isSidebarExpanded ? "Siach" : ""}</h2>
        </div>
        <ul className="sidebar-menu">
          <li onClick={() => navigate("/")}>
            <FaTachometerAlt className="menu-icon" />
            {isSidebarExpanded && <span>Dashboard</span>}
          </li>
          <li onClick={() => handleSelectNorma("N-017")}>
            <FaRegFileAlt className="menu-icon" />
            {isSidebarExpanded && <span>Norma 017</span>}
          </li>
          <li onClick={() => handleSelectNorma("N-004")}>
            <FaRegFileAlt className="menu-icon" />
            {isSidebarExpanded && <span>Norma 004</span>}
          </li>
          <li onClick={() => handleSelectNorma("N-030")}>
            <FaRegChartBar className="menu-icon" />
            {isSidebarExpanded && <span>Norma 030</span>}
          </li>
          <li onClick={() => handleSelectNorma("Asistente NOMs")}>
            <FaRegFileAlt className="menu-icon" />
            {isSidebarExpanded && <span>Asistente NOMs</span>}
          </li>
          <li onClick={() => navigate("/saved-tables")}>
            <FaRegFileAlt className="menu-icon" />
            {isSidebarExpanded && <span>Ver Tablas Guardadas</span>}
          </li>
        </ul>
      </aside>

      {/* Toggle Button */}
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button className="btn btn-primary me-2" onClick={handleHome}>
              Inicio
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </div>

          <div className="header-right">
            <div className="profile-section">
              <img
                src={profileImage}
                alt="User Avatar"
                className="profile-pic"
                onClick={() => document.getElementById('fileInput').click()}
              />
              <div className="profile-details">
                <p className="user-email">{userEmail || "Cargando correo..."}</p>
              </div>
            </div>
            <input
              type="file"
              id="fileInput"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="dashboard-main">
          {selectedNorma ? (
            <div className="table-container">
              <h3>{`Tabla correspondiente a la ${selectedNorma}`}</h3>
              {tablasPorNorma[selectedNorma]}
            </div>
          ) : (
            <div className="placeholder"></div>
          )}
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
