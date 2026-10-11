// Transcripción del audio (Whisper turbo + VAD), corregida a mano.
// start/end en segundos del audio ORIGINAL. Si querés cambiar un texto, editalo acá.
export type Segment = { start: number; end: number; text: string };

export const RAW_SEGMENTS: Segment[] = [
  { start: 0.79, end: 4.76, text: "Hidroxiapatita, ácido poli-L-láctico, policaprolactona…" },
  { start: 5.24, end: 6.9, text: "¿Cuál es el mejor bioestimulador?" },
  { start: 7.32, end: 9.46, text: "Te cuento: no hay uno mejor." },
  {
    start: 9.66,
    end: 18.27,
    text: "Hay uno indicado para cada paciente. Hoy tenemos hidroxiapatita de calcio, ácido poli-L-láctico, policaprolactona y polidioxanona.",
  },
  {
    start: 18.9,
    end: 28.44,
    text: "Si buscás papers, vas a encontrar muchos que dicen que uno le gana al otro. Más colágeno, menos inflamación, mejor remodelación de la matriz extracelular.",
  },
  { start: 29.3, end: 29.82, text: "Ojo." },
  {
    start: 30.14,
    end: 35.32,
    text: "Muchos de estos estudios tienen conflicto de intereses. Los financia la misma marca que vende el producto.",
  },
  { start: 35.83, end: 39.06, text: "Así que filtré y me quedé solo con estudios independientes." },
  {
    start: 39.61,
    end: 45.27,
    text: "La hidroxiapatita de calcio, además de regenerar la matriz extracelular, da soporte estructural.",
  },
  { start: 45.72, end: 49.21, text: "Por eso tiene sentido en pacientes con pérdida de sostén profundo." },
  {
    start: 49.72,
    end: 55.16,
    text: "El ácido poli-L-láctico mejora la elasticidad y el grosor de la piel en forma progresiva.",
  },
  { start: 55.54, end: 58.97, text: "Pero hay que respetar al pie de la letra la reconstitución," },
  {
    start: 59.22,
    end: 64.73,
    text: "porque si no, aparece el riesgo de granulomas. Se necesita experiencia y buena técnica.",
  },
  { start: 65.37, end: 68.41, text: "Elegir bien el producto es la mitad del resultado." },
  { start: 68.66, end: 71.29, text: "La otra mitad es tu mano y expertise." },
  { start: 71.54, end: 73.11, text: "Y la técnica se entrena." },
  {
    start: 73.59,
    end: 78.81,
    text: "En la academia te formamos para que planifiques tu tratamiento con criterio y seguridad.",
  },
  {
    start: 79.22,
    end: 84.02,
    text: "Escribime BIOESTIMULADORES por mensaje y te mando la info del próximo curso.",
  },
];

// Tramos del audio original que quedan después de cortar silencios.
// Generado por tools/voz.py (mismo criterio que public/voz.wav).
// 13 tramos, 80.03s (original 85.91s)
export const KEEP: [number, number][] = [
  [0.690, 4.900],
  [5.140, 7.040],
  [7.220, 18.410],
  [18.800, 28.580],
  [29.200, 35.460],
  [35.730, 39.200],
  [39.510, 45.410],
  [45.620, 49.350],
  [49.620, 55.300],
  [55.440, 64.870],
  [65.270, 73.250],
  [73.490, 78.950],
  [79.120, 84.160],
];

// Convierte un tiempo del audio original al tiempo del video ya editado.
// Un tiempo que cae dentro de un silencio cortado se pega al corte.
export const T = (orig: number): number => {
  let acc = 0;
  for (const [s, e] of KEEP) {
    if (orig < s) return acc;
    if (orig <= e) return acc + (orig - s);
    acc += e - s;
  }
  return acc;
};

export const VOICE_SECONDS = KEEP.reduce((a, [s, e]) => a + e - s, 0);

// Segmentos en el tiempo del video editado.
export const SEGMENTS: Segment[] = RAW_SEGMENTS.map((s) => ({ ...s, start: T(s.start), end: T(s.end) }));

export type Word = { text: string; start: number; end: number };

// El reconocedor da tiempos por frase; repartimos cada frase entre sus
// palabras en proporción a su largo (una buena aproximación del ritmo del habla).
export const WORDS: Word[] = SEGMENTS.flatMap((seg) => {
  const parts = seg.text.split(/\s+/).filter(Boolean);
  const weights = parts.map((p) => p.replace(/[^\p{L}\p{N}]/gu, "").length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  const dur = seg.end - seg.start;
  let t = seg.start;
  return parts.map((text, i) => {
    const start = t;
    t += (weights[i] / total) * dur;
    return { text, start, end: t };
  });
});

export type Page = { words: Word[]; start: number; end: number };

const MAX_CHARS = 24;

// Agrupa palabras en "páginas" de subtítulo cortas, cortando en puntuación.
export const PAGES: Page[] = (() => {
  const pages: Page[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) {
      pages.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
    }
    cur = [];
  };
  for (let i = 0; i < WORDS.length; i++) {
    const w = WORDS[i];
    const prev = WORDS[i - 1];
    const len = cur.reduce((a, x) => a + x.text.length + 1, 0);
    if (cur.length && (len + w.text.length > MAX_CHARS || (prev && w.start - prev.end > 0.15))) {
      flush();
    }
    cur.push(w);
    if (/[.,:?!…]$/.test(w.text) && len + w.text.length > 10) flush();
  }
  flush();
  return pages;
})();

// Momento (en segundos) en que se dice una palabra, para sincronizar animaciones.
// `after` va en segundos del audio original, como el resto de las marcas.
export const timeOf = (needle: string, after = 0): number => {
  const n = needle.toLowerCase();
  const from = T(after);
  const w = WORDS.find((x) => x.start >= from && x.text.toLowerCase().startsWith(n));
  if (!w) throw new Error(`Palabra no encontrada: ${needle} (después de ${after}s)`);
  return w.start;
};
