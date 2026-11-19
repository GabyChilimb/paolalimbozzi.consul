import React from "react";
import { AbsoluteFill, Composition, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

// Sección PC: foto de un gabinete → video de producto. El gabinete va recortado sobre negro
// (tools: recorte con isnet + capa de luces RGB), la cámara arranca cerca y se aleja hacia la
// derecha con un leve giro, y las luces RGB cambian de color como en los videos de referencia.
export type PcProductoProps = {
  recorte: string; // PNG con el gabinete recortado (alfa)
  luces: string; // PNG con solo las luces RGB (alfa = intensidad)
  centro: { x: number; y: number }; // centro del gabinete en la foto (0–1)
  zoomInicial: number;
  zoomFinal: number;
  derecha: number; // px que se corre a la derecha al final
  giro: number; // grados de giro en Y al final
  tonos: number[]; // recorrido de tono de las luces (grados de hue-rotate)
};

const W = 1080;
const H = 1920;
const FPS = 30;
const SEGUNDOS = 6;

const PISO = 0.985; // base del gabinete en la foto (0–1): ahí se refleja

const capa: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };

export const PcProducto: React.FC<PcProductoProps> = ({ recorte, luces, centro, zoomInicial, zoomFinal, derecha, giro, tonos }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const k = interpolate(frame, [0, durationInFrames - 1], [0, 1], { easing: Easing.bezier(0.4, 0, 0.2, 1) });
  const escala = zoomInicial * Math.pow(zoomFinal / zoomInicial, k);
  // El centro del gabinete queda en el centro del cuadro durante todo el alejamiento.
  const cx = (centro.x - 0.5) * W;
  const cy = (centro.y - 0.5) * H;
  const tx = -cx * escala + derecha * k;
  const ty = -cy * escala;
  // Color de las luces: recorre los tonos a lo largo del clip, con un pulso suave de brillo.
  const tramos = tonos.map((_, i) => (i / (tonos.length - 1)) * (durationInFrames - 1));
  const tono = interpolate(frame, tramos, tonos, { easing: Easing.inOut(Easing.sin) });
  const pulso = 1 + 0.12 * Math.sin((frame / FPS) * Math.PI * 1.3);
  const filtroLuces = `hue-rotate(${tono}deg) brightness(${1.1 * pulso}) saturate(1.25)`;
  return (
    <AbsoluteFill style={{ background: "#000", perspective: 2600, overflow: "hidden" }}>
      {/* Resplandor de ambiente detrás y debajo del gabinete */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 22% at ${50 + (derecha * k) / W * 100}% 78%, hsla(${220 + tono}, 90%, 55%, ${0.22 * pulso}), rgba(0,0,0,0) 70%)`,
        }}
      />
      <AbsoluteFill style={{ transform: `translate(${tx}px, ${ty}px) rotateY(${giro * k}deg) scale(${escala})`, transformOrigin: "50% 50%" }}>
        {/* Reflejo en el piso */}
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `translateY(${2 * PISO * H - H}px) scaleY(-1)`, opacity: 0.22, WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,.9), rgba(0,0,0,0) 30%)" }}>
          <Img src={staticFile(recorte)} style={capa} />
          <Img src={staticFile(luces)} style={{ ...capa, filter: filtroLuces }} />
        </div>
        <Img src={staticFile(recorte)} style={capa} />
        <Img src={staticFile(luces)} style={{ ...capa, filter: filtroLuces }} />
        {/* Brillo de las luces */}
        <Img src={staticFile(luces)} style={{ ...capa, filter: `${filtroLuces} blur(28px)`, mixBlendMode: "screen", opacity: 0.7 }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const PcCompositions: React.FC = () => (
  <Composition
    id="PcFoto01"
    component={PcProducto}
    durationInFrames={SEGUNDOS * FPS}
    fps={FPS}
    width={W}
    height={H}
    defaultProps={{
      recorte: "pc/foto-01-recorte.png",
      luces: "pc/foto-01-luces.png",
      centro: { x: 0.5, y: 0.66 },
      zoomInicial: 1.45,
      zoomFinal: 0.78,
      derecha: 110,
      giro: -12,
      tonos: [0, 40, 80, 40, -30, 0],
    }}
  />
);
