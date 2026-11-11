import { Segment } from "../../lib/timeline";
import { HANDLE, PERFIL } from "../handles";
import { ReelConfig } from "../engine/types";

// Cónsul / Video 5 (nueva edición) — "¿Tenés miedo a quedar congelada?" (clips 1–4).
// Colores de marca (DESIGN.md): negro cálido, dorado en itálica, teal de acción, crema.
const RAW_SEGMENTS: Segment[] = [
  { start: 0.2, end: 2.36, text: "¿Tenés miedo a quedar congelada?" },
  { start: 2.63, end: 3.35, text: "Mirá esto." },
  { start: 3.87, end: 5.96, text: "La paciente tratada sonríe," },
  { start: 6.34, end: 9.07, text: "eleva las cejas y frunce el entrecejo." },
  { start: 9.84, end: 13.7, text: "Suavizamos las líneas, pero tus gestos siguen siendo tuyos." },
  { start: 14.03, end: 17.48, text: "Si querés sentirte fresca y descansada, escribime." },
];

// KEEP: 6 tramos, 15.20s · pausas internas recortadas (tools/pausas.py) · perfil de voz "media"
const KEEP: [number, number][] = [
  [0.167, 2.467],
  [2.600, 3.500],
  [3.833, 6.000],
  [6.267, 9.100],
  [9.800, 13.500],
  [14.000, 17.300],
];

export const consul5b: ReelConfig = {
  id: "Consul5b",
  title: "consul-05-miedo-a-quedar-congelada-v2",
  dir: "consul-5b",
  style: "editorial",
  lookOverride: {
    accent: "#D4AF37",
    accent2: "#4A93A8",
    cardBg: "#1B1815",
    cardInk: "#FFFFFF",
    marker: "#F2D04B",
    captions: "marker",
    captionsY: 1450,
    zoom: "punch",
    zoomAmount: 0.12,
    cut: "whip",
    motionBlur: true,
    leak: false,
    particles: "sparkle",
    grade: "contrast(1.05) saturate(1.03) brightness(1.01)",
    vignette: 0.18,
    sfx: { enter: "whoosh", item: "pop", big: "impacto", stamp: "pop-alto", cta: "ding", riser: "riser", end: "sting", note: "click" },
  },
  face: { x: 0.5, y: 0.32 },
  zones: { hook: 1100, top: 1130 },
  handle: HANDLE.consul,
  profile: PERFIL.consul,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["congelada?", "sonríe,", "cejas", "entrecejo.", "líneas,", "gestos", "tuyos.", "fresca", "descansada,"],
  hook: { eyebrow: "Tratamiento natural", parts: ["¿Miedo a quedar ", { em: "congelada" }, "?"], to: { word: "Mirá", offset: 0.5 } },
  callouts: [
    { kind: "lower", at: { word: "paciente" }, to: { word: "entrecejo.", offset: 0.4 }, eyebrow: "Paciente tratada", parts: ["Gestos ", { em: "en movimiento" }] },
    { kind: "stamp", at: { word: "sonríe" }, text: "Sonríe", icon: "check" },
    { kind: "stamp", at: { word: "eleva" }, text: "Eleva las cejas", icon: "check" },
    { kind: "stamp", at: { word: "frunce" }, text: "Frunce el entrecejo", icon: "check" },
    { kind: "card", at: { word: "Suavizamos" }, eyebrow: "El resultado", parts: ["Líneas ", { em: "más suaves" }] },
    { kind: "big", at: { word: "tus", after: 9 }, parts: ["Tus gestos siguen ", { em: "siendo tuyos" }] },
  ],
  cta: { at: { word: "Si", after: 13 }, kicker: "Fresca y descansada", button: "ESCRIBIME" },
  end: { parts: ["Natural es ", { em: "seguir siendo vos" }, "."] },
  music: { preset: "luminoso", seed: 55 },
};
