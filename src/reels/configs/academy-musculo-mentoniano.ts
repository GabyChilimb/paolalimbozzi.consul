import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Academy / Octubre — "Músculo mentoniano". Toma de casi 4 min con muchas
// repeticiones y charla con quien filma; cada frase se arma con sus partes limpias.
const RAW_SEGMENTS: Segment[] = [
  { start: 55.27, end: 59.57, text: "¿Sabés qué músculo está detrás del aspecto de piel de naranja" },
  { start: 59.95, end: 64.05, text: "en el mentón y por qué es importante identificarlo antes de tratar?" },
  { start: 77.64, end: 80.44, text: "El músculo mentoniano o mentalis" },
  { start: 80.88, end: 82.16, text: "se origina en la mandíbula anterior" },
  { start: 107.91, end: 110.48, text: "y se inserta en la piel del mentón." },
  { start: 111.37, end: 112.26, text: "Cuando se contrae," },
  { start: 119.02, end: 120.85, text: "eleva y protruye" },
  { start: 152.68, end: 157.36, text: "tejido del mentón y contribuye al movimiento del labio inferior." },
  { start: 165.67, end: 170.23, text: "Su hiperactividad puede generar depresiones y una irregularidad" },
  { start: 173.74, end: 176.02, text: "conocida como mentón en empedrado." },
  { start: 209.26, end: 213.78, text: "Pero atención: no toda irregularidad cutánea tiene un origen muscular." },
  { start: 218.48, end: 223.7, text: "Diferenciar el componente dinámico de los cambios estructurales es parte de la evaluación clínica." },
];

// KEEP: 12 tramos, 41.97s (original 227.37s) · perfil de voz "media" (tools/finalizar.py)
const KEEP: [number, number][] = [
  [55.167, 59.700],
  [59.867, 64.200],
  [77.533, 80.567],
  [80.767, 82.300],
  [107.800, 110.633],
  [111.267, 112.400],
  [118.933, 121.000],
  [152.567, 157.500],
  [165.567, 170.367],
  [173.633, 176.167],
  [209.167, 213.933],
  [218.367, 223.833],
];

export const academyMentoniano: ReelConfig = {
  id: "AcademyMentoniano",
  title: "academy-07-musculo-mentoniano",
  dir: "academy-musculo-mentoniano",
  style: "pop",
  lookOverride: { accent: "#FF7EB6", accent2: "#4A93A8" },
  face: { x: 0.5, y: 0.38 },
  handle: HANDLE.academy,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["músculo", "naranja", "mentón", "mentoniano", "mentalis", "mandíbula", "contrae", "protruye", "hiperactividad", "empedrado", "atención", "muscular", "dinámico", "estructurales"],
  hook: { eyebrow: "Mentón", parts: ["¿Qué músculo está detrás de la ", { em: "piel de naranja" }, "?"] },
  callouts: [
    { kind: "lower", at: { word: "músculo", after: 77 }, eyebrow: "Anatomía", parts: ["Músculo ", { em: "mentoniano" }], sub: "o mentalis" },
    {
      kind: "list",
      at: { word: "origina" },
      to: { word: "mentón.", after: 108, offset: 0.4 },
      title: [{ em: "Mentalis" }],
      items: [
        { text: "Origen: mandíbula anterior", at: { word: "mandíbula" } },
        { text: "Inserción: piel del mentón", at: { word: "inserta" } },
      ],
    },
    { kind: "card", at: { word: "Cuando", after: 111 }, to: { word: "inferior.", offset: 0.4 }, eyebrow: "Al contraerse", parts: ["Eleva y ", { em: "protruye" }, " el mentón"] },
    { kind: "big", at: { word: "hiperactividad" }, to: { word: "empedrado.", offset: 0.5 }, parts: ["Hiperactividad: ", { em: "mentón en empedrado" }] },
    { kind: "stamp", at: { word: "atención" }, text: "Atención", icon: "alert" },
    { kind: "card", at: { word: "irregularidad", after: 209 }, eyebrow: "No siempre", parts: ["No toda irregularidad es ", { em: "muscular" }] },
    {
      kind: "list",
      at: { word: "Diferenciar" },
      to: { word: "clínica.", offset: 0.4 },
      title: [{ em: "Diferenciá" }],
      items: [
        { text: "Componente dinámico", at: { word: "dinámico" } },
        { text: "Cambios estructurales", at: { word: "estructurales" } },
      ],
    },
  ],
  end: { parts: ["Diferenciar es parte de ", { em: "la evaluación clínica" }, "."], sub: "Paola Limbozzi Academy" },
  music: { preset: "pop", seed: 27 },
};
