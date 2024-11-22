import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { auth, db } from "./firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Norma17 from "./Norma_17/norma_17";
import Norma04 from "./Norma_004/norma_004";
import Norma030 from "./Norma_030/norma_030";
import NormaNOMs from "./Norma_NOMs/norma_noms";
import Login from "./componentes/Loginlogin";
import SavedTables from "./Norma_17/SavedTables";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import "./dashboard.css";
import { FaTachometerAlt, FaRegFileAlt, FaRegChartBar, FaBars } from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const [selectedNorma, setSelectedNorma] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/100");
  const [userEmail, setUserEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

    // Mostrar arte ASCII en la consola
    const artAscii = `
       O
      /|\\
      / \\
    `;
    console.log("¡Bienvenido al Dashboard!");
    console.log(artAscii);
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
          await setDoc(userDocRef, { profileImage: imageBase64 }, { merge: true });
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert("Por favor selecciona un archivo de imagen válido.");
    }
  };

  const toggleMenu = () => setIsMenuOpen((prevState) => !prevState);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  const handleSelectNorma = (norma) => setSelectedNorma(norma);

  const toggleSidebar = () => setIsSidebarExpanded((prevState) => !prevState);

  const tablasPorNorma = {
    "N-017": <Norma17 />,
    "N-004": <Norma04 />,
    "N-030": <Norma030 />,
    "Asistente NOMs": <NormaNOMs />,
  };

  return (
    <div className="dashboard-container">
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

      <button className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className="main-content">
        <header className="header">
          <div className="profile-section" onClick={toggleMenu}>
            <img src={profileImage} alt="User Avatar" className="profile-pic" />
            <div className="profile-details">
              <p className="user-email">{userEmail || "Cargando correo..."}</p>
            </div>
            {isMenuOpen && (
              <div className="custom-dropdown">
                <button onClick={() => navigate("/")}>Inicio</button>
                <button onClick={handleLogout}>Cerrar sesión</button>
                <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleImageChange} />
              </div>
            )}
          </div>
        </header>

        <main className="dashboard-main">
          {selectedNorma ? (
            <div className="table-container">
              <h3>{`Tabla correspondiente a la ${selectedNorma}`}</h3>
              {tablasPorNorma[selectedNorma]}
            </div>
          ) : (
            <div className="placeholder">
              <pre style={{ fontSize: "16px", textAlign: "center" }}>
                {`
                   O
                  /|\\
                  / \\
                `}
              </pre>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        if (window.location.pathname === "/login") {
          navigate("/");
        }
        console.log("¡Bienvenido de nuevo!");
        console.log(`
            O
           | |
          O   O
        `);
      } else {
        if (window.location.pathname !== "/login") {
          navigate("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div className="app-container" style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
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
