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
    const observer=new IntersectionObserver(entries=>{
      for(const e of entries)if(e.isIntersecting){
        e.target.classList.add("power-in");
        observer.unobserve(e.target);
      }
    },{threshold:.08,rootMargin:"0px 0px -22px 0px"});
    observed.forEach(element=>{
      const siblings=$$(element.tagName.toLowerCase(),element.parentElement);
      const idx=Math.max(0,siblings.indexOf(element));
      element.style.setProperty("--enter-delay",Math.min(4,idx)*70+"ms");
      element.classList.add("power-reveal");
      observer.observe(element);
    });
  }

  // Preserve navigation behavior, external links, forms, deep links and accessibility.
  if(!reduced){
    document.addEventListener("click",event=>{
      if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
      const link=event.target.closest("a[href]");
      if(!link||link.hasAttribute("download")||link.target==="_blank")return;
      let dest;try{dest=new URL(link.href,location.href)}catch(e){return}
      if(!["https:","http:"].includes(dest.protocol)||dest.origin!==location.origin)return;
      if(dest.href===location.href)return;
      if(dest.pathname===location.pathname&&dest.search===location.search)return;
      event.preventDefault();
      if(document.documentElement.classList.contains("power-leaving"))return;
      document.documentElement.classList.add("power-leaving");
      setTimeout(()=>location.assign(dest.href),235);
    });
  }
})();