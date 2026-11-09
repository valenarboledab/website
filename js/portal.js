/* Client portal — Firebase Authentication + Firestore.
   SETUP: paste your Firebase web app config below (Firebase console →
   Project settings → Your apps → Web app). Until then the portal shows a
   "coming soon" message and no login is attempted. */
const firebaseConfig = {
  apiKey: "AIzaSyDD3Ez_i7z0iyeBfixSRTVdhzdrzyMuqek",
  authDomain: "studio-valentina-portal.firebaseapp.com",
  projectId: "studio-valentina-portal",
  storageBucket: "studio-valentina-portal.firebasestorage.app",
  messagingSenderId: "290715834538",
  appId: "1:290715834538:web:b2e1b40130fa8256b358d3"
};

const PHASES_EN = ['Vision', 'Strategy', 'Design', 'Documentation', 'Execution'];
const PHASES_ES = ['Visión', 'Estrategia', 'Diseño', 'Documentación', 'Ejecución'];
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ES = (document.documentElement.lang || '').startsWith('es');
const T = (en, es) => (ES ? es : en);

const PHASES = ES ? PHASES_ES : PHASES_EN;

function show(view) {
  ['ptSetup', 'ptLogin', 'ptDash'].forEach((v) => { const el = $(v); if (el) el.hidden = v !== view; });
}
function msg(text, ok) { const m = $('ptMsg'); if (m) { m.textContent = text || ''; m.classList.toggle('ok', !!ok); } }

function safeUrl(u) {
  try { const x = new URL(u); return x.protocol === 'https:' ? x.href : null; } catch (e) { return null; }
}

// Project media: Firestore fields `images` (list of paths/URLs) and `video`; when missing, a client
// whose project is in the public portfolio gets those renders automatically.
const PORTFOLIO_MEDIA = [
  { match: /pradera/i, images: ['/RESIDENTIAL/Rooftop Single Family House - Colombia/TERRACE.webp'], video: 'rooftop' }
];
function mediaOf(data) {
  const known = PORTFOLIO_MEDIA.find((m) => m.match.test(data.project || ''));
  const imgs = (Array.isArray(data.images) && data.images.length ? data.images : known?.images || [])
    .map((u) => (typeof u === 'string' ? u : u?.url)).filter((u) => u && (u.startsWith('/') || safeUrl(u)));
  return { imgs, vid: data.video || known?.video || '' };
}
const WA = 'https://wa.me/16784905574';
const MAIL = 'mailto:officestudiovalentina@gmail.com';

function render(user, data) {
  const first = String(data?.name || user.displayName || user.email || '').split(/[\s@]/)[0];
  $('ptHello').textContent = T('Hello, ', 'Hola, ') + first;
  const contact = `<div class="pd-contact"><div><h3>${T('Questions about your project?', '¿Dudas sobre tu proyecto?')}</h3>
      <p>${T('Write to Valentina directly — she usually replies the same day.', 'Escríbele directamente a Valentina; normalmente responde el mismo día.')}</p></div>
      <div class="pd-contact-btns"><a class="pd-btn" href="${WA}" target="_blank" rel="noopener">WhatsApp</a><a class="pd-btn ghost" href="${MAIL}">Email</a></div></div>`;
  if (!data) {
    $('ptBody').innerHTML = `<div class="pt-card"><p>${T('Your project space is being set up. Valentina will add your project details shortly.', 'Tu espacio de proyecto se está preparando. Valentina agregará los detalles muy pronto.')}</p></div>${contact}`;
    return;
  }
  const phase = Math.max(0, Math.min(PHASES.length - 1, Number(data.phase) || 0));
  const done = /complet|termin|finaliz/i.test(data.status || '');
  const { imgs, vid } = mediaOf(data);
  const cover = imgs[0] ? `style="background-image:linear-gradient(180deg,rgba(30,24,18,.05) 30%,rgba(30,24,18,.72)),url('${esc(encodeURI(imgs[0]))}')"` : '';
  const timeline = PHASES.map((p, i) => `<li class="${i < phase || done ? 'done' : i === phase ? 'now' : ''}"><span class="pd-dot">${i < phase || done ? '✓' : i + 1}</span><span class="pd-lbl">${esc(p)}</span></li>`).join('');
  const list = (arr, fn, empty) => (Array.isArray(arr) && arr.length) ? `<ul class="pt-list">${arr.map(fn).join('')}</ul>` : `<p class="pd-empty">${empty}</p>`;
  const video = vid ? `<video class="pd-video" src="/videos/proj-${esc(vid)}.mp4" poster="/videos/posters/proj-${esc(vid)}.webp" controls muted playsinline preload="none"></video>` : '';
  const gallery = imgs.length ? `<div class="pd-gallery">${imgs.map((u) => `<a href="${esc(encodeURI(u))}" target="_blank" rel="noopener"><img src="${esc(encodeURI(u))}" alt="${esc(data.project || '')}" loading="lazy"></a>`).join('')}</div>` : '';
  $('ptBody').innerHTML = `
    <section class="pd-hero ${imgs[0] ? 'has-img' : ''}" ${cover}>
      <span class="pd-eyebrow">${T('Your project', 'Tu proyecto')}</span>
      <h2 class="pd-title">${esc(data.project || T('Your project', 'Tu proyecto'))}</h2>
      <span class="pd-chip ${done ? 'ok' : ''}">${esc(data.status || T('In progress', 'En curso'))}</span>
    </section>
    <section class="pt-card pd-progress">
      <h3>${T('Progress', 'Avance')}</h3>
      <ol class="pd-timeline">${timeline}</ol>
      <p class="pd-phase">${done ? T('Project completed. Thank you for trusting Studio Valentina.', 'Proyecto terminado. Gracias por confiar en Studio Valentina.') : `${T('Current phase', 'Fase actual')}: <strong>${esc(PHASES[phase])}</strong>`}</p>
    </section>
    ${video || gallery ? `<section class="pt-card pd-media"><h3>${T('Renders & video', 'Renders y video')}</h3>${video}${gallery}</section>` : ''}
    <div class="pt-grid">
      <div class="pt-card"><h3>${T('Next steps', 'Próximos pasos')}</h3>${list(data.nextSteps, (x) => `<li>${esc(x)}</li>`, T('Nothing pending right now.', 'Nada pendiente por ahora.'))}</div>
      <div class="pt-card"><h3>${T('Documents', 'Documentos')}</h3>${list(data.documents, (d) => { const u = safeUrl(d.url); return `<li>${u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(d.name)}</a>` : esc(d.name)}</li>`; }, T('No documents shared yet.', 'Aún no hay documentos compartidos.'))}</div>
      <div class="pt-card"><h3>${T('Updates', 'Novedades')}</h3>${list(data.updates, (u) => `<li>${esc(u.text)}<small>${esc(u.date)}</small></li>`, T('No updates yet.', 'Aún no hay novedades.'))}</div>
    </div>
    ${contact}`;
}

/* Free-resource download form: saves the lead (if Firebase is set up), then downloads the file. */
/* Email notification for every download.
   Each lead is also posted to a Google Form owned by Studio Valentina. The form has
   "email me on new responses" turned on, so Valentina gets an email straight away and
   every lead lands in the form's response sheet. The request is fire-and-forget: if it
   fails, the visitor still gets their file. */
const LEAD_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfMyLRuuZFByyFmyuKiXAETEqn940KsiA87xYXj84me9toJHQ/formResponse';
const LEAD_FIELDS = {
  name: 'entry.1300000209',
  email: 'entry.1564732390',
  resource: 'entry.1089109249',
  optIn: 'entry.132300978',
  lang: 'entry.442757480'
};

function notifyLead(lead) {
  try {
    const body = new URLSearchParams();
    body.append(LEAD_FIELDS.name, lead.name || '');
    body.append(LEAD_FIELDS.email, lead.email || '');
    body.append(LEAD_FIELDS.resource, lead.resource || '');
    body.append(LEAD_FIELDS.optIn, lead.optIn ? 'yes' : 'no');
    body.append(LEAD_FIELDS.lang, (document.documentElement.lang || 'en').slice(0, 5));
    fetch(LEAD_FORM_URL, { method: 'POST', mode: 'no-cors', body }).catch(() => {});
  } catch (e) { /* the download must happen either way */ }
}

function setupLeadForm(saveLead) {
  const form = $('leadForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const m = $('leadMsg');
    const name = $('leadName').value.trim().slice(0, 80);
    const email = $('leadEmail').value.trim().slice(0, 120);
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { m.textContent = 'Please enter your name and a valid email.'; m.classList.remove('ok'); return; }
    const btn = form.querySelector('button'); btn.disabled = true;
    const lead = { name, email, optIn: $('leadConsent').checked, resource: form.dataset.resource };
    notifyLead(lead);
    try {
      if (saveLead) await saveLead(lead);
    } catch (err) { /* still deliver the file */ }
    if (window.gtag) gtag('event', 'generate_lead', { resource: form.dataset.resource });
    const file = form.dataset.file;
    if (/^https?:\/\//.test(file)) {
      window.open(file, '_blank', 'noopener');
      m.textContent = 'Thanks, ' + name + '! The template opened in a new tab. Click "Use template" to copy it to your Canva.'; m.classList.add('ok');
    } else {
      const a = document.createElement('a'); a.href = file; a.download = ''; document.body.appendChild(a); a.click(); a.remove();
      m.textContent = 'Thanks, ' + name + '! Your download has started.'; m.classList.add('ok');
    }
    btn.disabled = false; form.reset();
  });
}

let resolveLeadSaver;
const leadSaver = new Promise((r) => { resolveLeadSaver = r; });
// Attach the form right away; saving the lead waits (max 4s) for Firebase, and the file is delivered either way.
setupLeadForm((lead) => Promise.race([
  leadSaver.then((save) => save && save(lead)),
  new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000))
]));

async function start() {
  const configured = !firebaseConfig.apiKey.startsWith('PASTE');
  if (!configured) { resolveLeadSaver(null); if ($('page-portal')) show('ptSetup'); return; }

  const v = '10.12.2';
  let initializeApp, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail,
      GoogleAuthProvider, signInWithPopup, signInWithRedirect, getAdditionalUserInfo, setPersistence, browserLocalPersistence,
      getFirestore, doc, getDoc, collection, addDoc, serverTimestamp;
  try {
    ({ initializeApp } = await import(`https://www.gstatic.com/firebasejs/${v}/firebase-app.js`));
    ({ getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail,
       GoogleAuthProvider, signInWithPopup, signInWithRedirect, getAdditionalUserInfo, setPersistence, browserLocalPersistence } =
      await import(`https://www.gstatic.com/firebasejs/${v}/firebase-auth.js`));
    ({ getFirestore, doc, getDoc, collection, addDoc, serverTimestamp } =
      await import(`https://www.gstatic.com/firebasejs/${v}/firebase-firestore.js`));
  } catch (e) {
    resolveLeadSaver(null);
    if ($('page-portal')) { show('ptLogin'); msg(T('The portal could not load. Please disable ad-blockers or try again later.', 'El portal no pudo cargar. Desactiva el bloqueador de anuncios o inténtalo más tarde.')); }
    return;
  }

  const app = initializeApp(firebaseConfig);
  // App Check (reCAPTCHA Enterprise / Fraud Defense): proves requests come from studio-valentina.com. Public site key.
  try {
    const { initializeAppCheck, ReCaptchaEnterpriseProvider } =
      await import(`https://www.gstatic.com/firebasejs/${v}/firebase-app-check.js`);
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider('6Lc0BhcuAAAAAFmSFtERQmjFgliC_gtEczYDgKLI'),
      isTokenAutoRefreshEnabled: true
    });
  } catch (e) { /* if App Check fails to load, the site keeps working */ }
  const auth = getAuth(app);
  const db = getFirestore(app);

  resolveLeadSaver((lead) => addDoc(collection(db, 'leads'), { ...lead, createdAt: serverTimestamp() }));
  if (!$('page-portal')) return;

  setPersistence(auth, browserLocalPersistence).catch(() => {});
  const errText = (err) => {
    const c = err?.code || '';
    if (c.includes('invalid-credential') || c.includes('wrong-password') || c.includes('user-not-found') || c.includes('invalid-email'))
      return T('Email or password is incorrect.', 'El correo o la contraseña no son correctos.');
    if (c.includes('too-many-requests')) return T('Too many attempts. Please wait a few minutes and try again.', 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.');
    if (c.includes('network')) return T('No connection. Check your internet and try again.', 'Sin conexión. Revisa tu internet e inténtalo de nuevo.');
    if (c.includes('account-exists-with-different-credential')) return T('This email already has a password. Sign in with email below.', 'Este correo ya tiene contraseña. Entra con tu correo abajo.');
    if (c.includes('popup-closed') || c.includes('cancelled-popup')) return '';
    return T('We could not sign you in. Please try again.', 'No pudimos iniciar tu sesión. Inténtalo de nuevo.');
  };
  // Google accounts that are not clients: remove the just-created account and say so.
  const NOT_CLIENT = T('This Google account has no active project. If you are a client, contact Valentina or sign in with the email she registered.',
    'Esta cuenta de Google no tiene un proyecto activo. Si eres cliente, escríbele a Valentina o entra con el correo que ella registró.');
  let pendingNotice = '';

  $('ptForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    msg('');
    try {
      await signInWithEmailAndPassword(auth, $('ptEmail').value.trim(), $('ptPass').value);
    } catch (err) {
      msg(errText(err));
    }
  });
  $('ptGoogle')?.addEventListener('click', async () => {
    msg('');
    const b = $('ptGoogle'); b.disabled = true;
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const res = await signInWithPopup(auth, provider);
      if (getAdditionalUserInfo(res)?.isNewUser) {
        const snap = await getDoc(doc(db, 'clients', res.user.uid)).catch(() => null);
        if (!snap || !snap.exists()) { pendingNotice = NOT_CLIENT; await res.user.delete().catch(() => signOut(auth)); }
      }
    } catch (err) {
      if ((err?.code || '').includes('popup-blocked')) { signInWithRedirect(auth, provider); return; }
      msg(errText(err));
    } finally { b.disabled = false; }
  });
  $('ptReset').addEventListener('click', async () => {
    const email = $('ptEmail').value.trim();
    if (!email) { msg(T('Type your email first, then tap "Forgot password".', 'Escribe tu correo primero y luego toca "¿Olvidaste tu contraseña?".')); return; }
    try { await sendPasswordResetEmail(auth, email); } catch (e) {}
    msg(T('If that email has an account, a reset link is on its way.', 'Si ese correo tiene cuenta, te llegará un enlace para cambiar la contraseña.'), true);
  });
  $('ptOut').addEventListener('click', () => signOut(auth));

  onAuthStateChanged(auth, async (user) => {
    if (!user) { show('ptLogin'); if (pendingNotice) { msg(pendingNotice); pendingNotice = ''; } return; }
    show('ptDash');
    $('ptBody').innerHTML = `<p>${T('Loading…', 'Cargando…')}</p>`;
    try {
      const snap = await getDoc(doc(db, 'clients', user.uid));
      render(user, snap.exists() ? snap.data() : null);
    } catch (e) {
      $('ptBody').innerHTML = `<p>${T('We could not load your project right now. Please try again later.', 'No pudimos cargar tu proyecto ahora. Inténtalo más tarde.')}</p>`;
    }
  });
}

start();
