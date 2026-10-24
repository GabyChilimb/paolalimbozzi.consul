import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  OffthreadVideo,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { InstagramGlyph } from "../../lib/brand";
import { Soundtrack, SfxEvent } from "../../lib/Soundtrack";
import { makeTimeline } from "../../lib/timeline";
import { Look, LOOKS } from "./styles";
import { Anchor, Callout, Part, ReelConfig } from "./types";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const prog = (t: number, at: number, dur = 0.5) => interpolate(t, [at, at + dur], [0, 1], { ...clamp, easing: ease });
const springy = (t: number, at: number) => {
  const x = Math.max(0, t - at);
  return t < at ? 0 : 1 - Math.exp(-7 * x) * Math.cos(11 * x);
};
const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

export const END_HOLD = 3.2;

/* ───────────── Línea de tiempo resuelta ───────────── */

type Win = { c: Callout; from: number; to: number };

export const useReel = (cfg: ReelConfig) =>
  useMemo(() => {
    const tl = makeTimeline(cfg.raw, cfg.keep);
    const at = (a: Anchor): number =>
      typeof a === "number" ? tl.T(a) : tl.timeOf(a.word, a.after ?? 0) + (a.offset ?? 0);
    const endCardAt = tl.VOICE_SECONDS + 0.15;
    const ctaAt = cfg.cta ? at(cfg.cta.at) : endCardAt;
    const starts = cfg.callouts.map((c) => at(c.at));
    const order = starts.map((s, i) => i).sort((a, b) => starts[a] - starts[b]);
    const wins: Win[] = order.map((i, k) => {
      const c = cfg.callouts[i];
      const from = starts[i];
      const next = k + 1 < order.length ? starts[order[k + 1]] : ctaAt;
      const to = c.to !== undefined ? at(c.to) : Math.min(next - 0.05, from + 3.4, ctaAt - 0.05);
      return { c, from, to: Math.max(to, from + 0.8) };
    });
    const hookTo = cfg.hook.to !== undefined ? at(cfg.hook.to) : Math.min(tl.SEGMENTS[0].end + 0.2, (wins[0]?.from ?? 99) - 0.05);
    const cuts = cfg.keep.slice(1).map(([s]) => tl.T(s));
    return { tl, at, wins, endCardAt, ctaAt, hookTo, cuts, duration: endCardAt + END_HOLD };
  }, [cfg]);

const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/* ───────────── Texto de títulos ───────────── */

const TitleText: React.FC<{ parts: Part[]; at: number; look: Look; size: number; color?: string; stagger?: number; align?: "center" | "left" }> = ({
  parts,
  at,
  look,
  size,
  color,
  stagger = 0.07,
  align = "center",
}) => {
  const t = useT();
  const tokens: { text: string; em: boolean }[] = [];
  for (const p of parts) {
    const em = typeof p !== "string";
    (typeof p === "string" ? p : p.em)
      .split(/(\s+)/)
      .filter((x) => x.length)
      .forEach((x) => tokens.push({ text: look.titleUpper ? x.toUpperCase() : x, em }));
  }
  let k = 0;
  const scale = look.titleFont.includes("Caveat") ? 1.4 : 1;
  return (
    <div
      style={{
        fontFamily: look.titleFont,
        fontSize: size * scale,
        lineHeight: look.titleUpper ? 1.14 : 1.1,
        color: color ?? look.ink,
        textAlign: align,
        maxWidth: 960,
        letterSpacing: look.titleUpper ? "0.01em" : "-0.01em",
      }}
    >
      {tokens.map((tok, i) => {
        if (/^\s+$/.test(tok.text)) return <span key={i}> </span>;
        const p = prog(t, at + k++ * stagger, 0.4);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * 26}px) scale(${0.9 + 0.1 * p})`,
              color: tok.em ? look.accent : undefined,
              fontStyle: tok.em && look.emItalic ? "italic" : "normal",
            }}
          >
            {tok.text}
          </span>
        );
      })}
    </div>
  );
};

const Eyebrow: React.FC<{ text: string; look: Look; color?: string; at: number }> = ({ text, look, color, at }) => {
  const t = useT();
  const p = prog(t, at, 0.4);
  const c = color ?? look.accent;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, opacity: p, marginBottom: 18 }}>
      <span style={{ width: 44 * p, height: 2, background: c }} />
      <span style={{ fontFamily: look.eyebrowFont, fontSize: 26, letterSpacing: "0.14em", color: c, textTransform: "uppercase" }}>{text}</span>
    </div>
  );
};

/* ───────────── Video con zooms y cortes ───────────── */

const Clip: React.FC<{ src: string; startFrame: number; zoom: (frameInClip: number) => number; look: Look; face: string; index: number; pan: number }> = ({
  src,
  startFrame,
  zoom,
  look,
  face,
  index,
  pan,
}) => {
  const frame = useCurrentFrame();
  const k = Math.min(1, frame / 7);
  const e = 1 - (1 - k) ** 3;
  let extraScale = 1;
  let blur = 0;
  let tx = 0;
  let hue = 0;
  if (index > 0) {
    if (look.cut === "zoomblur") {
      extraScale = 1 + 0.09 * (1 - e);
      blur = 9 * (1 - e);
    } else if (look.cut === "whip") {
      tx = -140 * (1 - e);
      blur = 12 * (1 - e);
    } else if (look.cut === "glitch" && frame < 5) {
      tx = (random(`g${index}-${frame}`) - 0.5) * 60;
      hue = 40 * (random(`h${index}-${frame}`) - 0.5);
    }
  }
  const filter = `${look.grade}${blur > 0.1 ? ` blur(${blur.toFixed(1)}px)` : ""}${hue ? ` hue-rotate(${hue}deg)` : ""}`;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile(src)}
        trimBefore={startFrame}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `translateX(${tx + pan}px) scale(${zoom(frame) * extraScale})`,
          transformOrigin: face,
          filter,
        }}
      />
    </AbsoluteFill>
  );
};

const TalkingHead: React.FC<{ cfg: ReelConfig; look: Look; emphasis: number[] }> = ({ cfg, look, emphasis }) => {
  const { fps } = useVideoConfig();
  const t = useT();
  const { tl } = useReel(cfg);
  const a = look.zoomAmount;
  const face = `${(cfg.face?.x ?? 0.5) * 100}% ${(cfg.face?.y ?? 0.4) * 100}%`;
  // Zoom de énfasis cuando entra un "big" o un "stamp".
  let emph = 0;
  for (const e of emphasis) {
    if (t >= e && t < e + 1.2) emph = Math.max(emph, 0.08 * Math.exp(-(t - e) * 2.5) * Math.min(1, (t - e) * 12));
  }
  const flick = look.flicker && random(`f${Math.floor(t * 8)}`) > 0.86 ? 0.82 + random(`fv${Math.floor(t * 8)}`) * 0.1 : 1;
  const punch = [0, 1, 0.3, 1.1, 0.5, 0.8];
  return (
    <AbsoluteFill style={{ transform: `scale(${1 + emph})`, transformOrigin: face, filter: flick !== 1 ? `brightness(${flick})` : undefined }}>
      {cfg.keep.map(([s, e], i) => {
        const from = Math.round(tl.T(s) * fps);
        const dur = Math.round(tl.T(e) * fps) - from;
        const segStart = tl.T(s);
        const zoom = (f: number) => {
          const g = segStart + f / fps;
          if (look.zoom === "punch") return 1 + a * punch[i % punch.length] + f * 0.0005;
          if (look.zoom === "push") return 1 + a * (0.3 + 0.7 * ((g * 0.06) % 1));
          if (look.zoom === "breath") return 1 + a * (0.5 + 0.5 * Math.sin(g * 0.5));
          return 1 + a * 0.7;
        };
        const pan = look.zoom === "pan" ? Math.sin(segStart * 0.4 + i) * 30 + Math.sin(t * 0.3) * 20 : 0;
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, dur)} layout="none">
            <Clip src={`reels/${cfg.dir}/fuente.mp4`} startFrame={Math.round(s * fps)} zoom={zoom} look={look} face={face} index={i} pan={pan} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/* ───────────── Efectos visuales ───────────── */

const Fx: React.FC<{ look: Look; cuts: number[]; duration: number; endCardAt: number }> = ({ look, cuts, duration, endCardAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  // Corte más cercano ya ocurrido.
  const lastCut = cuts.filter((c) => c <= t).pop();
  const sinceCut = lastCut === undefined ? 99 : (t - lastCut) * fps;
  const flash = look.cut === "flash" && sinceCut < 6 ? 0.75 * (1 - sinceCut / 6) : 0;
  const dip = look.cut === "dip" && sinceCut < 8 ? 0.9 * (1 - sinceCut / 8) : 0;
  const glitch = look.cut === "glitch" && sinceCut < 5;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {look.tint && <AbsoluteFill style={{ background: look.tint.color, mixBlendMode: look.tint.blend as React.CSSProperties["mixBlendMode"], opacity: look.tint.opacity }} />}
      {look.leak && (
        <div
          style={{
            position: "absolute",
            width: 1400,
            height: 1400,
            borderRadius: 700,
            left: -500 + Math.sin(t * 0.35) * 260,
            top: -300 + Math.cos(t * 0.27) * 200,
            background: "radial-gradient(circle, rgba(255,190,110,.55), rgba(255,140,60,0) 60%)",
            mixBlendMode: "screen",
            opacity: 0.35 + 0.2 * Math.sin(t * 0.8),
          }}
        />
      )}
      {look.particles !== "none" && <ParticleField kind={look.particles} t={t} look={look} />}
      {look.vignette > 0 && (
        <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 45%, rgba(0,0,0,${look.vignette}) 100%)` }} />
      )}
      {look.grain > 0 && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: look.grain, mixBlendMode: "overlay" }}>
          <filter id={`n${frame % 12}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame % 12} />
          </filter>
          <rect width="100%" height="100%" filter={`url(#n${frame % 12})`} />
        </svg>
      )}
      {flash > 0 && <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />}
      {dip > 0 && <AbsoluteFill style={{ background: look.paper, opacity: dip }} />}
      {glitch &&
        Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: random(`gy${frame}-${i}`) * 1920,
              height: 10 + random(`gh${frame}-${i}`) * 50,
              background: i % 2 ? look.accent : look.accent2,
              opacity: 0.35,
              mixBlendMode: "screen",
              transform: `translateX(${(random(`gx${frame}-${i}`) - 0.5) * 200}px)`,
            }}
          />
        ))}
      {look.letterbox && t < endCardAt && (
        <>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64, background: "#000" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 64, background: "#000" }} />
        </>
      )}
      {look.progress && t < endCardAt && (
        <div style={{ position: "absolute", left: 0, top: 0, height: 10, width: `${(t / endCardAt) * 100}%`, background: look.accent }} />
      )}
      {duration > 0 ? null : null}
    </AbsoluteFill>
  );
};

const ParticleField: React.FC<{ kind: "sparkle" | "dust" | "embers"; t: number; look: Look }> = ({ kind, t, look }) => {
  const n = kind === "dust" ? 40 : 26;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: n }, (_, i) => {
        const x0 = random(`px${i}`) * 1080;
        const y0 = random(`py${i}`) * 1920;
        const sp = 0.3 + random(`ps${i}`);
        if (kind === "embers") {
          const y = (((y0 - t * 60 * sp) % 1920) + 1920) % 1920;
          const x = x0 + Math.sin(t * sp + i) * 30;
          return <circle key={i} cx={x} cy={y} r={2 + sp * 3} fill={i % 3 ? look.accent : "#FFD27A"} opacity={0.35 + 0.4 * Math.sin(t * 3 + i) ** 2} />;
        }
        if (kind === "dust") {
          const x = (x0 + t * 12 * sp) % 1080;
          const y = (y0 + Math.sin(t * 0.5 + i) * 40) % 1920;
          return <circle key={i} cx={x} cy={y} r={1.5 + sp * 1.5} fill="#FFFFFF" opacity={0.15 + 0.2 * Math.sin(t + i) ** 2} />;
        }
        const tw = Math.max(0, Math.sin(t * (1.2 + sp) + i * 1.7)) ** 6;
        const s = 6 + sp * 10;
        return (
          <g key={i} transform={`translate(${x0} ${y0 * 0.55}) scale(${tw})`} opacity={0.8}>
            <path d={`M 0 ${-s} L ${s * 0.25} 0 L 0 ${s} L ${-s * 0.25} 0 Z M ${-s} 0 L 0 ${s * 0.25} L ${s} 0 L 0 ${-s * 0.25} Z`} fill={look.accent2} />
          </g>
        );
      })}
    </svg>
  );
};

/* ───────────── Subtítulos ───────────── */

const Captions: React.FC<{ cfg: ReelConfig; look: Look; hide: (t: number) => boolean }> = ({ cfg, look, hide }) => {
  const t = useT();
  const { tl, endCardAt } = useReel(cfg);
  if (t > endCardAt || hide(t)) return null;
  const keys = new Set((cfg.keywords ?? []).map(norm));
  const isKey = (w: string) => keys.has(norm(w));

  if (look.captions === "pop") {
    const w = tl.WORDS.find((x, i) => t >= x.start - 0.03 && t < (tl.WORDS[i + 1]?.start ?? x.end + 0.4) && t < x.end + 0.4);
    if (!w) return null;
    const p = springy(t, w.start - 0.03);
    const key = isKey(w.text);
    return (
      <div style={{ position: "absolute", top: look.captionsY, left: 40, right: 40, display: "flex", justifyContent: "center" }}>
        <span
          style={{
            fontFamily: look.titleFont,
            fontSize: key ? 150 : 118,
            color: key ? look.accent : "#FFFFFF",
            textTransform: "uppercase",
            WebkitTextStroke: "10px #0A0B10",
            paintOrder: "stroke fill",
            transform: `scale(${0.6 + 0.4 * Math.min(1.08, p)}) rotate(${key ? -3 : 0}deg)`,
            textShadow: "0 8px 24px rgba(0,0,0,.45)",
            lineHeight: 1,
          }}
        >
          {w.text.replace(/[.,:;!?¡¿…]/g, "")}
        </span>
      </div>
    );
  }

  const page = tl.PAGES.find((p, i) => t >= p.start - 0.05 && t < (tl.PAGES[i + 1]?.start ?? p.end + 0.6) && t < p.end + 0.6);
  if (!page) return null;
  const enter = interpolate(t, [page.start - 0.05, page.start + 0.12], [0, 1], clamp);
  const common: React.CSSProperties = {
    position: "absolute",
    top: look.captionsY,
    left: 50,
    right: 50,
    display: "flex",
    justifyContent: "center",
    opacity: enter,
    transform: `translateY(${(1 - enter) * 14}px)`,
  };
  const words = page.words.map((w, i) => {
    const active = t >= w.start && t < w.end + 0.05;
    const key = isKey(w.text);
    if (look.captions === "marker") {
      return (
        <span key={i} style={{ padding: "0 8px", borderRadius: 4, background: active ? look.marker : "transparent", color: key && !active ? look.accent : look.ink, textShadow: active ? "none" : undefined }}>
          {w.text}
        </span>
      );
    }
    if (look.captions === "box") {
      return (
        <span key={i} style={{ color: active ? look.accent : key ? look.accent2 : look.cardInk }}>
          {w.text}
        </span>
      );
    }
    return (
      <span key={i} style={{ color: active ? look.marker : key ? look.accent : "#FFFFFF", display: "inline-block", transform: active ? "scale(1.08)" : undefined }}>
        {w.text}
      </span>
    );
  });
  if (look.captions === "marker") {
    return (
      <div style={common}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "4px 10px",
            maxWidth: 960,
            padding: "10px 18px",
            borderRadius: 12,
            background: "rgba(255,255,255,.82)",
            boxShadow: "0 10px 26px rgba(0,0,0,.18)",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 800,
            fontSize: 58,
            lineHeight: 1.22,
          }}
        >
          {words}
        </div>
      </div>
    );
  }
  if (look.captions === "box") {
    return (
      <div style={common}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2px 14px",
            maxWidth: 940,
            background: look.cardBg,
            borderRadius: 10,
            padding: "14px 26px",
            boxShadow: "0 12px 30px rgba(0,0,0,.25)",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 700,
            fontSize: 54,
            lineHeight: 1.22,
          }}
        >
          {words}
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        ...common,
        flexWrap: "wrap",
        gap: "6px 26px",
        fontFamily: '"Inter", sans-serif',
        fontWeight: 900,
        fontSize: 62,
        lineHeight: 1.2,
        WebkitTextStroke: "9px #0A0B10",
        paintOrder: "stroke fill",
        textShadow: "0 6px 18px rgba(0,0,0,.5)",
      }}
    >
      {words}
    </div>
  );
};

/* ───────────── Callouts ───────────── */

const dark = (look: Look) => {
  const h = look.cardBg.replace("#", "");
  const v = parseInt(h.slice(0, 2), 16) + parseInt(h.slice(2, 4), 16) + parseInt(h.slice(4, 6), 16);
  return v < 300;
};

const Card: React.FC<{ look: Look; at: number; children: React.ReactNode; style?: React.CSSProperties; tilt?: number }> = ({ look, at, children, style, tilt = 0 }) => {
  const t = useT();
  const p = springy(t, at);
  return (
    <div
      style={{
        background: look.cardBg,
        color: look.cardInk,
        borderRadius: 8,
        padding: "28px 38px",
        boxShadow: "0 22px 50px rgba(0,0,0,.28)",
        opacity: Math.min(1, p * 1.6),
        transform: `translateY(${(1 - Math.min(1, p)) * 50}px) scale(${0.9 + 0.1 * Math.min(1.05, p)}) rotate(${tilt}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Icon: React.FC<{ kind: "check" | "cross" | "alert" | "heart" | "star"; color: string; size: number }> = ({ kind, color, size }) => (
  <svg width={size} height={size} viewBox="0 0 50 50">
    {kind === "check" && <path d="M 11 26 L 21 36 L 40 14" stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    {kind === "cross" && <path d="M 13 13 L 37 37 M 37 13 L 13 37" stroke={color} strokeWidth={7} strokeLinecap="round" />}
    {kind === "alert" && (
      <>
        <path d="M 25 7 L 45 42 H 5 Z" fill="none" stroke={color} strokeWidth={5} strokeLinejoin="round" />
        <path d="M 25 19 V 30" stroke={color} strokeWidth={5} strokeLinecap="round" />
        <circle cx={25} cy={36} r={3} fill={color} />
      </>
    )}
    {kind === "heart" && <path d="M 25 42 C 5 28, 6 10, 18 10 C 22 10, 25 14, 25 16 C 25 14, 28 10, 32 10 C 44 10, 45 28, 25 42 Z" fill={color} />}
    {kind === "star" && <path d="M 25 5 L 31 19 L 46 20 L 34 30 L 38 45 L 25 37 L 12 45 L 16 30 L 4 20 L 19 19 Z" fill={color} />}
  </svg>
);

const TOP = { position: "absolute" as const, top: 190, left: 0, right: 0, height: 560, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "flex-start" };
const LOWER = { position: "absolute" as const, top: 1020, left: 0, right: 0, height: 360, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "flex-end" };

const CalloutView: React.FC<{ w: Win; look: Look; cfg: ReelConfig }> = ({ w, look, cfg }) => {
  const t = useT();
  const { at } = useReel(cfg);
  const { c, from, to } = w;
  if (t < from - 0.05 || t > to + 0.35) return null;
  const out = 1 - prog(t, to, 0.3);
  const ink = look.cardInk;
  const wrap = (style: React.CSSProperties, node: React.ReactNode) => <div style={{ ...style, opacity: out }}>{node}</div>;

  switch (c.kind) {
    case "big": {
      const dim = prog(t, from - 0.05, 0.25) * out;
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{ background: dark(look) ? "rgba(10,11,16,.62)" : "rgba(251,249,245,.72)", opacity: dim }} />
          <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 60, opacity: out, marginTop: -120 }}>
            {c.eyebrow && <Eyebrow text={c.eyebrow} look={look} at={from} />}
            <TitleText parts={c.parts} at={from} look={look} size={look.titleUpper ? 132 : 112} color={dark(look) ? "#FFFFFF" : look.ink} stagger={0.06} />
          </AbsoluteFill>
        </AbsoluteFill>
      );
    }
    case "card":
      return wrap(
        TOP,
        <Card look={look} at={from} style={{ maxWidth: 940, textAlign: "center" }}>
          {c.eyebrow && <Eyebrow text={c.eyebrow} look={look} at={from + 0.05} />}
          <TitleText parts={c.parts} at={from + 0.05} look={look} size={look.titleUpper ? 88 : 74} color={ink} />
          {c.sub && <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 34, marginTop: 14, opacity: 0.8 * prog(t, from + 0.4) }}>{c.sub}</div>}
        </Card>,
      );
    case "stamp": {
      const p = springy(t, from);
      const col = c.icon === "cross" || c.icon === "alert" ? "#D64545" : look.accent;
      return wrap(
        { position: "absolute", top: 300, right: 70 },
        <div
          style={{
            transform: `rotate(-10deg) scale(${1.8 - 0.8 * Math.min(1.05, p)})`,
            opacity: Math.min(1, p * 2),
            border: `8px solid ${col}`,
            borderRadius: 14,
            padding: "14px 30px",
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: "rgba(255,255,255,.88)",
            boxShadow: "0 16px 40px rgba(0,0,0,.25)",
          }}
        >
          {c.icon && <Icon kind={c.icon} color={col} size={70} />}
          <span style={{ fontFamily: look.titleFont === '"Inter", sans-serif' ? "Anton, sans-serif" : "Anton, sans-serif", fontSize: 84, color: col, letterSpacing: "0.04em" }}>{c.text.toUpperCase()}</span>
        </div>,
      );
    }
    case "list":
      return wrap(
        TOP,
        <Card look={look} at={from} style={{ width: 900, textAlign: "left" }}>
          {c.title && <TitleText parts={c.title} at={from + 0.05} look={look} size={58} color={ink} align="left" />}
          <div style={{ marginTop: c.title ? 16 : 0 }}>
            {c.items.map((it, i) => {
              const ia = at(it.at);
              const p = springy(t, ia);
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 18,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 700,
                    fontSize: 44,
                    padding: "10px 0",
                    opacity: Math.min(1, p * 1.5),
                    transform: `translateX(${(1 - Math.min(1, p)) * -60}px)`,
                  }}
                >
                  <span style={{ width: 44, height: 44, borderRadius: 22, background: look.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
                    {i + 1}
                  </span>
                  {it.text}
                </div>
              );
            })}
          </div>
        </Card>,
      );
    case "number": {
      const p = prog(t, from, 0.9);
      const num = parseFloat(c.value.replace(/[^\d.]/g, ""));
      const shown = isNaN(num) ? c.value : c.value.replace(/[\d.]+/, String(Math.round(num * p)));
      return wrap(
        TOP,
        <Card look={look} at={from} style={{ textAlign: "center", padding: "24px 60px" }}>
          <div style={{ fontFamily: "Anton, sans-serif", fontSize: 170, lineHeight: 1, color: look.accent }}>{shown}</div>
          <div style={{ fontFamily: look.eyebrowFont, fontSize: 30, letterSpacing: "0.12em", marginTop: 8, textTransform: "uppercase" }}>{c.label}</div>
        </Card>,
      );
    }
    case "quote":
      return wrap(
        TOP,
        <Card look={look} at={from} style={{ maxWidth: 920, textAlign: "center", paddingTop: 10 }}>
          <div style={{ fontFamily: '"Fraunces", serif', fontSize: 160, lineHeight: 0.8, color: look.accent, height: 90 }}>“</div>
          <TitleText parts={c.parts} at={from + 0.1} look={{ ...look, titleUpper: false, titleFont: '"Fraunces", serif', emItalic: true }} size={64} color={ink} />
        </Card>,
      );
    case "lower":
      return wrap(
        LOWER,
        <Card look={look} at={from} style={{ width: 900, textAlign: "left", display: "flex", gap: 26, alignItems: "center", padding: "24px 32px" }}>
          <div style={{ width: 8, alignSelf: "stretch", background: look.accent, borderRadius: 4 }} />
          <div>
            <div style={{ fontFamily: look.eyebrowFont, fontSize: 22, letterSpacing: "0.14em", color: look.accent, textTransform: "uppercase" }}>{c.eyebrow}</div>
            <TitleText parts={c.parts} at={from + 0.05} look={look} size={look.titleUpper ? 64 : 56} color={ink} align="left" />
            {c.sub && <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 30, opacity: 0.75, marginTop: 6 }}>{c.sub}</div>}
          </div>
        </Card>,
      );
    case "versus": {
      const r = c.rightAt !== undefined ? at(c.rightAt) : from + 0.9;
      const pr = springy(t, r);
      const good = c.good ?? "right";
      return wrap(
        TOP,
        <div style={{ display: "flex", gap: 18, alignItems: "stretch" }}>
          <Card look={look} at={from} style={{ width: 420, textAlign: "center", padding: "26px 22px" }}>
            <Icon kind={good === "left" ? "check" : "cross"} color={good === "left" ? look.accent : "#D64545"} size={60} />
            <div style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800, fontSize: 44, marginTop: 8 }}>{c.left}</div>
          </Card>
          <div style={{ alignSelf: "center", fontFamily: "Anton, sans-serif", fontSize: 60, color: look.accent, opacity: pr }}>VS</div>
          <div style={{ opacity: Math.min(1, pr * 1.5), transform: `translateX(${(1 - Math.min(1, pr)) * 80}px)` }}>
            <Card look={look} at={r} style={{ width: 420, textAlign: "center", padding: "26px 22px", outline: `5px solid ${look.accent}` }}>
              <Icon kind={good === "right" ? "check" : "cross"} color={good === "right" ? look.accent : "#D64545"} size={60} />
              <div style={{ fontFamily: '"Inter", sans-serif', fontWeight: 800, fontSize: 44, marginTop: 8 }}>{c.right}</div>
            </Card>
          </div>
        </div>,
      );
    }
    case "note": {
      const p = springy(t, from);
      const tokens = c.parts;
      return wrap(
        TOP,
        <div
          style={{
            width: 820,
            background: "#FAF0D4",
            backgroundImage: "repeating-linear-gradient(transparent 0 58px, #E8D9A8 58px 60px)",
            borderRadius: 6,
            padding: "40px 46px",
            boxShadow: "0 20px 46px rgba(0,0,0,.28)",
            transform: `rotate(${-3 + (1 - Math.min(1, p)) * -8}deg) translateY(${(1 - Math.min(1, p)) * 80}px)`,
            opacity: Math.min(1, p * 1.5),
            fontFamily: '"Caveat", cursive',
            fontSize: 74,
            lineHeight: 1.1,
            color: "#1F2A44",
            textAlign: "center",
          }}
        >
          {tokens.map((pt, i) =>
            typeof pt === "string" ? (
              <span key={i}>{pt}</span>
            ) : (
              <span key={i} style={{ background: `linear-gradient(transparent 55%, #F2D04B 55%)`, backgroundSize: `${prog(t, from + 0.5, 0.6) * 100}% 100%`, backgroundRepeat: "no-repeat", fontWeight: 700 }}>
                {pt.em}
              </span>
            ),
          )}
        </div>,
      );
    }
    case "target": {
      const p = prog(t, from - 0.1, 0.55);
      const r = 240 - 170 * p;
      return (
        <svg style={{ position: "absolute", inset: 0, opacity: Math.min(p * 1.5, out) }} width={1080} height={1920}>
          <g transform={`translate(${c.x} ${c.y})`}>
            <circle r={r} fill="none" stroke={look.accent2} strokeWidth={5} />
            <circle r={r * 0.45} fill="none" stroke={look.accent2} strokeWidth={3} strokeDasharray="8 8" />
            {[0, 90, 180, 270].map((a) => (
              <line key={a} x1={(r + 10) * Math.cos((a * Math.PI) / 180)} y1={(r + 10) * Math.sin((a * Math.PI) / 180)} x2={(r + 40) * Math.cos((a * Math.PI) / 180)} y2={(r + 40) * Math.sin((a * Math.PI) / 180)} stroke={look.accent2} strokeWidth={5} strokeLinecap="round" />
            ))}
          </g>
          <g opacity={prog(t, from + 0.3, 0.3)} transform={`translate(${c.x > 540 ? c.x - 380 : c.x + 110} ${c.y - 60})`}>
            <rect x={0} y={-30} width={270} height={56} rx={4} fill={look.cardBg} />
            <text x={135} y={8} textAnchor="middle" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 22, letterSpacing: "0.1em", fill: look.cardInk }}>
              {c.label.toUpperCase()}
            </text>
          </g>
        </svg>
      );
    }
  }
};

/* ───────────── Gancho, CTA, cierre, encabezado ───────────── */

const Hook: React.FC<{ cfg: ReelConfig; look: Look }> = ({ cfg, look }) => {
  const t = useT();
  const { hookTo } = useReel(cfg);
  if (t > hookTo + 0.4) return null;
  const out = 1 - prog(t, hookTo, 0.3);
  const darkBg = dark(look) && look.cardBg !== "#FFFFFF";
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 820,
          background: darkBg
            ? "linear-gradient(to bottom, rgba(10,11,16,.85), rgba(10,11,16,.55) 50%, rgba(10,11,16,0))"
            : "linear-gradient(to bottom, rgba(251,249,245,.92), rgba(251,249,245,.6) 55%, rgba(251,249,245,0))",
        }}
      />
      <div style={{ ...TOP, top: 210 }}>
        {cfg.hook.eyebrow && <Eyebrow text={cfg.hook.eyebrow} look={look} at={0.1} color={darkBg ? look.accent : look.ink} />}
        <TitleText parts={cfg.hook.parts} at={0.15} look={look} size={look.titleUpper ? 112 : 92} color={darkBg ? "#FFFFFF" : look.ink} stagger={0.08} />
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC<{ cfg: ReelConfig; look: Look }> = ({ cfg, look }) => {
  const t = useT();
  const { ctaAt, endCardAt, at } = useReel(cfg);
  if (!cfg.cta || t < ctaAt - 0.05 || t > endCardAt + 0.3) return null;
  const btnAt = cfg.cta ? at(cfg.cta.at) + 0.5 : 0;
  const pb = springy(t, btnAt);
  return (
    <div style={LOWER}>
      <Card look={look} at={ctaAt} style={{ width: 920, textAlign: "center", padding: "28px 34px" }}>
        <div style={{ fontFamily: look.eyebrowFont, fontSize: 24, letterSpacing: "0.14em", color: look.accent, textTransform: "uppercase" }}>{cfg.cta.kicker}</div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            marginTop: 16,
            background: look.accent,
            color: "#FFFFFF",
            fontFamily: '"Inter", sans-serif',
            fontWeight: 800,
            fontSize: 46,
            padding: "16px 34px",
            borderRadius: 6,
            transform: `scale(${0.7 + 0.3 * Math.min(1.06, pb)})`,
            opacity: Math.min(1, pb * 2),
          }}
        >
          {cfg.cta.button}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 16, fontFamily: '"Inter", sans-serif', fontWeight: 600, fontSize: 32 }}>
          <InstagramGlyph size={32} color={look.cardInk} />
          {cfg.handle}
        </div>
        {cfg.cta.sub && <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 28, opacity: 0.75, marginTop: 8 }}>{cfg.cta.sub}</div>}
      </Card>
    </div>
  );
};

const EndCard: React.FC<{ cfg: ReelConfig; look: Look }> = ({ cfg, look }) => {
  const t = useT();
  const { endCardAt } = useReel(cfg);
  if (t < endCardAt) return null;
  const p = prog(t, endCardAt, 0.5);
  const s = springy(t, endCardAt + 0.1);
  return (
    <AbsoluteFill style={{ background: look.endBg, opacity: p, alignItems: "center", justifyContent: "center", textAlign: "center", color: look.endInk }}>
      {look.particles !== "none" && <ParticleField kind={look.particles} t={t} look={look} />}
      <div
        style={{
          width: 170,
          height: 170,
          borderRadius: 85,
          border: `3px solid ${look.accent2}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: '"Fraunces", serif',
          fontStyle: "italic",
          fontSize: 70,
          color: look.accent2,
          transform: `scale(${0.6 + 0.4 * Math.min(1.05, s)})`,
        }}
      >
        PL
      </div>
      <div style={{ fontFamily: '"Fraunces", serif', fontSize: 78, marginTop: 40 }}>
        Dra. Paola <span style={{ fontStyle: "italic", color: look.accent }}>Limbozzi</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 40, background: look.endBg === "#FBF9F5" || look.endBg === "#FFF7EC" ? "#1B1815" : "#FFFFFF", color: look.endBg === "#FBF9F5" || look.endBg === "#FFF7EC" ? "#FFFFFF" : "#0A0B10", fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: 38, padding: "18px 32px", borderRadius: 60 }}>
        <InstagramGlyph size={38} color={look.accent} />
        {cfg.handle}
      </div>
      <div style={{ marginTop: 56, maxWidth: 860 }}>
        <TitleText parts={cfg.end.parts} at={endCardAt + 0.4} look={{ ...look, titleUpper: false, titleFont: look.titleFont.includes("Creepster") ? look.titleFont : '"Fraunces", serif', emItalic: true }} size={54} color={look.endInk} />
      </div>
      {cfg.end.sub && <div style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 24, letterSpacing: "0.14em", color: look.accent, marginTop: 24, opacity: prog(t, endCardAt + 0.9) }}>{cfg.end.sub}</div>}
    </AbsoluteFill>
  );
};

const Header: React.FC<{ cfg: ReelConfig; look: Look }> = ({ cfg, look }) => {
  const t = useT();
  const { endCardAt, hookTo } = useReel(cfg);
  if (t > endCardAt) return null;
  const p = prog(t, hookTo, 0.4);
  return (
    <div
      style={{
        position: "absolute",
        top: look.letterbox ? 86 : look.progress ? 52 : 70,
        left: 50,
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: p,
        padding: "8px 20px 8px 10px",
        borderRadius: 60,
        background: "rgba(10,11,16,0.62)",
        color: "#fff",
        fontFamily: '"Inter", sans-serif',
        fontWeight: 600,
        fontSize: 26,
      }}
    >
      <span style={{ width: 44, height: 44, borderRadius: 22, border: `2px solid ${look.accent2}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"Fraunces", serif', fontStyle: "italic", fontSize: 18, color: look.accent2 }}>
        PL
      </span>
      <InstagramGlyph size={26} color="#fff" />
      {cfg.handle}
    </div>
  );
};

/* ───────────── Sonido ───────────── */

const buildSfx = (cfg: ReelConfig, look: Look, r: ReturnType<typeof useReel>): SfxEvent[] => {
  const ev: SfxEvent[] = [{ at: 0.05, sfx: look.sfx.enter as SfxEvent["sfx"], volume: 0.9 }];
  for (const w of r.wins) {
    const c = w.c;
    const kind = c.kind === "big" ? look.sfx.big : c.kind === "stamp" ? look.sfx.stamp : c.kind === "note" ? look.sfx.note : look.sfx.enter;
    ev.push({ at: Math.max(0, w.from - (c.kind === "big" || c.kind === "stamp" ? 0 : 0.12)), sfx: kind as SfxEvent["sfx"], volume: 1 });
    if (c.kind === "list") c.items.forEach((it) => ev.push({ at: r.at(it.at), sfx: look.sfx.item as SfxEvent["sfx"], volume: 0.85 }));
    if (c.kind === "versus") ev.push({ at: c.rightAt !== undefined ? r.at(c.rightAt) : w.from + 0.9, sfx: look.sfx.item as SfxEvent["sfx"], volume: 0.85 });
    if (c.kind === "target") ev.push({ at: w.from + 0.3, sfx: look.sfx.item as SfxEvent["sfx"], volume: 0.85 });
  }
  if (look.sfx.cut) {
    for (const c of r.cuts) {
      if (!ev.some((e) => Math.abs(e.at - c) < 0.6)) ev.push({ at: Math.max(0, c - 0.08), sfx: look.sfx.cut as SfxEvent["sfx"], volume: 0.6 });
    }
  }
  if (cfg.cta) {
    ev.push({ at: Math.max(0, r.ctaAt + 0.5 - 1.25), sfx: look.sfx.riser as SfxEvent["sfx"], volume: 0.8 });
    ev.push({ at: r.ctaAt + 0.5, sfx: look.sfx.cta as SfxEvent["sfx"], volume: 1 });
  }
  ev.push({ at: r.endCardAt, sfx: look.sfx.end as SfxEvent["sfx"], volume: 1 });
  return ev;
};

/* ───────────── Composición ───────────── */

export const Reel: React.FC<{ cfg: ReelConfig }> = ({ cfg }) => {
  const look = LOOKS[cfg.style];
  const r = useReel(cfg);
  const emphasis = r.wins.filter((w) => w.c.kind === "big" || w.c.kind === "stamp").map((w) => w.from);
  // Los subtítulos se ocultan con las frases "big" y, en el estilo pop (subtítulo
  // grande en la zona baja), también con los zócalos y el CTA.
  const hiders = r.wins.filter((w) => w.c.kind === "big" || (look.captions === "pop" && w.c.kind === "lower"));
  const hideCaptions = (t: number) =>
    hiders.some((w) => t >= w.from && t <= w.to) || (look.captions === "pop" && !!cfg.cta && t >= r.ctaAt);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Soundtrack voice={`reels/${cfg.dir}/voz.wav`} music={`reels/${cfg.dir}/musica.m4a`} segments={r.tl.SEGMENTS} events={buildSfx(cfg, look, r)} sfxDir="sfx2" />
      <TalkingHead cfg={cfg} look={look} emphasis={emphasis} />
      <Fx look={look} cuts={r.cuts} duration={r.duration} endCardAt={r.endCardAt} />
      <Hook cfg={cfg} look={look} />
      {r.wins.map((w, i) => (
        <CalloutView key={i} w={w} look={look} cfg={cfg} />
      ))}
      <Cta cfg={cfg} look={look} />
      <Header cfg={cfg} look={look} />
      <Captions cfg={cfg} look={look} hide={hideCaptions} />
      <EndCard cfg={cfg} look={look} />
    </AbsoluteFill>
  );
};
