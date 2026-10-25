import { Segment } from "../../lib/timeline";
import { HANDLE } from "../handles";
import { ReelConfig } from "../engine/types";

// Academy / Octubre — "Técnica". Se usan las tomas limpias; algunas frases se
// arman con el comienzo de una toma y el final de la siguiente.
const RAW_SEGMENTS: Segment[] = [
  { start: 6.15, end: 10.34, text: "Hay docentes que te enseñan una técnica y luego desaparecen." },
  { start: 13.76, end: 17.63, text: "Pero tus dudas no desaparecen cuando termina la capacitación." },
  { start: 22.03, end: 26.1, text: "Cuando volvés al consultorio, aparecen las situaciones reales" },
  { start: 36.68, end: 40.37, text: "que requieren evaluar al paciente y decidir cómo actuar." },
  { start: 45.61, end: 48.95, text: "Por eso no te alcanza con aprender solo un procedimiento." },
  { start: 53.58, end: 58.64, text: "También necesitás orientación para seguir desarrollando tu criterio clínico." },
  { start: 70.15, end: 73.96, text: "En Paola Limbozzi Academy combinamos formación científica," },
  { start: 81.32, end: 84.31, text: "práctica supervisada y acompañamiento posterior." },
  { start: 95.24, end: 100.08, text: "Si buscás una formación que vaya más allá de la técnica, conocé nuestras propuestas." },
];

// KEEP: 9 tramos, 38.00s (original 105.11s) · perfil de voz "media" (tools/finalizar.py)
const KEEP: [number, number][] = [
  [6.067, 10.467],
  [13.667, 17.767],
  [21.933, 26.233],
  [36.567, 40.500],
  [45.500, 49.100],
  [53.467, 58.767],
  [70.067, 74.100],
  [81.233, 84.467],
  [95.133, 100.233],
];

export const academyTecnica: ReelConfig = {
  id: "AcademyTecnica",
  title: "academy-04-tecnica",
  dir: "academy-tecnica",
  style: "editorial",
  lookOverride: { accent: "#4A93A8", accent2: "#B99A48" },
  face: { x: 0.48, y: 0.31 },
  handle: HANDLE.academy,
  raw: RAW_SEGMENTS,
  keep: KEEP,
  keywords: ["desaparecen", "dudas", "reales", "evaluar", "decidir", "procedimiento", "orientación", "criterio", "científica", "supervisada", "acompañamiento", "técnica"],
  hook: { eyebrow: "Antes de elegir dónde formarte", parts: ["Docentes que te enseñan ", { em: "y desaparecen" }], to: { word: "desaparecen.", offset: 0.3 } },
  callouts: [
    { kind: "big", at: { word: "Pero", after: 13 }, parts: ["Tus dudas ", { em: "no desaparecen" }] },
    { kind: "card", at: { word: "Cuando", after: 22 }, eyebrow: "En el consultorio", parts: ["Aparecen las ", { em: "situaciones reales" }] },
    {
      kind: "list",
      at: { word: "requieren" },
      title: [{ em: "Requieren" }],
      items: [
        { text: "Evaluar al paciente", at: { word: "evaluar" } },
        { text: "Decidir cómo actuar", at: { word: "decidir" } },
      ],
    },
    { kind: "versus", at: { word: "alcanza" }, to: { word: "clínico.", offset: 0.5 }, rightAt: { word: "orientación" }, left: "Solo un procedimiento", right: "Orientación y criterio clínico" },
    {
      kind: "list",
      at: { word: "combinamos" },
      to: { word: "posterior.", offset: 0.6 },
      title: ["En la ", { em: "Academy" }],
      items: [
        { text: "Formación científica", at: { word: "formación", after: 70 } },
        { text: "Práctica supervisada", at: { word: "práctica" } },
        { text: "Acompañamiento posterior", at: { word: "acompañamiento" } },
      ],
    },
  ],
  cta: { at: { word: "Si", after: 94 }, kicker: "Más allá de la técnica", button: "CONOCÉ NUESTRAS PROPUESTAS" },
  end: { parts: ["Una formación ", { em: "más allá de la técnica" }, "."], sub: "Paola Limbozzi Academy" },
  music: { preset: "suave", seed: 24 },
};
