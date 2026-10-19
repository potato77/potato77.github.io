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
  `;
  profile.appendChild(stats);

  const counterScript = document.createElement('script');
  counterScript.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
  counterScript.async = true;
  counterScript.onerror = () => stats.remove();
  document.head.appendChild(counterScript);
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
