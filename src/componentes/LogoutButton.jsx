import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function LogoutButton({ handleLogout }) {
  return (
    <button onClick={handleLogout} className="btn btn-info btn-lg logout-btn">
      <span className="glyphicon glyphicon-log-out"></span> Cerrar Sesión
    </button>
  );
}

export default LogoutButton;
