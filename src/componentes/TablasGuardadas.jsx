// TablasGuardadas.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TablasGuardadas() {
  const [tablas, setTablas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [contenido, setContenido] = useState('');

  useEffect(() => {
    // Obtener todas las tablas guardadas al cargar el componente
    obtenerTablas();
  }, []);

  const obtenerTablas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tablas');
      setTablas(response.data);
    } catch (err) {
      console.error('Error al obtener tablas:', err);
    }
  };

  const handleGuardarTabla = async () => {
    if (!nombre || !contenido) {
      alert('Por favor, completa todos los campos antes de guardar.');
      return;
    }

    try {
      // Enviar una solicitud POST al backend para guardar la tabla
      await axios.post('http://localhost:5000/guardar-tabla', { nombre, contenido });
      // Actualizar la lista de tablas después de guardar
      obtenerTablas();
      setNombre('');
      setContenido('');
    } catch (err) {
      console.error('Error al guardar la tabla:', err);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Tablas Guardadas</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Nombre de la tabla"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <textarea
          className="form-control mt-2"
          placeholder="Contenido de la tabla"
          rows="4"
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
        ></textarea>
        <button className="btn btn-success mt-2" onClick={handleGuardarTabla}>
          Guardar Tabla
        </button>
      </div>

      <ul className="list-group mt-4">
        {tablas.map((tabla) => (
          <li key={tabla.id} className="list-group-item">
            <h5>{tabla.nombre}</h5>
            <p>{tabla.contenido}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TablasGuardadas;
