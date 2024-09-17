import React, { useState } from 'react';
import './Table04.css';

const RiskTable = () => {
  // Opciones para los menús desplegables
  const opcionesConsecuencia = ['Catástrofe', 'Varias muertes', 'Muerte', 'Lesiones graves', 'Lesiones con baja', 'Lesiones sin baja'];
  const opcionesExposicion = ['Continuamente', 'Frecuentemente', 'Ocasionalmente', 'Irregularmente', 'Raramente'];
  const opcionesProbabilidad = [
    'Es el resultado más probable y esperado',
    'Es completamente posible, no será nada extraño',
    'Sería una secuencia o coincidencia rara pero posible, ha ocurrido',
    'Coincidencia muy rara, pero se sabe que ha ocurrido',
    'Coincidencia extremadamente remota pero concebible',
    'Coincidencia prácticamente imposible, jamás ha ocurrido'
  ];
  const opcionesTiempoExposicion = ['0-2 hrs', '2-4 hrs', '4-8 hrs', '8+ hrs'];

  // Estado para los menús de riesgo
  const [consequence, setConsequence] = useState('Lesiones sin baja');
  const [exposure, setExposure] = useState('Ocasionalmente');
  const [probability, setProbability] = useState('Coincidencia extremadamente remota pero concebible');
  const [tiempoExposicion, setTiempoExposicion] = useState('4-8 hrs');

  // Estado para la previsualización de la imagen
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Estado para identificación de peligros
  const [peligros, setPeligros] = useState([
    { id: 1, nombre: 'Partes en Movimiento', siNo: false },
    { id: 2, nombre: 'Exposición a Temperaturas', siNo: false },
    { id: 3, nombre: 'Exposición a Electricidad Estática', siNo: false },
    { id: 4, nombre: 'Exposición a Sustancias Químicas', siNo: false },
    { id: 5, nombre: 'Exposición a Radiaciones', siNo: false },
    { id: 6, nombre: 'Exposición a Ruido', siNo: true },
    { id: 7, nombre: 'Exposición a Vibraciones', siNo: false },
    { id: 8, nombre: 'Superficies cortantes', siNo: true }
  ]);

  // Estado para observaciones generales
  const [observacionesGenerales, setObservacionesGenerales] = useState('');

  // Función para actualizar el estado de cada peligro
  const handlePeligroChange = (index, valor) => {
    const nuevosPeligros = [...peligros];
    nuevosPeligros[index].siNo = valor;
    setPeligros(nuevosPeligros);
  };

  // Función para manejar el archivo de imagen seleccionado
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result); // Guardar la URL de la imagen para previsualización
        setErrorMessage(''); // Limpiar cualquier mensaje de error
      };

      reader.readAsDataURL(file);
    } else {
      setErrorMessage('Por favor selecciona un archivo de imagen válido.');
    }
  };

  // Calcular la magnitud del riesgo (Multiplicación simple)
  const calcularMagnitudRiesgo = () => {
    const valoresConsecuencia = {
      'Catástrofe': 50,
      'Varias muertes': 25,
      'Muerte': 15,
      'Lesiones graves': 10,
      'Lesiones con baja': 5,
      'Lesiones sin baja': 1
    };

    const valoresExposicion = {
      'Continuamente': 5,
      'Frecuentemente': 4,
      'Ocasionalmente': 3,
      'Irregularmente': 2,
      'Raramente': 1
    };

    const valoresProbabilidad = {
      'Es el resultado más probable y esperado': 5,
      'Es completamente posible, no será nada extraño': 4,
      'Sería una secuencia o coincidencia rara pero posible, ha ocurrido': 3,
      'Coincidencia muy rara, pero se sabe que ha ocurrido': 2,
      'Coincidencia extremadamente remota pero concebible': 1,
      'Coincidencia prácticamente imposible, jamás ha ocurrido': 0.5
    };

    return valoresConsecuencia[consequence] * valoresExposicion[exposure] * valoresProbabilidad[probability];
  };

  const riskMagnitude = calcularMagnitudRiesgo();

  // Clasificación de la magnitud del riesgo basada en el valor de la magnitud
  const classifyRisk = (magnitude) => {
    if (magnitude > 400) {
      return "Muy Alto";
    } else if (magnitude > 200) {
      return "Alto";
    } else if (magnitude > 70) {
      return "Notable";
    } else if (magnitude > 20) {
      return "Moderado";
    } else {
      return "Bajo o Aceptable";
    }
  };

  // Determinar el color de la clasificación
  const getColorByRisk = (magnitude) => {
    if (magnitude > 400) {
      return 'red';      // Muy Alto
    } else if (magnitude > 200) {
      return 'orange';   // Alto
    } else if (magnitude > 70) {
      return 'yellow';   // Notable
    } else if (magnitude > 20) {
      return 'green';    // Moderado
    } else {
      return 'blue';     // Bajo o Aceptable
    }
  };

  // Determinar la acción a tomar basada en la clasificación
  const action = classifyRisk(riskMagnitude) === "Bajo o Aceptable" ? "Tolerable" : 
                  classifyRisk(riskMagnitude) === "Moderado" ? "Debe corregirse" : 
                  classifyRisk(riskMagnitude) === "Notable" ? "Corrección urgente" : 
                  classifyRisk(riskMagnitude) === "Alto" ? "Corrección inmediata" : 
                  "Detención inmediata";

  // Obtener el color basado en la magnitud del riesgo
  const riskColor = getColorByRisk(riskMagnitude);

  return (
    <div className="risk-table">
      <table className="main-table">
        <thead>
          <tr>
            <th colSpan="4">Nombre de la maquinaria o equipo:</th>
            <th>Área:</th>
            <th>PLANTA DE PASTAS</th>
          </tr>
          <tr>
            <th colSpan="4">Descripción de la maquinaria o equipo:</th>
            <th>Energía utilizada:</th>
            <th>ELÉCTRICA</th>
          </tr>
          <tr>
            <th colSpan="2">Localización esquemática de los riesgos en la maquinaria y/o equipo</th>
            <th>POE:</th>
            <th>0-4</th>
            <th>Tiempo de exposición:</th>
            <th>
              <select value={tiempoExposicion} onChange={(e) => setTiempoExposicion(e.target.value)}>
                {opcionesTiempoExposicion.map(opcion => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td rowSpan="6" colSpan="2">
              {/* Input para subir imagen */}
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

              {/* Previsualización de la imagen */}
              {imagePreview ? (
                <img src={imagePreview} alt="Maquinaria" style={{ width: '150px', height: '150px', marginTop: '10px' }} />
              ) : (
                <p>No hay imagen seleccionada</p>
              )}
            </td>
            <table className="main-table danger-table">
        <thead>
          <tr>
            <th>Identificación de peligros</th>
            <th>Si/No</th>
          </tr>
        </thead>
        <tbody>
          {peligros.map((peligro, index) => (
            <tr key={peligro.id}>
              <td style={{ width: '70%' }}>{peligro.nombre}</td>
              <td style={{ width: '30%' }}>
                <input
                  type="checkbox"
                  checked={peligro.siNo}
                  onChange={(e) => handlePeligroChange(index, e.target.checked)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
            
          </tr>
        </tbody>
      </table>

      <table className="main-table">
        <thead>
          <tr>
            <td colSpan="8" className="exposure">TIEMPO DE EXPOSICIÓN POR MANTENIMIENTO</td>
          </tr>
          <tr>
            <td>Consecuencia</td>
            <td>Exposición</td>
            <td>Probabilidad</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <select value={consequence} onChange={(e) => setConsequence(e.target.value)}>
                {opcionesConsecuencia.map(opcion => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </td>
            <td>
              <select value={exposure} onChange={(e) => setExposure(e.target.value)}>
                {opcionesExposicion.map(opcion => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </td>
            <td>
              <select value={probability} onChange={(e) => setProbability(e.target.value)}>
                {opcionesProbabilidad.map(opcion => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td colSpan="3" className="risk-magnitude-header">Clasificación de Magnitud de Riesgo</td>
          </tr>
          <tr style={{ backgroundColor: riskColor }}>
            <td>Magnitud del Riesgo: {riskMagnitude}</td>
            <td>Clasificación: {classifyRisk(riskMagnitude)}</td>
            <td>Acción: {action}</td>
          </tr>
          <tr>
            <td colSpan="5" className="suggested-equipment">Equipo de protección personal sugerido</td>
          </tr>
          <tr>
            <td colSpan="1" className="icons"><img src="icon01.png" alt="Protección" /></td>
           <img src="icon02.png" alt="Protección" />
            <td colSpan="2" className="icons"><img src="icon03.png" alt="Protección" /></td>
          </tr>
          <tr>
            <td colSpan="8" className="specific-risk-header">Riesgo Específico</td>
          </tr>
          <tr>
            <td colSpan="0" className="icons"><img src="risk01.png" alt="Riesgo" /></td>
            <td colSpan="1" className="icons"><img src="risk02.png" alt="Riesgo" /></td>
            <td colSpan="2" className="icons"><img src="risk03.png" alt="Riesgo" /></td>
          </tr>
          {/* Campo de observaciones generales */}
      <div className="observaciones-container">
        <label htmlFor="observaciones">Observaciones:</label>
        <textarea
          id="observaciones"
          value={observacionesGenerales}
          onChange={(e) => setObservacionesGenerales(e.target.value)}
          placeholder="Agregar observaciones generales aquí"
          rows="4"
          cols="50"
        />
      </div>
        </tbody>
      </table>
    </div>
  );
};

export default RiskTable;
