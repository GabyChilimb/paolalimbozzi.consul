"""Limpia la voz y corta los silencios.

Uso: python tools/voz.py <audio original> <salida.wav>
Imprime la lista KEEP (tramos conservados, en segundos del audio original)
para pegar en src/Bioestimuladores/transcript.ts.
"""
import json, re, subprocess, sys, tempfile, os
import numpy as np, soundfile as sf

SRC, OUT = sys.argv[1], sys.argv[2]
PRE, POST, MIN_GAP = 0.10, 0.14, 0.08
SR = 48000

# Tramos con voz: los mismos tiempos que SEGMENTS en transcript.ts.
ts = open(os.path.join(os.path.dirname(__file__), "..", "src/Bioestimuladores/transcript.ts")).read()
raw = ts[ts.index("RAW_SEGMENTS"):ts.index("];", ts.index("RAW_SEGMENTS"))]
segs = [(float(a), float(b)) for a, b in re.findall(r"start: ([\d.]+),\s*end: ([\d.]+)", raw)]

keep = []
for s, e in segs:
    a, b = max(0.0, s - PRE), e + POST
    if keep and a - keep[-1][1] < MIN_GAP:
        keep[-1][1] = b
    else:
        keep.append([a, b])

# 1) Mejora de voz sobre el audio completo.
chain = ",".join([
    "highpass=f=85:poles=2",
    "afftdn=nr=8:nf=-50:tn=1",
    "equalizer=f=250:t=q:w=1.2:g=-2.5",
    "equalizer=f=3500:t=q:w=1.0:g=3",
    "highshelf=f=9000:g=2.5",
    "deesser=i=0.35:m=0.5:f=0.5",
    "acompressor=threshold=-22dB:ratio=3:attack=6:release=90:makeup=2",
])
with tempfile.TemporaryDirectory() as d:
    clean = os.path.join(d, "clean.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-af", chain, "-ar", str(SR), "-ac", "1", clean], check=True)
    a, sr = sf.read(clean)
    keep[-1][1] = min(keep[-1][1], len(a) / sr)

    # 2) Cortes con microfundidos de 12 ms para que no hagan click.
    fade = int(0.012 * sr)
    parts = []
    for s, e in keep:
        x = a[int(s * sr):int(e * sr)].copy()
        ramp = np.linspace(0, 1, fade)
        x[:fade] *= ramp
        x[-fade:] *= ramp[::-1]
        parts.append(x)
    cut = os.path.join(d, "cut.wav")
    sf.write(cut, np.concatenate(parts), sr)

    # 3) Loudness para redes (-14 LUFS, pico -1.5 dBTP), dos pasadas.
    meas = subprocess.run(["ffmpeg", "-hide_banner", "-i", cut, "-af", "loudnorm=I=-14:TP=-1.5:LRA=7:print_format=json", "-f", "null", "-"],
                          capture_output=True, text=True).stderr
    m = json.loads(meas[meas.rindex("{"):meas.rindex("}") + 1])
    ln = (f"loudnorm=I=-14:TP=-1.5:LRA=7:measured_I={m['input_i']}:measured_TP={m['input_tp']}:"
          f"measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", cut, "-af", ln, "-ar", str(SR), "-ac", "1", OUT], check=True)

total = sum(e - s for s, e in keep)
print(f"// {len(keep)} tramos, {total:.2f}s (original {len(a)/sr:.2f}s)")
print("export const KEEP: [number, number][] = [")
for s, e in keep:
    print(f"  [{s:.3f}, {e:.3f}],")
print("];")
