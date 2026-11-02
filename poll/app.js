'use strict';
(() => {
  const repo = 'https://github.com/MakeMamaMad/zubr-trail-website/issues/new';
  const storageKey = 'zubr-design-league-ballot-2026-v1';
  const max = 3;
  let participants = [];
  let results = {desktop:{}, mobile:{}, ballots:0};
  const picks = {desktop:new Set(), mobile:new Set()};
  const $ = s => document.querySelector(s);
  const node = (tag, text, css) => {const el=document.createElement(tag);if(text!==undefined)el.textContent=String(text);if(css)el.className=css;return el};
  const getCount = type => picks[type].size;
  const isValid = id => participants.some(p=>p.id===id);
  const serialize = () => {try{localStorage.setItem(storageKey,JSON.stringify({desktop:[...picks.desktop],mobile:[...picks.mobile]}))}catch(e){}};
  function restore(){try{const j=JSON.parse(localStorage.getItem(storageKey)||'{}');for(const type of ['desktop','mobile'])for(const id of (Array.isArray(j[type])?j[type].slice(0,max):[]))if(isValid(id))picks[type].add(id)}catch(e){}}
  function message(s){$('#message').textContent=s}
  function issueUrl(){
    const body=['<!-- ZUBR_VOTE_V1 -->','### DESIGN LEAGUE / БЮЛЛЕТЕНЬ','','DESKTOP: '+[...picks.desktop].sort().join(','),'MOBILE: '+[...picks.mobile].sort().join(','),'','Публичное голосование за лучший сайт производителя полуприцепов.','Один последний корректный бюллетень на GitHub-аккаунт. Изменить выбор можно, отредактировав этот issue.'].join('\n');
    const u=new URL(repo);u.searchParams.set('title','[ZUBR-VOTE-2026] Мой выбор');u.searchParams.set('body',body);return u.toString();
  }
  function updateCounters(){
    const d=getCount('desktop'),m=getCount('mobile');
    $('#countDesktop').textContent=d+' / '+max;
    $('#countMobile').textContent=m+' / '+max;
    $('#footerDesktop').textContent=d+' / '+max;
    $('#footerMobile').textContent=m+' / '+max;
    const link=$('#sendVote');
    if(d+m===0){link.classList.add('disabled');link.setAttribute('aria-disabled','true');link.href='#'}
    else{link.classList.remove('disabled');link.setAttribute('aria-disabled','false');link.href=issueUrl()}
  }
  function checkbox(p,type){
    const cell=node('td',undefined,'vote-cell');
    const label=node('label');
    const input=document.createElement('input');
    input.type='checkbox';input.dataset.vote=type;input.dataset.id=p.id;
    input.checked=picks[type].has(p.id);
    input.setAttribute('aria-label',p.name+': лучший сайт для '+(type==='desktop'?'компьютера':'телефона'));
    label.append(input);cell.append(label);
    return cell;
  }
  function render(){
    const filter=$('#filter').value;
    const search=$('#search').value.trim().toLocaleLowerCase('ru');
    const visible=participants.filter(p=>{
      if(filter==='zubr'&&p.group!=='zubr')return false;
      if(filter==='other'&&p.group==='zubr')return false;
      if(filter==='selected'&&!picks.desktop.has(p.id)&&!picks.mobile.has(p.id))return false;
      return p.name.toLocaleLowerCase('ru').includes(search)||String(p.reference||'').toLocaleLowerCase('ru').includes(search);
    });
    const body=$('#tableBody');body.replaceChildren();
    const frag=document.createDocumentFragment();
    for(const p of visible){
      const row=node('tr');row.dataset.id=p.id;
      if(p.group==='zubr')row.classList.add('zubr-row');
      if(picks.desktop.has(p.id)||picks.mobile.has(p.id))row.classList.add('my-choice');
      row.append(node('td',p.number,'num'));
      const title=node('td');title.append(node('span',p.name,'name-main'));
      if(p.group==='zubr')title.append(node('span','ZUBR TRAIL — наша версия','name-sub'));
      else if(p.reference)title.append(node('span',p.reference,'name-sub'));
      row.append(title);
      const linkCell=node('td');const site=node('a','Открыть ↗','web-link');
      site.href=p.url;site.target='_blank';site.rel='noopener noreferrer';site.setAttribute('aria-label','Открыть сайт '+p.name);
      linkCell.append(site);row.append(linkCell,checkbox(p,'desktop'),checkbox(p,'mobile'),node('td',results.desktop[p.id]||0,'count-cell'),node('td',results.mobile[p.id]||0,'count-cell'));
      frag.append(row);
    }
    if(!visible.length){const row=node('tr'),cell=node('td','По запросу ничего не найдено.','loading');cell.colSpan=7;row.append(cell);frag.append(row)}
    body.append(frag);$('#totalCount').textContent=participants.length;updateCounters();
  }
  function changeVote(input){
    const {id,vote:type}=input.dataset;
    if(!isValid(id)||!['desktop','mobile'].includes(type))return;
    if(input.checked){
      if(picks[type].size>=max){input.checked=false;message('Можно выбрать не больше '+max+' сайтов для '+(type==='desktop'?'компьютера.':'телефона.'))}
      else{picks[type].add(id);message('Отметка сохранена в браузере. Чтобы отправить голос, нажмите кнопку ниже.')}
    }else{picks[type].delete(id);message('Отметка снята.')}
    serialize();
    const row=input.closest('tr');
    row?.classList.toggle('my-choice',picks.desktop.has(id)||picks.mobile.has(id));
    if($('#filter').value==='selected')render();else updateCounters();
  }
  async function refresh(){
    $('#resultStatus').textContent='Загрузка…';
    try{
      const response=await fetch('results.json?t='+Date.now(),{cache:'no-store'});
      if(!response.ok)throw Error('HTTP '+response.status);
      const r=await response.json();if(r.poll_id!=='zubr-design-vote-2026')throw Error('Invalid results');
      results={desktop:r.desktop||{},mobile:r.mobile||{},ballots:r.ballots||0};
      $('#resultStatus').textContent='Бюллетеней: '+results.ballots;
      render();
    }catch(e){$('#resultStatus').textContent='Результаты временно недоступны'}
  }
  async function init(){
    const response=await fetch('participants.json',{cache:'no-store'});if(!response.ok)throw Error('Cannot load registry');
    const r=await response.json();participants=r.participants||[];
    if(participants.length!==34||new Set(participants.map(p=>p.id)).size!==34)throw Error('Incorrect participant registry');
    restore();render();await refresh();
    $('#tableBody').addEventListener('change',e=>{if(e.target.matches('input[data-vote]'))changeVote(e.target)});
    $('#search').addEventListener('input',render);
    $('#filter').addEventListener('change',render);
    $('#reset').addEventListener('click',()=>{picks.desktop.clear();picks.mobile.clear();serialize();render();message('Отметки сброшены.')});
    $('#refresh').addEventListener('click',refresh);
    $('#sendVote').addEventListener('click',e=>{if(!getCount('desktop')&&!getCount('mobile'))e.preventDefault();else message('Для подтверждения нажмите Submit new issue на открывшейся странице GitHub.')});
  }
  document.addEventListener('DOMContentLoaded',()=>init().catch(e=>{console.error(e);$('#tableBody').innerHTML='<tr><td colspan="7" class="loading">Не удалось загрузить список. Обновите страницу.</td></tr>';message('Ошибка загрузки данных.')}));
})();