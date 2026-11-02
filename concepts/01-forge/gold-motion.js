(function buildGoldInteractions(){
"use strict";
const g=window.GOLD;
if(!g)return;
const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
function initTheme(){
  let t="night";
  try{t=localStorage.getItem("zubr-gold-theme-v3")||"night"}catch(e){}
  document.documentElement.dataset.theme=t;
  const button=$("#themeButton");
  button?.setAttribute("aria-label",t==="night"?"Включить светлую тему":"Включить тёмную тему");
  button?.addEventListener("click",()=>{
    t=document.documentElement.dataset.theme==="night"?"day":"night";
    document.documentElement.dataset.theme=t;
    button.setAttribute("aria-label",t==="night"?"Включить светлую тему":"Включить тёмную тему");
    try{localStorage.setItem("zubr-gold-theme-v3",t)}catch(e){}
  });
}
function initMenu(){
  const overlay=$("#siteMenu"),toggle=$("#menuTrigger");
  if(!overlay||!toggle)return;
  let lastFocus;
  const focusables=()=>$$('a[href],button:not([disabled])',overlay).filter(x=>x.getClientRects().length);
  function close(){
    overlay.classList.remove("is-open");
    overlay.hidden=true;
    document.body.classList.remove("menu-is-open");
    toggle.setAttribute("aria-expanded","false");
    lastFocus?.focus();
  }
  function open(){
    lastFocus=document.activeElement;
    overlay.hidden=false;
    overlay.classList.add("is-open");
    document.body.classList.add("menu-is-open");
    toggle.setAttribute("aria-expanded","true");
    focusables()[0]?.focus();
  }
  toggle.addEventListener("click",()=>overlay.hidden?open():close());
  overlay.addEventListener("click",e=>{if(e.target===overlay)close()});
  document.addEventListener("keydown",e=>{
    if(overlay.hidden)return;
    if(e.key==="Escape"){e.preventDefault();close();}
    if(e.key==="Tab"){
      const links=focusables();if(!links.length)return;
      const first=links[0],last=links[links.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
}
function initNavigation(){
  const curtain=$("#pageCurtain");
  document.addEventListener("click",e=>{
    if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
    const link=e.target.closest("a[href]");
    if(!link||link.hasAttribute("download")||link.target==="_blank")return;
    let url;try{url=new URL(link.href,location.href)}catch(err){return}
    if(url.origin!==location.origin||url.pathname===location.pathname&&url.search===location.search){
      if(url.hash)return;
      if(url.href===location.href){e.preventDefault();return}
    }
    if(!["http:","https:"].includes(url.protocol)||url.origin!==location.origin)return;
    e.preventDefault();
    if(reduce){location.assign(url.href);return}
    if(document.documentElement.classList.contains("is-leaving"))return;
    document.documentElement.classList.add("is-leaving");
    curtain?.setAttribute("aria-hidden","true");
    setTimeout(()=>location.assign(url.href),430);
  });
}
function initScroll(){
  const meter=$("#scrollProgress");
  let ticking=false;
  function update(){
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const frac=Math.max(0,Math.min(1,scrollY/max));
    if(meter)meter.style.transform="scaleX("+frac+")";
    $("#siteHeader")?.classList.toggle("has-scrolled",scrollY>24);
    ticking=false;
  }
  addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
  addEventListener("resize",update,{passive:true});
  update();
  const items=$$("[data-reveal]");
  if(reduce||!("IntersectionObserver" in window)){
    items.forEach(el=>el.classList.add("is-visible"));
    return;
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(item=>{
      if(item.isIntersecting){
        item.target.classList.add("is-visible");
        observer.unobserve(item.target);
      }
    });
  },{threshold:0.09,rootMargin:"0px 0px -35px 0px"});
  document.documentElement.classList.add("gold-motion-enabled");
  items.forEach(el=>observer.observe(el));
}
function initHero(){
  const scene=$("#heroObject"),wrapper=$(".hero-cinema");
  if(!scene||!wrapper||reduce)return;
  let px=0,py=0;
  wrapper.addEventListener("pointermove",e=>{
    if(e.pointerType==="touch")return;
    const rect=wrapper.getBoundingClientRect();
    px=(e.clientX-rect.left)/rect.width-.5;
    py=(e.clientY-rect.top)/rect.height-.5;
    scene.style.setProperty("--mx",(px*24).toFixed(1)+"px");
    scene.style.setProperty("--my",(py*14).toFixed(1)+"px");
  },{passive:true});
  wrapper.addEventListener("pointerleave",()=>{
    scene.style.setProperty("--mx","0px");scene.style.setProperty("--my","0px")
  });
}
function initRail(){
  const rail=$("#modelRail");
  if(!rail)return;
  const progress=$("#railProgress");
  function update(){
    const distance=Math.max(1,rail.scrollWidth-rail.clientWidth);
    if(progress)progress.style.transform="scaleX("+(0.12+0.88*rail.scrollLeft/distance)+")";
  }
  rail.addEventListener("scroll",update,{passive:true});
  $$("[data-rail-dir]").forEach(b=>b.addEventListener("click",()=>{
    const direction=Number(b.dataset.railDir)||1;
    const card=$(".rail-card",rail);
    rail.scrollBy({left:direction*(card?.getBoundingClientRect().width||360)+direction*20,behavior:reduce?"instant":"smooth"});
  }));
  update();
}
function setImage(el,file,alt){
  if(!el)return;
  el.src=g.asset(file);
  el.dataset.fallback=g.original(file);
  el.alt=alt;
}
function initStory(){
  const chapter=$$("[data-story]");
  const image=$("#storyStageImage img");
  if(!chapter.length||!image)return;
  function activate(i){
    const item=g.advantages[i];if(!item)return;
    chapter.forEach((el,j)=>el.classList.toggle("is-active",i===j));
    if(image.getAttribute("src")!==g.asset(item.img)){
      image.classList.add("is-swapping");
      setTimeout(()=>{
        setImage(image,item.img,item.title);
        image.classList.remove("is-swapping");
      },reduce?0:160);
    }
    set("storyStageNum",item.num+" / 04");
  }
  activate(0);
  if(!("IntersectionObserver" in window))return;
  const ob=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
    if(visible.length)activate(Number(visible[0].target.dataset.story));
  },{rootMargin:"-22% 0px -37% 0px",threshold:[0,0.3,0.7]});
  chapter.forEach(el=>ob.observe(el));
}
function initLab(){
  const lab=$("#lab");
  if(!lab)return;
  const labImage=$(".lab-image img",lab);
  function activate(i){
    const a=g.advantages[i];if(!a)return;
    set("labNum",a.num);
    set("labTitle",a.title);
    set("labDescription",a.desc);
    if(labImage){setImage(labImage,a.img,a.title);}
    $$("[data-lab]",lab).forEach(b=>{
      const active=Number(b.dataset.lab)===i;
      b.classList.toggle("active",active);
      b.setAttribute("aria-pressed",String(active));
    });
  }
  $$("[data-lab]",lab).forEach(b=>b.addEventListener("click",()=>activate(Number(b.dataset.lab))));
}
function initAtlas(){
  const list=$(".atlas-model-list");
  if(!list)return;
  let current=g.models.find(m=>m.id==="SAT-500")||g.models[0];
  const stage=$("#atlasStage")||$(".atlas-stage");
  const stageImg=$(".atlas-stage-img img");
  const link=$("#atlasLink");
  function select(id){
    const m=g.models.find(x=>x.id===id);if(!m)return;
    current=m;
    $$("[data-model]",list).forEach(b=>{
      const active=b.dataset.model===m.id;
      b.classList.toggle("is-active",active);
      b.setAttribute("aria-pressed",String(active));
    });
    set("atlasLabel",m.type.toUpperCase());
    set("atlasBackdrop",m.id);
    set("atlasTitle",m.id);
    set("atlasDesc",m.description);
    set("atlasVolume",m.volume);
    set("atlasUnload",m.unload);
    setImage(stageImg,m.image,m.id+" — визуализация полуприцепа");
    if(link)link.href=g.modelRoute(m);
    stage?.classList.remove("is-changing");
    void stage?.offsetWidth;
    stage?.classList.add("is-changing");
  }
  $$("[data-model]",list).forEach(b=>{
    b.addEventListener("click",()=>select(b.dataset.model));
    b.addEventListener("mouseenter",()=>{if(matchMedia("(hover:hover)").matches)select(b.dataset.model)});
  });
  $$("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>{
    const type=btn.dataset.filter;
    $$("[data-filter]").forEach(b=>{
      const active=b===btn;b.classList.toggle("active",active);b.setAttribute("aria-pressed",String(active));
    });
    $$("[data-model]",list).forEach(b=>{
      b.hidden=type!=="all"&&b.dataset.group!==type;
    });
    const first=$('[data-model]:not([hidden])',list);
    if(first&&current.group!==type&&type!=="all" || first&&$('[data-model].is-active[hidden]',list))select(first.dataset.model);
  }));
  const type=g.search.get("type");
  if(type)$('[data-filter="'+type+'"]')?.click();
  select(current.id);
  const compare=$("#compareAction");
  compare?.addEventListener("click",()=>{
    const a=g.models.find(m=>m.id===$("#compareA")?.value);
    const b=g.models.find(m=>m.id===$("#compareB")?.value);
    const out=$("#compareResult");
    if(!out)return;
    if(!a||!b){out.textContent="Выберите две модели.";return}
    if(a===b){out.textContent="Выберите две разные модели.";return}
    out.innerHTML='<table><thead><tr><th>ПАРАМЕТР</th><th>'+a.id+'</th><th>'+b.id+'</th></tr></thead>'+
      '<tbody><tr><th>НАЗНАЧЕНИЕ</th><td>'+a.use+'</td><td>'+b.use+'</td></tr>'+
      '<tr><th>ОСНОВНОЙ ПОКАЗАТЕЛЬ</th><td>'+a.volume+'</td><td>'+b.volume+'</td></tr>'+
      '<tr><th>РАЗГРУЗКА</th><td>'+a.unload+'</td><td>'+b.unload+'</td></tr></tbody></table>';
  });
}
function initTechnology(){
  const choice=$(".tech-choice-list");
  if(!choice)return;
  const img=$(".tech-choice-photo img");
  function activate(i){
    const a=g.advantages[i];if(!a)return;
    set("techCurrentNum","ПРИНЦИП / "+a.num);
    set("techCurrentTitle",a.title);
    set("techCurrentText",a.desc);
    setImage(img,a.img,a.title);
    $$("[data-tech]",choice).forEach(el=>{
      const active=Number(el.dataset.tech)===i;
      el.classList.toggle("is-active",active);
      el.setAttribute("aria-pressed",String(active));
    });
  }
  $$("[data-tech]",choice).forEach(el=>el.addEventListener("click",()=>activate(Number(el.dataset.tech))));
}
function initForm(){
  const form=$("#goldForm");
  if(!form)return;
  let body="";
  form.addEventListener("submit",e=>{
    e.preventDefault();if(!form.reportValidity())return;
    const formData=new FormData(form);
    body=[
      "ЗАПРОС НА ДЕМОНСТРАЦИЮ / ZUBR TRAIL",
      "Имя: "+formData.get("name"),
      "Телефон: "+formData.get("phone"),
      "Модель: "+formData.get("model"),
      "Компания: "+(formData.get("company")||"не указана"),
      "Задача: "+(formData.get("task")||"не указана")
    ].join("\n");
    set("formFeedback","Заявка сформирована. Проверьте письмо и подтвердите отправку в почтовой программе.");
    $("#copyRequest").hidden=false;
    location.href="mailto:info@satpricep.by?subject="+encodeURIComponent("ZUBR TRAIL — демонстрация "+formData.get("model"))+"&body="+encodeURIComponent(body);
  });
  $("#copyRequest")?.addEventListener("click",async()=>{
    try{await navigator.clipboard.writeText(body);set("formFeedback","Текст заявки скопирован.")}
    catch(e){set("formFeedback",body)}
  });
}
function initImageFallback(){
  document.addEventListener("error",e=>{
    const img=e.target;
    if(img?.tagName==="IMG"&&img.dataset.fallback&&img.src!==new URL(img.dataset.fallback,location.href).href){
      img.src=img.dataset.fallback;delete img.dataset.fallback;
    }
  },true);
}
initImageFallback();
document.addEventListener("gold:rendered",()=>{
  initTheme();initMenu();initNavigation();initScroll();initHero();initRail();
  initStory();initLab();initAtlas();initTechnology();initForm();
});
})();