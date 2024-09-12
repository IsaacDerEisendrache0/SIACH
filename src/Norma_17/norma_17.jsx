import React, { useState } from 'react';
import './Table.css'; // Asegúrate de que este archivo esté disponible para aplicar los estilos

const RiskAssessmentTable = () => {
  const [inspectionDate, setInspectionDate] = useState('2023-03-15');
  const [area, setArea] = useState('Producción');
  const [exposureTime, setExposureTime] = useState('8 hrs');

  const [selectedHazards, setSelectedHazards] = useState({
    heightFall: true,
    temperatureExposure: false,
    staticElectricity: true,
    chemicalExposure: true,
    radiationExposure: false,
    biologicalAgents: false,
    noiseExposure: true,
    vibrationsExposure: false,
    cuttingSurfaces: true,
    levelFall: true,
    ergonomicDamage: true,
    materialHeating: false,
    materialProjection: false,
    maintenance: false
  });

  const handleHazardChange = (hazard) => {
    setSelectedHazards((prevHazards) => ({
      ...prevHazards,
      [hazard]: !prevHazards[hazard]
    }));
  };

  const isBodyPartExposed = (bodyPart) => {
    switch (bodyPart) {
      case 'Cabeza y Oídos':
        return selectedHazards.heightFall || selectedHazards.noiseExposure || selectedHazards.materialProjection;
      case 'Ojos y Cara':
        return selectedHazards.radiationExposure || selectedHazards.chemicalExposure;
      case 'Brazos y Manos':
        return selectedHazards.materialProjection || selectedHazards.chemicalExposure;
      case 'Tronco':
        return selectedHazards.ergonomicDamage || selectedHazards.staticElectricity;
      case 'Sistema respiratorio':
        return selectedHazards.biologicalAgents || selectedHazards.chemicalExposure;
      case 'Miembros inferiores':
        return selectedHazards.heightFall || selectedHazards.levelFall;
      default:
        return false;
    }
  };

  return (
    <table className="risk-table">
      <thead>
        <tr>
          <td className="header" colSpan="6">Puesto de trabajo: Ayudante de empaque y envase.</td>
          <td className="header">
            Área: 
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </td>
        </tr>
        <tr>
          <td className="header" colSpan="6">Descripción de la actividad: Recibir, alistar, empacar y entregar productos en condiciones adecuadas de aseo e higiene.</td>
          <td className="header">
            Fecha de inspección: 
            <input
              type="date"
              value={inspectionDate}
              onChange={(e) => setInspectionDate(e.target.value)}
            />
          </td>
        </tr>
        <tr>
          <td className="header" colSpan="6">Principales partes del cuerpo expuestas al riesgo:</td>
          <td className="header">
            Tiempo de exposición: 
            <input
              type="text"
              value={exposureTime}
              onChange={(e) => setExposureTime(e.target.value)}
            />
          </td>
        </tr>
        <tr>
          <td className="sub-header">Cabeza y Oídos</td>
          <td className="sub-header">Ojos y Cara</td>
          <td className="sub-header">Brazos y Manos</td>
          <td className="sub-header">Tronco</td>
          <td className="sub-header">Sistema respiratorio</td>
          <td className="sub-header">Miembros inferiores</td>
          <td className="sub-header">Sistema de protección sugerido</td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="body-cell">{isBodyPartExposed('Cabeza y Oídos') ? 'X' : ''}</td>
          <td className="body-cell">{isBodyPartExposed('Ojos y Cara') ? 'X' : ''}</td>
          <td className="body-cell">{isBodyPartExposed('Brazos y Manos') ? 'X' : ''}</td>
          <td className="body-cell">{isBodyPartExposed('Tronco') ? 'X' : ''}</td>
          <td className="body-cell">{isBodyPartExposed('Sistema respiratorio') ? 'X' : ''}</td>
          <td className="body-cell">{isBodyPartExposed('Miembros inferiores') ? 'X' : ''}</td>
          <td className="image-cell">
            <img src="ruta_de_imagen" alt="Protección sugerida" />
          </td>
        </tr>
        <tr>
          <td className="header" colSpan="7">Identificación de peligros</td>
        </tr>
        <tr>
          <td className="body-cell" colSpan="7">
            <table className="inner-table">
              <tbody>
                <tr>
                  <td>1. Caídas de Altura:</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedHazards.heightFall}
                      onChange={() => handleHazardChange('heightFall')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>2. Exposición a Temperaturas:</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedHazards.temperatureExposure}
                      onChange={() => handleHazardChange('temperatureExposure')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>3. Exposición a Electricidad Estática:</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedHazards.staticElectricity}
                      onChange={() => handleHazardChange('staticElectricity')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>4. Exposición a sustancias Químicas:</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedHazards.chemicalExposure}
                      onChange={() => handleHazardChange('chemicalExposure')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>5. Exposición a Radiaciones:</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedHazards.radiationExposure}
                      onChange={() => handleHazardChange('radiationExposure')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>6. Exposición a Agentes Biológicos:</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedHazards.biologicalAgents}
                      onChange={() => handleHazardChange('biologicalAgents')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>7. Exposición a Ruido:</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedHazards.noiseExposure}
                      onChange={() => handleHazardChange('noiseExposure')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>8. Exposición a Vibraciones:</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedHazards.vibrationsExposure}
                      onChange={() => handleHazardChange('vibrationsExposure')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>9. Superficies cortantes:</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedHazards.cuttingSurfaces}
                      onChange={() => handleHazardChange('cuttingSurfaces')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>10. Caídas a nivel o desnivel:</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedHazards.levelFall}
                      onChange={() => handleHazardChange('levelFall')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>11. Daños Ergonómicos:</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedHazards.ergonomicDamage}
                      onChange={() => handleHazardChange('ergonomicDamage')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>12. Calentamiento de materia prima, subproducto o producto:</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedHazards.materialHeating}
                      onChange={() => handleHazardChange('materialHeating')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>13. Proyección de material o herramienta:</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedHazards.materialProjection}
                      onChange={() => handleHazardChange('materialProjection')}
                    />
                  </td>
                </tr>
                <tr>
                  <td>14. Mantenimiento preventivo, correctivo o predictivo:</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedHazards.maintenance}
                      onChange={() => handleHazardChange('maintenance')}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td className="header" colSpan="3">Equipo de protección utilizado</td>
          <td className="header" colSpan="3">Equipo de protección personal sugerido</td>
          <td className="header">Imágenes del equipo</td>
        </tr>
        <tr>
          <td className="body-cell" colSpan="3">
            <img src="ruta_de_imagen" alt="Equipo utilizado" />
          </td>
          <td className="body-cell" colSpan="3">
            <img src="ruta_de_imagen" alt="Equipo sugerido" />
          </td>
          <td className="image-cell">
            <img src="ruta_de_imagen" alt="Protección sugerida" />
          </td>
        </tr>
        <tr>
          <td className="header" colSpan="7">Descripción del equipo de protección personal</td>
        </tr>
        <tr>
          <td className="body-cell" colSpan="7">
            Uso obligatorio de zapatos dieléctricos, lentes, tapones auditivos, casco, mascarilla vs polvos, guantes de nitrilo y overol.
          </td>
        </tr>
        <tr>
          <td className="header" colSpan="3">Evaluación de riesgo de trabajo</td>
          <td className="header" colSpan="4">Clasificación de Magnitud de Riesgo</td>
        </tr>
        <tr>
          <td className="body-cell" colSpan="3">
            <table className="inner-table">
              <thead>
                <tr>
                  <td>Consecuencia</td>
                  <td>Exposición</td>
                  <td>Probabilidad</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Lesiones con baja</td>
                  <td>Raramente</td>
                  <td>Coincidencia muy rara, pero se sabe que ha ocurrido</td>
                </tr>
              </tbody>
            </table>
          </td>
          <td className="body-cell" colSpan="4">
            <table className="inner-table">
              <thead>
                <tr>
                  <td>Magnitud del Riesgo</td>
                  <td>Clasificación</td>
                  <td>Acción</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>10</td>
                  <td>Trivial</td>
                  <td>No se necesita acción específica</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default RiskAssessmentTable;
