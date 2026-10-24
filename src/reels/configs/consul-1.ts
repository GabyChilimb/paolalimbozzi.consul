import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Cónsul / Video 1 — "No todas necesitan bótox" (clips 1–6).
// Tiempos en segundos del video unido (public/reels/consul-1/fuente.mp4).
const RAW_SEGMENTS: Segment[] = [
  { start: 0.11, end: 3.19, text: "No todas necesitan bótox. Vos capaz que tampoco." },
  { start: 3.74, end: 7.92, text: "Muchas siguen pidiendo bótox para una arruga que capaz pide otra cosa." },
  { start: 8.3, end: 12.93, text: "Si la línea está marcada aunque no gesticules, quizás necesitás otro tratamiento" },
  { start: 15.71, end: 17.45, text: "o empezar a cuidar la piel." },
  { start: 18.2, end: 22.86, text: "Por eso, primero te evalúo. Y si no lo necesitás, también te lo digo." },
  { start: 23.18, end: 25.27, text: "Escribime y vemos cuál es tu caso." },
];

// KEEP: 5 tramos, 21.93s (original 26.02s) · perfil de voz "media" (tools/finalizar.py)
const KEEP: [number, number][] = [
  [0.000, 3.333],
  [3.633, 8.067],
  [8.200, 13.067],
  [15.600, 17.600],
  [18.100, 25.400],
];

export const consul1: ReelConfig = {
  id: "Consul1",
  title: "consul-01-no-todas-necesitan-botox",
  dir: "consul-1",
  style: "pop",
  face: { x: 0.49, y: 0.46 },
  handle: HANDLE.consul,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["bótox", "tratamiento", "piel", "evalúo", "digo"],
  hook: { eyebrow: "Dra. Paola Limbozzi", parts: ["No todas necesitan ", { em: "bótox" }] },
  callouts: [
    { kind: "card", at: { word: "pidiendo" }, eyebrow: "Lo que veo en consulta", parts: ["¿Bótox para ", { em: "todo" }, "?"] },
    { kind: "target", at: { word: "línea", after: 8 }, x: 530, y: 790, label: "Línea marcada" },
    { kind: "stamp", at: { word: "quizás" }, text: "Ojo", icon: "alert" },
    { kind: "big", at: { word: "empezar" }, parts: ["Empezar a ", { em: "cuidar la piel" }] },
    { kind: "big", at: { word: "primero" }, parts: [{ em: "Primero" }, " te evalúo"] },
    { kind: "stamp", at: { word: "también", after: 20 }, text: "Te lo digo", icon: "check" },
  ],
  cta: { at: { word: "Escribime" }, kicker: "¿Cuál es tu caso?", button: "ESCRIBIME" },
  end: { parts: ["Primero se ", { em: "evalúa" }, ". Después se indica."] },
  music: { preset: "pop", seed: 1 },
};
