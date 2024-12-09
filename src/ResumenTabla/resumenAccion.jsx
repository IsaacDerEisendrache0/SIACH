import React from "react";
import "./TablaResumenContainer.css"; // Si tiene estilos separados

const TablaResumenContainer = ({ total }) => {
  return (
    <div className="tabla-resumen-container" style={{ marginTop: "30px" }}>
      <table className="risk-summary-table" style={{ margin: "0 auto" }}>
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

export default TablaResumenContainer;
