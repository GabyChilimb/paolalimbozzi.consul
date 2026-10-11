// Motion graphics de la zona superior: una ilustración animada por bloque del audio.
import React from "react";
import { Easing, interpolate, random } from "remotion";
import { useSeconds } from "./components";
import { C, mono, sans, serif } from "./theme";
import { T, timeOf } from "./transcript";

const VB_W = 1080;
const VB_H = 720;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);

// Progreso 0→1 entre `at` y `at + dur` segundos.
const prog = (t: number, at: number, dur = 0.6) => interpolate(t, [at, at + dur], [0, 1], { ...clamp, easing: ease });

// Resorte con un poco de rebote, sin depender del frame.
const pop = (t: number, at: number) => {
  const x = Math.max(0, t - at);
  if (x === 0) return 0;
  return 1 - Math.exp(-7 * x) * Math.cos(11 * x);
};

const lbl: React.CSSProperties = { fontFamily: mono, letterSpacing: "0.12em" };

// Bloque visible entre `from` y `to` con fundido y leve escala.
const Block: React.FC<{ from: number; to: number; children: (t: number) => React.ReactNode }> = ({
  from,
  to,
  children,
}) => {
  const t = useSeconds();
  if (t < from - 0.05 || t > to + 0.3) return null;
  const o = Math.min(prog(t, from + 0.1, 0.5), 1 - prog(t, to - 0.05, 0.25));
  const s = 0.94 + 0.06 * prog(t, from, 0.7);
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      style={{
        position: "absolute",
        top: 220,
        left: 0,
        width: VB_W,
        height: VB_H,
        opacity: o,
        transform: `scale(${s})`,
        overflow: "visible",
      }}
    >
      {children(t)}
    </svg>
  );
};

/* ───────────── 1. Órbita: ¿cuál es el mejor? → uno para cada paciente ───────────── */

const PRODUCTS = [
  { abbr: "CaHA", word: "hidroxiapatita" },
  { abbr: "PLLA", word: "ácido" },
  { abbr: "PCL", word: "policaprolactona" },
  { abbr: "PDO", word: "polidioxanona" },
];

const Orbit: React.FC = () => {
  const from = T(5.0);
  const patient = timeOf("indicado");
  return (
    <Block from={from} to={T(18.6)}>
      {(t) => {
        const cx = 540;
        const cy = 360;
        const rx = 380;
        const ry = 250;
        const rot = t * 9;
        const q = 1 - prog(t, patient - 0.2, 0.5);
        const pat = prog(t, patient, 0.6);
        return (
          <g>
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.goldMuted} strokeWidth={2} strokeDasharray="6 14" strokeDashoffset={-t * 30} />
            <ellipse cx={cx} cy={cy} rx={rx * 0.62} ry={ry * 0.62} fill="none" stroke={C.line} strokeWidth={2} />
            {PRODUCTS.map((p, i) => {
              const at = timeOf(p.word, 9.6);
              const on = pop(t, at);
              const a = ((rot + i * 90 + 45) * Math.PI) / 180;
              const x = cx + rx * Math.cos(a);
              const y = cy + ry * Math.sin(a);
              const r = 26 + 54 * Math.min(1.15, on);
              const line = prog(t, at, 0.5);
              return (
                <g key={p.abbr}>
                  <line x1={cx} y1={cy} x2={cx + (x - cx) * line} y2={cy + (y - cy) * line} stroke={C.teal} strokeWidth={2} opacity={0.5} />
                  <circle cx={x} cy={y + 6} r={r} fill="rgba(27,24,21,.06)" />
                  <circle cx={x} cy={y} r={r} fill={on > 0 ? C.white : C.goldLight} stroke={on > 0 ? C.teal : "none"} strokeWidth={3} opacity={on > 0 ? 1 : 0.7} />
                  {on > 0 && (
                    <text x={x} y={y + 10} textAnchor="middle" style={{ ...lbl, fontSize: 28 * Math.min(1, on), fill: C.teal, fontWeight: 500 }}>
                      {p.abbr}
                    </text>
                  )}
                </g>
              );
            })}
            <circle cx={cx} cy={cy} r={120} fill={C.white} stroke={C.goldLight} strokeWidth={3} />
            <circle cx={cx} cy={cy} r={120 + 18 * Math.sin(t * 3) ** 2} fill="none" stroke={C.goldLight} strokeWidth={1.5} opacity={0.5} />
            <text x={cx} y={cy + 52} textAnchor="middle" style={{ fontFamily: serif, fontStyle: "italic", fontSize: 150 * q, fill: C.gold }} opacity={q}>
              ?
            </text>
            <g opacity={pat} transform={`translate(${cx} ${cy}) scale(${0.7 + 0.3 * pat})`}>
              <circle cx={0} cy={-34} r={30} fill={C.ink} />
              <path d="M -58 52 C -58 4, 58 4, 58 52 Z" fill={C.ink} />
              <text x={0} y={92} textAnchor="middle" style={{ ...lbl, fontSize: 20, fill: C.text }}>
                PACIENTE
              </text>
            </g>
          </g>
        );
      }}
    </Block>
  );
};

/* ───────────── 2. Papers y gráfico de barras ───────────── */

const Papers: React.FC = () => {
  const bars = [
    { label: "Colágeno", at: timeOf("Más", 18), from: 0.25, to: 0.95, color: C.teal, arrow: "↑" },
    { label: "Inflamación", at: timeOf("menos", 18), from: 0.8, to: 0.25, color: C.goldMuted, arrow: "↓" },
    { label: "Remodelación", at: timeOf("mejor", 18), from: 0.3, to: 0.8, color: C.teal, arrow: "↑" },
  ];
  return (
    <Block from={T(18.75)} to={T(29.0)}>
      {(t) => (
        <g>
          {[0, 1, 2].map((i) => {
            const p = prog(t, T(18.9) + i * 0.25, 0.7);
            const x = 120 + i * 26;
            const y = 120 + i * 22 - (1 - p) * 300;
            return (
              <g key={i} opacity={p} transform={`rotate(${-6 + i * 4} ${x + 140} ${y + 180})`}>
                <rect x={x} y={y} width={280} height={360} rx={6} fill={C.white} stroke={C.line} strokeWidth={2} />
                {[0, 1, 2, 3, 4, 5, 6].map((l) => (
                  <rect key={l} x={x + 30} y={y + 50 + l * 38} width={l % 3 === 2 ? 140 : 220} height={10} rx={5} fill={l === 0 ? C.goldMuted : C.line} />
                ))}
              </g>
            );
          })}
          <g transform="translate(520 80)">
            <rect x={0} y={0} width={480} height={540} rx={6} fill={C.white} stroke={C.line} strokeWidth={2} />
            <line x1={50} y1={440} x2={450} y2={440} stroke={C.ink} strokeWidth={2} />
            {bars.map((b, i) => {
              const shown = prog(t, b.at - 0.4, 0.4);
              const h = 340 * interpolate(prog(t, b.at, 0.9), [0, 1], [b.from, b.to]) * shown;
              const x = 62 + i * 140;
              return (
                <g key={b.label} opacity={shown}>
                  <rect x={x} y={440 - h} width={84} height={h} rx={4} fill={b.color} />
                  <text x={x + 42} y={440 - h - 16} textAnchor="middle" style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, fill: b.color }}>
                    {b.arrow}
                  </text>
                  <text x={x + 42} y={480} textAnchor="middle" style={{ fontFamily: sans, fontSize: 19, fill: C.text }}>
                    {b.label}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      )}
    </Block>
  );
};

/* ───────────── 3. Ojo + conflicto de intereses ───────────── */

const Eye: React.FC = () => {
  const ojo = timeOf("Ojo");
  const money = timeOf("Los", 30);
  return (
    <Block from={ojo - 0.15} to={35.6}>
      {(t) => {
        const draw = prog(t, ojo, 0.6);
        const blinkT = t - (ojo + 0.9);
        const blink = blinkT > 0 && blinkT < 0.25 ? 1 - Math.sin((blinkT / 0.25) * Math.PI) * 0.9 : 1;
        const eyeOut = prog(t, money - 0.3, 0.5);
        const link = prog(t, money, 0.8);
        return (
          <g>
            <g opacity={1 - eyeOut} transform={`translate(540 340) scale(${1 - 0.3 * eyeOut}) scale(1 ${blink})`}>
              <path d="M -300 0 Q 0 -230 300 0 Q 0 230 -300 0 Z" fill={C.white} stroke={C.ink} strokeWidth={6} strokeDasharray={1400} strokeDashoffset={1400 * (1 - draw)} />
              <circle r={95 * prog(t, ojo + 0.3, 0.5)} fill={C.teal} />
              <circle r={45 * prog(t, ojo + 0.4, 0.5)} fill={C.ink} />
              <circle cx={28} cy={-30} r={16 * prog(t, ojo + 0.5, 0.4)} fill={C.white} />
            </g>
            <g opacity={link}>
              <g transform={`translate(${130 - (1 - link) * 80} 170)`}>
                <rect width={300} height={380} rx={6} fill={C.white} stroke={C.line} strokeWidth={2} />
                <text x={30} y={60} style={{ ...lbl, fontSize: 22, fill: C.teal }}>ESTUDIO</text>
                {[0, 1, 2, 3, 4].map((l) => (
                  <rect key={l} x={30} y={95 + l * 44} width={l === 4 ? 140 : 240} height={12} rx={6} fill={C.line} />
                ))}
              </g>
              <g transform={`translate(${650 + (1 - link) * 80} 230)`}>
                <path d="M 0 0 H 230 L 300 130 L 230 260 H 0 Z" fill={C.ink} />
                <circle cx={250} cy={130} r={16} fill={C.cream} />
                <text x={110} y={145} textAnchor="middle" style={{ ...lbl, fontSize: 34, fill: C.goldLight }}>MARCA</text>
              </g>
              <path d="M 650 360 C 560 300, 520 300, 430 360" fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray="8 10" />
              {[0, 1, 2].map((i) => {
                const k = ((t - money) * 0.7 + i / 3) % 1;
                const x = 650 - 220 * k;
                const y = 360 - Math.sin(k * Math.PI) * 50;
                return (
                  <g key={i} opacity={t > money + 0.5 ? 1 : 0}>
                    <circle cx={x} cy={y} r={26} fill={C.goldLight} stroke={C.gold} strokeWidth={3} />
                    <text x={x} y={y + 10} textAnchor="middle" style={{ fontFamily: sans, fontWeight: 700, fontSize: 28, fill: C.ink }}>$</text>
                  </g>
                );
              })}
            </g>
          </g>
        );
      }}
    </Block>
  );
};

/* ───────────── 4. Filtro: solo estudios independientes ───────────── */

const Funnel: React.FC = () => {
  const from = T(35.65);
  return (
    <Block from={from} to={T(39.35)}>
      {(t) => {
        const dots = Array.from({ length: 26 }, (_, i) => i);
        return (
          <g>
            <path d="M 260 170 H 820 L 600 420 V 540 H 480 V 420 Z" fill={C.white} stroke={C.ink} strokeWidth={4} strokeLinejoin="round" />
            {dots.map((i) => {
              const start = from + 0.1 + random(`d${i}`) * 2.2;
              const k = (t - start) / 0.9;
              if (k < 0) return null;
              const passes = i % 8 === 0;
              const x0 = 280 + random(`x${i}`) * 520;
              const y = interpolate(k, [0, 1], [20, passes ? 640 : 330], clamp);
              const x = passes ? interpolate(k, [0.2, 0.8], [x0, 540], clamp) : x0;
              const fade = passes ? 1 : interpolate(k, [0.9, 1.3], [1, 0], clamp);
              return <circle key={i} cx={x} cy={y} r={14} fill={passes && k > 0.7 ? C.gold : C.goldMuted} opacity={fade} />;
            })}
            <g opacity={prog(t, T(37.6), 0.4)} transform={`translate(700 610) scale(${Math.min(1.1, pop(t, T(37.6)))})`}>
              <circle r={44} fill={C.teal} />
              <path d="M -18 0 L -4 14 L 20 -12" fill="none" stroke={C.white} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        );
      }}
    </Block>
  );
};

/* ───────────── 5. Corte de piel: CaHA (soporte) y PLLA (grosor) ───────────── */

const Skin: React.FC = () => {
  const from = T(39.45);
  const spheres = timeOf("hidroxiapatita", 39);
  const regen = timeOf("regenerar");
  const soporte = timeOf("soporte");
  const sosten = timeOf("pérdida");
  const plla = timeOf("ácido", 49);
  const mejora = timeOf("mejora");
  const progresiva = timeOf("progresiva");
  return (
    <Block from={from} to={T(55.4)}>
      {(t) => {
        const L = 90;
        const R = 990;
        const lift = prog(t, soporte, 1.2);
        const thick = interpolate(t, [mejora, progresiva + 0.6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
        const caha = 1 - prog(t, plla - 0.2, 0.6);
        const sag = 60 * (1 - lift) * (1 - prog(t, plla, 0.6)) + 0;
        const top = 160 - 40 * thick;
        const epiH = 50;
        const dermBottom = 470;
        const hypoBottom = 640;
        const surface = (y: number, amp: number) => {
          const pts = Array.from({ length: 13 }, (_, i) => {
            const x = L + ((R - L) / 12) * i;
            const s = Math.sin((i / 12) * Math.PI);
            return `${x},${y + s * amp + Math.sin(i * 1.7 + t * 1.5) * 4}`;
          });
          return pts.join(" L ");
        };
        const epi = `M ${surface(top, sag)} L ${R},${top + epiH + sag * 0.2} L ${L},${top + epiH + sag * 0.2} Z`;
        const derm = `M ${surface(top + epiH, sag * 0.85)} L ${R},${dermBottom} L ${L},${dermBottom} Z`;
        return (
          <g>
            <rect x={L} y={dermBottom} width={R - L} height={hypoBottom - dermBottom} fill="#FBF0D9" />
            {Array.from({ length: 9 }, (_, i) => (
              <circle key={i} cx={L + 55 + i * 100} cy={dermBottom + 85 + (i % 2) * 20} r={42} fill="#F6E3B9" stroke="#EBD49F" strokeWidth={2} />
            ))}
            <path d={derm} fill="#F7E4DA" />
            <path d={epi} fill="#EFC9B8" />
            {/* Fibras de colágeno */}
            {Array.from({ length: 7 }, (_, i) => {
              const at = regen + i * 0.18;
              const d = prog(t, at, 1.1);
              const y = top + epiH + 50 + i * ((dermBottom - top - epiH - 70) / 6);
              const path = `M ${L + 20} ${y} C ${L + 250} ${y - 30}, ${L + 400} ${y + 30}, 540 ${y} S ${R - 150} ${y - 30}, ${R - 20} ${y}`;
              return <path key={i} d={path} fill="none" stroke={C.gold} strokeWidth={4} strokeLinecap="round" opacity={0.75} strokeDasharray={1000} strokeDashoffset={1000 * (1 - d)} />;
            })}
            {/* Fibras elásticas (PLLA) */}
            {Array.from({ length: 5 }, (_, i) => {
              const d = prog(t, mejora + i * 0.3, 1.0);
              const y = top + epiH + 80 + i * 60;
              const pts = Array.from({ length: 40 }, (_, k) => {
                const x = L + 30 + k * 21;
                return `${x},${y + Math.sin(k * 0.6 + t * 4 + i) * 12}`;
              }).join(" L ");
              return <path key={i} d={`M ${pts}`} fill="none" stroke={C.teal} strokeWidth={3} opacity={0.7 * d} />;
            })}
            {/* Microesferas CaHA */}
            {Array.from({ length: 14 }, (_, i) => {
              const at = spheres + 0.3 + i * 0.07;
              const s = Math.min(1.1, pop(t, at)) * caha;
              const x = L + 60 + random(`sx${i}`) * (R - L - 120);
              const y = dermBottom - 40 + random(`sy${i}`) * 110;
              return <circle key={i} cx={x} cy={y} r={16 * s} fill={C.white} stroke={C.teal} strokeWidth={4} />;
            })}
            {/* Flechas de soporte */}
            {[0, 1, 2].map((i) => {
              const p = prog(t, soporte + i * 0.15, 0.6) * caha;
              const x = 300 + i * 240;
              return (
                <g key={i} opacity={p} transform={`translate(${x} ${dermBottom - 70 - 50 * p})`}>
                  <path d="M 0 60 V 0 M -18 18 L 0 0 L 18 18" fill="none" stroke={C.teal} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              );
            })}
            {/* Etiquetas */}
            <g opacity={prog(t, sosten, 0.5) * caha}>
              <rect x={R - 330} y={hypoBottom + 20} width={330} height={52} rx={4} fill={C.ink} />
              <text x={R - 165} y={hypoBottom + 55} textAnchor="middle" style={{ ...lbl, fontSize: 22, fill: C.goldLight }}>SOSTÉN PROFUNDO</text>
            </g>
            <g opacity={prog(t, mejora, 0.5)}>
              <line x1={L - 30} y1={top} x2={L - 30} y2={dermBottom} stroke={C.ink} strokeWidth={3} />
              <line x1={L - 42} y1={top} x2={L - 18} y2={top} stroke={C.ink} strokeWidth={3} />
              <line x1={L - 42} y1={dermBottom} x2={L - 18} y2={dermBottom} stroke={C.ink} strokeWidth={3} />
              <rect x={L} y={hypoBottom + 20} width={360} height={52} rx={4} fill={C.teal} />
              <text x={L + 180} y={hypoBottom + 55} textAnchor="middle" style={{ ...lbl, fontSize: 22, fill: C.white }}>
                GROSOR +{Math.round(thick * 100)}%
              </text>
            </g>
            <text x={L} y={top - 24} style={{ ...lbl, fontSize: 20, fill: C.text }}>PIEL · CORTE</text>
          </g>
        );
      }}
    </Block>
  );
};

/* ───────────── 6. Reconstitución + riesgo de granulomas ───────────── */

const Reconstitution: React.FC = () => {
  const from = T(55.5);
  const risk = timeOf("riesgo", 59);
  const steps = [
    { text: "Volumen exacto", at: timeOf("respetar", 55) + 0.6 },
    { text: "Tiempo de hidratación", at: timeOf("pie", 55) + 0.3 },
    { text: "Homogeneizar", at: timeOf("reconstitución", 55) + 0.2 },
  ];
  return (
    <Block from={from} to={T(65.1)}>
      {(t) => {
        const fill = prog(t, from + 0.3, 3.2);
        const plunger = prog(t, from + 0.3, 3.2);
        const warn = Math.min(1.1, pop(t, risk));
        const pulse = 1 + 0.06 * Math.sin((t - risk) * 6) * (t > risk ? 1 : 0);
        return (
          <g>
            {/* Vial */}
            <g transform="translate(150 140)">
              <rect x={35} y={0} width={130} height={50} rx={6} fill={C.ink} />
              <rect x={20} y={46} width={160} height={24} rx={4} fill={C.goldMuted} />
              <path d="M 10 70 H 190 V 400 Q 190 430 160 430 H 40 Q 10 430 10 400 Z" fill="rgba(255,255,255,.9)" stroke={C.ink} strokeWidth={4} />
              <rect x={14} y={426 - 300 * fill} width={172} height={300 * fill} fill={C.teal} opacity={0.35} />
              {Array.from({ length: 16 }, (_, i) => (
                <circle key={i} cx={30 + random(`p${i}`) * 140} cy={360 + random(`q${i}`) * 55} r={6} fill={C.text} opacity={0.6 * (1 - fill)} />
              ))}
            </g>
            {/* Jeringa */}
            <g transform={`translate(330 ${90 + 30 * (1 - prog(t, from, 0.5))}) rotate(28)`}>
              <rect x={0} y={0} width={44} height={230} rx={6} fill={C.white} stroke={C.ink} strokeWidth={4} />
              <rect x={4} y={20 + 180 * plunger} width={36} height={206 - 180 * plunger} fill={C.teal} opacity={0.35} />
              <rect x={14} y={-90 + 180 * plunger} width={16} height={110} fill={C.ink} />
              <rect x={-12} y={-100 + 180 * plunger} width={68} height={14} rx={4} fill={C.ink} />
              <line x1={22} y1={230} x2={22} y2={300} stroke={C.ink} strokeWidth={4} />
            </g>
            {/* Protocolo */}
            <g transform="translate(560 120)">
              <rect width={440} height={330} rx={6} fill={C.white} stroke={C.line} strokeWidth={2} />
              <text x={34} y={60} style={{ ...lbl, fontSize: 22, fill: C.teal }}>PROTOCOLO</text>
              {steps.map((s, i) => {
                const p = prog(t, s.at, 0.5);
                return (
                  <g key={s.text} transform={`translate(34 ${110 + i * 72})`} opacity={0.35 + 0.65 * p}>
                    <rect width={40} height={40} rx={4} fill={p > 0.5 ? C.teal : "none"} stroke={C.teal} strokeWidth={3} />
                    <path d="M 9 20 L 17 28 L 31 12" fill="none" stroke={C.white} strokeWidth={5} strokeLinecap="round" strokeDasharray={40} strokeDashoffset={40 * (1 - p)} />
                    <text x={60} y={30} style={{ fontFamily: sans, fontSize: 30, fill: C.ink }}>{s.text}</text>
                  </g>
                );
              })}
            </g>
            {/* Alerta */}
            <g opacity={Math.min(1, warn)} transform={`translate(780 560) scale(${warn * pulse})`}>
              <path d="M 0 -95 L 105 80 H -105 Z" fill={C.marker} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
              <rect x={-7} y={-40} width={14} height={70} rx={7} fill={C.ink} />
              <circle cx={0} cy={55} r={9} fill={C.ink} />
            </g>
            <g opacity={prog(t, risk + 0.3, 0.5)}>
              <text x={640} y={705} textAnchor="end" style={{ ...lbl, fontSize: 26, fill: C.ink }}>GRANULOMAS</text>
            </g>
          </g>
        );
      }}
    </Block>
  );
};

/* ───────────── 7. Mitad producto / mitad tu mano ───────────── */

const Half: React.FC = () => {
  const a = timeOf("mitad", 65);
  const b = timeOf("otra", 68);
  return (
    <Block from={T(65.2)} to={T(71.4)}>
      {(t) => {
        const r = 230;
        const cx = 540;
        const cy = 340;
        const arc = (p: number, start: number) => {
          const a0 = start;
          const a1 = start + Math.PI * p;
          const x0 = cx + r * Math.cos(a0);
          const y0 = cy + r * Math.sin(a0);
          const x1 = cx + r * Math.cos(a1);
          const y1 = cy + r * Math.sin(a1);
          return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1} Z`;
        };
        const pa = prog(t, a - 0.3, 1.0);
        const pb = prog(t, b, 1.0);
        return (
          <g>
            <circle cx={cx} cy={cy} r={r} fill={C.white} stroke={C.line} strokeWidth={3} />
            {pa > 0.001 && <path d={arc(pa, Math.PI / 2)} fill={C.goldLight} />}
            {pb > 0.001 && <path d={arc(pb, -Math.PI / 2)} fill={C.teal} />}
            <line x1={cx} y1={cy - r - 20} x2={cx} y2={cy + r + 20} stroke={C.ink} strokeWidth={3} opacity={pa} />
            <g opacity={pa}>
              <text x={cx - r - 40} y={cy - 10} textAnchor="end" style={{ fontFamily: serif, fontSize: 64, fill: C.gold, fontStyle: "italic" }}>50%</text>
              <text x={cx - r - 40} y={cy + 34} textAnchor="end" style={{ ...lbl, fontSize: 22, fill: C.text }}>PRODUCTO</text>
            </g>
            <g opacity={pb}>
              <text x={cx + r + 40} y={cy - 10} style={{ fontFamily: serif, fontSize: 64, fill: C.teal, fontStyle: "italic" }}>50%</text>
              <text x={cx + r + 40} y={cy + 34} style={{ ...lbl, fontSize: 22, fill: C.text }}>TU MANO</text>
            </g>
          </g>
        );
      }}
    </Block>
  );
};

/* ───────────── 8. Curva de aprendizaje ───────────── */

const Learning: React.FC = () => {
  const from = T(71.45);
  const crit = timeOf("criterio");
  const seg = timeOf("seguridad");
  const pts = [
    [140, 560],
    [300, 520],
    [440, 430],
    [580, 300],
    [740, 200],
    [920, 150],
  ];
  const d = `M ${pts[0][0]} ${pts[0][1]} ` + pts.slice(1).map(([x, y]) => `L ${x} ${y}`).join(" ");
  return (
    <Block from={from} to={T(79.1)}>
      {(t) => {
        const draw = prog(t, from + 0.3, 3.0);
        return (
          <g>
            <line x1={120} y1={600} x2={960} y2={600} stroke={C.ink} strokeWidth={3} />
            <line x1={120} y1={600} x2={120} y2={110} stroke={C.ink} strokeWidth={3} />
            <text x={960} y={645} textAnchor="end" style={{ ...lbl, fontSize: 20, fill: C.text }}>PRÁCTICA SUPERVISADA →</text>
            <text x={140} y={100} style={{ ...lbl, fontSize: 20, fill: C.text }}>↑ RESULTADOS</text>
            <path d={d} fill="none" stroke={C.teal} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1200} strokeDashoffset={1200 * (1 - draw)} />
            {pts.map(([x, y], i) => {
              const p = Math.min(1.1, pop(t, from + 0.3 + (3.0 * i) / (pts.length - 1)));
              return <circle key={i} cx={x} cy={y} r={14 * p} fill={C.white} stroke={C.teal} strokeWidth={5} />;
            })}
            {[
              { text: "CRITERIO", at: crit, x: 300, y: 250 },
              { text: "SEGURIDAD", at: seg, x: 520, y: 470 },
            ].map((b) => {
              const p = Math.min(1.08, pop(t, b.at));
              return (
                <g key={b.text} opacity={Math.min(1, p)} transform={`translate(${b.x} ${b.y}) scale(${p})`}>
                  <rect x={-130} y={-36} width={260} height={72} rx={36} fill={C.ink} />
                  <circle cx={-92} cy={0} r={18} fill={C.goldLight} />
                  <text x={20} y={9} textAnchor="middle" style={{ ...lbl, fontSize: 24, fill: C.white }}>{b.text}</text>
                </g>
              );
            })}
          </g>
        );
      }}
    </Block>
  );
};

/* ───────────── Fondo animado ───────────── */

export const GraphicsBackdrop: React.FC<{ opacity: number }> = ({ opacity }) => {
  const t = useSeconds();
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: 1000, opacity, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${C.line} 2px, transparent 2px)`,
          backgroundSize: "34px 34px",
          backgroundPosition: `0 ${-t * 8}px`,
          maskImage: "linear-gradient(to bottom, black 60%, transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: 450,
          left: 90 + Math.sin(t * 0.4) * 120,
          top: 50 + Math.cos(t * 0.3) * 80,
          background: `radial-gradient(circle, rgba(229,196,106,.28), rgba(229,196,106,0) 65%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: 350,
          left: 400 + Math.cos(t * 0.35) * 140,
          top: 250 + Math.sin(t * 0.25) * 90,
          background: `radial-gradient(circle, rgba(74,147,168,.16), rgba(74,147,168,0) 65%)`,
        }}
      />
    </div>
  );
};

export const MotionGraphics: React.FC = () => (
  <>
    <Orbit />
    <Papers />
    <Eye />
    <Funnel />
    <Skin />
    <Reconstitution />
    <Half />
    <Learning />
  </>
);
