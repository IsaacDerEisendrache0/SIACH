import React from 'react';
import './Table.css'; // Asegúrate de que el archivo CSS esté correctamente importado

const Table = () => {
    return (
        <div className="table-container">
            <table>
                <tbody>
                    <tr>
                        <td colSpan="15"></td>
                    </tr>
                    <tr>
                        <td>Puesto de trabajo:</td>
                        <td colSpan="5"></td>
                        <td>Ayudante de empaque y envase.</td>
                        <td colSpan="3"></td>
                        <td>Área:</td>
                        <td>Producción</td>
                        <td colSpan="2"></td>
                    </tr>
                    <tr>
                        <td>Descripción de la actividad:</td>
                        <td colSpan="5"></td>
                        <td>Recibir, alistar, empacar y entregar, productos en condiciones adecuadas de aseo e higiene.</td>
                        <td colSpan="4"></td>
                        <td>Fecha de inspección:</td>
                        <td colSpan="2"></td>
                        <td>4/6/24</td>
                    </tr>
                    <tr>
                        <td colSpan="5"></td>
                        <td>Tiempo de exposición:</td>
                        <td colSpan="6"></td>
                        <td>8 hrs</td>
                    </tr>
                    <tr>
                        <td>Principales partes del cuerpo expuestas al riesgo:</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Cabeza y Oídos:</td>
                        <td></td>
                        <td>X</td>
                        <td>Ojos y Cara:</td>
                        <td></td>
                        <td>X</td>
                        <td>Sistema respiratorio:</td>
                        <td></td>
                        <td></td>
                        <td>X</td>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Brazos y Manos:</td>
                        <td></td>
                        <td>X</td>
                        <td>Tronco:</td>
                        <td></td>
                        <td>X</td>
                        <td>Extremidades inferiores:</td>
                        <td></td>
                        <td></td>
                        <td>X</td>
                    </tr>
                    <tr>
                        <td>Identificación de peligros:</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Si/No</td>
                        <td>Equipo de protección utilizado</td>
                        <td colSpan="3"></td>
                        <td>Equipo de protección personal sugerido</td>
                        <td colSpan="4"></td>
                    </tr>
                    {/* Añadir más filas según lo requerido */}
                    <tr>
                        <td>1. Caídas de Altura:</td>
                        <td colSpan="3"></td>
                        <td>No</td>
                        <td colSpan="6"></td>
                        <td></td>
                        <td colSpan="2"></td>
                    </tr>
                    <tr>
                        <td>2. Exposición a Temperaturas:</td>
                        <td colSpan="3"></td>
                        <td>No</td>
                        <td colSpan="6"></td>
                        <td></td>
                        <td colSpan="2"></td>
                    </tr>
                    <tr>
                        <td>3. Exposición a Electricidad Estática:</td>
                        <td colSpan="3"></td>
                        <td>Si</td>
                        <td colSpan="6"></td>
                        <td></td>
                        <td colSpan="2"></td>
                    </tr>
                    <tr>
                        <td>4. Exposición a Sustancias Químicas:</td>
                        <td colSpan="3"></td>
                        <td>No</td>
                        <td colSpan="6"></td>
                        <td></td>
                        <td colSpan="2"></td>
                    </tr>
                    <tr>
                        <td>5. Exposición a Radiaciones:</td>
                        <td colSpan="3"></td>
                        <td>No</td>
                        <td colSpan="6"></td>
                        <td></td>
                        <td colSpan="2"></td>
                    </tr>
                    <tr>
                        <td>6. Exposición agentes Biológicos:</td>
                        <td colSpan="3"></td>
                        <td>No</td>
                        <td colSpan="6"></td>
                        <td></td>
                        <td colSpan="2"></td>
                    </tr>
                    <tr>
                        <td>7. Exposición a Ruido:</td>
                        <td colSpan="3"></td>
                        <td>Si</td>
                        <td colSpan="6"></td>
                        <td></td>
                        <td colSpan="2"></td>
                    </tr>
                    <tr>
                        <td>8. Exposición a Vibraciones:</td>
                        <td colSpan="3"></td>
                        <td>No</td>
                        <td colSpan="6"></td>
                        <td></td>
                        <td colSpan="2"></td>
                    </tr>
                    <tr>
                        <td>9. Superficies cortantes:</td>
                        <td colSpan="3"></td>
                        <td>Si</td>
                        <td colSpan="6"></td>
                        <td></td>
                        <td colSpan="2"></td>
                    </tr>
                    <tr>
                        <td>10. Caídas a nivel o desnivel:</td>
                        <td colSpan="3"></td>
                        <td>Si</td>
                        <td colSpan="6"></td>
                        <td></td>
                        <td colSpan="2"></td>
                    </tr>
                    <tr>
                        <td>11. Daños Ergonómicos</td>
                        <td colSpan="3"></td>
                        <td>Si</td>
                        <td colSpan="6"></td>
                        <td></td>
                        <td colSpan="2"></td>
                    </tr>
                    <tr>
                        <td>12. Calentamiento de materia prima, subproducto o producto:</td>
                        <td colSpan="3"></td>
                        <td>No</td>
                        <td colSpan="6"></td>
                        <td></td>
                        <td colSpan="2"></td>
                    </tr>
                    <tr>
                        <td colSpan="15"></td>
                    </tr>
                    <tr>
                        <td>13. Proyección de material o herramienta:</td>
                        <td colSpan="3"></td>
                        <td>No</td>
                        <td colSpan="6"></td>
                        <td></td>
                        <td colSpan="2"></td>
                    </tr>
                    <tr>
                        <td>14. Exposición a polvos</td>
                        <td colSpan="3"></td>
                        <td>Si</td>
                        <td colSpan="6"></td>
                        <td></td>
                        <td colSpan="2"></td>
                    </tr>
                    <tr>
                        <td colSpan="15"></td>
                    </tr>
                    <tr>
                        <td>Descripción del equipo de protección personal</td>
                        <td colSpan="14"></td>
                    </tr>
                    <tr>
                        <td>Uso obligatorio de zapatos dielectricos, lentes, tapones auditivos, casco, mascarilla vs polvos, guantes de nitrilo y overol.</td>
                        <td colSpan="14"></td>
                    </tr>
                    <tr>
                        <td colSpan="15"></td>
                    </tr>
                    <tr>
                        <td>Evaluación de riesgo de trabajo</td>
                        <td colSpan="7"></td>
                        <td>Probabilidad de ocurrencia</td>
                        <td colSpan="4"></td>
                        <td>Clasificación</td>
                        <td colSpan="3"></td>
                    </tr>
                    <tr>
                        <td>Lesiones menores</td>
                        <td></td>
                        <td>Raramente</td>
                        <td></td>
                        <td>Coincidencia muy rara en condiciones normales de trabajo</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Clasificación:</td>
                        <td></td>
                        <td></td>
                        <td>Baja</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Lesiones moderadas</td>
                        <td></td>
                        <td>Ocasionalmente</td>
                        <td></td>
                        <td>Coincidencia ocasional y sin precedentes en las condiciones actuales</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Clasificación:</td>
                        <td></td>
                        <td></td>
                        <td>Moderada</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Lesiones severas</td>
                        <td></td>
                        <td>Frecuentemente</td>
                        <td></td>
                        <td>Coincidencia frecuente en condiciones normales de trabajo</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Clasificación:</td>
                        <td></td>
                        <td></td>
                        <td>Alta</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Lesiones fatales</td>
                        <td></td>
                        <td>Continuamente</td>
                        <td></td>
                        <td>Coincidencia continua, muy probable</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>Clasificación:</td>
                        <td></td>
                        <td></td>
                        <td>Extremadamente Alta</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan="15"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Table;
