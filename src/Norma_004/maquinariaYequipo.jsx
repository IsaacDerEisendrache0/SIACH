import React, { useState } from 'react';
import './MaquinariaYequipo.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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

const specificRiskImages = [
  'precaucion_Pmovimiento.png',
  'precaucion_superficie_resbalosa.png',
  'precaucion_sustancias_corrosivas.png',
  'precaucion_vapores.png',
  'riesgo_biologico.png',
  'riesgo_caida.png',
  'riesgo_electrico.png',
  'riesgo_obstaculos.png',
  'riesgo_radiacion_laser.png',
  'riesgo_radiacion.png',
  'riesgo_superficie_resbalosa.png'
];

const RiskTable = () => {
  const opcionesConsecuencia = ['Catástrofe', 'Varias muertes', 'Muerte', 'Lesiones graves', 'Lesiones con baja', 'Lesiones sin baja'];
  const opcionesExposicion = ['Continuamente', 'Frecuentemente', 'Ocasionalmente', 'Irregularmente', 'Raramente'];
  const opcionesProbabilidad = [
    'Es el resultado más probable y esperado',
    'Es completamente posible, no será nada extraño',
    'Sería una secuencia o coincidencia rara pero posible, ha ocurrido',
    'Coincidencia muy rara, pero se sabe que ha ocurrido',
    'Coincidencia extremadamente remota pero concebible',
    'Coincidencia prácticamente imposible, jamás ha ocurrido'
  ];
  const opcionesTiempoExposicion = ['0-2 hrs', '2-4 hrs', '4-8 hrs', '8+ hrs'];
  const opcionesEnergia = ['Eléctrica', 'Manual', 'Mecánica', 'Hidráulica', 'Eólica'];

  const [consequence, setConsequence] = useState('Lesiones sin baja');
  const [exposure, setExposure] = useState('Ocasionalmente');
  const [probability, setProbability] = useState('Coincidencia extremadamente remota pero concebible');
  const [tiempoExposicion, setTiempoExposicion] = useState('4-8 hrs');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [peligros, setPeligros] = useState([
    { id: 1, nombre: 'Caídas de Altura', siNo: false },
    { id: 2, nombre: 'Exposición a Temperaturas', siNo: false },
    { id: 3, nombre: 'Exposición a Electricidad Estática', siNo: false },
    { id: 4, nombre: 'Exposición a Sustancias Químicas', siNo: false },
    { id: 5, nombre: 'Exposición a Radiaciones', siNo: false },
    { id: 6, nombre: 'Exposición agentes Biológicos', siNo: false },
    { id: 7, nombre: 'Exposición a Ruido', siNo: false },
    { id: 8, nombre: 'Exposición a Vibraciones', siNo: false },
    { id: 9, nombre: 'Superficies cortantes', siNo: false },
    { id: 10, nombre: 'Caídas a nivel o desnivel', siNo: false },
    { id: 11, nombre: 'Daños Ergonómicos', siNo: false },
    { id: 12, nombre: 'Calentamiento de materia prima, subproducto o producto', siNo: false },
    { id: 13, nombre: 'Proyección de material o herramienta', siNo: false },
    { id: 14, nombre: 'Mantenimiento preventivo, correctivo o predictivo', siNo: false }
  ]);
  const [observacionesGenerales, setObservacionesGenerales] = useState('');
  const [selectedSpecificRiskImages, setSelectedSpecificRiskImages] = useState([]);
  const [maquinariaNombre, setMaquinariaNombre] = useState('');
  const [maquinariaDescripcion, setMaquinariaDescripcion] = useState('');
  const [energiaUtilizada, setEnergiaUtilizada] = useState('Eléctrica');
  const [showEppModal, setShowEppModal] = useState(false);
  const [selectedEpp, setSelectedEpp] = useState(null); // Permitir solo una selección
  const eppOptionsForNoise = ['/images/19.png', '/images/5.png'];

  const handlePeligroChange = (index, valor) => {
    const nuevosPeligros = [...peligros];
    nuevosPeligros[index].siNo = valor;
    setPeligros(nuevosPeligros);

    if (nuevosPeligros[index].nombre === 'Exposición a Ruido') {
      if (valor) {
        setShowEppModal(true); // Mostrar el modal para seleccionar un EPP
      } else {
        // Eliminar la imagen seleccionada de "Exposición a Ruido"
        setSelectedImages((prevImages) => 
          prevImages.filter((img) => !eppOptionsForNoise.includes(img))
        );
        setSelectedEpp(null);
      }
    } else {
      // Actualizar las imágenes para otros peligros al seleccionar/desmarcar
      let newImages = [...selectedImages];

      if (valor) {
        // Agregar imágenes de otros peligros si se seleccionan
        if (protectionImages[nuevosPeligros[index].nombre]) {
          protectionImages[nuevosPeligros[index].nombre].forEach((imageSrc) => {
            if (!newImages.includes(imageSrc)) {
              newImages.push(imageSrc);
            }
          });
        }
      } else {
        // Eliminar imágenes de peligros desmarcados
        if (protectionImages[nuevosPeligros[index].nombre]) {
          newImages = newImages.filter(
            (img) => !protectionImages[nuevosPeligros[index].nombre].includes(img)
          );
        }
      }

      setSelectedImages(newImages);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
  
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setErrorMessage('');
      };
  
      reader.readAsDataURL(file);
    } else {
      setErrorMessage('Por favor, selecciona un archivo de imagen válido.');
    }
  };

  const handleEppSelection = (epp) => {
    setSelectedEpp(epp); // Permitir seleccionar solo un EPP para "Exposición a Ruido"
  };

  const handleConfirmEpp = () => {
    // Filtrar cualquier imagen previa de "Exposición a Ruido"
    const filteredImages = selectedImages.filter((img) => !eppOptionsForNoise.includes(img));

    // Añadir solo la imagen seleccionada al estado de imágenes seleccionadas
    if (selectedEpp) {
      setSelectedImages([...filteredImages, selectedEpp]);
    }

    setShowEppModal(false); // Cerrar el modal después de confirmar
  };

  const handleSpecificRiskImageChange = (imageName) => {
    const updatedSelection = [...selectedSpecificRiskImages];
    if (updatedSelection.includes(imageName)) {
      setSelectedSpecificRiskImages(updatedSelection.filter(image => image !== imageName));
    } else {
      updatedSelection.push(imageName);
      setSelectedSpecificRiskImages(updatedSelection);
    }
  };

  const calcularValorConsecuencia = () => {
    const valoresConsecuencia = {
      'Catástrofe': 50,
      'Varias muertes': 25,
      'Muerte': 15,
      'Lesiones graves': 10,
      'Lesiones con baja': 5,
      'Lesiones sin baja': 1
    };
    return valoresConsecuencia[consequence];
  };

  const calcularValorExposicion = () => {
    const valoresExposicion = {
      'Continuamente': 10,
      'Frecuentemente': 6,
      'Ocasionalmente': 3,
      'Irregularmente': 2,
      'Raramente': 1
    };
    return valoresExposicion[exposure];
  };

  const calcularValorProbabilidad = () => {
    const valoresProbabilidad = {
      'Es el resultado más probable y esperado': 10,
      'Es completamente posible, no será nada extraño': 6,
      'Sería una secuencia o coincidencia rara pero posible, ha ocurrido': 3,
      'Coincidencia muy rara, pero se sabe que ha ocurrido': 2,
      'Coincidencia extremadamente remota pero concebible': 1,
      'Coincidencia prácticamente imposible, jamás ha ocurrido': 0.5
    };
    return valoresProbabilidad[probability];
  };

  const calcularMagnitudRiesgo = () => {
    return Math.floor(calcularValorConsecuencia() * calcularValorExposicion() * calcularValorProbabilidad());
  };

  const obtenerColorPorRiesgo = (magnitud) => {
    if (magnitud > 400) {
      return { color: 'red', texto: 'Muy Alto: Detención inmediata', accion: 'Inmediata', clasificacion: 'Muy Alto' };
    } else if (magnitud > 200) {
      return { color: 'orange', texto: 'Alto: Corrección inmediata', accion: 'Urgente', clasificacion: 'Alto' };
    } else if (magnitud > 70) {
      return { color: 'yellow', texto: 'Notable: Corrección urgente', accion: 'Programada', clasificacion: 'Moderado' };
    } else if (magnitud > 20) {
      return { color: 'green', texto: 'Moderado: Debe corregirse', accion: 'Programada', clasificacion: 'Moderado' };
    } else {
      return { color: 'blue', texto: 'Bajo o Aceptable: Tolerable', accion: 'Sin acción requerida', clasificacion: 'Bajo' };
    }
  };

  const magnitudRiesgo = calcularMagnitudRiesgo();
  const { color, texto, accion, clasificacion } = obtenerColorPorRiesgo(magnitudRiesgo);

  const downloadPDF = () => {
    const input = document.getElementById('pdf-content');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('tabla_maquinaria.pdf');
    });
  };

  return (
    <div id="pdf-content" className="risk-table">
       <img src={logo} alt="SIACH Logo" style={{ width: '200px', marginLeft: '0px' }} />
      
      <table className="main-table compact-table">
     
        <thead>
          <tr>
            <th colSpan="4">Nombre de la maquinaria o equipo:</th>
            <th colSpan="2">
              <input 
                type="text" 
                value={maquinariaNombre} 
                onChange={(e) => setMaquinariaNombre(e.target.value)} 
                placeholder="Ingrese el nombre de la maquinaria"
                style={{ fontSize: '1em', width: '80%' }}
              />
            </th>
          </tr>
          <tr>
            <th colSpan="4">Descripción de la maquinaria o equipo:</th>
            <th colSpan="2">
              <textarea
                value={maquinariaDescripcion}
                onChange={(e) => setMaquinariaDescripcion(e.target.value)}
                placeholder="Describa la maquinaria o equipo"
                rows="2"
                style={{ fontSize: '1em', width: '100%' }}
              />
            </th>
          </tr>
          <tr>
            <th colSpan="4">Energía utilizada:</th>
            <th colSpan="2">
              <select 
                value={energiaUtilizada} 
                onChange={(e) => setEnergiaUtilizada(e.target.value)}
                style={{ fontSize: '1em', width: '100%' }}
              >
                {opcionesEnergia.map(opcion => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </th>
          </tr>
          <tr>
            <th colSpan="3">Localización esquemática de los riesgos en la maquinaria y/o equipo</th>
            <th style={{ backgroundColor: 'red' }}>POE:</th>
            <th>Tiempo de exposición:</th>
            <th colSpan="2">
              <select value={tiempoExposicion} onChange={(e) => setTiempoExposicion(e.target.value)} style={{ fontSize: '1em', width: '100%' }}>
                {opcionesTiempoExposicion.map(opcion => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="3">
              <table className="compact-table no-border" style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td>
                      <div className="image-observations-container">
                        <div className="image-section">
                          <input type="file" accept="image/*" onChange={handleImageChange}  />
                          {errorMessage && <p style={{ color: 'red', fontSize: '1em' }}>{errorMessage}</p>}
                          {imagePreview ? (
                            <img src={imagePreview} alt="Maquinaria" className="image-preview" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                          ) : (
                            <p style={{ fontSize: '1em' }}>No hay imagen seleccionada</p>
                          )}
                        </div>        
                      </div>  
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <>
                        {/* Tabla de identificación de peligros */}
                        <table className="danger-table compact-table" style={{ width: '100%' }}>
                          <thead>
                            <tr>
                              <th>Identificación de peligros</th>
                              <th style={{ backgroundColor: 'red' }}>Si/No</th>
                            </tr>
                          </thead>
                          <tbody>
                            {peligros.map((peligro, index) => (
                              <tr key={peligro.id}>
                                <td style={{ width: '80%', fontSize: '1em' }}>{peligro.nombre}</td>
                                <td style={{ width: '20%' }}>
                                  <input
                                    type="checkbox"
                                    checked={peligro.siNo}
                                    onChange={(e) => handlePeligroChange(index, e.target.checked)}
                                    style={{ transform: 'scale(1.2)' }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Modal para seleccionar EPP específico */}
                        {showEppModal && (
                          <div className="modal">
                            <div className="modal-content">
                              <h2>Seleccionar EPP para Exposición a Ruido</h2>
                              <div className="epp-options">
                                {eppOptionsForNoise.map((epp, index) => (
                                  <label key={index} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '1em' }}>
                                    <input
                                      type="radio"
                                      name="epp"
                                      value={epp}
                                      checked={selectedEpp === epp}
                                      onChange={() => handleEppSelection(epp)}
                                      style={{ transform: 'scale(1.2)' }}
                                    />
                                    <img src={epp} alt="EPP" style={{ width: '40px', height: '40px' }} />
                                  </label>
                                ))}
                              </div>
                              <button onClick={handleConfirmEpp} style={{ marginTop: '10px', padding: '8px', fontSize: '1em' }}>
                                Confirmar
                              </button>
                              <button onClick={() => setShowEppModal(false)} style={{ marginTop: '10px', padding: '8px', fontSize: '1em' }}>
                                Cerrar
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
            <td colSpan="3">
              <table className="compact-table no-border" style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>Consecuencia</th>
                    <th style={{ backgroundColor: 'red' }}>Exposición</th>
                    <th>Probabilidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select value={consequence} onChange={(e) => setConsequence(e.target.value)} >
                        {opcionesConsecuencia.map(opcion => (
                          <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                      </select>
                      <div style={{ fontSize: '1em' }}>Valor: {calcularValorConsecuencia()}</div>
                    </td>
                    <td>
                      <select value={exposure} onChange={(e) => setExposure(e.target.value)} >
                        {opcionesExposicion.map(opcion => (
                          <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                      </select>
                      <div >Valor: {calcularValorExposicion()}</div>
                    </td>
                    <td>
                      <select value={probability} onChange={(e) => setProbability(e.target.value)} >
                        {opcionesProbabilidad.map(opcion => (
                          <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                      </select>
                      <div >Valor: {calcularValorProbabilidad()}</div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <div className="risk-magnitude-container">
                        <div className="risk-magnitude-bar" style={{ backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1em' }}>
                          <span>{magnitudRiesgo}</span>
                          <span>{texto}</span>
                          <span ><strong>Acción:</strong> {accion}</span>
                          <span ><strong>Clasificación:</strong> {clasificacion}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <td colSpan="3"> Equipo de protección personal sugerido
                    <div className="icons" style={{ width: '100%', display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                      {selectedImages.length > 0 ? (
                        selectedImages.map((imageSrc, index) => (
                          <img key={index} src={imageSrc} alt={`Protección`} style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                        ))
                      ) : (
                        <p style={{ fontSize: '1em' }}>No hay riesgos seleccionados</p>
                      )}
                    </div>
                  </td>
                </tbody>
                <td colSpan="3">
                  <div className="risk-options-container">
                    <div className="risk-options">
                      {specificRiskImages.map((imageName, index) => (
                        <label key={index} className="risk-option-label">
                          <input
                            type="checkbox"
                            value={imageName}
                            checked={selectedSpecificRiskImages.includes(imageName)}
                            onChange={() => handleSpecificRiskImageChange(imageName)}
                            className="risk-option-checkbox"
                          />
                          <span className="risk-option-text">
                            {imageName.replace(/_/g, ' ').replace('.png', '')}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="risk-images">
                      {selectedSpecificRiskImages.map((imageName, index) => (
                        <img
                          key={index}
                          src={`/images/${imageName}`}
                          alt="Riesgo Específico"
                          className="risk-image"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                        />
                      ))}
                    </div>
                  </div>
                </td>
              </table>
              <div className="observations-section">
                <label htmlFor="observaciones" style={{ fontSize: '1em' }}>Observaciones:</label>
                <textarea
                  id="observaciones"
                  value={observacionesGenerales}
                  onChange={(e) => setObservacionesGenerales(e.target.value)}
                  placeholder="Agregar observaciones generales aquí"
                  rows="3"
                  style={{ fontSize: '1em', width: '100%' }}
                />
              </div>   
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={downloadPDF} className="download-button" style={{ fontSize: '1em' }}>
        Descargar
      </button>
    </div>
  );
};

export default RiskTable;
