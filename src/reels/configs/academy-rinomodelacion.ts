import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Academy / Octubre — "Rinomodelación" (con maniquí de práctica). Se usan las
// tomas limpias y se omiten comentarios al camarógrafo y repeticiones.
const RAW_SEGMENTS: Segment[] = [
  { start: 2.86, end: 8.08, text: "Una rinomodelación no es simplemente tratar una giba o levantar una punta." },
  { start: 17.51, end: 22.07, text: "Antes de tratar una nariz, evalúo cómo se relaciona con todo el rostro:" },
  { start: 27.21, end: 33.88, text: "la frente, el perfil, radix, el dorso, la punta, los labios, el mentón" },
  { start: 34.35, end: 37.4, text: "y la línea que pasa entre la nariz y el mentón." },
  { start: 50.63, end: 57.75, text: "Porque muchas veces una nariz parece más grande, pero en realidad tiene el mentón poco proyectado" },
  { start: 60.3, end: 63.06, text: "o un desequilibrio en su perfil." },
  { start: 66.12, end: 69.81, text: "Y no todas las narices son candidatas a rinomodelación." },
  { start: 73.71, end: 76.79, text: "Además, es una zona de alto riesgo vascular," },
  { start: 79.4, end: 85.01, text: "por lo que la anatomía, la técnica y la planificación son fundamentales." },
  { start: 88.81, end: 93.14, text: "Por eso yo prefiero correcciones pequeñas, estratégicas y progresivas." },
  { start: 116.46, end: 119.73, text: "Milímetros bien colocados pueden cambiar muchísimo el perfil." },
  { start: 126.06, end: 129.4, text: "Rinomodelar es equilibrar, no rellenar." },
];

// KEEP: 23 tramos, 50.60s · pausas internas recortadas (tools/pausas.py) · perfil de voz "media"
const KEEP: [number, number][] = [
  [2.833, 6.733],
  [6.867, 8.200],
  [17.467, 20.767],
  [21.067, 22.033],
  [27.200, 29.133],
  [29.433, 33.867],
  [34.333, 36.733],
  [36.867, 37.433],
  [50.600, 52.633],
  [52.967, 54.500],
  [54.600, 57.700],
  [60.267, 60.533],
  [60.800, 63.000],
  [66.100, 67.567],
  [67.667, 69.667],
  [73.667, 76.767],
  [79.367, 83.267],
  [83.400, 84.867],
  [88.800, 93.067],
  [116.433, 119.800],
  [126.000, 127.200],
  [127.333, 128.500],
  [128.733, 129.433],
];

export const academyRinomodelacion: ReelConfig = {
  id: "AcademyRinomodelacion",
  title: "academy-03-rinomodelacion",
  dir: "academy-rinomodelacion",
  style: "clinica",
  lookOverride: { accent: "#B99A48", accent2: "#E5C46A" },
  face: { x: 0.42, y: 0.33 },
  handle: HANDLE.academy,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["giba", "rostro", "radix", "dorso", "mentón", "perfil", "candidatas", "vascular", "anatomía", "técnica", "planificación", "milímetros", "equilibrar"],
  hook: { eyebrow: "Para profesionales", parts: ["Rinomodelación ", { em: "no es" }, " tratar una giba"], to: { word: "punta.", offset: 0.4 } },
  callouts: [
    { kind: "card", at: { word: "Antes" }, eyebrow: "Antes de tratar", parts: ["Evalúo ", { em: "todo el rostro" }] },
    {
      kind: "list",
      at: { word: "frente" },
      to: { word: "mentón.", after: 34, offset: 0.6 },
      title: ["Lo que ", { em: "evalúo" }],
      items: [
        { text: "Frente y perfil", at: { word: "frente" } },
        { text: "Radix, dorso y punta", at: { word: "radix" } },
        { text: "Labios y mentón", at: { word: "labios" } },
        { text: "Línea nariz–mentón", at: { word: "línea" } },
      ],
    },
    { kind: "card", at: { word: "muchas", after: 50 }, eyebrow: "Ojo", parts: ["¿Nariz grande? Puede ser ", { em: "un mentón poco proyectado" }] },
    { kind: "big", at: { word: "no", after: 66 }, parts: ["No todas las narices son ", { em: "candidatas" }] },
    { kind: "stamp", at: { word: "riesgo" }, text: "Riesgo vascular", icon: "alert" },
    {
      kind: "list",
      at: { word: "anatomía", after: 79, offset: -0.3 },
      title: [{ em: "Fundamentales" }],
      items: [
        { text: "Anatomía", at: { word: "anatomía", after: 79 } },
        { text: "Técnica", at: { word: "técnica", after: 79 } },
        { text: "Planificación", at: { word: "planificación" } },
      ],
    },
    { kind: "card", at: { word: "correcciones" }, eyebrow: "Prefiero correcciones", parts: ["Pequeñas, ", { em: "estratégicas" }, " y progresivas"] },
    { kind: "big", at: { word: "Milímetros" }, parts: ["Milímetros ", { em: "bien colocados" }] },
    { kind: "big", at: { word: "Rinomodelar" }, to: 129.6, parts: ["Rinomodelar es ", { em: "equilibrar" }, ", no rellenar"] },
  ],
  end: { parts: ["Rinomodelar es ", { em: "equilibrar" }, "."], sub: "Paola Limbozzi Academy" },
  music: { preset: "luminoso", seed: 23 },
};
