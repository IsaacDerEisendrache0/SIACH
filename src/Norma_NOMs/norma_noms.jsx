import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NormaNoms.css';
import iconImage from './images/icon.png';
import exceptImage from './images/excepted_recipients.png'; // Imagen para el paso 9
import categoriasImage from './images/categorias_presion.png'; // Imagen para el paso 10
import criogenicosImage from './images/criogenicos.png'; // Imagen para el paso 12
import generadoresImage from './images/generadores_vapor.png'; // Imagen para el paso 14

const NormaNoms = () => {
  const [step, setStep] = useState(1);
  const [showModal9, setShowModal9] = useState(false);
  const [showModal10, setShowModal10] = useState(false);
  const [showModal12, setShowModal12] = useState(false);
  const [showModal14, setShowModal14] = useState(false);
  const [showTable, setShowTable] = useState(false); // Para mostrar la tabla final
  const navigate = useNavigate();

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
    recipientesCriogenicos: '',
    categoriasCriogenicos: [],
    categoriasGeneradores: [],
    cargasEstaticas: '',
    materialesFriccion: '',
    soldaduraCorte: '',
    soldaduraAltura: '',
    instalacionesElectricas: '',
    mantenimientoLineasElectricas: '',
    mantenimientoEnergizadas: '',
    trabajosEspaciosConfinados: '',
    tiposEspaciosConfinados: [],
    trabajadoresDiscapacidad: '',
    tiposDiscapacidad: [],
    exposicionRuido: '',
    exposicionFrio: '',
    exposicioncalor: '',
    vibraciones: '',
    exvibraciones: [],
    manejocargas: '',
    actcargas: [],
    actagricolas: [],
    infrestructura: [],
    materialc: '',
    superficieConstruir: '', // Nueva propiedad para el paso 36
    alturaConstruccion: '', // Nueva propiedad para el paso 36
    materialp: '',
  });

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

  const handleCheckboxChange = (e, field) => {
    const { value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
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
        return formValues.recipientesCriogenicos !== '';
      case 12:
        return formValues.categoriasCriogenicos.length > 0;
      case 13:
        return formValues.generadoresVapor !== '';
      case 14:
        return formValues.categoriasGeneradores.length > 0;
      case 15:
        return formValues.cargasEstaticas !== '';
      case 16:
        return formValues.materialesFriccion !== '';
      case 17:
        return formValues.soldaduraCorte !== '';
      case 18:
        return formValues.soldaduraAltura !== '';
      case 19:
        return formValues.instalacionesElectricas !== '';
      case 20:
        return formValues.mantenimientoLineasElectricas !== '';
      case 21:
        return formValues.mantenimientoEnergizadas !== '';
      case 22:
        return formValues.trabajosEspaciosConfinados !== '';
      case 23:
        return formValues.tiposEspaciosConfinados.length > 0;
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


  const handleShowTable = () => {
    setShowTable(!showTable);
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
            <label>
              ¿En su centro de trabajo se cuenta con recipientes sujetos a presión -interna o externa- como compresores,
              intercambiadores de calor, torres de enfriamiento, marmitas, tanques suavizadores, filtros, reactores,
              autoclaves, colchones de aire, entre otros?
            </label>
            <p>
              Para consultar los recipientes que quedan exceptuados del cumplimiento de la NOM-020-STPS-2011, dé clic en el ícono.
            </p>

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

        {/* Modal para el paso 9 */}
        {showModal9 && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal9(false)}>&times;</span>
              <img src={exceptImage} alt="Recipientes exceptuados" style={{ width: '100%' }} />
            </div>
          </div>
        )}

        {/* Paso 10 - Categorías de recipientes sujetos a presión */}
        {step === 10 && (
          <div className="step10">
            <h3>Categorías de Recipientes Sujetos a Presión</h3>
            <label>
              Indique la(s) categoría(s) en la(s) se clasifica(n) el (los) recipiente(s) sujeto(s) a presión instalado(s) en su
              centro de trabajo.
            </label>
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

        {/* Modal para el paso 10 */}
        {showModal10 && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal10(false)}>&times;</span>
              <img src={categoriasImage} alt="Categorías de recipientes sujetos a presión" style={{ width: '100%' }} />
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
          <button onClick={handleNext} disabled={!isStepCompleted()}>siguiente</button>
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
     


        {/* Paso 13 - Generadores de vapor o calderas */}
        {step === 13 && (
          <div className="step13">
            <h3></h3>
            <label>
            ¿En su centro de trabajo están instalados generadores de vapor o calderas?
            </label>
            <label>
              <input
                type="radio"
                name="generadoresVapor"
                value="sí"
                onChange={handleInputChange}
                checked={formValues.generadoresVapor === 'sí'}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="generadoresVapor"
                value="no"
                onChange={handleInputChange}
                checked={formValues.generadoresVapor === 'no'}
              />
              No
            </label>

            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Siguiente</button>
            </div>
          </div>
        )}



        {/* Paso 14 - Categorías de generadores de vapor */}
        {step === 14 && (
          <div className="step14">
            <h3>Categorías de Generadores de Vapor o Calderas</h3>
            <label>
              Indique la(s) categoría(s) en la(s) se clasifica(n) el (los) generador(es) de vapor o caldera(s) instalado(s) en su centro de trabajo.
            </label>
            <p>Para consultar la tabla de clasificación, dé clic en el ícono.</p>

            <img
              src={iconImage}
              alt="Consultar tabla de clasificación"
              style={{ cursor: 'pointer', width: '50px' }}
              onClick={() => setShowModal14(true)}
            />

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="categoriaII"
                  onChange={(e) => handleCheckboxChange(e, 'categoriasGeneradores')}
                  checked={formValues.categoriasGeneradores.includes('categoriaII')}
                />
                Categoría II
              </label>
              <label>
                <input
                  type="checkbox"
                  value="categoriaIII"
                  onChange={(e) => handleCheckboxChange(e, 'categoriasGeneradores')}
                  checked={formValues.categoriasGeneradores.includes('categoriaIII')}
                />
                Categoría III
              </label>
            </div>

            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>siguiente</button>
            </div>
          </div>
        )}

        

        {/* Modal para el paso 14 */}
        {showModal14 && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal14(false)}>&times;</span>
              <img src={generadoresImage} alt="Categorías de generadores de vapor" style={{ width: '100%' }} />
            </div>
          </div>
        )}
        {step === 15 && (
          <div className="step15">
            <h3>Cargas Eléctricas Estáticas</h3>
            <label>
              ¿En los procesos que se realizan en el centro de trabajo se emplean materiales, sustancias o equipos capaces de almacenar o generar cargas eléctricas estáticas?
            </label>
            <label>
              <input
                type="radio"
                name="cargasEstaticas"
                value="sí"
                onChange={handleInputChange}
                checked={formValues.cargasEstaticas === 'sí'}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="cargasEstaticas"
                value="no"
                onChange={handleInputChange}
                checked={formValues.cargasEstaticas === 'no'}
              />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>siguiente</button>
            </div>
          </div>
        )}

{step === 16 && (
          <div className="step16">
            <h3>Materiales en Fricción</h3>
            <label>
              ¿En su centro de trabajo se tiene maquinaria, equipos o procesos en los que existan materiales en fricción?
            </label>
            <label>
              <input
                type="radio"
                name="materialesFriccion"
                value="sí"
                onChange={handleInputChange}
                checked={formValues.materialesFriccion === 'sí'}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="materialesFriccion"
                value="no"
                onChange={handleInputChange}
                checked={formValues.materialesFriccion === 'no'}
              />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>siguiente</button>
            </div>
          </div>
        )}


{step === 17 && (
          <div className="step17">
            <h3>Actividades de Soldadura y Corte</h3>
            <label>
              ¿En el centro de trabajo se realizan actividades de soldadura y corte?
            </label>
            <label>
              <input
                type="radio"
                name="soldaduraCorte"
                value="sí"
                onChange={handleInputChange}
                checked={formValues.soldaduraCorte === 'sí'}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="soldaduraCorte"
                value="no"
                onChange={handleInputChange}
                checked={formValues.soldaduraCorte === 'no'}
              />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>siguiente</button>
            </div>
          </div>
        )}

{step === 18 && (
          <div className="step18">
            <h3>Actividades de Soldadura en Alturas y Espacios Confinados</h3>
            <label>
              ¿Las actividades de soldadura y corte se realizan en: alturas, sótanos, subterráneos, 
              espacios confinados o en recipientes donde existan polvos, gases o vapores inflamables o explosivos?
            </label>
            <label>
              <input
                type="radio"
                name="soldaduraAltura"
                value="sí"
                onChange={handleInputChange}
                checked={formValues.soldaduraAltura === 'sí'}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="soldaduraAltura"
                value="no"
                onChange={handleInputChange}
                checked={formValues.soldaduraAltura === 'no'}
              />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>siguiente</button>
            </div>
          </div>
        )}

         {/* Paso 19 - Instalaciones eléctricas */}
         {step === 19 && (
          <div className="step19">
            <h3>Instalaciones Eléctricas</h3>
            <label>¿En su centro de trabajo existen instalaciones eléctricas permanentes o provisionales?</label>
            <label>
              <input
                type="radio"
                name="instalacionesElectricas"
                value="sí"
                onChange={handleInputChange}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="instalacionesElectricas"
                value="no"
                onChange={handleInputChange}
              />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Siguiente</button>
            </div>
          </div>
        )}

{step === 20 && (
          <div className="step20">
            <h3>Actividades de mantenimiento en líneas eléctricas</h3>
            <label>¿En su centro de trabajo se desarrollan actividades de mantenimiento en las líneas eléctricas aéreas o subterráneas o energizadas?</label>
            <label>
              <input
                type="radio"
                name="mantenimientoLineasElectricas"
                value="sí"
                onChange={handleInputChange}
                checked={formValues.mantenimientoLineasElectricas === 'sí'}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="mantenimientoLineasElectricas"
                value="no"
                onChange={handleInputChange}
                checked={formValues.mantenimientoLineasElectricas === 'no'}
              />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Siguiente</button>
            </div>
          </div>
        )}

{step === 21 && (
          <div className="step21">
            <h3>Trabajos de Mantenimiento con Líneas Energizadas</h3>
            <label>
              ¿Los trabajos de mantenimiento a las instalaciones eléctricas se realizan con las líneas energizadas?
            </label>
            <label>
              <input
                type="radio"
                name="mantenimientoEnergizadas"
                value="sí"
                onChange={handleInputChange}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="mantenimientoEnergizadas"
                value="no"
                onChange={handleInputChange}
              />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>
                Continuar
              </button>
            </div>
          </div>
        )}

{step === 22 && (
          <div className="step22">
            <h3>Trabajos en Espacios Confinados</h3>
            <label>
              ¿En su centro laboral se realizan trabajos en espacios confinados?
            </label>
            <label>
              <input
                type="radio"
                name="trabajosEspaciosConfinados"
                value="sí"
                onChange={handleInputChange}
              />
              Sí
            </label>
            <label>
              <input
                type="radio"
                name="trabajosEspaciosConfinados"
                value="no"
                onChange={handleInputChange}
              />
              No
            </label>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>
                Continuar
              </button>
            </div>
          </div>
        )}

{step === 23 && (
          <div className="step23">
            <h3>Tipos de Espacios Confinados</h3>
            <label>
              Seleccione el tipo de espacio confinado en las cuales se desarrollarán las actividades en el centro de trabajo:
            </label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="tipoI"
                  onChange={(e) => handleCheckboxChange(e, 'tiposEspaciosConfinados')}
                  checked={formValues.tiposEspaciosConfinados.includes('tipoI')}
                />
                Tipo I
              </label>
              <label>
                <input
                  type="checkbox"
                  value="tipoII"
                  onChange={(e) => handleCheckboxChange(e, 'tiposEspaciosConfinados')}
                  checked={formValues.tiposEspaciosConfinados.includes('tipoII')}
                />
                Tipo II
              </label>
            </div>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>
                Continuar
              </button>
            </div>
          </div>
        )}
        
        

{step === 24 && (
  <div className="step25">
    <h3></h3>
    <label>
    ¿En su centro de trabajo laboran trabajadores con discapacidad?
    </label>
    <label>
      <input
        type="radio"
        name="trabajadoresDiscapacidad"
        value="sí"
        onChange={handleInputChange}
        checked={formValues.trabajadoresDiscapacidad === 'sí'}
      />
      Sí
    </label>
    <label>
      <input
        type="radio"
        name="trabajadoresDiscapacidad"
        value="no"
        onChange={handleInputChange}
        checked={formValues.trabajadoresDiscapacidad === 'no'}
      />
      No
    </label>

    <div className="buttons">
      <button onClick={handleBack}>Regresar</button>
      <button onClick={handleNext} disabled={!isStepCompleted()}>Siguiente</button>
    </div>
  </div>
)}

  
  {step === 25 && (
        <div>
          <h3></h3>
          <label>
          Seleccione el tipo de discapacidad que presenta el personal que labora en su centro de trabajo:
          </label>
          <label>
            <input
              type="checkbox"
              value="Discapacidad física"
              onChange={(e) => handleCheckboxChange(e, 'tiposDiscapacidad')}
            />
            Discapacidad física
          </label>
          <label>
            <input
              type="checkbox"
              value="Discapacidad mental"
              onChange={(e) => handleCheckboxChange(e, 'tiposDiscapacidad')}
            />
            Discapacidad mental
          </label>
          <label>
            <input
              type="checkbox"
              value="Discapacidad intelectual"
              onChange={(e) => handleCheckboxChange(e, 'tiposDiscapacidad')}
            />
            Discapacidad intelectual
          </label>
          <label>
            <input
              type="checkbox"
              value="Discapacidad sensorial"
              onChange={(e) => handleCheckboxChange(e, 'tiposDiscapacidad')}
            />
            Discapacidad sensorial
          </label>
          <div className="buttons">
            <button onClick={handleBack}>Regresar</button>
            <button onClick={handleNext} disabled={!isStepCompleted()}>Siguiente</button>
          </div>
        </div>
      )}

{step === 26 && (
        <div>
          <h3>
          </h3>
          <label >¿En su centro de trabajo, existe algún área donde los trabajadores estén expuestos a niveles de ruido superiores a 80 decibeles?</label>
          <label>
            <input
              type="radio"
              name="exposicionRuido"
              value="Sí"
              onChange={handleInputChange}
              checked={formValues.exposicionRuido === 'Sí'}
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="exposicionRuido"
              value="No"
              onChange={handleInputChange}
              checked={formValues.exposicionRuido === 'No'}
            />
            No
          </label>
          <label>
            <input
              type="radio"
              name="exposicionRuido"
              value="No sé"
              onChange={handleInputChange}
              checked={formValues.exposicionRuido === 'No sé'}
            />
            No sé
          </label>
          <div className="buttons">
            <button onClick={handleBack}>Regresar</button>
            <button onClick={handleNext} disabled={!isStepCompleted()}>Siguiente</button>
          </div>
        </div>
      )}

{step === 27 && (
        <div>
          <h3>
          </h3>
          <label> ¿En su centro de trabajo, los trabajadores están expuestos a instalaciones, equipos, productos o materiales que ocasionen que su temperatura corporal descienda a menos de 36 grados centígrados?</label>
          <label>
            <input
              type="radio"
              name="exposicionFrio"
              value="Sí"
              onChange={handleInputChange}
              checked={formValues.exposicionFrio === 'Sí'}
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="exposicionFrio"
              value="No"
              onChange={handleInputChange}
              checked={formValues.exposicionFrio === 'No'}
            />
            No
          </label>
          <div className="buttons">
            <button onClick={handleBack}>Regresar</button>
            <button onClick={handleNext} disabled={!isStepCompleted()}>Siguiente</button>
          </div>
        </div>
      )}


      {step === 28 && (
        <div>
          <h3>
          </h3>
          <label> ¿Los trabajadores realizan actividades o están expuestos a instalaciones, equipos, productos o materiales que ocasionen que su temperatura corporal sea mayor a 38 grados centígrados?
          </label>
          <label>
            <input
              type="radio"
              name="exposicioncalor"
              value="Sí"
              onChange={handleInputChange}
              checked={formValues.exposicioncalor === 'Sí'}
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="exposicioncalor"
              value="No"
              onChange={handleInputChange}
              checked={formValues.exposicioncalor === 'No'}
            />
            No
          </label>
          <div className="buttons">
            <button onClick={handleBack}>Regresar</button>
            <button onClick={handleNext} disabled={!isStepCompleted()}>Siguiente</button>
          </div>
        </div>
      )}

      
{step === 29 && (
        <div>
          <h3>
          </h3>
          <label> ¿Los trabajadores están expuestos a vibraciones producidas por la operación de maquinaria, equipos o herramientas?

          </label>
          <label>
            <input
              type="radio"
              name="vibraciones"
              value="Sí"
              onChange={handleInputChange}
              checked={formValues.vibraciones === 'Sí'}
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="vibraciones"
              value="No"
              onChange={handleInputChange}
              checked={formValues.vibraciones === 'No'}
            />
            No
          </label>
          <div className="buttons">
            <button onClick={handleBack}>Regresar</button>
            <button onClick={handleNext} disabled={!isStepCompleted()}>Siguiente</button>
          </div>
        </div>
      )}

{step === 30 && (
          <div className="step30">
            <h3>Tipos de Espacios Confinados</h3>
            <label>
              Seleccione el tipo de espacio confinado en las cuales se desarrollarán las actividades en el centro de trabajo:
            </label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="Extremidades superiores"
                  onChange={(e) => handleCheckboxChange(e, 'exvibraciones')}
                  checked={formValues.exvibraciones.includes('Extremidades superiores')}
                />
              Extremidades superiores
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Extremidades inferiores"
                  onChange={(e) => handleCheckboxChange(e, 'exvibraciones')}
                  checked={formValues.exvibraciones.includes('Extremidades inferiores')}
                />
                Extremidades inferiores


              </label>
              <label>
                <input
                  type="checkbox"
                  value="tronco"
                  onChange={(e) => handleCheckboxChange(e, 'exvibraciones')}
                  checked={formValues.exvibraciones.includes('tronco')}
                />
               Tronco
              </label>

            </div>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>
                Continuar
              </button>
            </div>
          </div>
        )}

              
{step === 31 && (
        <div>
          <h3>
          </h3>
          <label> ¿En su centro de trabajo se realizan actividades que impliquen el manejo manual de cargas mayores a 3kg de forma cotidiana (más de una vez al día)?

          </label>
          <label>
            <input
              type="radio"
              name="manejocargas"
              value="Sí"
              onChange={handleInputChange}
              checked={formValues.manejocargas === 'Sí'}
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="manejocargas"
              value="No"
              onChange={handleInputChange}
              checked={formValues.manejocargas === 'No'}
            />
            No
          </label>
          <div className="buttons">
            <button onClick={handleBack}>Regresar</button>
            <button onClick={handleNext} disabled={!isStepCompleted()}>Siguiente</button>
          </div>
        </div>
      )}


{step === 32 && (
          <div className="step32">
            <h3>Tipos de Espacios Confinados</h3>
            <label>
              Seleccione el tipo de espacio confinado en las cuales se desarrollarán las actividades en el centro de trabajo:
            </label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="Levantamiento y transporte de cargas"
                  onChange={(e) => handleCheckboxChange(e, 'actcargas')}
                  checked={formValues.actcargas.includes('Levantamiento y transporte de cargas')}
                />
              
                Levantamiento y transporte de cargas
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Empujar o jalar cargas de peso con o sin ayuda del equipo auxilia"
                  onChange={(e) => handleCheckboxChange(e, 'actcargas')}
                  checked={formValues.actcargas.includes('Empujar o jalar cargas de peso con o sin ayuda del equipo auxilia')}
                />
                Empujar o jalar cargas de peso con o sin ayuda del equipo auxiliar


              </label>
              <label>
                <input
                  type="checkbox"
                  value="Ambas"
                  onChange={(e) => handleCheckboxChange(e, 'actcargas')}
                  checked={formValues.actcargas.includes('Ambas')}
                />
               Ambas
              </label>

            </div>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>
                Continuar
              </button>
            </div>
          </div>
        )}



{step === 33 && (
          <div className="step33">
            <h3></h3>
            <label>
            Seleccione el tipo de actividades agrícolas que desarrollan los trabajadores con insumos fitosanitarios o plaguicidas e insumos de nutrición vegetal o fertilizantes:
            </label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="Traslado"
                  onChange={(e) => handleCheckboxChange(e, 'actagricolas')}
                  checked={formValues.actagricolas.includes('Traslado')}
                />
              
              Traslado
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Almacenamiento"
                  onChange={(e) => handleCheckboxChange(e, 'actagricolas')}
                  checked={formValues.actagricolas.includes('Almacenamiento')}
                />
                Almacenamiento

              </label>
              <label>
                <input
                  type="checkbox"
                  value="Manejo"
                  onChange={(e) => handleCheckboxChange(e, 'actagricolas')}
                  checked={formValues.actagricolas.includes('Manejo')}
                />
               Manejo
              </label>

            </div>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>
                Continuar
              </button>
            </div>
          </div>
        )}



{step === 34 && (
          <div className="step34">
            <h3></h3>
            <label>
            Indique el tipo de infraestructura (elementos de producción) que se utiliza en el centro de trabajo para el desarrollo de actividades agrícolas:            </label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  value="Instalaciones"
                  onChange={(e) => handleCheckboxChange(e, 'infrestructura')}
                  checked={formValues.infrestructura.includes('Instalaciones')}
                />
              
              Instalaciones
              </label>
              <label>
                <input
                  type="checkbox"
                  value="Maquinaria"
                  onChange={(e) => handleCheckboxChange(e, 'infrestructura')}
                  checked={formValues.infrestructura.includes('Maquinaria')}
                />
                Maquinaria

              </label>
              <label>
                <input
                  type="checkbox"
                  value="Equipo"
                  onChange={(e) => handleCheckboxChange(e, 'infrestructura')}
                  checked={formValues.infrestructura.includes('Equipo')}
                />
               Equipo
              </label>


              <label>
                <input
                  type="checkbox"
                  value="Herramientas"
                  onChange={(e) => handleCheckboxChange(e, 'infrestructura')}
                  checked={formValues.infrestructura.includes('Herramientas')}
                />
               Herramientas

              </label>







            </div>
            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>
                Continuar
              </button>
            </div>
          </div>
        )}



{step === 35 && (
        <div>
          <h3>
          </h3>
          <label> ¿El centro de trabajo realiza trabajos de construcción?


          </label>
          <label>
            <input
              type="radio"
              name="materialc"
              value="Sí"
              onChange={handleInputChange}
              checked={formValues.materialc === 'Sí'}
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="materialc"
              value="No"
              onChange={handleInputChange}
              checked={formValues.manejocargas === 'No'}
            />
            No
          </label>
          <div className="buttons">
            <button onClick={handleBack}>Regresar</button>
            <button onClick={handleNext} disabled={!isStepCompleted()}>Siguiente</button>
          </div>
        </div>
      )}

       {/* Paso 36 - Clasificación del tamaño de la obra de construcción */}
       {step === 36 && (
          <div className="step36">
            <h3>Clasificación del tamaño de la obra de construcción</h3>
            <p>Proporcione la siguiente información:</p>

            <label>
              Superficie por construir o demoler:
              <input
                type="number"
                name="superficieConstruir"
                value={formValues.superficieConstruir}
                onChange={handleInputChange}
                required
              />
              metros cuadrados
            </label>

            <label>
              Altura de la construcción:
              <input
                type="number"
                name="alturaConstruccion"
                value={formValues.alturaConstruccion}
                onChange={handleInputChange}
                required
              />
              metros
            </label>

            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
            </div>
          </div>
        )}


{step === 37 && (
        <div>
          <h3>
          </h3>
          <label> ¿En el centro de trabajo se manejan, transportan, procesan o almacenan sustancias químicas que por sus propiedades, niveles de concentración y tiempo de exposición sean capaces de contaminar el medio ambiente laboral, alterar la salud de los trabajadores y/o dañar el centro de trabajo?


          </label>
          <label>
            <input
              type="radio"
              name="materialp"
              value="Sí"
              onChange={handleInputChange}
              checked={formValues.materialp === 'Sí'}
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="materialp"
              value="No"
              onChange={handleInputChange}
              checked={formValues.materialp === 'No'}
            />
            No
          </label>
          <div className="buttons">
            <button onClick={handleBack}>Regresar</button>
            <button onClick={handleNext} disabled={!isStepCompleted()}>Siguiente</button>
          </div>
        </div>
      )}


{step === 38 && (
          <div className="step38">
            <h3>Menú Final</h3>
            <button onClick={handleShowTable} className="menu-button">
              NOMs aplicables por secciones
            </button>

            {/* Mostrar la tabla de normas cuando se haga clic en el botón */}
            {showTable && (
              <div className="normas-table">
                <table border="1" align="center" cellpadding="0" cellspacing="0">
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Título de la norma</th>
                      <th>Obligaciones - Patrón</th>
                      <th>Obligaciones - Trabajadores</th>
                      <th>Obligaciones - Generales</th>
                      <th>Disposiciones específicas</th>
                      <th>Obtener archivo de la NOM</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>NOM-001</td>
                      <td>Edificios, locales e instalaciones</td>
                      <td>
                        <a href="#">5.2</a>, <a href="#">5.3</a>, <a href="#">5.4</a>
                      </td>
                      <td>
                        <a href="#">6.1</a>, <a href="#">6.2</a>, <a href="#">6.3</a>
                      </td>
                      <td>
                        <a href="#">5.1</a>, <a href="#">7.1</a>, <a href="#">7.1.1</a>
                      </td>
                      <td>
                        <a href="#">7.5</a>, <a href="#">7.5.1</a>, <a href="#">7.5.2</a>
                      </td>
                      <td>
                        <a href="/noms/NOM-001.pdf" target="_blank">Descargar</a>
                      </td>
                    </tr>
                    <tr>
                      <td>NOM-002</td>
                      <td>Prevención y protección contra incendios</td>
                      <td>
                        <a href="#">5</a>, <a href="#">5.1</a>, <a href="#">5.2</a>
                      </td>
                      <td>
                        <a href="#">6.1</a>, <a href="#">6.2</a>
                      </td>
                      <td>
                        <a href="#">7.1</a>, <a href="#">7.2</a>
                      </td>
                      <td>
                        <a href="#">7.6</a>, <a href="#">7.6.1</a>
                      </td>
                      <td>
                        <a href="/noms/NOM-002.pdf" target="_blank">Descargar</a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            <div className="buttons">
              <button onClick={handleBack}>Regresar</button>
              <button onClick={handleNext}>Finalizar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NormaNoms;
