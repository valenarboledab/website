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

  const projectData = [
    {name:'Cable Car',country:'Colombia',cat:'commercial',category:'Commercial · Infrastructure',images:['/images/teleferico.webp']},
    {name:'Residential Building 5 Floors',country:'Spain',cat:'commercial',category:'Commercial · Residential',images:residentialBuildingImages},
    {name:'G-Metria',country:'Colombia',cat:'commercial',category:'Commercial · Public Interior',images:['/COMMERCIAL/PUBLIC SPACE/G-Metria - Colombia/20260527_125716831_iOS.webp']},
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
    {name:'Architectural Design',country:'Colombia',cat:'interior',category:'Residential + Interior Design',images:architecturalDesignImages}
  ];

  const featuredData = [
    {name:'Single Family Arboretum',country:'USA',images:arboretumImages},
    {name:'Arboretum 2',country:'Colombia',images:['/images/home/img-hero.webp'],award:true},
    {name:'Cultural & Convention Center',country:'Colombia',images:['/images/home/img-cultural.webp'],award:true},
    {name:'Eco Hotel',country:'Colombia',images:ecoHotelImages},
    {name:'Maná',country:'Colombia',images:manaImages,note:'8 of 9 assets found',award:true},
    {name:'Coworking Building',country:'Spain',images:['/images/COWORKING.webp']}
  ];

  const PROJECT_VIDEOS = {"Single Family Arboretum": "arboretum-greatroom", "Arboretum 2": "arboretum-col", "Cultural & Convention Center": "cultural", "Eco Hotel": "ecohotel", "Maná": "mana", "Coworking Building": "coworking", "Cable Car": "teleferico", "Residential Building 5 Floors": "burgos", "G-Metria": "gmetria", "Public Space & View Point": "viewpoint", "Medical Building": "medical", "Marawi": "marawi", "Zonata Apartments": "zonata", "Residential BBQ": "bbq", "3D Visualization": "facade", "Residential Pool Design": "pool", "La Pradera – Residential Design": "rooftop", "Residential House": "lot1", "Serena Hills": "serena", "Architectural Design": "bimhouse"};
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
          '<button class="gallery-lightbox-close" type="button" aria-label="Close gallery">×</button>' +
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
          '<div class="fproj-info"><div class="fproj-info-loc">' + p.country + '</div><div class="fproj-info-name">' + p.name + '</div></div>' +
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

  function workCard(p) {
    const missing = !p.images.length;
    return '<article class="wcard' + (missing ? ' is-missing' : '') + '" data-cat="' + p.cat + '" data-project="' + p.name + '" tabindex="0">' +
      (missing ? '' : carouselMarkup(p.images,p.name,p.note)) +
      '<div class="wcard-label"><div class="wcard-lname">' + p.name + '</div><div class="wcard-lsub">' + p.category + ' · ' + p.country + '</div></div>' +
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
    const linkedinUrls = {
      0: 'https://www.linkedin.com/posts/valenarboledab_man%C3%A1-biophilic-architecture-activity-7485449792312049664-3tje?utm_source=share&utm_medium=member_ios&rcm=ACoAADQ4oBEBlJbH-kZb1h8A32waERRiUXdgqu4',
      3: 'https://www.linkedin.com/posts/valenarboledab_what-if-the-problem-became-the-best-part-activity-7494158417423568897-gGGj?utm_source=share&utm_medium=member_ios&rcm=ACoAADQ4oBEBlJbH-kZb1h8A32waERRiUXdgqu4'
    };
    const cards = document.querySelectorAll('#page-journal .jcard');
    cards.forEach((card, i) => {
      const link = card.querySelector('.jcard-read');
      if (i === 0) {
        card.querySelector('.jcard-title').textContent = 'Maná: Biophilic Architecture';
        card.querySelector('.jcard-img img').src = '/images/home/img-mana.webp';
      }
      if (linkedinUrls[i]) {
        link.href = linkedinUrls[i];
        link.target = '_blank';
        link.rel = 'noopener';
        link.classList.remove('is-pending');
        link.innerHTML = 'Read on LinkedIn ' + svgArrow('next');
      } else {
        link.removeAttribute('href');
        link.classList.add('is-pending');
        link.textContent = 'LinkedIn link pending';
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
    window.addEventListener('pointermove', event => {
      cursor.style.transform = 'translate(' + event.clientX + 'px,' + event.clientY + 'px)';
    }, {passive:true});
    document.addEventListener('pointerover', event => {
      cursor.classList.toggle('expanded', !!event.target.closest('a,button,[onclick],.preview-carousel'));
    });
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
