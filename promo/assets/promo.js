
/* ZUBR POWER / product promo experiences — dependency-free motion. */
(function(){
  'use strict';
  const doc=document.documentElement;
  const body=document.body;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches||
    !!(navigator.connection&&navigator.connection.saveData);
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const gate=$('.entry-gate');
  const splashKey='zubr-promo-destination';
  let leaving=false,scrollQueued=false;
  function progress(){
    scrollQueued=false;
    const height=Math.max(1,doc.scrollHeight-innerHeight);
    const bar=$('.progress>i');
    if(bar)bar.style.transform='scaleX('+Math.min(1,Math.max(0,scrollY/height)).toFixed(4)+')';
    $('.topbar')?.classList.toggle('scrolled',scrollY>38);
  }
  function onScroll(){if(!scrollQueued){scrollQueued=true;requestAnimationFrame(progress)}}
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',onScroll,{passive:true});
  progress();

  if(gate&&!reduced&&doc.classList.contains('promo-entering')){
    const internal=doc.dataset.entryType==='internal';
    try{sessionStorage.removeItem(splashKey)}catch(e){}
    setTimeout(()=>{
      doc.classList.add('promo-revealing');
      setTimeout(()=>doc.classList.remove('promo-entering','promo-revealing'),920);
    },internal?200:770);
  }else{
    doc.classList.remove('promo-entering','promo-revealing');
  }

  const menu=$('.menu-toggle'),nav=$('.main-nav');
  function setMenu(open){
    if(!menu||!nav)return;
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');
    menu.textContent=open?'×':'☰';
    nav.classList.toggle('is-open',open);
  }
  menu?.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
  document.addEventListener('click',e=>{
    if(nav&&menu&&nav.classList.contains('is-open')&&!nav.contains(e.target)&&!menu.contains(e.target))setMenu(false);
  });

  if(!reduced&&'IntersectionObserver' in window){
    doc.classList.add('js-motion');
    const elements=$$('.reveal');
    elements.forEach(el=>{
      const siblings=Array.from(el.parentElement?.children||[]).filter(e=>e.classList.contains('reveal'));
      const order=Math.max(0,siblings.indexOf(el));
      el.style.setProperty('--delay',Math.min(4,order)*78+'ms');
    });
    const observer=new IntersectionObserver(entries=>{
      for(const entry of entries){
        if(entry.isIntersecting&&entry.intersectionRatio>.025)entry.target.classList.add('is-visible');
        else if(!entry.isIntersecting)entry.target.classList.remove('is-visible');
      }
    },{threshold:[0,.025,.15],rootMargin:'0px 0px -22px 0px'});
    elements.forEach(el=>observer.observe(el));

    const counters=$$('[data-count]');
    const countObserver=new IntersectionObserver(entries=>{
      for(const entry of entries){
        const el=entry.target;
        if(entry.isIntersecting&&!el.dataset.running){
          const target=Number(el.dataset.count);
          if(!Number.isFinite(target)||target<0)continue;
          el.dataset.running='1';
          const start=performance.now();
          function tick(now){
            const t=Math.min(1,(now-start)/1150);
            const ease=1-Math.pow(1-t,3);
            el.textContent=String(Math.round(target*ease));
            if(t<1&&el.dataset.running)requestAnimationFrame(tick);
            else{el.textContent=String(target);el.dataset.running='';}
          }
          requestAnimationFrame(tick);
        }else if(!entry.isIntersecting&&entry.intersectionRatio===0){
          el.dataset.running='';
          el.textContent='0';
        }
      }
    },{threshold:[0,.3]});
    counters.forEach(el=>countObserver.observe(el));
  }

  // Page-specific tabs (text and imagery both change).
  $$('[data-tabs]').forEach(group=>{
    const buttons=$$('[role=tab]',group),panels=$$('[role=tabpanel]',group);
    function select(id,focus){
      buttons.forEach(b=>{
        const active=b.dataset.tab===id;
        b.setAttribute('aria-selected',String(active));
        b.tabIndex=active?0:-1;
        if(active&&focus)b.focus();
      });
      panels.forEach(p=>{
        const active=p.dataset.panel===id;
        p.classList.toggle('is-active',active);
        p.hidden=!active;
      });
    }
    buttons.forEach((button,i)=>{
      button.addEventListener('click',()=>select(button.dataset.tab,false));
      button.addEventListener('keydown',e=>{
        if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight'&&e.key!=='ArrowDown'&&e.key!=='ArrowUp')return;
        e.preventDefault();
        const delta=(e.key==='ArrowRight'||e.key==='ArrowDown')?1:-1;
        select(buttons[(i+delta+buttons.length)%buttons.length].dataset.tab,true);
      });
    });
  });

  // Product-volume selector is an editorial guide, not a configuration promise.
  const volButtons=$$('[data-volume]'),volDisplay=$('[data-volume-display]'),volCopy=$('[data-volume-caption]');
  const volumeDescriptions={
    '43':'43 м³ — ориентир для ряда исполнений SAT-500. Параметры зависят от согласованной комплектации.',
    '49':'49 м³ — исполнение из модельного диапазона SAT-500. Комплектацию уточняйте в отделе продаж.',
    '55':'55 м³ — верхняя граница для отдельных модификаций. Не является характеристикой всех версий.'
  };
  volButtons.forEach(b=>b.addEventListener('click',()=>{
    volButtons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    if(volDisplay)volDisplay.textContent=b.dataset.volume;
    if(volCopy)volCopy.textContent=volumeDescriptions[b.dataset.volume]||'Технические данные уточняются по комплектации.';
  }));

  // Illustrative moving-floor diagram: user-controlled, paused by default.
  const floor=$('.floor-sim'),floorToggle=$('[data-floor-toggle]');
  function setFloor(on){
    if(!floor||!floorToggle)return;
    floor.classList.toggle('is-running',on&&!reduced);
    floorToggle.setAttribute('aria-pressed',String(on&&!reduced));
    floorToggle.querySelector('[data-floor-label]').textContent=on&&!reduced?'Остановить схему':'Показать движение пола';
  }
  floorToggle?.addEventListener('click',()=>setFloor(!floor.classList.contains('is-running')));
  if(reduced&&floorToggle){floorToggle.disabled=true;floorToggle.title='Движение отключено настройками устройства'}
  if(floor&&'IntersectionObserver' in window){
    const stopObserver=new IntersectionObserver(entries=>{
      if(entries[0]&&!entries[0].isIntersecting)setFloor(false);
    },{threshold:0});
    stopObserver.observe(floor);
  }
  const cargoDescriptions={
    chips:'Щепа: возможность выгрузки без опрокидывания особенно полезна на площадках с ограничением по высоте.',
    peat:'Торф: систему разгрузки и конфигурацию кузова подбирают с учётом свойств груза.',
    pellets:'Пеллеты: условия перевозки, влагозащита и характеристики груза учитываются при подборе.',
    grain:'Зерно: применимость конкретного исполнения и способа выгрузки согласуйте с отделом продаж.'
  };
  const cargoButtons=$$('[data-cargo]'),cargoLabel=$('[data-cargo-description]');
  cargoButtons.forEach(b=>b.addEventListener('click',()=>{
    cargoButtons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    if(cargoLabel)cargoLabel.textContent=cargoDescriptions[b.dataset.cargo]||'';
  }));

  // Desktop image parallax is subtle; mobile and reduced-motion avoid it.
  if(!reduced&&matchMedia('(pointer:fine)').matches){
    $$('.parallax-stage').forEach(stage=>{
      let raf=0;
      stage.addEventListener('pointermove',e=>{
        if(raf)return;
        const r=stage.getBoundingClientRect();
        const x=((e.clientX-r.left)/r.width-.5)*11;
        const y=((e.clientY-r.top)/r.height-.5)*8;
        raf=requestAnimationFrame(()=>{
          stage.style.setProperty('--mx',x.toFixed(1)+'px');
          stage.style.setProperty('--my',y.toFixed(1)+'px');
          raf=0;
        });
      },{passive:true});
      stage.addEventListener('pointerleave',()=>{
        stage.style.setProperty('--mx','0px');
        stage.style.setProperty('--my','0px');
      });
    });
  }

  // Internal cross-product links use the same branded page wipe as POWER.
  // Hash anchors and the link back to the main POWER site keep native behavior.
  if(!reduced&&gate){
    document.addEventListener('click',e=>{
      if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.altKey||e.shiftKey)return;
      const a=e.target.closest('a[href]');
      if(!a||a.hasAttribute('download')||(a.target&&a.target!=='_self'))return;
      const u=new URL(a.href,location.href);
      if(u.origin!==location.origin||!/^https?:$/.test(u.protocol))return;
      if(u.pathname===location.pathname&&u.search===location.search){
        if(u.hash){setMenu(false);return}
        if(u.href===location.href)return;
      }
      if(!u.pathname.includes('/promo/'))return;
      e.preventDefault();
      if(leaving)return;
      leaving=true;
      doc.classList.add('promo-leaving');
      setMenu(false);
      try{sessionStorage.setItem(splashKey,u.pathname)}catch(err){}
      setTimeout(()=>location.assign(u.href),690);
    });
  }
  addEventListener('pageshow',e=>{
    if(e.persisted){
      leaving=false;
      doc.classList.remove('promo-leaving','promo-revealing','promo-entering');
      try{sessionStorage.removeItem(splashKey)}catch(err){}
      progress();
    }
  });
})();
