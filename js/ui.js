/* ================================================================
   DramaLuxe — ui.js
   Componentes visuais: cards, detalhe Netflix, carrosséis, telas
   ================================================================ */

window.UI = (() => {

  /* ── Labels / Ícones ─────────────────────── */
  const RL  = {'c-drama':'C-Drama','k-drama':'K-Drama','j-drama':'J-Drama','thai-drama':'Thai-Drama'};
  const RI  = {'c-drama':'🐉','k-drama':'⭐','j-drama':'🌸','thai-drama':'🌴'};
  const GL  = {romance:'Romance',fantasy:'Fantasia',drama:'Drama',comedy:'Comédia',action:'Ação'};

  /* ── Image loading com fallback em cascata ── */
  function lazyImg(img, src, fallback) {
    // Cascata: local → YouTube → placeholder
    img.src = src || '';
    img.onerror = function() {
      if (fallback && img.src !== fallback) {
        // Tenta YouTube hqdefault
        img.src = fallback;
      } else {
        // Placeholder final
        img.src = 'https://placehold.co/320x180/1a1a25/a855f7?text=' +
          encodeURIComponent((img.alt || 'DramaLuxe').slice(0, 20));
        img.onerror = null;
      }
    };
    img.onload = function() { img.classList.remove('skeleton'); };
  }

  // ── Local thumbnail helpers ─────────────────
  function _epId(ep)   { return typeof ep === 'string' ? ep : (ep && ep.id ? ep.id : ''); }
  function _epPlat(ep) { return typeof ep === 'string' ? 'youtube' : (ep && ep.platform ? ep.platform : 'youtube'); }

  function _ytId(item) {
    if (item.id) return item.id;
    if (item.episodes && item.episodes.length) {
      const ep = item.episodes[0];
      if (_epPlat(ep) === 'youtube') return _epId(ep);
    }
    return '';
  }

  function getThumb(item) {
    // 1. Local thumb (assets/thumbs/KEY.jpg ou ID.jpg) — sempre tem prioridade
    const localKey = item.key || item.id || '';
    if (localKey) return 'assets/thumbs/' + localKey + '.jpg';
    // 2. Thumb explícito no catalog
    if (item.thumb) return item.thumb;
    // 3. YouTube hqdefault
    const ytId = _ytId(item);
    if (ytId) return 'https://img.youtube.com/vi/' + ytId + '/hqdefault.jpg';
    // 4. Placeholder
    return 'https://placehold.co/320x180/1a1a25/a855f7?text=' + encodeURIComponent((item.title||'DL').slice(0,20));
  }

  function getThumbFb(item) {
    // Fallback sempre é YouTube ou catalog thumb
    if (item.thumb) return item.thumb;
    const ytId = _ytId(item);
    if (ytId) return 'https://img.youtube.com/vi/' + ytId + '/hqdefault.jpg';
    return null;
  }
  /* ── Carousel card ───────────────────────── */
  function makeCarouselCard(item) {
    const el   = document.createElement('div');
    el.className = 'card';
    const uid   = item.uid || (item.key ? `series_${item.key}` : `movie_${item.id||item.title}`);
    const isFav = Favorites.has(uid);
    const thumb = getThumb(item);
    const fb    = getThumbFb(item);

    const safeTitle = (item.title||'').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    el.innerHTML = `
      <div class="card-thumb">
        <img alt="${safeTitle}" class="skeleton">
        <div class="card-overlay">
          <div class="play-circle"><i class="fas fa-play"></i></div>
        </div>
        ${item.type==='series' ? `<div class="card-ep-badge">${item.epCount||item.episodes?.length||''} EP</div>` : ''}
        <button class="card-fav ${isFav?'active':''}" data-fav-uid="${uid}" title="Favoritar">
          <i class="fas fa-heart"></i>
        </button>
      </div>
      <div class="card-body">
        <div class="card-name">${safeTitle}</div>
        <div class="card-tags">
          <span class="card-tag">${RI[item.region]||''} ${RL[item.region]||''}</span>
          <span class="card-tag">${GL[item.genre]||item.genre}</span>
        </div>
      </div>`;

    lazyImg(el.querySelector('img'), thumb, fb);

    el.querySelector('.card-fav').onclick = e => {
      e.stopPropagation();
      Favorites.toggle(uid);
    };
    el.onclick = () => {
      if (item.type === 'series') openDetailScreen(item.key, 'series');
      else openDetailScreen(item.id || item.title, 'movie', item);
    };
    return el;
  }

  /* ── Grid card ───────────────────────────── */
  function makeGridCard(item) {
    const el   = document.createElement('div');
    el.className = 'grid-card';
    const uid   = item.uid || (item.key ? `series_${item.key}` : `movie_${item.id||item.title}`);
    const isFav = Favorites.has(uid);
    const thumb = getThumb(item);
    const fb    = getThumbFb(item);
    const prog  = item.type === 'series' ? Progress.get(`series_${item.key}`) : null;
    const progPct = prog ? Math.round((prog.epIdx / ((item.episodes?.length||item.epCount||1)-1)) * 100) : 0;

    el.innerHTML = `
      <div class="grid-thumb">
        <img alt="${item.title}" class="skeleton">
        <div class="grid-thumb-ov"></div>
        <div class="grid-thumb-play"><i class="fas fa-play"></i></div>
        ${item.type==='series' ? `<div class="grid-ep-badge">${item.epCount||item.episodes?.length||''} EP</div>` : ''}
        <button class="card-fav ${isFav?'active':''}" data-fav-uid="${uid}" title="Favoritar">
          <i class="fas fa-heart"></i>
        </button>
        ${prog ? `<div class="progress-bar"><div class="progress-fill" style="width:${progPct}%"></div></div>` : ''}
      </div>
      <div class="grid-body">
        <div class="grid-name">${item.title}</div>
        <div class="grid-meta">
          <span class="grid-tag">${RI[item.region]||''} ${RL[item.region]||item.region}</span>
          <span class="grid-tag">${GL[item.genre]||item.genre}</span>
          ${item.year ? `<span class="grid-tag">${item.year}</span>` : ''}
        </div>
      </div>`;

    lazyImg(el.querySelector('img'), thumb, fb);

    el.querySelector('.card-fav').onclick = e => {
      e.stopPropagation();
      Favorites.toggle(uid);
    };
    el.onclick = () => {
      if (item.type === 'series') openDetailScreen(item.key, 'series');
      else openDetailScreen(item.id || item.title, 'movie', item);
    };
    return el;
  }

  /* ── Continue watching card ──────────────── */
  function makeContinueCard(cItem) {
    const el = document.createElement('div');
    el.className = 'card continue-card';
    el.innerHTML = `
      <div class="card-thumb">
        <img src="${cItem.thumb}" alt="${cItem.title}" class="skeleton">
        <div class="card-overlay"><div class="play-circle"><i class="fas fa-play"></i></div></div>
        <div class="continue-badge"><i class="fas fa-redo"></i> Continuar</div>
      </div>
      <div class="card-body">
        <div class="card-name">${cItem.title}</div>
        <div class="card-tags"><span class="card-tag">${cItem.subtitle}</span></div>
      </div>`;
    el.querySelector('img').onload = () => el.querySelector('img').classList.remove('skeleton');
    el.onclick = () => {
      if (cItem.type === 'series') Player.openSeries(cItem.seriesKey, cItem.epIdx);
      else Player.openMovie(cItem.movieRef);
    };
    return el;
  }

  /* ── Build section (carousel or grid) ───── */
  function buildSection(label, items, opts={}) {
    if (!items || !items.length) return null;
    const sec = document.createElement('div');
    sec.className = 'section';
    sec.innerHTML = `
      <div class="section-header">
        <div class="section-title"><div class="section-title-bar"></div>${label}</div>
        <span class="section-count">${items.length}</span>
      </div>`;
    const row = document.createElement('div');
    row.className = 'carousel';
    items.forEach(item => {
      try {
        row.appendChild(opts.grid ? makeGridCard(item) : makeCarouselCard(item));
      } catch(e) { console.error('card error:', e, item?.title); }
    });
    sec.appendChild(row);
    return sec;
  }

  /* ── allItems helper ─────────────────────── */
  function allItems() {
    const out = [];
    CATALOG.series.forEach(s => out.push({
      ...s, type:'series', uid:`series_${s.key}`,
      thumb:getThumb(s), epCount:s.episodes.length,
    }));
    CATALOG.movies.forEach(m => out.push({
      ...m, type:'movie', uid:`movie_${m.id||m.title}`,
      thumb:getThumb(m),
    }));
    return out;
  }

  function applyFilter(items, f) {
    if (!f) return items;
    return items.filter(item => {
      if (f.region && f.region !== 'all' && item.region !== f.region) return false;
      if (f.type   && f.type   !== 'all' && item.type   !== f.type)   return false;
      if (f.genre  && f.genre  !== 'all' && item.genre  !== f.genre)  return false;
      if (f.audio  && f.audio  !== 'all' && item.audio  !== f.audio)  return false;
      if (f.search) {
        const q = f.search.toLowerCase();
        return [item.title, item.titleOriginal, item.cast, item.desc]
          .some(v => v && v.toLowerCase().includes(q));
      }
      return true;
    });
  }

  /* ── renderHome ──────────────────────────── */
  function renderHome(filter) {
    const container = document.getElementById('homeContent');
    if (!container) return;
    container.innerHTML = '';
    const all      = allItems();
    const isFilter = (filter.region&&filter.region!=='all')||(filter.type&&filter.type!=='all')||(filter.genre&&filter.genre!=='all')||(filter.audio&&filter.audio!=='all')||filter.search;

    if (isFilter) {
      const filtered = applyFilter(all, filter);
      if (!filtered.length) {
        container.innerHTML = `<div class="empty">
          <i class="fas fa-search"></i>
          <h3>Nenhum resultado</h3>
          <p>Tente outros filtros ou palavras diferentes.</p></div>`;
        return;
      }
      const grid = document.createElement('div');
      grid.className = 'main-grid';
      filtered.forEach(item => grid.appendChild(makeGridCard(item)));
      container.appendChild(grid);
      return;
    }

    // Netflix-style sections
    // 1. Continue watching
    try {
      const continueList = Progress.getContinueList();
      if (continueList.length) {
        const sec = document.createElement('div');
        sec.className = 'section';
        sec.innerHTML = '<div class="section-header"><div class="section-title"><div class="section-title-bar"></div>▶ Continue Assistindo</div></div>';
        const row = document.createElement('div');
        row.className = 'carousel';
        continueList.forEach(item => row.appendChild(makeContinueCard(item)));
        sec.appendChild(row);
        container.appendChild(sec);
      }
    } catch(e) {}

    // 2. Series
    try {
      const series = all.filter(i => i.type === 'series');
      const sSec = buildSection('📺 Séries', series);
      if (sSec) container.appendChild(sSec);
    } catch(e) { console.error('series section:', e); }

    // 3. By region
    const regions = [
      ['🐉 Filmes C-Drama',     'c-drama'],
      ['⭐ Filmes K-Drama',     'k-drama'],
      ['🌸 Filmes J-Drama',     'j-drama'],
      ['🌴 Filmes Thai-Drama',  'thai-drama'],
    ];
    regions.forEach(([label, region]) => {
      try {
        const items = all.filter(i => i.type === 'movie' && i.region === region);
        const sec   = buildSection(label, items);
        if (sec) container.appendChild(sec);
      } catch(e) { console.error('region section '+region+':', e); }
    });

    // 4. Fantasy section
    try {
      const fantasy = all.filter(i => i.genre === 'fantasy');
      if (fantasy.length) {
        const sec = buildSection('✨ Fantasia & Aventura', fantasy);
        if (sec) container.appendChild(sec);
      }
    } catch(e) { console.error('fantasy section:', e); }
  }

  /* ── renderHistory ───────────────────────── */
  function renderHistory() {
    const grid = document.getElementById('historyGrid');
    const all  = History.getAll();
    if (!all.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1">
        <i class="fas fa-history"></i><h3>Histórico vazio</h3>
        <p>Assista algo para ver aqui!</p></div>`;
      return;
    }
    grid.innerHTML = '';
    all.forEach(item => grid.appendChild(makeGridCard(item)));
  }

  /* ── renderFavorites ─────────────────────── */
  function renderFavorites() {
    const grid = document.getElementById('favGrid');
    if (!grid) return;
    const uids = Favorites.getAll();
    if (!uids.length) {
      grid.innerHTML = `<div class="empty" style="grid-column:1/-1">
        <i class="fas fa-heart"></i><h3>Nenhum favorito ainda</h3>
        <p>Toque no ❤️ em qualquer card para salvar.</p></div>`;
      return;
    }
    const all = allItems();
    grid.innerHTML = '';
    uids.forEach(uid => {
      const item = all.find(i => i.uid === uid);
      if (item) grid.appendChild(makeGridCard(item));
    });
  }

  /* ── renderAbout ─────────────────────────── */
  function renderAbout() {
    const el = document.getElementById('statsRow');
    if (!el) return;
    const totalEps = CATALOG.series.reduce((a, s) => a + s.episodes.length, 0);
    el.innerHTML = `
      <div class="stat-card"><div class="stat-num">${CATALOG.series.length}</div><div class="stat-label">Séries</div></div>
      <div class="stat-card"><div class="stat-num">${totalEps}</div><div class="stat-label">Episódios</div></div>
      <div class="stat-card"><div class="stat-num">${CATALOG.movies.length}</div><div class="stat-label">Filmes</div></div>
      <div class="stat-card"><div class="stat-num">4</div><div class="stat-label">Plataformas</div></div>`;
  }

  /* ================================================================
     TELA DE DETALHE (estilo Netflix)
  ================================================================ */
  function openDetailScreen(keyOrId, type, movieRef) {
    let item;
    if (type === 'series') {
      item = CATALOG.series.find(s => s.key === keyOrId);
    } else {
      item = movieRef || CATALOG.movies.find(m => m.id === keyOrId || m.title === keyOrId);
    }
    if (!item) return;

    const uid   = type === 'series' ? `series_${item.key}` : `movie_${item.id||item.title}`;
    const isFav = Favorites.has(uid);
    const myRating = Ratings.get(uid);
    const prog  = type === 'series' ? Progress.get(uid) : null;
    const thumb = getThumb(item);
    const fb    = getThumbFb(item);

    const overlay = document.getElementById('detailOverlay');
    const content = document.getElementById('detailContent');

    const platIcon = type === 'movie' ? (Player.PLATFORMS[item.platform||'youtube']?.icon || 'fas fa-play-circle') : 'fas fa-tv';
    const platLabel = type === 'movie' ? (Player.PLATFORMS[item.platform||'youtube']?.label || 'YouTube') : 'Série';
    const platColor = type === 'movie' ? (Player.PLATFORMS[item.platform||'youtube']?.color || '#a855f7') : '#a855f7';

    content.innerHTML = `
      <div class="detail-backdrop">
        <img id="detailBg" src="" alt="${item.title}" class="skeleton">
        <div class="detail-backdrop-ov"></div>
      </div>
      <div class="detail-body">
        <div class="detail-close-row">
          <button class="detail-close" id="detailCloseBtn"><i class="fas fa-chevron-down"></i></button>
          <div class="detail-header-actions">
            <button class="detail-action-btn fav-btn ${isFav?'active':''}" data-fav-uid="${uid}" title="Favoritar">
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </div>
        <div class="detail-title">${item.title}</div>
        ${item.titleOriginal ? `<div class="detail-original">${item.titleOriginal}</div>` : ''}
        <div class="detail-badges">
          <span class="modal-pill">${RI[item.region]||''} ${RL[item.region]||item.region}</span>
          ${item.year ? `<span class="modal-pill">${item.year}</span>` : ''}
          ${item.rating ? `<span class="modal-pill gold">⭐ ${item.rating}</span>` : ''}
          <span class="modal-pill">${GL[item.genre]||item.genre}</span>
          <span class="modal-pill" style="color:${platColor};border-color:${platColor}"><i class="${platIcon}"></i> ${platLabel}</span>
        </div>
        ${item.desc ? `<div class="detail-desc">${item.desc}</div>` : ''}
        ${item.cast ? `<div class="detail-cast"><i class="fas fa-users"></i> <span>${item.cast}</span></div>` : ''}

        <div class="detail-actions">
          <button class="detail-play-btn" id="detailPlayBtn">
            <i class="fas fa-play"></i> Assistir${prog ? ` (Ep. ${prog.epIdx+1})` : ''}
          </button>
          ${type==='series' && prog && prog.epIdx > 0 ? `
          <button class="detail-restart-btn" id="detailRestartBtn">
            <i class="fas fa-redo"></i> Desde o início
          </button>` : ''}
        </div>

        <div class="detail-rating" data-rating-uid="${uid}">
          <span class="rating-label">Minha Avaliação:</span>
          ${[1,2,3,4,5].map(n => `
            <i class="fas fa-star ${myRating>=n?'active':''}" data-star="${n}"></i>`).join('')}
        </div>

        ${type==='series' ? `
        <div class="detail-episodes">
          <div class="detail-section-label">Episódios (${item.episodes.length})</div>
          <div class="detail-ep-grid" id="detailEpGrid"></div>
        </div>` : ''}
      </div>`;

    // Load backdrop
    const bgEl = content.querySelector('#detailBg');
    const bgImg = new Image();
    bgImg.onload  = () => { bgEl.src = bgImg.src; bgEl.classList.remove('skeleton'); };
    bgImg.onerror = () => { if (fb) bgEl.src = fb; bgEl.classList.remove('skeleton'); };
    bgImg.src = thumb;

    // Episode grid for series
    if (type === 'series') {
      const epGrid = content.querySelector('#detailEpGrid');
      item.episodes.forEach((_, i) => {
        const btn = document.createElement('button');
        btn.className = 'ep-btn' + (prog && i===prog.epIdx ? ' current' : '');
        btn.textContent = i + 1;
        btn.onclick = () => { closeDetailScreen(); Player.openSeries(item.key, i); };
        epGrid.appendChild(btn);
      });
    }

    // Events
    content.querySelector('#detailCloseBtn').onclick = closeDetailScreen;
    content.querySelector('.fav-btn').onclick = () => Favorites.toggle(uid);

    content.querySelector('#detailPlayBtn').onclick = () => {
      closeDetailScreen();
      if (type === 'series') Player.openSeries(item.key, prog?.epIdx || 0);
      else Player.openMovie(item);
    };

    const restartBtn = content.querySelector('#detailRestartBtn');
    if (restartBtn) restartBtn.onclick = () => {
      closeDetailScreen();
      Player.openSeries(item.key, 0);
    };

    // Star rating
    content.querySelector('.detail-rating').onclick = e => {
      const star = e.target.closest('[data-star]');
      if (!star) return;
      Ratings.set(uid, parseInt(star.dataset.star));
    };

    // Show
    overlay.classList.add('open');
    overlay.scrollTop = 0;
    document.body.style.overflow = 'hidden';
  }

  function closeDetailScreen() {
    document.getElementById('detailOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Public API ──────────────────────────── */
  return {
    renderHome, renderHistory, renderFavorites, renderAbout,
    openDetailScreen, closeDetailScreen,
    makeGridCard, makeCarouselCard,
  };

})();
