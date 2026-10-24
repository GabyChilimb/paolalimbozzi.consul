"""Termina de preparar un reel ya configurado:
  1. Limpia la voz y corta silencios (tools/voz.py), eligiendo el perfil según el volumen.
  2. Escribe los tramos KEEP en el config.
  3. Genera la música del preset del config.

Uso: python tools/finalizar.py <slug> <carpeta de trabajo>
  config: src/reels/configs/<slug>.ts · audio: <trabajo>/<slug>/audio.wav
"""
import os, re, subprocess, sys

slug, WORK = sys.argv[1], sys.argv[2]
cfg_path = f"src/reels/configs/{slug}.ts"
audio = os.path.join(WORK, slug, "audio.wav")
out_dir = f"public/reels/{slug}"
py = sys.executable

meas = subprocess.run(["ffmpeg", "-hide_banner", "-i", audio, "-af", "ebur128=framelog=quiet", "-f", "null", "-"], capture_output=True, text=True).stderr
lufs = float(re.findall(r"I:\s*(-?[\d.]+) LUFS", meas)[-1])
perfil = "ruidosa" if lufs < -27 else "media" if lufs < -19 else "limpia"
print(f"{slug}: {lufs} LUFS → perfil {perfil}")

res = subprocess.run([py, "-I", "tools/voz.py", audio, f"{out_dir}/voz.wav", cfg_path, perfil], capture_output=True, text=True, check=True).stdout
header, keep = res.strip().split("\n", 1)
src = open(cfg_path).read()
src = re.sub(r"// KEEP:.*?\nconst KEEP: \[number, number\]\[\] = \[.*?\];", f"// KEEP: {header[3:]} · perfil de voz \"{perfil}\" (tools/finalizar.py)\nconst " + keep[len("export const "):], src, flags=re.S)
open(cfg_path, "w").write(src)
total = sum(float(b) - float(a) for a, b in re.findall(r"\[([\d.]+), ([\d.]+)\]", keep))
print(header)

preset = re.search(r'preset:\s*"(\w+)"', src).group(1)
seed = re.search(r"seed:\s*(\d+)", src)
subprocess.run([py, "-I", "tools/banco_sonido.py", "musica", preset, f"{total + 4.5:.1f}", f"{out_dir}/musica.m4a", seed.group(1) if seed else "0"], check=True)
