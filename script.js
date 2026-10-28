const menuButton = document.querySelector('#menuButton');
const mobileNav = document.querySelector('#mobileNav');

function renderIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function setupVisitStats() {
  const profile = document.querySelector('.profile');
  if (!profile) return;

  const stats = document.createElement('p');
  stats.className = 'visit-stats';
  stats.setAttribute('aria-label', '网站访问统计');
  stats.innerHTML = `
    <span id="busuanzi_container_site_pv">累计访问 <strong id="busuanzi_value_site_pv">--</strong></span>
    <span id="busuanzi_container_site_uv">访客 <strong id="busuanzi_value_site_uv">--</strong></span>
    <span class="visit-stats-status">正在读取访问统计...</span>
  `;
  profile.appendChild(stats);

  const pvValue = stats.querySelector('#busuanzi_value_site_pv');
  const uvValue = stats.querySelector('#busuanzi_value_site_uv');
  const status = stats.querySelector('.visit-stats-status');
  const storageKey = 'yuhua-qi-visit-stats';
  let hasCachedStats = false;

  try {
    const cached = JSON.parse(localStorage.getItem(storageKey));
    if (cached && /^\d+$/.test(cached.pv) && /^\d+$/.test(cached.uv)) {
      pvValue.textContent = cached.pv;
      uvValue.textContent = cached.uv;
      stats.classList.add('has-cached-stats');
      status.textContent = '最近统计';
      hasCachedStats = true;
    }
  } catch (error) {
    // Storage may be disabled by browser privacy settings.
  }

  const statsObserver = new MutationObserver(() => {
    const pv = pvValue.textContent.trim();
    const uv = uvValue.textContent.trim();
    if (!/^\d+$/.test(pv) || !/^\d+$/.test(uv)) return;

    stats.classList.add('has-live-stats');
    stats.classList.remove('has-cached-stats');
    try {
      localStorage.setItem(storageKey, JSON.stringify({ pv, uv }));
    } catch (error) {
      // The live counter still works when storage is unavailable.
    }
  });
  statsObserver.observe(stats, { childList: true, subtree: true, characterData: true });

  const counterScript = document.createElement('script');
  counterScript.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  counterScript.async = true;
  counterScript.onerror = () => {
    if (!hasCachedStats) status.textContent = '访问统计暂不可用';
  };
  document.head.appendChild(counterScript);

  window.setTimeout(() => {
    if (!stats.classList.contains('has-live-stats') && !hasCachedStats) {
      status.textContent = '访问统计暂不可用';
    }
  }, 8000);
}

function closeMenu() {
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.innerHTML = '<i data-lucide="menu"></i>';
  renderIcons();
}

menuButton.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  mobileNav.setAttribute('aria-hidden', String(!isOpen));
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.innerHTML = `<i data-lucide="${isOpen ? 'x' : 'menu'}"></i>`;
  renderIcons();
});

mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();
setupVisitStats();
renderIcons();
