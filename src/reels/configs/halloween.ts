import { Segment } from "../../lib/timeline";
import { HANDLE, PERFIL } from "../handles";
import { LOOKS } from "../engine/styles";
import { ReelConfig } from "../engine/types";

// Cónsul / "Halloween" — toma única de 4 min con repeticiones, indicaciones y
// movimientos de cámara. Se arman las mejores tomas:
//  intro con luz roja · "los verdaderos terrores" · paciente "10 años" (103 s, con
//  cara de espanto) · "hialurónico de internet" + reacción · "labios de Instagram"
//  + labios de utilería · "magia negra / criterio, seguridad y técnica" · cierre.
const RAW_SEGMENTS: Segment[] = [
  { start: 3.1, end: 7.0, text: "Dicen que en Halloween aparecen los monstruos." },
  { start: 23.2, end: 27.7, text: "Pero en medicina estética, los verdaderos terrores son otros." },
  { start: 103.3, end: 106.8, text: "Doctora, quiero que me saques 10 años, pero que no se note nada." },
  { start: 138.5, end: 142.0, text: "Me puse ácido hialurónico, lo compré en internet." },
  { start: 142.1, end: 145.0, text: "" },
  { start: 162.6, end: 164.8, text: "Quiero los labios de una foto de Instagram." },
  { start: 164.9, end: 167.2, text: "" },
  { start: 212.3, end: 220.9, text: "En mi consultorio no hacemos magia negra. Hacemos medicina estética con criterio, seguridad y técnica." },
  { start: 237.3, end: 241.3, text: "En este Halloween, que el único susto sea el disfraz." },
];

// KEEP: 18 tramos, 30.27s · pausas internas recortadas (tools/pausas.py) · perfil de voz "media"
const KEEP: [number, number][] = [
  [3.167, 4.133],
  [4.367, 5.367],
  [5.700, 6.767],
  [23.233, 26.500],
  [26.833, 27.400],
  [103.533, 106.733],
  [138.600, 141.867],
  [142.067, 145.067],
  [162.733, 164.633],
  [164.867, 167.267],
  [212.400, 214.300],
  [214.633, 215.467],
  [216.200, 218.700],
  [218.900, 219.700],
  [220.000, 220.633],
  [237.333, 238.600],
  [238.733, 239.933],
  [240.533, 241.033],
];

export const halloween: ReelConfig = {
  id: "Halloween",
  title: "consul-11-halloween",
  dir: "halloween",
  style: "bruja",
  lookOverride: {
    accent: "#FF4B2B",
    accent2: "#FFB347",
    marker: "#FF4B2B",
    tint: { color: "#8B0A0A", blend: "soft-light", opacity: 0.35 },
    sfx: { ...LOOKS.bruja.sfx, big: "glitch", stamp: "trueno" },
  },
  face: { x: 0.5, y: 0.35 },
  handle: HANDLE.consul,
  profile: PERFIL.consul,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["monstruos", "terrores", "internet", "Instagram", "magia", "criterio", "seguridad", "técnica", "susto", "disfraz"],
  hook: { eyebrow: "Dicen que…", parts: ["En Halloween aparecen ", { em: "los monstruos" }] },
  callouts: [
    { kind: "card", at: { word: "verdaderos" }, eyebrow: "Pero en medicina estética", parts: ["Los verdaderos ", { em: "terrores" }, " son otros"] },
    { kind: "big", at: 103.3, to: 106.8, eyebrow: "Paciente", parts: ["“Sacame 10 años, pero que ", { em: "no se note nada" }, "”"] },
    { kind: "big", at: 138.5, to: 142.0, eyebrow: "Paciente", parts: ["“Me puse hialurónico, ", { em: "lo compré en internet" }, "”"] },
    { kind: "stamp", at: 142.15, to: 144.95, text: "¡¿Qué?!", icon: "alert" },
    { kind: "big", at: 162.6, to: 164.85, eyebrow: "Paciente", parts: ["“Quiero los labios ", { em: "de una foto de Instagram" }, "”"] },
    { kind: "stamp", at: 164.95, to: 167.15, text: "Así no", icon: "cross" },
    { kind: "card", at: { word: "magia" }, eyebrow: "En mi consultorio", parts: ["No hacemos ", { em: "magia negra" }] },
    {
      kind: "list",
      at: { word: "Hacemos" },
      title: ["Hacemos medicina estética ", { em: "con" }],
      items: [
        { text: "Criterio", at: { word: "criterio" } },
        { text: "Seguridad", at: { word: "seguridad" } },
        { text: "Técnica", at: { word: "técnica" } },
      ],
    },
    { kind: "big", at: { word: "único", after: 236 }, to: 241.3, parts: ["Que el único susto ", { em: "sea el disfraz" }] },
  ],
  end: { parts: ["Feliz ", { em: "Halloween" }], sub: "Medicina estética con criterio" },
  music: { preset: "oscuro", seed: 11 },
};
