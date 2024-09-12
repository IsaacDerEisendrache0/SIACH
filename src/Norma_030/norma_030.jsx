import React from "react";
import "./Table30.css";

const TableComponent = () => {
  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th colSpan="7" className="company-header">
              AMERICAN INDUSTRIES, S.A. DE C.V. (PROYECTO XINLIDA)
            </th>
          </tr>
          <tr>
            <th colSpan="7" className="subtitle-header">
              6.1 DIAGNÓSTICO INTEGRAL POR ÁREA DE TRABAJO SOBRE LAS CONDICIONES DE SEGURIDAD Y SALUD EN EL CENTRO DE TRABAJO
            </th>
          </tr>
          <tr>
            <th rowSpan="29" className="vertical-header">
              MATERIA PRIMA
            </th>
            <th colSpan="3">
              CONDICIONES FÍSICAS PELIGROSAS O INSEGURAS QUE PUEDAN REPRESENTAR UN RIESGO EN LAS INSTALACIONES, PROCESOS, MAQUINARIA, EQUIPO, HERRAMIENTAS, MEDIOS DE TRANSPORTE, MATERIALES Y ENERGÍA.
            </th>
            <th colSpan="3">
              AGENTES FÍSICOS, QUÍMICOS Y BIOLÓGICOS CAPACES DE MODIFICAR LAS CONDICIONES DEL MEDIO AMBIENTE DEL CENTRO DE TRABAJO QUE, POR SUS PROPIEDADES, CONCENTRACIÓN, NIVEL Y TIEMPO DE EXPOSICIÓN O ACCIÓN, PUEDEN ALTERAR LA SALUD DE LOS TRABAJADORES, ASÍ COMO LAS FUENTES QUE LOS GENERAN.
            </th>
          </tr>
          <tr>
            <th>Área</th>
            <th>Aplica</th>
            <th>No Aplica</th>
            <th>Agentes Químicos</th>
            <th>Aplica</th>
            <th>No Aplica</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Caída de personas a distinto nivel.</td>
            <td>X</td>
            <td></td>
            <td></td>
            <td>Vapores orgánicos</td>
            <td></td>
          </tr>
          <tr>
            <td>Caída de personas al mismo nivel.</td>
            <td>X</td>
            <td></td>
            <td></td>
            <td>Gases</td>
            <td></td>
          </tr>
          <tr>
            <td>Caída de objetos desprendidos.</td>
            <td>X</td>
            <td></td>
            <td></td>
            <td>Aerosoles</td>
            <td></td>
          </tr>
          <tr>
            <td>Caída de objetos desgajados.</td>
            <td>X</td>
            <td></td>
            <td></td>
            <td>Polvos</td>
            <td></td>
          </tr>
          <tr>
            <td>Choque contra objetos inmóviles.</td>
            <td>X</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Choque contra objetos móviles.</td>
            <td>X</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Golpes/cortes por objetos o herramientas.</td>
            <td>X</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Proyección de fragmentos o herramientas.</td>
            <td>X</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Proyección de fluidos o materiales calientes.</td>
            <td>X</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Sobre esfuerzo por carga manual.</td>
            <td>X</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Exposición a temperaturas extremas ambientales.</td>
            <td>X</td>
            <td></td>
            <td></td>
            <td>Ruidos</td>
            <td></td>
          </tr>
          <tr>
            <td>Contactos eléctricos: directos e indirectos.</td>
            <td>X</td>
            <td></td>
            <td></td>
            <td>Vibraciones</td>
            <td></td>
          </tr>
          <tr>
            <td>Exposición a sustancias químicas tóxicas.</td>
            <td>X</td>
            <td></td>
            <td>Iluminación</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Exposición a radiaciones ionizantes.</td>
            <td>X</td>
            <td></td>
            <td>Radiaciones ionizantes</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Incendios.</td>
            <td>X</td>
            <td></td>
            <td>Radiaciones no ionizantes</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Explosiones.</td>
            <td>X</td>
            <td></td>
            <td>Temperaturas extremas</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Accidentes causados por seres vivos.</td>
            <td>X</td>
            <td></td>
            <td>Agentes biológicos</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>Atropellos o golpes de vehículos.</td>
            <td>X</td>
            <td></td>
            <td></td>
            <td>Virus</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Bacterias</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Hongos</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>Residuos Biológico-Infecciosos</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
