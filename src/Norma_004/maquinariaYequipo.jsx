import React from 'react';
import './Table04.css';

const App = () => {
  return (
    <div className="container">
      <h2>ESPESADOR DE MINERAL</h2>
      <table className="risk-table">
        <thead>
          <tr>
            <th colSpan="2" className="header">Descripción de la maquinaria o equipo</th>
            <th colSpan="3" className="header">POE</th>
            <th colSpan="2" className="header">Energía utilizada</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan="1" className="image-cell">
              <img src="image.png" alt="maquinaria" />
            </td>
            <td>Localización esquemática de los riesgos en la maquinaria y/o equipo</td>
            <td>0-2</td>
            <td>Tiempo de exposición: 10-12 HRS</td>
            <td rowSpan="1" colSpan="2">
              <p>Clasificación de Magnitud de Riesgo</p>
              <p>Magnitud del Riesgo: 25</p>
              <p>Clasificación: Moderado</p>
              <p>Acción: Debe corregirse</p>
              <p>Dispositivos de seguridad: Anclaje de arnés</p>
            </td>
            <td rowSpan="4" className="inspection">Fecha de inspección: 18/07/2024</td>
          </tr>
          <tr>
            <td>Tiempo de exposición por mantenimiento</td>
            <td colSpan="2">
              <table className="nested-table">
                <thead>
                  <tr>
                    <th>Consecuencia</th>

                    <th>Exposición</th>
                    <th>Probabilidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Muerte</td>
                    <td>Irregularmente</td>
                    <td>Casi imposible</td>
                  </tr>
                  <tr>
                    <td>25</td>
                    <td>2</td>
                    <td>0.5</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="risk-table">
        <thead>
          <tr>
            <th>Identificación de peligros:</th>
            <th>Si/No</th>
            <th>Observaciones</th>
            <th colSpan="2">Equipo de protección personal sugerido</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Partes en Movimiento</td>
            <td>Sí</td>
            <td rowSpan="14">
              En esta área se encuentran demasiadas partículas suspendidas en el aire, es por ello el uso obligatorio de mascarilla y lentes de seguridad.
              Se recomienda usar EPP adecuado antes de ingresar.
            </td>
            <td rowSpan="7" className="protection-images">
              {/* Aquí puedes agregar las imágenes de los EPP */}
            </td>
          </tr>
          <tr>
            <td>Exposición a Temperaturas</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Exposición a Electricidad Estática</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Exposición a Sustancias Químicas</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Exposición a Radiaciones</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Exposición agentes Biológicos</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Exposición a Ruido</td>
            <td>No</td>
          </tr>


          <tr>
            <td colSpan="2" className="risk-header">Riesgo Específico</td>
            <td colSpan="2">
              <div className="risk-content">
                <p><img src="warning1.png" alt="Warning 1" /> Riesgo de caída</p>
                <p><img src="warning2.png" alt="Warning 2" /> Riesgo de atrapamiento</p>
                <p><img src="warning3.png" alt="Warning 3" /> Riesgo de contacto con partes móviles</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default App;
