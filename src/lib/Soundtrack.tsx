import React from "react";
import { Audio, interpolate, Sequence, staticFile, useVideoConfig } from "remotion";
import { Segment } from "./timeline";

export type Sfx = string;
export type SfxEvent = { at: number; sfx: Sfx; volume: number };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Voz + música que baja cuando hay voz + efectos (public/sfx).
export const Soundtrack: React.FC<{
  voice: string;
  music: string;
  segments: Segment[];
  events: SfxEvent[];
  underVoice?: number;
  open?: number;
  sfxDir?: string;
}> = ({ voice, music, segments, events, underVoice = 0.16, open = 0.45, sfxDir = "sfx" }) => {
  const { fps, durationInFrames } = useVideoConfig();
  const duration = durationInFrames / fps;

  // Tramos con voz, uniendo pausas cortas para que la música no "bombee".
  // (los tramos sin texto, como reacciones mudas, no bajan la música)
  const speech = segments.filter((s) => s.text.trim()).reduce<[number, number][]>((acc, s) => {
    const last = acc[acc.length - 1];
    if (last && s.start - last[1] < 0.7) last[1] = s.end;
    else acc.push([s.start, s.end]);
    return acc;
  }, []);

  const musicVolume = (t: number) => {
    let duck = 0;
    for (const [s, e] of speech) {
      duck = Math.max(
        duck,
        Math.min(interpolate(t, [s - 0.25, s], [0, 1], clamp), interpolate(t, [e + 0.1, e + 0.5], [1, 0], clamp)),
      );
    }
    const fadeOut = interpolate(t, [duration - 1.4, duration], [1, 0], clamp);
    return (open - (open - underVoice) * duck) * fadeOut;
  };

  return (
    <>
      <Audio src={staticFile(voice)} />
      <Audio src={staticFile(music)} volume={(f) => musicVolume(f / fps)} />
      {events.map((e, i) => (
        <Sequence key={i} from={Math.max(0, Math.round(e.at * fps))} durationInFrames={Math.round(4 * fps)} layout="none">
          <Audio src={staticFile(`${sfxDir}/${e.sfx}.wav`)} volume={e.volume} />
        </Sequence>
      ))}
    </>
  );
};
