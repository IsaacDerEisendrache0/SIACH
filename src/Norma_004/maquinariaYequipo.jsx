import React from 'react';
import './Table04.css';

const RiskTable = () => {
  return (
    <div className="container">
      <table className="risk-table">
        <thead>
          <tr>
            <td colSpan="2" className="header">Nombre de la maquinaria o equipo:</td>
            <td colSpan="4" className="header">ESPESADOR</td>
            <td className="header">Área:</td>
            <td className="header">MOLINOS</td>
          </tr>
          <tr>
            <td colSpan="2" className="header">Descripción de la maquinaria o equipo:</td>
            <td colSpan="4" className="header">ESPESADOR DE MINERAL</td>
            <td className="header">Energía utilizada:</td>
            <td className="header">------</td>
          </tr>
          <tr>
            <td colSpan="4" className="header">Localización esquemática de los riesgos en la maquinaria y/o equipo</td>
            <td className="header">POE:</td>
            <td className="header">0-2</td>
            <td className="header">Tiempo de exposición:</td>
            <td className="header">10-12 HRS</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="4" rowSpan="6">
              <img src="ruta_de_imagen" alt="Imagen de maquinaria" className="machinery-img" />
            </td>
            <td className="header" colSpan="2">TIEMPO DE EXPOSICIÓN POR MANTENIMIENTO</td>
            <td className="header" colSpan="2">Clasificación de Magnitud de Riesgo</td>
          </tr>
          <tr>
            <td>Consecuencia</td>
            <td>Exposición</td>
            <td>Probabilidad</td>
          </tr>
          <tr>
            <td>Muerte</td>
            <td>Irregularmente</td>
            <td>Coincidencia extremadamente remota</td>
            <td>Clasificación</td>
          </tr>
          <tr>
            <td>25</td>
            <td>2</td>
            <td>0.5</td>
            <td className="risk-level">
              <div>Magnitud del Riesgo: <strong>25</strong></div>
              <div>Clasificación: <strong>Moderado</strong></div>
              <div>Acción: <strong>Debe corregirse</strong></div>
            </td>
          </tr>
          <tr>
            <td colSpan="4" className="header">Dispositivos de seguridad</td>
          </tr>
          <tr>
            <td colSpan="4">Anclaje de arnés</td>
          </tr>
          <tr>
            <td colSpan="4" className="header">Identificación de peligros</td>
            <td colSpan="4" className="header">Equipo de protección personal sugerido</td>
          </tr>
          <tr>
            <td>1. Partes en Movimiento:</td>
            <td>Sí</td>
            <td colSpan="3" rowSpan="14" className="observaciones">
              <strong>Observaciones:</strong><br />
              En esta área se encuentran demasiadas partículas suspendidas en el aire, es por ello el uso obligatorio de mascarilla y lentes de seguridad...
            </td>
            <td rowSpan="14" className="protection-img">
              <img src="ruta_proteccion" alt="Protección 1" />
              <img src="ruta_proteccion" alt="Protección 2" />
              <img src="ruta_proteccion" alt="Protección 3" />
              <img src="ruta_proteccion" alt="Protección 4" />
              <img src="ruta_proteccion" alt="Protección 5" />
            </td>
          </tr>
          <tr><td>2. Exposición a Temperaturas:</td><td>No</td></tr>
          <tr><td>3. Exposición a Electricidad Estática:</td><td>No</td></tr>
          <tr><td>4. Exposición a Sustancias Químicas:</td><td>No</td></tr>
          <tr><td>5. Exposición a Radiaciones:</td><td>No</td></tr>
          <tr><td>6. Exposición agentes Biológicos:</td><td>No</td></tr>
          <tr><td>7. Exposición a Ruido:</td><td>No</td></tr>
          <tr><td>8. Exposición a Vibraciones:</td><td>No</td></tr>
          <tr><td>9. Superficies cortantes:</td><td>No</td></tr>
          <tr><td>10. Caídas a nivel o desnivel:</td><td>Sí</td></tr>
          <tr><td>11. Daños Ergonómicos:</td><td>No</td></tr>
          <tr><td>12. Calentamiento de materia prima, subproducto o producto:</td><td>No</td></tr>
          <tr><td>13. Proyección de material o herramienta:</td><td>No</td></tr>
          <tr><td>14. Mantenimiento preventivo, correctivo o predictivo:</td><td>Sí</td></tr>
          <tr>
            <td colSpan="4" className="header">Riesgo Específico</td>
            <td colSpan="4" className="header">Principales partes del cuerpo expuestas al riesgo</td>
          </tr>
          <tr>
            <td colSpan="4" className="risk-icons">
              <img src="ruta_riesgo1" alt="Riesgo 1" />
              <img src="ruta_riesgo2" alt="Riesgo 2" />
              <img src="ruta_riesgo3" alt="Riesgo 3" />
            </td>
            <td>Cabeza y Oídos:</td><td>X</td><td>Ojos y Cara:</td><td>X</td>
          </tr>
          <tr>
            <td colSpan="4"></td>
            <td>Brazos y Manos:</td><td>X</td><td>Tronco:</td><td>X</td>
          </tr>
          <tr>
            <td colSpan="4"></td>
            <td>Sistema respiratorio:</td><td>X</td><td>Extremidades inferiores:</td><td>X</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RiskTable;
