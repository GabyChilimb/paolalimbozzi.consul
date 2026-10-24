import { display, hand, sans, serif, spooky } from "../../Bioestimuladores/theme";
import { StyleName } from "./types";

export type CaptionMode = "marker" | "pop" | "box" | "outline";
export type ZoomMode = "punch" | "push" | "pan" | "breath";
export type CutMode = "none" | "flash" | "zoomblur" | "whip" | "glitch" | "dip";
export type Particles = "sparkle" | "dust" | "embers" | "none";

export type Look = {
  accent: string; // color de énfasis principal
  accent2: string;
  ink: string; // texto oscuro
  paper: string; // fondo claro de tarjetas / cierre
  cardBg: string;
  cardInk: string;
  marker: string; // resaltador de subtítulos
  titleFont: string;
  titleUpper: boolean;
  emItalic: boolean; // las partes { em } van en itálica
  eyebrowFont: string;
  captions: CaptionMode;
  captionsY: number;
  zoom: ZoomMode;
  zoomAmount: number;
  cut: CutMode;
  grade: string; // filtro CSS sobre el video
  tint?: { color: string; blend: string; opacity: number };
  grain: number;
  vignette: number;
  leak: boolean;
  particles: Particles;
  flicker: boolean;
  letterbox: boolean;
  progress: boolean;
  endBg: string;
  endInk: string;
  sfx: { enter: string; item: string; big: string; stamp: string; cta: string; riser: string; end: string; cut?: string; note: string };
};

const mono = '"IBM Plex Mono", monospace';

const base = {
  ink: "#1B1815",
  paper: "#FBF9F5",
  marker: "#F2D04B",
  eyebrowFont: mono,
  grain: 0,
  vignette: 0,
  leak: false,
  particles: "none" as Particles,
  flicker: false,
  letterbox: false,
  progress: false,
  endBg: "#FBF9F5",
  endInk: "#1B1815",
};

export const LOOKS: Record<StyleName, Look> = {
  // Consultorio luminoso: tarjetas negras, sans bold, cortes con zoom.
  clinica: {
    ...base,
    accent: "#4A93A8",
    accent2: "#E5C46A",
    cardBg: "#1B1815",
    cardInk: "#FFFFFF",
    titleFont: sans,
    titleUpper: false,
    emItalic: false,
    captions: "marker",
    captionsY: 1430,
    zoom: "punch",
    zoomAmount: 0.14,
    cut: "zoomblur",
    grade: "contrast(1.04) saturate(1.06) brightness(1.02)",
    vignette: 0.15,
    particles: "sparkle",
    sfx: { enter: "whoosh", item: "pop", big: "impacto", stamp: "pop-alto", cta: "ding", riser: "riser", end: "sting", note: "escritura" },
  },
  // Revista: serif con itálica dorada, tarjetas crema, transiciones suaves.
  editorial: {
    ...base,
    accent: "#B99A48",
    accent2: "#4A93A8",
    cardBg: "#FBF9F5",
    cardInk: "#1B1815",
    titleFont: serif,
    titleUpper: false,
    emItalic: true,
    captions: "box",
    captionsY: 1440,
    zoom: "push",
    zoomAmount: 0.1,
    cut: "dip",
    grade: "contrast(1.03) saturate(1.04) sepia(0.06)",
    vignette: 0.25,
    leak: true,
    sfx: { enter: "swoosh", item: "burbuja", big: "sub", stamp: "brillo", cta: "brillo", riser: "riser", end: "sting", note: "escritura" },
  },
  // Pop / reel viral: condensada en mayúsculas, amarillo, una palabra por vez.
  pop: {
    ...base,
    accent: "#F5C518",
    accent2: "#4A93A8",
    cardBg: "#0A0B10",
    cardInk: "#FFFFFF",
    titleFont: display,
    titleUpper: true,
    emItalic: false,
    captions: "pop",
    captionsY: 1330,
    zoom: "punch",
    zoomAmount: 0.2,
    cut: "whip",
    grade: "contrast(1.1) saturate(1.15)",
    vignette: 0.2,
    progress: true,
    endBg: "#0A0B10",
    endInk: "#FFFFFF",
    sfx: { enter: "whoosh", item: "pop-alto", big: "impacto", stamp: "glitch", cta: "ding", riser: "riser", end: "sting", cut: "swoosh", note: "click" },
  },
  // Noche: fondo azul-negro de IG, blanco + dorado, grano y viñeta.
  noche: {
    ...base,
    accent: "#D4AF37",
    accent2: "#4A93A8",
    cardBg: "#0A0B10",
    cardInk: "#FFFFFF",
    titleFont: serif,
    titleUpper: false,
    emItalic: true,
    captions: "outline",
    captionsY: 1420,
    zoom: "breath",
    zoomAmount: 0.08,
    cut: "flash",
    grade: "contrast(1.08) saturate(0.95) brightness(0.97)",
    grain: 0.07,
    vignette: 0.45,
    particles: "dust",
    endBg: "#0A0B10",
    endInk: "#FFFFFF",
    sfx: { enter: "swoosh", item: "click", big: "sub", stamp: "brillo", cta: "brillo", riser: "riser", end: "sting", note: "click" },
  },
  // Anotador: papel crema, letra manuscrita y resaltador amarillo.
  anotador: {
    ...base,
    accent: "#2B4C8C",
    accent2: "#F2D04B",
    cardBg: "#FAF0D4",
    cardInk: "#1F2A44",
    titleFont: hand,
    titleUpper: false,
    emItalic: false,
    captions: "marker",
    captionsY: 1430,
    zoom: "push",
    zoomAmount: 0.12,
    cut: "whip",
    grade: "contrast(1.03) saturate(1.05)",
    vignette: 0.1,
    sfx: { enter: "escritura", item: "obturador", big: "pop", stamp: "pop-alto", cta: "ding", riser: "riser", end: "sting", note: "escritura" },
  },
  // Academia: turquesa + mono, barra de progreso, cortes con zoom.
  academia: {
    ...base,
    accent: "#4A93A8",
    accent2: "#B99A48",
    cardBg: "#FFFFFF",
    cardInk: "#1B1815",
    titleFont: serif,
    titleUpper: false,
    emItalic: true,
    captions: "box",
    captionsY: 1450,
    zoom: "punch",
    zoomAmount: 0.12,
    cut: "zoomblur",
    grade: "contrast(1.05) saturate(1.05)",
    vignette: 0.2,
    progress: true,
    sfx: { enter: "swoosh", item: "click", big: "sub", stamp: "ding", cta: "ding", riser: "riser", end: "sting", note: "escritura" },
  },
  // Halloween / bruja: tipografía de terror, violeta y naranja, parpadeo.
  bruja: {
    ...base,
    accent: "#FF7A1A",
    accent2: "#9B5DE5",
    cardBg: "#120A1C",
    cardInk: "#F5ECFF",
    marker: "#FF7A1A",
    titleFont: spooky,
    titleUpper: true,
    emItalic: false,
    captions: "outline",
    captionsY: 1420,
    zoom: "breath",
    zoomAmount: 0.1,
    cut: "glitch",
    grade: "contrast(1.18) saturate(0.75) brightness(0.86) hue-rotate(-8deg)",
    tint: { color: "#5B2A86", blend: "soft-light", opacity: 0.45 },
    grain: 0.1,
    vignette: 0.65,
    particles: "embers",
    flicker: true,
    letterbox: true,
    endBg: "#0B0612",
    endInk: "#F5ECFF",
    sfx: { enter: "glitch", item: "latido", big: "trueno", stamp: "campana", cta: "campana", riser: "riser", end: "sting-oscuro", cut: "glitch", note: "click" },
  },
  // Cálido: tonos dorados, destellos de luz, paneo suave.
  calido: {
    ...base,
    accent: "#C9822E",
    accent2: "#B99A48",
    cardBg: "#FFF7EC",
    cardInk: "#3A2414",
    titleFont: serif,
    titleUpper: false,
    emItalic: true,
    captions: "outline",
    captionsY: 1430,
    zoom: "pan",
    zoomAmount: 0.12,
    cut: "dip",
    grade: "contrast(1.04) saturate(1.1) sepia(0.12)",
    vignette: 0.3,
    leak: true,
    particles: "sparkle",
    endBg: "#FFF7EC",
    endInk: "#3A2414",
    sfx: { enter: "swoosh", item: "burbuja", big: "sub", stamp: "brillo", cta: "brillo", riser: "riser", end: "sting", note: "escritura" },
  },
};
