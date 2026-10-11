# DESIGN.md — Paola Limbozzi Academy

> Sistema de marca de **Paola Limbozzi Academy · Medicina Estética**.
> Fuentes analizadas: Instagram [@paolalimbozzi.academy](https://www.instagram.com/paolalimbozzi.academy/) y la web [paolalimbozziacademy.netlify.app](https://paolalimbozziacademy.netlify.app/).
> Los hex se tomaron por muestreo de píxeles de las capturas; las tipografías se identificaron a ojo (la web no expuso su CSS), así que se dan con alternativas equivalentes.

---

## 1. Esencia de marca

| | |
|---|---|
| **Qué es** | Academia de formación en medicina estética para médicos, odontólogos y profesionales de la salud. |
| **Promesa** | "Formar no es mostrar una técnica, es enseñar a pensar." |
| **Diferencial** | Acompañamiento personal de la Dra. *antes, durante y después* del curso + práctica real supervisada + anatomía aplicada. |
| **Personalidad** | Docente experta, cercana, exigente con el criterio, cálida en el trato. Premium sin ser fría. |
| **Arquetipo** | Mentora / Sabia. Enseña a decidir, no solo a inyectar. |
| **Enemigo narrativo** | Los cursos "express" que muestran una técnica y te dejan solo. El volumen de cursos ≠ estar bien formado. |
| **Público** | Médicos/as y odontólogos/as recién recibidos o que arrancan en estética; profesionales que quieren perfeccionarse con criterio clínico. |

**Pilares de mensaje**
1. **Criterio clínico** — saber cuándo hacer, cuándo no, y por qué.
2. **Seguridad del paciente** — anatomía, complicaciones, resultados naturales.
3. **Acompañamiento real** — WhatsApp directo con Paola, seguimiento post-curso, grupos reducidos.
4. **Autoridad académica** — 12 años, +150/+200 alumnos, speaker internacional, Universidad Kennedy, Embajadora Neauvia, Directora de Diplomatura.

---

## 2. Paleta de colores

### Web (base institucional)

| Token | Hex | Uso |
|---|---|---|
| `--cream` | `#FBF9F5` | Fondo principal (hero, secciones claras) |
| `--sand` | `#F4EEE1` | Fondo alterno de secciones ("Sobre la Dra.") |
| `--white` | `#FFFFFF` | Cards, tarjetas flotantes (ej. "Directora Académica") |
| `--ink` | `#1B1815` | Títulos y texto fuerte (negro cálido, nunca negro puro) |
| `--text` | `#5E5A55` | Párrafos / cuerpo (gris cálido) |
| `--teal` | `#4A93A8` | **Color de acción**: botones, CTA WhatsApp, eyebrows, números de stats |
| `--teal-dark` | `#3B7A8C` | Hover de botones |
| `--gold` | `#B99A48` | Palabras destacadas en itálica dentro de títulos ("*enseñar a pensar*") |
| `--gold-light` | `#E5C46A` | Bullets, monograma "PL", detalles finos |
| `--gold-muted` | `#D0BA8F` | Labels pequeños sobre blanco ("DIRECTORA ACADÉMICA") |
| `--line` | `#E6DFD2` | Divisores finos y bordes de botón secundario |

### Instagram (capa editorial)

| Token | Hex | Uso |
|---|---|---|
| `--ig-night` | `#0A0B10` | Fondo de posts tipo "pregunta" (negro azulado) |
| `--ig-paper` | `#FAF0D4` | Fondo papel de cuaderno / anotador amarillo |
| `--ig-paper-line` | `#E8D9A8` | Renglones y bordes del papel |
| `--ig-marker` | `#F2D04B` | Resaltador amarillo sobre palabras clave ("*significa*", "*natural*") |
| `--ig-gold-script` | `#D4AF37` | Títulos en itálica dorada sobre foto ("*NO te enseñaron*") |
| `--ig-reel-yellow` | `#F5C518` | Última línea destacada en portadas de reels ("NO TRATAR", "ESTOS 3 ERRORES") |
| `--ig-overlay` | `#000000` al 45–60 % | Degradé inferior sobre foto para legibilidad |

**Proporción recomendada (web):** 70 % crema/arena · 15 % ink/texto · 10 % teal · 5 % dorado.
**Regla:** el teal es para *hacer* (botones, links, datos); el dorado es para *sentir* (énfasis emocional, detalles premium). Nunca un botón dorado ni un título entero en teal.

```css
:root{
  --cream:#FBF9F5; --sand:#F4EEE1; --white:#FFFFFF;
  --ink:#1B1815; --text:#5E5A55; --line:#E6DFD2;
  --teal:#4A93A8; --teal-dark:#3B7A8C;
  --gold:#B99A48; --gold-light:#E5C46A; --gold-muted:#D0BA8F;
  --ig-night:#0A0B10; --ig-paper:#FAF0D4; --ig-marker:#F2D04B;
  --ig-gold-script:#D4AF37; --ig-reel-yellow:#F5C518;
}
```

---

## 3. Tipografías

| Rol | Fuente (identificada / equivalente) | Estilo | Dónde |
|---|---|---|---|
| **Display / títulos** | Serif editorial de alto contraste — *Fraunces* o *Newsreader* (alt.: Cormorant Garamond) | Regular 400, interlineado ajustado (1.05–1.15), tracking -1 % | H1/H2 web, nombre "Dra. Paola Limbozzi" |
| **Énfasis en títulos** | Misma serif en *Italic* | Itálica + color `--gold` | 1–3 palabras clave por título |
| **Cuerpo / UI** | Sans geométrica-humanista — *Inter* (alt.: DM Sans) | 400 cuerpo · 600 botones | Párrafos, nav, botones, stats labels |
| **Eyebrow / labels** | Mono — *IBM Plex Mono* o *JetBrains Mono* | 11–12 px, MAYÚSCULAS, tracking +12 %, precedido por una línea corta | "— ACADEMIA DE MEDICINA ESTÉTICA", "SOBRE LA DRA." |
| **IG títulos sobre foto** | Serif itálica caligráfica — *Playfair Display Italic* (alt.: Cormorant Italic) | Itálica, dorado, combinada con sans blanca fina | Carruseles fijados |
| **IG manuscrita** | Handwriting — *Caveat* / *Kalam* / *Gochi Hand* | Azul tinta o negro, sobre papel | Posts "anotador" con preguntas |
| **IG portadas de reels** | Sans condensada bold — *Anton* / *Bebas Neue* / *Montserrat ExtraBold* | MAYÚSCULAS, blanco + última línea amarilla | Hooks de reels |

**Escala web sugerida:** H1 56/60 · H2 36/42 · H3 22/28 · Body 16/26 · Small 13/20 · Eyebrow 11/16 mono.

---

## 4. Tono de voz

**Cómo suena:** una médica docente con años de clínica que te habla de igual a igual, en voseo rioplatense, con calma y criterio. Corrige sin humillar. Enseña con preguntas.

| Es | No es |
|---|---|
| Cercana, en primera persona ("lo que miro primero…") | Distante, institucional, en tercera persona fría |
| Reflexiva, plantea dilemas reales del consultorio | Vendedora agresiva o de urgencia falsa |
| Segura y con autoridad, basada en experiencia | Soberbia o "gurú" |
| Honesta sobre riesgos y límites ("saber cuándo NO tratar") | Promesas de resultados mágicos o rápidos |
| Premium y cuidada | Lujosa ostentosa o pretenciosa |
| Argentina natural (vos, comenzá, escribime) | Neutro de doblaje (tú, usted, comienza) |

**Recursos de escritura**
- **Contraste / reencuadre:** "No es X, es Y." → *"Formar no es mostrar una técnica, es enseñar a pensar."*
- **Preguntas que abren debate:** *"¿Qué es mejor: hacerle al paciente lo que pide o explicarle lo que realmente necesita?"*
- **Confesión profesional:** *"Hay algo que solamente entendés después de formar a muchos profesionales."*
- **Listas de errores/cosas no dichas:** *"5 cosas que NO te enseñaron sobre la medicina estética."*
- **Remate corto y certero** después de la pregunta: *"La respuesta no es tan obvia como parece."*
- **Mayúsculas solo para una palabra de giro:** NO, NUNCA, ANTES.

---

## 5. Frases que usa (banco de mensajes)

**Pilares / taglines**
- Formar no es mostrar una técnica, es enseñar a pensar.
- Una docente que acompaña, antes, durante y después.
- Formación basada en ciencia, anatomía aplicada y práctica real.
- Priorizar la seguridad del paciente y el crecimiento real de cada alumno.
- Una experiencia formativa verdaderamente premium.
- Autoridad académica reconocida.

**Hooks de contenido (estilo IG)**
- Podés aprender una técnica en un curso. Pero eso no significa que sepas cuándo, cómo y por qué aplicarla.
- El mayor error en medicina estética no es una mala técnica. Es no saber cuándo usarla.
- Una de las decisiones más importantes es saber cuándo NO tratar.
- Hacer muchos cursos no significa necesariamente estar mejor formado.
- ¿Cuál es la diferencia entre un resultado que se ve natural y uno que se nota? No siempre es la cantidad de producto.
- Nunca trates una zona sin mirar el rostro completo.
- Dos pacientes pueden pedirte lo mismo.
- Si estás empezando, estos 3 errores te frenan.
- ¿Sabés qué miro primero cuando una paciente me pide que le haga los labios?
- ¿Qué diferencia un curso de una formación que realmente te prepara para trabajar?
- Después de 12 años trabajando con inyectables…

**CTAs**
- Escribir por WhatsApp · Hablar por WhatsApp
- Solicitar información · Ver programas
- Comenzá a formarte con una docente que te acompaña antes, durante y después del curso.
- Reservá tu lugar (grupos reducidos, seña del 50 %).

**Vocabulario propio:** criterio clínico · anatomía aplicada · práctica supervisada · pacientes reales · Hands On · grupos reducidos · acompañamiento · seguimiento post-curso · resultado natural · seguridad del paciente · tercio superior/medio/inferior · MD Codes · bioestimuladores · complicaciones · mentoría One to One.

---

## 6. Frases y palabras que NUNCA usa

- ❌ "Hacete experto en un fin de semana" / "Aprendé rápido y fácil"
- ❌ "Garantizamos resultados" / "Resultados perfectos" / "Sin riesgos"
- ❌ "Ganá millones con la estética" / promesas de facturación
- ❌ "¡ÚLTIMOS CUPOS!!! 🔥🔥🔥" — urgencia falsa, mayúsculas sostenidas, signos múltiples
- ❌ "Cambiá tu cara" / "rejuvenecé 10 años" — lenguaje de transformación exagerada
- ❌ "Barato", "oferta", "promo 2x1", "descuentazo"
- ❌ Tuteo neutro o "usted": "tú puedes", "inscríbase"
- ❌ Jerga de influencer: "bestie", "literal", "chicas les cuento"
- ❌ Desacreditar colegas por nombre o hablar mal de otras academias de forma directa (se critica la *práctica*, no a personas)
- ❌ Antes/después sensacionalistas o términos como "relleno" usado de forma banal
- ❌ Emojis en exceso; como máximo 1–2 funcionales (📍 🎓 ✨) en bio o captions

---

## 7. Estilo visual

### Web
- **Layout editorial**: mucho aire, columnas asimétricas (texto 55 % / foto 45 %), grilla de 12 columnas, márgenes generosos.
- **Hero**: eyebrow mono con línea → H1 serif grande con 2 palabras en itálica dorada → párrafo gris → botón teal sólido + botón outline negro → fila de 4 stats en teal separadas por un divisor fino.
- **Botones**: rectangulares, radio 2–4 px, padding 14×24, texto 14 px semibold. Primario `--teal` texto blanco; secundario borde 1 px `--ink` sobre transparente.
- **Cards**: blancas, sin borde o borde `--line`, sombra muy suave (`0 10px 30px rgba(27,24,21,.08)`), radio 2–4 px. Card flotante superpuesta a la foto (efecto revista).
- **Bullets**: punto dorado pequeño + texto, en dos columnas con divisor fino debajo.
- **Fotografía**: Paola en ambo/blazer blanco o negro, luz natural, fondos blancos con molduras clásicas, consultorio real (sillones turquesa, paredes blancas, piso de madera). Retrato vertical, mirada a cámara, sonrisa segura.
- **Detalles**: monograma "PL" en círculo dorado fino; textura sutil de puntos en el fondo del hero.

### Instagram
Grilla con 3 tipos de pieza que se alternan:

1. **Foto + título editorial (fijados y carruseles)** — foto real de Paola trabajando o dando clases, oscurecida abajo; texto en sans blanca fina + palabras clave en *serif itálica dorada*; firma inferior con avatar circular + "Paola Limbozzi | Cursos ME".
2. **Notas en papel / anotador** — hoja cuadriculada o papel amarillo crema sostenido por una mano con uñas bordó, o papel a pantalla completa con borde; texto manuscrito centrado en tinta azul/negra; 1 palabra resaltada con marcador amarillo o subrayada. Formato pregunta-reflexión.
3. **Portadas de reels / congresos** — Paola en escenario (Radiesse, Estética Mundial) o en consultorio; banda inferior oscura con titular sans condensada en mayúsculas blancas y la última frase en amarillo.
4. **Fondos negros minimalistas** — pregunta corta en sans blanca con 1 palabra en amarillo/dorado.

**Reglas IG**
- Siempre la cara o las manos de Paola: la marca es personal.
- Máximo 2 colores de texto por pieza (blanco + dorado/amarillo, o tinta + resaltador).
- Destacados: íconos negros con línea dorada (Formación · Programa · Inscripción · Trayectoria).
- Bio: "Formate en medicina estética con práctica inicial/avanzada · +200 profesionales formados · 12 años de experiencia" + link a la web.

---

## 8. Do & Don't rápido

| ✅ Hacer | ❌ Evitar |
|---|---|
| Una idea por pieza, planteada como pregunta o contraste | Saturar con datos, precios y fechas en la misma placa |
| Destacar 1–3 palabras en dorado/itálica | Títulos enteros en dorado o en teal |
| Fotos reales de clases, pacientes y congresos | Stock genérico de modelos o renders |
| Fondos crema, blancos o negros profundos | Fondos de colores saturados, degradés flúor |
| Mencionar seguridad, anatomía y criterio | Prometer resultados o rapidez |
| Voseo natural argentino | Tuteo neutro o "usted" |

---

## 9. Consistencia a revisar

- **Cifra de alumnos:** la web dice **+150**, la bio de IG dice **+200**. Unificar en un solo número.
- **Teal vs. dorado/amarillo en IG:** la web usa teal como acento y el IG casi no lo usa (domina dorado/amarillo). Sumar el teal en algún detalle de IG (firma, flecha de "deslizá", CTA final de carrusel) ayudaría a que ambas piezas se sientan de la misma marca.
