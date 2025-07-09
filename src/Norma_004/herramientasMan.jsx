import React, { useState, useCallback, useEffect, useRef } from "react";


import "./HerramientasMan.css";
import html2canvas from "html2canvas";
import {
  collection,
  addDoc,
  getDoc,
  updateDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import logo from "../logos/logo.png";

const RiskTable = () => {
useEffect(() => {
  const savedAreas = JSON.parse(localStorage.getItem("areas")) || [];
  setAreas(savedAreas.filter((area) => area && area.nombre));

  const savedEmpresas = JSON.parse(localStorage.getItem("empresas")) || [];
  setEmpresas(savedEmpresas);
}, []);








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


  const [selectedPeligros, setSelectedPeligros] = useState([]);
  const [affectedBodyParts, setAffectedBodyParts] = useState([]);

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

    const [state, setState] = useState({
    consequence: "Lesiones sin baja",
    exposure: "Ocasionalmente",
    probability: "Coincidencia extremadamente remota pero concebible",
    tiempoExposicion: "4-8 hrs",
    energiaUtilizada: "Eléctrica",
    observacionesGenerales: "",
    maquinariaDescripcion: "",
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

    const uid = user.uid;
    const magnitud = calcularMagnitudRiesgo();
    const { clasificacion } = obtenerClasificacionRiesgo(magnitud);

    const tableData = {
      uid,
      consequence,
      exposure,
      probability,
      magnitud,
      clasificacion,
      area,
      puestos,
    };

    try {
      if (isEditing && tableId) {
        const tableRef = doc(db, "tablas", tableId);
        await updateDoc(tableRef, tableData);
        alert("Tabla actualizada exitosamente.");
      } else {
        const tableRef = await addDoc(collection(db, "tablas"), tableData);
        setTableId(tableRef.id);
        alert("Tabla guardada exitosamente.");
      }

      if (area) {
        await updateResumenData(area, magnitud, clasificacion, uid);
      }
    } catch (error) {
      console.error("Error al guardar datos:", error);
      alert("Hubo un problema al guardar la tabla.");
    }
  };

  const updateResumenData = async (area, magnitud, clasificacion, uid) => {
    if (!area) {
      console.error("El área no está definida. No se puede actualizar el resumen.");
      return;
    }

    try {
      const resumenRef = doc(db, "resumen", area);
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
            puestos: [],
          };

      const puestoExistenteIndex = resumenData.puestos.findIndex(
        (p) => p.nombre === newPuesto
      );

      if (puestoExistenteIndex !== -1) {
        const puestoExistente = resumenData.puestos[puestoExistenteIndex];
        resumenData.tolerable -= puestoExistente.tolerable;
        resumenData.moderado -= puestoExistente.moderado;
        resumenData.notable -= puestoExistente.notable;
        resumenData.elevado -= puestoExistente.elevado;
        resumenData.grave -= puestoExistente.grave;
        resumenData.puestos.splice(puestoExistenteIndex, 1);
      }

      const puestoRiesgo = {
        nombre: newPuesto,
        tolerable: magnitud <= 20 ? 1 : 0,
        moderado: magnitud > 20 && magnitud <= 70 ? 1 : 0,
        notable: magnitud > 70 && magnitud <= 200 ? 1 : 0,
        elevado: magnitud > 200 && magnitud <= 400 ? 1 : 0,
        grave: magnitud > 400 ? 1 : 0,
      };

      resumenData.puestos.push(puestoRiesgo);
      resumenData.tolerable += puestoRiesgo.tolerable;
      resumenData.moderado += puestoRiesgo.moderado;
      resumenData.notable += puestoRiesgo.notable;
      resumenData.elevado += puestoRiesgo.elevado;
      resumenData.grave += puestoRiesgo.grave;

      await setDoc(resumenRef, resumenData);
      console.log("Resumen actualizado exitosamente:", resumenData);
    } catch (error) {
      console.error("Error al actualizar los datos del resumen:", error);
    }
  };

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




  const [isEditing] = useState(false);
  const [tableId, setTableId] = useState(null);
  const [showEliminarModal, setShowEliminarModal] = useState(false);
  const [showAgregarModal, setShowAgregarModal] = useState(false);
  const [selectedRightLogo, setSelectedRightLogo] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  


  
  const handleDownload = async () => {
    setIsExporting(true);
    await new Promise((resolve) => setTimeout(resolve, 100));
    await downloadImage(); // <-- tu función actual para exportar
    setIsExporting(false);
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

  
};




  const renderOptions = (options) => {
    return options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ));
  };

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
  }}
>

  <div id="pdf-content" className="risk-table-wrapper">
    
    <div className="risk-table" style={{ width: "100%", fontSize: "1em" }}>
      
      {/* Contenedor de logos superior */}
     {/* ENCABEZADO CON LOGOS Y TÍTULO CENTRADO */}
<div
  className="header-container"
  style={{
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "10px 20px",
    borderBottom: "1px solid #ddd",
    marginBottom: "10px",
    textAlign: "center",
  }}
>
  {/* Logo izquierdo */}
  <div style={{ justifySelf: "start" }}>
    <img src={logo} alt="Logo SIAH" style={{ height: "50px" }} />
  </div>

  {/* Título centrado */}
  <div>
    <span style={{ fontWeight: "bold", fontSize: "14px" }}>
      ANÁLISIS DE RIESGO POTENCIAL GENERADO POR HERRAMIENTAS MANUALES 
NOM-004-STPS-1999

    </span>
  </div>

  {/* Logo derecho (empresa) */}
  <div style={{ justifySelf: "end" }}>
    {!selectedRightLogo ? (
      <label
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
        title="Cargar logo de empresa"
      >
        📁
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
      <div style={{ position: "relative" }}>
        <img
          src={selectedRightLogo}
          alt="Logo Empresa"
          style={{
  maxHeight: "50px",
  maxWidth: "120px",
  objectFit: "contain",
  backgroundColor: "transparent",
  border: "none",
  padding: "0",
}}

        />
        <button
  onClick={() => setSelectedRightLogo(null)}
  className={`remove-logo-btn ${isExporting ? 'hidden-during-export' : ''}`}
  style={{
    position: "absolute",
    top: "-8px",
    right: "-8px",
    backgroundColor: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "18px",
    height: "18px",
    fontSize: "12px",
    cursor: "pointer",
  }}
  title="Eliminar logo"
>
  ×
</button>

      </div>
    )}
  </div>
</div>




          
         <table
  className="main-table"
  style={{
    width: "100%",
    tableLayout: "auto",
    borderCollapse: "collapse",
  }}
>
            <thead>
              <tr>
               <th
  colSpan="2"
  style={{
    whiteSpace: "normal",
    minWidth: "200px",
    fontSize: "12px",
    textAlign: "center",
    verticalAlign: "middle",
    lineHeight: "1.2",
    padding: "6px",
  }}
>
  DESCRIPCIÓN DE LA MAQUINARIA O EQUIPO:
</th>

          <th colSpan="4">
  <textarea
    placeholder="Describa la maquinaria o equipo"
    value={state.maquinariaDescripcion}
    onChange={(e) => handleChange("maquinariaDescripcion", e.target.value)}
    rows="2"
    style={{
      width: "98%",
      minHeight: "50px", // ← Altura base cómoda
      fontSize: "13px",
      padding: "6px 8px",
      borderRadius: "6px",
      border: "1px solid #ccc",
      resize: "vertical", // ← Permite agrandarlo si escribe más
      outline: "none",
      boxSizing: "border-box",
      lineHeight: "1.4",
    }}
  />
</th>
<th
  style={{
    whiteSpace: "normal",       // ← Permite salto de línea
    fontSize: "13px",
    textAlign: "center",
    verticalAlign: "middle",
    minWidth: "150px",          // ← Aumenta el espacio mínimo
    lineHeight: "1.2",          // ← Reduce el espacio entre líneas
  }}
>
  NOMBRE DE LA MAQUINARIA
</th>


                <th colSpan="2">
                   <textarea
    placeholder="Introduzca el nombre de la maquinaria"
    value={state.nombreMaquinaria}
    onChange={(e) => handleChange("nombreMaquinaria", e.target.value)}
    rows="2"
    style={{
      width: "98%",
      resize: "vertical",
      padding: "4px",
      borderRadius: "4px",
      fontSize: "16px",
      boxSizing: "border-box",
    }}
  />
                </th>
                <th colSpan="2" className="energia-utilizada">
                  ENERGÍA UTILIZADA:
                </th>
                <th colSpan="2">
                  <select
                    className="energia-utilizada"
                    value={state.energiaUtilizada}
                    onChange={(e) =>
                      handleChange("energiaUtilizada", e.target.value)
                    }
                    style={{ width: "100%" }}
                  >
                    {renderOptions(opciones.energia)}
                  </select>
                </th>
                <th colSpan="1" className="area">
                  ÁREA:
                </th>
                <th colSpan="2">
    <select
  value={area}
  onChange={(e) => setArea(e.target.value)}
  style={{ width: "100%", marginBottom: "10px" }}
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
  <th colSpan="6" style={{ whiteSpace: "normal", lineHeight: "1.2", fontSize: "13px", textAlign: "center" }}>
  LOCALIZACIÓN ESQUEMÁTICA DE LOS RIESGOS EN LAS HERRAMIENTAS
</th>


  <th className="area" colSpan="2">EMPRESA</th>
  <th colSpan="2">
    <select
      name="empresas"
      value={empresaSeleccionada}
      onChange={(e) => setEmpresaSeleccionada(e.target.value)}
      style={{ width: "100%" }}
    >
      <option value="">Seleccione una empresa</option>
      {empresas.map((empresa, index) => (
        <option key={index} value={empresa}>
          {empresa}
        </option>
      ))}
    </select>
  </th>

  <th className="poe">POE</th>
  <th colSpan="2">
  <input
  className="poe"
  type="text"
  value={poe}
  onChange={(e) => setPoe(e.target.value)}
  placeholder="Escriba el POE"
  style={{ width: "100%" }}
/>

  </th>

  <th className="tiempo-exposicion" colSpan="2">TIEMPO DE EXPOSICIÓN:</th>
  <th colSpan="2">
    <select
      className="tiempo-exposicion"
      value={state.tiempoExposicion}
      onChange={(e) => handleChange("tiempoExposicion", e.target.value)}
      style={{ width: "100%" }}
    >
      {renderOptions(opciones.tiempoExposicion)}
    </select>
  </th>
</tr>

            </thead>

            <tr>
           <td colSpan="6" rowSpan="2">
  <div
    className="image-sectionn"
    onClick={() => {
      if (state.imagePreview) {
        handleChange("imagePreview", null); // Quitar imagen al hacer clic si ya hay una
      } else {
        document.getElementById("hiddenFileInput").click(); // Abrir input si no hay imagen
      }
    }}
    style={{
      width: "100%",
      height: "100%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "1px solid #ccc",
    }}
  >
    {state.imagePreview ? (
      <img
        src={state.imagePreview}
        alt="Vista previa"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
        }}
      />
    ) : (
      <span style={{ color: "#aaa", fontSize: "14px" }}>Haz clic para cargar imagen</span>
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


              <td colSpan="10" className="right-alignedd">
                <div className="text1">Evaluación de riesgo de trabajo</div>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Consecuencia</th>
                      <th>Exposición</th>
                      <th>Probabilidad</th>
                      <th>Magnitud del Riesgo</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <select
                          value={consequence}
                          onChange={handleConsequenceChange}
                          style={{ width: "100%" }}
                        >
                          <option value={100}>Catástrofe</option>
                          <option value={50}>Varias muertes</option>
                          <option value={25}>Muerte</option>
                          <option value={15}>Lesiones graves</option>
                          <option value={5}>Lesiones con baja</option>
                          <option value={1}>Lesiones sin baja</option>
                        </select>
                        <div>Valor: {consequence}</div>
                      </td>
                      <td>
                        <select
                          value={exposure}
                          onChange={handleExposureChange}
                          style={{ width: "100%" }}
                        >
                          <option value={10}>Continuamente</option>
                          <option value={6}>Frecuentemente</option>
                          <option value={3}>Ocasionalmente</option>
                          <option value={2}>Irregularmente</option>
                          <option value={1}>Raramente</option>
                          <option value={0.5}>Remotamente</option>
                        </select>
                        <div>Valor: {exposure}</div>
                      </td>
                      <td>
                        <select
                          value={probability}
                          onChange={handleProbabilityChange}
                          style={{ width: "100%" }}
                        >
                          <option value={10}>
                            Es el resultado más probable y esperado
                          </option>
                          <option value={6}>
                            Es completamente posible, no será nada extraño
                          </option>
                          <option value={3}>
                            Sería una secuencia o coincidencia rara pero posible, ha ocurrido
                          </option>
                          <option value={1}>
                            Coincidencia muy rara, pero se sabe que ha ocurrido
                          </option>
                          <option value={0.5}>
                            Coincidencia extremadamente remota pero concebible
                          </option>
                          <option value={0.1}>
                            Coincidencia prácticamente imposible, jamás ha ocurrido
                          </option>
                        </select>
                        <div>Valor: {probability}</div>
                      </td>
                      <td
                      
  style={{
    backgroundColor: obtenerColorPorRiesgo(magnitudRiesgo),
    color: "black", // ← Esto asegura que el texto sea negro
    fontWeight: "bold", // Opcional, para mayor visibilidad
  }}
>
  {magnitudRiesgo.toFixed(2)}
</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>


            <td
              colSpan="10"
              style={{
                backgroundColor: color,
                color: "black",
                textAlign: "center",
                padding: "1px",
              }}
            >
              <div style={{ fontSize: "14px" }}>
                Clasificación de magnitud de riesgo
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  padding: "1px",
                  fontSize: "12px",
                }}
              >
                <div>Magnitud del Riesgo: {magnitudRiesgo}</div>
                <div>Clasificación: {clasificacion}</div>
                <div>Acción: {accion}</div>
              </div>
            </td>

            <tr>
             <td colSpan="11" rowSpan="5" style={{ verticalAlign: "top", padding: "10px" }}>
  <table style={{ width: "100%", borderCollapse: "collapse" }}>
    <thead>
      <tr>
        <th style={{ textAlign: "left", fontSize: "18px", paddingBottom: "10px" }}>
          Identificación del Riesgo
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <div
            style={{
              maxHeight: "280px",
              overflowY: "auto",
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              fontSize: "15px",
              lineHeight: "1.6",
              backgroundColor: "#f9f9f9",
            }}
          >
         {Object.entries(partesPorPeligro).map(([peligro], index) => {
  const isSelected = selectedPeligros.includes(peligro);
  
  return (
    <div
      key={index}
      onClick={() => handlePeligroChange(peligro)}
      style={{
        // Estilos del contenedor principal
        display: "flex",
        alignItems: "center",
        marginBottom: "6px",
        cursor: "pointer",
        padding: "8px 12px",
        borderRadius: "6px",
        backgroundColor: "#ffffff", // Fondo blanco sólido
        border: "1px solid #e0e0e0", // Borde gris claro
        transition: "all 0.2s ease",
        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        
        // Efecto hover
        ":hover": {
          backgroundColor: "#f9f9f9",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }
      }}
    >
      {/* Checkbox personalizado */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20px",
          height: "20px",
          marginRight: "12px",
          borderRadius: "4px",
          backgroundColor: "#ffffff", // Fondo blanco
          border: "1px solid #bdbdbd", // Borde gris
          color: "#333333", // Color de la X
          fontSize: "12px",
          fontWeight: "bold",
          transition: "all 0.2s ease"
        }}
      >
        {isSelected ? "✕" : ""} {/* Símbolo X más estilizado */}
      </span>
      
      {/* Texto del elemento */}
      <span style={{ 
        flex: 1,
        fontSize: "14px",
        color: "#333333", // Texto gris oscuro
        fontWeight: "400",
        letterSpacing: "0.2px"
      }}>
        {peligro}
      </span>
    </div>
  );
})}
          </div>

          <div style={{ marginTop: "20px" }}>
            <label style={{ fontWeight: "bold" }}>Observaciones:</label>
            <textarea
              id="observaciones"
              value={state.observacionesGenerales}
              onChange={(e) =>
                handleChange("observacionesGenerales", e.target.value)
              }
              placeholder="Agregar observaciones generales aquí"
              rows="3"
              style={{
                width: "100%",
                marginTop: "6px",
                padding: "8px",
                borderRadius: "6px",
                fontSize: "14px",
                resize: "vertical",
              }}
            />
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</td>


          <td colSpan="3" style={{ verticalAlign: "top", paddingTop: "8px", minWidth: "200px" }}>
  <table className="risk-body-table" style={{ width: "100%" }}>
    <thead>
      <tr>
        <th style={{ fontSize: "14px", padding: "6px" }}>
          Principales partes del cuerpo expuestas al riesgo:
        </th>
      </tr>
    </thead>
    <tbody>
     {bodyParts.map((selected, index) => (
  <tr key={index}>
    <td>
      <select
        style={{ width: "100%" }}
        value={selected}
        onChange={(e) => {
          const updated = [...bodyParts];
          updated[index] = e.target.value;
          setBodyParts(updated);
        }}
      >
        <option value="" disabled>Seleccione parte del cuerpo</option>
        {todasPartesCuerpo.map((parte, idx) => (
          <option key={idx} value={parte}>{parte}</option>
        ))}
      </select>
    </td>
  </tr>

      ))}
    </tbody>
  </table>
</td>


              <td colSpan="5">
                <table className="" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Equipo de Protección Personal sugerido:</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEPP.map((value, index) => (
  <tr key={index}>
    <td>
      <select
        style={{ width: "100%" }}
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
                      ),
                    )}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr></tr>
          </table>
        </div>
      </div>
      <button onClick={handleDownload}>Descargar PDF</button>
      <button onClick={saveTableData} className="download-button">
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
