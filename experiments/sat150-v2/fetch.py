"""Review-only download of one Grok shot and original Russian TTS voice; no posting."""
from pathlib import Path
import urllib.request
from gtts import gTTS
import subprocess
out=Path("sat150-v2-grok")
out.mkdir(exist_ok=True)
url="https://vidgen.x.ai/xai-vidgen-bucket/xai-video-4733aed4-4ebc-9736-a5e7-d814d1e34742.mp4"
req=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0"})
with urllib.request.urlopen(req,timeout=90) as r: data=r.read()
assert len(data)>100000, "video too small"
(out/"sat150_grok_fullshot_16x9.mp4").write_bytes(data)
voice=("ZUBR TRAIL SAT-150. Разгрузка без подъёма кузова. "
"Посмотрите, как это работает. Продольные планки подвижного пола вместе продвигают груз к задним дверям. "
"Затем группы планок поочерёдно возвращаются обратно, а груз остаётся на месте. "
"Так, цикл за циклом, щепа выходит из кузова. Сам полуприцеп остаётся горизонтальным. "
"Это особенно полезно там, где высота разгрузки ограничена. "
"ZUBR TRAIL. Современные полуприцепы для ваших задач.")
gTTS(text=voice,lang="ru").save(str(out/"narration.mp3"))
(out/"script.txt").write_text(voice+"\n",encoding="utf-8")
print("READY", len(data), (out/"narration.mp3").stat().st_size)
print("OK",len(data))
