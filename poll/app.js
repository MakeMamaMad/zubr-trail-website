'use strict';
(() => {
  const SOURCE = 'https://github.com/MakeMamaMad/zubr-trail-website/issues/new';
  const STORAGE = 'zubr-design-league-ballot-2026-v1';
  const PREFIX = '[ZUBR-VOTE-2026]';
  const MAX = 3;
  let participants = [];
  const selected = {desktop: new Set(), mobile: new Set()};
  let filter = 'all';
  let query = '';
  let toastTimer;
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const escape = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const validId = id => participants.some(p => p.id === id);
  const chosenCount = () => selected.desktop.size + selected.mobile.size;
  const urlSafe = raw => {try { const u = new URL(raw); return u.protocol === 'https:' ? u.href : '#'; } catch(e) { return '#'; }};
  function toast(message) {
    const el = $('#toast'); el.textContent = message;
    el.classList.add('is-shown'); clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-shown'), 3000);
  }
  function persist() {
    try { localStorage.setItem(STORAGE, JSON.stringify({desktop:[...selected.desktop], mobile:[...selected.mobile]})); } catch(e) {}
  }
  function restore() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) || '{}');
      for(const cat of ['desktop','mobile']){
        if(Array.isArray(saved[cat])) for(const id of saved[cat].slice(0,MAX)) if(validId(id)) selected[cat].add(id);
      }
    } catch(e) {}
  }
  const initials = name => name.split(/\s|\//).filter(Boolean).slice(0,2).map(w => w[0]?.toUpperCase()).join('');
  function rowTemplate(p) {
    const isZubr = p.group === 'zubr';
    const isPicked = selected.desktop.has(p.id) || selected.mobile.has(p.id);
    return `<article class="ballot-row ${isZubr ? 'is-zubr' : ''} ${isPicked ? 'is-selected' : ''}" data-id="${escape(p.id)}" data-group="${escape(p.group)}">
      <div class="brand-info"><div class="brand-avatar" aria-hidden="true">${escape(isZubr ? 'Z' : initials(p.name))}</div>
      <div class="brand-title">${isZubr ? '<span class="own-label">ZUBR TRAIL / НАШ ДИЗАЙН</span>' : ''}<strong>${escape(p.name)}</strong><small title="${escape(p.reference)}">${escape(p.reference || 'Официальный сайт')}</small></div></div>
      <label class="pick desktop ${selected.desktop.has(p.id) ? 'is-checked' : ''}" title="Отметить ${escape(p.name)} как лучший сайт для компьютера"><input type="checkbox" data-vote="desktop" data-id="${escape(p.id)}" ${selected.desktop.has(p.id) ? 'checked' : ''} aria-label="${escape(p.name)} — лучшая версия для компьютера"><span>Для ПК</span></label>
      <label class="pick mobile ${selected.mobile.has(p.id) ? 'is-checked' : ''}" title="Отметить ${escape(p.name)} как лучший сайт для телефона"><input type="checkbox" data-vote="mobile" data-id="${escape(p.id)}" ${selected.mobile.has(p.id) ? 'checked' : ''} aria-label="${escape(p.name)} — лучшая мобильная версия"><span>Телефон</span></label>
      <div class="brand-links"><a class="site-link" href="${escape(urlSafe(p.url))}" target="_blank" rel="noopener noreferrer" aria-label="Открыть сайт ${escape(p.name)} в новой вкладке">Сайт ↗</a>${p.brochure ? `<a class="pdf-link" href="${escape(urlSafe(p.brochure))}" target="_blank" rel="noopener noreferrer" aria-label="Открыть каталог ${escape(p.name)}">Каталог ↗</a>` : ''}</div>
    </article>`;
  }
  function visibleParticipants() {
    return participants.filter(p => {
      const groupMatch = filter === 'all' || (filter === 'chosen' ? selected.desktop.has(p.id) || selected.mobile.has(p.id) : p.group === filter);
      const searchMatch = !query || (p.name+' '+p.reference).toLocaleLowerCase('ru').includes(query);
      return groupMatch && searchMatch;
    });
  }
  function renderRows() {
    const list = visibleParticipants();
    $('#ballotRows').innerHTML = list.map(rowTemplate).join('');
    $('#emptyState').hidden = Boolean(list.length);
    $$('[data-filter]').forEach(btn => {const active = btn.dataset.filter === filter; btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));});
    updateCounts();
  }
  function updateCounts() {
    const d = selected.desktop.size, m = selected.mobile.size;
    $('#desktopCount').textContent = `${d} / ${MAX}`;
    $('#mobileCount').textContent = `${m} / ${MAX}`;
    $('#trayDesktop').textContent = `${d} / ${MAX}`;
    $('#trayMobile').textContent = `${m} / ${MAX}`;
    $('#submitBallot').disabled = d+m === 0;
  }
  function updateRowState(el) {
    const row = el.closest('.ballot-row');
    row.classList.toggle('is-selected', selected.desktop.has(row.dataset.id) || selected.mobile.has(row.dataset.id));
    const label = el.closest('.pick');if(label)label.classList.toggle('is-checked',el.checked);
  }
  function handlePick(el) {
    const cat = el.dataset.vote, id = el.dataset.id;
    if(!['desktop','mobile'].includes(cat) || !validId(id))return;
    if(el.checked) {
      if(selected[cat].size >= MAX) {
        el.checked = false;
        toast(`Для ${cat === 'desktop' ? 'версии для компьютера' : 'мобильной версии'} можно выбрать не больше ${MAX} сайтов.`);
      } else selected[cat].add(id);
    } else selected[cat].delete(id);
    updateRowState(el);updateCounts();persist();
    if(filter === 'chosen' && !selected.desktop.has(id) && !selected.mobile.has(id))renderRows();
  }
  function getNames(cat) {return [...selected[cat]].map(id => participants.find(p=>p.id===id)?.name || id);}
  function setupDialog() {
    const dialog = $('#confirmationDialog');
    const names = c => getNames(c).length ? getNames(c).map(escape).map(s=>'<span>✓ '+s+'</span>').join('') : '<span>Без выбора</span>';
    $('#dialogSummary').innerHTML = `<div class="dialog-votes"><div><strong>▣ ЛУЧШИЕ ДЛЯ КОМПЬЮТЕРА</strong>${names('desktop')}</div><div><strong>▯ ЛУЧШИЕ ДЛЯ ТЕЛЕФОНА</strong>${names('mobile')}</div></div>`;
    const desktop = [...selected.desktop].sort().join(',');
    const mobile = [...selected.mobile].sort().join(',');
    const body = [
      '<!-- ZUBR_VOTE_V1 -->',
      '### DESIGN LEAGUE / БЮЛЛЕТЕНЬ',
      '',
      'DESKTOP: '+desktop,
      'MOBILE: '+mobile,
      '',
      'Публичное голосование за лучший сайт производителя полуприцепов.',
      'Один последний корректный бюллетень на GitHub-аккаунт. Изменить выбор можно, отредактировав этот issue.'
    ].join('\n');
    const url = new URL(SOURCE);
    url.searchParams.set('title', PREFIX+' Мой выбор');
    url.searchParams.set('body',body);
    $('#confirmIssue').href = url.toString();
    if(typeof dialog.showModal === 'function')dialog.showModal();else toast('Откройте GitHub для подтверждения.');
  }
  const leaderSorted = (counts) => participants.slice().sort((a,b)=>(Number(counts?.[b.id]||0)-Number(counts?.[a.id]||0)) || a.number-b.number);
  function renderLeaderboard(cat, counts, ballots) {
    const el = $('#'+cat+'Leaderboard');
    if(!ballots) {el.innerHTML='<div class="leaderboard-status">Голосование открыто — подтверждённых бюллетеней пока нет. Вы можете стать первым участником.</div>';return;}
    const arr = leaderSorted(counts).filter(p=>Number(counts?.[p.id]||0)>0).slice(0,8);
    const top = Math.max(1,...arr.map(p=>Number(counts[p.id])));
    el.innerHTML = arr.map((p,i)=>{
      const count = Number(counts[p.id]);
      return `<div class="leaderboard-item"><span class="place">${String(i+1).padStart(2,'0')}</span><div><a class="item-name" href="${escape(urlSafe(p.url))}" target="_blank" rel="noopener noreferrer">${escape(p.name)} ↗</a><span class="bar-track"><span class="bar-fill" style="width:${Math.round(100*count/top)}%"></span></span></div><b class="votes">${count}</b></div>`;
    }).join('') || '<div class="leaderboard-status">Пока нет отметок в этой категории.</div>';
    el.closest('.leaderboard')?.classList.toggle('mobile',cat==='mobile');
  }
  async function loadResults() {
    $('#resultUpdated').textContent = 'Загружаем результаты…';
    try {
      const res = await fetch('./results.json?ts='+Date.now(),{cache:'no-store'});
      if(!res.ok)throw new Error('HTTP '+res.status);
      const results = await res.json();
      if(results.poll_id !== 'zubr-design-vote-2026') throw new Error('Unexpected poll ID');
      const ballots = Number(results.ballots)||0;
      $('#totalBallots').textContent = ballots;
      $('#resultUpdated').textContent = results.updated_at ? 'Обновлено '+new Date(results.updated_at).toLocaleString('ru-RU') : 'Голосование открыто';
      renderLeaderboard('desktop',results.desktop||{},ballots);
      renderLeaderboard('mobile',results.mobile||{},ballots);
    }catch(e){
      $('#totalBallots').textContent='—';
      $('#resultUpdated').textContent='Результаты временно недоступны';
      $('#desktopLeaderboard').innerHTML='<div class="leaderboard-status">Не удалось загрузить счёт голосования. Попробуйте «Обновить».</div>';
      $('#mobileLeaderboard').innerHTML='<div class="leaderboard-status">Не удалось загрузить счёт голосования. Попробуйте «Обновить».</div>';
    }
  }
  async function init(){
    const res=await fetch('./participants.json',{cache:'no-store'});
    if(!res.ok)throw new Error('participants.json unavailable');
    const data=await res.json();
    participants = data.participants || [];
    if(participants.length!==34 || new Set(participants.map(p=>p.id)).size!==34)throw new Error('Invalid registry');
    restore();renderRows();await loadResults();
    $('#ballotRows').addEventListener('change',e=>{if(e.target.matches('input[data-vote]'))handlePick(e.target);});
    $$('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{filter=btn.dataset.filter;renderRows();}));
    $('#searchInput').addEventListener('input',e=>{query=e.target.value.trim().toLocaleLowerCase('ru');renderRows();});
    $('#resetBallot').addEventListener('click',()=>{selected.desktop.clear();selected.mobile.clear();persist();renderRows();toast('Все отметки сброшены.');});
    $('#submitBallot').addEventListener('click',setupDialog);
    $('#refreshResults').addEventListener('click',loadResults);
    $('#closeDialog').addEventListener('click',()=>$('#confirmationDialog').close());
    $('#backDialog').addEventListener('click',()=>$('#confirmationDialog').close());
    $('#confirmationDialog').addEventListener('click',e=>{if(e.target===$('#confirmationDialog'))e.target.close();});
    $('#shareLink').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.href);toast('Ссылка на голосование скопирована.');}catch(e){window.prompt('Скопируйте ссылку:',location.href);}});
  }
  document.addEventListener('DOMContentLoaded',()=>init().catch(e=>{
    console.error(e);$('#ballotRows').textContent='Не удалось загрузить список участников. Обновите страницу.';
    $('#resultUpdated').textContent='Данные недоступны';toast('Ошибка загрузки участников.');
  }));
})();