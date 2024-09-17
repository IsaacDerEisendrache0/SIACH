import React, { useState } from "react";
import "./Table30.css";

const TableComponent = () => {
  // Estado para manejar las selecciones de "Aplica" y "No Aplica"
  const [checkedStatus, setCheckedStatus] = useState({
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
            <th>CONDICIONES FÍSICAS PELIGROSAS O INSEGURAS</th>
            <th>Aplica</th>
            <th>No Aplica</th>
            <th>AGENTES</th>
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
            <td>Vapores orgánicos</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.gases.aplica}
                onChange={() => handleChange("gases", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.gases.noAplica}
                onChange={() => handleChange("gases", "noAplica")}
              />
            </td>
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
            <td>Aerosoles</td>
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
            <td>Exposición a gases tóxicos.</td>
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
            <td>Virus</td>
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
            <td>Exposición a ruidos elevados.</td>
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
            <td>Ruidos</td>
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
            <td>Temperaturas extremas.</td>
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
            <td>Temperaturas extremas</td>
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
