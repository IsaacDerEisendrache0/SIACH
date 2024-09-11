import React, { useState } from 'react';
import './Table.css'; // Asegúrate de que este archivo esté disponible para aplicar los estilos

const RiskAssessmentTable = () => {
  // Estados para manejar la fecha, el área y el tiempo de exposición
  const [inspectionDate, setInspectionDate] = useState('2023-03-15');
  const [area, setArea] = useState('Producción');
  const [exposureTime, setExposureTime] = useState('8 hrs');

  return (
    <table className="risk-table">
      <thead>
        <tr>
          <td className="header" colSpan="6">Puesto de trabajo: Ayudante de empaque y envase.</td>
          <td className="header">
            {/* Input para editar el área */}
            Área: 
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </td>
        </tr>
        <tr>
          <td className="header" colSpan="6">Descripción de la actividad: Recibir, alistar, empacar y entregar productos en condiciones adecuadas de aseo e higiene.</td>
          <td className="header">
            {/* Input para editar la fecha de inspección */}
            Fecha de inspección: 
            <input
              type="date"
              value={inspectionDate}
              onChange={(e) => setInspectionDate(e.target.value)}
              style={{ marginLeft: '10px' }}
            />
          </td>
        </tr>
        <tr>
          <td className="header" colSpan="6">Principales partes del cuerpo expuestas al riesgo:</td>
          <td className="header">
            {/* Input para editar el tiempo de exposición */}
            Tiempo de exposición: 
            <input
              type="text"
              value={exposureTime}
              onChange={(e) => setExposureTime(e.target.value)}
              style={{ marginLeft: '10px' }}
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
          <td className="body-cell">X</td>
          <td className="body-cell">X</td>
          <td className="body-cell">X</td>
          <td className="body-cell">X</td>
          <td className="body-cell"></td>
          <td className="body-cell">X</td>
          <td className="image-cell">
            {/* Espacio para las imágenes del cuerpo humano */}
            <img src="ruta_de_imagen" alt="Protección" />
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
                  <td><input type="checkbox" defaultChecked /></td>
                </tr>
                <tr>
                  <td>2. Exposición a Temperaturas:</td>
                  <td><input type="checkbox" /></td>
                </tr>
                <tr>
                  <td>3. Exposición a Electricidad Estática:</td>
                  <td><input type="checkbox" defaultChecked /></td>
                </tr>
                <tr>
                  <td>4. Exposición a sustancias Químicas:</td>
                  <td><input type="checkbox" defaultChecked /></td>
                </tr>
                <tr>
                  <td>5. Exposición a Radiaciones:</td>
                  <td><input type="checkbox" /></td>
                </tr>
                <tr>
                  <td>6. Exposición a Agentes Biológicos:</td>
                  <td><input type="checkbox" /></td>
                </tr>
                <tr>
                  <td>7. Exposición a Ruido:</td>
                  <td><input type="checkbox" defaultChecked /></td>
                </tr>
                <tr>
                  <td>8. Exposición a Vibraciones:</td>
                  <td><input type="checkbox" /></td>
                </tr>
                <tr>
                  <td>9. Superficies cortantes:</td>
                  <td><input type="checkbox" defaultChecked /></td>
                </tr>
                <tr>
                  <td>10. Caídas a nivel o desnivel:</td>
                  <td><input type="checkbox" defaultChecked /></td>
                </tr>
                <tr>
                  <td>11. Daños Ergonómicos:</td>
                  <td><input type="checkbox" defaultChecked /></td>
                </tr>
                <tr>
                  <td>12. Calentamiento de materia prima, subproducto o producto:</td>
                  <td><input type="checkbox" /></td>
                </tr>
                <tr>
                  <td>13. Proyección de material o herramienta:</td>
                  <td><input type="checkbox" /></td>
                </tr>
                <tr>
                  <td>14. Mantenimiento preventivo, correctivo o predictivo:</td>
                  <td><input type="checkbox" /></td>
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
            {/* Espacio para imágenes del equipo utilizado */}
            <img src="ruta_de_imagen" alt="Equipo utilizado" />
          </td>
          <td className="body-cell" colSpan="3">
            {/* Espacio para imágenes del equipo sugerido */}
            <img src="ruta_de_imagen" alt="Equipo sugerido" />
          </td>
          <td className="image-cell">
            {/* Espacio para imágenes del cuerpo humano */}
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
                  <td>Bajo o Aceptable</td>
                  <td>Tolerable</td>
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
