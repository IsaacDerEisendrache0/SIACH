import React, { useState } from 'react';
import './Table04.css';

const RiskTable = () => {
  // Initial states for Consecuencia, Exposición, and Probabilidad
  const [consequence, setConsequence] = useState(100); // Default: Catástrofe
  const [exposure, setExposure] = useState(10); // Default: Continuously exposed
  const [probability, setProbability] = useState(10); // Default: Most likely outcome

  // State for handling the uploaded image
  const [image, setImage] = useState(null);

  // Function to handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  // Opciones de identificación de riesgos
  const riskOptions = [
    "Riesgo caída de piedra o golpe por objeto",
    "Riesgo de incendio",
    "Riesgo de atrapamiento o volcadura",
    "Riesgo de choque o atropello",
    "Riesgo de descarga eléctrica",
    "Exposición a temperaturas elevadas y abatidas",
    "Vibración",
    "Riesgo inundación",
    "Ventilación deficiente",
    "Daños ergonómicos",
    "Sustancias químicas",
    "Poca iluminación",
    "Partículas suspendidas en el ambiente",
  ];

  // Calcular la magnitud del riesgo
  const riskMagnitude = consequence * exposure * probability;

  // Determinar la clasificación del riesgo y la acción a tomar en función de la magnitud
  let riskClassification = '';
  let action = '';

  if (riskMagnitude > 400) {
    riskClassification = 'Muy Alto';
    action = 'Detención inmediata';
  } else if (riskMagnitude >= 200 && riskMagnitude <= 400) {
    riskClassification = 'Alto';
    action = 'Corrección inmediata';
  } else if (riskMagnitude >= 70 && riskMagnitude < 200) {
    riskClassification = 'Notable';
    action = 'Corrección urgente';
  } else {
    riskClassification = 'Moderado o Bajo';
    action = 'Monitoreo';
  }

  return (
    <table className="risk-table">
      <thead>
        <tr>
          <th colSpan="5" className="red">Nombre de la maquinaria o equipo:</th>
          <th>MONTACARGAS EXTERIOR MINA</th>
          <th className="red">Área:</th>
          <th>EXTERIOR MINA</th>
        </tr>
        <tr>
          <th colSpan="5" className="red">Descripción de la maquinaria o equipo:</th>
          <th>LEVANTAMIENTO Y TRANSPORTE DE MATERIAL</th>
          <th className="red">Energía utilizada:</th>
          <th>DIESEL</th>
        </tr>
        <tr>
          <th colSpan="2" className="red">Localización esquemática de los riesgos en maquinaria y/o equipo</th>
          <th className="red">POE:</th>
          <th>1</th>
          <th className="red">Tiempo de exposición:</th>
          <th>12 HRS</th>
          <th className="red">Fecha de inspección:</th>
          <th>19/07/2024</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          {/* Primera columna: Imagen */}
          <td colSpan="4" rowSpan="3" className="image-section">
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {image ? (
              <img src={image} alt="Uploaded Equipment" className="equipment-image" />
            ) : (
              <p>No image uploaded.</p>
            )}
          </td>
          {/* Segunda columna: Identificación de riesgos */}
          <td colSpan="5" rowSpan="1" className="risk-info">
            <table className="inner-table">
              <thead>
                <tr>
                  <th className="red">Identificación de riesgos</th>
                </tr>
              </thead>
              <tbody>
                {/* Mostrar solo 7 menús desplegables */}
                {[...Array(7)].map((_, index) => (
                  <tr key={index}>
                    <td>
                      <select>
                        <option value="">Seleccione un riesgo</option>
                        {riskOptions.map((opt, idx) => (
                          <option key={idx} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
          {/* Tercera columna: Sistemas de seguridad */}
          <td colSpan="5" className="safety-info">
            <table className="inner-table">
              <thead>
                <tr>
                  <th className="red">Sistemas de seguridad</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Programa de mantenimiento</td></tr>
                <tr><td>Extintores</td></tr>
                <tr><td>Guardas, parachoques y protectores de calaveras</td></tr>
                <tr><td>Freno de emergencia</td></tr>
                <tr><td>Barandales y escaleras</td></tr>
                <tr><td>Indicadores (torreta, luces, claxon, banderas, etc)</td></tr>
                <tr><td>Sistema ANSUL</td></tr>
              </tbody>
            </table>
          </td>
        </tr>
        {/* Sección de Evaluación de riesgos y EPP sugerido */}
        <tr>
          {/* Evaluación de riesgos */}
          <td colSpan="6" className="risk-evaluation-section">
            <table>
              <thead>
                <tr className="red">
                  <th colSpan="4">Evaluación de riesgo de trabajo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Consecuencia</td>
                  <td>Exposición</td>
                  <td>Probabilidad</td>
                </tr>
                <tr>
                  <td>Catástrofe</td>
                  <td>Continuamente</td>
                  <td>Es el resultado más probable y esperado</td>
                </tr>
                <tr>
                  <td>{consequence}</td>
                  <td>{exposure}</td>
                  <td>{probability}</td>
                </tr>
              </tbody>
            </table>
            <table className="risk-classification">
              <thead>
                <tr className="red">
                  <th colSpan="4">Clasificación de Magnitud de Riesgo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Magnitud del Riesgo: {riskMagnitude}</td>
                  <td>Clasificación: {riskClassification}</td>
                  <td>Acción: {action}</td>
                </tr>
              </tbody>
            </table>
          </td>
          {/* EPP sugerido */}
          <td colSpan="3" className="epp-section">
            <div className="table-cell red">EPP sugerido</div>
            <div className="epp-icons">
              <img src="path-to-icon1.png" alt="EPP Icon 1" />
              <img src="path-to-icon2.png" alt="EPP Icon 2" />
              <img src="path-to-icon3.png" alt="EPP Icon 3" />
              <img src="path-to-icon4.png" alt="EPP Icon 4" />
              <img src="path-to-icon5.png" alt="EPP Icon 5" />
              <img src="path-to-icon6.png" alt="EPP Icon 6" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default RiskTable;
