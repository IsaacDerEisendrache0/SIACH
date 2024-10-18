import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Table17.css';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';



const areas = [
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
];



const RiskAssessmentTable = () => {
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
    'Caídas de Altura': ['/images/10.png', '/images/34.png'], // Reemplaza con la ruta real de la imagen
    'Exposición a Temperaturas': ['/images/6.png'],
    'Exposición a Electricidad Estática': ['/images/6.png', '/images/4.png'],
    'Exposición a Sustancias Químicas': ['/images/7.png', '/images/13.png', '/images/6.png', '/images/17.png'],
    'Exposición a Radiaciones': ['/images/16.png'], 
    'Exposición agentes Biológicos': ['/images/18.png', '/images/16.png'], 
    'Exposición a Ruido': ['/images/19.png', '/images/5.png'],
    'Exposición a Vibraciones': ['/images/14.png', '/images/4.png'],
    'Superficies cortantes': ['/images/6.png', '/images/1.png', '/images/21.png'],
    'Caídas a nivel o desnivel':  ['/images/4.png'],
    'Daños Ergonómicos':  ['/images/15.png'],
    'Calentamiento de materia prima, subproducto o producto':  ['/images/6.png', '/images/15.png'],
    'Proyección de material o herramienta':  ['/images/7.png', '/images/12.png'],
    'Mantenimiento preventivo, correctivo o predictivo':  ['/images/12.png', '/images/3.png'],
  };

   // Coloca los hooks dentro del componente funcional
  const [areaSeleccionada, setAreaSeleccionada] = useState(areas[0].nombre);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState('');
  const [puestos, setPuestos] = useState(areas[0].puestos);
  

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
  
    // Si se deselecciona, simplemente eliminamos las imágenes y desmarcamos el checkbox
    if (!isChecked) {
      setHazards({
        ...hazards,
        [hazard]: false, // Actualizamos el estado para desmarcar el checkbox
      });
  
      // Eliminamos cualquier imagen relacionada con este peligro
      if (protectionImages[hazard]) {
        setSelectedImages((prevSelectedImages) =>
          prevSelectedImages.filter((image) => !protectionImages[hazard].includes(image))
        );
      }
  
      return; // Salimos de la función para no abrir el modal
    }
  
    // Si el peligro tiene más de una imagen y se está seleccionando
    if (protectionImages[hazard] && protectionImages[hazard].length > 1) {
      setSelectedImagesForHazard(protectionImages[hazard]); // Guardamos las imágenes de ese peligro
      setHazardWithImages(hazard); // Guardamos el nombre del peligro que tiene varias imágenes
      setIsImageModalOpen(true); // Abrimos el modal para seleccionar la imagen
    } else {
      // Si solo tiene una imagen, seleccionamos/deseleccionamos directamente
      setHazards({
        ...hazards,
        [hazard]: isChecked, // Actualizamos el estado del checkbox
      });
  
      // Si está seleccionado y solo tiene una imagen, la agregamos
      if (protectionImages[hazard] && protectionImages[hazard].length === 1) {
        const image = protectionImages[hazard][0]; // La única imagen disponible
        if (!selectedImages.includes(image)) {
          setSelectedImages((prevSelectedImages) => [...prevSelectedImages, image]); // Agregar la imagen seleccionada
        }
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

  const getSelectedHazardImages = () => {
    const selectedHazards = Object.keys(hazards).filter(hazard => hazards[hazard]);
    const uniqueImages = new Set();
    selectedHazards.forEach(hazard => {
      protectionImages[hazard].forEach(image => uniqueImages.add(image));
    });
    return Array.from(uniqueImages);
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
  

  const [selectedOption, setSelectedOption] = useState('');

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
    const input = document.querySelector('.table-container');

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






  return (
      <div class="main-table">
        <table class="custom-table" className="table-container">
        <thead>
          <tr>
          <td className="no-border-cell" colSpan="3">
  <label htmlFor="puesto">Puesto:</label>

  <div className="full-width-cell">
    <div className="puesto-con-botones">
      <select id="puesto" value={puestoSeleccionado} onChange={handlePuestoChange}>
        <option value="" disabled>Seleccione un puesto</option>
        {puestos.map((puesto, index) => (
          <option key={index} value={puesto}>
            {puesto}
          </option>
        ))}
      </select>

      {/* Botón para agregar puesto */}
      <button className="btn-agregar" onClick={handleAddPuestoClick}>
        Agregar
      </button>

      {/* Botón para borrar puestos */}
      <button className="btn-borrar" onClick={handleDeletePuestoClick}>
        Borrar
      </button>
    </div>
  </div>

  {/* Área de descripción de actividad */}
  <div>
    <label htmlFor="descripcion-actividad">Descripción de la actividad:</label>
    <textarea
      id="descripcion-actividad"
      name="descripcion-actividad"
      rows="2"
      cols="50"
      placeholder="Escribe aquí la descripción de la actividad..."
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


              
          <td className="header right-aligned" colSpan="2" style={{ backgroundColor: 'red' }}>
          <div className="text1">Principales partes del cuerpo expuestas al riesgo:</div>

            <div className="body-parts-container">
              
              <div className="left-column">
                
                <div className="risk-item">Cabeza y Oídos: <span className="risk-mark">{affectedBodyParts.includes('Cabeza y Oídos') ? 'X' : ''}</span></div>
                <div className="risk-item">Ojos y Cara: <span className="risk-mark">{affectedBodyParts.includes('Ojos y Cara') ? 'X' : ''}</span></div>
                <div className="risk-item">Brazos y Manos: <span className="risk-mark">{affectedBodyParts.includes('Brazos y Manos') ? 'X' : ''}</span></div>
              </div>
              <div className="right-column">
                <div className="risk-item">Tronco: <span className="risk-mark">{affectedBodyParts.includes('Tronco') ? 'X' : ''}</span></div>
                <div className="risk-item">Sistema respiratorio: <span className="risk-mark">{affectedBodyParts.includes('Sistema respiratorio') ? 'X' : ''}</span></div>
                <div className="risk-item">Extremidades inferiores: <span className="risk-mark">{affectedBodyParts.includes('Extremidades inferiores') ? 'X' : ''}</span></div>
              </div>
            </div>
            
          </td>

            
  
          <td className="header-td" style={{ backgroundColor: 'red' }} colSpan="2">
            <div className="header-td">
              <div className="label-action">
                <label htmlFor="area">Área:</label>
                <select id="area" value={areaSeleccionada} onChange={handleAreaChange}>
                  {areas.map((area, index) => (
                    <option key={index} value={area.nombre}>
                      {area.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="label-action">Fecha de inspección: <input type="date" defaultValue="2023-09-13" /></div>
              <div >Tiempo de exposición: <input type="text" defaultValue="8hrs" className="small-input" /></div>
            </div>
          </td>
          
          </tr>
          
          
          
        </thead>
        
        <tbody>
          <tr>
          <td colSpan="2" className="left-section"> 
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




            <Modal isOpen={isImageModalOpen} onRequestClose={() => setIsImageModalOpen(false)}>
              <h2>Selecciona una imagen para {hazardWithImages}</h2>
              <div className="image-selection-container">
                {selectedImagesForHazard.map((image, index) => (
                  <div key={index} className="image-option">
                    <img src={image} alt={`Opción ${index}`} onClick={() => handleImageSelect(image)} className="selectable-image" />
                  </div>
                ))}
              </div>
              <button onClick={() => setIsImageModalOpen(false)}>Cerrar</button>
            </Modal>

            <td colSpan="2" className="right-section right-aligned">
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
                    {/* Mostrar las imágenes de protección seleccionadas */}
                    {selectedImages.length > 0 && (
                      <div className="hazard-images-right">
                        {selectedImages.map((image, index) => (
                          <img key={index} src={image} alt={`Protección ${index}`} className="protection-image" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </td>
          </tr>
          <tr>
          <td colSpan="6" className="right-aligned">
          <div className="text1">Descripción del equipo de protección personal</div>
          <div>
                <textarea id="descripcion-actividad" name="descripcion-actividad" rows="2" cols="50" placeholder="Escribe aquí la descripción de la actividad..."></textarea>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="5" className="right-aligned">
              <div className="text1">Evaluación de riesgo de trabajo</div>
              <table className="inner-table">
                <thead>
                  <tr>
                    <th>Consecuencia</th>
                    <th style={{ backgroundColor: 'red' }}>Exposición</th>
                    <th>Probabilidad</th>
                    <th>Magnitud del Riesgo</th>
                  </tr>
                </thead>
                <tbody> 
                  <tr>
                    <td>
                      <select value={consequence} onChange={handleConsequenceChange}>
                        <option value={10}>Catástrofe</option>
                        <option value={50}>Varias muertes</option>
                        <option value={25}>Muerte</option>
                        <option value={15}>Lesiones graves</option>
                        <option value={5}>Lesiones con baja</option>
                        <option value={1}>Lesiones sin baja</option>
                      </select>
                      {/* Mostrar el valor seleccionado de Consecuencia */}
                      <div>Valor: {consequence}</div>
                    </td>
                    <td>
                      <select value={exposure} onChange={handleExposureChange}>
                        <option value={10}>Continuamente</option>
                        <option value={6}>Frecuentemente</option>
                        <option value={3}>Ocasionalmente</option>
                        <option value={2}>Irregularmente</option>
                        <option value={1}>Raramente</option>
                        <option value={0.5}>Remotamente</option>
                      </select>
                      {/* Mostrar el valor seleccionado de Exposición */}
                      <div>Valor: {exposure}</div>
                    </td>
                    <td>
                      <select value={probability} onChange={handleProbabilityChange}>
                        <option value={10}>Es el resultado más probable y esperado</option>
                        <option value={6}>Es completamente posible, no será nada extraño</option>
                        <option value={3}>Sería una secuencia o coincidencia rara pero posible, ha ocurrido</option>
                        <option value={1}>Coincidencia muy rara, pero se sabe que ha ocurrido</option>
                        <option value={0.5}>Coincidencia extremadamente remota pero concebible</option>
                        <option value={0.1}>Coincidencia prácticamente imposible, jamás ha ocurrido</option>
                      </select>
                      {/* Mostrar el valor seleccionado de Probabilidad */}
                      <div>Valor: {probability}</div>
                    </td>
                    <td style={{ backgroundColor: getRiskColor(calculateRisk()) }}>
                      {calculateRisk().toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td colSpan="3" className="right-aligned">
              <div className="text1">Clasificación de Magnitud de Riesgo</div>
              <div className="risk-magnitude">
                <div className="risk-value">Magnitud del Riesgo: {calculateRisk().toFixed(2)}</div>
                <div className="risk-classification">
                  Clasificación: {calculateRisk() > 400 ? 'Muy Alto' : calculateRisk() > 200 ? 'Alto' : calculateRisk() > 70 ? 'Notable' : calculateRisk() > 20 ? 'Moderado' : 'Bajo o Aceptable'}
                </div>
                <div className="risk-action">
                  Acción: {calculateRisk() > 400 ? 'Detención inmediata' : calculateRisk() > 200 ? 'Corrección inmediata' : calculateRisk() > 70 ? 'Corrección urgente' : calculateRisk() > 20 ? 'Debe corregirse' : 'Tolerable'}
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={downloadImage} className="download-button">
        Descargar PDF
      </button>
    </div>
  );
};

export default RiskAssessmentTable;