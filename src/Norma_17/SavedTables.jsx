import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Asegúrate de importar la configuración de Firebase
import './SavedTables.css';

const SavedTables = () => {
  const [savedTables, setSavedTables] = useState([]);
  const navigate = useNavigate();

  // Función para cargar las tablas desde Firestore
  const loadTablesFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tablas')); // 'tablas' es el nombre de la colección en Firestore
      const tables = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Ordenar las tablas en orden descendente por fecha y hora
      const sortedTables = tables.sort((a, b) => {
        const dateA = new Date(`${a.fecha} ${a.hora}`);
        const dateB = new Date(`${b.fecha} ${b.hora}`);
        return dateB - dateA;
      });

      setSavedTables(sortedTables);
    } catch (error) {
      console.error('Error al cargar las tablas desde Firestore:', error);
    }
  };

  useEffect(() => {
    loadTablesFromFirestore(); // Cargar tablas al montar el componente
  }, []);

  const handleEditTable = (table) => {
    localStorage.setItem('tableToEdit', JSON.stringify(table));
    navigate('/norma_17');
    navigate('/norma_004');
  };

  const handleDeleteTable = async (tableId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas borrar esta tabla?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'tablas', tableId)); // Eliminar la tabla de Firestore
        setSavedTables(prevTables => prevTables.filter(table => table.id !== tableId)); // Actualizar el estado local
        alert('Tabla borrada con éxito.');
      } catch (error) {
        console.error('Error al borrar la tabla:', error);
      }
    }
  };

  const handleGoHome = () => {
    navigate('/'); // Regresar al inicio
  };

  return (
    <div className="saved-tables-container">
      {/* Botón para regresar al inicio */}
      <div className="back-to-home">
        <button onClick={handleGoHome} className="btn-back-home">
          ← Regresar al Inicio
        </button>
      </div>

      <h2>Tablas Guardadas</h2>
      {savedTables.length > 0 ? (
        savedTables.map((table) => (
          <div key={table.id} className="saved-table">
            <p><strong>Norma:</strong> {table.norma}</p>
            <p><strong>Área:</strong> {table.areaSeleccionada}</p>
            <p><strong>Puesto:</strong> {table.puestoSeleccionado}</p>
            <p><strong>Fecha de creación:</strong> {table.fecha} - {table.hora}</p>
            <p><strong>Magnitud del Riesgo:</strong> {table.risk}</p>
            <div className="table-buttons">
              <button className="btn-edit" onClick={() => handleEditTable(table)}>
                Editar
              </button>
              <button className="btn-delete" onClick={() => handleDeleteTable(table.id)}>
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
