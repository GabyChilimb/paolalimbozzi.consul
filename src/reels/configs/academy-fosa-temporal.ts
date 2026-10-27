import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Academy / Octubre — "Fosa temporal". Toma de casi 4 min con repeticiones y
// charla de edición; se arma con las partes limpias. Se omite "cambios
// musculares" (no hay toma completa) y "en el temporal convivimos con…" (cortada).
const RAW_SEGMENTS: Segment[] = [
  { start: 13.16, end: 20.76, text: "¿Sabías que muchas veces lo que hace que un rostro se vea cansado no está ni en la ojera ni en el pómulo, sino acá?" },
  { start: 27.9, end: 32.44, text: "La región temporal es una de las zonas que más cambia durante el envejecimiento" },
  { start: 39.46, end: 44.44, text: "y, al mismo tiempo, una de las que más se subestima en la planificación facial." },
  { start: 53.88, end: 58.72, text: "Con los años podemos tener pérdida de grasa superficial y profunda" },
  { start: 64.94, end: 66.48, text: "y remodelación ósea." },
  { start: 91.08, end: 96.4, text: "Y el resultado: una sien más hundida, mayor marcación del reborde orbitario" },
  { start: 100.07, end: 106.23, text: "y una transición menos armónica entre la frente, el pómulo y la fosa temporal." },
  { start: 108.68, end: 114.1, text: "Atención: tratar una fosa temporal no significa simplemente reponer volumen." },
  { start: 148.91, end: 155.92, text: "Primero evalúo cuánto volumen se perdió, dónde, el espesor de ese tejido y, fundamentalmente, la anatomía vascular." },
  { start: 171.02, end: 176.37, text: "Cuando está bien indicada y bien planificada, una mínima corrección genera mucho cambio." },
  { start: 197.9, end: 206.01, text: "Suaviza la región frontotemporal, mejora el tercio medio y a veces también el tercio inferior, generando un efecto lifting." },
  { start: 210.6, end: 212.95, text: "Armonizar no es rellenar:" },
  { start: 216.01, end: 220.76, text: "es entender qué estructura cambió y devolver lo que el rostro perdió," },
  { start: 222.73, end: 225.2, text: "pero siempre respetando su anatomía." },
];

// KEEP: 24 tramos, 65.20s · pausas internas recortadas (tools/pausas.py) · perfil de voz "media"
const KEEP: [number, number][] = [
  [13.200, 19.200],
  [19.533, 20.033],
  [27.867, 32.433],
  [39.400, 44.100],
  [53.833, 54.833],
  [54.933, 58.533],
  [58.767, 58.867],
  [64.933, 66.400],
  [91.067, 93.400],
  [93.533, 96.467],
  [100.033, 103.333],
  [103.500, 104.600],
  [104.967, 105.867],
  [108.700, 108.833],
  [109.133, 109.633],
  [110.033, 114.067],
  [148.867, 151.167],
  [151.300, 153.700],
  [153.833, 155.967],
  [171.000, 175.867],
  [197.933, 205.967],
  [210.567, 212.367],
  [216.000, 220.200],
  [222.700, 225.000],
];

export const academyFosaTemporal: ReelConfig = {
  id: "AcademyFosaTemporal",
  title: "academy-08-fosa-temporal",
  dir: "academy-fosa-temporal",
  style: "academia",
  lookOverride: { accent: "#B99A48", accent2: "#4A93A8" },
  face: { x: 0.52, y: 0.35 },
  handle: HANDLE.academy,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["cansado", "temporal", "envejecimiento", "subestima", "grasa", "ósea", "sien", "orbitario", "volumen", "vascular", "lifting", "rellenar", "anatomía"],
  hook: { eyebrow: "Fosa temporal", parts: ["Lo que hace ver un rostro ", { em: "cansado" }], to: { word: "acá?", offset: -0.3 } },
  callouts: [
    { kind: "target", at: { word: "acá?" }, to: { word: "acá?", offset: 1.6 }, x: 455, y: 600, label: "Fosa temporal" },
    { kind: "card", at: { word: "región", after: 27 }, eyebrow: "La región temporal", parts: ["De las que ", { em: "más cambia" }, " con la edad"] },
    { kind: "stamp", at: { word: "subestima" }, text: "Subestimada", icon: "alert" },
    {
      kind: "list",
      at: { word: "años" },
      to: { word: "ósea.", offset: 0.5 },
      title: ["Con los ", { em: "años" }],
      items: [
        { text: "Pérdida de grasa superficial y profunda", at: { word: "grasa" } },
        { text: "Remodelación ósea", at: { word: "remodelación" } },
      ],
    },
    {
      kind: "list",
      at: { word: "resultado" },
      to: { word: "temporal.", after: 100, offset: 0.5 },
      title: ["El ", { em: "resultado" }],
      items: [
        { text: "Sien más hundida", at: { word: "sien" } },
        { text: "Reborde orbitario marcado", at: { word: "reborde" } },
        { text: "Transición menos armónica", at: { word: "transición" } },
      ],
    },
    { kind: "big", at: { word: "Atención" }, to: { word: "volumen.", after: 108, offset: 0.4 }, parts: ["No es solo ", { em: "reponer volumen" }] },
    {
      kind: "list",
      at: { word: "Primero", after: 148 },
      to: { word: "vascular.", offset: 0.5 },
      title: ["Primero ", { em: "evalúo" }],
      items: [
        { text: "Cuánto volumen se perdió", at: { word: "cuánto" } },
        { text: "Dónde", at: { word: "dónde" } },
        { text: "Espesor del tejido", at: { word: "espesor" } },
        { text: "Anatomía vascular", at: { word: "anatomía", after: 148 } },
      ],
    },
    { kind: "card", at: { word: "mínima" }, eyebrow: "Bien indicada y planificada", parts: ["Una ", { em: "mínima corrección" }, ", mucho cambio"] },
    {
      kind: "list",
      at: { word: "Suaviza" },
      to: { word: "lifting.", offset: 0.5 },
      title: ["Efecto ", { em: "lifting" }],
      items: [
        { text: "Región frontotemporal", at: { word: "frontotemporal" } },
        { text: "Tercio medio", at: { word: "medio" } },
        { text: "Tercio inferior", at: { word: "inferior" } },
      ],
    },
    { kind: "big", at: { word: "Armonizar" }, parts: ["Armonizar ", { em: "no es rellenar" }] },
    { kind: "quote", at: { word: "entender", after: 215 }, to: { word: "anatomía.", after: 222, offset: 0.4 }, parts: ["Devolver lo que ", { em: "el rostro perdió" }] },
  ],
  end: { parts: ["Armonizar ", { em: "no es rellenar" }, "."], sub: "Paola Limbozzi Academy" },
  music: { preset: "suave", seed: 28 },
};
