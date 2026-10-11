import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, mono, sans, serif } from "./theme";

export const useSeconds = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

// 0 → 1 con resorte suave a partir del segundo `at`.
export const useAppear = (at: number, damping = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - Math.round(at * fps), fps, config: { damping } });
};

// Escena visible entre `from` y `to` (segundos), con entrada y salida.
export const Scene: React.FC<{
  from: number;
  to: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ from, to, children, style }) => {
  const t = useSeconds();
  if (t < from || t > to + 0.35) return null;
  const inP = interpolate(t, [from, from + 0.45], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const outP = interpolate(t, [to, to + 0.35], [1, 0], { extrapolateLeft: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        opacity: Math.min(inP, outP),
        transform: `translateY(${(1 - inP) * 30 - (1 - outP) * 20}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// Línea corta + texto mono en mayúsculas.
export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; at?: number }> = ({
  children,
  color = C.teal,
  at,
}) => {
  const p = useAppear(at ?? -10);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        fontFamily: mono,
        fontWeight: 500,
        fontSize: 26,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color,
        marginBottom: 26,
        opacity: p,
      }}
    >
      <span style={{ width: 44 * p, height: 2, background: color, display: "inline-block" }} />
      {children}
    </div>
  );
};

type Part = string | { em: string };

// Título serif; las partes { em } van en itálica dorada (regla de marca).
// Las palabras entran escalonadas desde `at`.
export const Headline: React.FC<{
  parts: Part[];
  at: number;
  size?: number;
  stagger?: number;
}> = ({ parts, at, size = 84, stagger = 0.06 }) => {
  const t = useSeconds();
  const tokens: { text: string; em: boolean }[] = [];
  for (const p of parts) {
    const em = typeof p !== "string";
    const text = typeof p === "string" ? p : p.em;
    text
      .split(/(\s+)/)
      .filter((x) => x.length)
      .forEach((x) => tokens.push({ text: x, em }));
  }
  let wordIndex = 0;
  return (
    <div
      style={{
        fontFamily: serif,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: "-0.01em",
        color: C.ink,
        maxWidth: 940,
        fontWeight: 400,
      }}
    >
      {tokens.map((tok, i) => {
        if (/^\s+$/.test(tok.text)) return <span key={i}> </span>;
        const start = at + wordIndex++ * stagger;
        const p = interpolate(t, [start, start + 0.4], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * 24}px)`,
              fontStyle: tok.em ? "italic" : "normal",
              color: tok.em ? C.gold : C.ink,
              fontWeight: tok.em ? 500 : 400,
            }}
          >
            {tok.text}
          </span>
        );
      })}
    </div>
  );
};

// Texto secundario en sans gris cálido.
export const Body: React.FC<{ children: React.ReactNode; at: number; size?: number }> = ({
  children,
  at,
  size = 40,
}) => {
  const p = useAppear(at);
  return (
    <div
      style={{
        fontFamily: sans,
        fontSize: size,
        lineHeight: 1.35,
        color: C.text,
        marginTop: 24,
        maxWidth: 900,
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Tarjeta blanca estilo web (radio chico, sombra suave).
export const Card: React.FC<{
  at: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ at, children, style }) => {
  const p = useAppear(at, 18);
  return (
    <div
      style={{
        background: C.white,
        borderRadius: 4,
        boxShadow: "0 10px 30px rgba(27,24,21,.08)",
        border: `1px solid ${C.line}`,
        padding: "26px 30px",
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 40}px) scale(${0.94 + 0.06 * p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const GoldDot: React.FC = () => (
  <span
    style={{
      width: 14,
      height: 14,
      borderRadius: 7,
      background: C.goldLight,
      display: "inline-block",
      flexShrink: 0,
    }}
  />
);
