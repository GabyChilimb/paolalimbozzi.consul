import React from "react";
import { Composition, Folder } from "remotion";
import { MONTAJES } from "./congreso";
import { Montaje, planificar } from "./Montaje";

export const MontajeCompositions: React.FC = () => (
  <Folder name="Montajes">
    {MONTAJES.map((cfg) => (
      <Composition
        key={cfg.id}
        id={cfg.id}
        component={Montaje}
        durationInFrames={Math.round(planificar(cfg).total * 30)}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ cfg }}
      />
    ))}
  </Folder>
);
