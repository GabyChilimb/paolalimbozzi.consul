// Línea de tiempo de un video editado: mapea tiempos del original al video
// con silencios cortados y arma palabras/páginas de subtítulos.
export type Segment = { start: number; end: number; text: string };
export type Word = { text: string; start: number; end: number };
export type Page = { words: Word[]; start: number; end: number };

const MAX_CHARS = 24;

export const makeTimeline = (raw: Segment[], keep: [number, number][]) => {
  // Tiempo del original → tiempo editado. Lo que cae en un silencio cortado se pega al corte.
  const T = (orig: number): number => {
    let acc = 0;
    for (const [s, e] of keep) {
      if (orig < s) return acc;
      if (orig <= e) return acc + (orig - s);
      acc += e - s;
    }
    return acc;
  };

  const VOICE_SECONDS = keep.reduce((a, [s, e]) => a + e - s, 0);
  const SEGMENTS: Segment[] = raw.map((s) => ({ ...s, start: T(s.start), end: T(s.end) }));

  // Tiempos por frase; se reparten entre las palabras según su largo.
  const WORDS: Word[] = SEGMENTS.flatMap((seg) => {
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

  const PAGES: Page[] = (() => {
    const pages: Page[] = [];
    let cur: Word[] = [];
    const flush = () => {
      if (cur.length) pages.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
      cur = [];
    };
    for (let i = 0; i < WORDS.length; i++) {
      const w = WORDS[i];
      const prev = WORDS[i - 1];
      const len = cur.reduce((a, x) => a + x.text.length + 1, 0);
      if (cur.length && (len + w.text.length > MAX_CHARS || (prev && w.start - prev.end > 0.15))) flush();
      cur.push(w);
      if (/[.,:?!…]$/.test(w.text) && len + w.text.length > 10) flush();
    }
    flush();
    return pages;
  })();

  // Momento (tiempo editado) en que se dice una palabra; `after` en tiempo original.
  const timeOf = (needle: string, after = 0): number => {
    const n = needle.toLowerCase();
    const from = T(after);
    const w = WORDS.find((x) => x.start >= from && x.text.toLowerCase().startsWith(n));
    if (!w) throw new Error(`Palabra no encontrada: ${needle} (después de ${after}s)`);
    return w.start;
  };

  return { T, VOICE_SECONDS, SEGMENTS, WORDS, PAGES, timeOf };
};
