import React, { useState } from 'react';
import './Table04.css'; // Asegúrate de tener el archivo CSS para los estilos
import Moviles from './moviles'; // Importamos el componente de la tabla Moviles
import MaquinariaYequipo from './maquinariaYequipo'; // Importamos el componente de la tabla Maquinaria y Equipo


const App = () => {
  const [selectedTable, setSelectedTable] = useState('Norma_004'); // Inicializamos con Norma_004

  const handleSelectTable = (table) => {
    setSelectedTable(table);
  };

  return (
    <div className="container mt-5">
      {/* Mostrar la tabla de N-004 directamente */}


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
        </ul>
      </div>

      {/* Mostrar la tabla de Móviles si está seleccionada */}
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
      </div>
    </div>
  );
};

export default App;
