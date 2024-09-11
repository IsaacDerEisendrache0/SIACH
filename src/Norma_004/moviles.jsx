import React from 'react';
import './Table04.css'; // Asegúrate de tener el archivo CSS para los estilos

const RiskAssessment = () => {
  return (
    <div className="container">
      <table className="risk-table">
        <thead>
            <h4>Tabla de equipos moviles</h4>
          <tr>
            <td colSpan="3" className="header">Nombre de la maquinaria o equipo:</td>
            <td colSpan="3" className="header">SCOOPTRAM 2</td>
            <td className="header">Área:</td>
            <td className="header">INTERIOR MINA</td>
          </tr>
          <tr>
            <td colSpan="3" className="header">Descripción de la maquinaria o equipo:</td>
            <td colSpan="3" className="header">ACARREO DE MATERIAL</td>
            <td className="header">Energía utilizada:</td>
            <td className="header">DIESEL</td>
          </tr>
          <tr>
            <td colSpan="4" className="header">Localización esquemática de los riesgos en la maquinaria y/o equipo</td>
            <td className="header">POE:</td>
            <td className="header">1</td>
            <td className="header">Tiempo de exposición:</td>
            <td className="header">12 HRS</td>
          </tr>
          <tr>
            <td colSpan="4" rowSpan="6">
              <img src="ruta_de_imagen" alt="Imagen de maquinaria" className="machinery-img" />
            </td>
            <td className="header" colSpan="2">Identificación de riesgos</td>
            <td className="header" colSpan="2">Sistemas de seguridad</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan="2">Riesgo de incendio</td>
            <td colSpan="2">Extintores</td>
          </tr>
          <tr>
            <td colSpan="2">Riesgo de choque o atropello</td>
            <td colSpan="2">Guardas, parachoques y protectores de calaveras</td>
          </tr>
          <tr>
            <td colSpan="2">Vibración</td>
            <td colSpan="2">Programa de mantenimiento</td>
          </tr>
          <tr>
            <td colSpan="2">Riesgo de caída de piedra o golpe por objeto</td>
            <td colSpan="2">Indicadores (torreta, luces, claxon, banderas, etc.)</td>
          </tr>
          <tr>
            <td colSpan="2">Poca iluminación</td>
            <td colSpan="2">Cinturón de seguridad</td>
          </tr>
          <tr>
            <td colSpan="2">Exposición a temperaturas elevadas y abatidas</td>
            <td colSpan="2"></td>
          </tr>
          <tr>
            <td colSpan="2">Partículas suspendidas en el ambiente</td>
            <td colSpan="2"></td>
          </tr>
          <tr>
            <td colSpan="2">Riesgo de atrapamiento o volcadura</td>
            <td colSpan="2"></td>
          </tr>
          <tr>
            <td colSpan="2">Riesgo inundación</td>
            <td colSpan="2"></td>
          </tr>
          <tr className="separator"></tr>
          <tr>
            <td colSpan="8" className="header">Principales partes del cuerpo expuestas al riesgo:</td>
          </tr>
          <tr>
            <td>Cabeza y Oídos:</td>
            <td>X</td>
            <td>Ojos y Cara:</td>
            <td>X</td>
            <td>Sistema respiratorio:</td>
            <td>X</td>
            <td>Extremidades inferiores:</td>
            <td>X</td>
          </tr>
          <tr>
            <td>Brazos y Manos:</td>
            <td>X</td>
            <td>Tronco:</td>
            <td></td>
            <td colSpan="4"></td>
          </tr>
          <tr className="separator"></tr>
          <tr>
            <td colSpan="8" className="header">Evaluación de riesgo de trabajo</td>
          </tr>
          <tr>
            <td>Consecuencia</td>
            <td>Exposición</td>
            <td>Probabilidad</td>
            <td className="header" colSpan="5">Clasificación de Magnitud de Riesgo</td>
          </tr>
          <tr>
            <td>Muerte</td>
            <td>Frecuentemente</td>
            <td>Coincidencia extremadamente remota pero concebible</td>
            <td>Magnitud del Riesgo</td>
            <td>75</td>
            <td>Clasificación</td>
            <td>Notable</td>
            <td>Acción</td>
            <td>Corrección urgente</td>
          </tr>
          <tr className="separator"></tr>
          <tr>
            <td colSpan="8" className="header">EPP sugerido</td>
          </tr>
          <tr>
            <td colSpan="8" className="epp-icons">
              <img src="ruta_proteccion1" alt="Protección 1" />
              <img src="ruta_proteccion2" alt="Protección 2" />
              <img src="ruta_proteccion3" alt="Protección 3" />
              <img src="ruta_proteccion4" alt="Protección 4" />
              <img src="ruta_proteccion5" alt="Protección 5" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RiskAssessment;
