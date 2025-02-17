import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { FaTrash } from "react-icons/fa";
import "./TablaResumen.css";

const TablaResumen = () => {
  // Estados para el sistema de carpetas
  const [empresas, setEmpresas] = useState([]);
  const [newEmpresaName, setNewEmpresaName] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  const [normas, setNormas] = useState([]);
  const [newNormaName, setNewNormaName] = useState("");
  const [selectedNorma, setSelectedNorma] = useState(null);

  // Estado para la tabla de resumen (funcionalidad original)
  const [data, setData] = useState([]);
  const [expandedAreas, setExpandedAreas] = useState([]); // Control de áreas expandidas

  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user ? user.uid : null;

  /* ================================
     SISTEMA DE CARPETAS
  ================================ */
  // Cargar Empresas (desde la colección "resumenes")
  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, "resumenes"), where("uid", "==", uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const companies = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmpresas(companies);
    });
    return () => unsubscribe();
  }, [uid]);

  // Al seleccionar una empresa, cargar Normas (subcolección "normas")
  useEffect(() => {
    if (selectedEmpresa) {
      const q = query(
        collection(db, "resumenes", selectedEmpresa.id, "normas"),
        where("uid", "==", uid)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const norms = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNormas(norms);
      });
      return () => unsubscribe();
    } else {
      setNormas([]);
      setSelectedNorma(null);
    }
  }, [selectedEmpresa, uid]);

  // Al seleccionar una norma, cargar la tabla de resumen
  useEffect(() => {
    if (selectedNorma && selectedEmpresa && uid) {
      // Suscribirse a la colección "resumen_17"
      const unsubscribe17 = onSnapshot(
        query(collection(db, "resumen_17"), where("uid", "==", uid)),
        (snapshot) => {
          const areasData17 = snapshot.docs.map((doc) => ({
            nombreEmpresa: doc.data().nombreEmpresa || "Sin empresa",
            area: doc.id,
            collectionName: "resumen_17",
            puestos: doc.data().puestos || [],
            tolerable: doc.data().tolerable || 0,
            moderado: doc.data().moderado || 0,
            notable: doc.data().notable || 0,
            elevado: doc.data().elevado || 0,
            grave: doc.data().grave || 0,
          }));
          setData((prevData) => [
            ...prevData.filter((row) => row.collectionName !== "resumen_17"),
            ...areasData17,
          ]);
        }
      );
      

      // Suscribirse a la colección "resumen"
      const unsubscribe04 = onSnapshot(
        query(
          collection(db, "resumen"),
          where("uid", "==", uid),
          where("nombreEmpresa", "==", selectedEmpresa.nombre),
          where("norma", "==", selectedNorma.nombre)
        ),
        (snapshot) => {
          const areasData04 = snapshot.docs.map((doc) => ({
            nombreEmpresa: doc.data().nombreEmpresa || "Sin empresa",
            area: doc.id,
            collectionName: "resumen",
            puestos: doc.data().puestos || [],
            tolerable: doc.data().tolerable || 0,
            moderado: doc.data().moderado || 0,
            notable: doc.data().notable || 0,
            elevado: doc.data().elevado || 0,
            grave: doc.data().grave || 0,
          }));
          setData((prevData) => [
            ...prevData.filter((row) => row.collectionName !== "resumen"),
            ...areasData04,
          ]);
        }
      );

      return () => {
        unsubscribe17();
        unsubscribe04();
      };
    } else {
      setData([]);
    }
  }, [selectedNorma, selectedEmpresa, uid]);

  /* ================================
     FUNCIONALIDAD ORIGINAL DE LA TABLA
  ================================ */
  // Función para agregar una nueva empresa
  const handleAddEmpresa = async (e) => {
    e.preventDefault();
    if (!newEmpresaName.trim()) {
      alert("El nombre de la empresa no puede estar vacío.");
      return;
    }
    try {
      await addDoc(collection(db, "resumenes"), {
        nombre: newEmpresaName,
        uid,
        fechaCreacion: serverTimestamp(),
      });
      setNewEmpresaName("");
      alert("Empresa creada con éxito.");
    } catch (error) {
      console.error("Error al crear empresa:", error);
    }
  };

  // Función para agregar una nueva norma a la empresa seleccionada
  const handleAddNorma = async (e) => {
    e.preventDefault();
    if (!newNormaName.trim() || !selectedEmpresa) {
      alert("El nombre de la norma no puede estar vacío y se debe seleccionar una empresa.");
      return;
    }
    try {
      await addDoc(collection(db, "resumenes", selectedEmpresa.id, "normas"), {
        nombre: newNormaName,
        uid,
        fechaCreacion: serverTimestamp(),
      });
      setNewNormaName("");
      alert("Norma creada con éxito.");
    } catch (error) {
      console.error("Error al crear la norma:", error);
    }
  };

  // Función para eliminar un registro de resumen
  const deleteArea = async (id, collectionName) => {
    if (!collectionName) {
      alert("Error: No se especificó la colección para eliminar el registro.");
      return;
    }
    try {
      await deleteDoc(doc(db, collectionName, id));
      setData((prevData) => prevData.filter((row) => row.area !== id));
      alert("Registro eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
      alert("Error al eliminar el registro.");
    }
  };

  // Función para expandir o contraer los puestos de un área
  const toggleExpandArea = (areaId) => {
    setExpandedAreas((prevExpandedAreas) =>
      prevExpandedAreas.includes(areaId)
        ? prevExpandedAreas.filter((id) => id !== areaId)
        : [...prevExpandedAreas, areaId]
    );
  };

  // Calcular totales acumulados
  const total = data.reduce(
    (acc, row) => ({
      tolerable: acc.tolerable + (row.tolerable || 0),
      moderado: acc.moderado + (row.moderado || 0),
      notable: acc.notable + (row.notable || 0),
      elevado: acc.elevado + (row.elevado || 0),
      grave: acc.grave + (row.grave || 0),
    }),
    { tolerable: 0, moderado: 0, notable: 0, elevado: 0, grave: 0 }
  );

  return (
    <div className="saved-tables-container">
      {/* Vista de Empresas */}
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
          <div className="folders-list">
            {empresas.map((empresa) => (
              <div
                key={empresa.id}
                className="folder-item"
                onClick={() => setSelectedEmpresa(empresa)}
              >
                <span className="folder-name">{empresa.nombre}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Vista de Normas */}
      {selectedEmpresa && !selectedNorma && (
        <>
          <button
            onClick={() => setSelectedEmpresa(null)}
            className="btn-back-home"
          >
            ← Regresar a Empresas
          </button>
          <h2>Normas de {selectedEmpresa.nombre}</h2>
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
          <div className="folders-list">
            {normas.map((norma) => (
              <div
                key={norma.id}
                className="folder-item"
                onClick={() => setSelectedNorma(norma)}
              >
                <span className="folder-name">{norma.nombre}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Vista de la Tabla de Resumen */}
      {selectedEmpresa && selectedNorma && (
        <>
          <button
            onClick={() => setSelectedNorma(null)}
            className="btn-back-home"
          >
            ← Regresar a Normas
          </button>
          <h2>Tabla de Resumen de {selectedNorma.nombre}</h2>
          <div className="tabla-container">
            <table className="tabla-principal">
              <thead>
                <tr>
                  <th rowSpan="2" className="tabla-header">
                    Área
                  </th>
                  <th colSpan="5" className="tabla-header">
                    Magnitud de riesgo
                  </th>
                  <th rowSpan="2" className="tabla-header">
                    Acción
                  </th>
                </tr>
                <tr>
                  <th className="tabla-riesgo tolerable">Tolerable</th>
                  <th className="tabla-riesgo moderado">Moderado</th>
                  <th className="tabla-riesgo notable">Notable</th>
                  <th className="tabla-riesgo elevado">Elevado</th>
                  <th className="tabla-riesgo grave">Grave</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row) => (
                    <React.Fragment key={row.id}>
                      <tr>
                        <td className="tabla-area">
                          <button
                            onClick={() => toggleExpandArea(row.area)}
                            className="boton-expandir"
                          >
                            {expandedAreas.includes(row.area) ? "▼  " : "▶"}
                          </button>
                          {row.area}
                        </td>
                        <td>{row.tolerable || 0}</td>
                        <td>{row.moderado || 0}</td>
                        <td>{row.notable || 0}</td>
                        <td>{row.elevado || 0}</td>
                        <td>{row.grave || 0}</td>
                        <td>
                          <FaTrash
                            onClick={() =>
                              deleteArea(row.area, row.collectionName || "resumen")
                            }
                            className="boton-eliminar"
                          />
                        </td>
                      </tr>
                      {expandedAreas.includes(row.area) && row.puestos && (
                        <tr>
                          <td colSpan="7" className="tabla-subtabla">
                            <table className="tabla-interna">
                              <thead>
                                <tr>
                                  <th className="tabla-header">Puesto</th>
                                  <th className="tolerable">Tolerable</th>
                                  <th className="moderado">Moderado</th>
                                  <th className="notable">Notable</th>
                                  <th className="elevado">Elevado</th>
                                  <th className="grave">Grave</th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.puestos.map((puesto, idx) => (
                                  <tr key={idx}>
                                    <td>{puesto.nombre}</td>
                                    <td>{puesto.tolerable || 0}</td>
                                    <td>{puesto.moderado || 0}</td>
                                    <td>{puesto.notable || 0}</td>
                                    <td>{puesto.elevado || 0}</td>
                                    <td>{puesto.grave || 0}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: "center" }}>
                      No hay registros de resumen en esta norma.
                    </td>
                  </tr>
                )}
                <tr>
                  <th>TOTAL</th>
                  <th>{total.tolerable}</th>
                  <th>{total.moderado}</th>
                  <th>{total.notable}</th>
                  <th>{total.elevado}</th>
                  <th>{total.grave}</th>
                  <th></th>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default TablaResumen;
