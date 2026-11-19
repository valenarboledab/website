/* Studio Valentina — smooth scroll (Lenis) + scroll animations (GSAP ScrollTrigger).
   Loaded on every page. Existing 3D scroll scenes keep listening to native
   'scroll' events, so they follow the smoothed scroll automatically. */
(function () {
  if (window.__svMotion) return;
  window.__svMotion = true;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var base = (document.currentScript && document.currentScript.src.replace(/motion\.js.*$/, '')) || '/js/';
  function load(src) {
    return new Promise(function (ok, fail) {
      var s = document.createElement('script');
      s.src = base + 'vendor/' + src; s.onload = ok; s.onerror = fail;
      document.head.appendChild(s);
    });
  }

  var css = document.createElement('style');
  css.textContent =
    'html.lenis,html.lenis body{height:auto}' +
    'html.lenis{scroll-behavior:auto!important}' +
    '.lenis.lenis-stopped{overflow:clip}' +
    '.lenis.lenis-smooth iframe{pointer-events:none}' +
    '#sv-progress{position:fixed;top:0;left:0;height:4px;width:100%;z-index:9999;' +
      'background:linear-gradient(90deg,#c9a96e,var(--accent,#3d3428));transform-origin:0 50%;transform:scaleX(0);pointer-events:none}' +
    '#page-home .fproj>img,.jcard-img>img,.wcard>img,.pr-hero-r>img{translate:0 var(--py,0);scale:1.22}' +
    '.sv-w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em}' +
    '.sv-wi{display:inline-block;will-change:transform}' +
    '@media(min-width:900px) and (min-height:501px),(min-width:700px) and (min-height:560px) and (hover:none) and (pointer:coarse){' +
      '.sv-h{display:flex!important;flex-wrap:nowrap;gap:40px;width:max-content;padding-right:8vw}' +
      '.sv-h>.pstep{flex:0 0 min(78vw,980px);border-bottom:0!important;opacity:1!important;transform:none!important}' +
      '.sv-hwrap{overflow:hidden}' +
      '.h-phases .sv-hwrap{padding-top:10px}' +
    '}';
  document.head.appendChild(css);

  Promise.all([load('lenis.min.js'), load('gsap.min.js')])
    .then(function () { return load('ScrollTrigger.min.js'); })
    .then(init)
    .catch(function (e) { console.warn('[motion]', e); });

  var gsap, ST, lenis;

  function init() {
    gsap = window.gsap; ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);

    lenis = new window.Lenis({ lerp: 0.09, anchors: true, allowNestedScroll: true });
    window.__lenis = lenis;
    lenis.on('scroll', ST.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);

    var bar = document.createElement('div');
    bar.id = 'sv-progress';
    document.body.appendChild(bar);
    gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    setupAll();

    // Home is a single-page app: rebuild effects for the page that becomes visible
    if (typeof window.showPage === 'function') {
      var orig = window.showPage;
      window.showPage = function () {
        var r = orig.apply(this, arguments);
        lenis.scrollTo(0, { immediate: true, force: true });
        requestAnimationFrame(function () { setupAll(); ST.refresh(); });
        return r;
      };
    }
    window.addEventListener('load', function () { ST.refresh(); });
  }

  function visible(el) { return !!el.offsetParent; }

  function setupAll() { hscroll(); titles(); cards(); parallax(); }

  /* 1 — Titles rise word by word */
  function titles() {
    document.querySelectorAll('h1, h2, .h-proc-head h3, .h-explore h3').forEach(function (h) {
      if (h.__sv || !visible(h) || h.id === 'blur-about' || h.id === 'ptHello' || h.closest('[data-no-motion]')) return;
      h.__sv = true;
      split(h);
      var words = h.querySelectorAll('.sv-wi');
      if (!words.length) return;
      gsap.from(words, { yPercent: 110, opacity: 0, duration: 1, ease: 'power4.out', stagger: 0.07,
        scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
    });
  }
  function split(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var parts = n.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
        parts.forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
          var w = document.createElement('span'); w.className = 'sv-w';
          var i = document.createElement('span'); i.className = 'sv-wi'; i.textContent = p;
          w.appendChild(i); frag.appendChild(w);
        });
        n.parentNode.replaceChild(frag, n);
      } else if (n.nodeType === 1 && !/^(BR|SVG|IMG)$/i.test(n.tagName)) {
        split(n);
      }
    });
  }

  /* 2 — Project cards enter one by one */
  function cards() {
    var list = Array.prototype.filter.call(
      document.querySelectorAll('.h-feat-grid > .fproj, .jcard, .wcard'),
      function (c) { return !c.__sv && visible(c); });
    if (!list.length) return;
    list.forEach(function (c) { c.__sv = true; c.classList.remove('reveal'); c.classList.add('vis'); });
    gsap.set(list, { opacity: 0, y: 80, scale: 0.94 });
    ST.batch(list, {
      start: 'top 92%', once: true,
      onEnter: function (b) {
        gsap.to(b, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out', stagger: 0.15,
          clearProps: 'transform,opacity' });
      }
    });
  }

  /* 3 — Images drift inside their frames */
  function parallax() {
    document.querySelectorAll('#page-home .fproj > img, .jcard-img > img, .wcard > img, .pr-hero-r > img').forEach(function (img) {
      if (img.__px || !visible(img)) return;
      img.__px = true;
      gsap.fromTo(img, { '--py': '-9%' }, { '--py': '9%', ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }

  /* 4 — Process phases scroll sideways (desktop) */
  var hst;
  function hscroll() {
    if (hst) { hst.scrollTrigger && hst.scrollTrigger.kill(true); hst.kill(); hst = null; }
    var tablet = matchMedia('(hover:none) and (pointer:coarse)').matches && innerHeight >= 560;
    if (innerWidth < (tablet ? 700 : 900) || innerHeight <= 500) return;
    var track = Array.prototype.filter.call(document.querySelectorAll('.h-phases .pr-steps, .proc-content.show .pr-steps'), visible)[0];
    if (!track) return;
    if (!track.__sv) {
      track.__sv = true;
      var wrap = document.createElement('div'); wrap.className = 'sv-hwrap';
      track.parentNode.insertBefore(wrap, track); wrap.appendChild(track);
      track.classList.add('sv-h');
      track.querySelectorAll('.pstep').forEach(function (s) { s.classList.add('vis'); });
    }
    var wrapEl = track.parentNode;
    var dist = function () { return Math.max(0, track.scrollWidth - wrapEl.clientWidth); };
    hst = gsap.to(track, { x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: { trigger: track.closest('.h-phases') || wrapEl, start: track.closest('.h-phases') ? 'top 70px' : 'center center', end: function () { return '+=' + dist(); },
        pin: true, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1 } });
  }

  // Re-run when the process tabs switch (architecture / interior)
  document.addEventListener('click', function (e) {
    if (gsap && e.target.closest && e.target.closest('.proc-tab')) {
      setTimeout(function () { hscroll(); titles(); parallax(); ST.refresh(); }, 60);
    }
  });
})();
