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
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase"; // Importar la configuración de Firebase
import logo from "../logos/logo.png";
import maxion from "../logos/maxion.jpeg";
import safran from "../logos/safran.jpeg";
import cimarron from "../logos/cimarron.png";
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

  const defaultAreas = [
    {
      nombre: "Producción",
      puestos: [
        "Ayudante de empaque y envase",
        "Ayudante de limpieza",
        "Operador de peletizadora",
        "Dosificador de micros",
        "Operador de rolado",
        "Operador de molino",
        "Dosificador de mezclas",
        "Coordinador de mantenimiento",
        "Ayudante de mantenimiento",
        "Operador de caldera",
        "Ayudante de mantenimiento soldadura",
        "Ayudante de mantenimiento eléctrico",
        "Ayudante de mantenimiento mecánico",
        "Embolsador",
        "Auxiliar de calidad",
        "Ayudante de albañil",
        "Supervisor de planta",
        "Recibidor de granos",
        "Coordinador de empaque",
        "Coordinador de seguridad e higiene",
        "MVZ. Responsable",
        "Superintendente de producción",
        "Ingeniero en proyectos",
      ],
    },
    {
      nombre: "Operación",
      puestos: [
        "Ayudante de almacén",
        "Almacenista",
        "Montacarguista",
        "Operador de enmelazadora",
        "Investigación y desarrollo",
      ],
    },
    {
      nombre: "Envase y empaque",
      puestos: [
        "Envasador",
        "Ayudante de empaque, envase (Cosedor)",
        "Estibadores",
        "Ayudante de empaque, envase (Circulante)",
        "Ayudante de empaque, envase (amarrador)",
      ],
    },
    {
      nombre: "Ventas",
      puestos: ["Estibador", "Repartidor", "Chofer"],
    },
  ];

  const [bodyPartsSelected, setBodyPartsSelected] = useState({
    "Cabeza y Oídos": false,
    "Ojos y Cara": false,
    "Sistema respiratorio": false,
    "Tronco": false,
    "Brazos y Manos": false,
    "Extremidades inferiores": false,
  });
  

  const handleInjectAreas = async () => {
    try {
      // 1. Apuntamos al documento EXACTO en "Empresas_17"
      //    con id = "BOwQ6hFVylImBmxn5xyd"
      const docRef = doc(db, "Empresas_17", "BOwQ6hFVylImBmxn5xyd");

      // 2. Recorremos el array de defaultAreas y creamos un documento
      //    en la subcolección "areas" para cada elemento
      for (const area of defaultAreas) {
        await addDoc(collection(docRef, "areas"), area);
      }

      alert(
        "Subcolección 'areas' inyectada correctamente con los puestos predeterminados.",
      );
    } catch (error) {
      console.error("Error al inyectar áreas:", error);
      alert("Error al inyectar áreas, revisa la consola.");
    }
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
    setAreaSeleccionada(selectedName);

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
      ".btn-agregar, .btn-borrar, .download-button, .save-button, .reset-button, .btn-extra, .remove-logo-button, .btn-agregar-empresa,.epp-dropdown, .btn-add-empresa, .epp-select, .delete-button"
    );
    buttons.forEach((button) => button.classList.add("hidden-buttons"));
  
    const tableElement = document.querySelector(".main-table");
  
    // Guardar estilos originales
    const originalWidth = tableElement.style.width;
    const originalTransform = tableElement.style.transform;
    const originalMargin = tableElement.style.margin;
  
    // Ajuste temporal
    tableElement.style.width = "1750px";
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
  

  const handleDeleteSelectedPuestos = async () => {
    if (puestosSeleccionadosParaBorrar.length === 0) {
      alert("Selecciona al menos un puesto para borrar.");
      return;
    }

    // Filtrar el arreglo de puestos para remover los puestos seleccionados
    const nuevosPuestos = puestos.filter(
      (puesto) => !puestosSeleccionadosParaBorrar.includes(puesto),
    );
    setPuestos(nuevosPuestos);

    // Buscar el área actual
    const selectedAreaObj = areas.find(
      (area) => area.nombre === areaSeleccionada,
    );

    if (!selectedAreaObj || !selectedEmpresaId) {
      console.error(
        "No se encontró el área o la empresa no está seleccionada.",
      );
      alert("No se pudo borrar el puesto: selecciona una empresa y un área.");
      return;
    }

    try {
      // Actualiza el documento del área con el nuevo arreglo de puestos
      await updateDoc(
        doc(db, "Empresas_17", selectedEmpresaId, "areas", selectedAreaObj.id),
        { puestos: nuevosPuestos },
      );
      console.log("Puestos actualizados tras borrar");
    } catch (error) {
      console.error("Error al borrar puestos en Firebase:", error);
      alert("Error al borrar el puesto, revisa la consola.");
    }

    // Limpia la selección de puestos para borrar y cierra el modal
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
    const selectedArea = areas.find((a) => a.nombre === areaSeleccionada);
    setPuestos(selectedArea ? selectedArea.puestos : []);
  }, [areaSeleccionada, areas]);

  // Función para agregar un nuevo puesto y guardarlo en Firebase
  // Asegúrate de tener el useEffect para asignar el área automáticamente:
  useEffect(() => {
    if (areas.length > 0 && !areaSeleccionada) {
      setAreaSeleccionada(areas[0].nombre);
      setPuestos(areas[0].puestos || []);
    }
  }, [areas]);

  const handleAddPuestoClick = async () => {
    const nuevoPuesto = prompt("Ingrese el nuevo puesto:");
    if (nuevoPuesto && nuevoPuesto.trim() !== "") {
      const newPuesto = nuevoPuesto.trim();
      const updatedPuestos = [...puestos, newPuesto];
      setPuestos(updatedPuestos);
      setPuestoSeleccionado("");

      // Buscar el objeto del área seleccionada en el arreglo "areas"
      const selectedAreaObj = areas.find(
        (area) =>
          area.nombre.trim().toLowerCase() ===
          areaSeleccionada.trim().toLowerCase(),
      );
      console.log("Área encontrada:", selectedAreaObj);

      // Verificación para asegurarnos de que tanto la empresa como el área estén seleccionados
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

  // Función auxiliar: actualiza los puestos del área seleccionada en Firebase
  

  const handleDeletePuestoClick = () => {
    setIsModalOpen(true);
  };

  const saveTable = async (empresaId, normaId) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("No estás autenticado.");
      return;
    }
    const uid = user.uid;
  
    const tableData = {
      uid,
      areaSeleccionada,
      puestoSeleccionado,
      hazards,
      consequence,
      bodyPartsSelected,
      exposure,
      probability,
      risk: calculateRisk(),
      selectedImages,
      logoSeleccionado,
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
      // Guardar la tabla
      await addDoc(
        collection(db, "empresas", empresaId, "normas", normaId, "tablas"),
        tableData
      );
      alert("Tabla guardada con éxito en Firestore.");
  
      // 📌 ACTUALIZAR EL RESUMEN
      const resumenRef = doc(
        db,
        "resumen_17",
        empresaSeleccionada,
        "areas",
        areaSeleccionada
      );
  
      console.log("📌 Guardando resumen en:", resumenRef.path);
  
      const resumenSnapshot = await getDoc(resumenRef);
  
      let newResumenData = {
        uid, // NECESARIO para filtrarlo en TablaResumen.jsx
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
  
      newResumenData.puestos.push(puestoRiesgo);
      newResumenData.tolerable += puestoRiesgo.tolerable;
      newResumenData.moderado += puestoRiesgo.moderado;
      newResumenData.notable += puestoRiesgo.notable;
      newResumenData.elevado += puestoRiesgo.elevado;
      newResumenData.grave += puestoRiesgo.grave;
  
      // 🟢 GUARDAR EL RESUMEN CON UID
      await setDoc(resumenRef, {
        ...newResumenData,
        uid, // 🔐 Esto asegura que la tabla de resumen lo muestre
      });
  
      // Limpiar campos
      setDescripcionActividad1("");
      setDescripcionActividad2("");
  
      // Persistencia en localStorage
      localStorage.setItem("empresaPersistente", empresaSeleccionada);
      localStorage.setItem("empresaIdPersistente", empresaId);
      localStorage.setItem("areaPersistente", areaSeleccionada);
      localStorage.setItem("puestosPersistentes", JSON.stringify(puestos));
    } catch (error) {
      console.error("❌ Error al guardar en Firestore:", error);
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
    // Verifica que haya una empresa seleccionada
    if (!selectedEmpresaId) {
      alert("Selecciona una empresa antes de agregar un área.");
      return;
    }

    const nuevaArea = prompt("Ingrese el nombre de la nueva área:");
    if (nuevaArea && nuevaArea.trim() !== "") {
      try {
        // Referencia al documento de la empresa en "Empresas_17"
        const empresaRef = doc(db, "Empresas_17", selectedEmpresaId);
        // Referencia a la subcolección "areas" dentro de esa empresa
        const areasRef = collection(empresaRef, "areas");
        // Crea el nuevo documento en la subcolección "areas"
        const docRef = await addDoc(areasRef, {
          nombre: nuevaArea.trim(),
          puestos: [], // Inicialmente sin puestos
        });
        // Actualiza el estado local para incluir el nuevo área
        const newArea = {
          id: docRef.id,
          nombre: nuevaArea.trim(),
          puestos: [],
        };
        setAreas((prevAreas) => [...prevAreas, newArea]);
        setAreaSeleccionada(newArea.nombre);
        alert("Área agregada correctamente.");
      } catch (error) {
        console.error("Error al agregar el área:", error);
        alert("Error al agregar el área, revisa la consola.");
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
    "Equipo de Audición": ["Conchas Acústicas", "Tapones Auditivos"],
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
      "Chaleco de proteccion",
    ],
    "Equipos Especiales": [
      "Equipo de Protección contra Caídas de Altura",
      "Equipo de Respiración Autónomo",
      "Equipo para brigadistas contra incendios",
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
  const [logoSeleccionado, setLogoSeleccionado] = useState(() => {
    return localStorage.getItem("logoSeleccionado") || null;
  }); 
  

  useEffect(() => {
    if (logoSeleccionado) {
      localStorage.setItem("logoSeleccionado", logoSeleccionado);
    } else {
      localStorage.removeItem("logoSeleccionado");
    }
  }, [logoSeleccionado]);

  
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



  // Estado para las partes desmarcadas manualmente
  const [removedParts, setRemovedParts] = useState([]); // Partes desmarcadas manualmente

  // Función para alternar la selección de una parte del cuerpo
  function toggleBodyPart(part) {
    setBodyPartsSelected((prevState) => ({
      ...prevState,
      [part]: !prevState[part],
    }));
  }

  // Determinar si mostrar "X" (si está en affectedBodyParts y no en removedParts)

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

  // 🔴 NUEVO: Reiniciar las partes del cuerpo
  setBodyPartsSelected({
    "Cabeza y Oídos": false,
    "Ojos y Cara": false,
    "Sistema respiratorio": false,
    "Tronco": false,
    "Brazos y Manos": false,
    "Extremidades inferiores": false,
  });

  // 🔴 NUEVO: Quitar logo seleccionado
  setLogoSeleccionado(null);
};


  // Función para cargar las empresas desde Firestore
  const loadFolders = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        console.warn(
          "No hay usuario autenticado, no se pueden cargar empresas.",
        );
        return;
      }

      // Filtramos la colección "empresas" por el UID del usuario
      const q = query(collection(db, "empresas"), where("uid", "==", user.uid));

      const querySnapshot = await getDocs(q);
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

  const [showNormasSection, setShowNormasSection] = useState(false);
  const [empresaEnSeleccion, setEmpresaEnSeleccion] = useState("");

  // Abrir el modal
  const openFolderModal = () => {
    setIsFolderModalOpen(true);
    setShowNormasSection(false); // 👈 fuerza a mostrar vista de empresa
  };
  
  

  // Cerrar el modal
  const closeFolderModal = () => {
    setIsFolderModalOpen(false);
    // No resetees los estados si ya cargaste empresa y áreas
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
  const handleDeleteSelectedEmpresas = async () => {
    if (empresasSeleccionadasParaBorrar.length === 0) {
      alert("Seleccione al menos una empresa para borrar.");
      return;
    }

    const confirmDelete = window.confirm(
      `¿Seguro que deseas eliminar las siguientes empresas?\n${empresasSeleccionadasParaBorrar.join(", ")}`,
    );
    if (!confirmDelete) return;

    try {
      // Para cada empresa seleccionada, borramos primero la subcolección "areas"
      for (const empresaId of empresasSeleccionadasParaBorrar) {
        // Obtenemos todos los documentos de la subcolección "areas" de esta empresa
        const areasSnapshot = await getDocs(
          collection(db, "Empresas_17", empresaId, "areas"),
        );
        for (const areaDoc of areasSnapshot.docs) {
          // Borramos cada documento de la subcolección "areas"
          await deleteDoc(areaDoc.ref);
        }
        // Una vez borradas todas las áreas, borramos el documento de la empresa
        await deleteDoc(doc(db, "Empresas_17", empresaId));
      }

      // Actualizamos el estado local para eliminar las empresas borradas
      setEmpresas((prevEmpresas) =>
        prevEmpresas.filter(
          (emp) => !empresasSeleccionadasParaBorrar.includes(emp.id),
        ),
      );
      setEmpresasSeleccionadasParaBorrar([]);
      closeEmpresaModal();
      alert("Empresas eliminadas con éxito.");
    } catch (error) {
      console.error("Error al borrar empresas:", error);
      alert("Ocurrió un error al borrar las empresas. Revisa la consola.");
    }
  };

  // Ejemplo de creación de empresa (si aplica en tu caso):
  const handleAddEmpresa = async () => {
    const nuevaEmpresa = prompt("Ingrese el nombre de la nueva empresa:");
    if (!nuevaEmpresa) return;

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      alert("No estás autenticado.");
      return;
    }

    try {
      // Agrega la empresa a la colección "Empresas_17"
      await addDoc(collection(db, "Empresas_17"), {
        nombre: nuevaEmpresa,
        uid: user.uid,
        fechaCreacion: serverTimestamp(),
      });
      alert("Empresa agregada con éxito en Empresas_17.");
    } catch (error) {
      console.error("Error al agregar empresa:", error);
      alert("Error al agregar empresa, revisa la consola.");
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    // 'name' es el key del objeto hazards,
    // 'checked' es true/false si el checkbox está marcado

    setHazards((prevHazards) => ({
      ...prevHazards,
      [name]: checked, // Actualiza el valor booleano
    }));
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

  useEffect(() => {
    if (!selectedEmpresaId) return;
  
    const fetchAreas = async () => {
      try {
        const empresaRef = doc(db, "Empresas_17", selectedEmpresaId);
        const areasRef = collection(empresaRef, "areas");
        const querySnapshot = await getDocs(areasRef);
  
        const dbAreas = querySnapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));
  
        // ✅ Evitar sobrescribir si ya hay áreas cargadas
        if (areas.length === 0) {
          setAreas(dbAreas);
        }
      } catch (error) {
        console.error("Error al cargar áreas desde Firebase:", error);
      }
    };
  
    fetchAreas();
  }, [selectedEmpresaId]);
  

  const deleteAreaFromFirebase = async (areaId) => {
    if (!selectedEmpresaId) return; // Verifica que haya empresa seleccionada

    try {
      // Borra el doc dentro de "Empresas_17" / selectedEmpresaId / "areas" / areaId
      await deleteDoc(
        doc(db, "Empresas_17", selectedEmpresaId, "areas", areaId),
      );
      console.log("Área eliminada de Firebase");
    } catch (error) {
      console.error("Error eliminando área en Firebase:", error);
    }
  };

  const riskColor = getRiskColor(risk);

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
    const loadEmpresas = async () => {
      const companiesRef = collection(db, "Empresas_17");
      const querySnapshot = await getDocs(companiesRef);
      // Mapeas a { id, nombre, ... }
      const companiesList = querySnapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));
      setEmpresas(companiesList);
    };
    loadEmpresas();
  }, []);

  // ==========================================================
  // 2. Al seleccionar una empresa, guardar su ID y nombre y cargar sus áreas
  // ==========================================================
  const handleEmpresaChange = (e) => {
    const selectedId = e.target.value;
    setSelectedEmpresaId(selectedId);
  
    // Guarda el nombre visible de la empresa
    const selected = empresas.find((emp) => emp.id === selectedId);
    setEmpresaSeleccionada(selected ? selected.nombre : "");
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


  const autoResizeTextarea = (e) => {
  const textarea = e.target;
  textarea.style.height = "auto"; // Reinicia la altura
  textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta a contenido
};

useEffect(() => {
  const storedData = JSON.parse(localStorage.getItem("tableToEdit"));

  if (storedData) {
    localStorage.setItem("empresaPersistente", storedData.nombreEmpresa || "");
    localStorage.setItem("empresaIdPersistente", storedData.empresaId || "");
    localStorage.setItem("areaPersistente", storedData.areaSeleccionada || "");
    localStorage.setItem("puestosPersistentes", JSON.stringify(storedData.puestos || []));
  }
}, []);



useEffect(() => {
  const empresa = localStorage.getItem("empresaPersistente");
  const empresaId = localStorage.getItem("empresaIdPersistente");
  const area = localStorage.getItem("areaPersistente");
  const puestosGuardados = JSON.parse(localStorage.getItem("puestosPersistentes") || "[]");

  if (empresa && empresaId) {
    setEmpresaSeleccionada(empresa);
    setSelectedEmpresaId(empresaId);
  }

  if (area) {
    setAreaSeleccionada(area);
  }

  if (puestosGuardados.length > 0) {
    setPuestos(puestosGuardados);
  }
}, []);



useEffect(() => {
  localStorage.setItem("empresaPersistente", empresaSeleccionada);
  localStorage.setItem("empresaIdPersistente", selectedEmpresaId);
  localStorage.setItem("areaPersistente", areaSeleccionada);
  localStorage.setItem("puestosPersistentes", JSON.stringify(puestos));
}, [empresaSeleccionada, selectedEmpresaId, areaSeleccionada, puestos]);



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
  {logoSeleccionado ? (
    <div className="logo-container">
      <img
        src={logoSeleccionado}
        alt="Logo de la Empresa"
        className="company-logo"
      />
      <button onClick={() => setLogoSeleccionado(null)} className="remove-logo-button">
        ×
      </button>
    </div>
  ) : (
    <>
      <select onChange={(e) => setLogoSeleccionado(e.target.value)} className="logo-dropdown">
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
        onChange={(e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => setLogoSeleccionado(reader.result);
          reader.readAsDataURL(file);
        }}
      />
    </>
  )}
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
  {/* VISTA 1: Seleccionar empresa */}
  {!showNormasSection && (
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
                    checked={empresaEnSeleccion === empresa.id}
                    onChange={() => setEmpresaEnSeleccion(empresa.id)}
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
            if (empresaEnSeleccion) {
              setShowNormasSection(true);
              loadNormas(empresaEnSeleccion); // ⬅ cargar normas aquí
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

  {/* VISTA 2: Seleccionar norma */}
  {showNormasSection && (
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
              // Guarda tabla
              if (isEditing) {
                updateTable(empresaEnSeleccion, selectedNormaId);
              } else {
                saveTable(empresaEnSeleccion, selectedNormaId);
              }
          
              //  Cierra solo el modal, no reseta estados
              setIsFolderModalOpen(false);
              //  NO llames a setEmpresaSeleccionada("") ni setShowNormasSection(false)
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
            setShowNormasSection(false);
            setEmpresaEnSeleccion("");
            setSelectedNormaId("");
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
                  <option value="" disabled>
                    Seleccione un puesto
                  </option>
                  {puestos.map((puesto, index) => (
                    <option key={index} value={puesto}>
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
                        className="large-text-dropdown"
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
                    <span>{hazard}</span>
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
                    <label key={empresa.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={empresa.id} // <-- Guardas el ID del doc
                        checked={empresasSeleccionadasParaBorrar.includes(
                          empresa.id,
                        )}
                        onChange={handleEmpresaSelectionChange}
                      />
                      {empresa.nombre} {/* Muestras el nombre de la empresa */}
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
          <button onClick={handleAddEmpresa} className="btn-add-empresa">
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
