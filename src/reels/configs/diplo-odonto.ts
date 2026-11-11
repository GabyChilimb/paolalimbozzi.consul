import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Universidad Kennedy — Diplomatura en Armonización Orofacial Integral (para odontólogos).
const RAW_SEGMENTS: Segment[] = [
  { start: 0.19, end: 4.97, text: "¿Sos odontólogo y querés formarte en la armonización facial con una mirada integral?" },
  { start: 5.48, end: 11.7, text: "En la diplomatura universitaria en la armonización orofacial de la Universidad Kennedy tenemos seis meses de trabajo." },
  { start: 12.07, end: 16.38, text: "Vamos a ver anatomía aplicada, diagnóstico y planificación facial," },
  { start: 16.88, end: 19.59, text: "siempre integrando las bases odontológicas" },
  { start: 19.92, end: 21.44, text: "con la armonización facial." },
  { start: 21.84, end: 23.97, text: "Vas a formarte en neuromodulación," },
  { start: 23.97, end: 25.99, text: "rellenos, bioestimuladores," },
  { start: 25.99, end: 28.0, text: "procedimientos mínimamente invasivos," },
  { start: 28.28, end: 29.45, text: "abordaje de labios," },
  { start: 29.68, end: 31.39, text: "tercio medio, tercio inferior," },
  { start: 31.39, end: 33.08, text: "manejo de complicaciones" },
  { start: 33.08, end: 35.07, text: "y planificación de tratamientos." },
  { start: 35.07, end: 38.38, text: "Porque armonizar no es aprender tratamientos aislados:" },
  { start: 38.38, end: 41.4, text: "es entender función, estructuras y proporciones," },
  { start: 41.95, end: 45.45, text: "y cómo cada intervención impacta en el rostro completo." },
  { start: 45.88, end: 49.54, text: "Soy la doctora Paola Limbozzi, directora académica de la diplomatura" },
  { start: 49.54, end: 51.45, text: "en armonización orofacial integral." },
  { start: 51.45, end: 54.61, text: "Las inscripciones 2027 ya están abiertas." },
  { start: 54.87, end: 57.36, text: "Te esperamos a formar parte de la Universidad Kennedy." },
];

// KEEP: 13 tramos, 54.20s · pausas internas recortadas (tools/pausas.py) · perfil de voz "media"
const KEEP: [number, number][] = [
  [0.167, 5.033],
  [5.467, 11.767],
  [12.033, 16.467],
  [16.833, 19.667],
  [19.867, 21.533],
  [21.800, 28.100],
  [28.233, 29.533],
  [29.633, 34.933],
  [35.267, 41.467],
  [41.900, 45.500],
  [45.833, 51.433],
  [51.533, 54.700],
  [54.833, 57.467],
];

export const diploOdonto: ReelConfig = {
  id: "DiploOdonto",
  title: "kennedy-02-diplomatura-armonizacion-orofacial",
  dir: "diplo-odonto",
  style: "kennedy",
  // Misma paleta, otra puesta: títulos condensados en mayúsculas y subtítulos grandes con contorno.
  lookOverride: {
    titleFont: "Anton, Impact, sans-serif",
    titleUpper: true,
    emItalic: false,
    captions: "outline",
    captionsY: 1450,
    zoom: "push",
    zoomAmount: 0.12,
    particles: "none",
    leak: true,
    sfx: { enter: "swoosh", item: "click", big: "sub", stamp: "pop-alto", cta: "brillo", riser: "riser", end: "sting", note: "click" },
  },
  face: { x: 0.53, y: 0.35 },
  zones: { hook: 860, top: 800 },
  handle: HANDLE.academy,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["odontólogo", "integral?", "orofacial", "Kennedy", "seis", "anatomía", "diagnóstico", "planificación", "odontológicas", "neuromodulación,", "rellenos,", "bioestimuladores,", "labios,", "complicaciones", "función,", "estructuras", "proporciones,", "2027", "abiertas."],
  hook: { eyebrow: "Para odontólogos", parts: ["Armonización ", { em: "orofacial" }, " integral"], to: { word: "integral?", offset: 0.3 } },
  callouts: [
    { kind: "card", at: { word: "diplomatura" }, eyebrow: "Universidad Kennedy", parts: ["Diplomatura en ", { em: "armonización orofacial" }] },
    { kind: "number", at: { word: "seis" }, value: "6", label: "meses de trabajo" },
    {
      kind: "list",
      at: { word: "anatomía" },
      title: ["Vamos a ", { em: "ver" }],
      items: [
        { text: "Anatomía aplicada", at: { word: "anatomía" } },
        { text: "Diagnóstico", at: { word: "diagnóstico" } },
        { text: "Planificación facial", at: { word: "planificación" } },
      ],
    },
    { kind: "card", at: { word: "integrando" }, eyebrow: "Siempre integrando", parts: ["Bases odontológicas ", { em: "+ armonización" }] },
    {
      kind: "list",
      at: { word: "neuromodulación" },
      title: [{ em: "Vas a formarte" }],
      items: [
        { text: "Neuromodulación", at: { word: "neuromodulación" } },
        { text: "Rellenos", at: { word: "rellenos" } },
        { text: "Bioestimuladores", at: { word: "bioestimuladores" } },
        { text: "Mínimamente invasivos", at: { word: "procedimientos" } },
      ],
    },
    {
      kind: "list",
      at: { word: "abordaje" },
      title: [{ em: "Abordaje" }],
      items: [
        { text: "Labios", at: { word: "labios" } },
        { text: "Tercio medio", at: { word: "medio" } },
        { text: "Tercio inferior", at: { word: "inferior" } },
        { text: "Manejo de complicaciones", at: { word: "manejo" } },
      ],
    },
    { kind: "stamp", at: { word: "planificación", after: 33 }, text: "Planificación de tratamientos", icon: "check" },
    { kind: "big", at: { word: "Porque" }, parts: ["Armonizar no es aprender ", { em: "tratamientos aislados" }] },
    {
      kind: "list",
      at: { word: "entender" },
      title: ["Es ", { em: "entender" }],
      items: [
        { text: "Función", at: { word: "función" } },
        { text: "Estructuras", at: { word: "estructuras" } },
        { text: "Proporciones", at: { word: "proporciones" } },
      ],
    },
    { kind: "quote", at: { word: "intervención" }, parts: ["Cada intervención impacta en ", { em: "el rostro completo" }] },
    { kind: "lower", at: { word: "Soy" }, eyebrow: "Directora Académica", parts: ["Dra. Paola ", { em: "Limbozzi" }], sub: "Diplomatura en Armonización Orofacial Integral" },
  ],
  cta: { at: { word: "inscripciones" }, kicker: "Inscripciones 2027", button: "¡YA ESTÁN ABIERTAS!", sub: "Te esperamos en la Universidad Kennedy" },
  end: { parts: ["Formá parte de ", { em: "la Universidad Kennedy" }, "."], sub: "Armonización Orofacial Integral" },
  music: { preset: "academy", seed: 42 },
};
