import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NormaNoms.css';

const NormaNoms = () => {
  const [step, setStep] = useState(1);
  const [formValues, setFormValues] = useState({
    superficie: '',
    invGases: '',
    invLiquidosi: '',
    invLiquidosc: '',
    invSolidos: '',
    materialesPiroforicos: '',
    areaTrabajo: '',
    elementos: [],
    maquinaria: '',
    tiposMaquinaria: [],
    trabajosAltura: '',
    equiposAltura: [],
    recipientesCriogenicos: '',
    categoriasRecipientes: [],
    generadoresVapor: ''
  });

  const navigate = useNavigate();

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
      [name]: value
    });
  };

  const handleCheckboxChange = (e, field) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value]
    }));
  };

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
        return formValues.areaTrabajo !== '';
      case 4:
        return formValues.elementos.length > 0;
      case 5:
        return formValues.maquinaria !== '';
      case 6:
        return formValues.tiposMaquinaria.length > 0;
      case 7:
        return formValues.trabajosAltura !== '';
      case 8:
        return formValues.equiposAltura.length > 0;
      case 9:
        return formValues.recipientesCriogenicos !== '';
      case 10:
        return formValues.categoriasRecipientes.length > 0;
      case 11:
        return formValues.generadoresVapor !== '';
      default:
        return false;
    }
  };

  return (
    <div className="norma-noms-container">
      <div className="container">
        {/* Paso 1 */}
        {step === 1 && (
          <div className="step1">
            <h3>Estructura del centro de trabajo</h3>
            <em>Indique la forma en la cual requiere identificar las NOMs aplicables</em>
            <div className="options">
              <label>
                <input type="radio" name="area" value="centro" onChange={handleInputChange} />
                Para todo el centro de trabajo
              </label>
              <label>
                <input type="radio" name="area" value="proceso" onChange={handleInputChange} />
                Por área, departamento o proceso
              </label>
            </div>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}

        {/* Paso 2 */}
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
              <input type="radio" name="materialesPiroforicos" value="sí" onChange={handleInputChange} />
              Sí
            </label>
            <label>
              <input type="radio" name="materialesPiroforicos" value="no" onChange={handleInputChange} />
              No
            </label>

            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}

        {/* Repite la misma estructura para los demás pasos */}
        {/* Paso 3 */}
        {step === 3 && (
          <div className="step3">
            <h3>Área de trabajo</h3>
            <label>¿Desarrolla sus actividades en áreas exteriores, como estacionamientos?</label>
            <label>
              <input type="radio" name="areaTrabajo" value="sí" onChange={handleInputChange} />
              Sí
            </label>
            <label>
              <input type="radio" name="areaTrabajo" value="no" onChange={handleInputChange} />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}

        {/* ... otros pasos se estructuran de forma similar ... */}

        {/* Paso 11 */}
        {step === 11 && (
          <div className="step11">
            <h3>¿En su centro de trabajo están instalados generadores de vapor o calderas?</h3>
            <label>
              <input type="radio" name="generadoresVapor" value="sí" onChange={handleInputChange} />
              Sí
            </label>
            <label>
              <input type="radio" name="generadoresVapor" value="no" onChange={handleInputChange} />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={() => navigate('/final')} disabled={!isStepCompleted()}>Finalizar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NormaNoms;
