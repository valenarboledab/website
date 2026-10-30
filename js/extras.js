/* WhatsApp helper, FAQ quick answers and cookie notice */
(function () {
  var WA_NUMBER = '16784905574';
  var WA_TEXT = "Hi Valentina! I found your portfolio and I'd like to talk about a project.";

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
  function getLang() {
    var m = document.cookie.match(/(?:^|; )googtrans=\/en\/([^;]+)/);
    return m ? decodeURIComponent(m[1]) : 'en';
  }
  window.setLang = function (l) {
    var host = location.hostname, exp = l === 'en' ? '; expires=Thu, 01 Jan 1970 00:00:00 GMT' : '';
    var v = l === 'en' ? '' : '/en/' + l;
    document.cookie = 'googtrans=' + v + '; path=/' + exp;
    if (host.indexOf('.') > 0) document.cookie = 'googtrans=' + v + '; path=/; domain=.' + host.replace(/^www\./, '') + exp;
    location.reload();
  };
  window.gtInit = function () {
    new google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: 'es,pt,fr,zh-CN', autoDisplay: false }, 'gt_el');
  };
  document.addEventListener('DOMContentLoaded', function () {
    var l = getLang();
    document.querySelectorAll('.lang-sel').forEach(function (s) { s.value = l; });
    if (l !== 'en') {
      var sc = document.createElement('script');
      sc.src = 'https://translate.google.com/translate_a/element.js?cb=gtInit';
      document.body.appendChild(sc);
    }
  });

  /* Nala comes to life: swap to the animated version after the page has loaded (keeps first load fast) */
  window.addEventListener('load', function () {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setTimeout(function () {
      var anim = new Image();
      anim.onload = function () {
        document.querySelectorAll('img.nala-live[data-anim]').forEach(function (img) { img.src = anim.src; });
      };
      anim.src = 'images/nala-anim.webp';
    }, 1200);
  });
})();
