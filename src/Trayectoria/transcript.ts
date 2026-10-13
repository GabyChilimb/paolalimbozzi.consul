import { makeTimeline, Segment } from "../lib/timeline";

// Transcripción del video de Paola (Whisper turbo + VAD), corregida a mano.
// start/end en segundos del video ORIGINAL. Si querés cambiar un texto, editalo acá.
// Se omite el "Gracias." de 28.7 s (comentario fuera del discurso).
export const RAW_SEGMENTS: Segment[] = [
  { start: 0.43, end: 4.21, text: "¿Qué tiene que haber detrás de una persona para que decidas formarte con ella?" },
  { start: 4.65, end: 7.41, text: "Yo creo que la respuesta está más allá de un título." },
  { start: 8.37, end: 12.03, text: "Soy médica formada en la UBA, especializada en medicina estética." },
  { start: 12.11, end: 17.21, text: "Durante estos años tuve la posibilidad de llevar mi experiencia al ámbito académico." },
  { start: 17.96, end: 20.65, text: "Soy speaker de congresos nacionales e internacionales." },
  {
    start: 21.37,
    end: 28.6,
    text: "Participé en espacios como el Congreso Mundial de Estética, Mendoza Esthetic, ACAOFAR, Congreso Estética Mundial y Semal Madrid.",
  },
  {
    start: 30.19,
    end: 35.23,
    text: "También formo parte como miembro del Comité Científico del Congreso Estética Mundial en Córdoba.",
  },
  { start: 35.59, end: 40.64, text: "Y recorrí distintas ciudades dando talleres y capacitaciones para profesionales." },
  { start: 40.75, end: 42.44, text: "Te cuento esto no para hacer una lista" },
  { start: 42.53, end: 46.39, text: "de títulos. Porque una cosa es estudiar medicina estética," },
  { start: 46.63, end: 48.64, text: "enseñar, escuchar preguntas de profesionales." },
  { start: 48.76, end: 51.56, text: "Otra es ejercerla durante años," },
  { start: 51.68, end: 54.23, text: "enfrentarte todos los días a pacientes reales." },
  { start: 54.7, end: 58.64, text: "Hoy soy directora de la Diplomatura de Medicina Estética y Regenerativa de la Universidad Kennedy." },
  { start: 58.78, end: 63.87, text: "Directora del Posgrado Integral de Armonización Orofacial para Odontólogos" },
  { start: 64.14, end: 66.17, text: "y directora de Paola Limbozzi Academy." },
  { start: 66.56, end: 68.66, text: "Y todo ese recorrido tiene un mismo objetivo:" },
  { start: 69.01, end: 71.2, text: "formar profesionales mejor capacitados." },
  { start: 71.86, end: 74.37, text: "Si estás buscando dónde formarte en medicina estética," },
  { start: 74.82, end: 78.17, text: "escribime INFORMACIÓN y te cuento cómo trabajamos en la academia." },
];

// Tramos del video original que quedan después de cortar silencios.
// 12 tramos, 73.33s (original 78.53s). Generado por: python tools/voz.py <video> public/trayectoria/voz.wav src/Trayectoria/transcript.ts ruidosa
export const KEEP: [number, number][] = [
  [0.333, 4.333],
  [4.567, 7.533],
  [8.267, 17.333],
  [17.867, 20.800],
  [21.267, 28.733],
  [30.100, 35.367],
  [35.500, 54.367],
  [54.600, 66.300],
  [66.467, 68.800],
  [68.900, 71.333],
  [71.767, 74.500],
  [74.733, 78.300],
];

export const { T, VOICE_SECONDS, SEGMENTS, WORDS, PAGES, timeOf } = makeTimeline(RAW_SEGMENTS, KEEP);
