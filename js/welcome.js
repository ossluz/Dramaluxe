/* ================================================================
   DramaLuxe — welcome.js
   Tela de boas-vindas estilo Netflix
   Sequência: Boas-vindas → Login Google → Criar Perfil → App
================================================================ */

window.Welcome = (() => {

  /* ── Thumbnails para o collage de fundo ─ */
  const COLLAGE_IDS = [
    // YouTube IDs de todos os conteúdos para montar o grid de fundo
    'nbsUjQtY05g','rT1O8P8Ru0U','E1LTggMI4l0','RYmJdIov0wE',
    'AuLdrZbjLi8','s15GuuW3hnU','nc7wmEgghCs','1kT9EIsAras',
    'BHWT42AytOQ','PowS8vWMhlc','DwXZyZl5IyI','nJiRYFcMgo0',
    'JkDKCDGMQiY','CqyHWS2jaso','rLWKU0i5GHE','6c1KKkt4ZfI',
    'w9OoW7_oTu4','Q4RkSMDKXTQ','nuoj9O6GWLY','RhlVtWnPlq0',
    'J5pGxMzkIB4','2G98uL6jOOI','jSV5rxG22Rg','0Z8ZsFIiOzc',
    'HXBoJAkOVDE','lGMBaTZCLTY','GdAlV57gHFM','eo9FXA3qEVY',
    'z8N1fulMZ5w','D-lsIrv-7q0','kN-Bcgyulbk','hlfN3ilBKK4',
    '2MzJol-I_Wk','iwTs_DdGZXc','V970IPHbFPM','-Baw1BNx5WA',
    '9t5BcxtXfc0','4Ib9YO7mKVY','p1VgwRMz6tg','Rp9Kv2WqN5M',
  ];

  /* ── State ───────────────────────────── */
  let _overlay = null;
  let _onDoneCb = null;

  /* ── Public: show welcome screen ─────── */
  function show(onDone) {
    _onDoneCb = onDone;
    _build();
  }

  /* ── Build the overlay ───────────────── */
  function _build() {
    if (_overlay) { _overlay.remove(); }

    _overlay = document.createElement('div');
    _overlay.id = 'welcomeOverlay';
    _overlay.className = 'wlc-overlay';

    _overlay.innerHTML = `
      <!-- Collage de fundo animado -->
      <div class="wlc-collage" id="wlcCollage"></div>
      <div class="wlc-collage-fade"></div>

      <!-- Conteúdo central -->
      <div class="wlc-center">

        <!-- Logo -->
        <div class="wlc-logo">
          <div class="wlc-logo-icon"><i class="fas fa-play"></i></div>
          <span>DramaLuxe</span>
        </div>

        <!-- Tagline -->
        <div class="wlc-tagline">
          Dramas Asiáticos em Português.<br>
          <span>C-Drama, K-Drama, J-Drama, Thai-Drama.</span>
        </div>

        <!-- Botões de entrada -->
        <div class="wlc-actions" id="wlcActions">
          <button class="wlc-btn-google" id="wlcGoogleBtn">
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 16 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.3C9.7 35.7 16.3 44 24 44z"/>  
              <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.2 5.2C41.2 35.2 44 30 44 24c0-1.3-.1-2.6-.4-3.9z"/>
            </svg>
            Entrar com Google
          </button>

          <div class="wlc-divider"><span>ou</span></div>

          <button class="wlc-btn-guest" id="wlcGuestBtn">
            <i class="fas fa-user-circle"></i>
            Continuar sem login
          </button>
        </div>

        <!-- Status de loading -->
        <div class="wlc-status" id="wlcStatus" style="display:none"></div>

        <!-- Termos -->
        <div class="wlc-terms">
          Ao entrar você concorda com os termos de uso. Os dados são salvos
          localmente no seu dispositivo ou na sua conta Google.
        </div>
      </div>`;

    document.body.appendChild(_overlay);
    requestAnimationFrame(() => _overlay.classList.add('visible'));

    // Build collage
    _buildCollage();

    // Events
    document.getElementById('wlcGoogleBtn').onclick  = _handleGoogle;
    document.getElementById('wlcGuestBtn').onclick   = _handleGuest;
  }

  /* ── Build thumbnail collage ─────────── */
  function _buildCollage() {
    const container = document.getElementById('wlcCollage');
    if (!container) return;

    // Repeat IDs to fill the grid (need ~40-60 cells)
    const ids = [...COLLAGE_IDS, ...COLLAGE_IDS].slice(0, 48);

    ids.forEach((id, i) => {
      const cell = document.createElement('div');
      cell.className = 'wlc-cell';
      // Stagger animation delay
      cell.style.animationDelay = `${(i * 0.08).toFixed(2)}s`;

      const img = document.createElement('img');
      img.src     = `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
      img.loading = 'lazy';
      img.alt     = '';
      img.onerror = () => { img.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`; };

      cell.appendChild(img);
      container.appendChild(cell);
    });
  }

  /* ── Handle Google login ─────────────── */
  async function _handleGoogle() {
    _setStatus('loading', 'Conectando com o Google…');

    if (!Auth.isFirebaseReady()) {
      _setStatus('error', '⚠️ Firebase não configurado. Configure em js/auth.js para usar o login Google.');
      setTimeout(() => {
        _setStatus('');
        _handleGuest();
      }, 3000);
      return;
    }

    try {
      const user = await Auth.signInWithGoogle();
      _setStatus('success', `✅ Bem-vindo(a), ${user.displayName?.split(' ')[0] || 'você'}!`);
      setTimeout(() => _proceedToProfiles(user), 800);
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        _setStatus('');
      } else {
        _setStatus('error', '❌ Erro ao fazer login. Tente novamente.');
        setTimeout(() => _setStatus(''), 3000);
      }
    }
  }

  /* ── Handle guest ────────────────────── */
  function _handleGuest() {
    _setStatus('loading', 'Entrando como convidado…');
    setTimeout(() => _proceedToProfiles(null), 600);
  }

  /* ── Proceed to profile selection ────── */
  function _proceedToProfiles(user) {
    // Animate out collage, bring in profile screen
    const center = _overlay.querySelector('.wlc-center');
    center.classList.add('wlc-fade-out');

    setTimeout(() => {
      // Hide welcome, show profile overlay
      _overlay.classList.add('wlc-shrink');

      // If user logged in, pre-fill name from Google account
      if (user && !Profiles.getAll().length) {
        // Pre-create a profile with Google user info
        _createGoogleProfile(user);
      }

      // Show profile selection
      setTimeout(() => {
        _overlay.remove();
        _overlay = null;
        Profiles.showSelect();
        if (_onDoneCb) _onDoneCb(user);
      }, 400);
    }, 300);
  }

  /* ── Auto-create profile from Google ─── */
  function _createGoogleProfile(user) {
    const name = user.displayName?.split(' ')[0] || 'Meu Perfil';
    // Use photo from Google as avatar seed
    const avatar = {
      type: 'themed',
      emoji: '👑',
      label: name,
      bg: '#1a0a2e',
      color: '#a855f7',
      photoUrl: user.photoURL || '',
    };
    Profiles.create(name, avatar);
  }

  /* ── Status helper ───────────────────── */
  function _setStatus(type, msg) {
    const el = document.getElementById('wlcStatus');
    if (!el) return;
    if (!type || !msg) { el.style.display = 'none'; el.innerHTML = ''; return; }
    el.style.display = 'flex';
    el.className = `wlc-status wlc-status-${type}`;
    el.innerHTML = type === 'loading'
      ? `<i class="fas fa-spinner fa-spin"></i> ${msg}`
      : msg;

    const actions = document.getElementById('wlcActions');
    if (actions) actions.style.opacity = type === 'loading' ? '0.4' : '1';
    if (actions) actions.style.pointerEvents = type === 'loading' ? 'none' : '';
  }

  return { show };
})();
