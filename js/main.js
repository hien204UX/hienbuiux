const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});
