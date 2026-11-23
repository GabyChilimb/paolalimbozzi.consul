import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  interpolate,
  OffthreadVideo,
  random,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { bold, serif } from "../Bioestimuladores/theme";
import { InstagramGlyph } from "../lib/brand";
import { makeTimeline } from "../lib/timeline";
import { mb, MotionBlurDefs } from "../reels/engine/Reel";
import { FOTOS } from "./fotos";
import { Linea, MontajeConfig, Titulo, Toma } from "./types";

const FPS = 30;
export const CIERRE = 2.8; // segundos de placa final
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const easeOut = Easing.bezier(0.22, 1, 0.36, 1);

/* ───────────── Línea de tiempo ───────────── */

type TomaAbs = Toma & { from: number; dur: number; i: number };
type TituloAbs = Titulo & { from: number; to: number };

export const planificar = (cfg: MontajeConfig) => {
  let t = 0;
  const tomas: TomaAbs[] = [];
  const titulos: TituloAbs[] = [];
  const voces: { src: string; desde: number; hasta: number; from: number }[] = [];
  const segs: { start: number; end: number; text: string }[] = [];
  for (const tr of cfg.tramos) {
    const dur = tr.voz ? tr.voz.hasta - tr.voz.desde : (tr.dur ?? 2);
    const fijas = tr.tomas.reduce((a, x) => a + (x.dur ?? 0), 0);
    const libres = tr.tomas.filter((x) => x.dur === undefined).length;
    const resto = libres ? Math.max(0.6, (dur - fijas) / libres) : 0;
    let u = t;
    for (const x of tr.tomas) {
      const d = x.dur ?? resto;
      tomas.push({ ...x, from: u, dur: d, i: tomas.length });
      u += d;
    }
    if (tr.voz) {
      voces.push({ src: tr.voz.src, desde: tr.voz.desde, hasta: tr.voz.hasta, from: t });
      if (tr.voz.subtitulos !== false) segs.push({ start: t, end: t + dur, text: tr.voz.texto });
    }
    if (tr.titulo) {
      const from = t + (tr.titulo.at ?? 0.1);
      titulos.push({ ...tr.titulo, from, to: tr.titulo.dur ? from + tr.titulo.dur : t + dur - 0.05 });
    }
    t += dur;
  }
  const finTomas = t;
  const tl = makeTimeline(segs, [[0, finTomas]]);
  return { tomas, titulos, voces, finTomas, total: finTomas + CIERRE, tl };
};

const useT = () => useCurrentFrame() / FPS;

/* ───────────── Tomas (fotos y clips) ───────────── */

const kenBurns = (x: Toma, p: number) => {
  const m = x.mov ?? "in";
  if (m === "in") return { s: 1.02 + 0.13 * p, tx: 0 };
  if (m === "out") return { s: 1.15 - 0.13 * p, tx: 0 };
  return { s: 1.12, tx: (m === "izq" ? 1 : -1) * (50 - 100 * p) };
};

const TomaView: React.FC<{ x: TomaAbs; primera: boolean }> = ({ x, primera }) => {
  const frame = useCurrentFrame();
  const n = x.dur * FPS;
  const p = frame / n;
  const dir = x.i % 2 ? 1 : -1;
  // Entrada y salida con barrido lateral y motion blur.
  const kIn = primera ? 1 : Math.min(1, frame / 8);
  const eIn = 1 - (1 - kIn) ** 3;
  const kOut = Math.min(1, Math.max(0, (frame - (n - 6)) / 6));
  const eOut = kOut ** 2;
  const tx = dir * 240 * (1 - eIn) - dir * 240 * eOut;
  const vel = (1 - eIn) + eOut;
  const blur = mb("x", vel * 1.4);
  const { s, tx: pan } = kenBurns(x, p);
  const origen = `${(x.foco?.x ?? 0.5) * 100}% ${(x.foco?.y ?? 0.45) * 100}%`;
  const grade = "contrast(1.06) saturate(1.08)";

  let contenido: React.ReactNode;
  if (x.clip) {
    contenido = (
      <OffthreadVideo
        src={staticFile(`montaje/clips/${x.clip}.mp4`)}
        trimBefore={Math.round((x.desde ?? 0) * FPS)}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${pan}px) scale(${s * (1 + 0.04 * (1 - eIn))})`, transformOrigin: origen }}
      />
    );
  } else {
    const [w, h] = FOTOS[x.foto ?? ""] ?? [1080, 1920];
    const src = staticFile(`montaje/fotos/${x.foto}.jpg`);
    const horizontal = w / h > 0.9;
    contenido = horizontal ? (
      // Foto horizontal: fondo desenfocado y la foto entera encima.
      <AbsoluteFill>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(38px) brightness(0.45) saturate(1.2)", transform: "scale(1.25)" }} />
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <Img
            src={src}
            style={{
              width: 1000,
              height: (1000 * h) / w,
              objectFit: "cover",
              borderRadius: 22,
              boxShadow: "0 30px 80px rgba(0,0,0,.6)",
              marginTop: -140,
              transform: `translateX(${pan * 0.4}px) scale(${0.96 + 0.08 * p})`,
            }}
          />
        </AbsoluteFill>
      </AbsoluteFill>
    ) : (
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${pan}px) scale(${s})`, transformOrigin: origen }} />
    );
  }
  return (
    <AbsoluteFill style={{ overflow: "hidden", transform: `translateX(${tx}px)`, filter: `${grade}${blur}` }}>
      {contenido}
    </AbsoluteFill>
  );
};

/* ───────────── Títulos cinéticos ───────────── */

const estiloLinea = (l: Linea, acento: string): React.CSSProperties => {
  const c = l.color ?? acento;
  const sombra = "0 4px 0 rgba(0,0,0,.25), 0 10px 28px rgba(0,0,0,.7)";
  const brillo = `0 0 6px ${c}, 0 0 18px ${c}, 0 0 44px ${c}, 0 6px 22px rgba(0,0,0,.55)`;
  switch (l.estilo) {
    case "fuerte":
      return { fontFamily: bold, fontWeight: 900, fontStyle: "italic", fontSize: l.tam ?? 88, color: "#FFFFFF", textShadow: sombra };
    case "neon":
      return { fontFamily: bold, fontWeight: 800, fontStyle: "italic", fontSize: l.tam ?? 84, color: "#FFFFFF", textShadow: brillo, WebkitTextStroke: `1.5px ${c}` };
    case "contorno":
      return { fontFamily: bold, fontWeight: 900, fontStyle: "italic", fontSize: l.tam ?? 88, color: c, WebkitTextStroke: "3px rgba(8,10,14,.9)", paintOrder: "stroke fill", textShadow: "0 8px 22px rgba(0,0,0,.6)" };
    case "serif":
      return { fontFamily: serif, fontWeight: 800, fontStyle: "italic", fontSize: l.tam ?? 128, color: "#FFFFFF", textShadow: sombra, letterSpacing: "-0.02em" };
    case "serifNeon":
      return { fontFamily: serif, fontWeight: 700, fontStyle: "italic", fontSize: l.tam ?? 150, color: "#FFFFFF", textShadow: brillo, letterSpacing: "-0.02em" };
    default:
      return { fontFamily: bold, fontWeight: 600, fontSize: l.tam ?? 44, color: "#FFFFFF", textShadow: "0 3px 14px rgba(0,0,0,.8)" };
  }
};

export const TituloCinetico: React.FC<{ tit: TituloAbs; acento: string }> = ({ tit, acento }) => {
  const t = useT();
  if (t < tit.from - 0.05 || t > tit.to + 0.1) return null;
  let k = 0;
  const total = tit.lineas.reduce((a, l) => a + l.t.split(" ").length, 0);
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top: (tit.y ?? 700) - 200, height: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      {/* Halo oscuro suave detrás del título (sin caja) para que se lea sobre cualquier foto */}
      <div
        style={{
          position: "absolute",
          inset: "-120px -60px",
          background: "radial-gradient(ellipse 50% 42% at 50% 50%, rgba(0,0,0,.55), rgba(0,0,0,0) 100%)",
          opacity: interpolate(t, [tit.from - 0.05, tit.from + 0.25, tit.to - 0.1, tit.to + 0.2], [0, 1, 1, 0], clamp),
        }}
      />
      {tit.lineas.map((l, li) => {
        const neon = l.estilo === "neon" || l.estilo === "serifNeon";
        return (
          <div key={li} style={{ ...estiloLinea(l, acento), lineHeight: 1.04, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.24em", maxWidth: 1000 }}>
            {l.t.split(" ").map((w, wi) => {
              const i = k++;
              const a0 = tit.from + i * 0.06;
              const pe = interpolate(t, [a0, a0 + 0.34], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
              const pl = interpolate(t, [a0, a0 + 0.34], [0, 1], clamp);
              const s0 = tit.to - 0.34 + (total - 1 - i) * 0.025;
              const px = interpolate(t, [s0, s0 + 0.3], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
              const flick = neon && t - a0 < 0.32 && t - a0 > 0 ? (random(`n${li}-${wi}-${Math.floor(t * 30)}`) > 0.45 ? 1 : 0.3) : 1;
              const flota = Math.sin(t * 2.2 + i) * 3;
              const mov = Math.max(1 - pl, px);
              return (
                <span
                  key={wi}
                  style={{
                    display: "inline-block",
                    opacity: Math.min(pl * 1.6, 1) * (1 - px) * flick,
                    transform: `translateY(${(1 - pe) * 70 - px * 90 + flota}px) scale(${0.55 + 0.45 * pe + 0.25 * px}) rotate(${(1 - pe) * -7}deg)`,
                    filter: mov > 0.04 ? mb("y", mov * 1.5) || undefined : undefined,
                  }}
                >
                  {w}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/* ───────────── Subtítulos ───────────── */

const Subtitulos: React.FC<{ tl: ReturnType<typeof planificar>["tl"]; acento: string; claves: string[] }> = ({ tl, acento, claves }) => {
  const t = useT();
  const page = tl.PAGES.find((p) => t >= p.start - 0.05 && t <= p.end + 0.2);
  if (!page) return null;
  const pin = interpolate(t, [page.start - 0.05, page.start + 0.15], [0, 1], { ...clamp, easing: easeOut });
  const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  const esClave = (w: string) => claves.some((c) => norm(c) === norm(w));
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 1480, display: "flex", justifyContent: "center", opacity: pin, transform: `translateY(${(1 - pin) * 24}px) scale(${0.92 + 0.08 * pin})` }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", maxWidth: 960, fontFamily: bold, fontWeight: 800, fontSize: 60, lineHeight: 1.15 }}>
        {page.words.map((w, i) => {
          const activa = t >= w.start && t < (page.words[i + 1]?.start ?? w.end + 0.05);
          const clave = esClave(w.text);
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                margin: "0 7px",
                color: activa ? acento : clave ? "#FFE8A3" : "#FFFFFF",
                transform: `scale(${activa ? 1.06 : 1})`,
                textShadow: activa
                  ? `0 0 14px ${acento}, 0 4px 0 rgba(0,0,0,.5), 0 6px 18px rgba(0,0,0,.8)`
                  : "0 3px 0 rgba(0,0,0,.55), 0 0 3px rgba(0,0,0,.9), 0 6px 18px rgba(0,0,0,.8)",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ───────────── Cabecera y cierre ───────────── */

const Cabecera: React.FC<{ handle: string; acento: string; hasta: number }> = ({ handle, acento, hasta }) => {
  const t = useT();
  const p = interpolate(t, [0.6, 1.1, hasta - 0.3, hasta], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 70, left: 50, display: "flex", alignItems: "center", gap: 10, opacity: p, padding: "8px 20px 8px 10px", borderRadius: 60, background: "rgba(10,11,16,0.5)", color: "#fff", fontFamily: bold, fontWeight: 600, fontSize: 26 }}>
      <span style={{ width: 44, height: 44, borderRadius: 22, border: `2px solid ${acento}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontStyle: "italic", fontSize: 18, color: acento }}>PL</span>
      <InstagramGlyph size={26} color="#fff" />
      {handle}
    </div>
  );
};

const Cierre: React.FC<{ cfg: MontajeConfig; desde: number }> = ({ cfg, desde }) => {
  const t = useT();
  if (t < desde) return null;
  const p = interpolate(t, [desde, desde + 0.45], [0, 1], { ...clamp, easing: easeOut });
  const pm = interpolate(t, [desde + 0.15, desde + 0.7], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
  const tit: TituloAbs = { lineas: cfg.cierre.lineas, from: desde + 0.45, to: desde + CIERRE + 1, y: 1010 };
  return (
    <AbsoluteFill style={{ opacity: p, background: `radial-gradient(ellipse at 50% 42%, ${cfg.acento}33, #07080C 62%)` }}>
      <div style={{ position: "absolute", top: 520, left: 0, right: 0, display: "flex", justifyContent: "center", transform: `scale(${pm})` }}>
        <div style={{ width: 190, height: 190, borderRadius: 95, border: `4px solid ${cfg.acento2}`, boxShadow: `0 0 30px ${cfg.acento2}, inset 0 0 24px ${cfg.acento2}55`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: serif, fontStyle: "italic", fontSize: 80, color: "#FFFFFF", textShadow: `0 0 18px ${cfg.acento2}` }}>
          PL
        </div>
      </div>
      <TituloCinetico tit={tit} acento={cfg.acento} />
      <div style={{ position: "absolute", top: 1290, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: interpolate(t, [desde + 0.9, desde + 1.3], [0, 1], clamp) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#FFFFFF", color: "#0A0B10", fontFamily: bold, fontWeight: 700, fontSize: 38, padding: "16px 30px", borderRadius: 60 }}>
          <InstagramGlyph size={36} color="#0A0B10" />
          {cfg.handle}
        </div>
        {cfg.cierre.sub && <div style={{ fontFamily: bold, fontWeight: 600, letterSpacing: "0.18em", fontSize: 24, color: cfg.acento2, textTransform: "uppercase" }}>{cfg.cierre.sub}</div>}
      </div>
    </AbsoluteFill>
  );
};

/* ───────────── Composición ───────────── */

export const Montaje: React.FC<{ cfg: MontajeConfig }> = ({ cfg }) => {
  const plan = useMemo(() => planificar(cfg), [cfg]);
  const { fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  // Golpe de zoom cuando entra un título.
  let golpe = 0;
  for (const ti of plan.titulos) {
    if (ti.zoom === false) continue;
    const d = t - ti.from;
    if (d >= 0 && d < 1.4) golpe = Math.max(golpe, 0.07 * Math.exp(-d * 2.6) * Math.min(1, d * 10));
  }
  // Efectos de sonido (muy suaves): barridos en los cambios de toma, golpe en los títulos.
  const sfx: { at: number; s: string; v: number }[] = [];
  plan.tomas.forEach((x, i) => i > 0 && sfx.push({ at: Math.max(0, x.from - 0.08), s: i % 2 ? "whoosh" : "swoosh", v: 0.1 }));
  plan.titulos.forEach((ti) => sfx.push({ at: ti.from, s: "pop", v: 0.13 }));
  sfx.push({ at: plan.finTomas, s: "sting", v: 0.16 });
  // Música muy de fondo: baja un poco más mientras hay voz (con rampas, sin saltos).
  const duck = (tt: number) =>
    plan.voces.reduce((m, v) => {
      const fin = v.from + (v.hasta - v.desde);
      return Math.max(m, Math.min(interpolate(tt, [v.from - 0.3, v.from], [0, 1], clamp), interpolate(tt, [fin + 0.1, fin + 0.5], [1, 0], clamp)));
    }, 0);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <MotionBlurDefs />
      <AbsoluteFill style={{ transform: `scale(${1 + golpe})` }}>
        {plan.tomas.map((x, i) => (
          <Sequence key={i} from={Math.round(x.from * fps)} durationInFrames={Math.max(1, Math.round(x.dur * fps))} layout="none">
            <TomaView x={x} primera={i === 0} />
          </Sequence>
        ))}
      </AbsoluteFill>
      {/* Viñeta y degradés para que se lean títulos y subtítulos */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,.45) 100%)" }} />
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,0) 18%, rgba(0,0,0,0) 62%, rgba(0,0,0,.5))" }} />
      {plan.titulos.map((ti, i) => (
        <TituloCinetico key={i} tit={ti} acento={cfg.acento} />
      ))}
      {t < plan.finTomas && <Subtitulos tl={plan.tl} acento={cfg.acento} claves={cfg.claves ?? []} />}
      <Cabecera handle={cfg.handle} acento={cfg.acento2} hasta={plan.finTomas} />
      <Cierre cfg={cfg} desde={plan.finTomas} />
      {/* Sonido */}
      {plan.voces.map((v, i) => {
        const n = Math.round((v.hasta - v.desde) * fps);
        return (
          <Sequence key={`v${i}`} from={Math.round(v.from * fps)} durationInFrames={n} layout="none">
            <Audio src={staticFile(`montaje/voz/${v.src}`)} trimBefore={Math.round(v.desde * fps)} volume={(f) => Math.min(1, f / 2, (n - f) / 3)} />
          </Sequence>
        );
      })}
      <Audio
        src={staticFile(`montaje/musica/${cfg.id}.m4a`)}
        volume={(f) => {
          const tt = f / fps;
          const fin = interpolate(tt, [plan.total - 1.2, plan.total], [1, 0], clamp);
          return (0.13 - 0.06 * duck(tt)) * fin;
        }}
      />
      {sfx.map((e, i) => (
        <Sequence key={`s${i}`} from={Math.round(e.at * fps)} durationInFrames={Math.round(3 * fps)} layout="none">
          <Audio src={staticFile(`sfx2/${e.s}.wav`)} volume={e.v} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
