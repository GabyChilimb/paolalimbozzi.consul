import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Cónsul / Video 3 — "Tratamientos que nunca le daría a un paciente".
// Orden de clips: 1, 2, 3, "3 3", 4…9, "95", 10. El clip 3 repite "tratamientos que"
// (toma repetida) y se omite.
const RAW_SEGMENTS: Segment[] = [
  { start: 0.07, end: 1.25, text: "Tratamientos que" },
  { start: 1.59, end: 2.33, text: "nunca, nunca" },
  { start: 4.42, end: 6.06, text: "le daría a un paciente." },
  { start: 6.45, end: 7.49, text: "Número uno:" },
  { start: 7.96, end: 10.48, text: "aplicar sin evaluar antes." },
  { start: 10.85, end: 12.97, text: "Porque cada rostro es distinto." },
  { start: 13.48, end: 14.91, text: "Número dos:" },
  { start: 15.43, end: 20.86, text: "un producto que no te muestro. Tenés derecho a ver la caja, el lote y el vencimiento." },
  { start: 21.02, end: 22.18, text: "Número tres:" },
  { start: 23.8, end: 27.84, text: "algo que te cambie la cara. Te tenés que ver vos, pero en una mejor versión." },
  { start: 28.19, end: 31.06, text: "¿Te pasó alguna de estas? Contame en los comentarios." },
];

// KEEP: 10 tramos, 26.59s (original 31.09s) · perfil de voz "media" (tools/finalizar.py)
const KEEP: [number, number][] = [
  [0.000, 1.400],
  [1.500, 2.467],
  [4.333, 6.200],
  [6.367, 7.633],
  [7.867, 10.633],
  [10.733, 13.100],
  [13.367, 15.067],
  [15.333, 22.333],
  [23.700, 27.967],
  [28.100, 31.088],
];

export const consul3: ReelConfig = {
  id: "Consul3",
  title: "consul-03-tratamientos-que-nunca-haria",
  dir: "consul-3",
  style: "noche",
  face: { x: 0.49, y: 0.44 },
  handle: HANDLE.consul,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["nunca", "evaluar", "distinto", "caja", "lote", "vencimiento", "versión"],
  hook: { eyebrow: "Lo que nunca haría", parts: ["Tratamientos que ", { em: "nunca" }, " le daría a un paciente"], to: { word: "paciente", offset: 0.6 } },
  callouts: [
    { kind: "number", at: { word: "Número", after: 6 }, to: { word: "Porque", offset: -0.1 }, value: "1", label: "Aplicar sin evaluar" },
    { kind: "big", at: { word: "cada" }, parts: ["Cada rostro es ", { em: "distinto" }] },
    { kind: "number", at: { word: "Número", after: 13 }, to: { word: "Tenés", after: 15, offset: -0.1 }, value: "2", label: "Un producto que no te muestro" },
    {
      kind: "list",
      at: { word: "Tenés", after: 15 },
      title: ["Tenés derecho a ", { em: "ver" }],
      items: [
        { text: "La caja", at: { word: "caja" } },
        { text: "El lote", at: { word: "lote" } },
        { text: "El vencimiento", at: { word: "vencimiento" } },
      ],
    },
    { kind: "number", at: { word: "Número", after: 20 }, to: { word: "Te", after: 25, offset: -0.1 }, value: "3", label: "Algo que te cambie la cara" },
    { kind: "big", at: { word: "Te", after: 25 }, parts: ["Vos, en tu ", { em: "mejor versión" }] },
  ],
  cta: { at: { word: "¿Te", after: 27 }, kicker: "¿Te pasó alguna de estas?", button: "CONTAME EN COMENTARIOS" },
  end: { parts: ["Evaluar, mostrar y ", { em: "respetar tu cara" }, "."] },
  music: { preset: "suave", seed: 3 },
};
