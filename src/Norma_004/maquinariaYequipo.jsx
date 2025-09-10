import React, { useState, useEffect, useRef} from "react";
import "./MaquinariaYequipo.css";
import html2canvas from "html2canvas";
import Modal from "react-modal";
import { jsPDF } from "jspdf";


import {
  addDoc,
  updateDoc,
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { auth } from "../firebase"; // Ajusta la ruta si tu archivo firebase.js está en otra carpeta


import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import logo from "../logos/logo.png";
import Maxion from "../logos/maxion.jpeg";
import Safran from "../logos/safran.jpeg";

const protectionImages = {
  "Caídas de Altura": ["/images/10.png", "/images/34.png"],
  "Exposición a Temperaturas": ["/images/6.png"],
  "Exposición a Electricidad Estática": ["/images/6.png", "/images/4.png"],
  "Exposición a Sustancias Químicas": [
    "/images/7.png",
    "/images/13.png",
    "/images/6.png",
    "/images/17.png",
  ],
  "Exposición a Radiaciones": ["/images/16.png"],
  "Exposición agentes Biológicos": ["/images/18.png", "/images/16.png"],
  "Exposición a Ruido": ["/images/19.png", "/images/5.png"],
  "Exposición a Vibraciones": ["/images/14.png", "/images/4.png"],
  "Superficies cortantes": ["/images/6.png", "/images/1.png", "/images/21.png"],
  "Caídas a nivel o desnivel": ["/images/4.png"],
  "Daños Ergonómicos": ["/images/15.png"],
  "Calentamiento de materia prima, subproducto o producto": [
    "/images/6.png",
    "/images/15.png",
  ],
  "Proyección de material o herramienta": ["/images/7.png", "/images/12.png"],
  "Mantenimiento preventivo, correctivo o predictivo": [
    "/images/12.png",
    "/images/3.png",
  ],
};

const RiskTable = () => {
  const [nombreMaquinaria, setNombreMaquinaria] = useState("");
  
  const [selectedHazards, setSelectedHazards] = useState({});
  const [capturing, setCapturing] = useState(false);
  const [poe, setPoe] = useState("");
  const [tiempoExposicion, setTiempoExposicion] = useState("");
  // Al inicio de tu componente, junto con otros useState
     // o hardcodeado si es fija: "NOM-004"
  const [descripcion, setDescripcion] = useState("");
  const [fechaInspeccion, setFechaInspeccion] = useState("");
  const [consequence, setConsequence] = useState("Lesiones sin baja");
  const [exposure, setExposure] = useState("Ocasionalmente");
  const [probability, setProbability] = useState(
    "Coincidencia extremadamente remota pero concebible",
  );
  const [selectedBodyImage, setSelectedBodyImage] = useState(null);
  const [selectedEPPImages, setSelectedEPPImages] = useState([]);
  const [selectedTriangleImages, setSelectedTriangleImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [tableToEdit, setTableToEdit] = useState(null);
  const [tableId, setTableId] = useState(null);
  const [area, setArea] = useState("");
  const [puestos, setPuestos] = useState([]);
  const [energiaUtilizada, setEnergiaUtilizada] = useState("");

  const [areas, setAreas] = useState([]);
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [newArea, setNewArea] = useState("");
  const [selectedRightLogo, setSelectedRightLogo] = useState(null);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const closeFolderModal = () => {
    setIsFolderModalOpen(false);
  };
  const [normaSeleccionada, setNormaSeleccionada] = useState("");
const [showGuardarModal, setShowGuardarModal] = useState(false);
const [empresas, setEmpresas] = useState([]);
const [nuevaEmpresa, setNuevaEmpresa] = useState("");
const [areaEmpresa, setAreaEmpresa] = useState("");

const [empresasDisponibles, setEmpresasDisponibles] = useState([]);
const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
const [selectedEmpresaId, setSelectedEmpresaId] = useState("");
const [selectedNormaId, setSelectedNormaId] = useState("");
const [empresaSeleccionadaFirebase, setEmpresaSeleccionadaFirebase] = useState("");
const [empresasFirebase, setEmpresasFirebase] = useState([]);
const [normasFirebase, setNormasFirebase] = useState([]);
const [bodyParts, setBodyParts] = useState({});
const [image, setImage] = useState(null);
const [opcionesIdentificacionesSeleccionadas, setOpcionesIdentificacionesSeleccionadas] = useState([]);
const [sistemasSeguridadSeleccionados, setSistemasSeguridadSeleccionados] = useState([]);
const [riesgosSeleccionados, setRiesgosSeleccionados] = useState([]);
const [showAgregarModal, setShowAgregarModal] = useState(false);
const [normasDisponibles, setNormasDisponibles] = useState([]);
const [empresaSeleccionadaNombre, setEmpresaSeleccionadaNombre] = useState("");



const tableRef = useRef(null);





// justo después de los useState (ejemplo: const [empresaSeleccionada, setEmpresaSeleccionada] = useState(""))
useEffect(() => {
  const table = JSON.parse(localStorage.getItem("tableToEdit"));

  if (table?.id) {
    // Campos directos
    setNombreMaquinaria(table.nombreMaquinaria || "");
    setPoe(table.poe || "");
    setTiempoExposicion(table.tiempoExposicion || "");
    setDescripcion(table.descripcion || "");
    setFechaInspeccion(table.fechaInspeccion || "");
    setConsequence(table.consequence || "Lesiones sin baja");
    setExposure(table.exposure || "Ocasionalmente");
    setProbability(table.probability || "Coincidencia extremadamente remota pero concebible");
    setBodyParts(table.bodyParts || {});
    // Usa URL persistente si existe
    setSelectedRightLogo(table.selectedRightLogo || null);
    const imagenPersistente = table.selectedBodyImage || table.image || null;
    setSelectedBodyImage(imagenPersistente);
    setImage(imagenPersistente);

    setSelectedEPPImages(table.selectedEPPImages || []);
    setOpcionesIdentificacionesSeleccionadas(table.opcionesIdentificacionesSeleccionadas || []);
    setSistemasSeguridadSeleccionados(table.sistemasSeguridadSeleccionados || []);
    setSelectedTriangleImages(table.selectedTriangleImages || []);
    setSelectedHazards(table.selectedHazards || {});
    setPuestos(table.puestos || []);

    // Empresa/Área
    const nombreEmpresa = table.nombreEmpresa || "";
    const nombreArea    = table.areaSeleccionada || "";

    setEmpresaSeleccionada(nombreEmpresa);          // ← nombre, para tu <select> local
    setEmpresaSeleccionadaNombre(nombreEmpresa);
    setArea(nombreArea);
    setEnergiaUtilizada(table.energiaUtilizada || "");

    // Asegura que "empresas" contenga el nombre
    setEmpresas((prev) => {
      const base = Array.isArray(prev) ? prev : [];
      return base.includes(nombreEmpresa) ? base : [...base, nombreEmpresa];
    });

    // Asegura que "areas" (localStorage) contenga el par {empresa, nombre}
    const todas = JSON.parse(localStorage.getItem("areas")) || [];
    const existe = todas.some((a) => a?.empresa === nombreEmpresa && a?.nombre === nombreArea);
    const nuevas = existe ? todas : [...todas, { empresa: nombreEmpresa, nombre: nombreArea }];
    localStorage.setItem("areas", JSON.stringify(nuevas));
    setAreas(nuevas.filter((a) => a.empresa === nombreEmpresa));

    // Mantén ids para futuras actualizaciones
    setSelectedEmpresaId(table.empresaId || null);
    setSelectedNormaId(table.normaId || null);

    setIsEditing(true);
    setTableId(table.id);
  }
}, []);



useEffect(() => {
  const cargarEmpresasGuardadas = async () => {
    try {
      const snapshot = await getDocs(collection(db, "empresas"));
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre,
      }));
      setEmpresasFirebase(lista);
    } catch (error) {
      console.error("❌ Error al cargar empresas guardadas:", error);
    }
  };

  cargarEmpresasGuardadas();
}, []);



useEffect(() => {
  const fetchNormas = async () => {
    if (!empresaSeleccionada) return;

    try {
      const snapshot = await getDocs(
        collection(db, "empresas", empresaSeleccionada, "normas")
      );
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre,
      }));
      setNormasFirebase(lista);
    } catch (error) {
      console.error("❌ Error al cargar normas:", error);
    }
  };

  fetchNormas();
}, [empresaSeleccionada]);








const handleResetTable = () => {
  setNombreMaquinaria("");
  setPoe("");
  setTiempoExposicion("");
  setDescripcion("");
  setFechaInspeccion("");
  setConsequence("Lesiones sin baja");
  setExposure("Ocasionalmente");
  setProbability("Coincidencia extremadamente remota pero concebible");
  setSelectedBodyImage(null);
  setSelectedEPPImages([]);
  setSelectedTriangleImages([]);
  setSelectedHazards({});
  setArea("");
  setEmpresaSeleccionada("");
  setPuestos([]);
  setSelectedRightLogo(null);
  setTableId(null);


// Limpiar las celdas con X (partes del cuerpo)
const table = document.getElementById("body-parts-table");
if (table) {
  const cells = table.querySelectorAll('td[data-check="true"]');
  cells.forEach((cell) => {
    cell.textContent = "";
  });
}
};






const downloadPDF = async () => {
  const el = tableRef.current;
  if (!el) return;

  // 1) Ocultar todos los elementos con la clase .ocultar-al-exportar
  const toHide = Array.from(el.querySelectorAll(".ocultar-al-exportar"));
  const prevDisplay = toHide.map(n => n.style.display);
  toHide.forEach(n => (n.style.display = "none"));

  try {
    // 2) Capturar el DOM
    const canvas = await html2canvas(el, {
      backgroundColor: "#fff",
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    const imgW = pageW;
    const imgH = (canvas.height * pageW) / canvas.width;

    if (imgH <= pageH) {
      pdf.addImage(imgData, "JPEG", 0, 0, imgW, imgH);
    } else {
      // multipágina
      let position = 0;
      let heightLeft = imgH;

      pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH);
      heightLeft -= pageH;

      while (heightLeft > 0) {
        pdf.addPage();
        position = 0 - (imgH - heightLeft);
        pdf.addImage(imgData, "JPEG", 0, position, imgW, imgH);
        heightLeft -= pageH;
      }
    }

    pdf.save("tabla_maquinaria_NOM-004.pdf");
  } finally {
    // 3) Restaurar visibilidad
    toHide.forEach((n, i) => (n.style.display = prevDisplay[i] ?? ""));
  }
};











  const logos = [
    { nombre: "Maxion", url: Maxion },
    { nombre: "Safran", url: Safran },
  ];

  const handleRightLogoChange = (e) => {
    const selectedLogo = logos.find((logo) => logo.nombre === e.target.value);
    setSelectedRightLogo(selectedLogo ? selectedLogo.url : null);
  };

  const handleRemoveRightLogo = () => {
    setSelectedRightLogo(null);
  };





const downloadImage = async () => {
  setCapturing(true); // Activamos el estado para ocultar elementos
  const container = document.querySelector(".risk-table-container");

  container.classList.add("capturing");

  // Esperamos un pequeño tiempo para que React actualice el DOM
  await new Promise((resolve) => setTimeout(resolve, 100));

  html2canvas(container, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#fff",
  }).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "tabla_maquinaria_equipo.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }).catch((error) => {
    console.error("Error al generar la imagen:", error);
  }).finally(() => {
    container.classList.remove("capturing");
    setCapturing(false); // Desactivamos el estado después de la captura
  });
};

useEffect(() => {
  // Cargar áreas filtradas por empresa seleccionada
  const savedAreas = JSON.parse(localStorage.getItem("areas")) || [];
  setAreas(savedAreas.filter((a) => a.empresa === empresaSeleccionada));

  // Cargar empresas
  const savedEmpresas = JSON.parse(localStorage.getItem("empresas")) || [];
  setEmpresas(savedEmpresas);

  // Agregar eventos a las celdas de la tabla de partes del cuerpo
  const table = document.getElementById("body-parts-table");
  const cells = table?.querySelectorAll('td[data-check="true"]') || [];

  const handleCellClick = (cell) => {
    const part = cell.getAttribute("data-part");
    const isActive = cell.textContent.trim() === "X";

    cell.textContent = isActive ? "" : "X";

    // ✅ Actualiza el estado bodyParts
    setBodyParts((prev) => ({
      ...prev,
      [part]: !isActive,
    }));
  };

  cells.forEach((cell) => {
    cell.addEventListener("click", () => handleCellClick(cell));
  });

  // 🔁 Restaurar "X" al editar si vienen del localStorage
  const storedBodyParts = JSON.parse(localStorage.getItem("tableToEdit"))?.bodyParts || {};
  cells.forEach((cell) => {
    const part = cell.getAttribute("data-part");
    if (storedBodyParts[part]) {
      cell.textContent = "X";
    }
  });

  // Limpieza de eventos
  return () => {
    cells.forEach((cell) => {
      cell.removeEventListener("click", () => handleCellClick(cell));
    });
  };
}, [empresaSeleccionada]);



  const handleCheckboxChange = (e, hazard) => {
    const checked = e.target.checked;
    const imagesToAdd = protectionImages[hazard] || [];

    if (checked) {
      setSelectedEPPImages((prevImages) =>
        Array.from(new Set([...prevImages, ...imagesToAdd])),
      );
    } else {
      setSelectedEPPImages((prevImages) =>
        prevImages.filter((img) => !imagesToAdd.includes(img)),
      );
    }
  };

  const handleSelectImage = (e) => {
    const selectedImage = e.target.value;
    if (selectedImage && !selectedTriangleImages.includes(selectedImage)) {
      setSelectedTriangleImages((prevImages) => [...prevImages, selectedImage]);
    }
    e.target.value = ""; // Reiniciar el select después de agregar una imagen
  };

  const handleRemoveTriangleImage = (imageToRemove) => {
    setSelectedTriangleImages((prevImages) =>
      prevImages.filter((image) => image !== imageToRemove),
    );
  };

  const handleRemoveEPPImage = (imageToRemove) => {
    setSelectedEPPImages((prevImages) =>
      prevImages.filter((image) => image !== imageToRemove),
    );
  };



const calcularValorConsecuencia = (consequence) => {
  const valoresConsecuencia = {
    Catástrofe: 100,
    "Varias muertes": 50,
    Muerte: 25,
    "Lesiones graves": 15,
    "Lesiones con baja": 5,
    "Lesiones sin baja": 1,
  };
  return valoresConsecuencia[consequence] || 0;
};

const calcularValorExposicion = (exposure) => {
  const valoresExposicion = {
    Continuamente: 10,
    Frecuentemente: 6,
    Ocasionalmente: 3,
    Irregularmente: 2,
    Raramente: 1,
    Remotamente: 0.1,
  };
  return valoresExposicion[exposure] || 0;
};

const calcularValorProbabilidad = (probability) => {
  const valoresProbabilidad = {
    "Es el resultado más probable y esperado": 10,
    "Es completamente posible, no será nada extraño": 6,
    "Sería una secuencia o coincidencia rara pero posible, ha ocurrido": 3,
    "Coincidencia muy rara, pero se sabe que ha ocurrido": 1,
    "Coincidencia extremadamente remota pero concebible": 0.5,
    "Coincidencia prácticamente imposible, jamás ha ocurrido": 0.1,
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
  if (magnitud <= 20)
    return {
      color: "blue",
      accion: "Sin acción requerida",
      clasificacion: "Bajo",
    };
  if (magnitud <= 70)
    return {
      color: "green",
      accion: "Programada",
      clasificacion: "Moderado",
    };
  if (magnitud <= 200)
    return {
      color: "yellow",
      accion: "Programada",
      clasificacion: "Notable",
    };
  if (magnitud <= 400)
    return {
      color: "orange",
      accion: "Urgente",
      clasificacion: "Alto",
    };
  return {
    color: "red",
    accion: "Inmediata",
    clasificacion: "Muy Alto",
  };
};

const magnitudRiesgo = calcularMagnitudRiesgo();
const { color, accion, clasificacion } = obtenerClasificacionRiesgo(magnitudRiesgo);


 
  const handleAddArea = () => {
  if (
    newArea.trim() &&
    empresaSeleccionada &&
    !areas.some((a) => a.nombre === newArea.trim() && a.empresa === empresaSeleccionada)
  ) {
    const nuevaArea = {
      empresa: empresaSeleccionada,
      nombre: newArea.trim(),
      puestos: [],
    };





    const todasLasAreas = JSON.parse(localStorage.getItem("areas")) || [];
    const updatedAreas = [...todasLasAreas, nuevaArea];

    setAreas(updatedAreas.filter((a) => a.empresa === empresaSeleccionada));
    localStorage.setItem("areas", JSON.stringify(updatedAreas));
    setNewArea("");
    alert("Área agregada con éxito.");
  } else {
    alert("El área ya existe, no hay empresa seleccionada o es inválida.");
  }
};


  useEffect(() => {
    const savedAreas = JSON.parse(localStorage.getItem("areas")) || [];
    setAreas(savedAreas.filter((area) => area && area.nombre)); // Filtra valores inválidos

    const savedPuestos = JSON.parse(localStorage.getItem("puestos")) || [];
    setPuestos(savedPuestos.filter((puesto) => puesto && puesto.nombre)); // Filtra valores inválidos
  }, []);
const handleGuardarTabla = async () => {
  const user = auth.currentUser;
  if (!user) {
    alert("No estás autenticado.");
    return;
  }

  if (!isEditing && (!empresaSeleccionada || !normaSeleccionada)) {
    alert("Debes seleccionar una empresa y una norma antes de guardar.");
    return;
  }

  try {
    const magnitud = calcularMagnitudRiesgo();
    const { clasificacion } = obtenerClasificacionRiesgo(magnitud);

    const tableToEdit = JSON.parse(localStorage.getItem("tableToEdit"));
    const empresaId = isEditing ? tableToEdit?.empresaId : empresaSeleccionada;
    const normaId = isEditing ? tableToEdit?.normaId : normaSeleccionada;
    const nombreEmpresaFinal = isEditing ? tableToEdit?.nombreEmpresa : empresaSeleccionadaNombre;

    if (!empresaId || !normaId) {
      alert("Faltan datos de empresa o norma para guardar.");
      return;
    }

    const tablaData = {
      uid: user.uid,
      nombreMaquinaria,
      poe,
      energiaUtilizada,
      selectedRightLogo,
      tiempoExposicion,
      descripcion,
      fechaInspeccion: fechaInspeccion || new Date().toLocaleDateString(),
      consequence,
      exposure,
      probability,
      risk: magnitud,
      clasificacion,
      areaSeleccionada: area,
      norma: "N-004 (Maquinaria)",
      nombreEmpresa: nombreEmpresaFinal,
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      bodyParts,
      image,
      selectedBodyImage,
      selectedEPPImages,
      selectedTriangleImages,
      opcionesIdentificacionesSeleccionadas,
      sistemasSeguridadSeleccionados,
      selectedHazards,
      puestos,
    };

    const tablaRef = collection(db, "empresas", empresaId, "normas", normaId, "tablas");

    if (isEditing && tableToEdit?.id) {
      const docRef = doc(db, "empresas", empresaId, "normas", normaId, "tablas", tableToEdit.id);
      await updateDoc(docRef, tablaData);
      alert("✅ Tabla actualizada correctamente.");
    } else {
      await addDoc(tablaRef, tablaData);
      alert("✅ Tabla guardada correctamente.");
    }

    // ✅ Actualizar resumen acumulado
    await updateResumenData(area, magnitud, user.uid, nombreEmpresaFinal);

    // Limpieza
    localStorage.removeItem("tableToEdit");
    setIsEditing(false);
    setTableToEdit(null);
    setIsFolderModalOpen(false);

  } catch (error) {
    console.error("❌ Error al guardar/actualizar tabla:", error);
    alert("❌ Ocurrió un error al guardar o actualizar la tabla.");
  }
};

const updateResumenData = async (area, magnitud, uid, nombreEmpresaFinal) => {
  if (!area || !nombreEmpresaFinal) {
    console.error("Faltan datos para guardar el resumen.");
    return;
  }

  try {
    const resumenRef = doc(
      db,
      "resumen_004_maquinaria",
      nombreEmpresaFinal,
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

    if (magnitud <= 20) resumenData.tolerable += 1;
    else if (magnitud <= 70) resumenData.moderado += 1;
    else if (magnitud <= 200) resumenData.notable += 1;
    else if (magnitud <= 400) resumenData.elevado += 1;
    else resumenData.grave += 1;

    await setDoc(resumenRef, resumenData);
    console.log("✅ Resumen actualizado exitosamente:", resumenData);
  } catch (error) {
    console.error("❌ Error al actualizar los datos del resumen:", error);
  }
};


  return (
   <div
    id="tabla-capturable"          // <- ID para CSS en onclone
    ref={tableRef}                 // <- Ref para capturar exacto ese nodo
    className="risk-table-container"
  >

    <div className="header-container">
      {/* Logo izquierdo */}
      <img src={logo} alt="Logo Izquierdo" className="logo-left" />

      {/* Título centrado */}
     <h4 className="section-header" style={{ color: "black", textAlign: "center" }}>
  Análisis de Riesgo Potencial Generado por la Maquinaria<br />
  NOM-004-STPS-1999
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
            className="remove-logo-button ocultar-al-exportar"
          >
            ×
          </button>
        </div>
      )}
    </div>

    {/* Tabla principal */}
    <table className="risk-table">
  <thead className="thead-responsive" style={{ fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
  {/* Fila 1: Título */}
  <tr>
    <td colSpan={8} style={{
      backgroundColor: "#7f8c8d",
      color: "#fff",
      fontWeight: "600",
      padding: "8px 12px",
      fontSize: "14px",
      borderRadius: "8px 8px 0 0",
      textAlign: "center"
    }}>
      Registro de Maquinaria
    </td>
  </tr>

  {/* Fila 2: Nombre, Empresa, Área, Energía */}
  <tr>
    {[{
      label: "Nombre de la maquinaria",
      icon: "fas fa-tag",
      colSpan: 2,
      input: (
        <input type="text" value={nombreMaquinaria} onChange={(e) => setNombreMaquinaria(e.target.value)}
          placeholder="Nombre..." className="input-compact" />
      )
    },
    {
      label: "Empresa",
      icon: "fas fa-building",
      colSpan: 2,
      input: (
        <select value={empresaSeleccionada} onChange={(e) => setEmpresaSeleccionada(e.target.value)}
          className="input-compact">
          <option value="">Seleccione</option>
          {empresas
            .filter((empresa) => empresa && typeof empresa === "string")
            .map((empresa, index) => (
              <option key={index} value={empresa}>{empresa}</option>
            ))}
        </select>
      )
    },
    {
      label: "Área",
      icon: "fas fa-map-marker-alt",
      colSpan: 2,
      input: (
        <select value={area} onChange={(e) => setArea(e.target.value)} className="input-compact">
          <option value="">Seleccione área</option>
          {areas?.filter((a) => a?.nombre).map((a, i) => (
            <option key={i} value={a.nombre}>{a.nombre}</option>
          ))}
        </select>
      )
    },
    {
      label: "Energía utilizada",
      icon: "fas fa-bolt",
      colSpan: 2,
      input: (
        <select value={energiaUtilizada} onChange={(e) => setEnergiaUtilizada(e.target.value)}
          className="input-compact">
          <option value="">Tipo de energía</option>
          <option value="Eléctrica">Eléctrica</option>
          <option value="Manual">Manual</option>
          <option value="Mecánica">Mecánica</option>
          <option value="Hidráulica">Hidráulica</option>
          <option value="Eólica">Eólica</option>
          <option value="Térmica por combustión">Térmica</option>
          <option value="Hidroneumatica">Hidroneumática</option>
          <option value="Neumática">Neumática</option>
        </select>
      )
    }].map(({ label, icon, colSpan, input }, idx) => (
      <td key={idx} colSpan={colSpan} style={{ padding: "6px 8px", backgroundColor: "#f9f9f9" }}>
        <div style={{ fontSize: "12px", fontWeight: "600", color: "#7f8c8d", marginBottom: "4px" }}>
          <i className={icon} style={{ marginRight: "4px", fontSize: "11px" }}></i>{label}
        </div>
        {input}
      </td>
    ))}
  </tr>

  {/* Fila 3: Descripción + POE + Tiempo + Fecha */}
  <tr>
    {/* Descripción del equipo */}
    <td colSpan={4} style={{ padding: "6px 10px", backgroundColor: "#fff", verticalAlign: "top" }}>
      <div style={{ fontSize: "12px", fontWeight: "600", color: "#7f8c8d", marginBottom: "4px" }}>
        <i className="fas fa-align-left" style={{ marginRight: "4px", fontSize: "11px" }}></i>Descripción del equipo
      </div>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Describe el equipo..."
        rows={2}
        className="input-compact"
        style={{ resize: "vertical", minHeight: "50px", width: "100%" }}
      />
    </td>

    {/* POE */}
    <td colSpan={1} style={{ padding: "6px 8px", backgroundColor: "#f9f9f9", verticalAlign: "top" }}>
      <div style={{ fontSize: "12px", fontWeight: "600", color: "#7f8c8d", marginBottom: "4px" }}>
        <i className="fas fa-file-alt" style={{ marginRight: "4px", fontSize: "11px" }}></i>POE
      </div>
      <input type="text" value={poe} onChange={(e) => setPoe(e.target.value)}
        placeholder="" className="input-compact" />
    </td>

    {/* Tiempo exposición */}
    <td colSpan={2} style={{ padding: "6px 8px", backgroundColor: "#f9f9f9", verticalAlign: "top" }}>
      <div style={{ fontSize: "12px", fontWeight: "600", color: "#7f8c8d", marginBottom: "4px" }}>
        <i className="fas fa-clock" style={{ marginRight: "4px", fontSize: "11px" }}></i>Tiempo exposición
      </div>
      <input type="text" value={tiempoExposicion} onChange={(e) => setTiempoExposicion(e.target.value)}
        placeholder="Horas/día" className="input-compact" />
    </td>

    {/* Fecha inspección */}
    <td colSpan={1} style={{ padding: "6px 8px", backgroundColor: "#f9f9f9", verticalAlign: "top" }}>
      <div style={{ fontSize: "12px", fontWeight: "600", color: "#7f8c8d", marginBottom: "4px" }}>
        <i className="fas fa-calendar-alt" style={{ marginRight: "4px", fontSize: "11px" }}></i>Fecha inspección
      </div>
      <input type="date" value={fechaInspeccion} onChange={(e) => setFechaInspeccion(e.target.value)}
        className="input-compact" />
    </td>
  </tr>
</thead>





      <tbody>
 <div className="table-flex-container">
  <div className="image-insert-table">
    <table className="imagefilter" style={{ width: "100%", borderCollapse: "collapse" }}>
      <tbody>
        <tr>
          <td
            colSpan="3"
            style={{
              padding: "0",
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
              width: "100%",
              height: "250px", // altura fija para forzar el cuadro exacto
              position: "relative",
            }}
          >
            <div
              onClick={() => document.getElementById("upload-image").click()}
              style={{
                width: "100%",
                height: "100%",
                cursor: "pointer",
              }}
            >
              {selectedBodyImage ? (
                <img
                  src={selectedBodyImage}
                  alt="Imagen seleccionada"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                  }}
                  title="Haz clic para eliminar la imagen"
                />
              ) : (
                <div
                  style={{
                    color: "#777",
                    fontStyle: "italic",
                    textAlign: "center",
                    lineHeight: "250px",
                    height: "100%",
                  }}
                >
                  Haz clic para seleccionar imagen
                </div>
              )}
            </div>

            <input
              id="upload-image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  setSelectedBodyImage(imageUrl);
                }
              }}
              style={{ display: "none" }}
            />
          </td>
        </tr>
      </tbody>

    </table>




    <div className="identification-table">
      <table className="risk-table">
        <thead>
          <tr className="red">
            <th className="warning">Identificación de peligros</th>
          </tr>
        </thead>
        <tbody>
          {/* Creamos exactamente 9 filas (recuadros) */}
        {Array.from({ length: 7 }).map((_, idx) => {
  const value = selectedHazards[idx] || "";

  if (capturing && !value) {
    return null; // No renderizar si está vacío durante la captura
  }

  return (
    <tr key={idx}>
      <td>
        <select
          value={value}
          onChange={(e) =>
            setSelectedHazards((prev) => ({
              ...prev,
              [idx]: e.target.value,
            }))
          }
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: "#fff",
            marginBottom: "8px",
          }}
        >
          <option value="">Seleccione peligro {idx + 1}</option>
          <option value="Caídas de Altura">Caídas de Altura</option>
          <option value="Exposición a Temperaturas">Exposición a Temperaturas</option>
          <option value="Exposición a Electricidad Estática">Exposición a Electricidad Estática</option>
          <option value="Exposición a Sustancias Químicas">Exposición a Sustancias Químicas</option>
          <option value="Exposición a Radiaciones">Exposición a Radiaciones</option>
          <option value="Exposición agentes Biológicos">Exposición agentes Biológicos</option>
          <option value="Exposición a Ruido">Exposición a Ruido</option>
          <option value="Exposición a Vibraciones">Exposición a Vibraciones</option>
          <option value="Superficies cortantes">Superficies cortantes</option>
          <option value="Caídas a nivel o desnivel">Caídas a nivel o desnivel</option>
          <option value="Daños Ergonómicos">Daños Ergonómicos</option>
          <option value="Calentamiento de materia prima, subproducto o producto">
            Calentamiento de materia prima, subproducto o producto
          </option>
          <option value="Proyección de material o herramienta">
            Proyección de material o herramienta
          </option>
          <option value="Mantenimiento preventivo, correctivo o predictivo">
            Mantenimiento preventivo, correctivo o predictivo
          </option>
        </select>
      </td>
    </tr>
  );
})}


        </tbody>
      </table>
    </div>
  </div>

            <div className="evaluation-table" style={{ overflowX: "auto",  }}>
              <table>
                <thead>
                  <tr className="red">
                    <th colSpan="3" className="red">
                      Evaluación de riesgo de trabajo
                    </th>
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
                      <select
                        value={consequence}
                        onChange={(e) => setConsequence(e.target.value)}
                      >
                        {[
                          "Catástrofe",
                          "Varias muertes",
                          "Muerte",
                          "Lesiones graves",
                          "Lesiones con baja",
                          "Lesiones sin baja",
                        ].map((opcion, idx) => (
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
                      >
                        {[
                          "Continuamente",
                          "Frecuentemente",
                          "Ocasionalmente",
                          "Irregularmente",
                          "Raramente",
                        ].map((opcion, idx) => (
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
                      >
                        {[
                          "Es el resultado más probable y esperado",
                          "Es completamente posible, no será nada extraño",
                          "Sería una secuencia o coincidencia rara pero posible, ha ocurrido",
                          "Coincidencia muy rara, pero se sabe que ha ocurrido",
                          "Coincidencia extremadamente remota pero concebible",
                          "Coincidencia prácticamente imposible, jamás ha ocurrido",
                        ].map((opcion, idx) => (
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
                    <td className="tall-cell">Acción: {accion}</td>
                    {/* Celda grande para Puntuación con cambio de color */}
                    <td
                      className="tall-cell risk-score-cell"
                     
  style={{
    backgroundColor: color,
  }}
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
                <textarea
                  name="textarea"
                  rows="3"
                  cols="212"
                  id="observaciones"
                  placeholder="Observaciones"
                ></textarea>
              </table>

              <table
                id="body-parts-table"
                style={{
                  width: "90%",
                  margin: "20px auto",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th
                      colSpan="6"
                      className="red"
                      style={{
                        backgroundColor: "#808b96",
                        fontWeight: "bold",
                        padding: "6px",
                      }}
                    >
                      Principales partes del cuerpo expuestas al riesgo:
                    </th>
                  </tr>
                </thead>
                <tbody>
                 <tr>
  <td>Cabeza y Oídos</td>
  <td data-check="true" data-part="cabeza" style={{ border: "1px solid #ccc", cursor: "pointer" }}></td>

  <td>Ojos y Cara</td>
  <td data-check="true" data-part="ojos" style={{ border: "1px solid #ccc", cursor: "pointer" }}></td>

  <td>Sistema respiratorio</td>
  <td data-check="true" data-part="respiratorio" style={{ border: "1px solid #ccc", cursor: "pointer" }}></td>
</tr>
<tr>
  <td>Brazos y Manos</td>
  <td data-check="true" data-part="brazos" style={{ border: "1px solid #ccc", cursor: "pointer" }}></td>

  <td>Tronco</td>
  <td data-check="true" data-part="tronco" style={{ border: "1px solid #ccc", cursor: "pointer" }}></td>

  <td>Extremidades inferiores</td>
  <td data-check="true" data-part="piernas" style={{ border: "1px solid #ccc", cursor: "pointer" }}></td>

                  </tr>
                </tbody>
              </table>
              {/* Tabla de triángulos con select */}
              <table className="warning">
                <tbody>
                  <tr>
                    <td>
                      <select onChange={handleSelectImage}>
                        <option value="">Selecciona una imagen</option>
                        {[...Array(24)].map((_, index) => (
                          <option
                            key={index}
                            value={`/images/Imagen${index + 1}.png`}
                          >
                            {
                              {
                                0: "Baja temperatura",
                                1: "Imagen 2",
                                2: "Atrapamiento",
                                3: "Riesgo de accidentes",
                                4: "Caida de objetos",
                                5: "espacios confinados",
                                6: "Riesgo electrico",
                                7: "Inflamable",
                                8: "Material explosivo",
                                9: "Superficies cortantes",
                                10: "Sustancias toxicas",
                                11: "Peligro a la salud",
                                12: "Carga suspendida en altura",
                                13: "Vapores toxicos",
                                14: "Partes en movimiento",
                                15: "Sustancias corrosivas",
                                16: "Superficies calientes",
                                17: "Caida a nivel",
                                18: "Peligro de caidas",
                                19: "Peligro de obstaculos",
                                20: "Riesgo biologico",
                                21: "Frecuencias altas",
                                22: "Radiacion en laser",
                                23: "Riesgo eléctrico",
                              }[index]
                            }
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    {/* Contenedor de imágenes seleccionadas desde el select */}
                   <td colSpan="1">
  <div className="triangle-images-wrapper">
    {selectedTriangleImages.map((img, index) => (
      <img
        key={index}
        src={img}
        alt={`Imagen seleccionada ${index + 1}`}
        className="selected-image"
        onClick={() => handleRemoveTriangleImage(img)}
      />
    ))}
  </div>
</td>

                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </tbody>
      </table>
      {/* Modal para Agregar Puesto */}
 {showAgregarModal && (
  <div className="modal" style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(3px)'
  }}>
    <div className="modal-content" style={{
      backgroundColor: '#ffffff',
      padding: '25px',
      borderRadius: '12px',
      width: '90%',
      maxWidth: '450px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
      border: '1px solid rgba(0,0,0,0.1)'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h4 style={{
          margin: '0 0 15px 0',
          color: '#2d3748',
          fontSize: '1.25rem',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>Agregar Nueva Empresa</h4>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={nuevaEmpresa}
            onChange={(e) => setNuevaEmpresa(e.target.value)}
            placeholder="Nombre de la empresa"
            style={{
              flex: 1,
              padding: '12px 15px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border 0.3s',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4299e1'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
          
          <button
            onClick={() => {
              if (nuevaEmpresa.trim() && !empresas.includes(nuevaEmpresa.trim())) {
                const nuevasEmpresas = [...empresas, nuevaEmpresa.trim()];
                setEmpresas(nuevasEmpresas);
                localStorage.setItem("empresas", JSON.stringify(nuevasEmpresas));
                setNuevaEmpresa("");
                alert("Empresa agregada con éxito.");
              } else {
                alert("La empresa ya existe o es inválida.");
              }
            }}
            style={{
              padding: '0 20px',
              backgroundColor: '#4299e1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 2px 5px rgba(66, 153, 225, 0.3)',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#3182ce';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(66, 153, 225, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#4299e1';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 5px rgba(66, 153, 225, 0.3)';
            }}
          >
            Agregar
          </button>
        </div>
      </div>

      <div style={{ margin: '25px 0', borderTop: '1px solid #edf2f7' }}></div>

      <div style={{ marginBottom: '20px' }}>
        <h4 style={{
          margin: '0 0 15px 0',
          color: '#2d3748',
          fontSize: '1.25rem',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>Agregar Área Vinculada</h4>
        
        <select
          value={empresaSeleccionada}
          onChange={(e) => setEmpresaSeleccionada(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 15px',
            marginBottom: '15px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: 'white',
            outline: 'none',
            transition: 'border 0.3s',
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)',
            appearance: 'none',
            backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23999%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 10px center',
            backgroundSize: '12px'
          }}
          onFocus={(e) => e.target.style.borderColor = '#4299e1'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        >
          <option value="">Seleccione una empresa</option>
          {empresas.map((empresa, index) => (
            <option key={index} value={empresa}>
              {empresa}
            </option>
          ))}
        </select>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={areaEmpresa}
            onChange={(e) => setAreaEmpresa(e.target.value)}
            placeholder="Nombre del área"
            style={{
              flex: 1,
              padding: '12px 15px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border 0.3s',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.05)'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4299e1'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />
          
          <button
            onClick={() => {
              if (!empresaSeleccionada) {
                alert("Debes seleccionar una empresa.");
                return;
              }
              const clave = `${empresaSeleccionada}-${areaEmpresa}`;
              const nuevasAreas = [...areas, { nombre: clave }];
              setAreas(nuevasAreas);
              localStorage.setItem("areas", JSON.stringify(nuevasAreas));
              setAreaEmpresa("");
              alert("Área agregada con éxito.");
            }}
            style={{
              padding: '0 20px',
              backgroundColor: '#48bb78',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 2px 5px rgba(72, 187, 120, 0.3)',
              whiteSpace: 'nowrap'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#38a169';
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 8px rgba(72, 187, 120, 0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#48bb78';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 5px rgba(72, 187, 120, 0.3)';
            }}
          >
            Agregar
          </button>
        </div>
      </div>

      <button
        onClick={() => setShowAgregarModal(false)}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: 'transparent',
          color: '#718096',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.3s',
          marginTop: '10px'
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#f7fafc';
          e.target.style.color = '#4a5568';
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'transparent';
          e.target.style.color = '#718096';
        }}
      >
        Cancelar
      </button>
    </div>
  </div>
)}



     <div className="button-container ocultar-al-exportar" style={{ marginTop: "20px" }}>
  <button onClick={downloadPDF} className="download-button">
    Descargar PDF
  </button>

  <button
    onClick={() => {
      if (isEditing) {
        handleGuardarTabla(); // actualiza directamente
      } else {
        setIsFolderModalOpen(true); // abre modal para guardar
      }
    }}
    className="save-button"
  >
    {isEditing ? "Actualizar Tabla" : "Guardar Tabla"}
  </button>

  <button
    onClick={handleResetTable}
    className="reset-button"
    style={{
      marginLeft: "10px",
      padding: "8px 12px",
    }}
  >
    Reiniciar Tabla
  </button>


        
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
    marginLeft: "10px",
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
    marginLeft: "10px",
  }}
>
  x
</button>

{showEliminarModal && (
  <div className="modal">
    <div className="modal-content">
      <h4>Eliminar Área</h4>
      <select
  name="area"
  value={area}
  onChange={(e) => setArea(e.target.value)}
>
  <option value="">Seleccione un área</option>
  {areas
    .filter(
      (a) =>
        a &&
        a.nombre &&
        empresaSeleccionada &&
        a.nombre.startsWith(`${empresaSeleccionada}-`)
    )
    .map((a, index) => (
      <option key={index} value={a.nombre}>
        {a.nombre.split("-")[1]} {/* Solo muestra el nombre del área */}
      </option>
    ))}
</select>
      <button
        onClick={() => {
          if (!area) {
            alert("Seleccione un área válida.");
            return;
          }
          const nuevasAreas = areas.filter((a) => a.nombre !== area);
          setAreas(nuevasAreas);
          localStorage.setItem("areas", JSON.stringify(nuevasAreas));
          setArea("");
          alert("Área eliminada con éxito.");
        }}
      >
        Eliminar Área
      </button>

      <hr style={{ margin: "15px 0" }} />

      <h4>Eliminar Empresa</h4>
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
      <button
        onClick={() => {
          if (!empresaSeleccionada) {
            alert("Seleccione una empresa válida.");
            return;
          }
          const nuevasEmpresas = empresas.filter((e) => e !== empresaSeleccionada);
          setEmpresas(nuevasEmpresas);
          localStorage.setItem("empresas", JSON.stringify(nuevasEmpresas));
          setEmpresaSeleccionada("");
          alert("Empresa eliminada con éxito.");
        }}
      >
        Eliminar Empresa
      </button>

      <button
        onClick={() => setShowEliminarModal(false)}
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

{empresasFirebase.length === 0 ? (
  <p>No hay empresas disponibles.</p>
) : (
  empresasFirebase.map((empresa) => (
    <div key={empresa.id} style={{ marginBottom: "10px" }}>
      <label>
        <input
          type="radio"
          name="empresa"
          value={empresa.id}
          checked={empresaSeleccionada === empresa.id}
          onChange={(e) => {
            const selectedId = e.target.value;
            const selectedEmpresa = empresasFirebase.find(
              (emp) => emp.id === selectedId
            );

            setEmpresaSeleccionada(selectedId);
            setEmpresaSeleccionadaNombre(selectedEmpresa?.nombre || "");
          }}
        />
        {empresa.nombre}
      </label>
    </div>
  ))
)}


  {empresaSeleccionada && normasFirebase.length > 0 && (
    <>
      <h3>Selecciona una Norma</h3>
      {normasFirebase.map((norma) => (
        <div key={norma.id}>
          <label>
            <input
              type="radio"
              name="norma"
              value={norma.id}
              checked={normaSeleccionada === norma.id}
              onChange={() => setNormaSeleccionada(norma.id)}
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
        if (!empresaSeleccionada || !normaSeleccionada) {
          alert("Selecciona una empresa y una norma.");
          return;
        }
        handleGuardarTabla();
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
    </div>
  );
};

export default RiskTable;
