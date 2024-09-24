import React, { useState } from 'react';

const NormaNOMs = () => {
  const [entidadFederativa, setEntidadFederativa] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [numTrabajadores, setNumTrabajadores] = useState('');
  const [division, setDivision] = useState('');
  const [actividad, setActividad] = useState('');

  // Opciones para entidad federativa y municipio
  const opcionesEntidadFederativa = [
    'CHIHUAHUA', 'BAJA CALIFORNIA', 'SONORA', 'SINALOA', 'DURANGO',
  ];

  const opcionesMunicipio = {
    'CHIHUAHUA': ['AQUILES SERDAN', 'CHIHUAHUA', 'JUAREZ', 'ETC'],
    'BAJA CALIFORNIA': ['MEXICALI', 'TIJUANA', 'ENSENADA', 'ETC'],
  };

  // Opciones para división y actividad
  const opcionesDivision = [
    'AGRICULTURA, GANADERÍA, SILVICULTURA, PESCA Y CAZA',
    'INDUSTRIAS EXTRACTIVAS',
    'INDUSTRIAS DE TRANSFORMACIÓN',
    'INDUSTRIA DE LA CONSTRUCCIÓN',
    'INDUSTRIA ELÉCTRICA Y CAPTACIÓN Y SUMINISTRO DE AGUA POTABLE',
    'COMERCIO',
    'TRANSPORTES Y COMUNICACIONES',
    'SERVICIOS PARA EMPRESAS, PERSONAS Y EL HOGAR',
    'SERVICIOS SOCIALES Y COMUNALES',
  ];

  const opcionesActividad = {
    'AGRICULTURA, GANADERÍA, SILVICULTURA, PESCA Y CAZA': [
      'Agricultura',
      'Cría y explotación de ganado y otras clases de animales',
      'Explotación de bosques madereros',
      'Pesca de altura y costera',
      'Acuicultura',
      'Caza',
    ],
    'INDUSTRIAS EXTRACTIVAS': ['Minería', 'Extracción de petróleo y gas'],
    'INDUSTRIAS DE TRANSFORMACIÓN': ['Manufactura', 'Procesamiento de alimentos'],
    // Añade más actividades según la división seleccionada
  };

  const handleEntidadFederativaChange = (e) => {
    setEntidadFederativa(e.target.value);
    setMunicipio('');
  };

  const handleDivisionChange = (e) => {
    setDivision(e.target.value);
    setActividad(''); // Reiniciar la actividad cuando cambia la división
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', { entidadFederativa, municipio, numTrabajadores, division, actividad });
  };

  return (
    <div className="container mt-5">
      <h2>Asistente para identificar las NOMs</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo de Entidad Federativa */}
        <div className="mb-3">
          <label htmlFor="entidadFederativa" className="form-label">Entidad Federativa:</label>
          <select className="form-select" id="entidadFederativa" value={entidadFederativa} onChange={handleEntidadFederativaChange} required>
            <option value="">Seleccionar...</option>
            {opcionesEntidadFederativa.map((opcion, index) => (
              <option key={index} value={opcion}>{opcion}</option>
            ))}
          </select>
        </div>

        {/* Campo de Municipio */}
        {entidadFederativa && (
          <div className="mb-3">
            <label htmlFor="municipio" className="form-label">Municipio o delegación:</label>
            <select className="form-select" id="municipio" value={municipio} onChange={(e) => setMunicipio(e.target.value)} required>
              <option value="">Seleccionar...</option>
              {opcionesMunicipio[entidadFederativa]?.map((opcion, index) => (
                <option key={index} value={opcion}>{opcion}</option>
              ))}
            </select>
          </div>
        )}

        {/* Campo de Número de Trabajadores */}
        <div className="mb-3">
          <label htmlFor="numTrabajadores" className="form-label">Número de trabajadores:</label>
          <input type="text" className="form-control" id="numTrabajadores" value={numTrabajadores} onChange={(e) => setNumTrabajadores(e.target.value)} required />
        </div>

        {/* Campo de División */}
        <div className="mb-3">
          <label htmlFor="division" className="form-label">División de actividad económica:</label>
          <select className="form-select" id="division" value={division} onChange={handleDivisionChange} required>
            <option value="">Seleccionar...</option>
            {opcionesDivision.map((opcion, index) => (
              <option key={index} value={opcion}>{opcion}</option>
            ))}
          </select>
        </div>

        {/* Campo de Actividad (dependiente de División) */}
        {division && (
          <div className="mb-3">
            <label htmlFor="actividad" className="form-label">Actividad:</label>
            <select className="form-select" id="actividad" value={actividad} onChange={(e) => setActividad(e.target.value)} required>
              <option value="">Seleccionar...</option>
              {opcionesActividad[division]?.map((opcion, index) => (
                <option key={index} value={opcion}>{opcion}</option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" className="btn btn-primary">Continuar</button>
      </form>
    </div>
  );
};

export default NormaNOMs;
