import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Body, Card, Eyebrow, GoldDot, Headline, Scene, useAppear, useSeconds } from "./components";
import { C, mono, sans, serif } from "./theme";
import { GraphicsBackdrop, MotionGraphics } from "./graphics";
import { PAGES, timeOf } from "./transcript";

const Backdrop: React.FC = () => {
  const t = useSeconds();
  return <GraphicsBackdrop opacity={1 - photoOpacity(t)} />;
};

export const AUDIO_SECONDS = 85.91;
export const DURATION_SECONDS = 87.5;

const PHOTO_H = 1120;
const STAGE_TOP = 960;
const STAGE_H = 440;
const CAPTION_TOP = 1500;

// La foto ocupa la parte superior en la apertura y en el cierre; en el medio
// van los motion graphics y Paola queda como avatar en el encabezado.
const PHOTO_OUT = 4.9;
const PHOTO_IN = 79.0;
const photoOpacity = (t: number) =>
  interpolate(t, [PHOTO_OUT, PHOTO_OUT + 0.5, PHOTO_IN, PHOTO_IN + 0.6], [1, 0, 0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Avatar: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      border: `3px solid ${C.goldLight}`,
      overflow: "hidden",
      flexShrink: 0,
      background: C.white,
    }}
  >
    <Img
      src={staticFile("paola.jpg")}
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "60% 30%", transform: "scale(1.9)", transformOrigin: "60% 38%" }}
    />
  </div>
);

const Photo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1.04, 1.16]);
  const opacity = photoOpacity(frame / fps);
  if (opacity === 0) return null;
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: 1080, height: PHOTO_H, overflow: "hidden", opacity }}>
      <Img
        src={staticFile("paola.jpg")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 20%",
          transform: `scale(${scale})`,
          transformOrigin: "50% 35%",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom, rgba(251,249,245,0) 55%, rgba(251,249,245,0.85) 80%, ${C.cream} 97%)`,
        }}
      />
    </div>
  );
};

const Monogram: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      border: `2px solid ${C.goldLight}`,
      background: "rgba(251,249,245,0.75)",
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

const Brand: React.FC = () => {
  const p = useAppear(0.1);
  return (
    <div
      style={{
        position: "absolute",
        top: 120,
        left: 64,
        display: "flex",
        alignItems: "center",
        gap: 20,
        opacity: p,
      }}
    >
      <Avatar size={84} />
      <div style={{ fontFamily: mono, fontWeight: 500, color: C.ink, letterSpacing: "0.14em" }}>
        <div style={{ fontSize: 24 }}>DRA. PAOLA LIMBOZZI</div>
        <div style={{ fontSize: 18, color: C.text, marginTop: 6 }}>ACADEMY · MEDICINA ESTÉTICA</div>
      </div>
    </div>
  );
};

// Subtítulos sincronizados: la palabra que se está diciendo lleva resaltador.
const Captions: React.FC = () => {
  const t = useSeconds();
  const page = PAGES.find((p, i) => t >= p.start - 0.05 && t < (PAGES[i + 1]?.start ?? p.end + 0.6) && t < p.end + 0.6);
  if (!page) return null;
  const enter = interpolate(t, [page.start - 0.05, page.start + 0.12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: CAPTION_TOP,
        left: 60,
        right: 60,
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: "4px 14px",
        fontFamily: sans,
        fontWeight: 600,
        fontSize: 56,
        lineHeight: 1.25,
        color: C.ink,
        opacity: enter,
        transform: `scale(${0.96 + 0.04 * enter})`,
      }}
    >
      {page.words.map((w, i) => {
        const active = t >= w.start && t < w.end + 0.05;
        const said = t >= w.start;
        return (
          <span
            key={i}
            style={{
              padding: "0 8px",
              borderRadius: 4,
              background: active ? C.marker : "transparent",
              opacity: said ? 1 : 0.45,
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

const ProductCard: React.FC<{ at: number; name: string; abbr: string }> = ({ at, name, abbr }) => (
  <Card at={at} style={{ width: 440, textAlign: "left", padding: "24px 28px" }}>
    <div style={{ fontFamily: mono, fontSize: 22, color: C.teal, letterSpacing: "0.12em" }}>{abbr}</div>
    <div style={{ fontFamily: serif, fontSize: 40, color: C.ink, lineHeight: 1.1, marginTop: 8 }}>{name}</div>
  </Card>
);

const Bullet: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const p = useAppear(at);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 20,
        fontFamily: sans,
        fontSize: 42,
        color: C.ink,
        opacity: p,
        transform: `translateX(${(1 - p) * -30}px)`,
        padding: "14px 0",
        borderBottom: `1px solid ${C.line}`,
        width: 760,
        textAlign: "left",
      }}
    >
      <GoldDot />
      {children}
    </div>
  );
};

const Stage: React.FC = () => {
  const ojo = timeOf("Ojo");
  return (
    <div style={{ position: "absolute", top: STAGE_TOP, left: 0, width: 1080, height: STAGE_H }}>
      {/* 1. Hook: los nombres de los bioestimuladores */}
      <Scene from={0.4} to={5.0}>
        <Eyebrow>Bioestimuladores</Eyebrow>
        {[
          ["Hidroxiapatita", timeOf("Hidroxiapatita")],
          ["Poli-L-láctico", timeOf("poli-L")],
          ["Policaprolactona", timeOf("policaprolactona")],
        ].map(([name, at]) => (
          <Headline key={name as string} parts={[{ em: name as string }]} at={at as number} size={78} />
        ))}
      </Scene>

      {/* 2. La pregunta */}
      <Scene from={5.1} to={9.5}>
        <Headline parts={["¿Cuál es el ", { em: "mejor" }, " bioestimulador?"]} at={5.15} size={88} />
        <Body at={timeOf("Te", 7)}>Te cuento: no hay uno mejor.</Body>
      </Scene>

      {/* 3. Uno indicado para cada paciente + los 4 productos */}
      <Scene from={9.6} to={18.6}>
        <Headline parts={["Hay uno ", { em: "indicado" }, " para cada paciente"]} at={9.65} size={60} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "440px 440px",
            gap: 22,
            marginTop: 34,
          }}
        >
          <ProductCard at={timeOf("hidroxiapatita", 9)} abbr="CaHA" name="Hidroxiapatita de calcio" />
          <ProductCard at={timeOf("ácido", 9)} abbr="PLLA" name="Ácido poli-L-láctico" />
          <ProductCard at={timeOf("policaprolactona", 9)} abbr="PCL" name="Policaprolactona" />
          <ProductCard at={timeOf("polidioxanona", 9)} abbr="PDO" name="Polidioxanona" />
        </div>
      </Scene>

      {/* 4. Los papers */}
      <Scene from={18.8} to={29.1}>
        <Headline parts={["Papers donde uno ", { em: "le gana" }, " al otro"]} at={18.9} size={74} />
        <div style={{ marginTop: 30 }}>
          <Bullet at={timeOf("Más", 18)}>Más colágeno</Bullet>
          <Bullet at={timeOf("menos", 18)}>Menos inflamación</Bullet>
          <Bullet at={timeOf("mejor", 18)}>Mejor remodelación de la matriz</Bullet>
        </div>
      </Scene>

      {/* 5. Ojo: conflicto de intereses */}
      <Scene from={ojo - 0.1} to={35.6}>
        <Headline parts={[{ em: "Ojo." }]} at={ojo} size={150} />
        <Headline parts={["Conflicto de intereses"]} at={timeOf("conflicto")} size={70} />
        <Body at={timeOf("Los", 30)}>Los financia la misma marca que vende el producto.</Body>
      </Scene>

      {/* 6. Estudios independientes */}
      <Scene from={35.75} to={39.4}>
        <Eyebrow at={35.8}>Lo que filtré</Eyebrow>
        <Headline parts={["Solo estudios ", { em: "independientes" }]} at={timeOf("solo", 35)} size={86} />
      </Scene>

      {/* 7. Hidroxiapatita de calcio */}
      <Scene from={39.5} to={49.5}>
        <Eyebrow>CaHA · Hidroxiapatita de calcio</Eyebrow>
        <Headline parts={["Regenera la matriz y da ", { em: "soporte estructural" }]} at={timeOf("regenerar")} size={72} />
        <Body at={timeOf("Por", 45)}>Ideal en pérdida de sostén profundo.</Body>
      </Scene>

      {/* 8. Ácido poli-L-láctico */}
      <Scene from={49.6} to={55.4}>
        <Eyebrow>PLLA · Ácido poli-L-láctico</Eyebrow>
        <Headline parts={["Elasticidad y grosor de la piel, ", { em: "en forma progresiva" }]} at={timeOf("mejora", 49)} size={72} />
      </Scene>

      {/* 9. Reconstitución y granulomas */}
      <Scene from={55.5} to={65.1}>
        <Eyebrow color={C.gold}>Atención</Eyebrow>
        <Headline parts={["Reconstitución ", { em: "al pie de la letra" }]} at={timeOf("respetar", 55)} size={78} />
        <Body at={timeOf("riesgo", 59)}>Si no, aparece el riesgo de granulomas.</Body>
        <Body at={timeOf("Se", 61)} size={36}>
          Se necesita <b style={{ color: C.ink }}>experiencia y buena técnica.</b>
        </Body>
      </Scene>

      {/* 10. La mitad del resultado */}
      <Scene from={65.2} to={71.45}>
        <Headline parts={["Elegir bien el producto es ", { em: "la mitad" }, " del resultado."]} at={65.35} size={74} />
        <Body at={timeOf("La", 68)} size={44}>
          La otra mitad es <b style={{ color: C.ink }}>tu mano y expertise.</b>
        </Body>
      </Scene>

      {/* 11. La técnica se entrena */}
      <Scene from={71.5} to={79.1}>
        <Headline parts={["La técnica ", { em: "se entrena." }]} at={71.55} size={92} />
        <Body at={timeOf("En", 73)}>
          En la academia te formamos para planificar con <b style={{ color: C.teal }}>criterio y seguridad.</b>
        </Body>
      </Scene>

      {/* 12. CTA */}
      <Scene from={79.15} to={DURATION_SECONDS}>
        <Eyebrow>Próximo curso</Eyebrow>
        <Headline parts={["Escribime"]} at={79.2} size={96} />
        <CtaButton at={timeOf("BIOESTIMULADORES")} />
        <Body at={timeOf("y", 80)} size={38}>
          por mensaje y te mando la info del próximo curso.
        </Body>
      </Scene>
    </div>
  );
};

const CtaButton: React.FC<{ at: number }> = ({ at }) => {
  const p = useAppear(at, 14);
  return (
    <div
      style={{
        marginTop: 26,
        background: C.teal,
        color: C.white,
        fontFamily: sans,
        fontWeight: 700,
        fontSize: 54,
        letterSpacing: "0.06em",
        padding: "22px 44px",
        borderRadius: 4,
        boxShadow: "0 14px 34px rgba(74,147,168,.35)",
        transform: `scale(${0.8 + 0.2 * p})`,
        opacity: Math.min(1, p * 1.5),
      }}
    >
      BIOESTIMULADORES
    </div>
  );
};

// Cierre: tarjeta de marca sobre crema.
const EndCard: React.FC = () => {
  const t = useSeconds();
  const start = AUDIO_SECONDS - 1.6;
  if (t < start) return null;
  const p = interpolate(t, [start, start + 0.6], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        background: C.cream,
        opacity: p,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <Monogram size={170} />
      <div style={{ fontFamily: serif, fontSize: 76, color: C.ink, marginTop: 44, lineHeight: 1.1 }}>
        Paola Limbozzi <span style={{ fontStyle: "italic", color: C.gold }}>Academy</span>
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: 26,
          letterSpacing: "0.16em",
          color: C.teal,
          marginTop: 22,
        }}
      >
        — ACADEMIA DE MEDICINA ESTÉTICA
      </div>
      <div
        style={{
          fontFamily: serif,
          fontSize: 44,
          color: C.text,
          marginTop: 60,
          maxWidth: 820,
          lineHeight: 1.25,
        }}
      >
        Formar no es mostrar una técnica, es <span style={{ fontStyle: "italic", color: C.gold }}>enseñar a pensar.</span>
      </div>
    </AbsoluteFill>
  );
};

export const Bioestimuladores: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <Audio src={staticFile("bioestimuladores.m4a")} />
      <Backdrop />
      <MotionGraphics />
      <Photo />
      <Brand />
      <Stage />
      <Captions />
      <EndCard />
    </AbsoluteFill>
  );
};
