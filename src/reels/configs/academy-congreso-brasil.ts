import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Academy — Congreso en São Paulo (Brasil). La fuente ya está acelerada a 1,05× y mejorada
// (tiempos en segundos del video acelerado). Se corta el aparte del avión (29.3–31.07).
const RAW_SEGMENTS: Segment[] = [
  { start: 1.35, end: 4.6, text: "Acompañame a vivir esta experiencia tan especial." },
  { start: 4.75, end: 7.12, text: "Me vine aquí a Brasil, a São Paulo," },
  { start: 7.12, end: 10.78, text: "para compartir experiencias en el Congreso de Medicina Estética BAM." },
  { start: 11.02, end: 13.96, text: "Estoy muy feliz de poder participar en este encuentro," },
  { start: 13.96, end: 17.84, text: "compartir conocimientos con colegas de distintos lugares del mundo" },
  { start: 17.84, end: 21.88, text: "y seguir aprendiendo de referentes de nuestra especialidad." },
  { start: 22.12, end: 25.82, text: "Voy a estar compartiendo mi experiencia, mi trabajo," },
  { start: 25.91, end: 29.32, text: "y quiero llevarlos conmigo para que puedan vivir un poquito" },
  { start: 31.07, end: 34.36, text: "de todo lo que sucede detrás de escena en estos eventos." },
  { start: 34.44, end: 37.19, text: "Así que acompañame estos días," },
  { start: 37.19, end: 42.26, text: "porque voy a mostrarte todo: el congreso, los preparativos, mis amigos," },
  { start: 42.26, end: 43.92, text: "colegas y mucho más." },
];

// KEEP: 2 tramos, 41.70s · pausas internas recortadas (tools/pausas.py) · perfil de voz "limpia"
const KEEP: [number, number][] = [
  [1.133, 29.567],
  [30.767, 44.033],
];

export const academyCongresoBrasil: ReelConfig = {
  id: "AcademyCongresoBrasil",
  title: "academy-10-congreso-sao-paulo",
  dir: "academy-congreso-brasil",
  style: "editorial",
  // Colores de marca (DESIGN.md): crema, negro cálido, dorado en itálica y teal.
  lookOverride: {
    accent: "#B99A48",
    accent2: "#4A93A8",
    cardBg: "#FBF9F5",
    cardInk: "#1B1815",
    captions: "box",
    captionsY: 1450,
    zoom: "push",
    zoomAmount: 0.1,
    cut: "whip",
    motionBlur: true,
    leak: true,
    particles: "sparkle",
    grade: "contrast(1.05) saturate(1.06) brightness(1.03)",
    vignette: 0.2,
    sfx: { enter: "whoosh", item: "pop", big: "impacto", stamp: "brillo", cta: "ding", riser: "riser", end: "sting", note: "click" },
  },
  face: { x: 0.5, y: 0.3 },
  zones: { hook: 920, top: 900 },
  handle: HANDLE.academy,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["experiencia", "especial.", "Brasil,", "Paulo,", "Congreso", "feliz", "conocimientos", "mundo", "referentes", "trabajo,", "escena", "congreso,", "preparativos,", "amigos,", "colegas"],
  hook: { eyebrow: "Desde São Paulo, Brasil", parts: ["Acompañame a vivir ", { em: "esta experiencia" }], to: { word: "especial.", offset: 0.3 } },
  callouts: [
    { kind: "lower", at: { word: "Brasil" }, eyebrow: "São Paulo · Brasil", parts: ["Congreso de ", { em: "Medicina Estética" }] },
    { kind: "stamp", at: { word: "feliz" }, text: "¡Muy feliz!", icon: "heart" },
    {
      kind: "list",
      at: { word: "compartir", after: 13 },
      title: ["Un encuentro para"],
      items: [
        { text: "Compartir conocimientos", at: { word: "compartir", after: 13 } },
        { text: "Colegas de todo el mundo", at: { word: "distintos" } },
        { text: "Aprender de referentes", at: { word: "aprendiendo" } },
      ],
    },
    { kind: "card", at: { word: "compartiendo" }, eyebrow: "Voy a compartir", parts: ["Mi experiencia ", { em: "y mi trabajo" }] },
    { kind: "big", at: { word: "detrás" }, parts: ["Detrás de ", { em: "escena" }] },
    {
      kind: "list",
      at: { word: "mostrarte" },
      title: ["Te voy a ", { em: "mostrar todo" }],
      items: [
        { text: "El congreso", at: { word: "congreso", after: 37 } },
        { text: "Los preparativos", at: { word: "preparativos" } },
        { text: "Amigos y colegas", at: { word: "amigos" } },
        { text: "¡Y mucho más!", at: { word: "mucho" } },
      ],
    },
  ],
  cta: { at: { word: "mucho", offset: 0.6 }, kicker: "Seguime estos días", button: "ACOMPAÑAME" },
  end: { parts: ["Seguí ", { em: "el detrás de escena" }, "."], sub: "Paola Limbozzi Academy · São Paulo" },
  music: { preset: "luminoso", seed: 61 },
};
