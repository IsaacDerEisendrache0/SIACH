  import React, { useState, useEffect } from 'react';
  import './MaquinariaYequipo.css';
  import html2canvas from 'html2canvas';
  import { addDoc, updateDoc, doc, collection, getDoc, setDoc} from 'firebase/firestore';
  import { getAuth } from "firebase/auth";
  import { db } from '../firebase';
  import logo from '../logos/logo.png';
  import Maxion from '../logos/maxion.jpeg';
  import Safran from '../logos/safran.jpeg';

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
    const [selectedTriangleImages, setSelectedTriangleImages] = useState([]);
    const [isEditing] = useState(false);
    const [tableId, setTableId] = useState(null);
    const [area, setArea] = useState('');
    const [puestos, setPuestos] = useState([]);
    const [areas, setAreas] = useState([]);
    const [showPuestoModal, setShowPuestoModal] = useState(false);
    const [showAreaModal, setShowAreaModal] = useState(false);
    const [newPuesto, setNewPuesto] = useState('');
    const [newArea, setNewArea] = useState('');
    const [selectedRightLogo, setSelectedRightLogo] = useState(null);


    const logos = [
      { nombre: 'Maxion', url: Maxion },
      { nombre: 'Safran', url: Safran }
    ];

    const handleRightLogoChange = (e) => {
      const selectedLogo = logos.find((logo) => logo.nombre === e.target.value);
      setSelectedRightLogo(selectedLogo ? selectedLogo.url : null);
    };

    const handleRemoveRightLogo = () => {
      setSelectedRightLogo(null);
    };
    

    const downloadImage = () => {
      const input = document.querySelector('.risk-table-container');
      const tableWidth = input.offsetWidth; // Obtener el ancho de la tabla
    
      html2canvas(input, { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: null,
        width: tableWidth,  // Establecer el ancho del canvas
        scrollX: 0           // Agregar esta opción
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'tabla_herramientas_manual.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    };

    useEffect(() => {
      const savedAreas = JSON.parse(localStorage.getItem('areas')) || [];
      setAreas(savedAreas);

      const savedPuestos = JSON.parse(localStorage.getItem('puestos')) || [];
      setPuestos(savedPuestos);

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
    
    const handleAddPuesto = () => {
      if (newPuesto.trim() && !puestos.some((p) => p.nombre === newPuesto.trim())) {
        const updatedPuestos = [...puestos, { nombre: newPuesto.trim() }];
        setPuestos(updatedPuestos);
        localStorage.setItem('puestos', JSON.stringify(updatedPuestos));
        setNewPuesto('');
        alert('Puesto agregado con éxito.');
      } else {
        alert('El puesto ya existe o es inválido.');
      }
    };


    const handleAddArea = () => {
      if (newArea.trim() && !areas.some((a) => a.nombre === newArea.trim())) {
        const updatedAreas = [...areas, { nombre: newArea.trim(), puestos: [] }];
        setAreas(updatedAreas);
        localStorage.setItem('areas', JSON.stringify(updatedAreas));
        setNewArea('');
        alert('Área agregada con éxito.');
      } else {
        alert('El área ya existe o es inválida.');
      }
    };


  useEffect(() => {
    const savedAreas = JSON.parse(localStorage.getItem('areas')) || [];
    setAreas(savedAreas.filter((area) => area && area.nombre)); // Filtra valores inválidos

    const savedPuestos = JSON.parse(localStorage.getItem('puestos')) || [];
    setPuestos(savedPuestos.filter((puesto) => puesto && puesto.nombre)); // Filtra valores inválidos
  }, []);




    

    const saveTableData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
    
      if (!user) {
        alert("No estás autenticado.");
        return;
      }
    
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
    
        // Llamar a updateResumenData para actualizar la colección resumen
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

    // Función para obtener el color según la puntuación del riesgo
    const obtenerColorPuntuacion = (puntuacion) => {
      if (puntuacion >= 200) return 'red'; // Riesgo muy alto
      if (puntuacion >= 100) return 'orange'; // Riesgo alto
      if (puntuacion >= 50) return 'yellow'; // Riesgo moderado
      return 'green'; // Riesgo bajo
    };




      return (
              <div className="risk-table-container">
              <div className="header-container">
                {/* Logo izquierdo */}
                <img src={logo} alt="Logo Izquierdo" className="logo-left" />
        
                {/* Título centrado */}
                <h4 className="header-title">
                  NOM-004-STPS-1999 "ANÁLISIS DE RIESGO POTENCIAL POR MAQUINARIA Y EQUIPO"
                </h4>
                {/* Logo derecho o selector */}
                {!selectedRightLogo ? (
                    <div className="upload-logo-wrapper">
                        <input
                            type="file"
                            accept="image/*"
                            className="upload-logo-input"
                            onChange={(e) => {
                                if (e.target.files[0]) {
                                    const fileUrl = URL.createObjectURL(e.target.files[0]);
                                    setSelectedRightLogo(fileUrl);
                                }
                            }}
                        />
                    </div>
                ) : (
                    <div className="logo-right-container">
                        <img src={selectedRightLogo} alt="Logo Derecho" className="logo-right" />
                        <button
                            onClick={handleRemoveRightLogo}
                            className="remove-logo-button"
                        >
                            ×
                        </button>
                    </div>
                )}

              </div>
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
              <th className='red' colSpan="10">ÁREA:</th>
              <th colSpan="20"> 
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

              </th>
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
              <th className='red' colSpan="20"> PUESTOS
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


              </th>
            </tr>
          </thead>
          <tbody>
            <div className="table-flex-container">
              <div className="image-insert-table">
                <table className='imagefilter'>
                  <tbody>
                    <tr>
                    <td>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        setSelectedBodyImage(imageUrl);
      } else {
        console.error("No se seleccionó un archivo válido.");
      }
    }}
  />
  {selectedBodyImage && (
    <img 
      src={selectedBodyImage} 
      alt="Seleccionada" 
      className="selected-image" 
      style={{ maxWidth: "100%", height: "auto" }} // Asegúrate de que se renderice correctamente
    />
  )}
</td>


                    </tr>
                  </tbody>
                </table>

                


                <div className="identification-table">
                <table className="risk-table">
                  <thead>
                    <tr className="red">
                      <th className='warning'>Identificación de peligros</th>
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

            </div>

              

              <div className="evaluation-table" style={{ overflowX: 'auto' }}>
                
              <table>
  <thead>
    <tr className="red">
      <th colSpan="3" className="red" >Evaluación de riesgo de trabajo</th>
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
          {['Es el resultado más probable y esperado', 'Es completamente posible, no será nada extraño', 'Sería una secuencia o coincidencia rara pero posible, ha ocurrido', 'Coincidencia muy rara, pero se sabe que ha ocurrido', 'Coincidencia extremadamente remota pero concebible', 'Coincidencia prácticamente imposible, jamás ha ocurrido'].map((opcion, idx) => (
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
      <th colSpan="4" className="red">Clasificación de Magnitud de Riesgo</th>
    </tr>
  </thead>
  <tbody>
    {/* Fila con celdas alargadas */}
    <tr className="tall-row">
      {/* Celda grande para Magnitud del Riesgo */}
      <td rowSpan={2} className="tall-cell">
        Magnitud del Riesgo: {magnitudRiesgo}
      </td>
      {/* Celda grande para Clasificación */}
      <td className="tall-cell">
        Clasificación: {clasificacion}
      </td>
      {/* Celda grande para Acción */}
      <td className="tall-cell">
        Acción: {accion}
      </td>
      {/* Celda grande para Puntuación con cambio de color */}
      <td
        className="tall-cell risk-score-cell"
        style={{ backgroundColor: obtenerColorPuntuacion(magnitudRiesgo) }}
      >
        Puntuación: {magnitudRiesgo.toFixed(2)}
      </td>
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
                              <textarea name="textarea" rows="3" cols="212" id="observaciones" placeholder='Observaciones'></textarea>
                </table>
                
                <table id="body-parts-table" style={{ width: "90%", margin: "20px auto", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th colSpan="6"  className="red" style={{ backgroundColor: "red", fontWeight: "bold", padding: "6px" }}>
            Principales partes del cuerpo expuestas al riesgo:
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Cabeza y Oídos</td>
          <td data-check="true" style={{ border: "1px solid #ccc", cursor: "pointer" }}></td>
          <td>Ojos y Cara</td>
          <td data-check="true" style={{ border: "1px solid #ccc", cursor: "pointer" }}></td>
          <td>Sistema respiratorio</td>
          <td data-check="true" style={{ border: "1px solid #ccc", cursor: "pointer" }}></td>
        </tr>
        <tr>
          <td>Brazos y Manos</td>
          <td data-check="true" style={{ border: "1px solid #ccc", cursor: "pointer" }}></td>
          <td>Tronco</td>
          <td data-check="true" style={{ border: "1px solid #ccc", cursor: "pointer" }}></td>
          <td>Extremidades inferiores</td>
          <td data-check="true" style={{ border: "1px solid #ccc", cursor: "pointer" }}></td>
        </tr>
      </tbody>
    </table>
                  {/* Tabla de triángulos con select */}
                  <table className='warning'>
                    <tbody >
                      <tr>
                        <td >
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
                        <td className="triangle-images-container" colSpan="">
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
            </div>

          </tbody>
        </table>
        {/* Modal para Agregar Puesto */}
        {showPuestoModal && (
          <div className="modal">
            <div className="modal-content">
              <h4>Agregar Nuevo Puesto</h4>
              <input
                type="text"
                value={newPuesto}
                onChange={(e) => setNewPuesto(e.target.value)}
                placeholder="Ingrese el nombre del puesto"
              />
              <div className="modal-buttons">
                <button onClick={handleAddPuesto}>Agregar Puesto</button>
                <button onClick={() => setShowPuestoModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para Agregar Área */}
        {showAreaModal && (
          <div className="modal">
            <div className="modal-content">
              <h4>Agregar Nueva Área</h4>
              <input
                type="text"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                placeholder="Ingrese el nombre del área"
              />
              <div className="modal-buttons">
                <button onClick={handleAddArea}>Agregar Área</button>
                <button onClick={() => setShowAreaModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

<div className="button-container">
          <button onClick={downloadImage} className="download-button">Descargar PDF</button>
          <button onClick={saveTableData} className="save-button">{isEditing ? 'Actualizar Tabla' : 'Guardar Tabla'}</button>
          <button onClick={() => setShowAreaModal(true)} className="area-button">Agregar Área</button>
          <button onClick={() => setShowPuestoModal(true)} className="puesto-button">Agregar Puesto</button>
        </div>
      </div>
    );
  };

  export default RiskTable;