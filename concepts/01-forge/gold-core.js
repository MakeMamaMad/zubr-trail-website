(function buildGoldCore(){
  "use strict";
  const data=window.ZUBR_DATA;
  const models=data.models, articles=data.articles, advantages=data.advantages;
  const path="../";
  const esc=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
  const asset=f=>"../../assets/colorways/gold/"+f.replace(/\.(webp|jpg|jpeg|png)$/i,".webp");
  const original=f=>"../../assets/"+f;
  const photo=(f,alt,cls="",eager=false)=>'<img src="'+asset(f)+'" data-fallback="'+original(f)+'" alt="'+esc(alt)+'" class="'+cls+'" '+(eager?'fetchpriority="high" decoding="async"':'loading="lazy" decoding="async"')+'>';
  const modelRoute=m=>"model.html?id="+encodeURIComponent(m.id);
  const articleRoute=a=>"article.html?slug="+encodeURIComponent(a.slug);
  const button=(label,href,variant="solid")=>'<a class="gold-button gold-button--'+variant+'" href="'+href+'"><span>'+label+'</span><span class="gold-button-icon" aria-hidden="true">↗</span></a>';
  const nav=[
    ["Главная","index.html","01"],
    ["Модельный ряд","catalog.html","02"],
    ["Технологии","technology.html","03"],
    ["Производство","production.html","04"],
    ["Тест-драйв","test-drive.html","05"],
    ["Материалы","news.html","06"],
    ["Контакты","contacts.html","07"]
  ];
  const pageTitles={home:"Главная",catalog:"Модельный ряд",model:"Модель",technology:"Технологии и преимущества",production:"Производство","test-drive":"Тест-драйв",news:"Материалы",article:"Материал",contacts:"Контакты"};
  const page=document.body.dataset.page||"home";
  const search=new URLSearchParams(location.search);
  const selected=models.find(m=>m.id===search.get("id"))||models[2];
  const article=articles.find(a=>a.slug===search.get("slug"))||articles[0];
  const brand='<a href="index.html" class="brand-mark" aria-label="ZUBR TRAIL — главная">'+
    '<span class="brand-mark-symbol"><img src="../../assets/logo.svg" alt=""></span>'+
    '<span class="brand-mark-text"><b>ZUBR</b><em>TRAIL</em></span></a>';
  const header=()=>'<header class="site-header" id="siteHeader"><div class="head-left">'+brand+
    '<span class="head-divider"></span><span class="head-caption">СОВРЕМЕННЫЕ ПОЛУПРИЦЕПЫ</span></div>'+
    '<div class="head-right"><a href="catalog.html" class="head-catalog">МОДЕЛЬНЫЙ РЯД <span>↗</span></a>'+
    '<button type="button" class="theme-switch" id="themeButton" aria-label="Переключить светлую и тёмную тему" title="Сменить тему"><span>◑</span></button>'+
    '<button type="button" class="menu-trigger" id="menuTrigger" aria-haspopup="dialog" aria-controls="siteMenu" aria-expanded="false"><span class="menu-trigger-label">МЕНЮ</span><span class="menu-lines"><i></i><i></i></span></button></div></header>';
  const menu=()=>'<div class="menu-screen" id="siteMenu" hidden role="dialog" aria-modal="true" aria-label="Навигация по сайту">'+
    '<div class="menu-screen-inner"><div class="menu-overline"><span>НАВИГАЦИЯ / ZUBR TRAIL</span><span>ВЫБЕРИТЕ НАПРАВЛЕНИЕ</span></div>'+
    '<nav class="menu-big" aria-label="Основные разделы">'+
    nav.map(n=>'<a class="menu-big-link'+(n[0]===pageTitles[page]?' is-current':'')+'" href="'+n[1]+'">'+
    '<small>'+n[2]+'</small><span>'+n[0]+'</span><b aria-hidden="true">↗</b></a>').join("")+'</nav>'+
    '<div class="menu-bottom"><div><b>ЗАДАЧА ЕСТЬ. РЕШЕНИЕ НАЙДЁМ.</b><span>Современные полуприцепы для ваших задач</span></div>'+
    '<a href="test-drive.html">ЗАПИСАТЬСЯ НА ТЕСТ-ДРАЙВ ↗</a></div></div></div>';
  const footer=()=>'<footer class="site-footer"><div class="footer-cta">'+
    '<div class="footer-cta-label"><span class="section-index">СЛЕДУЮЩИЙ ШАГ / 07</span><span class="footer-orbit" aria-hidden="true">↗</span></div>'+
    '<h2>ОСТАЛОСЬ<br><em>ВЫБРАТЬ ПУТЬ.</em></h2>'+
    '<div class="footer-cta-bottom"><p>Современные полуприцепы для ваших задач. Начнём с вашего груза, маршрута и условий работы.</p>'+
    button("Обсудить проект","contacts.html")+'</div></div>'+
    '<div class="footer-nav">'+brand+
    '<nav aria-label="Навигация внизу страницы">'+nav.map(n=>'<a href="'+n[1]+'">'+n[0]+'</a>').join("")+'</nav></div>'+
    '<div class="footer-legal"><span>© ZUBR TRAIL · '+new Date().getFullYear()+'</span>'+
    '<span>Изображения — визуализации. Характеристики зависят от исполнения.</span>'+
    '<a href="https://github.com/MakeMamaMad/zubr-trail-website" target="_blank" rel="noopener noreferrer">КОД ПРОЕКТА ↗</a></div></footer>';
  const chapterLabel=(n,label)=>'<div class="chapter-label"><span>'+n+'</span><b>'+label+'</b><i aria-hidden="true"></i></div>';
  function render(){
    const entry=window.GOLD_PAGES&&window.GOLD_PAGES[page];
    if(!entry){document.getElementById("app").textContent="Страница временно недоступна.";return}
    document.title=(page==="model"?selected.id:page==="article"?article.title:pageTitles[page])+" — ZUBR GOLD | ZUBR TRAIL";
    document.getElementById("app").innerHTML=
      '<div class="gold-app">'+
      '<div class="progress-track" aria-hidden="true"><div class="progress-fill" id="scrollProgress"></div></div>'+
      header()+menu()+
      '<div class="page-curtain" id="pageCurtain" aria-hidden="true"><div class="curtain-first"></div><div class="curtain-second"></div><span>ZUBR <b>TRAIL</b></span></div>'+
      '<main id="content">'+entry()+'</main>'+footer()+
      '<a class="floating-contact" href="test-drive.html" aria-label="Записаться на тест-драйв"><span aria-hidden="true">↗</span><small>ТЕСТ-ДРАЙВ</small></a>'+
      '</div>';
    document.dispatchEvent(new Event("gold:rendered"));
  }
  window.GOLD={data,models,articles,advantages,page,search,selected,article,esc,asset,photo,original,modelRoute,articleRoute,button,chapterLabel,nav};
  document.addEventListener("DOMContentLoaded",render);
})();