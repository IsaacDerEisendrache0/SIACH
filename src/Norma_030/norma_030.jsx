import React, { useState } from 'react';
import './Table30.css'; // Asegúrate de tener el archivo CSS correcto.

const AreaTable = () => {
  const [areaName, setAreaName] = useState('');
  const [checkedStatus, setCheckedStatus] = useState({
    vapors: { aplica: false, noAplica: false },
    aerosols: { aplica: false, noAplica: false },
    powders: { aplica: false, noAplica: false },
    noise: { aplica: false, noAplica: false },
    vibration: { aplica: false, noAplica: false },
    extremeTemperatures: { aplica: false, noAplica: false },
    ionizingRadiation: { aplica: false, noAplica: false },
    gases: { aplica: false, noAplica: false },
    chemicals: { aplica: false, noAplica: false },
    toxicSubstances: { aplica: false, noAplica: false },
    mechanicalHazards: { aplica: false, noAplica: false },
    electricalHazards: { aplica: false, noAplica: false },
    fireRisks: { aplica: false, noAplica: false },
    biological: { aplica: false, noAplica: false },
    fungus: { aplica: false, noAplica: false },
    bioInfectiousWaste: { aplica: false, noAplica: false },
    explosions: { aplica: false, noAplica: false },
    trappedByMachinery: { aplica: false, noAplica: false },
    overexertion: { aplica: false, noAplica: false },
    thermalContact: { aplica: false, noAplica: false },
    electricContact: { aplica: false, noAplica: false },
    livingBeingsAccidents: { aplica: false, noAplica: false },
    vehicleAccidents: { aplica: false, noAplica: false },
    corrosiveContact: { aplica: false, noAplica: false },
    lighting: { aplica: false, noAplica: false },
    nonIonizingRadiation: { aplica: false, noAplica: false },
    temperature: { aplica: false, noAplica: false },
    sharpObjects: { aplica: false, noAplica: false },
    projectionOfFragments: { aplica: false, noAplica: false },
    viruses: { aplica: false, noAplica: false },
    bacteria: { aplica: false, noAplica: false },
    // Agregar más estados según sea necesario
  });

  const nomChecklist = {
    'NOM-001': ['vapors', 'aerosols'],
    'NOM-002': ['viruses', 'powders'],
    'NOM-003': ['noise', 'vibration'],
    'NOM-004': ['extremeTemperatures', 'ionizingRadiation'],
    'NOM-005': ['gases', 'chemicals'],
    'NOM-006': ['toxicSubstances', 'mechanicalHazards'],
    'NOM-007': ['electricalHazards', 'fireRisks', 'explosions', 'trappedByMachinery'],
    'NOM-008': ['biological', 'fungus', 'bioInfectiousWaste', 'livingBeingsAccidents', 'vehicleAccidents'],
    'NOM-009': ['overexertion', 'thermalContact', 'electricContact'],
    'NOM-010': ['corrosiveContact', 'lighting', 'nonIonizingRadiation'],
    'NOM-011': ['temperature', 'sharpObjects', 'projectionOfFragments'],
    'NOM-012': ['viruses', 'bacteria'],
    // Agregar más NOMs y sus checkboxes correspondientes según sea necesario
  };

  const handleChange = (key, subKey) => {
    setCheckedStatus(prevStatus => {
      const newCheckedStatus = {
        ...prevStatus,
        [key]: {
          ...prevStatus[key],
          [subKey]: !prevStatus[key][subKey],
        },
      };
      return newCheckedStatus;
    });
  };

  const getRelatedNoms = () => {
    const appliedNoms = [];

    Object.keys(nomChecklist).forEach(nom => {
      nomChecklist[nom].forEach(option => {
        if (checkedStatus[option]?.aplica) {
          appliedNoms.push(nom);
        }
      });
    });

    return [...new Set(appliedNoms)]; // Elimina duplicados
  };

  return (
    <div className="table-container">
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="areaInput">Nombre del área:</label>
        <input
          type="text"
          id="areaInput"
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

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
              {areaName}
            </th>
            <th>
              CONDICIONES FÍSICAS PELIGROSAS O INSEGURAS QUE PUEDAN REPRESENTAR UN RIESGO EN LAS
              INSTALACIONES, PROCESOS, MAQUINARIA, EQUIPO, HERRAMIENTAS, MEDIOS DE TRANSPORTE,
              MATERIALES Y ENERGÍA.
            </th>
            <th>Aplica</th>
            <th>No Aplica</th>
            <th>
              AGENTES FÍSICOS, QUÍMICOS Y BIOLÓGICOS CAPACES DE MODIFICAR LAS CONDICIONES DEL MEDIO
              AMBIENTE DEL CENTRO DE TRABAJO QUE, POR SUS PROPIEDADES, CONCENTRACIÓN, NIVEL Y TIEMPO DE
              EXPOSICIÓN O ACCIÓN, PUEDEN ALTERAR LA SALUD DE LOS TRABAJADORES, ASÍ COMO LAS FUENTES QUE
              LOS GENERAN.
            </th>
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
            <td style={{ color: 'white', backgroundColor: 'red' }}>Químicos</td>
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
            <td>Vapores orgánicos</td>
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
          {/* Agrega más filas con condiciones según sea necesario */}
          {/* Ejemplo de más filas */}
          <tr>
            <td></td>
            <td>Incendios.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.fireRisks.aplica}
                onChange={() => handleChange("fireRisks", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.fireRisks.noAplica}
                onChange={() => handleChange("fireRisks", "noAplica")}
              />
            </td>
            <td>Explosiones</td>
          </tr>
          {/* Agrega más filas según las normas que falten */}
        </tbody>
      </table>

      <div className="related-noms">
        <h3>NOMs aplicables a esta área:</h3>
        <ul>
          {getRelatedNoms().map((nom) => (
            <li key={nom}>{nom}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AreaTable;
