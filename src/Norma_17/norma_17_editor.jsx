import html2canvas from "html2canvas";
import "./Table17.css";
import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // Importar la configuración de Firebase
import logo from "../logos/logo.png";
import maxion from "../logos/maxion.jpeg";
import safran from "../logos/safran.jpeg";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import cimarron from "../logos/cimarron.png";


const RiskAssessmentTableEditor = () => {
  const [areas, setAreas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [selectedEmpresaId, setSelectedEmpresaId] = useState("");
  const [isEditing, setIsEditing] = useState(false); // Estado para modo de edición

  const [hazards, setHazards] = useState({
    "Caídas de Altura": false,
    "Exposición a Temperaturas": false,
    "Exposición a Electricidad Estática": false,
    "Exposición a Sustancias Químicas": false,
    "Exposición a Radiaciones": false,
    "Exposición agentes Biológicos": false,
    "Exposición a Ruido": false,
    "Exposición a Vibraciones": false,
    "Superficies cortantes": false,
    "Caídas a nivel o desnivel": false,
    "Calentamiento de materia prima, subproducto o producto": false,
  });

  const hazardOrder = [
    "Caídas de Altura",
    "Exposición a Temperaturas",
    "Exposición a Electricidad Estática",
    "Exposición a Sustancias Químicas",
    "Exposición a Radiaciones",
    "Exposición agentes Biológicos",
    "Exposición a Ruido",
    "Exposición a Vibraciones",
    "Superficies cortantes",
    "Caídas a nivel o desnivel",
    "Calentamiento de materia prima, subproducto o producto",
  ];
  

  const STORAGE_KEY = "riskAssessmentData_editor";

  // Coloca los hooks dentro del componente funcional
  const [areaSeleccionada, setAreaSeleccionada] = useState("");
  const [puestoSeleccionado, setPuestoSeleccionado] = useState("");
  const [puestos, setPuestos] = useState([]);
  const [descripcionActividad1, setDescripcionActividad1] = useState("");
  const [descripcionActividad2, setDescripcionActividad2] = useState("");

  // **Estados para Carpetas y Modal**
  const [folders, setFolders] = useState([]);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [fechaActual, setFechaActual] = useState("");
  const navigate = useNavigate();

  const handleAreaChange = (e) => {
    const selectedName = e.target.value;
    setAreaSeleccionada(selectedName);

    // Buscar la definición del área en el arreglo areas
    const selectedArea = areas.find((a) => a.nombre === selectedName);
    if (selectedArea) {
      setPuestos(selectedArea.puestos || []);
    } else {
      setPuestos([]);
    }
  };

  const handlePuestoChange = (e) => {
    setPuestoSeleccionado(e.target.value);
  };

  // Estados para los valores de Consecuencia, Exposición y Probabilidad
  const [consequence, setConsequence] = useState(1);
  const [exposure, setExposure] = useState(1);
  const [probability, setProbability] = useState(0.1);

  // Función para calcular el riesgo total
  const calculateRisk = () => {
    const risk = consequence * exposure * probability;
    console.log("Risk:", risk); // Añade esto para ver el valor del riesgo en la consola
    return risk;
  };

  // Función para obtener el color basado en el riesgo
  const getRiskColor = (risk) => {
    if (risk > 400) return "red"; // Muy Alto
    if (risk > 200) return "orange"; // Alto
    if (risk > 70) return "yellow"; // Notable
    if (risk > 20) return "green"; // Moderado
    return "blue"; // Bajo o Aceptable
  };

  // Manejadores de cambio para los selectores
  const handleConsequenceChange = (event) =>
    setConsequence(Number(event.target.value));
  const handleExposureChange = (event) =>
    setExposure(Number(event.target.value));
  const handleProbabilityChange = (event) =>
    setProbability(Number(event.target.value));
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar si el modal está abierto o cerrado
  const [puestosSeleccionadosParaBorrar, setPuestosSeleccionadosParaBorrar] =
    useState([]); // Estado para almacenar los puestos seleccionados para borrar
  // Para almacenar las imágenes seleccionadas por peligro
  const [selectedImages, setSelectedImages] = useState([]); // Para almacenar las imágenes seleccionadas para "Equipo de protección personal sugerido"

  const [selectedOptionEquipoUtilizado, setSelectedOptionEquipoUtilizado] =
    useState("");
  const [
    selectedOptionProteccionSugerida,
    setSelectedOptionProteccionSugerida,
  ] = useState("");
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");

  const handleOptionChangeEquipoUtilizado = (event) => {
    setSelectedOptionEquipoUtilizado(event.target.value);
  };

  const handleOptionChangeProteccionSugerida = (event) => {
    setSelectedOptionProteccionSugerida(event.target.value);
  };

  const optionImages = {
    option1: "/body/lvl1_head.png", // Cabeza
    option2: "/body/lvl1_mid.png", // Tronco
    option3: "/body/lvl1_foot.png", // Pies
    option4: "/body/lvl1_hand.png", // Brazos
    option5: "/body/lvl2_headmid.png", // Cabeza y Tronco
    option6: "/body/lvl2_handfoot.png", // Brazos y Pies
    option7: "/body/lvl2_headfoot.png", // Cabeza y Pies
    option8: "/body/lvl2_headhand.png", // Cabeza y Brazos
    option9: "/body/lvl2_midhand.png", // Tronco y Brazos
    option10: "/body/lvl2_midfoot.png", // Tronco y Pies
    option11: "/body/lvl3_headmidhand.png", // Cabeza, Tronco y Brazos
    option12: "/body/lvl3_headmidfoot.png", // Cabeza, Tronco y Pies
    option13: "/body/lvl3_headhandfoot.png", // Cabeza, Brazos y Pies
    option14: "/body/lvl3_midhandfoot.png", // Tronco, Brazos y Pies
    option15: "/body/lvl3_all.png", // Todas las Extremidades
  };

  const downloadImage = () => {
    const textarea = document.getElementById("descripcion-actividad-1");
  
    // Crear div temporal con el mismo contenido
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = textarea.value
      .split("\n")
      .map((line) => line || "<br>")
      .join("<br>");
  
    // Copiar estilos del textarea
    const styles = getComputedStyle(textarea);
    tempDiv.style.cssText = `
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: break-word;
      background-color: ${styles.backgroundColor};
      color: ${styles.color};
      font-family: ${styles.fontFamily};
      font-size: ${styles.fontSize};
      padding: ${styles.padding};
      border: ${styles.border};
      width: ${textarea.offsetWidth}px;
      height: ${textarea.offsetHeight}px;
    `;
  
    tempDiv.className = textarea.className;
    tempDiv.id = "descripcion-actividad-1-fake";
  
    // Insertar el div justo después del textarea
    textarea.style.display = "none";
    textarea.parentNode.insertBefore(tempDiv, textarea.nextSibling);
  
    // Oculta botones
    const buttons = document.querySelectorAll(
      ".btn-agregar, .btn-borrar, .download-button, .save-button, .reset-button, .btn-extra, .remove-logo-button, .btn-agregar-empresa, .epp-dropdown, .btn-add-empresa, .hidden-during-capture"
    );
    
    buttons.forEach((button) => button.classList.add("hidden-buttons"));
  
    const tableElement = document.querySelector(".main-table");
  
    // Guardar estilos originales
    const originalWidth = tableElement.style.width;
    const originalTransform = tableElement.style.transform;
    const originalMargin = tableElement.style.margin;
  
    // Ajuste temporal
    tableElement.style.width = "1800px";
    tableElement.style.transform = "scale(1)";
    tableElement.style.margin = "auto";
  
    html2canvas(tableElement, {
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      windowWidth: tableElement.scrollWidth,
      windowHeight: tableElement.scrollHeight,
      useCORS: true,
      backgroundColor: "#ffffff",
      scale: 2,
    })
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
        console.error("Error al capturar la tabla:", error);
      })
      .finally(() => {
        // Restaurar todo
        textarea.style.display = "";
        const fakeDiv = document.getElementById("descripcion-actividad-1-fake");
        if (fakeDiv) fakeDiv.remove();
  
        tableElement.style.width = originalWidth;
        tableElement.style.transform = originalTransform;
        tableElement.style.margin = originalMargin;
  
        buttons.forEach((button) => button.classList.remove("hidden-buttons"));
      });
  };
  

  const handleDeletePuestoClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Cerrar el modal
  };

  const handlePuestoSelectionChange = (event) => {
    const value = event.target.value;
    const alreadySelected = puestosSeleccionadosParaBorrar.includes(value);

    if (alreadySelected) {
      setPuestosSeleccionadosParaBorrar(
        puestosSeleccionadosParaBorrar.filter((puesto) => puesto !== value),
      );
    } else {
      setPuestosSeleccionadosParaBorrar([
        ...puestosSeleccionadosParaBorrar,
        value,
      ]);
    }
  };

  useEffect(() => {
    if (areaSeleccionada) {
      const areaSeleccionadaKey = `puestos_${areaSeleccionada}`;
      const savedPuestos = JSON.parse(
        localStorage.getItem(areaSeleccionadaKey),
      );

      if (savedPuestos && savedPuestos.length > 0) {
        setPuestos(savedPuestos);
      } else {
        const areaObj = areas.find((area) => area.nombre === areaSeleccionada);
        if (areaObj) {
          setPuestos(areaObj.puestos);
          localStorage.setItem(
            areaSeleccionadaKey,
            JSON.stringify(areaObj.puestos),
          );
        }
      }
    }
  }, [areaSeleccionada, areas]);

  // Función para agregar un nuevo puesto
  const handleAddPuestoClick = async () => {
    const nuevoPuesto = prompt("Ingrese el nuevo puesto:");
    if (nuevoPuesto && nuevoPuesto.trim() !== "") {
      const updatedPuestos = [...puestos, nuevoPuesto.trim()];
      setPuestos(updatedPuestos);
      setPuestoSeleccionado("");
      const selectedAreaObj = areas.find(
        (area) =>
          area.nombre.trim().toLowerCase() ===
          areaSeleccionada.trim().toLowerCase(),
      );
      if (!selectedAreaObj || !selectedEmpresaId) {
        console.error(
          "No se encontró el área o la empresa no está seleccionada.",
          {
            selectedEmpresaId,
            areaSeleccionada,
            areas,
          },
        );
        alert(
          "No se pudo agregar el puesto: selecciona una empresa y un área.",
        );
        return;
      }
      try {
        await updateDoc(
          doc(
            db,
            "Empresas_17",
            selectedEmpresaId,
            "areas",
            selectedAreaObj.id,
          ),
          { puestos: updatedPuestos },
        );
        console.log("Puesto agregado y actualizado en Firebase");
      } catch (error) {
        console.error("Error actualizando puestos en Firebase:", error);
        alert("Error al agregar el puesto, revisa la consola.");
      }
    }
  };

  // Función para borrar los puestos seleccionados
  const handleDeleteSelectedPuestos = () => {
    const nuevosPuestos = puestos.filter(
      (puesto) => !puestosSeleccionadosParaBorrar.includes(puesto),
    );
    setPuestos(nuevosPuestos); // Actualiza los puestos eliminando los seleccionados

    // Guardamos los puestos actualizados en localStorage para el área seleccionada
    const areaSeleccionadaKey = `puestos_${areaSeleccionada}`;
    localStorage.setItem(areaSeleccionadaKey, JSON.stringify(nuevosPuestos));

    setPuestosSeleccionadosParaBorrar([]); // Limpiar la selección
    setIsModalOpen(false); // Cerrar el modal
  };

  /*
  const saveTable = async (empresaId, normaId) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("No estás autenticado.");
      return;
    }
    const uid = user.uid; // Obtener UID del usuario

    const tableData = {
      uid,
      areaSeleccionada,
      puestoSeleccionado,
      hazards,
      consequence,
      exposure,
      probability,
      risk: calculateRisk(),
      selectedImages,
      descripcionActividad1,
      descripcionActividad2,
      selectedOptionEquipoUtilizado,
      selectedOptionProteccionSugerida,
      tiempoExposicion,
      norma: "N-017",
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      nombreEmpresa: empresaSeleccionada,
    };

    try {
      // Guardar la tabla en la subcolección "tablas" de la norma seleccionada dentro de la empresa
      await addDoc(
        collection(db, "empresas", empresaId, "normas", normaId, "tablas"),
        tableData,
      );
      alert("Tabla guardada con éxito en Firestore.");

      // Actualizar el resumen correspondiente si es necesario (este bloque se mantiene igual)
      const resumenRef = doc(db, "resumen_17", areaSeleccionada);
      const resumenSnapshot = await getDoc(resumenRef);

      let newResumenData = {
        uid,
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
        ...newResumenData.puestos.filter(
          (p) => p.nombre !== puestoSeleccionado,
        ),
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
  }; */

  // Ejemplo de función para asignar color según el nivel de riesgo
  // Función simple para generar un ID único (sin librerías)
  const generateUniqueId = () => {
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
  };

  const updateTable = async () => {
    const empresa = tableToEdit?.empresaSeleccionada || "";
    const normaAuto = tableToEdit?.norma || "N-017";
    const empresaId = tableToEdit?.empresaId || "";
    const normaId = tableToEdit?.normaId || "";

    // Si ya existe un id para el puesto, lo usamos; de lo contrario, generamos uno
    // Esto debe estar guardado para futuras actualizaciones
    const puestoId = tableToEdit?.puestoId || generateUniqueId();

    // Incluimos el puestoId en el objeto actualizado para persistirlo
    const updatedTable = {
      areaSeleccionada,
      puestoSeleccionado,
      hazards,
      consequence,
      logoSeleccionado,
      exposure,
      probability,
      bodyPartsSelected,
      risk: calculateRisk(),
      selectedImages,
      descripcionActividad1,
      descripcionActividad2,
      selectedOptionEquipoUtilizado,
      selectedOptionProteccionSugerida,
      tiempoExposicion,
      norma: normaAuto,
      fecha,
      hora,
      nombreEmpresa: empresaSeleccionada,
      selectedMainOption,
      selectionList,
      puestoId, // ID único del puesto
    };

    try {
      if (!tableId) {
        throw new Error("No se encontró el ID de la tabla para actualizar.");
      }
      if (!empresaId || !normaId) {
        throw new Error("No se encontraron los IDs de la empresa o la norma.");
      }

      // 1. Actualiza el documento principal (tablas)
      const docRef = doc(
        db,
        "empresas",
        empresaId,
        "normas",
        normaId,
        "tablas",
        tableId,
      );
      await setDoc(docRef, updatedTable, { merge: true });

      // 2. Actualiza el resumen en la ruta que coincide con la Tabla de Resumen
      const resumenCollection = "resumen_17"; // O "resumen_004" según corresponda
      const empresaFolder = empresaSeleccionada;
      const areaDocId = areaSeleccionada;
      const resumenRef = doc(
        db,
        resumenCollection,
        empresaFolder,
        "areas",
        areaDocId,
      );
      const resumenSnapshot = await getDoc(resumenRef);

      let areaData = resumenSnapshot.exists()
        ? resumenSnapshot.data()
        : {
            puestos: [],
            tolerable: 0,
            moderado: 0,
            notable: 0,
            elevado: 0,
            grave: 0,
          };

      // 3. Construye el objeto puesto
      const risk = calculateRisk();
      const newPuesto = {
        id: puestoId, // ID único para identificar el puesto
        nombre: puestoSeleccionado,
        magnitudRiesgo: risk,
        riskColor: getRiskColor(risk),
        tolerable: 0,
        moderado: 0,
        notable: 0,
        elevado: 0,
        grave: 0,
      };

      // Asigna la categoría y el "1" en la columna correspondiente
      if (risk <= 20) {
        newPuesto.categoria = "Tolerable";
        newPuesto.tolerable = 1;
      } else if (risk <= 70) {
        newPuesto.categoria = "Moderado";
        newPuesto.moderado = 1;
      } else if (risk <= 200) {
        newPuesto.categoria = "Notable";
        newPuesto.notable = 1;
      } else if (risk <= 400) {
        newPuesto.categoria = "Elevado";
        newPuesto.elevado = 1;
      } else {
        newPuesto.categoria = "Grave";
        newPuesto.grave = 1;
      }

      // 4. Actualiza la lista de puestos:
      // Primero, intenta encontrar el puesto por ID; si no existe, como respaldo busca por nombre
      let copyPuestos = Array.isArray(areaData.puestos)
        ? [...areaData.puestos]
        : [];
      let puestoIndex = copyPuestos.findIndex((p) => p.id === puestoId);

      if (puestoIndex === -1) {
        // Si no se encontró por ID, intenta encontrarlo por nombre
        puestoIndex = copyPuestos.findIndex(
          (p) => p.nombre === puestoSeleccionado,
        );
      }

      if (puestoIndex !== -1) {
        // Actualiza el puesto existente (sin duplicar)
        copyPuestos[puestoIndex] = newPuesto;
      } else {
        // Si no se encontró ningún puesto, se agrega (esto ocurrirá sólo la primera vez)
        copyPuestos.push(newPuesto);
      }

      // 5. Recalcula totales acumulados
      const newTotals = copyPuestos.reduce(
        (acc, puesto) => {
          acc.tolerable += puesto.tolerable || 0;
          acc.moderado += puesto.moderado || 0;
          acc.notable += puesto.notable || 0;
          acc.elevado += puesto.elevado || 0;
          acc.grave += puesto.grave || 0;
          return acc;
        },
        { tolerable: 0, moderado: 0, notable: 0, elevado: 0, grave: 0 },
      );

      // 6. Guarda el área actualizada en el resumen
      await setDoc(
        resumenRef,
        {
          area: areaSeleccionada,
          puesto: puestoSeleccionado,
          riskScore: risk,
          riskColor: getRiskColor(risk),
          puestos: copyPuestos,
          ...newTotals, // Totales por categoría
        },
        { merge: true },
      );

      // 7. Lee el documento para refrescar el estado local
      const updatedSnapshot = await getDoc(docRef);
      const updatedData = updatedSnapshot.data();

      // 8. Actualiza los estados del editor
      setAreaSeleccionada(updatedData.areaSeleccionada || "");
      setPuestoSeleccionado(updatedData.puestoSeleccionado || "");
      setHazards(updatedData.hazards || {});
      setConsequence(updatedData.consequence || 1);
      setExposure(updatedData.exposure || 1);
      setProbability(updatedData.probability || 0.1);
      setSelectedImages(updatedData.selectedImages || []);
      setDescripcionActividad1(updatedData.descripcionActividad1 || "");
      setDescripcionActividad2(updatedData.descripcionActividad2 || "");
      setSelectedOptionEquipoUtilizado(
        updatedData.selectedOptionEquipoUtilizado || "",
      );
      setSelectedOptionProteccionSugerida(
        updatedData.selectedOptionProteccionSugerida || "",
      );
      setTiempoExposicion(updatedData.tiempoExposicion || "8hrs");

      localStorage.setItem("tableToEdit", JSON.stringify(updatedTable));
      localStorage.removeItem("riskAssessmentData_editor");

      alert(
        "Tabla y resumen actualizados con éxito en Firestore y en pantalla.",
      );
    } catch (error) {
      console.error("Error al actualizar en Firestore:", error);
      alert("Error al actualizar la tabla y el resumen.");
    }
  };

  const [fecha, setFecha] = useState(new Date().toLocaleDateString()); // Estado para la fecha
  const [tiempoExposicion, setTiempoExposicion] = useState("8hrs");
  const [hora, setHora] = useState(new Date().toLocaleTimeString());
  const [tableId, setTableId] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  console.log(JSON.parse(localStorage.getItem("tableToEdit")));
  const [tableToEdit, setTableToEdit] = useState(null);
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("tableToEdit"));
    setTableToEdit(storedData);
  }, []); // Se ejecuta una vez al montar el componente

  // ...

  useEffect(() => {
    if (!tableToEdit) return;

    console.log("Datos recuperados en el editor:", tableToEdit);

    // 1. Datos generales que ya tenías
    setAreaSeleccionada(tableToEdit.areaSeleccionada || "");
    setPuestoSeleccionado(tableToEdit.puestoSeleccionado || "");
    setSelectedOptionEquipoUtilizado(
      tableToEdit.selectedOptionEquipoUtilizado || "",
    );
    setSelectedOptionProteccionSugerida(
      tableToEdit.selectedOptionProteccionSugerida || "",
    );
    setSelectedImages(tableToEdit.selectedImages || []);
    setHazards(tableToEdit.hazards || {});
    setConsequence(tableToEdit.consequence || 1);
    setExposure(tableToEdit.exposure || 1);
    setProbability(tableToEdit.probability || 0.1);
    setDescripcionActividad1(tableToEdit.descripcionActividad1 || "");
    setDescripcionActividad2(tableToEdit.descripcionActividad2 || "");
    setTiempoExposicion(tableToEdit.tiempoExposicion || "8hrs");
    setLogoSeleccionado(tableToEdit.logoSeleccionado || null);

    
    setBodyPartsSelected({
      "Cabeza y Oídos": false,
      "Ojos y Cara": false,
      "Sistema respiratorio": false,
      "Tronco": false,
      "Brazos y Manos": false,
      "Extremidades inferiores": false,
      ...(tableToEdit.bodyPartsSelected || {}),
    });
    
    

    

    // En vez de poner new Date(), asignas directamente la fecha guardada
    if (tableToEdit.fecha) {
      setFecha(parseDdMmYyyyToIso(tableToEdit.fecha));
    }
    
    
    // Si no hay hora guardada, usas la actual
    setHora(tableToEdit.hora || new Date().toLocaleTimeString());

    setTableId(tableToEdit.id || null);
    setSelectedMainOption(tableToEdit.selectedMainOption || "");
    setEmpresaSeleccionada(tableToEdit.nombreEmpresa || "");
    setSelectionList(tableToEdit.selectionList || []);

    // 2. Sincronizar la EMPRESA guardada con la lista "empresas"
    if (empresas.length > 0 && tableToEdit.nombreEmpresa) {
      const matchedEmpresa = empresas.find(
        (emp) => emp.nombre === tableToEdit.nombreEmpresa,
      );
      if (matchedEmpresa) {
        setSelectedEmpresaId(matchedEmpresa.id);
        setEmpresaSeleccionada(matchedEmpresa.nombre);
      } else {
        // Creamos una empresa "temporal"
        const tempId = "temp-" + Date.now();
        const tempEmpresa = { id: tempId, nombre: tableToEdit.nombreEmpresa };
        setEmpresas((prev) => [...prev, tempEmpresa]);
        setSelectedEmpresaId(tempId);
        setEmpresaSeleccionada(tableToEdit.nombreEmpresa);
      }
    }

    // 3. Sincronizar el ÁREA guardada con la lista "areas"
    if (areas.length > 0 && tableToEdit.areaSeleccionada) {
      const matchedArea = areas.find(
        (a) => a.nombre === tableToEdit.areaSeleccionada,
      );
      if (matchedArea) {
        setAreaSeleccionada(matchedArea.nombre);
      } else {
        const tempAreaId = "temp-" + Date.now();
        const tempArea = {
          id: tempAreaId,
          nombre: tableToEdit.areaSeleccionada,
          puestos: [],
        };
        setAreas((prev) => [...prev, tempArea]);
        setAreaSeleccionada(tempArea.nombre);
      }
    }
  }, [tableToEdit, empresas, areas]);

  function parseDdMmYyyyToIso(fechaStr) {
    if (!fechaStr) return "";
  
    // Detectar si ya está en formato ISO
    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaStr)) {
      return fechaStr;
    }
  
    // Si viene en formato dd/mm/yyyy
    const [dd, mm, yyyy] = fechaStr.split("/");
    if (!dd || !mm || !yyyy) return "";
  
    return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
  }
  
  

  const handleImageRemove = (imageToRemove) => {
    setSelectedImages((prevSelectedImages) =>
      prevSelectedImages.filter((image) => image !== imageToRemove),
    );
  };

  const handleAddAreaClick = () => {
    const nuevaArea = prompt("Ingrese el nombre de la nueva área:");
    if (nuevaArea && nuevaArea.trim() !== "") {
      const updatedAreas = [
        ...areas,
        { nombre: nuevaArea.trim(), puestos: [] },
      ];
      setAreas(updatedAreas);

      // Guardamos el área en localStorage
      localStorage.setItem("areas", JSON.stringify(updatedAreas));
      setAreaSeleccionada(nuevaArea.trim()); // Cambia a la nueva área
    }
  };

  useEffect(() => {
    // Intenta cargar las áreas desde localStorage
    const savedAreas = JSON.parse(localStorage.getItem("areas"));
    if (savedAreas && savedAreas.length > 0) {
      setAreas(savedAreas); // Si existen áreas guardadas, las carga en el estado
    }
  }, []);

  const [selectedMainOption, setSelectedMainOption] = useState(""); // Estado para la opción principal
  const [selectedSubOption, setSelectedSubOption] = useState(""); // Estado para la subcategoría seleccionada
  const [showSubDropdown, setShowSubDropdown] = useState(false); // Estado para mostrar u ocultar el segundo menú
  const [selectionList, setSelectionList] = useState([]); // Lista acumulativa de selecciones

  // Opciones principales y sus subcategorías
  const eppOptions = {
    Casco: [
      "Casco Dieléctrico",
      "Casco de Seguridad",
      "Casco con Visera",
      "Casco contra Impacto",
    ],
    Guantes: [
      "Guantes de Látex",
      "Guantes de Nitrilo",
      "Guantes de Cuero",
      "Guantes contra Sustancias Químicas",
      "Guantes contra Temperaturas Extremas",
      "Guantes Dieléctricos",
    ],
    "Gafas de Protección": [
      "Goggles",
      "Anteojos de Protección",
      "Gafas Antiempañantes",
      "Gafas de Impacto",
    ],
    Botas: [
      "Botas de Seguridad",
      "Botas Impermeables",
      "Botas Aislantes",
      "Calzado Conductivo",
      "Calzado contra Impacto",
      "Calzado contra Sustancias Químicas",
      "Calzado Dieléctrico",
      "Calzado Ocupacional",
    ],
    Mandil: [
      "Mandil contra Altas Temperaturas",
      "Mandil contra Sustancias Químicas",
      "Oberol",
      "Bata",
    ],
    // Nuevas clasificaciones

    "Equipo de Audición": 
    [
      "Conchas Acústicas", 
      "Tapones Auditivos"
    ],
    
    Respiradores: [
      "Respirador contra Gases y Vapores",
      "Respirador contra Partículas",
      "Mascarilla",
    ],
    "Protección Facial": [
      "Careta para Soldador",
      "Cofia",
      "Cubrebocas",
      "Pantalla Facial",
      "Capuchas",
      "Anteojos de Protección",
    ],
    "Ropa de Protección": [
      "Overol",
      "Bata",
      "Ropa contra Sustancias Peligrosas",
      "Polainas",
    ],
    "Equipos Especiales": [
      "Equipo de Protección contra Caídas de Altura",
      "Equipo de Respiración Autónomo",
      "Equipo para brigadistas contra incendios",
    ],
    Mangas: ["Mangas"],
    Arnés: ["Arnés"],
  };

  // Estado que controla qué partes del cuerpo están marcadas con “X”
  const [bodyPartsSelected, setBodyPartsSelected] = useState({
    "Cabeza y Oídos": false,
    "Ojos y Cara": false,
    "Sistema respiratorio": false,
    Tronco: false,
    "Brazos y Manos": false,
    "Extremidades inferiores": false,
  });

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

  // Nuevo useEffect para actualizar el menú basado en la selección de imágenes de EPP

  const handleMainOptionChange = (e) => {
    const value = e.target.value;
    setSelectedMainOption(value);
    setSelectedSubOption(""); // Reinicia la subcategoría al cambiar el principal
    setShowSubDropdown(true); // Muestra el segundo menú al seleccionar una opción principal
  };

  const logos = [
      { nombre: "Safran", url: safran },
      { nombre: "Maxion", url: maxion },
      { nombre: "Cimarron", url: cimarron },
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

  const [hideButtons] = useState(false);

  document.addEventListener("DOMContentLoaded", () => {
    const tableContainer = document.querySelector(".table-container");

    let isDragging = false;
    let startX, scrollLeft;

    // Manejo del toque (táctil) para dispositivos móviles
    tableContainer.addEventListener("touchstart", (e) => {
      isDragging = true;
      startX = e.touches[0].pageX - tableContainer.offsetLeft;
      scrollLeft = tableContainer.scrollLeft;
    });

    tableContainer.addEventListener("touchend", () => {
      isDragging = false;
    });

    tableContainer.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.touches[0].pageX - tableContainer.offsetLeft;
      const walk = (x - startX) * 2; // Ajusta la velocidad del desplazamiento
      tableContainer.scrollLeft = scrollLeft - walk;
    });
  });

  const handleDeleteSelection = (indexToDelete) => {
    setSelectionList((prevList) =>
      prevList.filter((_, index) => index !== indexToDelete),
    );

    // Reinicia las opciones seleccionadas
    setSelectedMainOption("");
    setSelectedSubOption("");
  };

  const handleCustomLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoSeleccionado(reader.result); // Establece la imagen cargada como el logo seleccionado
      };
      reader.readAsDataURL(file); // Lee el archivo como una URL de datos
    }
  };

  // Estado para las partes desmarcadas manualmente
  const [removedParts, setRemovedParts] = useState([]); // Partes desmarcadas manualmente

  // Función para alternar la selección de una parte del cuerpo
  const toggleBodyPart = (part) => {
    setBodyPartsSelected((prev) => ({
      ...prev,
      [part]: !prev[part],
    }));
  };

  // Determinar si mostrar "X" (si está en affectedBodyParts y no en removedParts)

  useEffect(() => {
    if (!isEditing) {
      // Solo cargar si NO estamos editando
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.areaSeleccionada)
          setAreaSeleccionada(parsed.areaSeleccionada);
        if (parsed.puestoSeleccionado)
          setPuestoSeleccionado(parsed.puestoSeleccionado);
        if (parsed.descripcionActividad1)
          setDescripcionActividad1(parsed.descripcionActividad1);
        if (parsed.descripcionActividad2)
          setDescripcionActividad2(parsed.descripcionActividad2);
        if (parsed.hazards) setHazards(parsed.hazards);
        if (parsed.consequence) setConsequence(parsed.consequence);
        if (parsed.exposure) setExposure(parsed.exposure);
        if (parsed.probability) setProbability(parsed.probability);
        if (parsed.selectedImages) setSelectedImages(parsed.selectedImages);
        if (parsed.selectedOptionEquipoUtilizado) {
          setSelectedOptionEquipoUtilizado(
            parsed.selectedOptionEquipoUtilizado,
          );
        }
        if (parsed.selectedOptionProteccionSugerida) {
          setSelectedOptionProteccionSugerida(
            parsed.selectedOptionProteccionSugerida,
          );
        }
        if (parsed.tiempoExposicion)
          setTiempoExposicion(parsed.tiempoExposicion);
      }
    }
  }, [isEditing]);

  // ==== 3. CADA VEZ QUE ALGÚN ESTADO CAMBIA: GUARDO EN LOCALSTORAGE ====
  useEffect(() => {
    const dataToSave = {
      // Incluye todos tus estados
      areaSeleccionada,
      puestoSeleccionado,

      descripcionActividad1,
      descripcionActividad2,

      hazards,
      removedParts,

      consequence,
      exposure,
      probability,

      selectedImages,
      selectedOptionEquipoUtilizado,
      selectedOptionProteccionSugerida,
      selectedMainOption,
      selectedSubOption,
      selectionList,

      tiempoExposicion,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [
    // Lista de dependencias: todos los estados que quieras persistir
    areaSeleccionada,
    puestoSeleccionado,

    descripcionActividad1,
    descripcionActividad2,

    hazards,
    removedParts,

    consequence,
    exposure,
    probability,

    selectedImages,
    selectedOptionEquipoUtilizado,
    selectedOptionProteccionSugerida,
    selectedMainOption,
    selectedSubOption,
    selectionList,

    tiempoExposicion,
  ]);

  const handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);

    // 1. Quita o comenta la línea que resetea el área
    // setAreaSeleccionada('');  <-- la quitas o comentas

    setPuestoSeleccionado("");
    setDescripcionActividad1("");
    setDescripcionActividad2("");
    setHazards({
      "Caídas de Altura": false,
      "Exposición a Temperaturas": false,
      "Exposición a Electricidad Estática": false,
      "Exposición a Sustancias Químicas": false,
      "Exposición a Radiaciones": false,
      "Exposición agentes Biológicos": false,
      "Exposición a Ruido": false,
      "Exposición a Vibraciones": false,
      "Superficies cortantes": false,
      "Caídas a nivel o desnivel": false,
      "Calentamiento de materia prima, subproducto o producto": false,
    });
    setRemovedParts([]);
    setConsequence(1);
    setExposure(1);
    setProbability(0.1);
    setSelectedImages([]);
    setSelectedOptionEquipoUtilizado("");
    setSelectedOptionProteccionSugerida("");
    setSelectedMainOption("");
    setSelectedSubOption("");
    setSelectionList([]);
    setTiempoExposicion("8hrs");
  };

  // Función para cargar las empresas desde Firestore
  const loadFolders = async () => {
    try {
      // Se lee de la colección "empresas" en lugar de "carpetas"
      const querySnapshot = await getDocs(collection(db, "empresas"));
      const fetchedFolders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre,
      }));
      setFolders(fetchedFolders);
    } catch (error) {
      console.error("Error al cargar las empresas:", error);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  // Abrir el modal
  const openFolderModal = () => {
    setIsFolderModalOpen(true);
  };

  // Cerrar el modal
  const closeFolderModal = () => {
    setIsFolderModalOpen(false);
    setSelectedEmpresaId("");
    setSelectedNormaId("");
    setNormas([]);
  };

  useEffect(() => {
    const hoy = new Date().toISOString().split("T")[0]; // Obtiene la fecha actual en formato YYYY-MM-DD
    setFechaActual(hoy);
  }, []);

  // Estado para la empresa seleccionada (anteriormente selectedFolderId)

  // Estado para la norma seleccionada dentro de la empresa
  const [selectedNormaId, setSelectedNormaId] = useState("");

  // Estado para almacenar las normas cargadas de la empresa seleccionada
  const [normas, setNormas] = useState([]);

  const loadNormas = async (empresaId) => {
    try {
      const snapshot = await getDocs(
        collection(db, "empresas", empresaId, "normas"),
      );
      const fetchedNormas = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNormas(fetchedNormas);
    } catch (error) {
      console.error("Error al cargar normas:", error);
    }
  };

  const handleSelectEmpresa = (empresaId) => {
    setSelectedEmpresaId(empresaId);
    // Cargar las normas correspondientes a la empresa seleccionada:
    loadNormas(empresaId);
  };

  const handleSelectNorma = (normaId) => {
    setSelectedNormaId(normaId);
  };

  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [areasSeleccionadasParaBorrar, setAreasSeleccionadasParaBorrar] =
    useState([]);

  const handleDeleteAreaClick = () => {
    console.log("✅ Abriendo modal para eliminar áreas...");
    setIsAreaModalOpen(true);
  };

  const handleAreaModalClose = () => {
    setIsAreaModalOpen(false);
    setAreasSeleccionadasParaBorrar([]); // Limpiar selección al cerrar
  };

  const handleAreaSelectionChange = (event) => {
    const value = event.target.value;
    setAreasSeleccionadasParaBorrar((prev) =>
      prev.includes(value)
        ? prev.filter((area) => area !== value)
        : [...prev, value],
    );
  };

  const handleDeleteSelectedAreas = () => {
    if (areasSeleccionadasParaBorrar.length === 0) {
      alert("Selecciona al menos un área para eliminar.");
      return;
    }

    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar las siguientes áreas?\n${areasSeleccionadasParaBorrar.join(", ")}`,
    );
    if (!confirmDelete) return;

    const updatedAreas = areas.filter(
      (area) => !areasSeleccionadasParaBorrar.includes(area.nombre),
    );
    setAreas(updatedAreas);
    localStorage.setItem("areas", JSON.stringify(updatedAreas));

    setAreasSeleccionadasParaBorrar([]);
    setIsAreaModalOpen(false);
    alert("Áreas eliminadas con éxito.");
  };

  const risk = calculateRisk();

  // Define el estado inicial de las empresas

  // Función para agregar una nueva empresa
  const handleAddEmpresa = () => {
    const nuevaEmpresa = prompt("Ingrese el nombre de la nueva empresa:");
    if (nuevaEmpresa && !empresas.includes(nuevaEmpresa)) {
      setEmpresas([...empresas, nuevaEmpresa]);
    }
  };

  // Función para borrar la empresa seleccionada
  const handleDeleteEmpresa = () => {
    if (!empresaSeleccionada) {
      alert("Seleccione una empresa para borrar");
      return;
    }
    const confirmDelete = window.confirm(
      `¿Está seguro de borrar la empresa ${empresaSeleccionada}?`,
    );
    if (confirmDelete) {
      setEmpresas(
        empresas.filter((empresa) => empresa !== empresaSeleccionada),
      );
      setEmpresaSeleccionada("");
    }
  };

  const handleEmpresaChange = (e) => {
    const selectedId = e.target.value;
    setSelectedEmpresaId(selectedId);

    // Opcional: guardar en otro estado el nombre de la empresa
    const selected = empresas.find((emp) => emp.id === selectedId);
    setEmpresaSeleccionada(selected ? selected.nombre : "");

    // Limpia áreas y puestos mientras se carga la nueva información
    setAreas([]);
    setAreaSeleccionada("");
    setPuestos([]);
    setPuestoSeleccionado("");
  };

  // DECLARAMOS FUERA
  const loadEmpresas = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Empresas_17"));
      const empresasList = snapshot.docs.map((doc) => doc.data().nombre);
      setEmpresas(empresasList);
    } catch (error) {
      console.error("Error al cargar las empresas:", error);
    }
  };

  useEffect(() => {
    loadEmpresas(); // Se ejecuta al montar el componente
  }, []);

  useEffect(() => {
    loadEmpresas(); // Puede llamarse aquí
  }, []);

  const loadAreas = async () => {
    try {
      const snapshot = await getDocs(collection(db, "areas"));
      // Cada doc en 'areas' podría tener { nombre: "Producción", puestos: [...] }
      const areaList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAreas(areaList);
    } catch (error) {
      console.error("Error al cargar áreas:", error);
    }
  };

  // useEffect que carga las áreas
  useEffect(() => {
    if (!selectedEmpresaId) return; // si no hay empresa, no cargamos

    const fetchAreas = async () => {
      try {
        // Documento de la empresa
        const empresaRef = doc(db, "Empresas_17", selectedEmpresaId);
        // Subcolección "areas"
        const areasRef = collection(empresaRef, "areas");
        const querySnapshot = await getDocs(areasRef);

        const dbAreas = querySnapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        setAreas(dbAreas);
      } catch (error) {
        console.error("Error al cargar áreas desde Firebase:", error);
      }
    };

    fetchAreas();
  }, [selectedEmpresaId]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    // 'name' es el key del objeto hazards,
    // 'checked' es true/false si el checkbox está marcado

    setHazards((prevHazards) => ({
      ...prevHazards,
      [name]: checked, // Actualiza el valor booleano
    }));
  };

  const eppNames = {
    "/images/1.png": "Mandil de temperaturas",
    "/images/2.png": "Respirador",
    "/images/3.png": "Anteojos de proteccion",
    "/images/4.png": "Botas",
    "/images/5.png": "Tapones de oido",
    "/images/6.png": "Guantes",
    "/images/7.png": "Gafas contra sustancias",
    "/images/8.png": "Cubierta de frio",
    "/images/9.png": "Mandil",
    "/images/10.png": "Casco",
    "/images/11.png": "Cubre Bocas",
    "/images/12.png": "Chaleco reflectante",
    "/images/13.png": "Bata de laboratorio",
    "/images/14.png": "Pantalla facial",
    "/images/15.png": "Careta soldador",
    "/images/16.png": "Tanque respirador",
    "/images/17.png": "Mascarilla",
    "/images/18.png": "Cofia",
    "/images/19.png": "Conchas",
    "/images/21.png": "Mangas",
    "/images/23.png": "Arnes",
    "/images/24.png": "Overol",
  };

  const eppImagesList = Object.keys(eppNames);

  const handleAddEPPImage = (event) => {
    const selectedImage = event.target.value;
    if (selectedImage) {
      setSelectedImages((prevImages) => [...prevImages, selectedImage]);
    }
  };

  useEffect(() => {
    if (!selectedEmpresaId) return;
    const loadAreas = async () => {
      const empresaRef = doc(db, "Empresas_17", selectedEmpresaId);
      const areasRef = collection(empresaRef, "areas");
      const querySnapshot = await getDocs(areasRef);
      const loadedAreas = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));
      setAreas(loadedAreas);
    };
    loadAreas();
  }, [selectedEmpresaId]);

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companiesRef = collection(db, "Empresas_17");
        const querySnapshot = await getDocs(companiesRef);
        // Extraemos el campo "nombre" de cada documento
        const companiesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // doc.data().nombre, etc.
        }));
        setEmpresas(companiesList);
      } catch (error) {
        console.error("Error al cargar empresas desde Firebase:", error);
      }
    };

    loadCompanies();
  }, []);

  const riskColor = getRiskColor(risk);

  const autoResizeTextarea = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto"; // Reinicia la altura
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta a contenido
  };
  

  return (
    <div class="main-table">
      {/* Botón para regresar a la pantalla de registros (por ejemplo: /savedTables) */}
      <button
  onClick={() => navigate("/savedTables")}
  className="btn-exit-editor hidden-during-capture"
>
  ← Volver a los Registros
</button>

      <table
        class="custom-table"
        className="table-container"
        style={{ backgroundColor: "white" }}
      >
        <thead>
          <tr className="no-border-row">
            {/* Nueva fila superior con celdas individuales para cada sección */}
            <td colSpan="3">
              <img src={logo} alt="SIACH Logo" className="siach-logo" />
            </td>
            <td colSpan="4" style={{ backgroundColor: "white" }}>
              <h3 className="section-header" style={{ color: "black" }}>
                Análisis de Riesgo y Determinación de equipo de protección
                personal NOM-017-STPS-2008
              </h3>
            </td>

            <td colSpan="3">
              {logoSeleccionado ? (
                <div className="logo-container">
                  <img
                    src={logoSeleccionado}
                    alt="Logo de la Empresa"
                    className="company-logo"
                  />
                  <button
                    onClick={handleRemoveLogo}
                    className="remove-logo-button"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="logo-upload-container">
                  <select
                      value={logoSeleccionado || ""}
                      onChange={handleLogoChange}
                      className="logo-dropdown"
                    >
                      <option value="">Selecciona una empresa</option>
                      {logos.map((logo, index) => (
                        <option key={index} value={logo.url}>
                          {logo.nombre}
                        </option>
                      ))}
                    </select>

                  <label htmlFor="upload-logo" className="upload-button">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="black"
                      className="upload-icon"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5V19a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 19v-2.5M16.5 12l-4.5-4.5m0 0L7.5 12m4.5-4.5V19"
                      />
                    </svg>
                  </label>
                  <input
                    type="file"
                    id="upload-logo"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleCustomLogoUpload}
                  />
                </div>
              )}
            </td>
          </tr>

          <Modal
            isOpen={isAreaModalOpen}
            onRequestClose={handleAreaModalClose}
            className="modal-container"
          >
            <h2>Eliminar Áreas</h2>
            <p>Selecciona las áreas que deseas eliminar:</p>

            {/* Lista de áreas con checkboxes */}
            <div className="area-selection-list">
              {areas.length > 0 ? (
                areas.map((area) => (
                  <label key={area.nombre} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={area.nombre}
                      checked={areasSeleccionadasParaBorrar.includes(
                        area.nombre,
                      )}
                      onChange={handleAreaSelectionChange}
                    />
                    {area.nombre}
                  </label>
                ))
              ) : (
                <p>No hay áreas disponibles.</p>
              )}
            </div>

            {/* Botones de acción */}
            <div className="modal-buttons">
              <button
                onClick={handleDeleteSelectedAreas}
                className="confirm-button"
              >
                Confirmar Eliminación
              </button>
              <button onClick={handleAreaModalClose} className="cancel-button">
                Cancelar
              </button>
            </div>
          </Modal>

          <Modal
            isOpen={isFolderModalOpen}
            onRequestClose={closeFolderModal}
            contentLabel="Seleccionar Empresa y Norma"
            className="folder-modal"
            overlayClassName="folder-modal-overlay"
          >
            {/* Si aún no se ha seleccionado la empresa, mostramos la lista de empresas */}
            {!selectedEmpresaId && (
              <>
                <h2>Selecciona una Empresa</h2>
                <div className="folder-selection">
                  <h3>Empresas Existentes:</h3>
                  {folders.length > 0 ? (
                    <ul>
                      {folders.map((empresa) => (
                        <li key={empresa.id}>
                          <label>
                            <input
                              type="radio"
                              name="selectedEmpresa"
                              value={empresa.id}
                              checked={selectedEmpresaId === empresa.id}
                              onChange={() => handleSelectEmpresa(empresa.id)}
                            />
                            {empresa.nombre}
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hay empresas existentes.</p>
                  )}
                </div>
                <div className="modal-buttons">
                  <button
                    onClick={() => {
                      if (selectedEmpresaId) {
                        // Se cargan las normas, ya se hizo en handleSelectEmpresa
                        // Ahora el modal cambiará a mostrar la lista de normas
                      } else {
                        alert("Por favor, selecciona una empresa.");
                      }
                    }}
                    className="next-button"
                  >
                    Siguiente
                  </button>
                  <button onClick={closeFolderModal} className="cancel-button">
                    Cancelar
                  </button>
                </div>
              </>
            )}

            {/* Si se ha seleccionado una empresa, mostramos la lista de normas para esa empresa */}
            {selectedEmpresaId && (
              <>
                <h2>Selecciona una Norma</h2>
                <div className="folder-selection">
                  <h3>Normas Existentes:</h3>
                  {normas.length > 0 ? (
                    <ul>
                      {normas.map((norma) => (
                        <li key={norma.id}>
                          <label>
                            <input
                              type="radio"
                              name="selectedNorma"
                              value={norma.id}
                              checked={selectedNormaId === norma.id}
                              onChange={() => handleSelectNorma(norma.id)}
                            />
                            {norma.nombre}
                          </label>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No hay normas existentes para esta empresa.</p>
                  )}
                </div>
                <div className="modal-buttons">
                  <button
                    onClick={() => {
                      if (selectedNormaId) {
                        // Llamamos a la función de guardado o actualización usando ambos IDs
                        if (isEditing) {
                          updateTable(selectedEmpresaId, selectedNormaId);
                        }
                        closeFolderModal();
                      } else {
                        alert("Por favor, selecciona una norma.");
                      }
                    }}
                    className="confirm-button"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => {
                      // Permite volver atrás para elegir otra empresa
                      setSelectedEmpresaId("");
                      setSelectedNormaId("");
                      setNormas([]);
                    }}
                    className="back-button"
                  >
                    Volver a Empresas
                  </button>
                </div>
              </>
            )}
          </Modal>

          <tr>
            <td className="no-border-cell" colSpan="3">
              <label
                htmlFor="descripcion-actividad"
                className="titulo-descripcion"
              >
                Puestos:
              </label>

              <div className="puesto-con-botones">
                <select
                  id="puesto"
                  value={puestoSeleccionado}
                  onChange={handlePuestoChange}
                >
                  <option value="">Seleccione un puesto</option>
                  {puestos.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              {!hideButtons && (
                <>
                  <button
                    className="btn-agregar"
                    onClick={handleAddPuestoClick}
                  >
                    Agregar
                  </button>
                  <button
                    className="btn-borrar"
                    onClick={handleDeletePuestoClick}
                  >
                    Borrar
                  </button>
                </>
              )}

             {/* Área de descripción de actividad */}
<div className="contenedor-descripcion">
  <label
    htmlFor="descripcion-actividad"
    className="titulo-descripcion"
  >
    Descripción de la actividad:
  </label>
  <textarea
    id="descripcion-actividad-1"
    name="descripcion-actividad-1"
    cols="50"
    className="textarea-descripcion"
    placeholder="Escribe aquí la descripción de la actividad "
    value={descripcionActividad1}
    onChange={(e) => {
      setDescripcionActividad1(e.target.value);
      autoResizeTextarea(e);
    }}
    rows={3} // Altura mínima inicial
    style={{ resize: "none", overflow: "hidden" }}
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
                          checked={puestosSeleccionadosParaBorrar.includes(
                            puesto,
                          )}
                        />
                        <label>{puesto}</label>
                      </div>
                    ))
                  ) : (
                    <p>No hay puestos disponibles para borrar</p>
                  )}
                </div>

                <button onClick={handleDeleteSelectedPuestos}>
                  Borrar seleccionados
                </button>
                <button onClick={handleModalClose}>Cerrar</button>
              </div>
            </Modal>

            <td
              className="header-cell"
              colSpan="3"
              style={{ backgroundColor: "#808b96", padding: "10px" }}
            >
              <div className="body-parts-title">
                Principales partes del cuerpo expuestas al riesgo:
              </div>

              <table className="body-parts-table">
                <tbody>
                  <tr>
                    <td className="risk-label-cell">Cabeza y Oídos</td>
                    <td
                      className="risk-mark-cell"
                      onClick={() => toggleBodyPart("Cabeza y Oídos")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      {bodyPartsSelected["Cabeza y Oídos"] ? "X" : ""}
                    </td>
                    <td className="risk-label-cell">Tronco</td>
                    <td
                      className="risk-mark-cell"
                      onClick={() => toggleBodyPart("Tronco")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      {bodyPartsSelected["Tronco"] ? "X" : ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="risk-label-cell">Ojos y Cara</td>
                    <td
                      className="risk-mark-cell"
                      onClick={() => toggleBodyPart("Ojos y Cara")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      {bodyPartsSelected["Ojos y Cara"] ? "X" : ""}
                    </td>
                    <td className="risk-label-cell">Sistema respiratorio</td>
                    <td
                      className="risk-mark-cell"
                      onClick={() => toggleBodyPart("Sistema respiratorio")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      {bodyPartsSelected["Sistema respiratorio"] ? "X" : ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="risk-label-cell">Brazos y Manos</td>
                    <td
                      className="risk-mark-cell"
                      onClick={() => toggleBodyPart("Brazos y Manos")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      {bodyPartsSelected["Brazos y Manos"] ? "X" : ""}
                    </td>
                    <td className="risk-label-cell">Extremidades inferiores</td>
                    <td
                      className="risk-mark-cell"
                      onClick={() => toggleBodyPart("Extremidades inferiores")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      {bodyPartsSelected["Extremidades inferiores"] ? "X" : ""}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            <td className="header-td" colSpan="3">
              <div className="additional-data-title">
                Datos adicionales
                <button
                  className="btn-icon btn-agregar"
                  onClick={handleAddAreaClick}
                  title="Agregar"
                >
                  <svg
                    className="button-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </button>
                <button
                  className="btn-icon btn-borrar"
                  onClick={handleDeleteAreaClick}
                  title="Borrar"
                >
                  <svg
                    className="button-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M9 6v12M15 6v12M19 6l-1 14H6L5 6" />
                  </svg>
                </button>
              </div>

              <table className="details-table">
                <tbody>
                  {/* Fila de Empresa */}
                  <tr>
                    <td className="label-cell">Empresa:</td>
                    <td className="input-cell" colSpan="2">
                      <select
                        id="empresa"
                        value={selectedEmpresaId}
                        onChange={handleEmpresaChange}
                      >
                        <option value="">Seleccione una empresa</option>
                        {empresas.map((empresa) => (
                          <option key={empresa.id} value={empresa.id}>
                            {empresa.nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>

                  {/* Fila de Área */}
                  <tr>
                    <td className="label-cell">Área:</td>
                    <td className="input-cell">
                      <div className="cell-container">
                        <select
                          id="area"
                          value={areaSeleccionada}
                          onChange={handleAreaChange}
                        >
                          {areas.length > 0 ? (
                            areas.map((area) => (
                              <option key={area.id} value={area.nombre}>
                                {area.nombre}
                              </option>
                            ))
                          ) : (
                            <option value="">Cargando áreas...</option>
                          )}
                        </select>
                      </div>
                    </td>
                  </tr>

                  {/* Resto de tu tabla (modal de borrar áreas, fecha de inspección, etc.) */}
                  <tr>
                    <td className="label-cell">Fecha de inspección:</td>
                    <td colSpan="2" className="input-cell">
                    <input
  type="date"
  id="fechaInspeccion"
  value={fecha}
  onChange={(e) => setFecha(e.target.value)}
  className="date-input"
/>

                    </td>
                  </tr>
                  <tr>
                    <td className="label-cell">Tiempo de exposición:</td>
                    <td colSpan="2" className="input-cell">
                      <input
                        type="text"
                        id="tiempoExposicion"
                        className="large-input"
                        placeholder="Ingrese tiempo en horas (e.g., 8hrs)"
                        value={tiempoExposicion}
                        onChange={(e) => setTiempoExposicion(e.target.value)}
                      />
                    </td>
                  </tr>
                  {/* ...y así sucesivamente */}
                </tbody>
              </table>
            </td>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td colSpan="3" className="left-section">
              <div className="text1">Identificación de peligros</div>
              <ul className="hazard-list">
                {hazardOrder.map((hazard) => (
                  <li key={hazard} className="hazard-item">
                    <span>{hazard}</span>
                    <label className="hazard-checkbox">
                      <input
                        type="checkbox"
                        name={hazard}
                        checked={hazards[hazard]}
                        onChange={handleCheckboxChange} // <-- Añade esta línea
                      />
                    </label>
                  </li>
                ))}
              </ul>
            </td>

            <td
              colSpan="2"
              className="right-section right-aligned"
              style={{ backgroundColor: "white" }}
            >
              <div className="text1">
                Equipo utilizado
                <br />
              </div>
              <div className="section-content">
                <select
                  value={selectedOptionEquipoUtilizado}
                  onChange={handleOptionChangeEquipoUtilizado}
                  className="large-text-dropdown"
                >
                  <option value="">Selecciona la extremidad afectada</option>
                  <option value="option1">Cabeza</option>
                  <option value="option2">Tronco</option>
                  <option value="option3">Pies</option>
                  <option value="option4">Brazos</option>
                  <option value="option5">Cabeza y Tronco</option>
                  <option value="option6">Brazos y Pies</option>
                  <option value="option7">Cabeza y Pies</option>
                  <option value="option8">Cabeza y Brazos</option>
                  <option value="option9">Tronco y Brazos</option>
                  <option value="option10">Tronco y Pies</option>
                  <option value="option11">Cabeza, Tronco y Brazos</option>
                  <option value="option12">Cabeza, Tronco y Pies</option>
                  <option value="option13">Cabeza, Brazos y Pies</option>
                  <option value="option14">Tronco, Brazos y Pies</option>
                  <option value="option15">Todas las Extremidades</option>
                </select>

                {selectedOptionEquipoUtilizado &&
                  optionImages[selectedOptionEquipoUtilizado] && (
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
            {/* Menú desplegable para seleccionar equipo de protección sugerido */}
            <td colSpan="2" className="right-section right-aligned">
              <div className="text1">
                Equipo de protección personal sugerido
              </div>
              <div className="body-and-hazards-container">
                <select
                  value={selectedOptionProteccionSugerida}
                  onChange={handleOptionChangeProteccionSugerida}
                  className="large-text-dropdown"
                >
                  <option value="">Selecciona la extremidad afectada</option>
                  <option value="option1">Cabeza</option>
                  <option value="option2">Tronco</option>
                  <option value="option3">Pies</option>
                  <option value="option4">Brazos</option>
                  <option value="option5">Cabeza y Tronco</option>
                  <option value="option6">Brazos y Pies</option>
                  <option value="option7">Cabeza y Pies</option>
                  <option value="option8">Cabeza y Brazos</option>
                  <option value="option9">Tronco y Brazos</option>
                  <option value="option10">Tronco y Pies</option>
                  <option value="option11">Cabeza, Tronco y Brazos</option>
                  <option value="option12">Cabeza, Tronco y Pies</option>
                  <option value="option13">Cabeza, Brazos y Pies</option>
                  <option value="option14">Tronco, Brazos y Pies</option>
                  <option value="option15">Todas las Extremidades</option>
                </select>

                {selectedOptionProteccionSugerida &&
                  optionImages[selectedOptionProteccionSugerida] && (
                    <div className="protection-image-container">
                      <img
                        src={optionImages[selectedOptionProteccionSugerida]}
                        alt={`Equipo de protección para ${selectedOptionProteccionSugerida}`}
                        className="protection-image2"
                      />
                    </div>
                  )}
              </div>
            </td>

            <td colSpan="2" className="epp-component-right-section">
              {/* Título de EPP Recomendado + Menú para "Seleccione EPP" */}
              <div className="epp-component-title-select">
                EPP Recomendado
                <select
                  className="custom-select epp-select"
                  onChange={handleAddEPPImage}
                >
                  <option value="">Seleccione EPP</option>
                  {eppImagesList
                    .map((img) => ({ image: img, name: eppNames[img] || img }))
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((obj, i) => (
                      <option key={i} value={obj.image}>
                        {obj.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Contenedor para las imágenes de EPP */}
              <div className="epp-component-hazard-images epp-recommended-box">
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
                  <div className="epp-component-no-epp">
                    No hay EPP seleccionado
                  </div>
                )}
              </div>

              {/* NO MOVER nada de aquí en adelante */}
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
                    className="epp-dropdown large-text-dropdown"
                  >
                    <option value="" disabled>
                      Selecciona el equipo
                    </option>
                    {Object.keys(eppOptions).map((option, index) => (
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
                      className="large-text-dropdown"
                    >
                      <option value="" disabled>
                        Selecciona el tipo
                      </option>
                      {eppOptions[selectedMainOption]?.map((subOption, idx) => (
                        <option key={idx} value={subOption}>
                          {subOption}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="epp-selection-list-container">
                  {selectionList.length > 0 ? (
                    selectionList
                      .reduce((rows, key, index) => {
                        // Agrupa elementos en pares
                        if (index % 2 === 0) rows.push([selectionList[index]]);
                        else rows[rows.length - 1].push(selectionList[index]);
                        return rows;
                      }, [])
                      .map((row, rowIndex) => (
                        <div key={rowIndex} className="epp-selection-row">
                          {row.map((selection, idx) => (
                            <div key={idx} className="epp-selection-item">
                              {selection.slice(selection.indexOf("-") + 2)}
                              <button
                                className="delete-button"
                                onClick={() =>
                                  handleDeleteSelection(
                                    selectionList.indexOf(selection),
                                  )
                                }
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
                            </div>
                          ))}
                        </div>
                      ))
                  ) : (
                    <p className="no-selection-message">No hay selecciones</p>
                  )}
                </div>
              </div>
            </td>
          </tr>
          <td colSpan={8}>
            <span></span>
            <textarea
              id="descripcion-actividad-2"
              name="descripcion-actividad-2"
              cols="50"
              className="textarea-descripcion"
              placeholder="Escribe aquí la descripción de EPP"
              value={descripcionActividad2}
              onChange={(e) => setDescripcionActividad2(e.target.value)}
            ></textarea>
          </td>
          <tr>
            <td colSpan="7" className="right-aligned">
              <div className="banana-title">
                Evaluación de riesgo de trabajo
              </div>
              <table className="inner-table">
                <thead>
                  <tr>
                    <th className="apple-header">Consecuencia</th>
                    <th
                      className="apple-header"
                      style={{ backgroundColor: "#808b96" }}
                    >
                      Exposición
                    </th>
                    <th
                      className="apple-header"
                      colSpan="4"
                      style={{ width: "45%", color: "black" }}
                    >
                      Probabilidad
                    </th>
                    <th className="apple-header">Magnitud del Riesgo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <select
                        value={consequence}
                        onChange={handleConsequenceChange}
                        className="cherry-select large-text-dropdown"
                      >
                        <option value={100}>Catástrofe</option>
                        <option value={50}>Varias muertes</option>
                        <option value={25}>Muerte</option>
                        <option value={15}>Lesiones graves</option>
                        <option value={5}>Lesiones con baja</option>
                        <option value={1}>Lesiones sin baja</option>
                      </select>
                      <div className="grape-value">Valor: {consequence}</div>
                    </td>
                    <td>
                      <select
                        value={exposure}
                        onChange={handleExposureChange}
                        className="cherry-select large-text-dropdown"
                      >
                        <option value={10}>Continuamente</option>
                        <option value={6}>Frecuentemente</option>
                        <option value={3}>Ocasionalmente</option>
                        <option value={2}>Irregularmente</option>
                        <option value={1}>Raramente</option>
                        <option value={0.5}>Remotamente</option>
                      </select>
                      <div className="grape-value">Valor: {exposure}</div>
                    </td>
                    <td colSpan="4" style={{ width: "45%" }}>
                      <select
                        value={probability}
                        onChange={handleProbabilityChange}
                        className="cherry-select large-text-dropdown"
                        style={{ width: "100%", whiteSpace: "normal" }}
                      >
                        <option value={10} style={{ whiteSpace: "normal" }}>
                          Es el resultado más probable y esperado
                        </option>
                        <option value={6} style={{ whiteSpace: "normal" }}>
                          Es completamente posible, no será nada extraño
                        </option>
                        <option value={3} style={{ whiteSpace: "normal" }}>
                          Sería una secuencia o coincidencia rara pero posible,
                          ha ocurrido
                        </option>
                        <option value={1} style={{ whiteSpace: "normal" }}>
                          Coincidencia muy rara, pero se sabe que ha ocurrido
                        </option>
                        <option value={0.5} style={{ whiteSpace: "normal" }}>
                          Coincidencia extremadamente remota pero concebible
                        </option>
                        <option value={0.1} style={{ whiteSpace: "normal" }}>
                          Coincidencia prácticamente imposible, jamás ocurrió
                        </option>
                      </select>
                      <div className="grape-value">Valor: {probability}</div>
                    </td>

                    <td
                      style={{
                        backgroundColor: getRiskColor(calculateRisk()),
                        color:
                          getRiskColor(calculateRisk()) === "yellow"
                            ? "black"
                            : "white",
                        fontSize: "24px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {calculateRisk().toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>

            <td colSpan="3" className="right-aligned">
              <div className="risk-title">
                Clasificación de Magnitud de Riesgo
              </div>

              <table className="risk-magnitude-table">
                <tbody>
                  <tr>
                    <td className="risk-label-cell">Magnitud del Riesgo:</td>
                    <td
                      className="risk-value-cell"
                      style={{
                        backgroundColor: riskColor,
                        color: riskColor === "yellow" ? "black" : "white",
                      }}
                    >
                      {risk.toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td className="risk-label-cell">Clasificación:</td>
                    <td
                      className={`risk-classification-cell ${riskColor === "yellow" ? "yellow-bg" : ""}`}
                      style={{ backgroundColor: riskColor }}
                    >
                      {risk > 400
                        ? "Muy Alto"
                        : risk > 200
                          ? "Alto"
                          : risk > 70
                            ? "Notable"
                            : risk > 20
                              ? "Moderado"
                              : "Bajo o Aceptable"}
                    </td>
                  </tr>
                  <tr>
                    <td className="risk-label-cell">Acción:</td>
                    <td
                      className={`risk-action-cell ${riskColor === "yellow" ? "yellow-bg" : ""}`}
                      style={{ backgroundColor: riskColor }}
                    >
                      {risk > 400
                        ? "Detención inmediata"
                        : risk > 200
                          ? "Corrección inmediata"
                          : risk > 70
                            ? "Corrección urgente"
                            : risk > 20
                              ? "Requiere atención"
                              : "Tolerable"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="button-container">
        <button onClick={downloadImage} className="download-button">
          Descargar PDF
        </button>

        <button onClick={updateTable} className="save-button">
          Actualizar Tabla
        </button>

        <button
          onClick={handleReset}
          className={`reset-button ${hideButtons ? "hidden-buttons" : ""}`}
        >
          Reiniciar Tabla
        </button>
      </div>
    </div>
  );
};

export default RiskAssessmentTableEditor;
