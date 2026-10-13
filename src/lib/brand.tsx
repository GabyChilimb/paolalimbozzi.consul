import React from "react";
import { C, serif } from "../Bioestimuladores/theme";

export const INSTAGRAM = "@paolalimbozzi.academy";

// Monograma "PL" en círculo dorado (DESIGN.md).
export const Monogram: React.FC<{ size: number; light?: boolean }> = ({ size, light }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      border: `2px solid ${C.goldLight}`,
      background: light ? "rgba(251,249,245,0.85)" : C.cream,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: serif,
      fontStyle: "italic",
      fontSize: size * 0.4,
      color: C.gold,
      flexShrink: 0,
    }}
  >
    PL
  </div>
);

export const InstagramGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <rect x={3} y={3} width={18} height={18} rx={5} />
    <circle cx={12} cy={12} r={4} />
    <circle cx={17.3} cy={6.7} r={1} fill={color} stroke="none" />
  </svg>
);
