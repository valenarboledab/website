/* Floating menu (3 lines) for pages that don't have the home navigation:
   Design Studio and the case-study pages. Always visible while scrolling. */
(function () {
  if (document.querySelector('.nav-links') || document.getElementById('sv-menu')) return;
  var es = /^\/es\//.test(location.pathname);
  var links = es
    ? [['Inicio', '/es/'], ['Proyectos', '/es/#projects'], ['Sobre mí', '/es/#about'], ['Blog', '/es/#journal'], ['Recursos', '/es/#resources'], ['Acceso clientes', '/es/#portal']]
    : [['Home', '/'], ['Work', '/#projects'], ['Design Studio', '/interior-design-studio.html'], ['About', '/#about'], ['Journal', '/#journal'], ['Resources', '/#resources'], ['Client Login', '/#portal']];

  var css = document.createElement('style');
  css.textContent =
    '#sv-menu{position:fixed;top:14px;right:14px;z-index:10000;font-family:inherit}' +
    '#sv-menu>button{width:50px;height:50px;border-radius:50%;border:1.5px solid rgba(114,96,78,.28);' +
      'background:rgba(244,240,233,.88);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);' +
      'display:flex;align-items:center;justify-content:center;cursor:pointer;color:#27231f;box-shadow:0 4px 18px rgba(39,35,31,.12);padding:0}' +
    '#sv-menu>button span,#sv-menu>button span::before,#sv-menu>button span::after{display:block;width:20px;height:1.6px;background:currentColor;content:"";position:relative;transition:.25s}' +
    '#sv-menu>button span::before{position:absolute;top:-6px}#sv-menu>button span::after{position:absolute;top:6px}' +
    '#sv-menu.open>button span{background:transparent}' +
    '#sv-menu.open>button span::before{top:0;transform:rotate(45deg)}#sv-menu.open>button span::after{top:0;transform:rotate(-45deg)}' +
    '#sv-menu nav{position:absolute;top:60px;right:0;min-width:210px;background:#f4f0e9;border:1px solid rgba(114,96,78,.18);border-radius:18px;' +
      'padding:10px;box-shadow:0 18px 40px rgba(39,35,31,.18);opacity:0;transform:translateY(-6px);pointer-events:none;transition:.22s}' +
    '#sv-menu.open nav{opacity:1;transform:none;pointer-events:auto}' +
    '#sv-menu nav a{display:block;padding:11px 14px;border-radius:12px;color:#27231f;text-decoration:none;font-size:14px;letter-spacing:.04em}' +
    '#sv-menu nav a:hover{background:rgba(114,96,78,.1)}' +
    '@media(min-width:900px){#sv-menu{top:18px;right:22px}}' +
    '#sv-menu.in-bar>button{width:42px;height:42px;box-shadow:none}#sv-menu.in-bar nav{top:52px}';
  document.head.appendChild(css);

  var wrap = document.createElement('div');
  wrap.id = 'sv-menu';
  wrap.innerHTML = '<button type="button" aria-label="' + (es ? 'Abrir menú' : 'Open menu') + '" aria-expanded="false"><span></span></button><nav>' +
    links.map(function (l) { return '<a href="' + l[1] + '">' + l[0] + '</a>'; }).join('') + '</nav>';
  document.body.appendChild(wrap);

  // If the page has its own header with a language link at the top right, make room for the button
  var lang = document.querySelector('a.lang');
  if (lang) {
    lang.style.marginRight = '52px';
    wrap.classList.add('in-bar');
    var bar = lang.closest('header,nav') || lang.parentElement;
    var place = function () { var r = bar.getBoundingClientRect(); wrap.style.top = Math.max(4, r.top + (r.height - 42) / 2) + 'px'; };
    place(); addEventListener('resize', place);
  }

  var btn = wrap.querySelector('button');
  function set(open) {
    wrap.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  }
  btn.addEventListener('click', function (e) { e.stopPropagation(); set(!wrap.classList.contains('open')); });
  document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });
})();
