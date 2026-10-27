import { Segment } from "../../lib/timeline";
import { HANDLE, PERFIL } from "../handles";
import { ReelConfig } from "../engine/types";

// Cónsul / Video 4 — "El bótox barato sale carísimo" (clips 1–7).
const RAW_SEGMENTS: Segment[] = [
  { start: 0.11, end: 2.96, text: "El bótox barato sale carísimo." },
  { start: 3.31, end: 4.45, text: "Acá te cuento por qué." },
  { start: 5.48, end: 8.51, text: "Todas las semanas me llegan pacientes para corregir" },
  { start: 9.82, end: 14.63, text: "una frente congelada, una ceja caída y un rostro que no es el tuyo." },
  { start: 15.84, end: 20.02, text: "Además, nadie les mostró el producto, y después pagan dos veces." },
  { start: 20.68, end: 23.58, text: "Pedí ver la caja, que te evalúe un médico" },
  { start: 23.67, end: 26.75, text: "y que te explique qué zonas necesitás y cuáles no." },
  { start: 27.21, end: 30.8, text: "Si querés saber qué plan es para vos, escribime y te evaluamos." },
];

// KEEP: 14 tramos, 23.73s · pausas internas recortadas (tools/pausas.py) · perfil de voz "media"
const KEEP: [number, number][] = [
  [0.100, 1.533],
  [1.733, 2.967],
  [3.267, 4.267],
  [5.467, 8.367],
  [9.767, 14.600],
  [15.800, 16.300],
  [16.433, 17.867],
  [17.967, 18.633],
  [18.867, 19.767],
  [20.633, 21.833],
  [21.933, 23.367],
  [23.633, 25.867],
  [26.167, 26.700],
  [27.200, 30.633],
];

export const consul4: ReelConfig = {
  id: "Consul4",
  title: "consul-04-el-botox-barato-sale-carisimo",
  dir: "consul-4",
  style: "anotador",
  face: { x: 0.49, y: 0.45 },
  handle: HANDLE.consul,
  profile: PERFIL.consul,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["barato", "carísimo", "corregir", "congelada", "caída", "producto", "caja", "médico", "zonas"],
  hook: { eyebrow: "Ojo con esto", parts: ["El bótox barato ", { em: "sale carísimo" }], to: { word: "por", offset: 0.5 } },
  callouts: [
    { kind: "note", at: { word: "Todas" }, parts: ["Todas las semanas: ", { em: "pacientes para corregir" }] },
    {
      kind: "list",
      at: { word: "frente", offset: -0.2 },
      title: ["Lo que ", { em: "veo" }],
      items: [
        { text: "Frente congelada", at: { word: "frente" } },
        { text: "Ceja caída", at: { word: "ceja" } },
        { text: "Un rostro que no es el tuyo", at: { word: "rostro" } },
      ],
    },
    { kind: "stamp", at: { word: "nadie" }, text: "¿Y el producto?", icon: "alert" },
    { kind: "big", at: { word: "pagan" }, parts: ["Pagan ", { em: "dos veces" }] },
    {
      kind: "list",
      at: { word: "Pedí" },
      title: [{ em: "Pedí" }],
      items: [
        { text: "Ver la caja", at: { word: "caja" } },
        { text: "Que te evalúe un médico", at: { word: "evalúe" } },
        { text: "Qué zonas sí y cuáles no", at: { word: "zonas" } },
      ],
    },
  ],
  cta: { at: { word: "Si", after: 27 }, kicker: "¿Qué plan es para vos?", button: "ESCRIBIME", sub: "y te evaluamos" },
  end: { parts: ["Lo barato ", { em: "sale caro" }, ". Primero, una buena evaluación."] },
  music: { preset: "lofi", seed: 4 },
};
