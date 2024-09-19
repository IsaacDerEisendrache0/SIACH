import React, { useState } from 'react';
import './Table17.css';

const RiskAssessmentTable = () => {
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

  const bodyParts = {
    'Caídas de Altura': ['Cabeza y Oídos', 'Brazos y Manos', 'Tronco', 'Extremidades inferiores'],
    'Exposición a Temperaturas': ['Ojos y Cara', 'Brazos y Manos', 'Tronco'],
    'Exposición a Electricidad Estática': ['Brazos y Manos', 'Tronco'],
    'Exposición a Sustancias Químicas': ['Cabeza y Oídos', 'Ojos y Cara', 'Brazos y Manos', 'Tronco', 'Sistema respiratorio', 'Extremidades inferiores'],
    'Exposición a Radiaciones': ['Cabeza y Oídos', 'Ojos y Cara', 'Tronco', 'Extremidades inferiores'],
    'Exposición agentes Biológicos': ['Ojos y Cara', 'Tronco', 'Sistema respiratorio', 'Extremidades inferiores'],
    'Exposición a Ruido': ['Cabeza y Oídos'],
    'Exposición a Vibraciones': ['Brazos y Manos', 'Tronco', 'Extremidades inferiores'],
    'Superficies cortantes': ['Ojos y Cara', 'Brazos y Manos', 'Extremidades inferiores'],
    'Caídas a nivel o desnivel': ['Cabeza y Oídos', 'Ojos y Cara', 'Brazos y Manos', 'Tronco', 'Extremidades inferiores'],
    'Daños Ergonómicos': ['Brazos y Manos', 'Tronco', 'Extremidades inferiores'],
    'Calentamiento de materia prima, subproducto o producto': ['Ojos y Cara', 'Brazos y Manos', 'Tronco', 'Extremidades inferiores'],
    'Proyección de material o herramienta': ['Ojos y Cara', 'Brazos y Manos', 'Tronco'],
    'Mantenimiento preventivo, correctivo o predictivo': ['Ojos y Cara', 'Brazos y Manos', 'Tronco'],
  };

  const protectionImages = {
    'Caídas de Altura': ['/images/10.png', '/images/34.png'], // Reemplaza con la ruta real de la imagen
    'Exposición a Temperaturas': ['/images/6.png'],
    'Exposición a Electricidad Estática': ['/images/6.png', '/images/4.png'],
    'Exposición a Sustancias Químicas': ['/images/7.png', '/images/13.png', '/images/6.png', '/images/17.png'],
    'Exposición a Radiaciones': ['/images/16.png'], 
    'Exposición agentes Biológicos': ['/images/18.png', '/images/16.png'], 
    'Exposición a Ruido': ['/images/19.png', '/images/5.png'],
    'Exposición a Vibraciones': ['/images/14.png', '/images/4.png'],
    'Superficies cortantes': ['/images/6.png', '/images/1.png', '/images/21.png'],
    'Caídas a nivel o desnivel':  ['/images/4.png'],
    'Daños Ergonómicos':  ['/images/15.png'],
    'Calentamiento de materia prima, subproducto o producto':  ['/images/6.png', '/images/15.png'],
    'Proyección de material o herramienta':  ['/images/7.png', '/images/12.png'],
    'Mantenimiento preventivo, correctivo o predictivo':  ['/images/12.png', '/images/3.png'],
  };

  const handleCheckboxChange = (event) => {
    const hazard = event.target.name;
    setHazards({
      ...hazards,
      [hazard]: event.target.checked
    });
  };

  const getAffectedBodyParts = () => {
    const affectedParts = new Set();
    for (const [hazard, isChecked] of Object.entries(hazards)) {
      if (isChecked) {
        bodyParts[hazard].forEach(part => affectedParts.add(part));
      }
    }
    return Array.from(affectedParts);
  };

  const affectedBodyParts = getAffectedBodyParts();

  // Estados para los valores de Consecuencia, Exposición y Probabilidad
  const [consequence, setConsequence] = useState(1);
  const [exposure, setExposure] = useState(1);
  const [probability, setProbability] = useState(0.1);

  // Función para calcular el riesgo total
  const calculateRisk = () => {
    const risk = consequence * exposure * probability;
    console.log('Risk:', risk); // Añade esto para ver el valor del riesgo en la consola
    return risk;
  };

  const getSelectedHazardImages = () => {
    const selectedHazards = Object.keys(hazards).filter(hazard => hazards[hazard]);
    const uniqueImages = new Set();
    selectedHazards.forEach(hazard => {
      protectionImages[hazard].forEach(image => uniqueImages.add(image));
    });
    return Array.from(uniqueImages);
  };
  
  const selectedImages = getSelectedHazardImages();
  
  
  

  // Función para obtener el color basado en el riesgo
  const getRiskColor = (risk) => {
    if (risk > 400) return 'red'; // Muy Alto
    if (risk > 200) return 'orange'; // Alto
    if (risk > 70) return 'yellow'; // Notable
    if (risk > 20) return 'green'; // Moderado
    return 'blue'; // Bajo o Aceptable
  };
  

  // Manejadores de cambio para los selectores
  const handleConsequenceChange = (event) => setConsequence(Number(event.target.value));
  const handleExposureChange = (event) => setExposure(Number(event.target.value));
  const handleProbabilityChange = (event) => setProbability(Number(event.target.value));

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const [selectedOption, setSelectedOption] = useState('');

  const optionImages = {
    option1: '/body/lvl1_head.png',
    option2: '/body/lvl1_mid.png',
    option3: '/body/lvl1_foot.png',
    option4: '/body/lvl1_hand.png',
    option5: '/body/lvl2_headmid.png',
    option6: '/body/lvl2_handfoot.png',
    option7: '/body/lvl2_headfoot.png',
    option8: '/body/lvl2_headhand.png',
    option9: '/body/lvl2_headmid.png',
    option10: '/body/lvl2_midhand.png',
    option11: '/body/lvl3_all.png',

  };

  return (
    <table className="risk-table">
      <thead>
        <tr>
          <td className="no-border-cell" colSpan="7">
            <div className="full-width-cell">
              <div>Puesto de trabajo: Dosificador de micros</div>
              <div>Descripción de la actividad: Preparación de microfórmulas, pesaje y mezclado de vitaminas, minerales y aditivos.</div>
            </div>
          </td>
        </tr>
        <tr>
          <td className="header right-aligned" colSpan="4">
            <div className="left-column">
              <div className="sub-header">Principales partes del cuerpo expuestas al riesgo:</div>
              <div className="risk-item">Cabeza y Oídos: <span className="risk-mark">{affectedBodyParts.includes('Cabeza y Oídos') ? 'X' : ''}</span></div>
              <div className="risk-item">Ojos y Cara: <span className="risk-mark">{affectedBodyParts.includes('Ojos y Cara') ? 'X' : ''}</span></div>
              <div className="risk-item">Brazos y Manos: <span className="risk-mark">{affectedBodyParts.includes('Brazos y Manos') ? 'X' : ''}</span></div>
              <div className="risk-item">Tronco: <span className="risk-mark">{affectedBodyParts.includes('Tronco') ? 'X' : ''}</span></div>
              <div className="risk-item">Sistema respiratorio: <span className="risk-mark">{affectedBodyParts.includes('Sistema respiratorio') ? 'X' : ''}</span></div>
              <div className="risk-item">Extremidades inferiores: <span className="risk-mark">{affectedBodyParts.includes('Extremidades inferiores') ? 'X' : ''}</span></div>
            </div>
          </td>
          <td className="header right-aligned" colSpan="3">
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
          <td colSpan="4" className="left-section right-aligned">
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
          <td colSpan="3" className="right-section right-aligned">
            <div className="sub-header">Equipo de protección personal sugerido</div>
            <div className="section-content">
              <select value={selectedOption} onChange={handleOptionChange}>
                <option value="">Selecciona la extremidad afectada</option>
                <option value="option1">Cabeza</option>
                <option value="option2">Tronco</option>
                <option value="option3">Pies</option>
                <option value="option4">Brazos</option>
                <option value="option5">Cabeza y Tronco</option>
                <option value="option6">Brazos y Pies</option>
                <option value="option7">Cabeza y Pies</option>
                <option value="option8">Cabeza y Brazos</option>
                <option value="option9">Cabeza y Tronco</option>
                <option value="option10">Tronco y Brazos</option>
                <option value="option11">Todas las Extremidades</option>
              </select>
              {selectedOption && optionImages[selectedOption] && (
                <div className="protection-image-container">
                  <img
                    src={optionImages[selectedOption]} // Ruta de la imagen basada en el valor seleccionado
                    alt={`Equipo de protección para ${selectedOption}`}
                    className="protection-image"
                  />
                </div>
              )}
              {/* Mostrar las imágenes de protección seleccionadas */}
              {selectedImages.length > 0 && (
                <div className="protection-image-container">
                  {selectedImages.map((image, index) => (
                    <img key={index} src={image} alt={`Equipo de protección ${index}`} className="protection-image" />
                  ))}
                </div>
              )}
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan="7" className="separator-line" />
        </tr>
        <tr>
                <td colSpan="4" className="right-aligned">
          <div className="sub-header">Evaluación de riesgo de trabajo</div>
          <table className="inner-table">
            <thead>
              <tr>
                <th>Consecuencia</th>
                <th>Exposición</th>
                <th>Probabilidad</th>
                <th>Magnitud del Riesgo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <select value={consequence} onChange={handleConsequenceChange}>
                    <option value={10}>Catástrofe</option>
                    <option value={50}>Varias muertes</option>
                    <option value={25}>Muerte</option>
                    <option value={15}>Lesiones graves</option>
                    <option value={5}>Lesiones con baja</option>
                    <option value={1}>Lesiones sin baja</option>
                  </select>
                  {/* Mostrar el valor seleccionado de Consecuencia */}
                  <div>Valor: {consequence}</div>
                </td>
                <td>
                  <select value={exposure} onChange={handleExposureChange}>
                    <option value={10}>Continuamente</option>
                    <option value={6}>Frecuentemente</option>
                    <option value={3}>Ocasionalmente</option>
                    <option value={2}>Irregularmente</option>
                    <option value={1}>Raramente</option>
                    <option value={0.5}>Remotamente</option>
                  </select>
                  {/* Mostrar el valor seleccionado de Exposición */}
                  <div>Valor: {exposure}</div>
                </td>
                <td>
                  <select value={probability} onChange={handleProbabilityChange}>
                    <option value={10}>Es el resultado más probable y esperado</option>
                    <option value={6}>Es completamente posible, no será nada extraño</option>
                    <option value={3}>Sería una secuencia o coincidencia rara pero posible, ha ocurrido</option>
                    <option value={1}>Coincidencia muy rara, pero se sabe que ha ocurrido</option>
                    <option value={0.5}>Coincidencia extremadamente remota pero concebible</option>
                    <option value={0.1}>Coincidencia prácticamente imposible, jamás ha ocurrido</option>
                  </select>
                  {/* Mostrar el valor seleccionado de Probabilidad */}
                  <div>Valor: {probability}</div>
                </td>
                <td style={{ backgroundColor: getRiskColor(calculateRisk()) }}>
                  {calculateRisk().toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </td>
          <td colSpan="3" className="right-aligned">
            <div className="sub-header">Clasificación de Magnitud de Riesgo</div>
            <div className="risk-magnitude">
              Magnitud del Riesgo: {calculateRisk().toFixed(2)}
            </div>
            <div className="risk-classification">
              Clasificación: {calculateRisk() > 400 ? 'Muy Alto' : calculateRisk() > 200 ? 'Alto' : calculateRisk() > 70 ? 'Notable' : calculateRisk() > 20 ? 'Moderado' : 'Bajo o Aceptable'}
            </div>
            <div className="risk-action">
              Acción: {calculateRisk() > 400 ? 'Detención inmediata' : calculateRisk() > 200 ? 'Corrección inmediata' : calculateRisk() > 70 ? 'Corrección urgente' : calculateRisk() > 20 ? 'Debe corregirse' : 'Tolerable'}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
  
};

export default RiskAssessmentTable;