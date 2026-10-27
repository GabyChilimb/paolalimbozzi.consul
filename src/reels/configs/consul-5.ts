import { Segment } from "../../lib/timeline";
import { HANDLE, PERFIL } from "../handles";
import { ReelConfig } from "../engine/types";

// Cónsul / Video 5 — "¿Tenés miedo a quedar congelada?" (clips 1–4).
const RAW_SEGMENTS: Segment[] = [
  { start: 0.2, end: 2.36, text: "¿Tenés miedo a quedar congelada?" },
  { start: 2.63, end: 3.35, text: "Mirá esto." },
  { start: 3.87, end: 5.96, text: "La paciente tratada sonríe," },
  { start: 6.33, end: 9.06, text: "eleva las cejas y frunce el entrecejo." },
  { start: 9.83, end: 13.69, text: "Suavizamos las líneas, pero tus gestos siguen siendo tuyos." },
  { start: 14.01, end: 17.46, text: "Si querés sentirte fresca y descansada, escribime." },
];

// KEEP: 11 tramos, 13.40s · pausas internas recortadas (tools/pausas.py) · perfil de voz "media"
const KEEP: [number, number][] = [
  [0.167, 2.333],
  [2.600, 3.367],
  [3.867, 5.033],
  [5.167, 5.900],
  [6.300, 7.367],
  [7.567, 8.733],
  [9.867, 12.133],
  [12.300, 13.400],
  [14.033, 15.033],
  [15.167, 16.467],
  [16.533, 17.200],
];

export const consul5: ReelConfig = {
  id: "Consul5",
  title: "consul-05-miedo-a-quedar-congelada",
  dir: "consul-5",
  style: "calido",
  face: { x: 0.43, y: 0.46 },
  handle: HANDLE.consul,
  profile: PERFIL.consul,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["congelada", "sonríe", "cejas", "entrecejo", "gestos", "tuyos", "fresca", "descansada"],
  hook: { eyebrow: "Mirá esto", parts: ["¿Miedo a quedar ", { em: "congelada" }, "?"], to: { word: "Mirá", offset: 0.6 } },
  callouts: [
    {
      kind: "list",
      at: { word: "paciente" },
      title: ["Con tratamiento, ", { em: "igual" }],
      items: [
        { text: "Sonríe", at: { word: "sonríe" } },
        { text: "Eleva las cejas", at: { word: "eleva" } },
        { text: "Frunce el entrecejo", at: { word: "frunce" } },
      ],
    },
    { kind: "card", at: { word: "Suavizamos" }, eyebrow: "El resultado", parts: ["Líneas ", { em: "más suaves" }] },
    { kind: "big", at: { word: "tus", after: 9 }, parts: ["Tus gestos siguen ", { em: "siendo tuyos" }] },
  ],
  cta: { at: { word: "Si", after: 13 }, kicker: "Fresca y descansada", button: "ESCRIBIME" },
  end: { parts: ["Natural es ", { em: "seguir siendo vos" }, "."] },
  music: { preset: "suave", seed: 5 },
};
