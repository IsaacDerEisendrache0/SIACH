import React from 'react';
import './Table04.css';

const ToolEvaluationTable = () => {
  return (
    <div className="table-container">
      <table className="evaluation-table">
        <thead>
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
            <td className="image-cell" colSpan="4">imagen</td>
            <td className="header" colSpan="4">Evaluación de riesgo de trabajo</td>
          </tr>
          <tr>
            <td className="sub-header">Consecuencia</td>
            <td className="sub-header">Exposición</td>
            <td className="sub-header">Probabilidad</td>
            <td className="sub-header" rowSpan="3">Equipo de Protección Personal sugerido:</td>
          </tr>
          <tr>
            <td>Lesiones con baja</td>
            <td>Irregularmente</td>
            <td>Coincidencia muy rara, pero se sabe que ha ocurrido</td>
            <td>Guantes</td>
          </tr>
          <tr>
            <td>5</td>
            <td>2</td>
            <td>1</td>
            <td>Calzado contra impacto</td>
          </tr>
          <tr>
            <td colSpan="3" className="header">Clasificación de Magnitud de Riesgo</td>
            <td colSpan="2" className="sub-header">Principales partes del cuerpo expuestas al riesgo:</td>
          </tr>
          <tr>
            <td>Magnitud del Riesgo:</td>
            <td>10</td>
            <td className="highlight">Bajo o Aceptable</td>
            <td>Casco contra impacto</td>
            <td>Brazos y manos</td>
          </tr>
          <tr>
            <td>Clasificación:</td>
            <td>Tolerable</td>
            <td>Acción:</td>
            <td>Overol</td>
            <td>Extremidades inferiores</td>
          </tr>
          <tr>
            <td colSpan="4" className="header">Identificaciones de Riesgos:</td>
          </tr>
          <tr>
            <td>Golpes y cortes en manos ocasionados por las propias herramientas</td>
            <td colSpan="3" className="sub-header">X</td>
          </tr>
          <tr>
            <td>Lesiones oculares por partículas</td>
            <td colSpan="3"></td>
          </tr>
          <tr>
            <td>Golpes en diferentes partes del cuerpo por despido de la herramienta</td>
            <td colSpan="3" className="sub-header">X</td>
          </tr>
          <tr>
            <td>Esguinces por sobreesfuerzos o gestos violentos</td>
            <td colSpan="3"></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="4" className="footer-header">Observaciones:</td>
            <td colSpan="4">Contar con un procedimiento seguro de trabajo, Puede causar dolores musculares. Hacer buen uso de la herramienta</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ToolEvaluationTable;
