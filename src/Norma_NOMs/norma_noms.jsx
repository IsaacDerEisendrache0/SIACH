import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NormaNoms.css';
import iconImage from './images/icon.png';
import exceptImage from './images/excepted_recipients.png';
import categoriasImage from './images/categorias_presion.png';
import criogenicosImage from './images/criogenicos.png';
import generadoresImage from './images/generadores_vapor.png';

// Continuación del array normas con más normas y sus condiciones
const normas = [
  { 
    id: 'NOM-001', 
    title: 'Edificios, locales e instalaciones', 
    puntos: [
      { numero: '5.6', descripcion: 'Constancia documental de que proporcionó información a todos los trabajadores para el uso y conservación de las áreas donde realizan sus actividades en el centro de trabajo, incluidas las destinadas para el servicio de los trabajadores' },
      { numero: '7.3 c)', descripcion: 'Medidas contra incendios en áreas críticas.' },
      { numero: '8.3', descripcion: 'Sistema de ventilación y control de gases.' }
    ],
    condition: (values) => values.area === 'centro'
  },
  { 
    id: 'NOM-002', 
    title: 'Prevención y protección contra incendios', 
    puntos: [
      { numero: '5.1', descripcion: 'Estudio para la clasificación del grado de riesgo de incendio.' },
      { numero: '5.2', descripcion: 'Contar con un croquis, plano o mapa actualizado del centro de trabajo.' },
      { numero: '5.5', descripcion: 'Plan de atención a emergencias de incendio.' },
      { numero: '5.7', descripcion: 'Programa anual y registros de simulacros.' },
      { numero: '5.8', descripcion: 'Capacitación de brigadas de emergencia.' },
    ],
    condition: (values) => values.recipientesPresion === 'sí'
  },
  { 
    id: 'NOM-004', 
    title: 'Uso de maquinaria y equipo', 
    puntos: [
      { numero: '5.2', descripcion: 'Estudio para analizar el riesgo en maquinaria.' },
      { numero: '5.3 a)', descripcion: 'Elaborar el Programa Específico de Seguridad e Higiene para Operación y Mantenimiento.' },
      { numero: '5.4', descripcion: 'Capacitación para operación segura de la maquinaria y equipo.' }
    ],
    condition: (values) => values.maquinaria === 'sí'
  },
  { 
    id: 'NOM-005', 
    title: 'Manejo de sustancias químicas peligrosas', 
    puntos: [
      { numero: '5.2', descripcion: 'Estudio de riesgos de sustancias químicas peligrosas.' },
      { numero: '5.3', descripcion: 'Manuales y procedimientos para manejo seguro de sustancias.' },
      { numero: '5.12', descripcion: 'Programa Específico de Seguridad e Higiene para el Manejo de Sustancias Químicas Peligrosas.' },
      { numero: '5.13', descripcion: 'Constancias de competencias o habilidades laborales sobre el programa de manejo seguro.' }
    ],
    condition: (values) => values.sustanciasPeligrosas === 'sí'
  },
  { 
    id: 'NOM-006', 
    title: 'Manejo y almacenamiento de materiales', 
    puntos: [
      { numero: '5.1', descripcion: 'Programa específico de revisión y mantenimiento de equipos de manejo de materiales.' },
      { numero: '5.3', descripcion: 'Procedimientos de seguridad en el manejo de materiales.' },
      { numero: '5.7', descripcion: 'Manual de primeros auxilios basado en riesgos de manejo de materiales.' },
      { numero: '5.9', descripcion: 'Constancias de competencias o habilidades laborales para almacenamiento y manejo de materiales.' }
    ],
    condition: (values) => values.manejoMateriales === 'sí'
  },
  // Aquí puedes agregar más normas con su estructura similar


  { 
    id: 'NOM-009', 
    title: 'Trabajos en altura', 
    puntos: [
      { numero: '5.1', descripcion: 'Análisis de condiciones de riesgo en áreas de trabajo en altura.' },
      { numero: '5.2', descripcion: 'Instructivos y procedimientos de seguridad para sistemas de trabajos en altura.' },
      { numero: '5.3', descripcion: 'Autorización escrita para trabajos en alturas.' },
      { numero: '5.11', descripcion: 'Plan de atención a emergencias en trabajos en altura.' },
      { numero: '5.13', descripcion: 'Constancias de capacitación en trabajos en altura y atención a emergencias.' }
    ],
    condition: (values) => values.trabajosAltura === 'sí'
  },
  { 
    id: 'NOM-020', 
    title: 'Recipientes sujetos a presión', 
    puntos: [
      { numero: '5.2', descripcion: 'Listado actualizado de los equipos instalados en el centro de trabajo.' },
      { numero: '5.3', descripcion: 'Expediente de cada equipo instalado en el centro de trabajo.' },
      { numero: '5.5', descripcion: 'Programas de revisión y calibración de equipos de presión.' },
      { numero: '5.6', descripcion: 'Procedimientos de operación y mantenimiento en idioma español.' },
      { numero: '5.14', descripcion: 'Difusión sobre los peligros inherentes a los equipos y fluidos.' }
    ],
    condition: (values) => values.recipientesPresion === 'sí'
  },
  { 
    id: 'NOM-022', 
    title: 'Electricidad estática', 
    puntos: [
      { numero: '5.2', descripcion: 'Contar con pararrayos en áreas con sustancias inflamables o explosivas.' },
      { numero: '5.3', descripcion: 'Medición de resistencia de la red de puesta a tierra y continuidad.' },
      { numero: '5.4', descripcion: 'Documento que informe a trabajadores sobre los riesgos de electricidad estática.' },
      { numero: '5.5', descripcion: 'Capacitación en técnicas para evitar generación de electricidad estática.' }
    ],
    condition: (values) => values.cargasEstaticas === 'sí'
  },
  { 
    id: 'NOM-027', 
    title: 'Actividades de soldadura y corte', 
    puntos: [
      { numero: '5.2', descripcion: 'Análisis de riesgos potenciales en actividades de soldadura y corte.' },
      { numero: '5.3', descripcion: 'Registro de trabajadores informados sobre riesgos de soldadura.' },
      { numero: '5.4', descripcion: 'Programa específico para actividades de soldadura y corte.' },
      { numero: '5.5', descripcion: 'Procedimientos de seguridad en soldadura y corte.' },
      { numero: '5.17', descripcion: 'Botiquín de primeros auxilios en áreas de soldadura y corte.' }
    ],
    condition: (values) => values.soldaduraCorte === 'sí'
  },

  { 
    id: 'NOM-029', 
    title: 'Mantenimiento de instalaciones eléctricas', 
    puntos: [
      { numero: '5.2', descripcion: 'Plan de trabajo y determinación de riesgos para mantenimiento de instalaciones eléctricas.' },
      { numero: '5.3', descripcion: 'Diagrama unifilar y cuadro de cargas actualizado.' },
      { numero: '5.4', descripcion: 'Procedimientos de seguridad en actividades de mantenimiento eléctrico.' },
      { numero: '5.7', descripcion: 'Programa específico de revisión y conservación de equipo eléctrico.' },
      { numero: '5.15', descripcion: 'Plan de atención a emergencias para mantenimiento eléctrico.' }
    ],
    condition: (values) => values.mantenimientoLineasElectricas === 'sí'
  },
  { 
    id: 'NOM-034', 
    title: 'Accesibilidad para trabajadores con discapacidad', 
    puntos: [
      { numero: '5.1', descripcion: 'Análisis de compatibilidad del puesto con la discapacidad de cada trabajador.' },
      { numero: '5.2', descripcion: 'Instalaciones accesibles y señalización para desplazamiento y emergencia.' },
      { numero: '5.3', descripcion: 'Acciones preventivas y correctivas para prevenir riesgos a trabajadores con discapacidad.' },
      { numero: '5.5', descripcion: 'Plan de atención a emergencias que incluya a trabajadores con discapacidad.' },
      { numero: '5.7', descripcion: 'Capacitación para trabajadores con discapacidad en su desarrollo y actuación en emergencias.' }
    ],
    condition: (values) => values.trabajadoresDiscapacidad === 'sí'
  },
  { 
    id: 'NOM-010', 
    title: 'Agentes químicos contaminantes en el ambiente laboral', 
    puntos: [
      { numero: '6.1', descripcion: 'Estudio actualizado de agentes químicos contaminantes del ambiente laboral.' },
      { numero: '6.2', descripcion: 'Reconocimiento de agentes químicos contaminantes en el ambiente laboral.' },
      { numero: '6.6', descripcion: 'Programa de control para evitar exposición a agentes químicos contaminantes.' },
      { numero: '6.9', descripcion: 'Documento informativo sobre riesgos a la salud por exposición a agentes químicos.' }
    ],
    condition: (values) => values.materialp === 'sí'
  },
  { 
    id: 'NOM-011', 
    title: 'Ruido en los centros de trabajo', 
    puntos: [
      { numero: '5.2', descripcion: 'Evaluación de ruido en áreas donde trabajadores estén expuestos a niveles superiores a 80 dB(A).' },
      { numero: '5.5', descripcion: 'Programa de conservación de la audición para trabajadores expuestos a ruido.' },
      { numero: '5.8', descripcion: 'Orientación sobre alteraciones a la salud por exposición a ruido.' }
    ],
    condition: (values) => values.exposicionRuido === 'sí'
  },

  { 
    id: 'NOM-013', 
    title: 'Radiaciones no ionizantes', 
    puntos: [
      { numero: '3.1.2', descripcion: 'Reconocimiento, evaluación y control de áreas con radiaciones no ionizantes para prevenir riesgos.' },
      { numero: '3.1.3', descripcion: 'Documento informativo sobre los riesgos de exposición a radiaciones no ionizantes.' },
      { numero: '3.1.4', descripcion: 'Capacitación en seguridad e higiene para el manejo de fuentes generadoras de radiaciones no ionizantes.' },
      { numero: '3.1.5', descripcion: 'Medidas de control para prevenir riesgos de exposición a radiaciones electromagnéticas.' }
    ],
    condition: (values) => values.exposicionRadiaciones === 'sí'
  },
  { 
    id: 'NOM-024', 
    title: 'Vibraciones en el ambiente laboral', 
    puntos: [
      { numero: '5.2', descripcion: 'Documento informativo sobre los riesgos a la salud por exposición a vibraciones.' },
      { numero: '5.4', descripcion: 'Programa de prevención de alteraciones a la salud por exposición a vibraciones.' },
      { numero: '5.5', descripcion: 'Capacitación al personal expuesto a vibraciones en el programa de prevención de alteraciones a la salud.' },
      { numero: '8.7.2 a)', descripcion: 'Evaluación de niveles de exposición a vibraciones en áreas potencialmente expuestas.' }
    ],
    condition: (values) => values.vibraciones === 'sí'
  },
  { 
    id: 'NOM-025', 
    title: 'Iluminación en los centros de trabajo', 
    puntos: [
      { numero: '5.2', descripcion: 'Evaluación de la iluminación en áreas de trabajo comparada con los valores establecidos.' },
      { numero: '5.8', descripcion: 'Documento informativo sobre riesgos de deslumbramiento o deficiente iluminación.' },
      { numero: '5.10', descripcion: 'Programa de mantenimiento a luminarias y sistemas de iluminación de emergencia.' },
      { numero: '5.11', descripcion: 'Sistemas de iluminación eléctrica de emergencia en áreas de riesgo.' }
    ],
    condition: (values) => values.iluminacion === 'deficiente'
  },
  { 
    id: 'NOM-035', 
    title: 'Factores de riesgo psicosocial en el trabajo', 
    puntos: [
      { numero: '5.1', descripcion: 'Política de prevención de riesgos psicosociales en el trabajo.' },
      { numero: '5.5', descripcion: 'Identificación y canalización de trabajadores expuestos a acontecimientos traumáticos.' },
      { numero: '7.1 b)', descripcion: 'Identificación y análisis de factores de riesgo psicosocial en el centro de trabajo.' },
      { numero: '8.2 a) 5)', descripcion: 'Capacitación de directivos y supervisores en prevención de riesgos psicosociales.' }
    ],
    condition: (values) => values.factoresPsicosociales === 'sí'
  },
  { 
    id: 'NOM-036-1', 
    title: 'Factores de riesgo ergonómico por manejo manual de cargas', 
    puntos: [
      { numero: '5.1', descripcion: 'Análisis de los factores de riesgo ergonómico debido al manejo manual de cargas.' },
      { numero: '5.3', descripcion: 'Programa de ergonomía para la vigilancia de la salud de los trabajadores expuestos.' },
      { numero: '5.4', descripcion: 'Documento informativo sobre los riesgos del manejo manual de cargas.' },
      { numero: '5.5', descripcion: 'Capacitación en procedimientos de seguridad para manejo manual de cargas.' }
    ],
    condition: (values) => values.manejocargas === 'sí'
  },
  { 
    id: 'NOM-017', 
    title: 'Equipo de protección personal', 
    puntos: [
      { numero: '5.2', descripcion: 'Análisis de riesgos por puesto de trabajo y determinación del equipo de protección necesario.' },
      { numero: '5.5', descripcion: 'Documento informativo sobre los riesgos a los que se exponen los trabajadores.' },
      { numero: '5.6', descripcion: 'Capacitación para el uso adecuado del equipo de protección personal.' },
      { numero: '5.8', descripcion: 'Identificación y señalización de áreas donde es obligatorio el uso de equipo de protección.' }
    ],
    condition: (values) => values.equipoProteccion === 'sí'
  },
  { 
    id: 'NOM-018', 
    title: 'Identificación y comunicación de peligros por sustancias químicas peligrosas', 
    puntos: [
      { numero: '6.1', descripcion: 'Listado actualizado de sustancias químicas peligrosas en el centro de trabajo.' },
      { numero: '6.3', descripcion: 'Hojas de datos de seguridad para todas las sustancias químicas peligrosas.' },
      { numero: '6.5', descripcion: 'Identificación y señalización de recipientes y áreas que contienen sustancias químicas peligrosas.' },
      { numero: '6.7', descripcion: 'Capacitación para el manejo seguro de sustancias químicas peligrosas.' }
    ],
    condition: (values) => values.materialp === 'sí'
  },
  { 
    id: 'NOM-019', 
    title: 'Constitución y funcionamiento de las comisiones de seguridad e higiene', 
    puntos: [
      { numero: '5.4', descripcion: 'Acta de constitución de la comisión de seguridad e higiene.' },
      { numero: '5.5', descripcion: 'Programa de recorridos de verificación de la comisión de seguridad e higiene.' },
      { numero: '5.6', descripcion: 'Actas de los recorridos de verificación realizados por la comisión.' },
      { numero: '5.13', descripcion: 'Capacitación a los integrantes de la comisión de seguridad e higiene.' }
    ],
    condition: (values) => values.comisionSeguridadHigiene === 'sí'
  },
  
  
  { 
    id: 'NOM-026', 
    title: 'Colores y señales de seguridad e higiene, e identificación de riesgos por fluidos conducidos en tuberías', 
    puntos: [
      { numero: '5.2', descripcion: 'Constancias de competencias o habilidades laborales sobre la interpretación de elementos de señalización en el centro de trabajo.' },
      { numero: '5.3', descripcion: 'Mantenimiento de la aplicación del color, señalización e identificación de tuberías para asegurar visibilidad y legibilidad.' },
      { numero: '5.4', descripcion: 'Ubicación de señales de seguridad e higiene de manera que sean observadas e interpretadas correctamente por los trabajadores.' }
    ],
    condition: (values) => values.senalizacionSeguridad === 'sí' // Agregar este campo en formValues si aplica
  },

    
  { 
    id: 'NOM-030', 
    title: 'Servicios preventivos de seguridad y salud en el trabajo', 
    puntos: [
      { numero: '4.1', descripcion: 'Designación de un responsable de seguridad y salud en el trabajo para actividades preventivas en el centro de trabajo.' },
      { numero: '4.3', descripcion: 'Diagnóstico integral o por áreas de las condiciones de seguridad y salud en el trabajo.' },
      { numero: '4.4', descripcion: 'Programa de seguridad y salud en el trabajo basado en el diagnóstico de seguridad y salud.' },
      { numero: '4.5', descripcion: 'Comunicación del diagnóstico y programa de seguridad a la comisión de seguridad e higiene o trabajadores.' }
    ],
    condition: (values) => values.seguridadSalud === 'sí' // Agregar este campo en formValues si aplica
  },




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
  
    if (step === 5 && formValues.maquinariaMateriales === "no") {
      setStep(7);
    } else if (step === 7 && formValues.trabajosAltura === "no") {
      setStep(9);
    } else if (step === 7 && formValues.trabajosAltura === "sí") {
      setStep(8);
    } else if (step === 9) {
      // Lógica para el paso 9 según el valor de recipientesPresion
      if (formValues.recipientesPresion === "sí") {
        setStep(10);
      } else if (formValues.recipientesPresion === "no") {
        setStep(11);
      }
    } else if (step === 11) {
      // Lógica para el paso 11 según el valor de recipientesCriogenicos
      if (formValues.recipientesCriogenicos === "sí") {
        setStep(12);
      } else if (formValues.recipientesCriogenicos === "no") {
        setStep(13);
      }
    } else if (step === 13) {
      // Lógica para el paso 13 según el valor de generadoresVapor
      if (formValues.generadoresVapor === "sí") {
        setStep(14);
      } else if (formValues.generadoresVapor === "no") {
        setStep(15);
      }
    } else if (step === 15) {
      // Lógica para el paso 15 según el valor de cargasEstaticas
      if (formValues.cargasEstaticas === "sí") {
        setStep(16);
      } else if (formValues.cargasEstaticas === "no") {
        setStep(17);
      }
    } else if (step === 17) {
        // Lógica para el paso 15 según el valor de cargasEstaticas
        if (formValues.soldaduraCorte === "sí") {
          setStep(18);
        } else if (formValues.soldaduraCorte === "no") {
          setStep(19);
        }
    } else if (step === 19) {
        // Lógica para el paso 15 según el valor de cargasEstaticas
        if (formValues.instalacionesElectricas === "sí") {
          setStep(20);
        } else if (formValues.instalacionesElectricas === "no") {
          setStep(22);
        }
    } else if (step === 20) {
        // Lógica para el paso 15 según el valor de cargasEstaticas
        if (formValues.mantenimientoLineasElectricas === "sí") {
          setStep(21);
        } else if (formValues.mantenimientoLineasElectricas === "no") {
          setStep(22);
        }
    } else if (step === 22) {
        // Lógica para el paso 15 según el valor de cargasEstaticas
        if (formValues.trabajosEspaciosConfinados === "sí") {
          setStep(23);
        } else if (formValues.trabajosEspaciosConfinados === "no") {
          setStep(24);
        }
    } else if (step === 24) {
        // Lógica para el paso 15 según el valor de cargasEstaticas
        if (formValues.trabajadoresDiscapacidad === "sí") {
          setStep(25);
        } else if (formValues.trabajadoresDiscapacidad === "no") {
          setStep(26);
        }
    } else if (step === 26) {
        if (formValues.exposicionRuido === "Sí") {
          setStep(27);
        } else if (formValues.exposicionRuido === "No") {
          setStep(39);
        } else if (formValues.exposicionRuido === "No sé") {
          setStep(39); // O el paso que corresponda
        }
    } else if (step === 39) {
        // Lógica para el paso 15 según el valor de cargasEstaticas
        if (formValues.comunicacionRuido === "sí") {
          setStep(27);
        } else if (formValues.comunicacionRuido === "no") {
          setStep(27);
        }
    } else if (step === 27) {
        // Lógica para el paso 15 según el valor de cargasEstaticas
        if (formValues.comunicacionRuido === "sí") {
          setStep(28);
        } else if (formValues.comunicacionRuido === "no") {
          setStep(28);
        }
    } else {
      setStep(step + 1);
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
      case 39:
        return formValues.comunicacionRuido !== '';
      case 38:
        return formValues.nuevoCampo  !== ''; // Reemplaza 'nuevoCampo' con el nombre correcto si aplica
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
      />
      Sí
    </label>
    <label>
      <input 
        type="radio" 
        name="materialesPiroforicos" 
        value="no" 
        onChange={handleInputChange} 
      />
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
      <button onClick={handleNext} disabled={!formValues.maquinariaMateriales}>Continuar</button>
    </div>
  </div>
)}

{step === 6 && formValues.maquinariaMateriales === "sí" && (
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
      <button onClick={handleNext}>Continuar</button>
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
      <button onClick={handleNext}>Continuar</button>
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
  <div className="step24">
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
         <h3>Tipos de Discapacidad del Personal</h3>
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

      
{step === 29 && (
        <div>
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
              <button onClick={handleNext} disabled={!isStepCompleted()}>
                Continuar
              </button>
            </div>
          </div>
        )}



{step === 34 && (
          <div className="step34">
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
                Reiniciar
              </button>
            </div>
            <div className="normas-table">
              <table border="1" align="center" cellPadding="5" cellSpacing="0">
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Título de la norma</th>
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
                      <td colSpan="4">No se han encontrado normas aplicables</td>
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