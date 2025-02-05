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
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import './SavedTables.css';

const SavedTables = () => {
  const navigate = useNavigate();

  // --------------------------------
  // Estados para cada nivel:
  //  1) Empresas
  //  2) Normas (subcolección por Empresa)
  //  3) Registros (subcolección por Norma)
  // --------------------------------

  // 1) EMPRESAS
  const [empresas, setEmpresas] = useState([]);
  const [newEmpresaName, setNewEmpresaName] = useState('');
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  // 2) NORMAS
  const [normas, setNormas] = useState([]);
  const [newNormaName, setNewNormaName] = useState('');
  const [selectedNorma, setSelectedNorma] = useState(null);

  // 3) REGISTROS
  const [registros, setRegistros] = useState([]);

  

  // ------------------------------------------------------------------
  // CARGA DE EMPRESAS AL MONTAR EL COMPONENTE
  // ------------------------------------------------------------------
  useEffect(() => {
    loadEmpresas();
  }, []);
  
  const loadEmpresas = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'empresas'));
      const fetchedEmpresas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmpresas(fetchedEmpresas);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    }
  };
  
  

  // ------------------------------------------------------------------
  // CREAR EMPRESA
  // ------------------------------------------------------------------
  const handleAddEmpresa = async (e) => {
    e.preventDefault();
    if (!newEmpresaName.trim()) {
      alert('El nombre de la empresa no puede estar vacío.');
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'empresas'), {
        nombre: newEmpresaName,
        fechaCreacion: serverTimestamp(),
      });
      // Actualizamos el estado local
      setEmpresas([...empresas, { id: docRef.id, nombre: newEmpresaName }]);
      setNewEmpresaName('');
      alert('Empresa creada con éxito.');
    } catch (error) {
      console.error('Error al crear empresa:', error);
    }
  };

  // ------------------------------------------------------------------
  // ELIMINAR EMPRESA (Y SUS SUBCOLECCIONES DE NORMAS Y REGISTROS)
  // ------------------------------------------------------------------
  const handleDeleteEmpresa = async (empresaId) => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas borrar esta empresa? Esto eliminará también todas sus normas y registros.'
    );
    if (!confirmDelete) return;

    try {
      // 1. Cargar todas las normas de la empresa
      const normasSnap = await getDocs(collection(db, 'empresas', empresaId, 'normas'));
      
      for (let normaDoc of normasSnap.docs) {
        const normaId = normaDoc.id;

        // 2. Cargar todos los registros de cada norma
        const registrosSnap = await getDocs(
          collection(db, 'empresas', empresaId, 'normas', normaId, 'registros')
        );

        // Usamos un batch para eliminar todos los registros de la norma
        const batch = writeBatch(db);
        registrosSnap.forEach(regDoc => {
          batch.delete(doc(db, 'empresas', empresaId, 'normas', normaId, 'registros', regDoc.id));
        });
        await batch.commit();

        // 3. Eliminar la norma
        await deleteDoc(doc(db, 'empresas', empresaId, 'normas', normaId));
      }

      // 4. Eliminar la empresa
      await deleteDoc(doc(db, 'empresas', empresaId));

      // 5. Actualizamos el estado local
      setEmpresas((prev) => prev.filter((emp) => emp.id !== empresaId));
      if (selectedEmpresa && selectedEmpresa.id === empresaId) {
        setSelectedEmpresa(null);
        setNormas([]);
        setSelectedNorma(null);
        setRegistros([]);
      }

      alert('Empresa eliminada con éxito.');
    } catch (error) {
      console.error('Error al borrar la empresa:', error);
    }
  };

  // ------------------------------------------------------------------
  // ENTRAR A NORMAS DE UNA EMPRESA
  // ------------------------------------------------------------------
  const handleEnterEmpresa = (empresa) => {
    setSelectedEmpresa(empresa);
    loadNormas(empresa.id);
  };

  const loadNormas = async (empresaId) => {
    try {
      const snapshot = await getDocs(collection(db, 'empresas', empresaId, 'normas'));
      const fetchedNormas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNormas(fetchedNormas);
    } catch (error) {
      console.error('Error al cargar normas:', error);
    }
  };

  // ------------------------------------------------------------------
  // CREAR NORMA
  // ------------------------------------------------------------------
  const handleAddNorma = async (e) => {
    e.preventDefault();
    if (!newNormaName.trim()) {
      alert('El nombre de la norma no puede estar vacío.');
      return;
    }

    try {
      const docRef = await addDoc(
        collection(db, 'empresas', selectedEmpresa.id, 'normas'), 
        {
          nombre: newNormaName,
          fechaCreacion: serverTimestamp(),
        }
      );
      setNormas([...normas, { id: docRef.id, nombre: newNormaName }]);
      setNewNormaName('');
      alert('Norma creada con éxito.');
    } catch (error) {
      console.error('Error al crear la norma:', error);
    }
  };

  // ------------------------------------------------------------------
  // ELIMINAR NORMA (Y SUS REGISTROS)
  // ------------------------------------------------------------------
  const handleDeleteNorma = async (normaId) => {
    const confirmDelete = window.confirm(
      '¿Estás seguro de que deseas borrar esta norma? Esto eliminará también todos sus registros.'
    );
    if (!confirmDelete) return;

    try {
      // Borrar todos los registros de la norma en un batch
      const registrosSnap = await getDocs(
        collection(db, 'empresas', selectedEmpresa.id, 'normas', normaId, 'registros')
      );
      const batch = writeBatch(db);
      registrosSnap.forEach(regDoc => {
        batch.delete(
          doc(db, 'empresas', selectedEmpresa.id, 'normas', normaId, 'registros', regDoc.id)
        );
      });
      await batch.commit();

      // Borrar la norma
      await deleteDoc(doc(db, 'empresas', selectedEmpresa.id, 'normas', normaId));

      // Actualizar estado local
      setNormas((prev) => prev.filter((n) => n.id !== normaId));
      if (selectedNorma && selectedNorma.id === normaId) {
        setSelectedNorma(null);
        setRegistros([]);
      }

      alert('Norma eliminada con éxito.');
    } catch (error) {
      console.error('Error al borrar la norma:', error);
    }
  };

  // ------------------------------------------------------------------
  // ENTRAR A REGISTROS DE UNA NORMA
  // ------------------------------------------------------------------
  const handleEnterNorma = (norma) => {
    setSelectedNorma(norma);
    loadRegistros(selectedEmpresa.id, norma.id);
  };

  const loadRegistros = async (empresaId, normaId) => {
    try {
      const registrosSnap = await getDocs(
        collection(db, 'empresas', empresaId, 'normas', normaId, 'registros')
      );
      const fetchedRegistros = registrosSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Ordenar si lo deseas por fecha/hora
      const sorted = fetchedRegistros.sort((a, b) => {
        const dateA = new Date(`${a.fecha} ${a.hora}`);
        const dateB = new Date(`${b.fecha} ${b.hora}`);
        return dateB - dateA; // más reciente primero
      });
      setRegistros(sorted);
    } catch (error) {
      console.error('Error al cargar registros:', error);
    }
  };

  // ------------------------------------------------------------------
  // CREAR REGISTRO (EJEMPLO SIMPLIFICADO)
  // ------------------------------------------------------------------
  const handleAddRegistro = async () => {
    // Datos de ejemplo: adapta esto a tu formulario real
    const nuevoRegistro = {
      nombreEmpresa: selectedEmpresa.nombre,
      norma: selectedNorma.nombre,
      fecha: '2025-02-05',
      hora: '10:00',
      areaSeleccionada: 'Área X',
      puestoSeleccionado: 'Puesto Y',
      risk: 'Medio',
      fechaCreacion: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(
        collection(db, 'empresas', selectedEmpresa.id, 'normas', selectedNorma.id, 'registros'),
        nuevoRegistro
      );
      setRegistros([...registros, { id: docRef.id, ...nuevoRegistro }]);
      alert('Registro creado con éxito.');
    } catch (error) {
      console.error('Error al crear el registro:', error);
    }
  };

  // ------------------------------------------------------------------
  // ELIMINAR REGISTRO
  // ------------------------------------------------------------------
  const handleDeleteRegistro = async (registroId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas borrar este registro?');
    if (!confirmDelete) return;
    try {
      await deleteDoc(
        doc(db, 'empresas', selectedEmpresa.id, 'normas', selectedNorma.id, 'registros', registroId)
      );
      setRegistros((prev) => prev.filter(reg => reg.id !== registroId));
      alert('Registro borrado con éxito.');
    } catch (error) {
      console.error('Error al borrar registro:', error);
    }
  };

  // ------------------------------------------------------------------
  // EDITAR REGISTRO
  // ------------------------------------------------------------------
  const handleEditRegistro = (registro) => {
    // Guardar datos en localStorage o usar un estado global
    localStorage.setItem('registroToEdit', JSON.stringify({
      ...registro,
      empresaId: selectedEmpresa.id,
      normaId: selectedNorma.id,
    }));
    // Navegar a alguna vista de edición
    navigate('/norma_004');
  };

  // ------------------------------------------------------------------
  // BOTONES PARA REGRESAR DE UN NIVEL AL ANTERIOR
  // ------------------------------------------------------------------
  const handleGoBackToEmpresas = () => {
    setSelectedEmpresa(null);
    setNormas([]);
    setSelectedNorma(null);
    setRegistros([]);
  };

  const handleGoBackToNormas = () => {
    setSelectedNorma(null);
    setRegistros([]);
  };

  // ------------------------------------------------------------------
  // RENDER PRINCIPAL
  // ------------------------------------------------------------------
  return (
    <div className="saved-tables-container">
      {/* =========================
          VISTA DE EMPRESAS
         ========================= */}
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
            <button type="submit" className="btn-add-folder">Agregar Empresa</button>
          </form>

          {empresas.length > 0 ? (
            <div className="folders-list">
              {empresas.map((empresa) => (
                <div key={empresa.id} className="folder-item">
                  <span
                    className="folder-name"
                    onClick={() => handleEnterEmpresa(empresa)}
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

      {/* =========================
          VISTA DE NORMAS
         ========================= */}
      {selectedEmpresa && !selectedNorma && (
        <>
          <div className="back-to-home">
            <button onClick={handleGoBackToEmpresas} className="btn-back-home">
              ← Regresar a Empresas
            </button>
          </div>
          <h2>Normas de la empresa: {selectedEmpresa.nombre}</h2>

          <form onSubmit={handleAddNorma} className="add-folder-form">
            <input
              type="text"
              placeholder="Nombre de la nueva norma"
              value={newNormaName}
              onChange={(e) => setNewNormaName(e.target.value)}
              className="input-folder-name"
            />
            <button type="submit" className="btn-add-folder">Agregar Norma</button>
          </form>

          {normas.length > 0 ? (
            <div className="folders-list">
              {normas.map((norma) => (
                <div key={norma.id} className="folder-item">
                  <span
                    className="folder-name"
                    onClick={() => handleEnterNorma(norma)}
                  >
                    📁 {norma.nombre}
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
            <p>No hay normas creadas para esta empresa.</p>
          )}
        </>
      )}

      {/* =========================
          VISTA DE REGISTROS
         ========================= */}
      {selectedNorma && (
        <>
          <div className="back-to-home">
            <button onClick={handleGoBackToNormas} className="btn-back-home">
              ← Regresar a Normas
            </button>
          </div>
          <h2>Registros de la Norma: {selectedNorma.nombre}</h2>

          {/* Ejemplo de botón para crear un registro rápido */}
          <button onClick={handleAddRegistro} className="btn-add-folder">
            Crear nuevo registro (demo)
          </button>

          {registros.map((registro) => (
            <div key={registro.id} className="saved-table">
              <p><strong>Empresa:</strong> {registro.nombreEmpresa}</p>
              <p><strong>Norma:</strong> {registro.norma}</p>
              <p><strong>Área:</strong> {registro.areaSeleccionada}</p>
              <p><strong>Puesto:</strong> {registro.puestoSeleccionado}</p>
              <p><strong>Fecha de creación:</strong> {registro.fecha} - {registro.hora}</p>
              <p><strong>Magnitud del Riesgo:</strong> {registro.risk}</p>
              <div className="table-buttons">
                <button className="btn-edit" onClick={() => handleEditRegistro(registro)}>
                  Editar
                </button>
                <button className="btn-delete" onClick={() => handleDeleteRegistro(registro.id)}>
                  Borrar
                </button>
              </div>
            </div>
          ))}

          {registros.length === 0 && <p>No hay registros en esta norma.</p>}
        </>
      )}
    </div>
  );
};

export default SavedTables;
