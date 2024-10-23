import React, { useState } from 'react';
import './Moviles.css';

const RiskTable = () => {
  const [consequence, setConsequence] = useState('Lesiones sin baja');
  const [exposure, setExposure] = useState('Ocasionalmente');
  const [probability, setProbability] = useState('Coincidencia extremadamente remota pero concebible');
  const [image, setImage] = useState(null);
  const [selectedBodyImage, setSelectedBodyImage] = useState(null);
  const [selectedEPPImages, setSelectedEPPImages] = useState(['/images/3.png', '/images/4.png', '/images/6.png']);

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

  const eppImages = [
    '/images/1.png', '/images/2.png', '/images/3.png', '/images/4.png', 
    '/images/5.png', '/images/6.png', '/images/7.png', '/images/8.png', 
    '/images/9.png', '/images/10.png', '/images/11.png', '/images/12.png', 
    '/images/13.png', '/images/14.png', '/images/15.png', '/images/16.png', 
    '/images/17.png', '/images/18.png', '/images/19.png', '/images/20.png', 
    '/images/21.png', '/images/34.png'
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleAddEPPImage = (e) => {
    const selectedImage = e.target.value;
    if (selectedImage && !selectedEPPImages.includes(selectedImage)) {
      setSelectedEPPImages(prevImages => [...prevImages, selectedImage]);
    }
  };

  const handleSelectBodyImage = (e) => {
    const selectedImage = e.target.value;
    setSelectedBodyImage(selectedImage);
  };

  const handleRemoveEPPImage = (imageToRemove) => {
    setSelectedEPPImages(prevImages => prevImages.filter(image => image !== imageToRemove));
  };

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
    <table className="risk-table">
      <thead>
        <tr>
          <th className="red">Nombre de la maquinaria</th>
          <td colSpan="20"><input placeholder='Introduzca un nombre' type="text" /></td>
          <th className="red">Área:</th>
          <td colSpan="10"><input placeholder='Introduzca un área' type="text" /></td>
          <th className="red">POE:</th>
          <td colSpan="10"><input placeholder='Introduzca el POE' type="text" /></td>
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
          <td className="image-section" colSpan="4">
            <div style={{ display: 'flex' }}>
              <div style={{ flex: 1 }}>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {image && <img src={image} alt="Uploaded" className="uploaded-image" style={{ width: '100%', height: 'auto', marginTop: '10px' }} />}
              </div>
            </div>
          </td>
          <td className="risk-info" colSpan="3">
            <h4 className="red" style={{ fontSize: '14px' }}>Identificación de riesgos</h4>
            <div className="risk-selects">
              {[...Array(7)].map((_, index) => (
                <select key={index}>
                  <option value="">Seleccione un riesgo</option>
                  {opcionesConsecuencia.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
                </select>
              ))}
            </div>
          </td>
          <td className="safety-info" colSpan="3">
            <h4 className="red" style={{ fontSize: '14px' }}>Sistemas de seguridad</h4>
            <div className="safety-selects">
              {[...Array(7)].map((_, index) => (
                <select key={index}>
                  <option value="">Seleccione un sistema de seguridad</option>
                  {opcionesExposicion.map((opt, idx) => (
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
          <td style={{ verticalAlign: 'top' }}>
            <div style={{ marginTop: '20px' }}>
              <h4 className="red" style={{ display: 'inline-block', marginRight: '10px', fontSize: '14px' }}>Equipo de Protección Personal Sugerido</h4>
              <select onChange={handleSelectBodyImage} style={{ width: '150px', height: '30px', marginLeft: '10px' }}>
                <option value="">Seleccione Imagen del cuerpo</option>
                <option value="/body/lvl1_foot.png">lvl1_foot.png</option>
                <option value="/body/lvl1_hand.png">lvl1_hand.png</option>
                <option value="/body/lvl1_head.png">lvl1_head.png</option>
                <option value="/body/lvl1_mid.png">lvl1_mid.png</option>
                <option value="/body/lvl2_handfoot.png">lvl2_handfoot.png</option>
                <option value="/body/lvl2_headfoot.png">lvl2_headfoot.png</option>
                <option value="/body/lvl2_headhand.png">lvl2_headhand.png</option>
                <option value="/body/lvl2_headmid.png">lvl2_headmid.png</option>
                <option value="/body/lvl2_midfoot.png">lvl2_midfoot.png</option>
                <option value="/body/lvl2_midhand.png">lvl2_midhand.png</option>
                <option value="/body/lvl3_all.png">lvl3_all.png</option>
              </select>
              {selectedBodyImage && <img src={selectedBodyImage} alt="Selected Body Part" style={{ width: '100%', height: 'auto', marginTop: '10px' }} />}
            </div>
          </td>
          <td colSpan="8" className="epp-suggested" style={{ verticalAlign: 'top' }}>
            <div style={{ marginTop: '20px' }}>
              <h4 className="red" style={{ display: 'inline-block', marginRight: '10px', fontSize: '14px' }}>Seleccione EPP</h4>
              <select onChange={handleAddEPPImage} style={{ width: '150px', height: '30px', marginRight: '20px' }}>
                <option value="">Seleccione EPP</option>
                {eppImages.map((eppImage, idx) => (
                  <option key={idx} value={eppImage}>{`EPP ${idx + 1}`}</option>
                ))}
              </select>
              <div className="epp-images-grid" style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'flex-start' }}>
                {selectedEPPImages.map((imgSrc, idx) => (
                  <img key={idx} src={imgSrc} alt={`EPP ${idx + 1}`} className="epp-image" style={{ width: '50px', height: '50px' }} onClick={() => handleRemoveEPPImage(imgSrc)} />
                ))}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default RiskTable;
