// src/components/SavedTables.jsx
import React, { useState, useEffect } from 'react';
import { 
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import './SavedTables.css';

const SavedTables = () => {
  // -------------------------------
  // 1. ESTADOS
  // -------------------------------
  // Empesas
  const [empresas, setEmpresas] = useState([]);
  const [newEmpresaName, setNewEmpresaName] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  // Normas dentro de la empresa seleccionada
  const [normas, setNormas] = useState([]);
  const [newNormaName, setNewNormaName] = useState('');
  const [selectedNorma, setSelectedNorma] = useState(null);

  // Registros dentro de la norma seleccionada
  const [registros, setRegistros] = useState([]);
  const [newRegistroName, setNewRegistroName] = useState('');

  const navigate = useNavigate();

  // -------------------------------
  // 2. FUNCIONES DE CARGA (GET)
  // -------------------------------

  /**
   * Cargar TODAS las empresas (colección "empresas").
   */
  const loadEmpresas = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'empresas'));
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEmpresas(list);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  };

  /**
   * Cargar las normas dentro de una empresa (subcolección "normas").
   */
  const loadNormas = async (empresaId) => {
    try {
      const normasRef = collection(db, 'empresas', empresaId, 'normas');
      const snapshot = await getDocs(normasRef);
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNormas(list);
    } catch (error) {
      console.error('Error al cargar normas:', error);
    }
  };

  /**
   * Cargar los registros (tablas) dentro de una norma (subcolección "registros").
   */
  const loadRegistros = async (empresaId, normaId) => {
    try {
      const registrosRef = collection(db, 'empresas', empresaId, 'normas', normaId, 'registros');
      const snapshot = await getDocs(registrosRef);
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Ejemplo: ordenar por fechaCreacion desc, si fuera un timestamp
      // list.sort((a, b) => b.fechaCreacion?.seconds - a.fechaCreacion?.seconds);

      setRegistros(list);
    } catch (error) {
      console.error('Error al cargar registros:', error);
    }
  };

  // -------------------------------
  // 3. USEEFFECT (CARGA INICIAL)
  // -------------------------------
  useEffect(() => {
    loadEmpresas();
  }, []);

  // -------------------------------
  // 4. CREAR DOCUMENTOS
  // -------------------------------

  /**
   * Crear una Empresa nueva (documento en colección "empresas").
   */
  const handleAddEmpresa = async (e) => {
    e.preventDefault();
    if (!newEmpresaName.trim()) {
      alert('El nombre de la empresa no puede estar vacío.');
      return;
    }
    try {
      // Crea la nueva empresa
      const docRef = await addDoc(collection(db, 'empresas'), {
        nombre: newEmpresaName,
        fechaCreacion: serverTimestamp()
      });

      // Actualiza el estado
      setEmpresas([...empresas, { id: docRef.id, nombre: newEmpresaName }]);
      setNewEmpresaName('');
      alert('Empresa creada con éxito.');
    } catch (error) {
      console.error('Error al crear la empresa:', error);
    }
  };

  /**
   * Crear una Norma nueva en la empresa seleccionada (subcolección "normas").
   */
  const handleAddNorma = async (e) => {
    e.preventDefault();
    if (!newNormaName.trim() || !selectedEmpresa) {
      alert('Debes ingresar un nombre de norma y tener una empresa seleccionada.');
      return;
    }
    try {
      // Crea/establece el doc de la norma
      const normaDocRef = doc(
        collection(db, 'empresas', selectedEmpresa.id, 'normas'),
        newNormaName // si quieres que el ID sea igual al nombre
      );
      // O podrías usar addDoc si quieres un ID autogenerado:
      // const normaDocRef = await addDoc(collection(db, 'empresas', selectedEmpresa.id, 'normas'), {...})

      await setDoc(normaDocRef, {
        nombreNorma: newNormaName,
        fechaCreacion: serverTimestamp()
      });

      // Refrescar la lista de normas
      await loadNormas(selectedEmpresa.id);

      setNewNormaName('');
      alert('Norma creada con éxito.');
    } catch (error) {
      console.error('Error al crear la norma:', error);
    }
  };

  /**
   * Crear un nuevo registro (tabla) en la norma seleccionada (subcolección "registros").
   */
  const handleAddRegistro = async (e) => {
    e.preventDefault();
    if (!newRegistroName.trim() || !selectedNorma) {
      alert('Debes ingresar un nombre de registro y tener una norma seleccionada.');
      return;
    }
    try {
      const registrosRef = collection(
        db, 
        'empresas', 
        selectedEmpresa.id, 
        'normas', 
        selectedNorma.id, 
        'registros'
      );
      const docRef = await addDoc(registrosRef, {
        nombreRegistro: newRegistroName,
        fechaCreacion: serverTimestamp()
      });

      // Actualizamos la lista de registros
      await loadRegistros(selectedEmpresa.id, selectedNorma.id);

      setNewRegistroName('');
      alert('Registro creado con éxito.');
    } catch (error) {
      console.error('Error al crear el registro:', error);
    }
  };

  // -------------------------------
  // 5. ELIMINAR DOCUMENTOS
  // -------------------------------

  /**
   * Eliminar una empresa y todas sus normas y registros (batch/recursivo).
   */
  const handleDeleteEmpresa = async (empresaId) => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas borrar esta empresa y todo lo que contiene?'
    );
    if (!confirmDelete) return;

    try {
      // Carga todas las normas de la empresa
      const normasSnap = await getDocs(collection(db, 'empresas', empresaId, 'normas'));
      const batch = writeBatch(db);

      for (const normaDoc of normasSnap.docs) {
        const normaId = normaDoc.id;
        // Carga todos los registros de la norma
        const registrosSnap = await getDocs(
          collection(db, 'empresas', empresaId, 'normas', normaId, 'registros')
        );
        // Elimina cada registro
        registrosSnap.forEach((regDoc) => {
          batch.delete(doc(db, 'empresas', empresaId, 'normas', normaId, 'registros', regDoc.id));
        });
        // Elimina el doc de la norma
        batch.delete(doc(db, 'empresas', empresaId, 'normas', normaId));
      }
      // Elimina el doc principal de la empresa
      batch.delete(doc(db, 'empresas', empresaId));

      await batch.commit();

      // Actualiza estado local
      setEmpresas((prev) => prev.filter((emp) => emp.id !== empresaId));
      if (selectedEmpresa && selectedEmpresa.id === empresaId) {
        setSelectedEmpresa(null);
        setSelectedNorma(null);
        setNormas([]);
        setRegistros([]);
      }
      alert('Empresa eliminada con éxito.');
    } catch (error) {
      console.error('Error al eliminar la empresa:', error);
    }
  };

  /**
   * Eliminar una norma y todos sus registros dentro de la empresa seleccionada.
   */
  const handleDeleteNorma = async (normaId) => {
    if (!selectedEmpresa) return;
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas borrar esta norma y todos sus registros?'
    );
    if (!confirmDelete) return;

    try {
      const batch = writeBatch(db);

      // Cargar todos los registros
      const registrosSnap = await getDocs(
        collection(db, 'empresas', selectedEmpresa.id, 'normas', normaId, 'registros')
      );
      registrosSnap.forEach((regDoc) => {
        batch.delete(doc(db, 'empresas', selectedEmpresa.id, 'normas', normaId, 'registros', regDoc.id));
      });

      // Borrar la norma
      batch.delete(doc(db, 'empresas', selectedEmpresa.id, 'normas', normaId));

      await batch.commit();

      // Refrescar la lista de normas
      await loadNormas(selectedEmpresa.id);

      // Si la norma eliminada era la que estaba seleccionada, limpiamos
      if (selectedNorma && selectedNorma.id === normaId) {
        setSelectedNorma(null);
        setRegistros([]);
      }

      alert('Norma eliminada con éxito.');
    } catch (error) {
      console.error('Error al eliminar la norma:', error);
    }
  };

  /**
   * Eliminar un registro (tabla) dentro de la norma seleccionada.
   */
  const handleDeleteRegistro = async (registroId) => {
    if (!selectedEmpresa || !selectedNorma) return;
    const confirmDelete = window.confirm('¿Estás seguro de que deseas borrar este registro?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(
        doc(
          db, 
          'empresas', 
          selectedEmpresa.id, 
          'normas', 
          selectedNorma.id, 
          'registros', 
          registroId
        )
      );
      setRegistros((prev) => prev.filter((r) => r.id !== registroId));
      alert('Registro eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
    }
  };

  // -------------------------------
  // 6. NAVEGACIÓN ENTRE VISTAS
  // -------------------------------

  /**
   * Seleccionar una empresa y mostrar sus normas
   */
  const handleSelectEmpresa = async (empresa) => {
    setSelectedEmpresa(empresa);
    setSelectedNorma(null);
    setRegistros([]);
    // Cargar normas de esta empresa
    await loadNormas(empresa.id);
  };

  /**
   * Seleccionar una norma y mostrar sus registros
   */
  const handleSelectNorma = async (norma) => {
    setSelectedNorma(norma);
    // Cargar registros de esta norma
    await loadRegistros(selectedEmpresa.id, norma.id);
  };

  /**
   * Botones para "regresar" de la norma a la empresa o de la empresa al inicio
   */
  const handleGoBackToEmpresas = () => {
    setSelectedEmpresa(null);
    setSelectedNorma(null);
    setNormas([]);
    setRegistros([]);
  };

  const handleGoBackToNormas = () => {
    setSelectedNorma(null);
    setRegistros([]);
  };

  // -------------------------------
  // 7. EJEMPLO DE EDITAR UN REGISTRO
  // -------------------------------
  const handleEditRegistro = (registro) => {
    // Ejemplo: Guardar en localStorage y navegar
    localStorage.setItem('registroToEdit', JSON.stringify({
      ...registro,
      empresaId: selectedEmpresa.id,
      normaId: selectedNorma.id
    }));
    navigate('/ruta-de-edicion'); 
  };

  // -------------------------------
  // 8. RENDERIZADO (JSX)
  // -------------------------------
  return (
    <div className="saved-tables-container">
      {/* 
        VISTA 1: LISTADO DE EMPRESAS 
        Se muestra si NO hay empresa seleccionada
      */}
      {!selectedEmpresa && (
        <>
          <h2>Empresas</h2>
          <form onSubmit={handleAddEmpresa} className="add-folder-form">
            <input
              type="text"
              placeholder="Nombre de la nueva empresa"
              value={newEmpresaName}
              onChange={(e) => setNewEmpresaName(e.target.value)}
              className="input-folder-name"
            />
            <button type="submit" className="btn-add-folder">
              Agregar Empresa
            </button>
          </form>

          {empresas.length > 0 ? (
            <div className="folders-list">
              {empresas.map((empresa) => (
                <div key={empresa.id} className="folder-item">
                  <span
                    className="folder-name"
                    onClick={() => handleSelectEmpresa(empresa)}
                  >
                    📁 {empresa.nombre}
                  </span>
                  <button
                    className="btn-delete-folder"
                    onClick={() => handleDeleteEmpresa(empresa.id)}
                  >
                    🗑️ Borrar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay empresas creadas.</p>
          )}
        </>
      )}

      {/* 
        VISTA 2: LISTADO DE NORMAS 
        Se muestra si HAY empresa seleccionada PERO NO hay norma seleccionada
      */}
      {selectedEmpresa && !selectedNorma && (
        <>
          <button onClick={handleGoBackToEmpresas} className="btn-back-home">
            ← Regresar a Empresas
          </button>
          <h2>Normas de la Empresa: {selectedEmpresa.nombre}</h2>
          <form onSubmit={handleAddNorma} className="add-folder-form">
            <input
              type="text"
              placeholder="Nombre de la nueva norma"
              value={newNormaName}
              onChange={(e) => setNewNormaName(e.target.value)}
              className="input-folder-name"
            />
            <button type="submit" className="btn-add-folder">
              Agregar Norma
            </button>
          </form>

          {normas.length > 0 ? (
            <div className="folders-list">
              {normas.map((norma) => (
                <div key={norma.id} className="folder-item">
                  <span
                    className="folder-name"
                    onClick={() => handleSelectNorma(norma)}
                  >
                    📁 {norma.nombreNorma || norma.id}
                  </span>
                  <button
                    className="btn-delete-folder"
                    onClick={() => handleDeleteNorma(norma.id)}
                  >
                    🗑️ Borrar
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay normas creadas.</p>
          )}
        </>
      )}

      {/*
        VISTA 3: LISTADO DE REGISTROS (TABLAS)
        Se muestra si HAY empresa seleccionada Y TAMBIÉN hay norma seleccionada
      */}
      {selectedEmpresa && selectedNorma && (
        <>
          <div>
            <button onClick={handleGoBackToNormas} className="btn-back-home">
              ← Regresar a Normas
            </button>
            <button onClick={handleGoBackToEmpresas} className="btn-back-home" style={{ marginLeft: 10 }}>
              ← Regresar a Empresas
            </button>
          </div>
          <h2>
            Registros de la Norma: {selectedNorma.nombreNorma || selectedNorma.id}
          </h2>
          <form onSubmit={handleAddRegistro} className="add-folder-form">
            <input
              type="text"
              placeholder="Nombre del nuevo registro"
              value={newRegistroName}
              onChange={(e) => setNewRegistroName(e.target.value)}
              className="input-folder-name"
            />
            <button type="submit" className="btn-add-folder">
              Agregar Registro
            </button>
          </form>

          {registros.length > 0 ? (
            <div className="folders-list">
              {registros.map((reg) => (
                <div key={reg.id} className="saved-table">
                  <p><strong>Nombre:</strong> {reg.nombreRegistro || reg.id}</p>
                  {/* Más campos si tuvieras */}
                  <p><strong>Fecha Creación:</strong> {reg.fechaCreacion?.toDate().toLocaleString() || '---'}</p>
                  <div className="table-buttons">
                    <button className="btn-edit" onClick={() => handleEditRegistro(reg)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDeleteRegistro(reg.id)}>
                      Borrar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay registros creados.</p>
          )}
        </>
      )}
    </div>
  );
};

export default SavedTables;
