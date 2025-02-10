// src/componentes/Home.jsx
import React from "react";
import LogoutButton from "./LogoutButton";
import "bootstrap/dist/css/bootstrap.min.css";

function Home({ handleLogout }) {
  return (
    <div className="container">
      <header className="d-flex justify-content-end p-3">
        <LogoutButton handleLogout={handleLogout} />
      </header>
      <main>
        <h1>Bienvenido a la página principal</h1>
        {/* Aquí va el contenido de tu página principal */}
      </main>
    </div>
  );
}

export default Home;
