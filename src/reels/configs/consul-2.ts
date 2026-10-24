import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Cónsul / Video 2 — "La medida justa" (clips 1–5).
const RAW_SEGMENTS: Segment[] = [
  { start: 0.23, end: 3.22, text: "Te voy a decir algo que pocas médicas te dicen:" },
  { start: 3.76, end: 6.11, text: "más producto no es mejor resultado." },
  { start: 6.62, end: 11.09, text: "Lo que hace que te veas linda es la medida justa y en el lugar justo." },
  { start: 11.25, end: 13.86, text: "Lo demás se nota, y no para bien." },
  { start: 15.2, end: 19.31, text: "Si querés un resultado armónico y que se note natural, escribime." },
];

// KEEP: 4 tramos, 17.67s (original 19.88s) · perfil de voz "media" (tools/finalizar.py)
const KEEP: [number, number][] = [
  [0.133, 3.367],
  [3.667, 6.267],
  [6.533, 14.000],
  [15.100, 19.467],
];

export const consul2: ReelConfig = {
  id: "Consul2",
  title: "consul-02-la-medida-justa",
  dir: "consul-2",
  style: "clinica",
  face: { x: 0.47, y: 0.4 },
  handle: HANDLE.consul,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["producto", "resultado", "justa", "justo", "natural", "armónico"],
  hook: { eyebrow: "Dra. Paola Limbozzi", parts: ["Lo que ", { em: "pocas médicas" }, " te dicen"] },
  callouts: [
    { kind: "big", at: { word: "más", after: 3 }, parts: ["Más producto ", { em: "≠" }, " mejor resultado"] },
    { kind: "card", at: { word: "medida" }, eyebrow: "La clave", parts: ["La medida ", { em: "justa" }] },
    { kind: "target", at: { word: "lugar" }, x: 590, y: 855, label: "Lugar justo" },
    { kind: "stamp", at: { word: "nota" }, text: "Se nota", icon: "cross" },
  ],
  cta: { at: { word: "Si", after: 14 }, kicker: "Resultado armónico y natural", button: "ESCRIBIME" },
  end: { parts: ["La medida ", { em: "justa" }, ", en el lugar ", { em: "justo" }, "."] },
  music: { preset: "luminoso", seed: 2 },
};
