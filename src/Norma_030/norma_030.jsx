import React, { useState } from "react";
import "./Table30.css";

const TableComponent = () => {
  // Estado para manejar las selecciones de "Aplica" y "No Aplica"
  const [checkedStatus, setCheckedStatus] = useState({
    gases2: { aplica: false, noAplica: false },
    vapors: { aplica: false, noAplica: false },
    gases: { aplica: false, noAplica: false },
    aerosols: { aplica: false, noAplica: false },
    powders: { aplica: false, noAplica: false },
    viruses: { aplica: false, noAplica: false },
    bacteria: { aplica: false, noAplica: false },
    fungi: { aplica: false, noAplica: false },
    bioInfectiousWaste: { aplica: false, noAplica: false },
    lighting: { aplica: false, noAplica: false },
    ionizingRadiation: { aplica: false, noAplica: false },
    nonIonizingRadiation: { aplica: false, noAplica: false },
    extremeTemperatures: { aplica: false, noAplica: false },
    noise: { aplica: false, noAplica: false },
    vibration: { aplica: false, noAplica: false },
    poorVentilation: { aplica: false, noAplica: false },
    toxicGases: { aplica: false, noAplica: false },
    chemicalSpills: { aplica: false, noAplica: false },
    flammableMaterials: { aplica: false, noAplica: false },
    mechanicalHazards: { aplica: false, noAplica: false },
    electricalHazards: { aplica: false, noAplica: false },
    ergonomicRisks: { aplica: false, noAplica: false },
    biologicalHazards: { aplica: false, noAplica: false },
    psychosocialRisks: { aplica: false, noAplica: false },
    accidentalFalls: { aplica: false, noAplica: false },
    confinedSpaces: { aplica: false, noAplica: false }
  });

  // Función para actualizar el estado de los checkboxes
  const handleChange = (agent, type) => {
    setCheckedStatus((prevState) => ({
      ...prevState,
      [agent]: {
        ...prevState[agent],
        [type]: !prevState[agent][type], // Cambia el checkbox clicado
        ...(type === "aplica" ? { noAplica: false } : { aplica: false }) // Desmarca el otro checkbox
      }
    }));
  };

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
              6.1 DIAGNÓSTICO INTEGRAL POR ÁREA DE TRABAJO SOBRE LAS CONDICIONES
              DE SEGURIDAD Y SALUD EN EL CENTRO DE TRABAJO
            </th>
          </tr>
          <tr>
            <th rowSpan="29" className="vertical-header">
              CUARTO DE RESIDUOS
            </th>
            <th>CONDICIONES FÍSICAS PELIGROSAS O INSEGURAS QUE PUEDAN REPRESENTAR UN RIESGO EN LAS
INSTALACIONES, PROCESOS, MAQUINARIA, EQUIPO, HERRAMIENTAS, MEDIOS DE TRANSPORTE,
MATERIALES Y ENERGÍA.</th>
            <th>Aplica</th>
            <th>No Aplica</th>
            <th>AGENTES FÍSICOS, QUÍMICOS Y BIOLÓGICOS CAPACES DE MODIFICAR LAS CONDICIONES DEL MEDIO
AMBIENTE DEL CENTRO DE TRABAJO QUE, POR SUS PROPIEDADES, CONCENTRACIÓN, NIVEL Y TIEMPO DE
EXPOSICIÓN O ACCIÓN, PUEDEN ALTERAR LA SALUD DE LOS TRABAJADORES, ASÍ COMO LAS FUENTES QUE
LOS GENERAN.</th>
            <th>Aplica</th>
            <th>No Aplica</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td>Caída de personas a distinto nivel.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.vapors.aplica}
                onChange={() => handleChange("vapors", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.vapors.noAplica}
                onChange={() => handleChange("vapors", "noAplica")}
              />
            </td>
            <td style={{ color: 'white', backgroundColor: 'red' }}>Quimicos</td>

          </tr>
          <tr>
            <td></td>
            <td>Caída de personas al mismo nivel.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.aerosols.aplica}
                onChange={() => handleChange("aerosols", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.aerosols.noAplica}
                onChange={() => handleChange("aerosols", "noAplica")}
              />
            </td>
            <td>gases</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.powders.aplica}
                onChange={() => handleChange("powders", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.powders.noAplica}
                onChange={() => handleChange("powders", "noAplica")}
              />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>Caida de objetos por desplome o derrumbamiento.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.viruses.aplica}
                onChange={() => handleChange("viruses", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.viruses.noAplica}
                onChange={() => handleChange("viruses", "noAplica")}
              />
            </td>
            <td>aerosoles</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.bacteria.aplica}
                onChange={() => handleChange("bacteria", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.bacteria.noAplica}
                onChange={() => handleChange("bacteria", "noAplica")}
              />
            </td>
          </tr>
          {/* Añadiendo más filas con diferentes agentes */}
          <tr>
            <td></td>
            <td>Caida de objetos desprendidos.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.noise.aplica}
                onChange={() => handleChange("noise", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.noise.noAplica}
                onChange={() => handleChange("noise", "noAplica")}
              />
            </td>
            <td>metales</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.vibration.aplica}
                onChange={() => handleChange("vibration", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.vibration.noAplica}
                onChange={() => handleChange("vibration", "noAplica")}
              />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>	Caida de objetos en mano. </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.extremeTemperatures.aplica}
                onChange={() => handleChange("extremeTemperatures", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.extremeTemperatures.noAplica}
                onChange={() => handleChange("extremeTemperatures", "noAplica")}
              />
            </td>
            <td>polvos</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.ionizingRadiation.aplica}
                onChange={() => handleChange("ionizingRadiation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.ionizingRadiation.noAplica}
                onChange={() => handleChange("ionizingRadiation", "noAplica")}
              />
            </td>
          </tr>
          {/* Agregar las filas faltantes */}
          <tr>
            <td></td>
            <td>Pisada sobre objetos.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td></td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>

            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Choque contra objetos inmóviles</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td></td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>


            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Choque contra objetos móviles.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td style={{ color: 'white', backgroundColor: 'red' }}>Biologicos</td>
            
           
          </tr>

            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Golpes/cortes por objetos o herramientas.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td>residuos biologicos e infecciosos
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>

            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Proyección de fragmentos o herramientas.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td>Ruido</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>

            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Atrapamiento por o entre objetos.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td>Vibraciones</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>

            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Iluminación insuficiente o excesiva.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td>Iluminación</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>

            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Atrapamiento por vuelco de maquinaría y equipo.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td></td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>

            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Contacto con sustancias corrosivas o tóxicas. </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td>Radiaciones No Ionizantes</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>

            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Exposición a temperaturas extremas ambientales.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td style={{ color: 'white', backgroundColor: 'red' }}>fisicos</td>

            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>

            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Contactos térmicos.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td>Iluminación</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>


            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Contactos eléctricos: directos e indirectos.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td>Iluminación</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>

            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Exposición a sustancias nócivas o tóxicas.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td>Iluminación</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>


            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Explosiones.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td>Iluminación</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>

            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Incendios.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td>Iluminación</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>


            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Accidentes causados por seres vivos.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td>Iluminación</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>

          {/* Agregar las filas faltantes */}
          <tr>
            <td></td>
            <td>Atropellos o golpes de vehículos.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td>Iluminación</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>
          
{/* Agregar las filas faltantes */}
<tr>
            <td></td>
            <td>Iluminación insuficiente o excesiva.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.aplica}
                onChange={() => handleChange("lighting", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.lighting.noAplica}
                onChange={() => handleChange("lighting", "noAplica")}
              />
            </td>
            <td>Iluminación</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.aplica}
                onChange={() => handleChange("poorVentilation", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.poorVentilation.noAplica}
                onChange={() => handleChange("poorVentilation", "noAplica")}
              />
            </td>
          </tr>
          

            

        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;
