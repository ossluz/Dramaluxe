/* ================================================================
   DramaLuxe — profiles.js
   Sistema de perfis estilo Netflix com seleção de avatares
   por personagens dos dramas do catálogo
================================================================ */

window.Profiles = (() => {

  const MAX_PROFILES = 6;
  const STORE_KEY    = 'profiles_v2';
  const ACTIVE_KEY   = 'active_profile';

  /* ── Estado ──────────────────────────────────────────────── */
  let profiles       = [];
  let activeProfile  = null;
  let onSelectCb     = null;  // callback ao escolher perfil

  /* ── Persistência ────────────────────────────────────────── */
  function _load() {
    profiles = Storage.get(STORE_KEY) || [];
    const activeId = Storage.get(ACTIVE_KEY);
    activeProfile = profiles.find(p => p.id === activeId) || null;
  }

  function _save() {
    Storage.set(STORE_KEY, profiles);
    Storage.set(ACTIVE_KEY, activeProfile?.id || null);
  }

  /* ── CRUD de perfis ──────────────────────────────────────── */
  function create(name, avatar) {
    if (profiles.length >= MAX_PROFILES) return null;
    const profile = {
      id: `prof_${Date.now()}_${Math.random().toString(36).slice(2,7)}`,
      name: name.trim() || 'Perfil',
      avatar: avatar || AVATARS.themed[0],
      createdAt: Date.now(),
    };
    profiles.push(profile);
    _save();
    return profile;
  }

  function update(id, changes) {
    const idx = profiles.findIndex(p => p.id === id);
    if (idx === -1) return;
    profiles[idx] = { ...profiles[idx], ...changes };
    if (activeProfile?.id === id) activeProfile = profiles[idx];
    _save();
  }

  function remove(id) {
    profiles = profiles.filter(p => p.id !== id);
    if (activeProfile?.id === id) activeProfile = null;
    _save();
  }

  function select(id) {
    const profile = profiles.find(p => p.id === id);
    if (!profile) return;
    activeProfile = profile;
    _save();
    _hideProfileScreen();
    if (onSelectCb) onSelectCb(profile);
  }

  function getActive()   { return activeProfile; }
  function getAll()      { return profiles; }
  function onSelect(cb)  { onSelectCb = cb; }

  /* ── Verificação inicial ─────────────────────────────────── */
  function requireProfile() {
    _load();
    if (!profiles.length || !activeProfile) {
      _showProfileScreen('select');
      return false;
    }
    return true;
  }

  /* ── Tela de seleção de perfis ───────────────────────────── */
  function _showProfileScreen(mode) {
    const overlay = document.getElementById('profileOverlay');
    if (!overlay) { _buildProfileOverlay(); }
    _renderProfileScreen(mode || 'select');
    document.getElementById('profileOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function _hideProfileScreen() {
    const overlay = document.getElementById('profileOverlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Criar overlay no DOM (uma vez) ─────────────────────── */
  function _buildProfileOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'profileOverlay';
    overlay.className = 'profile-overlay';
    overlay.innerHTML = '<div class="profile-screen" id="profileScreen"></div>';
    document.body.appendChild(overlay);
  }

  /* ── Renderizar tela de seleção ──────────────────────────── */
  function _renderProfileScreen(mode) {
    const screen = document.getElementById('profileScreen');
    if (!screen) return;

    if (mode === 'select') {
      _renderSelectMode(screen);
    } else if (mode === 'create') {
      _renderCreateMode(screen);
    } else if (mode === 'edit') {
      _renderEditMode(screen, mode.profileId);
    }
  }

  function _renderSelectMode(screen) {
    const hasProfiles = profiles.length > 0;
    screen.innerHTML = `
      <div class="ps-header">
        <div class="ps-logo">🎬 DramaLuxe</div>
        <div class="ps-title">Quem está assistindo?</div>
      </div>
      <div class="ps-grid" id="psGrid"></div>
      <div class="ps-footer">
        ${hasProfiles ? '<button class="ps-manage-btn" id="psManageBtn"><i class="fas fa-pencil-alt"></i> Gerenciar Perfis</button>' : ''}
      </div>`;

    const grid = document.getElementById('psGrid');

    // Perfis existentes
    profiles.forEach(p => {
      const card = _makeProfileCard(p, false);
      card.onclick = () => select(p.id);
      grid.appendChild(card);
    });

    // Botão adicionar (se não atingiu limite)
    if (profiles.length < MAX_PROFILES) {
      const addBtn = document.createElement('div');
      addBtn.className = 'ps-add-card';
      addBtn.innerHTML = `
        <div class="ps-add-icon"><i class="fas fa-plus"></i></div>
        <div class="ps-card-name">Adicionar Perfil</div>`;
      addBtn.onclick = () => _renderProfileScreen('create');
      grid.appendChild(addBtn);
    }

    // Gerenciar
    const manageBtn = document.getElementById('psManageBtn');
    if (manageBtn) manageBtn.onclick = () => _renderManageMode(screen);
  }

  function _renderCreateMode(screen) {
    screen.innerHTML = `
      <div class="ps-header">
        <button class="ps-back-btn" id="psBackBtn"><i class="fas fa-arrow-left"></i></button>
        <div class="ps-title">Novo Perfil</div>
      </div>

      <div class="ps-create-body">
        <!-- Avatar grande preview -->
        <div class="ps-avatar-preview" id="psAvatarPreview">
          <div class="ps-avatar-img-wrap" id="psAvatarWrap">
            <span class="ps-avatar-emoji" id="psAvatarEmoji">🐉</span>
          </div>
          <button class="ps-change-avatar-btn" id="psChangeAvatarBtn">
            <i class="fas fa-camera"></i> Escolher Personagem
          </button>
        </div>

        <!-- Nome do perfil -->
        <div class="ps-field">
          <label class="ps-label">Nome do Perfil</label>
          <input class="ps-input" id="psNameInput" type="text"
            placeholder="Ex: Mamãe, João, Maria…" maxlength="20" autocomplete="off">
        </div>

        <!-- Botão salvar -->
        <button class="ps-save-btn" id="psSaveBtn">
          <i class="fas fa-check"></i> Criar Perfil
        </button>
      </div>`;

    let selectedAvatar = AVATARS.themed[0];
    _updateAvatarPreview(selectedAvatar);

    document.getElementById('psBackBtn').onclick  = () => _renderProfileScreen('select');
    document.getElementById('psChangeAvatarBtn').onclick = () => {
      _showAvatarPicker(av => {
        selectedAvatar = av;
        _updateAvatarPreview(av);
      });
    };
    document.getElementById('psSaveBtn').onclick = () => {
      const name = document.getElementById('psNameInput').value.trim();
      if (!name) { document.getElementById('psNameInput').focus(); return; }
      const p = create(name, selectedAvatar);
      if (p) select(p.id);
    };
  }

  function _renderManageMode(screen) {
    screen.innerHTML = `
      <div class="ps-header">
        <button class="ps-back-btn" id="psBackBtn"><i class="fas fa-arrow-left"></i></button>
        <div class="ps-title">Gerenciar Perfis</div>
      </div>
      <div class="ps-manage-list" id="psManageList"></div>`;

    document.getElementById('psBackBtn').onclick = () => _renderSelectMode(screen);
    _renderManageList();
  }

  function _renderManageList() {
    const list = document.getElementById('psManageList');
    if (!list) return;
    list.innerHTML = '';
    profiles.forEach(p => {
      const row = document.createElement('div');
      row.className = 'ps-manage-row';
      const avatarHtml = _avatarHtml(p.avatar, 'ps-manage-avatar');
      row.innerHTML = `
        ${avatarHtml}
        <div class="ps-manage-info">
          <div class="ps-manage-name">${p.name}</div>
          <div class="ps-manage-sub">${_avatarLabel(p.avatar)}</div>
        </div>
        <div class="ps-manage-actions">
          <button class="ps-icon-btn edit-btn" data-id="${p.id}" title="Editar"><i class="fas fa-pencil-alt"></i></button>
          <button class="ps-icon-btn del-btn" data-id="${p.id}" title="Excluir"><i class="fas fa-trash-alt"></i></button>
        </div>`;
      list.appendChild(row);
    });

    list.querySelectorAll('.del-btn').forEach(btn => {
      btn.onclick = () => {
        if (confirm(`Excluir perfil "${profiles.find(p=>p.id===btn.dataset.id)?.name}"?`)) {
          remove(btn.dataset.id);
          _renderManageList();
        }
      };
    });

    list.querySelectorAll('.edit-btn').forEach(btn => {
      btn.onclick = () => _renderEditProfileForm(btn.dataset.id);
    });
  }

  function _renderEditProfileForm(profileId) {
    const screen = document.getElementById('profileScreen');
    const p = profiles.find(x => x.id === profileId);
    if (!p) return;

    screen.innerHTML = `
      <div class="ps-header">
        <button class="ps-back-btn" id="psBackBtn"><i class="fas fa-arrow-left"></i></button>
        <div class="ps-title">Editar Perfil</div>
      </div>
      <div class="ps-create-body">
        <div class="ps-avatar-preview" id="psAvatarPreview">
          <div class="ps-avatar-img-wrap" id="psAvatarWrap"></div>
          <button class="ps-change-avatar-btn" id="psChangeAvatarBtn">
            <i class="fas fa-camera"></i> Trocar Personagem
          </button>
        </div>
        <div class="ps-field">
          <label class="ps-label">Nome do Perfil</label>
          <input class="ps-input" id="psNameInput" type="text" value="${p.name}" maxlength="20" autocomplete="off">
        </div>
        <button class="ps-save-btn" id="psSaveBtn"><i class="fas fa-check"></i> Salvar</button>
      </div>`;

    let selectedAvatar = p.avatar;
    _updateAvatarPreview(selectedAvatar);

    document.getElementById('psBackBtn').onclick = () => _renderManageMode(screen);
    document.getElementById('psChangeAvatarBtn').onclick = () => {
      _showAvatarPicker(av => { selectedAvatar = av; _updateAvatarPreview(av); });
    };
    document.getElementById('psSaveBtn').onclick = () => {
      const name = document.getElementById('psNameInput').value.trim();
      if (!name) return;
      update(profileId, { name, avatar: selectedAvatar });
      _renderManageMode(screen);
    };
  }

  /* ── Avatar picker ───────────────────────────────────────── */
  function _showAvatarPicker(onPick) {
    const existing = document.getElementById('avatarPickerOverlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'avatarPickerOverlay';
    overlay.className = 'avatar-picker-overlay';

    const groups = AVATARS.getAllGroups();

    // Filter tabs
    const tabs = [
      { key:'all',          label:'Todos' },
      { key:'protagonist',  label:'👑 Protagonistas' },
      { key:'love_interest',label:'💕 Par Romântico' },
      { key:'villain',      label:'😈 Vilões' },
      { key:'secondary',    label:'🌟 Secundários' },
      { key:'themed',       label:'🎭 Temáticos' },
    ];

    overlay.innerHTML = `
      <div class="ap-container">
        <div class="ap-header">
          <div class="ap-title">Escolha seu Personagem</div>
          <button class="ap-close" id="apClose"><i class="fas fa-times"></i></button>
        </div>
        <div class="ap-tabs" id="apTabs">
          ${tabs.map((t,i) => `<button class="ap-tab ${i===0?'active':''}" data-filter="${t.key}">${t.label}</button>`).join('')}
        </div>
        <div class="ap-body" id="apBody"></div>
      </div>`;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('open'));

    document.getElementById('apClose').onclick = () => {
      overlay.classList.remove('open');
      setTimeout(() => overlay.remove(), 300);
    };

    // Tab filtering
    let currentFilter = 'all';
    overlay.querySelectorAll('.ap-tab').forEach(tab => {
      tab.onclick = () => {
        overlay.querySelectorAll('.ap-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentFilter = tab.dataset.filter;
        _renderPickerBody(currentFilter, groups, onPick, overlay);
      };
    });

    _renderPickerBody('all', groups, onPick, overlay);
  }

  function _renderPickerBody(filter, groups, onPick, overlay) {
    const body = document.getElementById('apBody');
    body.innerHTML = '';

    groups.forEach(group => {
      // Filtrar items do grupo
      let items = group.items;
      if (filter !== 'all') {
        if (filter === 'themed') {
          items = items.filter(i => i.type === 'themed');
        } else {
          items = items.filter(i => i.role === filter);
        }
      }
      if (!items.length) return;

      // Título do grupo
      const groupEl = document.createElement('div');
      groupEl.className = 'ap-group';
      groupEl.innerHTML = `<div class="ap-group-label">${group.label}</div>`;

      const grid = document.createElement('div');
      grid.className = 'ap-grid';

      items.forEach(av => {
        const card = document.createElement('div');
        card.className = 'ap-card';
        card.innerHTML = `
          <div class="ap-card-avatar">${_avatarHtmlForPicker(av)}</div>
          <div class="ap-card-name">${av.displayName || av.characterName || av.label}</div>
          ${av.actorName ? `<div class="ap-card-actor">${av.actorName}</div>` : ''}
          ${av.roleBadge ? `<div class="ap-card-badge" style="color:${av.roleColor||'#a855f7'}">${av.roleBadge}</div>` : ''}
          ${av.dramaLabel ? `<div class="ap-card-drama">${av.dramaLabel}</div>` : ''}`;
        card.onclick = () => {
          onPick(av);
          overlay.classList.remove('open');
          setTimeout(() => overlay.remove(), 300);
        };
        grid.appendChild(card);
      });

      groupEl.appendChild(grid);
      body.appendChild(groupEl);
    });

    if (!body.children.length) {
      body.innerHTML = '<div class="ap-empty"><i class="fas fa-search"></i><p>Nenhum personagem nessa categoria</p></div>';
    }
  }

  /* ── Avatar helpers ──────────────────────────────────────── */
  function _updateAvatarPreview(av) {
    const wrap = document.getElementById('psAvatarWrap');
    if (!wrap) return;
    wrap.innerHTML = '';
    if (av.type === 'themed') {
      wrap.innerHTML = `<span class="ps-avatar-emoji">${av.emoji}</span>`;
      wrap.style.background = av.bg || '#1a1a25';
    } else {
      const url = AVATARS.getAvatarUrl(av);
      wrap.innerHTML = `<img src="${url}" alt="${av.displayName||''}" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(av.displayName||'DL')}&size=256&background=1a1a2e&color=a855f7&bold=true&format=svg'">`;
      wrap.style.background = 'transparent';
    }
  }

  function _avatarHtml(av, className) {
    if (!av) return `<div class="${className} ps-av-default"><i class="fas fa-user"></i></div>`;
    if (av.type === 'themed') {
      return `<div class="${className}" style="background:${av.bg||'#1a1a25'};display:flex;align-items:center;justify-content:center;font-size:1.4rem;">${av.emoji}</div>`;
    }
    const url = AVATARS.getAvatarUrl(av);
    return `<div class="${className}" style="overflow:hidden;border-radius:50%;"><img src="${url}" style="width:100%;height:100%;object-fit:cover;" alt=""></div>`;
  }

  function _avatarHtmlForPicker(av) {
    if (av.type === 'themed') {
      return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;background:${av.bg||'#1a1a25'};border-radius:50%;">${av.emoji}</div>`;
    }
    const url = AVATARS.getAvatarUrl(av);
    return `<img src="${url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="" onerror="this.parentElement.innerHTML='<span style=font-size:1.5rem>${av.emoji||'🎭'}</span>'">`;
  }

  function _avatarLabel(av) {
    if (!av) return 'Sem avatar';
    if (av.type === 'themed') return av.label;
    return `${av.characterName || av.displayName || ''}${av.actorName ? ` · ${av.actorName}` : ''}`;
  }

  function _makeProfileCard(p, editMode) {
    const card = document.createElement('div');
    card.className = 'ps-profile-card';
    const avHtml = _avatarHtml(p.avatar, 'ps-card-avatar');
    card.innerHTML = `
      ${avHtml}
      <div class="ps-card-name">${p.name}</div>
      ${editMode ? `<button class="ps-card-edit" data-id="${p.id}"><i class="fas fa-pencil-alt"></i></button>` : ''}`;
    return card;
  }

  /* ── Nav avatar display ──────────────────────────────────── */
  function updateNavAvatar() {
    const navAv = document.getElementById('navProfileAvatar');
    if (!navAv || !activeProfile) return;
    const av = activeProfile.avatar;
    if (av?.type === 'themed') {
      navAv.innerHTML = `<span style="font-size:1.1rem">${av.emoji}</span>`;
      navAv.style.background = av.bg || '#1a1a25';
    } else {
      const url = AVATARS.getAvatarUrl(av);
      navAv.innerHTML = `<img src="${url}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" alt="">`;
      navAv.style.background = 'transparent';
    }
  }

  /* ── Public ──────────────────────────────────────────────── */
  return {
    init() { _load(); },
    requireProfile,
    showSelect()  { _showProfileScreen('select'); },
    create, update, remove, select,
    getActive, getAll, onSelect,
    updateNavAvatar,
  };

})();
