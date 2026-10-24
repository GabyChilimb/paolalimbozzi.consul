import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Cónsul / Video 8 — "Basta de labios que se notan a una cuadra" (clips 1–6).
const RAW_SEGMENTS: Segment[] = [
  { start: 0.27, end: 2.96, text: "Basta de labios que se notan a una cuadra." },
  { start: 3.44, end: 5.64, text: "Mirá este antes y después." },
  { start: 5.75, end: 8.97, text: "El miedo número uno que escucho es quedar exagerada." },
  { start: 9.1, end: 13.45, text: "Primero trabajo con tu anatomía, tu forma; luego, la hidratación." },
  { start: 13.53, end: 17.2, text: "Y si después querés más volumen, lo evaluamos y se suma." },
  { start: 17.25, end: 20.03, text: "Contame qué te gustaría cambiar de tus labios." },
];

// KEEP: 2 tramos, 19.65s (original 20.05s) · perfil de voz "media" (tools/finalizar.py)
const KEEP: [number, number][] = [
  [0.167, 3.100],
  [3.333, 20.045],
];

export const consul8: ReelConfig = {
  id: "Consul8",
  title: "consul-08-labios-que-se-notan",
  dir: "consul-8",
  style: "clinica",
  lookOverride: { accent: "#C46A7A", accent2: "#E8B4BC" },
  face: { x: 0.47, y: 0.3 },
  zones: { hook: 110, top: 960 },
  handle: HANDLE.consul,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["labios", "cuadra", "exagerada", "anatomía", "forma", "hidratación", "volumen"],
  hook: { eyebrow: "Labios", parts: ["Basta de labios que se notan ", { em: "a una cuadra" }] },
  callouts: [
    { kind: "target", at: { word: "antes" }, x: 170, y: 1030, label: "Antes y después" },
    { kind: "stamp", at: { word: "exagerada", offset: -0.4 }, text: "¿Exagerada?", icon: "alert" },
    {
      kind: "list",
      at: { word: "Primero" },
      title: ["Mi ", { em: "orden" }],
      items: [
        { text: "Tu anatomía", at: { word: "anatomía" } },
        { text: "Tu forma", at: { word: "forma" } },
        { text: "Hidratación", at: { word: "hidratación" } },
        { text: "Volumen, si querés", at: { word: "volumen" } },
      ],
    },
  ],
  cta: { at: { word: "Contame" }, kicker: "¿Qué cambiarías de tus labios?", button: "CONTAME" },
  end: { parts: ["Labios ", { em: "tuyos" }, ", pero mejor."] },
  music: { preset: "pop", seed: 8 },
};
