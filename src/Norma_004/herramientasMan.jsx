import React, { useState, useCallback, useEffect, useRef } from "react";
import {  query, where } from "firebase/firestore";




import "./HerramientasMan.css";
import html2canvas from "html2canvas";
import Modal from "react-modal";

import {
  collection,
  addDoc,
  getDoc,
  getDocs, // 👈 AÑADIDO AQUÍ
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import logo from "../logos/logo.png";

const RiskTable = () => {


  
const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
const [selectedEmpresaId, setSelectedEmpresaId] = useState(null);
const [selectedNormaId, setSelectedNormaId] = useState(null);
const [empresaSeleccionadaFirebase, setEmpresaSeleccionadaFirebase] = useState(null);
const [empresasFirebase, setEmpresasFirebase] = useState([]);
const [normasFirebase, setNormasFirebase] = useState([]);
const [energiaUtilizada, setEnergiaUtilizada] = useState("");
const [nombreMaquinaria, setNombreMaquinaria] = useState("");
const [tiempoExposicion, setTiempoExposicion] = useState("");
const [descripcion, setDescripcion] = useState("");
const [selectedPeligros, setSelectedPeligros] = useState([]);
const [affectedBodyParts, setAffectedBodyParts] = useState([]);
const [maquinariaDescripcion, setMaquinariaDescripcion] = useState("");

// Segunda tabla (duplicados)
const [image2, setImage2] = useState(null);
const [selectedEPPImages2, setSelectedEPPImages2] = useState([]);
const [selectedBodyImage2, setSelectedBodyImage2] = useState(null);
const [maquinariaDescripcion2, setMaquinariaDescripcion2] = useState("");
const [nombreMaquinaria2, setNombreMaquinaria2] = useState("");
const [tiempoExposicion2, setTiempoExposicion2] = useState("");
const[empresa2, setEmpresa2] = useState("");



const [opcionesIdentificacionesSeleccionadas2, setOpcionesIdentificacionesSeleccionadas2] = useState([]);
const [sistemasSeguridadSeleccionados2, setSistemasSeguridadSeleccionados2] = useState([]);
const [logoSeleccionado2, setLogoSeleccionado2] = useState(null);
const [logosGuardados2, setLogosGuardados2] = useState([]);
const [fechaInspeccion2, setFechaInspeccion2] = useState("");
const [isEditing2, setIsEditing2] = useState(false);

const [area2, setArea2] = useState("");
const [bodyParts2, setBodyParts2] = useState(["", "", "", "", ""]);
const [selectedEPP2, setSelectedEPP2] = useState(["", "", "", "", "", "", ""]);
const [poe2, setPoe2] = useState("");
const [energiaUtilizada2, setEnergiaUtilizada2] = useState("");

const [tableId2, setTableId2] = useState(null);
const [showEliminarModal2, setShowEliminarModal2] = useState(false);
const [showAgregarModal2, setShowAgregarModal2] = useState(false);
const [selectedRightLogo2, setSelectedRightLogo2] = useState(null);
const [isExporting2, setIsExporting2] = useState(false);


const [consequence2, setConsequence2] = useState(0);
const [exposure2, setExposure2] = useState(0);
const [probability2, setProbability2] = useState(0);
const [imagePreview2, setImagePreview2] = useState(null);

const [partesPorPeligro2, setPartesPorPeligro2] = useState({});
const [selectedPeligros2, setSelectedPeligros2] = useState([]);
const [observacionesGenerales2, setObservacionesGenerales2] = useState("");
const [color2, setColor2] = useState("#ffffff");
const [clasificacion2, setClasificacion2] = useState("");
const [accion2, setAccion2] = useState("");
const [magnitudRiesgo2, setMagnitudRiesgo2] = useState(0);



//


const [image, setImage] = useState(null);
const [selectedEPPImages, setSelectedEPPImages] = useState([]);
const [selectedBodyImage, setSelectedBodyImage] = useState(null);

const [opcionesIdentificacionesSeleccionadas, setOpcionesIdentificacionesSeleccionadas] = useState([]);
const [sistemasSeguridadSeleccionados, setSistemasSeguridadSeleccionados] = useState([]);
const [logoSeleccionado, setLogoSeleccionado] = useState(null);
const [logosGuardados, setLogosGuardados] = useState([]);
const [fechaInspeccion, setFechaInspeccion] = useState("");
const [isEditing, setIsEditing] = useState(false);
const [areas, setAreas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [puestos, setPuestos] = useState([]);
  const [newArea, setNewArea] = useState("");
  const [newPuesto, setNewPuesto] = useState("");
  const [area, setArea] = useState("");
  const [bodyParts, setBodyParts] = useState(["", "", "", "", ""]);
const [selectedEPP, setSelectedEPP] = useState(["", "", "", "", "", "", ""]);
const [poe, setPoe] = useState(""); // ← Estado para el POE
  
  const [tableId, setTableId] = useState(null);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [selectedRightLogo, setSelectedRightLogo] = useState(null);
  const [isExporting, setIsExporting] = useState(false);


  const inputEstilo = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "15px",
  backgroundColor: "#fff",
  boxSizing: "border-box"
};


  const peligros = [
  "Golpes y cortes en manos ocasionados por las propias herramientas durante el trabajo normal con las mismas",
  "Lesiones oculares por partículas provenientes de los objetos que se trabajan y/o de la propia herramienta",
  "Golpes en diferentes partes del cuerpo por despido de la propia herramienta o del material trabajado",
  "Esguince por sobreesfuerzos o gestos violentos",
];

const [peligrosSeleccionados2, setPeligrosSeleccionados2] = useState([]);
const [observaciones2, setObservaciones2] = useState("");
  
const togglePeligro2 = (peligro) => {
  setPeligrosSeleccionados2((prev) =>
    prev.includes(peligro)
      ? prev.filter((p) => p !== peligro)
      : [...prev, peligro]
  );
};


  useEffect(() => {
  const riesgo = consequence2 * exposure2 * probability2;
  setMagnitudRiesgo2(riesgo);
  // Clasificación
  if (riesgo >= 150) {
    setClasificacion2("Muy Grave");
    setAccion2("Suspender actividades");
  } else if (riesgo >= 80) {
    setClasificacion2("Grave");
    setAccion2("Corregir de inmediato");
  } else if (riesgo >= 40) {
    setClasificacion2("Moderado");
    setAccion2("Corregir pronto");
  } else if (riesgo >= 20) {
    setClasificacion2("Tolerable");
    setAccion2("Mejorar si es posible");
  } else {
    setClasificacion2("Aceptable");
    setAccion2("Sin acción necesaria");
  }
}, [consequence2, exposure2, probability2]);








useEffect(() => {
  const tableToEdit = JSON.parse(localStorage.getItem("tableToEdit"));
  if (tableToEdit) {
    setNombreMaquinaria(tableToEdit.nombreMaquinaria || "");
    setArea(tableToEdit.areaSeleccionada || "");
    setEmpresaSeleccionada(tableToEdit.nombreEmpresa || "");
    setLogoSeleccionado(
      tableToEdit.logoSeleccionado ||
      logosGuardados.find((logo) => logo.nombre === tableToEdit.nombreEmpresa)?.url ||
      null
    );
    setLogosGuardados(tableToEdit.logosGuardados || []);
    setPoe(tableToEdit.poe || "");
    setEnergiaUtilizada(tableToEdit.energiaUtilizada || "");
    setMaquinariaDescripcion(tableToEdit.maquinariaDescripcion || "");
    setTiempoExposicion(tableToEdit.tiempoExposicion || "");
    setFechaInspeccion(tableToEdit.fechaInspeccion || "");
    setDescripcion(tableToEdit.descripcion || "");
    setConsequence(tableToEdit.consequence || "Lesiones sin baja");
    setExposure(tableToEdit.exposure || "Ocasionalmente");
    setProbability(tableToEdit.probability || "Coincidencia extremadamente remota pero concebible");
    setImage(tableToEdit.image || null);
    setSelectedBodyImage(tableToEdit.selectedBodyImage || null);
    setSelectedEPP(tableToEdit.selectedEPP || ["", "", "", "", "", "", ""]);
    setSelectedRightLogo(tableToEdit.selectedRightLogo || null);
    setState((prev) => ({
  ...prev,
  imagePreview: tableToEdit.imagePreview || null,
}));









  
    

    
    setSelectedPeligros(tableToEdit.opcionesIdentificacionesSeleccionadas || []);
 setBodyParts(
  Array.isArray(tableToEdit.bodyParts)
    ? tableToEdit.bodyParts
    : Object.keys(tableToEdit.bodyParts || {}).filter(
        (key) => tableToEdit.bodyParts[key]
      )
);

    setOpcionesIdentificacionesSeleccionadas(tableToEdit.opcionesIdentificacionesSeleccionadas || []);
    setSistemasSeguridadSeleccionados(tableToEdit.sistemasSeguridadSeleccionados || []);
    setPuestos(
      tableToEdit.puestoSeleccionado
        ? tableToEdit.puestoSeleccionado.split(",").map((p) => ({ nombre: p.trim() }))
        : []
    );

    setIsEditing(true);
    setTableId(tableToEdit.id);

    localStorage.removeItem("tableToEdit");
  }
}, []);




useEffect(() => {
  const savedAreas = JSON.parse(localStorage.getItem("areas")) || [];
  setAreas(savedAreas.filter((area) => area && area.nombre));

  const savedEmpresas = JSON.parse(localStorage.getItem("empresas")) || [];
  setEmpresas(savedEmpresas);
}, []);

// 🔽 1. Carga empresas desde Firebase (por UID)
useEffect(() => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const loadEmpresas = async () => {
      const q = query(collection(db, "empresas"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmpresasFirebase(fetched);
    };

    loadEmpresas();
  }
}, []);

// 🔽 2. Carga normas cuando se seleccione una empresa
useEffect(() => {
  const loadNormas = async () => {
    if (empresaSeleccionadaFirebase) {
      const normasRef = collection(db, "empresas", empresaSeleccionadaFirebase, "normas");
      const snapshot = await getDocs(normasRef);
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNormasFirebase(fetched);
    }
  };

  loadNormas();
}, [empresaSeleccionadaFirebase]);













  const opciones = {
    consecuencia: [
      "Catástrofe",
      "Varias muertes",
      "Muerte",
      "Lesiones graves",
      "Lesiones con baja",
      "Lesiones sin baja",
    ],
    exposicion: [
      "Continuamente",
      "Frecuentemente",
      "Ocasionalmente",
      "Irregularmente",
      "Raramente",
    ],
    probabilidad: [
      "Es el resultado más probable y esperado",
      "Es completamente posible, no será nada extraño",
      "Sería una secuencia o coincidencia rara pero posible, ha ocurrido",
      "Coincidencia muy rara, pero se sabe que ha ocurrido",
      "Coincidencia extremadamente remota pero concebible",
      "Coincidencia prácticamente imposible, jamás ha ocurrido",
    ],
    tiempoExposicion: ["0-2 hrs", "2-4 hrs", "4-8 hrs", "8+ hrs"],
    energia: [
      "Eléctrica",
      "Manual",
      "Mecánica",
      "Hidráulica",
      "Eólica",
      "Térmica por combustión",
      "Hidroneumatica",
      "Neumatica",

    ],
  };

  const partesPorPeligro = {
    "Golpes y cortes en manos ocasionados por las propias herramientas durante el trabajo normal con las mismas":
      ["Brazos y manos", "Dedos"],
    "Lesiones oculares por partículas provenientes de los objetos que se trabajan y/o de la propia herramienta":
      ["Ojos y cara"],
    "Golpes en diferentes partes del cuerpo por despido de la propia herramienta o del material trabajado":
      ["Cabeza y oídos", "Tronco", "Brazos y manos", "Extremidades inferiores"],
    "Esguince por sobreesfuerzos o gestos violentos": [
      "Tronco",
      "Extremidades inferiores",
    ],
  };

  const listaEPP = [
    "Anteojos de protección",
    "Bata",
    "Botas impermeables",
    "Calzado conductivo",
    "Calzado contra impacto",
    "Calzado contra sustancias químicas",
    "Calzado dieléctrico",
    "Calzado ocupacional",
    "Careta para soldador",
    "Capuchas",
    "Casco contra impacto",
    "Casco dieléctrico",
    "Conchas acústicas",
    "Equipo de protección contra caídas de altura",
    "Equipo de respiración autónomo",
    "Equipo para brigadista contra incendio",
    "Goggles",
    "Guantes",
    "Guantes contra sustancias químicas",
    "Guantes contra temperaturas extremas",
    "Guantes dieléctricos",
    "Mandil contra altas temperaturas",
    "Mandil contra sustancias químicas",
    "Mangas",
    "Mascarilla desechable",
    "Overol",
    "Pantalla facial",
    "Polainas",
    "Ropa contra sustancias peligrosas",
    "Respirador contra gases y vapores",
    "Respirador contra partículas",
  ];


  const todasPartesCuerpo = [
  "Cabeza y oídos",
  "Ojos y cara",
  "Tronco",
  "Brazos y manos",
  "Dedos",
  "Extremidades inferiores",
];


const handleConsequence2Change = (e) =>
  setConsequence2(parseFloat(e.target.value));
const handleExposure2Change = (e) =>
  setExposure2(parseFloat(e.target.value));
const handleProbability2Change = (e) =>
  setProbability2(parseFloat(e.target.value));

const handleImageChange2 = (e) => {
  const file = e.target.files[0];
  if (file?.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview2(reader.result);
      setImage2(reader.result);
    };
    reader.readAsDataURL(file);
  }
};




  const handlePeligroChange = (peligro) => {
    const isSelected = selectedPeligros.includes(peligro);

    let newSelectedPeligros = [];
    let newAffectedParts = [];

    if (isSelected) {
      newSelectedPeligros = selectedPeligros.filter((item) => item !== peligro);
      newAffectedParts = affectedBodyParts.filter(
        (part) => !partesPorPeligro[peligro].includes(part),
      );
    } else {
      newSelectedPeligros = [...selectedPeligros, peligro];
      newAffectedParts = [
        ...new Set([...affectedBodyParts, ...partesPorPeligro[peligro]]),
      ];
    }

    setSelectedPeligros(newSelectedPeligros);
    setAffectedBodyParts(newAffectedParts);
  };


 const handlePeligroChange2 = (peligro) => {
  setSelectedPeligros2((prev) =>
    prev.includes(peligro)
      ? prev.filter((item) => item !== peligro)
      : [...prev, peligro]
  );
};

    const [state, setState] = useState({
    consequence: "Lesiones sin baja",
    exposure: "Ocasionalmente",
    probability: "Coincidencia extremadamente remota pero concebible",
    tiempoExposicion: "4-8 hrs",
    energiaUtilizada: "Eléctrica",
    observacionesGenerales: "",

    imagePreview: null,
    errorMessage: "",
  });

  const [consequence, setConsequence] = useState(1);
  const [exposure, setExposure] = useState(1);
  const [probability, setProbability] = useState(1);

  const handleConsequenceChange = (e) =>
    setConsequence(parseFloat(e.target.value));
  const handleExposureChange = (e) =>
    setExposure(parseFloat(e.target.value));
  const handleProbabilityChange = (e) =>
    setProbability(parseFloat(e.target.value));

  const handleChange = useCallback((field, value) => {
    setState((prevState) => ({ ...prevState, [field]: value }));
  }, []);

const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file?.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onloadend = () => {
      handleChange("imagePreview", reader.result);
      e.target.value = ""; // ⚠️ Reinicia el input file para permitir cargar la misma imagen
    };
    reader.readAsDataURL(file);
  } else {
    handleChange("errorMessage", "Formato de archivo no válido");
    e.target.value = ""; // También reinicia si hubo error
  }
};


  const calcularMagnitudRiesgo = () => {
    const valorConsecuencia = consequence;
    const valorExposicion = exposure;
    const valorProbabilidad = probability;
    return Math.floor(valorConsecuencia * valorExposicion * valorProbabilidad);
  };

  const obtenerClasificacionRiesgo = (magnitud) => {
    if (magnitud > 400) {
      return {
        color: "red",
        texto: "Muy Alto: Detención inmediata",
        accion: "Inmediata",
        clasificacion: "Muy Alto",
      };
    } else if (magnitud > 200) {
      return {
        color: "orange",
        texto: "Alto: Corrección inmediata",
        accion: "Urgente",
        clasificacion: "Alto",
      };
    } else if (magnitud > 70) {
      return {
        color: "yellow",
        texto: "Notable: Corrección urgente",
        accion: "Programada",
        clasificacion: "Notable",
      };
    } else if (magnitud > 20) {
      return {
        color: "green",
        texto: "Moderado: Debe corregirse",
        accion: "Programada",
        clasificacion: "Moderado",
      };
    } else {
      return {
        color: "blue",
        texto: "Bajo o Aceptable: Tolerable",
        accion: "Sin acción requerida",
        clasificacion: "Bajo",
      };
    }
  };

  const obtenerColorPorRiesgo = (magnitud) => {
    const clasificacion = obtenerClasificacionRiesgo(magnitud);
    return clasificacion.color;
  };

  const magnitudRiesgo = calcularMagnitudRiesgo();
  const { color, accion, clasificacion } = obtenerClasificacionRiesgo(magnitudRiesgo);


  const downloadImage = () => {
    const input = document.getElementById("pdf-content");

    if (input) {
      html2canvas(input, { scale: 2, useCORS: true, backgroundColor: "#fff" })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = imgData;
          link.download = "tabla_herramientas_manual.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          console.error("Error al generar la imagen:", error);
        });
    } else {
      console.error("No se encontró el elemento para capturar la imagen.");
    }
  };

  const handleAddArea = () => {
  if (!empresaSeleccionada) {
    alert("Debes seleccionar una empresa primero.");
    return;
  }

  const clave = `${empresaSeleccionada}-${newArea.trim()}`;

  if (newArea.trim() && !areas.some((a) => a.nombre === clave)) {
    const nuevaArea = {
      nombre: clave,
      empresa: empresaSeleccionada,
      puestos: [],
    };

    const updatedAreas = [...areas, nuevaArea];
    setAreas(updatedAreas);
    localStorage.setItem("areas", JSON.stringify(updatedAreas));
    setNewArea("");
    alert("Área agregada con éxito.");
  } else {
    alert("El área ya existe o es inválida.");
  }
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
    norma: "N-004(Herramientas)",
    nombreEmpresa: empresaSeleccionada,
    areaSeleccionada: area,
    poe,
    risk: magnitud,
    energiaUtilizada,
    nombreMaquinaria,
    tiempoExposicion,
    imagePreview: state.imagePreview || null,
    selectedRightLogo,
    maquinariaDescripcion,
    descripcion,
    fecha: new Date().toLocaleDateString("es-MX"),
    hora: new Date().toLocaleTimeString("es-MX"),
    image,
    consequence,
    exposure,
    probability,
    magnitud,
    clasificacion,
    selectedEPP,
    selectedBodyImage,
    bodyParts,
    opcionesIdentificacionesSeleccionadas: selectedPeligros,
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
      alert("✅ Tabla actualizada exitosamente.");
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
      alert("✅ Tabla guardada exitosamente.");
    }

    // ✅ Guardar resumen acumulado para herramientas
    await updateResumenData(area, magnitud, uid, empresaSeleccionada);

  } catch (error) {
    console.error("❌ Error al guardar tabla:", error);
    alert("❌ Hubo un problema al guardar la tabla.");
  }
};

const updateResumenData = async (area, magnitud, uid, empresa) => {
  if (!area || !empresa) {
    console.error("Faltan datos para actualizar el resumen.");
    return;
  }

  try {
    const resumenRef = doc(
      db,
      "resumen_004_herramientas", // ✅ Colección específica
      empresa,
      "areas",
      area
    );

    const resumenSnapshot = await getDoc(resumenRef);

    let resumenData = resumenSnapshot.exists()
      ? resumenSnapshot.data()
      : {
          uid,
          tolerable: 0,
          moderado: 0,
          notable: 0,
          elevado: 0,
          grave: 0,
        };

    // ✅ Acumular en la categoría correcta según la magnitud
    if (magnitud <= 20) resumenData.tolerable += 1;
    else if (magnitud <= 70) resumenData.moderado += 1;
    else if (magnitud <= 200) resumenData.notable += 1;
    else if (magnitud <= 400) resumenData.elevado += 1;
    else resumenData.grave += 1;

    await setDoc(resumenRef, resumenData);
    console.log("✅ Resumen actualizado para:", empresa, ">", area);
  } catch (error) {
    console.error("❌ Error al actualizar resumen:", error);
  }
};

 const handleDownload = async () => {
  // Agrega clase temporal al body para aplicar estilos forzados
  document.body.classList.add("capturing");

  setIsExporting(true);
  await new Promise((resolve) => setTimeout(resolve, 300)); // da tiempo a aplicar los estilos
  await downloadImage();
  setIsExporting(false);

  // Quita la clase después de exportar
  document.body.classList.remove("capturing");
};


  

  const handleResetTable = () => {
  // Reiniciar estados principales
  setState({
    consequence: "Lesiones sin baja",
    exposure: "Ocasionalmente",
    probability: "Coincidencia extremadamente remota pero concebible",
    tiempoExposicion: "4-8 hrs",
    energiaUtilizada: "Eléctrica",
    observacionesGenerales: "",
    maquinariaDescripcion: "",
    imagePreview: null,
    errorMessage: "",
    nombreMaquinaria: "",
    
    // estados de tabla doble
    nombreMaquinaria2: "",
    maquinariaDescripcion2: "",
    energiaUtilizada2: "Eléctrica",
    tiempoExposicion2: "4-8 hrs",
    imagePreview2: null,
    exposure2: "Ocasionalmente",
    
    
    
  });

  setSelectedPeligros([]);
  setAffectedBodyParts([]);
  setConsequence(1);
  setExposure(1);
  setProbability(1);
  setArea("");
  setEmpresaSeleccionada("");
  setNewArea("");
  setNewPuesto("");
  setPuestos([]);
  setSelectedRightLogo(null);
  setTableId(null);
  setBodyParts(["", "", "", ""]); // Reinicia partes del cuerpo
  setSelectedEPP(["", "", "", "", "", "", ""]); // 🔥 Agrega esta línea para reiniciar EPP
  setPoe(""); // ← Resetea el campo POE
  setNombreMaquinaria("");
  setMaquinariaDescripcion("");



  // setters de la segunda tabla
  setSelectedPeligros2([]);
  setBodyParts2(["", "", "", "", ""]);
  setSelectedEPP2(["", "", "", "", "", "", ""]);
  setPoe2("");
  setConsequence2(1);
  setExposure2(1);
  setProbability2(1);
  


  
  

  
};




  const renderOptions = (options) => {
    return options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ));
  };
// Durante la exportación, calcula el número máximo de filas seleccionadas entre ambas listas
const visibleBodyParts = isExporting ? bodyParts.filter(p => p) : bodyParts;
const visibleEPP = isExporting ? selectedEPP.filter(e => e) : selectedEPP;

const exportRowCount = isExporting ? Math.max(visibleBodyParts.length, visibleEPP.length) : bodyParts.length;


return (
  <div
    className="risk-table-container"
    style={{
      position: "relative",
      width: "100%",
      maxWidth: "none",
      overflowX: "hidden",
      margin: "0 auto",
      padding: "0",
      boxSizing: "border-box",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#333",
    }}
  >
    <div id="pdf-content" className="risk-table-wrapper">
      <div className="risk-table" style={{ width: "100%", fontSize: "1em" }}>
        {/* ENCABEZADO CON LOGOS Y TÍTULO CENTRADO */}
        <div
          className="header-container"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto 1fr",
            alignItems: "center",
            padding: "15px 0",
            marginBottom: "20px",
            background: "#ffffff",
            borderBottom: "1px solid #eee",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            textAlign: "center",
          }}
        >
          <div style={{ justifySelf: "start", paddingLeft: "20px" }}>
            <img src={logo} alt="Logo SIAH" style={{ height: "60px", objectFit: "contain" }} />
          </div>
          <div>
            <h2 className="section-header" style={{ color: "#2c3e50", textAlign: "center", margin: "0", fontSize: "24px", lineHeight: "1.3" }}>
              ANÁLISIS DE RIESGO POTENCIAL GENERADO POR HERRAMIENTAS MANUALES
              <br />
              <span style={{ fontSize: "16px", fontWeight: "normal", color: "#7f8c8d" }}>NOM-004-STPS-1999</span>
            </h2>
          </div>
          <div style={{ justifySelf: "end", paddingRight: "20px" }}>
            {!selectedRightLogo ? (
              <label
                style={{
                  backgroundColor: "#3498db",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "background-color 0.3s ease",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
                title="Cargar logo de empresa"
              >
                📁 Cargar Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setSelectedRightLogo(url);
                    }
                  }}
                  style={{ display: "none" }}
                />
              </label>
            ) : (
              <div style={{ position: "relative", width: "180px", height: "90px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img
                  src={selectedRightLogo}
                  alt="Logo de empresa"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    display: "block",
                    borderRadius: "4px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  }}
                />
                <button
                  onClick={() => setSelectedRightLogo(null)}
                  className={`remove-logo-btn ${isExporting ? "hidden-during-export" : ""}`}
                  style={{
                    position: "absolute",
                    top: "-10px",
                    right: "-10px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "22px",
                    height: "22px",
                    fontSize: "14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    transition: "background-color 0.3s ease, transform 0.2s ease",
                  }}
                  title="Eliminar logo"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TABLA PRINCIPAL */}
        <table
          className="main-table"
          style={{
            width: "100%",
            tableLayout: "auto",
            borderCollapse: "collapse",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  whiteSpace: "normal",
                  fontSize: "14px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  minWidth: "160px",
                  lineHeight: "1.3",
                  backgroundColor: "#526D82",
                  color: "white",
                  padding: "12px 8px",
                  border: "1px solid #455A64",
                }}
              >
                NOMBRE DE LA MAQUINARIA
              </th>
              <th colSpan="2" style={{ backgroundColor: "#ecf0f1", padding: "8px", border: "1px solid #ddd" }}>
                <input
                  type="text"
                  placeholder="Introduzca el nombre de la maquinaria"
                  value={nombreMaquinaria}
                  onChange={(e) => setNombreMaquinaria(e.target.value)}
                  style={{
                    width: "calc(100% - 16px)",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "15px",
                    boxSizing: "border-box",
                    border: "1px solid #bdc3c7",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                />
              </th>
              <th
                colSpan="2"
                style={{
                  whiteSpace: "normal",
                  minWidth: "220px",
                  fontSize: "14px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  lineHeight: "1.3",
                  padding: "12px 8px",
                  backgroundColor: "#526D82",
                  color: "white",
                  border: "1px solid #455A64",
                }}
              >
                DESCRIPCIÓN DE LA MAQUINARIA O EQUIPO:
              </th>
              <th colSpan="4" style={{ backgroundColor: "#ecf0f1", padding: "8px", border: "1px solid #ddd" }}>
                <textarea
                  placeholder="Describa la maquinaria o equipo"
                  value={maquinariaDescripcion}
                  onChange={(e) => setMaquinariaDescripcion(e.target.value)}
                  rows={4}
                  style={{
                    width: "calc(100% - 16px)",
                    padding: "10px",
                    borderRadius: "5px",
                    fontSize: "15px",
                    boxSizing: "border-box",
                    border: "1px solid #bdc3c7",
                    minHeight: "80px",
                    resize: "vertical",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                />
              </th>
              <th colSpan="2" style={{ backgroundColor: "#526D82", color: "white", padding: "12px 8px", border: "1px solid #455A64" }}>
                ENERGÍA UTILIZADA:
              </th>
              <th colSpan="2" style={{ backgroundColor: "#ecf0f1", padding: "8px", border: "1px solid #ddd" }}>
                <select
                  className="energia-utilizada"
                  value={state.energiaUtilizada}
                  onChange={(e) => handleChange("energiaUtilizada", e.target.value)}
                  style={{
                    width: "calc(100% - 16px)",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #bdc3c7",
                    fontSize: "15px",
                    backgroundColor: "white",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237f8c8d'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 8px center",
                    backgroundSize: "20px",
                  }}
                >
                  {renderOptions(opciones.energia)}
                </select>
              </th>
              <th colSpan="1" style={{ backgroundColor: "#526D82", color: "white", padding: "12px 8px", border: "1px solid #455A64" }}>
                ÁREA:
              </th>
              <th colSpan="2" style={{ backgroundColor: "#ecf0f1", padding: "8px", border: "1px solid #ddd" }}>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  style={{
                    width: "calc(100% - 16px)",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #bdc3c7",
                    fontSize: "15px",
                    backgroundColor: "white",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237f8c8d'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 8px center",
                    backgroundSize: "20px",
                  }}
                >
                  <option value="">Selecciona un área</option>
                  {areas
                    .filter(
                      (a) =>
                        a &&
                        a.nombre &&
                        empresaSeleccionada &&
                        a.nombre.startsWith(`${empresaSeleccionada}-`)
                    )
                    .map((a, i) => (
                      <option key={i} value={a.nombre}>
                        {a.nombre.split("-")[1]}
                      </option>
                    ))}
                </select>
              </th>
            </tr>

            <tr>
              <th
                colSpan="6"
                style={{
                  whiteSpace: "normal",
                  lineHeight: "1.3",
                  fontSize: "14px",
                  textAlign: "center",
                  backgroundColor: "#526D82",
                  color: "white",
                  padding: "12px 8px",
                  border: "1px solid #455A64",
                }}
              >
                LOCALIZACIÓN ESQUEMÁTICA DE LOS RIESGOS EN LAS HERRAMIENTAS
              </th>
              <th colSpan="2" style={{ backgroundColor: "#526D82", color: "white", padding: "12px 8px", border: "1px solid #455A64" }}>
                EMPRESA
              </th>
              <th colSpan="2" style={{ backgroundColor: "#ecf0f1", padding: "8px", border: "1px solid #ddd" }}>
                <select
                  name="empresas"
                  value={empresaSeleccionada}
                  onChange={(e) => setEmpresaSeleccionada(e.target.value)}
                  style={{
                    width: "calc(100% - 16px)",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #bdc3c7",
                    fontSize: "15px",
                    backgroundColor: "white",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237f8c8d'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 8px center",
                    backgroundSize: "20px",
                  }}
                >
                  <option value="">Seleccione una empresa</option>
                  {empresas.map((empresa, index) => (
                    <option key={index} value={empresa}>
                      {empresa}
                    </option>
                  ))}
                </select>
              </th>
              <th style={{ backgroundColor: "#526D82", color: "white", padding: "12px 8px", border: "1px solid #455A64" }}>POE</th>
              <th colSpan="2" style={{ backgroundColor: "#ecf0f1", padding: "8px", border: "1px solid #ddd" }}>
                <input
                  type="text"
                  value={poe}
                  onChange={(e) => setPoe(e.target.value)}
                  placeholder="Escriba el POE"
                  style={{
                    width: "calc(100% - 16px)",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #bdc3c7",
                    fontSize: "15px",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                />
              </th>
              <th colSpan="2" style={{ backgroundColor: "#526D82", color: "white", padding: "12px 8px", border: "1px solid #455A64" }}>
                TIEMPO DE EXPOSICIÓN:
              </th>
              <th colSpan="2" style={{ backgroundColor: "#ecf0f1", padding: "8px", border: "1px solid #ddd" }}>
                <select
                  value={state.tiempoExposicion}
                  onChange={(e) => handleChange("tiempoExposicion", e.target.value)}
                  style={{
                    width: "calc(100% - 16px)",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #bdc3c7",
                    fontSize: "15px",
                    backgroundColor: "white",
                    appearance: "none",
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237f8c8d'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 8px center",
                    backgroundSize: "20px",
                  }}
                >
                  {renderOptions(opciones.tiempoExposicion)}
                </select>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td colSpan="6" rowSpan="2" style={{ padding: "10px", border: "1px solid #ddd" }}>
                <div
                  className="image-section"
                  onClick={() => {
                    if (state.imagePreview) {
                      handleChange("imagePreview", null);
                    } else {
                      document.getElementById("hiddenFileInput").click();
                    }
                  }}
                  style={{
                    width: "100%",
                    height: "300px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px dashed #95a5a6",
                    borderRadius: "10px",
                    overflow: "hidden",
                    backgroundColor: "#fefefe",
                    transition: "border-color 0.3s ease, background-color 0.3s ease",
                    position: "relative",
                  }}
                >
                  {state.imagePreview ? (
                    <img
                      src={state.imagePreview}
                      alt="Vista previa"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        color: "#7f8c8d",
                        fontStyle: "italic",
                        textAlign: "center",
                        fontSize: "16px",
                        padding: "20px",
                      }}
                    >
                      Haz clic para cargar imagen o para eliminar la existente
                    </span>
                  )}
                  <input
                    id="hiddenFileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                </div>
              </td>
              <td colSpan="10" className="right-aligned" style={{ verticalAlign: "top", padding: "10px", border: "1px solid #ddd" }}>
                <div style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "12px", color: "#2c3e50", textAlign: "center" }}>
                  Evaluación de riesgo de trabajo
                </div>
                <table style={{ width: "100%", fontSize: "16px", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "12px", backgroundColor: "#dcdfe2", border: "1px solid #ccc", textAlign: "center" }}>Consecuencia</th>
                      <th style={{ padding: "12px", backgroundColor: "#dcdfe2", border: "1px solid #ccc", textAlign: "center" }}>Exposición</th>
                      <th style={{ padding: "12px", backgroundColor: "#dcdfe2", border: "1px solid #ccc", textAlign: "center" }}>Probabilidad</th>
                      <th style={{ padding: "12px", backgroundColor: "#dcdfe2", border: "1px solid #ccc", textAlign: "center" }}>Magnitud del Riesgo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "10px", backgroundColor: "#fdfefe", border: "1px solid #eee" }}>
                        <select
                          value={consequence}
                          onChange={handleConsequenceChange}
                          style={{
                            width: "100%",
                            fontSize: "15px",
                            padding: "10px",
                            border: "1px solid #bdc3c7",
                            borderRadius: "5px",
                            backgroundColor: "white",
                            appearance: "none",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237f8c8d'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 8px center",
                            backgroundSize: "20px",
                          }}
                        >
                          <option value={100}>Catástrofe</option>
                          <option value={50}>Varias muertes</option>
                          <option value={25}>Muerte</option>
                          <option value={15}>Lesiones graves</option>
                          <option value={5}>Lesiones con baja</option>
                          <option value={1}>Lesiones sin baja</option>
                        </select>
                        <div style={{ fontSize: "14px", marginTop: "8px", textAlign: "center", color: "#555" }}>Valor: {consequence}</div>
                      </td>
                      <td style={{ padding: "10px", backgroundColor: "#fdfefe", border: "1px solid #eee" }}>
                        <select
                          value={exposure}
                          onChange={handleExposureChange}
                          style={{
                            width: "100%",
                            fontSize: "15px",
                            padding: "10px",
                            border: "1px solid #bdc3c7",
                            borderRadius: "5px",
                            backgroundColor: "white",
                            appearance: "none",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237f8c8d'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 8px center",
                            backgroundSize: "20px",
                          }}
                        >
                          <option value={10}>Continuamente</option>
                          <option value={6}>Frecuentemente</option>
                          <option value={3}>Ocasionalmente</option>
                          <option value={2}>Irregularmente</option>
                          <option value={1}>Raramente</option>
                          <option value={0.5}>Remotamente</option>
                        </select>
                        <div style={{ fontSize: "14px", marginTop: "8px", textAlign: "center", color: "#555" }}>Valor: {exposure}</div>
                      </td>
                      <td style={{ padding: "10px", backgroundColor: "#fdfefe", border: "1px solid #eee" }}>
                        <select
                          value={probability}
                          onChange={handleProbabilityChange}
                          style={{
                            width: "100%",
                            fontSize: "15px",
                            padding: "10px",
                            border: "1px solid #bdc3c7",
                            borderRadius: "5px",
                            backgroundColor: "white",
                            appearance: "none",
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237f8c8d'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right 8px center",
                            backgroundSize: "20px",
                          }}
                        >
                          <option value={10}>Es el resultado más probable y esperado</option>
                          <option value={6}>Es completamente posible, no será nada extraño</option>
                          <option value={3}>Sería una secuencia o coincidencia rara pero posible, ha ocurrido</option>
                          <option value={1}>Coincidencia muy rara, pero se sabe que ha ocurrido</option>
                          <option value={0.5}>Coincidencia extremadamente remota pero concebible</option>
                          <option value={0.1}>Coincidencia prácticamente imposible, jamás ha ocurrido</option>
                        </select>
                        <div style={{ fontSize: "14px", marginTop: "8px", textAlign: "center", color: "#555" }}>Valor: {probability}</div>
                      </td>
                      <td
                        style={{
                          backgroundColor: obtenerColorPorRiesgo(magnitudRiesgo),
                          color: "white",
                          fontWeight: "bold",
                          fontSize: "26px",
                          textAlign: "center",
                          padding: "15px",
                          border: "1px solid #eee",
                          textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                        }}
                      >
                        {magnitudRiesgo.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td
                colSpan="16"
                style={{
                  backgroundColor: color,
                  color: "white",
                  textAlign: "center",
                  padding: "15px 10px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  border: "1px solid #ddd",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.2)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                  <div>Magnitud del Riesgo: {magnitudRiesgo.toFixed(2)}</div>
                  <div>Clasificación: {clasificacion}</div>
                  <div>Acción: {accion}</div>
                </div>
              </td>
            </tr>

            <tr>
              <td colSpan="11" rowSpan="5" style={{ verticalAlign: "top", padding: "10px", border: "1px solid #ddd" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: "left", fontSize: "18px", padding: "12px", backgroundColor: "#dcdfe2", border: "1px solid #ccc" }}>
                        Identificación del Riesgo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div
                          style={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            border: "1px solid #bdc3c7",
                            borderRadius: "8px",
                            padding: "15px",
                            fontSize: "15px",
                            lineHeight: "1.7",
                            backgroundColor: "#fefefe",
                          }}
                        >
                          {Object.entries(partesPorPeligro).map(([peligro], index) => {
                            const isSelected = selectedPeligros.includes(peligro);

                            return (
                              <div
                                key={index}
                                onClick={() => handlePeligroChange(peligro)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  marginBottom: "8px",
                                  cursor: "pointer",
                                  padding: "10px 15px",
                                  borderRadius: "8px",
                                  backgroundColor: isSelected ? "#e3f2fd" : "#ffffff",
                                  border: "1px solid #e0e0e0",
                                  transition: "all 0.2s ease",
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                  fontWeight: isSelected ? "bold" : "normal",
                                  color: isSelected ? "#2196F3" : "#333333",
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: "24px",
                                    height: "24px",
                                    marginRight: "15px",
                                    borderRadius: "5px",
                                    backgroundColor: isSelected ? "#2196F3" : "#ffffff",
                                    border: `2px solid ${isSelected ? "#2196F3" : "#bdbdbd"}`,
                                    color: isSelected ? "#ffffff" : "transparent",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    transition: "all 0.2s ease",
                                  }}
                                >
                                  ✓
                                </span>
                                <span style={{ flex: 1, fontSize: "15px", color: isSelected ? "#2c3e50" : "#333333", letterSpacing: "0.2px" }}>
                                  {peligro}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div style={{ marginTop: "25px" }}>
                          <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px", fontSize: "16px", color: "#2c3e50" }}>Observaciones:</label>
                          <textarea
                            id="observaciones"
                            value={state.observacionesGenerales}
                            onChange={(e) =>
                              handleChange("observacionesGenerales", e.target.value)
                            }
                            placeholder="Agregar observaciones generales aquí"
                            rows={5}
                            style={{
                              width: "calc(100% - 20px)",
                              padding: "12px",
                              borderRadius: "8px",
                              fontSize: "15px",
                              resize: "vertical",
                              border: "1px solid #bdc3c7",
                              minHeight: "120px",
                              backgroundColor: "#fefefe",
                              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                              transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>

              <td colSpan="3" style={{ verticalAlign: "top", padding: "10px", border: "1px solid #ddd" }}>
                <table className="risk-body-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ fontSize: "14px", padding: "12px", backgroundColor: "#dcdfe2", border: "1px solid #ccc", textAlign: "center" }}>
                        Principales partes del cuerpo expuestas al riesgo:
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(isExporting ? bodyParts.filter(p => p) : bodyParts).map((selected, index) => (
                      <tr key={index}>
                        <td style={{ padding: "8px", backgroundColor: "#fdfefe", border: "1px solid #eee" }}>
                          {isExporting ? (
                            <div style={{ padding: "8px", minHeight: "45px", display: "flex", alignItems: "center", color: "#333", fontSize: "15px" }}>
                              {selected}
                            </div>
                          ) : (
                            <select
                              style={{
                                width: "calc(100% - 16px)",
                                padding: "10px",
                                borderRadius: "5px",
                                border: "1px solid #bdc3c7",
                                fontSize: "15px",
                                backgroundColor: "white",
                                appearance: "none",
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237f8c8d'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 8px center",
                                backgroundSize: "20px",
                              }}
                              value={selected}
                              onChange={(e) => {
                                const updated = [...bodyParts];
                                updated[index] = e.target.value;
                                setBodyParts(updated);
                              }}
                            >
                              <option value="">Seleccione parte del cuerpo</option>
                              {todasPartesCuerpo.map((parte, idx) => (
                                <option key={idx} value={parte}>{parte}</option>
                              ))}
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
              <td colSpan="5" style={{ verticalAlign: "top", padding: "10px", border: "1px solid #ddd" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "12px", backgroundColor: "#dcdfe2", border: "1px solid #ccc", textAlign: "center" }}>Equipo de Protección Personal sugerido:</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEPP.map((value, index) => (
                      <tr key={index}>
                        <td style={{ padding: "8px", backgroundColor: "#fdfefe", border: "1px solid #eee" }}>
                          <select
                            style={{
                              width: "calc(100% - 16px)",
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid #bdc3c7",
                              fontSize: "15px",
                              backgroundColor: "white",
                              appearance: "none",
                              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237f8c8d'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 8px center",
                              backgroundSize: "20px",
                            }}
                            value={value}
                            onChange={(e) => {
                              const updated = [...selectedEPP];
                              updated[index] = e.target.value;
                              setSelectedEPP(updated);
                            }}
                          >
                            <option value="" disabled>Seleccione un EPP</option>
                            {listaEPP.map((epp, i) => (
                              <option key={i} value={epp}>{epp}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>





          


        </div>
      </div>
      <button onClick={handleDownload}>Descargar PDF</button>
      <button
  onClick={() => setIsFolderModalOpen(true)}
  className="download-button"
>
  Guardar tabla
</button>

      <button onClick={handleResetTable} style={{ marginLeft: "10px", backgroundColor: "#999", color: "white", padding: "8px 12px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
  Reiniciar tabla
</button>

   <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
 <button
  title="Agregar Área o Empresa"
  onClick={() => setShowAgregarModal(true)}
  style={{
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
    fontSize: "18px",
  }}
>
  +
</button>


  <button
    title="Eliminar Área o Empresa"
    onClick={() => setShowEliminarModal(true)}
    style={{
      backgroundColor: "#f44336",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "8px 12px",
      cursor: "pointer",
      fontSize: "18px",
    }}
  >
    x
  </button>
</div>

<Modal
  isOpen={isFolderModalOpen}
  onRequestClose={() => setIsFolderModalOpen(false)}
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
            setEmpresaSeleccionadaFirebase(empresa.id);
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

        saveTableData(); // guardará usando selectedEmpresaId y selectedNormaId
        setIsFolderModalOpen(false);
      }}
      style={{ marginRight: "10px" }}
    >
      Guardar Tabla
    </button>
    <button onClick={() => setIsFolderModalOpen(false)}>Cancelar</button>
  </div>
</Modal>


      
  
 {showAgregarModal && (
  <div className="modal">
    <div className="modal-content">
      {/* Agregar Empresa */}
      <h4>Agregar Empresa</h4>
      <input
        type="text"
        value={empresaSeleccionada}
        onChange={(e) => setEmpresaSeleccionada(e.target.value)}
        placeholder="Nombre de la empresa"
      />
      <button
        onClick={() => {
          const nombre = empresaSeleccionada.trim();
          if (nombre && !empresas.includes(nombre)) {
            const nuevasEmpresas = [...empresas, nombre];
            setEmpresas(nuevasEmpresas);
            localStorage.setItem("empresas", JSON.stringify(nuevasEmpresas));
            setEmpresaSeleccionada("");
            alert("Empresa agregada con éxito.");
          } else {
            alert("La empresa ya existe o es inválida.");
          }
        }}
      >
        Agregar Empresa
      </button>

      <hr />

      {/* Agregar Área (vinculada a empresa) */}
      <h4>Agregar Área vinculada a empresa</h4>
      <select
        value={empresaSeleccionada}
        onChange={(e) => setEmpresaSeleccionada(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <option value="">Seleccione una empresa</option>
        {empresas.map((empresa, index) => (
          <option key={index} value={empresa}>
            {empresa}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={newArea}
        onChange={(e) => setNewArea(e.target.value)}
        placeholder="Nombre del área"
      />
      <button
        onClick={() => {
          if (!empresaSeleccionada) {
            alert("Debes seleccionar una empresa.");
            return;
          }

          const clave = `${empresaSeleccionada}-${newArea.trim()}`;
          if (
            newArea.trim() &&
            !areas.some((a) => a.nombre === clave)
          ) {
            const nuevaArea = {
              nombre: clave,
              empresa: empresaSeleccionada,
              puestos: [],
            };

            const updatedAreas = [...areas, nuevaArea];
            setAreas(updatedAreas);
            localStorage.setItem("areas", JSON.stringify(updatedAreas));
            setNewArea("");
            alert("Área agregada con éxito.");
          } else {
            alert("El área ya existe, no hay empresa seleccionada o es inválida.");
          }
        }}
      >
        Agregar Área
      </button>

      {/* Botón Cancelar */}
      <button
        onClick={() => setShowAgregarModal(false)}
        style={{
          marginTop: "15px",
          backgroundColor: "#eee",
          border: "none",
          borderRadius: "5px",
          padding: "8px",
          width: "100%",
        }}
      >
        Cancelar
      </button>
    </div>
  </div>
)}


{showEliminarModal && (
  <div className="modal">
    <div className="modal-content">
      <h4>Eliminar Área</h4>
      <select
        value={area}
        onChange={(e) => setArea(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <option value="">Selecciona un área</option>
        {areas.map((a, i) => (
          <option key={i} value={a.nombre}>
            {a.nombre}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          if (area) {
            const nuevasAreas = areas.filter((a) => a.nombre !== area);
            setAreas(nuevasAreas);
            localStorage.setItem("areas", JSON.stringify(nuevasAreas));
            setArea("");
            alert("Área eliminada con éxito.");
          } else {
            alert("Selecciona un área para eliminar.");
          }
        }}
      >
        Eliminar Área
      </button>

      <h4 style={{ marginTop: "20px" }}>Eliminar Empresa</h4>
      <select
        value={empresaSeleccionada}
        onChange={(e) => setEmpresaSeleccionada(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      >
        <option value="">Selecciona una empresa</option>
        {empresas.map((empresa, i) => (
          <option key={i} value={empresa}>
            {empresa}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          if (empresaSeleccionada) {
            const nuevasEmpresas = empresas.filter((e) => e !== empresaSeleccionada);
            setEmpresas(nuevasEmpresas);
            localStorage.setItem("empresas", JSON.stringify(nuevasEmpresas));
            setEmpresaSeleccionada("");
            alert("Empresa eliminada con éxito.");
          } else {
            alert("Selecciona una empresa para eliminar.");
          }
        }}
      >
        Eliminar Empresa
      </button>

      <button
        onClick={() => setShowEliminarModal(false)}
        style={{
          marginTop: "10px",
          backgroundColor: "#eee",
          border: "none",
          borderRadius: "5px",
          padding: "8px",
          width: "100%",
        }}
      >
        Cancelar
      </button>
    </div>
  </div>
)}





    </div>

  );
};


  
export default RiskTable;







