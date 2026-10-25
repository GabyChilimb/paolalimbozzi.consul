import React from "react";
import { Composition } from "remotion";
import { FPS, HEIGHT, WIDTH } from "../Bioestimuladores/theme";
import { makeTimeline } from "../lib/timeline";
import { consul1 } from "./configs/consul-1";
import { consul2 } from "./configs/consul-2";
import { consul3 } from "./configs/consul-3";
import { consul4 } from "./configs/consul-4";
import { consul5 } from "./configs/consul-5";
import { consul6 } from "./configs/consul-6";
import { consul7 } from "./configs/consul-7";
import { consul8 } from "./configs/consul-8";
import { bruja } from "./configs/bruja";
import { miedoArrugas } from "./configs/miedo-arrugas";
import { halloween } from "./configs/halloween";
import { academyFullFace } from "./configs/academy-full-face";
import { academyLabios } from "./configs/academy-labios";
import { academyRinomodelacion } from "./configs/academy-rinomodelacion";
import { academyTecnica } from "./configs/academy-tecnica";
import { END_HOLD, Reel } from "./engine/Reel";
import { ReelConfig } from "./engine/types";

export const REELS: ReelConfig[] = [consul1, consul2, consul3, consul4, consul5, consul6, consul7, consul8, bruja, miedoArrugas, halloween, academyFullFace, academyLabios, academyRinomodelacion, academyTecnica];

const ReelById: React.FC<{ id: string }> = ({ id }) => <Reel cfg={REELS.find((r) => r.id === id)!} />;

export const ReelCompositions: React.FC = () => (
  <>
    {REELS.map((cfg) => {
      const secs = makeTimeline(cfg.raw, cfg.keep).VOICE_SECONDS + 0.15 + END_HOLD;
      return (
        <Composition
          key={cfg.id}
          id={cfg.id}
          component={ReelById}
          defaultProps={{ id: cfg.id }}
          durationInFrames={Math.max(1, Math.round(secs * FPS))}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      );
    })}
  </>
);
