import React from 'react';
import LogoutButton from './LogoutButton';
import 'bootstrap/dist/css/bootstrap.min.css';

function Main() {
  return (
    <div className="main-container">
      <header style={styles.header}>
        <h1>Bienvenido a la Página Principal</h1>
        <LogoutButton />
      </header>
      <div>
        <p>Contenido de la página principal...</p>
      </div>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between', // Alinea el título a la izquierda y el botón de cerrar sesión a la derecha
    alignItems: 'center',
    padding: '10px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e7e7e7',
  },
};

export default Main;
