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

const PHASES = ['Vision', 'Strategy', 'Design', 'Documentation', 'Execution'];
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ES = (document.documentElement.lang || '').startsWith('es');
const T = (en, es) => (ES ? es : en);

function show(view) {
  ['ptSetup', 'ptLogin', 'ptDash'].forEach((v) => { const el = $(v); if (el) el.hidden = v !== view; });
}
function msg(text, ok) { const m = $('ptMsg'); if (m) { m.textContent = text || ''; m.classList.toggle('ok', !!ok); } }

function safeUrl(u) {
  try { const x = new URL(u); return x.protocol === 'https:' ? x.href : null; } catch (e) { return null; }
}

function render(user, data) {
  $('ptHello').textContent = T('Hello, ', 'Hola, ') + (data?.name || user.email);
  if (!data) {
    $('ptBody').innerHTML = '<div class="pt-card"><p>Your project space is being set up. Valentina will add your project details shortly.</p></div>';
    return;
  }
  const phase = Math.max(0, Math.min(PHASES.length - 1, Number(data.phase) || 0));
  const steps = PHASES.map((_, i) => `<span class="${i <= phase ? 'on' : ''}"></span>`).join('');
  const list = (arr, fn, empty) => (Array.isArray(arr) && arr.length) ? `<ul class="pt-list">${arr.map(fn).join('')}</ul>` : `<p>${empty}</p>`;
  $('ptBody').innerHTML = `
    <div class="pt-card">
      <h3 style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--text-light);margin:0 0 8px;font-weight:500">Project</h3>
      <p style="font-size:22px;color:var(--text);margin:0 0 10px">${esc(data.project || 'Your project')}</p>
      <span class="pt-status">${esc(data.status || 'In progress')}</span>
      <div class="pt-steps">${steps}</div>
      <p class="pt-phase">Current phase: <strong>${esc(PHASES[phase])}</strong></p>
    </div>
    <div class="pt-grid">
      <div class="pt-card"><h3>Next steps</h3>${list(data.nextSteps, (s) => `<li>${esc(s)}</li>`, 'Nothing pending right now.')}</div>
      <div class="pt-card"><h3>Documents</h3>${list(data.documents, (d) => { const u = safeUrl(d.url); return `<li>${u ? `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(d.name)}</a>` : esc(d.name)}</li>`; }, 'No documents shared yet.')}</div>
      <div class="pt-card"><h3>Updates</h3>${list(data.updates, (u) => `<li>${esc(u.text)}<small>${esc(u.date)}</small></li>`, 'No updates yet.')}</div>
    </div>`;
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
      $('ptBody').innerHTML = '<p>We could not load your project right now. Please try again later.</p>';
    }
  });
}

start();
