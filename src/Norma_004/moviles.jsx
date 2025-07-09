import React, { useState, useEffect } from "react";
import "./Moviles.css";
import html2canvas from "html2canvas";


import {
  getDoc,
  setDoc,
  doc,
  addDoc,
  collection,
  updateDoc,
  getDocs,
  serverTimestamp,
  query,          // 👈 AGREGAR
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import logo from "../logos/logo.png";
import Maxion from "../logos/maxion.jpeg";
import Safran from "../logos/safran.jpeg";
import Modal from "react-modal";

const RiskTable = () => {
  const [nombreMaquinaria, setNombreMaquinaria] = useState("");
  const [logosGuardados, setLogosGuardados] = useState([]);
  useEffect(() => {
  const logosEnLocalStorage = localStorage.getItem("logosGuardados");
  if (logosEnLocalStorage) {
    setLogosGuardados(JSON.parse(logosEnLocalStorage));
  }
}, []);

   const [mostrarOpcionesLogo, setMostrarOpcionesLogo] = useState(false);
  const [area, setArea] = useState("");
  const [poe, setPoe] = useState("");
  const [energiaUtilizada, setEnergiaUtilizada] = useState("");
  const [tiempoExposicion, setTiempoExposicion] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaInspeccion, setFechaInspeccion] = useState(() => {
  const hoy = new Date();
  return hoy.toISOString().split("T")[0]; // formato: yyyy-mm-dd
  
  
  
  
});



const handleDeleteLogo = (nombre) => {
  const confirmacion = window.confirm(`¿Eliminar el logo "${nombre}"?`);
  if (confirmacion) {
    const nuevos = logosGuardados.filter((logo) => logo.nombre !== nombre);
    setLogosGuardados(nuevos);
    localStorage.setItem("logosGuardados", JSON.stringify(nuevos));
    if (empresaSeleccionada === nombre) {
      setEmpresaSeleccionada("");
      setLogoSeleccionado(null);
    }
  }
};


  const [puestos, setPuestos] = useState([]);
  const [empresasLocales, setEmpresasLocales] = useState([]);
  const [nuevaEmpresaNombre, setNuevaEmpresaNombre] = useState("");
const [nuevaAreaNombre, setNuevaAreaNombre] = useState("");
const [empresaSeleccionadaParaArea, setEmpresaSeleccionadaParaArea] = useState("");
const [areasPorEmpresa, setAreasPorEmpresa] = useState(() => {
  const data = localStorage.getItem("areasPorEmpresa");
  return data ? JSON.parse(data) : {};
});

  const [newEmpresa, setNewEmpresa] = useState("");
  const [empresaAEliminar, setEmpresaAEliminar] = useState(null);
  const [newPuesto, setNewPuesto] = useState("");
  const [selectedPuestoToRemove, setSelectedPuestoToRemove] = useState("");
  const [tableId, setTableId] = useState(null);
  const [consequence, setConsequence] = useState("Lesiones sin baja");
  const [exposure, setExposure] = useState("Ocasionalmente");
  const [probability, setProbability] = useState(
    "Coincidencia extremadamente remota pero concebible",
  );
  const [image, setImage] = useState(null);
  const [selectedBodyImage, setSelectedBodyImage] = useState(null);
  const [selectedEPPImages, setSelectedEPPImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [newArea, setNewArea] = useState("");
  const [selectedAreaToRemove, setSelectedAreaToRemove] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [carpetas, setCarpetas] = useState([]);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [empresasFirebase, setEmpresasFirebase] = useState([]);
const [selectedEmpresaId, setSelectedEmpresaId] = useState("");
const [normasFirebase, setNormasFirebase] = useState([]);
const [selectedNormaId, setSelectedNormaId] = useState("");
const [empresaSeleccionadaFirebase, setEmpresaSeleccionadaFirebase] = useState("");
const showAgregarEmpresaYAreaModal = () => {
  setModalAction("Agregar");
  setShowModal(true);
};


const [opcionesIdentificacionesSeleccionadas, setOpcionesIdentificacionesSeleccionadas] = useState(Array(7).fill(""));
const [sistemasSeguridadSeleccionados, setSistemasSeguridadSeleccionados] = useState(Array(7).fill(""));





  const empresas = [
    { nombre: "", url: Maxion },
    { nombre: "", url: Safran },
    { nombre: "", url: "" },
  ];
const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");

const areas = areasPorEmpresa[empresaSeleccionada] || [];
const [empresaParaArea, setEmpresaParaArea] = useState("");
const [showModal, setShowModal] = useState(false);






  const [logoSeleccionado, setLogoSeleccionado] = useState(null);

  const [bodyParts, setBodyParts] = useState({
    "Cabeza y Oídos": false,
    "Ojos y Cara": false,
    "Sistema respiratorio": false,
    "Brazos y Manos": false,
    Tronco: false,
    "Extremidades inferiores": false,
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
    setEmpresaSeleccionada("");
    setLogoSeleccionado(null);
  };

  const optionImages = {
    option1: "/body/lvl1_head.png",
    option2: "/body/lvl1_mid.png",
    option3: "/body/lvl1_foot.png",
    option4: "/body/lvl1_hand.png",
    option5: "/body/lvl2_headmid.png",
    option6: "/body/lvl2_handfoot.png",
    option7: "/body/lvl2_headfoot.png",
    option8: "/body/lvl2_headhand.png",
    option9: "/body/lvl2_midhand.png",
    option10: "/body/lvl2_midfoot.png",
    option11: "/body/lvl3_headmidhand.png",
    option12: "/body/lvl3_headmidfoot.png",
    option13: "/body/lvl3_headhandfoot.png",
    option14: "/body/lvl3_midhandfoot.png",
    option15: "/body/lvl3_all.png",
  };

  const eppImagesList = [
    "/images/1.png",
    "/images/3.png",
    "/images/4.png",
    "/images/5.png",
    "/images/6.png",
    "/images/7.png",
    "/images/8.png",
    "/images/9.png",
    "/images/10.png",
    "/images/11.png",
    "/images/12.png",
    "/images/13.png",
    "/images/14.png",
    "/images/15.png",
    "/images/16.png",
    "/images/17.png",
    "/images/18.png",
    "/images/19.png",
    "/images/20.png",
    "/images/21.png",
    "/images/34.png",
    "/images/36.png",
  ];

  const eppNames = {
    "/images/1.png": "Ojos y Cara",
    "/images/3.png": "Gafas con filtro UV",
    "/images/4.png": "Botas de seguridad",
    "/images/5.png": "Protección Auditiva",
    "/images/6.png": "Guantes de protección",
    "/images/7.png": "Gafas contra sustancias",
    "/images/8.png": "Mascarilla Soldadura",
    "/images/9.png": "Mandil de seguridad",
    "/images/10.png": "Casco de seguridad",
    "/images/11.png": "Gafas antichoque",
    "/images/12.png": "Cinturón de seguridad",
    "/images/13.png": "Gafas para químicos",
    "/images/14.png": "Protección facial",
    "/images/15.png": "Careta para altas temperaturas",
    "/images/16.png": "Traje antirradiación",
    "/images/17.png": "Respirador",
    "/images/18.png": "Equipo biológico",
    "/images/19.png": "Conchas auditivas",
    "/images/20.png": "Tapones Auditivos",
    "/images/21.png": "Mangas de protección",
    "/images/34.png": "Arnés",
    "/images/36.png": "Overol",
  };

  const opcionesIdentificaciones = [
    "Riesgo de incendio",
    "Riesgo de atrapamiento o volcadura",
    "Riesgo de choque o atropello",
    "Riesgo de descarga eléctrica",
    "Exposición a temperaturas elevadas y abatidas",
    "Vibración",
    "Riesgo inundación",
    "Ventilación deficiente",
    "Daños ergonómicos",
    "Sustancia químicas",
    "Poca iluminación",
    "Particulas suspendidas en el ambiente",
  ];

  const opcionesSistemaseguridad = [
    "Paro de emergencia",
    "Sistema ANSUL",
    "Extintores",
    "Freno de emergencia",
    "Bandas antiestática",
    "Sistema de anclaje",
    "Programa de mantenimiento",
    "Guardas, parachoques y protectores de calaveras",
    "Calza de seguridad",
    "Bloqueo de sistema hidráulico",
    "Indicadores (torreta,luces,claxon,banderas, etc)",
    "Bloqueo de sistema eléctrico",
    "Cinturón de seguridad",
    "Barandales y escaleras",
    "Indicadores agua,aceite aire,motor, presión,etc",
    "Canopy",
    "Mata chispas",
    "Sistema loto",
  ];

  const opcionesConsecuencia = [
    "Catástrofe",
    "Varias muertes",
    "Muerte",
    "Lesiones graves",
    "Lesiones con baja",
    "Lesiones sin baja",
  ];

  const opcionesExposicion = [
    "Continuamente",
    "Frecuentemente",
    "Ocasionalmente",
    "Irregularmente",
    "Raramente",
  ];

  const opcionesProbabilidad = [
    "Es el resultado más probable y esperado",
    "Es completamente posible, no será nada extraño",
    "Sería una secuencia o coincidencia rara pero posible, ha ocurrido",
    "Coincidencia muy rara, pero se sabe que ha ocurrido",
    "Coincidencia extremadamente remota pero concebible",
    "Coincidencia prácticamente imposible, jamás ha ocurrido",
  ];

  const calcularValorConsecuencia = (c) => {
    const map = {
      Catástrofe: 100,
      "Varias muertes": 50,
      Muerte: 25,
      "Lesiones graves": 15,
      "Lesiones con baja": 5,
      "Lesiones sin baja": 1,
    };
    return map[c] || 0;
  };
  const calcularValorExposicion = (e) => {
    const map = {
      Continuamente: 10,
      Frecuentemente: 6,
      Ocasionalmente: 3,
      Irregularmente: 2,
      Raramente: 1,
      Remotamente: 0.1,
    };
    return map[e] || 0;
  };
  const calcularValorProbabilidad = (p) => {
    const map = {
      "Es el resultado más probable y esperado": 10,
      "Es completamente posible, no será nada extraño": 6,
      "Sería una secuencia o coincidencia rara pero posible, ha ocurrido": 3,
      "Coincidencia muy rara, pero se sabe que ha ocurrido": 1,
      "Coincidencia extremadamente remota pero concebible": 0.5,
      "Coincidencia prácticamente imposible, jamás ha ocurrido": 0.1,
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
    if (magnitud > 400)
      return { color: "red", accion: "Inmediata", clasificacion: "Muy Alto" };
    if (magnitud > 200)
      return { color: "orange", accion: "Urgente", clasificacion: "Alto" };
    if (magnitud > 70)
      return {
        color: "yellow",
        accion: "Programada",
        clasificacion: "Notable",
      };
    if (magnitud > 20)
      return {
        color: "green",
        accion: "Programada",
        clasificacion: "Moderado",
      };
    return {
      color: "blue",
      accion: "Sin acción requerida",
      clasificacion: "Bajo",
    };
  };

  const magnitudRiesgo = calcularMagnitudRiesgo();
  const { color, accion, clasificacion } =
    obtenerClasificacionRiesgo(magnitudRiesgo);

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
// Ajusta todos los textareas para que muestren el contenido completo antes de capturar


  const downloadImage = () => {
  const container = document.querySelector(".risk-table-container");
  container.classList.add("capturing");



  setTimeout(() => {
    html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "tabla_n004_equipos_moviles.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      container.classList.remove("capturing");
    });
  }, 100);
};

const handleReset = () => {
  setNombreMaquinaria("");
  setArea("");
  setPoe("");
  setTiempoExposicion("");
  setDescripcion("");
  setFechaInspeccion("");
  setNewPuesto("");
  setSelectedPuestoToRemove("");
  setIsEditing(false);
  setTableId(null);
  setConsequence("Lesiones sin baja");
  setExposure("Ocasionalmente");
  setProbability("Coincidencia extremadamente remota pero concebible");
  setImage(null);
  setSelectedBodyImage(null); // ✅ esto limpia la imagen del cuerpo
  setSelectedEPPImages([]);
  setEmpresaSeleccionada("");
  setLogoSeleccionado(null);
  setBodyParts({
    "Cabeza y Oídos": false,
    "Ojos y Cara": false,
    "Sistema respiratorio": false,
    "Brazos y Manos": false,
    Tronco: false,
    "Extremidades inferiores": false,
  });

  // ✅ limpia selects de identificación y seguridad
setOpcionesIdentificacionesSeleccionadas(Array(7).fill(""));
setSistemasSeguridadSeleccionados(Array(7).fill(""));

};
  const openModal = (action) => {
    setModalAction(action);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
  const empresasFromLS = JSON.parse(localStorage.getItem("empresasLocales")) || [];
setEmpresasLocales(empresasFromLS);

const areasFromLS = JSON.parse(localStorage.getItem("areasPorEmpresa")) || {};
setAreasPorEmpresa(areasFromLS);


    
    
    const savedEmpresas = JSON.parse(localStorage.getItem("empresasLocales"));
    if (savedEmpresas) setEmpresasLocales(savedEmpresas);

 
    const logosLocales = JSON.parse(localStorage.getItem("logosGuardados")) || [];
    setLogosGuardados(logosLocales);


 const tableToEdit = JSON.parse(localStorage.getItem("tableToEdit"));
if (tableToEdit) {
  setNombreMaquinaria(tableToEdit.nombreMaquinaria || "");
  setArea(tableToEdit.area || "");
  setEmpresaSeleccionada(tableToEdit.empresaSeleccionada || "");
  setLogoSeleccionado(logosGuardados.find(logo => logo.nombre === tableToEdit.empresaSeleccionada)?.url || null);
  setPoe(tableToEdit.poe || "");
  setLogoSeleccionado(tableToEdit.logoSeleccionado || null); // ✅ recupera el logo elegido
  setLogosGuardados(tableToEdit.logosGuardados || []);        // ✅ recupera la lista de logos (por si acaso)
  setEnergiaUtilizada(tableToEdit.energiaUtilizada || "");
  setTiempoExposicion(tableToEdit.tiempoExposicion || "");
  setFechaInspeccion(tableToEdit.fechaInspeccion || "");
  setDescripcion(tableToEdit.descripcion || "");

  setConsequence(tableToEdit.consequence || "Lesiones sin baja");
  setExposure(tableToEdit.exposure || "Ocasionalmente");
  setProbability(tableToEdit.probability || "Coincidencia extremadamente remota pero concebible");

  setImage(tableToEdit.image || null);
  setSelectedBodyImage(tableToEdit.selectedBodyImage || null);
  setSelectedEPPImages(tableToEdit.selectedEPPImages || []);
  setBodyParts(tableToEdit.bodyParts || {});

  setOpcionesIdentificacionesSeleccionadas(tableToEdit.opcionesIdentificacionesSeleccionadas || []);
  setSistemasSeguridadSeleccionados(tableToEdit.sistemasSeguridadSeleccionados || []);

  setIsEditing(true);
  setTableId(tableToEdit.id);

  localStorage.removeItem("tableToEdit");
}


    const loadFolders = async () => {
      const q = await getDocs(collection(db, "carpetas"));
      const fetched = q.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCarpetas(fetched);
    };
    loadFolders();
  }, []);

   const loadFolders = async () => {
      const q = await getDocs(collection(db, "carpetas"));
      const fetched = q.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCarpetas(fetched);
    };
    loadFolders();


    useEffect(() => {
  const fetchEmpresas = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "empresas"), where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const fetched = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setEmpresasFirebase(fetched);
  };

  fetchEmpresas();
}, []);

useEffect(() => {
  const fetchNormas = async () => {
    if (!empresaSeleccionadaFirebase) return;

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const normasRef = collection(db, "empresas", empresaSeleccionadaFirebase, "normas");
    const q = query(normasRef, where("uid", "==", user.uid));
    const snapshot = await getDocs(q);
    const normas = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setNormasFirebase(normas);
  };

  fetchNormas();
}, [empresaSeleccionadaFirebase]);




  





  const handleAddArea = () => {
  if (!empresaSeleccionada) {
    alert("Selecciona una empresa antes de agregar un área.");
    return;
  }

  const nuevasAreas = [...(areasPorEmpresa[empresaSeleccionada] || [])];
  if (!nuevasAreas.some((a) => a.nombre === newArea.trim())) {
    nuevasAreas.push({ nombre: newArea.trim() });

    const actualizado = {
      ...areasPorEmpresa,
      [empresaSeleccionada]: nuevasAreas,
    };

    setAreasPorEmpresa(actualizado);
    localStorage.setItem("areasPorEmpresa", JSON.stringify(actualizado));
    setNewArea("");
  }

  closeModal();
};


 const handleRemoveArea = () => {
  const nuevasAreas = (areasPorEmpresa[empresaSeleccionada] || []).filter(
    (a) => a.nombre !== selectedAreaToRemove.nombre
  );

  const actualizado = {
    ...areasPorEmpresa,
    [empresaSeleccionada]: nuevasAreas,
  };

  setAreasPorEmpresa(actualizado);
  localStorage.setItem("areasPorEmpresa", JSON.stringify(actualizado));
  setArea("");
  closeModal();
};


  const handleAddPuesto = () => {
    if (
      newPuesto.trim() &&
      !puestos.some((p) => p.nombre === newPuesto.trim())
    ) {
      const updated = [...puestos, { nombre: newPuesto.trim() }];
      setPuestos(updated);
      localStorage.setItem("puestos", JSON.stringify(updated));
      setNewPuesto("");
    }
  };

  

  const handleRemovePuesto = () => {
    if (selectedPuestoToRemove) {
      const updated = puestos.filter(
        (p) => p.nombre !== selectedPuestoToRemove.nombre,
      );
      setPuestos(updated);
      localStorage.setItem("puestos", JSON.stringify(updated));
      setSelectedPuestoToRemove(null);
    }
  };

  const handleGuardarEmpresa = () => {
  if (nuevaEmpresaNombre.trim()) {
    const yaExiste = empresasLocales.some(
      (emp) => emp.nombre === nuevaEmpresaNombre.trim()
    );

    if (!yaExiste) {
      const nuevas = [...empresasLocales, { nombre: nuevaEmpresaNombre.trim() }];
      setEmpresasLocales(nuevas);
      localStorage.setItem("empresasLocales", JSON.stringify(nuevas));
      setNuevaEmpresaNombre("");

      alert("Empresa guardada con éxito."); // ✅ Alerta aquí
    } else {
      alert("Esta empresa ya existe."); // ✅ Advertencia si ya existe
    }
  } else {
    alert("Debes escribir un nombre de empresa."); // ✅ Validación básica
  }
};


const handleVincularAreaAEmpresa = () => {
  if (empresaSeleccionadaParaArea && nuevaAreaNombre.trim()) {
    const copia = { ...areasPorEmpresa };

    // Asegúrate que exista el array para la empresa
    if (!copia[empresaSeleccionadaParaArea]) {
      copia[empresaSeleccionadaParaArea] = [];
    }

    // Validar si ya existe esa área por nombre
    const existe = copia[empresaSeleccionadaParaArea].some(
      (area) => area.nombre === nuevaAreaNombre.trim()
    );

    if (!existe) {
      copia[empresaSeleccionadaParaArea].push({
        nombre: nuevaAreaNombre.trim(),
      });

      alert("Área vinculada con éxito."); // ✅ Alerta aquí
    } else {
      alert("Esta área ya existe para la empresa seleccionada."); // ✅ Mensaje de advertencia
    }

    setAreasPorEmpresa(copia);
    localStorage.setItem("areasPorEmpresa", JSON.stringify(copia));
    setNuevaAreaNombre("");
  } else {
    alert("Debes seleccionar una empresa y escribir un nombre de área."); // ✅ Validación básica
  }
};



  const openFolderModal = () => setIsFolderModalOpen(true);
  const closeFolderModal = () => setIsFolderModalOpen(false);

  const handleCreateNewFolder = async () => {
    if (!newFolderName.trim()) return;
    const docRef = await addDoc(collection(db, "carpetas"), {
      nombre: newFolderName,
      fechaCreacion: serverTimestamp(),
    });
    setCarpetas([...carpetas, { id: docRef.id, nombre: newFolderName }]);
    setSelectedFolderId(docRef.id);
    setNewFolderName("");
  };

  const handleSelectFolder = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const saveTableData = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) {
    alert("No estás autenticado.");
    return;
  }

  if (!selectedEmpresaId || !selectedNormaId) {
    alert("Selecciona una empresa y una norma.");
    return;
  }

  const uid = user.uid;
  const magnitud = calcularMagnitudRiesgo();
  const { clasificacion } = obtenerClasificacionRiesgo(magnitud);

  const tableData = {
  uid,
  nombreMaquinaria,
  poe,
  energiaUtilizada,
  tiempoExposicion,
  descripcion,
  fechaInspeccion: fechaInspeccion || new Date().toLocaleDateString(),
  logosGuardados,
  logoSeleccionado, // ✅ Nuevo: guarda el logo elegido
  consequence,
  exposure,
  probability,
  magnitud,
  clasificacion,
  selectedEPPImages,
  selectedBodyImage,
  areaSeleccionada: area, // 👈 nombre correcto
  puestoSeleccionado: puestos.map((p) => p.nombre).join(", "), // 👈 convertir a texto
  norma: "N-004 (Moviles)",
  fecha: new Date().toLocaleDateString(),
  hora: new Date().toLocaleTimeString(),
  risk: calcularMagnitudRiesgo(),
  nombreEmpresa: empresaSeleccionada, // 👈 nombre correcto
  bodyParts,
  image,
  opcionesIdentificacionesSeleccionadas,
  sistemasSeguridadSeleccionados,

};



  try {
    if (isEditing && tableId) {
      const tableRef = doc(
        db,
        "empresas",
        selectedEmpresaId,
        "normas",
        selectedNormaId,
        "tablas",
        tableId
      );
      await updateDoc(tableRef, tableData);
      alert("Tabla actualizada exitosamente.");
    } else {
      await addDoc(
        collection(
          db,
          "empresas",
          selectedEmpresaId,
          "normas",
          selectedNormaId,
          "tablas"
        ),
        tableData
      );
      alert("Tabla guardada exitosamente.");
    }
  } catch (error) {
    console.error("Error al guardar tabla:", error);
    alert("Hubo un problema al guardar la tabla.");
  }
};

  return (
    <div className="risk-table-container">
      <div
        className="logo-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <img
          src={logo}
          alt="SIACH Logo"
          className="siach-logo"
          style={{ marginRight: "5px" }}
        />
        <h4 className="section-header" style={{ color: "black" }}>
          ANÁLISIS DE RIESGO POTENCIAL GENERADO POR EQUIPOS MÓVILES
          NOM-004-STPS-1999
        </h4>
<div style={{ display: "flex", alignItems: "center" }}>
{logoSeleccionado ? (
  <div style={{ display: "flex", alignItems: "center" }}>
    <img
      src={logoSeleccionado}
      alt="Logo"
      style={{ width: "80px", height: "auto", marginRight: "8px" }}
    />
    <button onClick={handleRemoveLogo} className="ocultar-al-exportar">×</button>
  </div>
) : (
  <>
    <button
      className="ocultar-al-exportar"
      title="Seleccionar logo"
      onClick={() => setMostrarOpcionesLogo(true)}
      style={{
        background: "none",
        border: "2px dashed #007bff",
        color: "#007bff",
        fontSize: "20px",
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer",
      }}
    >
      📁
    </button>

    {mostrarOpcionesLogo && (
      <div
        style={{
          background: "#f9f9f9",
          padding: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginTop: "10px",
        }}
      >
        <p><strong>¿Qué deseas hacer?</strong></p>

        {/* Subir nuevo logo */}
        <button onClick={() => document.getElementById("logo-file-input").click()}>
          Subir nuevo logo
        </button>

        <input
          type="file"
          id="logo-file-input"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64Logo = reader.result;
                const nombre = prompt("Nombre para el logo:");
                if (nombre) {
                  const nuevos = [...logosGuardados, { nombre, url: base64Logo }];
                  localStorage.setItem("logosGuardados", JSON.stringify(nuevos));
                  setLogosGuardados(nuevos);
                  setEmpresaSeleccionada(nombre);
                  setLogoSeleccionado(base64Logo);
                  setMostrarOpcionesLogo(false);
                }
              };
              reader.readAsDataURL(file);
            }
          }}
        />

        {/* Selección por nombre */}
        <div style={{ marginTop: "10px" }}>
          <p><strong>Seleccionar logo guardado:</strong></p>
          <select
            onChange={(e) => {
              const seleccionado = logosGuardados.find(
                (logo) => logo.nombre === e.target.value
              );
              if (seleccionado) {
                setLogoSeleccionado(seleccionado.url);
                setEmpresaSeleccionada(seleccionado.nombre);
                setMostrarOpcionesLogo(false);
              }
            }}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">-- Seleccionar --</option>
            {logosGuardados.map((logo, i) => (
              <option key={i} value={logo.nombre}>
                {logo.nombre}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setMostrarOpcionesLogo(false)}
          style={{
            marginTop: "10px",
            color: "#dc3545",
            border: "1px solid #dc3545",
            padding: "6px 12px",
            borderRadius: "6px",
            backgroundColor: "white",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
      </div>
    )}
  </>
)}




          
        </div>
      </div>

      <div className="tabla-responsive">
      <table className="risk-table" style={{ backgroundColor: "white" }}>
        
    <thead className="thead-responsive">
  {/* Fila 1: Encabezados */}
  <tr className="fila-ancha">
    <th className="red columna-ancha" style={{ textAlign: "center", lineHeight: "1.2" }}>
      Nombre de<br />la maquinaria
    </th>
<th className="red" style={{ textAlign: "center", lineHeight: "1.2" }}>
  	DESCRIPCIÓN del <br /> EQUIPO
</th>
    <th className="red">ÁREA</th>
    <th className="red">EMPRESA</th>
    <th className="red">POE</th>
    <th className="red" style={{ textAlign: "center", lineHeight: "1.2" }}>
  ENERGÍA<br />UTILIZADA
</th>
<th className="red" style={{ textAlign: "center", lineHeight: "1.2" }}>
  TIEMPO DE<br />EXPOSICIÓN
</th>
<th className="red" style={{ textAlign: "center", lineHeight: "1.2" }}>
  FECHA DE<br />INSPECCIÓN
</th>
  </tr>
</thead>

<tbody>
  <tr>
    {/* NOMBRE */}
    <td>
      <input
        placeholder="Introduzca un nombre"
        value={nombreMaquinaria}
        onChange={(e) => setNombreMaquinaria(e.target.value)}
        style={{
          width: "100%",
          height: "40px",
          fontSize: "15px",
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />
    </td>

    {/* DESCRIPCIÓN */}
{/* DESCRIPCIÓN */}
<td>
  <textarea
    value={descripcion}
    onChange={(e) => setDescripcion(e.target.value)}
    rows={3} // Fijo a 3 renglones, puedes ajustar
    style={{
      width: "100%",
      height: "60px",            // 🔒 Altura fija
      resize: "none",            // 🔒 No redimensionable por el usuario
      fontSize: "15px",
      padding: "6px 10px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      boxSizing: "border-box",   // 🧱 Asegura que padding no expanda el tamaño
      overflow: "hidden",        // 🔒 Sin scroll visible
      wordBreak: "break-word",
      whiteSpace: "pre-wrap",
      lineHeight: "1.2",
      outline: "none",
      fontFamily: "inherit",
    }}
  />
</td>



    {/* ÁREA */}
    <td>
      <select
        name="areas"
        value={area}
        onChange={(e) => setArea(e.target.value)}
        className="dropdown-areas"
        style={{ width: "100%" }}
      >
        <option value="">Seleccione un área</option>
        {(areasPorEmpresa[empresaSeleccionada] || []).map((ar, index) => (
          <option key={index} value={ar.nombre}>
            {ar.nombre}
          </option>
        ))}
      </select>
    </td>

    {/* EMPRESA */}
    <td>
      <select
        value={empresaSeleccionada}
        onChange={handleEmpresaChange}
        className="dropdown-empresa"
        style={{ width: "100%" }}
      >
        <option value="">Seleccione una empresa</option>
        {empresasLocales.map((emp, index) => (
          <option key={`local-${index}`} value={emp.nombre}>
            {emp.nombre}
          </option>
        ))}
        {empresas.map((emp, index) => (
          <option key={`fija-${index}`} value={emp.nombre}>
            {emp.nombre}
          </option>
        ))}
      </select>
    </td>

    {/* POE */}
    <td>
      <input
        placeholder="Introduzca el POE"
        type="text"
        value={poe}
        onChange={(e) => setPoe(e.target.value)}
        style={{
          width: "100%",
          height: "40px",
          fontSize: "15px",
          padding: "8px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />
    </td>

    <td>
 <select
  value={energiaUtilizada}
  onChange={(e) => setEnergiaUtilizada(e.target.value)}
  style={{
    width: "100%",
    height: "40px",
    fontSize: "15px",
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
  }}
>
  <option value="">Seleccione la energía utilizada</option>
  <option value="Eléctrica">Eléctrica</option>
  <option value="Manual">Manual</option>
  <option value="Mecánica">Mecánica</option>
  <option value="Hidráulica">Hidráulica</option>
  <option value="Eólica">Eólica</option>
  <option value="Térmica por combustión">Térmica por combustión</option>
  <option value="Hidroneumatica">Hidroneumatica</option>
  <option value="Neumatica">Neumatica</option>
</select>

</td>


    {/* TIEMPO */}
  {/* TIEMPO DE EXPOSICIÓN */}
<td>
  <input
    type="text"
    placeholder="Tiempo"
    value={tiempoExposicion}
    onChange={(e) => setTiempoExposicion(e.target.value)}
    style={{
      width: "100%",
      height: "40px",
      fontSize: "15px",
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      boxSizing: "border-box"
    }}
  />
</td>

{/* FECHA DE INSPECCIÓN */}
<td>
  <input
    type="date"
    value={fechaInspeccion}
    onChange={(e) => setFechaInspeccion(e.target.value)}
    style={{
      width: "100%",
      height: "40px",
      fontSize: "15px",
      padding: "8px 12px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      boxSizing: "border-box"
    }}
  />
</td>



  </tr>
</tbody>


        <tbody>
          <tr>
           <tr>
  <td className="image-section" colSpan="3">
    <div
      className="uploaded"
      onClick={() => document.getElementById("upload-image").click()}
    >
      {image ? (
        <img src={image} alt="Uploaded" />
      ) : (
        <p className="image-placeholder">
          Haz clic para cargar una imagen
        </p>
      )}
    </div>
    <input
      id="upload-image"
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      style={{ display: "none" }}
    />
  </td>
</tr>

            <td className="risk-info" colSpan="5">
  <h4 className="blacktitle-small">Identificación de riesgos</h4>
  {[...Array(7)].map((_, index) => (
    <select
      key={index}
      className="dropdown-large-text"
      value={opcionesIdentificacionesSeleccionadas[index] || ""}
      onChange={(e) => {
        const updated = [...opcionesIdentificacionesSeleccionadas];
        updated[index] = e.target.value;
        setOpcionesIdentificacionesSeleccionadas(updated);
      }}
    >
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
    <select
      key={index}
      className="dropdown-large-text"
      value={sistemasSeguridadSeleccionados[index] || ""}
      onChange={(e) => {
        const updated = [...sistemasSeguridadSeleccionados];
        updated[index] = e.target.value;
        setSistemasSeguridadSeleccionados(updated);
      }}
    >
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
  <thead>
    <tr>
      <th colSpan="6">
        Principales partes del cuerpo expuestas al riesgo:
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cabeza y Oídos</td>
      <td
        data-check="true"
        onClick={() =>
          setBodyParts((prev) => ({
            ...prev,
            "Cabeza y Oídos": !prev["Cabeza y Oídos"],
          }))
        }
        style={{
    border: "1px solid #ccc",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
    width: "70px",
    height: "30px",
    verticalAlign: "middle",
    lineHeight: "30px",
    padding: "0",
  }}

      >
        {bodyParts["Cabeza y Oídos"] ? "X" : ""}
      </td>

      <td>Ojos y Cara</td>
      <td
        data-check="true"
        onClick={() =>
          setBodyParts((prev) => ({
            ...prev,
            "Ojos y Cara": !prev["Ojos y Cara"],
          }))
        }
            style={{
    border: "1px solid #ccc",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
    width: "70px",
    height: "30px",
    verticalAlign: "middle",
    lineHeight: "30px",
    padding: "0",
  }}
      >
        {bodyParts["Ojos y Cara"] ? "X" : ""}
      </td>

      <td>Sistema respiratorio</td>
      <td
        data-check="true"
        onClick={() =>
          setBodyParts((prev) => ({
            ...prev,
            "Sistema respiratorio": !prev["Sistema respiratorio"],
          }))
        }
            style={{
    border: "1px solid #ccc",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
    width: "70px",
    height: "30px",
    verticalAlign: "middle",
    lineHeight: "30px",
    padding: "0",
  }}
      >
        {bodyParts["Sistema respiratorio"] ? "X" : ""}
      </td>
    </tr>
    <tr>
      <td>Brazos y Manos</td>
      <td
        data-check="true"
        onClick={() =>
          setBodyParts((prev) => ({
            ...prev,
            "Brazos y Manos": !prev["Brazos y Manos"],
          }))
        }
            style={{
    border: "1px solid #ccc",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
    width: "70px",
    height: "30px",
    verticalAlign: "middle",
    lineHeight: "30px",
    padding: "0",
  }}
      >
        {bodyParts["Brazos y Manos"] ? "X" : ""}
      </td>

      <td>Tronco</td>
      <td
        data-check="true"
        onClick={() =>
          setBodyParts((prev) => ({
            ...prev,
            Tronco: !prev["Tronco"],
          }))
        }
            style={{
    border: "1px solid #ccc",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
    width: "70px",
    height: "30px",
    verticalAlign: "middle",
    lineHeight: "30px",
    padding: "0",
  }}
      >
        {bodyParts["Tronco"] ? "X" : ""}
      </td>

      <td>Extremidades inferiores</td>
      <td
        data-check="true"
        onClick={() =>
          setBodyParts((prev) => ({
            ...prev,
            "Extremidades inferiores":
              !prev["Extremidades inferiores"],
          }))
        }
           style={{
    border: "1px solid #ccc",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "bold",
    width: "70px",
    height: "30px",
    verticalAlign: "middle",
    lineHeight: "30px",
    padding: "0",
  }}
      >
        {bodyParts["Extremidades inferiores"] ? "X" : ""}
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
                    <td style={{ fontSize: "16px" }}>Consecuencia</td>
                    <td style={{ fontSize: "16px" }}>Exposición</td>
                    <td style={{ fontSize: "16px" }}>Probabilidad</td>
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
                    <td>
                      Valor Consecuencia:{" "}
                      {calcularValorConsecuencia(consequence)}
                    </td>
                    <td>
                      Valor Exposición: {calcularValorExposicion(exposure)}
                    </td>
                    <td>
                      Valor Probabilidad:{" "}
                      {calcularValorProbabilidad(probability)}
                    </td>
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
                    <td className="tall-cell">
                      Clasificación: {clasificacion}
                    </td>
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
                <select
                  className="custom-select"
                  onChange={handleSelectBodyImage}
                >
                  <option value="">Selecciona la extremidad afectada</option>
                  {Object.entries(optionImages).map(([key, imagePath]) => (
                    <option key={key} value={imagePath}>
                      {
                        {
                          option1: "Cabeza",
                          option2: "Tronco",
                          option3: "Pies",
                          option4: "Brazos",
                          option5: "Cabeza y Tronco",
                          option6: "Brazos y Pies",
                          option7: "Cabeza y Pies",
                          option8: "Cabeza y Brazos",
                          option9: "Tronco y Brazos",
                          option10: "Tronco y Pies",
                          option11: "Cabeza, Tronco y Brazos",
                          option12: "Cabeza, Tronco y Pies",
                          option13: "Cabeza, Brazos y Pies",
                          option14: "Tronco, Brazos y Pies",
                          option15: "Todas las Extremidades",
                        }[key]
                      }
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
      </div>

      {!isCapturing && (
  <div className="botones-no-imprimir" style={{ marginTop: "20px" }}>
    <button onClick={downloadImage} className="download-button">
      Descargar PDF
    </button>
    <button onClick={openFolderModal} className="save-button">
      {isEditing ? "Actualizar Tabla" : "Guardar Tabla"}
    </button>
    <button onClick={handleReset} className="reset-button">
      Reiniciar Tabla
    </button>

    {/* 👇 Agrega aquí los botones de área */}
    <button
      type="button"
      className="button-small ocultar-al-exportar"
      onClick={() => openModal("Agregar")}
      title="Agregar área"
      style={{
        marginLeft: "16px",
        backgroundColor: "#f0fdf4",
        border: "1px solid #bbf7d0",
        color: "#16a34a",
        borderRadius: "6px",
        padding: "8px 12px",
        cursor: "pointer",
      }}
    >
      + Agregar Área o Empresa
    </button>

    <button
      type="button"
      className="button-small ocultar-al-exportar"
      onClick={() => openModal("Eliminar")}
      title="Eliminar área"
      style={{
        marginLeft: "8px",
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        color: "#dc2626",
        borderRadius: "6px",
        padding: "8px 12px",
        cursor: "pointer",
      }}
    >
      x Eliminar Área o Empresa
    </button>
  </div>
)}

<Modal
  isOpen={modalIsOpen}
  onRequestClose={closeModal}
  contentLabel="Gestión de datos"
  ariaHideApp={false}
 style={{
  content: {
    top: "30%",                      // 🟢 Modal inicia un poco más arriba
    left: "50%",
    transform: "translateX(-50%)", // Solo centrado horizontal
    padding: "30px",
    borderRadius: "12px",
    width: "500px",
    height: "auto",                // 🟢 Altura dinámica
    maxHeight: "none",            // 🔥 SIN límite de altura
    overflow: "visible",          // 🔥 NO scroll
    position: "absolute",         // Permite que se expanda libre
  },
}}



>
  {modalAction === "Agregar" && (
  <div className="agregar-empresa-container">
    <h2 className="titulo-seccion">Agregar Empresa y Área</h2>

    {/* Sección Empresa */}
    <div className="form-group">
      <label className="form-label">Nueva Empresa:</label>
      <input
        type="text"
        className="form-input"
        placeholder=""
        value={nuevaEmpresaNombre}
        onChange={(e) => setNuevaEmpresaNombre(e.target.value)}
      />
      <button className="form-button" onClick={handleGuardarEmpresa}>
        Guardar Empresa
      </button>
    </div>

    {/* Sección Área */}
    <h3 className="titulo-subseccion">Vincular Área a Empresa</h3>
    
    <div className="form-group">
      <label className="form-label">Empresa:</label>
      <select
        className="form-select"
        value={empresaSeleccionadaParaArea}
        onChange={(e) => setEmpresaSeleccionadaParaArea(e.target.value)}
      >
        <option value="">Selecciona una empresa</option>
        {empresasLocales.map((emp, idx) => (
          <option key={idx} value={emp.nombre}>
            {emp.nombre}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label className="form-label">Nueva Área:</label>
      <input
        type="text"
        className="form-input"
        placeholder=""
        value={nuevaAreaNombre}
        onChange={(e) => setNuevaAreaNombre(e.target.value)}
      />
      <button className="form-button" onClick={handleVincularAreaAEmpresa}>
        Vincular Área a Empresa
      </button>
    </div>
  </div>
)}
  {/* Sección: Eliminar Área / Puesto / Empresa */}
  {modalAction === "Eliminar" && (
  <>
    {/* Eliminar Área */}
    <div style={{ marginBottom: "20px" }}>
      <h2 style={{ marginBottom: "10px" }}>Eliminar Área</h2>
      <select
        value={selectedAreaToRemove?.nombre || ""}
        onChange={(e) =>
          setSelectedAreaToRemove(
            areas.find((ar) => ar.nombre === e.target.value)
          )
        }
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "10px",
        }}
      >
        <option value="">Seleccione un área para eliminar</option>
        {areas.map((ar, idx) => (
          <option key={idx} value={ar.nombre}>{ar.nombre}</option>
        ))}
      </select>
      <button
        onClick={handleRemoveArea}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Eliminar Área
      </button>
    </div>

    {/* Eliminar Puesto */}
    <div style={{ marginBottom: "20px" }}>
      
    </div>

    {/* Eliminar Empresa */}
    <div style={{ marginBottom: "20px" }}>
      <h2 style={{ marginBottom: "10px" }}>Eliminar Empresa</h2>
      <select
        value={empresaAEliminar?.nombre || ""}
        onChange={(e) =>
          setEmpresaAEliminar(
            empresasLocales.find((emp) => emp.nombre === e.target.value)
          )
        }
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "10px",
        }}
      >
        <option value="">Seleccione una empresa para eliminar</option>
        {empresasLocales.map((emp, idx) => (
          <option key={idx} value={emp.nombre}>{emp.nombre}</option>
        ))}
      </select>
      <button
        onClick={() => {
          if (empresaAEliminar) {
            const filtradas = empresasLocales.filter(
              (e) => e.nombre !== empresaAEliminar.nombre
            );
            setEmpresasLocales(filtradas);
            localStorage.setItem("empresasLocales", JSON.stringify(filtradas));
            setEmpresaAEliminar(null);
          }
        }}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Eliminar Empresa
      </button>
    </div>
  </>
)}

{/* Botón Cancelar */}
<button
  onClick={closeModal}
  style={{
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#f4f4f4",
    border: "1px solid #ccc",
    borderRadius: "4px",
    cursor: "pointer",
  }}
>
  Cancelar
</button>

</Modal>


     <Modal
  isOpen={isFolderModalOpen}
  onRequestClose={closeFolderModal}
  contentLabel="Seleccionar Empresa y Norma"
  ariaHideApp={false}
  style={{
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  }}
>
  <h2>Selecciona una Empresa</h2>
  {empresasFirebase.map((empresa) => (
    <div key={empresa.id} style={{ marginBottom: "10px" }}>
      <label>
       <input
  type="radio"
  name="empresa"
  value={empresa.id}
  checked={selectedEmpresaId === empresa.id}
  onChange={() => {
  setSelectedEmpresaId(empresa.id);
  setEmpresaSeleccionadaFirebase(empresa.id); // 👈 necesario para cargar normas
}}
/>

        {empresa.nombre}
      </label>
    </div>
  ))}

  {empresaSeleccionadaFirebase && (
    <>
      <h3>Selecciona una Norma</h3>
      {normasFirebase.map((norma) => (
        <div key={norma.id}>
          <label>
            <input
  type="radio"
  name="norma"
  value={norma.id}
  checked={selectedNormaId === norma.id}
  onChange={() => setSelectedNormaId(norma.id)}
/>

            {norma.nombre}
          </label>
        </div>
      ))}
    </>
  )}

  <div style={{ marginTop: "20px" }}>
    <button
      onClick={() => {
  if (!selectedEmpresaId || !selectedNormaId) {
    alert("Selecciona una empresa y una norma.");
    return;
  }
  saveTableData(); // Ya usa selectedEmpresaId y selectedNormaId internamente
  closeFolderModal();
}}

      style={{ marginRight: "10px" }}
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
