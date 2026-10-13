import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Card, Eyebrow, Headline, Scene, useAppear, useSeconds } from "../Bioestimuladores/components";
import { GraphicsBackdrop } from "../Bioestimuladores/graphics";
import { C, mono, sans, serif } from "../Bioestimuladores/theme";
import { Soundtrack } from "../lib/Soundtrack";
import { sfxEvents } from "./sfx";
import { KEEP, PAGES, SEGMENTS, T, timeOf, VOICE_SECONDS } from "./transcript";

export const INSTAGRAM = "@paolalimbozzi.academy";
export const END_CARD_AT = VOICE_SECONDS + 0.15;
export const DURATION_SECONDS = END_CARD_AT + 3.4;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Pantallas completas de gráficos (tiempos del video original). Paola sigue
// hablando y aparece en vivo en el círculo del encabezado.
const TAKEOVERS: [number, number][] = [
  [17.87, 28.73],
  [35.5, 40.7],
  [54.6, 66.3],
];

const takeoverAmount = (t: number) =>
  Math.max(
    0,
    ...TAKEOVERS.map(([a, b]) =>
      Math.min(interpolate(t, [T(a) - 0.05, T(a) + 0.35], [0, 1], clamp), interpolate(t, [T(b) - 0.3, T(b)], [1, 0], clamp)),
    ),
  );

/* ───────────── Video de Paola con cortes y "punch-ins" ───────────── */

const ZOOMS = [1, 1.14, 1.04, 1.18, 1, 1.1];
const FACE = "46% 40%";

const TalkingHead: React.FC<{ live?: boolean }> = ({ live }) => {
  const { fps } = useVideoConfig();
  return (
    <>
      {KEEP.map(([s, e], i) => {
        const from = Math.round(T(s) * fps);
        const dur = Math.round(T(e) * fps) - from;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <ZoomedClip startFrame={Math.round(s * fps)} zoom={live ? 1 : ZOOMS[i % ZOOMS.length]} />
          </Sequence>
        );
      })}
    </>
  );
};

const ZoomedClip: React.FC<{ startFrame: number; zoom: number }> = ({ startFrame, zoom }) => {
  const frame = useCurrentFrame();
  const drift = 1 + frame * 0.0004;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("trayectoria/paola.mp4")}
        trimBefore={startFrame}
        muted
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom * drift})`, transformOrigin: FACE }}
      />
    </AbsoluteFill>
  );
};

/* ───────────── Marca ───────────── */

const Monogram: React.FC<{ size: number; light?: boolean }> = ({ size, light }) => (
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

const InstagramGlyph: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <rect x={3} y={3} width={18} height={18} rx={5} />
    <circle cx={12} cy={12} r={4} />
    <circle cx={17.3} cy={6.7} r={1} fill={color} stroke="none" />
  </svg>
);

// Encabezado: sobre el video, monograma + Instagram; en las pantallas de
// gráficos, Paola en vivo en un círculo + nombre.
const Header: React.FC = () => {
  const t = useSeconds();
  const k = takeoverAmount(t);
  const p = useAppear(0.2);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 110,
          left: 56,
          display: "flex",
          alignItems: "center",
          gap: 16,
          opacity: p * (1 - k),
          padding: "10px 22px 10px 10px",
          borderRadius: 60,
          background: "rgba(27,24,21,0.45)",
        }}
      >
        <Monogram size={64} light />
        <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: sans, fontWeight: 600, fontSize: 28, color: C.white }}>
          <InstagramGlyph size={28} color={C.white} />
          {INSTAGRAM}
        </div>
      </div>
      <div style={{ position: "absolute", top: 100, left: 56, display: "flex", alignItems: "center", gap: 22, opacity: k }}>
        <div style={{ width: 150, height: 150, borderRadius: 75, overflow: "hidden", border: `4px solid ${C.goldLight}`, position: "relative", background: C.ink }}>
          <div style={{ position: "absolute", left: -63, top: -138, width: 300, height: 533 }}>
            <AbsoluteFill>
              <TalkingHead live />
            </AbsoluteFill>
          </div>
        </div>
        <div>
          <div style={{ fontFamily: serif, fontSize: 44, color: C.ink, lineHeight: 1.1 }}>Dra. Paola Limbozzi</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: mono, fontSize: 22, color: C.teal, marginTop: 8, letterSpacing: "0.06em" }}>
            <InstagramGlyph size={22} color={C.teal} />
            {INSTAGRAM}
          </div>
        </div>
      </div>
    </>
  );
};

/* ───────────── Subtítulos ───────────── */

const Captions: React.FC = () => {
  const t = useSeconds();
  const k = takeoverAmount(t);
  const page = PAGES.find((p, i) => t >= p.start - 0.05 && t < (PAGES[i + 1]?.start ?? p.end + 0.6) && t < p.end + 0.6);
  if (!page || t > END_CARD_AT) return null;
  const enter = interpolate(t, [page.start - 0.05, page.start + 0.12], [0, 1], clamp);
  const onVideo = k < 0.5;
  return (
    <div
      style={{
        position: "absolute",
        top: 1400,
        left: 60,
        right: 60,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "4px 14px",
        fontFamily: sans,
        fontWeight: 700,
        fontSize: 58,
        lineHeight: 1.25,
        color: onVideo ? C.white : C.ink,
        textShadow: onVideo ? "0 3px 14px rgba(0,0,0,.65), 0 0 2px rgba(0,0,0,.8)" : "none",
        opacity: enter,
        transform: `scale(${0.96 + 0.04 * enter})`,
      }}
    >
      {page.words.map((w, i) => {
        const active = t >= w.start && t < w.end + 0.05;
        return (
          <span
            key={i}
            style={{
              padding: "0 8px",
              borderRadius: 4,
              background: active ? C.marker : "transparent",
              color: active ? C.ink : undefined,
              textShadow: active ? "none" : undefined,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

/* ───────────── Overlays sobre el video ───────────── */

// Degradé crema arriba para títulos sobre el video.
const TopTitle: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const t = useSeconds();
  if (t < from - 0.1 || t > to + 0.4) return null;
  const o = Math.min(interpolate(t, [from - 0.1, from + 0.3], [0, 1], clamp), interpolate(t, [to, to + 0.35], [1, 0], clamp));
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 760,
          opacity: o,
          background: `linear-gradient(to bottom, ${C.cream} 0%, rgba(251,249,245,.92) 45%, rgba(251,249,245,0) 100%)`,
        }}
      />
      <div style={{ position: "absolute", top: 230, left: 0, right: 0, height: 360 }}>
        <Scene from={from} to={to}>
          {children}
        </Scene>
      </div>
    </>
  );
};

// Tarjeta tipo "lower third" sobre el pecho, arriba de los subtítulos.
const LowerCard: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => (
  <div style={{ position: "absolute", top: 1010, left: 0, right: 0, height: 330 }}>
    <Scene from={from} to={to}>
      {children}
    </Scene>
  </div>
);

const NameCard: React.FC<{ eyebrow: string; title: React.ReactNode; sub: string; at: number }> = ({ eyebrow, title, sub, at }) => (
  <Card at={at} style={{ width: 900, textAlign: "left", padding: "28px 36px", display: "flex", gap: 28, alignItems: "center" }}>
    <div style={{ width: 6, alignSelf: "stretch", background: C.goldLight, borderRadius: 3 }} />
    <div>
      <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.14em", color: C.teal }}>{eyebrow}</div>
      <div style={{ fontFamily: serif, fontSize: 54, color: C.ink, lineHeight: 1.08, marginTop: 8 }}>{title}</div>
      <div style={{ fontFamily: sans, fontSize: 30, color: C.text, marginTop: 10 }}>{sub}</div>
    </div>
  </Card>
);

const Em: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ fontStyle: "italic", color: C.gold }}>{children}</span>
);

const Chip: React.FC<{ at: number; children: React.ReactNode; dark?: boolean }> = ({ at, children, dark }) => {
  const p = useAppear(at, 16);
  return (
    <div
      style={{
        fontFamily: sans,
        fontWeight: 600,
        fontSize: 31,
        padding: "16px 22px",
        borderRadius: 4,
        background: dark ? C.ink : C.white,
        color: dark ? C.goldLight : C.ink,
        border: `1px solid ${C.line}`,
        boxShadow: "0 10px 30px rgba(27,24,21,.08)",
        opacity: Math.min(1, p * 1.4),
        transform: `translateX(${(1 - p) * 60}px)`,
        textAlign: "left",
        lineHeight: 1.15,
      }}
    >
      {children}
    </div>
  );
};

const VideoOverlays: React.FC = () => {
  const t = useSeconds();
  const strike = interpolate(t, [timeOf("títulos", 40) - 0.1, timeOf("títulos", 40) + 0.35], [0, 1], clamp);
  return (
    <>
      <TopTitle from={T(0.33)} to={T(4.3)}>
        <Headline parts={["¿Qué hay ", { em: "detrás" }, " de quien te forma?"]} at={T(0.4)} size={80} />
      </TopTitle>

      <LowerCard from={timeOf("Soy", 8) - 0.1} to={T(12.08)}>
        <NameCard
          at={timeOf("Soy", 8)}
          eyebrow="MÉDICA · UBA"
          title={
            <>
              Dra. Paola <Em>Limbozzi</Em>
            </>
          }
          sub="Especializada en medicina estética"
        />
      </LowerCard>
      <LowerCard from={T(12.12)} to={T(17.3)}>
        <NameCard
          at={T(12.15)}
          eyebrow="TRAYECTORIA"
          title={
            <>
              De la clínica al <Em>aula</Em>
            </>
          }
          sub="Experiencia llevada al ámbito académico"
        />
      </LowerCard>

      <LowerCard from={T(30.15)} to={T(35.35)}>
        <NameCard
          at={timeOf("miembro", 30)}
          eyebrow="MIEMBRO"
          title={
            <>
              Comité <Em>Científico</Em>
            </>
          }
          sub="Congreso Estética Mundial · Córdoba"
        />
      </LowerCard>

      {/* "No para hacer una lista de títulos" */}
      <LowerCard from={T(40.75)} to={T(42.5)}>
        <div style={{ position: "relative", display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
          <Chip at={T(40.8)}>Médica UBA</Chip>
          <Chip at={T(40.9)}>Speaker</Chip>
          <Chip at={T(41.0)}>Comité Científico</Chip>
          <Chip at={T(41.1)}>Directora</Chip>
          <div
            style={{
              position: "absolute",
              left: -20,
              top: "50%",
              height: 8,
              width: `${strike * 104}%`,
              background: C.gold,
              borderRadius: 4,
              transform: "rotate(-4deg)",
            }}
          />
        </div>
      </LowerCard>

      {/* Estudiar vs. ejercer */}
      <LowerCard from={timeOf("Porque", 42) - 0.1} to={T(54.35)}>
        <Card at={timeOf("Porque", 42)} style={{ width: 940, padding: 0, display: "flex", overflow: "hidden" }}>
          <div style={{ flex: 1, padding: "28px 30px", textAlign: "left" }}>
            <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.14em", color: C.text }}>UNA COSA ES</div>
            <div style={{ fontFamily: serif, fontSize: 44, color: C.ink, marginTop: 10, lineHeight: 1.15 }}>Estudiar, enseñar, escuchar</div>
          </div>
          <ContrastSide at={timeOf("Otra", 48)} />
        </Card>
      </LowerCard>

      <TopTitle from={T(66.5)} to={T(71.3)}>
        <Eyebrow at={T(66.6)}>Un mismo objetivo</Eyebrow>
        <Headline parts={["Formar profesionales ", { em: "mejor capacitados" }]} at={timeOf("formar", 68.9)} size={78} />
      </TopTitle>

      {/* CTA */}
      <LowerCard from={T(71.8)} to={END_CARD_AT}>
        <Card at={T(71.85)} style={{ width: 900, padding: "30px 36px" }}>
          <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.14em", color: C.teal }}>¿QUERÉS FORMARTE?</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, marginTop: 14 }}>
            <div style={{ fontFamily: serif, fontSize: 60, color: C.ink }}>Escribime</div>
            <CtaButton at={timeOf("INFORMACIÓN")} />
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: sans, fontWeight: 600, fontSize: 32, color: C.ink, marginTop: 18 }}>
            <InstagramGlyph size={32} color={C.ink} />
            {INSTAGRAM}
          </div>
        </Card>
      </LowerCard>
    </>
  );
};

const ContrastSide: React.FC<{ at: number }> = ({ at }) => {
  const p = useAppear(at, 18);
  return (
    <div
      style={{
        flex: 1.1,
        padding: "28px 30px",
        textAlign: "left",
        background: C.ink,
        opacity: Math.min(1, p * 1.4),
        transform: `translateX(${(1 - p) * 80}px)`,
      }}
    >
      <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: "0.14em", color: C.goldLight }}>OTRA ES</div>
      <div style={{ fontFamily: serif, fontSize: 44, color: C.white, marginTop: 10, lineHeight: 1.15 }}>
        <span style={{ fontStyle: "italic", color: C.goldLight }}>Ejercer</span> con pacientes reales
      </div>
    </div>
  );
};

const CtaButton: React.FC<{ at: number }> = ({ at }) => {
  const p = useAppear(at, 14);
  return (
    <div
      style={{
        background: C.teal,
        color: C.white,
        fontFamily: sans,
        fontWeight: 700,
        fontSize: 44,
        letterSpacing: "0.06em",
        padding: "16px 30px",
        borderRadius: 4,
        boxShadow: "0 14px 34px rgba(74,147,168,.35)",
        transform: `scale(${0.8 + 0.2 * p})`,
        opacity: Math.min(1, p * 1.5),
      }}
    >
      INFORMACIÓN
    </div>
  );
};

/* ───────────── Pantallas de gráficos ───────────── */

const CONGRESOS = [
  { name: "Congreso Mundial de Estética", word: "Congreso" },
  { name: "Mendoza Esthetic", word: "Mendoza" },
  { name: "ACAOFAR", word: "ACAOFAR" },
  { name: "Congreso Estética Mundial", word: "Congreso", after: 25 },
  { name: "Semal Madrid", word: "Semal" },
];

const FramedMedia: React.FC<{ at: number; w: number; h: number; children: React.ReactNode; label?: string }> = ({
  at,
  w,
  h,
  children,
  label,
}) => {
  const p = useAppear(at, 20);
  return (
    <div
      style={{
        width: w,
        height: h,
        position: "relative",
        borderRadius: 6,
        overflow: "hidden",
        border: `6px solid ${C.white}`,
        boxShadow: "0 24px 60px rgba(27,24,21,.22)",
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * 60}px) rotate(${(1 - p) * -3}deg)`,
        flexShrink: 0,
      }}
    >
      {children}
      {label && (
        <div
          style={{
            position: "absolute",
            left: 16,
            bottom: 16,
            background: C.ink,
            color: C.goldLight,
            fontFamily: mono,
            fontSize: 20,
            letterSpacing: "0.12em",
            padding: "10px 14px",
            borderRadius: 3,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};

const Takeovers: React.FC = () => {
  const t = useSeconds();
  const k = takeoverAmount(t);
  if (k <= 0) return null;
  const photoZoom = interpolate(t, [T(35.5), T(40.7)], [1.05, 1.18], clamp);
  return (
    <AbsoluteFill style={{ opacity: k }}>
      <AbsoluteFill style={{ background: C.cream }} />
      <GraphicsBackdrop opacity={1} />

      {/* Speaker en congresos */}
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, height: 1060 }}>
        <Scene from={T(17.87)} to={T(28.7)} style={{ justifyContent: "flex-start" }}>
          <Eyebrow at={T(17.9)}>Speaker</Eyebrow>
          <Headline parts={["Congresos ", { em: "nacionales e internacionales" }]} at={T(17.95)} size={64} />
          <div style={{ display: "flex", gap: 30, marginTop: 40, alignItems: "flex-start" }}>
            <FramedMedia at={T(18.2)} w={430} h={764} label="ESTÉTICA MUNDIAL">
              <Sequence from={Math.round(T(17.87) * 30)} layout="none">
                <OffthreadVideo
                  src={staticFile("trayectoria/curso.mp4")}
                  muted
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Sequence>
            </FramedMedia>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 470, paddingTop: 30 }}>
              {CONGRESOS.map((c, i) => (
                <Chip key={c.name} at={timeOf(c.word, c.after ?? 21)} dark={i === 3}>
                  {c.name}
                </Chip>
              ))}
            </div>
          </div>
        </Scene>
      </div>

      {/* Talleres y capacitaciones */}
      <div style={{ position: "absolute", top: 320, left: 0, right: 0, height: 1040 }}>
        <Scene from={T(35.5)} to={T(40.7)} style={{ justifyContent: "flex-start" }}>
          <FramedMedia at={T(35.55)} w={960} h={720} label="PROFESIONALES EN FORMACIÓN">
            <Img
              src={staticFile("trayectoria/publico.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${photoZoom})`, transformOrigin: "50% 60%" }}
            />
          </FramedMedia>
          <div style={{ marginTop: 44 }}>
            <Headline parts={["Talleres y capacitaciones en ", { em: "distintas ciudades" }]} at={timeOf("distintas", 35)} size={62} />
          </div>
        </Scene>
      </div>

      {/* Hoy: directora */}
      <div style={{ position: "absolute", top: 310, left: 0, right: 0, height: 1060 }}>
        <Scene from={T(54.6)} to={T(66.3)} style={{ justifyContent: "flex-start" }}>
          <Eyebrow at={T(54.65)}>Hoy</Eyebrow>
          <Headline parts={[{ em: "Directora" }]} at={timeOf("directora", 54)} size={96} />
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 34 }}>
            <RoleCard at={timeOf("Diplomatura")} kicker="UNIVERSIDAD KENNEDY" title="Diplomatura en Medicina Estética y Regenerativa" />
            <RoleCard at={timeOf("Posgrado")} kicker="PARA ODONTÓLOGOS" title="Posgrado Integral de Armonización Orofacial" />
            <RoleCard at={timeOf("Paola", 64)} kicker="ACADEMIA DE MEDICINA ESTÉTICA" title="Paola Limbozzi Academy" brand />
          </div>
        </Scene>
      </div>
    </AbsoluteFill>
  );
};

const RoleCard: React.FC<{ at: number; kicker: string; title: string; brand?: boolean }> = ({ at, kicker, title, brand }) => (
  <Card
    at={at}
    style={{
      width: 920,
      textAlign: "left",
      display: "flex",
      alignItems: "center",
      gap: 26,
      padding: "26px 32px",
      background: brand ? C.ink : C.white,
      border: brand ? "none" : undefined,
    }}
  >
    {brand ? <Monogram size={84} /> : <div style={{ width: 6, alignSelf: "stretch", background: C.goldLight, borderRadius: 3 }} />}
    <div>
      <div style={{ fontFamily: mono, fontSize: 21, letterSpacing: "0.14em", color: brand ? C.goldLight : C.teal }}>{kicker}</div>
      <div style={{ fontFamily: serif, fontSize: 42, lineHeight: 1.12, marginTop: 8, color: brand ? C.white : C.ink }}>{title}</div>
    </div>
  </Card>
);

/* ───────────── Cierre ───────────── */

const EndCard: React.FC = () => {
  const t = useSeconds();
  if (t < END_CARD_AT) return null;
  const p = interpolate(t, [END_CARD_AT, END_CARD_AT + 0.6], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: C.cream, opacity: p, alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <GraphicsBackdrop opacity={1} />
      <Monogram size={180} />
      <div style={{ fontFamily: serif, fontSize: 78, color: C.ink, marginTop: 44, lineHeight: 1.1 }}>
        Paola Limbozzi <Em>Academy</Em>
      </div>
      <div style={{ fontFamily: mono, fontSize: 26, letterSpacing: "0.16em", color: C.teal, marginTop: 22 }}>
        — ACADEMIA DE MEDICINA ESTÉTICA
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginTop: 56,
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
      <div style={{ fontFamily: serif, fontSize: 42, color: C.text, marginTop: 60, maxWidth: 820, lineHeight: 1.25 }}>
        Formar no es mostrar una técnica, es <Em>enseñar a pensar.</Em>
      </div>
    </AbsoluteFill>
  );
};

// Viñeta inferior para que los subtítulos se lean sobre el video.
const Vignette: React.FC = () => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 900,
      background: "linear-gradient(to top, rgba(10,11,16,.55), rgba(10,11,16,0))",
    }}
  />
);

export const Trayectoria: React.FC = () => (
  <AbsoluteFill style={{ background: C.ink }}>
    <Soundtrack voice="trayectoria/voz.wav" music="trayectoria/musica.m4a" segments={SEGMENTS} events={sfxEvents(END_CARD_AT)} />
    <TalkingHead />
    <Vignette />
    <VideoOverlays />
    <Takeovers />
    <Header />
    <Captions />
    <EndCard />
  </AbsoluteFill>
);

