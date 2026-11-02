(function buildGoldPages(){
  const {models,articles,advantages,selected,article,photo,button,chapterLabel,modelRoute,articleRoute,esc}=window.GOLD;
  const slogan="Современные полуприцепы для ваших задач";
  const mediaNote='<span class="media-note">КОНЦЕПТУАЛЬНАЯ ВИЗУАЛИЗАЦИЯ</span>';
  const micro=(n,label)=>'<span class="micro-count">'+n+' <b>/</b> '+label+'</span>';
  const lead=(number,eyebrow,h1,p,photoFile)=>'<section class="interior-hero">'+
    '<div class="interior-hero-visual">'+photo(photoFile,h1,"",true)+'</div>'+
    '<div class="interior-hero-body">'+micro(number,eyebrow)+'<h1 class="giant-title" data-reveal>'+h1+'</h1>'+
    '<p data-reveal>'+p+'</p></div><span class="interior-chapter">ZUBR / '+number+'</span></section>';
  const specList=m=>'<div class="spec-list">'+m.facts.map((pair,i)=>
    '<div class="spec-line"><span>'+String(i+1).padStart(2,"0")+' / '+esc(pair[0])+'</span><b>'+esc(pair[1])+'</b></div>').join("")+'</div>';
  const spot=(a,i)=>'<button type="button" class="lab-dot lab-dot-'+(i+1)+(i===0?' active':'')+'" data-lab="'+i+'" aria-label="Показать: '+a.title+'" aria-pressed="'+(i===0)+'"><span>'+String(i+1).padStart(2,"0")+'</span></button>';
  const lab=()=>'<section class="lab-section" id="lab">'+
    '<div class="lab-heading" data-reveal>'+chapterLabel("04","ИНЖЕНЕРНЫЙ КОД")+
    '<h2>НЕЗАМЕТНОЕ<br><em>РЕШАЕТ ВСЁ.</em></h2><p>Исследуйте конструктивные особенности. Нажимайте на метки — технические решения раскрываются прямо на изображении.</p></div>'+
    '<div class="lab-layout"><div class="lab-image">'+photo("sat-500.webp","Кузов алюминиевого полуприцепа SAT-500")+
    '<div class="lab-scanlines" aria-hidden="true"></div>'+
    '<span class="lab-coordinate">ZB / ENGINEERING SCAN — 04</span>'+
    advantages.map(spot).join("")+'</div>'+
    '<aside class="lab-panel"><span class="panel-overline">ТЕХНОЛОГИИ / 01—04</span>'+
    '<div class="lab-panel-num" id="labNum">01</div><h3 id="labTitle">'+advantages[0].title+'</h3>'+
    '<p id="labDescription">'+advantages[0].desc+'</p>'+
    '<div class="lab-pills">'+advantages.map((a,i)=>'<button type="button" class="lab-switch'+(i===0?' active':'')+'" data-lab="'+i+'" aria-pressed="'+(i===0)+'">'+a.name+'</button>').join("")+'</div>'+
    button("Технологии и преимущества","technology.html","outline")+
    '</aside></div></section>';
  function home(){
    return '<section class="hero-cinema" id="start"><div class="hero-backdrop">'+photo("road.webp","Транспортный маршрут с полуприцепом ZUBR TRAIL","",true)+'</div>'+
    '<div class="hero-grid-anim" aria-hidden="true"></div><div class="hero-noise" aria-hidden="true"></div>'+
    '<div class="hero-giant" aria-hidden="true">ZUBR</div>'+
    '<div class="hero-upper"><span>01 / ЭПОХА НОВЫХ РЕШЕНИЙ</span><span>СОЗДАНО ДЛЯ НАГРУЗОК</span></div>'+
    '<div class="hero-type"><span class="hero-kicker" data-reveal>ТЕХНИКА, КОТОРАЯ РАБОТАЕТ НА ВАС</span>'+
    '<h1><span>ДВИЖЕНИЕ —</span><span>НАШ <em>ХАРАКТЕР.</em></span></h1>'+
    '<p>'+slogan+'</p>'+
    '<div class="hero-cta">'+button("Изучить модели","catalog.html")+button("Тест-драйв","test-drive.html","outline")+'</div></div>'+
    '<div class="hero-object" id="heroObject">'+
    '<div class="hero-object-halo" aria-hidden="true"></div>'+
    photo("sat-500.webp","Алюминиевый самосвальный полуприцеп ZUBR TRAIL SAT-500","hero-product-photo",true)+
    '<div class="hero-image-label">SAT-500 <span>ВИЗУАЛИЗАЦИЯ ТЕХНИКИ</span></div></div>'+
    '<div class="hero-bottom"><span>ПРОЛИСТАЙТЕ, ЧТОБЫ ИССЛЕДОВАТЬ <b aria-hidden="true">↓</b></span><span>BY ZUBR TRAIL · ENGINEERED FOR THE ROAD</span></div>'+
    '</section>'+
    '<div class="kinetic-band" aria-hidden="true"><div class="kinetic-band-track">ZUBR TRAIL <span>✳</span> ДВИЖЕНИЕ В КАЖДОЙ ДЕТАЛИ <span>✳</span> '+
    'ZUBR TRAIL <span>✳</span> ДВИЖЕНИЕ В КАЖДОЙ ДЕТАЛИ <span>✳</span></div></div>'+
    '<section class="statement-section"><div class="statement-meta" data-reveal>'+chapterLabel("02","НЕ ПУСТЫЕ ОБЕЩАНИЯ")+
    '<p>Наш принцип</p></div><div class="statement-copy"><h2 data-reveal>ЗАДАЧА.<br><span>РАСЧЁТ.</span><br>РЕЗУЛЬТАТ.</h2>'+
    '<div class="statement-bottom" data-reveal><p>Техника подбирается под тип груза, маршруты и способ выгрузки. Важны не только цифры, но и то, как полуприцеп ведёт себя в работе.</p>'+
    button("Понять преимущества","technology.html","dark")+'</div></div></section>'+
    '<section class="lineup-section" id="lineup">'+
    '<div class="lineup-heading" data-reveal>'+chapterLabel("03","МОДЕЛЬНЫЙ РЯД")+
    '<div><h2>ШЕСТЬ ХАРАКТЕРОВ.<br><em>ВАША ЗАДАЧА.</em></h2><p>Выбирайте модель, пролистывая технику как инженерный каталог будущего.</p></div>'+
    '<div class="lineup-nav"><button type="button" data-rail-dir="-1" aria-label="Предыдущие модели">←</button>'+
    '<button type="button" data-rail-dir="1" aria-label="Следующие модели">→</button></div></div>'+
    '<div class="model-rail" id="modelRail" tabindex="0" role="region" aria-label="Прокручиваемый модельный ряд">'+
    models.map((m,i)=>'<article class="rail-card" data-reveal>'+
    '<div class="rail-card-top"><span>МОДЕЛЬ / '+String(i+1).padStart(2,"0")+'</span><span>'+m.type+'</span></div>'+
    '<div class="rail-card-name" aria-hidden="true">'+m.id+'</div>'+
    '<div class="rail-image">'+photo(m.image,m.id+" — визуализация полуприцепа")+'</div>'+
    '<div class="rail-card-bottom"><div><b>'+m.id+'</b><span>'+m.volume+' · '+m.unload+'</span></div>'+
    '<a href="'+modelRoute(m)+'" aria-label="Открыть '+m.id+'">↗</a></div></article>').join("")+
    '</div><div class="lineup-foot"><span>01 — 06 / ПЕРЕЛИСТЫВАЙТЕ МОДЕЛИ</span>'+
    '<div class="rail-progress" aria-hidden="true"><div id="railProgress"></div></div>'+
    button("Весь модельный ряд","catalog.html","outline")+'</div></section>'+
    '<section class="story-section" id="story"><div class="story-head" data-reveal>'+
    chapterLabel("04","КАК УСТРОЕНА НАДЁЖНОСТЬ")+
    '<h2>ВНУТРИ<br><em>КАЖДОГО РЕШЕНИЯ.</em></h2></div>'+
    '<div class="story-grid"><div class="story-stage"><div class="story-stage-image" id="storyStageImage">'+photo(advantages[0].img,advantages[0].title)+'</div>'+
    '<div class="story-stage-overlay" aria-hidden="true"><span>TECH</span><b id="storyStageNum">01 / 04</b></div>'+
    '</div><div class="story-chapters">'+advantages.map((a,i)=>
    '<article class="story-chapter" data-story="'+i+'" data-reveal><span>'+a.num+' — '+a.name.toUpperCase()+'</span>'+
    '<h3>'+a.title+'</h3><p>'+a.desc+'</p><div class="story-chapter-line"></div></article>').join("")+
    '</div></div></section>'+lab()+
    '<section class="process-teaser"><div class="process-bg">'+photo("factory.webp","Визуализация производственного процесса")+'</div>'+
    '<div class="process-teaser-inner">'+chapterLabel("05","ПРОИЗВОДСТВО")+
    '<h2 data-reveal>НЕ ПРОСТО<br><em>СОБРАНО.</em><br>ПРОДУМАНО.</h2>'+
    '<p>Проектирование, конструкция, сборка и согласование комплектации — единый процесс работы над техникой.</p>'+
    button("О производстве","production.html")+'</div></section>'+
    '<section class="journal-teaser"><div class="journal-teaser-head">'+chapterLabel("06","МАТЕРИАЛЫ И ОБЗОРЫ")+
    '<h2 data-reveal>ЗНАНИЯ<br><em>НА СТОРОНЕ ДЕЛА.</em></h2></div>'+
    '<div class="journal-teaser-list">'+articles.map((a,i)=>'<a class="journal-teaser-row" href="'+articleRoute(a)+'" data-reveal>'+
    '<span>'+String(i+1).padStart(2,"0")+'</span><div><b>'+a.category+'</b><h3>'+a.title+'</h3></div>'+
    '<div class="journal-teaser-thumb">'+photo(a.img,a.title)+'</div><strong aria-hidden="true">↗</strong></a>').join("")+
    '</div></section>';
  }
  function catalog(){
    const options=['all','grain','floor','dump','special'];
    return lead("02","ATLAS / MODEL SERIES","ПОЛУПРИЦЕПЫ.<br><em>БЕЗ КОМПРОМИССОВ.</em>",
      "Разные грузы, разная механика работы. Выберите модель и изучите технические параметры.","road.webp")+
    '<section class="atlas-section">'+chapterLabel("01","АТЛАС ТЕХНИКИ")+
    '<div class="atlas-header"><div><h2>ИЗУЧАЙТЕ.<br><em>ВЫБИРАЙТЕ.</em></h2><p>Нажмите модель в списке — крупная визуализация и характеристики появятся рядом.</p></div>'+
    '<span class="atlas-total">06 / SAT SERIES</span></div>'+
    '<div class="atlas-filters" role="group" aria-label="Фильтр модельного ряда">'+
    [['all','Все 06'],['grain','Зерновозы'],['floor','Подвижный пол'],['dump','Самосвальные'],['special','Специальные']].map((f,i)=>
      '<button data-filter="'+f[0]+'" type="button" aria-pressed="'+(i===0)+'" class="'+(i===0?'active':'')+'">'+f[1]+'</button>').join("")+'</div>'+
    '<div class="atlas-layout"><div class="atlas-model-list" role="group" aria-label="Выбор модели">'+models.map((m,i)=>
    '<button class="atlas-model'+(m.id==="SAT-500"?' is-active':'')+'" data-model="'+m.id+'" data-group="'+m.group+'" aria-pressed="'+(m.id==="SAT-500")+'">'+
    '<small>'+String(i+1).padStart(2,"0")+'</small><span><b>'+m.id+'</b><em>'+m.type+'</em></span><strong>↗</strong></button>').join("")+
    '</div><div class="atlas-stage"><div class="atlas-stage-top"><span id="atlasLabel">ЗЕРНОВОЗ / АЛЮМИНИЕВЫЙ</span><span>ВИЗУАЛИЗАЦИЯ</span></div>'+
    '<div class="atlas-stage-name" id="atlasBackdrop">SAT-500</div>'+
    '<div class="atlas-stage-img">'+photo("sat-500.webp","Полуприцеп SAT-500","",true)+'</div>'+
    '<div class="atlas-stage-bottom"><div><h3 id="atlasTitle">SAT-500</h3><p id="atlasDesc">Самосвальный зерновоз с алюминиевым кузовом и задней разгрузкой.</p></div>'+
    '<div class="atlas-stage-specs"><span id="atlasVolume">43–55 м³</span><span id="atlasUnload">Задняя</span></div>'+
    '<a id="atlasLink" class="atlas-go" href="model.html?id=SAT-500">ПОДРОБНЕЕ ↗</a></div></div></div>'+
    '</section>'+
    '<section class="comparison-section">'+chapterLabel("02","СРАВНЕНИЕ В ДЕТАЛЯХ")+
    '<div class="comparison-top"><h2>ДВЕ МОДЕЛИ.<br><em>ОДИН ВЫБОР.</em></h2><p>Сопоставьте назначение, показатели и тип разгрузки. Параметры уточняются по комплектации.</p></div>'+
    '<div class="comparison-controls"><label>ПЕРВАЯ МОДЕЛЬ<select id="compareA">'+models.map((m,i)=>'<option value="'+m.id+'">'+m.id+'</option>').join("")+'</select></label>'+
    '<span aria-hidden="true">VS</span><label>ВТОРАЯ МОДЕЛЬ<select id="compareB">'+models.map((m,i)=>'<option value="'+m.id+'"'+(i===3?' selected':'')+'>'+m.id+'</option>').join("")+'</select></label>'+
    '<button type="button" class="compare-action" id="compareAction">СРАВНИТЬ ↗</button></div>'+
    '<div id="compareResult" class="comparison-result" aria-live="polite"><p>Выберите две модели, чтобы увидеть разницу.</p></div>'+
    '</section>';
  }
  function model(){
    const m=selected;
    return '<section class="single-hero">'+
    '<div class="single-top"><a class="back-link" href="catalog.html">← К АТЛАСУ МОДЕЛЕЙ</a>'+
    '<span>PRODUCT FILE / '+m.id+'</span></div>'+
    '<div class="single-title"><span>'+m.type+'</span><h1>'+m.id+'</h1><p>'+m.description+'</p></div>'+
    '<div class="single-visual"><div class="single-img">'+photo(m.image,m.id+" — визуализация техники","",true)+'</div>'+
    '<span class="single-outline" aria-hidden="true">'+m.id+'</span>'+mediaNote+
    '<div class="single-visual-stamp"><span>ОСНОВНОЙ ПОКАЗАТЕЛЬ</span><b>'+m.volume+'</b></div></div>'+
    '<div class="single-actions">'+button("Запросить демонстрацию","test-drive.html?model="+m.id)+
    button("Другие модели","catalog.html","outline")+'</div></section>'+
    '<section class="single-data-section">'+chapterLabel("02","ПАСПОРТ МОДЕЛИ")+
    '<div class="single-data-grid"><div><h2>ТОЛЬКО<br><em>СУТЬ.</em></h2><p>'+m.description+'</p>'+
    '<div class="single-quick"><span>НАЗНАЧЕНИЕ</span><b>'+m.use+'</b></div>'+
    '<div class="single-quick"><span>РАЗГРУЗКА</span><b>'+m.unload+'</b></div></div>'+
    specList(m)+'</div></section>'+
    '<section class="single-use"><div>'+photo("aluminum.webp","Алюминиевые профили полуприцепа")+'</div>'+
    '<div class="single-use-copy">'+chapterLabel("03","ПРАКТИЧЕСКИЙ ПОДХОД")+
    '<h2>ВЫБОР<br>НАЧИНАЕТСЯ<br><em>С ЗАДАЧИ.</em></h2>'+
    '<p>Габариты груза, осевые нагрузки, возможности разгрузочной площадки и режим эксплуатации определяют нужную конфигурацию. Наши специалисты помогут уточнить исполнение '+m.id+'.</p>'+
    button("Обсудить комплектацию","test-drive.html?model="+m.id,"outline")+'</div></section>'+
    '<section class="related-section">'+chapterLabel("04","ПРОДОЛЖИТЬ ПОДБОР")+
    '<h2>СМОТРИТЕ<br><em>И ДРУГИЕ.</em></h2>'+
    '<div class="related-grid">'+models.filter(x=>x.id!==m.id).slice(0,3).map(x=>
    '<a href="'+modelRoute(x)+'" class="related-card">'+photo(x.image,x.id+" — визуализация")+
    '<span><b>'+x.id+'</b><small>'+x.type+'</small><strong>↗</strong></span></a>').join("")+'</div></section>';
  }
  function technology(){
    return lead("03","LAB / ENGINEERING","ИНЖЕНЕРИЯ.<br><em>БЕЗ ЛИШНИХ СЛОВ.</em>",
      "Алюминиевая конструкция, способы разгрузки и продуманные узлы — по существу.","aluminum.webp")+
    '<section class="technology-principle">'+chapterLabel("01","ЧЕТЫРЕ ПРИНЦИПА")+
    '<h2>ВИДНО<br>В ДЕТАЛЯХ.</h2>'+
    '<div class="tech-selector"><div class="tech-choice-list">'+advantages.map((a,i)=>
    '<button type="button" class="tech-choice'+(i===0?' is-active':'')+'" data-tech="'+i+'" aria-pressed="'+(i===0)+'">'+
    '<span>'+a.num+'</span><strong>'+a.title+'</strong><b>↗</b></button>').join("")+'</div>'+
    '<div class="tech-choice-stage"><div class="tech-choice-photo">'+photo(advantages[0].img,advantages[0].title)+'</div>'+
    '<div class="tech-choice-details"><span id="techCurrentNum">ПРИНЦИП / 01</span><h3 id="techCurrentTitle">'+advantages[0].title+'</h3>'+
    '<p id="techCurrentText">'+advantages[0].desc+'</p></div></div></div></section>'+
    '<section class="technology-explain"><div>'+photo("sat-510.jpg","Зерновоз SAT-510")+'</div>'+
    '<div>'+chapterLabel("02","СПОСОБЫ РАЗГРУЗКИ")+
    '<h2>ОТВЕТ<br>НА УСЛОВИЯ<br><em>РАБОТЫ.</em></h2>'+
    '<p>Разгрузка подвижным полом, задняя или комбинированная — выбор зависит от характера груза и площадки. Модель SAT-510 предусматривает заднюю и боковую разгрузку в соответствующих исполнениях.</p>'+
    button("Посмотреть SAT-510","model.html?id=SAT-510")+'</div></section>'+lab();
  }
  function production(){
    const process=[
      ["01","ЗАДАЧА И ПРОЕКТ","На первом этапе определяются тип груза, режим работы, конструктивные ограничения и желаемая комплектация.","aluminum.webp"],
      ["02","МАТЕРИАЛЫ И КОМПОНЕНТЫ","Кузов, рама, ходовая часть и система разгрузки выбираются для конкретных условий эксплуатации.","sat-500.webp"],
      ["03","ИЗГОТОВЛЕНИЕ И СБОРКА","Отдельные узлы объединяются в единую конструкцию. Визуальные материалы показывают концепцию производственного процесса.","factory.webp"],
      ["04","КОНТРОЛЬ И ПЕРЕДАЧА","Комплектация согласовывается с заказчиком; параметры реального полуприцепа должны соответствовать утверждённой спецификации.","road.webp"]
    ];
    return lead("04","MADE TO WORK","ПРОИЗВОДСТВО.<br><em>КАК СИСТЕМА.</em>",
      "От требований к перевозке до согласованного исполнения полуприцепа.","factory.webp")+
    '<section class="production-intro"><span>ЗАДАЧА → КОНСТРУКЦИЯ → ПРОВЕРКА</span>'+
    '<h2 data-reveal>СИЛА —<br>В <em>ПОСЛЕДОВАТЕЛЬНОСТИ.</em></h2>'+
    '<p>Здесь представлен общий подход к созданию техники ZUBR TRAIL. Фотографии производственных процессов — концептуальные визуализации.</p></section>'+
    '<section class="production-timeline">'+process.map((x,i)=>
    '<article class="production-step" data-reveal>'+
    '<div class="production-step-no"><span>ЭТАП '+x[0]+'</span><b>'+x[0]+'</b></div>'+
    '<div class="production-step-copy"><h3>'+x[1]+'</h3><p>'+x[2]+'</p>'+
    (i===3?button("Обсудить свою задачу","contacts.html","outline"):'')+'</div>'+
    '<div class="production-step-photo">'+photo(x[3],x[1])+'</div></article>').join("")+'</section>';
  }
  function testdrive(){
    return '<section class="drive-layout"><div class="drive-visual"><div class="drive-picture">'+photo("hero.webp","Полуприцеп ZUBR TRAIL")+'</div>'+
    '<div class="drive-visual-copy">'+micro("05","DEMO / REQUEST")+
    '<h1>УВИДЕТЬ.<br>ОЦЕНИТЬ.<br><em>ВЫБРАТЬ.</em></h1><p>Знакомство с техникой начинается с конкретной задачи. Уточните возможность демонстрации интересующей модели.</p></div>'+
    '<div class="drive-footnote">ZUBR TRAIL / '+slogan.toUpperCase()+'</div></div>'+
    '<div class="drive-form-wrap"><span class="form-overline">ЗАПРОС / ТЕСТ-ДРАЙВ</span>'+
    '<h2>РАССКАЖИТЕ<br>О СВОЕЙ ЗАДАЧЕ.</h2><p>Заполните форму. Она подготовит письмо для отправки отделу продаж из вашей почтовой программы.</p>'+
    '<form id="goldForm" class="gold-form">'+
    '<div class="form-row"><label>КАК К ВАМ ОБРАЩАТЬСЯ <em>*</em><input name="name" autocomplete="name" required maxlength="90" placeholder="Ваше имя"></label>'+
    '<label>КОНТАКТНЫЙ ТЕЛЕФОН <em>*</em><input name="phone" type="tel" autocomplete="tel" required maxlength="50" placeholder="+375 ..."></label></div>'+
    '<label>ИНТЕРЕСУЮЩАЯ МОДЕЛЬ <em>*</em><select name="model" required>'+
    '<option value="">Выберите модель</option>'+models.map(m=>'<option value="'+m.id+'"'+(m.id===window.GOLD.search.get("model")?' selected':'')+'>'+m.id+' — '+m.type+'</option>').join("")+'</select></label>'+
    '<label>КОМПАНИЯ<input name="company" maxlength="120" placeholder="Необязательно"></label>'+
    '<label>ВАША ЗАДАЧА<textarea name="task" rows="4" maxlength="1500" placeholder="Тип груза, маршруты, условия разгрузки, пожелания"></textarea></label>'+
    '<label class="form-consent"><input name="consent" type="checkbox" required><span>Я согласен подготовить письмо с указанными данными для отправки из почтовой программы.</span></label>'+
    '<button type="submit" class="gold-button gold-button--solid form-submit"><span>ПОДГОТОВИТЬ ЗАПРОС</span><span class="gold-button-icon">↗</span></button>'+
    '<p id="formFeedback" class="form-feedback" role="status">Сайт не отправляет заявку автоматически. Проверьте письмо в почтовой программе.</p>'+
    '<button type="button" id="copyRequest" class="copy-request" hidden>СКОПИРОВАТЬ ЗАЯВКУ ↗</button></form></div></section>';
  }
  function news(){
    const first=articles[0];
    return lead("06","JOURNAL / ENGINEERING","ЗНАТЬ БОЛЬШЕ.<br><em>РАБОТАТЬ ЛУЧШЕ.</em>",
      "Технические заметки о конструкциях, разгрузке и выборе полуприцепов.","road.webp")+
    '<section class="editorial-section">'+chapterLabel("01","БИБЛИОТЕКА МАТЕРИАЛОВ")+
    '<div class="editorial-leading"><a href="'+articleRoute(first)+'" class="editorial-cover">'+photo(first.img,first.title)+'</a>'+
    '<div class="editorial-intro"><span>В ФОКУСЕ / '+first.category+'</span><h2>'+first.title+'</h2><p>'+first.text+'</p>'+
    button("Читать материал",articleRoute(first))+'</div></div>'+
    '<div class="editorial-rest">'+articles.slice(1).map((a,i)=>
    '<article class="editorial-row"><a href="'+articleRoute(a)+'">'+photo(a.img,a.title)+'</a><div><span>'+String(i+2).padStart(2,"0")+' / '+a.category+'</span>'+
    '<h3><a href="'+articleRoute(a)+'">'+a.title+'</a></h3><p>'+a.text+'</p>'+
    '<a href="'+articleRoute(a)+'" class="editorial-open">ЧИТАТЬ ↗</a></div></article>').join("")+'</div>'+
    '<p class="editorial-disclaimer">Редакционные материалы для ознакомления с техническими особенностями. Не вымышленные события или даты.</p>'+
    '</section>';
  }
  function articlePage(){
    const a=article;
    return '<article class="article-page"><div class="article-page-heading"><a href="news.html">← КО ВСЕМ МАТЕРИАЛАМ</a>'+
    '<span>'+a.category+'</span><h1>'+a.title+'</h1><p>'+a.text+'</p></div>'+
    '<div class="article-page-hero">'+photo(a.img,a.title,"",true)+'</div>'+
    '<div class="article-page-content"><aside><span>ENGINEERING JOURNAL</span><strong>ZUBR TRAIL</strong>'+
    '<small>ТЕХНИЧЕСКИЙ МАТЕРИАЛ</small></aside><div><p>'+a.text+'</p>'+
    '<h2>ЧТО УЧЕСТЬ ПРИ ВЫБОРЕ</h2>'+
    '<p>При подборе полуприцепа следует сопоставлять транспортируемый груз, маршруты, допустимые осевые нагрузки и особенности разгрузочной площадки. Важны характеристики именно выбранной комплектации.</p>'+
    '<p>Точная конструкция, оснащение и технически допустимые показатели согласовываются по документации производителя.</p>'+
    button("Подобрать модель","catalog.html","outline")+'</div></div></article>';
  }
  function contacts(){
    return '<section class="contact-scene"><div class="contact-bg">'+photo("road.webp","Полуприцеп ZUBR TRAIL на дороге")+'</div>'+
    '<div class="contact-head">'+micro("07","CONTACT / DIRECT")+
    '<h1>ДАВАЙТЕ<br><em>В ДЕЛО.</em></h1>'+
    '<p>Расскажите о задаче, а мы поможем подобрать подходящую модель и комплектацию.</p></div>'+
    '<div class="contact-cards"><a href="tel:+375225720103" class="contact-card"><span>01 / ТЕЛЕФОН</span><b>+375 (225)<br>72-01-03</b><small>Позвонить ↗</small></a>'+
    '<a href="mailto:info@satpricep.by" class="contact-card"><span>02 / ЭЛЕКТРОННАЯ ПОЧТА</span><b>info@<br>satpricep.by</b><small>Написать ↗</small></a>'+
    '<a href="https://www.google.com/maps/search/?api=1&query=Bobruisk+K+Libknekhta+6" target="_blank" rel="noopener noreferrer" class="contact-card">'+
    '<span>03 / АДРЕС</span><b>БОБРУЙСК<br>БЕЛАРУСЬ</b><small>Ул. К. Либкнехта, 6 · карта ↗</small></a></div>'+
    '<div class="contact-bottom">'+button("Записаться на тест-драйв","test-drive.html")+
    '<span>Контакты и часы работы уточняйте перед визитом.</span></div></section>';
  }
  window.GOLD_PAGES={home,catalog,model,technology,production,"test-drive":testdrive,news,article:articlePage,contacts};
})();