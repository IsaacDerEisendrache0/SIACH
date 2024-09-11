import React, { useState } from 'react';
import './Table04.css'; // Asegúrate de tener el archivo CSS para los estilos
import Moviles from './moviles'; // Importamos el componente de la tabla Moviles
import MaquinariaYequipo from './maquinariaYequipo'; // Importamos el componente de la tabla Maquinaria y Equipo
import HerramientasMan from './herramientasMan'; // Importamos el componente de la tabla herramientasMan

const App = () => {
  const [selectedTable, setSelectedTable] = useState(''); // Inicializamos sin ninguna tabla seleccionada

  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  return (
    <div className="container mt-5">
      {/* Botón desplegable para elegir las tablas */}
      <div className="dropdown mt-3">
        <button
          className="btn btn-primary dropdown-toggle"
          type="button"
          id="tablesDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Seleccionar Tabla
        </button>
        <ul className="dropdown-menu" aria-labelledby="tablesDropdown">
          <li>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => handleSelectTable('Moviles')}
            >
              Tabla de Móviles
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => handleSelectTable('MaquinariaYequipo')}
            >
              Tabla de Maquinaria y Equipo
            </button>
          </li>
          <li>
            <button
              className="dropdown-item"
              type="button"
              onClick={() => handleSelectTable('HerramientasMan')}
            >
              Tabla de Herramientas Manuales
            </button>
          </li>
        </ul>
      </div>

      {/* Mostrar la tabla seleccionada */}
      <div className="mt-3">
        {selectedTable === 'Moviles' && (
          <div>
            <Moviles /> {/* Mostramos el componente de Moviles */}
          </div>
        )}

        {selectedTable === 'MaquinariaYequipo' && (
          <div>
            <MaquinariaYequipo /> {/* Mostramos el componente de Maquinaria y Equipo */}
          </div>
        )}

        {selectedTable === 'HerramientasMan' && (
          <div>
            <HerramientasMan /> {/* Mostramos el componente de Herramientas Manuales */}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
