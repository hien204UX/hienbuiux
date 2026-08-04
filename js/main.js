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

const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
}

const gateModal = document.getElementById('gateModal');
const gateForm = document.getElementById('gateForm');
const gateEmail = document.getElementById('gateEmail');
const gateMessage = document.getElementById('gateMessage');
const gateDenied = document.querySelector('.gate__denied');
const gateNote = document.querySelector('.gate__note');
const gateRequestView = gateModal.querySelector('[data-gate-view="request"]');
const gateThanksView = gateModal.querySelector('[data-gate-view="thanks"]');
const gateRadios = gateModal.querySelectorAll('input[name="isRecruiter"]');
let currentProject = '';

function openGate(project) {
  currentProject = project || 'this case study';
  gateForm.reset();
  gateForm.hidden = false;
  gateNote.hidden = false;
  gateDenied.hidden = true;
  gateRequestView.hidden = false;
  gateThanksView.hidden = true;
  gateModal.classList.add('is-open');
  gateModal.setAttribute('aria-hidden', 'false');
}

function closeGate() {
  gateModal.classList.remove('is-open');
  gateModal.setAttribute('aria-hidden', 'true');
}

document.querySelectorAll('.case-study-link').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    openGate(link.dataset.project);
  });
});

gateModal.querySelectorAll('[data-gate-close]').forEach((el) => {
  el.addEventListener('click', closeGate);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && gateModal.classList.contains('is-open')) {
    closeGate();
  }
});

gateRadios.forEach((radio) => {
  radio.addEventListener('change', () => {
    const isRecruiter = radio.value === 'yes' && radio.checked;
    gateForm.hidden = !isRecruiter;
    gateNote.hidden = !isRecruiter;
    gateDenied.hidden = isRecruiter;
  });
});

gateForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = gateEmail.value.trim();
  const message = gateMessage.value.trim();
  if (!email || !message) return;

  gateRequestView.hidden = true;
  gateThanksView.hidden = false;

  const subject = `Case study access request: ${currentProject}`;
  const body = `Recruiter email: ${email}\nCase study: ${currentProject}\n\nMessage:\n${message}`;
  const mailLink = document.createElement('a');
  mailLink.href = `mailto:hienbui2041995@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  mailLink.click();
});
