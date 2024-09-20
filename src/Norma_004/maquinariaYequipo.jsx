import React, { useState } from 'react';
import './Table04.css';

const protectionImages = {
  'Caídas de Altura': ['/images/10.png', '/images/34.png'],
  'Exposición a Temperaturas': ['/images/6.png'],
  'Exposición a Electricidad Estática': ['/images/6.png', '/images/4.png'],
  'Exposición a Sustancias Químicas': ['/images/7.png', '/images/13.png', '/images/6.png', '/images/17.png'],
  'Exposición a Radiaciones': ['/images/16.png'],
  'Exposición agentes Biológicos': ['/images/18.png', '/images/16.png'],
  'Exposición a Ruido': ['/images/19.png', '/images/5.png'],
  'Exposición a Vibraciones': ['/images/14.png', '/images/4.png'],
  'Superficies cortantes': ['/images/6.png', '/images/1.png', '/images/21.png'],
  'Caídas a nivel o desnivel': ['/images/4.png'],
  'Daños Ergonómicos': ['/images/15.png'],
  'Calentamiento de materia prima, subproducto o producto': ['/images/6.png', '/images/15.png'],
  'Proyección de material o herramienta': ['/images/7.png', '/images/12.png'],
  'Mantenimiento preventivo, correctivo o predictivo': ['/images/12.png', '/images/3.png'],
};

const RiskTable = () => {
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

  const [consequence, setConsequence] = useState('Lesiones sin baja');
  const [exposure, setExposure] = useState('Ocasionalmente');
  const [probability, setProbability] = useState('Coincidencia extremadamente remota pero concebible');
  const [tiempoExposicion, setTiempoExposicion] = useState('4-8 hrs');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [peligros, setPeligros] = useState([
    { id: 1, nombre: 'Caídas de Altura', siNo: false },
    { id: 2, nombre: 'Exposición a Temperaturas', siNo: false },
    { id: 3, nombre: 'Exposición a Electricidad Estática', siNo: false },
    { id: 4, nombre: 'Exposición a Sustancias Químicas', siNo: false },
    { id: 5, nombre: 'Exposición a Radiaciones', siNo: false },
    { id: 6, nombre: 'Exposición agentes Biológicos', siNo: false },
    { id: 7, nombre: 'Exposición a Ruido', siNo: false },
    { id: 8, nombre: 'Exposición a Vibraciones', siNo: false },
    { id: 9, nombre: 'Superficies cortantes', siNo: false },
    { id: 10, nombre: 'Caídas a nivel o desnivel', siNo: false },
    { id: 11, nombre: 'Daños Ergonómicos', siNo: false },
    { id: 12, nombre: 'Calentamiento de materia prima, subproducto o producto', siNo: false },
    { id: 13, nombre: 'Proyección de material o herramienta', siNo: false },
    { id: 14, nombre: 'Mantenimiento preventivo, correctivo o predictivo', siNo: false }
  ]);
  const [observacionesGenerales, setObservacionesGenerales] = useState('');

  const handlePeligroChange = (index, valor) => {
    const nuevosPeligros = [...peligros];
    nuevosPeligros[index].siNo = valor;
    setPeligros(nuevosPeligros);

    const newImages = [...selectedImages];
    nuevosPeligros.forEach(peligro => {
      if (peligro.siNo && protectionImages[peligro.nombre]) {
        protectionImages[peligro.nombre].forEach((imageSrc) => {
          if (!newImages.includes(imageSrc)) {
            newImages.push(imageSrc);
          }
        });
      } else if (!peligro.siNo && protectionImages[peligro.nombre]) {
        protectionImages[peligro.nombre].forEach((imageSrc) => {
          const imageIndex = newImages.indexOf(imageSrc);
          if (imageIndex > -1) {
            newImages.splice(imageIndex, 1);
          }
        });
      }
    });
    setSelectedImages(newImages);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
        setErrorMessage('');
      };

      reader.readAsDataURL(file);
    } else {
      setErrorMessage('Por favor selecciona un archivo de imagen válido.');
    }
  };

  const calcularValorConsecuencia = () => {
    const valoresConsecuencia = {
      'Catástrofe': 50,
      'Varias muertes': 25,
      'Muerte': 15,
      'Lesiones graves': 10,
      'Lesiones con baja': 5,
      'Lesiones sin baja': 1
    };
    return valoresConsecuencia[consequence];
  };

  const calcularValorExposicion = () => {
    const valoresExposicion = {
      'Continuamente': 10,
      'Frecuentemente': 6,
      'Ocasionalmente': 3,
      'Irregularmente': 2,
      'Raramente': 1
    };
    return valoresExposicion[exposure];
  };

  const calcularValorProbabilidad = () => {
    const valoresProbabilidad = {
      'Es el resultado más probable y esperado': 10,
      'Es completamente posible, no será nada extraño': 6,
      'Sería una secuencia o coincidencia rara pero posible, ha ocurrido': 3,
      'Coincidencia muy rara, pero se sabe que ha ocurrido': 2,
      'Coincidencia extremadamente remota pero concebible': 1,
      'Coincidencia prácticamente imposible, jamás ha ocurrido': 0.5
    };
    return valoresProbabilidad[probability];
  };

  const calcularMagnitudRiesgo = () => {
    return Math.floor(calcularValorConsecuencia() * calcularValorExposicion() * calcularValorProbabilidad());
  };

  const obtenerColorPorRiesgo = (magnitud) => {
    if (magnitud > 400) {
      return 'red';
    } else if (magnitud > 200) {
      return 'orange';
    } else if (magnitud > 70) {
      return 'yellow';
    } else if (magnitud > 20) {
      return 'green';
    } else {
      return 'blue';
    }
  };

  const magnitudRiesgo = calcularMagnitudRiesgo();
  const colorMagnitud = obtenerColorPorRiesgo(magnitudRiesgo);

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
            <td rowSpan="6" colSpan="1">
              <div className="image-observations-container">
                <div className="image-section">
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                  {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                  {imagePreview ? (
                    <img src={imagePreview} alt="Maquinaria" className="image-preview" />
                  ) : (
                    <p>No hay imagen seleccionada</p>
                  )}
                </div>
                <div className="observations-section">
                  <label htmlFor="observaciones">Observaciones:</label>
                  <textarea
                    id="observaciones"
                    value={observacionesGenerales}
                    onChange={(e) => setObservacionesGenerales(e.target.value)}
                    placeholder="Agregar observaciones generales aquí"
                    rows="4"
                    cols="30"
                  />
                </div>
              </div>
            </td>
            <td colSpan="4">
              <table className="compact-table no-border">
                <thead>
                  <tr>
                    <th>Consecuencia</th>
                    <th>Exposición</th>
                    <th>Probabilidad</th>
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
                      <div>Valor: {calcularValorConsecuencia()}</div>
                    </td>
                    <td>
                      <select value={exposure} onChange={(e) => setExposure(e.target.value)}>
                        {opcionesExposicion.map(opcion => (
                          <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                      </select>
                      <div>Valor: {calcularValorExposicion()}</div>
                    </td>
                    <td>
                      <select value={probability} onChange={(e) => setProbability(e.target.value)}>
                        {opcionesProbabilidad.map(opcion => (
                          <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                      </select>
                      <div>Valor: {calcularValorProbabilidad()}</div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="3">
                      <div className="risk-magnitude-container">
                        <div className="risk-magnitude-bar" style={{ backgroundColor: colorMagnitud }}>
                          <span>{magnitudRiesgo}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <tr>
            <td colSpan="5">
              <table className="danger-table compact-table">
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
            </td>
          </tr>
        </tbody>
      </table>

      <div className="horizontal-sections">
        <div className="section">
          <table className="main-table">
            <thead>
              <tr>
                <td colSpan="5" className="suggested-equipment">Equipo de protección personal sugerido</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="5" className="icons">
                  {selectedImages.length > 0 ? (
                    selectedImages.map((imageSrc, index) => (
                      <img key={index} src={imageSrc} alt={`Protección`} style={{ width: '50px', height: '50px', margin: '5px', objectFit: 'cover' }} />
                    ))
                  ) : (
                    <p>No hay riesgos seleccionados</p>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="section">
          <table className="main-table">
            <thead>
              <tr>
                <td colSpan="8" className="specific-risk-header">Riesgo Específico</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan="0" className="icons"><img src="risk01.png" alt="Riesgo" style={{ width: '50px', height: '50px', margin: '5px', objectFit: 'cover' }} /></td>
                <td colSpan="1" className="icons"><img src="risk02.png" alt="Riesgo" style={{ width: '50px', height: '50px', margin: '5px', objectFit: 'cover' }} /></td>
                <td colSpan="2" className="icons"><img src="risk03.png" alt="Riesgo" style={{ width: '50px', height: '50px', margin: '5px', objectFit: 'cover' }} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiskTable;
