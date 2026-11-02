(function core(){
  const data=window.ZUBR_DATA;
  const asset=n=>{const design=document.body.dataset.design;const color=design==="forge"?"gold":design==="pulse"?"lime":null;return color&&/\.(?:webp|jpg)$/.test(n)?"../../assets/colorways/"+color+"/"+n.replace(/\.(?:webp|jpg)$/,".webp"):"../../assets/"+n};
  const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const img=(file,alt,cl="")=>'<img class="'+cl+'" src="'+asset(file)+'" data-fallback="../../assets/'+file+'" alt="'+esc(alt)+'" loading="lazy">';
  const btn=(s,url,kind="")=>'<a class="btn '+kind+'" href="'+url+'">'+s+' <span>↗</span></a>';
  const routeModel=m=>"model.html?id="+m.id;
  const nav=[["Главная","index.html"],["Каталог","catalog.html"],["Технологии","technology.html"],["Производство","production.html"],["Тест-драйв","test-drive.html"],["Журнал","news.html"],["Контакты","contacts.html"]];
  const links=()=>nav.map((n,i)=>'<a href="'+n[1]+'"><i>'+String(i+1).padStart(2,"0")+'</i><span>'+n[0]+'</span></a>').join("");
  const logo=()=>'<a class="logo" href="index.html">'+img("logo.svg","")+'<strong>ZUBR <em>TRAIL</em></strong></a>';
  const cfg={forge:"01 / FORGE",pure:"02 / ATELIER",terrain:"03 / TERRAIN",pulse:"04 / VECTOR"};
  function header(design){
    const contents=logo()+'<nav id="nav" class="nav">'+links()+'</nav><div class="nav-right"><span class="edition">'+cfg[design]+'</span><button class="theme-button" id="themeButton" aria-label="Переключить тему">☀ / ☾</button><button class="mobile-toggle" id="menuButton" aria-label="Открыть меню" aria-expanded="false">☰</button></div>';
    return design==="pure"?'<aside class="side-navigation">'+contents+'</aside><header class="mobile-bar">'+logo()+'<button class="mobile-toggle" id="mobileMenu" aria-label="Открыть меню" aria-expanded="false">☰</button></header>':'<header class="main-navigation">'+contents+'</header>';
  }
  function footer(design){return '<footer class="footer"><div class="footer-main">'+logo()+'<div><strong>Современные полуприцепы для ваших задач</strong><p>Каталог · Технологии · Тест-драйв · Контакты</p></div>'+btn("Обратная связь","contacts.html")+'</div><div class="footer-note"><span>ZUBR TRAIL © '+new Date().getFullYear()+'</span><span>Дизайн '+cfg[design]+' / Отдельная концепция</span><span>Изображения — визуализации, характеристики зависят от исполнения</span></div></footer>'}
  const parts={
    modelCard:m=>'<article class="product" data-group="'+m.group+'"><a class="product-photo" href="'+routeModel(m)+'">'+img(m.image,m.id+" — визуализация")+'</a><div class="product-info"><span class="micro">'+m.type+'</span><h3>'+m.id+'</h3><p>'+m.description+'</p><div class="product-metrics"><b>'+m.volume+'</b><span>'+m.unload+'</span></div>'+btn("Подробнее",routeModel(m),"light")+'</div></article>',
    filter:()=>'<div class="filterbar"><button type="button" class="active" data-filter="all">Все модели</button><button type="button" data-filter="grain">Зерновозы</button><button type="button" data-filter="floor">Подвижный пол</button><button type="button" data-filter="dump">Самосвальные</button><button type="button" data-filter="special">Специальные</button></div>',
    modelSpecs:m=>'<table class="specs"><tbody>'+m.facts.map(x=>'<tr><th scope="row">'+x[0]+'</th><td>'+x[1]+'</td></tr>').join("")+'</tbody></table>',
    cards:models=>'<div class="products">'+models.map(parts.modelCard).join("")+'</div>',
    articles:()=>'<div class="articles">'+data.articles.map((a,i)=>'<article class="article-card"><a href="article.html?slug='+a.slug+'">'+img(a.img,a.title)+'</a><div><small>'+a.category+' / '+String(i+1).padStart(2,"0")+'</small><h3><a href="article.html?slug='+a.slug+'">'+a.title+'</a></h3><p>'+a.text+'</p>'+btn("Читать","article.html?slug="+a.slug,"light")+'</div></article>').join("")+'</div>',
    form:()=>'<form class="drive-form" id="driveForm"><label>Имя *<input name="name" required autocomplete="name" maxlength="80" placeholder="Ваше имя"></label><label>Телефон *<input name="phone" type="tel" required autocomplete="tel" maxlength="50" placeholder="+375 ..."></label><label>Модель *<select name="model" required><option value="">Выберите модель</option>'+data.models.map(m=>'<option value="'+m.id+'">'+m.id+'</option>').join("")+'</select></label><label>Компания<input name="company" maxlength="100" placeholder="Необязательно"></label><label class="wide">Комментарий<textarea name="task" rows="4" placeholder="Тип груза и задача"></textarea></label><label class="wide legal"><input type="checkbox" required> Согласен подготовить письмо с указанными данными для отправки через мою почтовую программу.</label><button class="btn wide" type="submit">ПОДГОТОВИТЬ ЗАЯВКУ ↗</button><p class="note wide">Данные не отправляются автоматически. Письмо нужно отправить самостоятельно.</p><div id="formFeedback" class="wide note" role="status"></div></form>',
    compare:()=>'<div class="compare"><div><small>COMPARE / MODEL SELECTION</small><h2>СРАВНИТЕ ДВЕ МОДЕЛИ</h2></div><div class="compare-inputs"><select id="modelLeft" aria-label="Первая модель">'+data.models.map(m=>'<option>'+m.id+'</option>').join("")+'</select><select id="modelRight" aria-label="Вторая модель">'+data.models.map((m,i)=>'<option '+(i===3?'selected':'')+'>'+m.id+'</option>').join("")+'</select><button id="compareButton">СРАВНИТЬ ↗</button></div><div class="compare-output" id="compareOutput"></div></div>',
    techTabs:()=>'<div class="tech-tabs">'+data.advantages.map((a,i)=>'<button type="button" data-adv="'+i+'" '+(i===0?'class="active"':'')+'><small>'+a.num+'</small><span>'+a.title+'</span></button>').join("")+'</div><div id="techOutput" class="tech-output"></div>'
  };
  window.ZUX={asset,img,esc,btn,logo,routeModel,models:data.models,articles:data.articles,advantages:data.advantages,parts,nav};
  function boot(){
    const design=document.body.dataset.design||"forge",page=document.body.dataset.page||"home";
    const variant=window.ZVARIANT;
    if(!variant){document.getElementById("app").textContent="Не удалось загрузить концепцию";return}
    const p=new URLSearchParams(location.search);
    const html=variant[page]?variant[page](p):variant.home(p);
    document.getElementById("app").innerHTML='<div class="site site-'+design+'">'+header(design)+'<main>'+html+'</main>'+footer(design)+'</div>';
    const key="zubr-v2-"+design;let initial=(design==="pure"||design==="pulse")?"light":"dark";try{initial=localStorage.getItem(key)||initial}catch(e){}
    function theme(v){document.documentElement.dataset.theme=v;document.getElementById("themeButton").setAttribute("aria-label",v==="dark"?"Включить светлую тему":"Включить тёмную тему")}
    theme(initial);
    document.getElementById("themeButton").addEventListener("click",()=>{let next=document.documentElement.dataset.theme==="dark"?"light":"dark";theme(next);try{localStorage.setItem(key,next)}catch(e){}});
    const menus=[document.getElementById("menuButton"),document.getElementById("mobileMenu")].filter(Boolean);
    menus.forEach(menu=>menu.addEventListener("click",()=>{const nav=document.getElementById("nav"),opened=nav.classList.toggle("open");menus.forEach(b=>b.setAttribute("aria-expanded",String(opened)))}));
    document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll("[data-group]").forEach(x=>{x.hidden=b.dataset.filter!=="all"&&b.dataset.filter!==x.dataset.group})}));
    const group=p.get("type");if(group)document.querySelector('[data-filter="'+group+'"]')?.click();
    document.getElementById("compareButton")?.addEventListener("click",()=>{
      let a=data.models.find(x=>x.id===document.getElementById("modelLeft").value),b=data.models.find(x=>x.id===document.getElementById("modelRight").value);
      const out=document.getElementById("compareOutput");if(a===b){out.textContent="Выберите разные модели";return}
      out.innerHTML='<table><tr><th>Параметр</th><th>'+a.id+'</th><th>'+b.id+'</th></tr><tr><th>Назначение</th><td>'+a.use+'</td><td>'+b.use+'</td></tr><tr><th>Показатель</th><td>'+a.volume+'</td><td>'+b.volume+'</td></tr><tr><th>Разгрузка</th><td>'+a.unload+'</td><td>'+b.unload+'</td></tr></table>';
    });
    function setAdv(i){const a=data.advantages[i];const out=document.getElementById("techOutput");if(!out)return;out.innerHTML='<div class="tech-img">'+img(a.img,a.title)+'</div><div class="tech-info"><small>'+a.num+' / '+a.name+'</small><h3>'+a.title+'</h3><p>'+a.desc+'</p>'+btn("Подобрать технику","catalog.html")+'</div>';document.querySelectorAll("[data-adv]").forEach(x=>x.classList.toggle("active",Number(x.dataset.adv)===i))}
    if(document.getElementById("techOutput")){setAdv(0);document.querySelectorAll("[data-adv]").forEach(b=>b.addEventListener("click",()=>setAdv(Number(b.dataset.adv))))}
    const form=document.getElementById("driveForm");if(form){form.querySelector('[name="model"]').value=p.get("model")||"";form.addEventListener("submit",e=>{e.preventDefault();if(!form.reportValidity())return;const x=new FormData(form);const lines=["Запрос ZUBR TRAIL","Имя: "+x.get("name"),"Телефон: "+x.get("phone"),"Модель: "+x.get("model"),"Компания: "+(x.get("company")||"—"),"Задача: "+(x.get("task")||"—")].join("\n");document.getElementById("formFeedback").textContent="Почтовая программа откроется с подготовленным письмом. Оно не отправлено автоматически.";location.href="mailto:info@satpricep.by?subject="+encodeURIComponent("ZUBR TRAIL — тест-драйв")+"&body="+encodeURIComponent(lines)})}
    const go=document.getElementById("heroSelectGo");if(go)go.addEventListener("click",()=>location.href="model.html?id="+document.getElementById("heroSelect").value);
  }
  document.addEventListener("error",e=>{const el=e.target;if(el&&el.tagName==="IMG"&&el.dataset.fallback&&el.getAttribute("src")!==el.dataset.fallback){el.src=el.dataset.fallback;}},true);
  document.addEventListener("DOMContentLoaded",boot);
})();