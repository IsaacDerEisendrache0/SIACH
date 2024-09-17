import React, { useState } from "react";
import "./Table30.css";

const TableComponent = () => {
  // Estado para manejar las selecciones de agentes
  const [agentsStatus, setAgentsStatus] = useState({
    chemical: { vapors: false, gases: false, aerosols: false, powders: false },
    biological: { viruses: false, bacteria: false, fungi: false, bioInfectiousWaste: false },
    physical: { lighting: false, ionizingRadiation: false, nonIonizingRadiation: false, extremeTemperatures: false }
  });

  // Función para actualizar el estado de los agentes
  const handleChange = (category, agent) => {
    setAgentsStatus(prevState => ({
      ...prevState,
      [category]: {
        ...prevState[category],
        [agent]: !prevState[category][agent]
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
              6.1 DIAGNÓSTICO INTEGRAL POR ÁREA DE TRABAJO SOBRE LAS CONDICIONES DE SEGURIDAD Y SALUD EN EL CENTRO DE TRABAJO
            </th>
          </tr>
          <tr>
            <th rowSpan="29" className="vertical-header">
              CUARTO DE RESIDUOS
            </th>
            
           
          </tr>
          <tr>
            <th>CONDICIONES FÍSICAS PELIGROSAS O INSEGURAS QUE PUEDAN REPRESENTAR UN RIESGO EN LAS INSTALACIONES, PROCESOS, MAQUINARIA, EQUIPO, HERRAMIENTAS, MEDIOS DE TRANSPORTE, MATERIALES Y ENERGÍA.</th>
            <th>Aplica</th>
            <th>No Aplica</th>
            <th>AGENTES FÍSICOS, QUÍMICOS Y BIOLÓGICOS CAPACES DE MODIFICAR LAS CONDICIONES DEL MEDIO AMBIENTE DEL CENTRO DE TRABAJO QUE, POR SUS PROPIEDADES, CONCENTRACIÓN, NIVEL Y TIEMPO DE EXPOSICIÓN O ACCIÓN, PUEDEN ALTERAR LA SALUD DE LOS TRABAJADORES, ASÍ COMO LAS FUENTES QUE LOS GENERAN.</th>
            <th>Aplica</th>
            <th>No Aplica</th>
          </tr>
        </thead>
        <tbody>
          {/* Agentes Químicos */}
          
          <tr>
            <td></td>
            <td>Caída de personas a distinto nivel.</td>
            <td>
            <input
                type="checkbox"
                checked={agentsStatus.chemical.vapors}
                onChange={() => handleChange('chemical', 'vapors')}
              />
            </td>
            <td>
              
              <input
                type="checkbox"
                checked={agentsStatus.chemical.vapors}
                onChange={() => handleChange('chemical', 'vapors')}
              />
            </td>
            <td>  Vapores orgánicos </td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Caída de personas al mismo nivel.</td>
            <td>
            <input
                type="checkbox"
                checked={agentsStatus.chemical.vapors}
                onChange={() => handleChange('chemical', 'vapors')}
              />
            </td>
            <td>
              
              <input
                type="checkbox"
                checked={agentsStatus.chemical.gases}
                onChange={() => handleChange('chemical', 'gases')}
              />
            </td>
            <td>Gases </td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Caída de objetos desprendidos</td>
            
            <td>
            <input
                type="checkbox"
                checked={agentsStatus.chemical.aerosols}
                onChange={() => handleChange('chemical', 'aerosols')}
              />
            </td>
            <td>
              
              <input
                type="checkbox"
                checked={agentsStatus.chemical.aerosols}
                onChange={() => handleChange('chemical', 'aerosols')}
              />
            </td>
            <td> Aerosoles </td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Caída de objetos desgajados</td>
            <td>
            <input
                type="checkbox"
                checked={agentsStatus.chemical.aerosols}
                onChange={() => handleChange('chemical', 'aerosols')}
              />
            </td>
            <td>
              
              <input
                type="checkbox"
                checked={agentsStatus.chemical.powders}
                onChange={() => handleChange('chemical', 'powders')}
              />
            </td>
            <td>Polvos</td>
            <td></td>
          </tr>

    
          <tr>
            <td></td>
            <td>Choque contra objetos inmóviles.</td>
            <td>
                 <input
                type="checkbox"
                checked={agentsStatus.chemical.aerosols}
                onChange={() => handleChange('chemical', 'aerosols')}
              />
            </td>
            <td>
              
              <input
                type="checkbox"
                checked={agentsStatus.biological.viruses}
                onChange={() => handleChange('biological', 'viruses')}
              />
            </td>
            <td> Virus </td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Choque contra objetos móviles.</td>
            <td>
            <input
                type="checkbox"
                checked={agentsStatus.chemical.aerosols}
                onChange={() => handleChange('chemical', 'aerosols')}
              />
            </td>
            <td>
              
              <input
                type="checkbox"
                checked={agentsStatus.biological.bacteria}
                onChange={() => handleChange('biological', 'bacteria')}
              />
            </td>
            <td> Bacterias </td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Golpes/cortes por objetos o herramientas.</td>
            <td>
            <input
                type="checkbox"
                checked={agentsStatus.chemical.aerosols}
                onChange={() => handleChange('chemical', 'aerosols')}
              />
            </td>
            <td>
              
              <input
                type="checkbox"
                checked={agentsStatus.biological.fungi}
                onChange={() => handleChange('biological', 'fungi')}
              />
            </td>
            <td> Hongos </td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Proyección de fragmentos o herramientas.</td>
            <td>
            <input
                type="checkbox"
                checked={agentsStatus.chemical.aerosols}
                onChange={() => handleChange('chemical', 'aerosols')}
              />
            </td>
            <td>
              
              <input
                type="checkbox"
                checked={agentsStatus.biological.bioInfectiousWaste}
                onChange={() => handleChange('biological', 'bioInfectiousWaste')}
              />
            </td>
            <td> Residuos Biológico-Infecciosos </td>
            <td></td>
          </tr>

    
          <tr>
            <td></td>
            <td>Proyección de fluidos o materiales calientes.</td>
            <td>
            <input
                type="checkbox"
                checked={agentsStatus.chemical.aerosols}
                onChange={() => handleChange('chemical', 'aerosols')}
              />
            </td>
            <td>
              
              <input
                type="checkbox"
                checked={agentsStatus.physical.lighting}
                onChange={() => handleChange('physical', 'lighting')}
              />
            </td>
            <td> Iluminación </td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Sobre esfuerzo por carga manual.</td>
            <td>
            <input
                type="checkbox"
                checked={agentsStatus.chemical.aerosols}
                onChange={() => handleChange('chemical', 'aerosols')}
              />
            </td>
            <td>
              
              <input
                type="checkbox"
                checked={agentsStatus.physical.ionizingRadiation}
                onChange={() => handleChange('physical', 'ionizingRadiation')}
              />
            </td>
            <td>Radiaciones ionizantes</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Exposición a temperaturas extremas ambientales.</td>
            <td>
            <input
                type="checkbox"
                checked={agentsStatus.chemical.aerosols}
                onChange={() => handleChange('chemical', 'aerosols')}
              />
            </td>
            <td>
              
              <input
                type="checkbox"
                checked={agentsStatus.physical.nonIonizingRadiation}
                onChange={() => handleChange('physical', 'nonIonizingRadiation')}
              />
            </td>
            <td>Radiaciones no ionizantes</td>
            <td></td>
          </tr>
          <tr>
            <td></td>
            <td>Contactos eléctricos: directos e indirectos.</td>
            <td>
            <input
                type="checkbox"
                checked={agentsStatus.chemical.aerosols}
                onChange={() => handleChange('chemical', 'aerosols')}
              />
            </td>
            <td>
              
              <input
                type="checkbox"
                checked={agentsStatus.physical.extremeTemperatures}
                onChange={() => handleChange('physical', 'extremeTemperatures')}
              />
            </td>
            <td>Temperaturas extremas</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;