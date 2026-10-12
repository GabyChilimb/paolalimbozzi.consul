"""Genera los efectos de sonido y la música de fondo por síntesis (sin samples
de terceros, así no hay temas de licencias).

Uso: python tools/sonido.py <carpeta public>              → public/sfx/*.wav y public/musica.m4a
     python tools/sonido.py <carpeta public> trayectoria  → public/trayectoria/musica.m4a
"""
import os, sys
import numpy as np
import soundfile as sf
from scipy import signal

SR = 48000
OUT = sys.argv[1]
rng = np.random.default_rng(7)


def t_(dur):
    return np.arange(int(dur * SR)) / SR


def env_exp(dur, tau, attack=0.002):
    t = t_(dur)
    e = np.exp(-t / tau)
    a = int(attack * SR)
    if a:
        e[:a] *= np.linspace(0, 1, a)
    return e


def lp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, "low", fs=SR, output="sos"), x)


def hp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, order=2):
    return signal.sosfilt(signal.butter(order, [lo, hi], "band", fs=SR, output="sos"), x)


def norm(x, peak=0.9):
    m = np.max(np.abs(x))
    return x * (peak / m) if m > 0 else x


def stereo(x, pan=0.0):
    l = np.cos((pan + 1) * np.pi / 4)
    r = np.sin((pan + 1) * np.pi / 4)
    return np.stack([x * l, x * r], axis=1)


def reverb(x, seconds=1.6, wet=0.25, seed=1):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    decay = np.exp(-np.arange(n) / (SR * seconds / 6))
    out = []
    for ch in range(x.shape[1]):
        ir = r.standard_normal(n) * decay
        ir = lp(ir, 6000)
        ir /= np.sqrt(np.sum(ir**2))
        out.append(signal.fftconvolve(x[:, ch], ir)[: len(x)])
    return x * (1 - wet) + np.stack(out, axis=1) * wet


def save(name, x):
    os.makedirs(os.path.join(OUT, "sfx"), exist_ok=True)
    if x.ndim == 1:
        x = stereo(x)
    sf.write(os.path.join(OUT, "sfx", name), norm(x).astype(np.float32), SR)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


# ───────────────────────── Efectos ─────────────────────────


def whoosh(dur=0.7, f0=300, f1=3200, f2=700):
    n = int(dur * SR)
    noise = rng.standard_normal(n)
    f, tt, Z = signal.stft(noise, SR, nperseg=1024)
    k = np.linspace(0, 1, Z.shape[1])
    center = np.where(k < 0.6, f0 + (f1 - f0) * (k / 0.6) ** 1.5, f1 + (f2 - f1) * ((k - 0.6) / 0.4))
    mask = np.exp(-((np.log(f[:, None] + 1) - np.log(center[None, :])) ** 2) / (2 * 0.35**2))
    _, y = signal.istft(Z * mask, SR, nperseg=1024)
    y = y[:n]
    tt = np.linspace(0, 1, n)
    e = np.where(tt < 0.6, (tt / 0.6) ** 2, ((1 - tt) / 0.4) ** 1.5)
    y = y * e
    pan = np.linspace(-0.6, 0.6, n)
    return np.stack([y * np.cos((pan + 1) * np.pi / 4), y * np.sin((pan + 1) * np.pi / 4)], axis=1)


def pop(f_start=520, f_end=980, dur=0.16):
    t = t_(dur)
    f = f_end + (f_start - f_end) * np.exp(-t / 0.02)
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * env_exp(dur, 0.035, 0.001)
    click = hp(rng.standard_normal(len(t)), 3000) * env_exp(dur, 0.003) * 0.15
    return reverb(stereo(y + click), 0.6, 0.15)


def tick():
    t = t_(0.08)
    y = np.sin(2 * np.pi * 2900 * t) * env_exp(0.08, 0.008, 0.0005)
    y += hp(rng.standard_normal(len(t)), 5000) * env_exp(0.08, 0.004) * 0.3
    return stereo(y, 0.1)


def bell(freq, dur=1.6, tau=0.5):
    t = t_(dur)
    y = np.zeros_like(t)
    for ratio, amp, k in [(1, 1, 1), (2.0, 0.35, 0.7), (2.76, 0.25, 0.5), (5.4, 0.12, 0.3)]:
        y += amp * np.sin(2 * np.pi * freq * ratio * t) * env_exp(dur, tau * k, 0.002)
    return y


def ding():
    a = bell(midi(81), 1.2, 0.35)
    b = np.zeros(len(a))
    off = int(0.09 * SR)
    b[off:] = bell(midi(88), 1.2, 0.4)[: len(a) - off]
    return reverb(stereo(a * 0.7 + b), 1.2, 0.3)


def coin():
    a = bell(midi(95), 0.8, 0.12)
    b = np.zeros(len(a))
    off = int(0.07 * SR)
    b[off:] = bell(midi(100), 0.8, 0.3)[: len(a) - off]
    return reverb(stereo(a * 0.6 + b, 0.2), 0.8, 0.2)


def impact():
    dur = 1.8
    t = t_(dur)
    f = 38 + 70 * np.exp(-t / 0.08)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(dur, 0.45, 0.003)
    air = lp(rng.standard_normal(len(t)), 900) * env_exp(dur, 0.25, 0.01) * 0.5
    shimmer = bell(midi(76), dur, 0.6) * 0.18
    return reverb(stereo(boom + air + shimmer), 1.8, 0.3)


def warn():
    dur = 0.55
    t = t_(dur)
    y = np.zeros_like(t)
    for start in (0.0, 0.2):
        s = int(start * SR)
        n = int(0.14 * SR)
        tt = t[:n]
        tone = signal.sawtooth(2 * np.pi * midi(64) * tt, 0.5) * 0.6 + np.sin(2 * np.pi * midi(76) * tt) * 0.3
        e = np.minimum(1, tt / 0.005) * np.exp(-tt / 0.08)
        y[s:s + n] += tone * e
    return reverb(stereo(lp(y, 2500)), 0.6, 0.15)


def riser(dur=1.3):
    t = t_(dur)
    k = t / dur
    noise = rng.standard_normal(len(t))
    f, tt, Z = signal.stft(noise, SR, nperseg=1024)
    kk = np.linspace(0, 1, Z.shape[1])
    center = 300 * (6000 / 300) ** kk
    mask = np.exp(-((np.log(f[:, None] + 1) - np.log(center[None, :])) ** 2) / (2 * 0.5**2))
    _, y = signal.istft(Z * mask, SR, nperseg=1024)
    y = y[: len(t)] * 0.6
    fr = 180 * (4 ** k)
    y += np.sin(2 * np.pi * np.cumsum(fr) / SR) * 0.25
    y *= k**2
    return reverb(stereo(y), 1.0, 0.25)


def sting():
    dur = 2.6
    y = np.zeros(int(dur * SR))
    for i, n in enumerate([74, 78, 81, 86]):
        s = int(i * 0.08 * SR)
        b = bell(midi(n), dur, 0.7)
        y[s:] += b[: len(y) - s] * (0.7 + 0.1 * i)
    pad = np.zeros_like(y)
    t = t_(dur)
    for n in [50, 57, 62, 66]:
        pad += signal.sawtooth(2 * np.pi * midi(n) * t) * 0.15
    pad = lp(pad, 1200) * np.minimum(1, t / 0.3) * np.exp(-t / 1.2)
    return reverb(stereo(y + pad), 2.0, 0.35)


# ───────────────────────── Música ─────────────────────────


# D: Dmaj9 – Bm7 – Gmaj7 – Asus4/A
CHORDS_D = [
    [50, 57, 61, 64, 66],
    [47, 54, 57, 62, 66],
    [43, 50, 54, 59, 62],
    [45, 52, 57, 62, 64],
]
# C: Cmaj9 – Am7 – Fmaj7 – Gsus4 (más luminoso, para el video de trayectoria)
CHORDS_C = [
    [48, 55, 59, 62, 64],
    [45, 52, 55, 60, 64],
    [41, 48, 52, 57, 60],
    [43, 50, 55, 60, 62],
]


def music(total=90.0, bpm=92, chords=CHORDS_D):
    beat = 60 / bpm
    bar = beat * 4
    n = int(total * SR)
    L = np.zeros((n, 2))
    pads = np.zeros((n, 2))
    bars = int(total / bar) + 1

    def add(buf, start, x):
        s = int(start * SR)
        if s >= len(buf):
            return
        e = min(len(buf), s + len(x))
        buf[s:e] += x[: e - s]

    for b in range(bars):
        ch = chords[b % 4]
        t0 = b * bar
        # Pad
        dur = bar + 1.2
        t = t_(dur)
        p = np.zeros((len(t), 2))
        for note in ch:
            f = midi(note + 12)
            for det, pan in [(-0.004, -0.5), (0.004, 0.5)]:
                v = signal.sawtooth(2 * np.pi * f * (1 + det) * t)
                p += stereo(v, pan) * 0.05
        e = np.minimum(1, t / 0.8) * np.where(t > bar, np.exp(-(t - bar) / 0.4), 1)
        p = np.stack([lp(p[:, 0], 1400), lp(p[:, 1], 1400)], axis=1) * e[:, None]
        add(pads, t0, p)

        # Arpegio tipo e-piano/campana, corcheas
        order = [0, 2, 4, 3, 1, 3, 2, 4]
        if b >= 1:
            for i, idx in enumerate(order):
                f = midi(ch[idx] + 24)
                d = 0.9
                tt = t_(d)
                mod = 0.9 * np.exp(-tt / 0.15) * np.sin(2 * np.pi * 2 * f * tt)
                v = np.sin(2 * np.pi * f * tt + mod) * env_exp(d, 0.35, 0.003)
                vel = 0.12 * (1.0 if i % 2 == 0 else 0.7) * (0.85 + 0.3 * rng.random())
                add(L, t0 + i * beat / 2, stereo(v * vel, 0.35 if i % 2 else -0.35))

        if 2 <= b < bars - 2:
            # Bajo
            root = midi(ch[0] - 12 if ch[0] > 45 else ch[0])
            for pos, d in [(0, beat * 1.5), (beat * 2.5, beat * 1.4)]:
                tt = t_(d)
                v = (np.sin(2 * np.pi * root * tt) + 0.25 * np.sin(4 * np.pi * root * tt))
                v *= np.minimum(1, tt / 0.01) * np.exp(-tt / 0.6)
                add(L, t0 + pos, stereo(lp(v, 400) * 0.35))
            # Bombo suave (1 y 3), aro (2 y 4), shaker (contratiempos)
            for k in (0, 2):
                tt = t_(0.35)
                f = 48 + 90 * np.exp(-tt / 0.03)
                v = np.sin(2 * np.pi * np.cumsum(f) / SR) * env_exp(0.35, 0.12, 0.001)
                add(L, t0 + k * beat, stereo(v * 0.45))
            for k in (1, 3):
                v = bp(rng.standard_normal(int(0.12 * SR)), 1500, 4500) * env_exp(0.12, 0.03, 0.001)
                add(L, t0 + k * beat, stereo(v * 0.12, 0.1))
            for k in range(8):
                v = hp(rng.standard_normal(int(0.06 * SR)), 7000) * env_exp(0.06, 0.012, 0.002)
                add(L, t0 + k * beat / 2 + beat / 4, stereo(v * (0.06 if k % 2 else 0.035), -0.2))

    mix = reverb(pads + L * 0.9, 1.8, 0.28, seed=3) + L * 0.1
    # Fundidos de entrada y salida
    tt = np.arange(n) / SR
    fade = np.minimum(1, tt / 1.5) * np.clip((total - tt) / 3.0, 0, 1)
    mix *= fade[:, None]
    mix = np.tanh(mix * 1.2) / 1.2
    # Nivel aproximado a -16 LUFS (RMS ≈ -19 dBFS en música densa)
    rms = np.sqrt(np.mean(mix**2))
    mix *= 10 ** (-19 / 20) / rms
    return mix


def save_music(path, m):
    import subprocess, tempfile
    with tempfile.TemporaryDirectory() as d:
        wav = os.path.join(d, "m.wav")
        sf.write(wav, np.clip(m, -1, 1).astype(np.float32), SR)
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-c:a", "aac", "-b:a", "192k", path], check=True)


if __name__ == "__main__" and len(sys.argv) > 2 and sys.argv[2] == "trayectoria":
    save_music(os.path.join(OUT, "trayectoria", "musica.m4a"), music(total=82.0, bpm=96, chords=CHORDS_C))
    print("ok")
elif __name__ == "__main__":
    save("whoosh.wav", whoosh())
    save("pop.wav", pop())
    save("pop-alto.wav", pop(700, 1400))
    save("tick.wav", tick())
    save("ding.wav", ding())
    save("coin.wav", coin())
    save("impact.wav", impact())
    save("warn.wav", warn())
    save("riser.wav", riser())
    save("sting.wav", sting())
    save_music(os.path.join(OUT, "musica.m4a"), music())
    print("ok")
