"""Banco de efectos y músicas para los reels (síntesis propia, sin samples de terceros).

Uso:
  python tools/banco_sonido.py sfx                      → public/sfx2/*.wav
  python tools/banco_sonido.py musica <preset> <segundos> <salida.m4a> [semilla]

Los efectos se normalizan por sonoridad: su pico de sonoridad momentánea queda en
SFX_TARGET (LUFS). La voz va a -14 LUFS integrados, así que con volumen 1 cada
efecto suena ~2 puntos por debajo de la voz.
Presets de música: suave, luminoso, pop, lofi, academy, oscuro, tension.
"""
import json, os, re, subprocess, sys, tempfile
import numpy as np
import soundfile as sf
from scipy import signal

SR = 48000
SFX_TARGET = -16.0


def t_(d):
    return np.arange(int(d * SR)) / SR


def env(d, tau, attack=0.002):
    t = t_(d)
    e = np.exp(-t / tau)
    a = max(1, int(attack * SR))
    e[:a] *= np.linspace(0, 1, a)
    return e


def lp(x, f, o=2):
    return signal.sosfilt(signal.butter(o, f, "low", fs=SR, output="sos"), x)


def hp(x, f, o=2):
    return signal.sosfilt(signal.butter(o, f, "high", fs=SR, output="sos"), x)


def bp(x, lo, hi, o=2):
    return signal.sosfilt(signal.butter(o, [lo, hi], "band", fs=SR, output="sos"), x)


def st(x, pan=0.0):
    if x.ndim == 2:
        return x
    return np.stack([x * np.cos((pan + 1) * np.pi / 4), x * np.sin((pan + 1) * np.pi / 4)], axis=1)


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def reverb(x, sec=1.4, wet=0.25, seed=1):
    x = st(x)
    r = np.random.default_rng(seed)
    n = int(sec * SR)
    dec = np.exp(-np.arange(n) / (SR * sec / 6))
    out = []
    for ch in range(2):
        ir = lp(r.standard_normal(n) * dec, 6000)
        ir /= np.sqrt(np.sum(ir ** 2))
        out.append(signal.fftconvolve(x[:, ch], ir)[: len(x)])
    return x * (1 - wet) + np.stack(out, axis=1) * wet


def shaped_noise(d, centers, width=0.35, seed=0):
    """Ruido filtrado con una banda cuyo centro sigue `centers` (array 0..1 → Hz)."""
    rng = np.random.default_rng(seed)
    n = int(d * SR)
    f, _, Z = signal.stft(rng.standard_normal(n), SR, nperseg=1024)
    c = np.interp(np.linspace(0, 1, Z.shape[1]), np.linspace(0, 1, len(centers)), centers)
    mask = np.exp(-((np.log(f[:, None] + 1) - np.log(c[None, :])) ** 2) / (2 * width ** 2))
    _, y = signal.istft(Z * mask, SR, nperseg=1024)
    return y[:n]


def bell(freq, d=1.5, tau=0.5):
    t = t_(d)
    y = np.zeros_like(t)
    for ratio, amp, k in [(1, 1, 1), (2.0, 0.35, 0.7), (2.76, 0.25, 0.5), (5.4, 0.12, 0.3)]:
        y += amp * np.sin(2 * np.pi * freq * ratio * t) * env(d, tau * k)
    return y


# ───────────────────────── Efectos ─────────────────────────

def fx_whoosh(seed=1, d=0.65):
    n = int(d * SR)
    y = shaped_noise(d, [300, 900, 3000, 900], 0.35, seed)
    k = np.linspace(0, 1, n)
    y *= np.where(k < 0.6, (k / 0.6) ** 2, ((1 - k) / 0.4) ** 1.5)
    pan = np.linspace(-0.6, 0.6, n)
    return np.stack([y * np.cos((pan + 1) * np.pi / 4), y * np.sin((pan + 1) * np.pi / 4)], axis=1)


def fx_swoosh_suave():
    return lp(fx_whoosh(seed=4, d=0.45)[:, 0], 2500)


def fx_pop(f0=520, f1=980):
    d = 0.16
    t = t_(d)
    f = f1 + (f0 - f1) * np.exp(-t / 0.02)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.035, 0.001)
    return reverb(y, 0.5, 0.12)


def fx_click():
    d = 0.06
    y = hp(np.random.default_rng(2).standard_normal(int(d * SR)), 2500) * env(d, 0.004, 0.0003)
    y += np.sin(2 * np.pi * 1800 * t_(d)) * env(d, 0.006) * 0.5
    return y


def fx_tick():
    d = 0.08
    return np.sin(2 * np.pi * 2900 * t_(d)) * env(d, 0.008, 0.0005)


def fx_burbuja():
    d = 0.22
    t = t_(d)
    f = 300 + 1400 * (t / d) ** 0.6
    return reverb(np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.07, 0.003), 0.4, 0.15)


def fx_ding():
    a = bell(midi(81), 1.2, 0.35)
    b = np.zeros(len(a))
    o = int(0.09 * SR)
    b[o:] = bell(midi(88), 1.2, 0.4)[: len(a) - o]
    return reverb(a * 0.7 + b, 1.2, 0.3)


def fx_brillo():
    d = 1.4
    y = np.zeros(int(d * SR))
    for i, n in enumerate([86, 90, 93, 98, 102]):
        s = int(i * 0.06 * SR)
        y[s:] += bell(midi(n), d, 0.25)[: len(y) - s] * (0.8 - 0.1 * i)
    return reverb(hp(y, 1500), 1.4, 0.4)


def fx_impacto():
    d = 1.6
    t = t_(d)
    f = 38 + 70 * np.exp(-t / 0.08)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.45, 0.003)
    y += lp(np.random.default_rng(3).standard_normal(len(t)), 900) * env(d, 0.25, 0.01) * 0.5
    return reverb(y, 1.6, 0.25)


def fx_sub():
    d = 1.2
    t = t_(d)
    f = 70 * np.exp(-t / 0.5) + 35
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(d, 0.4, 0.004)


def fx_obturador():
    rng = np.random.default_rng(5)
    y = np.zeros(int(0.25 * SR))
    for o in (0.0, 0.07):
        s = int(o * SR)
        n = int(0.05 * SR)
        y[s:s + n] += bp(rng.standard_normal(n), 1500, 7000) * env(0.05, 0.01, 0.0005)
    return y


def fx_glitch():
    rng = np.random.default_rng(6)
    d = 0.3
    n = int(d * SR)
    y = np.zeros(n)
    for _ in range(9):
        s = rng.integers(0, n - 2000)
        l = rng.integers(400, 2400)
        y[s:s + l] += signal.square(2 * np.pi * rng.uniform(200, 1600) * t_(l / SR)) * 0.4
    return bp(y, 300, 6000)


def fx_latido():
    d = 1.0
    y = np.zeros(int(d * SR))
    for o, a in ((0.0, 1.0), (0.22, 0.7)):
        t = t_(0.18)
        b = np.sin(2 * np.pi * (55 + 30 * np.exp(-t / 0.03)) * t) * env(0.18, 0.06, 0.002)
        s = int(o * SR)
        y[s:s + len(b)] += b * a
    return lp(y, 400)


def fx_trueno():
    d = 3.0
    rng = np.random.default_rng(7)
    y = lp(rng.standard_normal(int(d * SR)), 400)
    e = env(d, 0.9, 0.02) * (1 + 0.6 * np.sin(2 * np.pi * 3 * t_(d)) * np.exp(-t_(d)))
    crack = hp(rng.standard_normal(int(0.15 * SR)), 2000) * env(0.15, 0.04)
    y = y * e
    y[: len(crack)] += crack * 0.8
    return reverb(y, 2.5, 0.35)


def fx_campana():
    d = 3.5
    y = bell(midi(52), d, 1.4) + 0.4 * bell(midi(64), d, 1.0)
    return reverb(y, 3.0, 0.4)


def fx_riser(d=1.3):
    t = t_(d)
    k = t / d
    y = shaped_noise(d, [300, 6000], 0.5, 9) * 0.6 + np.sin(2 * np.pi * np.cumsum(180 * 4 ** k) / SR) * 0.25
    return reverb(y * k ** 2, 1.0, 0.25)


def fx_sting():
    d = 2.6
    y = np.zeros(int(d * SR))
    for i, n in enumerate([74, 78, 81, 86]):
        s = int(i * 0.08 * SR)
        y[s:] += bell(midi(n), d, 0.7)[: len(y) - s] * (0.7 + 0.1 * i)
    return reverb(y, 2.0, 0.35)


def fx_sting_oscuro():
    d = 3.0
    t = t_(d)
    y = np.zeros(len(t))
    for n in (45, 48, 51):  # acorde disminuido
        y += signal.sawtooth(2 * np.pi * midi(n) * t) * 0.2
    y = lp(y, 900) * np.minimum(1, t / 0.4) * np.exp(-t / 1.2)
    y += bell(midi(69), d, 0.8) * 0.4
    return reverb(y, 2.5, 0.4)


def fx_coin():
    a = bell(midi(95), 0.8, 0.12)
    b = np.zeros(len(a))
    o = int(0.07 * SR)
    b[o:] = bell(midi(100), 0.8, 0.3)[: len(a) - o]
    return reverb(a * 0.6 + b, 0.8, 0.2)


def fx_alerta():
    d = 0.55
    t = t_(d)
    y = np.zeros(len(t))
    for start in (0.0, 0.2):
        s = int(start * SR)
        n = int(0.14 * SR)
        tt = t[:n]
        y[s:s + n] += (signal.sawtooth(2 * np.pi * midi(64) * tt, 0.5) * 0.6) * np.minimum(1, tt / 0.005) * np.exp(-tt / 0.08)
    return reverb(lp(y, 2500), 0.6, 0.15)


def fx_escritura():
    rng = np.random.default_rng(11)
    d = 0.9
    y = np.zeros(int(d * SR))
    for i in range(7):
        s = int((i * 0.12 + rng.uniform(0, 0.03)) * SR)
        n = int(0.03 * SR)
        y[s:s + n] += bp(rng.standard_normal(n), 2000, 6000) * env(0.03, 0.006)
    return y


SFX = {
    "whoosh": fx_whoosh, "swoosh": fx_swoosh_suave, "pop": fx_pop, "pop-alto": lambda: fx_pop(700, 1400),
    "click": fx_click, "tick": fx_tick, "burbuja": fx_burbuja, "ding": fx_ding, "brillo": fx_brillo,
    "impacto": fx_impacto, "sub": fx_sub, "obturador": fx_obturador, "glitch": fx_glitch, "latido": fx_latido,
    "trueno": fx_trueno, "campana": fx_campana, "riser": fx_riser, "sting": fx_sting, "sting-oscuro": fx_sting_oscuro,
    "coin": fx_coin, "alerta": fx_alerta, "escritura": fx_escritura,
}


def momentary_max(path):
    """Pico de sonoridad momentánea (LUFS, ventana 400 ms) medido con ffmpeg."""
    out = subprocess.run(["ffmpeg", "-hide_banner", "-i", path, "-af", "apad=pad_dur=0.5,ebur128=framelog=info", "-f", "null", "-"],
                         capture_output=True, text=True).stderr
    vals = [float(v) for v in re.findall(r"M:\s*(-?[\d.]+)", out)]
    return max(vals) if vals else -70.0


def make_sfx(outdir):
    os.makedirs(outdir, exist_ok=True)
    report = {}
    for name, fn in SFX.items():
        x = st(fn())
        x = x / (np.max(np.abs(x)) + 1e-9) * 0.5
        path = os.path.join(outdir, f"{name}.wav")
        sf.write(path, x.astype(np.float32), SR)
        m = momentary_max(path)
        gain = 10 ** ((SFX_TARGET - m) / 20)
        y = x * gain
        if np.max(np.abs(y)) > 0.98:  # no recortar: preferimos quedar un poco más bajos
            y *= 0.98 / np.max(np.abs(y))
        sf.write(path, y.astype(np.float32), SR)
        report[name] = round(momentary_max(path), 1)
    print(json.dumps(report, indent=1))


# ───────────────────────── Música ─────────────────────────

PRESETS = {
    # acordes (MIDI), bpm, timbre del arpegio, batería, extras
    "suave": dict(chords=[[50, 57, 61, 64, 66], [47, 54, 57, 62, 66], [43, 50, 54, 59, 62], [45, 52, 57, 62, 64]], bpm=92, arp="campana", drums="suave"),
    "luminoso": dict(chords=[[48, 55, 59, 62, 64], [45, 52, 55, 60, 64], [41, 48, 52, 57, 60], [43, 50, 55, 60, 62]], bpm=98, arp="campana", drums="suave"),
    "pop": dict(chords=[[52, 59, 64, 68, 71], [49, 56, 61, 64, 68], [45, 52, 57, 61, 64], [47, 54, 59, 63, 66]], bpm=112, arp="pluck", drums="pop"),
    "lofi": dict(chords=[[50, 57, 60, 64, 65], [55, 59, 62, 65, 69], [48, 55, 59, 62, 64], [45, 52, 55, 60, 64]], bpm=80, arp="rhodes", drums="lofi", crackle=True),
    "academy": dict(chords=[[45, 52, 57, 60, 64], [41, 48, 53, 57, 60], [48, 55, 60, 64, 67], [43, 50, 55, 59, 62]], bpm=100, arp="pluck", drums="minimal"),
    "oscuro": dict(chords=[[45, 52, 57, 60], [41, 48, 53, 57], [44, 50, 53, 59], [40, 47, 52, 56]], bpm=72, arp="caja", drums="latido", drone=True),
    "tension": dict(chords=[[45, 52, 57, 60, 64], [45, 52, 56, 60, 64], [41, 48, 53, 57, 60], [43, 50, 55, 59, 62]], bpm=90, arp="pluck", drums="pulso"),
}


def tone(kind, f, d):
    t = t_(d)
    if kind == "campana":
        mod = 0.9 * np.exp(-t / 0.15) * np.sin(2 * np.pi * 2 * f * t)
        return np.sin(2 * np.pi * f * t + mod) * env(d, 0.35, 0.003)
    if kind == "pluck":
        y = signal.sawtooth(2 * np.pi * f * t) * 0.5 + np.sin(2 * np.pi * f * t)
        return lp(y, 2500) * env(d, 0.18, 0.002)
    if kind == "rhodes":
        mod = 0.5 * np.exp(-t / 0.4) * np.sin(2 * np.pi * f * t)
        return np.sin(2 * np.pi * f * t + mod) * env(d, 0.6, 0.004) * (1 + 0.15 * np.sin(2 * np.pi * 5 * t))
    if kind == "caja":  # caja de música
        return (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 3 * f * t)) * env(d, 0.5, 0.001)
    return np.sin(2 * np.pi * f * t) * env(d, 0.3)


def music(preset, total, seed=0):
    P = PRESETS[preset]
    rng = np.random.default_rng(seed)
    bpm = P["bpm"]
    beat = 60 / bpm
    bar = beat * 4
    n = int(total * SR)
    L = np.zeros((n, 2))
    pads = np.zeros((n, 2))
    chords = P["chords"]
    shift = seed % 3 - 1  # transpone un poco según la semilla para que no suenen iguales

    def add(buf, start, x):
        s = int(start * SR)
        if s >= len(buf):
            return
        e = min(len(buf), s + len(x))
        buf[s:e] += st(x)[: e - s]

    bars = int(total / bar) + 1
    order = [[0, 2, 4, 3, 1, 3, 2, 4], [0, 1, 2, 3, 4, 3, 2, 1], [0, 2, 1, 3, 2, 4, 3, 1]][seed % 3]
    for b in range(bars):
        ch = [c + shift for c in chords[b % len(chords)]]
        t0 = b * bar
        d = bar + 1.2
        t = t_(d)
        p = np.zeros((len(t), 2))
        for note in ch:
            for det, pan in ((-0.004, -0.5), (0.004, 0.5)):
                v = signal.sawtooth(2 * np.pi * midi(note + 12) * (1 + det) * t)
                p += st(v, pan) * 0.05
        e = np.minimum(1, t / 0.8) * np.where(t > bar, np.exp(-(t - bar) / 0.4), 1)
        cutoff = 900 if preset == "oscuro" else 1400
        p = np.stack([lp(p[:, 0], cutoff), lp(p[:, 1], cutoff)], axis=1) * e[:, None]
        add(pads, t0, p)
        if P.get("drone"):
            add(pads, t0, st(np.sin(2 * np.pi * midi(ch[0] - 12) * t) * 0.12 * e))
        if b >= 1:
            steps = 8 if bpm < 105 else 8
            for i in range(steps):
                idx = order[i % len(order)] % len(ch)
                f = midi(ch[idx] + 24)
                vel = (0.12 if i % 2 == 0 else 0.08) * (0.85 + 0.3 * rng.random())
                swing = beat / 2 * (0.12 if (i % 2 and P["drums"] == "lofi") else 0)
                add(L, t0 + i * beat / 2 + swing, st(tone(P["arp"], f, 0.9) * vel, 0.35 if i % 2 else -0.35))
        dr = P["drums"]
        if 2 <= b < bars - 2:
            root = midi(ch[0] - 12 if ch[0] > 45 else ch[0])
            for pos, dd in ((0, beat * 1.5), (beat * 2.5, beat * 1.4)):
                tt = t_(dd)
                v = (np.sin(2 * np.pi * root * tt) + 0.25 * np.sin(4 * np.pi * root * tt)) * np.minimum(1, tt / 0.01) * np.exp(-tt / 0.6)
                add(L, t0 + pos, lp(v, 400) * 0.35)
            kicks = {"suave": (0, 2), "pop": (0, 1, 2, 3), "lofi": (0, 2.5), "minimal": (0, 2), "latido": (0, 0.3), "pulso": (0, 1, 2, 3)}[dr]
            for k in kicks:
                tt = t_(0.35)
                v = np.sin(2 * np.pi * np.cumsum(48 + 90 * np.exp(-tt / 0.03)) / SR) * env(0.35, 0.12, 0.001)
                add(L, t0 + k * beat, v * (0.5 if dr != "pulso" else 0.3))
            if dr in ("suave", "pop", "lofi"):
                for k in (1, 3):
                    v = bp(rng.standard_normal(int(0.12 * SR)), 1500, 4500) * env(0.12, 0.03, 0.001)
                    add(L, t0 + k * beat, v * (0.18 if dr == "pop" else 0.12))
            if dr in ("suave", "pop", "minimal", "pulso"):
                for k in range(8):
                    v = hp(rng.standard_normal(int(0.06 * SR)), 7000) * env(0.06, 0.012, 0.002)
                    add(L, t0 + k * beat / 2 + beat / 4, v * (0.06 if k % 2 else 0.035))
    mix = reverb(pads + L * 0.9, 1.8, 0.28, seed=3) + st(L) * 0.1
    if P.get("crackle"):
        c = np.zeros(n)
        idx = rng.integers(0, n, size=int(total * 25))
        c[idx] = rng.uniform(-1, 1, size=len(idx))
        mix += st(hp(c, 2000) * 0.08)
    tt = np.arange(n) / SR
    mix *= (np.minimum(1, tt / 1.5) * np.clip((total - tt) / 3.0, 0, 1))[:, None]
    mix = np.tanh(mix * 1.2) / 1.2
    mix *= 10 ** (-19 / 20) / (np.sqrt(np.mean(mix ** 2)) + 1e-9)
    return np.clip(mix, -1, 1)


if __name__ == "__main__":
    if sys.argv[1] == "sfx":
        make_sfx(os.path.join("public", "sfx2"))
    elif sys.argv[1] == "musica":
        preset, total, out = sys.argv[2], float(sys.argv[3]), sys.argv[4]
        seed = int(sys.argv[5]) if len(sys.argv) > 5 else 0
        m = music(preset, total, seed)
        with tempfile.TemporaryDirectory() as d:
            w = os.path.join(d, "m.wav")
            sf.write(w, m.astype(np.float32), SR)
            os.makedirs(os.path.dirname(out), exist_ok=True)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", w, "-c:a", "aac", "-b:a", "192k", out], check=True)
        print("ok", out)
