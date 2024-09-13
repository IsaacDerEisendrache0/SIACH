import React, { useState } from 'react';
import './Table.css';

const RiskAssessmentTable = () => {
  // Lista de peligros con estado para cada uno
  const [hazards, setHazards] = useState({
    'Caídas de Altura': false,
    'Exposición a Temperaturas': false,
    'Exposición a Electricidad Estática': false,
    'Exposición a Sustancias Químicas': false,
    'Exposición a Radiaciones': false,
    'Exposición agentes Biológicos': false,
    'Exposición a Ruido': false,
    'Exposición a Vibraciones': false,
    'Superficies cortantes': false,
    'Caídas a nivel o desnivel': false,
    'Daños Ergonómicos': false,
    'Calentamiento de materia prima, subproducto o producto': false,
    'Proyección de material o herramienta': false,
    'Mantenimiento preventivo, correctivo o predictivo': false,
  });

  // Maneja el cambio en las casillas de verificación
  const handleCheckboxChange = (event) => {
    setHazards({
      ...hazards,
      [event.target.name]: event.target.checked
    });
  };

  return (
    <table className="risk-table">
      <thead>
        <tr>
          <td className="header" colSpan="7">
            <div className="header-section">
              <div>Puesto de trabajo: Dosificador de micros</div>
              <div>Descripción de la actividad: Preparación de microfórmulas, pesaje y mezclado de vitaminas, minerales y aditivos.</div>
            </div>
          </td>
        </tr>
        <tr>
          <td className="header" colSpan="4">
            <div className="left-column">
              <div className="sub-header">Principales partes del cuerpo expuestas al riesgo:</div>
              <div className="risk-item">Cabeza y Oídos: <span className="risk-mark">X</span></div>
              <div className="risk-item">Ojos y Cara: <span className="risk-mark">X</span></div>
              <div className="risk-item">Brazos y Manos: <span className="risk-mark">X</span></div>
              <div className="risk-item">Tronco: <span className="risk-mark">X</span></div>
              <div className="risk-item">Sistema respiratorio: <span className="risk-mark">X</span></div>
              <div className="risk-item">Extremidades inferiores: <span className="risk-mark">X</span></div>
            </div>
          </td>
          <td className="header" colSpan="3">
            <div className="right-column">
              <div>Área: <input type="text" defaultValue="Producción" /></div>
              <div>Fecha de inspección: <input type="date" defaultValue="2023-09-13" /></div>
              <div>Tiempo de exposición: <input type="text" defaultValue="8hrs" /></div>
            </div>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan="7" className="separator-line" />
        </tr>
        <tr>
          <td colSpan="4" className="left-section">
            <div className="sub-header">Identificación de peligros</div>
            <ul className="hazard-list">
              {Object.keys(hazards).map(hazard => (
                <li key={hazard} className="hazard-item">
                  {hazard}
                  <label className="hazard-checkbox">
                    <input
                      type="checkbox"
                      name={hazard}
                      checked={hazards[hazard]}
                      onChange={handleCheckboxChange}
                    />
                  </label>
                </li>
              ))}
            </ul>
          </td>
          <td colSpan="3" className="right-section">
            <div className="sub-header">Equipo de protección personal sugerido</div>
            <div className="section-content">[Espacio en blanco para futuras adiciones]</div>
          </td>
        </tr>
        <tr>
          <td colSpan="7" className="separator-line" />
        </tr>
        <tr>
          <td colSpan="4">
            <table className="inner-table">
              <thead>
                <tr>
                  <th colSpan="3">Evaluación de riesgo de trabajo</th>
                </tr>
                <tr>
                  <th>Consecuencia</th>
                  <th>Exposición</th>
                  <th>Probabilidad</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lesiones sin baja</td>
                  <td>Continuamente</td>
                  <td>Coincidencia extremadamente remota pero concebible</td>
                </tr>
                <tr>
                  <td>1</td>
                  <td>10</td>
                  <td>0.5</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td colSpan="3">
            <table className="inner-table">
              <thead>
                <tr>
                  <th colSpan="2">Clasificación de Magnitud de Riesgo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Magnitud del Riesgo:</td>
                  <td>5</td>
                </tr>
                <tr>
                  <td>Clasificación:</td>
                  <td>Bajo o Aceptable</td>
                </tr>
                <tr>
                  <td>Acción:</td>
                  <td>Tolerable</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default RiskAssessmentTable;
