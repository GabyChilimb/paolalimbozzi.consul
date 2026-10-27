import { Segment } from "../../lib/timeline";
import { HANDLE, PERFIL } from "../handles";
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

// KEEP: 13 tramos, 19.10s · pausas internas recortadas (tools/pausas.py) · perfil de voz "media"
const KEEP: [number, number][] = [
  [0.067, 1.467],
  [1.733, 3.167],
  [3.700, 5.200],
  [5.433, 7.467],
  [7.833, 7.967],
  [8.267, 13.000],
  [15.633, 16.067],
  [16.200, 17.333],
  [17.500, 17.600],
  [18.167, 20.067],
  [20.167, 21.567],
  [21.733, 22.567],
  [23.133, 25.200],
];

export const consul1: ReelConfig = {
  id: "Consul1",
  title: "consul-01-no-todas-necesitan-botox",
  dir: "consul-1",
  style: "pop",
  face: { x: 0.49, y: 0.46 },
  handle: HANDLE.consul,
  profile: PERFIL.consul,
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
