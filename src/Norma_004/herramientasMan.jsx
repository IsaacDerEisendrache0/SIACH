import React, { useState, useCallback, useEffect } from "react";
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
import { db } from "../firebase"; // Importar la configuración de Firebase
import logo from "../logos/logo.png"; // Importar el logo

const RiskTable = () => {
  useEffect(() => {
    const savedAreas = JSON.parse(localStorage.getItem("areas")) || [];
    setAreas(savedAreas.filter((area) => area && area.nombre));

   

    const savedPuestos = JSON.parse(localStorage.getItem("puestos")) || [];
    setPuestos(savedPuestos.filter((puesto) => puesto && puesto.nombre));

    

  }, []);

  /**ome pongo a escribir para que piensen que estoy trabajando alv, por que is no m eregañan a la chingada
   *
   *
   * jajajajaja vale verga este pedo, nomas pa verme interesante
   *    *
   *
   */

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
      "Termica por combustion",
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

  const [selectedPeligros, setSelectedPeligros] = useState([]);
  const [affectedBodyParts, setAffectedBodyParts] = useState([]);

  const handlePeligroChange = (peligro) => {
    const isSelected = selectedPeligros.includes(peligro);

    let newSelectedPeligros = [];
    let newAffectedParts = [];

    if (isSelected) {
      // Deseleccionar peligro y eliminar partes del cuerpo asociadas
      newSelectedPeligros = selectedPeligros.filter((item) => item !== peligro);
      newAffectedParts = affectedBodyParts.filter(
        (part) => !partesPorPeligro[peligro].includes(part),
      );
    } else {
      // Seleccionar peligro y agregar partes del cuerpo asociadas
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
  const handleExposureChange = (e) => setExposure(parseFloat(e.target.value));
  const handleProbabilityChange = (e) =>
    setProbability(parseFloat(e.target.value));

  const handleChange = useCallback((field, value) => {
    setState((prevState) => ({ ...prevState, [field]: value }));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file?.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => handleChange("imagePreview", reader.result);
      reader.readAsDataURL(file);
    } else {
      handleChange("errorMessage", "Formato de archivo no válido");
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
  const { color, accion, clasificacion } =
    obtenerClasificacionRiesgo(magnitudRiesgo);

  const downloadImage = () => {
    // Seleccionar el contenedor con el ID 'pdf-content'
    const input = document.getElementById("pdf-content");

    if (input) {
      // Configurar html2canvas para capturar el contenido como imagen
      html2canvas(input, { scale: 2, useCORS: true, backgroundColor: "#fff" })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = imgData;
          link.download = "tabla_herramientas_manual.png"; // Nombre de la imagen

          // Crear el enlace para descargar la imagen
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
    if (newArea.trim() && !areas.some((a) => a.nombre === newArea.trim())) {
      const updatedAreas = [...areas, { nombre: newArea.trim(), puestos: [] }];
      setAreas(updatedAreas);
      localStorage.setItem("areas", JSON.stringify(updatedAreas)); // Guardar en localStorage
      setNewArea("");
      alert("Área agregada con éxito.");
    } else {
      alert("El área ya existe o es inválida.");
    }
  };
  const handleAddPuesto = () => {
    if (
      newPuesto.trim() &&
      !puestos.some((p) => p.nombre === newPuesto.trim())
    ) {
      const updatedPuestos = [...puestos, { nombre: newPuesto.trim() }];
      setPuestos(updatedPuestos);
      localStorage.setItem("puestos", JSON.stringify(updatedPuestos)); // Guardar en localStorage
      setNewPuesto("");
      alert("Puesto agregado con éxito.");
    } else {
      alert("El puesto ya existe o es inválido.");
    }
  };

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

      // Llamar a updateResumenData para actualizar la colección resumen
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
      console.error(
        "El área no está definida. No se puede actualizar el resumen.",
      );
      return;
    }

    try {
      // Referencia al documento en la colección 'resumen' usando el área como ID
      const resumenRef = doc(db, "resumen", area);

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
        (p) => p.nombre === newPuesto,
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

      console.log("Resumen actualizado exitosamente:", resumenData);
    } catch (error) {
      console.error("Error al actualizar los datos del resumen:", error);
    }
  };

  const [areas, setAreas] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [newArea, setNewArea] = useState("");
  const [newPuesto, setNewPuesto] = useState("");
  const [area, setArea] = useState("");
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showPuestoModal, setShowPuestoModal] = useState(false);
  const [isEditing] = useState(false); // Controla si estás en modo edición
  const [tableId, setTableId] = useState(null); // Guarda el ID de la tabla en Firestore

  const renderOptions = (options) => {
    return options.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ));
  };

  return (
    <div className="risk-table-container">
      <div id="pdf-content" className="risk-table-wrapper">
        <div className="risk-table" style={{ width: "100%", fontSize: "1em" }}>
          <div
            className="logo-container"
            style={{ textAlign: "center", marginBottom: "10px" }}
          >
            <img src={logo} alt="SIACH Logo" style={{ width: "200px" }} />
          </div>
          <table className="main-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th colSpan="2" className="descripcion-maquinaria">
                  DESCRIPCIÓN DE LA MAQUINARIA O EQUIPO:
                </th>
                <th colSpan="4">
                  <textarea
                    className="descripcion-maquinaria"
                    value={state.maquinariaDescripcion}
                    onChange={(e) =>
                      handleChange("maquinariaDescripcion", e.target.value)
                    }
                    placeholder="Describa la maquinaria o equipo"
                    cols={1}
                  />
                </th>
                <th className="descripcion-maquinaria" colspan="">
                  NOMBRE DE LA MAQUINARIA
                </th>
                <th colspan="2">
                  <textarea
                    className="descripcion-maquinaria"
                    value={state.maquinariaDescripcion}
                    onChange={(e) =>
                      handleChange("maquinariaDescripcion", e.target.value)
                    }
                    placeholder="Describa la maquinaria o equipo"
                    cols={1}
                  />
                </th>
                <th colSpan="2" className="energia-utilizada">
                  ENERGIA UTILIZADA:
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
                    name="areas"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  >
                    <option value="">Seleccione un área</option>
                    {areas
                      .filter((area) => area && area.nombre) // Filtrar valores inválidos
                      .map((area, index) => (
                        <option key={index} value={area.nombre}>
                          {area.nombre}
                        </option>
                      ))}
                  </select>
                </th>
              </tr>

              <tr>
                <th colSpan="10" className="area">
                  LOCALIZACIÓN ESQUEMÁTICA DE LOS RIESGOS EN LA MAQUINARIA Y/O
                  EQUIPO:
                </th>
                <th className="area">PUESTO</th>
                <th>
                  <select
                    name="puestos"
                    value={newPuesto}
                    onChange={(e) => setNewPuesto(e.target.value)}
                  >
                    <option value="">Seleccione un puesto</option>
                    {puestos
                      .filter((puesto) => puesto && puesto.nombre) // Filtrar valores inválidos
                      .map((puesto, index) => (
                        <option key={index} value={puesto.nombre}>
                          {puesto.nombre}
                        </option>
                      ))}
                  </select>
                </th>
                <th colSpan="1" className="poe">
                  POE{" "}
                </th>
                <th colSpan="1">
                  <input
                    className="poe"
                    type="text"
                    placeholder="Escriba el POE"
                    style={{ width: "100%" }}
                  />
                </th>
                <th colSpan="" className="tiempo-exposicion">
                  TIEMPO DE EXPOSICIÓN:
                </th>
                <th colSpan="1">
                  <select
                    className="tiempo-exposicion"
                    value={state.tiempoExposicion}
                    onChange={(e) =>
                      handleChange("tiempoExposicion", e.target.value)
                    }
                    style={{ width: "100%" }}
                  >
                    {renderOptions(opciones.tiempoExposicion)}
                  </select>
                </th>
              </tr>
            </thead>

            <tr>
              <td colSpan="6" rowSpan="2">
                <div className="image-sectionn">
                  {!state.imagePreview && (
                    <p className="image-placeholder">
                      No hay imagen seleccionada
                    </p>
                  )}
                  {state.imagePreview && (
                    <img
                      src={state.imagePreview}
                      alt="Vista previa"
                      className="image-preview"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-input"
                    title="Haz clic para cargar una imagen"
                  />
                </div>
              </td>
              <td colSpan="10" className="right-alignedd">
                <div className="text1">Evaluación de riesgo de trabajo</div>
                <table className="" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Consecuencia</th>
                      <th>Exposición</th>
                      <th>Probabilidad</th>
                      <th>Magnitud del Riesgo</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr colspan="1">
                      <td colSpan="1">
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
                            Sería una secuencia o coincidencia rara pero
                            posible, ha ocurrido
                          </option>
                          <option value={1}>
                            Coincidencia muy rara, pero se sabe que ha ocurrido
                          </option>
                          <option value={0.5}>
                            Coincidencia extremadamente remota pero concebible
                          </option>
                          <option value={0.1}>
                            Coincidencia prácticamente imposible, jamás ha
                            ocurrido
                          </option>
                        </select>
                        <div>Valor: {probability}</div>
                      </td>
                      <td
                        style={{
                          backgroundColor:
                            obtenerColorPorRiesgo(magnitudRiesgo),
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
              <td colSpan="11" rowSpan="5">
                <table className="main-table">
                  <th rowSpan="">Identificación del Riesgo</th>
                  <tbody>
                    <tr>
                      <td>
                        <div
                          style={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            border: "1px solid #ccc",
                            padding: "10px",
                            fontSize: "1.1em",
                          }}
                        >
                          {Object.entries(partesPorPeligro).map(
                            ([peligro], index) => (
                              <div
                                key={index}
                                style={{
                                  marginBottom: "5px",
                                  whiteSpace: "normal",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedPeligros.includes(peligro)}
                                  onChange={() => handlePeligroChange(peligro)}
                                  style={{ marginRight: "8px" }}
                                />
                                {peligro}
                              </div>
                            ),
                          )}
                        </div>
                        <br />
                        <br />
                        <div>
                          <label>Observaciones:</label>
                          <textarea
                            id="observaciones"
                            value={state.observacionesGenerales}
                            onChange={(e) =>
                              handleChange(
                                "observacionesGenerales",
                                e.target.value,
                              )
                            }
                            placeholder="Agregar observaciones generales aquí"
                            row="15"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>

              <td colSpan="2">
                <table className="risk-body-table" style={{ width: "105%" }}>
                  <thead>
                    <tr>
                      <th>
                        Principales partes del cuerpo expuestas al riesgo:
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {affectedBodyParts.length > 0 ? (
                      affectedBodyParts.map((part, index) => (
                        <tr key={index}>
                          <td>{part}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td>No hay partes del cuerpo seleccionadas</td>
                      </tr>
                    )}
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
                    {[...Array(7)].map(
                      (
                        _,
                        index, // 4 filas con select vacíos inicialmente
                      ) => (
                        <tr key={index}>
                          <td>
                            <select defaultValue="" style={{ width: "100%" }}>
                              <option value="" disabled>
                                Seleccione un EPP
                              </option>
                              {listaEPP.map((epp, i) => (
                                <option key={i} value={epp}>
                                  {epp}
                                </option>
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
      <button onClick={downloadImage} className="download-button">
        Descargar Imagen
      </button>
      <button onClick={saveTableData} className="download-button">
        Guardar tabla
      </button>
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
      <button
        onClick={() => setShowAreaModal(true)}
        className="download-button"
      >
        Agregar Área
      </button>

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
              <button onClick={() => setShowPuestoModal(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowPuestoModal(true)}
        className="download-button"
      >
        Agregar Puesto
      </button>
    </div>
  );
};
export default RiskTable;
