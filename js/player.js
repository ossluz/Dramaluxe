/* ================================================================
   DramaLuxe — player.js  v3
   + YouTube IFrame API (timestamp + qualidade)
   + Continuar de onde parou
================================================================ */

window.Player = (() => {

  const PLATFORMS = {
    youtube:{
      embed:(id,start)=>`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&enablejsapi=1${start>5?'&start='+Math.floor(start):''}`,
      watch:(id)=>`https://www.youtube.com/watch?v=${id}`,
      label:'YouTube',color:'#ff0000',icon:'fab fa-youtube',
    },
    okru:{
      embed:(id)=>`https://ok.ru/videoembed/${id}`,
      watch:(id)=>`https://ok.ru/video/${id}`,
      label:'OK.ru',color:'#f7931e',icon:'fas fa-play-circle',
    },
    dailymotion:{
      embed:(id)=>`https://www.dailymotion.com/embed/video/${id}?autoplay=1&ui-highlight=a855f7&ui-logo=false`,
      watch:(id)=>`https://www.dailymotion.com/video/${id}`,
      label:'Dailymotion',color:'#0066DC',icon:'fas fa-play-circle',
    },
    bilibili:{
      embed:(id)=>`https://player.bilibili.com/player.html?bvid=${id}&page=1&autoplay=0&danmaku=0&high_quality=1`,
      watch:(id)=>`https://www.bilibili.com/video/${id}`,
      label:'Bilibili',color:'#00a1d6',icon:'fas fa-play-circle',
    },
    vimeo:{
      embed:(id)=>`https://player.vimeo.com/video/${id}?autoplay=1&color=a855f7&title=0&byline=0`,
      watch:(id)=>`https://vimeo.com/${id}`,
      label:'Vimeo',color:'#1ab7ea',icon:'fas fa-play-circle',
    },
  };

  // Qualidades disponíveis no YT
  const QUALITIES = [
    {value:'auto', label:'Auto'},
    {value:'hd1080', label:'1080p HD'},
    {value:'hd720', label:'720p'},
    {value:'large', label:'480p'},
    {value:'medium',label:'360p'},
    {value:'small', label:'240p'},
  ];
  let currentQuality = Storage.get('quality') || 'auto';
  let currentTimestamp = 0;
  let tsInterval = null;

  let state = { open:false, item:null, epIdx:0, seriesKey:null };

  /* ── helpers ── */
  function getPlat(ep){ return typeof ep==='string'?'youtube':(ep.platform||'youtube'); }
  function getId(ep)  { return typeof ep==='string'?ep:ep.id; }
  function embedUrl(ep, startSec){
    const p=getPlat(ep), id=getId(ep);
    const fn = PLATFORMS[p]?.embed;
    return fn ? fn(id, startSec||0) : PLATFORMS.youtube.embed(id,0);
  }
  function watchUrl(ep){ const p=getPlat(ep),id=getId(ep); return PLATFORMS[p]?.watch(id)||`https://youtube.com/watch?v=${id}`; }
  function platLabel(ep){ return PLATFORMS[getPlat(ep)]?.label||'YouTube'; }
  function platColor(ep){ return PLATFORMS[getPlat(ep)]?.color||'#ff0000'; }

  /* ── Timestamp via postMessage ── */
  function startTsTracking(){
    stopTsTracking();
    tsInterval = setInterval(()=>{
      try{
        const iframe = document.querySelector('#vwrap iframe');
        if(!iframe) return;
        iframe.contentWindow.postMessage('{"event":"listening","id":1}','*');
        iframe.contentWindow.postMessage('{"event":"command","func":"getCurrentTime","args":"","id":1}','*');
      }catch(e){}
    }, 10000); // every 10s

    window.addEventListener('message', _onYTMessage);
  }
  function stopTsTracking(){
    clearInterval(tsInterval);
    window.removeEventListener('message', _onYTMessage);
  }
  function _onYTMessage(e){
    try{
      const data = typeof e.data==='string' ? JSON.parse(e.data) : e.data;
      // YT IFrame API info event
      if(data?.info?.currentTime !== undefined){
        currentTimestamp = data.info.currentTime;
        _saveTimestamp();
      }
    }catch(e){}
  }
  function _saveTimestamp(){
    if(!state.open) return;
    const uid = state.seriesKey ? `series_${state.seriesKey}` : `movie_${state.item?.id||''}`;
    Progress.saveTimestamp(uid, state.epIdx, currentTimestamp);
  }

  /* ── Build iframe ── */
  function buildFrame(ep, startSec){
    const plat  = getPlat(ep);
    const src   = embedUrl(ep, startSec);
    const link  = watchUrl(ep);
    const label = platLabel(ep);
    const color = platColor(ep);
    const isYT  = plat==='youtube';

    // Quality selector (only for YT)
    const qualOpts = isYT ? QUALITIES.map(q=>
      `<option value="${q.value}" ${currentQuality===q.value?'selected':''}>${q.label}</option>`
    ).join('') : '';
    const qualSelect = isYT ? `
      <select class="quality-select" id="qualitySelect" title="Qualidade">
        ${qualOpts}
      </select>` : '';

    return `
      <iframe id="ytPlayer"
        src="${src}"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media; web-share"
        allowfullscreen loading="eager"
        style="position:absolute;top:0;left:0;width:100%;height:calc(100% - 44px);border:none;"
      ></iframe>
      <div class="player-bar">
        <span class="player-plat" style="--plat-color:${color}">
          <i class="${PLATFORMS[plat]?.icon||'fas fa-play-circle'}"></i> ${label}
          ${startSec>5?`<span class="player-resume-tag">↩ Retomando</span>`:''}
        </span>
        <div class="player-bar-right">
          ${qualSelect}
          <a class="player-ext" href="${link}" target="_blank" rel="noopener">
            <i class="fas fa-external-link-alt"></i> Abrir
          </a>
        </div>
      </div>`;
  }

  /* ── Open ── */
  function openMovie(item){
    state = {open:true,item,epIdx:0,seriesKey:null};
    const uid = `movie_${item.id||item.title}`;
    const saved = Progress.getTimestamp(uid, 0);
    currentTimestamp = saved;
    _renderModal(item.id||item, item, saved);
    _record(item);
  }
  function openSeries(key,epIdx){
    epIdx = epIdx||0;
    const s = CATALOG.series.find(x=>x.key===key);
    if(!s) return;
    state = {open:true,item:s,epIdx,seriesKey:key};
    const uid = `series_${key}`;
    const saved = Progress.getTimestamp(uid, epIdx);
    currentTimestamp = saved;
    _renderModal(s.episodes[epIdx], s, saved);
    _record(s, epIdx);
  }
  function openItem(item, epIdx){
    if(item.type==='series') openSeries(item.key||item.seriesKey, epIdx!==undefined?epIdx:(item.epIdx||0));
    else openMovie(item.movieRef||item);
  }

  /* ── Render ── */
  function _renderModal(ep, item, startSec){
    const vwrap    = document.getElementById('vwrap');
    const titleEl  = document.getElementById('modalTitle');
    const subEl    = document.getElementById('modalSubtitle');
    const descEl   = document.getElementById('modalDescText');
    const epNavEl  = document.getElementById('modalEpNav');
    const epListEl = document.getElementById('modalEpList');

    stopTsTracking();
    vwrap.innerHTML = buildFrame(ep, startSec||0);

    // Wire quality selector
    const qs = document.getElementById('qualitySelect');
    if(qs) qs.onchange = ()=>{ currentQuality=qs.value; Storage.set('quality',currentQuality); _reloadWithQuality(ep); };

    // Fullscreen
    const fsBtn = document.getElementById('fsBtn');
    if(fsBtn) fsBtn.onclick = toggleFullscreen;

    const isSeries = !!state.seriesKey;
    titleEl.textContent = isSeries ? `${item.title}  —  Ep. ${state.epIdx+1}` : item.title;
    subEl.innerHTML     = _badges(item, isSeries, ep);

    if(item.desc){ descEl.textContent=item.desc; descEl.style.display='block'; }
    else descEl.style.display='none';

    if(isSeries){
      const total = item.episodes.length;
      epNavEl.innerHTML=`
        <button class="ep-nav-btn" id="epPrev" ${state.epIdx===0?'disabled':''}><i class="fas fa-arrow-left"></i> Anterior</button>
        <span class="ep-counter">Ep. ${state.epIdx+1}/${total}</span>
        <button class="ep-nav-btn" id="epNext" ${state.epIdx===total-1?'disabled':''}>Próximo <i class="fas fa-arrow-right"></i></button>`;
      document.getElementById('epPrev').onclick = ()=>{ if(state.epIdx>0){ state.epIdx--; openSeries(state.seriesKey,state.epIdx); } };
      document.getElementById('epNext').onclick = ()=>{ if(state.epIdx<item.episodes.length-1){ state.epIdx++; openSeries(state.seriesKey,state.epIdx); } };

      epListEl.innerHTML=`<div class="ep-grid-label">Episódios</div><div class="ep-grid" id="epGrid"></div>`;
      const grid = document.getElementById('epGrid');
      item.episodes.forEach((_,i)=>{
        const btn=document.createElement('button');
        btn.className='ep-btn'+(i===state.epIdx?' current':'');
        btn.textContent=i+1;
        btn.onclick=()=>openSeries(state.seriesKey,i);
        grid.appendChild(btn);
      });
    } else {
      epNavEl.innerHTML='';
      epListEl.innerHTML=item.cast?`<div class="cast-row"><i class="fas fa-users"></i> ${item.cast}</div>`:'';
    }

    document.getElementById('playerModal').classList.add('open');
    document.body.style.overflow='hidden';
    startTsTracking();
  }

  function _reloadWithQuality(ep){
    const src = embedUrl(ep, currentTimestamp);
    const iframe = document.getElementById('ytPlayer');
    if(iframe) iframe.src = src;
  }

  function _badges(item, isSeries, ep){
    const RI={'c-drama':'🐉','k-drama':'⭐','j-drama':'🌸','thai-drama':'🌴'};
    const RL={'c-drama':'C-Drama','k-drama':'K-Drama','j-drama':'J-Drama','thai-drama':'Thai-Drama'};
    const GL={romance:'Romance',fantasy:'Fantasia',drama:'Drama',comedy:'Comédia',action:'Ação'};
    const AL={dubbed:'🎙 Dublado',subbed:'📝 Legendado'};
    const pC = platColor(ep); const pL = platLabel(ep);
    return `
      <span class="modal-pill">${RI[item.region]||''} ${RL[item.region]||item.region}</span>
      ${item.year?`<span class="modal-pill">${item.year}</span>`:''}
      ${item.rating?`<span class="modal-pill gold">⭐ ${item.rating}</span>`:''}
      <span class="modal-pill">${GL[item.genre]||item.genre}</span>
      ${item.audio?`<span class="modal-pill accent">${AL[item.audio]||item.audio}</span>`:''}
      ${isSeries?`<span class="modal-pill accent"><i class="fas fa-tv"></i> ${item.episodes.length} Ep.</span>`:`<span class="modal-pill accent"><i class="fas fa-film"></i> Filme</span>`}
      <span class="modal-pill" style="color:${pC};border-color:${pC}"><i class="fas fa-play-circle"></i> ${pL}</span>`;
  }

  function _record(item, epIdx){
    const isS = !!item.key;
    const uid = isS ? `series_${item.key}` : `movie_${item.id||item.title}`;
    Progress.save(uid, epIdx||0);
    const ep  = isS ? item.episodes[epIdx||0] : item.id;
    const id  = typeof ep==='string'?ep:(ep?.id||item.id);
    const thumb = item.thumb||(id&&getPlat(ep||id)==='youtube'?`https://img.youtube.com/vi/${id}/hqdefault.jpg`:`https://placehold.co/320x180/1a1a25/a855f7?text=${encodeURIComponent(item.title)}`);
    History.add({
      uid,
      title: isS?`${item.title} — Ep. ${(epIdx||0)+1}`:item.title,
      thumb, type:isS?'series':'movie',
      region:item.region, genre:item.genre,
      seriesKey:item.key, epIdx:epIdx||0,
      movieRef: isS?null:item,
    });
  }

  /* ── Close ── */
  function close(){
    stopTsTracking();
    _saveTimestamp();
    document.getElementById('vwrap').innerHTML='';
    document.getElementById('playerModal').classList.remove('open');
    document.body.style.overflow='';
    state.open=false;
    if(document.fullscreenElement) document.exitFullscreen().catch(()=>{});
  }

  function toggleFullscreen(){
    const el = document.getElementById('playerModal');
    if(!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  return {openItem,openMovie,openSeries,close,toggleFullscreen,PLATFORMS,getPlat,getId,resolveThumbnail:(item,cb)=>{
    if(item.thumb){cb(item.thumb);return;}
    const ep=item.episodes?item.episodes[0]:null;
    const id=ep?getId(ep):item.id;
    if(!id){cb(null);return;}
    const max=`https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    const hq=`https://img.youtube.com/vi/${id}/hqdefault.jpg`;
    const img=new Image();
    img.onload=()=>cb(max); img.onerror=()=>cb(hq); img.src=max;
  }};
})();
