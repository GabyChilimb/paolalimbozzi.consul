import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Academy — Congreso BAM (Brazilian Aesthetics Meeting), São Paulo, segundo día.
// La fuente ya está acelerada a 1,05× y mejorada (tiempos en segundos del video acelerado).
// Habla sin pausas: los tramos se separan por frase para ubicar los títulos.
const RAW_SEGMENTS: Segment[] = [
  { start: 0.78, end: 5.6, text: "Segundo día del Congreso BAM, aquí del grupo Eterna Education." },
  { start: 5.6, end: 13.63, text: "Hoy pudimos ver muchas clases, muchas presentaciones de hilos lisos, hilos espiculados, tecnología." },
  { start: 13.8, end: 19.6, text: "Mucha medicina estética de vanguardia desde Corea, rutinas de skincare con todo lo último." },
  { start: 19.6, end: 27.39, text: "Así que seguimos disfrutando de este día maravilloso, es el último día, y por supuesto que llevo toda esta información" },
  { start: 27.47, end: 31.65, text: "para Argentina, para el consultorio, para ustedes." },
];

// KEEP: 1 tramos, 31.00s (original 31.66s) · perfil de voz "media" (tools/finalizar.py)
const KEEP: [number, number][] = [
  [0.667, 31.662],
];

export const academyCongresoDia2: ReelConfig = {
  id: "AcademyCongresoDia2",
  title: "academy-11-congreso-bam-dia-2",
  dir: "academy-congreso-dia2",
  style: "editorial",
  // Misma línea que el video anterior del congreso (colores de marca de la Academy).
  lookOverride: {
    accent: "#B99A48",
    accent2: "#4A93A8",
    cardBg: "#FBF9F5",
    cardInk: "#1B1815",
    captions: "box",
    captionsY: 1450,
    zoom: "push",
    zoomAmount: 0.1,
    cut: "whip",
    motionBlur: true,
    leak: true,
    particles: "sparkle",
    grade: "contrast(1.05) saturate(1.06) brightness(1.03)",
    vignette: 0.2,
    sfx: { enter: "whoosh", item: "pop", big: "impacto", stamp: "brillo", cta: "ding", riser: "riser", end: "sting", note: "click" },
  },
  face: { x: 0.36, y: 0.33 },
  zones: { hook: 980, top: 960 },
  handle: HANDLE.academy,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["BAM,", "clases,", "presentaciones", "hilos", "espiculados,", "tecnología.", "vanguardia", "Corea,", "skincare", "maravilloso,", "información", "Argentina,", "consultorio,", "ustedes."],
  hook: { eyebrow: "Día 2 · São Paulo", parts: ["Congreso ", { em: "BAM" }], to: { word: "Education.", offset: 0.2 } },
  stickers: [
    { kind: "bandera-brasil", at: 2.3, pos: { x: 780, y: 330 } },
    { kind: "bandera-corea", at: 17.1, pos: { x: 790, y: 560 } },
    { kind: "bandera-argentina", at: 27.5, pos: { x: 780, y: 330 } },
  ],
  callouts: [
    { kind: "lower", at: { word: "Hoy" }, eyebrow: "Brazilian Aesthetics Meeting", parts: ["Clases y ", { em: "presentaciones" }] },
    {
      kind: "list",
      at: { word: "hilos" },
      title: ["Lo que ", { em: "vimos" }],
      items: [
        { text: "Hilos lisos", at: { word: "hilos" } },
        { text: "Hilos espiculados", at: { word: "espiculados" } },
        { text: "Tecnología", at: { word: "tecnología" } },
      ],
    },
    { kind: "card", at: { word: "vanguardia" }, eyebrow: "Desde Corea", parts: ["Medicina estética ", { em: "de vanguardia" }] },
    { kind: "stamp", at: { word: "skincare" }, text: "Skincare coreano", icon: "star" },
    { kind: "card", at: { word: "maravilloso" }, eyebrow: "Último día", parts: ["Un día ", { em: "maravilloso" }] },
    { kind: "big", at: { word: "llevo" }, parts: ["Toda esta información ", { em: "para ustedes" }] },
    {
      kind: "list",
      at: { word: "Argentina" },
      title: [{ em: "Para" }],
      items: [
        { text: "Argentina", at: { word: "Argentina" } },
        { text: "El consultorio", at: { word: "consultorio" } },
        { text: "Ustedes", at: { word: "ustedes" } },
      ],
    },
  ],
  end: { parts: ["Lo último ", { em: "para tu consultorio" }, "."], sub: "Brazilian Aesthetics Meeting · São Paulo" },
  music: { preset: "luminoso", seed: 62 },
};
