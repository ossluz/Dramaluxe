/* ================================================================
   DramaLuxe — admin-search.js
   Ferramenta semi-automática de busca de vídeos (Cenário B)
   Requer chave da YouTube Data API v3
================================================================ */

window.AdminSearch = (() => {

  const SEARCH_TERMS = {
    'c-drama': {
      dubbed: [
        'drama chinês dublado português completo romance 2024',
        'cdrama dublado PT-BR filme completo 2024',
        'drama chines dublado romance CEO 2024',
        'drama chinês fantasia dublado português 2024',
      ],
      subbed: [
        'cdrama legendado português completo 2024',
        'drama chinês legendado PT episódio 1 2024',
        'xianxia cdrama legendado português romance fantasia',
        'dorama chines legendado pt-br completo 2024',
      ],
    },
    'k-drama': {
      dubbed: [
        'k-drama dublado português romance completo 2024',
        'kdrama dublado pt-br episódio 1 2024',
      ],
      subbed: [
        'k-drama legendado português completo 2024',
        'kdrama legendado pt-br episódio 1 romance 2024',
        'drama coreano legendado português episódio 2024',
      ],
    },
    'j-drama': {
      dubbed: ['j-drama dublado português romance completo 2024'],
      subbed: [
        'j-drama legendado português completo 2024',
        'jdrama romance legendado pt episódio 2024',
      ],
    },
    'thai-drama': {
      dubbed: ['thai drama dublado português completo 2024'],
      subbed: [
        'thai drama legendado português completo 2024',
        'drama tailandês legendado pt-br 2024',
        'thai romance legendado português episódio 2024',
      ],
    },
  };

  /* ── Build/show the admin panel ─────────── */
  function open() {
    // Auto-salvar chave se ainda não estiver salva
    if (!Storage.get('ytApiKey')) {
      Storage.set('ytApiKey', 'AIzaSyAyn-0X2T-XRiHNxUS_nMpS6xIc1Jd8G-k');
    }
    let overlay = document.getElementById('adminSearchOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'adminSearchOverlay';
      overlay.className = 'admin-overlay';
      overlay.innerHTML = `
        <div class="admin-panel">
          <div class="admin-header">
            <div class="admin-title"><i class="fas fa-search-plus"></i> Buscar Novos Vídeos</div>
            <button class="admin-close" id="adminClose"><i class="fas fa-times"></i></button>
          </div>

          <div class="admin-body">

            <!-- API Key -->
            <div class="admin-section">
              <div class="admin-label">🔑 Chave da YouTube Data API v3</div>
              <div class="admin-row">
                <input class="admin-input" id="apiKeyInput" type="password"
                  placeholder="AIzaSy... (obtenha em console.cloud.google.com)"
                  value="${Storage.get('ytApiKey')||'AIzaSyAyn-0X2T-XRiHNxUS_nMpS6xIc1Jd8G-k'}">
                <button class="admin-btn-sm" id="saveApiKey">Salvar</button>
              </div>
              <div class="admin-hint">
                <a href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noopener">
                  ↗ Obter chave gratuita (100 buscas/dia)
                </a>
              </div>
            </div>

            <!-- Filtros de busca -->
            <div class="admin-section">
              <div class="admin-label">🎯 O que buscar</div>
              <div class="admin-row" style="flex-wrap:wrap;gap:.5rem;">
                <select class="admin-select" id="searchRegion">
                  <option value="all">Todas as Regiões</option>
                  <option value="c-drama">🐉 C-Drama</option>
                  <option value="k-drama">⭐ K-Drama</option>
                  <option value="j-drama">🌸 J-Drama</option>
                  <option value="thai-drama">🌴 Thai-Drama</option>
                </select>
                <select class="admin-select" id="searchAudio">
                  <option value="both">Dublado + Legendado</option>
                  <option value="dubbed">🎙 Só Dublados</option>
                  <option value="subbed">📝 Só Legendados</option>
                </select>
                <select class="admin-select" id="searchType">
                  <option value="both">Filmes + Séries</option>
                  <option value="movie">Filmes</option>
                  <option value="series">Séries</option>
                </select>
              </div>
              <div class="admin-row" style="margin-top:.5rem;">
                <input class="admin-input" id="customQuery" placeholder="Ou pesquisa personalizada... (opcional)">
              </div>
              <button class="admin-btn-search" id="doSearch">
                <i class="fas fa-search"></i> Buscar Vídeos Agora
              </button>
            </div>

            <!-- Resultados -->
            <div class="admin-section" id="adminResultsSection" style="display:none;">
              <div class="admin-label" id="adminResultsLabel">Resultados</div>
              <div class="admin-results" id="adminResults"></div>
              <div class="admin-row" style="justify-content:space-between;margin-top:.75rem;">
                <button class="admin-btn-sm" id="selectAllBtn">Selecionar todos</button>
                <button class="admin-btn-add" id="addSelectedBtn" disabled>
                  <i class="fas fa-plus"></i> Adicionar Selecionados ao Catálogo
                </button>
              </div>
            </div>

            <!-- Pending to add -->
            <div class="admin-section" id="adminPendingSection" style="display:none;">
              <div class="admin-label">📋 Prontos para adicionar</div>
              <div class="admin-pending-list" id="adminPendingList"></div>
              <button class="admin-btn-copy" id="adminCopyBtn">
                <i class="fas fa-copy"></i> Copiar código para catalog.js
              </button>
            </div>

          </div>
        </div>`;
      document.body.appendChild(overlay);
      _bindEvents(overlay);
    }
    overlay.classList.add('open');
  }

  function close() {
    document.getElementById('adminSearchOverlay')?.classList.remove('open');
  }

  /* ── Events ─────────────────────────────── */
  let _selectedResults = [];
  let _pendingItems = [];

  function _bindEvents(overlay) {
    overlay.querySelector('#adminClose').onclick = close;
    overlay.addEventListener('click', e => { if(e.target===overlay) close(); });

    overlay.querySelector('#saveApiKey').onclick = () => {
      const key = overlay.querySelector('#apiKeyInput').value.trim();
      if (key) { Storage.set('ytApiKey', key); _showMsg('Chave salva!', 'success'); }
    };

    overlay.querySelector('#doSearch').onclick = () => _performSearch();

    overlay.querySelector('#selectAllBtn').onclick = () => {
      const checks = overlay.querySelectorAll('.result-check');
      const allChecked = [...checks].every(c=>c.checked);
      checks.forEach(c => c.checked = !allChecked);
      _updateAddBtn();
    };

    overlay.querySelector('#addSelectedBtn').onclick = () => {
      const results = overlay.querySelectorAll('.result-item');
      _selectedResults = [];
      results.forEach(r => {
        if (r.querySelector('.result-check').checked) {
          _selectedResults.push(JSON.parse(r.dataset.item));
        }
      });
      _buildPendingCode(_selectedResults);
    };

    overlay.querySelector('#adminCopyBtn').onclick = () => {
      const code = overlay.querySelector('#adminPendingList').textContent;
      navigator.clipboard.writeText(code).then(() => _showMsg('Código copiado!', 'success'));
    };
  }

  function _updateAddBtn() {
    const overlay = document.getElementById('adminSearchOverlay');
    if (!overlay) return;
    const checked = overlay.querySelectorAll('.result-check:checked').length;
    const btn = overlay.querySelector('#addSelectedBtn');
    btn.disabled = checked === 0;
    btn.textContent = checked > 0 ? `Adicionar ${checked} selecionados` : 'Adicionar Selecionados';
  }

  /* ── YouTube search ─────────────────────── */
  async function _performSearch() {
    const apiKey = Storage.get('ytApiKey');
    if (!apiKey) {
      _showMsg('❌ Insira a chave da API primeiro.', 'error');
      return;
    }

    const region  = document.getElementById('searchRegion').value;
    const audio   = document.getElementById('searchAudio').value;
    const type    = document.getElementById('searchType').value;
    const custom  = document.getElementById('customQuery').value.trim();

    const searchBtn = document.getElementById('doSearch');
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando…';
    searchBtn.disabled = true;

    try {
      let queries = [];
      if (custom) {
        queries = [custom];
      } else {
        const regions = region === 'all' ? Object.keys(SEARCH_TERMS) : [region];
        const audios  = audio === 'both' ? ['dubbed','subbed'] : [audio];
        regions.forEach(r => {
          audios.forEach(a => {
            const terms = SEARCH_TERMS[r]?.[a] || [];
            terms.forEach(t => queries.push(t));
          });
        });
      }

      // Deduplicate + limit to first 4 queries to save quota
      queries = [...new Set(queries)].slice(0, 4);

      const existingIds = CATALOG.getAllIds();
      const allItems = [];

      for (const q of queries) {
        const items = await _searchYT(apiKey, q, type);
        items.forEach(item => {
          if (!existingIds.has(item.videoId) && !allItems.find(i => i.videoId === item.videoId)) {
            allItems.push(item);
          }
        });
      }

      _renderResults(allItems);
    } catch (err) {
      _showMsg('❌ Erro na busca: ' + err.message, 'error');
    } finally {
      searchBtn.innerHTML = '<i class="fas fa-search"></i> Buscar Vídeos Agora';
      searchBtn.disabled = false;
    }
  }

  async function _searchYT(apiKey, q, type) {
    const vidType = type === 'series' ? 'any' : 'video';
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=${vidType}&q=${encodeURIComponent(q)}&maxResults=10&relevanceLanguage=pt&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'Erro na API');
    }
    const data = await res.json();
    return (data.items || [])
      .filter(item => item.id?.videoId)
      .map(item => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        description: item.snippet.description?.slice(0, 150) || '',
        thumb: item.snippet.thumbnails?.high?.url || `https://img.youtube.com/vi/${item.id.videoId}/hqdefault.jpg`,
        publishedAt: item.snippet.publishedAt?.slice(0,10) || '',
        // Auto-detect region and audio from title/description
        region: _detectRegion(item.snippet.title + ' ' + item.snippet.channelTitle),
        audio: _detectAudio(item.snippet.title + ' ' + item.snippet.description),
      }));
  }

  function _detectRegion(text) {
    const t = text.toLowerCase();
    if (t.match(/chine[sz]|cdrama|c-drama|xianxia|wuxia/)) return 'c-drama';
    if (t.match(/korean|corea|kdrama|k-drama|coreano/)) return 'k-drama';
    if (t.match(/japan|japon|jdrama|j-drama/)) return 'j-drama';
    if (t.match(/thai|tailand|tailandê/)) return 'thai-drama';
    return 'c-drama';
  }

  function _detectAudio(text) {
    const t = text.toLowerCase();
    if (t.match(/dubla|dubbed|dublagem|pt-br.*dub|dub.*port/)) return 'dubbed';
    return 'subbed';
  }

  /* ── Render results ─────────────────────── */
  function _renderResults(items) {
    const section   = document.getElementById('adminResultsSection');
    const container = document.getElementById('adminResults');
    const label     = document.getElementById('adminResultsLabel');
    const existingIds = CATALOG.getAllIds();

    section.style.display = 'block';

    if (!items.length) {
      container.innerHTML = '<div class="admin-empty"><i class="fas fa-search"></i><p>Nenhum resultado novo encontrado.<br>Tente outros termos ou verifique sua chave de API.</p></div>';
      label.textContent = 'Resultados (0)';
      return;
    }

    label.textContent = `Resultados (${items.length}) — ${existingIds.size} já no catálogo`;

    container.innerHTML = items.map((item, i) => {
      const isDup = existingIds.has(item.videoId);
      return `
        <div class="result-item ${isDup?'result-dup':''}" data-item='${JSON.stringify(item)}'>
          <input type="checkbox" class="result-check" ${isDup?'disabled':''} ${isDup?'':'checked'} onchange="window._adminUpdateBtn()">
          <img class="result-thumb" src="${item.thumb}" loading="lazy" alt="">
          <div class="result-info">
            <div class="result-title">${item.title}</div>
            <div class="result-meta">
              <span>${item.channel}</span>
              <span>${item.publishedAt}</span>
              <span class="result-badge" style="background:${item.audio==='dubbed'?'#7c3aed':'#1d4ed8'}">${item.audio==='dubbed'?'🎙 Dublado':'📝 Legendado'}</span>
              <span class="result-badge">${{'c-drama':'🐉','k-drama':'⭐','j-drama':'🌸','thai-drama':'🌴'}[item.region]||'🎬'} ${item.region}</span>
            </div>
            ${isDup?'<div class="result-dup-tag"><i class="fas fa-check-circle"></i> Já está no catálogo</div>':''}
          </div>
          <a class="result-preview" href="https://youtube.com/watch?v=${item.videoId}" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i></a>
        </div>`;
    }).join('');

    window._adminUpdateBtn = _updateAddBtn;
    _updateAddBtn();
  }

  /* ── Build code to copy ─────────────────── */
  function _buildPendingCode(items) {
    const section = document.getElementById('adminPendingSection');
    const list    = document.getElementById('adminPendingList');

    section.style.display = 'block';

    const code = items.map(item => {
      const genreGuess = _guessGenre(item.title + ' ' + item.description);
      return `  {platform:'youtube',id:'${item.videoId}',audio:'${item.audio}',\n    title:'${item.title.replace(/'/g,"\\'")}',\n    region:'${item.region}',genre:'${genreGuess}',year:${item.publishedAt.slice(0,4)||new Date().getFullYear()},\n    cast:'${item.channel}',\n    desc:'${item.description.replace(/'/g,"\\'").replace(/\n/g,' ')}'},`;
    }).join('\n');

    list.textContent = `// Cole dentro de CATALOG.movies: [\n${code}\n// ...`;
    list.scrollIntoView({ behavior:'smooth' });
  }

  function _guessGenre(text) {
    const t = text.toLowerCase();
    if (t.match(/fantasia|fantasy|xianxia|wuxia|imortal|demon|fairy|magic/)) return 'fantasy';
    if (t.match(/romance|amor|love|kiss|casal|namorad/)) return 'romance';
    if (t.match(/ação|action|luta|guerra|batalha|fight/)) return 'action';
    if (t.match(/comédia|comedy|engraçad|funny/)) return 'comedy';
    return 'drama';
  }

  /* ── Msg helper ──────────────────────────── */
  function _showMsg(msg, type) {
    const el = document.createElement('div');
    el.className = `admin-msg admin-msg-${type}`;
    el.textContent = msg;
    document.getElementById('adminSearchOverlay')?.querySelector('.admin-body')?.prepend(el);
    setTimeout(() => el.remove(), 3000);
  }

  return { open, close };
})();
