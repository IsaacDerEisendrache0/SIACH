import React from 'react';
import './Table04.css';

const ToolRiskTable = () => {
  return (
    <div className="table-container">
      <h3>Observaciones:</h3>
      <p>Contar con un procedimiento seguro de trabajo y hacer un buen uso de la herramienta</p>
      <table className="risk-table">
        <thead>
          <tr>
            <td className="header" colSpan="2">Nombre de la herramienta:</td>
            <td className="header" colSpan="2">Área:</td>
          </tr>
          <tr>
            <td className="header">Energía utilizada:</td>
            <td>Manual</td>
            <td className="header">POE:</td>
            <td></td>
          </tr>
          <tr>
            <td className="header">Tiempo de exposición:</td>
            <td></td>
            <td className="header">Fecha de inspección:</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="4" className="centered-img">imagen</td>
          </tr>
          <tr>
            <td colSpan="4" className="header">Evaluación de riesgo de trabajo</td>
          </tr>
          <tr>
            <td className="sub-header">Consecuencia</td>
            <td className="sub-header">Exposición</td>
            <td className="sub-header">Probabilidad</td>
            <td className="sub-header">Equipo de Protección Personal sugerido:</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td rowSpan="3">imagen</td>
          </tr>
          <tr>
            <td colSpan="3" className="header">Clasificación de Magnitud de Riesgo</td>
          </tr>
          <tr>
            <td>Magnitud del Riesgo:</td>
            <td>#VALOR!</td>
            <td></td>
          </tr>
          <tr>
            <td>Clasificación:</td>
            <td>#VALOR!</td>
            <td>Acción:</td>
            <td>#VALOR!</td>
          </tr>
          <tr>
            <td colSpan="4" className="header">Identificaciones de Riesgos:</td>
          </tr>
          <tr>
            <td>Golpes y cortes en manos</td>
            <td colSpan="3">X</td>
          </tr>
          <tr>
            <td>Lesiones oculares por partículas</td>
            <td colSpan="3"></td>
          </tr>
          <tr>
            <td>Golpes en diferentes partes del cuerpo</td>
            <td colSpan="3">X</td>
          </tr>
          <tr>
            <td>Esguinces por sobreesfuerzos</td>
            <td colSpan="3"></td>
          </tr>
        </tbody>
      </table>

      {/* Segunda tabla repetida */}
      <table className="risk-table">
        <thead>
          <tr>
            <td className="header" colSpan="2">Nombre de la herramienta:</td>
            <td className="header" colSpan="2">Área:</td>
          </tr>
          <tr>
            <td className="header">Energía utilizada:</td>
            <td>Manual</td>
            <td className="header">POE:</td>
            <td></td>
          </tr>
          <tr>
            <td className="header">Tiempo de exposición:</td>
            <td></td>
            <td className="header">Fecha de inspección:</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="4" className="centered-img">imagen</td>
          </tr>
          <tr>
            <td colSpan="4" className="header">Evaluación de riesgo de trabajo</td>
          </tr>
          <tr>
            <td className="sub-header">Consecuencia</td>
            <td className="sub-header">Exposición</td>
            <td className="sub-header">Probabilidad</td>
            <td className="sub-header">Equipo de Protección Personal sugerido:</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td rowSpan="3">imagen</td>
          </tr>
          <tr>
            <td colSpan="3" className="header">Clasificación de Magnitud de Riesgo</td>
          </tr>
          <tr>
            <td>Magnitud del Riesgo:</td>
            <td>#VALOR!</td>
            <td></td>
          </tr>
          <tr>
            <td>Clasificación:</td>
            <td>#VALOR!</td>
            <td>Acción:</td>
            <td>#VALOR!</td>
          </tr>
          <tr>
            <td colSpan="4" className="header">Identificaciones de Riesgos:</td>
          </tr>
          <tr>
            <td>Golpes y cortes en manos</td>
            <td colSpan="3">X</td>
          </tr>
          <tr>
            <td>Lesiones oculares por partículas</td>
            <td colSpan="3"></td>
          </tr>
          <tr>
            <td>Golpes en diferentes partes del cuerpo</td>
            <td colSpan="3">X</td>
          </tr>
          <tr>
            <td>Esguinces por sobreesfuerzos</td>
            <td colSpan="3"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ToolRiskTable;
