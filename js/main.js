var revealObserver = null;

function buildBlurText(el, text, delay0) {
  if (!el || el.dataset.built) return;
  el.dataset.built = '1';
  el.innerHTML = '';
  el.style.display = 'flex';
  el.style.flexWrap = 'wrap';
  el.style.rowGap = '.08em';
  text.split(' ').forEach(function(w, i) {
    var span = document.createElement('span');
    span.className = 'blur-word';
    span.textContent = w;
    span.style.transitionDelay = (delay0 + i * 0.1) + 's';
    el.appendChild(span);
  });
}

function initRevealObserver() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.blur-word,.rv').forEach(function(el) {
      el.classList.add('vis');
      el.classList.add('in');
    });
    return;
  }
  revealObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        e.target.classList.add('in');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
}

function observePageReveals(pageEl) {
  if (!revealObserver) return;
  pageEl.querySelectorAll('.reveal:not(.vis),.reveal-left:not(.vis),.reveal-right:not(.vis),.blur-word:not(.vis),.rv:not(.in)').forEach(function(el) {
    revealObserver.observe(el);
  });
}

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const page = document.getElementById('page-' + id);
  if (page) {
    page.classList.add('active');
    window.scrollTo(0, 0);
    if (id === 'about') {
      buildBlurText(document.getElementById('blur-about'), 'I design with emotion, strategy and clarity.', 0.2);
    }
    requestAnimationFrame(function() { observePageReveals(page); });
  }
  const navEl = document.getElementById('nav-' + (id === 'arboretum' ? 'journal' : id));
  if (navEl) navEl.classList.add('active');
}

function filterProj(cat, btn) {
  document.querySelectorAll('#page-projects .ftab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('#projGrid .wcard').forEach(c => {
    c.style.display = (cat === 'all' || c.dataset.cat === cat) ? 'block' : 'none';
  });
}

function filterArt(cat, btn) {
  document.querySelectorAll('.journal-filters .filter-pill').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.art-grid .art-card').forEach(c => {
    c.style.display = (cat === 'all' || c.dataset.cat === cat) ? 'block' : 'none';
  });
}

function switchProc(tab, btn) {
  document.querySelectorAll('.proc-tab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.proc-content').forEach(s => s.classList.remove('show'));
  document.getElementById('proc-' + tab).classList.add('show');
}

function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.send-btn');
  btn.textContent = 'Message Sent ✓';
  btn.style.background = 'var(--olive)';
  setTimeout(() => { btn.textContent = 'Send Message ↗'; btn.style.background = ''; }, 3000);
}

function initTilt() {
  document.querySelectorAll('#page-projects .wcard').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
      card.style.transition = 'transform .05s';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
    });
  });
}
initTilt();
initRevealObserver();
(function() {
  var home = document.getElementById('page-home');
  if (home && home.classList.contains('active')) {
    requestAnimationFrame(function() { observePageReveals(home); });
  }
})();
