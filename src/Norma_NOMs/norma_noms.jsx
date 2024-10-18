import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NormaNoms.css';
import iconImage from './images/icon.png';
import exceptImage from './images/excepted_recipients.png'; // Imagen para el paso 9
import categoriasImage from './images/categorias_presion.png'; // Imagen para el paso 10
import criogenicosImage from './images/criogenicos.png'; // Imagen para el paso 12

const NormaNoms = () => {
  const [step, setStep] = useState(1);
  const [showModal9, setShowModal9] = useState(false); // Estado del modal para el paso 9
  const [showModal10, setShowModal10] = useState(false); // Estado del modal para el paso 10
  const [showModal12, setShowModal12] = useState(false); // Estado del modal para el paso 12
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
    maquinariaMateriales: '',
    tiposMaquinaria: [],
    trabajosAltura: '',
    equiposAltura: [],
    recipientesPresion: '',
    categoriasRecipientes: [],
    generadoresVapor: '',
    recipientesCriogenicos: '', // Este campo es para paso 11 (Sí o No)
    categoriasCriogenicos: [], // Este campo es para las categorías del paso 12
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
        return formValues.maquinaria !== '';
      case 5:
        return formValues.maquinariaMateriales !== '';
      case 6:
        return formValues.tiposMaquinaria.length > 0;
      case 7:
        return formValues.trabajosAltura !== '';
      case 8:
        return formValues.equiposAltura.length > 0;
      case 9:
        return formValues.recipientesPresion !== '';
      case 10:
        return formValues.categoriasRecipientes.length > 0;
      case 11:
        return formValues.recipientesCriogenicos !== ''; // Verifica si el campo está seleccionado
      case 12:
        return formValues.categoriasCriogenicos.length > 0; // Verifica si las categorías están seleccionadas
      default:
        return false;
    }
  };

  return (
    <div className="norma-noms-container">
      <div className="container">
        {/* Otros pasos de 1 a 10 */}
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

        {/* Otros pasos de 2 a 10... */}
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

        {/* Paso 3 */}
        {step === 3 && (
          <div className="step3">
            <h3>Área de trabajo</h3>
            <label>¿Desarrolla sus actividades de producción, comercialización, transporte y almacenamiento o prestación de servicios en: edificios, locales, instalaciones y/o áreas exteriores, tales como pasillos, patios, techos, estacionamientos, áreas de circulación de vehículos, áreas de carga y descarga de materiales?</label>
            <label>
              <input type="radio" name="areaTrabajo" value="sí" onChange={handleInputChange} />
              Sí
            </label>
            <label>
              <input type="radio" name="areaTrabajo" value="no" onChange={handleInputChange} />
              No
            </label>

            {/* Nueva sección de elementos del centro de trabajo */}
            <h4>Seleccione los elementos con que cuenta su centro de trabajo:</h4>
            <label>
              <input
                type="checkbox"
                value="escaleras"
                onChange={(e) => handleCheckboxChange(e, 'elementos')}
                checked={formValues.elementos.includes('escaleras')}
              />
              Escaleras
            </label>
            <label>
              <input
                type="checkbox"
                value="rampas"
                onChange={(e) => handleCheckboxChange(e, 'elementos')}
                checked={formValues.elementos.includes('rampas')}
              />
              Rampas
            </label>
            <label>
              <input
                type="checkbox"
                value="escalas"
                onChange={(e) => handleCheckboxChange(e, 'elementos')}
                checked={formValues.elementos.includes('escalas')}
              />
              Escalas
            </label>
            <label>
              <input
                type="checkbox"
                value="puentesPlataformasElevadas"
                onChange={(e) => handleCheckboxChange(e, 'elementos')}
                checked={formValues.elementos.includes('puentesPlataformasElevadas')}
              />
              Puentes y plataformas elevadas
            </label>
            <label>
              <input
                type="checkbox"
                value="transitoVehiculos"
                onChange={(e) => handleCheckboxChange(e, 'elementos')}
                checked={formValues.elementos.includes('transitoVehiculos')}
              />
              Áreas de tránsito de vehículos
            </label>
            <label>
              <input
                type="checkbox"
                value="espuelasFerrocarril"
                onChange={(e) => handleCheckboxChange(e, 'elementos')}
                checked={formValues.elementos.includes('espuelasFerrocarril')}
              />
              Espuelas de ferrocarril activas
            </label>
            <label>
              <input
                type="checkbox"
                value="ventilacionArtificial"
                onChange={(e) => handleCheckboxChange(e, 'elementos')}
                checked={formValues.elementos.includes('ventilacionArtificial')}
              />
              Sistemas de ventilación artificial
            </label>

            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}

        {/* Paso 4 */}
        {step === 4 && (
          <div className="step4">
            <h3>Uso de maquinaria o equipo</h3>
            <label>¿En su centro de trabajo se utiliza maquinaria o equipo?</label>
            <label>
              <input type="radio" name="maquinaria" value="sí" onChange={handleInputChange} />
              Sí
            </label>
            <label>
              <input type="radio" name="maquinaria" value="no" onChange={handleInputChange} />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}

        {/* Paso 5 */}
        {step === 5 && (
          <div className="step5">
            <h3>Uso de maquinaria para manejo de materiales</h3>
            <label>¿En su centro de trabajo se utiliza maquinaria para el manejo de materiales, como materias primas, subproductos, productos, residuos entre otros?</label>
            <label>
              <input type="radio" name="maquinariaMateriales" value="sí" onChange={handleInputChange} />
              Sí
            </label>
            <label>
              <input type="radio" name="maquinariaMateriales" value="no" onChange={handleInputChange} />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}

        {/* Paso 6 */}
        {step === 6 && (
          <div className="step6">
            <h3>Tipos de maquinaria para manejo de materiales</h3>
            <label>Seleccione la maquinaria que se utiliza en el centro de trabajo para el manejo de materiales:</label>
            <label>
              <input
                type="checkbox"
                value="polipastosMalacates"
                onChange={(e) => handleCheckboxChange(e, 'tiposMaquinaria')}
                checked={formValues.tiposMaquinaria.includes('polipastosMalacates')}
              />
              Polipastos y malacates
            </label>
            <label>
              <input
                type="checkbox"
                value="eslingas"
                onChange={(e) => handleCheckboxChange(e, 'tiposMaquinaria')}
                checked={formValues.tiposMaquinaria.includes('eslingas')}
              />
              Eslingas
            </label>
            <label>
              <input
                type="checkbox"
                value="gruas"
                onChange={(e) => handleCheckboxChange(e, 'tiposMaquinaria')}
                checked={formValues.tiposMaquinaria.includes('gruas')}
              />
              Grúas
            </label>
            <label>
              <input
                type="checkbox"
                value="montacargas"
                onChange={(e) => handleCheckboxChange(e, 'tiposMaquinaria')}
                checked={formValues.tiposMaquinaria.includes('montacargas')}
              />
              Montacargas
            </label>
            <label>
              <input
                type="checkbox"
                value="electroimanes"
                onChange={(e) => handleCheckboxChange(e, 'tiposMaquinaria')}
                checked={formValues.tiposMaquinaria.includes('electroimanes')}
              />
              Electroimanes
            </label>
            <label>
              <input
                type="checkbox"
                value="cargadoresFrontales"
                onChange={(e) => handleCheckboxChange(e, 'tiposMaquinaria')}
                checked={formValues.tiposMaquinaria.includes('cargadoresFrontales')}
              />
              Cargadores frontales
            </label>
            <label>
              <input
                type="checkbox"
                value="transportadores"
                onChange={(e) => handleCheckboxChange(e, 'tiposMaquinaria')}
                checked={formValues.tiposMaquinaria.includes('transportadores')}
              />
              Transportadores
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}

        {/* Paso 7 */}
        {step === 7 && (
          <div className="step7">
            <h3>Actividades en alturas</h3>
            <label>¿En su centro de trabajo se realizan actividades de mantenimiento, instalación, demolición, operación, reparación, limpieza, entre otras, a alturas mayores a 1.80 metros sobre el nivel de referencia, o existe el riesgo de caída en aberturas en las superficies de trabajo, tales como perforaciones, pozos, cubos y túneles verticales?</label>
            <label>
              <input type="radio" name="trabajosAltura" value="sí" onChange={handleInputChange} />
              Sí
            </label>
            <label>
              <input type="radio" name="trabajosAltura" value="no" onChange={handleInputChange} />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}

        {/* Paso 8 */}
        {step === 8 && (
          <div className="step8">
            <h3>Sistemas o equipos para trabajos en altura</h3>
            <label>Seleccione los sistemas o equipos con que se realizan los trabajos en altura:</label>
            <label>
              <input
                type="checkbox"
                value="sistemasRestriccion"
                onChange={(e) => handleCheckboxChange(e, 'equiposAltura')}
                checked={formValues.equiposAltura.includes('sistemasRestriccion')}
              />
              Sistemas personales de restricción
            </label>
            <label>
              <input
                type="checkbox"
                value="sistemasPosicionamiento"
                onChange={(e) => handleCheckboxChange(e, 'equiposAltura')}
                checked={formValues.equiposAltura.includes('sistemasPosicionamiento')}
              />
              Sistemas personales de posicionamiento y ascenso/descenso controlado
            </label>
            <label>
              <input
                type="checkbox"
                value="sistemasProteccionCaidas"
                onChange={(e) => handleCheckboxChange(e, 'equiposAltura')}
                checked={formValues.equiposAltura.includes('sistemasProteccionCaidas')}
              />
              Sistemas de protección personal para interrumpir caídas de altura
            </label>
            <label>
              <input
                type="checkbox"
                value="andamiosTorre"
                onChange={(e) => handleCheckboxChange(e, 'equiposAltura')}
                checked={formValues.equiposAltura.includes('andamiosTorre')}
              />
              Andamios tipo torre o estructura
            </label>
            <label>
              <input
                type="checkbox"
                value="andamiosSuspendidos"
                onChange={(e) => handleCheckboxChange(e, 'equiposAltura')}
                checked={formValues.equiposAltura.includes('andamiosSuspendidos')}
              />
              Andamios suspendidos
            </label>
            <label>
              <input
                type="checkbox"
                value="plataformasElevacion"
                onChange={(e) => handleCheckboxChange(e, 'equiposAltura')}
                checked={formValues.equiposAltura.includes('plataformasElevacion')}
              />
              Plataformas de elevación
            </label>
            <label>
              <input
                type="checkbox"
                value="escalerasMano"
                onChange={(e) => handleCheckboxChange(e, 'equiposAltura')}
                checked={formValues.equiposAltura.includes('escalerasMano')}
              />
              Escaleras de mano
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}



        {/* Paso 9 - Recipientes sujetos a presión */}
        {step === 9 && (
          <div className="step9">
            <h3>Recipientes Sujetos a Presión</h3>
            <label>¿En su centro de trabajo se cuenta con recipientes sujetos a presión -interna o externa- como compresores, intercambiadores de calor, torres de enfriamiento, marmitas, tanques suavizadores, filtros, reactores, autoclaves, colchones de aire, entre otros?</label>
            <p>Para consultar los recipientes que quedan exceptuados del cumplimiento de la NOM-020-STPS-2011, dé clic en el ícono.</p>

            <img
              src={iconImage}
              alt="Consultar recipientes exceptuados"
              style={{ cursor: 'pointer', width: '50px' }}
              onClick={() => setShowModal9(true)}
            />

            <label>
              <input type="radio" name="recipientesPresion" value="sí" onChange={handleInputChange} />
              Sí
            </label>
            <label>
              <input type="radio" name="recipientesPresion" value="no" onChange={handleInputChange} />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}

        {/* Paso 10 - Categorías de recipientes sujetos a presión */}
        {step === 10 && (
          <div className="step10">
            <h3>Categorías de Recipientes Sujetos a Presión</h3>
            <label>Indique la(s) categoría(s) en la(s) se clasifica(n) el (los) recipiente(s) sujeto(s) a presión instalado(s) en su centro de trabajo.</label>
            <p>Para consultar la tabla de clasificación, dé clic en el ícono.</p>

            <img
              src={iconImage}
              alt="Consultar tabla de clasificación"
              style={{ cursor: 'pointer', width: '50px' }}
              onClick={() => setShowModal10(true)}
            />

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="categoriaI"
                  onChange={(e) => handleCheckboxChange(e, 'categoriasRecipientes')}
                  checked={formValues.categoriasRecipientes.includes('categoriaI')}
                />
                Categoría I
              </label>
              <label>
                <input
                  type="checkbox"
                  value="categoriaII"
                  onChange={(e) => handleCheckboxChange(e, 'categoriasRecipientes')}
                  checked={formValues.categoriasRecipientes.includes('categoriaII')}
                />
                Categoría II
              </label>
              <label>
                <input
                  type="checkbox"
                  value="categoriaIII"
                  onChange={(e) => handleCheckboxChange(e, 'categoriasRecipientes')}
                  checked={formValues.categoriasRecipientes.includes('categoriaIII')}
                />
                Categoría III
              </label>
            </div>

            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}

        
        {/* Paso 11 - Recipientes Criogénicos */}
        {step === 11 && (
          <div className="step11">
            <h3>Recipientes Criogénicos</h3>
            <label>¿En su centro de trabajo se utilizan recipientes criogénicos?</label>
            <label>
              <input
                type="radio"
                name="recipientesCriogenicos"
                value="sí"
                onChange={handleInputChange}
                checked={formValues.recipientesCriogenicos === 'sí'}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="recipientesCriogenicos"
                value="no"
                onChange={handleInputChange}
                checked={formValues.recipientesCriogenicos === 'no'}
              />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}

        {/* Paso 12 - Recipientes criogénicos */}
        {step === 12 && (
          <div className="step12">
            <h3>Recipientes Criogénicos</h3>
            <label>Indique la(s) categoría(s) en la(s) se clasifica(n) el (los) recipiente(s) criogénico(s) instalado(s) en su centro de trabajo.</label>
            <p>Para consultar la tabla de clasificación, dé clic en el ícono.</p>

            {/* Icono que al hacer clic abre el modal */}
            <img
              src={iconImage}
              alt="Consultar tabla de clasificación"
              style={{ cursor: 'pointer', width: '50px' }}
              onClick={() => setShowModal12(true)}
            />

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="categoriaII"
                  onChange={(e) => handleCheckboxChange(e, 'categoriasCriogenicos')}
                  checked={formValues.categoriasCriogenicos.includes('categoriaII')}
                />
                Categoría II
              </label>
              <label>
                <input
                  type="checkbox"
                  value="categoriaIII"
                  onChange={(e) => handleCheckboxChange(e, 'categoriasCriogenicos')}
                  checked={formValues.categoriasCriogenicos.includes('categoriaIII')}
                />
                Categoría III
              </label>
            </div>

            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Finalizar</button>
            </div>
          </div>
        )}

        {/* Modal para el paso 12 */}
        {showModal12 && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal12(false)}>&times;</span>
              <img src={criogenicosImage} alt="Tabla de clasificación de recipientes criogénicos" style={{ width: '100%' }} />
            </div>
          </div>
        )}

        <style jsx>{`
          .modal {
            display: flex;
            justify-content: center;
            align-items: center;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
          }
          .modal-content {
            background-color: #fefefe;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
            max-width: 500px;
            text-align: center;
          }
          .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
          }
          .close:hover,
          .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
          }
        `}</style>
      </div>
    </div>
  );
};

export default NormaNoms;
