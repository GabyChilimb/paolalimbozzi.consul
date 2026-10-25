#!/bin/bash
# Renderiza un reel y le pasa un limitador al audio (picos a -1 dBFS).
# Uso: tools/exportar.sh <IdComposicion> <salida.mp4> [navegador]
set -e
ID=$1; OUT=$2; BROWSER=${3:-/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell}
TMP="${OUT%.mp4}.tmp.mp4"
mkdir -p "$(dirname "$OUT")"
npx remotion render "$ID" "$TMP" --browser-executable="$BROWSER" --concurrency=3 --timeout=180000 --crf=16 --audio-bitrate=256k --log=error
# Video: CRF 23 con techo de bitrate para que ningún archivo pase de ~90 MB.
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$TMP")
MAXK=$(python3 -c "print(min(7000, int(88*8*1000/$DUR) - 256))")
ffmpeg -v error -y -i "$TMP" -c:v libx264 -preset slow -crf 23 -maxrate ${MAXK}k -bufsize $((MAXK*2))k -pix_fmt yuv420p \
  -af "alimiter=limit=0.79:attack=3:release=60:level=disabled" -c:a aac -b:a 256k -movflags +faststart "$OUT"
rm -f "$TMP"
ffmpeg -hide_banner -i "$OUT" -vn -af ebur128=framelog=quiet:peak=true -f null - 2>&1 | grep -E " I:|Peak:" | tr -s ' ' | tr '\n' ' '; echo
