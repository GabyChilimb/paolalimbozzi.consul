import { Segment } from "../../lib/timeline";

// Un momento del video: segundos del ORIGINAL, o una palabra que dice Paola.
export type Anchor = number | { word: string; after?: number; offset?: number };

// Texto con partes destacadas: { em } va en el color/estilo de acento.
export type Part = string | { em: string };

export type Callout =
  // Frase enorme al centro, oscurece el video y hace zoom de énfasis.
  | { kind: "big"; at: Anchor; to?: Anchor; parts: Part[]; eyebrow?: string }
  // Tarjeta en la parte superior.
  | { kind: "card"; at: Anchor; to?: Anchor; eyebrow?: string; parts: Part[]; sub?: string }
  // Sello girado (NO, OJO, CLAVE…).
  | { kind: "stamp"; at: Anchor; to?: Anchor; text: string; icon?: "check" | "cross" | "alert" | "heart" | "star" }
  // Lista de ítems que entran uno a uno.
  | { kind: "list"; at: Anchor; to?: Anchor; title?: Part[]; items: { text: string; at: Anchor }[] }
  // Número grande con etiqueta.
  | { kind: "number"; at: Anchor; to?: Anchor; value: string; label: string }
  // Cita con comillas.
  | { kind: "quote"; at: Anchor; to?: Anchor; parts: Part[] }
  // Zócalo con nombre o dato (sobre el pecho).
  | { kind: "lower"; at: Anchor; to?: Anchor; eyebrow: string; parts: Part[]; sub?: string }
  // Comparación A vs B.
  | { kind: "versus"; at: Anchor; to?: Anchor; left: string; right: string; rightAt?: Anchor; good?: "left" | "right" }
  // Nota manuscrita en papel (estilo IG "anotador").
  | { kind: "note"; at: Anchor; to?: Anchor; parts: Part[] }
  // Círculo/mira sobre la cara (x, y en px del cuadro 1080×1920).
  | { kind: "target"; at: Anchor; to?: Anchor; x: number; y: number; label: string };

export type StyleName = "clinica" | "editorial" | "pop" | "noche" | "anotador" | "academia" | "bruja" | "calido";

export type ReelConfig = {
  id: string; // id de la composición en Remotion
  title: string; // nombre del archivo final
  dir: string; // carpeta en public/reels
  style: StyleName;
  face?: { x: number; y: number }; // origen de los zooms, en % del cuadro
  handle: string;
  raw: Segment[];
  keep: [number, number][];
  keywords?: string[]; // palabras que se colorean en los subtítulos
  hook: { eyebrow?: string; parts: Part[]; to?: Anchor };
  callouts: Callout[];
  cta?: { at: Anchor; kicker: string; button: string; sub?: string };
  end: { parts: Part[]; sub?: string };
  music: { preset: string; seed?: number };
};
