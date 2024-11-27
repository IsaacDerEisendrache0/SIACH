import React, { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig"; // Importar auth y db desde la configuración de Firebase
import { FaTrash } from "react-icons/fa"; // Importar el icono de basura
import "./TablaResumen.css"; // Importar los estilos externos

const TablaResumen = () => {
  const [data, setData] = useState([]);
  const [expandedAreas, setExpandedAreas] = useState([]); // Control de áreas expandidas

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      console.error("Usuario no autenticado.");
      setData([]); // Si no hay un usuario autenticado, limpia los datos
      return;
    }

    // Consulta para obtener datos en tiempo real filtrados por el userId del usuario autenticado
    const q = query(
      collection(db, "resumen"),
      where("userId", "==", user.uid) // Filtra los documentos por el userId
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const areasData = snapshot.docs.map((doc) => ({
        area: doc.id,
        ...doc.data(),
      }));

      setData(areasData); // Actualiza el estado con los datos obtenidos
    });

    // Limpiar suscripción cuando el componente se desmonte
    return () => unsubscribe();
  }, []);

  // Función para eliminar un registro
  const deleteArea = async (id) => {
    try {
      await deleteDoc(doc(db, "resumen", id));
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
    (acc, row) => {
      return {
        tolerable: acc.tolerable + (row.tolerable || 0),
        moderado: acc.moderado + (row.moderado || 0),
        notable: acc.notable + (row.notable || 0),
        elevado: acc.elevado + (row.elevado || 0),
        grave: acc.grave + (row.grave || 0),
      };
    },
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
                    {expandedAreas.includes(row.area) ? "▼" : "▶"}
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
                    onClick={() => deleteArea(row.area)}
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
      {data.length === 0 && (
        <p>No hay datos disponibles para este usuario.</p>
      )}
    </div>
  );
};

export default TablaResumen;
