import React, { useState, useEffect, useRef} from "react";
import html2canvas from "html2canvas";
import {
  collection, onSnapshot, addDoc, deleteDoc, doc,
  query, where, serverTimestamp
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { FaTrash } from "react-icons/fa";
import "./TablaResumen.css";

// 🔵 IMPORTA LOS COMPONENTES DE RECHARTS

import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ReferenceLine,
  
} from "recharts";






const TablaResumen = () => {
  // ESTADOS
  const [empresas, setEmpresas] = useState([]);
  const [newEmpresaName, setNewEmpresaName] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  const [normas, setNormas] = useState([]);
  const [newNormaName, setNewNormaName] = useState("");
  const [selectedNorma, setSelectedNorma] = useState(null);

  const [data, setData] = useState([]);        // Áreas
  const [expandedAreas, setExpandedAreas] = useState([]);

  const auth = getAuth();
  const uid = auth.currentUser ? auth.currentUser.uid : null;

  

  // 1. Cargar Empresas
  useEffect(() => {
    if (!uid) return;
    const q = query(collection(db, "resumenes"), where("uid", "==", uid));
    return onSnapshot(q, (snap) => {
      setEmpresas(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [uid]);

  // 2. Cargar Normas
  useEffect(() => {
    if (!selectedEmpresa) {
      setNormas([]);
      setSelectedNorma(null);
      return;
    }
    const q = query(
      collection(db, "resumenes", selectedEmpresa.id, "normas"),
      where("uid", "==", uid)
    );
    return onSnapshot(q, (snap) => {
      setNormas(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, [selectedEmpresa, uid]);

  // 3. Cargar Áreas
  useEffect(() => {
  if (!selectedEmpresa || !selectedNorma || !uid) return;

  const n = selectedNorma.nombre.toLowerCase();

  let collectionName = null;

  if (n.includes("norma_17") || n.includes("nom_17")) {
    collectionName = "resumen_17";
  } else if (n.includes("moviles")) {
    collectionName = "resumen_004_moviles";
  } else if (n.includes("maquinaria")) {
    collectionName = "resumen_004_maquinaria";
  } else if (n.includes("herramientas")) {
    collectionName = "resumen_004_herramientas";
  }

  if (!collectionName) return;

  const empresaFolder = selectedEmpresa.nombre;
  const q = query(
    collection(db, collectionName, empresaFolder, "areas"),
    where("uid", "==", uid)
  );

  return onSnapshot(q, (snap) => {
    const areas = snap.docs.map((docSnap) => {
      const d = docSnap.data();
      return {
        area: docSnap.id,
        collectionName,
        nombreEmpresa: empresaFolder,
        puestos: Array.isArray(d.puestos) ? d.puestos : [],
        tolerable: d.tolerable ?? 0,
        moderado: d.moderado ?? 0,
        notable: d.notable ?? 0,
        elevado: d.elevado ?? 0,
        grave: d.grave ?? 0,
      };
    });
    setData(areas);
  });
}, [selectedEmpresa, selectedNorma, uid]);


  // Toggle expandir area
  const toggleExpandArea = (id) =>
    setExpandedAreas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // CAPTURAR ÁREA ESPECÍFICA
  const capturarTablaArea = async (areaId) => {
    const nodo = document.getElementById(`tabla-area-${areaId}`);
    if (!nodo) {
      alert("No se encontró la tabla");
      return;
    }
    const btn = nodo.querySelector(".btn-captura");
    if (btn) btn.classList.add("captura-hide");

    try {
      const canvas = await html2canvas(nodo, { scale: 2, backgroundColor: "#fff" });
      const link = document.createElement("a");
      link.download = `Resumen_${areaId}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
      alert("Error al capturar la tabla.");
    } finally {
      if (btn) btn.classList.remove("captura-hide");
    }
  };

  // CAPTURAR TABLA COMPLETA
  const capturarTablaCompleta = async () => {
    const nodo = document.getElementById("tabla-completa");
    if (!nodo) {
      alert("No se encontró la tabla completa.");
      return;
    }
    // Ocultar temporalmente todos los botones .btn-captura dentro de la tabla
    const botones = nodo.querySelectorAll(".btn-captura");
    botones.forEach((b) => b.classList.add("captura-hide"));

    try {
      const canvas = await html2canvas(nodo, { scale: 2, backgroundColor: "#fff" });
      const link = document.createElement("a");
      link.download = "Resumen_Completo.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error(e);
      alert("Error al capturar la tabla completa.");
    } finally {
      botones.forEach((b) => b.classList.remove("captura-hide"));
    }
  };

  // Totales Globales
  const total = data.reduce(
    (acc, r) => ({
      tolerable: acc.tolerable + r.tolerable,
      moderado: acc.moderado + r.moderado,
      notable: acc.notable + r.notable,
      elevado: acc.elevado + r.elevado,
      grave: acc.grave + r.grave,
    }),
    { tolerable: 0, moderado: 0, notable: 0, elevado: 0, grave: 0 }
  );

  // RENDER
  return (
    <div className="saved-tables-container">
      {/* Listado de Empresas */}
      {!selectedEmpresa && (
        <>
          <h2>Empresas</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newEmpresaName.trim()) return;
              addDoc(collection(db, "resumenes"), {
                nombre: newEmpresaName,
                uid,
                fechaCreacion: serverTimestamp(),
              });
              setNewEmpresaName("");
            }}
            className="add-folder-form"
          >
            <input
              className="input-folder-name"
              placeholder="Nombre de la nueva empresa"
              value={newEmpresaName}
              onChange={(e) => setNewEmpresaName(e.target.value)}
            />
            <button className="btn-add-folder">Agregar Empresa</button>
          </form>

          <div className="folders-list">
            {empresas.map((emp) => (
              <div key={emp.id} className="folder-item">
                <span
                  className="folder-name"
                  onClick={() => setSelectedEmpresa(emp)}
                >
                  {emp.nombre}
                </span>
                <FaTrash
                  className="boton-eliminar"
                  onClick={() => deleteDoc(doc(db, "resumenes", emp.id))}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Listado de Normas */}
      {selectedEmpresa && !selectedNorma && (
        <>
          <button onClick={() => setSelectedEmpresa(null)} className="btn-back-home">
            ← Regresar a Empresas
          </button>
          <h2>Normas de {selectedEmpresa.nombre}</h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newNormaName.trim()) return;
              addDoc(collection(db, "resumenes", selectedEmpresa.id, "normas"), {
                nombre: newNormaName,
                uid,
                fechaCreacion: serverTimestamp(),
              });
              setNewNormaName("");
            }}
            className="add-folder-form"
          >
            <input
              className="input-folder-name"
              placeholder="Nombre de la nueva norma"
              value={newNormaName}
              onChange={(e) => setNewNormaName(e.target.value)}
            />
            <button className="btn-add-folder">Agregar Norma</button>
          </form>

          <div className="folders-list">
            {normas.map((n) => (
              <div key={n.id} className="folder-item">
                <span className="folder-name" onClick={() => setSelectedNorma(n)}>
                  {n.nombre}
                </span>
                <FaTrash
                  className="boton-eliminar"
                  onClick={() =>
                    deleteDoc(doc(db, "resumenes", selectedEmpresa.id, "normas", n.id))
                  }
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Tabla de Resumen */}
      {selectedEmpresa && selectedNorma && (
        <>
          <button onClick={() => setSelectedNorma(null)} className="btn-back-home">
            ← Regresar a Normas
          </button>
          <h2>Tabla de Resumen de {selectedNorma.nombre}</h2>

          {/* Botón para capturar toda la tabla de golpe */}
          <button className="btn-captura" onClick={capturarTablaCompleta}>
            📸 Capturar Tabla Completa
          </button>

          {/* contenedor con id para la tabla principal y sub-tablas */}
          <div className="tabla-container" id="tabla-completa">
            <table className="tabla-principal">
            <thead>
  <tr>
    <th rowSpan="2" className="tabla-header">Área</th>
    <th colSpan="5" className="tabla-header">Magnitud de riesgo</th>
    <th rowSpan="2" className="tabla-header btn-captura">
      Acción
    </th>
  </tr>
  <tr>
    <th className="tabla-riesgo tolerable">Tolerable</th>
    <th className="tabla-riesgo moderado">Moderado</th>
    <th className="tabla-riesgo notable">Notable</th>
    <th className="tabla-riesgo elevado">Elevado</th>
    <th className="tabla-riesgo grave">Grave</th>
  </tr>
</thead>
<tbody>
  {data.length ? (
    data.map((r) => (
      <tr key={r.area}>
        <td className="tabla-area">
          <button
            className="boton-expandir"
            onClick={() => toggleExpandArea(r.area)}
          >
            {expandedAreas.includes(r.area) ? "▼" : "▶"}
          </button>
          {r.area}
        </td>
        <td>{r.tolerable}</td>
        <td>{r.moderado}</td>
        <td>{r.notable}</td>
        <td>{r.elevado}</td>
        <td>{r.grave}</td>
        {/* Celda de Acción con la clase .btn-captura */}
        <td className="btn-captura">
          <FaTrash
            className="boton-eliminar"
            onClick={() =>
              deleteDoc(doc(db, r.collectionName, r.nombreEmpresa, "areas", r.area))
            }
          />
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" style={{ textAlign: "center" }}>
        No hay registros de resumen en esta norma.
      </td>
    </tr>
  )}
  <tr>
    <th>TOTAL</th>
    <th>{total.tolerable}</th>
    <th>{total.moderado}</th>
    <th>{total.notable}</th>
    <th>{total.elevado}</th>
    <th>{total.grave}</th>
    {/* No olvides aquí también si deseas*/}
    <th className="btn-captura" />
  </tr>
</tbody>

            </table>

            {/* Subtablas (puestos) */}
            {data.map((r) =>
              expandedAreas.includes(r.area) && r.puestos.length > 0 ? (
                <div
                  key={r.area}
                  id={`tabla-area-${r.area}`}
                  className="puestos-separados-container"
                >
                  <h3>Puestos en {r.area}</h3>

                  <button className="btn-captura" onClick={() => capturarTablaArea(r.area)}>
                    📸 Capturar PNG
                  </button>

                  <table className="tabla-interna">
                    <thead>
                      <tr>
                        <th className="tabla-header">Puesto</th>
                        <th className="tolerable">Tolerable</th>
                        <th className="moderado">Moderado</th>
                        <th className="notable">Notable</th>
                        <th className="elevado">Elevado</th>
                        <th className="grave">Grave</th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.puestos.map((p, i) => (
                        <tr key={i}>
                          <td>{p.nombre}</td>
                          <td>{p.tolerable}</td>
                          <td>{p.moderado}</td>
                          <td>{p.notable}</td>
                          <td>{p.elevado}</td>
                          <td>{p.grave}</td>
                        </tr>
                      ))}

                      {(() => {
                        const t = r.puestos.reduce(
                          (a, p) => ({
                            tolerable: a.tolerable + p.tolerable,
                            moderado: a.moderado + p.moderado,
                            notable: a.notable + p.notable,
                            elevado: a.elevado + p.elevado,
                            grave: a.grave + p.grave,
                          }),
                          { tolerable: 0, moderado: 0, notable: 0, elevado: 0, grave: 0 }
                        );
                        return (
                          <tr className="fila-total-area">
                            <th>Total</th>
                            <th>{t.tolerable}</th>
                            <th>{t.moderado}</th>
                            <th>{t.notable}</th>
                            <th>{t.elevado}</th>
                            <th>{t.grave}</th>
                          </tr>
                        );
                      })()}
                    </tbody>
                  </table>
                </div>
              ) : null
            )}
          </div>
          {data.length > 0 && (
  <DashboardResumen
    data={data.map((area) => ({
      name: area.area,
      tolerable: area.tolerable,
      moderado: area.moderado,
      notable: area.notable,
      elevado: area.elevado,
      grave: area.grave,
    }))}
  />
)}
        </>
      )}
    </div>
    
  );
};



const COLORS = {
  tolerable: '#00BFFF', // Green for positive/tolerable
  moderado: '#5dd339ff',  // Yellow for moderate
  notable: '#f9fd15ff',   // Amber for notable
  elevado: '#FF7043',   // Orange for elevated
  grave: '#EF5350',     // Red for grave
};


const DashboardResumen = ({ data }) => {
  const chartWrapperRef = useRef(null);

  const capturarGrafica = async () => {
    const nodo = chartWrapperRef.current;
    if (!nodo) return;

    const btn = document.getElementById("btn-captura-grafica");
    if (btn) btn.classList.add("captura-hide");

    // Guarda estilos actuales
    const prev = {
      overflow: nodo.style.overflow,
      width: nodo.style.width,
      height: nodo.style.height,
    };

    // Expande al tamaño total scrolleable para que NO se recorte nada
    const fullWidth = nodo.scrollWidth || nodo.getBoundingClientRect().width;
    const fullHeight = nodo.scrollHeight || nodo.getBoundingClientRect().height;

    nodo.style.overflow = "visible";
    nodo.style.width = fullWidth + "px";
    nodo.style.height = fullHeight + "px";

    try {
      const canvas = await html2canvas(nodo, {
        scale: 2,
        backgroundColor: "#fff",
        useCORS: true,
        width: fullWidth,
        height: fullHeight,
      });

      const a = document.createElement("a");
      a.download = "Grafica_Resumen.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (e) {
      console.error(e);
      alert("Error al capturar la gráfica.");
    } finally {
      // Restaura estilos
      nodo.style.overflow = prev.overflow;
      nodo.style.width = prev.width;
      nodo.style.height = prev.height;
      if (btn) btn.classList.remove("captura-hide");
    }
  };

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h3 style={styles.title}>Visualización Gráfica por Área de Riesgo</h3>
        <button id="btn-captura-grafica" className="btn-captura" onClick={capturarGrafica}>
          📸 Capturar Gráfica
        </button>
      </div>

      {/* ⬇️ Este contenedor es el MISMO pero con ref; lo expandimos al capturar */}
      <div ref={chartWrapperRef} style={{ overflowX: "auto", overflowY: "hidden", background: "#fff", padding: 8 }}>
        <div style={{ width: `${data.length * 80}px`, minWidth: "100%" }}>
          <ResponsiveContainer width="100%" height={600}>
            <BarChart
              data={data}
              margin={{ top: 80, right: 30, left: 20, bottom: 80 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-30}
                textAnchor="end"
                height={80}
                style={styles.axisLabels}
              />
              <YAxis axisLine={false} tickLine={false} style={styles.axisLabels} />

              {data.slice(1).map((entry, index) => (
                <ReferenceLine
                  key={`sep-${index}`}
                  x={(index + 0.5).toString()}
                  stroke="#999"
                  strokeDasharray="3 3"
                  strokeWidth={0.7}
                />
              ))}

              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.1)" }}
                contentStyle={styles.tooltipContent}
                labelStyle={styles.tooltipLabel}
              />
              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={styles.legend}
                iconType="circle"
                formatter={(value) => (
                  <span style={styles.legendItemText}>
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </span>
                )}
              />

              <Bar dataKey="tolerable" stackId="a" fill={COLORS.tolerable} />
              <Bar dataKey="moderado" stackId="a" fill={COLORS.moderado} />
              <Bar dataKey="notable" stackId="a" fill={COLORS.notable} />
              <Bar dataKey="elevado" stackId="a" fill={COLORS.elevado} />
              <Bar dataKey="grave" stackId="a" fill={COLORS.grave} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '20px',
    textAlign: 'center',
  },
  axisLabels: {
    fontSize: '14px',
    fill: '#666',
  },
  tooltipContent: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: '4px',
    padding: '10px',
  },
  tooltipLabel: {
    fontWeight: 'bold',
  },
  legend: {
    paddingBottom: "20px",
    textAlign: "center",
  },
  legendItemText: {
    fontSize: '15px',
    color: '#333',
  },
};



export default TablaResumen;
