import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NormaNoms.css';

const NormaNoms = () => {
  const [selection, setSelection] = useState('0');
  const [showForm, setShowForm] = useState(false);
  const [showNextSection, setShowNextSection] = useState(false); 
  const [answer, setAnswer] = useState('');
  const [materialesPiroforicos, setMaterialesPiroforicos] = useState(''); // Nuevo estado para materiales pirofóricos
  const navigate = useNavigate();

  const handleSelectionChange = (e) => {
    setSelection(e.target.value);
  };

  const handleContinue = () => {
    if (selection === '0') {
      setShowForm(true);
    } else {
      navigate('/otro-formulario');
    }
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleMaterialesChange = (e) => {
    setMaterialesPiroforicos(e.target.value); // Guardar respuesta de materiales pirofóricos
  };

  const handleNextSection = (e) => {
    e.preventDefault(); // Evitar el comportamiento por defecto del formulario
    if (materialesPiroforicos === '1') {
      setShowNextSection(true); // Mostrar la siguiente sección si hay materiales pirofóricos
    } else {
      // Si no hay materiales pirofóricos, puedes redirigir a otra parte o hacer otra acción
      navigate('/otra-seccion'); // Ejemplo de navegación a otra sección
    }
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
          <button onClick={() => navigate(-1)}>Regresar</button>
          <button onClick={handleContinue}>Continuar</button>
        </div>

        {/* Mostrar el formulario solo si showForm es verdadero */}
        {showForm && (
          <div className="fire-risk-assessment">
            <h3>Determinación del grado de riesgo de incendio</h3>
            <br /><br />
            
            <table id="ContentPlaceHolder1_UsrRNo" border="0" cellpadding="0" cellspacing="0" style={{ width: '532px' }}>
              <tr>
                <td className="tablaresultados1" style={{ width: '248px', height: '12px', textAlign: 'left' }}>
                  Nombre o razón social:
                </td>
                <td style={{ height: '12px', textAlign: 'left', width: '393px' }}></td>
              </tr>
            </table>

            <table id="Table3" border="0" cellpadding="0" cellspacing="0" width="532">
              <tr>
                <td className="tablaresultados1" style={{ width: '207px', height: '12px', textAlign: 'left' }}>
                  Área, departamento o proceso:
                </td>
                <td style={{ height: '12px', textAlign: 'left' }}>
                  TODO EL CENTRO DE TRABAJO
                </td>
              </tr>
            </table>
            <br />

            <table align="center" border="0" cellpadding="0" cellspacing="0" width="532">
              <tr>
                <th width="522">
                  <p align="left" style={{ textAlign: 'left' }}>
                    <img alt="" height="16" src="../App_Themes/Tema1/Imagenes/action_go2.gif" width="16" />
                    Proporcione la siguiente información:
                  </p>
                  <p align="left">&nbsp;</p>
                </th>
              </tr>
            </table>

            <table align="center" border="0" cellpadding="0" cellspacing="10" width="532">
              <tr>
                <td style={{ textAlign: 'left' }}>Superficie construida</td>
                <td style={{ textAlign: 'left' }}>
                  <input name="ctl00$ContentPlaceHolder1$superficie" type="text" id="ContentPlaceHolder1_superficie" /><br />
                  <span id="ContentPlaceHolder1_RequiredFieldValidator3" style={{ display: 'none' }}>Campo requerido</span>
                </td>
                <td style={{ textAlign: 'left' }}>metros cuadrados</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>Inventario de gases inflamables</td>
                <td style={{ textAlign: 'left' }}>
                  <input name="ctl00$ContentPlaceHolder1$invGases" type="text" id="ContentPlaceHolder1_invGases" /><br />
                  <span id="ContentPlaceHolder1_RequiredFieldValidator4" style={{ display: 'none' }}>Campo requerido</span>
                </td>
                <td style={{ textAlign: 'left' }}>litros</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>Inventario de líquidos inflamables</td>
                <td style={{ textAlign: 'left' }}>
                  <input name="ctl00$ContentPlaceHolder1$invLiquidosi" type="text" id="ContentPlaceHolder1_invLiquidosi" /><br />
                  <span id="ContentPlaceHolder1_RequiredFieldValidator5" style={{ display: 'none' }}>Campo requerido</span>
                </td>
                <td style={{ textAlign: 'left' }}>litros</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>Inventario de líquidos combustibles</td>
                <td style={{ textAlign: 'left' }}>
                  <input name="ctl00$ContentPlaceHolder1$invLiquidosc" type="text" id="ContentPlaceHolder1_invLiquidosc" /><br />
                  <span id="ContentPlaceHolder1_RequiredFieldValidator6" style={{ display: 'none' }}>Campo requerido</span>
                </td>
                <td style={{ textAlign: 'left' }}>litros</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>Inventario de sólidos combustibles, incluido el mobiliario del centro de trabajo</td>
                <td style={{ textAlign: 'left' }}>
                  <input name="ctl00$ContentPlaceHolder1$invSolidos" type="text" id="ContentPlaceHolder1_invSolidos" /><br />
                  <span id="ContentPlaceHolder1_RequiredFieldValidator7" style={{ display: 'none' }}>Campo requerido</span>
                </td>
                <td style={{ textAlign: 'left' }}>kilogramos</td>
              </tr>
            </table>

            {/* Nueva sección para la pregunta de materiales pirofóricos o explosivos */}
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="532">
              <tr>
                <th width="522">
                  <p align="left" style={{ textAlign: 'left' }}>
                    <img alt="" height="16" src="../App_Themes/Tema1/Imagenes/action_go2.gif" width="16" />
                    ¿Tiene inventario de materiales pirofóricos o explosivos?
                  </p>
                  <p align="left" style={{ textAlign: 'left' }}>&nbsp;</p>
                </th>
              </tr>
            </table>

            <table align="center" border="0" cellpadding="0" cellspacing="10" width="532">
              <tr>
                <td align="right" colspan="3" style={{ textAlign: 'left' }}>
                  <table id="ContentPlaceHolder1_tieneMateriales" style={{ width: '150px' }}>
                    <tr>
                      <td>
                        <input
                          id="ContentPlaceHolder1_tieneMateriales_0"
                          type="radio"
                          name="ctl00$ContentPlaceHolder1$tieneMateriales"
                          value="1"
                          onChange={handleMaterialesChange}
                        />
                        <label htmlFor="ContentPlaceHolder1_tieneMateriales_0">Sí</label>
                      </td>
                      <td>
                        <input
                          id="ContentPlaceHolder1_tieneMateriales_1"
                          type="radio"
                          name="ctl00$ContentPlaceHolder1$tieneMateriales"
                          value="0"
                          onChange={handleMaterialesChange}
                        />
                        <label htmlFor="ContentPlaceHolder1_tieneMateriales_1">No</label>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            {/* Botón para avanzar a la siguiente sección */}
            {showNextSection && (
              <div className="buttons">
                <button onClick={handleNextSection}>Siguiente</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NormaNoms;
