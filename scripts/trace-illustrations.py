"""Trace the ChatGPT drawings in assets/illustrations into the mask SVGs in
public/illustrations (spec 10.3).

    python3 scripts/trace-illustrations.py [name ...]

Needs Pillow and numpy (a throwaway venv is fine), potrace (`brew install
potrace`) and npx (for SVGO). Each drawing is upscaled 2x, thresholded,
optionally cut out with a polygon, split into layers and traced:

- ink:  the drawing itself.
- pen:  pixels inside the `pen` polygons, painted purple on the site.
- fill: an opaque silhouette (everything the outside can't reach), for art
        that overlaps something. `close` lines seal shapes the frame cuts off.

Polygons are in the source image's pixels. All layers share one viewBox,
cropped to the art plus a small margin; components/illustration.tsx must
list the same width and height.
"""

import subprocess
import sys
import tempfile
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "illustrations"
OUT = ROOT / "public" / "illustrations"
UP = 2
THRESHOLD = 150

ART = {
    # The hand only: cut away from its own napkin and coffee mug, since the
    # hero puts it on the real napkin card.
    "hand": {
        "keep": [
            (564, 850), (585, 855), (622, 870), (670, 847), (755, 815), (792, 822),
            (870, 902), (922, 917), (950, 950), (955, 1005), (972, 1200), (1024, 1275),
            (1024, 1536), (905, 1536), (895, 1450), (830, 1325), (770, 1262),
            (710, 1195), (655, 1125), (652, 1090), (642, 1072), (636, 1062),
            (631, 1050), (612, 1030), (603, 1015), (601, 1000), (604, 965),
            (598, 945), (600, 912), (592, 888), (572, 872),
        ],
        "fill": True,
        "close": [((915, 1440), (1024, 1300))],
    },
    "cards": {},
    # The light rays.
    "lamp": {"pen": [[(425, 532), (600, 532), (600, 505), (725, 505), (725, 710), (425, 710)]]},
    # The dotted flight path.
    "plane": {"pen": [[(0, 0), (820, 0), (820, 490), (856, 500), (856, 1024), (0, 1024)]]},
    # The "z" over the sleeper's head.
    "nap": {"pen": [[(850, 255), (930, 255), (930, 380), (850, 380)]]},
}


def polygon_mask(size, polygons):
    mask = Image.new("1", size, 0)
    draw = ImageDraw.Draw(mask)
    for polygon in polygons:
        draw.polygon([(x * UP, y * UP) for x, y in polygon], fill=1)
    return np.array(mask, dtype=bool)


def silhouette(lines, close):
    """Everything not reachable from the top-left corner once the lines are
    thickened a little. The image edge counts as a wall."""
    solid = Image.fromarray((lines * 255).astype("uint8")).filter(ImageFilter.MaxFilter(7))
    draw = ImageDraw.Draw(solid)
    for (ax, ay), (bx, by) in close:
        draw.line([(ax * UP, ay * UP), (bx * UP, by * UP)], fill=255, width=8)
    wall = np.array(solid) > 0
    h, w = wall.shape
    outside = np.zeros_like(wall)
    outside[0, 0] = True
    queue = deque([(0, 0)])
    while queue:
        y, x = queue.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < h and 0 <= nx < w and not wall[ny, nx] and not outside[ny, nx]:
                outside[ny, nx] = True
                queue.append((ny, nx))
    shape = Image.fromarray((~outside * 255).astype("uint8")).filter(ImageFilter.MinFilter(5))
    return np.array(shape) > 0


def trace(name, cfg, tmp):
    image = Image.open(SRC / f"{name}.webp").convert("L")
    image = image.resize((image.width * UP, image.height * UP), Image.LANCZOS)
    ink = np.array(image) < THRESHOLD
    if "keep" in cfg:
        ink &= polygon_mask(image.size, [cfg["keep"]])

    layers = {}
    if "pen" in cfg:
        pen = ink & polygon_mask(image.size, cfg["pen"])
        ink &= ~pen
        layers["pen"] = pen
    layers["ink"] = ink
    if cfg.get("fill"):
        layers["fill"] = silhouette(ink | layers.get("pen", False), cfg.get("close", []))

    everything = np.logical_or.reduce(list(layers.values()))
    ys, xs = np.where(everything)
    pad = 8 * UP
    x0, y0 = max(xs.min() - pad, 0), max(ys.min() - pad, 0)
    x1, y1 = min(xs.max() + pad, image.width), min(ys.max() + pad, image.height)
    print(f"{name}: viewBox 0 0 {x1 - x0} {y1 - y0}")

    for layer, mask in layers.items():
        bitmap = tmp / f"{name}-{layer}.pbm"
        traced = tmp / f"{name}-{layer}.svg"
        Image.fromarray((~mask[y0:y1, x0:x1] * 255).astype("uint8")).convert("1").save(bitmap)
        subprocess.run(
            ["potrace", str(bitmap), "-s", "--flat", "-t", "6", "-a", "1.0", "-O", "0.8", "-u", "1", "-o", str(traced)],
            check=True,
        )
        out = OUT / traced.name
        subprocess.run(
            ["npx", "-y", "svgo@3.3.2", "-q", "-p", "0", "--multipass", "-i", str(traced), "-o", str(out)],
            check=True,
        )
        # The masks size from the viewBox; drop potrace's pt width/height.
        svg = out.read_text()
        svg = svg.replace(svg[svg.index(" width=") : svg.index(" viewBox=")], "", 1)
        out.write_text(svg)
        print(f"  {out.relative_to(ROOT)} {out.stat().st_size} bytes")


def main():
    names = sys.argv[1:] or list(ART)
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for name in names:
            trace(name, ART[name], Path(tmp))


if __name__ == "__main__":
    main()
