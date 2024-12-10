import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase"; // Configuración de Firebase
import { getAuth } from "firebase/auth"; // Para obtener el usuario autenticado

const ResumenAccion = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("No se encontró un usuario autenticado.");
      return;
    }

    const uid = user.uid;

    // Suscripción a la colección "resumen_17" exclusiva del usuario
    const unsubscribe17 = onSnapshot(
      query(collection(db, "resumen_17"), where("uid", "==", uid)),
      (snapshot) => {
        const areasData17 = snapshot.docs.map((doc) => ({
          tolerable: doc.data().tolerable || 0,
          moderado: doc.data().moderado || 0,
          notable: doc.data().notable || 0,
          elevado: doc.data().elevado || 0,
          grave: doc.data().grave || 0,
        }));
        setData((prevData) => [...prevData, ...areasData17]);
      }
    );

    // Suscripción a la colección "resumen" exclusiva del usuario
    const unsubscribe04 = onSnapshot(
      query(collection(db, "resumen"), where("uid", "==", uid)),
      (snapshot) => {
        const areasData04 = snapshot.docs.map((doc) => ({
          tolerable: doc.data().tolerable || 0,
          moderado: doc.data().moderado || 0,
          notable: doc.data().notable || 0,
          elevado: doc.data().elevado || 0,
          grave: doc.data().grave || 0,
        }));
        setData((prevData) => [...prevData, ...areasData04]);
      }
    );

    // Limpieza de suscripciones
    return () => {
      unsubscribe17();
      unsubscribe04();
    };
  }, []);

  // Calcular los totales
  const total = data.reduce(
    (acc, row) => ({
      tolerable: acc.tolerable + row.tolerable,
      moderado: acc.moderado + row.moderado,
      notable: acc.notable + row.notable,
      elevado: acc.elevado + row.elevado,
      grave: acc.grave + row.grave,
    }),
    { tolerable: 0, moderado: 0, notable: 0, elevado: 0, grave: 0 }
  );

  return (
    <div className="tabla-resumen-container" style={{ marginTop: "30px" }}>
      <table className="risk-summary-table" style={{ margin: "0 auto", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th rowSpan="6" className="left-header">RESUMEN DE ACCIÓN</th>
            <th colSpan="2" className="evaluation-header">Evaluación de riesgos</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ backgroundColor: "#ff6600" }}>
            <td>N° de riesgos clasificados como GRAVE=</td>
            <td>{total.grave}</td>
          </tr>
          <tr style={{ backgroundColor: "#ffcc00" }}>
            <td>N° de riesgos clasificados como ELEVADO=</td>
            <td>{total.elevado}</td>
          </tr>
          <tr style={{ backgroundColor: "#ffff66" }}>
            <td>N° de riesgos clasificados como NOTABLE=</td>
            <td>{total.notable}</td>
          </tr>
          <tr style={{ backgroundColor: "#99cc00" }}>
            <td>N° de riesgos clasificados como MODERADO=</td>
            <td>{total.moderado}</td>
          </tr>
          <tr style={{ backgroundColor: "#66ccff" }}>
            <td>N° de riesgos clasificados como TOLERABLE=</td>
            <td>{total.tolerable}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ResumenAccion;
