// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.10 });
reveals.forEach(el => obs.observe(el));

// ── PROGRESS BAR ──
const bar = document.getElementById('progress-bar');
if (bar) {
  window.addEventListener('scroll', () => {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  });
}

// ── BACK TO TOP ──
const backTop = document.getElementById('back-top');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  });
}

// ── ACTIVE NAV HIGHLIGHT ──
const sections = document.querySelectorAll('section[id], div[id]');
const navAs = document.querySelectorAll('.nav-links a');
const navObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => navObs.observe(s));

// ── FAQ ACCORDION (if present) ──
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── PRICING TOGGLE (if present) ──
const pToggle = document.getElementById('price-toggle');
if (pToggle) {
  const pGrid = document.querySelector('.pricing-grid');
  const lblOne = document.getElementById('lbl-one');
  const lblMaint = document.getElementById('lbl-maint');
  let maintMode = false;
  pToggle.addEventListener('click', () => {
    maintMode = !maintMode;
    pToggle.classList.toggle('yearly', maintMode);
    pGrid.classList.toggle('show-maint', maintMode);
    lblOne.classList.toggle('active', !maintMode);
    lblMaint.classList.toggle('active', maintMode);
  });
}

// ── START PROJECT ──
function startProject() {
  window.location.href = encodeURI('../ClientResponseForm/index.html');
}
