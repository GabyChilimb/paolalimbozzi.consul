import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { LOOKS } from "../engine/styles";
import { ReelConfig } from "../engine/types";

// Cónsul / "Miedo a arrugas" — toma única de 54 s con varias repeticiones.
// Se usan las tomas limpias: "algo que aparece…" (2.ª), "el regreso de las arrugas"
// (3.ª), "tranquilas, chicas…" (última), "pero si quieren tratarlas…" (2.ª) y el
// cierre con la calavera (2.ª). Se omiten comentarios fuera de cámara.
const RAW_SEGMENTS: Segment[] = [
  { start: 0.55, end: 2.6, text: "Hay algo que me da muchísimo miedo." },
  { start: 6.7, end: 9.75, text: "Algo que aparece lentamente, sin avisar." },
  { start: 14.85, end: 16.8, text: "El regreso de las arrugas." },
  { start: 16.85, end: 18.6, text: "" },
  { start: 38.55, end: 42.2, text: "Tranquilas, chicas: las arrugas no son una maldición." },
  { start: 45.2, end: 47.6, text: "Pero si quieren tratarlas, sabemos cómo." },
  { start: 51.5, end: 54.3, text: "Que el terror quede para Halloween." },
];

// KEEP: 6 tramos, 19.10s (original 54.40s) · perfil de voz "media" (tools/finalizar.py)
const KEEP: [number, number][] = [
  [0.467, 2.733],
  [6.600, 9.900],
  [14.733, 18.733],
  [38.433, 42.333],
  [45.100, 47.733],
  [51.400, 54.399],
];

export const miedoArrugas: ReelConfig = {
  id: "MiedoArrugas",
  title: "consul-10-miedo-a-las-arrugas",
  dir: "miedo-arrugas",
  style: "noche",
  lookOverride: {
    accent: "#FF5A3C",
    accent2: "#FFB347",
    particles: "embers",
    sfx: { ...LOOKS.noche.sfx, big: "trueno", stamp: "latido", end: "sting-oscuro" },
  },
  face: { x: 0.5, y: 0.38 },
  handle: HANDLE.consul,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["miedo", "lentamente", "avisar", "arrugas", "maldición", "tratarlas", "terror", "Halloween"],
  hook: { eyebrow: "Historias de terror", parts: ["Algo que me da ", { em: "muchísimo miedo" }] },
  callouts: [
    { kind: "card", at: { word: "Algo", after: 6 }, eyebrow: "Aparece lentamente", parts: ["Sin ", { em: "avisar" }] },
    { kind: "big", at: { word: "regreso" }, parts: ["El regreso de ", { em: "las arrugas" }] },
    { kind: "stamp", at: 16.9, to: 18.55, text: "¡Terror!", icon: "alert" },
    { kind: "card", at: { word: "Tranquilas" }, eyebrow: "Tranquilas, chicas", parts: ["Las arrugas ", { em: "no son una maldición" }] },
    { kind: "lower", at: { word: "Pero", after: 44 }, eyebrow: "Si querés tratarlas", parts: [{ em: "Sabemos cómo" }] },
    { kind: "big", at: { word: "terror", after: 50 }, to: 54.3, parts: ["Que el terror quede ", { em: "para Halloween" }] },
  ],
  end: { parts: ["Las arrugas ", { em: "se tratan" }, ", no se temen."], sub: "Escribime y vemos tu caso" },
  music: { preset: "tension", seed: 10 },
};
