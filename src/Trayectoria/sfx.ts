import { SfxEvent } from "../lib/Soundtrack";
import { T, timeOf } from "./transcript";

// Efectos sincronizados con las animaciones (tiempos originales vía T/timeOf).
export const sfxEvents = (endCardAt: number): SfxEvent[] => [
  { at: T(0.4), sfx: "whoosh", volume: 0.3 },
  { at: timeOf("Soy", 8), sfx: "pop", volume: 0.35 },
  { at: T(12.15), sfx: "tick", volume: 0.35 },
  // Speaker: pantalla de congresos
  { at: T(17.87) - 0.2, sfx: "whoosh", volume: 0.4 },
  ...[
    ["Congreso", 21],
    ["Mendoza", 21],
    ["ACAOFAR", 21],
    ["Congreso", 25],
    ["CEMAL", 21],
  ].map(([w, after]) => ({ at: timeOf(w as string, after as number), sfx: "pop" as const, volume: 0.35 })),
  { at: T(28.7) - 0.1, sfx: "whoosh", volume: 0.3 },
  // Comité científico
  { at: timeOf("miembro", 30), sfx: "ding", volume: 0.3 },
  // Talleres: foto del público
  { at: T(35.5) - 0.2, sfx: "whoosh", volume: 0.4 },
  { at: timeOf("distintas", 35), sfx: "pop-alto", volume: 0.3 },
  { at: T(40.7) - 0.1, sfx: "whoosh", volume: 0.3 },
  // Lista de títulos tachada
  ...[40.8, 40.9, 41.0, 41.1].map((x) => ({ at: T(x), sfx: "tick" as const, volume: 0.3 })),
  { at: timeOf("títulos", 40) - 0.1, sfx: "whoosh", volume: 0.25 },
  // Estudiar vs. ejercer
  { at: timeOf("Porque", 42), sfx: "pop", volume: 0.3 },
  { at: timeOf("Otra", 48), sfx: "impact", volume: 0.35 },
  // Directora
  { at: T(54.6) - 0.2, sfx: "whoosh", volume: 0.4 },
  { at: timeOf("Diplomatura"), sfx: "pop", volume: 0.35 },
  { at: timeOf("Posgrado"), sfx: "pop", volume: 0.35 },
  { at: timeOf("Paola", 64), sfx: "ding", volume: 0.35 },
  { at: T(66.3) - 0.1, sfx: "whoosh", volume: 0.3 },
  // Objetivo
  { at: timeOf("formar", 68.9), sfx: "pop-alto", volume: 0.3 },
  // CTA y cierre
  { at: T(71.8) - 0.15, sfx: "whoosh", volume: 0.35 },
  { at: timeOf("INFORMACIÓN") - 1.25, sfx: "riser", volume: 0.3 },
  { at: timeOf("INFORMACIÓN"), sfx: "ding", volume: 0.35 },
  { at: endCardAt, sfx: "sting", volume: 0.45 },
];
