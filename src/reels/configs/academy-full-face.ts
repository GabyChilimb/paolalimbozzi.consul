import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Academy / Octubre — "Full face". Se omiten tomas repetidas o cortadas
// (8.9–11.2, la primera "cuando planifico…", 58–62.5 y 69–71.3).
const RAW_SEGMENTS: Segment[] = [
  { start: 1.67, end: 5.04, text: "Un tratamiento full face no significa llenar toda la cara." },
  { start: 12.23, end: 18.36, text: "Significa entender qué estructuras alteran la armonía y cuáles no necesitan tocarse." },
  { start: 23.62, end: 29.24, text: "Cuando planifico, evalúo proporciones, soporte óseo, compartimentos grasos," },
  { start: 31.37, end: 34.71, text: "calidad de piel, simetrías y perfil." },
  { start: 38.15, end: 41.75, text: "Porque armonizar no es solamente tratar zonas aisladas;" },
  { start: 44.11, end: 48.31, text: "es entender cómo cada estructura modifica el rostro completo." },
  { start: 51.5, end: 55.28, text: "Y muchas veces el mejor tratamiento es saber dónde no colocar volumen." },
  { start: 63.31, end: 67.03, text: "¿Querés ser un profesional de la estética que realmente se destaque?" },
  { start: 71.69, end: 73.49, text: "No alcanza con aprender a inyectar:" },
  { start: 77.03, end: 80.56, text: "hay que aprender a diagnosticar, planificar y decidir." },
  { start: 83.4, end: 86.2, text: "Eso es lo que trabajamos en Paola Limbozzi Academy." },
  { start: 88.84, end: 91.22, text: "De inyectar a saber armonizar." },
];

// KEEP: 18 tramos, 39.83s · pausas internas recortadas (tools/pausas.py) · perfil de voz "media"
const KEEP: [number, number][] = [
  [1.567, 4.967],
  [12.267, 16.467],
  [16.567, 17.500],
  [17.600, 17.767],
  [23.533, 26.033],
  [26.300, 29.000],
  [31.367, 32.400],
  [32.600, 34.233],
  [38.133, 41.233],
  [44.067, 47.800],
  [51.467, 55.200],
  [63.300, 66.833],
  [71.667, 73.400],
  [76.967, 80.100],
  [83.400, 84.433],
  [84.533, 86.033],
  [88.833, 89.633],
  [89.900, 90.867],
];

export const academyFullFace: ReelConfig = {
  id: "AcademyFullFace",
  title: "academy-01-full-face",
  dir: "academy-full-face",
  style: "calido",
  face: { x: 0.44, y: 0.35 },
  handle: HANDLE.academy,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["armonía", "proporciones", "óseo", "grasos", "piel", "perfil", "volumen", "diagnosticar", "planificar", "decidir", "armonizar"],
  hook: { eyebrow: "Para profesionales", parts: ["Full face ", { em: "no es llenar" }, " toda la cara"] },
  callouts: [
    { kind: "card", at: { word: "Significa", after: 12 }, eyebrow: "Significa", parts: ["Entender qué estructuras ", { em: "alteran la armonía" }] },
    {
      kind: "list",
      at: { word: "Cuando" },
      to: { word: "perfil.", offset: 0.8 },
      title: ["Cuando planifico, ", { em: "evalúo" }],
      items: [
        { text: "Proporciones", at: { word: "proporciones" } },
        { text: "Soporte óseo", at: { word: "soporte" } },
        { text: "Compartimentos grasos", at: { word: "compartimentos" } },
        { text: "Calidad de piel", at: { word: "calidad" } },
        { text: "Simetrías y perfil", at: { word: "simetrías" } },
      ],
    },
    { kind: "quote", at: { word: "armonizar" }, parts: ["Armonizar no es tratar ", { em: "zonas aisladas" }] },
    { kind: "card", at: { word: "es", after: 43.9 }, eyebrow: "Es entender", parts: ["Cómo cada estructura modifica ", { em: "el rostro completo" }] },
    { kind: "big", at: { word: "saber", after: 50 }, parts: ["Saber dónde ", { em: "no colocar volumen" }] },
    { kind: "card", at: { word: "¿Querés", after: 63 }, eyebrow: "Para destacarte", parts: ["¿Querés ", { em: "destacarte" }, "?"] },
    { kind: "versus", at: { word: "alcanza" }, rightAt: { word: "diagnosticar" }, left: "Solo inyectar", right: "Diagnosticar, planificar y decidir" },
    { kind: "lower", at: { word: "Eso", after: 83 }, eyebrow: "Paola Limbozzi Academy", parts: ["Eso es lo que ", { em: "trabajamos" }] },
    { kind: "big", at: { word: "De", after: 88 }, to: 91.4, parts: ["De inyectar a ", { em: "saber armonizar" }] },
  ],
  end: { parts: ["De inyectar a ", { em: "saber armonizar" }, "."], sub: "Formación en medicina estética" },
  music: { preset: "academy", seed: 21 },
};
