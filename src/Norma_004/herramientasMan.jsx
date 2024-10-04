import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Table04.css'; // Archivo CSS para estilos

const ToolEvaluationTable = () => {
  // Opciones del menú desplegable para cada campo
  const opcionesConsecuencia = ['Catástrofe', 'Varias muertes', 'Muerte', 'Lesiones graves', 'Lesiones con baja', 'Lesiones sin baja'];
  const opcionesExposicion = ['Continuamente', 'Frecuentemente', 'Ocasionalmente', 'Irregularmente', 'Raramente', 'Remotamente'];
  const [observaciones, setObservaciones] = useState('');

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
  const [imagePreview, setImagePreview] = useState(null); // Estado para la previsualización de la imagen
  const [errorMessage, setErrorMessage] = useState(''); // Estado para los errores al subir la imagen

  // Función para manejar el archivo de imagen seleccionado
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    // Validar que el archivo sea una imagen
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result); // Guardar la URL de la imagen para previsualización
        setErrorMessage(''); // Limpiar cualquier mensaje de error
      };

      reader.readAsDataURL(file);
    } else {
      setErrorMessage('Por favor selecciona un archivo de imagen válido.');
    }
  };

  // Función para calcular la Magnitud del Riesgo, Clasificación y Acción
  const calcularRiesgo = () => {
    const valoresRiesgo = {
      'Catástrofe': 100,
      'Varias muertes': 50,
      'Muerte': 25,
      'Lesiones graves': 15,
      'Lesiones con baja': 5,
      'Lesiones sin baja': 1
    };
    const valoresExposicion = {
      'Continuamente': 10,
      'Frecuentemente': 6,
      'Ocasionalmente': 3,
      'Irregularmente': 2,
      'Raramente': 1,
      'Remotamente': 0.5
    };

    const valoresProbabilidad = {
      'Es el resultado más probable y esperado': 10,
      'Es completamente posible, no será nada extraño': 6,
      'Sería una secuencia o coincidencia rara pero posible, ha ocurrido': 3,
      'Coincidencia muy rara, pero se sabe que ha ocurrido': 1,
      'Coincidencia extremadamente remota pero concebible': 0.5,
      'Coincidencia prácticamente imposible, jamás ha ocurrido': 0.1
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

  // Función para descargar la tabla como PDF
  const downloadPDF = () => {
    const input = document.querySelector('.table-container');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('tabla_herramientas_manual.pdf');
    });
  };

  return (
    <div>

    <div className="table-container">
      <h1>Tabla de herramientas manuales</h1>
      <table className="evaluation-table">
        <thead>
          <tr>
            <td className="header" colSpan="4">Nombre de la herramienta: Llave Stilson</td>
            <td className="header" colSpan="6">Área: Mina y Planta</td>
          </tr>
          <tr>
            <td className="header" colSpan="1" rowSpan="1">Energía utilizada:</td>
            <td>
              <input 
                type="text" 
                defaultValue="Manual" 
                className="compact-input" 
              />
            </td>
            <td className="header">POE:</td>
            <td>
              <input 
                type="number" 
                defaultValue="1" 
                className="compact-input"
              />
            </td>
            <td className="header">Tiempo de exposición:</td>
            <td>
              <input 
                type="text" 
                defaultValue="5 min" 
                className="compact-input"
              />
            </td>
            <td className="header">Fecha de inspección:</td>
            <td>
              <input 
                type="date" 
                defaultValue="2023-04-04" 
                className="compact-input"
              />
            </td>
          </tr>
        </thead>

        <tbody>
          <tr>
          <td className="image-cell" colSpan="2" rowSpan="8">
  <div className="image-table-container" colSpan="5" rowSpan="4">
    <table className="image-table">
      <tbody>
        <tr>
          <td>
            {/* Input para subir imagen */}
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          </td>
        </tr>
        <tr>
          <td>
            {/* Previsualización de la imagen */}
            {imagePreview ? (
              <div className="image-preview-large">
                <img src={imagePreview} alt="Previsualización" />
              </div>
            ) : (
              <p>No se ha seleccionado ninguna imagen.</p>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</td>




            
            <td className="header" colSpan="4">Evaluación de riesgo de trabajo</td>
            <td className="header" colSpan="9">Equipo de Protección Personal sugerido</td>
          </tr>

          <tr>
            <td className="sub-header">Consecuencia</td>
            <td className="sub-header">Exposición</td>
            <td className="sub-header">Probabilidad</td>
            <td rowSpan="6" className="protection-cell" colSpan="4">
              <div>
                <label>Seleccione Equipo de Protección Personal:</label>
                <select>
                  <option value="casco-contra-impacto">Casco contra impacto</option>
                  <option value="casco-dielectrico">Casco dieléctrico</option>
                  <option value="capuchas">Capuchas</option>
                  <option value="anteojos-de-proteccion">Anteojos de protección</option>
                  <option value="goggles">Goggles</option>
                  <option value="pantalla-facial">Pantalla facial</option>
                  <option value="careta-para-soldador">Careta para soldador</option>
                  <option value="gafas-para-soldador">Gafas para soldador</option>
                  <option value="tapones-auditivos">Tapones auditivos</option>
                  <option value="conchas-acusticas">Conchas acústicas</option>
                  <option value="respirador-contra-particulas">Respirador contra partículas</option>
                  <option value="respirador-contra-gases-vapores">Respirador contra gases y vapores</option>
                  <option value="mascarilla-desechable">Mascarilla desechable</option>
                  <option value="equipo-respiracion-autonomo">Equipo de respiración autónomo</option>
                  <option value="guantes-contra-sustancias-quimicas">Guantes contra sustancias químicas</option>
                  <option value="guantes-dielectricos">Guantes dieléctricos</option>
                  <option value="guantes-contra-temperaturas-extremas">Guantes contra temperaturas extremas</option>
                  <option value="guantes">Guantes</option>
                  <option value="mangas">Mangas</option>
                  <option value="mandil-altas-temperaturas">Mandil contra altas temperaturas</option>
                  <option value="mandil-sustancias-quimicas">Mandil contra sustancias químicas</option>
                  <option value="overol">Overol</option>
                  <option value="bata">Bata</option>
                  <option value="ropa-sustancias-peligrosas">Ropa contra sustancias peligrosas</option>
                  <option value="calzado-ocupacional">Calzado ocupacional</option>
                  <option value="calzado-contra-impacto">Calzado contra impacto</option>
                  <option value="calzado-conductivo">Calzado conductivo</option>
                  <option value="calzado-dielectrico">Calzado dieléctrico</option>
                  <option value="calzado-sustancias-quimicas">Calzado contra sustancias químicas</option>
                  <option value="polainas">Polainas</option>
                  <option value="botas-impermeables">Botas impermeables</option>
                  <option value="proteccion-caidas-altura">Equipo de protección contra caídas de altura</option>
                  <option value="equipo-brigadista-incendio">Equipo para brigadista contra incendio</option>
                </select>
                <select>
                  <option value=""></option>
                  <option value="casco-contra-impacto">Casco contra impacto</option>
                  <option value="casco-dielectrico">Casco dieléctrico</option>
                  <option value="capuchas">Capuchas</option>
                  <option value="anteojos-de-proteccion">Anteojos de protección</option>
                  <option value="goggles">Goggles</option>
                  <option value="pantalla-facial">Pantalla facial</option>
                  <option value="careta-para-soldador">Careta para soldador</option>
                  <option value="gafas-para-soldador">Gafas para soldador</option>
                  <option value="tapones-auditivos">Tapones auditivos</option>
                  <option value="conchas-acusticas">Conchas acústicas</option>
                  <option value="respirador-contra-particulas">Respirador contra partículas</option>
                  <option value="respirador-contra-gases-vapores">Respirador contra gases y vapores</option>
                  <option value="mascarilla-desechable">Mascarilla desechable</option>
                  <option value="equipo-respiracion-autonomo">Equipo de respiración autónomo</option>
                  <option value="guantes-contra-sustancias-quimicas">Guantes contra sustancias químicas</option>
                  <option value="guantes-dielectricos">Guantes dieléctricos</option>
                  <option value="guantes-contra-temperaturas-extremas">Guantes contra temperaturas extremas</option>
                  <option value="guantes">Guantes</option>
                  <option value="mangas">Mangas</option>
                  <option value="mandil-altas-temperaturas">Mandil contra altas temperaturas</option>
                  <option value="mandil-sustancias-quimicas">Mandil contra sustancias químicas</option>
                  <option value="overol">Overol</option>
                  <option value="bata">Bata</option>
                  <option value="ropa-sustancias-peligrosas">Ropa contra sustancias peligrosas</option>
                  <option value="calzado-ocupacional">Calzado ocupacional</option>
                  <option value="calzado-contra-impacto">Calzado contra impacto</option>
                  <option value="calzado-conductivo">Calzado conductivo</option>
                  <option value="calzado-dielectrico">Calzado dieléctrico</option>
                  <option value="calzado-sustancias-quimicas">Calzado contra sustancias químicas</option>
                  <option value="polainas">Polainas</option>
                  <option value="botas-impermeables">Botas impermeables</option>
                  <option value="proteccion-caidas-altura">Equipo de protección contra caídas de altura</option>
                  <option value="equipo-brigadista-incendio">Equipo para brigadista contra incendio</option>
                </select>
                <select>
                  <option value="casco-contra-impacto">Casco contra impacto</option>
                  <option value="casco-dielectrico">Casco dieléctrico</option>
                  <option value="capuchas">Capuchas</option>
                  <option value="anteojos-de-proteccion">Anteojos de protección</option>
                  <option value="goggles">Goggles</option>
                  <option value="pantalla-facial">Pantalla facial</option>
                  <option value="careta-para-soldador">Careta para soldador</option>
                  <option value="gafas-para-soldador">Gafas para soldador</option>
                  <option value="tapones-auditivos">Tapones auditivos</option>
                  <option value="conchas-acusticas">Conchas acústicas</option>
                  <option value="respirador-contra-particulas">Respirador contra partículas</option>
                  <option value="respirador-contra-gases-vapores">Respirador contra gases y vapores</option>
                  <option value="mascarilla-desechable">Mascarilla desechable</option>
                  <option value="equipo-respiracion-autonomo">Equipo de respiración autónomo</option>
                  <option value="guantes-contra-sustancias-quimicas">Guantes contra sustancias químicas</option>
                  <option value="guantes-dielectricos">Guantes dieléctricos</option>
                  <option value="guantes-contra-temperaturas-extremas">Guantes contra temperaturas extremas</option>
                  <option value="guantes">Guantes</option>
                  <option value="mangas">Mangas</option>
                  <option value="mandil-altas-temperaturas">Mandil contra altas temperaturas</option>
                  <option value="mandil-sustancias-quimicas">Mandil contra sustancias químicas</option>
                  <option value="overol">Overol</option>
                  <option value="bata">Bata</option>
                  <option value="ropa-sustancias-peligrosas">Ropa contra sustancias peligrosas</option>
                  <option value="calzado-ocupacional">Calzado ocupacional</option>
                  <option value="calzado-contra-impacto">Calzado contra impacto</option>
                  <option value="calzado-conductivo">Calzado conductivo</option>
                  <option value="calzado-dielectrico">Calzado dieléctrico</option>
                  <option value="calzado-sustancias-quimicas">Calzado contra sustancias químicas</option>
                  <option value="polainas">Polainas</option>
                  <option value="botas-impermeables">Botas impermeables</option>
                  <option value="proteccion-caidas-altura">Equipo de protección contra caídas de altura</option>
                  <option value="equipo-brigadista-incendio">Equipo para brigadista contra incendio</option>
                </select>
                <select>
                  <option value="casco-contra-impacto">Casco contra impacto</option>
                  <option value="casco-dielectrico">Casco dieléctrico</option>
                  <option value="capuchas">Capuchas</option>
                  <option value="anteojos-de-proteccion">Anteojos de protección</option>
                  <option value="goggles">Goggles</option>
                  <option value="pantalla-facial">Pantalla facial</option>
                  <option value="careta-para-soldador">Careta para soldador</option>
                  <option value="gafas-para-soldador">Gafas para soldador</option>
                  <option value="tapones-auditivos">Tapones auditivos</option>
                  <option value="conchas-acusticas">Conchas acústicas</option>
                  <option value="respirador-contra-particulas">Respirador contra partículas</option>
                  <option value="respirador-contra-gases-vapores">Respirador contra gases y vapores</option>
                  <option value="mascarilla-desechable">Mascarilla desechable</option>
                  <option value="equipo-respiracion-autonomo">Equipo de respiración autónomo</option>
                  <option value="guantes-contra-sustancias-quimicas">Guantes contra sustancias químicas</option>
                  <option value="guantes-dielectricos">Guantes dieléctricos</option>
                  <option value="guantes-contra-temperaturas-extremas">Guantes contra temperaturas extremas</option>
                  <option value="guantes">Guantes</option>
                  <option value="mangas">Mangas</option>
                  <option value="mandil-altas-temperaturas">Mandil contra altas temperaturas</option>
                  <option value="mandil-sustancias-quimicas">Mandil contra sustancias químicas</option>
                  <option value="overol">Overol</option>
                  <option value="bata">Bata</option>
                  <option value="ropa-sustancias-peligrosas">Ropa contra sustancias peligrosas</option>
                  <option value="calzado-ocupacional">Calzado ocupacional</option>
                  <option value="calzado-contra-impacto">Calzado contra impacto</option>
                  <option value="calzado-conductivo">Calzado conductivo</option>
                  <option value="calzado-dielectrico">Calzado dieléctrico</option>
                  <option value="calzado-sustancias-quimicas">Calzado contra sustancias químicas</option>
                  <option value="polainas">Polainas</option>
                  <option value="botas-impermeables">Botas impermeables</option>
                  <option value="proteccion-caidas-altura">Equipo de protección contra caídas de altura</option>
                  <option value="equipo-brigadista-incendio">Equipo para brigadista contra incendio</option>
                </select>
              </div>
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
          <tr></tr>
          <tr>
            <td className="header" colSpan="5">Identificaciones de Riesgos:</td>
            <td className="header" colSpan="6">Principales partes del cuerpo expuestas al riesgo:</td>
          </tr>
          <tr>
            <td colSpan="5">
            <textarea 

                placeholder="Escribe tus observaciones aquí"
              />

            </td>
            <td colSpan="6">
              
                <select>
                  <option value="cabeza-oidos">Cabeza y oidos</option>
                  <option value="ojos-cara">Ojos y cara</option>
                  <option value="brazos-manos">Brazos y manos</option>
                  <option value="dedos">Dedos</option>
                  <option value="sistema-respiratorio">Sistema respiratorio</option>
                  <option value="tronco">Tronco</option>
                  <option value="extremidades-inferiores">Extremidades inferiores</option>
                </select>
                <select>
                  <option value="cabeza-oidos">Cabeza y oidos</option>
                  <option value="ojos-cara">Ojos y cara</option>
                  <option value="brazos-manos">Brazos y manos</option>
                  <option value="dedos">Dedos</option>
                  <option value="sistema-respiratorio">Sistema respiratorio</option>
                  <option value="tronco">Tronco</option>
                  <option value="extremidades-inferiores">Extremidades inferiores</option>
                </select>
                <select>
                  <option value="cabeza-oidos">Cabeza y oidos</option>
                  <option value="ojos-cara">Ojos y cara</option>
                  <option value="brazos-manos">Brazos y manos</option>
                  <option value="dedos">Dedos</option>
                  <option value="sistema-respiratorio">Sistema respiratorio</option>
                  <option value="tronco">Tronco</option>
                  <option value="extremidades-inferiores">Extremidades inferiores</option>
                </select>
                <select>
                  <option value="cabeza-oidos">Cabeza y oidos</option>
                  <option value="ojos-cara">Ojos y cara</option>
                  <option value="brazos-manos">Brazos y manos</option>
                  <option value="dedos">Dedos</option>
                  <option value="sistema-respiratorio">Sistema respiratorio</option>
                  <option value="tronco">Tronco</option>
                  <option value="extremidades-inferiores">Extremidades inferiores</option>
                </select>
                <select>
                  <option value="cabeza-oidos">Cabeza y oidos</option>
                  <option value="ojos-cara">Ojos y cara</option>
                  <option value="brazos-manos">Brazos y manos</option>
                  <option value="dedos">Dedos</option>
                  <option value="sistema-respiratorio">Sistema respiratorio</option>
                  <option value="tronco">Tronco</option>
                  <option value="extremidades-inferiores">Extremidades inferiores</option>
                </select>
                <select>
                  <option value="cabeza-oidos">Cabeza y oidos</option>
                  <option value="ojos-cara">Ojos y cara</option>
                  <option value="brazos-manos">Brazos y manos</option>
                  <option value="dedos">Dedos</option>
                  <option value="sistema-respiratorio">Sistema respiratorio</option>
                  <option value="tronco">Tronco</option>
                  <option value="extremidades-inferiores">Extremidades inferiores</option>
                </select>
              
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td className="footer-header" colSpan="4">Observaciones:</td>
            <td colSpan="4">
              <textarea 
                value={observaciones} 
                onChange={(e) => setObservaciones(e.target.value)} 
                rows="4" 
                cols="50" 
                placeholder="Escribe tus observaciones aquí"
              />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <button onClick={downloadPDF} className="download-button">
        Descargar PDF
      </button>
    </div>
    
  );
};

export default ToolEvaluationTable;