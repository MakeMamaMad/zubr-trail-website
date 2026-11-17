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
voice=("ZUBR TRAIL сто пятьдесят. Полуприцеп с подвижным полом. "
"Сначала посмотрите на работу планок. Они постепенно перемещают груз назад, к открытым дверям. "
"Вот настоящая разгрузка: щепа выходит наружу, а кузов остаётся горизонтальным. "
"Главное отличие от самосвала — кузов не приходится поднимать. "
"ZUBR TRAIL. Современные полуприцепы для ваших задач.")
gTTS(text=voice,lang="ru").save(str(out/"narration.mp3"))
(out/"script.txt").write_text(voice+"\n",encoding="utf-8")
print("READY", len(data), (out/"narration.mp3").stat().st_size)
print("OK",len(data))

# Public Mixkit licensed royalty-free music for owner review; no publication
for name,link in [('techno-fest-vibes.mp3','https://assets.mixkit.co/music/124/124.mp3'),('cat-walk.mp3','https://assets.mixkit.co/music/371/371.mp3')]:
    req=urllib.request.Request(link,headers={'User-Agent':'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req,timeout=40) as resp: audio=resp.read()
        if len(audio)>50000: (out/name).write_bytes(audio)
        print('MUSIC',name,len(audio))
    except Exception as ex: print('MUSIC_FAILED',name,str(ex))
