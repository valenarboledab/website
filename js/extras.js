/* WhatsApp helper, FAQ quick answers and cookie notice */
(function () {
  var WA_NUMBER = '16784905574';
  var WA_TEXT = (window.T ? T("Hi Valentina! I found your portfolio and I'd like to talk about a project.") : "Hi Valentina! I found your portfolio and I'd like to talk about a project.");

  window.openWhatsApp = function (text) {
    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text || WA_TEXT);
    window.open(url, '_blank', 'noopener');
  };

  window.toggleWaPanel = function (force) {
    var p = document.getElementById('waPanel');
    if (!p) return;
    var open = typeof force === 'boolean' ? force : !p.classList.contains('open');
    p.classList.toggle('open', open);
    var fab = document.getElementById('waFab');
    if (fab) fab.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  document.addEventListener('click', function (e) {
    var q = e.target.closest('.wa-q');
    if (q) {
      var a = q.nextElementSibling;
      if (a) a.classList.toggle('show');
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.toggleWaPanel(false);
  });

  /* Cookie consent + Google Analytics (loaded ONLY after the visitor accepts).
     SETUP: paste your GA4 Measurement ID (looks like G-XXXXXXXXXX). */
  var GA_ID = 'G-RS0NQF4ZP7';

  function choice() { try { return localStorage.getItem('sv_cookie_choice'); } catch (e) { return null; } }
  function loadGA() {
    if (!/^G-[A-Z0-9]{6,}$/.test(GA_ID) || window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA_ID);
  }
  window.setCookieChoice = function (val) {
    try { localStorage.setItem('sv_cookie_choice', val); } catch (e) {}
    var b = document.getElementById('ckBar');
    if (b) b.classList.remove('show');
    if (val === 'all' && navigator.globalPrivacyControl !== true) loadGA();
  };
  window.openCookieSettings = function () {
    var b = document.getElementById('ckBar');
    if (b) b.classList.add('show');
  };
  document.addEventListener('DOMContentLoaded', function () {
    var c = choice();
    if (navigator.globalPrivacyControl === true) { if (c !== 'essential') setCookieChoice('essential'); return; }
    if (c === 'all') loadGA();
    else if (!c) { var b = document.getElementById('ckBar'); if (b) b.classList.add('show'); }
  });

  /* Track WhatsApp clicks as an event (only if analytics was accepted) */
  document.addEventListener('click', function (e) {
    if (e.target.closest('a[href*="wa.me"], .wa-go') && window.gtag) gtag('event', 'whatsapp_click');
  });

  /* Languages: EN (original), ES, PT, FR, ZH via Google Translate (loaded only when a non-English language is chosen) */
  /* EN = / and ES = /es/ are real, indexable pages (good for SEO). PT, FR, ZH use Google Translate on the English page. */
  var IS_ES = /^\/es(\/|$)/.test(location.pathname);
  function getLang() {
    if (IS_ES) return 'es';
    var m = document.cookie.match(/(?:^|; )googtrans=\/en\/([^;]+)/);
    var l = m ? decodeURIComponent(m[1]) : 'en';
    return l === 'es' ? 'en' : l;
  }
  window.setLang = function (l) {
    var host = location.hostname, exp = l === 'en' ? '; expires=Thu, 01 Jan 1970 00:00:00 GMT' : '';
    var v = l === 'en' ? '' : '/en/' + l;
    if (l === 'es') { exp = '; expires=Thu, 01 Jan 1970 00:00:00 GMT'; v = ''; }
    document.cookie = 'googtrans=' + v + '; path=/' + exp;
    if (host.indexOf('.') > 0) document.cookie = 'googtrans=' + v + '; path=/; domain=.' + host.replace(/^www\./, '') + exp;
    var target = l === 'es' ? '/es/' : '/';
    var hash = location.hash || '';
    if (location.pathname !== target) location.href = target + hash; else location.reload();
  };
  window.gtInit = function () {
    new google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: 'es,pt,fr,zh-CN', autoDisplay: false }, 'gt_el');
  };
  document.addEventListener('DOMContentLoaded', function () {
    var l = getLang();
    document.querySelectorAll('.lang-sel').forEach(function (s) { s.value = l; });
    if (l !== 'en' && !IS_ES) {
      var sc = document.createElement('script');
      sc.src = 'https://translate.google.com/translate_a/element.js?cb=gtInit';
      document.body.appendChild(sc);
    }
  });

  /* Resources: choose which freebie the form delivers */
  var RS_COVERS = { 'before-you-build-georgia': '/images/checklist-cover.png', 'budget-planner': '/images/budget-cover.png', 'moodboard-template': '/images/moodboard-cover.png', 'nala-stickers': '/images/stickers-cover.png', 'ai-playbook': '/images/ai-playbook-cover.png', 'prompt-pack': '/images/prompt-pack-cover.png', 'software-stack': '/images/software-stack-cover.png' };
  var rsLastFocus = null;
  window.pickResource = function (id, file, title) {
    var f = document.getElementById('leadForm'), m = document.getElementById('rsModal');
    if (!f || !m) return;
    rsLastFocus = document.activeElement;
    f.dataset.resource = id; f.dataset.file = file;
    document.getElementById('rsFormTitle').textContent = title;
    var cover = document.getElementById('rsFormCover');
    cover.src = RS_COVERS[id] || ''; cover.alt = title;
    document.getElementById('leadMsg').textContent = '';
    document.getElementById('leadMsg').classList.remove('ok');
    m.hidden = false; document.body.classList.add('rs-open');
    setTimeout(function () { document.getElementById('leadName').focus(); }, 120);
  };

  window.closeResource = function () {
    var m = document.getElementById('rsModal');
    if (!m || m.hidden) return;
    m.hidden = true; document.body.classList.remove('rs-open');
    if (rsLastFocus && rsLastFocus.focus) rsLastFocus.focus();
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeResource();
  });

  /* Close the dialog shortly after a successful download */
  document.addEventListener('DOMContentLoaded', function () {
    var msg = document.getElementById('leadMsg');
    if (!msg || !window.MutationObserver) return;
    new MutationObserver(function () {
      if (msg.classList.contains('ok') && msg.textContent) {
        setTimeout(function () { window.closeResource(); }, 2600);
      }
    }).observe(msg, { childList: true, attributes: true, attributeFilter: ['class'] });
  });


  /* Nala speech bubble: a short line that changes with the page */
  var NALA_LINES = {
    home: "Hi! I'm Nala 🐾 Welcome to Studio Valentina.",
    projects: "These are some of Valentina's favorite projects!",
    about: "Meet Valentina: architect from Colombia, designing in Georgia.",
    process: "Curious how we work? From vision to execution, step by step.",
    journal: "Ideas and lessons from real projects. Grab a read!",
    arboretum: "Arboretum was designed around how a home should feel.",
    contact: "Say hi! Valentina usually answers within a day.",
    resources: "Free guides inside \u2014 AI, software and building smart.",
    faq: "Got questions? I've got answers. Or ask on WhatsApp!",
    portal: "Clients only! Sign in to see your project.",
    terms: "The fine print, in plain English.",
    privacy: "Your info is safe with us. Here's how.",
    cookies: "No ads, no tracking without your OK. Promise!"
  };
  var sayTimer;
  function nalaSay(id) {
    var el = document.getElementById('nalaSay');
    if (!el) return;
    var txt = NALA_LINES[id] || NALA_LINES.home;
    el.classList.remove('show');
    clearTimeout(sayTimer);
    sayTimer = setTimeout(function () {
      el.textContent = txt; el.classList.add('show');
      sayTimer = setTimeout(function () { el.classList.remove('show'); }, 9000);
    }, 700);
  }
  document.addEventListener('DOMContentLoaded', function () {
    var orig = window.showPage;
    if (typeof orig === 'function') {
      window.showPage = function (id) { var r = orig.apply(this, arguments); nalaSay(id); return r; };
    }
    setTimeout(function () { nalaSay('home'); }, 1500);
    /* Work page: "All" = big list; a category = 3 per row */
    var of = window.filterProj;
    if (typeof of === 'function') {
      window.filterProj = function (cat) {
        var r = of.apply(this, arguments);
        var page = document.getElementById('page-projects');
        if (page) page.classList.toggle('is-filtered', cat !== 'all');
        return r;
      };
    }
  });

  /* Nala comes to life: swap to the animated version after the page has loaded (keeps first load fast) */
  window.addEventListener('load', function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setTimeout(function () {
      document.querySelectorAll('img.nala-live[data-anim]').forEach(function (img) {
        var anim = new Image();
        anim.onload = function () { img.src = anim.src; };
        anim.src = img.getAttribute('data-anim');
      });
    }, 1200);
  });
})();

/* Deep links: /#projects, /es/#contact, etc. open that section (used by the case-study pages) */
(function () {
  function openFromHash() {
    var id = (location.hash || '').replace('#', '');
    if (id && document.getElementById('page-' + id) && window.showPage) window.showPage(id);
  }
  window.addEventListener('load', openFromHash);
  window.addEventListener('hashchange', openFromHash);
})();
