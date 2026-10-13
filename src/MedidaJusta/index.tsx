import React from "react";
import { AbsoluteFill, Easing, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Eyebrow, Headline, Scene, useAppear, useSeconds } from "../Bioestimuladores/components";
import { GraphicsBackdrop } from "../Bioestimuladores/graphics";
import { C, mono, sans, serif } from "../Bioestimuladores/theme";
import { InstagramGlyph, INSTAGRAM, Monogram } from "../lib/brand";
import { SfxEvent, Soundtrack } from "../lib/Soundtrack";
import { KEEP, PAGES, SEGMENTS, T, timeOf, VOICE_SECONDS } from "./transcript";

export const END_CARD_AT = VOICE_SECONDS + 0.15;
export const DURATION_SECONDS = END_CARD_AT + 3.2;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (t: number, at: number, dur = 0.5) => interpolate(t, [at, at + dur], [0, 1], { ...clamp, easing: ease });

// Mejilla de Paola en el cuadro (para la mira de "en el lugar justo").
const CHEEK = { x: 590, y: 855 };
const FACE = "47% 39%";

/* ───────────── Video con cortes, punch-ins y temblor en "se nota" ───────────── */

const ZOOMS = [1.0, 1.13, 1.04, 1.16, 1.06];

const Clip: React.FC<{ startFrame: number; zoom: number; index: number }> = ({ startFrame, zoom, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame / fps;
  // El gancho entra con un zoom rápido; el resto con una deriva suave.
  const intro = index === 0 ? interpolate(local, [0, 0.5], [1.12, 1], { ...clamp, easing: ease }) : 1;
  const drift = 1 + frame * 0.0006;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("video2/fuente.mp4")}
        trimBefore={startFrame}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom * drift * intro})`, transformOrigin: FACE }}
      />
    </AbsoluteFill>
  );
};

const TalkingHead: React.FC = () => {
  const { fps } = useVideoConfig();
  const t = useSeconds();
  const nota = timeOf("se", 11);
  const shake = t > nota && t < nota + 0.45 ? Math.sin(t * 90) * 10 * (1 - (t - nota) / 0.45) : 0;
  return (
    <AbsoluteFill style={{ transform: `translateX(${shake}px)` }}>
      {KEEP.map(([s, e], i) => {
        const from = Math.round(T(s) * fps);
        const dur = Math.round(T(e) * fps) - from;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <Clip startFrame={Math.round(s * fps)} zoom={ZOOMS[i % ZOOMS.length]} index={i} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/* ───────────── Marca y subtítulos ───────────── */

const Header: React.FC = () => {
  const p = useAppear(0.2);
  return (
    <div
      style={{
        position: "absolute",
        top: 96,
        left: 56,
        display: "flex",
        alignItems: "center",
        gap: 14,
        opacity: p,
        padding: "8px 22px 8px 8px",
        borderRadius: 60,
        background: "rgba(27,24,21,0.72)",
      }}
    >
      <Monogram size={58} light />
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: sans, fontWeight: 600, fontSize: 27, color: C.white }}>
        <InstagramGlyph size={27} color={C.white} />
        {INSTAGRAM}
      </div>
    </div>
  );
};

// Fondo blanco: subtítulos en tinta con halo blanco y resaltador amarillo.
const Captions: React.FC = () => {
  const t = useSeconds();
  const page = PAGES.find((p, i) => t >= p.start - 0.05 && t < (PAGES[i + 1]?.start ?? p.end + 0.6) && t < p.end + 0.6);
  if (!page || t > END_CARD_AT) return null;
  const enter = interpolate(t, [page.start - 0.05, page.start + 0.12], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 1430,
        left: 60,
        right: 60,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "4px 14px",
        fontFamily: sans,
        fontWeight: 800,
        fontSize: 62,
        lineHeight: 1.22,
        color: C.ink,
        textShadow: "0 0 18px rgba(255,255,255,.95), 0 0 4px rgba(255,255,255,.9)",
        opacity: enter,
        transform: `scale(${0.94 + 0.06 * enter})`,
      }}
    >
      {page.words.map((w, i) => {
        const active = t >= w.start && t < w.end + 0.05;
        return (
          <span key={i} style={{ padding: "0 8px", borderRadius: 4, background: active ? C.marker : "transparent", textShadow: active ? "none" : undefined }}>
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/* ───────────── Motion graphics ───────────── */

// Zona superior, sobre la pared blanca.
const Top: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <div style={{ position: "absolute", top: 200, left: 0, right: 0, height: 380 }}>
    <Scene from={from} to={to}>
      {children}
    </Scene>
  </div>
);

const DarkCard: React.FC<{ children: React.ReactNode; at: number; style?: React.CSSProperties }> = ({ children, at, style }) => {
  const p = useAppear(at, 16);
  return (
    <div
      style={{
        background: C.ink,
        borderRadius: 6,
        padding: "26px 40px",
        boxShadow: "0 20px 50px rgba(27,24,21,.35)",
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 40}px) scale(${0.92 + 0.08 * p})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// "Más producto ≠ mejor resultado"
const NotEqual: React.FC = () => {
  const t = useSeconds();
  const a = timeOf("más", 3);
  const neq = timeOf("no", 3);
  const b = timeOf("mejor", 3);
  const ne = Math.min(1.15, 1 - Math.exp(-8 * Math.max(0, t - neq)) * Math.cos(12 * Math.max(0, t - neq))) * (t > neq ? 1 : 0);
  const line = (at: number): React.CSSProperties => ({
    fontFamily: sans,
    fontWeight: 800,
    fontSize: 64,
    letterSpacing: "0.02em",
    color: C.white,
    opacity: prog(t, at, 0.3),
    transform: `translateY(${(1 - prog(t, at, 0.4)) * 20}px)`,
  });
  return (
    <DarkCard at={a - 0.05} style={{ width: 860 }}>
      <div style={line(a)}>MÁS PRODUCTO</div>
      <div style={{ fontFamily: serif, fontSize: 110, lineHeight: 0.9, color: C.goldLight, transform: `scale(${ne})`, height: 100 }}>≠</div>
      <div style={{ ...line(b), color: C.marker }}>MEJOR RESULTADO</div>
    </DarkCard>
  );
};

// Medidor que oscila y se asienta en el centro: "la medida justa".
const Gauge: React.FC = () => {
  const t = useSeconds();
  const at = timeOf("medida", 6);
  const x = Math.max(0, t - at + 0.6);
  const angle = -70 * Math.exp(-2.6 * x) * Math.cos(7 * x);
  const ticks = Array.from({ length: 19 }, (_, i) => -90 + i * 10);
  const hit = prog(t, at + 0.9, 0.3);
  return (
    <svg viewBox="0 0 420 240" width={420} height={240} style={{ overflow: "visible" }}>
      <path d="M 30 210 A 180 180 0 0 1 390 210" fill="none" stroke={C.line} strokeWidth={18} strokeLinecap="round" />
      <path d="M 165 39 A 180 180 0 0 1 255 39" fill="none" stroke={C.goldLight} strokeWidth={18} strokeLinecap="round" opacity={0.4 + 0.6 * hit} />
      {ticks.map((a) => {
        const r1 = 150;
        const r2 = a % 30 === 0 ? 128 : 138;
        const rad = ((a - 90) * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={210 + r1 * Math.cos(rad)}
            y1={210 + r1 * Math.sin(rad)}
            x2={210 + r2 * Math.cos(rad)}
            y2={210 + r2 * Math.sin(rad)}
            stroke={C.ink}
            strokeWidth={a % 30 === 0 ? 4 : 2}
            opacity={0.6}
          />
        );
      })}
      <g transform={`rotate(${angle} 210 210)`}>
        <line x1={210} y1={210} x2={210} y2={62} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />
      </g>
      <circle cx={210} cy={210} r={16} fill={C.gold} />
      <text x={30} y={238} textAnchor="middle" style={{ fontFamily: mono, fontSize: 18, fill: C.text }}>
        POCO
      </text>
      <text x={390} y={238} textAnchor="middle" style={{ fontFamily: mono, fontSize: 18, fill: C.text }}>
        DE MÁS
      </text>
    </svg>
  );
};

// Mira que se cierra sobre la mejilla: "en el lugar justo".
const Crosshair: React.FC = () => {
  const t = useSeconds();
  const at = timeOf("lugar", 9.5);
  if (t < at - 0.1 || t > T(10.8) + 0.3) return null;
  const p = prog(t, at - 0.1, 0.55);
  const out = 1 - prog(t, T(10.8), 0.3);
  const r = 260 - 190 * p;
  const pulse = 1 + 0.06 * Math.sin((t - at) * 12) * p;
  return (
    <svg style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, opacity: Math.min(p * 1.5, out) }} viewBox="0 0 1080 1920">
      <g transform={`translate(${CHEEK.x} ${CHEEK.y}) scale(${pulse})`}>
        <circle r={r} fill="none" stroke={C.goldLight} strokeWidth={5} />
        <circle r={r * 0.45} fill="none" stroke={C.goldLight} strokeWidth={3} strokeDasharray="8 8" />
        {[0, 90, 180, 270].map((a) => (
          <line
            key={a}
            x1={(r + 10) * Math.cos((a * Math.PI) / 180)}
            y1={(r + 10) * Math.sin((a * Math.PI) / 180)}
            x2={(r + 40) * Math.cos((a * Math.PI) / 180)}
            y2={(r + 40) * Math.sin((a * Math.PI) / 180)}
            stroke={C.goldLight}
            strokeWidth={5}
            strokeLinecap="round"
          />
        ))}
        <circle r={7} fill={C.goldLight} />
      </g>
      <g opacity={prog(t, at + 0.3, 0.3)} transform={`translate(${CHEEK.x + 110} ${CHEEK.y - 60})`}>
        <rect x={0} y={-30} width={250} height={56} rx={4} fill={C.ink} />
        <text x={125} y={8} textAnchor="middle" style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.12em", fill: C.goldLight }}>
          LUGAR JUSTO
        </text>
      </g>
    </svg>
  );
};

// "Lo demás se nota, y no para bien"
const SeNota: React.FC = () => {
  const t = useSeconds();
  const at = timeOf("se", 11);
  const bad = timeOf("no", 12.5);
  const x = Math.max(0, t - at);
  const wob = t > at ? Math.sin(x * 40) * 6 * Math.exp(-x * 3) : 0;
  const cross = Math.min(1.1, 1 - Math.exp(-8 * Math.max(0, t - bad)) * Math.cos(12 * Math.max(0, t - bad))) * (t > bad ? 1 : 0);
  return (
    <DarkCard at={T(11.2)} style={{ display: "flex", alignItems: "center", gap: 30, padding: "24px 36px" }}>
      <div style={{ textAlign: "left" }}>
        <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.14em", color: C.goldMuted }}>LO DEMÁS…</div>
        <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 76, color: C.white, transform: `rotate(${wob}deg)`, transformOrigin: "left center" }}>
          SE NOTA
        </div>
      </div>
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: 48,
          background: C.marker,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${cross})`,
        }}
      >
        <svg width={50} height={50} viewBox="0 0 50 50">
          <path d="M 12 12 L 38 38 M 38 12 L 12 38" stroke={C.ink} strokeWidth={8} strokeLinecap="round" />
        </svg>
      </div>
    </DarkCard>
  );
};

const CtaCard: React.FC = () => {
  const btn = useAppear(timeOf("escribime"), 14);
  return (
    <DarkCard at={T(15.15)} style={{ width: 880, padding: "28px 36px", textAlign: "center" }}>
      <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.14em", color: C.goldLight }}>RESULTADO</div>
      <div style={{ fontFamily: serif, fontSize: 64, color: C.white, lineHeight: 1.1, marginTop: 6 }}>
        <span style={{ fontStyle: "italic", color: C.goldLight }}>armónico</span> y <span style={{ fontStyle: "italic", color: C.goldLight }}>natural</span>
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          marginTop: 22,
          background: C.teal,
          color: C.white,
          fontFamily: sans,
          fontWeight: 700,
          fontSize: 38,
          padding: "14px 28px",
          borderRadius: 4,
          transform: `scale(${0.7 + 0.3 * btn})`,
          opacity: btn,
        }}
      >
        ESCRIBIME
        <InstagramGlyph size={34} color={C.white} />
        <span style={{ fontWeight: 600, fontSize: 32 }}>{INSTAGRAM}</span>
      </div>
    </DarkCard>
  );
};

const Overlays: React.FC = () => (
  <>
    <Top from={T(0.13)} to={T(3.3)}>
      <Eyebrow at={T(0.2)} color={C.ink}>
        Dra. Paola Limbozzi
      </Eyebrow>
      <Headline parts={["Lo que ", { em: "pocas médicas" }, " te dicen"]} at={T(0.3)} size={84} stagger={0.1} />
    </Top>
    <Top from={T(3.67)} to={T(6.27)}>
      <NotEqual />
    </Top>
    <Top from={T(6.53)} to={T(10.8)}>
      <Gauge />
      <div style={{ marginTop: 14 }}>
        <Headline parts={["La medida ", { em: "justa" }]} at={timeOf("medida", 6)} size={76} />
      </div>
    </Top>
    <Crosshair />
    <Top from={T(11.17)} to={T(13.8)}>
      <SeNota />
    </Top>
    <Top from={T(15.13)} to={END_CARD_AT}>
      <CtaCard />
    </Top>
  </>
);

/* ───────────── Cierre ───────────── */

const EndCard: React.FC = () => {
  const t = useSeconds();
  if (t < END_CARD_AT) return null;
  const p = interpolate(t, [END_CARD_AT, END_CARD_AT + 0.5], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.cream, opacity: p, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <GraphicsBackdrop opacity={1} />
      <Monogram size={170} />
      <div style={{ fontFamily: serif, fontSize: 80, color: C.ink, marginTop: 40 }}>
        Dra. Paola <span style={{ fontStyle: "italic", color: C.gold }}>Limbozzi</span>
      </div>
      <div style={{ fontFamily: mono, fontSize: 26, letterSpacing: "0.16em", color: C.teal, marginTop: 18 }}>— MEDICINA ESTÉTICA</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginTop: 50,
          background: C.ink,
          color: C.white,
          fontFamily: sans,
          fontWeight: 600,
          fontSize: 38,
          padding: "18px 32px",
          borderRadius: 60,
        }}
      >
        <InstagramGlyph size={38} color={C.goldLight} />
        {INSTAGRAM}
      </div>
      <div style={{ fontFamily: serif, fontSize: 46, color: C.text, marginTop: 56, maxWidth: 820, lineHeight: 1.25 }}>
        La medida <span style={{ fontStyle: "italic", color: C.gold }}>justa</span>, en el lugar <span style={{ fontStyle: "italic", color: C.gold }}>justo</span>.
      </div>
    </AbsoluteFill>
  );
};

const sfx = (): SfxEvent[] => [
  { at: 0, sfx: "whoosh", volume: 0.3 },
  { at: timeOf("pocas"), sfx: "pop", volume: 0.3 },
  { at: T(3.67) - 0.15, sfx: "whoosh", volume: 0.35 },
  { at: timeOf("no", 3), sfx: "impact", volume: 0.4 },
  { at: timeOf("mejor", 3), sfx: "pop-alto", volume: 0.3 },
  { at: T(6.53) - 0.15, sfx: "whoosh", volume: 0.3 },
  { at: timeOf("medida", 6) + 0.9, sfx: "ding", volume: 0.35 },
  { at: timeOf("lugar", 9.5) + 0.3, sfx: "tick", volume: 0.45 },
  { at: T(11.17) - 0.15, sfx: "whoosh", volume: 0.35 },
  { at: timeOf("no", 12.5), sfx: "warn", volume: 0.3 },
  { at: T(15.13) - 0.15, sfx: "whoosh", volume: 0.35 },
  { at: timeOf("escribime") - 1.2, sfx: "riser", volume: 0.25 },
  { at: timeOf("escribime"), sfx: "ding", volume: 0.35 },
  { at: END_CARD_AT, sfx: "sting", volume: 0.45 },
];

// Viñeta superior suave para que los títulos se lean sobre la pared.
const TopVignette: React.FC = () => (
  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 700, background: "linear-gradient(to bottom, rgba(251,249,245,.55), rgba(251,249,245,0))" }} />
);

export const MedidaJusta: React.FC = () => (
  <AbsoluteFill style={{ background: C.white }}>
    <Soundtrack voice="video2/voz.wav" music="video2/musica.m4a" segments={SEGMENTS} events={sfx()} underVoice={0.18} open={0.5} />
    <TalkingHead />
    <TopVignette />
    <Overlays />
    <Header />
    <Captions />
    <EndCard />
  </AbsoluteFill>
);
