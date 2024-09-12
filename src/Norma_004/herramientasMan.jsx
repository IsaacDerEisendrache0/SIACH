import React, { useState, useEffect } from 'react';
import './Table04.css'; // Archivo CSS para estilos

const ToolEvaluationTable = () => {
  // Opciones del menú desplegable para cada campo
  const opcionesConsecuencia = ['Catástrofe', 'Varias muertes', 'Muerte', 'Lesiones graves', 'Lesiones con baja', 'Lesiones sin baja'];
  const opcionesExposicion = ['Continuamente', 'Frecuentemente', 'Ocasionalmente', 'Irregularmente', 'Raramente'];
  
  // Nuevas opciones de "Probabilidad"
  const opcionesProbabilidad = [
    'Es el resultado más probable y esperado',
    'Es completamente posible, no será nada extraño',
    'Sería una secuencia o coincidencia rara pero posible, ha ocurrido',
    'Coincidencia muy rara, pero se sabe que ha ocurrido',
    'Coincidencia extremadamente remota pero concebible',
    'Coincidencia prácticamente imposible, jamás ha ocurrido'
  ];

  // Estado para cada campo
  const [consecuencia, setConsecuencia] = useState('Lesiones con baja');
  const [exposicion, setExposicion] = useState('Irregularmente');
  const [probabilidad, setProbabilidad] = useState('Coincidencia muy rara, pero se sabe que ha ocurrido');
  const [magnitudRiesgo, setMagnitudRiesgo] = useState(0);
  const [clasificacion, setClasificacion] = useState('Bajo o Aceptable');
  const [accion, setAccion] = useState('Tolerable');
  const [color, setColor] = useState('blue'); // Estado para el color, por defecto azul para lo más bajo

  // Función para calcular la Magnitud del Riesgo, Clasificación y Acción
  const calcularRiesgo = () => {
    const valoresRiesgo = {
      'Catástrofe': 25,
      'Varias muertes': 20,
      'Muerte': 15,
      'Lesiones graves': 10,
      'Lesiones con baja': 5,
      'Lesiones sin baja': 2,
    };
    const valoresExposicion = {
      'Continuamente': 5,
      'Frecuentemente': 4,
      'Ocasionalmente': 3,
      'Irregularmente': 2,
      'Raramente': 1,
    };
    
    // Asignación de valores a las nuevas opciones de probabilidad
    const valoresProbabilidad = {
      'Es el resultado más probable y esperado': 5,
      'Es completamente posible, no será nada extraño': 4,
      'Sería una secuencia o coincidencia rara pero posible, ha ocurrido': 3,
      'Coincidencia muy rara, pero se sabe que ha ocurrido': 2,
      'Coincidencia extremadamente remota pero concebible': 1,
      'Coincidencia prácticamente imposible, jamás ha ocurrido': 0.5,
    };

    const magnitud = valoresRiesgo[consecuencia] * valoresExposicion[exposicion] * valoresProbabilidad[probabilidad];

    let clasificacionRiesgo;
    let accionRecomendada;
    let colorRiesgo;
    if (magnitud >= 50) {
      clasificacionRiesgo = 'Crítico o Alto';
      accionRecomendada = 'Corrección inmediata o urgente';
      colorRiesgo = 'red'; // Rojo para lo más alto
    } else if (magnitud >= 25) {
      clasificacionRiesgo = 'Moderado';
      accionRecomendada = 'Debe corregirse';
      colorRiesgo = 'yellow'; // Amarillo para riesgos moderados
    } else {
      clasificacionRiesgo = 'Bajo o Aceptable';
      accionRecomendada = 'Tolerable';
      colorRiesgo = 'blue'; // Azul para riesgos bajos
    }

    setMagnitudRiesgo(magnitud);
    setClasificacion(clasificacionRiesgo);
    setAccion(accionRecomendada);
    setColor(colorRiesgo);
  };

  // Calcular el riesgo cada vez que cambien las opciones
  useEffect(() => {
    calcularRiesgo();
  }, [consecuencia, exposicion, probabilidad]);

  return (
    <div className="table-container">
      <table className="evaluation-table">
        <thead>
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
            <td className="image-cell" rowSpan="8">imagen</td>
            <td className="header" colSpan="3">Evaluación de riesgo de trabajo</td>
            <td className="header" colSpan="4">Equipo de Protección Personal sugerido</td>
          </tr>
          <tr>
            <td className="sub-header">Consecuencia</td>
            <td className="sub-header">Exposición</td>
            <td className="sub-header">Probabilidad</td>
            <td rowSpan="6" className="protection-cell" colSpan="4">
              Guantes, Calzado contra impacto, Casco contra impacto, Overol
            </td>
          </tr>
          <tr>
            <td>
              <select value={consecuencia} onChange={(e) => setConsecuencia(e.target.value)}>
                {opcionesConsecuencia.map(opcion => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </td>
            <td>
              <select value={exposicion} onChange={(e) => setExposicion(e.target.value)}>
                {opcionesExposicion.map(opcion => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </td>
            <td>
              <select value={probabilidad} onChange={(e) => setProbabilidad(e.target.value)}>
                {opcionesProbabilidad.map(opcion => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td colSpan="3" className="header">Clasificación de Magnitud de Riesgo</td>
          </tr>
          <tr style={{ backgroundColor: color }}>
            <td colSpan="3">Magnitud del Riesgo: {magnitudRiesgo}</td>
          </tr>
          <tr style={{ backgroundColor: color }}>
            <td colSpan="3">Clasificación: {clasificacion}</td>
          </tr>
          <tr style={{ backgroundColor: color }}>
            <td colSpan="3">Acción: {accion}</td>
          </tr>
          <tr>
            <td className="header" colSpan="3">Identificaciones de Riesgos:</td>
            <td className="header" colSpan="5">Principales partes del cuerpo expuestas al riesgo:</td>
          </tr>
          <tr>
            <td colSpan="4">
              <ul className="risk-list">
                <li>Golpes y cortes en manos</li>
                <li>Lesiones oculares por partículas</li>
                <li>Golpes en diferentes partes del cuerpo</li>
                <li>Esguinces por sobreesfuerzos</li>
              </ul>
            </td>

          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td className="footer-header" colSpan="4">Observaciones:</td>
            <td colSpan="4">Contar con un procedimiento seguro de trabajo, puede causar dolores musculares. Hacer buen uso de la herramienta</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ToolEvaluationTable
