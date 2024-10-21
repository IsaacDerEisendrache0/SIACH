import React, { useState } from 'react';
import './Moviles.css';

const RiskTable = () => {
  const [consequence, setConsequence] = useState('Lesiones sin baja');
  const [exposure, setExposure] = useState('Ocasionalmente');
  const [probability, setProbability] = useState('Coincidencia extremadamente remota pero concebible');
  const [image, setImage] = useState(null);
  const [selectedEPPImage, setSelectedEPPImage] = useState(null);
  const [additionalEPPImages, setAdditionalEPPImages] = useState([]);

  const optionImages = {
    option1: '/body/lvl1_head.png',
    option2: '/body/lvl1_mid.png',
    option3: '/body/lvl1_foot.png',
    option4: '/body/lvl1_hand.png',
    option5: '/body/lvl2_headmid.png',
    option6: '/body/lvl2_handfoot.png',
    option7: '/body/lvl2_headfoot.png',
    option8: '/body/lvl2_headhand.png',
    option9: '/body/lvl2_midfoot.png',
    option10: '/body/lvl2_midhand.png',
    option11: '/body/lvl3_all.png',
  };

  const eppImages = Array.from({ length: 22 }, (_, i) => `/images/${i + 1}.png`).concat(['/images/34.png']);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleAddEPPImage = (e) => {
    const selectedImage = optionImages[e.target.value];
    if (selectedImage) {
      setAdditionalEPPImages([selectedImage]);
    }
  };

  const handleRemoveEPPImage = () => {
    setAdditionalEPPImages([]);
  };

  const riskOptions = [
    "Riesgo de incendio",
    "Riesgo de choque o atropello",
    "Vibración",
    "Partículas suspendidas en el ambiente",
    "Riesgo de atrapamiento o volcadura",
    "Riesgo caída de piedra o golpe por objeto",
    "Riesgo de descarga eléctrica",
    "Exposición a temperaturas elevadas y abatidas",
    "Riesgo de inundación",
    "Ventilación deficiente",
    "Daños ergonómicos",
    "Sustancias químicas",
    "Poca iluminación"
  ];

  const securityOptions = [
    "Extintores",
    "Paro de emergencia",
    "Sistema ANSUL",
    "Bandas antiestatica",
    "Sistema de anclaje",
    "Programa de mantenimiento",
    "Calza de seguridad",
    "Bloqueo de sistema hidraulico",
    "Bloqueo de sistema electrico",
    "Cinturon de seguridad",
    "Indicadores agua, aceite, aire, motor, presion etc",
    "Canopy",
    "Mata chispas",
    "Sistema LOTO",
    "Guardas, parachoques y protectores de calaveras",
    "Freno de emergencia",
    "Barandales y escaleras",
    "Indicadores (torreta, luces, claxon, banderas, etc)",
  ];

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

  const calcularMagnitudRiesgo = () => {
    const valorConsecuencia = calcularValorConsecuencia(consequence);
    const valorExposicion = calcularValorExposicion(exposure);
    const valorProbabilidad = calcularValorProbabilidad(probability);
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

  const magnitudRiesgo = calcularMagnitudRiesgo();
  const { color, texto, accion, clasificacion } = obtenerClasificacionRiesgo(magnitudRiesgo);

  return (
    <div className="risk-table-container">
      <table className="risk-table">
        <thead>
          <tr>
            <th className="red">Nombre de la maquinaria</th>
            <td colSpan="20"><input placeholder='Introduzca un nombre' type="text" /></td>
            <th className="red">Área:</th>
            <td colSpan="10"><input placeholder='Introduzca un area' type="text" /></td>
            <th className="red">POE:</th>
            <td colSpan="10"><input  placeholder="Introduzca el POE"type="text" /></td>
            <th className="red">Tiempo de exposición:</th>
            <td colSpan="10"><input placeholder='Introduzca el tiempo' type="text" /></td>
          </tr>
          <tr>
            <th className="red">Descripción de la maquinaria o equipo:</th>
            <td colSpan="30"><input placeholder='Introduzca una descripción' type="text" /></td>
            <th className="red">Fecha de inspección:</th>
            <td colSpan="12"><input type="date" /></td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="image-section">
              <input type="file" accept="image/*" onChange={handleImageUpload} />
              {image && <img src={image} alt="Uploaded" className="uploaded-image" style={{ width: '100%', height: 'auto', marginTop: '10px' }} />}
            </td>
            <td className="risk-info" colSpan="3">
              <h4 className="red">Identificación de riesgos</h4>
              <div className="risk-selects">
                {[...Array(7)].map((_, index) => (
                  <select key={index}>
                    <option value="">Seleccione un riesgo</option>
                    {riskOptions.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                ))}
              </div>
            </td>
            <td className="safety-info" colSpan="3">
              <h4 className="red">Sistemas de seguridad</h4>
              <div className="safety-selects">
                {[...Array(7)].map((_, index) => (
                  <select key={index}>
                    <option value="">Seleccione un sistema de seguridad</option>
                    {securityOptions.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                ))}
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="4" className="risk-evaluation-section">
              <table style={{ width: '100%' }}>
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
                  <tr>
                    <td>Valor Consecuencia: {calcularValorConsecuencia(consequence)}</td>
                    <td>Valor Exposición: {calcularValorExposicion(exposure)}</td>
                    <td>Valor Probabilidad: {calcularValorProbabilidad(probability)}</td>
                  </tr>
                </tbody>
              </table>
              <table className="risk-classification" style={{ width: '100%', marginTop: '20px' }}>
                <thead>
                  <tr className="red">
                    <th colSpan="3">Clasificación de Magnitud de Riesgo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: color }}>
                    <td>Magnitud del Riesgo: {magnitudRiesgo}</td>
                    <td>Clasificación: {clasificacion}</td>
                    <td>Acción: {accion}</td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td colSpan="8" className="epp-suggested" style={{ verticalAlign: 'top' }}>
              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '10px', borderRight: '1px solid #000', paddingRight: '20px' }}>
                  <div>
                    <h4 className="red">Seleccione una imagen adicional</h4>
                    <select onChange={handleAddEPPImage} style={{ width: '150px', height: '30px' }}>
                      <option value="">Seleccione una imagen adicional</option>
                      {Object.keys(optionImages).map((key) => (
                        <option key={key} value={key}>{key}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ paddingLeft: '20px' }}>
                    <h4 className="red">Seleccione EPP</h4>
                    <select onChange={(e) => setSelectedEPPImage(e.target.value)} style={{ width: '150px', height: '30px' }}>
                      <option value="">Seleccione EPP</option>
                      {eppImages.map((eppImage, idx) => (
                        <option key={idx} value={eppImage}>{`EPP ${idx}`}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="body-part-image">
                  {additionalEPPImages.length > 0 && (
                    <img
                      src={additionalEPPImages[0]}
                      alt={`EPP seleccionado`}
                      style={{ width: '150px', height: 'auto', marginTop: '10px', display: 'block' }}
                    />
                  )}
                </div>
                <div className="epp-images-grid" style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '10px' }}>
                  <img src="/images/3.png" alt="EPP 1" className="epp-image" style={{ width: '50px', height: '50px' }} />
                  <img src="/images/6.png" alt="EPP 2" className="epp-image" style={{ width: '50px', height: '50px' }} />
                  <img src="/images/4.png" alt="EPP 3" className="epp-image" style={{ width: '50px', height: '50px' }} />
                </div>
              
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RiskTable;
