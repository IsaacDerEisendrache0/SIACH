import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase"; // Configuración de Firebase
import { getAuth } from "firebase/auth"; // Para obtener el usuario autenticado
import "./resumenAccion.css"; // Importa el nuevo archivo CSS

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

    // Suscripción a las colecciones
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
    <div className="tabla-resumen-container">
      <table className="risk-summary-table">
        <thead>
          <tr>
            <th rowSpan="6" className="left-header">RESUMEN DE ACCIÓN</th>
            <th colSpan="2" className="evaluation-header">Evaluación de riesgos</th>
          </tr>
        </thead>
        <tbody>
          <tr className="grave-row">
            <td>N° de riesgos clasificados como GRAVE=</td>
            <td>{total.grave}</td>
          </tr>
          <tr className="elevado-row">
            <td>N° de riesgos clasificados como ELEVADO=</td>
            <td>{total.elevado}</td>
          </tr>
          <tr className="notable-row">
            <td>N° de riesgos clasificados como NOTABLE=</td>
            <td>{total.notable}</td>
          </tr>
          <tr className="moderado-row">
            <td>N° de riesgos clasificados como MODERADO=</td>
            <td>{total.moderado}</td>
          </tr>
          <tr className="tolerable-row">
            <td>N° de riesgos clasificados como TOLERABLE=</td>
            <td>{total.tolerable}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ResumenAccion;
