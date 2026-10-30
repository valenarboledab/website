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

  /* Cookie notice: the site only uses essential storage, so this is informational */
  function seen() { try { return localStorage.getItem('sv_cookie_ok') === '1'; } catch (e) { return false; } }
  window.dismissCookies = function () {
    try { localStorage.setItem('sv_cookie_ok', '1'); } catch (e) {}
    var b = document.getElementById('ckBar');
    if (b) b.classList.remove('show');
  };
  document.addEventListener('DOMContentLoaded', function () {
    if (!seen()) {
      var b = document.getElementById('ckBar');
      if (b) b.classList.add('show');
    }
  });
})();
