import { continueRender, delayRender, staticFile } from "remotion";

// Tokens de DESIGN.md (Paola Limbozzi Academy).
export const C = {
  cream: "#FBF9F5",
  sand: "#F4EEE1",
  white: "#FFFFFF",
  ink: "#1B1815",
  text: "#5E5A55",
  line: "#E6DFD2",
  teal: "#4A93A8",
  tealDark: "#3B7A8C",
  gold: "#B99A48",
  goldLight: "#E5C46A",
  goldMuted: "#D0BA8F",
  marker: "#F2D04B",
};

// Fuentes incluidas en public/fonts (Google Fonts, licencia OFL) para que el
// render no dependa de internet.
const FONTS: [string, string, string, string][] = [
  ["Fraunces", "Fraunces.woff2", "normal", "100 900"],
  ["Fraunces", "Fraunces-Italic.woff2", "italic", "100 900"],
  ["Inter", "Inter.woff2", "normal", "100 900"],
  ["IBM Plex Mono", "IBMPlexMono-Medium.woff2", "normal", "500"],
];

if (typeof document !== "undefined") {
  const handle = delayRender("Cargando fuentes");
  Promise.all(
    FONTS.map(([family, file, style, weight]) => {
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format("woff2")`, {
        style,
        weight,
      });
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}

export const serif = "Fraunces, Georgia, serif";
export const sans = "Inter, Helvetica, Arial, sans-serif";
export const mono = '"IBM Plex Mono", monospace';

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
