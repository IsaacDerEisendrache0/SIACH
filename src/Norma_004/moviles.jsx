import React, { useState } from 'react';
import './Table04.css';

const RiskTable = () => {
  // Estados iniciales para Consecuencia, Exposición y Probabilidad
  const [consequence, setConsequence] = useState('Lesiones sin baja');
  const [exposure, setExposure] = useState('Ocasionalmente');
  const [probability, setProbability] = useState('Coincidencia extremadamente remota pero concebible');

  // Estado para manejar la imagen cargada
  const [image, setImage] = useState(null);

  // Función para manejar la carga de imagen
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  // Opciones de identificación de riesgos
  const riskOptions = [
    "Riesgo caída de piedra o golpe por objeto",
    "Riesgo de incendio",
    "Riesgo de atrapamiento o volcadura",
    "Riesgo de choque o atropello",
    "Riesgo de descarga eléctrica",
    "Exposición a temperaturas elevadas y abatidas",
    "Vibración",
    "Riesgo inundación",
    "Ventilación deficiente",
    "Daños ergonómicos",
    "Sustancias químicas",
    "Poca iluminación",
    "Partículas suspendidas en el ambiente",
  ];

  // Funciones para calcular los valores
  const calcularValorConsecuencia = (consequence) => {
    const valoresConsecuencia = {
      'Catástrofe': 50,
      'Varias muertes': 25,
      'Muerte': 15,
      'Lesiones graves': 10,
      'Lesiones con baja': 5,
      'Lesiones sin baja': 1
    };
    return valoresConsecuencia[consequence] || 0;
  };

  const calcularValorExposicion = (exposure) => {
    const valoresExposicion = {
      'Continuamente': 10,
      'Frecuentemente': 6,
      'Ocasionalmente': 3,
      'Irregularmente': 2,
      'Raramente': 1
    };
    return valoresExposicion[exposure] || 0;
  };

  const calcularValorProbabilidad = (probability) => {
    const valoresProbabilidad = {
      'Es el resultado más probable y esperado': 10,
      'Es completamente posible, no será nada extraño': 6,
      'Sería una secuencia o coincidencia rara pero posible, ha ocurrido': 3,
      'Coincidencia muy rara, pero se sabe que ha ocurrido': 2,
      'Coincidencia extremadamente remota pero concebible': 1,
      'Coincidencia prácticamente imposible, jamás ha ocurrido': 0.5
    };
    return valoresProbabilidad[probability] || 0;
  };

  // Cálculo de la magnitud del riesgo
  const calcularMagnitudRiesgo = () => {
    const valorConsecuencia = calcularValorConsecuencia(consequence);
    const valorExposicion = calcularValorExposicion(exposure);
    const valorProbabilidad = calcularValorProbabilidad(probability);
    return Math.floor(valorConsecuencia * valorExposicion * valorProbabilidad);
  };

  // Clasificación de la magnitud del riesgo
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

  const magnitudRiesgo = calcularMagnitudRiesgo();
  const { color, texto, accion, clasificacion } = obtenerClasificacionRiesgo(magnitudRiesgo);

  // Opciones para los selects de Consecuencia, Exposición y Probabilidad
  const opcionesConsecuencia = [
    'Catástrofe',
    'Varias muertes',
    'Muerte',
    'Lesiones graves',
    'Lesiones con baja',
    'Lesiones sin baja'
  ];

  const opcionesExposicion = [
    'Continuamente',
    'Frecuentemente',
    'Ocasionalmente',
    'Irregularmente',
    'Raramente'
  ];

  const opcionesProbabilidad = [
    'Es el resultado más probable y esperado',
    'Es completamente posible, no será nada extraño',
    'Sería una secuencia o coincidencia rara pero posible, ha ocurrido',
    'Coincidencia muy rara, pero se sabe que ha ocurrido',
    'Coincidencia extremadamente remota pero concebible',
    'Coincidencia prácticamente imposible, jamás ha ocurrido'
  ];

  return (
    <table className="risk-table">
      <thead>
        <tr>
          <th colSpan="5" className="red">Nombre de la maquinaria o equipo:</th>
          <th>MONTACARGAS EXTERIOR MINA</th>
          <th className="red">Área:</th>
          <th>EXTERIOR MINA</th>
        </tr>
        <tr>
          <th colSpan="5" className="red">Descripción de la maquinaria o equipo:</th>
          <th>LEVANTAMIENTO Y TRANSPORTE DE MATERIAL</th>
          <th className="red">Energía utilizada:</th>
          <th>DIESEL</th>
        </tr>
        <tr>
          <th colSpan="2" className="red">Localización esquemática de los riesgos en maquinaria y/o equipo</th>
          <th className="red">POE:</th>
          <th>1</th>
          <th className="red">Tiempo de exposición:</th>
          <th>12 HRS</th>
          <th className="red">Fecha de inspección:</th>
          <th>19/07/2024</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {/* Primera columna: Imagen */}
          <td colSpan="4" rowSpan="3" className="image-section">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image ? (
              <img src={image} alt="Uploaded Equipment" className="equipment-image" />
            ) : (
              <p>No image uploaded.</p>
            )}
          </td>
          {/* Segunda columna: Identificación de riesgos */}
          <td colSpan="5" rowSpan="1" className="risk-info">
            <table className="inner-table">
              <thead>
                <tr>
                  <th className="red">Identificación de riesgos</th>
                </tr>
              </thead>
              <tbody>
                {/* Mostrar solo 7 menús desplegables */}
                {[...Array(7)].map((_, index) => (
                  <tr key={index}>
                    <td>
                      <select>
                        <option value="">Seleccione un riesgo</option>
                        {riskOptions.map((opt, idx) => (
                          <option key={idx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
          {/* Tercera columna: Sistemas de seguridad */}
          <td colSpan="5" className="safety-info">
            <table className="inner-table">
              <thead>
                <tr>
                  <th className="red">Sistemas de seguridad</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Programa de mantenimiento</td></tr>
                <tr><td>Extintores</td></tr>
                <tr><td>Guardas, parachoques y protectores de calaveras</td></tr>
                <tr><td>Freno de emergencia</td></tr>
                <tr><td>Barandales y escaleras</td></tr>
                <tr><td>Indicadores (torreta, luces, claxon, banderas, etc)</td></tr>
                <tr><td>Sistema ANSUL</td></tr>
              </tbody>
            </table>
          </td>
        </tr>
        {/* Sección de Evaluación de riesgos y EPP sugerido */}
        <tr>
          {/* Evaluación de riesgos */}
          <td colSpan="6" className="risk-evaluation-section">
            <table>
              <thead>
                <tr className="red">
                  <th colSpan="3">Evaluación de riesgo de trabajo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Consecuencia</td>
                  <td>Exposición</td>
                  <td>Probabilidad</td>
                </tr>
                <tr>
                  <td>
                    <select value={consequence} onChange={(e) => setConsequence(e.target.value)}>
                      {opcionesConsecuencia.map((opcion, idx) => (
                        <option key={idx} value={opcion}>{opcion}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select value={exposure} onChange={(e) => setExposure(e.target.value)}>
                      {opcionesExposicion.map((opcion, idx) => (
                        <option key={idx} value={opcion}>{opcion}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select value={probability} onChange={(e) => setProbability(e.target.value)}>
                      {opcionesProbabilidad.map((opcion, idx) => (
                        <option key={idx} value={opcion}>{opcion}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
            <table className="risk-classification">
              <thead>
                <tr className="red">
                  <th colSpan="3">Clasificación de Magnitud de Riesgo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Magnitud del Riesgo: {magnitudRiesgo}</td>
                  <td>Clasificación: {clasificacion}</td>
                  <td>Acción: {accion}</td>
                </tr>
              </tbody>
            </table>
          </td>
          {/* EPP sugerido */}
          <td colSpan="3" className="epp-section">
            <div className="table-cell red">EPP sugerido</div>
            <div className="epp-icons">
              <img src="path-to-icon1.png" alt="EPP Icon 1" />
              <img src="path-to-icon2.png" alt="EPP Icon 2" />
              <img src="path-to-icon3.png" alt="EPP Icon 3" />
              <img src="path-to-icon4.png" alt="EPP Icon 4" />
              <img src="path-to-icon5.png" alt="EPP Icon 5" />
              <img src="path-to-icon6.png" alt="EPP Icon 6" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default RiskTable;
