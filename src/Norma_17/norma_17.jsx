import html2canvas from 'html2canvas';
import './Table17.css';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { collection, addDoc, getDocs, updateDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Importar la configuración de Firebase
import logo from '../logos/logo.png';
import maxion from '../logos/maxion.jpeg';
import safran from '../logos/safran.jpeg';
import { getAuth } from "firebase/auth";






const RiskAssessmentTable = () => {

  const [areas, setAreas] = useState([
    {
      nombre: 'Producción',
      puestos: [
        'Ayudante de empaque y envase',
        'Ayudante de limpieza',
        'Operador de peletizadora',
        'Dosificador de micros',
        'Operador de rolado',
        'Operador de molino',
        'Dosificador de mezclas',
        'Coordinador de mantenimiento',
        'Ayudante de mantenimiento',
        'Operador de caldera',
        'Ayudante de mantenimiento soldadura',
        'Ayudante de mantenimiento eléctrico',
        'Ayudante de mantenimiento mecánico',
        'Embolsador',
        'Auxiliar de calidad',
        'Ayudante de albañil',
        'Supervisor de planta',
        'Recibidor de granos',
        'Coordinador de empaque',
        'Coordinador de seguridad e higiene',
        'MVZ. Responsable',
        'Superintendente de producción',
        'Ingeniero en proyectos',
      ],
    },
    {
      nombre: 'Operación',
      puestos: [
        'Ayudante de almacén',
        'Almacenista',
        'Montacarguista',
        'Operador de enmelazadora',
        'Investigación y desarrollo',
      ],
    },
    {
      nombre: 'Envase y empaque',
      puestos: [
        'Envasador',
        'Ayudante de empaque, envase (Cosedor)',
        'Estibadores',
        'Ayudante de empaque, envase (Circulante)',
        'Ayudante de empaque, envase (amarrador)',
      ],
    },
    {
      nombre: 'Ventas',
      puestos: ['Estibador', 'Repartidor', 'Chofer'],
    },
  ]);


  const [isEditing, setIsEditing] = useState(false); // Estado para modo de edición

  const [hazards, setHazards] = useState({
    'Caídas de Altura': false,
    'Exposición a Temperaturas': false,
    'Exposición a Electricidad Estática': false,
    'Exposición a Sustancias Químicas': false,
    'Exposición a Radiaciones': false,
    'Exposición agentes Biológicos': false,
    'Exposición a Ruido': false,
    'Exposición a Vibraciones': false,
    'Superficies cortantes': false,
    'Caídas a nivel o desnivel': false,
    'Daños Ergonómicos': false,
    'Calentamiento de materia prima, subproducto o producto': false,
    'Proyección de material o herramienta': false,
    'Mantenimiento preventivo, correctivo o predictivo': false,
  });

  const bodyParts = {
    'Caídas de Altura': ['Cabeza y Oídos', 'Brazos y Manos', 'Tronco', 'Extremidades inferiores'],
    'Exposición a Temperaturas': ['Ojos y Cara', 'Brazos y Manos', 'Tronco'],
    'Exposición a Electricidad Estática': ['Brazos y Manos', 'Tronco'],
    'Exposición a Sustancias Químicas': ['Cabeza y Oídos', 'Ojos y Cara', 'Brazos y Manos', 'Tronco', 'Sistema respiratorio', 'Extremidades inferiores'],
    'Exposición a Radiaciones': ['Cabeza y Oídos', 'Ojos y Cara', 'Tronco', 'Extremidades inferiores'],
    'Exposición agentes Biológicos': ['Ojos y Cara', 'Tronco', 'Sistema respiratorio', 'Extremidades inferiores'],
    'Exposición a Ruido': ['Cabeza y Oídos'],
    'Exposición a Vibraciones': ['Brazos y Manos', 'Tronco', 'Extremidades inferiores'],
    'Superficies cortantes': ['Ojos y Cara', 'Brazos y Manos', 'Extremidades inferiores'],
    'Caídas a nivel o desnivel': ['Cabeza y Oídos', 'Ojos y Cara', 'Brazos y Manos', 'Tronco', 'Extremidades inferiores'],
    'Daños Ergonómicos': ['Brazos y Manos', 'Tronco', 'Extremidades inferiores'],
    'Calentamiento de materia prima, subproducto o producto': ['Ojos y Cara', 'Brazos y Manos', 'Tronco', 'Extremidades inferiores'],
    'Proyección de material o herramienta': ['Ojos y Cara', 'Brazos y Manos', 'Tronco'],
    'Mantenimiento preventivo, correctivo o predictivo': ['Ojos y Cara', 'Brazos y Manos', 'Tronco'],
  };

  const protectionImages = {
    'Caídas de Altura': ['/images/10.png', '/images/34.png', '/images/4.png'], // Reemplaza con la ruta real de la imagen
    'Exposición a Temperaturas': ['/images/6.png', '/images/21.png', '/images/14.png'],
    'Exposición a Electricidad Estática': ['/images/6.png', '/images/4.png' , '/images/9.png'],
    'Exposición a Sustancias Químicas': ['/images/7.png', '/images/13.png', '/images/6.png', '/images/17.png'],
    'Exposición a Radiaciones': ['/images/16.png'], 
    'Exposición agentes Biológicos': ['/images/18.png', '/images/16.png'], 
    'Exposición a Ruido': ['/images/19.png', '/images/5.png'],
    'Exposición a Vibraciones': ['/images/19.png', '/images/6.png' , '/images/4.png'],
    'Superficies cortantes': ['/images/6.png', '/images/1.png', '/images/21.png'],
    'Caídas a nivel o desnivel':  ['/images/4.png', '/images/34.png'],
    'Daños Ergonómicos':  ['/images/15.png'],
    'Calentamiento de materia prima, subproducto o producto':  ['/images/6.png', '/images/15.png' , '/images/9.png', '/images/4.png'],
    'Proyección de material o herramienta':  ['/images/7.png', '/images/12.png', '/images/21.png'],
    'Mantenimiento preventivo, correctivo o predictivo':  ['/images/12.png', '/images/3.png'],
  };

   // Coloca los hooks dentro del componente funcional
  const [areaSeleccionada, setAreaSeleccionada] = useState(areas[0].nombre);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState('');
  const [puestos, setPuestos] = useState(areas[0].puestos);
  const [descripcionActividad, setDescripcionActividad] = useState(''); // Descripción de la actividad
  

  
  


  const handleAreaChange = (e) => {
    const selectedArea = areas.find((area) => area.nombre === e.target.value);
    setAreaSeleccionada(selectedArea.nombre);
    setPuestos(selectedArea.puestos); // Actualiza los puestos según el área seleccionada
    setPuestoSeleccionado(''); // Reinicia el puesto seleccionado cuando cambia el área
  };

  const handlePuestoChange = (e) => {
    setPuestoSeleccionado(e.target.value);
  };


  const handleCheckboxChange = (event) => {
    const hazard = event.target.name;
    const isChecked = event.target.checked;
  
    // Actualizamos el estado del checkbox
    setHazards({
      ...hazards,
      [hazard]: isChecked,
    });
  
    // Lógica específica para "Exposición a Ruido"
    if (hazard === 'Exposición a Ruido') {
      if (isChecked && protectionImages[hazard].length > 1) {
        // Abre el modal solo si hay más de una imagen asociada a "Exposición a Ruido"
        setSelectedImagesForHazard(protectionImages[hazard]);
        setHazardWithImages(hazard);
        setIsImageModalOpen(true);
      } else if (isChecked && protectionImages[hazard].length === 1) {
        // Si solo hay una imagen, la selecciona directamente
        const image = protectionImages[hazard][0];
        if (!selectedImages.includes(image)) {
          setSelectedImages((prevSelectedImages) => [...prevSelectedImages, image]);
        }
      } else {
        // Si se deselecciona "Exposición a Ruido", elimina las imágenes asociadas
        setSelectedImages((prevSelectedImages) =>
          prevSelectedImages.filter((image) => !protectionImages[hazard].includes(image))
        );
      }
    } else {
      // Para otros peligros
      if (isChecked) {
        // Añade todas las imágenes asociadas directamente al seleccionarlo
        const newImages = protectionImages[hazard] || [];
        setSelectedImages((prevSelectedImages) => [
          ...prevSelectedImages,
          ...newImages.filter((image) => !prevSelectedImages.includes(image)),
        ]);
      } else {
        // Elimina las imágenes asociadas si se deselecciona
        setSelectedImages((prevSelectedImages) =>
          prevSelectedImages.filter((image) => !protectionImages[hazard].includes(image))
        );
      }
    }
  };
  
  

  const getAffectedBodyParts = () => {
    const affectedParts = new Set();
    for (const [hazard, isChecked] of Object.entries(hazards)) {
      if (isChecked) {
        bodyParts[hazard].forEach(part => affectedParts.add(part));
      }
    }
    return Array.from(affectedParts); 
  };

  const affectedBodyParts = getAffectedBodyParts();

  // Estados para los valores de Consecuencia, Exposición y Probabilidad
  const [consequence, setConsequence] = useState(1);
  const [exposure, setExposure] = useState(1);
  const [probability, setProbability] = useState(0.1);

  // Función para calcular el riesgo total
  const calculateRisk = () => {
    const risk = consequence * exposure * probability;
    console.log('Risk:', risk); // Añade esto para ver el valor del riesgo en la consola
    return risk;
  };

  
  
  
  

  // Función para obtener el color basado en el riesgo
  const getRiskColor = (risk) => {
    if (risk > 400) return 'red'; // Muy Alto
    if (risk > 200) return 'orange'; // Alto
    if (risk > 70) return 'yellow'; // Notable
    if (risk > 20) return 'green'; // Moderado
    return 'blue'; // Bajo o Aceptable
  };
  

  // Manejadores de cambio para los selectores
  const handleConsequenceChange = (event) => setConsequence(Number(event.target.value));
  const handleExposureChange = (event) => setExposure(Number(event.target.value));
  const handleProbabilityChange = (event) => setProbability(Number(event.target.value));
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar si el modal está abierto o cerrado
  const [puestosSeleccionadosParaBorrar, setPuestosSeleccionadosParaBorrar] = useState([]); // Estado para almacenar los puestos seleccionados para borrar
  const [selectedImagesForHazard, setSelectedImagesForHazard] = useState([]); // Estado para las imágenes del peligro seleccionado
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Estado para abrir o cerrar el modal de selección de imagen
  const [hazardWithImages, setHazardWithImages] = useState('');
  const [selectedHazardImages, setSelectedHazardImages] = useState({}); // Para almacenar las imágenes seleccionadas por peligro
  const [selectedImages, setSelectedImages] = useState([]); // Para almacenar las imágenes seleccionadas para "Equipo de protección personal sugerido"


  const [selectedOptionEquipoUtilizado, setSelectedOptionEquipoUtilizado] = useState('');
  const [selectedOptionProteccionSugerida, setSelectedOptionProteccionSugerida] = useState('');


  const handleOptionChangeEquipoUtilizado = (event) => {
    setSelectedOptionEquipoUtilizado(event.target.value);
  };
  
  const handleOptionChangeProteccionSugerida = (event) => {
    setSelectedOptionProteccionSugerida(event.target.value);
  };
  


  const optionImages = {
    option1: '/body/lvl1_head.png',
    option2: '/body/lvl1_mid.png',
    option3: '/body/lvl1_foot.png',
    option4: '/body/lvl1_hand.png',
    option5: '/body/lvl2_headmid.png',
    option6: '/body/lvl2_handfoot.png',
    option7: '/body/lvl2_headfoot.png',
    option8: '/body/lvl2_headhand.png',
    option9: '/body/lvl2_headmid.png',
    option10: '/body/lvl2_midhand.png',
    option11: '/body/lvl3_all.png',

  };

  const downloadImage = () => {
    // Selecciona todos los botones que deben ocultarse
    const buttons = document.querySelectorAll(
      '.btn-agregar, .btn-borrar, .download-button, .save-button'
    );
  
    // Oculta los botones temporalmente
    buttons.forEach(button => button.classList.add('hidden-buttons'));
  
    // Selecciona la tabla principal para capturar
    const tableElement = document.querySelector('.main-table');
  
    html2canvas(tableElement, {
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      windowWidth: tableElement.scrollWidth,
      windowHeight: tableElement.scrollHeight,
      useCORS: true,
      backgroundColor: '#ffffff', // Fondo blanco explícito
      scale: 2, // Mejora la calidad
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'tabla_herramientas_manual.png';
  
        // Descargar la imagen
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
  
        // Restaurar los botones después de la captura
        buttons.forEach(button => button.classList.remove('hidden-buttons'));
      })
      .catch((error) => {
        console.error('Error al capturar la tabla:', error);
  
        // Asegurarse de restaurar los botones incluso si ocurre un error
        buttons.forEach(button => button.classList.remove('hidden-buttons'));
      });
  };
  
const handleDeletePuestoClick = () => {
  setIsModalOpen(true); // Abrir el modal cuando se presiona "Borrar"
};

const handleModalClose = () => {
  setIsModalOpen(false); // Cerrar el modal
};

const handlePuestoSelectionChange = (event) => {
  const value = event.target.value;
  const alreadySelected = puestosSeleccionadosParaBorrar.includes(value);

  if (alreadySelected) {
    setPuestosSeleccionadosParaBorrar(
      puestosSeleccionadosParaBorrar.filter((puesto) => puesto !== value)
    );
  } else {
    setPuestosSeleccionadosParaBorrar([...puestosSeleccionadosParaBorrar, value]);
  }
};

useEffect(() => {
  // Creamos una clave específica para el área seleccionada
  const areaSeleccionadaKey = `puestos_${areaSeleccionada}`;

  const savedPuestos = JSON.parse(localStorage.getItem(areaSeleccionadaKey));

  // Verificamos si los datos en localStorage son válidos
  if (savedPuestos && savedPuestos.length > 0 && savedPuestos.includes("Puesto 1") && savedPuestos.includes("Puesto 2")) {
    // Si los valores guardados son incorrectos, los eliminamos
    localStorage.removeItem(areaSeleccionadaKey);
    setPuestos(areas.find(area => area.nombre === areaSeleccionada).puestos); // Inicializa con los puestos del área seleccionada
  } else if (savedPuestos && savedPuestos.length > 0) {
    setPuestos(savedPuestos); // Si los datos son válidos, los cargamos
  } else {
    setPuestos(areas.find(area => area.nombre === areaSeleccionada).puestos); // Inicializa con los puestos del área seleccionada
    localStorage.setItem(areaSeleccionadaKey, JSON.stringify(areas.find(area => area.nombre === areaSeleccionada).puestos)); // Guardamos los valores iniciales en localStorage
  }
}, [areaSeleccionada]);



// Función para agregar un nuevo puesto
const handleAddPuestoClick = () => {
  const nuevoPuesto = prompt("Ingrese el nuevo puesto:");
  if (nuevoPuesto && nuevoPuesto.trim() !== "") {
    const updatedPuestos = [...puestos, nuevoPuesto.trim()];
    setPuestos(updatedPuestos); // Actualizamos el estado con el nuevo puesto

    // Guardamos los puestos actualizados en localStorage para el área seleccionada
    const areaSeleccionadaKey = `puestos_${areaSeleccionada}`;
    localStorage.setItem(areaSeleccionadaKey, JSON.stringify(updatedPuestos));

    setPuestoSeleccionado(''); // Limpiar la selección del dropdown después de agregar
  }

  if (puestoSeleccionado && !puestos.includes(puestoSeleccionado)) {
    const updatedPuestos = [...puestos, puestoSeleccionado];
    setPuestos(updatedPuestos); // Agregar el puesto seleccionado al array

    // Guardamos los puestos actualizados en localStorage para el área seleccionada
    const areaSeleccionadaKey = `puestos_${areaSeleccionada}`;
    localStorage.setItem(areaSeleccionadaKey, JSON.stringify(updatedPuestos));

    setPuestoSeleccionado(''); // Limpiar la selección del dropdown después de agregar
  }
};


// Función para borrar los puestos seleccionados
const handleDeleteSelectedPuestos = () => {
  const nuevosPuestos = puestos.filter(
    (puesto) => !puestosSeleccionadosParaBorrar.includes(puesto)
  );
  setPuestos(nuevosPuestos); // Actualiza los puestos eliminando los seleccionados

  // Guardamos los puestos actualizados en localStorage para el área seleccionada
  const areaSeleccionadaKey = `puestos_${areaSeleccionada}`;
  localStorage.setItem(areaSeleccionadaKey, JSON.stringify(nuevosPuestos));

  setPuestosSeleccionadosParaBorrar([]); // Limpiar la selección
  setIsModalOpen(false); // Cerrar el modal
};


const handleImageSelect = (image) => {
  // Asociar la imagen seleccionada con el peligro actual
  setSelectedHazardImages({
    ...selectedHazardImages,
    [hazardWithImages]: image, // Asociamos la imagen seleccionada con el peligro
  });

  // Actualizar el estado de las imágenes sugeridas
  setSelectedImages((prevSelectedImages) => {
    return [...prevSelectedImages, image]; // Agregar la imagen seleccionada a la lista de imágenes sugeridas
  });

  // Marcar el checkbox del peligro seleccionado
  setHazards({
    ...hazards,
    [hazardWithImages]: true, // Marcamos el checkbox
  });

  // Cerrar el modal
  setIsImageModalOpen(false);
};



const saveTable = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert("No estás autenticado.");
    return;
  }

  const uid = user.uid; // Obtener UID del usuario

  const tableData = {
    uid, // Asociar al usuario autenticado
    areaSeleccionada,
    puestoSeleccionado,
    hazards,
    consequence,
    exposure,
    probability,
    risk: calculateRisk(),
    selectedImages,
    descripcionActividad,
    selectedOptionEquipoUtilizado,
    selectedOptionProteccionSugerida,
    tiempoExposicion,
    norma: "N-017",
    fecha: new Date().toLocaleDateString(),
    hora: new Date().toLocaleTimeString(),
  };

  try {
    await addDoc(collection(db, "tablas"), tableData);
    alert("Tabla guardada con éxito en Firestore.");

    const resumenRef = doc(db, "resumen_17", areaSeleccionada);
    const resumenSnapshot = await getDoc(resumenRef);

    let newResumenData = {
      uid, // Asociar al usuario autenticado
      tolerable: 0,
      moderado: 0,
      notable: 0,
      elevado: 0,
      grave: 0,
      puestos: [],
    };

    const risk = calculateRisk();
    if (resumenSnapshot.exists()) {
      newResumenData = resumenSnapshot.data();
    }

    const puestoRiesgo = {
      nombre: puestoSeleccionado,
      tolerable: risk <= 20 ? 1 : 0,
      moderado: risk > 20 && risk <= 70 ? 1 : 0,
      notable: risk > 70 && risk <= 200 ? 1 : 0,
      elevado: risk > 200 && risk <= 400 ? 1 : 0,
      grave: risk > 400 ? 1 : 0,
    };

    newResumenData.puestos = [
      ...newResumenData.puestos.filter((p) => p.nombre !== puestoSeleccionado),
      puestoRiesgo,
    ];

    newResumenData.tolerable += puestoRiesgo.tolerable;
    newResumenData.moderado += puestoRiesgo.moderado;
    newResumenData.notable += puestoRiesgo.notable;
    newResumenData.elevado += puestoRiesgo.elevado;
    newResumenData.grave += puestoRiesgo.grave;

    await setDoc(resumenRef, newResumenData);
  } catch (error) {
    console.error("Error al guardar en Firestore:", error);
    alert("Error al guardar la tabla.");
  }
};







const updateTable = async () => {
  const updatedTable = {
    areaSeleccionada,
    puestoSeleccionado,
    hazards,
    consequence,
    exposure,
    probability,
    risk: calculateRisk(),
    selectedImages,
    descripcionActividad,
    selectedOptionEquipoUtilizado,
    selectedOptionProteccionSugerida,
    tiempoExposicion,
    norma: 'N-017',
    fecha, // Mantener la misma fecha
    hora, // Mantener la misma hora de creación
  };

  try {
    if (!tableId) {
      throw new Error('No se encontró el ID de la tabla para actualizar.');
    }

    // Actualizar la tabla principal en Firestore
    const docRef = doc(db, 'tablas', tableId);
    await updateDoc(docRef, updatedTable);

    // Actualizar la colección de resumen por área
    const resumenRef = doc(db, 'resumen', areaSeleccionada);
    const resumenSnapshot = await getDoc(resumenRef);

    // Obtener los datos existentes de la colección "resumen"
    let areaData = resumenSnapshot.exists()
      ? resumenSnapshot.data()
      : { puestos: [], tolerable: 0, moderado: 0, notable: 0, elevado: 0, grave: 0 };

    console.log('Datos del área antes de actualizar:', areaData);

    // Actualizar o agregar el puesto en el campo "puestos"
    const updatedPuestos = [
      ...areaData.puestos.filter((p) => p.nombre !== puestoSeleccionado), // Elimina el puesto si ya existe
      {
        nombre: puestoSeleccionado,
        magnitudRiesgo: calculateRisk(),
        categoria:
          calculateRisk() <= 20
            ? "Tolerable"
            : calculateRisk() <= 70
            ? "Moderado"
            : calculateRisk() <= 200
            ? "Notable"
            : calculateRisk() <= 400
            ? "Elevado"
            : "Grave",
      },
    ];

    console.log('Puestos actualizados:', updatedPuestos);

    // Calcular los totales acumulados para la categoría de riesgos
    const newTotals = updatedPuestos.reduce(
      (acc, puesto) => {
        const { magnitudRiesgo } = puesto;
        if (magnitudRiesgo <= 20) acc.tolerable++;
        else if (magnitudRiesgo <= 70) acc.moderado++;
        else if (magnitudRiesgo <= 200) acc.notable++;
        else if (magnitudRiesgo <= 400) acc.elevado++;
        else acc.grave++;
        return acc;
      },
      { tolerable: 0, moderado: 0, notable: 0, elevado: 0, grave: 0 }
    );

    console.log('Nuevos totales calculados:', newTotals);

    // Actualizar el documento del área con los nuevos datos
    await setDoc(resumenRef, { ...areaData, puestos: updatedPuestos, ...newTotals });

    alert('Tabla actualizada con éxito en Firestore.');
  } catch (error) {
    console.error('Error al actualizar en Firestore:', error);
    alert('Error al actualizar la tabla.');
  }
};



const [fecha, setFecha] = useState(new Date().toLocaleDateString()); // Estado para la fecha
const [tiempoExposicion, setTiempoExposicion] = useState('8hrs');
const [hora, setHora] = useState(new Date().toLocaleTimeString());
const [tableId, setTableId] = useState(null);







useEffect(() => {
  const tableToEdit = JSON.parse(localStorage.getItem('tableToEdit'));
  if (tableToEdit) {
    setAreaSeleccionada(tableToEdit.areaSeleccionada);
    setPuestoSeleccionado(tableToEdit.puestoSeleccionado);
    setHazards(tableToEdit.hazards);
    setConsequence(tableToEdit.consequence);
    setExposure(tableToEdit.exposure);
    setProbability(tableToEdit.probability);
    setSelectedImages(tableToEdit.selectedImages || []);
    setDescripcionActividad(tableToEdit.descripcionActividad || '');
    setSelectedOptionEquipoUtilizado(tableToEdit.selectedOptionEquipoUtilizado || '');
    setSelectedOptionProteccionSugerida(tableToEdit.selectedOptionProteccionSugerida || '');
    setTiempoExposicion(tableToEdit.tiempoExposicion || '');
    setFecha(tableToEdit.fecha); // Establecer la fecha de la tabla en edición
    setHora(tableToEdit.hora); // Establecer la hora de creación
    setTableId(tableToEdit.id); // Guardar el ID del documento para actualizar
    setIsEditing(true);
    localStorage.removeItem('tableToEdit');
  }
}, []);

const handleImageRemove = (imageToRemove) => {
  setSelectedImages((prevSelectedImages) =>
    prevSelectedImages.filter((image) => image !== imageToRemove)
  );
};


const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
const [areasSeleccionadasParaBorrar, setAreasSeleccionadasParaBorrar] = useState([]);

const handleAddAreaClick = () => {
  const nuevaArea = prompt("Ingrese el nombre de la nueva área:");
  if (nuevaArea && nuevaArea.trim() !== "") {
    const updatedAreas = [...areas, { nombre: nuevaArea.trim(), puestos: [] }];
    setAreas(updatedAreas);

    // Guardamos el área en localStorage
    localStorage.setItem("areas", JSON.stringify(updatedAreas));
    setAreaSeleccionada(nuevaArea.trim()); // Cambia a la nueva área
  }
};

const handleDeleteAreaClick = () => {
  setIsAreaModalOpen(true);
};

// Cerrar el modal de borrar área
const handleAreaModalClose = () => {
  setIsAreaModalOpen(false);
};

// Función para manejar selección de áreas en el modal
const handleAreaSelectionChange = (event) => {
  const value = event.target.value;
  const alreadySelected = areasSeleccionadasParaBorrar.includes(value);

  if (alreadySelected) {
    setAreasSeleccionadasParaBorrar(
      areasSeleccionadasParaBorrar.filter((area) => area !== value)
    );
  } else {
    setAreasSeleccionadasParaBorrar([...areasSeleccionadasParaBorrar, value]);
  }
};

// Función para borrar las áreas seleccionadas
const handleDeleteSelectedAreas = () => {
  const updatedAreas = areas.filter(
    (area) => !areasSeleccionadasParaBorrar.includes(area.nombre)
  );
  setAreas(updatedAreas);
  
  // Guardar las áreas actualizadas en localStorage
  localStorage.setItem("areas", JSON.stringify(updatedAreas));

  setAreasSeleccionadasParaBorrar([]);
  setIsAreaModalOpen(false);
};

useEffect(() => {
  // Intenta cargar las áreas desde localStorage
  const savedAreas = JSON.parse(localStorage.getItem("areas"));
  if (savedAreas && savedAreas.length > 0) {
    setAreas(savedAreas); // Si existen áreas guardadas, las carga en el estado
  }
}, []);


const [selectedMainOption, setSelectedMainOption] = useState(''); // Estado para la opción principal
  const [selectedSubOption, setSelectedSubOption] = useState('');   // Estado para la subcategoría seleccionada
  const [showSubDropdown, setShowSubDropdown] = useState(false);     // Estado para mostrar u ocultar el segundo menú
  const [selectionList, setSelectionList] = useState([]); // Lista acumulativa de selecciones

  // Opciones principales y sus subcategorías
  const eppOptions = {
    'Casco': ['Casco Dielectrico', 'Casco de Seguridad', 'Casco con Visera'],
    'Guantes': ['Guantes de Látex', 'Guantes de Nitrilo', 'Guantes de Cuero'],
    'Gafas de Protección': ['Gafas con Filtro UV', 'Gafas Antiempañantes', 'Gafas de Impacto'],
    'Botas': ['Botas de Seguridad', 'Botas Impermeables', 'Botas Aislantes'],
  };


  // Maneja la selección de subcategoría, agrega a la lista y oculta el menú
  const handleSubOptionChange = (e) => {
    const subOption = e.target.value;
    setSelectedSubOption(subOption);
  
    // Agrega la selección actual a la lista acumulativa
    setSelectionList((prevList) => [
      ...prevList,
      `${selectedMainOption} - ${subOption}`,
    ]);
  
    setShowSubDropdown(false); // Oculta el segundo menú tras seleccionar una subcategoría
  };
  


  // Estado para manejar opciones seleccionadas automáticamente
const [autoSelectedOptions, setAutoSelectedOptions] = useState([]);

// Nuevo useEffect para actualizar el menú basado en la selección de imágenes de EPP
useEffect(() => {
  const newAutoSelectedOptions = [];

  // Verificar si la imagen del casco (10) está seleccionada
  if (selectedImages.includes('/images/10.png') || selectedImages.includes('/images/10.jpg')) {
    newAutoSelectedOptions.push('Casco');
  }
  if (selectedImages.includes('/images/4.png') || selectedImages.includes('/images/4.jpg')) {
    newAutoSelectedOptions.push('Botas');
  }
  if (selectedImages.includes('/images/6.png') || selectedImages.includes('/images/6.jpg')) {
    newAutoSelectedOptions.push('Guantes');
  }
  if (selectedImages.includes('/images/3.png') || selectedImages.includes('/images/3.jpg')) {
    newAutoSelectedOptions.push('Gafas de Protección');
  }

  console.log("Opciones automáticas detectadas:", newAutoSelectedOptions); // Verificar opciones detectadas
  setAutoSelectedOptions(newAutoSelectedOptions); // Actualizar opciones automáticas
}, [selectedImages]); // Ejecutar cada vez que cambian las imágenes seleccionadas

  
const handleMainOptionChange = (e) => {
  const value = e.target.value;
  setSelectedMainOption(value);
  setSelectedSubOption(""); // Reinicia la subcategoría al cambiar el principal
  setShowSubDropdown(true); // Muestra el segundo menú al seleccionar una opción principal
};




  const logos = [
    { nombre: 'Safran', url: safran },
    { nombre: 'Maxion', url: maxion },
  ];
  

  // Estado para almacenar el logo seleccionado
  const [logoSeleccionado, setLogoSeleccionado] = useState(null);

  // Maneja el cambio de selección en el menú desplegable
  const handleLogoChange = (event) => {
    setLogoSeleccionado(event.target.value); // Guarda la URL del logo seleccionado
  };

  // Maneja la eliminación del logo y muestra el menú desplegable nuevamente
  const handleRemoveLogo = () => {
    setLogoSeleccionado(null); // Elimina el logo seleccionado
  };
  
  const [hideButtons, setHideButtons] = useState(false);


  document.addEventListener("DOMContentLoaded", () => {
    const tableContainer = document.querySelector('.table-container');
  
    let isDragging = false;
    let startX, scrollLeft;
  
    // Manejo del toque (táctil) para dispositivos móviles
    tableContainer.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].pageX - tableContainer.offsetLeft;
      scrollLeft = tableContainer.scrollLeft;
    });
  
    tableContainer.addEventListener('touchend', () => {
      isDragging = false;
    });
  
    tableContainer.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.touches[0].pageX - tableContainer.offsetLeft;
      const walk = (x - startX) * 2; // Ajusta la velocidad del desplazamiento
      tableContainer.scrollLeft = scrollLeft - walk;
    });
  });
  

  const handleDeleteSelection = (indexToDelete) => {
    setSelectionList((prevList) =>
      prevList.filter((_, index) => index !== indexToDelete)
    );
  
    // Reinicia las opciones seleccionadas
    setSelectedMainOption("");
    setSelectedSubOption("");
  };
  
  
  


  return (
      <div class="main-table">

        <table class="custom-table" className="table-container" style={{ backgroundColor: 'white' }} ><thead>
        
      
        
          <tr className="no-border-row">
            {/* Nueva fila superior con celdas individuales para cada sección */}
            <td colSpan="3">
              <img src={logo} alt="SIACH Logo" className="siach-logo" />
            </td>
            <td colSpan="4" style={{ backgroundColor: 'white' }}>
            <h3 className="section-header" style={{ color: 'black' }}>
              Análisis de Riesgo y Determinación de equipo de protección personal NOM-017-STPS-2008
            </h3>
          </td>

            <td colSpan="3">
              {logoSeleccionado ? (
                <div className="logo-container">
                  <img src={logoSeleccionado} alt="Logo de la Empresa" className="company-logo" />
                  <button onClick={handleRemoveLogo} className="remove-logo-button">×</button>
                </div>
              ) : (
                <select onChange={handleLogoChange} className="logo-dropdown">
                  <option value="">Selecciona una empresa</option>
                  {logos.map((logo, index) => (
                    <option key={index} value={logo.url}>
                      {logo.nombre}
                    </option>
                  ))}
                </select>
              )}
            </td>
          </tr>



      


          <tr>
          <td className="no-border-cell" colSpan="3">
          <label htmlFor="descripcion-actividad" className="titulo-descripcion">Puestos:</label>

              <div className="puesto-con-botones">
                <select id="puesto" value={puestoSeleccionado} onChange={handlePuestoChange} className="select-puesto">
                  <option value="" disabled>Seleccione un puesto</option>
                  {puestos.map((puesto, index) => (
                    <option key={index} value={puesto}>
                      {puesto}
                    </option>
                  ))}
                </select>
                
              </div>

              {!hideButtons && (
                  <>
                    <button className="btn-agregar" onClick={handleAddPuestoClick}>Agregar</button>
                    <button className="btn-borrar" onClick={handleDeletePuestoClick}>Borrar</button>
                  </>
                )}



          {/* Área de descripción de actividad */}
          <div className="contenedor-descripcion">
            <label htmlFor="descripcion-actividad" className="titulo-descripcion">Descripción de la actividad:</label>
            <textarea
              id="descripcion-actividad"
              name="descripcion-actividad"
              rows="3"
              cols="50"
              className="textarea-descripcion"
              placeholder="Escribe aquí la descripción de la actividad..."
              value={descripcionActividad}
              onChange={(e) => setDescripcionActividad(e.target.value)}
            ></textarea>
          </div>
        </td>




        <Modal isOpen={isModalOpen} onRequestClose={handleModalClose}>
          <div className="modal-container">
            <h2>Selecciona los puestos a borrar</h2>

            {/* Muestra los puestos en el modal */}
            <div className="puestos-lista">
              {puestos.length > 0 ? (
                puestos.map((puesto, index) => (
                  <div className="puesto-item" key={index}>
                    <input
                      type="checkbox"
                      value={puesto}
                      onChange={handlePuestoSelectionChange}
                      checked={puestosSeleccionadosParaBorrar.includes(puesto)}
                    />
                    <label>{puesto}</label>
                  </div>
                ))
              ) : (
                <p>No hay puestos disponibles para borrar</p>
              )}
            </div>

            <button onClick={handleDeleteSelectedPuestos}>Borrar seleccionados</button>
            <button onClick={handleModalClose}>Cerrar</button>
          </div>
          
        </Modal>



        <td className="header-cell" colSpan="3" style={{ backgroundColor: 'red', padding: '10px' }}>
          <div className="body-parts-title">Principales partes del cuerpo expuestas al riesgo:</div>
          
          <table className="body-parts-table">
            <tbody>
              <tr>
                <td className="risk-label-cell">Cabeza y Oídos</td>
                <td className="risk-mark-cell">{affectedBodyParts.includes('Cabeza y Oídos') ? 'X' : ''}</td>
                <td className="risk-label-cell">Tronco</td>
                <td className="risk-mark-cell">{affectedBodyParts.includes('Tronco') ? 'X' : ''}</td>
              </tr>
              <tr>
                <td className="risk-label-cell">Ojos y Cara</td>
                <td className="risk-mark-cell">{affectedBodyParts.includes('Ojos y Cara') ? 'X' : ''}</td>
                <td className="risk-label-cell">Sistema respiratorio</td>
                <td className="risk-mark-cell">{affectedBodyParts.includes('Sistema respiratorio') ? 'X' : ''}</td>
              </tr>
              <tr>
                <td className="risk-label-cell">Brazos y Manos</td>
                <td className="risk-mark-cell">{affectedBodyParts.includes('Brazos y Manos') ? 'X' : ''}</td>
                <td className="risk-label-cell">Extremidades inferiores</td>
                <td className="risk-mark-cell">{affectedBodyParts.includes('Extremidades inferiores') ? 'X' : ''}</td>
              </tr>
            </tbody>
          </table>
        </td>

  
        <td className="header-td" colSpan="3">
          <div className="additional-data-title">Datos adicionales</div>

          <table className="details-table">
            <tbody>
              {/* Fila de Área */}
              <tr>
                <td className="label-cell">Área:</td>
                <td className="input-cell">
                  <select id="area" value={areaSeleccionada} onChange={handleAreaChange} className="select-area">
                    {areas.map((area, index) => (
                      <option key={index} value={area.nombre}>
                        {area.nombre}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="button-cell">
                  <button className="btn-agregar" onClick={handleAddAreaClick}>Agregar</button>
                  <button className="btn-borrar" onClick={handleDeleteAreaClick}>Borrar</button>
                </td>

              </tr>

              {/* Modal para borrar áreas */}
              <Modal isOpen={isAreaModalOpen} onRequestClose={handleAreaModalClose} className="overlay">
                <div className="modal-container">
                  <h2>Selecciona las áreas a borrar</h2>
                  <div className="areas-lista">
                    {areas.length > 0 ? (
                      areas.map((area, index) => (
                        <div className="area-item" key={index}>
                          <input
                            type="checkbox"
                            value={area.nombre}
                            onChange={handleAreaSelectionChange}
                            checked={areasSeleccionadasParaBorrar.includes(area.nombre)}
                          />
                          <label>{area.nombre}</label>
                        </div>
                      ))
                    ) : (
                      <p>No hay áreas disponibles para borrar</p>
                    )}
                  </div>
                  <div className="modal-buttons">
                    <button onClick={handleDeleteSelectedAreas}>Borrar seleccionadas</button>
                    <button onClick={handleAreaModalClose}>Cerrar</button>
                  </div>
                </div>
              </Modal>

              {/* Fila de Fecha de inspección */}
              <tr>
                <td className="label-cell">Fecha de inspección:</td>
                <td colSpan="2" className="input-cell">
                  <input type="date" id="fechaInspeccion" defaultValue="2023-09-13" className="date-input" />
                </td>
              </tr>

              {/* Fila de Tiempo de exposición */}
              <tr>
                <td className="label-cell">Tiempo de exposición:</td>
                <td colSpan="2" className="input-cell">
                  <select
                    id="tiempoExposicion"
                    className="select-tiempo"
                    value={tiempoExposicion}
                    onChange={(e) => setTiempoExposicion(e.target.value)}
                  >
                    <option value="2hrs">2 horas</option>
                    <option value="4hrs">4 horas</option>
                    <option value="6hrs">6 horas</option>
                    <option value="8hrs">8 horas</option>
                    <option value="10hrs">10 horas</option>
                    <option value="12hrs">12 horas</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
        </tr>
        
        </thead>
        
        <tbody>
          <tr>
            <td colSpan="3" className="left-section"> 
              <tb className="text1">Identificación de peligros</tb>
              <ul className="hazard-list">
                {Object.keys(hazards).map(hazard => (
                  <li key={hazard} className="hazard-item">
                    {hazard}
                    <label className="hazard-checkbox">
                      <input
                        type="checkbox"
                        name={hazard}
                        checked={hazards[hazard]}
                        onChange={handleCheckboxChange}
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </td>




                <Modal isOpen={isImageModalOpen} onRequestClose={() => setIsImageModalOpen(false)} className="modal-container">
                  <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Selecciona una imagen para {hazardWithImages}</h3>
                  <div className="image-selection-container">
                    {selectedImagesForHazard.map((image, index) => (
                      <div key={index} className="image-option">
                        <img
                          src={image}
                          alt={`Opción ${index}`}
                          onClick={() => handleImageSelect(image)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="button-group">
                    <button onClick={() => setIsImageModalOpen(false)}>Cerrar</button>
                  </div>
                </Modal>

                <td colSpan="2" className="right-section right-aligned" style={{ backgroundColor: 'white' }}>
                  <div className="text1">Equipo utilizado<br></br></div>
                  <div className="section-content">
                    <select value={selectedOptionEquipoUtilizado} onChange={handleOptionChangeEquipoUtilizado}>
                      <option value="">Selecciona la extremidad afectada</option>
                      <option value="option1">Cabeza</option>
                      <option value="option2">Tronco</option>
                      <option value="option3">Pies</option>
                      <option value="option4">Brazos</option>
                      <option value="option5">Cabeza y Tronco</option>
                      <option value="option6">Brazos y Pies</option>
                      <option value="option7">Cabeza y Pies</option>
                      <option value="option8">Cabeza y Brazos</option>
                      <option value="option9">Cabeza y Tronco</option>
                      <option value="option10">Tronco y Brazos</option>
                      <option value="option11">Todas las Extremidades</option>
                    </select>
                    {selectedOptionEquipoUtilizado && optionImages[selectedOptionEquipoUtilizado] && (
                      <div className="protection-image-container">
                        <img
                          src={optionImages[selectedOptionEquipoUtilizado]}
                          alt={`Equipo utilizado para ${selectedOptionEquipoUtilizado}`}
                          className="protection-image2"
                        />
                      </div>
                    )}
                  </div>
                </td>
                  <td colSpan="2" className="right-section right-aligned">
                    <div className="text1">Equipo de protección personal sugerido</div>
                    <div className="body-and-hazards-container">
                      <select value={selectedOptionProteccionSugerida} onChange={handleOptionChangeProteccionSugerida}>
                        <option value="">Selecciona la extremidad afectada</option>
                        <option value="option1">Cabeza</option>
                        <option value="option2">Tronco</option>
                        <option value="option3">Pies</option>
                        <option value="option4">Brazos</option>
                        <option value="option5">Cabeza y Tronco</option>
                        <option value="option6">Brazos y Pies</option>
                        <option value="option7">Cabeza y Pies</option>
                        <option value="option8">Cabeza y Brazos</option>
                        <option value="option9">Cabeza y Tronco</option>
                        <option value="option10">Tronco y Brazos</option>
                        <option value="option11">Todas las Extremidades</option>
                      </select>
                      <div className="images-in-row">  {/* Nueva clase para alinear en fila */}
                        {selectedOptionProteccionSugerida && optionImages[selectedOptionProteccionSugerida] && (
                          <div className="body-image-left">
                            <img
                              src={optionImages[selectedOptionProteccionSugerida]}
                              alt={`Equipo de protección sugerido para ${selectedOptionProteccionSugerida}`}
                              className="protection-image3"
                            />
                          </div>
                        )}
                        
                      </div>
                    </div>
                  </td>

                <td colSpan="2" className="epp-component-right-section">
                  {/* Título de EPP Recomendado */}
                  <div className="epp-component-title">EPP Recomendado</div>

                  {/* Contenedor para las imágenes de EPP */}
                  <div className="epp-component-hazard-images">
                    {selectedImages.length > 0 ? (
                      selectedImages.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Protección ${index}`}
                          className="epp-component-image"
                          onClick={() => handleImageRemove(image)}
                        />
                      ))
                    ) : (
                      <div className="epp-component-no-epp">No hay EPP seleccionado</div>
                    )}
                  </div>

                  <div className="epp-container">
  {/* Contenedor del menú principal */}
  <div className="epp-dropdown-container">
  <label htmlFor="main-epp-select" className="dropdown-label">
    Selecciona el equipo principal:
  </label>
  <select
    id="main-epp-select"
    value={selectedMainOption}
    onChange={handleMainOptionChange}
    className="epp-dropdown"
  >
    <option value="" disabled>
      Selecciona el equipo
    </option>
    {Object.keys(eppOptions)
      .filter((option) => autoSelectedOptions.includes(option)) // Mostrar solo las opciones detectadas
      .map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
  </select>
</div>


{showSubDropdown && selectedMainOption && (
  <div className="epp-sub-dropdown-container">
    <label htmlFor="sub-epp-select" className="dropdown-label">
      Selecciona el tipo de {selectedMainOption.toLowerCase()}:
    </label>
    <select
      id="sub-epp-select"
      value={selectedSubOption}
      onChange={handleSubOptionChange}
      className="epp-sub-dropdown"
    >
      <option value="" disabled>
        Selecciona el tipo
      </option>
      {eppOptions[selectedMainOption]?.map((subOption, index) => (
        <option key={index} value={subOption}>
          {subOption}
        </option>
      ))}
    </select>
  </div>
)}


<div className="epp-selection-list-container">
  {selectionList.length > 0 ? (
    <ul className="epp-selection-list">
      {selectionList.map((selection, index) => (
        <li key={index} className="epp-selection-item">
          {selection}
          <button
            className="delete-button"
            onClick={() => handleDeleteSelection(index)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              width="20px"
              height="20px"
              className="delete-icon"
            >
              <path d="M3 6h18v2H3V6zm2 2v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8H5zm7 4v6h2v-6h-2zm-4 0v6h2v-6H8zm8 0v6h2v-6h-2zM7 4h10v2H7V4z" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  ) : (
    <p></p>
  )}
</div>

</div>


            </td>  
          </tr>
          
          <tr>
          <td colSpan="7" className="right-aligned">
    <div className="banana-title">Evaluación de riesgo de trabajo</div>
    <table className="inner-table">
      <thead>
        <tr>
          <th className="apple-header">Consecuencia</th>
          <th className="apple-header" style={{ backgroundColor: 'red' }}>Exposición</th>
          <th className="apple-header" colSpan="4" style={{ width: '45%' }}>Probabilidad</th>
          <th className="apple-header">Magnitud del Riesgo</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <select value={consequence} onChange={handleConsequenceChange} className="cherry-select">
              <option value={10}>Catástrofe</option>
              <option value={50}>Varias muertes</option>
              <option value={25}>Muerte</option>
              <option value={15}>Lesiones graves</option>
              <option value={5}>Lesiones con baja</option>
              <option value={1}>Lesiones sin baja</option>
            </select>
            <div className="grape-value">Valor: {consequence}</div>
          </td>
          <td>
            <select value={exposure} onChange={handleExposureChange} className="cherry-select">
              <option value={10}>Continuamente</option>
              <option value={6}>Frecuentemente</option>
              <option value={3}>Ocasionalmente</option>
              <option value={2}>Irregularmente</option>
              <option value={1}>Raramente</option>
              <option value={0.5}>Remotamente</option>
            </select>
            <div className="grape-value">Valor: {exposure}</div>
          </td>
          <td colSpan="4" style={{ width: '45%' }}>
            <select value={probability} onChange={handleProbabilityChange} className="cherry-select" style={{ width: '100%', whiteSpace: 'normal' }}>
              <option value={10} style={{ whiteSpace: 'normal' }}>Es el resultado más probable y esperado</option>
              <option value={6} style={{ whiteSpace: 'normal' }}>Es completamente posible, no será nada extraño</option>
              <option value={3} style={{ whiteSpace: 'normal' }}>Sería una secuencia o coincidencia rara pero posible, ha ocurrido</option>
              <option value={1} style={{ whiteSpace: 'normal' }}>Coincidencia muy rara, pero se sabe que ha ocurrido</option>
              <option value={0.5} style={{ whiteSpace: 'normal' }}>Coincidencia extremadamente remota pero concebible</option>
              <option value={0.1} style={{ whiteSpace: 'normal' }}>Coincidencia prácticamente imposible, jamás ocurrio</option>
            </select>
            <div className="grape-value">Valor: {probability}</div>
          </td>

          <td className="blueberry-risk" style={{ backgroundColor: getRiskColor(calculateRisk()) }}>
            {calculateRisk().toFixed(2)}
          </td>

        </tr>
      </tbody>
    </table>
  </td>
            
            <td colSpan="3" className="right-aligned">
              <div className="risk-title">Clasificación de Magnitud de Riesgo</div>
              <table className="risk-magnitude-table">
                <tbody>
                  <tr>
                    <td className="risk-label-cell">Magnitud del Riesgo:</td>
                    <td className="risk-value-cell">{calculateRisk().toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="risk-label-cell">Clasificación:</td>
                    <td className="risk-classification-cell">
                      {calculateRisk() > 400 ? 'Muy Alto' : calculateRisk() > 200 ? 'Alto' : calculateRisk() > 70 ? 'Notable' : calculateRisk() > 20 ? 'Moderado' : 'Bajo o Aceptable'}
                    </td>
                  </tr>
                  <tr>
                    <td className="risk-label-cell">Acción:</td>
                    <td className="risk-action-cell">
                      {calculateRisk() > 400 ? 'Detención inmediata' : calculateRisk() > 200 ? 'Corrección inmediata' : calculateRisk() > 70 ? 'Corrección urgente' : calculateRisk() > 20 ? 'Debe corregirse' : 'Tolerable'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

          </tr>
        </tbody>
      </table>
      <button onClick={downloadImage} className="download-button">
        Descargar PDF
      </button>
      <button onClick={isEditing ? updateTable : saveTable} className="save-button">
        {isEditing ? 'Actualizar Tabla' : 'Guardar Tabla'}
      </button>
    </div>
  );
};

export default RiskAssessmentTable;