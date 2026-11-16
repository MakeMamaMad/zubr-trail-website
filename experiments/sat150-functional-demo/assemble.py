#!/usr/bin/env python3
"""Compose an owner-review-only SAT-150 Grok product demo into a subtitled MP4.
No publisher calls, no account integrations. Fails if any video or voice is unavailable.
"""
from __future__ import annotations
import asyncio
import json
import subprocess
import urllib.request
from pathlib import Path

OUT = Path("sat150-demo-output")
OUT.mkdir(exist_ok=True)
URLS = [
    "https://vidgen.x.ai/xai-vidgen-bucket/xai-video-7b5a7831-66c1-945f-8dfc-ad8ded960e80.mp4",
    "https://vidgen.x.ai/xai-vidgen-bucket/xai-video-ac848f78-70cc-90ba-a640-10f1643e771a.mp4",
    "https://vidgen.x.ai/xai-vidgen-bucket/xai-video-a44e0fec-31bd-9959-b62d-b59d00f78c63.mp4",
]
VOICE_TEXT = (
    "ZUBR TRAIL SAT-150 — полуприцеп с подвижным полом. "
    "Смотрите, как груз перемещается к заднему борту. "
    "Планки пола двигаются последовательно, продвигая материал к выходу. "
    "Груз выгружается через задние двери, а кузов остаётся горизонтальным. "
    "В отличие от самосвального способа, для такой разгрузки не нужно поднимать кузов. "
    "ZUBR TRAIL. Современные полуприцепы для ваших задач."
)

def run(*args: str) -> None:
    print("RUN", " ".join(args),flush=True)
    subprocess.run(args,check=True)

def ffprobe(path: Path, selector: str) -> float:
    raw = subprocess.check_output([
        "ffprobe","-v","error","-select_streams",selector,
        "-show_entries","stream=duration","-of","default=noprint_wrappers=1:nokey=1",str(path)
    ], text=True).strip().splitlines()
    if raw and raw[0] and raw[0] != "N/A":
        return float(raw[0])
    raw = subprocess.check_output([
        "ffprobe","-v","error","-show_entries","format=duration",
        "-of","default=noprint_wrappers=1:nokey=1",str(path)
    ],text=True).strip()
    return float(raw)

async def create_voice(path: Path) -> None:
    try:
        import edge_tts
        comm = edge_tts.Communicate(VOICE_TEXT, voice="ru-RU-SvetlanaNeural", rate="+10%")
        await comm.save(str(path))
        if path.exists() and path.stat().st_size > 2000:
            print("VOICE_BACKEND=edge-tts", flush=True)
            return
    except Exception as exc:
        print("Edge TTS unavailable:", str(exc)[:240], flush=True)
    try:
        from gtts import gTTS
        import asyncio
        await asyncio.to_thread(gTTS(text=VOICE_TEXT, lang="ru", slow=False).save, str(path))
        if path.exists() and path.stat().st_size > 2000:
            print("VOICE_BACKEND=gtts", flush=True)
            return
    except Exception as exc:
        print("Google TTS unavailable:", str(exc)[:240], flush=True)
    # Offline fallback: genuine Russian voice, although less natural.
    wav = path.with_suffix(".wav")
    run("espeak-ng", "-v", "ru", "-s", "140", "-w", str(wav), VOICE_TEXT)
    run("ffmpeg", "-y", "-i", str(wav), "-ar", "44100", "-q:a", "3", str(path))
    if not path.exists() or path.stat().st_size < 2000:
        raise RuntimeError("No Russian narration could be generated")
    print("VOICE_BACKEND=espeak-ng", flush=True)

def main() -> None:
    clips = []
    for i,url in enumerate(URLS,1):
        target = OUT / f"grok_scene_{i}.mp4"
        req = urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0"})
        with urllib.request.urlopen(req,timeout=60) as response:
            data=response.read()
        if len(data) < 100_000:
            raise RuntimeError(f"Scene {i} download unexpectedly small: {len(data)}")
        target.write_bytes(data)
        print("FETCH", i, len(data),flush=True)
        if ffprobe(target,"v:0") < 7:
            raise RuntimeError(f"Scene {i} is too short")
        fixed = OUT / f"segment_{i}.mp4"
        run("ffmpeg","-y","-i",str(target),"-t","8",
            "-vf","scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fps=30,setsar=1",
            "-an","-c:v","libx264","-preset","medium","-crf","21","-pix_fmt","yuv420p",
            "-movflags","+faststart",str(fixed))
        clips.append(fixed)
    index=OUT/"concat.txt"
    index.write_text("".join("file '"+c.name+"'\n" for c in clips),encoding="utf-8")
    stitched=OUT/"stitched.mp4"
    run("ffmpeg","-y","-f","concat","-safe","0","-i",str(index),"-c","copy",str(stitched))
    voice=OUT/"voice_ru.mp3"
    asyncio.run(create_voice(voice))
    duration=ffprobe(voice,"a:0")
    print("VOICE_DURATION",duration,flush=True)
    if duration > 23.5:
        ratio=duration/23.5
        if ratio > 1.65:
            raise RuntimeError(f"Narration is too long for comprehensible speech: {duration}")
        stretched=OUT/"voice_compact.mp3"
        run("ffmpeg","-y","-i",str(voice),"-af",f"atempo={ratio:.4f}","-q:a","3",str(stretched))
        voice=stretched
    cues=[
        (0,3500,"ZUBR TRAIL  |  SAT-150"),
        (4000,8000,"ПОЛУПРИЦЕП С ПОДВИЖНЫМ ПОЛОМ"),
        (8000,13000,"ПЛАНКИ ПОЛА ПЕРЕМЕЩАЮТ ГРУЗ"),
        (13000,18500,"ВЫГРУЗКА ЧЕРЕЗ ЗАДНИЕ ДВЕРИ"),
        (18500,22500,"КУЗОВ ОСТАЁТСЯ ГОРИЗОНТАЛЬНЫМ"),
        (22500,24000,"ZUBR TRAIL  •  ВЫБОР ПОЛУПРИЦЕПА"),
    ]
    def stamp(ms):
        hh=ms//3600000;mm=(ms//60000)%60;ss=(ms//1000)%60;mmm=ms%1000
        return f"{hh:02}:{mm:02}:{ss:02},{mmm:03}"
    srt="".join(f"{i}\n{stamp(a)} --> {stamp(b)}\n{text}\n\n" for i,(a,b,text) in enumerate(cues,1))
    (OUT/"captions.srt").write_text(srt,encoding="utf-8")
    final=OUT/"ZUBR_TRAIL_SAT150_Grok_Product_Demo_9x16.mp4"
    style="FontName=DejaVu Sans,FontSize=24,PrimaryColour=&H00FFFFFF,OutlineColour=&H00111111,BorderStyle=3,BackColour=&H80000000,Outline=2,Shadow=0,MarginV=88,Alignment=2"
    run("ffmpeg","-y","-i",str(stitched),"-i",str(voice),
        "-vf",f"subtitles={OUT}/captions.srt:force_style='{style}'",
        "-map","0:v:0","-map","1:a:0","-t","24",
        "-c:v","libx264","-preset","medium","-crf","20","-pix_fmt","yuv420p",
        "-c:a","aac","-b:a","160k","-movflags","+faststart",str(final))
    # Contact sheet is a real artifact, not a model-rendered approximation.
    run("ffmpeg","-y","-i",str(final),"-vf","fps=1/3,scale=270:480,tile=4x2","-frames:v","1",str(OUT/"contact_sheet.jpg"))
    (OUT/"manifest.json").write_text(json.dumps({
        "scene_grok_urls":URLS,"target":"ZUBR TRAIL SAT-150","autoposting":False,
        "narration":VOICE_TEXT,"owner_review_required":True,
        "fact_check":"AI-generated mechanism must be inspected; do not assert physical accuracy without expert review.",
        "result_file":final.name},ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("OK",final,final.stat().st_size,flush=True)

if __name__ == "__main__":
    main()
