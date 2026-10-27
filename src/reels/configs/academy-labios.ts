import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Academy / Octubre — "Labios". Paola repite casi cada frase; se usa la segunda
// toma (la limpia) y se omiten las indicaciones y tomas cortadas (11–25 s, etc.).
const RAW_SEGMENTS: Segment[] = [
  { start: 1.23, end: 6.42, text: "Cuando voy a armonizar unos labios, lo primero que miro no son los labios:" },
  { start: 7.18, end: 9.04, text: "evalúo el rostro completo." },
  { start: 26.41, end: 34.33, text: "Evalúo proporciones, simetrías y cómo se relacionan esos labios con el perfil, con la nariz y con el mentón." },
  { start: 38.25, end: 40.88, text: "Porque no todos los pacientes necesitan más volumen." },
  { start: 47.56, end: 53.17, text: "Algunos necesitan definición, hidratación, proyección o corregir una asimetría." },
  { start: 59.88, end: 64.5, text: "Y recién después decido qué producto usar, cuánto y con qué técnica." },
  { start: 68.36, end: 72.79, text: "No existe una técnica de labios que funcione igual para todos." },
  { start: 79.24, end: 83.76, text: "Un buen resultado no comienza con una jeringa: comienza con un buen diagnóstico." },
  { start: 85.32, end: 87.28, text: "Primero el rostro, después el labio." },
];

// KEEP: 16 tramos, 36.50s · pausas internas recortadas (tools/pausas.py) · perfil de voz "media"
const KEEP: [number, number][] = [
  [1.200, 3.500],
  [3.800, 5.000],
  [5.567, 6.433],
  [7.133, 8.900],
  [26.400, 27.833],
  [27.933, 31.133],
  [31.300, 32.300],
  [32.433, 34.133],
  [38.200, 40.933],
  [47.500, 53.100],
  [59.867, 62.433],
  [62.733, 64.467],
  [68.333, 72.533],
  [79.233, 83.733],
  [85.300, 86.233],
  [86.433, 87.200],
];

export const academyLabios: ReelConfig = {
  id: "AcademyLabios",
  title: "academy-02-labios",
  dir: "academy-labios",
  style: "academia",
  face: { x: 0.5, y: 0.35 },
  handle: HANDLE.academy,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["rostro", "proporciones", "simetrías", "volumen", "definición", "hidratación", "proyección", "asimetría", "técnica", "diagnóstico"],
  hook: { eyebrow: "Armonización de labios", parts: ["Lo primero que miro ", { em: "no son los labios" }], to: { word: "evalúo", offset: -0.1 } },
  callouts: [
    { kind: "card", at: { word: "evalúo" }, eyebrow: "Evalúo", parts: [{ em: "El rostro completo" }] },
    {
      kind: "list",
      at: { word: "Evalúo", after: 26 },
      title: [{ em: "Evalúo" }],
      items: [
        { text: "Proporciones", at: { word: "proporciones" } },
        { text: "Simetrías", at: { word: "simetrías" } },
        { text: "Relación con perfil, nariz y mentón", at: { word: "perfil" } },
      ],
    },
    { kind: "big", at: { word: "no", after: 38 }, parts: ["No todos necesitan ", { em: "más volumen" }] },
    {
      kind: "list",
      at: { word: "Algunos" },
      title: ["Algunos ", { em: "necesitan" }],
      items: [
        { text: "Definición", at: { word: "definición" } },
        { text: "Hidratación", at: { word: "hidratación" } },
        { text: "Proyección", at: { word: "proyección" } },
        { text: "Corregir una asimetría", at: { word: "corregir" } },
      ],
    },
    { kind: "card", at: { word: "recién" }, eyebrow: "Recién después", parts: ["Producto, ", { em: "cantidad" }, " y técnica"] },
    { kind: "quote", at: { word: "No", after: 68 }, parts: ["No existe una técnica de labios ", { em: "igual para todos" }] },
    { kind: "versus", at: { word: "jeringa", offset: -0.3 }, rightAt: { word: "diagnóstico" }, left: "Jeringa", right: "Diagnóstico" },
    { kind: "big", at: { word: "Primero", after: 85 }, to: 87.3, parts: ["Primero el rostro, ", { em: "después el labio" }] },
  ],
  end: { parts: ["Primero el rostro, ", { em: "después el labio" }, "."], sub: "Paola Limbozzi Academy" },
  music: { preset: "academy", seed: 22 },
};
