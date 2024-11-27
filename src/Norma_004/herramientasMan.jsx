import React, { useState, useCallback } from 'react';
import './HerramientasMan.css';
import html2canvas from 'html2canvas';

import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Importar la configuración de Firebase
import logo from '../logos/logo.png'; // Importar el logo

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
    energia: ['Eléctrica', 'Manual', 'Mecánica', 'Hidráulica', 'Eólica', 'Termica por combustion']
  };

  const partesPorPeligro = {
    "Golpes y cortes en manos ocasionados por las propias herramientas durante el trabajo normal con las mismas": ["Brazos y manos", "Dedos"],
    "Lesiones oculares por partículas provenientes de los objetos que se trabajan y/o de la propia herramienta": ["Ojos y cara"],
    "Golpes en diferentes partes del cuerpo por despido de la propia herramienta o del material trabajado": ["Cabeza y oídos", "Tronco", "Brazos y manos", "Extremidades inferiores"],
    "Esguince por sobreesfuerzos o gestos violentos": ["Tronco", "Extremidades inferiores"]
  };

  const listaEPP = [
    "Anteojos de protección",
    "Bata",
    "Botas impermeables",
    "Calzado conductivo",
    "Calzado contra impacto",
    "Calzado contra sustancias químicas",
    "Calzado dieléctrico",
    "Calzado ocupacional",
    "Careta para soldador",
    "Capuchas",
    "Casco contra impacto",
    "Casco dieléctrico",
    "Conchas acústicas",
    "Equipo de protección contra caídas de altura",
    "Equipo de respiración autónomo",
    "Equipo para brigadista contra incendio",
    "Goggles",
    "Guantes",
    "Guantes contra sustancias químicas",
    "Guantes contra temperaturas extremas",
    "Guantes dieléctricos",
    "Mandil contra altas temperaturas",
    "Mandil contra sustancias químicas",
    "Mangas",
    "Mascarilla desechable",
    "Overol",
    "Pantalla facial",
    "Polainas",
    "Ropa contra sustancias peligrosas",
    "Respirador contra gases y vapores",
    "Respirador contra partículas"
  ];
  

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

  const [consequence, setConsequence] = useState(1);
  const [exposure, setExposure] = useState(1);
  const [probability, setProbability] = useState(1);

  const handleConsequenceChange = (e) => setConsequence(parseFloat(e.target.value));
  const handleExposureChange = (e) => setExposure(parseFloat(e.target.value));
  const handleProbabilityChange = (e) => setProbability(parseFloat(e.target.value));

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

  const calcularMagnitudRiesgo = () => {
    const valorConsecuencia = consequence;
    const valorExposicion = exposure;
    const valorProbabilidad = probability;
    return Math.floor(valorConsecuencia * valorExposicion * valorProbabilidad);
  };

  const obtenerClasificacionRiesgo = (magnitud) => {
    if (magnitud > 400) {
      return { color: 'red', texto: 'Muy Alto: Detención inmediata', accion: 'Inmediata', clasificacion: 'Muy Alto' };
    } else if (magnitud > 200) {
      return { color: 'orange', texto: 'Alto: Corrección inmediata', accion: 'Urgente', clasificacion: 'Alto' };
    } else if (magnitud > 70) {
      return { color: 'yellow', texto: 'Notable: Corrección urgente', accion: 'Programada', clasificacion: 'Notable' };
    } else if (magnitud > 20) {
      return { color: 'green', texto: 'Moderado: Debe corregirse', accion: 'Programada', clasificacion: 'Moderado' };
    } else {
      return { color: 'blue', texto: 'Bajo o Aceptable: Tolerable', accion: 'Sin acción requerida', clasificacion: 'Bajo' };
    }
  };

  const obtenerColorPorRiesgo = (magnitud) => {
    const clasificacion = obtenerClasificacionRiesgo(magnitud);
    return clasificacion.color;
  };

  const magnitudRiesgo = calcularMagnitudRiesgo();
  const { color, accion, clasificacion } = obtenerClasificacionRiesgo(magnitudRiesgo);

  const downloadImage = () => {
    // Seleccionar el contenedor con el ID 'pdf-content'
    const input = document.getElementById('pdf-content');

    if (input) {
      // Configurar html2canvas para capturar el contenido como imagen
      html2canvas(input, { scale: 2, useCORS: true, backgroundColor: '#fff' })
        .then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = imgData;
          link.download = 'tabla_herramientas_manual.png'; // Nombre de la imagen
          
          // Crear el enlace para descargar la imagen
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error('Error al generar la imagen:', error);
        });
    } else {
      console.error('No se encontró el elemento para capturar la imagen.');
    }
  };


   const renderOptions = (options) => {
    return options.map((option) => (
      <option key={option} value={option}>{option}</option>
    ));
  };

  return (
    <div className="risk-table-container">
      <div id="pdf-content" className="risk-table-wrapper">
        <div className="risk-table" style={{ width: '100%', fontSize: '1.1em' }}>
          <div className="logo-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src={logo} alt="SIACH Logo" style={{ width: '150px' }} />
          </div>
          <table className="main-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th colSpan="2" className="nombre-maquinaria">Nombre de la maquinaria o equipo:</th>
                <th colSpan="3">
                  <textarea className="nombre-maquinaria" placeholder="Nombre de la maquinaria" name='textarea' rows="1" cols={30}></textarea>
                </th>
                <th colSpan="1" className="energia-utilizada">Energía utilizada:</th>
                <th colSpan="2">
                  <select className="energia-utilizada" value={state.energiaUtilizada} onChange={(e) => handleChange('energiaUtilizada', e.target.value)} style={{ width: '100%' }}>
                    {renderOptions(opciones.energia)}
                  </select>
                </th>
                <th colSpan="2" className="tiempo-exposicion">Tiempo de exposición:</th>
                <th colSpan="3">
                  <select className="tiempo-exposicion" value={state.tiempoExposicion} onChange={(e) => handleChange('tiempoExposicion', e.target.value)} style={{ width: '100%' }}>
                    {renderOptions(opciones.tiempoExposicion)}
                  </select>
                </th>
              </tr>
              <tr>
                <th colSpan="2" className="descripcion-maquinaria">Descripción de la maquinaria o equipo:</th>
                <th colSpan="3">
                  <textarea className="descripcion-maquinaria"
                    value={state.maquinariaDescripcion}
                    onChange={(e) => handleChange('maquinariaDescripcion', e.target.value)}
                    placeholder="Describa la maquinaria o equipo"
                    cols={30}
                  />
                </th>
                <th colSpan="1" className="area">Área:</th>
                <th colSpan="1">
                  <input className="area" type="text" placeholder="Escriba el área" style={{ width: '100%' }} /></th>
                <th colSpan="3" className="poe">POE </th>
                <th colSpan="3">
                  <input className="poe" type="text" placeholder="Escriba el POE" style={{ width: '100%' }} /></th>
              </tr>
              <tr>
                <th colSpan="3">Localización esquemática de los riesgos en la maquinaria y/o equipo:</th>
                

              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="3" rowSpan="2">
                  <div className="image-section">
                    <table className="image-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          <td style={{ border: '1px solid #ccc', padding: '10px', textAlign: 'center' }}>
                            <input type="file" accept="image/*" onChange={handleImageChange} />
                            {state.errorMessage && <p style={{ color: 'red' }}>{state.errorMessage}</p>}
                            {state.imagePreview ? (
                              <img src={state.imagePreview} alt="Maquinaria" className="image-preview" style={{ width: '100%', height: 'auto' }} />
                            ) : (
                              <p>No hay imagen seleccionada</p>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
                <td colSpan="8" className="right-aligned">
                  <div className="text1">Evaluación de riesgo de trabajo</div>
                    <table className="inner-table" style={{ width: '100%' }}>
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
                          <td colSpan="1">
                            <select value={consequence} onChange={handleConsequenceChange} style={{ width: '100%' }}>
                              <option value={100}>Catástrofe</option>
                              <option value={50}>Varias muertes</option>
                              <option value={25}>Muerte</option>
                              <option value={15}>Lesiones graves</option>
                              <option value={5}>Lesiones con baja</option>
                              <option value={1}>Lesiones sin baja</option>
                            </select>
                            <div>Valor: {consequence}</div>
                          </td>
                          <td>
                            <select value={exposure} onChange={handleExposureChange} style={{ width: '100%' }}>
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
                            <select value={probability} onChange={handleProbabilityChange} style={{ width: '100%' }}>
                              <option value={10}>Es el resultado más probable y esperado</option>
                              <option value={6}>Es completamente posible, no será nada extraño</option>
                              <option value={3}>Sería una secuencia o coincidencia rara pero posible, ha ocurrido</option>
                              <option value={1}>Coincidencia muy rara, pero se sabe que ha ocurrido</option>
                              <option value={0.5}>Coincidencia extremadamente remota pero concebible</option>
                              <option value={0.1}>Coincidencia prácticamente imposible, jamás ha ocurrido</option>
                            </select>
                            <div>Valor: {probability}</div>
                          </td>
                          <td style={{ backgroundColor: obtenerColorPorRiesgo(magnitudRiesgo) }}>
                            {magnitudRiesgo.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                 
              </tr>
              
  <td colSpan="8" style={{ backgroundColor: color, color: 'black', textAlign: 'center', padding: '1px' }}>
    <div style={{ fontSize: '14px' }}>Clasificación de magnitud de riesgo</div>
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '1px', fontSize: '12px' }}>
      <div>Magnitud del Riesgo: {magnitudRiesgo}</div>
      <div>Clasificación: {clasificacion}</div>
      <div>Acción: {accion}</div>
    </div>
  </td>

              
              <tr>
                <td colSpan="2">
                  <table className="main-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th colSpan="6">Identificaciones de Riesgos:</th>
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
                        <span style={{ marginLeft: "1px" }}>{peligro}</span>
                      </div>
                    ))}
                  
                    </tbody>
                  </table>
                </td>
                <td colSpan="4">
                  <table className="risk-body-table" style={{ width: '100%' }}>
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
                <td colSpan="5">
                    <table className="epp-table" style={{ width: '100%' }}>
                      <thead>
                        <tr>
                          <th>Equipo de Protección Personal sugerido:</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...Array(6)].map((_, index) => ( // 4 filas con select vacíos inicialmente
                          <tr key={index}>
                            <td>
                              <select defaultValue="" style={{ width: '100%' }}>
                                <option value="" disabled>
                                  Seleccione un EPP
                                </option>
                                {listaEPP.map((epp, i) => (
                                  <option key={i} value={epp}>{epp}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>

                </tr>

              <tr>
                <td colSpan="11">
                  <div>
                    <label htmlFor="observaciones">Observaciones:</label>
                    <textarea
                      id="observaciones"
                      value={state.observacionesGenerales}
                      onChange={(e) => handleChange('observacionesGenerales', e.target.value)}
                      placeholder="Agregar observaciones generales aquí"
                      rows="2" cols={150}
                      style={{ width: '100%' }}
                    />
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
      <button onClick={downloadImage} className="download-button">
        Descargar Imagen
      </button>
    </div>
  );
};

export default RiskTable;
