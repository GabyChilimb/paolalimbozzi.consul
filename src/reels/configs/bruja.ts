import { Segment } from "../../lib/timeline";
import { HANDLE, PERFIL } from "../handles";
import { LOOKS } from "../engine/styles";
import { ReelConfig } from "../engine/types";

// Cónsul / "Bruja, mi lado más oscuro" — sketch de Halloween (toma única de 69 s).
// Las frases de "paciente" se dicen fuera de cámara; los tramos con texto vacío son
// las reacciones mudas de Paola (se conservan y no bajan la música).
// Se omiten: indicaciones fuera de cámara (5.8–12.3), la toma fallida
// "yo quiero ácido hialurónico… no, para" (38.3–40.5) y las tomas repetidas del cierre.
const RAW_SEGMENTS: Segment[] = [
  { start: 1.75, end: 5.3, text: "Hay frases que despiertan mi lado más oscuro." },
  { start: 15.2, end: 18.75, text: "Doctora, mi amiga me dijo que el bótox es veneno." },
  { start: 19.1, end: 23.6, text: "" },
  { start: 27.75, end: 30.6, text: "Vi en TikTok que me puedo hacer los labios en casa." },
  { start: 30.9, end: 34.8, text: "" },
  { start: 42.55, end: 45.55, text: "Yo quiero ácido hialurónico, pero que me dure para siempre." },
  { start: 45.8, end: 47.2, text: "" },
  { start: 57.8, end: 61.1, text: "En este Halloween no necesito películas de terror." },
  { start: 64.55, end: 67.25, text: "Con algunas consultas ya tengo suficiente." },
];

// KEEP: 15 tramos, 26.63s · pausas internas recortadas (tools/pausas.py) · perfil de voz "ruidosa"
const KEEP: [number, number][] = [
  [1.867, 3.400],
  [4.067, 4.700],
  [4.833, 5.033],
  [15.200, 15.900],
  [16.400, 18.633],
  [19.067, 23.733],
  [27.800, 28.733],
  [28.833, 30.433],
  [30.867, 34.867],
  [42.533, 45.267],
  [45.567, 47.267],
  [57.867, 60.967],
  [64.567, 65.867],
  [65.967, 67.100],
  [67.200, 67.367],
];

export const bruja: ReelConfig = {
  id: "Bruja",
  title: "consul-09-bruja-mi-lado-mas-oscuro",
  dir: "bruja",
  style: "bruja",
  lookOverride: { sfx: { ...LOOKS.bruja.sfx, big: "glitch", stamp: "trueno" } },
  face: { x: 0.5, y: 0.3 },
  zones: { top: 980 },
  handle: HANDLE.consul,
  profile: PERFIL.consul,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["oscuro", "veneno", "TikTok", "casa", "siempre", "terror", "suficiente"],
  hook: { eyebrow: "Halloween en el consultorio", parts: ["Frases que despiertan ", { em: "mi lado más oscuro" }] },
  callouts: [
    { kind: "big", at: 15.2, to: 18.8, eyebrow: "Paciente", parts: ["“Mi amiga me dijo que el bótox ", { em: "es veneno" }, "”"] },
    { kind: "stamp", at: 19.2, to: 23.5, text: "¿Veneno?", icon: "alert" },
    { kind: "big", at: 27.75, to: 30.65, eyebrow: "Paciente", parts: ["“Vi en TikTok que me puedo hacer los labios ", { em: "en casa" }, "”"] },
    { kind: "stamp", at: 31.0, to: 34.7, text: "Noooo", icon: "cross" },
    { kind: "big", at: 42.55, to: 45.6, eyebrow: "Paciente", parts: ["“Ácido hialurónico, pero que me dure ", { em: "para siempre" }, "”"] },
    { kind: "stamp", at: 45.8, to: 47.15, text: "¿Para siempre?", icon: "alert" },
    { kind: "card", at: { word: "películas" }, eyebrow: "Este Halloween", parts: ["No necesito ", { em: "películas de terror" }] },
    { kind: "big", at: { word: "Con", after: 64 }, to: 67.3, parts: ["Con algunas consultas ", { em: "ya tengo suficiente" }] },
  ],
  end: { parts: ["Feliz ", { em: "Halloween" }], sub: "Consultá con un médico, no con TikTok" },
  music: { preset: "oscuro", seed: 9 },
};
