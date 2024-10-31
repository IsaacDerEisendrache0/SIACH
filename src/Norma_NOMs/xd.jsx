import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NormaNoms.css';
import iconImage from './images/icon.png';
import exceptImage from './images/excepted_recipients.png';
import categoriasImage from './images/categorias_presion.png';
import criogenicosImage from './images/criogenicos.png';
import generadoresImage from './images/generadores_vapor.png';

const NormaNoms = () => {
  const [step, setStep] = useState(1);
  const [showTable, setShowTable] = useState(false);
  const [normasAplicables, setNormasAplicables] = useState([]);
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    area: '',
    superficie: '',
    invGases: '',
    invLiquidosi: '',
    invLiquidosc: '',
    invSolidos: '',
    materialesPiroforicos: '',
    maquinaria: '',
    trabajosAltura: '',
    recipientesPresion: '',
    recipientesCriogenicos: '',
    generadoresVapor: '',
    cargasEstaticas: '',
    materialesFriccion: '',
    soldaduraCorte: '',
    soldaduraAltura: '',
    instalacionesElectricas: '',
    mantenimientoLineasElectricas: '',
    trabajosEspaciosConfinados: '',
    trabajadoresDiscapacidad: '',
    exposicionRuido: '',
    exposicionFrio: '',
    exposicioncalor: '',
    vibraciones: '',
    manejocargas: '',
    materialc: '',
    superficieConstruir: '', // Nueva propiedad para el paso 36
    alturaConstruccion: '', // Nueva propiedad para el paso 36
    materialp: '',
  });

  // Funciones para manejar el estado y la lógica de cada paso
  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate(-1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Función para validar si se ha completado cada paso
  const isStepCompleted = () => {
    switch (step) {
      case 1:
        return formValues.area !== '';
      case 2:
        return (
          formValues.superficie &&
          formValues.invGases &&
          formValues.invLiquidosi &&
          formValues.invLiquidosc &&
          formValues.invSolidos &&
          formValues.materialesPiroforicos !== ''
        );
      case 3:
        return formValues.maquinaria !== '';
      case 4:
        return formValues.trabajosAltura !== '';
      case 5:
        return formValues.recipientesPresion !== '';
      case 6:
        return formValues.recipientesCriogenicos !== '';
      case 7:
        return formValues.generadoresVapor !== '';
      case 8:
        return formValues.cargasEstaticas !== '';
      case 9:
        return formValues.materialesFriccion !== '';
      case 10:
        return formValues.soldaduraCorte !== '';
      case 11:
        return formValues.soldaduraAltura !== '';
      case 12:
        return formValues.instalacionesElectricas !== '';
      case 13:
        return formValues.mantenimientoLineasElectricas !== '';
      case 14:
        return formValues.trabajosEspaciosConfinados !== '';
      case 15:
        return formValues.trabajadoresDiscapacidad !== '';
      case 16:
        return formValues.exposicionRuido !== '';
      case 17:
        return formValues.exposicionFrio !== '';
      case 18:
        return formValues.exposicioncalor !== '';
      case 19:
        return formValues.vibraciones !== '';
      case 20:
        return formValues.manejocargas !== '';
      case 21:
        return formValues.materialc !== '';
      case 22:
        return formValues.superficieConstruir !== '' && formValues.alturaConstruccion !== '';
      case 23:
        return formValues.materialp !== '';
      case 24:
        return formValues.nuevoCampo !== '';

        case 24:
        return formValues.trabajadoresDiscapacidad !== '';
      case 25:
        return formValues.tiposDiscapacidad.length > 0;
      case 26:
        return formValues.exposicionRuido !== '';
      case 27:
        return formValues.exposicionFrio !== '';
      case 28:
        return formValues.exposicioncalor !== '';
      case 29:
        return formValues.vibraciones !== '';
      case 30:
        return formValues.exvibraciones.length > 0;
      case 31:
        return formValues.manejocargas !== '';
      case 32:
        return formValues.actcargas.length > 0;
      case 33:
        return formValues.actagricolas !== '';
      case 34:
        return formValues.infrestructura.length > 0;
      case 35:
        return formValues.materialc !== '';
      case 36:
        return formValues.superficieConstruir !== '' && formValues.alturaConstruccion !== '';
      case 37:
        return formValues.materialp !== '';
      case 38: 
        // Nueva validación para el paso 38
        return formValues.nuevoCampo !== ''; // Asegúrate de reemplazar 'nuevoCampo' con el nombre del campo correspondiente
      default:
        return false;
    }
  };

  return (
    <div className="norma-noms-container">
      <div className="container">
        {/* Paso 1 - Estructura del centro de trabajo */}
        {step === 1 && (
          <div className="step1">
            <h3>Estructura del centro de trabajo</h3>
            <em>Indique la forma en la cual requiere identificar las NOMs aplicables</em>
            <div className="options">
              <label>
                <input
                  type="radio"
                  name="area"
                  value="centro"
                  onChange={handleInputChange}
                  checked={formValues.area === 'centro'}
                />
                Para todo el centro de trabajo
              </label>
              <label>
                <input
                  type="radio"
                  name="area"
                  value="proceso"
                  onChange={handleInputChange}
                  checked={formValues.area === 'proceso'}
                />
                Por área, departamento o proceso
              </label>
            </div>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}

        {/* Paso 2 - Determinación del grado de riesgo de incendio */}
        {step === 2 && (
          <div className="step2">
            <h3>Determinación del grado de riesgo de incendio</h3>
            <div className="inventory-fields">
              <label>
                Superficie construida:
                <input
                  type="number"
                  name="superficie"
                  value={formValues.superficie}
                  onChange={handleInputChange}
                  required
                />
                metros cuadrados
              </label>

              <label>
                Inventario de gases inflamables:
                <input
                  type="number"
                  name="invGases"
                  value={formValues.invGases}
                  onChange={handleInputChange}
                  required
                />
                litros
              </label>

              <label>
                Inventario de líquidos inflamables:
                <input
                  type="number"
                  name="invLiquidosi"
                  value={formValues.invLiquidosi}
                  onChange={handleInputChange}
                  required
                />
                litros
              </label>

              <label>
                Inventario de líquidos combustibles:
                <input
                  type="number"
                  name="invLiquidosc"
                  value={formValues.invLiquidosc}
                  onChange={handleInputChange}
                  required
                />
                litros
              </label>

              <label>
                Inventario de sólidos combustibles, incluido el mobiliario del centro de trabajo:
                <input
                  type="number"
                  name="invSolidos"
                  value={formValues.invSolidos}
                  onChange={handleInputChange}
                  required
                />
                kilogramos
              </label>
            </div>

            <label>¿Tiene inventario de materiales pirofóricos o explosivos?</label>
            <label>
              <input
                type="radio"
                name="materialesPiroforicos"
                value="sí"
                onChange={handleInputChange}
                checked={formValues.materialesPiroforicos === 'sí'}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="materialesPiroforicos"
                value="no"
                onChange={handleInputChange}
                checked={formValues.materialesPiroforicos === 'no'}
              />
              No
            </label>

            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}

        {/* Paso 3 - Uso de maquinaria o equipo */}
        {step === 3 && (
          <div className="step3">
            <h3>Uso de maquinaria o equipo</h3>
            <label>¿En su centro de trabajo se utiliza maquinaria o equipo?</label>
            <label>
              <input
                type="radio"
                name="maquinaria"
                value="sí"
                onChange={handleInputChange}
                checked={formValues.maquinaria === 'sí'}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="maquinaria"
                value="no"
                onChange={handleInputChange}
                checked={formValues.maquinaria === 'no'}
              />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}

        {/* Paso 4 - Actividades en alturas */}
        {step === 4 && (
          <div className="step4">
            <h3>Actividades en alturas</h3>
            <label>¿En su centro de trabajo se realizan actividades de mantenimiento, instalación, demolición, operación, reparación, limpieza, entre otras, a alturas mayores a 1.80 metros sobre el nivel de referencia, o existe el riesgo de caída en aberturas en las superficies de trabajo, tales como perforaciones, pozos, cubos y túneles verticales?</label>
            <label>
              <input
                type="radio"
                name="trabajosAltura"
                value="sí"
                onChange={handleInputChange}
                checked={formValues.trabajosAltura === 'sí'}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="trabajosAltura"
                value="no"
                onChange={handleInputChange}
                checked={formValues.trabajosAltura === 'no'}
              />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};




export default NormaNoms;
