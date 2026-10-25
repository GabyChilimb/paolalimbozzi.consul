import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Academy / Octubre — "Contracción muscular". Muchas repeticiones; cada frase se
// arma con sus tomas limpias.
const RAW_SEGMENTS: Segment[] = [
  { start: 9.16, end: 14.68, text: "Ver una arruga no alcanza para concluir que tu paciente necesita toxina botulínica." },
  { start: 39.63, end: 43.16, text: "Primero, diferenciá si la línea aparece principalmente" },
  { start: 44.75, end: 46.71, text: "durante la contracción muscular" },
  { start: 50.35, end: 54.42, text: "o si también está presente en reposo." },
  { start: 55.53, end: 56.85, text: "Las arrugas dinámicas" },
  { start: 57.19, end: 60.05, text: "tienen un componente relacionado con la actividad muscular." },
  { start: 81.9, end: 85.4, text: "En cambio, las líneas estáticas pueden involucrar cambios dérmicos," },
  { start: 89.83, end: 92.37, text: "pérdida de elasticidad y modificaciones del tejido." },
  { start: 98.41, end: 101.14, text: "Ambos componentes pueden coexistir." },
  { start: 107.08, end: 110.77, text: "Por eso, la evaluación no debería basarse solo en un hallazgo." },
  { start: 128.59, end: 134.32, text: "La clave es identificar qué factores contribuyen al signo que observás." },
  { start: 138.92, end: 141.91, text: "El tratamiento se elige a partir de esa evaluación" },
  { start: 145.07, end: 147.35, text: "y no solamente de la apariencia de la arruga." },
];

// KEEP: 13 tramos, 45.80s (original 148.24s) · perfil de voz "media" (tools/finalizar.py)
const KEEP: [number, number][] = [
  [9.067, 14.833],
  [39.533, 43.300],
  [44.667, 46.867],
  [50.267, 54.567],
  [55.433, 57.000],
  [57.100, 60.200],
  [81.800, 85.533],
  [89.733, 92.500],
  [98.300, 101.267],
  [106.967, 110.900],
  [128.500, 134.467],
  [138.833, 142.033],
  [144.967, 147.500],
];

export const academyContraccion: ReelConfig = {
  id: "AcademyContraccion",
  title: "academy-06-contraccion-muscular",
  dir: "academy-contraccion-muscular",
  style: "noche",
  lookOverride: { accent: "#E8A0BF", accent2: "#D4AF37" },
  face: { x: 0.5, y: 0.38 },
  handle: HANDLE.academy,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["arruga", "botulínica", "contracción", "reposo", "dinámicas", "muscular", "estáticas", "dérmicos", "elasticidad", "coexistir", "evaluación", "factores"],
  hook: { eyebrow: "Toxina botulínica", parts: ["Ver una arruga ", { em: "no alcanza" }] },
  callouts: [
    { kind: "card", at: { word: "Primero" }, to: { word: "reposo.", offset: 0.5 }, eyebrow: "Primero, diferenciá", parts: ["¿Aparece ", { em: "en contracción" }, " o también en reposo?"] },
    { kind: "card", at: { word: "dinámicas" }, eyebrow: "Arrugas dinámicas", parts: ["Componente ", { em: "muscular" }] },
    {
      kind: "list",
      at: { word: "estáticas" },
      to: { word: "tejido.", offset: 0.5 },
      title: ["Líneas ", { em: "estáticas" }],
      items: [
        { text: "Cambios dérmicos", at: { word: "dérmicos" } },
        { text: "Pérdida de elasticidad", at: { word: "pérdida" } },
        { text: "Modificaciones del tejido", at: { word: "modificaciones" } },
      ],
    },
    { kind: "big", at: { word: "Ambos" }, parts: ["Ambos componentes ", { em: "pueden coexistir" }] },
    { kind: "card", at: { word: "evaluación", after: 107 }, eyebrow: "Por eso", parts: ["No evalúes por ", { em: "un solo hallazgo" }] },
    { kind: "quote", at: { word: "clave" }, to: { word: "observás.", offset: 0.5 }, parts: ["La clave: qué factores ", { em: "contribuyen al signo" }] },
    { kind: "big", at: { word: "tratamiento", after: 138 }, to: { word: "arruga.", after: 145, offset: 0.4 }, parts: ["El tratamiento se elige ", { em: "por la evaluación" }] },
  ],
  end: { parts: ["Evaluar antes de ", { em: "indicar" }, "."], sub: "Paola Limbozzi Academy" },
  music: { preset: "academy", seed: 26 },
};
