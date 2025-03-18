// src/components/SavedTables.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  writeBatch,
  onSnapshot, // ← Importamos onSnapshot para actualizaciones en tiempo real
} from "firebase/firestore";
import { db } from "../firebase";
import "./SavedTables.css";

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
  const [newEmpresaName, setNewEmpresaName] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  // 2) NORMAS
  const [normas, setNormas] = useState([]);
  const [newNormaName, setNewNormaName] = useState("");
  const [selectedNorma, setSelectedNorma] = useState(null);

  // 3) REGISTROS
  const [registros, setRegistros] = useState([]);

  // Estado para paginación de registros
  const [currentPage, setCurrentPage] = useState(1);
  const registrosPorPagina = 15;

  // ------------------------------------------------------------------
  // CARGA DE EMPRESAS AL MONTAR EL COMPONENTE
  // ------------------------------------------------------------------
  useEffect(() => {
    loadEmpresas();
  }, []);

  const loadEmpresas = async () => {
    try {
      const snapshot = await getDocs(collection(db, "empresas"));
      const fetchedEmpresas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmpresas(fetchedEmpresas);
    } catch (error) {
      console.error("Error al cargar empresas:", error);
    }
  };

  // ------------------------------------------------------------------
  // CREAR EMPRESA
  // ------------------------------------------------------------------
  const handleAddEmpresa = async (e) => {
    e.preventDefault();
    if (!newEmpresaName.trim()) {
      alert("El nombre de la empresa no puede estar vacío.");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "empresas"), {
        nombre: newEmpresaName,
        fechaCreacion: serverTimestamp(),
      });
      // Actualizamos el estado local
      setEmpresas([...empresas, { id: docRef.id, nombre: newEmpresaName }]);
      setNewEmpresaName("");
      alert("Empresa creada con éxito.");
    } catch (error) {
      console.error("Error al crear empresa:", error);
    }
  };

  // ------------------------------------------------------------------
  // ELIMINAR EMPRESA (Y SUS SUBCOLECCIONES DE NORMAS Y REGISTROS)
  // ------------------------------------------------------------------
  const handleDeleteEmpresa = async (empresaId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas borrar esta empresa? Esto eliminará también todas sus normas y registros."
    );
    if (!confirmDelete) return;

    try {
      // 1. Cargar todas las normas de la empresa
      const normasSnap = await getDocs(
        collection(db, "empresas", empresaId, "normas")
      );

      for (let normaDoc of normasSnap.docs) {
        const normaId = normaDoc.id;

        // 2. Cargar todos los registros de cada norma
        const registrosSnap = await getDocs(
          collection(db, "empresas", empresaId, "normas", normaId, "registros")
        );

        // Usamos un batch para eliminar todos los registros de la norma
        const batch = writeBatch(db);
        registrosSnap.forEach((regDoc) => {
          batch.delete(
            doc(
              db,
              "empresas",
              empresaId,
              "normas",
              normaId,
              "registros",
              regDoc.id
            )
          );
        });
        await batch.commit();

        // 3. Eliminar la norma
        await deleteDoc(doc(db, "empresas", empresaId, "normas", normaId));
      }

      // 4. Eliminar la empresa
      await deleteDoc(doc(db, "empresas", empresaId));

      // 5. Actualizamos el estado local
      setEmpresas((prev) => prev.filter((emp) => emp.id !== empresaId));
      if (selectedEmpresa && selectedEmpresa.id === empresaId) {
        setSelectedEmpresa(null);
        setNormas([]);
        setSelectedNorma(null);
        setRegistros([]);
      }

      alert("Empresa eliminada con éxito.");
    } catch (error) {
      console.error("Error al borrar la empresa:", error);
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
      const snapshot = await getDocs(
        collection(db, "empresas", empresaId, "normas")
      );
      const fetchedNormas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNormas(fetchedNormas);
    } catch (error) {
      console.error("Error al cargar normas:", error);
    }
  };

  // ------------------------------------------------------------------
  // CREAR NORMA
  // ------------------------------------------------------------------
  const handleAddNorma = async (e) => {
    e.preventDefault();
    if (!newNormaName.trim()) {
      alert("El nombre de la norma no puede estar vacío.");
      return;
    }

    try {
      const docRef = await addDoc(
        collection(db, "empresas", selectedEmpresa.id, "normas"),
        {
          nombre: newNormaName,
          fechaCreacion: serverTimestamp(),
        }
      );
      setNormas([...normas, { id: docRef.id, nombre: newNormaName }]);
      setNewNormaName("");
      alert("Norma creada con éxito.");
    } catch (error) {
      console.error("Error al crear la norma:", error);
    }
  };

  // ------------------------------------------------------------------
  // ELIMINAR NORMA (Y SUS REGISTROS)
  // ------------------------------------------------------------------
  const handleDeleteNorma = async (normaId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas borrar esta norma? Esto eliminará también todos sus registros."
    );
    if (!confirmDelete) return;

    try {
      // Borrar todos los registros de la norma en un batch
      const registrosSnap = await getDocs(
        collection(
          db,
          "empresas",
          selectedEmpresa.id,
          "normas",
          normaId,
          "registros"
        )
      );
      const batch = writeBatch(db);
      registrosSnap.forEach((regDoc) => {
        batch.delete(
          doc(
            db,
            "empresas",
            selectedEmpresa.id,
            "normas",
            normaId,
            "registros",
            regDoc.id
          )
        );
      });
      await batch.commit();

      // Borrar la norma
      await deleteDoc(
        doc(db, "empresas", selectedEmpresa.id, "normas", normaId)
      );

      // Actualizar estado local
      setNormas((prev) => prev.filter((n) => n.id !== normaId));
      if (selectedNorma && selectedNorma.id === normaId) {
        setSelectedNorma(null);
        setRegistros([]);
      }

      alert("Norma eliminada con éxito.");
    } catch (error) {
      console.error("Error al borrar la norma:", error);
    }
  };

  // ------------------------------------------------------------------
  // ENTRAR A REGISTROS DE UNA NORMA
  // ------------------------------------------------------------------
  const handleEnterNorma = (norma) => {
    setSelectedNorma(norma);
    // Reiniciamos la página a 1 al entrar a registros
    setCurrentPage(1);
    loadRegistros(selectedEmpresa.id, norma.id);
  };

  // Función para parsear fecha y hora en formato válido para new Date()
  // Parsea "14/3/2025" y "11:43:45 AM" a un objeto Date de JS
function parseDateTime(fecha, hora) {
  // 1) Separar día, mes y año
  const [day, month, year] = fecha.split("/").map(num => parseInt(num, 10));

  // 2) Separar hora, minutos, segundos y AM/PM
  //    asumiendo que la hora viene como "HH:MM:SS AM" o "HH:MM:SS PM"
  let [time, ampm] = hora.split(" ");         // p.ej. "11:43:45" y "AM"
  let [hh, mm, ss] = time.split(":").map(num => parseInt(num, 10));

  // 3) Ajustar la hora según AM/PM (formato 12h → 24h)
  if (ampm === "PM" && hh < 12) {
    hh += 12;
  }
  if (ampm === "AM" && hh === 12) {
    hh = 0;
  }

  // 4) Crear objeto Date. Ojo: el mes en Date es base 0 (0 = enero)
  const dateObj = new Date(year, month - 1, day, hh, mm, ss);

  return dateObj;
}


  // ------------------------------------------------------------------
  // CARGAR REGISTROS CON ACTUALIZACIÓN EN TIEMPO REAL
  // ------------------------------------------------------------------
  const loadRegistros = (empresaId, normaId) => {
    const registrosRef = collection(
      db,
      "empresas",
      empresaId,
      "normas",
      normaId,
      "tablas" // Aseguramos que esta sea la colección correcta
    );

    // Usamos onSnapshot para que se actualice en tiempo real
    onSnapshot(registrosRef, (snapshot) => {
      const fetchedRegistros = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Ordenar los registros de forma descendente por fecha y hora
      const sortedRegistros = fetchedRegistros.sort((a, b) => {
        const dateA = parseDateTime(a.fecha, a.hora);
        const dateB = parseDateTime(b.fecha, b.hora);
        return dateB - dateA;
      });

      setRegistros(sortedRegistros);
    }, (error) => {
      console.error("Error al cargar registros:", error);
    });
  };

  // ------------------------------------------------------------------
  // ELIMINAR REGISTRO
  // ------------------------------------------------------------------
  const handleDeleteRegistro = async (registroId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas borrar este registro?"
    );
    if (!confirmDelete) return;

    try {
      const registroRef = doc(
        db,
        "empresas",
        selectedEmpresa.id,
        "normas",
        selectedNorma.id,
        "tablas", // Aseguramos que esta sea la colección correcta
        registroId
      );

      // Verificar si el documento existe
      const docSnapshot = await getDocs(
        collection(
          db,
          "empresas",
          selectedEmpresa.id,
          "normas",
          selectedNorma.id,
          "tablas"
        )
      );
      const docExists = docSnapshot.docs.some((doc) => doc.id === registroId);

      if (!docExists) {
        alert("El registro no existe en la base de datos.");
        return;
      }

      await deleteDoc(registroRef);
      console.log(`✅ Registro ${registroId} eliminado de Firebase correctamente`);

      // Al usar onSnapshot, la lista se actualizará automáticamente
      alert("Registro borrado con éxito.");
    } catch (error) {
      console.error("❌ Error al borrar el registro en Firebase:", error);
      alert("Error al eliminar el registro. Revisa la consola.");
    }
  };

  // ------------------------------------------------------------------
  // EDITAR REGISTRO
  // ------------------------------------------------------------------
  const handleEditRegistro = (registro) => {
    console.log("Registro a editar:", registro);
    localStorage.setItem(
      "tableToEdit",
      JSON.stringify({
        ...registro,
        empresaId: selectedEmpresa.id,
        normaId: selectedNorma.id,
        consequence: registro.consequence || 1,
        exposure: registro.exposure || 1,
        probability: registro.probability || 0.1,
        hazards: registro.hazards || {},
        selectedMainOption: registro.selectedMainOption || "",
        nombreEmpresa: registro.nombreEmpresa || "",
        selectionList: registro.selectionList || [],
      })
    );
    navigate("/norma_17_editor");
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
  // FILTROS y menú hamburger (código sin cambios)
  // ------------------------------------------------------------------
  const [selectedFilterEmpresa, setSelectedFilterEmpresa] = useState("");
  const [selectedFilterNorma, setSelectedFilterNorma] = useState("");
  const displayedEmpresas = selectedFilterEmpresa
    ? empresas.filter((emp) => emp.nombre === selectedFilterEmpresa)
    : empresas;
  const displayedNormas = selectedFilterNorma
    ? normas.filter((norm) => norm.nombre === selectedFilterNorma)
    : normas;
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [showAreaFilterMenu, setShowAreaFilterMenu] = useState(false);
  const [selectedFilterArea, setSelectedFilterArea] = useState("");
  const uniqueAreas = [...new Set(registros.map((reg) => reg.areaSeleccionada))];
  const filteredRegistros = registros.filter((reg) =>
    selectedFilterArea ? reg.areaSeleccionada === selectedFilterArea : true
  );

  // Cálculo para la paginación
  const indexOfLastRegistro = currentPage * registrosPorPagina;
  const indexOfFirstRegistro = indexOfLastRegistro - registrosPorPagina;
  const currentRegistros = filteredRegistros.slice(
    indexOfFirstRegistro,
    indexOfLastRegistro
  );
  const totalPages = Math.ceil(filteredRegistros.length / registrosPorPagina);

  return (
    <div className="saved-tables-container">
      {/* Botón para regresar al menú principal */}
      <div className="back-to-main">
        <button onClick={() => navigate("/")} className="btn-back-main">
          ⬅ Regresar al Menú Principal
        </button>
      </div>

      {/* FILTROS de EMPRESA y NORMA */}
      {(!selectedEmpresa || (selectedEmpresa && !selectedNorma)) && (
        <div className="hamburger-menu-container" ref={menuRef}>
          <button
            className="hamburger-btn"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            ☰
          </button>
          <div className={`filter-container ${showFilterMenu ? "show" : "hide"}`}>
            <label>
              <strong>Empresa:</strong>
            </label>
            <select
              value={selectedFilterEmpresa}
              onChange={(e) => setSelectedFilterEmpresa(e.target.value)}
            >
              <option value="">Todas</option>
              {empresas.map((emp) => (
                <option key={emp.id} value={emp.nombre}>
                  {emp.nombre}
                </option>
              ))}
            </select>

            {selectedEmpresa && (
              <>
                <label>
                  <strong>Norma:</strong>
                </label>
                <select
                  value={selectedFilterNorma}
                  onChange={(e) => setSelectedFilterNorma(e.target.value)}
                >
                  <option value="">Todas</option>
                  {normas.map((n) => (
                    <option key={n.id} value={n.nombre}>
                      {n.nombre}
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
      )}

      {/* FILTRO POR ÁREA (SOLO EN REGISTROS) */}
      {selectedNorma && registros.length > 0 && (
        <div className="hamburger-menu-container" ref={menuRef}>
          <button
            className="hamburger-btn"
            onClick={() => setShowAreaFilterMenu(!showAreaFilterMenu)}
          >
            ☰
          </button>
          <div className={`filter-container ${showAreaFilterMenu ? "show" : "hide"}`}>
            <label>
              <strong>Filtrar por Área:</strong>
            </label>
            <select
              value={selectedFilterArea}
              onChange={(e) => setSelectedFilterArea(e.target.value)}
            >
              <option value="">Todas</option>
              {uniqueAreas.map((area, index) => (
                <option key={index} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* VISTA DE EMPRESAS */}
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
              {displayedEmpresas.map((empresa) => (
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

      {/* VISTA DE NORMAS */}
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
            <button type="submit" className="btn-add-folder">
              Agregar Norma
            </button>
          </form>

          {normas.length > 0 ? (
            <div className="folders-list">
              {displayedNormas.map((norma) => (
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

      {/* VISTA DE REGISTROS */}
      {selectedNorma && (
        <>
          <div className="back-to-home">
            <button onClick={handleGoBackToNormas} className="btn-back-home">
              ← Regresar a Normas
            </button>
          </div>
          <h2>Registros de la Norma: {selectedNorma.nombre}</h2>

          {currentRegistros.length > 0 ? (
            currentRegistros.map((registro) => (
              <div key={registro.id} className="saved-table">
                <p>
                  <strong>Empresa:</strong> {registro.nombreEmpresa}
                </p>
                <p>
                  <strong>Norma:</strong> {registro.norma}
                </p>
                <p>
                  <strong>Área:</strong> {registro.areaSeleccionada}
                </p>
                <p>
                  <strong>Puesto:</strong> {registro.puestoSeleccionado}
                </p>
                <p>
                  <strong>Fecha de creación:</strong> {registro.fecha} -{" "}
                  {registro.hora}
                </p>
                <p>
                  <strong>Magnitud del Riesgo:</strong> {registro.risk}
                </p>
                <div className="table-buttons">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditRegistro(registro)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteRegistro(registro.id)}
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No hay registros en esta norma.</p>
          )}

          {/* Controles de paginación */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={currentPage === 1}
              >
                Anterior
              </button>
              <span>
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SavedTables;
