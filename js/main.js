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
      buildBlurText(document.getElementById('blur-about'), (window.T ? T('I design with emotion, strategy and clarity.') : 'I design with emotion, strategy and clarity.'), 0.2);
    }
    requestAnimationFrame(function() { observePageReveals(page); });
  }
  const navEl = document.getElementById('nav-' + (id === 'arboretum' ? 'journal' : id));
  if (navEl) navEl.classList.add('active');
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

/* Integrated portfolio enhancements from the approved preview. */
(function () {
  'use strict';

  document.body.classList.add('preview-mode');

  const CAROUSEL_INTERVAL = 4000;

  const svgArrow = (direction) => direction === 'prev'
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7 7-7-7 7-7"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>';

  const arboretumImages = [
    '20260316_230149000_iOS.webp','Front_facade_02.webp','Front_facade_03.webp','Front_facade_05.webp',
    'Living_room_03.webp','Kitchen_01.webp','Dinning_room_01.webp','Foyer_01.webp','Bedroom_01.webp',
    'Master_bathroom_05.webp','Office_01.webp','Indoor-Outdoor Living.webp'
  ].map(name => '/RESIDENTIAL/Residential + Interior Design/Single Family Arboretum - United States/' + name);

  const serenaImages = [
    '20260526_160809000_iOS 1.webp','20260526_160809000_iOS 2.webp',
    '20260526_160809000_iOS.webp','20260526_160810000_iOS.webp'
  ].map(name => '/RESIDENTIAL/Residential + Interior Design/Serena Hills - United States/' + name);

  const residentialBuildingImages = [
    '20260302_153940000_iOS.webp','20260327_224626000_iOS.webp','20260327_224759000_iOS.webp',
    '20260327_224921000_iOS.webp','20260327_225014000_iOS.webp','20260327_225210000_iOS.webp',
    '20260528_232804000_iOS.webp','20260528_232804000_iOS.webp'
  ].map(name => '/COMMERCIAL/Residential Building  5 Floors - Spain/' + name);

  const publicSpaceImages = [
    '1.webp','2.webp','3.webp','4.webp','5.webp','6.webp',
    '9. Imagen EP Salento.webp','Image Jan 29, 2026, 09_07_28 PM.webp'
  ].map(name => '/COMMERCIAL/PUBLIC SPACE/Public Space AND Viewpoint - Colombia/' + name);

  const ecoHotelImages = [
    'ECO HOTEL.webp','ECO HOTEL 2.webp','ECO HOTEL 3.webp',
    'ECO HOTEL 4.webp','ECO HOTEL 5.webp','ECO HOTEL 6.webp'
  ].map(name => '/COMMERCIAL/COMMERCIAL + PUBLIC INTERIOR DESIGN/Eco-Hotel - Colombia/' + name);

  const manaImages = [
    '/images/home/img-mana.webp',
    ...[
      '20260528_232806000_iOS.webp','20260529_223048000_iOS.webp','20260721_170357649_iOS.webp',
      '20260721_170529166_iOS.webp','20260721_170600650_iOS.webp','20260721_170747765_iOS.webp',
      '20260721_171727896_iOS.webp'
    ].map(name => '/COMMERCIAL/COMMERCIAL + PUBLIC INTERIOR DESIGN/Maná - Colombia/' + name)
  ];

  const architecturalDesignImages = [
    'Image Jan 29, 2026, 09_27_25 PM.webp','2.webp','3.webp','4.webp'
  ].map(name => '/RESIDENTIAL/Residential + Interior Design/Single Family House - Colombia/' + name);

  const residentialHouseImages = [
    '/RESIDENTIAL/United States - House - Lot 1 - PTC/Image Jan 29, 2026, 10_16_00 PM.webp',
    '/RESIDENTIAL/United States - House - Lot 1 - PTC/20260316_155040000_iOS.webp'
  ];

  const elementiImages = [
    'elementi-01-rain-ring.webp','elementi-02-front-facade.webp','elementi-03-roof-oculus.webp',
    'elementi-05-waterfall-light.webp','elementi-07-contemplation-lounge.webp','elementi-09-ondas-seat.webp'
  ].map(name => '/COMMERCIAL/COMMERCIAL + PUBLIC INTERIOR DESIGN/Elementi - United States/' + name);

  const projectData = [
    {name:'ELEMENTI',country:'USA',cat:'interior',category:'Commercial · Wellness Interior Design',images:elementiImages,page:{en:'/projects/elementi-wellness-interior-design-usa/',es:'/es/proyectos/elementi-diseno-interior-bienestar-usa/'}},
    {name:'Cable Car',country:'Colombia',cat:'commercial',category:'Commercial · Infrastructure',images:['/images/teleferico.webp']},
    {name:'Residential Building 5 Floors',country:'Spain',cat:'commercial',category:'Commercial · Residential',images:residentialBuildingImages},
    {name:'G-Metria',country:'Colombia',cat:'commercial',category:'Commercial · Public Interior',images:['/COMMERCIAL/PUBLIC SPACE/G-Metria - Colombia/gmetria-01.webp','/COMMERCIAL/PUBLIC SPACE/G-Metria - Colombia/gmetria-02-aerea.webp','/COMMERCIAL/PUBLIC SPACE/G-Metria - Colombia/gmetria-03-celosia.webp','/COMMERCIAL/PUBLIC SPACE/G-Metria - Colombia/gmetria-04-pabellon.webp','/COMMERCIAL/PUBLIC SPACE/G-Metria - Colombia/20260527_125716831_iOS.webp']},
    {name:'Public Space & View Point',country:'Colombia',cat:'masterplan',category:'Public Space',images:publicSpaceImages},
    {name:'Medical Building',country:'Colombia',cat:'commercial',category:'Commercial · Superintendent',images:['/COMMERCIAL/SUPERINTENDANT/Medical Building - Colombia/marquez y fajardo.webp']},
    {name:'Marawi',country:'Colombia',cat:'commercial',category:'Commercial · Superintendent',images:['/COMMERCIAL/SUPERINTENDANT/Marawi - Colombia/WhatsApp Image 2026-01-31 at 9.44.29 PM.webp']},
    {name:'Zonata Apartments',country:'Colombia',cat:'commercial',category:'Commercial · Superintendent',images:['/COMMERCIAL/SUPERINTENDANT/Zonata Apartments - Colombia/Screenshot-2025-05-28-at-3.26.47 PM.webp']},
    {name:'Residential BBQ',country:'USA',cat:'residential',category:'Residential',images:['/RESIDENTIAL/BBQ - United States/BBQ.webp']},
    {name:'3D Visualization',country:'USA',cat:'residential',category:'Residential · Visualization',images:['/RESIDENTIAL/Facade - United States/FACADE.webp']},
    {name:'Residential Pool Design',country:'USA',cat:'residential',category:'Residential',images:['/RESIDENTIAL/Pool - United States/PISCINA.webp']},
    {name:'La Pradera – Residential Design',country:'Colombia',cat:'residential',category:'Residential',images:['/RESIDENTIAL/Rooftop Single Family House - Colombia/TERRACE.webp']},
    {name:'Residential House',country:'USA',cat:'residential',category:'Residential',images:residentialHouseImages},
    {name:'Serena Hills',country:'USA',cat:'interior',category:'Residential + Interior Design',images:serenaImages},
    {name:'Architectural Design',country:'Colombia',cat:'interior',category:'Residential + Interior Design',images:architecturalDesignImages},
    {name:'A.D.E.S. Insurance Office',country:'Colombia',cat:'interior',category:'Commercial · Interior Design',images:['/COMMERCIAL/COMMERCIAL + PUBLIC INTERIOR DESIGN/A.D.E.S. Insurance Office - Colombia/ADES.webp']},
    {name:'Pop-Up Store',country:'Colombia',cat:'interior',category:'Commercial · Interior Design',images:['/COMMERCIAL/COMMERCIAL + PUBLIC INTERIOR DESIGN/Pop-Up Store - Colombia/Pop-Up Store.webp']}
  ];

  const featuredData = [
    {name:'Single Family Arboretum',country:'USA',images:arboretumImages},
    {name:'Arboretum 2',country:'Colombia',images:['/images/home/img-hero.webp'],award:true},
    {name:'Cultural & Convention Center',country:'Colombia',images:['/images/home/img-cultural.webp'],award:true},
    {name:'Eco Hotel',country:'Colombia',images:ecoHotelImages},
    {name:'Maná',country:'Colombia',images:manaImages,note:'8 of 9 assets found',award:true},
    {name:'Coworking Building',country:'Spain',images:['/images/COWORKING.webp']}
  ];

  const tr = t => (window.T ? window.T(t) : t);
  const PROJECT_VIDEOS = {"ELEMENTI": "elementi", "Single Family Arboretum": "arboretum-greatroom", "Arboretum 2": "arboretum-col", "Cultural & Convention Center": "cultural", "Eco Hotel": "ecohotel", "Maná": "mana", "Coworking Building": "coworking", "Cable Car": "teleferico", "Residential Building 5 Floors": "burgos", "G-Metria": "gmetria", "Public Space & View Point": "viewpoint", "Medical Building": "medical", "Marawi": "marawi", "Zonata Apartments": "zonata", "Residential BBQ": "bbq", "3D Visualization": "facade", "Residential Pool Design": "pool", "La Pradera – Residential Design": "rooftop", "Residential House": "lot1", "Serena Hills": "serena", "Architectural Design": "bimhouse", "A.D.E.S. Insurance Office": "ades", "Pop-Up Store": "popup"};
  const VIDEO_ICON_REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function carouselMarkup(images, alt, note) {
    const safeImages = images || [];
    if (!safeImages.length) return '';
    const vid = PROJECT_VIDEOS[alt];
    const videoTag = vid ? '<video class="slide-video" muted loop playsinline preload="none" aria-hidden="true" poster="/videos/posters/proj-' + vid + '.webp" data-src="/videos/proj-' + vid + '.mp4"></video>' : '';
    return '<div class="preview-carousel" data-count="' + safeImages.length + '" aria-label="Image carousel for ' + alt + '">' +
      '<div class="preview-carousel-track">' + safeImages.map((src, i) =>
        '<div class="preview-carousel-slide"><img src="' + encodeURI(src) + '" alt="' + alt + ' — image ' + (i + 1) + '" loading="lazy">' + (i === 0 ? videoTag : '') + '</div>'
      ).join('') + '</div>' +
      (note ? '<span class="preview-asset-note">' + note + '</span>' : '') +
      (safeImages.length > 1 ? '<span class="preview-carousel-label">Carousel · ' + safeImages.length + ' photos</span>' : '') +
      '<button class="preview-carousel-arrow prev" type="button" aria-label="Previous image">' + svgArrow('prev') + '</button>' +
      '<button class="preview-carousel-arrow next" type="button" aria-label="Next image">' + svgArrow('next') + '</button>' +
      (safeImages.length > 1 ? '<div class="preview-carousel-dots" aria-label="Choose image">' + safeImages.map((_, i) => '<button class="preview-carousel-dot' + (i === 0 ? ' is-active' : '') + '" type="button" aria-label="Go to image ' + (i + 1) + '" data-index="' + i + '"></button>').join('') + '</div>' : '') +
      '<span class="preview-carousel-count" aria-live="polite">1 / ' + safeImages.length + '</span>' +
    '</div>';
  }

  let galleryModal = null;
  let galleryImages = [];
  let galleryIndex = 0;
  let galleryOrigin = null;
  let galleryCloseTimer = 0;

  function renderGallery() {
    if (!galleryModal || !galleryImages.length) return;
    const current = galleryImages[galleryIndex];
    const image = galleryModal.querySelector('.gallery-lightbox-image');
    image.src = current.src;
    image.alt = current.alt;
    galleryModal.querySelector('.gallery-lightbox-count').textContent = (galleryIndex + 1) + ' / ' + galleryImages.length;
    galleryModal.querySelectorAll('.gallery-lightbox-thumb').forEach((thumb, index) => {
      thumb.classList.toggle('is-active', index === galleryIndex);
      thumb.setAttribute('aria-current', index === galleryIndex ? 'true' : 'false');
    });
    galleryModal.classList.toggle('has-single-image', galleryImages.length === 1);
  }

  function moveGallery(delta) {
    galleryIndex = (galleryIndex + delta + galleryImages.length) % galleryImages.length;
    renderGallery();
  }

  function closeGallery() {
    if (!galleryModal || galleryModal.hidden) return;
    galleryModal.classList.remove('is-open');
    document.body.classList.remove('gallery-open');
    clearTimeout(galleryCloseTimer);
    galleryCloseTimer = window.setTimeout(() => {
      galleryModal.hidden = true;
      galleryOrigin?.focus({preventScroll:true});
    }, 240);
  }

  function ensureGalleryModal() {
    if (galleryModal) return galleryModal;
    galleryModal = document.createElement('div');
    galleryModal.className = 'gallery-lightbox';
    galleryModal.hidden = true;
    galleryModal.setAttribute('role','dialog');
    galleryModal.setAttribute('aria-modal','true');
    galleryModal.setAttribute('aria-labelledby','gallery-lightbox-title');
    galleryModal.innerHTML =
      '<div class="gallery-lightbox-backdrop" data-gallery-close></div>' +
      '<div class="gallery-lightbox-panel">' +
        '<header class="gallery-lightbox-header">' +
          '<div><span class="gallery-lightbox-eyebrow">Project gallery</span><h2 id="gallery-lightbox-title"></h2></div>' +
          '<div class="gallery-lightbox-actions"><a class="gallery-lightbox-case" hidden></a>' +
          '<button class="gallery-lightbox-close" type="button" aria-label="Close gallery">×</button></div>' +
        '</header>' +
        '<div class="gallery-lightbox-stage">' +
          '<img class="gallery-lightbox-image" alt="">' +
          '<button class="gallery-lightbox-arrow prev" type="button" aria-label="Previous photo">' + svgArrow('prev') + '</button>' +
          '<button class="gallery-lightbox-arrow next" type="button" aria-label="Next photo">' + svgArrow('next') + '</button>' +
          '<span class="gallery-lightbox-count" aria-live="polite"></span>' +
        '</div>' +
        '<div class="gallery-lightbox-thumbs" aria-label="Gallery photos"></div>' +
      '</div>';
    document.body.appendChild(galleryModal);
    galleryModal.querySelector('.gallery-lightbox-close').addEventListener('click', closeGallery);
    galleryModal.querySelector('[data-gallery-close]').addEventListener('click', closeGallery);
    galleryModal.querySelector('.gallery-lightbox-arrow.prev').addEventListener('click', () => moveGallery(-1));
    galleryModal.querySelector('.gallery-lightbox-arrow.next').addEventListener('click', () => moveGallery(1));
    document.addEventListener('keydown', event => {
      if (!galleryModal || galleryModal.hidden) return;
      if (event.key === 'Escape') closeGallery();
      if (event.key === 'ArrowLeft') moveGallery(-1);
      if (event.key === 'ArrowRight') moveGallery(1);
    });
    return galleryModal;
  }

  function openGallery(carousel) {
    const modal = ensureGalleryModal();
    clearTimeout(galleryCloseTimer);
    galleryImages = Array.from(carousel.querySelectorAll('.preview-carousel-slide img')).map(image => ({
      src: image.getAttribute('src'),
      alt: image.alt
    }));
    if (!galleryImages.length) return;
    galleryIndex = Math.max(0, Math.min(Number(carousel.dataset.currentIndex) || 0, galleryImages.length - 1));
    galleryOrigin = document.activeElement;
    const card = carousel.closest('.preview-feature,.wcard');
    const title = card?.querySelector('.fproj-info-name,.wcard-lname')?.textContent.trim() || 'Project';
    modal.querySelector('#gallery-lightbox-title').textContent = title;
    const caseSrc = card?.querySelector('.wcard-case');
    const caseLinkEl = modal.querySelector('.gallery-lightbox-case');
    if (caseSrc) {
      const esLang = (document.documentElement.lang || '').toLowerCase().startsWith('es');
      caseLinkEl.href = caseSrc.getAttribute('href');
      caseLinkEl.textContent = esLang ? 'Leer el caso de estudio →' : 'Read the case study →';
      caseLinkEl.hidden = false;
    } else {
      caseLinkEl.hidden = true;
      caseLinkEl.removeAttribute('href');
    }
    const thumbs = modal.querySelector('.gallery-lightbox-thumbs');
    thumbs.innerHTML = '';
    galleryImages.forEach((item, index) => {
      const button = document.createElement('button');
      button.className = 'gallery-lightbox-thumb';
      button.type = 'button';
      button.setAttribute('aria-label','View photo ' + (index + 1));
      const image = document.createElement('img');
      image.src = item.src;
      image.alt = '';
      image.loading = 'lazy';
      button.appendChild(image);
      button.addEventListener('click', () => { galleryIndex = index; renderGallery(); });
      thumbs.appendChild(button);
    });
    renderGallery();
    modal.hidden = false;
    document.body.classList.add('gallery-open');
    requestAnimationFrame(() => modal.classList.add('is-open'));
    modal.querySelector('.gallery-lightbox-close').focus({preventScroll:true});
  }


  /* Animated first render: load + play only while visible (saves data on mobile) */
  const slideVideoObserver = ('IntersectionObserver' in window) ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const v = entry.target;
      if (entry.isIntersecting) {
        if (!v.src) v.src = v.dataset.src;
        const pr = v.play(); if (pr && pr.catch) pr.catch(() => {});
      } else if (!v.paused) v.pause();
    });
  }, { threshold: 0.35 }) : null;
  function watchSlideVideo(v) {
    if (VIDEO_ICON_REDUCED) return;
    if (slideVideoObserver) slideVideoObserver.observe(v);
    else { v.src = v.dataset.src; v.play().catch(() => {}); }
  }

  function initCarousels(root) {
    (root || document).querySelectorAll('.preview-carousel').forEach(carousel => {
      if (carousel.dataset.carouselReady === 'true') return;
      carousel.dataset.carouselReady = 'true';
      const sv = carousel.querySelector('.slide-video'); if (sv) watchSlideVideo(sv);
      const track = carousel.querySelector('.preview-carousel-track');
      const slides = carousel.querySelectorAll('.preview-carousel-slide');
      const count = carousel.querySelector('.preview-carousel-count');
      const dots = carousel.querySelectorAll('.preview-carousel-dot');
      let index = 0;
      let startX = 0;
      let startY = 0;
      let autoTimer = 0;
      let suppressGalleryClick = false;
      const render = () => {
        track.style.transform = 'translateX(-' + (index * 100) + '%)';
        carousel.dataset.currentIndex = String(index);
        if (count) count.textContent = (index + 1) + ' / ' + slides.length;
        dots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === index));
      };
      const move = delta => { index = (index + delta + slides.length) % slides.length; render(); };
      const scheduleAutoMove = () => {
        clearTimeout(autoTimer);
        if (slides.length < 2) return;
        autoTimer = window.setTimeout(() => {
          if (!carousel.isConnected) return;
          if (!document.hidden) move(1);
          scheduleAutoMove();
        }, (index === 0 && carousel.querySelector('.slide-video')) ? 8000 : CAROUSEL_INTERVAL);
      };
      const manualMove = delta => {
        move(delta);
        scheduleAutoMove();
      };
      carousel.querySelector('.prev')?.addEventListener('click', e => { e.stopPropagation(); manualMove(-1); });
      carousel.querySelector('.next')?.addEventListener('click', e => { e.stopPropagation(); manualMove(1); });
      dots.forEach(dot => dot.addEventListener('click', e => {
        e.stopPropagation();
        index = Number(dot.dataset.index);
        render();
        scheduleAutoMove();
      }));
      track.addEventListener('touchstart', e => {
        if (slides.length > 1) e.stopPropagation();
        suppressGalleryClick = false;
        startX = e.changedTouches[0].clientX;
        startY = e.changedTouches[0].clientY;
      }, {passive:true});
      track.addEventListener('touchend', e => {
        if (slides.length > 1) e.stopPropagation();
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.25) {
          suppressGalleryClick = true;
          manualMove(dx < 0 ? 1 : -1);
          window.setTimeout(() => { suppressGalleryClick = false; }, 350);
        }
      }, {passive:true});
      carousel.addEventListener('click', event => {
        if (suppressGalleryClick || event.target.closest('.preview-carousel-arrow,.preview-carousel-dot')) return;
        openGallery(carousel);
      });
      scheduleAutoMove();
    });
  }

  function goToFeatured() {
    window.showPage('home');
    setTimeout(() => document.querySelector('.h-feat')?.scrollIntoView({behavior:'smooth',block:'start'}), 30);
  }
  window.previewGoToFeatured = goToFeatured;

  function updateNavigation() {
    document.getElementById('nav-process')?.closest('li')?.remove();
    document.querySelectorAll('.footer-nav a').forEach(link => {
      if (link.textContent.trim().toLowerCase() === 'process') link.remove();
    });
    const navList = document.querySelector('.nav-links');
    const toggle = document.createElement('button');
    toggle.className = 'preview-menu-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label','Open navigation');
    toggle.setAttribute('aria-expanded','false');
    toggle.innerHTML = '<span></span>';
    document.querySelector('.nav-in')?.appendChild(toggle);
    toggle.addEventListener('click', () => {
      const open = !navList.classList.contains('is-open');
      navList.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    navList?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      navList.classList.remove('is-open');
      toggle.setAttribute('aria-expanded','false');
    }));
  }

  function updateHome() {
    const intro = document.querySelector('.h-about-text-l');
    if (intro) {
      intro.querySelectorAll(':scope > p:not(.eyebrow)').forEach(p => p.remove());
      const link = intro.querySelector('.link-arrow');
      link?.insertAdjacentHTML('beforebegin',
        '<p>I am passionate about intentional architecture, development strategy, and technology innovation.</p>' +
        '<p>I believe great design doesn\'t just look beautiful, it transforms the way you live.</p>');
    }
    const grid = document.querySelector('.h-feat-grid');
    if (grid) {
      grid.innerHTML = featuredData.map((p, i) =>
        '<article class="fproj preview-feature">' +
          '<span class="fproj-num">' + String(i + 1).padStart(2,'0') + '</span>' +
          (p.award ? '<span class="fproj-badge">🥇 Winning</span>' : '') +
          carouselMarkup(p.images,p.name,p.note) +
          '<div class="fproj-info"><div class="fproj-info-loc">' + tr(p.country) + '</div><div class="fproj-info-name">' + p.name + '</div>' + caseLink(p) + '</div>' +
          '<button class="fproj-arrow gallery-open-button" type="button" aria-label="View ' + p.name + ' photos">' + svgArrow('next') + '</button>' +
        '</article>'
      ).join('');
      grid.querySelectorAll('.preview-feature').forEach(card => {
        card.querySelector('.gallery-open-button')?.addEventListener('click', event => {
          event.stopPropagation();
          openGallery(card.querySelector('.preview-carousel'));
        });
      });
    }
    const featuredLink = document.querySelector('.h-feat-link');
    if (featuredLink) { featuredLink.textContent = 'View Work →'; featuredLink.onclick = () => window.showPage('projects'); }
  }

  const CASE_PAGES = {
    'Single Family Arboretum': {en:'/projects/arboretum-residential-design-georgia/', es:'/es/proyectos/arboretum-residential-design-georgia/'},
    'Arboretum 2': {en:'/projects/arboretum-2-commercial-architecture-colombia/', es:'/es/proyectos/arboretum-2-arquitectura-comercial-colombia/'},
    'Cultural & Convention Center': {en:'/projects/cultural-convention-center-colombia/', es:'/es/proyectos/centro-cultural-convenciones-colombia/'},
    'Eco Hotel': {en:'/projects/eco-hotel-quindio-colombia/', es:'/es/proyectos/eco-hotel-quindio-colombia/'},
    'Maná': {en:'/projects/mana-biomimetic-architecture-colombia/', es:'/es/proyectos/mana-arquitectura-biomimetica-colombia/'},
    'Coworking Building': {en:'/projects/coworking-the-shed-madrid-entrance-design/', es:'/es/proyectos/coworking-the-shed-madrid-diseno-acceso/'},
    'Cable Car': {en:'/projects/teleferico-fatima-cable-car-colombia/', es:'/es/proyectos/teleferico-fatima-colombia/'},
    'Residential Building 5 Floors': {en:'/projects/edificio-burgos-interior-design-spain/', es:'/es/proyectos/edificio-burgos-diseno-interiores-espana/'}
  };

  function caseLink(p) {
    p = Object.assign({}, p, {page: p.page || CASE_PAGES[p.name]});
    if (!p.page) return '';
    const es = (document.documentElement.lang || '').toLowerCase().startsWith('es');
    return '<a class="wcard-case" href="' + (es ? p.page.es : p.page.en) + '" onclick="event.stopPropagation()">' + (es ? 'Leer caso de estudio →' : 'Read case study →') + '</a>';
  }

  function workCard(p) {
    const missing = !p.images.length;
    return '<article class="wcard' + (missing ? ' is-missing' : '') + '" data-cat="' + p.cat + '" data-project="' + p.name + '" tabindex="0">' +
      (missing ? '' : carouselMarkup(p.images,p.name,p.note)) +
      '<div class="wcard-label"><div class="wcard-lname">' + p.name + '</div><div class="wcard-lsub">' + tr(p.category) + ' · ' + tr(p.country) + '</div>' + caseLink(p) + '</div>' +
    '</article>';
  }

  const workCarouselState = {
    category: 'all',
    projects: projectData.slice(),
    index: 0,
    changeTimer: 0,
    autoTimer: 0,
    generation: 0
  };

  function workProjectsFor(category) {
    if (category === 'all') return projectData.slice();
    return projectData.filter(project => project.cat === category);
  }

  function workVisibleCount() {
    // All projects are shown as one large vertical list (no sliding).
    return Infinity;
  }

  function updateWorkCarouselPosition() {
    const root = document.getElementById('projGrid');
    const track = root?.querySelector('.work-project-track');
    const firstCard = track?.querySelector('.wcard');
    if (!root || !track || !firstCard) return;
    const visible = Math.min(workVisibleCount(), workCarouselState.projects.length);
    const maxIndex = Math.max(0, workCarouselState.projects.length - visible);
    workCarouselState.index = Math.min(workCarouselState.index, maxIndex);
    const gap = parseFloat(getComputedStyle(track).gap) || 18;
    const step = firstCard.getBoundingClientRect().width + gap;
    track.style.transform = 'translate3d(-' + (workCarouselState.index * step) + 'px,0,0)';

    const previous = root.querySelector('.work-project-arrow.prev');
    const next = root.querySelector('.work-project-arrow.next');
    const controls = root.querySelector('.work-project-controls');
    const status = root.querySelector('.work-project-status');
    const hasOverflow = workCarouselState.projects.length > visible;
    controls?.classList.toggle('is-hidden', !hasOverflow);
    if (previous) previous.disabled = workCarouselState.index === 0;
    if (next) next.disabled = workCarouselState.index >= maxIndex;
    if (status) {
      const first = workCarouselState.projects.length ? workCarouselState.index + 1 : 0;
      const last = Math.min(workCarouselState.index + visible, workCarouselState.projects.length);
      status.textContent = first + '–' + last + ' / ' + workCarouselState.projects.length;
    }
  }

  function bindWorkCarousel(root) {
    const viewport = root.querySelector('.work-project-viewport');
    const previous = root.querySelector('.work-project-arrow.prev');
    const next = root.querySelector('.work-project-arrow.next');
    let startX = 0;
    let startY = 0;
    let ignoreSwipe = false;

    const scheduleAutoMove = () => {
      clearTimeout(workCarouselState.autoTimer);
      const visible = Math.min(workVisibleCount(), workCarouselState.projects.length);
      if (workCarouselState.projects.length <= visible) return;
      workCarouselState.autoTimer = window.setTimeout(() => {
        if (!root.isConnected) return;
        if (!document.hidden && document.getElementById('page-projects')?.classList.contains('active')) {
          const maxIndex = Math.max(0, workCarouselState.projects.length - workVisibleCount());
          workCarouselState.index = workCarouselState.index >= maxIndex ? 0 : workCarouselState.index + 1;
          updateWorkCarouselPosition();
        }
        scheduleAutoMove();
      }, CAROUSEL_INTERVAL);
    };

    previous?.addEventListener('click', () => {
      workCarouselState.index = Math.max(0, workCarouselState.index - 1);
      updateWorkCarouselPosition();
      scheduleAutoMove();
    });
    next?.addEventListener('click', () => {
      const maxIndex = Math.max(0, workCarouselState.projects.length - workVisibleCount());
      workCarouselState.index = Math.min(maxIndex, workCarouselState.index + 1);
      updateWorkCarouselPosition();
      scheduleAutoMove();
    });
    viewport?.addEventListener('pointerdown', event => {
      const inner = event.target.closest('.preview-carousel');
      ignoreSwipe = !!inner && Number(inner.dataset.count) > 1;
      startX = event.clientX;
      startY = event.clientY;
    }, {passive:true});
    viewport?.addEventListener('pointerup', event => {
      if (ignoreSwipe) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) < 46 || Math.abs(dx) <= Math.abs(dy) * 1.25) return;
      const maxIndex = Math.max(0, workCarouselState.projects.length - workVisibleCount());
      workCarouselState.index = Math.max(0, Math.min(maxIndex, workCarouselState.index + (dx < 0 ? 1 : -1)));
      updateWorkCarouselPosition();
      scheduleAutoMove();
    }, {passive:true});
    scheduleAutoMove();
  }

  function renderWorkCollection(immediate) {
    const root = document.getElementById('projGrid');
    if (!root) return;
    clearTimeout(workCarouselState.autoTimer);
    const generation = ++workCarouselState.generation;
    const render = () => {
      if (generation !== workCarouselState.generation) return;
      root.innerHTML =
        '<div class="work-project-viewport">' +
          '<div class="work-project-track">' + workCarouselState.projects.map(workCard).join('') + '</div>' +
        '</div>' +
        '<div class="work-project-controls" aria-label="Project carousel controls">' +
          '<button class="work-project-arrow prev" type="button" aria-label="Previous projects">' + svgArrow('prev') + '</button>' +
          '<span class="work-project-status" aria-live="polite"></span>' +
          '<button class="work-project-arrow next" type="button" aria-label="Next projects">' + svgArrow('next') + '</button>' +
        '</div>';
      bindWorkCarousel(root);
      initCarousels(root);
      requestAnimationFrame(() => {
        updateWorkCarouselPosition();
        root.classList.remove('is-switching');
      });
    };
    clearTimeout(workCarouselState.changeTimer);
    if (immediate) render();
    else {
      root.classList.add('is-switching');
      workCarouselState.changeTimer = window.setTimeout(render, 180);
    }
  }

  function selectWorkCategory(category, button, immediate) {
    const buttons = document.querySelectorAll('#page-projects .ftab');
    buttons.forEach(item => item.classList.toggle('on', item === button));
    workCarouselState.category = category;
    workCarouselState.projects = workProjectsFor(category);
    workCarouselState.index = 0;
    renderWorkCollection(immediate);
  }

  function updateWork() {
    const grid = document.getElementById('projGrid');
    if (grid) {
      grid.classList.add('work-project-carousel');
      renderWorkCollection(true);
    }
    const featuredButton = document.querySelector('#page-projects .wk-cta');
    if (featuredButton) featuredButton.onclick = goToFeatured;
  }

  function updateAbout() {
    const story = document.querySelector('#page-about .ab-text');
    if (story) story.innerHTML =
      '<p class="eyebrow">My Story</p>' +
      '<p>Hello, I\'m Valentina Arboleda, a licensed architect in Colombia, a Construction Project Management Specialist, and an NCARB International Architect Path candidate currently completing AXP &amp; ARE.</p>' +
      '<p>With international experience across Colombia, Spain, and the United States, my background spans residential architecture, interior design, space planning, BIM coordination, visualization, and construction processes. I approach every project from both a creative and technical perspective, with a focus on residential design, development strategy, and design-build solutions where the architect stays close to the making.</p>';
  }

  function updateJournal() {
    document.querySelector('#page-journal .jo-hero-r')?.setAttribute('aria-hidden','true');
    /* Cards still waiting for their LinkedIn post show "link pending".
       To publish one, add data-linkedin="<post url>" to its .jcard in index.html
       and it turns into a working "Read on LinkedIn" link automatically. */
    document.querySelectorAll('#page-journal .jcard[data-pending]').forEach(card => {
      const link = card.querySelector('.jcard-read');
      const url = card.getAttribute('data-linkedin');
      if (!link) return;
      if (url) {
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener';
        link.classList.remove('is-pending');
        card.removeAttribute('data-pending');
        link.innerHTML = (document.documentElement.lang === 'es' ? 'Leer en LinkedIn ' : 'Read on LinkedIn ') + svgArrow('next');
      } else {
        link.removeAttribute('href');
        link.classList.add('is-pending');
      }
    });
  }
  function updateFooter() {
    document.querySelector('.footer-title').innerHTML = 'Great projects start<br>with a <em>conversation.</em>';
  }

  function isolateRemovedPages() {
    document.querySelectorAll('#page-process img[src^="http"]').forEach(img => {
      img.src = '/images/process.webp';
    });
    document.querySelectorAll('#page-arboretum img[src^="http"]').forEach(img => {
      img.src = '/images/home/img-arboretum-georgia.webp';
    });
  }

  function initPreviewCursor() {
    const cursor = document.querySelector('.c-cursor');
    if (!cursor || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    let val = cursor.querySelector('.c-val');
    if (!val) {
      val = document.createElement('div');
      val.className = 'c-val';
      val.innerHTML = '<svg viewBox="0 0 40 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="vb" x1="0" x2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#f7f3ed"/><stop offset="1" stop-color="#cbc0b2"/></linearGradient><linearGradient id="vh" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fbf8f3"/><stop offset="1" stop-color="#e3dbcf"/></linearGradient><linearGradient id="vg" x1="0" x2="1"><stop offset="0" stop-color="#e9cf8f"/><stop offset=".5" stop-color="#c8a35f"/><stop offset="1" stop-color="#9c7a3c"/></linearGradient><filter id="vs" x="-40%" y="-20%" width="180%" height="140%"><feDropShadow dx=".6" dy="1.2" stdDeviation="1.3" flood-color="#4a4540" flood-opacity=".55"/></filter></defs><g filter="url(#vs)" fill="url(#vb)"><path d="M17.3 38.5c-.4 6.4-.6 11.9-.9 18.6-.1 1.2.6 1.9 1.4 1.9s1.3-.6 1.4-1.6l1-18.8z"/><path d="M21.2 38.5l1.4 18.9c.1 1 .6 1.6 1.4 1.6s1.5-.7 1.4-1.9c-.4-6.7-.8-12.2-1.3-18.6z"/><path d="M14.6 20.6c-1.7.6-2.3 1.9-2.6 3.7l-1.6 9.4c-.2 1.1.4 1.8 1.1 1.9.7.1 1.3-.4 1.5-1.4l2-9.6z"/><path class="va-down" d="M25.4 20.6c1.7.6 2.3 1.9 2.6 3.7l1.6 9.4c.2 1.1-.4 1.8-1.1 1.9-.7.1-1.3-.4-1.5-1.4l-2-9.6z"/><path class="va-up" d="M25.2 20.9c1.7-.5 2.6-1.8 3.3-3.4l3.6-8.7c.4-1 1.2-1.4 1.9-1.1.7.3.9 1.1.5 2.1l-3.6 9c-.8 2-2.1 3.6-4.3 4.2z"/><path d="M15.2 19.8c1.4-.8 3-1.1 4.8-1.1s3.4.3 4.8 1.1c.9.5 1.3 1.4 1.2 2.4l-1.2 8.2c-.1.9.2 1.8.6 2.6l.9 2.2c.6 1.6-.1 3.4-2 3.8-1.4.3-2.8.4-4.3.4s-2.9-.1-4.3-.4c-1.9-.4-2.6-2.2-2-3.8l.9-2.2c.4-.8.7-1.7.6-2.6L14 22.2c-.1-1 .3-1.9 1.2-2.4z"/><rect x="18.4" y="14.5" width="3.2" height="5" rx="1.5"/><ellipse cx="20" cy="9.6" rx="4.6" ry="5.6"/></g><path d="M15.1 10.7c-.6-4.4 1.5-7.5 4.9-7.5s5.5 3.1 4.9 7.5c-.2 1.4-.6 2.6-1.1 3.4.2-1.8.1-3.8-.7-5.3-.7.6-2 1-3.6 1s-2.6-.5-3.2-1.2c-.6 1.6-.6 3.6-.4 5.5-.5-.8-.8-2-.9-3.4z" fill="url(#vh)" opacity=".95"/><path d="M16.6 16.9c1 .6 2.1.9 3.4.9s2.4-.3 3.4-.9" fill="none" stroke="url(#vg)" stroke-width="1.5" stroke-linecap="round"/></svg>';
      cursor.appendChild(val);
    }
    document.body.classList.add('vcur');
    let x = -100, y = -100, px = null, py = null, vx = 0, vy = 0, rot = 0, sy = 1, flip = 1, raf = 0, last = performance.now();
    function tick(now) {
      const dt = Math.min(64, now - last) / 16.7; last = now;
      vx *= Math.pow(.82, dt); vy *= Math.pow(.82, dt);
      const tRot = Math.max(-28, Math.min(28, vx * 2.2));
      const tSy = 1 + Math.max(-.12, Math.min(.12, -vy * .012));
      rot += (tRot - rot) * Math.min(1, .25 * dt);
      sy += (tSy - sy) * Math.min(1, .25 * dt);
      if (vx > 1.2) flip = 1; else if (vx < -1.2) flip = -1;
      val.style.transform = 'rotate(' + rot.toFixed(2) + 'deg) scale(' + flip + ',' + sy.toFixed(3) + ')';
      cursor.style.transform = 'translate(' + x + 'px,' + y + 'px)';
      raf = (Math.abs(vx) + Math.abs(vy) > .05 || Math.abs(rot) > .2 || Math.abs(sy - 1) > .002) ? requestAnimationFrame(tick) : 0;
    }
    window.addEventListener('pointermove', event => {
      x = event.clientX; y = event.clientY;
      if (px !== null) { vx += (x - px) * .35; vy += (y - py) * .35; }
      px = x; py = y;
      if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    }, {passive:true});
    document.addEventListener('pointerover', event => {
      cursor.classList.toggle('expanded', !!event.target.closest('a,button,[onclick],.preview-carousel'));
    });
    document.addEventListener('mouseleave', () => cursor.classList.add('gone'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('gone'));
  }


  updateNavigation();
  updateHome();
  updateWork();
  updateAbout();
  updateJournal();
  updateFooter();
  isolateRemovedPages();
  initCarousels();
  initPreviewCursor();

  window.filterProj = function(cat, btn) {
    selectWorkCategory(cat, btn, false);
  };

  let workResizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(workResizeTimer);
    workResizeTimer = window.setTimeout(updateWorkCarouselPosition, 120);
  });

  const originalShowPage = window.showPage;
  window.showPage = function(id) {
    if (id === 'process') id = 'home';
    originalShowPage(id);
    document.querySelector('.nav-links')?.classList.remove('is-open');
    document.querySelector('.preview-menu-toggle')?.setAttribute('aria-expanded','false');
  };
})();
