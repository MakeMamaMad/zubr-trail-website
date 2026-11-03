/* ZUBR POWER Motion Edition — progressive enhancement only. */
(() => {
  "use strict";
  const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches||
    Boolean(navigator.connection && navigator.connection.saveData);
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  if(!$("#main")||!$(".header"))return;
  document.documentElement.classList.add("power-enhanced");
  if(!reduced)document.documentElement.classList.add("power-motion");

  // Scroll progress and contextual header (one paint per animation frame).
  const bar=document.createElement("div");bar.className="power-progress";bar.setAttribute("aria-hidden","true");
  bar.innerHTML='<div class="power-progress-bar"></div>';
  document.body.prepend(bar);
  const progress=$(".power-progress-bar");
  let scheduled=false;
  function paintScroll(){
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    progress.style.transform="scaleX("+Math.max(0,Math.min(1,scrollY/max)).toFixed(4)+")";
    $(".header").classList.toggle("power-scrolled",scrollY>25);
    scheduled=false;
  }
  function requestPaint(){if(!scheduled){scheduled=true;requestAnimationFrame(paintScroll)}}
  addEventListener("scroll",requestPaint,{passive:true});
  addEventListener("resize",requestPaint,{passive:true});
  paintScroll();

  const hero=$(".hero");
  if(hero){
    const headline=$(".hero h1");
    if(headline&&!reduced){
      const lines=headline.innerHTML.split(/<br\s*\/?>/i);
      if(lines.length>1)headline.innerHTML=lines.map((line,i)=>
        '<span class="power-headline-line"><span class="power-headline-inner" style="--line-i:'+i+'">'+line+'</span></span>').join("");
    }
    const cue=document.createElement("div");cue.className="power-scroll-cue";
    cue.setAttribute("aria-hidden","true");
    cue.innerHTML='<span>ЛИСТАЙТЕ ВНИЗ</span><span class="power-scroll-icon"></span>';
    hero.append(cue);
    // Purposeful moving product line. Two identical halves create a seamless loop.
    const banner=document.createElement("div");banner.className="power-ticker";
    banner.setAttribute("aria-hidden","true");
    const phrases=['ZUBR TRAIL','ДВИЖЕНИЕ В КАЖДОЙ ДЕТАЛИ','СОЗДАНО ДЛЯ РАБОТЫ','ИНЖЕНЕРИЯ ПЕРЕВОЗОК'];
    const sequence=phrases.map(x=>'<span>'+x+'</span><i>◆</i>').join("");
    banner.innerHTML='<div class="power-ticker-track">'+sequence+sequence+'</div>';
    hero.insertAdjacentElement("afterend",banner);
    if(!reduced&&window.matchMedia("(pointer:fine)").matches){
      let heroFrame=false,dx=0,dy=0;
      hero.addEventListener("pointermove",event=>{
        if(event.pointerType==="touch")return;
        const r=hero.getBoundingClientRect();
        dx=((event.clientX-r.left)/r.width-.5)*13;
        dy=((event.clientY-r.top)/r.height-.5)*9;
        if(heroFrame)return;
        heroFrame=true;
        requestAnimationFrame(()=>{
          hero.style.setProperty("--hero-x",dx.toFixed(1)+"px");
          hero.style.setProperty("--hero-y",dy.toFixed(1)+"px");
          heroFrame=false;
        });
      },{passive:true});
      hero.addEventListener("pointerleave",()=>{
        hero.style.setProperty("--hero-x","0px");hero.style.setProperty("--hero-y","0px");
      });
    }
  }

  // On-scroll reveals are unobtrusive and never applied without an observer.
  const revealSelectors=[
    ".section-heading",".model-card",".benefit",".tech-intro",
    ".production-card",".scenic",".news-card",".cta-band-grid",
    ".inner-hero-content",".detail-grid",".stat-row>div",".timeline>div",
    ".contact-card",".form-panel",".split-content",".three-cards>article",
    ".article-prose>p",".spec-card",".steps>div"
  ];
  if(!reduced&&"IntersectionObserver" in window){
    const observed=$$(revealSelectors.join(","));
    // Scope hiding to animated browsers. On unsupported browsers all content remains visible.
    // Repeat every time an element returns into view. Reset only after it has
    // completely left the viewport so small scroll movements do not flicker.
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(entry.isIntersecting && entry.intersectionRatio >= .035){
          entry.target.classList.add("power-in");
        }else if(!entry.isIntersecting){
          entry.target.classList.remove("power-in");
        }
      }
    },{threshold:[0,.035,.12],rootMargin:"0px 0px -30px 0px"});
    observed.forEach(element=>{
      const siblings=$$(element.tagName.toLowerCase(),element.parentElement);
      const idx=Math.max(0,siblings.indexOf(element));
      element.style.setProperty("--enter-delay",Math.min(4,idx)*70+"ms");
      element.classList.add("power-reveal");
      observer.observe(element);
    });
  }

  // Re-run the hero headline and entrance details whenever the first screen
  // comes back into view, including after the browser restores a cached page.
  function restartHero(){
    if(!hero||reduced)return;
    const items=$$(".power-headline-inner, .hero .eyebrow, .hero-inner>p, .hero-actions, .hero-facts",hero);
    items.forEach(el=>el.style.setProperty("animation","none"));
    void hero.offsetWidth;
    items.forEach(el=>el.style.removeProperty("animation"));
  }
  if(hero&&!reduced&&"IntersectionObserver" in window){
    let seen=false,visible=false;
    const heroObserver=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(entry.isIntersecting&&!visible){
          if(seen)restartHero();
          seen=true;visible=true;
        }else if(!entry.isIntersecting){
          visible=false;
        }
      }
    },{threshold:0,rootMargin:"0px 0px -12% 0px"});
    heroObserver.observe(hero);
  }

  // Real two-stage cross-document page wipe:
  // 1. The exiting page is covered, then the browser navigates.
  // 2. A session marker lets the next document reveal itself through the same
  //    brand-colour wipe. The marker is consumed once to avoid reload loops.
  const transitionKey="zubr-power-transition-path";
  const html=document.documentElement;
  const overlay=$(".power-page-wipe");
  const powerPages=new Set([
    "index.html","models.html","model.html","technology.html","production.html",
    "test-drive.html","news.html","article.html","contacts.html"
  ]);
  const powerBase=new URL("index.html",location.href).pathname.replace(/index\.html$/,"");
  let destinationTimer=0;
  function clearTransition(){
    html.classList.remove("power-leaving","power-entering","power-arrived");
    if(destinationTimer)clearTimeout(destinationTimer);
    destinationTimer=0;
  }
  if(!reduced&&html.classList.contains("power-entering")&&overlay){
    try{sessionStorage.removeItem(transitionKey)}catch(e){}
    html.dataset.powerNavigation="arrived";
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      html.classList.add("power-arrived");
      destinationTimer=setTimeout(clearTransition,850);
    }));
  }else{
    html.classList.remove("power-entering","power-arrived");
    try{
      if(sessionStorage.getItem(transitionKey)===location.pathname)sessionStorage.removeItem(transitionKey);
    }catch(e){}
  }

  if(!reduced&&overlay){
    document.addEventListener("click",event=>{
      if(event.defaultPrevented||event.button!==0||
         event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const link=event.target.closest("a[href]");
      if(!link||link.hasAttribute("download")||
         link.getAttribute("target")&&link.getAttribute("target")!=="_self")return;
      let dest;try{dest=new URL(link.href,location.href)}catch(e){return}
      if(!["https:","http:"].includes(dest.protocol)||dest.origin!==location.origin)return;
      if(!dest.pathname.startsWith(powerBase))return;
      const filename=dest.pathname.substring(powerBase.length);
      if(!powerPages.has(filename))return;
      if(dest.pathname===location.pathname&&dest.search===location.search&&dest.hash)return;
      // Do not hijack same-page anchor navigation, downloads or modifier clicks.
      event.preventDefault();
      if(html.classList.contains("power-leaving"))return;
      if(destinationTimer)clearTimeout(destinationTimer);
      html.classList.remove("power-entering","power-arrived");
      html.classList.add("power-leaving");
      html.dataset.powerNavigation="leaving";
      try{sessionStorage.setItem(transitionKey,dest.pathname)}catch(e){}
      destinationTimer=setTimeout(()=>location.assign(dest.href),570);
    });
  }

  // bfcache: a document restored by Back/Forward must not remain covered by
  // its outgoing page animation; the hero and section reveals remain reusable.
  addEventListener("pageshow",event=>{
    if(!event.persisted)return;
    clearTransition();
    try{sessionStorage.removeItem(transitionKey)}catch(e){}
    restartHero();
    requestPaint();
  });
})();
