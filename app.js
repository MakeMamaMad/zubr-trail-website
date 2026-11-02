(function(){
'use strict';
const root=document.documentElement,themeBtn=document.querySelector('[data-theme-toggle]');
try{root.dataset.theme=localStorage.getItem('zubr-trail-theme')==='light'?'light':'dark'}catch(_){root.dataset.theme='dark'}
function updateTheme(){const isLight=root.dataset.theme==='light';themeBtn.querySelector('span').textContent=isLight?'☀':'☾';themeBtn.setAttribute('aria-label',isLight?'Переключить на тёмную тему':'Переключить на светлую тему')}
updateTheme();
themeBtn.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='light'?'dark':'light';try{localStorage.setItem('zubr-trail-theme',root.dataset.theme)}catch(_){}updateTheme()});
const nav=document.getElementById('mainNav'),menu=document.getElementById('menuToggle');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню')});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const models=[
{id:'SAT-150',type:'moving',name:'Подвижный пол',desc:'Полуприцеп для перевозки лёгких сыпучих и других грузов с системой подвижного пола.',specs:[['Объём кузова','90–105 м³'],['Разгрузка','Подвижный пол'],['Собственная масса','Зависит от исполнения']]},
{id:'SAT-197',type:'other',name:'Панелевоз',desc:'Кассетный полуприцеп для перевозки крупногабаритных панелей.',specs:[['Тип','Кассетный панелевоз'],['Назначение','Перевозка панелей'],['Комплектация','По запросу']]},
{id:'SAT-500',type:'grain',name:'Зерновоз',desc:'Алюминиевый полуприцеп-зерновоз, доступен в нескольких исполнениях.',specs:[['Объём кузова','43–55 м³'],['Разгрузка','Задняя'],['Осность','Зависит от исполнения']]},
{id:'SAT-510',type:'grain',name:'Зерновоз с задней и боковой разгрузкой',desc:'Алюминиевый зерновоз для перевозки сельскохозяйственных грузов.',specs:[['Объём кузова','49–55 м³'],['Разгрузка','Задняя и боковая'],['Исполнение','По запросу']]},
{id:'SAT-545',type:'other',name:'Самосвальный полуприцеп',desc:'Алюминиевый самосвальный полуприцеп для транспортных задач.',specs:[['Объём кузова','45 м³'],['Разгрузка','Задняя'],['Исполнение','По запросу']]},
{id:'SAT-550',type:'other',name:'Самосвальный полуприцеп',desc:'Алюминиевый самосвальный полуприцеп для перевозки сыпучих грузов.',specs:[['Объём кузова','49 м³'],['Разгрузка','Задняя'],['Исполнение','По запросу']]}
];
const cards=document.getElementById('modelCards'),modal=document.getElementById('modelModal'),form=document.getElementById('leadForm');
function paint(filter='all'){
const current=models.filter(m=>filter==='all'||m.type===filter);
cards.innerHTML=current.map(m=>'<article class="model-card"><div class="copy"><h3>'+m.id+'</h3><p>'+m.name+'</p></div><div class="visual"><img loading="lazy" src="./assets/'+m.id.toLowerCase()+'.webp" alt="Визуализация полуприцепа '+m.id+'"></div><footer><span>Подробнее о модели</span><button type="button" data-model="'+m.id+'" aria-label="Характеристики '+m.id+'">→</button></footer></article>').join('');
}
paint();
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(n=>n.classList.remove('active'));b.classList.add('active');paint(b.dataset.filter)}));
function openModel(id){const m=models.find(x=>x.id===id);if(!m)return;document.getElementById('modalTitle').textContent=m.id+' — '+m.name;document.getElementById('modalText').textContent=m.desc;document.getElementById('modalSpecs').innerHTML=m.specs.map(s=>'<div><strong>'+s[0]+'</strong><span>'+s[1]+'</span></div>').join('');form.elements.model.value=m.id;modal.classList.add('open');document.body.style.overflow='hidden';document.getElementById('modalClose').focus()}
cards.addEventListener('click',e=>{const b=e.target.closest('[data-model]');if(b)openModel(b.dataset.model)});
function closeModal(){modal.classList.remove('open');document.body.style.overflow=''}
document.getElementById('modalClose').addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});document.getElementById('modalCTA').addEventListener('click',closeModal);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
form.addEventListener('submit',e=>{e.preventDefault();const status=document.getElementById('formStatus');if(!form.reportValidity())return;status.textContent='Данные заполнены, но заявка НЕ отправлена: серверный приём обращений ещё не подключён. С вами никто автоматически не свяжется.';status.style.color='var(--brand)'});
document.getElementById('year').textContent=new Date().getFullYear();
})();