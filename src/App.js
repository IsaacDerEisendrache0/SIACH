import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Firestore para manejo de documentos
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Norma17 from "./Norma_17/norma_17";
import Norma04 from "./Norma_004/norma_004";
import Norma030 from "./Norma_030/norma_030";
import NormaNOMs from "./Norma_NOMs/norma_noms";
import Login from "./componentes/Loginlogin";
import SavedTables from "./Norma_17/SavedTables";
import Resumen from "./ResumenTabla/resumen";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./dashboard.css";
import "./App.css";
import {
  FaRegFileAlt,
  FaRegChartBar,
  FaBars,
  FaChevronDown,
} from "react-icons/fa";
import Moviles from "./Norma_004/moviles";
import Maquinaria from "./Norma_004/maquinariaYequipo";
import HerramientasManuales from "./Norma_004/herramientasMan";
import ResumenAccion from "./ResumenTabla/resumenAccion";
import RiskAssessmentTableEditor from "./Norma_17/norma_17_editor"; // Editor nuevo

function Dashboard() {
  const navigate = useNavigate();
  const [selectedNorma, setSelectedNorma] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [profileImage, setProfileImage] = useState(
    "https://via.placeholder.com/100",
  );
  const [userEmail, setUserEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal de imagen
  const [isNorma004Expanded, setIsNorma004Expanded] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserEmail(currentUser.email);

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.profileImage) {
            setProfileImage(userData.profileImage);
          }
        }
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imageBase64 = reader.result;
        setProfileImage(imageBase64);

        if (auth.currentUser) {
          const userDocRef = doc(db, "users", auth.currentUser.uid);
          await setDoc(
            userDocRef,
            { profileImage: imageBase64 },
            { merge: true },
          );
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Por favor selecciona un archivo de imagen válido.");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
  };

  // useCallback para evitar re-creación innecesaria del handler
  const handleClickOutside = useCallback(
    (event) => {
      if (isMenuOpen && !event.target.closest(".custom-dropdown")) {
        setIsMenuOpen(false);
      }
    },
    [isMenuOpen],
  );

  useEffect(() => {
    // Agrega el event listener cuando el menú está abierto
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Limpia el event listener al desmontar el componente o
    // cuando isMenuOpen cambia
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, handleClickOutside]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Cierra sesión con Firebase Auth
      navigate("/login", { replace: true }); // Redirige al login
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const handleSelectNorma = (norma) => {
    console.log("Norma seleccionada:", norma); // Esto debe mostrar "Resumen de acción"
    setSelectedNorma(norma);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded((prevState) => !prevState);
  };

  const toggleNorma004Menu = () => {
    setIsNorma004Expanded((prevState) => !prevState);
  };

  const tablasPorNorma = {
    "N-017": <Norma17 />,
    Moviles: <Moviles />,
    Maquinaria: <Maquinaria />,
    "Herramientas Manuales": <HerramientasManuales />,
    "N-030": <Norma030 />,
    "Asistente NOMs": <NormaNOMs />,
    Resumen: <Resumen />,
    "Resumen de acción": (
      <ResumenAccion
        total={{ grave: 2, elevado: 3, notable: 4, moderado: 5, tolerable: 6 }}
      />
    ),
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside
        className={`sidebar ${isSidebarExpanded ? "expanded" : "collapsed"}`}
      >
        <div className="sidebar-header">
          <h2>{isSidebarExpanded ? "SIACH" : ""}</h2>
        </div>
        <ul className="sidebar-menu">
          <li onClick={() => handleSelectNorma("N-017")}>
            <FaRegFileAlt className="menu-icon" />
            {isSidebarExpanded && <span>Norma 017</span>}
          </li>
          <li onClick={toggleNorma004Menu}>
            <FaRegFileAlt className="menu-icon" />
            {isSidebarExpanded && (
              <span>
                Norma 004{" "}
                <FaChevronDown
                  className={`chevron-icon ${isNorma004Expanded ? "expanded" : "collapsed"}`}
                />
              </span>
            )}
          </li>
          {isNorma004Expanded && isSidebarExpanded && (
            <ul className="submenu">
              <li onClick={() => handleSelectNorma("Moviles")}>
                <FaRegFileAlt className="submenu-icon" />
                <span>Moviles</span>
              </li>
              <li onClick={() => handleSelectNorma("Maquinaria")}>
                <FaRegFileAlt className="submenu-icon" />
                <span>Maquinaria</span>
              </li>
              <li onClick={() => handleSelectNorma("Herramientas Manuales")}>
                <FaRegFileAlt className="submenu-icon" />
                <span>Herramientas Manuales</span>
              </li>
            </ul>
          )}
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
            {isSidebarExpanded && <span>Tablas Guardadas</span>}
          </li>
          <li onClick={() => handleSelectNorma("Resumen")}>
            <FaRegFileAlt className="menu-icon" />
            {isSidebarExpanded && <span>Resumen</span>}
          </li>
          <li onClick={() => handleSelectNorma("Resumen de acción")}>
            <FaRegFileAlt className="menu-icon" />
            {isSidebarExpanded && <span>Resumen de acción</span>}
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
          <div className="header-right">
            <div
  className="profile-section"
  onClick={toggleMenu}
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    cursor: "pointer",
    maxWidth: "260px",
    transition: "box-shadow 0.3s",
  }}
>
  <img
    src={profileImage}
    alt="Foto de perfil"
    onError={(e) => (e.target.src = "https://via.placeholder.com/60")}
    style={{
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      objectFit: "cover",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    }}
    onClick={(e) => {
      e.stopPropagation();
      openModal();
    }}
  />

  <div style={{ flex: 1 }}>
    <p
  style={{
    margin: 0,
    fontSize: "15px",
    fontWeight: 500,
    color: "#2d3748",
    whiteSpace: "nowrap",        // <- fuerza a mantenerse en una sola línea
    overflowWrap: "normal",      // <- evita cortes inusuales
    maxWidth: "160px",           // <- opcional: para evitar que se desborde mucho
    overflow: "hidden",          // <- oculta exceso si es muy largo
    textOverflow: "ellipsis",    // <- muestra "..." si se corta
  }}
>
  {userEmail || "Cargando..."}
</p>
  </div>
              {isMenuOpen && (
                <div
                  className="custom-dropdown"
                  style={{
                    position: "absolute",
                    top: "110%",
                    right: "0",
                    backgroundColor: "#fff",
                    boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
                    borderRadius: "10px",
                    padding: "10px",
                    zIndex: 1000,
                    opacity: 1,
                    transform: "translateY(0)",
                  }}
                >
                  {/* Botón Inicio */}
<button
  className="dropdown-item"
  style={{
    display: "flex",
    alignItems: "center",
    margin: "6px 0",
    width: "100%",
    padding: "10px 16px",
    textAlign: "left",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#2d3748",
    fontWeight: 500,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = "#ebf4ff";
    e.target.style.color = "#2b6cb0";
    e.target.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#2d3748";
    e.target.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
  }}
  onClick={() => navigate("/")}
>
  <svg style={{ width: "18px", height: "18px", marginRight: "10px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
  Inicio
</button>

{/* Botón Cerrar Sesión */}
<button
  className="dropdown-item"
  style={{
    display: "flex",
    alignItems: "center",
    margin: "6px 0",
    width: "100%",
    padding: "10px 16px",
    textAlign: "left",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#2d3748",
    fontWeight: 500,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = "#fff5f5";
    e.target.style.color = "#c53030";
    e.target.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#2d3748";
    e.target.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
  }}
  onClick={handleLogout}
>
  <svg style={{ width: "18px", height: "18px", marginRight: "10px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
  Cerrar sesión
</button>

{/* Botón Agregar Imagen */}
<button
  className="dropdown-item"
  style={{
    display: "flex",
    alignItems: "center",
    margin: "6px 0",
    width: "100%",
    padding: "10px 16px",
    textAlign: "left",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#2d3748",
    fontWeight: 500,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = "#f0fff4";
    e.target.style.color = "#2f855a";
    e.target.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#2d3748";
    e.target.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
  }}
  onClick={() => document.getElementById("fileInput").click()}
>
  <svg style={{ width: "18px", height: "18px", marginRight: "10px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
  Agregar Imagen
</button>

{/* Botón Eliminar Imagen */}
<button
  className="dropdown-item"
  style={{
    display: "flex",
    alignItems: "center",
    margin: "6px 0",
    width: "100%",
    padding: "10px 16px",
    textAlign: "left",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#2d3748",
    fontWeight: 500,
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  }}
  onMouseOver={(e) => {
    e.target.style.backgroundColor = "#fff5f5";
    e.target.style.color = "#c53030";
    e.target.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
  }}
  onMouseOut={(e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#2d3748";
    e.target.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
  }}
  onClick={() => setProfileImage("https://via.placeholder.com/100")}
>
  <svg style={{ width: "18px", height: "18px", marginRight: "10px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
  Eliminar Imagen
</button>

{/* Input oculto para cargar imagen */}
<input
  type="file"
  id="fileInput"
  style={{ display: "none" }}
  onChange={handleImageChange}
/>
                </div>
              )}
            </div>
          </div>

          {/* Modal para la imagen */}
          {isModalOpen && (
            <div
              className="modal-overlay"
              onClick={closeModal}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2000,
              }}
            >
              <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()} // Evita cerrar el modal al hacer clic en la imagen
                style={{
                  position: "relative",
                  maxWidth: "90%",
                  maxHeight: "90%",
                  overflow: "hidden",
                  borderRadius: "10px",
                }}
              >
                <img
                  src={profileImage}
                  alt="Profile Enlarged"
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    borderRadius: "10px",
                  }}
                />
              </div>
            </div>
          )}
        </header>

        {/* Dashboard Content */}
        <main className="dashboard-main">
          {selectedNorma ? (
            <div className="table-container">
              <h3>{`Tabla correspondiente a la ${selectedNorma}`}</h3>
              {tablasPorNorma[selectedNorma]}
            </div>
          ) : (
            <div></div>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const [showInactivityMessage, setShowInactivityMessage] = useState(false); // Nuevo estado
  const navigate = useNavigate();
  const INACTIVITY_LIMIT = 1800000; // 30 minutos

  // Función para cerrar sesión por inactividad
  const handleLogout = useCallback(async () => {
    try {
      setShowInactivityMessage(true); // Mostrar el mensaje de aviso
      await signOut(auth); // Cierra la sesión
      setTimeout(() => {
        setShowInactivityMessage(false); // Ocultar el mensaje después de 5 segundos
        navigate("/login", { replace: true });
      }, 5000);
    } catch (err) {
      console.error("Error al cerrar sesión por inactividad:", err);
    }
  }, [navigate]);

  // Función para reiniciar el temporizador de inactividad
  const resetInactivityTimer = useCallback(() => {
    if (window.inactivityTimeout) {
      clearTimeout(window.inactivityTimeout);
    }
    window.inactivityTimeout = setTimeout(handleLogout, INACTIVITY_LIMIT);
  }, [handleLogout]);

  useEffect(() => {
    // Monitorea eventos de actividad
    const events = ["mousemove", "keydown", "click"];
    events.forEach((event) =>
      window.addEventListener(event, resetInactivityTimer),
    );

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (window.location.pathname === "/login") {
          navigate("/");
        }
        resetInactivityTimer(); // Inicia el temporizador al autenticarse
      } else {
        navigate("/login");
      }
      setLoading(false);
    });

    return () => {
      // Limpia eventos y temporizadores al desmontar
      events.forEach((event) =>
        window.removeEventListener(event, resetInactivityTimer),
      );
      if (window.inactivityTimeout) {
        clearTimeout(window.inactivityTimeout);
      }
      unsubscribe();
    };
  }, [navigate, resetInactivityTimer]);

  if (loading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div
      className="app-container"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      {/* Aviso de inactividad */}
      {showInactivityMessage && (
        <div
          className="inactivity-message"
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "15px",
            borderRadius: "5px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
          }}
        >
          Tu sesión se ha cerrado por inactividad.
        </div>
      )}

      <header className="App-header">
        <Routes>
          <Route path="/norma_17" element={<Norma17 />} />
          <Route path="/norma_004" element={<Norma04 />} />
          <Route path="/norma_030" element={<Norma030 />} />
          <Route path="/login" element={<Login />} />
          <Route path="/saved-tables" element={<SavedTables />} />
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/norma_17_editor"
            element={<RiskAssessmentTableEditor />}
          />
          <Route path="/savedTables" element={<SavedTables />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
