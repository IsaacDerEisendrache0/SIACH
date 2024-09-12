import React from 'react';
import './Table30.css'; // Asegúrate de crear este archivo CSS con el estilo que te daré

const SafetyTable = () => {
  return (
    <div className="table-container">
      <table className="safety-table">
        <thead>
          <tr>
            <td colSpan="5" className="main-header">
              <div className="header-logo">
                <img src="ruta_logo_izquierda" alt="Logo izquierda" />
              </div>
              <div className="header-title">
                AMERICAN INDUSTRIES, S.A. DE C.V. (PROYECTO XINLIDA)
                <br />
                <span className="sub-header">
                  DIRECCIÓN: AV. LIBRE COMERCIO No. 21641 INT. 3 PARQUE INDUSTRIAL AMERICAS CP. 32956
                </span>
              </div>
              <div className="header-logo">
                <img src="ruta_logo_derecha" alt="Logo derecha" />
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="5" className="sub-header">
              6.1 DIAGNÓSTICO INTEGRAL O POR ÁREA DE TRABAJO SOBRE LAS CONDICIONES DE SEGURIDAD Y SALUD EN EL CENTRO DE TRABAJO
            </td>
          </tr>
          <tr>
            <td className="area-header" rowSpan="2">ÁREA</td>
            <td className="condition-header" rowSpan="2">
              CONDICIONES FÍSICAS PELIGROSAS O INSEGURAS QUE PUEDAN REPRESENTAR UN RIESGO EN LAS INSTALACIONES, PROCESOS, MAQUINARIA, EQUIPO, HERRAMIENTAS, MEDIOS DE TRANSPORTE, MATERIALES Y ENERGÍA.
            </td>
            <td colSpan="2" className="apply-header">APLICA</td>
            <td className="agent-header" rowSpan="2">
              AGENTES FÍSICOS, QUÍMICOS Y BIOLÓGICOS CAPACES DE MODIFICAR LAS CONDICIONES DEL MEDIO AMBIENTE EN EL CENTRO DE TRABAJO O QUE, POR SUS PROPIEDADES, CONCENTRACIÓN, NIVEL Y TIEMPO DE EXPOSICIÓN O ACCIÓN, PUEDEN ALTERAR LA SALUD DE LOS TRABAJADORES, ASÍ COMO LAS FUENTES QUE LOS GENERAN.
            </td>
          </tr>
          <tr>
            <td className="apply-header">SI</td>
            <td className="apply-header">NO</td>
          </tr>
        </thead>
        <tbody>
          {/* Ejemplo de una fila de datos, deberás replicar esta estructura para cada fila */}
          <tr>
            <td className="area-side-text" rowSpan="18">MATERIA PRIMA</td>
            <td>Caída de personas a distinto nivel.</td>
            <td className="apply-cell">x</td>
            <td className="apply-cell"></td>
            <td className="agent-header">QUÍMICOS</td>
          </tr>
          <tr>
            <td>Caída de personas al mismo nivel.</td>
            <td className="apply-cell"></td>
            <td className="apply-cell">x</td>
            <td>Vapores orgánicos</td>
          </tr>
          <tr>
            <td>Caída de objetos en altura.</td>
            <td className="apply-cell">x</td>
            <td className="apply-cell"></td>
            <td>Gases</td>
          </tr>
          {/* Continua replicando las filas como se muestra en la imagen */}
        </tbody>
      </table>
    </div>
  );
};

export default SafetyTable;