import React, { useState, useMemo, useCallback } from 'react';
import './HerramientasMan.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const RiskTable = () => {
  const opciones = {
    consecuencia: ['Catástrofe', 'Varias muertes', 'Muerte', 'Lesiones graves', 'Lesiones con baja', 'Lesiones sin baja'],
    exposicion: ['Continuamente', 'Frecuentemente', 'Ocasionalmente', 'Irregularmente', 'Raramente'],
    probabilidad: [
      'Es el resultado más probable y esperado',
      'Es completamente posible, no será nada extraño',
      'Sería una secuencia o coincidencia rara pero posible, ha ocurrido',
      'Coincidencia muy rara, pero se sabe que ha ocurrido',
      'Coincidencia extremadamente remota pero concebible',
      'Coincidencia prácticamente imposible, jamás ha ocurrido'
    ],
    tiempoExposicion: ['0-2 hrs', '2-4 hrs', '4-8 hrs', '8+ hrs'],
    energia: ['Eléctrica', 'Manual', 'Mecánica', 'Hidráulica', 'Eólica']
  };

  const partesPorPeligro = {
    "Golpes y cortes en manos ocasionados por las propias herramientas durante el trabajo normal con las mismas": ["Brazos y manos", "Dedos"],
    "Lesiones oculares por partículas provenientes de los objetos que se trabajan y/o de la propia herramienta": ["Ojos y cara"],
    "Golpes en diferentes partes del cuerpo por despido de la propia herramienta o del material trabajado": ["Cabeza y oídos", "Tronco", "Brazos y manos", "Extremidades inferiores"],
    "Esguince por sobreesfuerzos o gestos violentos": ["Tronco", "Extremidades inferiores"]
  };
  

  const [selectedPeligros, setSelectedPeligros] = useState([]);
const [affectedBodyParts, setAffectedBodyParts] = useState([]);

const handlePeligroChange = (peligro) => {
  const isSelected = selectedPeligros.includes(peligro);

  let newSelectedPeligros = [];
  let newAffectedParts = [];

  if (isSelected) {
    // Deseleccionar peligro y eliminar partes del cuerpo asociadas
    newSelectedPeligros = selectedPeligros.filter(item => item !== peligro);
    newAffectedParts = affectedBodyParts.filter(part => !partesPorPeligro[peligro].includes(part));
  } else {
    // Seleccionar peligro y agregar partes del cuerpo asociadas
    newSelectedPeligros = [...selectedPeligros, peligro];
    newAffectedParts = [...new Set([...affectedBodyParts, ...partesPorPeligro[peligro]])];
  }

  setSelectedPeligros(newSelectedPeligros);
  setAffectedBodyParts(newAffectedParts);
};

  
  const [state, setState] = useState({
    consequence: 'Lesiones sin baja',
    exposure: 'Ocasionalmente',
    probability: 'Coincidencia extremadamente remota pero concebible',
    tiempoExposicion: '4-8 hrs',
    energiaUtilizada: 'Eléctrica',
    observacionesGenerales: '',
    maquinariaDescripcion: '',
    imagePreview: null,
    errorMessage: ''
  });

  const handleChange = useCallback((field, value) => {
    setState(prevState => ({ ...prevState, [field]: value }));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => handleChange('imagePreview', reader.result);
      reader.readAsDataURL(file);
    } else {
      handleChange('errorMessage', 'Formato de archivo no válido');
    }
  };

  const valores = useMemo(() => ({
    consecuencia: { 'Catástrofe': 50, 'Varias muertes': 25, 'Muerte': 15, 'Lesiones graves': 10, 'Lesiones con baja': 5, 'Lesiones sin baja': 1 },
    exposicion: { 'Continuamente': 10, 'Frecuentemente': 6, 'Ocasionalmente': 3, 'Irregularmente': 2, 'Raramente': 1 },
    probabilidad: {
      'Es el resultado más probable y esperado': 10,
      'Es completamente posible, no será nada extraño': 6,
      'Sería una secuencia o coincidencia rara pero posible, ha ocurrido': 3,
      'Coincidencia muy rara, pero se sabe que ha ocurrido': 2,
      'Coincidencia extremadamente remota pero concebible': 1,
      'Coincidencia prácticamente imposible, jamás ha ocurrido': 0.5
    }
  }), []);

  const calcularMagnitudRiesgo = useMemo(() => {
    const magnitud = valores.consecuencia[state.consequence] * valores.exposicion[state.exposure] * valores.probabilidad[state.probability];
    return Math.floor(magnitud);
  }, [state, valores]);

  const obtenerColorPorRiesgo = (magnitude) => {
    if (magnitude >= 500) return 'red';
    if (magnitude >= 100) return 'orange';
    if (magnitude >= 50) return 'yellow';
    if (magnitude >= 10) return 'green';
    return 'lightgreen';
  };

  const calculateRisk = () => {
    return consequence * exposure * probability;
  };

  const { color, texto, accion, clasificacion } = obtenerColorPorRiesgo(calcularMagnitudRiesgo);
  const [consequence, setConsequence] = useState(10);
  const [exposure, setExposure] = useState(10);
  const [probability, setProbability] = useState(10);

  const handleConsequenceChange = (e) => setConsequence(parseFloat(e.target.value));
  const handleExposureChange = (e) => setExposure(parseFloat(e.target.value));
  const handleProbabilityChange = (e) => setProbability(parseFloat(e.target.value));


  const downloadPDF = () => {
    const input = document.getElementById('pdf-content');
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('reporte.pdf');
    });
  };

  const renderOptions = (options, field) => (
    options.map(option => (
      <option key={option} value={option}>{option}</option>
    ))
  );


  

  return (
    <div>
      <div id="pdf-content" className="risk-table">
        <table className="main-table">
          <thead>
            <tr>
              <th colSpan="3">Nombre de la maquinaria o equipo:</th>
              <th colSpan="2">
                <textarea placeholder="Nombre de la maquinaria"></textarea>
              </th>
              <th colSpan="3">Energía utilizada:</th>
              <th colSpan="2">
                <select value={state.energiaUtilizada} onChange={(e) => handleChange('energiaUtilizada', e.target.value)}>
                  {renderOptions(opciones.energia)}
                </select>
              </th>
            </tr>
            <tr>
              <th colSpan="2">Descripción de la maquinaria o equipo:</th>
              <th colSpan="2">
                <textarea
                  value={state.maquinariaDescripcion}
                  onChange={(e) => handleChange('maquinariaDescripcion', e.target.value)}
                  placeholder="Describa la maquinaria o equipo"
                />
              </th>
              <th colSpan="4">Área:</th>
              <th><input type="text" placeholder="Escriba el área" /></th>
            </tr>
            <tr > 
              <th colSpan="3">Localización esquemática de los riesgos en la maquinaria y/o equipo</th>
              <th colSpan="2"><input type="text" placeholder="Escriba el POE" /></th>
              <th colSpan="3">Tiempo de exposición:</th>
              <th>
                <select value={state.tiempoExposicion} onChange={(e) => handleChange('tiempoExposicion', e.target.value)}>
                  {renderOptions(opciones.tiempoExposicion)}
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan="2" colSpan="3">
                <div className="image-section">
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {state.errorMessage && <p style={{ color: 'red' }}>{state.errorMessage}</p>}
                  {state.imagePreview ? (
                    <img src={state.imagePreview} alt="Maquinaria" className="image-preview" />
                  ) : (
                    <p>No hay imagen seleccionada</p>
                  )}
                </div>
              </td>
              
              <td colSpan="5" className="right-aligned">
                <div className="text1">Evaluación de riesgo de trabajo</div>
                  <table className="inner-table">
                    <thead>
                      <tr>
                        <th>Consecuencia</th>
                        <th style={{ backgroundColor: 'red' }}>Exposición</th>
                        <th>Probabilidad</th>
                        <th>Magnitud del Riesgo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <select value={consequence} onChange={handleConsequenceChange}>
                            <option value={50}>Catástrofe</option>
                            <option value={25}>Varias muertes</option>
                            <option value={15}>Muerte</option>
                            <option value={10}>Lesiones graves</option>
                            <option value={5}>Lesiones con baja</option>
                            <option value={1}>Lesiones sin baja</option>
                          </select>
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
                          <div>Valor: {probability}</div>
                        </td>
                        <td style={{ backgroundColor: obtenerColorPorRiesgo(calculateRisk()) }}>
                          {calculateRisk().toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              <td colSpan="3">
                <table className="epp-table">
                  <thead><tr><th>Equipo de Protección Personal sugerido:</th></tr></thead>
                  <tbody>
                    <tr><td>Anteojos de protección</td></tr>
                    <tr><td>Calzado conductivo</td></tr>
                    <tr><td>Overol</td></tr>
                    <tr><td>Calzado contra impacto</td></tr>
                  </tbody>
                </table>
              </td>
            </tr>          
            <tr>
              <td colSpan="5  ">
                <table className="main-table">
                  <thead>
                    <tr>
                      <th colSpan="3">Identificaciones de Riesgos:</th>
                    </tr>
                  </thead>
                  <tbody>
                  {Object.keys(partesPorPeligro).map((peligro, index) => (
  <div key={index} style={{ display: "flex", alignItems: "center" }}>
    <input 
      type="checkbox" 
      checked={selectedPeligros.includes(peligro)} 
      onChange={() => handlePeligroChange(peligro)}
    />
    <span style={{ marginLeft: "8px" }}>{peligro}</span>
  </div>
))}


                  </tbody>
                </table>
              </td>
              <td colSpan="1">
  <table className="risk-body-table">
    <thead>
      <tr>
        <th>Principales partes del cuerpo expuestas al riesgo:</th>
      </tr>
    </thead>
    <tbody>
      {affectedBodyParts.length > 0 ? (
        affectedBodyParts.map((part, index) => (
          <tr key={index}>
            <td>{part}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td>No hay partes del cuerpo seleccionadas</td>
        </tr>
      )}
    </tbody>
  </table>
</td>

</tr>

            <tr>
              <td colSpan="9">
                <div className="observations-section">
                  <label htmlFor="observaciones">Observaciones:</label>
                  <textarea
                    id="observaciones"
                    value={state.observacionesGenerales}
                    onChange={(e) => handleChange('observacionesGenerales', e.target.value)}
                    placeholder="Agregar observaciones generales aquí"
                    rows="2"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button onClick={downloadPDF} className="download-button">Descargar</button>
    </div>
  );
};

export default RiskTable;
