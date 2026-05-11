#!/usr/bin/env bash
# Regenerate every icon variant from assets/src/logo.svg.
#
# Requirements: inkscape (1.4+), python3 with Pillow.
#
# Output:
#   assets/images/icon.png                       1024×1024 — main app icon (iOS + fallback)
#   assets/images/splash-icon.png                1024×1024 — Expo splash screen image
#   assets/images/favicon.png                       48×48 — web favicon
#   assets/images/android-icon-background.png    1024×1024 — solid green swatch
#   assets/images/android-icon-foreground.png    1024×1024 — logo on transparent canvas, content fits ~66% safe zone
#   assets/images/android-icon-monochrome.png    1024×1024 — black silhouette of the same, for themed icons

set -euo pipefail
cd "$(dirname "$0")/../.."   # cd to repo root

OUT=assets/images
SRC=assets/src

# Direct rasterizations from logo.svg
inkscape --export-type=png --export-width=1024 --export-filename="$OUT/icon.png"        "$SRC/logo.svg"
inkscape --export-type=png --export-width=1024 --export-filename="$OUT/splash-icon.png" "$SRC/logo.svg"
inkscape --export-type=png --export-width=48   --export-filename="$OUT/favicon.png"     "$SRC/logo.svg"

# Solid-color background for Android adaptive icon
inkscape --export-type=png --export-width=1024 --export-filename="$OUT/android-icon-background.png" "$SRC/icon-background.svg"

# Foreground = the logo composited onto a transparent 1024×1024 canvas at ~66% size,
# centered. Monochrome = same shape with every visible pixel mapped to black.
python3 - <<'PY'
from PIL import Image
src = Image.open('assets/images/icon.png').convert('RGBA')
scaled = src.resize((676, 676), Image.LANCZOS)
canvas = Image.new('RGBA', (1024, 1024), (0, 0, 0, 0))
offset = ((1024 - 676) // 2,) * 2
canvas.paste(scaled, offset, scaled)
canvas.save('assets/images/android-icon-foreground.png')

mono = canvas.copy()
pixels = mono.load()
for y in range(mono.height):
    for x in range(mono.width):
        r, g, b, a = pixels[x, y]
        if a > 0:
            pixels[x, y] = (0, 0, 0, a)
mono.save('assets/images/android-icon-monochrome.png')
print('foreground + monochrome composited')
PY

echo "Done."
