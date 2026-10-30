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
  var GA_ID = 'G-PASTE_ID';

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
})();
