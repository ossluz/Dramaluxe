/* ================================================================
   DramaLuxe — app.js  v4  (corrigido)
================================================================ */

/* ── Storage ─────────────────────────────── */
window.Storage = {
  get(k){ try{ return JSON.parse(localStorage.getItem('dlx_'+k)); }catch{ return null; } },
  set(k,v){ try{ localStorage.setItem('dlx_'+k, JSON.stringify(v)); }catch{} },
  del(k){ try{ localStorage.removeItem('dlx_'+k); }catch{} },
};

/* ── History ─────────────────────────────── */
window.History = (() => {
  let items = Storage.get('history') || [];
  const MAX = 80;
  function add(item) {
    items = items.filter(h => h.uid !== item.uid);
    items.unshift({ ...item, ts: Date.now() });
    if (items.length > MAX) items.pop();
    Storage.set('history', items);
    try { if (App.currentScreen === 'screenHistory') UI.renderHistory(); } catch(e){}
  }
  function clear() { items = []; Storage.set('history', items); try{ UI.renderHistory(); }catch(e){} }
  function getAll() { return items; }
  return { add, clear, getAll };
})();

/* ── Favorites ───────────────────────────── */
window.Favorites = (() => {
  let set = new Set(Storage.get('favorites') || []);
  function toggle(uid) {
    set.has(uid) ? set.delete(uid) : set.add(uid);
    Storage.set('favorites', [...set]);
    document.querySelectorAll(`[data-fav-uid="${uid}"]`).forEach(el => {
      el.classList.toggle('active', set.has(uid));
    });
    try { if (App.currentScreen === 'screenFavorites') UI.renderFavorites(); } catch(e){}
  }
  function has(uid) { return set.has(uid); }
  function getAll() { return [...set]; }
  return { toggle, has, getAll };
})();

/* ── Ratings ─────────────────────────────── */
window.Ratings = (() => {
  let data = Storage.get('ratings') || {};
  function set(uid, stars) {
    data[uid] = stars;
    Storage.set('ratings', data);
    document.querySelectorAll(`[data-rating-uid="${uid}"]`).forEach(el => {
      el.querySelectorAll('i').forEach((star, i) => star.classList.toggle('active', i < stars));
    });
  }
  function get(uid) { return data[uid] || 0; }
  return { set, get };
})();

/* ── Progress ────────────────────────────── */
window.Progress = (() => {
  let data = Storage.get('progress') || {};

  function save(uid, epIdx) {
    const existing = data[uid] || {};
    data[uid] = { epIdx: epIdx||0, lastWatched: Date.now(), timestamp: existing.timestamp||0 };
    Storage.set('progress', data);
  }
  function saveTimestamp(uid, epIdx, seconds) {
    if (!seconds || seconds < 5) return;
    const existing = data[uid] || {};
    if (!existing.epIdx || existing.epIdx === epIdx) {
      data[uid] = { ...existing, epIdx: epIdx||0, timestamp: seconds, lastWatched: Date.now() };
      Storage.set('progress', data);
    }
  }
  function getTimestamp(uid, epIdx) {
    const p = data[uid];
    if (!p || (p.epIdx !== (epIdx||0) && (epIdx||0) !== 0)) return 0;
    return p.timestamp || 0;
  }
  function get(uid) { return data[uid] || null; }

  function getContinueList() {
    return Object.entries(data)
      .sort((a,b) => b[1].lastWatched - a[1].lastWatched)
      .slice(0, 12)
      .map(([uid, prog]) => {
        try {
          if (uid.startsWith('series_')) {
            const key = uid.replace('series_', '');
            const series = CATALOG.series.find(s => s.key === key);
            if (!series) return null;
            const ep = series.episodes[prog.epIdx || 0];
            const epId = Player.getId(ep);
            const plat = Player.getPlat(ep);
            const thumb = plat === 'youtube'
              ? `https://img.youtube.com/vi/${epId}/hqdefault.jpg`
              : (series.thumb || `https://placehold.co/320x180/1a1a25/a855f7?text=${encodeURIComponent(series.title)}`);
            return { uid, type:'series', seriesKey:key, epIdx:prog.epIdx||0,
              title:series.title, subtitle:`Ep. ${(prog.epIdx||0)+1} de ${series.episodes.length}`,
              thumb, region:series.region, genre:series.genre };
          } else {
            const id = uid.replace('movie_','');
            const movie = CATALOG.movies.find(m => m.id === id);
            if (!movie) return null;
            return { uid, type:'movie', title:movie.title, subtitle:'Filme completo',
              thumb:`https://img.youtube.com/vi/${movie.id}/hqdefault.jpg`,
              region:movie.region, genre:movie.genre, movieRef:movie };
          }
        } catch(e) { return null; }
      }).filter(Boolean);
  }

  return { save, saveTimestamp, getTimestamp, get, getContinueList };
})();

/* ================================================================
   App — navegação, filtros, busca, hero
================================================================ */
window.App = (() => {

  let currentScreen = 'screenHome';
  let filter = { region:'all', type:'all', genre:'all', audio:'all', search:'' };

  /* ── Hero ─────────────────────────────────── */
  let heroIndex = 0, heroTimer = null;

  function _buildHeroItems() {
    try {
      const featured = (CATALOG.featured || []);
      const items = [];
      featured.forEach(key => {
        const s = CATALOG.series.find(x => x.key === key);
        if (!s) return;
        const ep = s.episodes[0];
        const id = typeof ep === 'string' ? ep : ep.id;
        const plat = typeof ep === 'string' ? 'youtube' : (ep.platform || 'youtube');
        const thumb = s.thumb || (plat==='youtube'
          ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
          : `https://placehold.co/640x360/1a1a25/a855f7?text=${encodeURIComponent(s.title)}`);
        const thumbFb = s.thumb || (plat==='youtube'
          ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
          : thumb);
        items.push({ key, type:'series', title:s.title, desc:s.desc||'',
          year:s.year, rating:s.rating, genre:s.genre, region:s.region, thumb, thumbFb });
      });
      return items;
    } catch(e) { return []; }
  }

  function initHero() {
    const items = _buildHeroItems();
    if (!items.length) {
      // Fallback: set some text at least
      const titleEl = document.getElementById('heroTitle');
      if (titleEl) titleEl.textContent = 'DramaLuxe';
      return;
    }

    const bg      = document.getElementById('heroBg');
    const titleEl = document.getElementById('heroTitle');
    const descEl  = document.getElementById('heroDesc');
    const metaEl  = document.getElementById('heroMeta');
    const dotsEl  = document.getElementById('heroDots');
    const playBtn = document.getElementById('heroPlayBtn');
    const infoBtn = document.getElementById('heroInfoBtn');

    if (!bg || !titleEl) return;

    const RI = {'c-drama':'🐉','k-drama':'⭐','j-drama':'🌸','thai-drama':'🌴'};
    const RL = {'c-drama':'C-Drama','k-drama':'K-Drama','j-drama':'J-Drama','thai-drama':'Thai-Drama'};
    const GL = {romance:'Romance',fantasy:'Fantasia',drama:'Drama',comedy:'Comédia',action:'Ação'};

    function show(i) {
      heroIndex = ((i % items.length) + items.length) % items.length;
      const item = items[heroIndex];

      // Set text immediately — no waiting for image
      titleEl.textContent = item.title;
      if (descEl) descEl.textContent = item.desc;
      if (metaEl) metaEl.innerHTML = `
        <span class="hero-pill">${RI[item.region]||''} ${RL[item.region]||item.region}</span>
        ${item.year ? `<span class="hero-pill">${item.year}</span>` : ''}
        ${item.rating ? `<span class="hero-pill">⭐ ${item.rating}</span>` : ''}
        <span class="hero-pill">${GL[item.genre]||item.genre}</span>`;

      // Define imagem de fundo diretamente sem preload
      bg.style.backgroundImage = `url('${item.thumbFb || item.thumb}')`;
      bg.style.opacity = '1';

      // Dots
      if (dotsEl) {
        dotsEl.innerHTML = items.map((_,idx) =>
          `<span class="hero-dot ${idx===heroIndex?'active':''}"></span>`).join('');
        dotsEl.querySelectorAll('.hero-dot').forEach((dot,idx) => {
          dot.onclick = () => { clearInterval(heroTimer); show(idx); startTimer(); };
        });
      }

      if (playBtn) playBtn.onclick = () => UI.openDetailScreen(item.key, 'series');
      if (infoBtn) infoBtn.onclick = () => UI.openDetailScreen(item.key, 'series');
    }

    function startTimer() {
      clearInterval(heroTimer);
      heroTimer = setInterval(() => show(heroIndex + 1), 5500);
    }

    show(0);
    startTimer();
  }

  /* ── Screen navigation ───────────────────── */
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(id);
    if (screen) screen.classList.add('active');
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navBtn = document.querySelector(`.nav-item[data-screen="${id}"]`);
    if (navBtn) navBtn.classList.add('active');
    currentScreen = id;
    window.scrollTo({ top:0, behavior:'smooth' });
    if (id === 'screenHistory')   try{ UI.renderHistory();   }catch(e){}
    if (id === 'screenFavorites') try{ UI.renderFavorites(); }catch(e){}
    if (id === 'screenAbout')     try{ UI.renderAbout();     }catch(e){}
    _updateHeroVisibility();
  }

  /* ── Filters ─────────────────────────────── */
  function _updateHeroVisibility() {
    try {
      const hero    = document.getElementById('heroSection');
      const panel   = document.getElementById('filtersPanel');
      const searchW = document.getElementById('searchWrap');
      if (!hero) return;
      const isHome    = currentScreen === 'screenHome';
      const hasFilter = filter.region!=='all'||filter.type!=='all'||filter.genre!=='all'||filter.audio!=='all'||filter.search;
      const panelOpen = panel && panel.style.display === 'block';
      const searchOpen = searchW && searchW.classList.contains('visible');
      hero.style.display = (!isHome || hasFilter || panelOpen || searchOpen) ? 'none' : '';
    } catch(e){}
  }

  function setupFilters() {
    _setupChipGroup('chipRegion', 'region');
    _setupChipGroup('chipType',   'type');
    _setupChipGroup('chipGenre',  'genre');
    _setupChipGroup('chipAudio',  'audio');

    const searchBtn = document.getElementById('searchToggleBtn');
    if (searchBtn) searchBtn.onclick = () => {
      const wrap = document.getElementById('searchWrap');
      if (!wrap) return;
      const visible = wrap.classList.toggle('visible');
      searchBtn.classList.toggle('active', visible);
      if (visible) document.getElementById('searchInput')?.focus();
      else { filter.search = ''; const si=document.getElementById('searchInput'); if(si)si.value=''; _rerender(); }
      _updateHeroVisibility();
    };

    const filterBtn = document.getElementById('filterToggleBtn');
    if (filterBtn) filterBtn.onclick = () => {
      const panel = document.getElementById('filtersPanel');
      if (!panel) return;
      const open = panel.style.display === 'block';
      panel.style.display = open ? 'none' : 'block';
      filterBtn.classList.toggle('active', !open);
      _updateHeroVisibility();
    };

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.addEventListener('input', e => {
      filter.search = e.target.value.trim();
      _updateHeroVisibility();
      _rerender();
    });

    document.querySelectorAll('.nav-item[data-screen]').forEach(btn => {
      btn.onclick = () => showScreen(btn.dataset.screen);
    });
  }

  function _setupChipGroup(groupId, key) {
    const group = document.getElementById(groupId);
    if (!group) return;
    group.querySelectorAll('.chip').forEach(btn => {
      btn.onclick = () => {
        group.querySelectorAll('.chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filter[key] = btn.dataset.val;
        _updateHeroVisibility();
        _rerender();
      };
    });
  }

  function _rerender() {
    try { UI.renderHome(filter); } catch(e){ console.error('renderHome error:', e); }
  }

  /* ── PWA ─────────────────────────────────── */
  function registerPWA() {
    try {
      const manifest = {
        name:'DramaLuxe', short_name:'DramaLuxe',
        description:'Central de Dramas Asiáticos',
        start_url:'./', display:'standalone',
        theme_color:'#0a0a0f', background_color:'#0a0a0f',
        icons:[
          {src:'https://placehold.co/192x192/a855f7/white?text=DL',sizes:'192x192',type:'image/png'},
          {src:'https://placehold.co/512x512/a855f7/white?text=DL',sizes:'512x512',type:'image/png'},
        ],
      };
      const blob = new Blob([JSON.stringify(manifest)],{type:'application/json'});
      const link = document.createElement('link');
      link.rel='manifest'; link.href=URL.createObjectURL(blob);
      document.head.appendChild(link);
    } catch(e){}
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(()=>{});
    }
  }

  /* ── Init ─────────────────────────────────── */
  function init() {
    try { setupFilters(); } catch(e){ console.error('setupFilters:', e); }
    try { initHero();     } catch(e){ console.error('initHero:', e); }
    try { UI.renderHome(filter); } catch(e){ console.error('renderHome:', e); }
    try { UI.renderAbout(); }     catch(e){}
    try { registerPWA(); }        catch(e){}

    // Player close events
    const closeBtn = document.getElementById('modalCloseBtn');
    if (closeBtn) closeBtn.onclick = () => { try{ Player.close(); }catch(e){} };
    const modal = document.getElementById('playerModal');
    if (modal) modal.onclick = e => { if(e.target.id==='playerModal') try{ Player.close(); }catch(e){} };
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        try{ Player.close(); }catch(e){}
        try{ UI.closeDetailScreen(); }catch(e){}
      }
    });
  }

  return {
    init, showScreen,
    get filter() { return filter; },
    get currentScreen() { return currentScreen; },
  };
})();
