import React, { useState, useEffect } from 'react';
import './Table04.css'; // Archivo CSS para estilos

const ToolEvaluationTable = () => {
  // Opciones del menú desplegable para cada campo
  const opcionesConsecuencia = ['Catástrofe', 'Varias muertes', 'Muerte', 'Lesiones graves', 'Lesiones con baja', 'Lesiones sin baja'];
  const opcionesExposicion = ['Continuamente', 'Frecuentemente', 'Ocasionalmente', 'Irregularmente', 'Raramente'];
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
      <h1>Tabla de herramientas manuales</h1>
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
            <td className="image-cell" rowSpan="8" colSpan="3">
              {/* Input para subir imagen */}
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

              {/* Previsualización de la imagen */}
              {imagePreview ? (
                <img src={imagePreview} alt="Previsualización" style={{ width: '150px', height: '150px', marginTop: '10px' }} />
              ) : (
                <p>No hay imagen seleccionada</p>
              )}
            </td>
            
            <td className="header" colSpan="3">Evaluación de riesgo de trabajo</td>
            <td className="header" colSpan="4">Equipo de Protección Personal sugerido</td>
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
            <td className="header" colSpan="6">Identificaciones de Riesgos:</td>
            <td className="header" colSpan="5">Principales partes del cuerpo expuestas al riesgo:</td>
          </tr>
          <tr>
            <td colSpan="6">
              <ul className="risk-list">
                <li>Golpes y cortes en manos ocasionados por las propias herramientas durante el trabajo normal con las mismas</li>
                <li>Lesiones oculares por partículas provenientes de los objetos que se trabajan y/o de la propia herramienta</li>
                <li>Golpes en diferentes partes del cuerpo por despido de la propia herramienta o del material trabajado</li>
                <li>Esguinces por sobreesfuerzos o gestos violentos</li>
              </ul>
            </td>
            <td colSpan="5">
              <tr>
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
                <select>
                <option value="cabeza-oidos">Cabeza y oidos</option>
                <option value="ojos-cara">Ojos y cara</option>
                <option value="brazos-manos">Brazos y manos</option>
                <option value="dedos">Dedos</option>
                <option value="sistema-respiratorio">Sistema respiratorio</option>
                <option value="tronco">Tronco</option>
                <option value="extremidades-inferiores">Extremidades inferiores</option>
                </select>


              </tr>

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
  );
};

export default ToolEvaluationTable