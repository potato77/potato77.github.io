const menuButton = document.querySelector('#menuButton');
const mobileNav = document.querySelector('#mobileNav');

function renderIcons() {
  if (window.lucide) window.lucide.createIcons();
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
renderIcons();
