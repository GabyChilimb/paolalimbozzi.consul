"""Prepara un reel a partir de clips crudos: los convierte a 1080×1920 30 fps,
los une en orden y transcribe cada clip (Whisper turbo vía sherpa-onnx).

Uso:
  python tools/preparar.py <slug> <carpeta de trabajo> <modelos> <clip1> [clip2 ...]

Genera:
  public/reels/<slug>/fuente.mp4      video unido, sin audio
  <trabajo>/<slug>/audio.wav          audio unido (para tools/voz.py)
  <trabajo>/<slug>/borrador.json      transcripción con tiempos del video unido
"""
import json, os, subprocess, sys
import numpy as np
import soundfile as sf

slug, WORK, MODELS = sys.argv[1], sys.argv[2], sys.argv[3]
clips = sys.argv[4:]
out_dir = os.path.join("public", "reels", slug)
tmp = os.path.join(WORK, slug)
os.makedirs(out_dir, exist_ok=True)
os.makedirs(tmp, exist_ok=True)


def run(*cmd):
    subprocess.run(cmd, check=True)


def has_audio(path):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", path],
                       capture_output=True, text=True)
    return bool(r.stdout.strip())


# Video: si la fuente no es 9:16 se rellena con un fondo desenfocado.
VF = ("split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:5[bg];"
      "[b]scale=1080:1920:force_original_aspect_ratio=decrease:flags=lanczos[fg];"
      "[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1,fps=30,format=yuv420p")

parts = []
for i, c in enumerate(clips):
    p = os.path.join(tmp, f"part{i:02d}.mov")
    if not os.path.exists(p):
        cmd = ["ffmpeg", "-v", "error", "-y", "-i", c]
        if not has_audio(c):
            cmd += ["-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-shortest"]
        cmd += ["-filter_complex", f"[0:v]{VF}[v]", "-map", "[v]", "-map", "0:a:0" if has_audio(c) else "1:a:0",
                "-c:v", "libx264", "-preset", "fast", "-crf", "16", "-g", "15",
                "-c:a", "pcm_s16le", "-ar", "48000", "-ac", "2", p]
        run(*cmd)
    parts.append(p)

lst = os.path.join(tmp, "lista.txt")
with open(lst, "w") as f:
    for p in parts:
        f.write(f"file '{os.path.abspath(p)}'\n")
joined = os.path.join(tmp, "unido.mov")
run("ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", joined)
run("ffmpeg", "-v", "error", "-y", "-i", joined, "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-g", "15",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", os.path.join(out_dir, "fuente.mp4"))
run("ffmpeg", "-v", "error", "-y", "-i", joined, "-vn", "-c:a", "pcm_s16le", os.path.join(tmp, "audio.wav"))

# Duración real de cada parte (para sumar offsets).
def dur(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True)
    return float(r.stdout)

import sherpa_onnx as so

M = os.path.join(MODELS, "sherpa-onnx-whisper-turbo")
rec = so.OfflineRecognizer.from_whisper(encoder=f"{M}/turbo-encoder.int8.onnx", decoder=f"{M}/turbo-decoder.int8.onnx",
                                        tokens=f"{M}/turbo-tokens.txt", language="es", task="transcribe", num_threads=4)


def vad_segments(a, sr):
    cfg = so.VadModelConfig()
    cfg.silero_vad.model = os.path.join(MODELS, "vad.onnx")
    cfg.silero_vad.min_silence_duration = 0.3
    cfg.silero_vad.min_speech_duration = 0.15
    cfg.silero_vad.max_speech_duration = 8
    cfg.silero_vad.threshold = 0.45
    cfg.sample_rate = sr
    vad = so.VoiceActivityDetector(cfg, buffer_size_in_seconds=600)
    segs = []
    w = cfg.silero_vad.window_size
    for i in range(0, len(a), w):
        vad.accept_waveform(a[i:i + w])
        while not vad.empty():
            segs.append((vad.front.start / sr, (vad.front.start + len(vad.front.samples)) / sr))
            vad.pop()
    vad.flush()
    while not vad.empty():
        segs.append((vad.front.start / sr, (vad.front.start + len(vad.front.samples)) / sr))
        vad.pop()
    return segs


def split_long(a, sr, s, e):
    """Corta tramos largos en las pausas cortas (energía) para tener tiempos más finos."""
    if e - s < 3.5:
        return [(s, e)]
    hop = int(0.01 * sr)
    seg = a[int(s * sr):int(e * sr)]
    n = len(seg) // hop
    db = np.array([20 * np.log10(np.sqrt(np.mean(seg[i * hop:(i + 1) * hop] ** 2)) + 1e-9) for i in range(n)])
    db = np.convolve(db, np.ones(3) / 3, mode="same")
    floor, speech = np.percentile(db, 10), np.percentile(db, 70)
    q = db < floor + 0.3 * (speech - floor)
    bounds = [s]
    i = 0
    while i < n:
        if q[i]:
            j = i
            while j < n and q[j]:
                j += 1
            if j - i >= 9 and i > 30 and j < n - 30 and s + i / 100 - bounds[-1] >= 1.0:
                bounds += [s + i / 100, s + j / 100]
            i = j
        else:
            i += 1
    bounds.append(e)
    return [(bounds[k], bounds[k + 1]) for k in range(0, len(bounds), 2)]


def transcribe(a, sr, s, e):
    st = rec.create_stream()
    st.accept_waveform(sr, a[max(0, int((s - 0.15) * sr)):int((e + 0.15) * sr)])
    rec.decode_stream(st)
    return st.result.text.strip()


draft = []
offset = 0.0
for ci, p in enumerate(parts):
    wav = os.path.join(tmp, f"part{ci:02d}.wav")
    run("ffmpeg", "-v", "error", "-y", "-i", p, "-ar", "16000", "-ac", "1", wav)
    a, sr = sf.read(wav, dtype="float32")
    segs = vad_segments(a, sr)
    if not segs:
        offset += dur(p)
        continue
    # Clip corto: texto del clip entero (más preciso) y tiempos de la voz detectada.
    whole = transcribe(a, sr, segs[0][0], segs[-1][1]) if segs[-1][1] - segs[0][0] < 25 else None
    for s, e in segs:
        draft.append({"clip": ci + 1, "start": round(offset + s, 2), "end": round(offset + e, 2), "text": transcribe(a, sr, s, e)})
    if whole is not None and len(segs) > 1:
        draft.append({"clip": ci + 1, "start": None, "end": None, "text": "[clip entero] " + whole})
    offset += dur(p)

json.dump({"clips": clips, "duration": round(offset, 3), "segments": draft}, open(os.path.join(tmp, "borrador.json"), "w"),
          ensure_ascii=False, indent=1)
for d in draft:
    if d["start"] is None:
        print(f'      {d["text"]}')
    else:
        print(f'[{d["clip"]}] {d["start"]:6.2f}-{d["end"]:6.2f} {d["text"]}')
print(f"total {offset:.2f}s")
