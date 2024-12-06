import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NormaNoms.css';
import iconImage from './images/icon.png';
import exceptImage from './images/excepted_recipients.png';
import categoriasImage from './images/categorias_presion.png';
import criogenicosImage from './images/criogenicos.png';
import generadoresImage from './images/generadores_vapor.png';
import riesgoImage from './images/riesgo-incendio.png';
import obraImage from './images/obra-construccion.png';


// Continuación del array normas con más normas y sus condiciones
const normas = [
  { 
    id: 'NOM-001', 
    tipo: 'Seguridad',
    title: 'Edificios, locales e instalaciones', 
    puntos: [
      { numero: '5.6', descripcion: 'Constancia documental de que proporcionó información a todos los trabajadores para el uso y conservación de las áreas donde realizan sus actividades en el centro de trabajo, incluidas las destinadas para el servicio de los trabajadores' },
      { numero: '7.3 c)', descripcion: 'Medidas contra incendios en áreas críticas.' },
      { numero: '8.3', descripcion: 'Sistema de ventilación y control de gases.' }
    ],
    condition: (values) => values.areaTrabajo === 'centro'|| values.areaTrabajo === 'sí' 
  },

 
  {
    id: 'NOM-002', 
    tipo: 'Seguridad',
    title: 'Prevención y protección contra incendios', 
    puntos: [
      { numero: '5.1', descripcion: 'Estudio para la clasificación del grado de riesgo de incendio.' },
      { numero: '5.2', descripcion: 'Contar con un croquis, plano o mapa actualizado del centro de trabajo.' },
      { numero: '5.5', descripcion: 'Plan de atención a emergencias de incendio.' },
      { numero: '5.7', descripcion: 'Programa anual y registros de simulacros.' },
      { numero: '5.8', descripcion: 'Capacitación de brigadas de emergencia.' },
      { numero: '5.8', descripcion: 'Programa de capacitación teórico-práctico en materia de prevención contra incendios y atención a emergencias.' },
      { numero: '5.8', descripcion: 'Capacitar a todo el personal en los procedimientos de emergencia y evacuación.' },
      { numero: '5.11', descripcion: 'Programa interno de protección civil / liberación por Autogestión o Dictamen de Cumplimiento de la NOM-002-STPS-2010.' },
      { numero: '5.11', descripcion: 'D Preventiva Anual (PC / PASST), Cada 2 años (UV).' },
      { numero: '7.2', descripcion: 'Programa anual de revisión mensual de los extintores.' },
      { numero: '7.4', descripcion: 'Programa anual de revisión y pruebas a los equipos contra incendio, a los medios de detección y, en su caso, a las alarmas de incendio y sistemas fijos contra incendio.' },
      { numero: '7.5', descripcion: 'Programa anual de revisión a las instalaciones eléctricas de las áreas del centro de trabajo.' }
    ],
    condition: (values) => values.materialesPiroforicos === 'sí'
  }
  ,
  {
    id: 'NOM-004',
    tipo: 'Seguridad',
    title: 'Uso de maquinaria y equipo',
    puntos: [
      { numero: '5.2', descripcion: 'Estudio para analizar el riesgo en maquinaria.' },
      { numero: '5.3 a)', descripcion: 'Elaborar el Programa Específico de Seguridad e Higiene para Operación y Mantenimiento.' },
      { numero: '5.3 b)', descripcion: 'Manual de primeros auxilios en el que se definan los procedimientos para la atención de emergencias.' },
      { numero: '5.4', descripcion: 'Capacitar a los trabajadores para la operación segura de la maquinaria y equipo.' },
      { numero: '7', descripcion: 'Procedimientos de seguridad para la revisión, operación y mantenimiento de la maquinaria y equipo.' },
    ],
    condition: (values) => values.maquinaria === 'sí'
  },
  
  { 
    id: 'NOM-005', 
    tipo: 'Seguridad',
    title: 'Manejo de sustancias químicas peligrosas', 
    puntos: [
      { 
        numero: '5.2', 
        descripcion: 'Estudio para analizar los riesgos potenciales de sustancias químicas peligrosas presentes en el centro de trabajo. D Preventiva Único (Actualizar cuando aplique)' 
      },
      { 
        numero: '5.3', 
        descripcion: 'Manuales y procedimientos de seguridad para el manejo, transporte y almacenamiento seguro de sustancias químicas peligrosas. D Preventiva Único, mantener actualizado' 
      },
      { 
        numero: '5.6', 
        descripcion: 'Manual de primeros auxilios para la atención de emergencias médicas, elaborado de los resultados de estudio del riesgo potencial en las sustancias químicas peligrosas. D/F Preventiva Único, mantener' 
      },
      { 
        numero: '5.12', 
        descripcion: 'Programa Específico de Seguridad e Higiene para el Manejo, Transporte y Almacenamiento de Sustancias Químicas Peligrosas. D Preventiva Anual' 
      },
      { 
        numero: '5.13', 
        descripcion: 'Constancias de competencias o de habilidades laborales de la capacitación continua a los trabajadores sobre el programa específico de seguridad e higiene para el manejo, transporte y almacenamiento de sustancias químicas peligrosas.' 
      },
      { 
        numero: '5.16', 
        descripcion: 'Comprobación de que se comunica a los trabajadores, los riesgos a los que están expuestos' 
      }
    ],
    condition: (values) => values.sustanciasPeligrosas === 'sí'
  },
  { 
    id: 'NOM-006', 
    tipo: 'Seguridad',
    title: 'Manejo y almacenamiento de materiales', 
    puntos: [
      { 
        numero: '5.1', 
        descripcion: 'Programa específico para la revisión y mantenimiento de la maquinaria y equipos empleados para el manejo y almacenamiento de materiales. D Preventiva Conforme a las recomendaciones del fabricante.' 
      },
      { 
        numero: '5.3', 
        descripcion: 'Procedimientos de seguridad para realizar las actividades de manejo de materiales, a través del uso de maquinaria. D Preventiva Único, mantener.' 
      },
      { 
        numero: '5.7', 
        descripcion: 'Manual de primeros auxilios para la atención a emergencias, con base en el tipo de riesgos a que están expuestos los trabajadores que realizan el almacenamiento y manejo de materiales a través del uso de maquinaria. F/E Preventiva Único, mantener.' 
      },
      { 
        numero: '5.8', 
        descripcion: 'Comprobación de que se informa a los trabajadores sobre los riesgos a los que están expuestos en el almacenamiento y manejo de materiales por medio del uso de maquinaria. D/F Preventiva Anual.' 
      },
      { 
        numero: '5.9', 
        descripcion: 'Constancias de competencias o habilidades laborales que acrediten que se capacita y adiestra el patrón a los trabajadores involucrados en el almacenamiento y manejo de materiales a través del uso de maquinaria. D Preventiva/Correctiva Único.' 
      },
      { 
        numero: '9.6', 
        descripcion: 'Programa de mantenimiento para los elementos estructurales, estantes o plataformas que se utilicen para el almacenamiento de materiales y sus registros.' 
      }
    ],
    condition: (values) => values.manejoMateriales === 'sí'
  },
  // Aquí puedes agregar más normas con su estructura similar


  {
    id: 'NOM-009',
    tipo: 'Seguridad',
    title: 'Trabajos en altura',
    puntos: [
      {
        numero: '5.1',
        descripcion: 'Análisis de las condiciones prevalecientes en las áreas en las que se llevarán a cabo los trabajos en altura, en forma previa a su realización, a fin de identificar los factores de riesgo existentes. D Preventiva Permanente.'
      },
      {
        numero: '5.2',
        descripcion: 'Instructivos, manuales o procedimientos de seguridad para la instalación, operación y mantenimiento de los sistemas o equipos utilizados en los trabajos en altura, redactados en idioma español, con base en las instrucciones del fabricante. D Preventiva Único, mantener.'
      },
      {
        numero: '5.3',
        descripcion: 'Autorización por escrito a trabajadores que realicen trabajos en alturas. D Preventiva Permanente.'
      },
      {
        numero: '5.11',
        descripcion: 'Plan de atención a emergencias derivado de la ejecución de trabajos en alturas, conforme a lo establecido en la norma. D Preventiva/Correctiva Único, mantener.'
      },
      {
        numero: '5.13',
        descripcion: 'Constancias de competencias o habilidades laborales que acrediten que se capacita y adiestra el patrón a los trabajadores involucrados en la realización de trabajos en alturas, así como en lo relativo a la aplicación del plan de atención a emergencias.'
      }
    ],
    condition: (values) => values.trabajosAltura === 'sí'
  },
  
  {
    id: 'NOM-020',
    tipo: 'Seguridad',
    title: 'Recipientes sujetos a presión',
    puntos: [
      {
        numero: '5.2',
        descripcion: 'Listado actualizado de los equipos que se encuentren instalados en el centro de trabajo. D Preventiva Actualizar.'
      },
      {
        numero: '5.3',
        descripcion: 'Expediente de cada equipo que esté instalado en el centro de trabajo. D Preventiva Cada 5 años.'
      },
      {
        numero: '5.5',
        descripcion: 'Programas de revisión y calibración a los instrumentos de control y dispositivos de relevo de presión de los equipos, así como el registro de calibración de los mismos. D Preventiva Anual.'
      },
      {
        numero: '5.6',
        descripcion: 'Procedimientos de operación, revisión y mantenimiento de los equipos, en idioma español. D Preventiva Único, mantener actualizado.'
      },
      {
        numero: '5.14',
        descripcion: 'Difusión a los trabajadores y a la comisión de seguridad e higiene sobre los peligros y riesgos inherentes a los equipos y a los fluidos que contienen. D Preventiva Permanente.'
      },
      {
        numero: '10',
        descripcion: 'Programa específico de revisión y mantenimiento para los equipos y sus registros de ejecución. D Correctiva Anual.'
      },
      {
        numero: '17.1',
        descripcion: 'Capacitación al personal que realiza actividades de operación, mantenimiento, reparación y pruebas de presión o exámenes no destructivos.'
      }
    ],
    condition: (values) =>
      values.recipientesPresion === 'sí' ||
      values.recipientesCriogenicos === 'sí' ||
      values.generadoresVapor === 'sí'
  },
  

  { 
    id: 'NOM-022', 
    tipo: 'Seguridad',
    title: 'Electricidad estática', 
    puntos: [
      { numero: '5.2', descripcion: 'Contar con pararrayos en áreas con sustancias inflamables o explosivas.' },
      { numero: '5.3', descripcion: 'Medición de resistencia de la red de puesta a tierra y continuidad.' },
      { numero: '5.4', descripcion: 'Documento que informe a trabajadores sobre los riesgos de electricidad estática.' },
      { numero: '5.5', descripcion: 'Capacitación en técnicas para evitar generación de electricidad estática.' }
    ],
    condition: (values) => 
       values.cargasEstaticas ==='sí' ||  values.materialesFriccion === 'sí' 
      
  },

  {
    id: 'NOM-027',
    tipo: 'Seguridad',
    title: 'Actividades de soldadura y corte',
    puntos: [
      { numero: '5.2', descripcion: 'Análisis de riesgos potenciales en actividades de soldadura y corte.' },
      { numero: '5.3', descripcion: 'Registro de trabajadores informados sobre riesgos de soldadura.' },
      { numero: '5.4', descripcion: 'Programa específico para actividades de soldadura y corte.' },
      { numero: '5.5', descripcion: 'Procedimientos de seguridad en soldadura y corte.' },
      { numero: '5.13', descripcion: 'Documento que acredite que se capacita, adiestra y autoriza a los trabajadores para dar mantenimiento preventivo y, en su caso, correctivo, al equipo y maquinaria utilizada en las actividades de soldadura y corte del centro de trabajo.' },
      { numero: '5.17', descripcion: 'Botiquín de primeros auxilios en áreas de soldadura y corte.' },
      { numero: '5.17', descripcion: 'Disponer de un botiquín de primeros auxilios en el área donde se desarrollen actividades de soldadura y corte, que incluya los materiales determinados en el análisis de riesgos potenciales. F Preventiva Permanente.' },
      { numero: '10.6', descripcion: 'Permisos de autorización previo a realizar actividades de soldadura y corte para personal interno y externo. D Preventiva Permanente.' },
      { numero: '11 f)', descripcion: 'Plan de atención a emergencias y traslado de víctimas.' }
    ],
    condition: (values) => values.soldaduraCorte === 'sí'
  },

  {
    id: 'NOM-029',
    tipo: 'Seguridad',
    title: 'Mantenimiento de instalaciones eléctricas',
    puntos: [
      { numero: '5.2', descripcion: 'Plan de trabajo y determinación de riesgos por cada actividad de mantenimiento de las instalaciones eléctricas. D Preventiva Permanente.' },
      { numero: '5.3', descripcion: 'Diagrama unifilar y cuadro de cargas actualizado de la instalación eléctrica, con base en lo dispuesto por la NOM-001-SEDE-2012. D Preventiva Único, mantener actualizado.' },
      { numero: '5.4', descripcion: 'Procedimientos de seguridad para las actividades de mantenimiento de las instalaciones eléctricas, la selección y uso de equipo de trabajo, maquinaria, herramientas e implementos de protección aislante, y la colocación del sistema de puesta a tierra temporal. D Preventiva Único, mantener actualizado.' },
      { numero: '5.7', descripcion: 'Programa específico de revisión y conservación del equipo de trabajo, maquinaria, herramientas e implementos de protección aislante utilizados para trabajos de mantenimiento eléctrico. D Preventiva/Correctiva Anual.' },
      { numero: '5.8', descripcion: 'Procedimientos para la revisión, conservación, almacenamiento y reemplazo del equipo de trabajo, maquinaria, herramientas e implementos de protección aislante, utilizados en las actividades de mantenimiento de las instalaciones eléctricas. D Preventiva Único, mantener actualizado.' },
      { numero: '5.13', descripcion: 'Documento que acredita que se autoriza por escrito a trabajadores capacitados para realizar actividades de mantenimiento de las instalaciones eléctricas en altura, espacios confinados o subestaciones, así como partes vivas. D Preventiva Permanente.' },
      { numero: '5.14', descripcion: 'Documento que acredite que se informa a los trabajadores que realizan actividades de mantenimiento de las instalaciones eléctricas, sobre los riesgos a los que están expuestos y de las medidas de seguridad que deben adoptar para la actividad a desarrollar. D Preventiva Permanente.' },
      { numero: '5.15', descripcion: 'Plan de atención a emergencias, disponible para su consulta y aplicación. D Preventiva Único, mantener actualizado.' },
      { numero: '5.17', descripcion: 'Capacitar y adiestrar a los trabajadores que realicen actividades de mantenimiento de las instalaciones eléctricas. D Preventiva Anual.' },
      { numero: '5.19', descripcion: 'Registros de los resultados de mantenimiento en instalaciones eléctricas.' }
    ],
    condition: (values) => values.mantenimientoLineasElectricas === 'sí'  || values.instalacionesElectricas === 'sí' || values.mantenimientoEnergizadas === 'sí'
  },
  {
    id: 'NOM-034',
    tipo: 'Seguridad',
    title: 'Accesibilidad para trabajadores con discapacidad',
    puntos: [
      {
        numero: '5.1',
        descripcion: 'Análisis para determinar la compatibilidad del puesto de trabajo con la discapacidad que presenta cada uno de los trabajadores. D Preventiva Actualizar cuando existan modificaciones.'
      },
      {
        numero: '5.2',
        descripcion: 'Contar con instalaciones que permitan la accesibilidad al centro de trabajo y contar con señalizaciones para el desplazamiento, la estadía y emergencia, según corresponda, de acuerdo a la discapacidad de los trabajadores. F Preventiva Permanente.'
      },
      {
        numero: '5.3',
        descripcion: 'Documento que contenga las acciones preventivas y correctivas instrumentadas para prevenir riesgos a los trabajadores con discapacidad, considerando, además, para cada puesto de trabajo. D Preventiva/Correctiva Único, mantener actualizado.'
      },
      {
        numero: '5.5',
        descripcion: 'Plan de Atención a Emergencias donde considere a los trabajadores con discapacidad. D Preventiva Único, mantener actualizado.'
      },
      {
        numero: '5.6',
        descripcion: 'Constar que se difunda a los trabajadores con discapacidad sobre los riesgos, las medidas de seguridad y las acciones a seguir en caso de emergencia. D/E Preventiva Permanente.'
      },
      {
        numero: '5.7',
        descripcion: 'Constancia de competencias o habilidades laborales que acrediten que se capacita a los trabajadores con discapacidad para su desarrollo en el puesto de trabajo y actuación en caso de emergencia.'
      }
    ],
    condition: (values) => values.trabajadoresDiscapacidad === 'sí'
  },

  {
    id: 'NOM-010',
    tipo: 'Salud',
    title: 'Agentes químicos contaminantes en el ambiente laboral',
    puntos: [
      {
        numero: '6.1',
        descripcion: 'Estudio actualizado de los agentes químicos contaminantes del ambiente laboral, con base en el capítulo 8 de la norma. D Preventiva De acuerdo a resultados, hasta 2 años.'
      },
      {
        numero: '6.2',
        descripcion: 'Reconocimiento de los agentes químicos contaminantes del ambiente laboral, conforme al capítulo 9 de la norma. D Preventiva De acuerdo a resultados, hasta 2 años.'
      },
      {
        numero: '6.6',
        descripcion: 'Programa de control para no exponer al personal ocupacionalmente expuesto por encima de los valores límites de exposición de los agentes contaminantes del ambiente laboral. D Preventiva Anual.'
      },
      {
        numero: '6.9',
        descripcion: 'Documento que acredite que se informa a los trabajadores y a la comisión de seguridad e higiene sobre los riesgos a la salud por la exposición a los agentes químicos contaminantes del ambiente laboral. D/F Preventiva Permanente.'
      },
      {
        numero: '12.2',
        descripcion: 'Programa para la vigilancia a la salud del personal ocupacionalmente expuesto.'
      }
    ],
    condition: (values) => values.materialp === 'sí'
  },
  {
    id: 'NOM-011',
    tipo: 'Salud',
    title: 'Ruido en los centros de trabajo',
    puntos: [
      {
        numero: '5.2',
        descripcion: 'Reconocimiento y evaluación del ruido en todas las áreas del centro de trabajo donde haya trabajadores expuestos a niveles sonoros iguales o superiores a 80 dB(A), incluyendo sus características y componentes de frecuencia; efectuado a través de los laboratorios acreditados y aprobados. D Correctiva De acuerdo a resultados, hasta 2 años.'
      },
      {
        numero: '5.5',
        descripcion: 'Programa específico de conservación de la audición del personal ocupacionalmente expuesto a ruido. D Preventiva Anual.'
      },
      {
        numero: '5.8',
        descripcion: 'Informar y orientar a los trabajadores, y a la comisión de seguridad e higiene sobre las posibles alteraciones a la salud por la exposición a ruido, y sobre la forma de evitarlas o atenuarlas.'
      }
    ],
    condition: (values) => values.exposicionRuido === 'Sí'
  },

  {
    id: 'NOM-013',
    tipo: 'Salud',
    title: 'Radiaciones no ionizantes',
    puntos: [
      {
        numero: '3.1.2',
        descripcion: 'Reconocimiento, evaluación y control de las áreas donde existan fuentes que generen radiaciones no ionizantes, con el fin de prevenir riesgos a la salud de los trabajadores. D Preventiva Permanente.'
      },
      {
        numero: '3.1.3',
        descripcion: 'Documento que informe a los trabajadores y a la comisión de seguridad e higiene sobre los riesgos que representan las radiaciones no ionizantes y las medidas para prevenirlos. D Preventiva Permanente.'
      },
      {
        numero: '3.1.4',
        descripcion: 'Capacitación en seguridad e higiene ocupacional para el manejo y uso adecuado de las fuentes generadoras de radiaciones no ionizantes, con constancias de competencias laborales. D Preventiva Anual.'
      },
      {
        numero: '3.1.5',
        descripcion: 'Implementación de medidas de control para prevenir riesgos derivados de la exposición a campos electromagnéticos u otras radiaciones no ionizantes en el centro de trabajo. D Preventiva Permanente.'
      }
    ],
    condition: (values) => values.exposicionRadiaciones === 'sí'
  },
  { 
    id: 'NOM-024', 
    tipo: 'Salud',
    title: 'Vibraciones en el ambiente laboral', 
    puntos: [
      { 
        numero: '5.2', 
        descripcion: 'Documento que acredite que se informa a todos los trabajadores sobre las posibles alteraciones a la salud por la exposición a vibraciones. D Preventiva Permanente.' 
      },
      { 
        numero: '5.4', 
        descripcion: 'Programa específico para la Prevención de Alteraciones a la Salud del personal ocupacionalmente expuesto a vibraciones. D Preventiva Cada 2 años.' 
      },
      { 
        numero: '5.5', 
        descripcion: 'Capacitación y adiestramiento al personal ocupacionalmente expuesto (POE) en el Programa para la Prevención de Alteraciones a la Salud del POE. D Preventiva Anual.' 
      },
      { 
        numero: '8.7.2 a)', 
        descripcion: 'Reconocimiento y evaluación de los niveles de exposición a las vibraciones en todas las áreas donde hayan trabajadores potencialmente expuestos.' 
      }
    ],
    condition: (values) => values.vibraciones === 'sí'
  },
  { 
    id: 'NOM-025', 
    tipo: 'Salud',
    title: 'Iluminación en los centros de trabajo', 
    puntos: [
      { 
        numero: '5.2', 
        descripcion: 'Reconocimiento y evaluación de la iluminación de las tareas visuales del puesto de trabajo o áreas de trabajo comparadas con la Tabla 1 del capítulo 7. F Correctiva Cada 2 años.' 
      },
      { 
        numero: '5.8', 
        descripcion: 'Documento que acredite que se informa a los trabajadores sobre los riesgos que puede provocar el deslumbramiento o un deficiente nivel de iluminación en sus áreas o puestos de trabajo. D/E Preventiva Permanente.' 
      },
      { 
        numero: '5.10', 
        descripcion: 'Programa específico de mantenimiento a luminarias y, en su caso, a los sistemas de iluminación de emergencia. D Correctiva Anual.' 
      },
      { 
        numero: '5.11', 
        descripcion: 'Contar con sistemas de iluminación eléctrica de emergencia, en áreas donde la interrupción de la fuente de luz artificial represente un riesgo en la tarea visual del puesto de trabajo.' 
      }
    ],
    condition: (values) => values.iluminacion === 'deficiente'
  }
,  
{
  id: 'NOM-035',
  tipo: 'Salud',
  title: 'Factores de riesgo psicosocial en el trabajo',
  puntos: [
    {
      numero: '5.1',
      descripcion: 'Establece, implanta y mantiene una política de prevención de riesgos psicosociales que contempla: La prevención de los factores de riesgo psicosocial, la prevención de la violencia laboral y la promoción de un entorno organizacional favorable. Difunde en el centro del trabajo la política de prevención de riesgos psicosociales. D Preventiva Modificar cuando aplique.'
    },
    {
      numero: '5.5',
      descripcion: 'Identifica a los trabajadores que fueron sujetos a acontecimientos traumáticos severos durante o con motivo del trabajo y canaliza a los trabajadores identificados para su atención a la institución de seguridad social o privada, o con el médico del centro de trabajo o de la empresa. D Correctiva Anual.'
    },
    {
      numero: '7.1 b)',
      descripcion: 'Identificación y análisis de los factores de riesgo psicosocial, el cual comprende a todos los trabajadores del centro de trabajo. D Preventiva Anual.'
    },
    {
      numero: '8.2 a) 5)',
      descripcion: 'Capacitación y sensibilización de los directivos, gerentes y supervisores para la prevención de los factores de riesgo psicosocial y la promoción de entornos organizacionales favorables. D/E Preventiva Anual.'
    }
  ],
  condition: (values) => values.factoresPsicosociales === 'sí'
}
,
{
  id: 'NOM-036-1',
  tipo: 'Salud',
  title: 'Factores de riesgo ergonómico por manejo manual de cargas',
  puntos: [
    {
      numero: '5.1',
      descripcion: 'Análisis de los factores de riesgo ergonómico debido al manejo manual de cargas. D Preventiva Único, actualizar si hay cambios.'
    },
    {
      numero: '5.3',
      descripcion: 'Programa de ergonomía para realizar la vigilancia a la salud de los trabajadores ocupacionalmente expuestos. D Preventiva Anual.'
    },
    {
      numero: '5.4',
      descripcion: 'Documento que informa a los trabajadores sobre las posibles alteraciones a la salud por el manejo manual de cargas. D/F Preventiva Permanente.'
    },
    {
      numero: '5.5',
      descripcion: 'Capacitación y adiestramiento al personal ocupacionalmente expuesto sobre los procedimientos de seguridad y las prácticas de trabajo seguro, y en su caso, en las medidas de prevención y/o control.'
    }
  ],
  condition: (values) => values.manejocargas === 'Sí'
},
{
  id: 'NOM-017',
  tipo: 'Organización',
  title: 'Equipo de protección personal',
  puntos: [
    {
      numero: '5.2',
      descripcion: 'Análisis de los riesgos, por cada puesto de trabajo y determinación de equipo de protección personal. D Preventiva Único, actualizar si hay cambios.'
    },
    {
      numero: '5.5',
      descripcion: 'Comprobación que se informa a los trabajadores y a la comisión de seguridad e higiene, de manera particular o de forma general sobre los riesgos a los que se exponen. Las evidencias pueden ser videos, cartelones, trípticos, boletines, entre otros. D Preventiva Permanente.'
    },
    {
      numero: '5.6',
      descripcion: 'Capacitación y adiestramiento para que usen el equipo de protección personal de forma adecuada y con las limitaciones que el fabricante les establezca, y revisen el equipo de protección personal. D Preventiva Único.'
    },
    {
      numero: '5.8',
      descripcion: 'Identificar y señalar las áreas de trabajo en donde se requiera el uso obligatorio de equipo de protección personal.'
    }
  ],
  condition: (values) => values.equipoProteccion === 'sí'
},
{
  id: 'NOM-018',
  tipo: 'Organización',
  title: 'Identificación y comunicación de peligros por sustancias químicas peligrosas',
  puntos: [
    {
      numero: '6.1',
      descripcion: 'Listado actualizado de las sustancias químicas peligrosas y mezclas que se manejan en el centro de trabajo. D Único, actualizar si hay cambios.'
    },
    {
      numero: '6.1',
      descripcion: 'Documento de implementación del sistema armonizado de identificación y comunicación de peligros y riesgos por sustancias químicas peligrosas y mezclas. D Preventiva Anual.'
    },
    {
      numero: '6.3',
      descripcion: 'Contar con las hojas de datos de seguridad de todas las sustancias químicas peligrosas y mezclas que se manejen en el centro de trabajo y mantener a disposición permanentemente para su consulta. D Preventiva Permanente.'
    },
    {
      numero: '6.5',
      descripcion: 'Identificar y señalizar recipientes y áreas que contengan sustancias químicas peligrosas o sus residuos, de acuerdo con el SGA. F Correctiva Permanente.'
    },
    {
      numero: '6.6',
      descripcion: 'Acreditación que se informa a todos los trabajadores, contratistas y a la comisión de seguridad e higiene que manejan sustancias químicas peligrosas y mezclas, sobre los elementos de la hoja de datos de seguridad y de la señalización. D/E Preventiva Permanente.'
    },
    {
      numero: '6.7',
      descripcion: 'Capacitación y adiestramiento a los trabajadores que manejen sustancias químicas peligrosas y mezclas, sobre el contenido de las hojas de datos de seguridad y de la señalización. D Preventiva Anual.'
    },
    {
      numero: '8.1 c)',
      descripcion: 'Contar con señalización o etiquetado las sustancias químicas peligrosas y mezclas que se manejen en el centro de trabajo.'
    }
  ],
  condition: (values) => values.materialp === 'Sí'
}
,
{
  id: 'NOM-019',
  tipo: 'Organización',
  title: 'Constitución y funcionamiento de las comisiones de seguridad e higiene',
  puntos: [
    {
      numero: '5.4',
      descripcion: 'Acta de constitución de la comisión del centro de trabajo y de sus actualizaciones, cuando se modifique su integración, de conformidad con lo previsto en el numeral 7.4 de la presente norma. D Preventiva Único, actualizar si hay cambios.'
    },
    {
      numero: '5.5',
      descripcion: 'Programa de los recorridos de verificación de la comisión de seguridad e higiene. D Preventiva/Correctiva Anual.'
    },
    {
      numero: '5.6',
      descripcion: 'Actas de los recorridos de verificación realizados por la comisión del centro de trabajo. D Correctiva Mínimo cada 3 meses.'
    },
    {
      numero: '5.9',
      descripcion: 'Comprobación documental de que se apoya la investigación de los accidentes y enfermedades de trabajo que lleve a cabo la comisión. D Preventiva/Correctiva Cuando aplique.'
    },
    {
      numero: '5.13',
      descripcion: 'Capacitación a los integrantes de la comisión de seguridad e higiene para el adecuado ejercicio de sus funciones, con base en el programa que para tal efecto se elabore. D Preventiva Anual.'
    },
    {
      numero: '10.3',
      descripcion: 'Documento que acredite que se proporciona un curso de inducción cuando se incorpora un nuevo integrante o integrantes a la comisión.'
    }
  ],
  condition: (values) => values.comisionSeguridadHigiene === 'sí'
},
  
  
{
  id: 'NOM-026',
  tipo: 'Organización',
  title: 'Colores y señales de seguridad e higiene, e identificación de riesgos por fluidos conducidos en tuberías',
  puntos: [
    {
      numero: '5.2',
      descripcion: 'Constancias de competencias o habilidades laborales de los trabajadores sobre la correcta interpretación de los elementos de señalización del centro de trabajo. D/F Preventiva Anual.'
    },
    {
      numero: '5.3',
      descripcion: 'Comprobación que la aplicación del color, la señalización y la identificación de la tubería estén sujetos a un mantenimiento que asegure en todo momento su visibilidad y legibilidad. F Correctiva Permanente.'
    },
    {
      numero: '5.4',
      descripcion: 'Ubicar las señales de seguridad e higiene de tal manera que puedan ser observadas e interpretadas por los trabajadores a los que están destinadas.'
    }
  ],
  condition: (values) => values.senalizacionSeguridad === 'sí' // Agregar este campo en formValues si aplica
}
,

    
{
  id: 'NOM-030',
  tipo: 'Organización',
  title: 'Servicios preventivos de seguridad y salud en el trabajo',
  puntos: [
    {
      numero: '4.1',
      descripcion: 'Designar a un responsable de seguridad y salud en el trabajo interno o externo, para llevar a cabo las funciones y actividades preventivas de seguridad y salud en el centro de trabajo a que se refiere el Capítulo 5. D Preventiva Anual, actualizar si hay cambios.'
    },
    {
      numero: '4.3',
      descripcion: 'Diagnóstico integral o por áreas de trabajo de las condiciones de seguridad y salud del centro laboral, elaborado de acuerdo con lo que establece el numeral 6.1. D Preventiva/Correctiva Anual.'
    },
    {
      numero: '4.4',
      descripcion: 'Programa de seguridad y salud en el trabajo, con base en el diagnóstico de seguridad y salud en el trabajo. D Preventiva/Correctiva Anual.'
    },
    {
      numero: '4.5',
      descripcion: 'Acreditar que se comunica a la comisión de seguridad e higiene y/o a los trabajadores, el diagnóstico integral o por área de trabajo de las condiciones de seguridad y salud y el contenido del programa de seguridad y salud en el trabajo o la relación de acciones preventivas y correctivas de seguridad y salud en el trabajo.'
    }
  ],
  condition: (values) => values.seguridadSalud === 'sí' // Agregar este campo en formValues si aplica
},

{
  id: 'NOM-033',
  tipo: 'Seguridad',
  title: 'Trabajos en espacios confinados',
  puntos: [
    {
      numero: '5.1',
      descripcion: 'Identifica y señala los espacios confinados en donde se requiere el acceso del trabajador para realizar cualquier tipo de actividad. F Preventiva Actualizar cuando existan modificaciones.'
    },
    {
      numero: '5.2',
      descripcion: 'Clasificar los espacios confinados y contar con un análisis de riesgo para cada espacio confinado donde se desarrollan trabajos, aprobado y firmado por el patrón, y el responsable de los servicios preventivos de seguridad y salud en el trabajo. D Preventiva Permanente.'
    },
    {
      numero: '5.3',
      descripcion: 'Procedimientos de seguridad para las actividades a desarrollar, el uso de equipos y herramientas, el muestreo y monitoreo para detectar atmósferas peligrosas. D Preventiva Único, mantener actualizado.'
    },
    {
      numero: '5.4',
      descripcion: 'Plan de trabajo específico para realizar trabajos en espacios confinados. D Preventiva Único, mantener actualizado.'
    },
    {
      numero: '5.6',
      descripcion: 'Autorizaciones para desarrollar trabajos en espacios confinados. D Preventiva Permanente.'
    },
    {
      numero: '5.10',
      descripcion: 'Plan de atención a emergencias y rescate en espacios confinados. D Preventiva Anual.'
    },
    {
      numero: '5.11',
      descripcion: 'Capacitación a los trabajadores que realizan actividades en espacios confinados, de conformidad con el trabajo a desarrollar, su clasificación y el resultado del análisis de riesgo. D Preventiva Anual.'
    },
    {
      numero: '5.13',
      descripcion: 'Registros del personal autorizado para el desarrollo de los trabajos en espacios confinados, de su ingreso y salida de dichos espacios, de sus tiempos de permanencia, y del muestreo y/o monitoreo de su atmósfera.'
    }
  ],
  condition: (values) => values.trabajosEspaciosConfinados === 'sí' || values.soldaduraAltura === 'sí'
}
,
  // Normas de Salud
  { 
    id: 'NOM-012', 
    tipo: 'Salud',
    title: 'Radiaciones ionizantes', 
    puntos: [
      { numero: '5.1', descripcion: 'Evaluación de la exposición a radiaciones ionizantes en el lugar de trabajo.' },
      { numero: '5.2', descripcion: 'Implementación de medidas para minimizar la exposición a radiaciones ionizantes.' }
    ],
    condition: (values) => values.invGases === 'sí'
  },
  { 
    id: 'NOM-014', 
    tipo: 'Salud',
    title: 'Presiones ambientales anormales', 
    puntos: [
      { numero: '4.1', descripcion: 'Evaluación de los efectos de las presiones ambientales anormales sobre la salud de los trabajadores.' },
      { numero: '4.2', descripcion: 'Implementación de medidas preventivas para los trabajadores expuestos a presiones ambientales anormales.' }
    ],
    condition: (values) => values.invLiquidosi === 'sí'
  },
  {
    id: 'NOM-015',
    tipo: 'Salud',
    title: 'Condiciones térmicas elevadas o abatidas',
    puntos: [
      {
        numero: '5.2',
        descripcion: 'Documento que acredite que se informó a los trabajadores sobre los riesgos por exposición a temperaturas extremas (constancias de habilidades laborales, circulares, folletos o carteles). D/F Preventiva Único, mantener.'
      },
      {
        numero: '5.3',
        descripcion: 'Reconocimiento y evaluación de las temperaturas extremas elevadas y/o abatidas a las que se encuentran expuestos los trabajadores, a través de laboratorios acreditados y aprobados. D Preventiva Actualizar si hay cambios.'
      },
      {
        numero: '5.8',
        descripcion: 'Capacitación y adiestramiento al personal ocupacionalmente expuesto (POE) en materia de seguridad e higiene, donde se incluyan los niveles máximos permisibles y las medidas de control establecidas. D Preventiva Anual.'
      }
    ],
    condition: (values) => 
      values.exposicioncalor === 'sí' || 
      values.exposicionFrio === 'sí' || 
      values.condicionesClimaticas === 'sí'
  }
  ,
  { 
    id: 'NOM-028', 
    tipo: 'Organización',
    title: 'Seguridad en procesos y equipos con sustancias químicas', 
    puntos: [
      { numero: '5.1', descripcion: 'Evaluación y control de riesgos en procesos con sustancias químicas.' },
      { numero: '5.2', descripcion: 'Implementación de procedimientos de seguridad en equipos que manejen sustancias químicas.' }
    ],
    condition: (values) => values.materialesPiroforicos === 'sí'
  },
  // Normas Específicas
  { 
    id: 'NOM-003', 
    tipo: 'Específica',
    title: 'Plaguicidas y fertilizantes', 
    puntos: [
      { numero: '4.1', descripcion: 'Evaluación de los riesgos asociados al manejo de plaguicidas y fertilizantes.' },
      { numero: '4.2', descripcion: 'Implementación de medidas de seguridad para el manejo adecuado de plaguicidas y fertilizantes.' }
    ],
    condition: (values) => values.procesosPetroleoGas === 'sí' || values.actagricolas === 'sí'  || values.infrestructura === 'sí'
  },
  { 
    id: 'NOM-007', 
    tipo: 'Específica',
    title: 'Instalaciones, maquinaria, equipo y herramientas agrícolas', 
    puntos: [
      { numero: '3.1', descripcion: 'Mantenimiento adecuado de las instalaciones y maquinaria agrícola.' },
      { numero: '3.2', descripcion: 'Capacitación de los trabajadores en el uso seguro de maquinaria y herramientas agrícolas.' }
    ],
    condition: (values) => values.maquinaria === 'sí'
  },
  { 
    id: 'NOM-008', 
    tipo: 'Específica',
    title: 'Aprovechamiento forestal maderable', 
    puntos: [
      { numero: '4.1', descripcion: 'Normas de seguridad en la operación del aprovechamiento forestal maderable.' },
      { numero: '4.2', descripcion: 'Medidas para la protección del medio ambiente durante el aprovechamiento forestal.' }
    ],
    condition: (values) => values.tut === 'sí'
  },
  { 
    id: 'NOM-016', 
    tipo: 'Específica',
    title: 'Operación y mantenimiento de ferrocarriles', 
    puntos: [
      { numero: '5.1', descripcion: 'Normas de seguridad para la operación de ferrocarriles.' },
      { numero: '5.2', descripcion: 'Mantenimiento adecuado de equipos ferroviarios para prevenir accidentes.' }
    ],
    condition: (values) => values.maquinariaMateriales === 'sí'
  },
  { 
    id: 'NOM-023', 
    tipo: 'Específica',
    title: 'Trabajos en minas subterráneas y a cielo abierto', 
    puntos: [
      { numero: '6.1', descripcion: 'Normas de seguridad para trabajadores en minas subterráneas y a cielo abierto.' },
      { numero: '6.2', descripcion: 'Medidas para la prevención de accidentes en minas subterráneas y a cielo abierto.' }
    ],
    condition: (values) => values.materialc === 'sí'
  },
  { 
    id: 'NOM-031', 
    tipo: 'Específica',
    title: 'Construcción', 
    puntos: [
      { numero: '7.1', descripcion: 'Condiciones de seguridad en la construcción de obras.' },
      { numero: '7.2', descripcion: 'Capacitación en seguridad para los trabajadores de la construcción.' }
    ],
    condition: (values) => values.superficieConstruir === 'sí'  || values.materialc === 'Sí'
  },
  { 
    id: 'NOM-032', 
    tipo: 'Específica',
    title: 'Minas subterráneas de carbón', 
    puntos: [
      { numero: '8.1', descripcion: 'Medidas de seguridad para trabajadores en minas subterráneas de carbón.' },
      { numero: '8.2', descripcion: 'Planificación y prevención de riesgos en minas subterráneas de carbón.' }
    ],
    condition: (values) => values.alturaConstruccion === 'sí'
  },
  { 
    id: 'NOM-037', 
    tipo: 'Específica',
    title: 'Teletrabajo-Condiciones de seguridad y salud en el trabajo', 
    puntos: [
      { numero: '4.1', descripcion: 'Condiciones de seguridad y salud para el teletrabajo.' },
      { numero: '4.2', descripcion: 'Manejo de riesgos psicosociales en el teletrabajo.' }
    ],
    condition: (values) => values.teletrabajo === 'sí'
  }
  



 












  




];
const NormaNoms = () => {
  const [selectedNormas, setSelectedNormas] = useState([]);
  const [step, setStep] = useState(1);
  const [history, setHistory] = useState([]); // Historial de pasos
  const [showModal9, setShowModal9] = useState(false);
  const [showModal10, setShowModal10] = useState(false);
  const [showModal12, setShowModal12] = useState(false);
  const [showModal14, setShowModal14] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [showModal2, setShowModal2] = useState(false); // Estado para el nuevo modal
  const [showModal3, setShowModal3] = useState(false); // Estado para el nuevo modal
  
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    area: '',
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
    superficieConstruir: '',
    alturaConstruccion: '',
    materialp: '',
    comunicacionRuido: '',
    condicionesClimaticas: '',
    teletrabajo: '',
    procesosPetroleoGas: '',
    tut: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => {
      const newValues = { ...prevValues, [name]: value };
      updateSelectedNormas(newValues);
      return newValues;
    });
  };
  const handleNext = () => {
    setHistory([...history, step]); // Guardar el paso actual en el historial
  
    if (step === 5) {
      if (formValues.manejoMateriales === "no") {
        setStep(7); // Ir al paso 7 si selecciona "no"
      } else if (formValues.manejoMateriales === "sí") {
        setStep(6); // Ir al paso 6 si selecciona "sí"
      }
    
    
    } else if (step === 7) {
      setStep(formValues.trabajosAltura === "no" ? 9 : 8);
    } else if (step === 9) {
      setStep(formValues.recipientesPresion === "sí" ? 10 : 11);
    } else if (step === 11) {
      setStep(formValues.recipientesCriogenicos === "sí" ? 12 : 13);
    } else if (step === 13) {
      setStep(formValues.generadoresVapor === "sí" ? 14 : 15);
    } else if (step === 15) {
      setStep(formValues.cargasEstaticas === "sí" ? 16 : 17);
    } else if (step === 17) {
      setStep(formValues.soldaduraCorte === "sí" ? 18 : 19);
    } else if (step === 19) {
      setStep(formValues.instalacionesElectricas === "sí" ? 20 : 22);
    } else if (step === 20) {
      setStep(formValues.mantenimientoLineasElectricas === "sí" ? 21 : 22);
    } else if (step === 22) {
      setStep(formValues.trabajosEspaciosConfinados === "sí" ? 23 : 24);
    } else if (step === 24) {
      setStep(formValues.trabajadoresDiscapacidad === "sí" ? 25 : 26);
    } else if (step === 26) {
      if (formValues.exposicionRuido === "Sí") {
        setStep(27);
      } else {
        setStep(39); // Va al paso 39 si selecciona "No" o "No sé"
      }
    } else if (step === 39) {
      setStep(27); // Desde el paso 39, siempre pasa al 27
    } else if (step === 27) {
      setStep(28); // Desde el paso 27, siempre pasa al 28
    } else if (step === 28) {
      setStep(formValues.exposicioncalor === "Sí" ? 29 : 40); // Lógica para el paso 28 según la exposición al calor
    } else if (step === 29) {
      setStep(formValues.vibraciones === "Sí" ? 30 : 31); // Lógica para el paso 29 según la exposición a vibraciones
    } else if (step === 40) {
      setStep(29); // Desde el paso 40, siempre pasa al 29
    } else if (step === 30) {
      setStep(31);
    } else if (step === 31) {
      setStep(formValues.manejocargas === "Sí" ? 32 : 33); // Lógica para el paso 31 según la selección
    } else if (step === 32) {
      setStep(33);
    } else if (step === 33) {
      setStep(34);
    } else if (step === 34) {
      setStep(35);
    } else if (step === 35) {
      if (formValues.materialc === "No") {
        setStep(41); // Ir al paso 41 si selecciona "No"
      } else {
        setStep(36); // Ir al paso 36 si selecciona "Sí"
      }
    } else if (step === 41) {
      setStep(42); // Siempre ir al paso 42
    } else if (step === 42) {
      setStep(37); // Siempre ir al paso 37
    } else if (step === 36) {
      setStep(37);
    } else if (step === 37) {
      setStep(38); // Paso final para mostrar normas aplicables
    } else {
      setStep(step + 1); // Paso predeterminado
    }
  };
  const handleBack = () => {
    if (history.length > 0) {
      const previousStep = history[history.length - 1];
      setHistory(history.slice(0, -1)); // Eliminar el último paso del historial
      setStep(previousStep); // Volver al paso anterior en el historial
    } else {
      setStep(step - 1); // Retroceso estándar si no hay historial
    }
  };
  



  const handleCheckboxChange = (e, field) => {
    const { value } = e.target;
    setFormValues((prevValues) => {
      const updatedField = prevValues[field].includes(value)
        ? prevValues[field].filter((item) => item !== value)
        : [...prevValues[field], value];
      const newValues = { ...prevValues, [field]: updatedField };
      updateSelectedNormas(newValues);
      return newValues;
    });
  };

  const updateSelectedNormas = (values) => {
    const applicableNormas = normas
      .filter((norma) => norma.condition(values))
      .map((norma) => norma.id);
    setSelectedNormas(applicableNormas);
  };

  const isStepCompleted = () => {
    switch (step) {
      case 1:
        return formValues.area !== '';
      case 2:
        return (
          formValues.superficie !== '' &&
          formValues.invGases !== '' &&
          formValues.invLiquidosi !== '' &&
          formValues.invLiquidosc !== '' &&
          formValues.invSolidos !== '' &&
          formValues.materialesPiroforicos !== ''
        );
      case 3:
        return formValues.areaTrabajo !== '';
      case 4:
        return formValues.maquinaria !== '';
      case 5:
        return formValues.manejoMateriales !== '';
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
      case 39:
        return formValues.comunicacionRuido !== '';
      case 40:
        return formValues. condicionesClimaticas !== '';
      case 38:
        return formValues.nuevoCampo  !== '';
      case 41:
        return formValues.teletrabajo  !== '';
      case 42:
        return formValues.procesosPetroleoGas  !== '';
         // Reemplaza 'nuevoCampo' con el nombre correcto si aplica
      default:
        return false;
    }
  };
  return (
    <div className="norma-noms-container">
      <div className="container">
        {/* Paso 1: Selección del Área */}
        {step === 1 && (
          <div className="step1">
            <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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

{step === 2 && (
  <div className="step2">
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px',
      }}
    />
    <h3>Determinación del grado de riesgo de incendio</h3>
    <p>Para consultar la tabla de clasificación, dé clic en el ícono.</p>
    <img
      src={iconImage} // Asegúrate de que `iconImage` sea específico para este paso
      alt="Tabla de clasificación de riesgo de incendio"
      style={{ cursor: 'pointer', width: '50px' }}
      onClick={() => setShowModal2(true)} // Abre el modal específico para este paso
    />
    <div className="inventory-fields">
      <label>
        Superficie construida:
        <input
          type="number"
          name="superficie"
          value={formValues.superficie}
          onChange={(e) => {
            const value = Math.max(0, Number(e.target.value)); // Asegúrate de que no sea negativo
            handleInputChange({ target: { name: 'superficie', value } });
          }}
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
          onChange={(e) => {
            const value = Math.max(0, Number(e.target.value));
            handleInputChange({ target: { name: 'invGases', value } });
          }}
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
          onChange={(e) => {
            const value = Math.max(0, Number(e.target.value));
            handleInputChange({ target: { name: 'invLiquidosi', value } });
          }}
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
          onChange={(e) => {
            const value = Math.max(0, Number(e.target.value));
            handleInputChange({ target: { name: 'invLiquidosc', value } });
          }}
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
          onChange={(e) => {
            const value = Math.max(0, Number(e.target.value));
            handleInputChange({ target: { name: 'invSolidos', value } });
          }}
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
      <button onClick={handleNext} disabled={!isStepCompleted()}>
        Continuar
      </button>
    </div>

    {showModal2 && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => setShowModal2(false)}>
            &times;
          </span>
          {/* Aquí colocamos la imagen específica de este paso */}
          <img
            src={riesgoImage} // Reemplaza con la imagen específica para el paso 2
            alt="Tabla de clasificación de riesgo de incendio"
            style={{ width: '100%' }}
          />
        </div>
      </div>
    )}
  </div>
)}


        {/* Paso 3 */}
        {step === 3 && (
  <div className="step3">
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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

    {/* Nueva sección de elementos del centro de trabajo, solo si "areaTrabajo" es "sí" */}
    {formValues.areaTrabajo === "sí" && (
      <>
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
      </>
    )}

    <div className="buttons">
      <button onClick={handleBack}>Regresar</button>
      <button onClick={handleNext} disabled={!isStepCompleted()}>Continuar</button>
    </div>
  </div>
)}

{step === 4 && (
  <div className="step4">
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
    <h3>Uso de maquinaria para manejo de materiales</h3>
    <label>¿En su centro de trabajo se utiliza maquinaria para el manejo de materiales, como materias primas, subproductos, productos, residuos entre otros?</label>
    <label>
      <input type="radio" name="manejoMateriales" value="sí" onChange={handleInputChange} />
      Sí
    </label>
    <label>
      <input type="radio" name="manejoMateriales" value="no" onChange={handleInputChange} />
      No
    </label>
    <div className="buttons">
      <button onClick={handleBack}>Regresar</button>
      <button onClick={handleNext} disabled={!formValues.manejoMateriales}>Continuar</button>
    </div>
  </div>
)}

{step === 6 && formValues.manejoMateriales === "sí" && (
  <div className="step6">
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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

{step === 7 && (
  <div className="step7">
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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

{step === 9 && (
  <div className="step9">
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
      <button onClick={handleNext} disabled={!formValues.recipientesPresion}>Continuar</button>
    </div>
  </div>
)}

{showModal9 && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={() => setShowModal9(false)}>&times;</span>
      <img src={exceptImage} alt="Recipientes exceptuados" style={{ width: '100%' }} />
    </div>
  </div>
)}

{/* Paso 10 - Categorías de Recipientes Sujetos a Presión */}
{step === 10 && (
  <div className="step10">
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
      <button onClick={handleNext} disabled={formValues.categoriasRecipientes.length === 0}>
        Continuar
      </button>
    </div>
  </div>
)}

{showModal10 && (
  <div className="modal">
    <div className="modal-content">
      <span className="close" onClick={() => setShowModal10(false)}>&times;</span>
      <img src={categoriasImage} alt="Categorías de recipientes sujetos a presión" style={{ width: '100%' }} />
    </div>
  </div>
)}






{step === 11 && (
  <div className="step11">
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
      <button onClick={handleNext} disabled={!formValues.recipientesCriogenicos}>
        Continuar
      </button>
    </div>
  </div>
)}
    {/* Paso 12 - Recipientes criogénicos */}
    {step === 12 && (
      <div className="step12">
        <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
            <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
           <h3>Generadores de Vapor y Calderas</h3>
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
            <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
            <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
            <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
            <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
            <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
            <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
            <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
            <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
            <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
            <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
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
  <div className="step24">
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
   <h3>Inclusión de Trabajadores con Discapacidad</h3>
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
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
    <h3>Tipos de Discapacidad del Personal</h3>
    <label>
      Seleccione el tipo de discapacidad que presenta el personal que labora en su centro de trabajo:
    </label>
    <label>
      <input
        type="checkbox"
        value="Discapacidad física"
        onChange={(e) => handleCheckboxChange(e, 'tiposDiscapacidad')}
        checked={formValues.tiposDiscapacidad.includes('Discapacidad física')}
      />
      Discapacidad física
    </label>
    <label>
      <input
        type="checkbox"
        value="Discapacidad mental"
        onChange={(e) => handleCheckboxChange(e, 'tiposDiscapacidad')}
        checked={formValues.tiposDiscapacidad.includes('Discapacidad mental')}
      />
      Discapacidad mental
    </label>
    <label>
      <input
        type="checkbox"
        value="Discapacidad intelectual"
        onChange={(e) => handleCheckboxChange(e, 'tiposDiscapacidad')}
        checked={formValues.tiposDiscapacidad.includes('Discapacidad intelectual')}
      />
      Discapacidad intelectual
    </label>
    <label>
      <input
        type="checkbox"
        value="Discapacidad sensorial"
        onChange={(e) => handleCheckboxChange(e, 'tiposDiscapacidad')}
        checked={formValues.tiposDiscapacidad.includes('Discapacidad sensorial')}
      />
      Discapacidad sensorial
    </label>
    <div className="buttons">
      <button onClick={handleBack}>Regresar</button>
      <button onClick={handleNext} disabled={formValues.tiposDiscapacidad.length === 0}>
        Siguiente
      </button>
    </div>
  </div>
)}

{step === 26 && (
        <div>
          <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
        <h3>Exposición a Ruido en el Centro de Trabajo</h3>
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
{step === 39 && (
  <div className="step38">
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
   <h3>Inclusión de Trabajadores con Discapacidad</h3>
    <label>
    ¿En su centro de trabajo, los trabajadores en condiciones normales de operación necesitan levantar la voz para comunicarse cuando se encuentran a una distancia de aproximadamente un metro?
    </label>
    <label>
      <input
        type="radio"
        name="comunicacionRuido"
        value="sí"
        onChange={handleInputChange}
        checked={formValues.comunicacionRuido=== 'sí'}
      />
      Sí
    </label>
    <label>
      <input
        type="radio"
        name="comunicacionRuido"
        value="no"
        onChange={handleInputChange}
        checked={formValues.comunicacionRuido === 'no'}
      />
      No
    </label>

    <div className="buttons">
      <button onClick={handleBack}>Regresar</button>
      <button onClick={handleNext} disabled={!isStepCompleted()}>Siguiente</button>
    </div>
  </div>
)}

{step === 27 && (
        <div>
          <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
          <h3>Exposición a Temperaturas Bajas en el Centro de Trabajo</h3>
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
          <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
          <h3>Exposición a Temperaturas Altas en el Centro de Trabajo</h3>
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




{step === 40 && (
        <div>
          <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
          <h3>Exposición a Temperaturas Altas en el Centro de Trabajo</h3>
          <label> ¿En su centro de trabajo existen condiciones climáticas que pueden provocar que la temperatura corporal de los trabajadores sea inferior a 36 grados centígrados o mayor a 38 grados centígrados?
          </label>
          <label>
            <input
              type="radio"
              name="condicionesClimaticas"
              value="Sí"
              onChange={handleInputChange}
              checked={formValues.condicionesClimaticas === 'Sí'}
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="condicionesClimaticas"
              value="No"
              onChange={handleInputChange}
              checked={formValues.condicionesClimaticas === 'No'}
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
          <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
          <h3>Exposición a Vibraciones en el Centro de Trabajo</h3>
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
            <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
            <h3>Identificación de partes del cuerpo expuestas a vibraciones</h3>
            <label>
            Seleccione qué partes del cuerpo están expuestas a las vibraciones:
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
          <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
         <h3>Manejo Manual de Cargas en el Centro de Trabajo</h3>
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
            <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
            <h3>Actividades relacionadas con el manejo manual de cargas</h3>
            <label>
              Seleccione la actividad a la que el personal se encuentra expuesto en el manejo manual de cargas:
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
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
    <h3>Actividades Agrícolas con Insumos Fitosanitarios</h3>
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
      <button onClick={handleNext} disabled={formValues.actagricolas.length === 0}>
        Continuar
      </button>
    </div>
  </div>
)}



{step === 34 && (
          <div className="step34">
            <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
            <h3>Infraestructura para Actividades Agrícolas</h3>
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
          <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
         <h3>Trabajos de Construcción en el Centro de Trabajo</h3>
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
              checked={formValues.materialc === 'No'}
            />
            No
          </label>
          <div className="buttons">
            <button onClick={handleBack}>Regresar</button>
            <button onClick={handleNext} disabled={!isStepCompleted()}>Siguiente</button>
          </div>
        </div>
      )}



{step === 41 && (
        <div>
          <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
         <h3>Modalidad de Teletrabajo</h3>
          <label> ¿El centro de trabajo cuenta con personas trabajadoras realizando actividades bajo la modalidad de Teletrabajo en domicilios particulares?


          </label>
          <label>
            <input
              type="radio"
              name="teletrabajo"
              value="Sí"
              onChange={handleInputChange}
              checked={formValues.teletrabajo === 'Sí'}
            />
            Sí
          </label>
          <label>
            <input
              type="radio"
              name="teletrabajo"
              value="No"
              onChange={handleInputChange}
              checked={formValues.teletrabajo === 'No'}
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
          <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
          <h3>Clasificación del tamaño de la obra de construcción</h3>
          <p>Proporcione la siguiente información:</p>
          <img
            src={iconImage} 
            alt="Tabla de clasificación de riesgo de incendio"
            style={{ cursor: 'pointer', width: '50px' }}
            onClick={() => setShowModal3(true)} // Abre el modal específico para este paso
          />
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
            <button onClick={handleNext} disabled={!isStepCompleted()}>
              Continuar
            </button>
          </div>
        </div>
      )}

      {showModal3 && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal3(false)}>
              &times;
            </span>
            <img
              src={obraImage} 
              alt="Tabla de clasificación de riesgo de incendio"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      )}

{step === 42 && (
  <div>
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
    <h3>Procesos Relacionados con Petróleo y Gas</h3>
    <label>
      ¿El centro de trabajo cuenta con procesos de: extracción de petróleo o gas natural; 
      producción de petroquímicos o gas licuado de petróleo (gas L.P.); almacenamiento y distribución 
      de gas natural o gas licuado de petróleo (gas L.P.); o refinación del petróleo crudo y petroquímica básica?
    </label>
    <label>
      <input
        type="radio"
        name="procesosPetroleoGas" // Sin espacio inicial
        value="Sí"
        onChange={handleInputChange}
        checked={formValues.procesosPetroleoGas === 'Sí'} // Sin espacio inicial
      />
      Sí
    </label>
    <label>
      <input
        type="radio"
        name="procesosPetroleoGas" // Sin espacio inicial
        value="No"
        onChange={handleInputChange}
        checked={formValues.procesosPetroleoGas === 'No'} // Sin espacio inicial
      />
      No
    </label>
    <div className="buttons">
      <button onClick={handleBack}>Regresar</button>
      <button onClick={handleNext} disabled={!isStepCompleted()}>Siguiente</button>
    </div>
  </div>
)}




{step === 37 && (
        <div>
          <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
         <h3>Manejo y Exposición a Sustancias Químicas Peligrosas</h3>
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
    
    <h3 style={{ color: 'blue' }}>Normas Aplicables</h3>
    <div>
      <button 
        onClick={() => {
          setStep(1);
          setFormValues({
            // Reiniciar el formulario como lo tenías
          });
          setSelectedNormas([]); // Reiniciar las normas seleccionadas
        }}
        style={{
          backgroundColor: '#2196F3',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          margin: '10px 0'
        }}
      >
        Limpiar
      </button>
    </div>
    <div className="normas-table">
    <img
      src={require('../logos/logo.png')} // Ruta a tu logo
      alt="Logo de la empresa"
      style={{
        display: 'block',
        margin: '0 auto',
        width: '150px',
        height: 'auto',
        marginBottom: '20px'
      }}
    />
      <table border="1" align="center" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>Número</th>
            <th>Título de la norma</th>
            <th>Tipo de norma</th> {/* Nueva columna para el tipo */}
            <th>Puntos Específicos</th>
            <th>Obtener archivo de la NOM</th>
          </tr>
        </thead>
        <tbody>
          {selectedNormas.length > 0 ? (
            selectedNormas.map((id) => {
              const norma = normas.find((n) => n.id === id);
              return (
                <tr key={norma.id}>
                  <td>{norma.id}</td>
                  <td>{norma.title}</td>
                  <td>{norma.tipo}</td> {/* Mostrar el tipo de norma aquí */}
                  <td>
                    {norma.puntos.map((punto, index) => (
                      <div key={index}>
                        <strong>{punto.numero}:</strong> {punto.descripcion}
                      </div>
                    ))}
                  </td>
                  <td>
                    <a href={`/noms/${norma.id}.pdf`} target="_blank" rel="noopener noreferrer">Descargar</a>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">No se han encontrado normas aplicables</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NormaNoms;  
























































