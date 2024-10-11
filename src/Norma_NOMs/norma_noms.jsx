import React, { useState } from 'react';
import './NormaNoms.css';

const NormaNoms = () => {
  const [selection, setSelection] = useState('0');

  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
  };

  return (
    <div className="norma-noms-container">
      <div className="container">
        <h3>Estructura del centro de trabajo</h3>
        <em>Indique la forma en la cual requiere identificar las NOMs aplicables</em>

        <div className="options">
          <label>
            <input
              type="radio"
              name="seleccion"
              value="0"
              checked={selection === '0'}
              onChange={handleSelectionChange}
            />
            Para todo el centro de trabajo
          </label>
          <label>
            <input
              type="radio"
              name="seleccion"
              value="1"
              onChange={handleSelectionChange}
            />
            Por área, departamento o proceso
          </label>
        </div>

        <div className="buttons">
          <button onClick={() => alert('Regresar')}>Regresar</button>
          <button onClick={() => alert('Continuar')}>Continuar</button>
        </div>
      </div>
    </div>
  );
};

export default NormaNoms;
