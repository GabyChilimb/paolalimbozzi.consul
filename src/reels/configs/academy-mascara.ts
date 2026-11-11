import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Academy — "Máscara": modelo anatómico vascular. Una sola toma (videocompleto) y
// la toma de apoyo "Máscara zoom" (120 fps, en cámara lenta al 50 %).
const RAW_SEGMENTS: Segment[] = [
  { start: 0.92, end: 7.24, text: "Esta es la razón exacta por la cual jamás deberías dejar que alguien sin título profesional" },
  { start: 7.5, end: 9.41, text: "te toque el rostro con una aguja." },
  { start: 10.09, end: 16.34, text: "Hay arterias en tu rostro del grosor de un hilo que conectan directo con tus ojos." },
  { start: 16.98, end: 19.43, text: "Te muestro dónde están en este modelo." },
  { start: 20.48, end: 23.97, text: "Muchas personas creen que inyectar es simplemente" },
  { start: 24.29, end: 25.96, text: "pinchar la piel y listo." },
  { start: 26.42, end: 30.0, text: "En este modelo anatómico podemos ver el trayecto" },
  { start: 30.0, end: 31.78, text: "de la arteria facial," },
  { start: 31.88, end: 34.2, text: "la arteria angular," },
  { start: 34.2, end: 36.18, text: "supratroclear, supraorbitaria." },
  { start: 37.99, end: 40.3, text: "Si alguien te aplica un producto" },
  { start: 40.51, end: 44.85, text: "y desconoce la profundidad exacta y de repente ocluye un vaso," },
  { start: 45.19, end: 50.84, text: "el tejido puede sufrir necrosis o complicaciones severas en minutos, como una ceguera." },
  { start: 51.25, end: 54.14, text: "La estética no es inyectar así nomás:" },
  { start: 54.58, end: 60.21, text: "es saber navegar a ciegas una autopista vascular milimétrica con base científica." },
  { start: 61.19, end: 63.3, text: "Tu rostro no es un lienzo de prueba." },
  { start: 63.62, end: 67.79, text: "Exigí siempre profesionales: médicos u odontólogos habilitados." },
];

// KEEP: 12 tramos, 60.80s · pausas internas recortadas (tools/pausas.py) · perfil de voz "media"
const KEEP: [number, number][] = [
  [0.867, 9.500],
  [10.267, 16.433],
  [16.933, 19.533],
  [20.433, 24.067],
  [24.233, 26.067],
  [26.767, 36.467],
  [37.933, 45.000],
  [45.133, 50.867],
  [51.567, 54.233],
  [54.533, 60.567],
  [61.133, 63.400],
  [63.567, 68.033],
];

export const academyMascara: ReelConfig = {
  id: "AcademyMascara",
  title: "academy-09-mascara-vascular",
  dir: "academy-mascara",
  style: "noche",
  lookOverride: {
    accent: "#E0414F",
    accent2: "#E8C27A",
    cut: "whip",
    motionBlur: true,
    zoom: "punch",
    zoomAmount: 0.07,
    particles: "none",
    grade: "contrast(1.1) saturate(1.02) brightness(0.98)",
    tint: { color: "#3A0710", blend: "soft-light", opacity: 0.25 },
    sfx: { enter: "whoosh", item: "latido", big: "impacto", stamp: "alerta", cta: "brillo", riser: "riser", end: "sting-oscuro", note: "click" },
  },
  face: { x: 0.56, y: 0.28 },
  handle: HANDLE.academy,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["título", "aguja", "arterias", "hilo", "ojos", "anatómico", "facial", "angular", "vaso", "necrosis", "ceguera", "científica", "lienzo", "habilitados"],
  hook: { eyebrow: "Antes de dejar que te inyecten", parts: ["Jamás dejes que alguien ", { em: "sin título" }, " te toque el rostro"], to: { word: "aguja.", offset: 0.3 } },
  broll: [
    { src: "reels/academy-mascara/broll.mp4", at: { word: "Hay" }, to: { word: "Te", after: 16, offset: -0.15 }, from: 0 },
    { src: "reels/academy-mascara/broll.mp4", at: { word: "navegar" }, to: { word: "científica.", offset: 0.4 }, from: 5.5 },
  ],
  callouts: [
    { kind: "card", at: { word: "grosor" }, eyebrow: "En tu rostro", parts: ["Arterias del grosor ", { em: "de un hilo" }] },
    { kind: "stamp", at: { word: "ojos." }, text: "Directo a los ojos", icon: "alert" },
    { kind: "lower", at: { word: "muestro" }, eyebrow: "Modelo anatómico", parts: ["Mapa ", { em: "vascular" }] },
    { kind: "versus", at: { word: "Muchas" }, to: { word: "trayecto", offset: -0.2 }, rightAt: { word: "En", after: 26 }, left: "Pinchar y listo", right: "Conocer la anatomía", good: "right" },
    {
      kind: "list",
      at: { word: "facial" , offset: -0.6 },
      to: { word: "supraorbitaria.", offset: 0.9 },
      title: ["Arterias ", { em: "de riesgo" }],
      items: [
        { text: "Facial", at: { word: "facial" } },
        { text: "Angular", at: { word: "angular" } },
        { text: "Supratroclear", at: { word: "supratroclear" } },
        { text: "Supraorbitaria", at: { word: "supraorbitaria" } },
      ],
    },
    { kind: "card", at: { word: "desconoce" }, eyebrow: "Si desconoce la profundidad", parts: ["Puede ", { em: "ocluir un vaso" }] },
    { kind: "big", at: { word: "necrosis" }, to: { word: "ceguera.", offset: 0.5 }, eyebrow: "En minutos", parts: [{ em: "Necrosis" }, " o ceguera"] },
    { kind: "quote", at: { word: "estética" }, parts: ["La estética ", { em: "no es inyectar así nomás" }] },
    { kind: "card", at: { word: "autopista" }, eyebrow: "Con base científica", parts: ["Una autopista vascular ", { em: "milimétrica" }] },
    { kind: "big", at: { word: "Tu", after: 61 }, parts: ["Tu rostro ", { em: "no es un lienzo de prueba" }] },
    {
      kind: "list",
      at: { word: "Exigí" },
      title: [{ em: "Exigí" }, " siempre"],
      items: [
        { text: "Médicos", at: { word: "médicos" } },
        { text: "Odontólogos", at: { word: "odontólogos" } },
        { text: "Habilitados", at: { word: "habilitados" } },
      ],
    },
  ],
  end: { parts: ["Tu rostro merece ", { em: "un profesional" }, "."], sub: "Paola Limbozzi Academy" },
  music: { preset: "tension", seed: 31 },
};
