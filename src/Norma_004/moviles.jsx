import React, { useState, useEffect } from 'react';
import './Moviles.css';
import html2canvas from 'html2canvas';
import { getDoc, setDoc, doc, addDoc, collection, updateDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { db } from '../firebase';
import logo from '../logos/logo.png';
import Maxion from '../logos/maxion.jpeg';
import Safran from '../logos/safran.jpeg';
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
  const [puestos, setPuestos] = useState([]);
  const [newPuesto, setNewPuesto] = useState('');
  const [selectedPuestoToRemove, setSelectedPuestoToRemove] = useState('');
  const [tableId, setTableId] = useState(null); // Agregar esta línea


  // Estados adicionales
  const [consequence, setConsequence] = useState('Lesiones sin baja');
  const [exposure, setExposure] = useState('Ocasionalmente');
  const [probability, setProbability] = useState('Coincidencia extremadamente remota pero concebible');
  const [image, setImage] = useState(null);
  const [selectedBodyImage, setSelectedBodyImage] = useState(null);
  const [selectedEPPImages, setSelectedEPPImages] = useState(['/images/3.png', '/images/4.png', '/images/6.png']);
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [newArea, setNewArea] = useState('');
  const [selectedAreaToRemove, setSelectedAreaToRemove] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [logoSeleccionado, setLogoSeleccionado] = useState(null);

  const logos = [
    { nombre: 'Maxion', url: Maxion },
    { nombre: 'Safran', url: Safran }
  ];

  useEffect(() => {

  const savedAreas = JSON.parse(localStorage.getItem('areas'));
  if (savedAreas) {
    setAreas(savedAreas);
  }

  const savedPuestos = JSON.parse(localStorage.getItem('puestos'));
  if (savedPuestos) {
    setPuestos(savedPuestos);
  }

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

  // Manejo de subida de imagen o captura de foto
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleLogoChange = (event) => {
    setLogoSeleccionado(event.target.value);
  };

  const handleRemoveLogo = () => {
    setLogoSeleccionado(null);
  };



  const downloadImage = () => {
    setIsCapturing(true);
    setTimeout(() => {
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
        setIsCapturing(false);
      });
    }, 100);
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

  const opcionesIdentificaciones = [
'Riesgo de incendio','Riesgo de atrapamiento o volcadura','Riesgo de choque o atropello',
'Riesgo de descarga eléctrica',
'Exposición a temperaturas elevadas y abatidas','Vibración','Riesgo inundación',
'Ventilación deficiente','Daños ergonómicos','Sustancia químicas','Poca iluminación','Particulas suspendidas en el ambiente',


  ];

  const opcionesSistemaseguridad = [
  'Paro de emergencia','Sistema ANSUL','Extintores','freno de emergencia',
'Bandas antiestática','Sistema de anclaje','Programa de mantenimiento',
'Guardas, parachoques y protectores de calaveras','Calza de seguridad','Bloqueo de sistema hidráulico ',
'Indicadores (torreta,luces,claxon,banderas, etc)','Bloqueo de sistema eléctrico','Cinturón de seguridad',
'Barandales y escaleras','Indicadores agua,aceite aire,motor, presión,etc','Canopy','Mata chispas','Sistema loto',

  ];
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
      'Catástrofe': 100,
      'Varias muertes': 50,
      'Muerte': 25,
      'Lesiones graves': 15,
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
      'Raramente': 1,
      'Remotamente': 0.1
    };
    return valoresExposicion[exposure] || 0;
  };

  const calcularValorProbabilidad = (probability) => {
    const valoresProbabilidad = {
      'Es el resultado más probable y esperado': 10,
      'Es completamente posible, no será nada extraño': 6,
      'Sería una secuencia o coincidencia rara pero posible, ha ocurrido': 3,
      'Coincidencia muy rara, pero se sabe que ha ocurrido': 1,
      'Coincidencia extremadamente remota pero concebible': 0.5,
      'Coincidencia prácticamente imposible, jamás ha ocurrido': 0.1
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

  const saveTableData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    const uid = user.uid; // UID del usuario autenticado
    const magnitud = calcularMagnitudRiesgo();
    const { clasificacion } = obtenerClasificacionRiesgo(magnitud);
  
    const tableData = {
      uid,
      nombreMaquinaria,
      poe,
      tiempoExposicion,
      descripcion,
      fechaInspeccion: fechaInspeccion || new Date().toLocaleDateString(),
      consequence,
      exposure,
      probability,
      magnitud,
      clasificacion,
      selectedEPPImages,
      selectedBodyImage,
      area,
      puestos,
    };

    try {
      if (isEditing && tableId) {
        const tableRef = doc(db, 'tablas', tableId);
        await updateDoc(tableRef, tableData);
        alert('Tabla actualizada exitosamente.');
      } else {
        const tableRef = await addDoc(collection(db, 'tablas'), tableData);
        setTableId(tableRef.id);
        alert('Tabla guardada exitosamente.');
      }

      if (area) {
        await updateResumenData(area, magnitud, clasificacion, uid);
      }
    } catch (error) {
      console.error('Error al guardar datos:', error);
      alert('Hubo un problema al guardar la tabla.');
    }
  };
  
  
  

  const updateResumenData = async (area, magnitud, clasificacion, uid) => {
    if (!area) {
      console.error("El área no está definida. No se puede actualizar el resumen.");
      return;
    }
  
    try {
      // Referencia al documento en la colección 'resumen' usando el área como ID
      const resumenRef = doc(db, 'resumen', area);
  
      // Intenta obtener el documento existente
      const resumenSnapshot = await getDoc(resumenRef);
  
      // Datos iniciales si el documento no existe
      let resumenData = resumenSnapshot.exists()
        ? resumenSnapshot.data()
        : {
            uid,
            tolerable: 0,
            moderado: 0,
            notable: 0,
            elevado: 0,
            grave: 0,
            puestos: [],
          };
  
      // Encuentra si el puesto ya existe en los datos del resumen
      const puestoExistenteIndex = resumenData.puestos.findIndex(
        (p) => p.nombre === newPuesto
      );
  
      if (puestoExistenteIndex !== -1) {
        // Si el puesto ya existe, resta los valores previos de los totales
        const puestoExistente = resumenData.puestos[puestoExistenteIndex];
        resumenData.tolerable -= puestoExistente.tolerable;
        resumenData.moderado -= puestoExistente.moderado;
        resumenData.notable -= puestoExistente.notable;
        resumenData.elevado -= puestoExistente.elevado;
        resumenData.grave -= puestoExistente.grave;
  
        // Elimina el puesto existente
        resumenData.puestos.splice(puestoExistenteIndex, 1);
      }
  
      // Calcular los valores de riesgo basados en la magnitud
      const puestoRiesgo = {
        nombre: newPuesto,
        tolerable: magnitud <= 20 ? 1 : 0,
        moderado: magnitud > 20 && magnitud <= 70 ? 1 : 0,
        notable: magnitud > 70 && magnitud <= 200 ? 1 : 0,
        elevado: magnitud > 200 && magnitud <= 400 ? 1 : 0,
        grave: magnitud > 400 ? 1 : 0,
      };
  
      // Agrega el nuevo puesto con sus valores actualizados
      resumenData.puestos.push(puestoRiesgo);
  
      // Actualiza los totales con los nuevos valores del puesto
      resumenData.tolerable += puestoRiesgo.tolerable;
      resumenData.moderado += puestoRiesgo.moderado;
      resumenData.notable += puestoRiesgo.notable;
      resumenData.elevado += puestoRiesgo.elevado;
      resumenData.grave += puestoRiesgo.grave;
  
      // Guarda los datos actualizados en Firestore
      await setDoc(resumenRef, resumenData);
  
      console.log('Resumen actualizado exitosamente:', resumenData);
    } catch (error) {
      console.error('Error al actualizar los datos del resumen:', error);
    }
  };
  
  
  const openModal = (action) => {
    setModalAction(action);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  useEffect(() => {
  // Restaurar áreas y puestos desde localStorage
  const savedAreas = JSON.parse(localStorage.getItem('areas'));
  if (savedAreas) {
    setAreas(savedAreas);
  }

  const savedPuestos = JSON.parse(localStorage.getItem('puestos'));
  if (savedPuestos) {
    setPuestos(savedPuestos);
  }

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
    setIsEditing(true);
    localStorage.removeItem('tableToEdit');
    setTableId(tableToEdit.id); // Establece el ID de la tabla al entrar en modo edición
    setIsEditing(true);
  }

  const table = document.getElementById("body-parts-table");
  const cells = table.querySelectorAll('td[data-check="true"]');

  cells.forEach((cell) => {
    cell.addEventListener("click", () => {
      if (cell.textContent.trim() === "X") {
        cell.textContent = "";
      } else {
        cell.textContent = "X";
      }
    });
  });

  // Limpieza de eventos para evitar duplicación
  return () => {
    cells.forEach((cell) => {
      cell.removeEventListener("click", () => {});
    });
  };
}, []);



const handleAddArea = () => {
  if (newArea.trim() && !areas.some((area) => area.nombre === newArea.trim())) {
    const updatedAreas = [...areas, { nombre: newArea.trim() }];
    setAreas(updatedAreas);
    localStorage.setItem('areas', JSON.stringify(updatedAreas));
    setNewArea('');
    alert('Área agregada con éxito.');
  } else {
    alert('El área ya existe o está vacía.');
  }
  closeModal();
};

const handleRemoveArea = () => {
  if (selectedAreaToRemove) {
    const updatedAreas = areas.filter((area) => area.nombre !== selectedAreaToRemove.nombre);
    setAreas(updatedAreas);
    localStorage.setItem('areas', JSON.stringify(updatedAreas));
    setArea('');
    alert('Área eliminada con éxito.');
  } else {
    alert('Por favor selecciona un área para eliminar.');
  }
  closeModal();
};

const handleAddPuesto = () => {
  if (newPuesto.trim() && !puestos.some((puesto) => puesto.nombre === newPuesto.trim())) {
    const updatedPuestos = [...puestos, { nombre: newPuesto.trim() }];
    setPuestos(updatedPuestos);
    localStorage.setItem('puestos', JSON.stringify(updatedPuestos));
    setNewPuesto('');
    alert('Puesto agregado con éxito.');
  } else {
    alert('El puesto ya existe o está vacío.');
  }
};

const handleRemovePuesto = () => {
  if (selectedPuestoToRemove) {
    const updatedPuestos = puestos.filter((puesto) => puesto.nombre !== selectedPuestoToRemove.nombre);
    setPuestos(updatedPuestos);
    localStorage.setItem('puestos', JSON.stringify(updatedPuestos));
    alert('Puesto eliminado con éxito.');
    setSelectedPuestoToRemove(null); // Limpia el valor seleccionado
  } else {
    alert('Por favor selecciona un puesto para eliminar.');
  }
};

// Selecciona todas las celdas que son clicables





  return (
    <div className="risk-table-container">
      <div className="logo-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src={logo} alt="SIACH Logo" className="siach-logo" style={{ marginRight: '5px' }} />
        <h4 className="section-header" style={{ color: 'black' }}>
          ANÁLISIS DE RIESGO POTENCIAL GENERADO POR EQUIPOS MÓVILES
          NOM-004-STPS-1999
        </h4>
{logoSeleccionado ? (
  <div className="logo-container" style={{ display: 'flex', alignItems: 'center' }}>
    <img src={logoSeleccionado} alt="Logo de la Empresa" className="company-logo" style={{ marginLeft: '20px', width: '100px', height: 'auto' }} />
    <button onClick={handleRemoveLogo} className="remove-logo-button" style={{ marginLeft: '10px' }}>×</button>
  </div>
) : (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <input
      type="file"
      accept="image/*"
      onChange={(event) => {
        const file = event.target.files[0];
        if (file) {
          const imageUrl = URL.createObjectURL(file);
          setLogoSeleccionado(imageUrl);
        }
      }}
      style={{ cursor: 'pointer', padding: '5px' }}
    />
   
  </div>
)}

        

      </div>
    
      <table className="risk-table" style={{ backgroundColor: 'white' }}>
        <thead>
          <tr>
            <th className="red">Nombre de la maquinaria</th>
            <td colSpan="25">
              <textarea
                placeholder='Introduzca un nombre' 
                type="text" 
                value={nombreMaquinaria}
                onChange={(e) => setNombreMaquinaria(e.target.value)}
                style={{ width: '100%' }}
              />
            </td>

            <th className="red">Área:</th>
            <td colSpan="10">
            <select name="areas" value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Seleccione un área</option>
            {areas
              .filter((area) => area && area.nombre) // Filtra valores inválidos
              .map((area, index) => (
                <option key={index} value={area.nombre}>
                  {area.nombre}
                </option>
              ))}
          </select>

            </td>

            <th className="red">POE:</th>
            <td colSpan="20">
              <input 
                placeholder='Introduzca el POE' 
                type="text"
                value={poe}
                onChange={(e) => setPoe(e.target.value)}
                style={{ width: '100%' }}
              />
            </td>
            <th className="red">Tiempo de exposición:</th>
            <td colSpan="15">
              <textarea 
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
            <td colSpan="56">
              <textarea
                placeholder='Introduzca una descripción' 
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                style={{ width: '100%' }}
              />
            </td>
            <th className="red">Fecha de inspección:</th>
            <td colSpan="12">
              <input 
                type="date"
                value={fechaInspeccion}
                onChange={(e) => setFechaInspeccion(e.target.value)}
                style={{ width: '100%' }}
              />
            </td>
            <th className="red">PUESTOS</th>
            <td colSpan="10">
            <select name="puestos" value={newPuesto} onChange={(e) => setNewPuesto(e.target.value)}>
            <option value="">Seleccione un puesto</option>
            {puestos
              .filter((puesto) => puesto && puesto.nombre) // Filtra valores inválidos
              .map((puesto, index) => (
                <option key={index} value={puesto.nombre}>
                  {puesto.nombre}
                </option>
              ))}
            </select>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr>
          <tr>
  <td className="image-section" colSpan="3">
    <div
      className="uploaded"
      onClick={() => document.getElementById('upload-image').click()}
    >
      {image ? (
        <img src={image} alt="Uploaded" />
      ) : (
        <p className="image-placeholder">Haz clic para cargar una imagen</p>
      )}
    </div>
    <input
      id="upload-image"
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      style={{ display: 'none' }}
    />
  </td>
</tr>



            <td className="risk-info" colSpan="5">
              <h4 className="red" style={{ fontSize: '14px' }}>Identificación de riesgos</h4>
              {[...Array(7)].map((_, index) => (
                <select key={index} style={{ padding: '5px', fontSize: '12px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', marginBottom: '5px' }}>
                  <option value="">Seleccione un riesgo</option>
                  {opcionesIdentificaciones.map((opt, idx) => (
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
                  {opcionesSistemaseguridad.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
                </select>
              ))}
            </td>
          </tr>
          <table id="body-parts-table">
        <tr>
            <th colspan="6">Principales partes del cuerpo expuestas al riesgo:</th>
        </tr>
        <tr>
            <td data-part="Cabeza y Oídos">Cabeza y Oídos</td>
            <td data-check="true"></td>
            <td data-part="Ojos y Cara">Ojos y Cara</td>
            <td data-check="true"></td>
            <td data-part="Sistema respiratorio">Sistema respiratorio</td>
            <td data-check="true"></td>
        </tr>
        <tr>
            <td data-part="Brazos y Manos">Brazos y Manos</td>
            <td data-check="true"></td>
            <td data-part="Tronco">Tronco</td>
            <td data-check="true"></td>
            <td data-part="Extremidades inferiores">Extremidades inferiores</td>
            <td data-check="true"></td>
        </tr>
    </table>
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
            <td style={{ verticalAlign: 'top', width: '10%' }} className='epp-suggested' colSpan="">
              <div style={{ marginTop: '20px' }}>
                <h6 className="red" style={{ display: 'inline-block', marginRight: '200px', fontSize: '14px' }}>Protección sugerido</h6>
                <select onChange={handleSelectBodyImage} style={{ width: '80%', height: '30px', marginLeft: '30x' }}>
                  <option value="">Seleccione Imagen del cuerpo</option>
                  {Object.keys(optionImages).map((key) => (
                    <option key={key} value={optionImages[key]}>{key}</option>
                  ))}
                </select>
                {selectedBodyImage && <img src={selectedBodyImage} alt="Selected Body Part" style={{ width: '70%', height: 'auto', marginTop: '10px' }} />}
              </div>
            </td>
            <td colSpan="10" className="epp-suggested" style={{ verticalAlign: 'top', width: '23%' }}>
              <div style={{ marginTop: '20px' }}>
                <h5 className="red" style={{ display: 'inline-block', marginRight: '10px', fontSize: '14px' }}>Seleccione EPP</h5>
                <select onChange={handleAddEPPImage} style={{ width: '70%', height: '30px', marginRight: '20px' }}>
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
      {!isCapturing && (
        <div style={{ marginTop: '20px' }}>
          <button onClick={downloadImage} className="download-button">
            Descargar PDF
          </button>
          <button onClick={saveTableData} className="save-button">
            {isEditing ? 'Actualizar Tabla' : 'Guardar Tabla'}
          </button>
        </div>
      )}
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
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  }}
>
  <h2>{modalAction} Área</h2>
  <div>
    {/* Modal para agregar áreas */}
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

    {/* Modal para eliminar áreas */}
    {modalAction === 'Eliminar' && (
      <div>
        <select
          value={selectedAreaToRemove?.nombre || ''}
          onChange={(e) =>
            setSelectedAreaToRemove(areas.find((area) => area.nombre === e.target.value))
          }
          style={{ marginBottom: '10px', width: '100%' }}
        >
          <option value="">Seleccione un área para eliminar</option>
          {areas.map((area, idx) => (
            <option key={idx} value={area.nombre}>
              {area.nombre}
            </option>
          ))}
        </select>
        <button onClick={handleRemoveArea}>Confirmar Eliminar Área</button>
      </div>
    )}

    {/* Opciones de gestión de puestos */}
    <div style={{ marginTop: '20px' }}>
      <h2>Puestos</h2>
      {/* Agregar puesto */}
      <input
        type="text"
        placeholder="Nombre del puesto"
        value={newPuesto}
        onChange={(e) => setNewPuesto(e.target.value)}
        style={{ marginBottom: '10px', width: '100%' }}
      />
      <button onClick={handleAddPuesto} style={{ marginRight: '10px' }}>
        Agregar Puesto
      </button>

      {/* Eliminar puesto */}
      <select
        value={selectedPuestoToRemove?.nombre || ''}
        onChange={(e) =>
          setSelectedPuestoToRemove(puestos.find((puesto) => puesto.nombre === e.target.value))
        }
        style={{ marginBottom: '10px', width: '100%' }}
      >
        <option value="">Seleccione un puesto para eliminar</option>
        {puestos.map((puesto, idx) => (
          <option key={idx} value={puesto.nombre}>
            {puesto.nombre}
          </option>
        ))}
      </select>
      <button onClick={handleRemovePuesto}>Eliminar Puesto</button>
    </div>
    <button onClick={closeModal} style={{ marginTop: '20px' }}>
      Cancelar
    </button>
  </div>
</Modal>

      {!isCapturing && (
        <div className="button-group" style={{ display: 'flex', gap: '0' }}>
          <button className='button-area' onClick={() => openModal('Agregar')}>Agregar área</button>
          <button className='button-area' onClick={() => openModal('Eliminar')}>Eliminar área</button>
                                                    
        </div>
      )}
    </div>
    
  );
};

export default RiskTable;