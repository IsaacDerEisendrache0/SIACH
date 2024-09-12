import React, { useState } from 'react';
import './Table04.css';

const ToolEvaluationTable = () => {
  // Estados para los selectores
  const [consecuencia, setConsecuencia] = useState('Lesiones con baja');
  const [exposicion, setExposicion] = useState('Irregularmente');
  const [probabilidad, setProbabilidad] = useState('Coincidencia muy rara, pero se sabe que ha ocurrido');

  return (
    <div className="table-container">
      <table className="evaluation-table">
        <thead>
          <h5>Tabla de Herramientas Manuales</h5>
          <tr>
            <td className="header" colSpan="4">Nombre de la herramienta: Llave Stilson</td>
            <td className="header" colSpan="6">Área: Mina y Planta</td>
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
            <td className="image-cell" rowSpan="7">imagen</td>
            <td className="header" colSpan="3">Evaluación de riesgo de trabajo</td>
            <td className="header" colSpan="3">Equipo de Protección Personal sugerido</td>
          </tr>
          <tr>
            <td className="sub-header">Consecuencia</td>
            <td className="sub-header">Exposición</td>
            <td className="sub-header">Probabilidad</td>
            <td rowSpan="5" className="protection-cell">
              Guantes, Calzado contra impacto, Casco contra impacto, Overol
            </td>
          </tr>
          <tr>
            <td>
              <select value={consecuencia} onChange={(e) => setConsecuencia(e.target.value)}>
                <option value="Catástrofe">Catástrofe</option>
                <option value="Varias muertes">Varias muertes</option>
                <option value="Muerte">Muerte</option>
                <option value="Lesiones graves">Lesiones graves</option>
                <option value="Lesiones con baja">Lesiones con baja</option>
                <option value="Lesiones sin baja">Lesiones sin baja</option>
              </select>
            </td>
            <td>
              <select value={exposicion} onChange={(e) => setExposicion(e.target.value)}>
              <option value="Continuamente">Continuamente</option>
              <option value="Frecuentemente">Frecuentemente</option>
              <option value="Ocasionalmente">Ocasionalmente</option>
                <option value="Irregularmente">Irregularmente</option>
                <option value="Raramente">Raramente</option>
                <option value="Remotamente">Remotamente</option>
              </select>
            </td>
            <td>
              <select value={probabilidad} onChange={(e) => setProbabilidad(e.target.value)}>
                <option value="Es el resultado mas probable y esperando">Es el resultado más probable y esperado</option>
                <option value="Es completamente posible, no será nada extraño">Es completamente posible, no será nada extraño</option>
                <option value="Coincidencia rara">Seria una secuencia o coincidencia rara pero posible, ha ocurrido</option>
                <option value="Coincidencia muy rara, pero se sabe que ha ocurrido"> Coincidencia muy rara, pero se sabe que ha ocurrido</option>
                <option value="Coincidencia extremadamente remota pero concebible">Coincidencia extremadamente remota pero concebible</option>
                <option value="Coincidencia practicamente imposible, jamas ha ocurrido">Coincidencia practicamente imposible, jamas ha ocurrido</option>


              </select>
            </td>
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
            <td className="header" colSpan="4">Identificaciones de Riesgos:</td>
            <td className="header" colSpan="5">Principales partes del cuerpo expuestas al riesgo:</td>
          </tr>
          <tr>
            <td colSpan="3">
              <ul className="risk-list">
                <li>Golpes y cortes en manos</li>
                <li>Lesiones oculares por partículas</li>
                <li>Golpes en diferentes partes del cuerpo</li>
                <li>Esguinces por sobreesfuerzos</li>
              </ul>
            </td>
            <td>
              <ul className="risk-list">
                <li>Brazos y manos</li>
                <li>Ojos y cara</li>
                <li>Extremidades inferiores</li>
                <li>Tronco</li>
              </ul>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td className="footer-header" colSpan="4">Observaciones:</td>
            <td colSpan="4">Contar con un procedimiento seguro de trabajo, Puede causar dolores musculares. Hacer buen uso de la herramienta</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ToolEvaluationTable;
