import React, { useState } from "react";
import "./Table30.css";

const TableComponent = () => {
  // Estado para manejar las selecciones de "Aplica" y "No Aplica"
  const [checkedStatus, setCheckedStatus] = useState({
    polvos2: { aplica: false, noAplica: false },
    virus2: { aplica: false, noAplica: false },
    bacterias2: { aplica: false, noAplica: false },
    hongos2: { aplica: false, noAplica: false },
    residuosbi2: { aplica: false, noAplica: false },
    ruido2: { aplica: false, noAplica: false },
    vibraciones2: { aplica: false, noAplica: false },
    iluminacion3: { aplica: false, noAplica: false },
    radiacionesi2: { aplica: false, noAplica: false },
    radiacionesnoi: { aplica: false, noAplica: false },
    temperaturas2: { aplica: false, noAplica: false },
    p1: { aplica: false, noAplica: false },
    p2: { aplica: false, noAplica: false },
    p3: { aplica: false, noAplica: false },
    p4: { aplica: false, noAplica: false },
    p5: { aplica: false, noAplica: false },
    p6: { aplica: false, noAplica: false },
    p7: { aplica: false, noAplica: false },
    p8: { aplica: false, noAplica: false },
    p9: { aplica: false, noAplica: false },
    p10: { aplica: false, noAplica: false },
    p11: { aplica: false, noAplica: false },
    p12: { aplica: false, noAplica: false },
    p13: { aplica: false, noAplica: false },
    p14: { aplica: false, noAplica: false },
    p15: { aplica: false, noAplica: false },
    p16: { aplica: false, noAplica: false },
    p17: { aplica: false, noAplica: false },
 
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
              OFICINAS
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
            <td>vapores origanicos</td>
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
            <td>gases</td>
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
            <td>aerosoles</td>
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
            <td>metales</td>
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
                checked={checkedStatus.p1.aplica}
                onChange={() => handleChange("p1", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p1.noAplica}
                onChange={() => handleChange("p1", "noAplica")}
              />
            </td>
            <td>polvos</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.polvos2.aplica}
                onChange={() => handleChange("polvos2", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.polvos2.noAplica}
                onChange={() => handleChange("polvos2", "noAplica")}
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
                checked={checkedStatus.p2.aplica}
                onChange={() => handleChange("p2", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p2.noAplica}
                onChange={() => handleChange("p2", "noAplica")}
              />
            </td>
            <td></td>
            
          </tr>


            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Choque contra objetos móviles.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p3.aplica}
                onChange={() => handleChange("p3", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p3.noAplica}
                onChange={() => handleChange("p3", "noAplica")}
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
                checked={checkedStatus.p4.aplica}
                onChange={() => handleChange("p4", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p4.noAplica}
                onChange={() => handleChange("p4", "noAplica")}
              />
            </td>
            <td>Virus
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.virus2.aplica}
                onChange={() => handleChange("virus2", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.virus2.noAplica}
                onChange={() => handleChange("virus2", "noAplica")}
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
                checked={checkedStatus.p5.aplica}
                onChange={() => handleChange("p5", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p5.noAplica}
                onChange={() => handleChange("p5", "noAplica")}
              />
            </td>
            <td>Bacterias</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.bacterias2.aplica}
                onChange={() => handleChange("bacterias2", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.bacterias2.noAplica}
                onChange={() => handleChange("bacterias2", "noAplica")}
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
                checked={checkedStatus.p6.aplica}
                onChange={() => handleChange("p6", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p6.noAplica}
                onChange={() => handleChange("p6", "noAplica")}
              />
            </td>
            <td>Hongos</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.hongos2.aplica}
                onChange={() => handleChange("hongos2", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.hongos2.noAplica}
                onChange={() => handleChange("hongos2", "noAplica")}
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
                checked={checkedStatus.p7.aplica}
                onChange={() => handleChange("p7", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p7.noAplica}
                onChange={() => handleChange("p7", "noAplica")}
              />
            </td>
            <td>residuos Biologicos e infecciosos</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.residuosbi2.aplica}
                onChange={() => handleChange("residuosbi2", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.residuosbi2.noAplica}
                onChange={() => handleChange("residuosbi2", "noAplica")}
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
                checked={checkedStatus.p8.aplica}
                onChange={() => handleChange("p8", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p8.noAplica}
                onChange={() => handleChange("p8", "noAplica")}
              />
            </td>
            <td></td>
            
          </tr>

            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Contacto con sustancias corrosivas o tóxicas. </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p9.aplica}
                onChange={() => handleChange("p9", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p9.noAplica}
                onChange={() => handleChange("p9", "noAplica")}
              />
            </td>
            <td></td>
           
          </tr>

            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Exposición a temperaturas extremas ambientales.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p10.aplica}
                onChange={() => handleChange("p10", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p10.noAplica}
                onChange={() => handleChange("p10", "noAplica")}
              />
            </td>
            <td style={{ color: 'white', backgroundColor: 'red' }}>fisicos</td>

           
          </tr>

            {/* Agregar las filas faltantes */}
            <tr>
            <td></td>
            <td>Contactos térmicos.</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p11.aplica}
                onChange={() => handleChange("p11", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p11.noAplica}
                onChange={() => handleChange("p11", "noAplica")}
              />
            </td>
            <td>Ruido</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.ruido2.aplica}
                onChange={() => handleChange("ruido2", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.ruido2.noAplica}
                onChange={() => handleChange("ruido2", "noAplica")}
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
                checked={checkedStatus.p12.aplica}
                onChange={() => handleChange("p12", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p12.noAplica}
                onChange={() => handleChange("p12", "noAplica")}
              />
            </td>
            <td>Vibraciones</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.vibraciones2.aplica}
                onChange={() => handleChange("vibraciones2", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.vibraciones2.noAplica}
                onChange={() => handleChange("vibraciones2", "noAplica")}
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
                checked={checkedStatus.p13.aplica}
                onChange={() => handleChange("p13", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p13.noAplica}
                onChange={() => handleChange("p13", "noAplica")}
              />
            </td>
            <td>Iluminación</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.iluminacion3.aplica}
                onChange={() => handleChange("iluminacion3", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.iluminacion3.noAplica}
                onChange={() => handleChange("iluminacion3", "noAplica")}
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
                checked={checkedStatus.p14.aplica}
                onChange={() => handleChange("p14", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p14.noAplica}
                onChange={() => handleChange("p14", "noAplica")}
              />
            </td>
            <td>radioaciones ionizantes</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.radiacionesi2.aplica}
                onChange={() => handleChange("radiacionesi2", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.radiacionesi2.noAplica}
                onChange={() => handleChange("radiacionesi2", "noAplica")}
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
                checked={checkedStatus.p15.aplica}
                onChange={() => handleChange("p15", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p15.noAplica}
                onChange={() => handleChange("p15", "noAplica")}
              />
            </td>
            <td>Radiaciones no ionizantes</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.radiacionesnoi.aplica}
                onChange={() => handleChange("radiacionesnoi", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.radiacionesnoi.noAplica}
                onChange={() => handleChange("radiacionesnoi", "noAplica")}
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
                checked={checkedStatus.p16.aplica}
                onChange={() => handleChange("p16", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p16.noAplica}
                onChange={() => handleChange("p16", "noAplica")}
              />
            </td>
            <td>Temperaturas</td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.temperaturas2.aplica}
                onChange={() => handleChange("temperaturas2", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.temperaturas2.noAplica}
                onChange={() => handleChange("temperaturas2", "noAplica")}
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
                checked={checkedStatus.p17.aplica}
                onChange={() => handleChange("p17", "aplica")}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={checkedStatus.p17.noAplica}
                onChange={() => handleChange("p17", "noAplica")}
              />
            </td>
           
           
          </tr>
 

            

        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;