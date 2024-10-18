import React, { useState } from 'react';
import './HerramientasMan.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';



const RiskTable = () => {
  const opcionesConsecuencia = ['Catástrofe', 'Varias muertes', 'Muerte', 'Lesiones graves', 'Lesiones con baja', 'Lesiones sin baja'];
  const opcionesExposicion = ['Continuamente', 'Frecuentemente', 'Ocasionalmente', 'Irregularmente', 'Raramente'];
  const opcionesProbabilidad = [
    'Es el resultado más probable y esperado',
    'Es completamente posible, no será nada extraño',
    'Sería una secuencia o coincidencia rara pero posible, ha ocurrido',
    'Coincidencia muy rara, pero se sabe que ha ocurrido',
    'Coincidencia extremadamente remota pero concebible',
    'Coincidencia prácticamente imposible, jamás ha ocurrido'
  ];
  const opcionesTiempoExposicion = ['0-2 hrs', '2-4 hrs', '4-8 hrs', '8+ hrs'];
  const opcionesEnergia = ['Eléctrica', 'Manual', 'Mecánica', 'Hidráulica', 'Eólica'];
  const [consequence, setConsequence] = useState('Lesiones sin baja');
  const [exposure, setExposure] = useState('Ocasionalmente');
  const [probability, setProbability] = useState('Coincidencia extremadamente remota pero concebible');
  const [tiempoExposicion, setTiempoExposicion] = useState('4-8 hrs');
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [observacionesGenerales, setObservacionesGenerales] = useState('');
  const [maquinariaDescripcion, setMaquinariaDescripcion] = useState('');
  const [energiaUtilizada, setEnergiaUtilizada] = useState('Eléctrica');
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
        setErrorMessage('');
      };

      reader.readAsDataURL(file);
    }
  };
  const calcularValorConsecuencia = () => {
    const valoresConsecuencia = {
      'Catástrofe': 50,
      'Varias muertes': 25,
      'Muerte': 15,
      'Lesiones graves': 10,
      'Lesiones con baja': 5,
      'Lesiones sin baja': 1
    };
    return valoresConsecuencia[consequence];
  };

  const calcularValorExposicion = () => {
    const valoresExposicion = {
      'Continuamente': 10,
      'Frecuentemente': 6,
      'Ocasionalmente': 3,
      'Irregularmente': 2,
      'Raramente': 1
    };
    return valoresExposicion[exposure];
  };

  const calcularValorProbabilidad = () => {
    const valoresProbabilidad = {
      'Es el resultado más probable y esperado': 10,
      'Es completamente posible, no será nada extraño': 6,
      'Sería una secuencia o coincidencia rara pero posible, ha ocurrido': 3,
      'Coincidencia muy rara, pero se sabe que ha ocurrido': 2,
      'Coincidencia extremadamente remota pero concebible': 1,
      'Coincidencia prácticamente imposible, jamás ha ocurrido': 0.5
    };
    return valoresProbabilidad[probability];
  };

  const calcularMagnitudRiesgo = () => {
    return Math.floor(calcularValorConsecuencia() * calcularValorExposicion() * calcularValorProbabilidad());
  };

  const obtenerColorPorRiesgo = (magnitud) => {
    if (magnitud > 400) {
      return { color: 'red', texto: 'Muy Alto: Detención inmediata', accion: 'Inmediata', clasificacion: 'Muy Alto' };
    } else if (magnitud > 200) {
      return { color: 'orange', texto: 'Alto: Corrección inmediata', accion: 'Urgente', clasificacion: 'Alto' };
    } else if (magnitud > 70) {
      return { color: 'yellow', texto: 'Notable: Corrección necesaria', accion: 'Pronto', clasificacion: 'Moderado' };
    } else if (magnitud > 10) {
      return { color: 'green', texto: 'Aceptable: Monitoreo recomendado', accion: 'Regular', clasificacion: 'Bajo' };
    } else {
      return { color: 'lightgreen', texto: 'Insignificante: Sin acción requerida', accion: 'Sin acción', clasificacion: 'Insignificante' };
    }
  };

  const peligros = [
    "Golpes y cortes en manos ocasionados por las propias herramientas durante el trabajo normal con las mismas",
    "Lesiones oculares por partículas provenientes de los objetos que se trabajan y/o de la propia herramienta",
    "Golpes en diferentes partes del cuerpo por despido de la propia herramienta o del material trabajado",
    "Esguince por sobreesfuerzos o gestos violentos"
  ];

  const { color, texto, accion, clasificacion } = obtenerColorPorRiesgo(calcularMagnitudRiesgo());
  const magnitudRiesgo = calcularMagnitudRiesgo();

  const downloadPDF = () => {
    const input = document.getElementById('pdf-content');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 0, 0);
        pdf.save('reporte.pdf');
      });
  };

  
  return (
    <div>
      <div id="pdf-content" className="risk-table">
        <table className="main-table">
          <thead>
            <tr>
              <th colSpan="4">Nombre de la maquinaria o equipo:</th>
              <th colSpan="2">
              <textarea name="" id="" placeholder='Nombre de la maquinaria'></textarea>
              </th>
              <th colSpan="2">Energía utilizada:</th>
              <th colSpan="2">
                <select
                  value={energiaUtilizada}
                  onChange={(e) => setEnergiaUtilizada(e.target.value)}
                >
                  {opcionesEnergia.map(opcion => (
                    <option key={opcion} value={opcion}>{opcion}</option>
                  ))}
                </select>
              </th>
            </tr>
            <tr>
              <th colSpan="4">Descripción de la maquinaria o equipo:</th>
              <th colSpan="2">
                <textarea
                  value={maquinariaDescripcion}
                  onChange={(e) => setMaquinariaDescripcion(e.target.value)}
                  placeholder="Describa la maquinaria o equipo"
                  rows="1"
                  cols="30"
                />
              </th>
              <th colSpan="2">Area:</th>
              <th><input type="text" placeholder='Escriba el area'/></th>
            </tr>

          
            
            <tr>
              <th colSpan="3">Localización esquemática de los riesgos en la maquinaria y/o equipo</th>
              
              <th colSpan="3"><input type="text" placeholder='Escriba el POE' />
              
              
              </th>
              <th colSpan="2">Tiempo de exposición:</th>
              <th colSpan="1">
                <select value={tiempoExposicion} onChange={(e) => setTiempoExposicion(e.target.value)}>
                  {opcionesTiempoExposicion.map(opcion => (
                    <option key={opcion} value={opcion}>{opcion}</option>
                  ))}
                </select>
              </th>
              
            </tr>
            
          </thead>
          <tbody>
            <tr>
              <td rowSpan="4" colSpan="3">
                <table className="compact-table no-border">
                  <div className="image-observations-container">
                    <div className="image-section">
                      <input type="file" accept="image/*" onChange={handleImageChange} />
                      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                      {imagePreview ? (
                        <img src={imagePreview} alt="Maquinaria" className="image-preview" />
                      ) : (
                        <p>No hay imagen seleccionada</p>
                      )}
                    </div>
                  </div>
                </table>
              </td>
              <td colSpan="3">
                <table className="compact-table no-border">
                  <thead>
                    <tr>
                      <th>Consecuencia</th>
                      <th>Exposición</th>
                      <th>Probabilidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td colSpan="1">
                        <select value={consequence} onChange={(e) => setConsequence(e.target.value)}>
                          {opcionesConsecuencia.map(opcion => (
                            <option key={opcion} value={opcion}>{opcion}</option>
                          ))}
                        </select>
                        <div>Valor: {calcularValorConsecuencia()}</div>
                      </td>
                      <td colSpan="1">
                        <select value={exposure} onChange={(e) => setExposure(e.target.value)}>
                          {opcionesExposicion.map(opcion => (
                            <option key={opcion} value={opcion}>{opcion}</option>
                          ))}
                        </select>
                        <div>Valor: {calcularValorExposicion()}</div>
                      </td>
                      <td colSpan="3" rowSpan="1">
                    <select value={probability} onChange={(e) => setProbability(e.target.value)}>
                      {opcionesProbabilidad.map(opcion => (
                      <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                      </select>
                    <div>Valor: {calcularValorProbabilidad()}</div>
                    </td>

                    </tr>
                    <tr>
                      <td colSpan="3" >
                        <div className="risk-magnitude-container">
                          <div className="risk-magnitude-bar" style={{ backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>{magnitudRiesgo}</span>
                            <span>{texto}</span>
                            <span ><strong>Acción:</strong> {accion}</span>
                            <span ><strong>Clasificación:</strong> {clasificacion}</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* Observaciones generales */}
                
                <tbody>
                </tbody>
              </td>

              <td colspan="1" >
                <table class="epp-table">
                  <tr>
                    <th  class="header">Equipo de Protección Personal sugerido:</th>
                  </tr>
                  <tr>
                    <td>Anteojos de protección</td>
                  </tr>
                  <tr>
                    <td>Calzado conductivo</td>
                  </tr>
                  <tr>
                    <td>Overol</td>
                  </tr>
                  <tr>
                    <td>Calzado contra impacto</td>
                  </tr>
                </table>

              </td>

              <td colSpan="2">
                <table class="risk-body-table">
                  <tr>
                    <th colspan="2" class="header">Principales partes del cuerpo expuestas al riesgo:</th>
                  </tr>
                  <tr>
                    <td>Ojos y cara</td>
                  </tr>
                  <tr>
                    <td>Dedos</td>
                  </tr>
                  <tr>
                    <td>Brazos y manos</td>
                  </tr>
                </table>


              </td>
              

            </tr>
            
            
          </tbody>
            <td colspan="9">
              <table className="main-table">
                <thead>
                  <tr>
                    <th colspan="2">Identificaciones de Riesgos:</th>
                  </tr>
                </thead>
                <tbody>
                  {peligros.map((peligro, index) => (
                    <tr key={index}>
                      <td>{peligro}</td>
                      <td>
                        <input type="checkbox" id={`check${index + 1}`} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>


          <tr>
          <td colSpan="9">
          <div className="observations-section" style={{ marginTop: '30px' }}>
                  <label htmlFor="observaciones">Observaciones:</label>
                  <textarea
                    id="observaciones"
                    value={observacionesGenerales}
                    onChange={(e) => setObservacionesGenerales(e.target.value)}
                    placeholder="Agregar observaciones generales aquí"
                    rows="2"
                    cols="30"
                  />
                </div>
          </td>
          </tr>
        </table>
      </div>
      <button onClick={downloadPDF} className="download-button">
        Descargar
      </button>
    </div>
  );
};
export default RiskTable;