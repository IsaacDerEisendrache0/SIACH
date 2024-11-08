import React, { useState, useEffect } from 'react';
import './Moviles.css';
import html2canvas from 'html2canvas';
import { addDoc, updateDoc, doc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import logo from '../logos/logo.png';
import Modal from 'react-modal';

const RiskTable = () => {
  // Estados para capturar los datos del formulario
  const [nombreMaquinaria, setNombreMaquinaria] = useState('');
  const [area, setArea] = useState('');
  const [areas, setAreas] = useState([]);
  const [poe, setPoe] = useState('');
  const [tiempoExposicion, setTiempoExposicion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInspeccion, setFechaInspeccion] = useState('');

  // Estados adicionales
  const [consequence, setConsequence] = useState('Lesiones sin baja');
  const [exposure, setExposure] = useState('Ocasionalmente');
  const [probability, setProbability] = useState('Coincidencia extremadamente remota pero concebible');
  const [image, setImage] = useState(null);
  const [selectedBodyImage, setSelectedBodyImage] = useState(null);
  const [selectedEPPImages, setSelectedEPPImages] = useState(['/images/3.png', '/images/4.png', '/images/6.png']);
  const [isEditing, setIsEditing] = useState(false);
  const [tableId, setTableId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [newArea, setNewArea] = useState('');
  const [selectedAreaToRemove, setSelectedAreaToRemove] = useState('');

  useEffect(() => {
    const tableToEdit = JSON.parse(localStorage.getItem('tableToEdit'));
    if (tableToEdit) {
      setArea(tableToEdit.areaSeleccionada || '');
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

  // Manejo de subida de imagen
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const saveTable = async (tableData, tableId = null) => {
    try {
      if (tableId) {
        const docRef = doc(db, 'tablas', tableId);
        await updateDoc(docRef, tableData); // Actualizar en Firestore
        alert('Tabla actualizada con éxito en Firestore.');
      } else {
        await addDoc(collection(db, 'tablas'), tableData); // Guardar en Firestore
        alert('Tabla guardada con éxito en Firestore.');
      }
    } catch (error) {
      console.error('Error al guardar en Firestore:', error);
      alert('Error al guardar la tabla.');
    }
  };

  const downloadImage = () => {
    const input = document.querySelector('.risk-table-container');

    // Aumentamos la escala para una mejor calidad de imagen
    html2canvas(input, { scale: 2, useCORS: true, backgroundColor: null }).then((canvas) => {
      // Convertimos el canvas a imagen (formato PNG)
      const imgData = canvas.toDataURL('image/png');

      // Creamos un enlace para la descarga
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'tabla_herramientas_manual.png'; // Nombre del archivo

      // Simulamos un clic en el enlace para descargar la imagen
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  // Agregar imágenes de EPP seleccionadas
  const handleAddEPPImage = (e) => {
    const selectedImage = e.target.value;
    if (selectedImage && !selectedEPPImages.includes(selectedImage)) {
      setSelectedEPPImages(prevImages => [...prevImages, selectedImage]);
    }
  };

  // Seleccionar imagen de parte del cuerpo
  const handleSelectBodyImage = (e) => {
    const selectedImage = e.target.value;
    setSelectedBodyImage(selectedImage);
  };

  // Remover imágenes de EPP seleccionadas
  const handleRemoveEPPImage = (imageToRemove) => {
    setSelectedEPPImages(prevImages => prevImages.filter(image => image !== imageToRemove));
  };

  // Opciones de evaluación de riesgo
  const opcionesConsecuencia = [
    'Catástrofe', 'Varias muertes', 'Muerte',
    'Lesiones graves', 'Lesiones con baja', 'Lesiones sin baja'
  ];

  const opcionesExposicion = [
    'Continuamente', 'Frecuentemente', 'Ocasionalmente',
    'Irregularmente', 'Raramente'
  ];

  const opcionesProbabilidad = [
    'Es el resultado más probable y esperado',
    'Es completamente posible, no será nada extraño',
    'Sería una secuencia o coincidencia rara pero posible, ha ocurrido',
    'Coincidencia muy rara, pero se sabe que ha ocurrido',
    'Coincidencia extremadamente remota pero concebible',
    'Coincidencia prácticamente imposible, jamás ha ocurrido'
  ];

  // Calcular valores de consecuencia, exposición y probabilidad
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

  // Calcular magnitud del riesgo
  const calcularMagnitudRiesgo = () => {
    const valorConsecuencia = calcularValorConsecuencia(consequence);
    const valorExposicion = calcularValorExposicion(exposure);
    const valorProbabilidad = calcularValorProbabilidad(probability);
    return Math.floor(valorConsecuencia * valorExposicion * valorProbabilidad);
  };

  // Obtener la clasificación del riesgo
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
      areaSeleccionada: area,
      hazards: [], // Definir adecuadamente los hazards si es necesario
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

  const openModal = (action) => {
    setModalAction(action);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleAddArea = () => {
    if (newArea && !areas.includes(newArea)) {
      setAreas([...areas, newArea]);
      setNewArea('');
      alert('Área agregada con éxito.');
    }
    closeModal();
  };

  const handleRemoveArea = () => {
    if (selectedAreaToRemove && areas.includes(selectedAreaToRemove)) {
      setAreas(areas.filter(a => a !== selectedAreaToRemove));
      setArea('');
      alert('Área eliminada con éxito.');
    }
    closeModal();
  };

  return (
    <div className="risk-table-container">
      <div className="logo-container" style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src={logo} alt="SIACH Logo" style={{ width: '200px', marginLeft: '-900px' }} />
      </div>
      <table className="risk-table" style={{ backgroundColor: 'white' }}>
        <thead>
          <tr>
            <th className="red">Nombre de la maquinaria</th>
            <td colSpan="20">
              <input 
                placeholder='Introduzca un nombre' 
                type="text" 
                value={nombreMaquinaria}
                onChange={(e) => setNombreMaquinaria(e.target.value)}
                style={{ width: '100%' }}
              />
            </td>

            <th className="red">Área:</th>
            <td colSpan="10">
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="">Seleccione un área</option>
                {areas.map((area, idx) => (
                  <option key={idx} value={area}>{area}</option>
                ))}
              </select>
              <td>
  <div className="button-group" style={{ display: 'flex', gap: '0' }}>
    <button className='button-area' onClick={() => openModal('Agregar')}>Agregar área</button>
    <button className='button-area' onClick={() => openModal('Eliminar')}>Eliminar área</button>
  </div>
</td>
            </td>
            <th className="red">POE:</th>
            <td colSpan="10">
              <input 
                placeholder='Introduzca el POE' 
                type="text"
                value={poe}
                onChange={(e) => setPoe(e.target.value)}
                style={{ width: '100%' }}
              />
            </td>
            <th className="red">Tiempo de exposición:</th>
            <td colSpan="10">
              <input 
                placeholder='Introduzca el tiempo' 
                type="text"
                value={tiempoExposicion}
                onChange={(e) => setTiempoExposicion(e.target.value)}
                style={{ width: '100%' }}
              />
            </td>
          </tr>
          <tr>
            <th className="red">Descripción de la maquinaria o equipo:</th>
            <td colSpan="30">
              <input 
                placeholder='Introduzca una descripción' 
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                style={{ width: '100%' }}
              />
            </td>
            <th className="red">Fecha de inspección:</th>
            <td colSpan="13">
              <input 
                type="date"
                value={fechaInspeccion}
                onChange={(e) => setFechaInspeccion(e.target.value)}
                style={{ width: '100%' }}
              />
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="image-section" colSpan="3">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ marginBottom: '10px', width: '100%' }} />
                {image && <img src={image} alt="Uploaded" className="uploaded-image" style={{ width: '100%', height: '300px', objectFit: 'cover', border: '1px solid #ccc', borderRadius: '10px' }} />}
              </div>
            </td>
            <td className="risk-info" colSpan="5">
              <h4 className="red" style={{ fontSize: '14px' }}>Identificación de riesgos</h4>
              {[...Array(7)].map((_, index) => (
                <select key={index} style={{ padding: '5px', fontSize: '12px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', marginBottom: '5px' }}>
                  <option value="">Seleccione un riesgo</option>
                  {opcionesConsecuencia.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
                </select>
              ))}
            </td>
            <td className="safety-info" colSpan="3">
              <h4 className="red" style={{ fontSize: '14px' }}>Sistemas de seguridad</h4>
              {[...Array(7)].map((_, index) => (
                <select key={index} style={{ padding: '5px', fontSize: '12px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', marginBottom: '5px' }}>
                  <option value="">Seleccione un sistema de seguridad</option>
                  {opcionesExposicion.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
                </select>
              ))}
            </td>
          </tr>
          <tr>
            <td colSpan="4" className="risk-evaluation-section">
              <table style={{ width: '100%' }}>
                <thead>
                  <tr className="red">
                    <th colSpan="3" style={{ fontSize: '20px' }}>Evaluación de riesgo de trabajo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontSize: '16px' }}>Consecuencia</td>
                    <td style={{ fontSize: '16px' }}>Exposición</td>
                    <td style={{ fontSize: '16px' }}>Probabilidad</td>
                  </tr>
                  <tr>
                    <td>
                      <select value={consequence} onChange={(e) => setConsequence(e.target.value)} style={{ width: '100%' }}>
                        {opcionesConsecuencia.map((opcion, idx) => (
                          <option key={idx} value={opcion}>{opcion}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select value={exposure} onChange={(e) => setExposure(e.target.value)} style={{ width: '100%' }}>
                        {opcionesExposicion.map((opcion, idx) => (
                          <option key={idx} value={opcion}>{opcion}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select value={probability} onChange={(e) => setProbability(e.target.value)} style={{ width: '100%' }}>
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
              <table className="risk-classification" style={{ width: '100%', marginTop: '20px', backgroundColor: 'white' }}>
                <thead>
                  <tr className="red">
                    <th colSpan="3" style={{ fontSize: '20px', color: 'black' }}>Clasificación de Magnitud de Riesgo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ backgroundColor: color }}>
                    <td style={{ fontSize: '16px' }}>Magnitud del Riesgo: {magnitudRiesgo}</td>
                    <td style={{ fontSize: '16px' }}>Clasificación: {clasificacion}</td>
                    <td style={{ fontSize: '16px' }}>Acción: {accion}</td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td style={{ verticalAlign: 'top' }}>
              <div style={{ marginTop: '20px' }}>
                <h4 className="red" style={{ display: 'inline-block', marginRight: '10px', fontSize: '14px' }}>Equipo de Protección Personal Sugerido</h4>
                <select onChange={handleSelectBodyImage} style={{ width: '100%', height: '30px', marginLeft: '10px' }}>
                  <option value="">Seleccione Imagen del cuerpo</option>
                  {Object.keys(optionImages).map((key) => (
                    <option key={key} value={optionImages[key]}>{key}</option>
                  ))}
                </select>
                {selectedBodyImage && <img src={selectedBodyImage} alt="Selected Body Part" style={{ width: '60%', height: 'auto', marginTop: '10px' }} />}
              </div>
            </td>
            <td colSpan="20" className="epp-suggested" style={{ verticalAlign: 'top' }}>
              <div style={{ marginTop: '20px' }}>
                <h4 className="red" style={{ display: 'inline-block', marginRight: '10px', fontSize: '14px' }}>Seleccione EPP</h4>
                <select onChange={handleAddEPPImage} style={{ width: '100%', height: '30px', marginRight: '20px' }}>
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
      <div style={{ marginTop: '20px' }}>
        <button onClick={downloadImage} className="download-button">
          Descargar PDF
        </button>
        <button onClick={saveTableData} className="save-button">
          {isEditing ? 'Actualizar Tabla' : 'Guardar Tabla'}
        </button>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Área Modal"
        ariaHideApp={false}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight:'-50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <h2>{modalAction} Área</h2>
        <div>
          {modalAction === 'Agregar' && (
            <div>
              <input
                type="text"
                placeholder="Nombre del área"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                style={{ marginBottom: '10px', width: '100%' }}
              />
              <button onClick={handleAddArea}>Confirmar Agregar Área</button>
            </div>
          )}
          {modalAction === 'Eliminar' && (
            <div>
              <select
                value={selectedAreaToRemove}
                onChange={(e) => setSelectedAreaToRemove(e.target.value)}
                style={{ marginBottom: '10px', width: '100%' }}
              >
                <option value="">Seleccione un área para eliminar</option>
                {areas.map((area, idx) => (
                  <option key={idx} value={area}>{area}</option>
                ))}
              </select>
              <button onClick={handleRemoveArea}>Confirmar Eliminar Área</button>
            </div>
          )}
          <button onClick={closeModal}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
};

export default RiskTable;
