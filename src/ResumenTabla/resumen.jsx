import React, { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { FaTrash } from "react-icons/fa";
import "./TablaResumen.css";

const TablaResumen = () => {
  const [data, setData] = useState([]);
  const [expandedAreas, setExpandedAreas] = useState([]); // Control de áreas expandidas

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      console.error("No se encontró un usuario autenticado.");
      return;
    }     
  
    const uid = user.uid;
  
    // Suscribirse a cambios en la colección "resumen_17"
    const unsubscribe17 = onSnapshot(
      query(collection(db, "resumen_17"), where("uid", "==", uid)),
      (snapshot) => {
        const areasData17 = snapshot.docs.map((doc) => ({
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
    
  
    // Suscribirse a cambios en la colección "resumen"
    const unsubscribe04 = onSnapshot(
      query(collection(db, "resumen"), where("uid", "==", uid)),
      (snapshot) => {
        const areasData04 = snapshot.docs.map((doc) => ({
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
  }, []);

  // Función para eliminar un registro
  const deleteArea = async (id, collectionName) => {
    if (!collectionName) {
      alert("Error: No se especificó la colección para eliminar el registro.");
      return;
    }

    try {
      // Eliminar el documento de Firestore
      await deleteDoc(doc(db, collectionName, id));

      // Actualizar el estado local eliminando el registro
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

  // Calcular los totales acumulados
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
    <div className="tabla-container">
      <table className="tabla-principal">
        <thead>
          <tr>
            <th rowSpan="2" className="tabla-header">Área</th>
            <th colSpan="5" className="tabla-header">Magnitud de riesgo</th>
            <th rowSpan="2" className="tabla-header">Acción</th>
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
          {data.map((row, index) => (
            <React.Fragment key={index}>
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
          ))}
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
  );
};

export default TablaResumen; 