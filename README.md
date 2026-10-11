# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.apng">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i --loglevel=error
```

**Start Preview**

```console
npm run dev
```

**Render video**

```console
npx remotion render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

## Reel "Bioestimuladores" (Paola Limbozzi Academy)

Video vertical 1080×1920 hecho a partir del audio `public/bioestimuladores.m4a`.

- `src/Bioestimuladores/transcript.ts`: transcripción con tiempos; editá acá los textos de los subtítulos.
- `src/Bioestimuladores/index.tsx`: escenas y layout.
- `src/Bioestimuladores/theme.ts`: colores y tipografías de `DESIGN.md`.

Renderizar:

```console
npx remotion render Bioestimuladores out/bioestimuladores-reel.mp4
```

### Sonido

- `tools/voz.py`: limpia la voz (EQ, reducción de ruido, de-esser, compresión, -14 LUFS) y corta los silencios → `public/voz.wav`. Imprime la lista `KEEP` que va en `transcript.ts`.
- `tools/sonido.py`: sintetiza los efectos (`public/sfx/`) y la música de fondo (`public/musica.m4a`).
- `src/Bioestimuladores/sound.tsx`: dónde suena cada efecto y cómo baja la música cuando habla Paola.

Los dos scripts usan `numpy`, `scipy` y `soundfile`, y necesitan `ffmpeg`.
