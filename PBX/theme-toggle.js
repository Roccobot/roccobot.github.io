(function () {
  const html = document.documentElement;
  const mql = window.matchMedia('(prefers-color-scheme: dark)');
  const btn = document.getElementById('themeToggle');
  const iconSun = document.getElementById('iconSun');
  const iconMoon = document.getElementById('iconMoon');

  function setBySystem() {
    const dark = mql.matches;
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    iconSun.style.display = dark ? 'none' : '';
    iconMoon.style.display = dark ? '' : 'none';
  }
  setBySystem();

  let userJustToggled = false;
  mql.addEventListener('change', () => {
    if (userJustToggled) return;
    setBySystem();
  });

  btn.addEventListener('click', () => {
    userJustToggled = true;
    const now = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', now);
    iconSun.style.display = now === 'dark' ? 'none' : '';
    iconMoon.style.display = now === 'dark' ? '' : 'none';
    setTimeout(() => { userJustToggled = false; }, 1500);
  });
})();