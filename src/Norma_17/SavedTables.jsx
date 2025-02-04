// src/components/SavedTables.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase'; // Asegúrate de que la ruta sea correcta
import './SavedTables.css';

const SavedTables = () => {
  // Estado para gestionar carpetas
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');

  // Estado para gestionar tablas dentro de una carpeta
  const [savedTables, setSavedTables] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const navigate = useNavigate();

  // Función para cargar las carpetas desde Firestore
  const loadFoldersFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'carpetas'));
      const fetchedFolders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFolders(fetchedFolders);
    } catch (error) {
      console.error('Error al cargar las carpetas desde Firestore:', error);
    }
  };

  // Función para cargar las tablas desde Firestore dentro de una carpeta específica
  // src/components/SavedTables.jsx
  const loadTablesFromFirestore = async (folderId) => {
    try {
      const tablasCollection = collection(db, 'carpetas', folderId, 'tablas');
      const querySnapshot = await getDocs(tablasCollection);
      const tables = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        nombreEmpresa: doc.data().nombreEmpresa || "No especificada" // Asegurar que siempre tenga un valor
      }));
  
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
    loadFoldersFromFirestore();
  }, []);

  // Función para agregar una nueva carpeta
  const handleAddFolder = async (e) => {
    e.preventDefault();
    if (newFolderName.trim() === '') {
      alert('El nombre de la carpeta no puede estar vacío.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'carpetas'), {
        nombre: newFolderName,
        fechaCreacion: serverTimestamp(),
      });
      setFolders([...folders, { id: docRef.id, nombre: newFolderName }]);
      setNewFolderName('');
      alert('Carpeta creada con éxito.');
    } catch (error) {
      console.error('Error al crear la carpeta:', error);
    }
  };

  // Función para eliminar una carpeta y todas sus tablas
  const handleDeleteFolder = async (folderId) => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas borrar esta carpeta? Esta acción también eliminará todas las tablas dentro de ella.'
    );
    if (confirmDelete) {
      try {
        // Obtener todas las tablas dentro de la carpeta
        const tablasSnapshot = await getDocs(
          collection(db, 'carpetas', folderId, 'tablas')
        );

        const batch = writeBatch(db);

        // Añadir eliminación de cada tabla al batch
        tablasSnapshot.forEach(tablaDoc => {
          batch.delete(doc(db, 'carpetas', folderId, 'tablas', tablaDoc.id));
        });

        // Ejecutar el batch
        await batch.commit();

        // Eliminar la carpeta
        await deleteDoc(doc(db, 'carpetas', folderId));

        // Actualizar el estado local
        setFolders(prevFolders => prevFolders.filter(folder => folder.id !== folderId));

        // Si la carpeta eliminada es la seleccionada, limpiar la selección
        if (selectedFolder && selectedFolder.id === folderId) {
          setSelectedFolder(null);
          setSavedTables([]);
        }

        alert('Carpeta borrada con éxito.');
      } catch (error) {
        console.error('Error al borrar la carpeta:', error);
      }
    }
  };

  // Función para navegar a las tablas dentro de una carpeta
  const handleEnterFolder = (folder) => {
    setSelectedFolder(folder);
    loadTablesFromFirestore(folder.id);
  };
  

  // Función para regresar al listado de carpetas
  const handleGoBack = () => {
    setSelectedFolder(null);
    setSavedTables([]);
  };


  // Función para editar una tabla
  // src/components/SavedTables.jsx
  const handleEditTable = (table) => {
    localStorage.setItem('tableToEdit', JSON.stringify({ 
      ...table, 
      folderId: selectedFolder.id,
      nombreEmpresa: table.nombreEmpresa || "No especificada" // Asegurar que siempre tenga un valor
    }));
    navigate('/norma_17');
    navigate('/norma_004'); // Revisa si ambas rutas son necesarias
  };
  


  // Función para eliminar una tabla
  const handleDeleteTable = async (tableId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas borrar esta tabla?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'carpetas', selectedFolder.id, 'tablas', tableId)); // Eliminar la tabla de Firestore
        setSavedTables(prevTables => prevTables.filter(table => table.id !== tableId)); // Actualizar el estado local
        alert('Tabla borrada con éxito.');
      } catch (error) {
        console.error('Error al borrar la tabla:', error);
      }
    }
  };

  return (
    <div className="saved-tables-container">
      {/* Vista de Carpetas */}
      {!selectedFolder && (
        <>
          <h2>Carpetas</h2>

          {/* Formulario para agregar una nueva carpeta */}
          <form onSubmit={handleAddFolder} className="add-folder-form">
            <input
              type="text"
              placeholder="Nombre de la nueva carpeta"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="input-folder-name"
            />
            <button type="submit" className="btn-add-folder">
              Agregar Carpeta
            </button>
          </form>

          {/* Lista de carpetas */}
          {folders.length > 0 ? (
            <div className="folders-list">
              {folders.map((folder) => (
                <div key={folder.id} className="folder-item">
                  <span
                    className="folder-name"
                    onClick={() => handleEnterFolder(folder)}
                  >
                    📁 {folder.nombre}
                  </span>
                  <button
                    className="btn-delete-folder"
                    onClick={() => handleDeleteFolder(folder.id)}
                  >
                    🗑️ Borrar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay carpetas creadas.</p>
          )}
        </>
      )}

      {/* Vista de Tablas dentro de una Carpeta */}
      {selectedFolder && (
        <>
          {/* Botón para regresar al listado de carpetas */}
          <div className="back-to-home">
            <button onClick={handleGoBack} className="btn-back-home">
              ← Regresar a Carpetas
            </button>
          </div>

          <h2>Tablas Guardadas en la Carpeta: {selectedFolder.nombre}</h2>
          {savedTables.map((table) => (
            <div key={table.id} className="saved-table">
              <p><strong>Empresa:</strong> {table.nombreEmpresa || "No especificada"}</p> {/* Mostrar empresa */}
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
          ))}

        </>
      )}
    </div>
  );
};

export default SavedTables;
