/* ================================================================
   DramaLuxe — auth.js
   Firebase Authentication (Google Sign-In)
   
   CONFIGURAÇÃO:
   1. Acesse https://console.firebase.google.com
   2. Crie um projeto → Adicione um app Web
   3. Ative Authentication → Método de login → Google
   4. Copie as credenciais e cole em FIREBASE_CONFIG abaixo
================================================================ */

// ── Cole suas credenciais Firebase aqui ──────────────────────
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyCxeHTIi9V76nGeP0xOnJmvj4nicAz9tiU",
  authDomain:        "dramaluxe-streaming.firebaseapp.com",
  projectId:         "dramaluxe-streaming",
  storageBucket:     "dramaluxe-streaming.firebasestorage.app",
  messagingSenderId: "1046824537861",
  appId:             "1:1046824537861:web:c1363d45fa3427614f716c",
};
// ─────────────────────────────────────────────────────────────

window.Auth = (() => {

  let _user         = null;   // Firebase User object
  let _initialized  = false;
  let _onLoginCb    = null;
  let _onLogoutCb   = null;
  let _firebaseReady = false;

  /* ── Firebase loader ─────────────────── */
  function _loadFirebase() {
    return new Promise((resolve, reject) => {
      if (window.firebase) { resolve(); return; }

      // Only load if config has real values
      if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey === 'SUA_API_KEY_AQUI') {
        reject(new Error('NO_CONFIG'));
        return;
      }

      const scripts = [
        'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
        'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js',
      ];

      let loaded = 0;
      scripts.forEach(src => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => { if (++loaded === scripts.length) resolve(); };
        s.onerror = () => reject(new Error('Firebase load failed'));
        document.head.appendChild(s);
      });
    });
  }

  /* ── Init ─────────────────────────────── */
  async function init() {
    if (_initialized) return;
    _initialized = true;

    try {
      await _loadFirebase();
      firebase.initializeApp(FIREBASE_CONFIG);
      _firebaseReady = true;

      // Listen to auth state
      firebase.auth().onAuthStateChanged(user => {
        _user = user;
        if (user && _onLoginCb) _onLoginCb(user);
        if (!user && _onLogoutCb) _onLogoutCb();
      });
    } catch (e) {
      if (e.message === 'NO_CONFIG') {
        console.info('DramaLuxe: Firebase não configurado — modo anônimo ativo.');
      } else {
        console.warn('DramaLuxe: Firebase error:', e.message);
      }
    }
  }

  /* ── Google Sign-In ──────────────────── */
  async function signInWithGoogle() {
    if (!_firebaseReady) throw new Error('Firebase não configurado');
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    const result = await firebase.auth().signInWithPopup(provider);
    return result.user;
  }

  /* ── Sign out ────────────────────────── */
  async function signOut() {
    if (_firebaseReady) await firebase.auth().signOut();
    _user = null;
    Storage.del('local_user');
  }

  /* ── Getters ─────────────────────────── */
  function getUser()         { return _user; }
  function isLoggedIn()      { return !!_user; }
  function isFirebaseReady() { return _firebaseReady; }

  function onLogin(cb)  { _onLoginCb  = cb; }
  function onLogout(cb) { _onLogoutCb = cb; }

  return { init, signInWithGoogle, signOut, getUser, isLoggedIn, isFirebaseReady, onLogin, onLogout };
})();
