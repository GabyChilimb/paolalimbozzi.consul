import React from "react";
import { AbsoluteFill, Composition, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Sección PC: una foto se convierte en video. Arranca cerca (sobre `foco`) y se aleja
// desplazándose hacia la derecha, sobre fondo negro.
export type FotoAnimadaProps = {
  src: string; // archivo en public/
  foco: { x: number; y: number }; // punto donde arranca el acercamiento (0–1 de la foto)
  zoomInicial: number; // escala al empezar (1 = la foto ocupa el cuadro)
  zoomFinal: number; // escala al terminar (< 1 deja ver el fondo negro)
  derecha: number; // cuánto se corre a la derecha al final, en px
};

const W = 1080;
const H = 1920;
const FPS = 30;
const SEGUNDOS = 6;

export const FotoAnimada: React.FC<FotoAnimadaProps> = ({ src, foco, zoomInicial, zoomFinal, derecha }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const k = interpolate(frame, [0, durationInFrames - 1], [0, 1], { easing: Easing.bezier(0.45, 0, 0.2, 1) });
  // La escala baja en forma geométrica para que el alejamiento se sienta parejo.
  const escala = zoomInicial * Math.pow(zoomFinal / zoomInicial, k);
  // Al principio el foco queda en el centro del cuadro; al final, la foto centrada y corrida a la derecha.
  const fx = (foco.x - 0.5) * W;
  const fy = (foco.y - 0.5) * H;
  const tx = -fx * escala * (1 - k) + derecha * k;
  const ty = -fy * escala * (1 - k);
  // Un leve giro en 3D al alejarse le da profundidad.
  const giro = -14 * k;
  // Sombra/brillo que aparece cuando la foto ya no ocupa todo el cuadro.
  const borde = interpolate(k, [0.35, 0.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000", perspective: 2400, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `translate(${tx}px, ${ty}px) rotateY(${giro}deg) scale(${escala})`,
          transformOrigin: "50% 50%",
          borderRadius: 26 * borde / escala,
          overflow: "hidden",
          boxShadow: `0 ${40 * borde}px ${120 * borde}px rgba(70,120,255,${0.35 * borde}), 0 0 ${60 * borde}px rgba(0,0,0,.9)`,
        }}
      >
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PcCompositions: React.FC = () => (
  <Composition
    id="PcFoto01"
    component={FotoAnimada}
    durationInFrames={SEGUNDOS * FPS}
    fps={FPS}
    width={W}
    height={H}
    defaultProps={{ src: "pc/foto-01.jpg", foco: { x: 0.5, y: 0.58 }, zoomInicial: 1.9, zoomFinal: 0.6, derecha: 170 }}
  />
);
