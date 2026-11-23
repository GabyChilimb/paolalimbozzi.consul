// Montajes con fotos y clips: una sucesión de tramos ("beats"), cada uno con su voz
// (o sin voz), sus tomas y, si hace falta, un título cinético.

// Estilos de línea de título (referencia: títulos sin caja, con sombra o brillo neón).
export type EstiloLinea =
  | "fuerte" // sans negrita itálica blanca con sombra
  | "neon" // sans itálica con brillo del color de acento
  | "contorno" // sans itálica del color de acento con borde oscuro
  | "serif" // serif itálica blanca grande
  | "serifNeon" // serif itálica con brillo del color de acento
  | "chico"; // sans blanca chica (bajada)

export type Linea = { t: string; estilo: EstiloLinea; tam?: number; color?: string };

export type Titulo = {
  lineas: Linea[];
  at?: number; // segundos desde el comienzo del tramo (por defecto 0.1)
  dur?: number; // por defecto, hasta el final del tramo
  y?: number; // posición vertical del bloque (px, centro)
  zoom?: boolean; // golpe de zoom al entrar (por defecto sí)
};

export type Toma = {
  foto?: string; // número de public/montaje/fotos/NNN.jpg
  clip?: string; // nombre en public/montaje/clips (sin .mp4), p. ej. "15-lento"
  desde?: number; // segundo del clip donde arranca
  dur?: number; // si falta, el tramo se reparte entre las tomas sin duración
  foco?: { x: number; y: number }; // punto del acercamiento (0–1)
  mov?: "in" | "out" | "izq" | "der"; // movimiento de cámara (Ken Burns)
};

export type Voz = { src: string; desde: number; hasta: number; texto: string; subtitulos?: boolean };

export type Tramo = {
  voz?: Voz; // audio en public/montaje/voz
  dur?: number; // duración si no hay voz
  tomas: Toma[];
  titulo?: Titulo;
};

export type MontajeConfig = {
  id: string;
  titulo: string; // nombre de archivo
  handle: string;
  acento: string; // color neón principal
  acento2: string; // segundo color
  tramos: Tramo[];
  cierre: { lineas: Linea[]; sub?: string };
  musica: { preset: string; seed: number };
  claves?: string[]; // palabras que se resaltan en los subtítulos
};
