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
const gateSubmit = document.getElementById('gateSubmit');
const gateError = document.getElementById('gateError');
const WEB3FORMS_ACCESS_KEY = 'f68c6e60-fc02-441f-9dee-0b8ed704c56b';
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
  gateError.hidden = true;
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

gateForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = gateEmail.value.trim();
  const message = gateMessage.value.trim();
  if (!email || !message) return;

  gateError.hidden = true;
  gateSubmit.disabled = true;
  gateSubmit.textContent = 'Sending…';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Case study access request: ${currentProject}`,
        case_study: currentProject,
        email,
        message,
      }),
    });
    const result = await response.json();

    if (!result.success) {
      throw new Error(result.message || 'Submission failed');
    }

    gateRequestView.hidden = true;
    gateThanksView.hidden = false;
  } catch (err) {
    gateError.hidden = false;
  } finally {
    gateSubmit.disabled = false;
    gateSubmit.textContent = 'Send email';
  }
});
