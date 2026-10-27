import { Segment } from "../../lib/timeline";
import { HANDLE, PERFIL } from "../handles";
import { ReelConfig } from "../engine/types";

// Cónsul / Video 6 — "¿Se te cayó la ceja o el párpado?" (clips 1–7).
const RAW_SEGMENTS: Segment[] = [
  { start: 0.17, end: 4.06, text: "¿Te pusieron bótox y se te cayó la ceja o el párpado?" },
  { start: 4.15, end: 8.78, text: "Eso pasa cuando la toxina se aplica de más o en el lugar equivocado." },
  { start: 8.89, end: 11.44, text: "La buena noticia es que es temporal." },
  { start: 11.55, end: 14.96, text: "A medida que el efecto baja, eso vuelve a la normalidad." },
  { start: 15.13, end: 20.11, text: "Y mientras tanto hay tratamientos que lo mejoran, siempre indicados por un médico." },
  { start: 20.24, end: 24.02, text: "Se previene con la evaluación, el estudio y la dosis justa." },
  { start: 24.57, end: 28.59, text: "Si te pasó, escribime. Trabajo con complicaciones todos los días." },
];

// KEEP: 8 tramos, 25.73s · pausas internas recortadas (tools/pausas.py) · perfil de voz "media"
const KEEP: [number, number][] = [
  [0.133, 3.867],
  [4.133, 8.667],
  [8.833, 11.100],
  [11.500, 14.767],
  [14.967, 18.733],
  [18.833, 19.733],
  [20.233, 24.000],
  [24.533, 28.033],
];

export const consul6: ReelConfig = {
  id: "Consul6",
  title: "consul-06-se-te-cayo-la-ceja",
  dir: "consul-6",
  style: "editorial",
  face: { x: 0.52, y: 0.4 },
  handle: HANDLE.consul,
  profile: PERFIL.consul,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["ceja", "párpado", "temporal", "normalidad", "médico", "evaluación", "dosis", "complicaciones"],
  hook: { eyebrow: "Después del bótox", parts: ["¿Se te cayó la ceja o ", { em: "el párpado" }, "?"] },
  callouts: [
    { kind: "card", at: { word: "toxina" }, eyebrow: "Por qué pasa", parts: ["Toxina ", { em: "de más" }, " o en el lugar equivocado"] },
    { kind: "stamp", at: { word: "temporal" }, text: "Es temporal", icon: "check" },
    { kind: "quote", at: { word: "medida" }, parts: ["Vuelve a la ", { em: "normalidad" }] },
    { kind: "lower", at: { word: "tratamientos" }, eyebrow: "Mientras tanto", parts: ["Tratamientos ", { em: "que lo mejoran" }], sub: "Siempre indicados por un médico" },
    {
      kind: "list",
      at: { word: "previene" },
      title: ["Se ", { em: "previene" }, " con"],
      items: [
        { text: "La evaluación", at: { word: "evaluación" } },
        { text: "El estudio", at: { word: "estudio" } },
        { text: "La dosis justa", at: { word: "dosis" } },
      ],
    },
  ],
  cta: { at: { word: "Si", after: 24 }, kicker: "¿Te pasó?", button: "ESCRIBIME", sub: "Trabajo con complicaciones todos los días" },
  end: { parts: ["Evaluación, estudio y ", { em: "dosis justa" }, "."] },
  music: { preset: "tension", seed: 6 },
};
