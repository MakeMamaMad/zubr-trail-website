#!/usr/bin/env python3
"""Make distinct color-graded concept visuals from ZUBR TRAIL original renders.

Originals are AI visualizations already in this repository. This script does
NOT represent the resulting images as documentary product photography.
"""
from pathlib import Path
from PIL import Image, ImageEnhance
import numpy as np

ASSETS = Path("assets")
SOURCES = {
    "hero": ASSETS / "hero.webp",
    "road": ASSETS / "road.webp",
    "aluminum": ASSETS / "aluminum.webp",
    "factory": ASSETS / "factory.webp",
    "sat-150": ASSETS / "sat-150.webp",
    "sat-197": ASSETS / "sat-197.webp",
    "sat-500": ASSETS / "sat-500.webp",
    "sat-510": ASSETS / "sat-510.jpg",
    "sat-545": ASSETS / "sat-545.webp",
    "sat-550": ASSETS / "sat-550.webp",
}
assert all(x.is_file() for x in SOURCES.values()), "Missing source image"

def colorize(image, name, scheme):
    image = image.convert("RGB")
    image.thumbnail((1680, 1150), Image.Resampling.LANCZOS)
    a = np.asarray(image, dtype=np.float32)
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    mx = np.maximum(g, b)
    warm = np.maximum(0, r - mx - 13) / 88
    sat = (np.max(a, axis=2) - np.min(a, axis=2)) / np.maximum(1, np.max(a, axis=2))
    weight = np.clip(warm, 0, 1) * np.clip((sat - .16) * 2.0, 0, 1)
    weight = weight ** .83
    if scheme == "gold":
        target = np.array([246., 184., 23.], dtype=np.float32)
        weight *= .91
    else:
        # Technical graphite/silver hero; neon-green coloured product photographs.
        target = np.array([196., 243., 18.], dtype=np.float32)
        if name == "hero":
            target = np.array([166., 185., 184.], dtype=np.float32)
        weight *= .90
    luminosity = .44 + .90 * (np.max(a, axis=2) / 255.0)
    tint = np.minimum(255., target[None, None, :] * luminosity[:, :, None])
    out = a * (1 - weight[:, :, None]) + tint * weight[:, :, None]
    if scheme == "lime" and name in ("hero", "road"):
        # Cooler industrial surroundings, keeping original light and shadow.
        out = .93 * out + .07 * np.stack([b, g, r], axis=-1)
    return Image.fromarray(np.uint8(np.clip(out, 0, 255)), "RGB")

for key, path in SOURCES.items():
    original = Image.open(path)
    for scheme in ("gold", "lime"):
        result = colorize(original, key, scheme)
        out = ASSETS / "colorways" / scheme / (key + ".webp")
        out.parent.mkdir(parents=True, exist_ok=True)
        result.save(out, "WEBP", quality=87, method=6)
        print(f"{out}: {result.width}x{result.height} ({out.stat().st_size} bytes)")
