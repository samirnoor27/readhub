// dark-mode.js — يطبق التبديل، يحفظ التفضيل، ويحترم prefers-color-scheme
(function () {
  const STORAGE_KEY = 'readhub-theme'; // 'dark' | 'light'
  const toggle = document.getElementById('theme-toggle');
  const icon = document.querySelector('.theme-icon');
  const text = document.querySelector('.theme-text');
  const ICON_LIGHT = '☀️'; // show sun in normal (light) mode
  const ICON_DARK = '🌙';  // show moon in dark mode
  const LABEL = 'dark mode'; // visible text (requested)

  function setButtonState(isDark) {
    if (!toggle) return;
    toggle.setAttribute('aria-pressed', String(!!isDark));
    toggle.setAttribute('aria-label', isDark ? 'إيقاف الوضع الليلي' : 'تفعيل الوضع الليلي');
    if (icon) icon.textContent = isDark ? ICON_DARK : ICON_LIGHT;
    if (text) text.textContent = LABEL;
  }

  function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.body.classList.toggle('dark-theme', isDark);
    setButtonState(isDark);
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      // ignore (e.g., private mode)
    }
  }

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function init() {
    const saved = getSavedTheme();
    if (saved === 'dark' || saved === 'light') {
      applyTheme(saved);
    } else {
      applyTheme(systemPrefersDark() ? 'dark' : 'light');
    }

    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const isDarkNow = document.body.classList.contains('dark-theme');
      const next = isDarkNow ? 'light' : 'dark';
      applyTheme(next);
      saveTheme(next);
    });

    if (window.matchMedia) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener ? mq.addEventListener('change', (e) => {
        const savedNow = getSavedTheme();
        if (savedNow !== 'dark' && savedNow !== 'light') {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      }) : mq.addListener((e) => {
        const savedNow = getSavedTheme();
        if (savedNow !== 'dark' && savedNow !== 'light') {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
