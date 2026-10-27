import { Segment } from "../../lib/timeline";
import { HANDLE, PERFIL } from "../handles";
import { ReelConfig } from "../engine/types";

// Cónsul / Video 7 — "Nadie se va a dar cuenta" (clips 1–5).
// El final del clip 2 ("lo que se nota es…") es una toma cortada que se repite
// completa en el clip 3, así que se omite (6.0–7.8 s).
const RAW_SEGMENTS: Segment[] = [
  { start: 0.52, end: 3.71, text: "Nadie se va a dar cuenta. Y esa es la idea." },
  { start: 3.77, end: 5.86, text: "Un buen tratamiento no se nota." },
  { start: 8.07, end: 13.44, text: "Lo que se nota es que estás descansada. Por eso respeto tus proporciones," },
  { start: 13.69, end: 16.56, text: "uso la dosis justa y prefiero ir de a poco." },
  { start: 16.67, end: 19.52, text: "Si te dicen que se te ve bien, salió bien." },
];

// KEEP: 9 tramos, 14.53s · pausas internas recortadas (tools/pausas.py) · perfil de voz "media"
const KEEP: [number, number][] = [
  [0.467, 1.733],
  [1.967, 3.267],
  [3.700, 5.967],
  [8.033, 10.400],
  [10.633, 12.933],
  [13.633, 16.033],
  [16.633, 18.467],
  [18.600, 18.800],
  [18.900, 19.500],
];

export const consul7: ReelConfig = {
  id: "Consul7",
  title: "consul-07-nadie-se-va-a-dar-cuenta",
  dir: "consul-7",
  style: "pop",
  lookOverride: { accent: "#5BC0EB", marker: "#5BC0EB" },
  face: { x: 0.47, y: 0.4 },
  handle: HANDLE.consul,
  profile: PERFIL.consul,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["nadie", "idea", "nota", "descansada", "proporciones", "dosis", "poco", "bien"],
  hook: { eyebrow: "Y esa es la idea", parts: ["Nadie se va a ", { em: "dar cuenta" }], to: { word: "idea", offset: 0.4 } },
  callouts: [
    { kind: "big", at: { word: "Un", after: 3.5 }, parts: ["Un buen tratamiento ", { em: "no se nota" }] },
    { kind: "card", at: { word: "descansada", offset: -0.6 }, eyebrow: "Lo que sí se nota", parts: ["Que estás ", { em: "descansada" }] },
    {
      kind: "list",
      at: { word: "respeto" },
      title: ["Cómo ", { em: "trabajo" }],
      items: [
        { text: "Respeto tus proporciones", at: { word: "proporciones" } },
        { text: "Dosis justa", at: { word: "dosis" } },
        { text: "De a poco", at: { word: "poco" } },
      ],
    },
    { kind: "big", at: { word: "salió" }, to: { word: "bien.", after: 18, offset: 0.8 }, parts: [{ em: "Salió bien" }] },
  ],
  end: { parts: ["Que te vean ", { em: "descansada" }, ", no tratada."] },
  music: { preset: "luminoso", seed: 7 },
};
