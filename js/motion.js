/* Studio Valentina — smooth scroll (Lenis) + scroll animations (GSAP ScrollTrigger).
   Loaded on every page. Existing 3D scroll scenes keep listening to native
   'scroll' events, so they now follow the smoothed scroll automatically. */
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
    '#sv-progress{position:fixed;top:0;left:0;height:2px;width:100%;z-index:9999;' +
      'background:var(--accent,#3d3428);transform-origin:0 50%;transform:scaleX(0);pointer-events:none}' +
    '#page-home .fproj>img,.jcard-img>img{translate:0 var(--py,0);scale:1.1}';
  document.head.appendChild(css);

  Promise.all([load('lenis.min.js'), load('gsap.min.js')])
    .then(function () { return load('ScrollTrigger.min.js'); })
    .then(init)
    .catch(function () { /* if anything fails the site keeps native scroll */ });

  function init() {
    var gsap = window.gsap, ST = window.ScrollTrigger;
    gsap.registerPlugin(ST);

    var lenis = new window.Lenis({ lerp: 0.09, wheelMultiplier: 1, anchors: true, allowNestedScroll: true });
    window.__lenis = lenis;
    lenis.on('scroll', ST.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Thin reading-progress bar
    var bar = document.createElement('div');
    bar.id = 'sv-progress';
    document.body.appendChild(bar);
    gsap.to(bar, { scaleX: 1, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });

    setupParallax();

    // Home is a single-page app: keep Lenis and ScrollTrigger in sync on page switches
    if (typeof window.showPage === 'function') {
      var orig = window.showPage;
      window.showPage = function () {
        var r = orig.apply(this, arguments);
        lenis.scrollTo(0, { immediate: true, force: true });
        requestAnimationFrame(function () { setupParallax(); ST.refresh(); });
        return r;
      };
    }
    window.addEventListener('load', function () { ST.refresh(); });
  }

  // Images drift gently inside their frames while scrolling
  function setupParallax() {
    var gsap = window.gsap;
    document.querySelectorAll('#page-home .fproj > img, .jcard-img > img').forEach(function (img) {
      if (img.__px || !img.offsetParent) return;
      img.__px = true;
      gsap.fromTo(img, { '--py': '-5%' }, { '--py': '5%', ease: 'none',
        scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }
})();
