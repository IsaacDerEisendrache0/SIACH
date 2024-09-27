import React, { useState } from 'react';

const NormaNOMs = () => {
  const [municipio, setMunicipio] = useState('');
  const [numTrabajadores, setNumTrabajadores] = useState('');

  // Opciones de municipios para el estado de Chihuahua
  const opcionesMunicipio = [
    'Ahumada', 'Aldama', 'Allende', 'Aquiles Serdán', 'Ascensión', 'Bachíniva', 'Balleza', 
    'Batopilas de Manuel Gómez Morín', 'Bocoyna', 'Buenaventura', 'Camargo', 'Carichí', 'Casas Grandes', 
    'Chihuahua', 'Chínipas', 'Coronado', 'Coyame del Sotol', 'Cuauhtémoc', 'Cusihuiriachi', 
    'Delicias', 'Dr. Belisario Domínguez', 'Galeana', 'Gran Morelos', 'Guachochi', 'Guadalupe', 
    'Guadalupe y Calvo', 'Guazapares', 'Guerrero', 'Hidalgo del Parral', 'Huejotitán', 'Ignacio Zaragoza', 
    'Janos', 'Jiménez', 'Juárez', 'Julimes', 'López', 'Madera', 'Maguarichi', 'Manuel Benavides', 
    'Matachí', 'Matamoros', 'Meoqui', 'Morelos', 'Moris', 'Namiquipa', 'Nonoava', 'Nuevo Casas Grandes', 
    'Ocampo', 'Ojinaga', 'Praxedis G. Guerrero', 'Riva Palacio', 'Rosales', 'Rosario', 
    'San Francisco de Borja', 'San Francisco de Conchos', 'San Francisco del Oro', 'Santa Bárbara', 
    'Santa Isabel', 'Satevó', 'Saucillo', 'Temósachic', 'El Tule', 'Urique', 'Uruachi', 'Valle de Zaragoza'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', { municipio, numTrabajadores });
  };

  return (
    <div className="container mt-5">
      <h2>Asistente para identificar las NOMs</h2>
      <form onSubmit={handleSubmit}>
        {/* Campo de Municipio */}
        <div className="mb-3">
          <label htmlFor="municipio" className="form-label">Municipio o delegación:</label>
          <select className="form-select" id="municipio" value={municipio} onChange={(e) => setMunicipio(e.target.value)} required>
            <option value="">Seleccionar...</option>
            {opcionesMunicipio.map((opcion, index) => (
              <option key={index} value={opcion}>{opcion}</option>
            ))}
          </select>
        </div>

        {/* Campo de Número de Trabajadores */}
        <div className="mb-3">
          <label htmlFor="numTrabajadores" className="form-label">Número de trabajadores:</label>
          <input type="text" className="form-control" id="numTrabajadores" value={numTrabajadores} onChange={(e) => setNumTrabajadores(e.target.value)} required />
        </div>

        <button type="submit" className="btn btn-primary">Continuar</button>
      </form>
    </div>
  );
};

export default NormaNOMs;
