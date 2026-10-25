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

// KEEP: 14 tramos, 73.80s (original 232.62s) · perfil de voz "media" (tools/finalizar.py)
const KEEP: [number, number][] = [
  [13.067, 20.900],
  [27.800, 32.567],
  [39.367, 44.567],
  [53.767, 58.867],
  [64.833, 66.633],
  [90.967, 96.533],
  [99.967, 106.367],
  [108.567, 114.233],
  [148.800, 156.067],
  [170.933, 176.500],
  [197.800, 206.133],
  [210.500, 213.100],
  [215.900, 220.900],
  [222.633, 225.333],
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
