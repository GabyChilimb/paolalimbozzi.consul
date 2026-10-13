import { makeTimeline, Segment } from "../lib/timeline";

// "Video 2" (carpeta de Drive "Cónsul/Video 2"): los clips 1–5 unidos en orden.
// start/end en segundos del video unido ORIGINAL (public/video2/fuente.mp4).
// Inicio de cada clip: 1 → 0.000 · 2 → 3.567 · 3 → 6.425 · 4 → 11.125 · 5 → 13.925
export const RAW_SEGMENTS: Segment[] = [
  { start: 0.23, end: 3.15, text: "Te voy a decir algo que pocas médicas te dicen:" },
  { start: 3.77, end: 6.11, text: "más producto no es mejor resultado." },
  { start: 6.63, end: 9.51, text: "Lo que hace que te veas linda es la medida justa" },
  { start: 9.7, end: 10.66, text: "y en el lugar justo." },
  { start: 11.27, end: 12.58, text: "Lo demás se nota," },
  { start: 12.84, end: 13.67, text: "y no para bien." },
  { start: 15.25, end: 17.1, text: "Si querés un resultado armónico" },
  { start: 17.19, end: 19.35, text: "y que se note natural, escribime." },
];

// Tramos que quedan después de cortar silencios.
// 5 tramos, 17.03s (original 19.88s). Generado por: python tools/voz.py <audio de fuente.mov> public/video2/voz.wav src/MedidaJusta/transcript.ts media
export const KEEP: [number, number][] = [
  [0.133, 3.300],
  [3.667, 6.267],
  [6.533, 10.800],
  [11.167, 13.800],
  [15.133, 19.500],
];

export const { T, VOICE_SECONDS, SEGMENTS, WORDS, PAGES, timeOf } = makeTimeline(RAW_SEGMENTS, KEEP);
