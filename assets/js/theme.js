/*
  theme.js — API global ClasesTheme
  Sistema "Editorial cálido funcional" · Fase 2.0

  Persiste la preferencia del usuario en localStorage bajo la
  clave 'tercial-theme-pref'. Aplica al <html>:
    data-theme       → 'light' | 'dark'  (lo lee el CSS)
    data-theme-pref  → 'light' | 'dark' | 'auto'  (lo lee el toggle)

  Dispara CustomEvent('tercial:themechange', {detail:{applied,pref}}).
  El snippet anti-flash en <head> debe correr antes (ver § 11 del
  design-system).
*/
(function () {
  'use strict';

  const KEY = 'tercial-theme-pref';
  const VALID = ['light', 'dark', 'auto'];
  const ORDER = ['light', 'dark', 'auto'];
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  let memoryPref = 'auto';
  const resolve = (pref) =>
    pref === 'auto' ? (mql.matches ? 'dark' : 'light') : pref;

  function readPref() {
    try {
      const stored = localStorage.getItem(KEY);
      if (VALID.includes(stored)) memoryPref = stored;
    } catch (_) {
      // Safari privado, iframes y políticas estrictas pueden bloquear storage.
    }
    return memoryPref;
  }

  function writePref(pref) {
    memoryPref = pref;
    try {
      localStorage.setItem(KEY, pref);
    } catch (_) {
      // La preferencia sigue funcionando durante la sesión actual.
    }
  }

  function apply() {
    const pref = ClasesTheme.get();
    const applied = resolve(pref);
    const root = document.documentElement;
    root.setAttribute('data-theme', applied);
    root.setAttribute('data-theme-pref', pref);
    window.dispatchEvent(new CustomEvent('tercial:themechange', {
      detail: { applied, pref }
    }));
  }

  const ClasesTheme = {
    get() {
      return readPref();
    },
    set(pref) {
      if (!VALID.includes(pref)) return;
      writePref(pref);
      apply();
    },
    toggle() {
      const next = ORDER[(ORDER.indexOf(this.get()) + 1) % ORDER.length];
      this.set(next);
    },
    applied() {
      return resolve(this.get());
    }
  };

  /* En modo 'auto', reaccionar a cambios del sistema en vivo. */
  const onSystemChange = () => {
    if (ClasesTheme.get() === 'auto') apply();
  };
  if (mql.addEventListener) mql.addEventListener('change', onSystemChange);
  else if (mql.addListener) mql.addListener(onSystemChange);

  /* Al restaurar desde el bfcache (botón atrás/adelante, sobre todo en Safari),
     el DOM vuelve con el data-theme viejo y los scripts no re-corren. Reaplicar
     el tema según la preferencia actual (instantáneo; solo si realmente cambió). */
  window.addEventListener('pageshow', (e) => {
    if (!e.persisted) return;
    const root = document.documentElement;
    if (root.getAttribute('data-theme') !== resolve(ClasesTheme.get())) apply();
  });

  apply();
  window.ClasesTheme = ClasesTheme;
})();
