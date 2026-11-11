import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Universidad Kennedy — Diplomatura en Medicina Estética y Regenerativa.
// En 22.08–23.26 dice "marketing y finanzas" de más (lo repite bien después): se corta.
const RAW_SEGMENTS: Segment[] = [
  { start: 0.15, end: 3.94, text: "¿Querés especializarte en medicina estética y formarte de manera integral?" },
  { start: 4.92, end: 10.54, text: "En nuestra diplomatura académica en Medicina Estética y Regenerativa de la Universidad Kennedy," },
  { start: 10.79, end: 18.98, text: "durante 9 meses vas a aprender anatomía aplicada, abordaje integral de la piel, peeling, mesoterapia, armonización facial," },
  { start: 19.0, end: 19.61, text: "hilos," },
  { start: 19.84, end: 21.86, text: "procedimientos mínimamente invasivos" },
  { start: 23.62, end: 25.56, text: "y manejo de complicaciones." },
  { start: 25.83, end: 28.18, text: "También trabajamos con herramientas fundamentales" },
  { start: 28.18, end: 30.07, text: "para que tu consultorio crezca," },
  { start: 30.34, end: 32.08, text: "como ser marketing y finanzas." },
  { start: 32.69, end: 34.27, text: "Soy la doctora Paola Limbozzi," },
  { start: 34.52, end: 37.5, text: "directora académica de la Diplomatura de Medicina Estética." },
  { start: 37.77, end: 40.29, text: "Nuestro objetivo no es enseñarte técnicas aisladas." },
  { start: 40.6, end: 44.71, text: "Queremos que aprendas a diagnosticar, a planificar y prevenir complicaciones" },
  { start: 45.28, end: 49.2, text: "y, fundamentalmente, tomar decisiones con verdadero criterio médico." },
  { start: 49.46, end: 52.36, text: "Las inscripciones 2027 ya están abiertas." },
  { start: 52.67, end: 53.64, text: "Sumate a la Kennedy." },
];

// KEEP: 13 tramos, 48.70s · pausas internas recortadas (tools/pausas.py) · perfil de voz "media"
const KEEP: [number, number][] = [
  [0.100, 4.000],
  [4.867, 18.900],
  [19.067, 19.667],
  [19.800, 21.967],
  [23.567, 25.367],
  [25.767, 30.133],
  [30.300, 32.167],
  [32.667, 37.567],
  [37.733, 40.367],
  [40.533, 44.800],
  [45.233, 49.267],
  [49.400, 52.467],
  [52.633, 53.700],
];

export const diploMedicina: ReelConfig = {
  id: "DiploMedicina",
  title: "kennedy-01-diplomatura-medicina-estetica",
  dir: "diplo-medicina",
  style: "kennedy",
  face: { x: 0.53, y: 0.35 },
  zones: { hook: 860, top: 800 },
  handle: HANDLE.academy,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["medicina", "integral", "Kennedy", "anatomía", "piel", "peeling", "mesoterapia", "armonización", "hilos", "complicaciones", "consultorio", "marketing", "finanzas", "diagnosticar", "planificar", "criterio", "2027", "abiertas."],
  hook: { eyebrow: "Universidad Kennedy · 2027", parts: ["Diplomatura en ", { em: "Medicina Estética" }], to: { word: "integral?", offset: 0.3 } },
  callouts: [
    { kind: "card", at: { word: "diplomatura" }, eyebrow: "Universidad Kennedy", parts: ["Medicina Estética ", { em: "y Regenerativa" }] },
    { kind: "number", at: { word: "9" }, value: "9", label: "meses de formación" },
    {
      kind: "list",
      at: { word: "anatomía" },
      title: ["Vas a ", { em: "aprender" }],
      items: [
        { text: "Anatomía aplicada", at: { word: "anatomía" } },
        { text: "Abordaje integral de la piel", at: { word: "abordaje" } },
        { text: "Peeling", at: { word: "peeling" } },
      ],
    },
    {
      kind: "list",
      at: { word: "mesoterapia" },
      title: ["Y ", { em: "también" }],
      items: [
        { text: "Mesoterapia", at: { word: "mesoterapia" } },
        { text: "Armonización facial", at: { word: "armonización" } },
        { text: "Hilos", at: { word: "hilos" } },
        { text: "Mínimamente invasivos", at: { word: "procedimientos" } },
      ],
    },
    { kind: "stamp", at: { word: "complicaciones.", after: 23 }, text: "Manejo de complicaciones", icon: "check" },
    { kind: "card", at: { word: "herramientas" }, eyebrow: "Herramientas fundamentales", parts: ["Para que tu consultorio ", { em: "crezca" }] },
    { kind: "card", at: { word: "marketing", after: 30 }, eyebrow: "Gestión del consultorio", parts: [{ em: "Marketing" }, " y finanzas"] },
    { kind: "lower", at: { word: "Soy" }, eyebrow: "Directora Académica", parts: ["Dra. Paola ", { em: "Limbozzi" }], sub: "Diplomatura en Medicina Estética" },
    { kind: "big", at: { word: "Nuestro" }, parts: ["No enseñamos ", { em: "técnicas aisladas" }] },
    {
      kind: "list",
      at: { word: "Queremos" },
      title: ["Que aprendas a"],
      items: [
        { text: "Diagnosticar", at: { word: "diagnosticar" } },
        { text: "Planificar", at: { word: "planificar" } },
        { text: "Prevenir complicaciones", at: { word: "prevenir" } },
      ],
    },
    { kind: "big", at: { word: "criterio" }, parts: ["Verdadero ", { em: "criterio médico" }] },
  ],
  cta: { at: { word: "inscripciones" }, kicker: "Inscripciones 2027", button: "¡YA ESTÁN ABIERTAS!", sub: "Sumate a la Kennedy" },
  end: { parts: ["Sumate a ", { em: "la Kennedy" }, "."], sub: "Diplomatura en Medicina Estética y Regenerativa" },
  music: { preset: "luminoso", seed: 41 },
};
