import { HANDLE } from "../reels/handles";
import { MontajeConfig } from "./types";

// Serie "Congreso BAM · São Paulo, noviembre 2026": lo que Paola prometió mostrar en su primer
// video ("el congreso, los preparativos, mis amigos, colegas y mucho más").
// Solo se usa el sonido grabado en el congreso (c04 = Paola con el kit, c11/c16 = oradores);
// el resto lo cuentan los títulos sobre música.

export const preparativos: MontajeConfig = {
  id: "BamPreparativos",
  titulo: "bam-01-los-preparativos",
  handle: HANDLE.academy,
  acento: "#5CE1FF",
  acento2: "#E5C46A",
  claves: ["experiencia", "Brasil,", "Paulo,", "días", "días,"],
  tramos: [
    {
      dur: 2.0,
      tomas: [{ foto: "059", mov: "in" }],
      titulo: { lineas: [{ t: "Los", estilo: "fuerte" }, { t: "Preparativos", estilo: "serifNeon", tam: 140 }], y: 760, dur: 2.6 },
    },
    { dur: 2.3, tomas: [{ clip: "x2-lento", desde: 3 }] },
    {
      dur: 3.2,
      tomas: [{ clip: "x3-lento", desde: 2 }, { foto: "115", mov: "out", foco: { x: 0.4, y: 0.4 } }],
      titulo: { lineas: [{ t: "Rumbo a", estilo: "fuerte", tam: 70 }, { t: "São Paulo", estilo: "neon", tam: 120 }], at: 0.4, y: 700 },
    },
    {
      dur: 2.4,
      tomas: [{ foto: "117", mov: "in", foco: { x: 0.5, y: 0.5 } }, { foto: "036", mov: "izq" }],
      titulo: { lineas: [{ t: "Destino", estilo: "chico" }, { t: "Brasil", estilo: "serifNeon", tam: 160 }], y: 1120 },
    },
    { dur: 2.0, tomas: [{ clip: "02-lento", desde: 7 }], titulo: { lineas: [{ t: "Check-in", estilo: "contorno", tam: 104 }, { t: "listo", estilo: "chico" }], y: 760 } },
    { dur: 1.8, tomas: [{ foto: "023", mov: "in" }, { foto: "040", mov: "der" }] },
    {
      voz: { src: "c04.wav", desde: 0.2, hasta: 8.0, texto: "Está como para pecar con todo, ¿no? Imagínense que llevo tres días." },
      tomas: [{ clip: "04", desde: 0.2, mov: "in" }],
      titulo: { lineas: [{ t: "Kit de", estilo: "fuerte", tam: 80 }, { t: "supervivencia", estilo: "serifNeon", tam: 120 }], at: 0.6, dur: 3.4, y: 640 },
    },
    {
      dur: 2.6,
      tomas: [{ clip: "21", desde: 22, dur: 1.4 }, { foto: "099", mov: "in" }],
      titulo: { lineas: [{ t: "El equipo", estilo: "fuerte" }, { t: "en la valija", estilo: "neon", tam: 90 }], y: 1160 },
    },
    {
      dur: 2.2,
      tomas: [{ foto: "094", mov: "in" }, { foto: "064", mov: "izq" }],
      titulo: { lineas: [{ t: "Acreditada", estilo: "serif", tam: 120 }, { t: "BAM 2026", estilo: "neon", tam: 92 }], y: 700 },
    },
    {
      dur: 2.8,
      tomas: [{ foto: "003", mov: "in", foco: { x: 0.35, y: 0.4 } }],
      titulo: { lineas: [{ t: "Acompañame", estilo: "fuerte", tam: 84 }, { t: "estos días", estilo: "neon", tam: 104 }], y: 1150 },
    },
  ],
  cierre: { lineas: [{ t: "Esto recién", estilo: "fuerte", tam: 72 }, { t: "empieza", estilo: "serifNeon", tam: 130 }], sub: "BAM · São Paulo 2026" },
  musica: { preset: "luminoso", seed: 71 },
};

export const elCongreso: MontajeConfig = {
  id: "BamElCongreso",
  titulo: "bam-02-el-congreso",
  handle: HANDLE.academy,
  acento: "#C98BFF",
  acento2: "#E5C46A",
  claves: ["Congreso", "BAM.", "BAM,", "feliz", "encuentro,", "referentes", "especialidad."],
  tramos: [
    {
      dur: 2.0,
      tomas: [{ foto: "017", mov: "in" }],
      titulo: { lineas: [{ t: "El", estilo: "fuerte" }, { t: "Congreso", estilo: "serifNeon", tam: 150 }], y: 820, dur: 2.4 },
    },
    { dur: 2.2, tomas: [{ clip: "15-lento", desde: 2 }] },
    {
      dur: 3.7,
      tomas: [{ clip: "17-lento", desde: 6, dur: 1.7 }, { foto: "053", mov: "in" }, { foto: "109", mov: "izq" }],
      titulo: { lineas: [{ t: "BAM", estilo: "serifNeon", tam: 180 }, { t: "Brazilian Aesthetics Meeting", estilo: "chico", tam: 40 }], at: 1.7, y: 760 },
    },
    {
      dur: 2.9,
      tomas: [{ foto: "021", mov: "in", foco: { x: 0.35, y: 0.35 } }, { foto: "050", mov: "out", foco: { x: 0.3, y: 0.4 } }],
      titulo: { lineas: [{ t: "Dra. Paola", estilo: "fuerte", tam: 76 }, { t: "Limbozzi", estilo: "serifNeon", tam: 132 }, { t: "BAM Brasil 2026", estilo: "chico" }], at: 0.2, y: 640 },
    },
    { dur: 2.2, tomas: [{ clip: "12-lento", desde: 1 }] },
    {
      dur: 4.8,
      tomas: [{ foto: "068", mov: "in" }, { foto: "067", mov: "izq" }, { foto: "063", mov: "in" }],
      titulo: { lineas: [{ t: "Día 2", estilo: "serifNeon", tam: 150 }, { t: "18 y 19 de noviembre", estilo: "chico" }], y: 640 },
    },
    {
      dur: 2.6,
      tomas: [{ foto: "095", mov: "in" }],
      titulo: { lineas: [{ t: "Una sala", estilo: "fuerte" }, { t: "llena", estilo: "contorno", tam: 120 }], y: 1150 },
    },
    { dur: 2.4, tomas: [{ foto: "100", mov: "in" }, { foto: "091", mov: "in" }] },
    {
      dur: 4.0,
      tomas: [{ foto: "031", mov: "in" }, { foto: "035", mov: "out" }, { foto: "055", mov: "in" }],
      titulo: { lineas: [{ t: "Aprender de", estilo: "fuerte", tam: 78 }, { t: "referentes", estilo: "serifNeon", tam: 130 }], at: 1.3, y: 700 },
    },
  ],
  cierre: { lineas: [{ t: "Nos vemos en el", estilo: "fuerte", tam: 64 }, { t: "próximo BAM", estilo: "serifNeon", tam: 120 }], sub: "Brazilian Aesthetics Meeting" },
  musica: { preset: "academy", seed: 72 },
};

export const lasClases: MontajeConfig = {
  id: "BamLasClases",
  titulo: "bam-03-las-clases",
  handle: HANDLE.academy,
  acento: "#7CFF6B",
  acento2: "#5CE1FF",
  claves: ["clases,", "presentaciones,", "lisos,", "espiculados,", "tecnología.", "colágeno.", "mandibular.", "mandíbula.", "Corea,", "vanguardia", "skincare"],
  tramos: [
    {
      dur: 4.0,
      tomas: [{ foto: "002", mov: "in" }, { foto: "019", mov: "out" }, { foto: "010", mov: "in" }],
      titulo: { lineas: [{ t: "Las", estilo: "fuerte" }, { t: "Clases", estilo: "serifNeon", tam: 160 }], y: 760, dur: 2.6 },
    },
    {
      dur: 4.0,
      tomas: [{ clip: "11-lento", desde: 6 }, { foto: "057", mov: "in" }, { foto: "026", mov: "out" }],
      titulo: { lineas: [{ t: "Hilos lisos", estilo: "neon", tam: 96 }, { t: "y espiculados", estilo: "fuerte", tam: 76 }], at: 0.2, y: 700 },
    },
    {
      voz: { src: "c16.wav", desde: 27.9, hasta: 36.4, texto: "Cuando lo traccionamos, mirá cómo marcamos el contorno mandibular. Ahora tiene cuello, ahora tiene mandíbula." },
      tomas: [{ clip: "16", desde: 27.9, mov: "in" }],
      titulo: { lineas: [{ t: "Contorno", estilo: "contorno", tam: 110 }, { t: "mandibular", estilo: "serifNeon", tam: 120 }], at: 3.0, dur: 3.6, y: 620 },
    },
    {
      voz: { src: "c11.wav", desde: 4.4, hasta: 11.2, texto: "Mirá cómo va superficial, en dermis media, para estimular el colágeno." },
      tomas: [{ clip: "11", desde: 4.4, mov: "in" }],
      titulo: { lineas: [{ t: "Estimular el", estilo: "fuerte", tam: 76 }, { t: "colágeno", estilo: "neon", tam: 120 }], at: 3.6, y: 620 },
    },
    {
      dur: 5.8,
      tomas: [{ foto: "004", mov: "in", foco: { x: 0.5, y: 0.3 } }, { foto: "113", mov: "out" }, { foto: "054", mov: "in" }],
      titulo: { lineas: [{ t: "Vanguardia", estilo: "serifNeon", tam: 130 }, { t: "desde Corea", estilo: "fuerte", tam: 80 }], at: 0.4, y: 700 },
    },
  ],
  cierre: { lineas: [{ t: "Todo esto", estilo: "fuerte", tam: 72 }, { t: "para tu consultorio", estilo: "serifNeon", tam: 96 }], sub: "Máster en Anatomía Facial · BAM" },
  musica: { preset: "academy", seed: 73 },
};

export const amigosColegas: MontajeConfig = {
  id: "BamAmigosColegas",
  titulo: "bam-04-amigos-y-colegas",
  handle: HANDLE.academy,
  acento: "#FF77C8",
  acento2: "#E5C46A",
  claves: ["amigos,", "colegas", "experiencia,", "trabajo,", "conocimientos", "mundo", "más."],
  tramos: [
    {
      dur: 2.0,
      tomas: [{ foto: "107", mov: "in" }],
      titulo: { lineas: [{ t: "Mis amigos", estilo: "serifNeon", tam: 128 }, { t: "y colegas", estilo: "fuerte", tam: 84 }], y: 760, dur: 2.6 },
    },
    { dur: 2.6, tomas: [{ foto: "104", mov: "in" }, { foto: "014", mov: "out" }] },
    {
      dur: 3.9,
      tomas: [{ foto: "043", mov: "in" }, { foto: "112", mov: "out" }, { foto: "097", mov: "in" }],
      titulo: { lineas: [{ t: "De todo", estilo: "fuerte", tam: 80 }, { t: "el mundo", estilo: "serifNeon", tam: 130 }], at: 1.6, y: 700 },
    },
    {
      dur: 3.4,
      tomas: [{ clip: "05-lento", desde: 2, dur: 2.0 }, { foto: "022", mov: "in" }],
      titulo: { lineas: [{ t: "Cenas", estilo: "fuerte" }, { t: "inolvidables", estilo: "neon", tam: 100 }], y: 700 },
    },
    {
      dur: 3.7,
      tomas: [{ foto: "077", mov: "in" }, { foto: "093", mov: "out" }, { foto: "087", mov: "in" }],
      titulo: { lineas: [{ t: "Compartir", estilo: "fuerte", tam: 84 }, { t: "experiencias", estilo: "serifNeon", tam: 118 }], at: 0.8, y: 700 },
    },
    {
      dur: 3.0,
      tomas: [{ foto: "074", mov: "izq" }, { foto: "082", mov: "in" }, { foto: "075", mov: "der" }],
      titulo: { lineas: [{ t: "Reencuentros", estilo: "contorno", tam: 104 }], y: 1150 },
    },
    {
      dur: 2.4,
      tomas: [{ foto: "096", mov: "in" }],
      titulo: { lineas: [{ t: "Una gran", estilo: "fuerte", tam: 80 }, { t: "familia", estilo: "serifNeon", tam: 140 }], y: 1160 },
    },
    {
      dur: 2.0,
      tomas: [{ foto: "012", mov: "in" }, { foto: "080", mov: "in" }],
      titulo: { lineas: [{ t: "y mucho", estilo: "fuerte", tam: 84 }, { t: "más", estilo: "serifNeon", tam: 160 }], y: 700, dur: 2.0 },
    },
    { dur: 1.2, tomas: [{ foto: "080", mov: "out" }] },
  ],
  cierre: { lineas: [{ t: "Gracias", estilo: "serifNeon", tam: 140 }, { t: "por tanto", estilo: "fuerte", tam: 80 }], sub: "BAM · São Paulo 2026" },
  musica: { preset: "luminoso", seed: 74 },
};

export const detrasDeEscena: MontajeConfig = {
  id: "BamDetrasDeEscena",
  titulo: "bam-05-detras-de-escena",
  handle: HANDLE.academy,
  acento: "#FFD166",
  acento2: "#5CE1FF",
  claves: ["escena", "maravilloso,", "información", "Argentina,", "consultorio,", "ustedes."],
  tramos: [
    {
      dur: 3.4,
      tomas: [{ foto: "006", mov: "in" }, { foto: "045", mov: "in" }],
      titulo: { lineas: [{ t: "Vení", estilo: "fuerte", tam: 90 }, { t: "conmigo", estilo: "serifNeon", tam: 140 }], y: 1150 },
    },
    {
      dur: 3.3,
      tomas: [{ clip: "01-lento", desde: 3 }, { foto: "116", mov: "izq" }],
      titulo: { lineas: [{ t: "Detrás de", estilo: "fuerte", tam: 86 }, { t: "escena", estilo: "serifNeon", tam: 160 }], at: 1.2, y: 720 },
    },
    {
      dur: 2.6,
      tomas: [{ clip: "08-lento", desde: 6 }],
      titulo: { lineas: [{ t: "Navidad en", estilo: "fuerte", tam: 76 }, { t: "São Paulo", estilo: "neon", tam: 116 }], y: 700 },
    },
    { dur: 2.4, tomas: [{ foto: "124", mov: "in" }, { foto: "129", mov: "out" }] },
    {
      dur: 2.4,
      tomas: [{ clip: "13-lento", desde: 8 }, { foto: "126", mov: "in" }],
      titulo: { lineas: [{ t: "Un poquito de", estilo: "chico" }, { t: "shopping", estilo: "contorno", tam: 120 }], y: 760 },
    },
    {
      dur: 7.8,
      tomas: [{ foto: "110", mov: "in" }, { foto: "103", mov: "out" }, { clip: "x1-lento", desde: 0.5 }, { foto: "051", mov: "in" }, { foto: "061", mov: "in" }],
      titulo: { lineas: [{ t: "Un día", estilo: "fuerte", tam: 80 }, { t: "maravilloso", estilo: "serifNeon", tam: 124 }], at: 0.8, dur: 2.8, y: 680 },
    },
    {
      dur: 4.2,
      tomas: [{ foto: "105", mov: "in" }, { foto: "108", mov: "out" }, { foto: "029", mov: "in" }],
      titulo: { lineas: [{ t: "Para", estilo: "chico" }, { t: "Argentina", estilo: "contorno", tam: 110 }, { t: "y para ustedes", estilo: "serifNeon", tam: 96 }], at: 0.2, y: 680 },
    },
  ],
  cierre: { lineas: [{ t: "Hasta el", estilo: "fuerte", tam: 76 }, { t: "próximo viaje", estilo: "serifNeon", tam: 120 }], sub: "São Paulo · noviembre 2026" },
  musica: { preset: "suave", seed: 75 },
};

export const MONTAJES = [preparativos, elCongreso, lasClases, amigosColegas, detrasDeEscena];
