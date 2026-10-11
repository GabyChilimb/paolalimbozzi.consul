import React from "react";
import { Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { SEGMENTS, T, timeOf } from "./transcript";

type Sfx = "whoosh" | "pop" | "pop-alto" | "tick" | "ding" | "coin" | "impact" | "warn" | "riser" | "sting";

// Efectos sincronizados con las animaciones (tiempos de audio original vía T/timeOf).
const events = (endCardAt: number): { at: number; sfx: Sfx; volume: number }[] => [
  // Apertura: nombres de productos
  { at: timeOf("Hidroxiapatita"), sfx: "tick", volume: 0.35 },
  { at: timeOf("poli-L"), sfx: "tick", volume: 0.35 },
  { at: timeOf("policaprolactona"), sfx: "tick", volume: 0.35 },
  // Pasa de la foto a los gráficos + "?"
  { at: T(4.9) - 0.25, sfx: "whoosh", volume: 0.4 },
  { at: T(5.15), sfx: "pop", volume: 0.4 },
  // Paciente al centro + productos en órbita
  { at: timeOf("indicado"), sfx: "ding", volume: 0.3 },
  ...["hidroxiapatita", "ácido", "policaprolactona", "polidioxanona"].map((w) => ({
    at: timeOf(w, 9.6),
    sfx: "pop" as const,
    volume: 0.4,
  })),
  // Papers y barras
  { at: T(18.8) - 0.2, sfx: "whoosh", volume: 0.35 },
  { at: timeOf("Más", 18), sfx: "pop-alto", volume: 0.35 },
  { at: timeOf("menos", 18), sfx: "pop", volume: 0.35 },
  { at: timeOf("mejor", 18), sfx: "pop-alto", volume: 0.35 },
  // Ojo + plata de la marca
  { at: timeOf("Ojo") - 0.05, sfx: "impact", volume: 0.55 },
  { at: timeOf("Los", 30) + 0.5, sfx: "coin", volume: 0.25 },
  { at: timeOf("Los", 30) + 1.9, sfx: "coin", volume: 0.2 },
  // Filtro
  { at: T(35.7) - 0.2, sfx: "whoosh", volume: 0.35 },
  { at: T(37.6), sfx: "ding", volume: 0.3 },
  // Piel: CaHA y PLLA
  { at: T(39.5) - 0.2, sfx: "whoosh", volume: 0.35 },
  { at: timeOf("hidroxiapatita", 39) + 0.3, sfx: "pop-alto", volume: 0.3 },
  { at: timeOf("soporte"), sfx: "pop", volume: 0.35 },
  { at: T(49.6) - 0.2, sfx: "whoosh", volume: 0.3 },
  // Reconstitución
  { at: T(55.5) - 0.2, sfx: "whoosh", volume: 0.35 },
  { at: timeOf("respetar", 55) + 0.6, sfx: "tick", volume: 0.4 },
  { at: timeOf("pie", 55) + 0.3, sfx: "tick", volume: 0.4 },
  { at: timeOf("reconstitución", 55) + 0.2, sfx: "tick", volume: 0.4 },
  { at: timeOf("riesgo", 59), sfx: "warn", volume: 0.3 },
  // 50 / 50
  { at: T(65.2) - 0.2, sfx: "whoosh", volume: 0.35 },
  { at: timeOf("mitad", 65) - 0.3, sfx: "pop", volume: 0.35 },
  { at: timeOf("otra", 68), sfx: "pop-alto", volume: 0.35 },
  // Curva de aprendizaje
  { at: T(71.5) - 0.2, sfx: "whoosh", volume: 0.35 },
  { at: timeOf("criterio"), sfx: "pop", volume: 0.35 },
  { at: timeOf("seguridad"), sfx: "pop-alto", volume: 0.35 },
  // CTA y cierre
  { at: T(79.0) - 0.25, sfx: "whoosh", volume: 0.4 },
  { at: timeOf("BIOESTIMULADORES") - 1.25, sfx: "riser", volume: 0.3 },
  { at: timeOf("BIOESTIMULADORES"), sfx: "ding", volume: 0.35 },
  { at: endCardAt, sfx: "sting", volume: 0.45 },
];

// Tramos con voz, uniendo pausas cortas para que la música no "bombee".
const speech = SEGMENTS.reduce<[number, number][]>((acc, s) => {
  const last = acc[acc.length - 1];
  if (last && s.start - last[1] < 0.7) last[1] = s.end;
  else acc.push([s.start, s.end]);
  return acc;
}, []);

const MUSIC_UNDER_VOICE = 0.16;
const MUSIC_OPEN = 0.45;

const musicVolume = (t: number, duration: number) => {
  let duck = 0;
  for (const [s, e] of speech) {
    const v = Math.min(
      interpolate(t, [s - 0.25, s], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      interpolate(t, [e + 0.1, e + 0.5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    );
    duck = Math.max(duck, v);
  }
  const fadeOut = interpolate(t, [duration - 1.4, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (MUSIC_OPEN - (MUSIC_OPEN - MUSIC_UNDER_VOICE) * duck) * fadeOut;
};

export const Soundtrack: React.FC<{ endCardAt: number }> = ({ endCardAt }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const duration = durationInFrames / fps;
  return (
    <>
      <Audio src={staticFile("voz.wav")} />
      <Audio src={staticFile("musica.m4a")} volume={(f) => musicVolume(f / fps, duration)} />
      {events(endCardAt).map((e, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(e.at * fps))} durationInFrames={Math.round(3 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${e.sfx}.wav`)} volume={e.volume} />
        </Sequence>
      ))}
    </>
  );
};
