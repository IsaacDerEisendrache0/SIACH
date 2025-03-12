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
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase"; // Importar la configuración de Firebase
import logo from "../logos/logo.png";
import maxion from "../logos/maxion.jpeg";
import safran from "../logos/safran.jpeg";
import { getAuth } from "firebase/auth";

const RiskAssessmentTable = () => {
  const [areas, setAreas] = useState([]);

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

  const bodyParts = {
    "Caídas de Altura": [
      "Cabeza y Oídos",
      "Brazos y Manos",
      "Tronco",
      "Extremidades inferiores",
    ],
    "Exposición a Temperaturas": ["Ojos y Cara", "Brazos y Manos", "Tronco"],
    "Exposición a Electricidad Estática": ["Brazos y Manos", "Tronco"],
    "Exposición a Sustancias Químicas": [
      "Cabeza y Oídos",
      "Ojos y Cara",
      "Brazos y Manos",
      "Tronco",
      "Sistema respiratorio",
      "Extremidades inferiores",
    ],
    "Exposición a Radiaciones": [
      "Cabeza y Oídos",
      "Ojos y Cara",
      "Tronco",
      "Extremidades inferiores",
    ],
    "Exposición agentes Biológicos": [
      "Ojos y Cara",
      "Tronco",
      "Sistema respiratorio",
      "Extremidades inferiores",
    ],
    "Exposición a Ruido": ["Cabeza y Oídos"],
    "Exposición a Vibraciones": [
      "Brazos y Manos",
      "Tronco",
      "Extremidades inferiores",
    ],
    "Superficies cortantes": [
      "Ojos y Cara",
      "Brazos y Manos",
      "Extremidades inferiores",
    ],
    "Caídas a nivel o desnivel": [
      "Cabeza y Oídos",
      "Ojos y Cara",
      "Brazos y Manos",
      "Tronco",
      "Extremidades inferiores",
    ],
    "Calentamiento de materia prima, subproducto o producto": [
      "Ojos y Cara",
      "Brazos y Manos",
      "Tronco",
      "Extremidades inferiores",
    ],
    "Protección de material o herramienta": [
      "Ojos y Cara",
      "Brazos y Manos",
      "Tronco",
    ],
  };

  const protectionImages = {
    "Caídas de Altura": ["/images/10.png", "/images/34.png", "/images/4.png"], // Reemplaza con la ruta real de la imagen
    "Exposición a Temperaturas": [
      "/images/6.png",
      "/images/21.png",
      "/images/14.png",
      "/images/1.png",
      "/images/36.png",
    ],
    "Exposición a Electricidad Estática": [
      "/images/6.png",
      "/images/4.png",
      "/images/9.png",
      "/images/10.png",
    ],
    "Exposición a Sustancias Químicas": [
      "/images/7.png",
      "/images/13.png",
      "/images/6.png",
      "/images/17.png",
    ],
    "Exposición a Radiaciones": ["/images/16.png"],
    "Exposición agentes Biológicos": [
      "/images/18.png",
      "/images/16.png",
      "/images/35.png",
    ],
    "Exposición a Ruido": ["/images/19.png", "/images/5.png"],
    "Exposición a Vibraciones": [
      "/images/19.png",
      "/images/6.png",
      "/images/4.png",
    ],
    "Superficies cortantes": [
      "/images/6.png",
      "/images/1.png",
      "/images/21.png",
      "/images/14.png",
    ],
    "Caídas a nivel o desnivel": ["/images/4.png", "/images/34.png"],
    "Calentamiento de materia prima, subproducto o producto": [
      "/images/6.png",
      "/images/15.png",
      "/images/9.png",
      "/images/4.png",
      "/images/21.png",
    ],
    "Protección de material o herramienta": [
      "/images/7.png",
      "/images/1.png",
      "/images/21.png",
      "/images/14.png",
      "/images/6.png",
      "/images/4.png",
      "/images/35.png",
    ],
  };

  const STORAGE_KEY = "riskAssessmentData_v1";

  // Coloca los hooks dentro del componente funcional
  const [areaSeleccionada, setAreaSeleccionada] = useState("");
  const [puestoSeleccionado, setPuestoSeleccionado] = useState("");
  const [puestos, setPuestos] = useState([]); // Se poblará con el campo "puestos" del área seleccionada
  const [descripcionActividad1, setDescripcionActividad1] = useState("");
  const [descripcionActividad2, setDescripcionActividad2] = useState("");

  // **Estados para Carpetas y Modal**
  const [folders, setFolders] = useState([]);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [fechaActual, setFechaActual] = useState("");

  // Al cambiar de área, actualizamos el estado local (ya sin localStorage)
  const handleAreaChange = (e) => {
    const selectedName = e.target.value;
    const selectedArea = areas.find((area) => area.nombre === selectedName);
    if (selectedArea) {
      setAreaSeleccionada(selectedArea.nombre);
      setPuestos(selectedArea.puestos || []);
    } else {
      console.error("No se encontró el área seleccionada:", selectedName);
      setPuestos([]);
    }
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
    if (hazard === "Exposición a Ruido") {
      if (isChecked && protectionImages[hazard].length > 1) {
        // Abre el modal solo si hay más de una imagen asociada a "Exposición a Ruido"
        setSelectedImagesForHazard(protectionImages[hazard]);
        setHazardWithImages(hazard);
        setIsImageModalOpen(true);
      } else if (isChecked && protectionImages[hazard].length === 1) {
        // Si solo hay una imagen, la selecciona directamente
        const image = protectionImages[hazard][0];
        if (!selectedImages.includes(image)) {
          setSelectedImages((prevSelectedImages) => [
            ...prevSelectedImages,
            image,
          ]);
        }
      } else {
        // Si se deselecciona "Exposición a Ruido", elimina las imágenes asociadas
        setSelectedImages((prevSelectedImages) =>
          prevSelectedImages.filter(
            (image) => !protectionImages[hazard].includes(image),
          ),
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
          prevSelectedImages.filter(
            (image) => !protectionImages[hazard].includes(image),
          ),
        );
      }
    }
  };

  const getAffectedBodyParts = () => {
    const affectedParts = new Set();
    for (const [hazard, isChecked] of Object.entries(hazards)) {
      if (isChecked) {
        bodyParts[hazard].forEach((part) => affectedParts.add(part));
      }
    }
    return Array.from(affectedParts);
  };

  const affectedBodyParts = getAffectedBodyParts(); // Generar dinámicamente

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
  const [selectedImagesForHazard, setSelectedImagesForHazard] = useState([]); // Estado para las imágenes del peligro seleccionado
  const [isImageModalOpen, setIsImageModalOpen] = useState(false); // Estado para abrir o cerrar el modal de selección de imagen
  const [hazardWithImages, setHazardWithImages] = useState("");
  const [selectedHazardImages, setSelectedHazardImages] = useState({}); // Para almacenar las imágenes seleccionadas por peligro
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
    // Selecciona todos los botones que deben ocultarse
    const buttons = document.querySelectorAll(
      ".btn-agregar, .btn-borrar, .download-button, .save-button, .reset-button, .btn-extra",
    );

    // Oculta los botones temporalmente
    buttons.forEach((button) => button.classList.add("hidden-buttons"));

    // Selecciona la tabla principal para capturar
    const tableElement = document.querySelector(".main-table");

    // Almacena los estilos originales para restaurarlos después
    const originalWidth = tableElement.style.width;
    const originalTransform = tableElement.style.transform;
    const originalMargin = tableElement.style.margin;

    // Ajusta temporalmente el tamaño de la tabla para capturarla más amplia
    tableElement.style.width = "1500px"; // Cambia a un tamaño más grande para estirar
    tableElement.style.transform = "scale(1)"; // Asegura que no esté encogida
    tableElement.style.margin = "auto"; // Centra la tabla

    html2canvas(tableElement, {
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
      windowWidth: tableElement.scrollWidth,
      windowHeight: tableElement.scrollHeight,
      useCORS: true,
      backgroundColor: "#ffffff", // Fondo blanco explícito
      scale: 2, // Mejora la calidad
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "tabla_herramientas_manual.png";

        // Descargar la imagen
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Restaurar los estilos originales
        tableElement.style.width = originalWidth;
        tableElement.style.transform = originalTransform;
        tableElement.style.margin = originalMargin;

        // Restaurar los botones después de la captura
        buttons.forEach((button) => button.classList.remove("hidden-buttons"));
      })
      .catch((error) => {
        console.error("Error al capturar la tabla:", error);

        // Restaurar los estilos originales en caso de error
        tableElement.style.width = originalWidth;
        tableElement.style.transform = originalTransform;
        tableElement.style.margin = originalMargin;

        // Asegurarse de restaurar los botones incluso si ocurre un error
        buttons.forEach((button) => button.classList.remove("hidden-buttons"));
      });
  };

  const handleDeleteSelectedPuestos = async () => {
    if (puestosSeleccionadosParaBorrar.length === 0) {
      alert("Selecciona al menos un puesto para borrar.");
      return;
    }
    const nuevosPuestos = puestos.filter(
      (puesto) => !puestosSeleccionadosParaBorrar.includes(puesto),
    );

    setPuestos(nuevosPuestos);

    // IMPORTANTE: Actualiza localStorage
    updateLocalStoragePuestos(areaSeleccionada, nuevosPuestos);

    await updatePuestosInFirebase(nuevosPuestos);
    setPuestosSeleccionadosParaBorrar([]);
    setIsModalOpen(false);
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
    const areaSeleccionadaKey = `puestos_${areaSeleccionada}`;
    const savedPuestos = JSON.parse(localStorage.getItem(areaSeleccionadaKey));
    if (
      savedPuestos &&
      savedPuestos.length > 0 &&
      savedPuestos.includes("Puesto 1") &&
      savedPuestos.includes("Puesto 2")
    ) {
      localStorage.removeItem(areaSeleccionadaKey);
      setPuestos(
        areas.find((area) => area.nombre === areaSeleccionada)?.puestos || [],
      );
    } else if (savedPuestos && savedPuestos.length > 0) {
      setPuestos(savedPuestos);
    } else {
      const puestosIniciales =
        areas.find((area) => area.nombre === areaSeleccionada)?.puestos || [];
      setPuestos(puestosIniciales);
      localStorage.setItem(
        areaSeleccionadaKey,
        JSON.stringify(puestosIniciales),
      );
    }
  }, [areaSeleccionada, areas]);

  const updateLocalStoragePuestos = (area, newPuestos) => {
    const key = `puestos_${area}`;
    localStorage.setItem(key, JSON.stringify(newPuestos));
  };

  // Función para agregar un nuevo puesto y guardarlo en Firebase
  const handleAddPuestoClick = async () => {
    const nuevoPuesto = prompt("Ingrese el nuevo puesto:");
    if (nuevoPuesto && nuevoPuesto.trim() !== "") {
      const newPuesto = nuevoPuesto.trim();
      const updatedPuestos = [...puestos, newPuesto];
      setPuestos(updatedPuestos);
      updateLocalStoragePuestos(updatedPuestos);
      await updatePuestosInFirebase(updatedPuestos);
      setPuestoSeleccionado("");
    }
  };

  // Función auxiliar: actualiza los puestos del área seleccionada en Firebase
  const updatePuestosInFirebase = async (newPuestos) => {
    const selectedAreaObj = areas.find(
      (area) => area.nombre === areaSeleccionada,
    );
    if (selectedAreaObj && selectedAreaObj.id) {
      try {
        await updateDoc(doc(db, "areas", selectedAreaObj.id), {
          puestos: newPuestos,
        });
        console.log("Puestos actualizados en Firebase");
      } catch (error) {
        console.error("Error actualizando puestos en Firebase:", error);
      }
    } else {
      console.error(
        "No se encontró el área en Firebase para actualizar puestos.",
      );
    }
  };

  const handleDeletePuestoClick = () => {
    setIsModalOpen(true);
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
      selectedMainOption,
      nombreEmpresa: empresaSeleccionada,
      selectionList,
    };

    try {
      // Guardar la tabla en la subcolección "tablas" de la norma seleccionada dentro de la empresa
      await addDoc(
        collection(db, "empresas", empresaId, "normas", normaId, "tablas"),
        tableData,
      );
      alert("Tabla guardada con éxito en Firestore.");

      // Actualizar el resumen correspondiente si es necesario (este bloque se mantiene igual)
      const resumenRef = doc(
        db,
        "resumen_17",
        empresaSeleccionada,
        "areas",
        areaSeleccionada,
      );
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

      // AGREGA directamente el nuevo puesto
      newResumenData.puestos = [...newResumenData.puestos, puestoRiesgo];

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

  const updateTable = async (empresaId, normaId) => {
    const updatedTable = {
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
      selectedMainOption, // Equipo principal
      tiempoExposicion,
      norma: "N-017",
      fecha,
      hora,
      nombreEmpresa: empresaSeleccionada, // Nombre de la empresa
    };

    try {
      if (!tableId) {
        throw new Error("No se encontró el ID de la tabla para actualizar.");
      }
      // Actualizar la tabla en la subcolección "tablas" de la norma seleccionada
      const docRef = doc(
        db,
        "empresas",
        empresaId,
        "normas",
        normaId,
        "tablas",
        tableId,
      );
      await updateDoc(docRef, updatedTable);

      // Actualizar el resumen (este bloque se mantiene igual)
      const resumenRef = doc(
        db,
        "resumen_17",
        empresaSeleccionada,
        "areas",
        areaSeleccionada,
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

      console.log("Datos del área antes de actualizar:", areaData);

      const updatedPuestos = [
        ...areaData.puestos.filter((p) => p.nombre !== puestoSeleccionado),
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

      console.log("Puestos actualizados:", updatedPuestos);

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
        { tolerable: 0, moderado: 0, notable: 0, elevado: 0, grave: 0 },
      );

      console.log("Nuevos totales calculados:", newTotals);

      await setDoc(resumenRef, {
        ...areaData,
        puestos: updatedPuestos,
        ...newTotals,
      });

      alert("Tabla actualizada con éxito en Firestore.");
    } catch (error) {
      console.error("Error al actualizar en Firestore:", error);
      alert("Error al actualizar la tabla.");
    }
  };

  const [fecha, setFecha] = useState(new Date().toLocaleDateString()); // Estado para la fecha
  const [tiempoExposicion, setTiempoExposicion] = useState("8hrs");
  const [hora, setHora] = useState(new Date().toLocaleTimeString());
  const [tableId, setTableId] = useState(null);

  useEffect(() => {
    const tableToEdit = JSON.parse(localStorage.getItem("tableToEdit"));
    if (tableToEdit) {
      setAreaSeleccionada(tableToEdit.areaSeleccionada);
      setPuestoSeleccionado(tableToEdit.puestoSeleccionado);
      setHazards(tableToEdit.hazards);
      setConsequence(tableToEdit.consequence);
      setExposure(tableToEdit.exposure);
      setProbability(tableToEdit.probability);
      setSelectedImages(tableToEdit.selectedImages || []);
      setDescripcionActividad1(tableToEdit.descripcionActividad1 || "");
      setSelectedOptionEquipoUtilizado(
        tableToEdit.selectedOptionEquipoUtilizado || "",
      );
      setSelectedOptionProteccionSugerida(
        tableToEdit.selectedOptionProteccionSugerida || "",
      );
      setTiempoExposicion(tableToEdit.tiempoExposicion || "");
      setFecha(tableToEdit.fecha); // Establecer la fecha de la tabla en edición
      setHora(tableToEdit.hora); // Establecer la hora de creación
      setTableId(tableToEdit.id); // Guardar el ID del documento para actualizar
      localStorage.removeItem("tableToEdit");
      setSelectedMainOption(tableToEdit.selectedMainOption || "");
      setEmpresaSeleccionada(tableToEdit.nombreEmpresa || "");
      setSelectionList(tableToEdit.selectionList || []); // <--- Aquí
    }
  }, []);

  const handleImageRemove = (imageToRemove) => {
    setSelectedImages((prevSelectedImages) =>
      prevSelectedImages.filter((image) => image !== imageToRemove),
    );
  };

  // Función para agregar un área nueva a Firebase (en lugar de usar localStorage)
  const handleAddAreaClick = async () => {
    const nuevaArea = prompt("Ingrese el nombre de la nueva área:");
    if (nuevaArea && nuevaArea.trim() !== "") {
      try {
        // Agrega la nueva área a la colección "areas"
        const docRef = await addDoc(collection(db, "areas"), {
          nombre: nuevaArea.trim(),
          puestos: [], // Inicialmente sin puestos
        });
        // Actualiza el estado agregando el nuevo documento
        const newArea = {
          id: docRef.id,
          nombre: nuevaArea.trim(),
          puestos: [],
        };
        setAreas((prevAreas) => [...prevAreas, newArea]);
        setAreaSeleccionada(newArea.nombre);
      } catch (error) {
        console.error("Error al agregar el área a Firebase:", error);
      }
    }
  };

  const [selectedMainOption, setSelectedMainOption] = useState(""); // Estado para la opción principal
  const [selectedSubOption, setSelectedSubOption] = useState(""); // Estado para la subcategoría seleccionada
  const [showSubDropdown, setShowSubDropdown] = useState(false); // Estado para mostrar u ocultar el segundo menú
  const [selectionList, setSelectionList] = useState([]); // Lista acumulativa de selecciones

  // Opciones principales y sus subcategorías
  const eppOptions = {
    Casco: [
      "Casco Dielectrico",
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
      "Gafas con Filtro UV",
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
    "Equipo de Audición": ["Conchas Acústicas", "tapones Auditivos"],
    Respiradores: [
      "Respirador contra Gases y Vapores",
      "Respirador contra Partículas",
    ],
    "Protección Facial": [
      "Careta para Soldador",
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
      "Equipo para Brigadista contra Incendio",
    ],
    Mangas: ["Mangas"],
    Arnés: ["Arnés"],
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
    if (
      selectedImages.includes("/images/10.png") ||
      selectedImages.includes("/images/10.jpg")
    ) {
      newAutoSelectedOptions.push("Casco");
    }
    if (
      selectedImages.includes("/images/4.png") ||
      selectedImages.includes("/images/4.jpg")
    ) {
      newAutoSelectedOptions.push("Botas");
    }
    if (
      selectedImages.includes("/images/6.png") ||
      selectedImages.includes("/images/6.jpg")
    ) {
      newAutoSelectedOptions.push("Guantes");
    }
    if (
      selectedImages.includes("/images/3.png") ||
      selectedImages.includes("/images/3.jpg") ||
      selectedImages.includes("/images/7.png") ||
      selectedImages.includes("/images/7.jpg")
    ) {
      newAutoSelectedOptions.push("Gafas de Protección");
    }
    if (
      selectedImages.includes("/images/1.png") ||
      selectedImages.includes("/images/1.jpg") ||
      selectedImages.includes("/images/9.png") ||
      selectedImages.includes("/images/9.jpg")
    ) {
      newAutoSelectedOptions.push("Mandil");
    }
    if (
      selectedImages.includes("/images/34.png") ||
      selectedImages.includes("/images/34.jpg")
    ) {
      newAutoSelectedOptions.push("Arnés");
    }
    if (
      selectedImages.includes("/images/21.png") ||
      selectedImages.includes("/images/21.jpg")
    ) {
      newAutoSelectedOptions.push("Mangas");
    }

    if (
      selectedImages.includes("/images/14.png") ||
      selectedImages.includes("/images/14.jpg") ||
      selectedImages.includes("/images/15.png") ||
      selectedImages.includes("/images/15.jpg")
    ) {
      newAutoSelectedOptions.push("Protección Facial");
    }

    if (
      selectedImages.includes("/images/19.png") ||
      selectedImages.includes("/images/19.jpg") ||
      selectedImages.includes("/images/5.png") ||
      selectedImages.includes("/images/5.jpg")
    ) {
      newAutoSelectedOptions.push("Equipo de Audición");
    }

    if (
      selectedImages.includes("/images/35.png") ||
      selectedImages.includes("/images/35.jpg") ||
      selectedImages.includes("/images/17.png") ||
      selectedImages.includes("/images/17.jpg")
    ) {
      newAutoSelectedOptions.push("Respiradores");
    }

    if (
      selectedImages.includes("/images/16.png") ||
      selectedImages.includes("/images/16.jpg") ||
      selectedImages.includes("/images/13.png") ||
      selectedImages.includes("/images/13.jpg") ||
      selectedImages.includes("/images/36.png") ||
      selectedImages.includes("/images/36.jpg")
    ) {
      newAutoSelectedOptions.push("Ropa de Protección");
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
    { nombre: "Safran", url: safran },
    { nombre: "Maxion", url: maxion },
  ];

  // Estado para almacenar el logo seleccionado
  const [logoSeleccionado, setLogoSeleccionado] = useState(() => {
    return localStorage.getItem("logoSeleccionado") || null;
  });

  // Persistir el logo en localStorage
  useEffect(() => {
    if (logoSeleccionado) {
      localStorage.setItem("logoSeleccionado", logoSeleccionado);
    } else {
      localStorage.removeItem("logoSeleccionado");
    }
  }, [logoSeleccionado]);

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
      // Si hay más de un dedo tocando la pantalla,
      // lo más probable es que sea un pinch-zoom y NO un drag horizontal.
      if (e.touches.length > 1) return;

      // Ahora sí, si solo hay 1 dedo, hacemos el drag
      if (!isDragging) return;
      e.preventDefault(); // Se evita scroll del body, pero no pinch
      const x = e.touches[0].pageX - tableContainer.offsetLeft;
      const walk = (x - startX) * 2;
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
    setRemovedParts(
      (prev) =>
        prev.includes(part)
          ? prev.filter((p) => p !== part) // Si ya estaba en removedParts, se elimina (se vuelve a mostrar)
          : [...prev, part], // Si no estaba, se agrega (se oculta)
    );
  };

  // Determinar si mostrar "X" (si está en affectedBodyParts y no en removedParts)
  const shouldShowX = (part) => {
    const isAutoSelected = affectedBodyParts.includes(part);
    const isManuallyRemoved = removedParts.includes(part);

    return isAutoSelected !== isManuallyRemoved;
  };

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);

      // Restaurar cada campo (valida si existe en el objeto)
      if (parsed.areaSeleccionada) setAreaSeleccionada(parsed.areaSeleccionada);
      if (parsed.puestoSeleccionado)
        setPuestoSeleccionado(parsed.puestoSeleccionado);

      if (parsed.descripcionActividad1)
        setDescripcionActividad1(parsed.descripcionActividad1);
      if (parsed.descripcionActividad2)
        setDescripcionActividad2(parsed.descripcionActividad2);

      if (parsed.hazards) setHazards(parsed.hazards);
      if (parsed.removedParts) setRemovedParts(parsed.removedParts);

      if (parsed.consequence) setConsequence(parsed.consequence);
      if (parsed.exposure) setExposure(parsed.exposure);
      if (parsed.probability) setProbability(parsed.probability);

      if (parsed.selectedImages) setSelectedImages(parsed.selectedImages);
      if (parsed.selectedOptionEquipoUtilizado) {
        setSelectedOptionEquipoUtilizado(parsed.selectedOptionEquipoUtilizado);
      }
      if (parsed.selectedOptionProteccionSugerida) {
        setSelectedOptionProteccionSugerida(
          parsed.selectedOptionProteccionSugerida,
        );
      }
      if (parsed.selectedMainOption)
        setSelectedMainOption(parsed.selectedMainOption);
      if (parsed.selectedSubOption)
        setSelectedSubOption(parsed.selectedSubOption);
      if (parsed.selectionList) setSelectionList(parsed.selectionList);

      if (parsed.tiempoExposicion) setTiempoExposicion(parsed.tiempoExposicion);
    }
  }, []);

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
  const [selectedEmpresaId, setSelectedEmpresaId] = useState("");

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

  const handleDeleteSelectedAreas = async () => {
    if (areasSeleccionadasParaBorrar.length === 0) {
      alert("Selecciona al menos un área para eliminar.");
      return;
    }

    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar las siguientes áreas?\n${areasSeleccionadasParaBorrar.join(", ")}`,
    );
    if (!confirmDelete) return;

    // Borrar cada área de Firebase
    for (const areaName of areasSeleccionadasParaBorrar) {
      const areaToDelete = areas.find((area) => area.nombre === areaName);
      if (areaToDelete && areaToDelete.id) {
        await deleteAreaFromFirebase(areaToDelete.id);
      }
    }

    // Actualiza el estado local eliminando las áreas borradas
    setAreas((prevAreas) =>
      prevAreas.filter(
        (area) => !areasSeleccionadasParaBorrar.includes(area.nombre),
      ),
    );

    setAreasSeleccionadasParaBorrar([]);
    setIsAreaModalOpen(false);
  };

  const risk = calculateRisk();

  // Estados para el modal y selección de empresas a borrar
  const [isEmpresaModalOpen, setIsEmpresaModalOpen] = useState(false);
  const [empresasSeleccionadasParaBorrar, setEmpresasSeleccionadasParaBorrar] =
    useState([]);
  const STORAGE_KEY_EMPRESAS = "empresasList";
  const [empresas, setEmpresas] = useState(() => {
    const savedEmpresas = localStorage.getItem(STORAGE_KEY_EMPRESAS);
    return savedEmpresas
      ? JSON.parse(savedEmpresas)
      : ["Maxion", "Safran", "Soisa", "Bafar"];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EMPRESAS, JSON.stringify(empresas));
  }, [empresas]);

  // Función para abrir el modal
  const openEmpresaModal = () => {
    setIsEmpresaModalOpen(true);
  };

  // Función para cerrar el modal
  const closeEmpresaModal = () => {
    setIsEmpresaModalOpen(false);
    setEmpresasSeleccionadasParaBorrar([]);
  };

  // Manejo del cambio en la selección de checkbox
  const handleEmpresaSelectionChange = (event) => {
    const value = event.target.value;
    setEmpresasSeleccionadasParaBorrar((prev) =>
      prev.includes(value)
        ? prev.filter((empresa) => empresa !== value)
        : [...prev, value],
    );
  };

  // Función para borrar las empresas seleccionadas
  const handleDeleteSelectedEmpresas = () => {
    if (empresasSeleccionadasParaBorrar.length === 0) {
      alert("Seleccione al menos una empresa para borrar.");
      return;
    }
    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar las siguientes empresas?\n${empresasSeleccionadasParaBorrar.join(
        ", ",
      )}`,
    );
    if (confirmDelete) {
      setEmpresas(
        empresas.filter(
          (empresa) => !empresasSeleccionadasParaBorrar.includes(empresa),
        ),
      );
      // Si la empresa borrada era la seleccionada, reiniciamos el valor
      if (empresasSeleccionadasParaBorrar.includes(empresaSeleccionada)) {
        setEmpresaSeleccionada("");
      }
      closeEmpresaModal();
    }
  };

  const handleAddEmpresa = async () => {
    const nuevaEmpresa = prompt("Ingrese el nombre de la nueva empresa:");
    if (nuevaEmpresa && !empresas.includes(nuevaEmpresa)) {
      try {
        // Agrega un nuevo documento a la colección Empresas_17 con el campo "nombre"
        await addDoc(collection(db, "Empresas_17"), { nombre: nuevaEmpresa });
        // Actualiza el estado para incluir la nueva empresa
        setEmpresas((prev) => [...prev, nuevaEmpresa]);
      } catch (error) {
        console.error("Error al agregar la nueva empresa:", error);
      }
    }
  };

  // Dentro de tu componente:
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companiesRef = collection(db, "Empresas_17");
        const querySnapshot = await getDocs(companiesRef);
        // Extraemos el campo "nombre" de cada documento
        const companiesList = querySnapshot.docs.map(
          (doc) => doc.data().nombre,
        );
        setEmpresas(companiesList);
      } catch (error) {
        console.error("Error al cargar empresas desde Firebase:", error);
      }
    };

    loadCompanies();
  }, []);

  // Cargar áreas reales desde Firebase
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "areas"));
        const dbAreas = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // dbAreas debería lucir como [{ id: "12aDLx...", nombre: "...", puestos: ["..."] }, ...]
        setAreas(dbAreas);
      } catch (error) {
        console.error("Error al cargar áreas desde Firebase:", error);
      }
    };

    fetchAreas();
  }, []);

  const deleteAreaFromFirebase = async (areaId) => {
    try {
      await deleteDoc(doc(db, "areas", areaId));
      console.log("Área eliminada de Firebase");
    } catch (error) {
      console.error("Error eliminando área en Firebase:", error);
    }
  };

  const riskColor = getRiskColor(risk);

  return (
    <div class="main-table">
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
                  <select onChange={handleLogoChange} className="logo-dropdown">
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
                        } else {
                          saveTable(selectedEmpresaId, selectedNormaId);
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
                  className="select-puesto"
                >
                  <option value="" disabled className="option-item">
                    Seleccione un puesto
                  </option>
                  {puestos.map((puesto, index) => (
                    <option key={index} value={puesto} className="option-item">
                      {puesto}
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
                  onChange={(e) => setDescripcionActividad1(e.target.value)}
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
                      {shouldShowX("Cabeza y Oídos") ? "X" : ""}
                    </td>
                    <td className="risk-label-cell">Tronco</td>
                    <td
                      className="risk-mark-cell"
                      onClick={() => toggleBodyPart("Tronco")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      {shouldShowX("Tronco") ? "X" : ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="risk-label-cell">Ojos y Cara</td>
                    <td
                      className="risk-mark-cell"
                      onClick={() => toggleBodyPart("Ojos y Cara")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      {shouldShowX("Ojos y Cara") ? "X" : ""}
                    </td>
                    <td className="risk-label-cell">Sistema respiratorio</td>
                    <td
                      className="risk-mark-cell"
                      onClick={() => toggleBodyPart("Sistema respiratorio")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      {shouldShowX("Sistema respiratorio") ? "X" : ""}
                    </td>
                  </tr>
                  <tr>
                    <td className="risk-label-cell">Brazos y Manos</td>
                    <td
                      className="risk-mark-cell"
                      onClick={() => toggleBodyPart("Brazos y Manos")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      {shouldShowX("Brazos y Manos") ? "X" : ""}
                    </td>
                    <td className="risk-label-cell">Extremidades inferiores</td>
                    <td
                      className="risk-mark-cell"
                      onClick={() => toggleBodyPart("Extremidades inferiores")}
                      style={{ cursor: "pointer", textAlign: "center" }}
                    >
                      {shouldShowX("Extremidades inferiores") ? "X" : ""}
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
                        value={empresaSeleccionada}
                        onChange={(e) => setEmpresaSeleccionada(e.target.value)}
                        className="large-text-dropdown"
                      >
                        <option value="">Seleccione una empresa</option>
                        {empresas.map((empresa, index) => (
                          <option key={index} value={empresa}>
                            {empresa}
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
                        value={fechaActual} // Establece la fecha actual como valor
                        onChange={(e) => setFechaActual(e.target.value)} // Permite modificar la fecha manualmente
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
                {Object.keys(hazards).map((hazard) => (
                  <li key={hazard} className="hazard-item">
                    <span>{hazard}</span> {/* Texto del peligro */}
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

            {/* Modal para borrar empresas */}
            <Modal
              isOpen={isEmpresaModalOpen}
              onRequestClose={closeEmpresaModal}
              className="modal-container"
            >
              <h2>Eliminar Empresas</h2>
              <p>Selecciona las empresas que deseas eliminar:</p>
              <div className="empresa-selection-list">
                {empresas.length > 0 ? (
                  empresas.map((empresa) => (
                    <label key={empresa} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={empresa}
                        checked={empresasSeleccionadasParaBorrar.includes(
                          empresa,
                        )}
                        onChange={handleEmpresaSelectionChange}
                      />
                      {empresa}
                    </label>
                  ))
                ) : (
                  <p>No hay empresas disponibles.</p>
                )}
              </div>
              <div className="modal-buttons">
                <button
                  onClick={handleDeleteSelectedEmpresas}
                  className="confirm-button"
                >
                  Confirmar Eliminación
                </button>
                <button onClick={closeEmpresaModal} className="cancel-button">
                  Cancelar
                </button>
              </div>
            </Modal>

            <Modal
              isOpen={isImageModalOpen}
              onRequestClose={() => setIsImageModalOpen(false)}
              className="modal-container"
            >
              <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>
                Selecciona una imagen para {hazardWithImages}
              </h3>
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
                <button onClick={() => setIsImageModalOpen(false)}>
                  Cerrar
                </button>
              </div>
            </Modal>

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
                  <div className="epp-component-no-epp">
                    No hay EPP seleccionado
                  </div>
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
                    className="epp-dropdown large-text-dropdown" // Se combinan ambas clases
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
                      className="large-text-dropdown"
                    >
                      <option value="" disabled>
                        Selecciona el tipo
                      </option>
                      {eppOptions[selectedMainOption]?.map(
                        (subOption, index) => (
                          <option key={index} value={subOption}>
                            {subOption}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                )}

                <div className="epp-selection-list-container">
                  {selectionList.length > 0 ? (
                    selectionList
                      .reduce((rows, key, index) => {
                        // Agrupa los elementos en pares
                        if (index % 2 === 0) rows.push([selectionList[index]]);
                        else rows[rows.length - 1].push(selectionList[index]);
                        return rows;
                      }, [])
                      .map((row, rowIndex) => (
                        <div key={rowIndex} className="epp-selection-row">
                          {row.map((selection, index) => (
                            <div key={index} className="epp-selection-item">
                              {selection.slice(selection.indexOf("-") + 2)}{" "}
                              {/* Elimina el prefijo */}
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
                      className={`blueberry-risk ${riskColor === "yellow" ? "yellow-bg" : ""}`}
                      style={{ backgroundColor: riskColor }}
                    >
                      {risk.toFixed(2)}
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
                      className={`risk-value-cell ${riskColor === "yellow" ? "yellow-bg" : ""}`}
                      style={{ backgroundColor: riskColor }}
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
      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Botones que se mantienen a la izquierda */}
        <div>
          <button onClick={downloadImage} className="download-button">
            Descargar PDF
          </button>
          <button onClick={openFolderModal} className="save-button">
            Guardar Tabla
          </button>
          <button onClick={handleReset} className="reset-button">
            Reiniciar Tabla
          </button>
        </div>

        {/* Botones que se moverán a la derecha */}
        <div style={{ marginLeft: "auto" }}>
          <button className="btn-extra" onClick={handleAddEmpresa}>
            Agregar Empresa
          </button>
          <button className="btn-extra" onClick={openEmpresaModal}>
            Borrar Empresa
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentTable;
