#!/usr/bin/env python3
"""Create a 20.000s promotional video using ONLY the two original ZUBR TRAIL WebPs.

No generative video, model inpainting, geometry warping, AI product modifications
or unverifiable physical movements. Source images stay intact; the only
operations on the trailer images are proportional resize and rigid translation.

Output: promo/output/ZUBR_TRAIL_SAT-500_SAT-545_20s.mp4 (25fps, 500 frames).
"""
from __future__ import annotations

import json
import math
import os
import shutil
import struct
import subprocess
import wave
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "promo" / "output"
FPS = 25
COUNT = 500
W, H = 1280, 720
SLOGAN = "Современные полуприцепы для ваших задач"
EXPECTED = {
    "sat-500.webp": "7db487920859e378c038741b4bce7bd10e9d2d18",
    "sat-545.webp": "95b7b8081ae9b78722400527f06c3dd668505077",
}
DARK = (9, 11, 16)
RED = (234, 16, 43)
WHITE = (245, 246, 248)
MUTED = (160, 167, 177)

def checked_image(name: str) -> Image.Image:
    path = ROOT / "assets" / name
    if not path.is_file():
        raise RuntimeError(f"Missing original website image: {path}")
    blob = subprocess.check_output(["git", "hash-object", str(path)], text=True).strip()
    if blob != EXPECTED[name]:
        raise RuntimeError(f"Source image changed: {name}, expected {EXPECTED[name]} got {blob}")
    image = Image.open(path).convert("RGB")
    print(f"Verified website source {name}: {image.width} x {image.height}, git blob {blob}")
    return image

def font(px: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    names = (
        ["/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf",
         "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"]
        if bold else
        ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]
    )
    for name in names:
        if Path(name).exists():
            return ImageFont.truetype(name, px)
    raise RuntimeError("A font with Cyrillic support is required")

def fit_inside(image: Image.Image, width: int, height: int) -> Image.Image:
    # Single uniform scaling factor; never stretch or reconstruct the vehicle.
    factor = min(width / image.width, height / image.height)
    return image.resize(
        (int(image.width * factor), int(image.height * factor)),
        Image.Resampling.LANCZOS,
    )

def background() -> Image.Image:
    bg = Image.new("RGB", (W, H), DARK)
    pixels = bg.load()
    for y in range(H):
        for x in range(W):
            dx = (x - 1150) / 920.0
            dy = (y - 330) / 750.0
            glow = max(0.0, 1.0 - math.sqrt(dx * dx + dy * dy))
            pixels[x, y] = (min(42, 9 + int(30 * glow)),
                            11 + int(3 * glow), 16 + int(7 * glow))
    return bg

def txt(draw: ImageDraw.ImageDraw, xy, text: str, size: int,
        fill=WHITE, bold=False):
    draw.text(xy, text, font=font(size, bold), fill=fill)

def trailer_panel(canvas: Image.Image, image: Image.Image, x: int, y: int,
                  panel_w: int, panel_h: int, tint: tuple[int,int,int],
                  drift: int = 0):
    d = ImageDraw.Draw(canvas)
    d.rounded_rectangle((x - 3, y - 3, x + panel_w + 3, y + panel_h + 3),
                        radius=9, outline=tint, width=2)
    # The entire original studio image is visible. Nothing is reconstructed,
    # cropped out of the source, or projected into a fictitious 3D view.
    ox = x + (panel_w - image.width) // 2
    oy = y + (panel_h - image.height) // 2 + drift
    canvas.paste(image, (ox, oy))

def logo(draw, x=42, y=30, small=False):
    txt(draw, (x, y), "ZUBR", 33 if not small else 27, WHITE, True)
    txt(draw, (x + (111 if not small else 92), y + 1),
        "TRAIL", 33 if not small else 27, RED, True)

def section_500(bg: Image.Image, source: Image.Image, frame: int):
    img = bg.copy()
    d = ImageDraw.Draw(img)
    wiggle = int(6 * math.sin(frame / 31.0))
    trailer_panel(img, source, 25, 70, 940, 615, RED, wiggle)
    d = ImageDraw.Draw(img)
    txt(d, (990, 166), "SAT", 48, WHITE, True)
    txt(d, (984, 218), "500", 93, WHITE, True)
    d.rectangle((990, 336, 1228, 340), RED)
    txt(d, (990, 357), "ЗЕРНОВОЗ", 19, MUTED, True)
    txt(d, (990, 626), "01 / 02", 20, WHITE, True)
    logo(d)
    txt(d, (47, 680), "ВИЗУАЛИЗАЦИЯ ИЗ КАТАЛОГА", 12, MUTED)
    return img

def section_545(bg: Image.Image, source: Image.Image, frame: int):
    img = bg.copy()
    drift = int(6 * math.sin(frame / 29.0))
    trailer_panel(img, source, 25, 70, 940, 615, (197, 202, 210), drift)
    d = ImageDraw.Draw(img)
    txt(d, (990, 166), "SAT", 48, WHITE, True)
    txt(d, (984, 218), "545", 93, WHITE, True)
    d.rectangle((990, 336, 1228, 340), RED)
    txt(d, (990, 357), "САМОСВАЛЬНЫЙ", 16, MUTED, True)
    txt(d, (990, 626), "02 / 02", 20, WHITE, True)
    logo(d)
    txt(d, (47, 680), "ВИЗУАЛИЗАЦИЯ ИЗ КАТАЛОГА", 12, MUTED)
    return img

def final_section(bg: Image.Image, im500: Image.Image, im545: Image.Image):
    img = bg.copy()
    d = ImageDraw.Draw(img)
    # Each product is a complete intact proportional copy of the website asset.
    trailer_panel(img, im500, 24, 110, 604, 447, RED)
    trailer_panel(img, im545, 653, 110, 604, 447, (186, 190, 198))
    d = ImageDraw.Draw(img)
    txt(d, (45, 26), "SAT-500", 33, WHITE, True)
    txt(d, (677, 26), "SAT-545", 33, WHITE, True)
    d.rounded_rectangle((60, 560, 1220, 702), 12, fill=(14, 17, 23))
    d.rectangle((80, 572, 1195, 575), RED)
    txt(d, (112, 583), "ZUBR TRAIL", 40, WHITE, True)
    txt(d, (112, 644), SLOGAN, 27, WHITE, True)
    txt(d, (1090, 678), "20s", 12, MUTED)
    return img

def build_audio(path: Path):
    sr = 24000
    count = sr * 20
    with wave.open(str(path), "wb") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sr)
        # Original synthetic sound design: quiet bass drone and edit accents.
        buf = bytearray()
        edit_points = [0.0, 3.0, 7.5, 8.0, 12.0, 16.0]
        for n in range(count):
            t = n / sr
            pad = (0.25 * math.sin(2 * math.pi * 58 * t)
                   + 0.12 * math.sin(2 * math.pi * 87 * t))
            hits = 0.0
            for mark in edit_points:
                dt = t - mark
                if 0 <= dt < 0.33:
                    hits += math.exp(-18 * dt) * math.sin(2 * math.pi * 115 * dt)
            fade = min(1.0, t / 0.3, (20 - t) / 0.55)
            value = max(-0.92, min(0.92, (pad * 0.15 + hits * 0.28) * max(0, fade)))
            buf.extend(struct.pack("<h", int(value * 32767)))
        wav.writeframes(buf)

def run():
    if not shutil.which("ffmpeg") or not shutil.which("ffprobe"):
        raise RuntimeError("ffmpeg and ffprobe are required")
    OUT.mkdir(parents=True, exist_ok=True)
    src500 = checked_image("sat-500.webp")
    src545 = checked_image("sat-545.webp")
    # Pre-resize once; later moving layers never changes shape.
    panel500 = fit_inside(src500, 928, 596)
    panel545 = fit_inside(src545, 928, 596)
    final500 = fit_inside(src500, 590, 430)
    final545 = fit_inside(src545, 590, 430)
    bg = background()
    final_image = final_section(bg, final500, final545)
    wav_path = OUT / "_original_sound.wav"
    path = OUT / "ZUBR_TRAIL_SAT-500_SAT-545_20s.mp4"
    build_audio(wav_path)
    cmd = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-f", "rawvideo", "-vcodec", "rawvideo", "-pix_fmt", "rgb24",
        "-video_size", f"{W}x{H}", "-framerate", str(FPS), "-i", "-",
        "-i", str(wav_path), "-map", "0:v:0", "-map", "1:a:0",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "19",
        "-pix_fmt", "yuv420p", "-r", str(FPS),
        "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart", "-t", "20",
        str(path)
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    assert proc.stdin is not None
    try:
        for frame in range(COUNT):
            if frame < 188:     # 0.00–7.52 seconds SAT-500
                image = section_500(bg, panel500, frame)
            elif frame < 200:   # 7.52–8.00, clean visual edit
                image = section_500(bg, panel500, frame)
                d = ImageDraw.Draw(image)
                left = int((frame - 188) / 12 * W)
                d.rectangle((0, 0, left, H), fill=RED)
            elif frame < 400:   # 8.00–16.00 SAT-545
                image = section_545(bg, panel545, frame)
            else:              # 16.00–20.00 paired brand lock-up
                image = final_image
            proc.stdin.write(image.tobytes())
        proc.stdin.close()
        code = proc.wait()
    except Exception:
        proc.kill()
        proc.wait()
        raise
    if code != 0 or not path.is_file():
        raise RuntimeError(f"ffmpeg failed: exit {code}")
    probe = subprocess.check_output([
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=nb_frames,avg_frame_rate",
        "-show_entries", "format=duration", "-of", "json", str(path)
    ], text=True)
    data = json.loads(probe)
    duration = float(data["format"]["duration"])
    frames = int(data["streams"][0]["nb_frames"])
    if frames != COUNT or abs(duration - 20.0) > 0.03:
        raise RuntimeError(f"wrong duration/frames: {duration}s / {frames}")
    print(f"SUCCESS: {path} / {duration:.3f}s / {frames} frames / 25fps")
    summary = {
        "project": "ZUBR TRAIL",
        "file": path.name,
        "duration_seconds": duration,
        "fps": FPS,
        "frames": frames,
        "master": "1280x720",
        "website_visualizations": EXPECTED,
        "preservation": "original full images, proportional scale + translation only; no AI redraw",
        "claim": "These are website illustrations, not documentary images.",
        "slogan": SLOGAN,
        "generation_cost_usd": 0,
    }
    (OUT / "source_and_QA.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")
    # Render proof at three distinct shots for human inspection.
    for t, tag in [(1, "SAT-500"), (10, "SAT-545"), (18, "FINALE")]:
        subprocess.check_call([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-ss", str(t), "-i", str(path), "-frames:v", "1",
            str(OUT / ("proof_" + tag + ".png"))
        ])

if __name__ == "__main__":
    run()
