"""Recorta los silencios y respiraciones que quedan dentro y en los bordes de los
tramos KEEP de un reel, dejando sólo un respiro muy corto entre frases.

Uso: python tools/pausas.py <slug> <carpeta de trabajo> [--aplicar]
  Sin --aplicar sólo muestra lo que cortaría. Con --aplicar reescribe KEEP en el
  config, regenera la voz (tools/voz.py) y la música.
No toca los segmentos con texto vacío (reacciones en silencio de los sketches).
"""
import json, os, re, subprocess, sys, tempfile
import numpy as np, soundfile as sf

slug, WORK = sys.argv[1], sys.argv[2]
APLICAR = "--aplicar" in sys.argv
cfg_path = f"src/reels/configs/{slug}.ts"
audio = os.path.join(WORK, slug, "audio.wav")
FPS, HOP = 30, 0.01
REL = 18  # dB por debajo del nivel de la voz que cuentan como silencio (respiraciones incluidas)
MIN_PAUSA = 0.16  # pausas más cortas quedan como están
ANTES, DESPUES = 0.04, 0.07  # aire que queda antes y después de cada tramo con voz

src = open(cfg_path).read()
raw = src[src.index("RAW_SEGMENTS"):src.index("];", src.index("RAW_SEGMENTS"))]
segs = [(float(a), float(b), t) for a, b, t in re.findall(r'start: ([\d.]+),\s*end: ([\d.]+),\s*text: "(.*?)"', raw)]
mudos = [(a, b) for a, b, t in segs if not t.strip()]
kblock = re.search(r"const KEEP: \[number, number\]\[\] = \[(.*?)\];", src, re.S)
keep = [(float(a), float(b)) for a, b in re.findall(r"\[([\d.]+), ([\d.]+)\]", kblock.group(1))]
perfil = re.search(r'perfil de voz "(\w+)"', src).group(1)

# Energía en ventanas de 30 ms cada 10 ms (sin graves, para que el ruido de sala no cuente como voz).
with tempfile.TemporaryDirectory() as d:
    f = os.path.join(d, "a.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", audio, "-af", "highpass=f=120", "-ar", "16000", "-ac", "1", f], check=True)
    a, sr = sf.read(f)
hop, win = int(HOP * sr), int(0.03 * sr)
n = max(1, (len(a) - win) // hop)
db = np.array([10 * np.log10(np.mean(a[i * hop:i * hop + win] ** 2) + 1e-12) for i in range(n)])
idx = lambda t: min(n, max(0, int(round(t / HOP))))
dentro = np.concatenate([db[idx(s):idx(e)] for s, e in keep])
piso, voz = np.percentile(db, 8), np.percentile(dentro, 90)
umbral = max(piso + 8, voz - REL)

snap = lambda x: round(x * FPS) / FPS
nuevo, cortes = [], []
for s, e in keep:
    i0, i1 = idx(s), idx(e)
    son = db[i0:i1] >= umbral
    # Las reacciones en silencio de los sketches se conservan enteras.
    for a_, b_ in mudos:
        son[max(0, idx(a_) - i0):max(0, idx(b_) - i0)] = True
    # Zonas con sonido, uniendo las separadas por menos de MIN_PAUSA.
    zonas, k = [], 0
    while k < len(son):
        if son[k]:
            m = k
            while m < len(son) and son[m]:
                m += 1
            t0, t1 = s + k * HOP, s + m * HOP
            if zonas and t0 - zonas[-1][1] < MIN_PAUSA:
                zonas[-1][1] = t1
            else:
                zonas.append([t0, t1])
            k = m
        else:
            k += 1
    if not zonas:
        continue
    for z0, z1 in zonas:
        c0, c1 = snap(max(s, z0 - ANTES)), snap(min(e, z1 + DESPUES))
        if nuevo and c0 - nuevo[-1][1] < 2 / FPS:
            nuevo[-1][1] = c1
        else:
            nuevo.append([c0, c1])
    cortes += [(x[1], y[0]) for x, y in zip(zonas, zonas[1:])]

antes = sum(e - s for s, e in keep)
despues = sum(e - s for s, e in nuevo)
print(f"{slug}: piso {piso:.0f} dB, voz {voz:.0f} dB, umbral {umbral:.0f} dB · {len(cortes)} pausas · {antes:.2f}s → {despues:.2f}s")
if not APLICAR:
    for p0, p1 in cortes:
        print(f"  {p0:7.2f}–{p1:7.2f} ({p1 - p0:.2f}s)")
    sys.exit()

total = despues
lineas = "".join(f"  [{s:.3f}, {e:.3f}],\n" for s, e in nuevo)
header = f"// KEEP: {len(nuevo)} tramos, {total:.2f}s · pausas internas recortadas (tools/pausas.py) · perfil de voz \"{perfil}\""
src = re.sub(r"// KEEP:.*?\nconst KEEP: \[number, number\]\[\] = \[.*?\];", lambda _: f"{header}\nconst KEEP: [number, number][] = [\n{lineas}];", src, flags=re.S)
open(cfg_path, "w").write(src)

out_dir = f"public/reels/{slug}"
py = sys.executable
with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False) as kf:
    json.dump(nuevo, kf)
subprocess.run([py, "-I", "tools/voz.py", audio, f"{out_dir}/voz.wav", cfg_path, perfil, kf.name], check=True, capture_output=True)
os.unlink(kf.name)
preset = re.search(r'preset:\s*"(\w+)"', src).group(1)
seed = re.search(r"seed:\s*(\d+)", src)
subprocess.run([py, "-I", "tools/banco_sonido.py", "musica", preset, f"{total + 4.5:.1f}", f"{out_dir}/musica.m4a", seed.group(1) if seed else "0"], check=True)
