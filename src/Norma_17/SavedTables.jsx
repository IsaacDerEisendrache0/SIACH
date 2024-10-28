import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SavedTables.css';

const SavedTables = () => {
  const [savedTables, setSavedTables] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const tables = JSON.parse(localStorage.getItem('savedTables')) || [];

    // Ordenar las tablas en orden descendente (de más reciente a más antiguo)
    const sortedTables = tables.sort((a, b) => {
      const dateA = new Date(`${a.fecha} ${a.hora}`);
      const dateB = new Date(`${b.fecha} ${b.hora}`);
      return dateB - dateA;
    });

    setSavedTables(sortedTables);
  }, []);

  const handleEditTable = (index) => {
    const tableToEdit = savedTables[index];
    localStorage.setItem('tableToEdit', JSON.stringify(tableToEdit));
    navigate('/norma_17');
  };

  const handleDeleteTable = (index) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas borrar esta tabla?');
    if (confirmDelete) {
      const updatedTables = savedTables.filter((_, i) => i !== index);
      setSavedTables(updatedTables);
      localStorage.setItem('savedTables', JSON.stringify(updatedTables));
    }
  };

  return (
    <div className="saved-tables-container">
      <h2>Tablas Guardadas</h2>
      {savedTables.length > 0 ? (
        savedTables.map((table, index) => (
          <div key={index} className="saved-table">
            <p><strong>Norma:</strong> {table.norma}</p>
            <p><strong>Área:</strong> {table.areaSeleccionada}</p>
            <p><strong>Puesto:</strong> {table.puestoSeleccionado}</p>
            <p><strong>Fecha de creación:</strong> {table.fecha} - {table.hora}</p>
            <p><strong>Magnitud del Riesgo:</strong> {table.risk}</p>
            <div className="table-buttons">
              <button className="btn-edit" onClick={() => handleEditTable(index)}>
                Editar
              </button>
              <button className="btn-delete" onClick={() => handleDeleteTable(index)}>
                Borrar
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No hay tablas guardadas.</p>
      )}
    </div>
  );
};

export default SavedTables;
