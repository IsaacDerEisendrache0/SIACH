import React from 'react';
import './Table04.css';

const ToolEvaluationTable = () => {
  return (
    <div className="table-container">
      <table className="evaluation-table">
        <thead>
          <h5>Tabla de Herramientas Manuales</h5>
          <tr>
            <td className="header" colSpan="4">Nombre de la herramienta: Llave Stilson</td>
            <td className="header">Área: Mina y Planta</td>
          </tr>
          <tr>
            <td className="header">Energía utilizada:</td>
            <td>Manual</td>
            <td className="header">POE:</td>
            <td>1</td>
            <td className="header">Tiempo de exposición:</td>
            <td>5 min</td>
            <td className="header">Fecha de inspección:</td>
            <td>04-abr-23</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="image-cell" rowSpan="8">imagen</td>
            <td className="header" colSpan="3">Evaluación de riesgo de trabajo</td>
            <td className="header" colSpan="3">Equipo de Protección Personal sugerido</td>
          </tr>
          <tr>
            <td className="sub-header">Consecuencia</td>
            <td className="sub-header">Exposición</td>
            <td className="sub-header">Probabilidad</td>
            <td rowSpan="5" className="protection-cell">
  
            </td>
          </tr>
          <tr>
            <td>Lesiones con baja</td>
            <td>Irregularmente</td>
            <td>Coincidencia muy rara, pero se sabe que ha ocurrido</td>
          </tr>

          <tr>
            <td colSpan="3" className="header">Clasificación de Magnitud de Riesgo</td>
          </tr>
          <tr>
            <td colSpan="3">Magnitud del Riesgo: 10</td>
          </tr>
          <tr>
            <td colSpan="3">Clasificación: Bajo o Aceptable</td>
          </tr>
          <tr>
            <td colSpan="3">Acción: Tolerable</td>
          </tr>
          <tr>
            <td className="header" colSpan="7">Identificaciones de Riesgos:</td>
          </tr>
          <tr>
            <td>Golpes y cortes en manos</td>
            <td>Brazos y manos</td>
            <td>Extremidades inferiores</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td className="footer-header" colSpan="4">Observaciones:</td>
            <td colSpan="3">Contar con un procedimiento seguro de trabajo, Puede causar dolores musculares. Hacer buen uso de la herramienta</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ToolEvaluationTable;
