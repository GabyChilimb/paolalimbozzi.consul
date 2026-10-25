import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Academy / Octubre — "Antes de iniciar un curso". Muchas frases tienen varias
// tomas; se arma cada una con las partes limpias.
const RAW_SEGMENTS: Segment[] = [
  { start: 12.71, end: 14.23, text: "Antes de elegir un curso," },
  { start: 18.38, end: 22.48, text: "preguntá qué pasa cuando te surgen dudas después de esa capacitación." },
  { start: 23.24, end: 24.55, text: "Entender una técnica" },
  { start: 40.55, end: 44.63, text: "no significa saber resolver todas las situaciones que aprendés en la práctica." },
  { start: 48.17, end: 51.3, text: "A veces necesitás revisar un caso," },
  { start: 53.46, end: 56.09, text: "comprender una situación específica" },
  { start: 58.92, end: 61.3, text: "y recibir orientación para seguir aprendiendo." },
  { start: 104.49, end: 109.68, text: "En nuestras formaciones, el acompañamiento forma parte de la experiencia académica." },
  { start: 115.95, end: 121.01, text: "Conocé nuestras propuestas y fijate cuál se adapta a tu etapa profesional." },
];

// KEEP: 9 tramos, 31.57s (original 122.62s) · perfil de voz "media" (tools/finalizar.py)
const KEEP: [number, number][] = [
  [12.600, 14.367],
  [18.267, 22.633],
  [23.133, 24.700],
  [40.433, 44.767],
  [48.067, 51.433],
  [53.367, 56.233],
  [58.833, 61.433],
  [104.400, 109.833],
  [115.867, 121.133],
];

export const academyAntesDeIniciar: ReelConfig = {
  id: "AcademyAntesDeIniciar",
  title: "academy-05-antes-de-iniciar-un-curso",
  dir: "academy-antes-de-iniciar-un-curso",
  style: "anotador",
  lookOverride: { accent: "#3B7A8C" },
  face: { x: 0.5, y: 0.33 },
  handle: HANDLE.academy,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["curso", "dudas", "técnica", "práctica", "caso", "situación", "orientación", "acompañamiento", "etapa"],
  hook: { eyebrow: "Para profesionales", parts: ["Antes de elegir un curso, ", { em: "preguntá esto" }], to: { word: "preguntá", offset: -0.05 } },
  callouts: [
    { kind: "note", at: { word: "preguntá" }, parts: ["¿Qué pasa cuando ", { em: "te surgen dudas" }, " después?"] },
    { kind: "big", at: { word: "Entender" }, parts: ["Entender una técnica ", { em: "no alcanza" }] },
    {
      kind: "list",
      at: { word: "A", after: 48 },
      to: { word: "aprendiendo.", offset: 0.5 },
      title: ["A veces ", { em: "necesitás" }],
      items: [
        { text: "Revisar un caso", at: { word: "revisar" } },
        { text: "Entender una situación específica", at: { word: "comprender" } },
        { text: "Recibir orientación", at: { word: "orientación" } },
      ],
    },
    { kind: "card", at: { word: "acompañamiento" }, eyebrow: "En nuestras formaciones", parts: ["El acompañamiento ", { em: "es parte" }, " de la experiencia"] },
  ],
  cta: { at: { word: "Conocé" }, kicker: "¿Cuál se adapta a tu etapa?", button: "CONOCÉ NUESTRAS PROPUESTAS" },
  end: { parts: ["Formación con ", { em: "acompañamiento" }, "."], sub: "Paola Limbozzi Academy" },
  music: { preset: "lofi", seed: 25 },
};
