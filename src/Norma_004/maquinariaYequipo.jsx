import React, { useState, useEffect } from 'react';
import './MaquinariaYequipo.css';
import html2canvas from 'html2canvas';
import { addDoc, updateDoc, doc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import logo from '../logos/logo.png';

const protectionImages = {
  'Caídas de Altura': ['/images/10.png', '/images/34.png'],
  'Exposición a Temperaturas': ['/images/6.png'],
  'Exposición a Electricidad Estática': ['/images/6.png', '/images/4.png'],
  'Exposición a Sustancias Químicas': ['/images/7.png', '/images/13.png', '/images/6.png', '/images/17.png'],
  'Exposición a Radiaciones': ['/images/16.png'],
  'Exposición agentes Biológicos': ['/images/18.png', '/images/16.png'],
  'Exposición a Ruido': ['/images/19.png', '/images/5.png'],
  'Exposición a Vibraciones': ['/images/14.png', '/images/4.png'],
  'Superficies cortantes': ['/images/6.png', '/images/1.png', '/images/21.png'],
  'Caídas a nivel o desnivel': ['/images/4.png'],
  'Daños Ergonómicos': ['/images/15.png'],
  'Calentamiento de materia prima, subproducto o producto': ['/images/6.png', '/images/15.png'],
  'Proyección de material o herramienta': ['/images/7.png', '/images/12.png'],
  'Mantenimiento preventivo, correctivo o predictivo': ['/images/12.png', '/images/3.png'],
};

const RiskTable = () => {
  const [nombreMaquinaria, setNombreMaquinaria] = useState('');
  const [poe, setPoe] = useState('');
  const [tiempoExposicion, setTiempoExposicion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInspeccion, setFechaInspeccion] = useState('');
  const [consequence, setConsequence] = useState('Lesiones sin baja');
  const [exposure, setExposure] = useState('Ocasionalmente');
  const [probability, setProbability] = useState('Coincidencia extremadamente remota pero concebible');
  const [selectedBodyImage, setSelectedBodyImage] = useState(null);
  const [selectedEPPImages, setSelectedEPPImages] = useState([]);
  const [selectedTriangleImages, setSelectedTriangleImages] = useState([]); // Nuevo estado para triángulos
  const [isEditing, setIsEditing] = useState(false);
  const [tableId, setTableId] = useState(null);

  useEffect(() => {
    const tableToEdit = JSON.parse(localStorage.getItem('tableToEdit'));
    if (tableToEdit) {
      setConsequence(tableToEdit.consequence || 'Lesiones sin baja');
      setExposure(tableToEdit.exposure || 'Ocasionalmente');
      setProbability(tableToEdit.probability || 'Coincidencia extremadamente remota pero concebible');
      setSelectedEPPImages(tableToEdit.selectedImages || []);
      setDescripcion(tableToEdit.descripcionActividad || '');
      setPoe(tableToEdit.selectedOptionEquipoUtilizado || '');
      setTiempoExposicion(tableToEdit.tiempoExposicion || '');
      setFechaInspeccion(tableToEdit.fecha || '');
      setTableId(tableToEdit.id || null);
      setIsEditing(true);
      localStorage.removeItem('tableToEdit');
    }
  }, []);

  const saveTable = async (tableData, tableId = null) => {
    try {
      if (tableId) {
        const docRef = doc(db, 'tablas', tableId);
        await updateDoc(docRef, tableData);
        alert('Tabla actualizada con éxito en Firestore.');
      } else {
        await addDoc(collection(db, 'tablas'), tableData);
        alert('Tabla guardada con éxito en Firestore.');
      }
    } catch (error) {
      console.error('Error al guardar en Firestore:', error);
      alert('Error al guardar la tabla.');
    }
  };

  const downloadImage = () => {
    const input = document.querySelector('.risk-table-container');
    html2canvas(input, { scale: 2, useCORS: true, backgroundColor: null }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'tabla_herramientas_manual.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleCheckboxChange = (e, hazard) => {
    const checked = e.target.checked;
    const imagesToAdd = protectionImages[hazard] || [];

    if (checked) {
      setSelectedEPPImages((prevImages) => Array.from(new Set([...prevImages, ...imagesToAdd])));
    } else {
      setSelectedEPPImages((prevImages) => prevImages.filter(img => !imagesToAdd.includes(img)));
    }
  };

  const handleSelectImage = (e) => {
    const selectedImage = e.target.value;
    if (selectedImage && !selectedTriangleImages.includes(selectedImage)) {
      setSelectedTriangleImages((prevImages) => [...prevImages, selectedImage]);
    }
    e.target.value = ''; // Reiniciar el select después de agregar una imagen
  };

  const handleRemoveTriangleImage = (imageToRemove) => {
    setSelectedTriangleImages((prevImages) => prevImages.filter((image) => image !== imageToRemove));
  };

  const handleRemoveEPPImage = (imageToRemove) => {
    setSelectedEPPImages((prevImages) => prevImages.filter((image) => image !== imageToRemove));
  };

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
  const { color, accion, clasificacion } = obtenerClasificacionRiesgo(magnitudRiesgo);

  const saveTableData = () => {
    const tableData = {
      nombreTabla: 'Tabla Moviles',
      consequence,
      exposure,
      probability,
      risk: calcularMagnitudRiesgo(),
      selectedImages: selectedEPPImages,
      descripcionActividad: descripcion,
      selectedOptionEquipoUtilizado: poe,
      selectedOptionProteccionSugerida: selectedBodyImage,
      tiempoExposicion,
      norma: 'N-004',
      fecha: fechaInspeccion || new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
    };

    saveTable(tableData, isEditing ? tableId : null);
  };

  return (
    <div className="risk-table-container">
      <div className="logo-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src={logo} alt="SIACH Logo" style={{ width: '200px', marginLeft: '-100px' }} />
      </div>
      <h6>NOM-004-STPS-1999 "ANALISIS DE RIESGO POTENCIAL POR MAQUINARIA Y EQUIPO"</h6>
      <table className="risk-table">
        <thead>
          <tr>
            <th className="red">Nombre de la maquinaria</th>
            <td colSpan="20">
              <input
                placeholder="Introduzca un nombre"
                type="text"
                value={nombreMaquinaria}
                onChange={(e) => setNombreMaquinaria(e.target.value)}
              />
            </td>
            <th className="red">POE:</th>
            <td colSpan="10">
              <input
                placeholder="Introduzca el POE"
                type="text"
                value={poe}
                onChange={(e) => setPoe(e.target.value)}
              />
            </td>
            <th className="red">Tiempo de exposición:</th>
            <td colSpan="10">
              <input
                placeholder="Introduzca el tiempo"
                type="text"
                value={tiempoExposicion}
                onChange={(e) => setTiempoExposicion(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <th className="red">Descripción de la maquinaria o equipo:</th>
            <td colSpan="40">
              <input
                placeholder="Introduzca una descripción"
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </td>
            <th className="red">Fecha de inspección:</th>
            <td colSpan="13">
              <input
                type="date"
                value={fechaInspeccion}
                onChange={(e) => setFechaInspeccion(e.target.value)}
              />
            </td>
          </tr>
        </thead>

        <tbody>
          <div className="table-flex-container">
            <div className="image-insert-table">
              <table>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedBodyImage(URL.createObjectURL(e.target.files[0]))}
                      />
                      {selectedBodyImage && (
                        <img src={selectedBodyImage} alt="Seleccionada" className="selected-image" />
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Tabla de triángulos con select */}
              <table className="additional-info-table">
                <tbody>
                  <tr>
                    <td>
                      <select onChange={handleSelectImage}>
                        <option value="">Selecciona una imagen</option>
                        {[...Array(24)].map((_, index) => (
                          <option key={index} value={`/images/Imagen${index + 1}.png`}>
                            Imagen {index + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    {/* Contenedor de imágenes seleccionadas desde el select */}
                    <td className="triangle-images-container">
                      {selectedTriangleImages.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt="Triangle"
                          className="selected-image"
                          onClick={() => handleRemoveTriangleImage(img)}
                        />
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="identification-table">
              <table className="risk-table">
                <thead>
                  <tr className="red">
                    <th>Identificación de peligros</th>
                    <th>Si/No</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(protectionImages).map((hazard, idx) => (
                    <tr key={idx}>
                      <td>{hazard}</td>
                      <td>
                        <input
                          type="checkbox"
                          onChange={(e) => handleCheckboxChange(e, hazard)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="evaluation-table">
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
                        {['Catástrofe', 'Varias muertes', 'Muerte', 'Lesiones graves', 'Lesiones con baja', 'Lesiones sin baja'].map((opcion, idx) => (
                          <option key={idx} value={opcion}>{opcion}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select value={exposure} onChange={(e) => setExposure(e.target.value)}>
                        {['Continuamente', 'Frecuentemente', 'Ocasionalmente', 'Irregularmente', 'Raramente'].map((opcion, idx) => (
                          <option key={idx} value={opcion}>{opcion}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select value={probability} onChange={(e) => setProbability(e.target.value)}>
                        {[
                          'Es el resultado más probable y esperado',
                          'Es completamente posible, no será nada extraño',
                          'Sería una secuencia o coincidencia rara pero posible, ha ocurrido',
                          'Coincidencia muy rara, pero se sabe que ha ocurrido',
                          'Coincidencia extremadamente remota pero concebible',
                          'Coincidencia prácticamente imposible, jamás ha ocurrido'
                        ].map((opcion, idx) => (
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
              <table className="risk-classification">
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

              {/* Tabla adicional para mostrar las imágenes de EPP seleccionadas */} 
              <table className="additional-table">
                <tbody>
                  <tr>
                    {selectedEPPImages.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt="EPP"
                        className="selected-image"
                        onClick={() => handleRemoveEPPImage(img)}
                      />
                    ))}
                  </tr>
                </tbody>
              </table>
              
            </div>
          </div>
          <textarea name="textarea"rows="3" cols="212 " id="observaciones" placeholder='Observaciones'></textarea>
        </tbody>
      </table>
      <div className="button-container">
  <button onClick={downloadImage} className="download-button">
    Descargar PDF
  </button>
  <button onClick={saveTableData} className="save-button">
    {isEditing ? 'Actualizar Tabla' : 'Guardar Tabla'}
  </button>
</div>  
    </div>
    
    
    
  );

};

export default RiskTable;
