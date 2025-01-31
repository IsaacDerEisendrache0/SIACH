import React, { useState, useEffect } from 'react';
import './Moviles.css';
import html2canvas from 'html2canvas';
import {
  getDoc,
  setDoc,
  doc,
  addDoc,
  collection,
  updateDoc,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import logo from '../logos/logo.png';
import Maxion from '../logos/maxion.jpeg';
import Safran from '../logos/safran.jpeg';
import Modal from 'react-modal';

const RiskTable = () => {
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
  const [tableId, setTableId] = useState(null);
  const [consequence, setConsequence] = useState('Lesiones sin baja');
  const [exposure, setExposure] = useState('Ocasionalmente');
  const [probability, setProbability] = useState('Coincidencia extremadamente remota pero concebible');
  const [image, setImage] = useState(null);
  const [selectedBodyImage, setSelectedBodyImage] = useState(null);
  const [selectedEPPImages, setSelectedEPPImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [newArea, setNewArea] = useState('');
  const [selectedAreaToRemove, setSelectedAreaToRemove] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [carpetas, setCarpetas] = useState([]);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [newFolderName, setNewFolderName] = useState('');

  const empresas = [
    { nombre: 'Maxion', url: Maxion },
    { nombre: 'Safran', url: Safran },
    { nombre: 'OtraEmpresa', url: '' },
  ];
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState('');
  const [logoSeleccionado, setLogoSeleccionado] = useState(null);

  const [bodyParts, setBodyParts] = useState({
    'Cabeza y Oídos': false,
    'Ojos y Cara': false,
    'Sistema respiratorio': false,
    'Brazos y Manos': false,
    Tronco: false,
    'Extremidades inferiores': false,
  });

  const handleBodyPartChange = (part) => {
    setBodyParts((prev) => ({
      ...prev,
      [part]: !prev[part],
    }));
  };

  const handleEmpresaChange = (e) => {
    const selectedName = e.target.value;
    setEmpresaSeleccionada(selectedName);
    const empObj = empresas.find((emp) => emp.nombre === selectedName);
    setLogoSeleccionado(empObj ? empObj.url : null);
  };

  const handleRemoveLogo = () => {
    setEmpresaSeleccionada('');
    setLogoSeleccionado(null);
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
    option9: '/body/lvl2_midhand.png',
    option10: '/body/lvl2_midfoot.png',
    option11: '/body/lvl3_headmidhand.png',
    option12: '/body/lvl3_headmidfoot.png',
    option13: '/body/lvl3_headhandfoot.png',
    option14: '/body/lvl3_midhandfoot.png',
    option15: '/body/lvl3_all.png',
  };

  const eppImagesList = [
    '/images/1.png','/images/2.png','/images/3.png','/images/4.png',
    '/images/5.png','/images/6.png','/images/7.png','/images/8.png',
    '/images/9.png','/images/10.png','/images/11.png','/images/12.png',
    '/images/13.png','/images/14.png','/images/15.png','/images/16.png',
    '/images/17.png','/images/18.png','/images/19.png','/images/20.png',
    '/images/21.png','/images/34.png','/images/36.png'
  ];

  const eppNames = {
    '/images/1.png':  'Ojos y Cara',
    '/images/2.png':  'Casco Dieléctrico',
    '/images/3.png':  'Gafas con filtro UV',
    '/images/4.png':  'Botas de seguridad',
    '/images/5.png':  'Protección Auditiva',
    '/images/6.png':  'Guantes de protección',
    '/images/7.png':  'Gafas contra sustancias',
    '/images/8.png':  'Mascarilla Soldadura',
    '/images/9.png':  'Mandil de seguridad',
    '/images/10.png': 'Casco de seguridad',
    '/images/11.png': 'Gafas antichoque',
    '/images/12.png': 'Cinturón de seguridad',
    '/images/13.png': 'Gafas para químicos',
    '/images/14.png': 'Protección facial',
    '/images/15.png': 'Careta para altas temperaturas',
    '/images/16.png': 'Traje antirradiación',
    '/images/17.png': 'Respirador',
    '/images/18.png': 'Equipo biológico',
    '/images/19.png': 'Conchas auditivas',
    '/images/20.png': 'Tapones Auditivos',
    '/images/21.png': 'Mangas de protección',
    '/images/34.png': 'Arnés',
    '/images/36.png': 'Overol',
  };

  const opcionesIdentificaciones = [
    'Riesgo de incendio',
    'Riesgo de atrapamiento o volcadura',
    'Riesgo de choque o atropello',
    'Riesgo de descarga eléctrica',
    'Exposición a temperaturas elevadas y abatidas',
    'Vibración','Riesgo inundación','Ventilación deficiente',
    'Daños ergonómicos','Sustancia químicas','Poca iluminación',
    'Particulas suspendidas en el ambiente'
  ];

  const opcionesSistemaseguridad = [
    'Paro de emergencia','Sistema ANSUL','Extintores','freno de emergencia',
    'Bandas antiestática','Sistema de anclaje','Programa de mantenimiento',
    'Guardas, parachoques y protectores de calaveras','Calza de seguridad',
    'Bloqueo de sistema hidráulico','Indicadores (torreta,luces,claxon,banderas, etc)',
    'Bloqueo de sistema eléctrico','Cinturón de seguridad','Barandales y escaleras',
    'Indicadores agua,aceite aire,motor, presión,etc','Canopy','Mata chispas','Sistema loto'
  ];

  const opcionesConsecuencia = [
    'Catástrofe','Varias muertes','Muerte',
    'Lesiones graves','Lesiones con baja','Lesiones sin baja'
  ];

  const opcionesExposicion = [
    'Continuamente','Frecuentemente','Ocasionalmente','Irregularmente','Raramente'
  ];

  const opcionesProbabilidad = [
    'Es el resultado más probable y esperado',
    'Es completamente posible, no será nada extraño',
    'Sería una secuencia o coincidencia rara pero posible, ha ocurrido',
    'Coincidencia muy rara, pero se sabe que ha ocurrido',
    'Coincidencia extremadamente remota pero concebible',
    'Coincidencia prácticamente imposible, jamás ha ocurrido'
  ];

  const calcularValorConsecuencia = (c) => {
    const map = {
      'Catástrofe': 100,
      'Varias muertes': 50,
      'Muerte': 25,
      'Lesiones graves': 15,
      'Lesiones con baja': 5,
      'Lesiones sin baja': 1,
    };
    return map[c] || 0;
  };
  const calcularValorExposicion = (e) => {
    const map = {
      'Continuamente': 10,
      'Frecuentemente': 6,
      'Ocasionalmente': 3,
      'Irregularmente': 2,
      'Raramente': 1,
      'Remotamente': 0.1,
    };
    return map[e] || 0;
  };
  const calcularValorProbabilidad = (p) => {
    const map = {
      'Es el resultado más probable y esperado': 10,
      'Es completamente posible, no será nada extraño': 6,
      'Sería una secuencia o coincidencia rara pero posible, ha ocurrido': 3,
      'Coincidencia muy rara, pero se sabe que ha ocurrido': 1,
      'Coincidencia extremadamente remota pero concebible': 0.5,
      'Coincidencia prácticamente imposible, jamás ha ocurrido': 0.1,
    };
    return map[p] || 0;
  };

  const calcularMagnitudRiesgo = () => {
    const valorC = calcularValorConsecuencia(consequence);
    const valorE = calcularValorExposicion(exposure);
    const valorP = calcularValorProbabilidad(probability);
    return Math.floor(valorC * valorE * valorP);
  };

  const obtenerClasificacionRiesgo = (magnitud) => {
    if (magnitud > 400) return { color: 'red', accion: 'Inmediata', clasificacion: 'Muy Alto' };
    if (magnitud > 200) return { color: 'orange', accion: 'Urgente', clasificacion: 'Alto' };
    if (magnitud > 70)  return { color: 'yellow', accion: 'Programada', clasificacion: 'Notable' };
    if (magnitud > 20)  return { color: 'green', accion: 'Programada', clasificacion: 'Moderado' };
    return { color: 'blue', accion: 'Sin acción requerida', clasificacion: 'Bajo' };
  };

  const magnitudRiesgo = calcularMagnitudRiesgo();
  const { color, accion, clasificacion } = obtenerClasificacionRiesgo(magnitudRiesgo);

  const handleAddEPPImage = (e) => {
    const selectedImage = e.target.value;
    if (selectedImage && !selectedEPPImages.includes(selectedImage)) {
      setSelectedEPPImages((prev) => [...prev, selectedImage]);
    }
  };

  const handleRemoveEPPImage = (imgSrc) => {
    setSelectedEPPImages((prev) => prev.filter((img) => img !== imgSrc));
  };

  const handleSelectBodyImage = (e) => {
    setSelectedBodyImage(e.target.value || null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const downloadImage = () => {
    setIsCapturing(true);
    setTimeout(() => {
      const input = document.querySelector('.risk-table-container');
      const rect = input.getBoundingClientRect();
      html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        width: rect.width,
        height: rect.height,
        x: 0,
        y: 0,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imgData;
        link.download = 'tabla_n004_equipos_moviles.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsCapturing(false);
      });
    }, 100);
  };

  const handleReset = () => {
    setNombreMaquinaria('');
    setArea('');
    setPoe('');
    setTiempoExposicion('');
    setDescripcion('');
    setFechaInspeccion('');
    setNewPuesto('');
    setSelectedPuestoToRemove('');
    setIsEditing(false);
    setTableId(null);
    setConsequence('Lesiones sin baja');
    setExposure('Ocasionalmente');
    setProbability('Coincidencia extremadamente remota pero concebible');
    setImage(null);
    setSelectedBodyImage(null);
    setSelectedEPPImages([]);
    setEmpresaSeleccionada('');
    setLogoSeleccionado(null);
    setBodyParts({
      'Cabeza y Oídos': false,
      'Ojos y Cara': false,
      'Sistema respiratorio': false,
      'Brazos y Manos': false,
      Tronco: false,
      'Extremidades inferiores': false,
    });
  };

  const openModal = (action) => {
    setModalAction(action);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    const savedAreas = JSON.parse(localStorage.getItem('areas'));
    if (savedAreas) setAreas(savedAreas);
    const savedPuestos = JSON.parse(localStorage.getItem('puestos'));
    if (savedPuestos) setPuestos(savedPuestos);

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
      setTableId(tableToEdit.id);
      setIsEditing(true);
    }

    const loadFolders = async () => {
      const q = await getDocs(collection(db, 'carpetas'));
      const fetched = q.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCarpetas(fetched);
    };
    loadFolders();
  }, []);

  const handleAddArea = () => {
    if (newArea.trim() && !areas.some((a) => a.nombre === newArea.trim())) {
      const updatedAreas = [...areas, { nombre: newArea.trim() }];
      setAreas(updatedAreas);
      localStorage.setItem('areas', JSON.stringify(updatedAreas));
      setNewArea('');
    }
    closeModal();
  };

  const handleRemoveArea = () => {
    if (selectedAreaToRemove) {
      const updated = areas.filter((a) => a.nombre !== selectedAreaToRemove.nombre);
      setAreas(updated);
      localStorage.setItem('areas', JSON.stringify(updated));
      setArea('');
    }
    closeModal();
  };

  const handleAddPuesto = () => {
    if (newPuesto.trim() && !puestos.some((p) => p.nombre === newPuesto.trim())) {
      const updated = [...puestos, { nombre: newPuesto.trim() }];
      setPuestos(updated);
      localStorage.setItem('puestos', JSON.stringify(updated));
      setNewPuesto('');
    }
  };

  const handleRemovePuesto = () => {
    if (selectedPuestoToRemove) {
      const updated = puestos.filter((p) => p.nombre !== selectedPuestoToRemove.nombre);
      setPuestos(updated);
      localStorage.setItem('puestos', JSON.stringify(updated));
      setSelectedPuestoToRemove(null);
    }
  };

  const openFolderModal = () => setIsFolderModalOpen(true);
  const closeFolderModal = () => setIsFolderModalOpen(false);

  const handleCreateNewFolder = async () => {
    if (!newFolderName.trim()) return;
    const docRef = await addDoc(collection(db, 'carpetas'), {
      nombre: newFolderName,
      fechaCreacion: serverTimestamp(),
    });
    setCarpetas([...carpetas, { id: docRef.id, nombre: newFolderName }]);
    setSelectedFolderId(docRef.id);
    setNewFolderName('');
  };

  const handleSelectFolder = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const saveTableData = async (folderId) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert('No estás autenticado.');
      return;
    }
    const uid = user.uid;
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
      norma: 'N-004 (Moviles)',
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      risk: calcularMagnitudRiesgo(),
      empresaSeleccionada,
      bodyParts,
      // Agrega esta línea
      nombreEmpresa: empresaSeleccionada, // O el nombre que desees
    };
    try {
      if (isEditing && tableId) {
        const tableRef = doc(db, 'carpetas', folderId, 'tablas', tableId);
        await updateDoc(tableRef, tableData);
        alert('Tabla actualizada exitosamente.');
      } else {
        await addDoc(collection(db, 'carpetas', folderId, 'tablas'), tableData);
        alert('Tabla guardada exitosamente.');
      }
    } catch (error) {
      alert('Hubo un problema al guardar la tabla.');
    }
  };
  

  return (
    <div className="risk-table-container">
      <div className="logo-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <img src={logo} alt="SIACH Logo" className="siach-logo" style={{ marginRight: '5px' }} />
        <h4 className="section-header" style={{ color: 'black' }}>
          ANÁLISIS DE RIESGO POTENCIAL GENERADO POR EQUIPOS MÓVILES
          NOM-004-STPS-1999
        </h4>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {logoSeleccionado ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={logoSeleccionado}
                alt="Logo"
                style={{ width: '80px', height: 'auto', marginRight: '8px' }}
              />
              <button onClick={handleRemoveLogo}>×</button>
            </div>
          ) : (
            <select value={empresaSeleccionada} onChange={handleEmpresaChange} className="dropdown-logo-04">
              <option value="">Seleccione empresa</option>
              {empresas.map((emp, idx) => (
                <option key={idx} value={emp.nombre}>
                  {emp.nombre}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <table className="risk-table" style={{ backgroundColor: 'white' }}>
        <thead>
          <tr>
            <th className="red">Nombre de la maquinaria</th>
            <td colSpan="2">
              <textarea
                placeholder="Introduzca un nombre"
                value={nombreMaquinaria}
                onChange={(e) => setNombreMaquinaria(e.target.value)}
                style={{ width: '100%' }}
              />
            </td>
            <th className="red">Área:</th>
            <td colSpan="2">
              <select
                name="areas"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="dropdown-puestos"
              >
                <option value="">Seleccione un área</option>
                {areas
                  .filter((ar) => ar && ar.nombre)
                  .map((ar, index) => (
                    <option key={index} value={ar.nombre}>
                      {ar.nombre}
                    </option>
                  ))}
              </select>
            </td>
            <th className="red">Empresa</th>
            <td colSpan="2">
              <select
                value={empresaSeleccionada}
                onChange={handleEmpresaChange}
                className="dropdown-empresa"
              >
                <option value="">Seleccione una empresa</option>
                {empresas.map((emp, index) => (
                  <option key={index} value={emp.nombre}>
                    {emp.nombre}
                  </option>
                ))}
              </select>
            </td>
            <th className="red">POE:</th>
            <td colSpan="2">
              <input
                placeholder="Introduzca el POE"
                type="text"
                value={poe}
                onChange={(e) => setPoe(e.target.value)}
              />
            </td>
            <th className="red">Tiempo de exposición:</th>
            <td colSpan="1">
              <textarea
                placeholder="Introduzca el tiempo"
                type="text"
                value={tiempoExposicion}
                onChange={(e) => setTiempoExposicion(e.target.value)}
                style={{ width: '100%' }}
              />
            </td>
          </tr>
          <tr>
            <th className="red">Descripción de la maquinaria o equipo:</th>
            <td colSpan="3">
              <textarea
                placeholder="Introduzca una descripción"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                style={{ width: '100%' }}
              />
            </td>
            <th className="red">Fecha de inspección:</th>
            <td colSpan="2">
              <input
                type="date"
                value={fechaInspeccion}
                onChange={(e) => setFechaInspeccion(e.target.value)}
                style={{ width: '100%' }}
              />
            </td>
            <th className="red">PUESTOS</th>
            <td colSpan="3">
              <select
                name="puestos"
                value={newPuesto}
                onChange={(e) => setNewPuesto(e.target.value)}
                className="dropdown-puestos"
              >
                <option value="">Seleccione un puesto</option>
                {puestos
                  .filter((p) => p && p.nombre)
                  .map((p, index) => (
                    <option key={index} value={p.nombre}>
                      {p.nombre}
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
                  {image ? <img src={image} alt="Uploaded" /> : <p className="image-placeholder">Haz clic para cargar una imagen</p>}
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
              <h4 className="blacktitle-small">Identificación de riesgos</h4>
              {[...Array(7)].map((_, index) => (
                <select key={index} className="dropdown-large-text">
                  <option value="">Seleccione un riesgo</option>
                  {opcionesIdentificaciones.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ))}
            </td>
            <td className="safety-info" colSpan="3">
              <h4 className="blacktitle-small">Sistemas de seguridad</h4>
              {[...Array(7)].map((_, index) => (
                <select key={index} className="dropdown-large-text">
                  <option value="">Seleccione un sistema de seguridad</option>
                  {opcionesSistemaseguridad.map((opt, idx) => (
                    <option key={idx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ))}
            </td>
          </tr>

          <table id="body-parts-table" colSpan="8">
            <tbody>
              <tr>
                <th colSpan="6">Principales partes del cuerpo expuestas al riesgo:</th>
              </tr>
              <tr>
                <td>Cabeza y Oídos</td>
                <td>
                  <input
                    type="checkbox"
                    checked={bodyParts['Cabeza y Oídos']}
                    onChange={() => handleBodyPartChange('Cabeza y Oídos')}
                  />
                </td>
                <td>Ojos y Cara</td>
                <td>
                  <input
                    type="checkbox"
                    checked={bodyParts['Ojos y Cara']}
                    onChange={() => handleBodyPartChange('Ojos y Cara')}
                  />
                </td>
                <td>Sistema respiratorio</td>
                <td>
                  <input
                    type="checkbox"
                    checked={bodyParts['Sistema respiratorio']}
                    onChange={() => handleBodyPartChange('Sistema respiratorio')}
                  />
                </td>
              </tr>
              <tr>
                <td>Brazos y Manos</td>
                <td>
                  <input
                    type="checkbox"
                    checked={bodyParts['Brazos y Manos']}
                    onChange={() => handleBodyPartChange('Brazos y Manos')}
                  />
                </td>
                <td>Tronco</td>
                <td>
                  <input
                    type="checkbox"
                    checked={bodyParts['Tronco']}
                    onChange={() => handleBodyPartChange('Tronco')}
                  />
                </td>
                <td>Extremidades inferiores</td>
                <td>
                  <input
                    type="checkbox"
                    checked={bodyParts['Extremidades inferiores']}
                    onChange={() => handleBodyPartChange('Extremidades inferiores')}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <tr>
            <td colSpan="4" className="risk-evaluation-section">
              <table>
                <thead>
                  <tr className="epp-title">
                    <th colSpan="3">Evaluación de riesgo de trabajo</th>
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
                      <select
                        value={consequence}
                        onChange={(e) => setConsequence(e.target.value)}
                        className="dropdown-large-text"
                      >
                        {opcionesConsecuencia.map((opcion, idx) => (
                          <option key={idx} value={opcion}>
                            {opcion}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={exposure}
                        onChange={(e) => setExposure(e.target.value)}
                        className="dropdown-large-text"
                      >
                        {opcionesExposicion.map((opcion, idx) => (
                          <option key={idx} value={opcion}>
                            {opcion}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        value={probability}
                        onChange={(e) => setProbability(e.target.value)}
                        className="dropdown-large-text"
                      >
                        {opcionesProbabilidad.map((opcion, idx) => (
                          <option key={idx} value={opcion}>
                            {opcion}
                          </option>
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
                    <th colSpan="4" className="red">
                      Clasificación de Magnitud de Riesgo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="tall-row">
                    <td rowSpan={2} className="tall-cell">
                      Magnitud del Riesgo: {magnitudRiesgo}
                    </td>
                    <td className="tall-cell">Clasificación: {clasificacion}</td>
                    <td className="tall-cell">Acción: {accion}</td>
                    <td
                      className="tall-cell risk-score-cell"
                      style={{ backgroundColor: color }}
                    >
                      Puntuación: {magnitudRiesgo.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            <td className="epp-suggested" colSpan="2">
              <div className="epp-container">
                <h6 className="epp-title">Protección sugerido</h6>
                <select className="custom-select" onChange={handleSelectBodyImage}>
                  <option value="">Selecciona la extremidad afectada</option>
                  {Object.entries(optionImages).map(([key, imagePath]) => (
                    <option key={key} value={imagePath}>
                      {{
                        option1: 'Cabeza',
                        option2: 'Tronco',
                        option3: 'Pies',
                        option4: 'Brazos',
                        option5: 'Cabeza y Tronco',
                        option6: 'Brazos y Pies',
                        option7: 'Cabeza y Pies',
                        option8: 'Cabeza y Brazos',
                        option9: 'Tronco y Brazos',
                        option10: 'Tronco y Pies',
                        option11: 'Cabeza, Tronco y Brazos',
                        option12: 'Cabeza, Tronco y Pies',
                        option13: 'Cabeza, Brazos y Pies',
                        option14: 'Tronco, Brazos y Pies',
                        option15: 'Todas las Extremidades',
                      }[key]}
                    </option>
                  ))}
                </select>
                {selectedBodyImage && (
                  <img
                    src={selectedBodyImage}
                    alt="Selected Body Part"
                    className="body-image"
                  />
                )}
              </div>
            </td>

            <td className="epp-suggested" colSpan="10">
              <div className="epp-container">
                <h5 className="epp-title">Seleccione EPP</h5>
                <select className="custom-select" onChange={handleAddEPPImage}>
                  <option value="">Seleccione EPP</option>
                  {eppImagesList
                    .map((img) => ({
                      image: img,
                      name: eppNames[img] || img,
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((obj, i) => (
                      <option key={i} value={obj.image}>
                        {obj.name}
                      </option>
                    ))}
                </select>
                <div className="epp-images-grid">
                  {selectedEPPImages.map((src, idx) => (
                    <img
                      key={idx}
                      src={src}
                      alt={`EPP ${idx + 1}`}
                      className="epp-image"
                      onClick={() => handleRemoveEPPImage(src)}
                    />
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
          <button onClick={openFolderModal} className="save-button">
            {isEditing ? 'Actualizar Tabla' : 'Guardar Tabla'}
          </button>
          <button onClick={handleReset} className="reset-button">
            Reiniciar Tabla
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
                value={selectedAreaToRemove?.nombre || ''}
                onChange={(e) =>
                  setSelectedAreaToRemove(areas.find((ar) => ar.nombre === e.target.value))
                }
                style={{ marginBottom: '10px', width: '100%' }}
              >
                <option value="">Seleccione un área para eliminar</option>
                {areas.map((ar, idx) => (
                  <option key={idx} value={ar.nombre}>
                    {ar.nombre}
                  </option>
                ))}
              </select>
              <button onClick={handleRemoveArea}>Confirmar Eliminar Área</button>
            </div>
          )}
          <div style={{ marginTop: '20px' }}>
            <h2>Puestos</h2>
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
            <select
              value={selectedPuestoToRemove?.nombre || ''}
              onChange={(e) =>
                setSelectedPuestoToRemove(puestos.find((p) => p.nombre === e.target.value))
              }
              style={{ marginBottom: '10px', width: '100%' }}
            >
              <option value="">Seleccione un puesto para eliminar</option>
              {puestos.map((p, idx) => (
                <option key={idx} value={p.nombre}>
                  {p.nombre}
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

      <div className="button-group" style={{ display: 'flex', gap: '0' }}>
        <button className="button-area" onClick={() => openModal('Agregar')}>
          Agregar área
        </button>
        <button className="button-area" onClick={() => openModal('Eliminar')}>
          Eliminar área
        </button>
      </div>

      <Modal
        isOpen={isFolderModalOpen}
        onRequestClose={closeFolderModal}
        contentLabel="Seleccionar Carpeta"
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
        <h2>Selecciona o crea una Carpeta</h2>
        {carpetas.length > 0 ? (
          carpetas.map((f) => (
            <div key={f.id} style={{ marginBottom: '10px' }}>
              <label>
                <input
                  type="radio"
                  name="folder"
                  checked={selectedFolderId === f.id}
                  onChange={() => handleSelectFolder(f.id)}
                />
                {f.nombre}
              </label>
            </div>
          ))
        ) : (
          <p>No hay carpetas existentes</p>
        )}
        <input
          type="text"
          placeholder="Nombre nueva carpeta"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        />
        <button onClick={handleCreateNewFolder}>Crear</button>
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={() => {
              if (!selectedFolderId) {
                alert('Selecciona o crea una carpeta primero.');
                return;
              }
              saveTableData(selectedFolderId);
              closeFolderModal();
            }}
            style={{ marginRight: '10px' }}
          >
            Guardar Tabla
          </button>
          <button onClick={closeFolderModal}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
};

export default RiskTable;
