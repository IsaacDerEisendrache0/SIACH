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
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import "./SavedTables.css";




const SavedTables = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  // Declaramos TODOS los hooks de forma incondicional
  const [empresas, setEmpresas] = useState([]);
  const [newEmpresaName, setNewEmpresaName] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  const [normas, setNormas] = useState([]);
  const [newNormaName, setNewNormaName] = useState("");
  const [selectedNorma, setSelectedNorma] = useState(null);

  const [registros, setRegistros] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const registrosPorPagina = 15;

  const [selectedFilterEmpresa, setSelectedFilterEmpresa] = useState("");
  const [selectedFilterNorma, setSelectedFilterNorma] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showAreaFilterMenu, setShowAreaFilterMenu] = useState(false);
  const [selectedFilterArea, setSelectedFilterArea] = useState("");

  const menuRef = useRef(null);

  // useEffect para detectar clics fuera del menú
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



  

  // Si aún no se ha obtenido el usuario, podemos mostrar un mensaje de carga
  // (Los hooks ya fueron declarados de forma incondicional, por lo que no se viola la regla)
  // Nota: Si user es null, podrías redireccionar o mostrar "Cargando..."
  // Aquí simplemente mostramos "Cargando..." en el render.
  // Puedes ajustar esta parte según tu lógica de autenticación.
  // También podrías usar un estado para el usuario si se actualiza asíncronamente.
  // Por ejemplo: const [currentUser, setCurrentUser] = useState(null);
  // y en un useEffect suscribirte a auth.onAuthStateChanged, etc.
  // En este ejemplo, se usa auth.currentUser directamente.

  // ------------------------------------------------------------------
  // CARGA DE EMPRESAS (filtradas por UID)
  // ------------------------------------------------------------------
  useEffect(() => {
    if (user) {
      loadEmpresas();
    }
  }, [user]);

  const loadEmpresas = async () => {
    try {
      const q = query(collection(db, "empresas"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
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
  // CREAR EMPRESA (incluye uid)
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
        uid: user.uid,
      });
      setEmpresas([...empresas, { id: docRef.id, nombre: newEmpresaName }]);
      setNewEmpresaName("");
      alert("Empresa creada con éxito.");
    } catch (error) {
      console.error("Error al crear empresa:", error);
    }
  };

  // ------------------------------------------------------------------
  // ELIMINAR EMPRESA (Y SUS SUBCOLECCIONES)
  // ------------------------------------------------------------------
  const handleDeleteEmpresa = async (empresaId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas borrar esta empresa? Esto eliminará también todas sus normas y registros.",
    );
    if (!confirmDelete) return;

    try {
      const normasSnap = await getDocs(
        collection(db, "empresas", empresaId, "normas"),
      );

      for (let normaDoc of normasSnap.docs) {
        const normaId = normaDoc.id;
        const registrosSnap = await getDocs(
          collection(db, "empresas", empresaId, "normas", normaId, "registros"),
        );

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
              regDoc.id,
            ),
          );
        });
        await batch.commit();

        await deleteDoc(doc(db, "empresas", empresaId, "normas", normaId));
      }

      await deleteDoc(doc(db, "empresas", empresaId));

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
      const q = query(
        collection(db, "empresas", empresaId, "normas"),
        where("uid", "==", user.uid),
      );
      const snapshot = await getDocs(q);
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
  // CREAR NORMA (incluye uid)
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
          uid: user.uid,
        },
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
      "¿Estás seguro de que deseas borrar esta norma? Esto eliminará también todos sus registros.",
    );
    if (!confirmDelete) return;

    try {
      const registrosSnap = await getDocs(
        collection(
          db,
          "empresas",
          selectedEmpresa.id,
          "normas",
          normaId,
          "registros",
        ),
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
            regDoc.id,
          ),
        );
      });
      await batch.commit();

      await deleteDoc(
        doc(db, "empresas", selectedEmpresa.id, "normas", normaId),
      );

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
    setCurrentPage(1);
    loadRegistros(selectedEmpresa.id, norma.id);
  };

  // ------------------------------------------------------------------
  // Parseo de fecha y hora
  // ------------------------------------------------------------------
  function parseDateTime(fecha, hora) {
  if (!fecha || !hora) {
    return new Date(0); // Devuelve fecha antigua si está incompleto
  }

  try {
    const [day, month, year] = fecha.split("/").map(num => parseInt(num, 10));

    let [time, ampm] = hora.split(" ");
    if (ampm) ampm = ampm.replace(/\./g, "").toUpperCase();

    let [hh, mm, ss] = time.split(":").map(num => parseInt(num, 10));
    if (ampm === "PM" && hh < 12) hh += 12;
    if (ampm === "AM" && hh === 12) hh = 0;

    return new Date(year, month - 1, day, hh, mm, ss);
  } catch (err) {
    console.warn("Fecha u hora inválida:", fecha, hora);
    return new Date(0);
  }
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
      "tablas",
    );

    onSnapshot(registrosRef, (snapshot) => {
      const fetchedRegistros = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    
      // Orden DESCENDENTE (del más nuevo al más viejo):
      const sortedRegistros = fetchedRegistros.sort((a, b) => {
        const dateA = parseDateTime(a.fecha, a.hora);
        const dateB = parseDateTime(b.fecha, b.hora);
        return dateB - dateA;  // Descendente
      });
      
      setRegistros(sortedRegistros);
      
    }, (error) => {
      console.error("Error al cargar registros:", error);
    },
    
      (error) => {
        console.error("Error al cargar registros:", error);
      },
    );
  };

  // ------------------------------------------------------------------
  // ELIMINAR REGISTRO
  // ------------------------------------------------------------------
  const handleDeleteRegistro = async (registroId) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas borrar este registro?",
    );
    if (!confirmDelete) return;

    try {
      const registroRef = doc(
        db,
        "empresas",
        selectedEmpresa.id,
        "normas",
        selectedNorma.id,
        "tablas",
        registroId,
      );

      const docSnapshot = await getDocs(
        collection(
          db,
          "empresas",
          selectedEmpresa.id,
          "normas",
          selectedNorma.id,
          "tablas",
        ),
      );
      const docExists = docSnapshot.docs.some((doc) => doc.id === registroId);

      if (!docExists) {
        alert("El registro no existe en la base de datos.");
        return;
      }

      await deleteDoc(registroRef);
      console.log(
        `✅ Registro ${registroId} eliminado de Firebase correctamente`,
      );
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

  // Guardamos todos los datos en localStorage
  localStorage.setItem(
    "tableToEdit",
    JSON.stringify({
      ...registro,
      empresaId: selectedEmpresa.id,
      normaId: selectedNorma.id,
      consequence: registro.consequence || "Lesiones sin baja",
      exposure: registro.exposure || "Ocasionalmente",
      probability: registro.probability || "Coincidencia extremadamente remota pero concebible",
      hazards: registro.hazards || {},
      selectedMainOption: registro.selectedMainOption || "",
      nombreEmpresa: registro.nombreEmpresa || "",
      selectionList: registro.selectionList || [],
      area: registro.area || "",
      puestos: registro.puestos || [],
      selectedEPPImages: registro.selectedEPPImages || [],
      selectedBodyImage: registro.selectedBodyImage || null,
      bodyParts: registro.bodyParts || {},
      descripcion: registro.descripcion || "",
      poe: registro.poe || "",
      tiempoExposicion: registro.tiempoExposicion || "",
      image: registro.image || null,
      opcionesIdentificacionesSeleccionadas: registro.opcionesIdentificacionesSeleccionadas || [],
      sistemasSeguridadSeleccionados: registro.sistemasSeguridadSeleccionados || [],
    })
  );

  // 🧠 Ruta dinámica basada en la norma
  const norma = registro.norma || "";
  if (norma.includes("017")) {
    navigate("/norma_17_editor");
  } else if (norma.toLowerCase().includes("moviles")) {
    navigate("/tabla_moviles");
  } else if (norma.toLowerCase().includes("maquinaria")) {
    navigate("/tabla_maquinaria");
  } else if (norma.toLowerCase().includes("herramientas")) {
    navigate("/tabla_herramientas");
  } else {
    alert("No se pudo determinar a qué tabla redirigir.");
  }
};



  // ------------------------------------------------------------------
  // BOTONES PARA REGRESAR
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
  // FILTROS
  // ------------------------------------------------------------------
  const displayedEmpresas = selectedFilterEmpresa
    ? empresas.filter((emp) => emp.nombre === selectedFilterEmpresa)
    : empresas;
  const displayedNormas = selectedFilterNorma
    ? normas.filter((norm) => norm.nombre === selectedFilterNorma)
    : normas;
    
  const uniqueAreas = [
    ...new Set(registros.map((reg) => reg.areaSeleccionada)),
  ];
  const filteredRegistros = registros.filter((reg) =>
    selectedFilterArea ? reg.areaSeleccionada === selectedFilterArea : true,
  );

  const indexOfLastRegistro = currentPage * registrosPorPagina;
  const indexOfFirstRegistro = indexOfLastRegistro - registrosPorPagina;
  const currentRegistros = filteredRegistros.slice(
    indexOfFirstRegistro,
    indexOfLastRegistro,
  );
  const totalPages = Math.ceil(filteredRegistros.length / registrosPorPagina);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div className="saved-tables-container">
      {/* Si no hay usuario, se muestra un mensaje */}
      {!user ? (
        <p>Cargando...</p>
      ) : (
        <>
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
              <div
                className={`filter-container ${showFilterMenu ? "show" : "hide"}`}
              >
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
              <div
                className={`filter-container ${showAreaFilterMenu ? "show" : "hide"}`}
              >
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

          {/* VISTA DE NORMAS */}
          {selectedEmpresa && !selectedNorma && (
            <>
              <div className="back-to-home">
                <button
                  onClick={handleGoBackToEmpresas}
                  className="btn-back-home"
                >
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

          {/* VISTA DE REGISTROS */}
          {selectedNorma && (
            <>
              <div className="back-to-home">
                <button
                  onClick={handleGoBackToNormas}
                  className="btn-back-home"
                >
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
        </>
      )}
    </div>
  );
};

export default SavedTables;
