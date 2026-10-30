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

function show(view) {
  ['ptSetup', 'ptLogin', 'ptDash'].forEach((v) => { const el = $(v); if (el) el.hidden = v !== view; });
}
function msg(text, ok) { const m = $('ptMsg'); if (m) { m.textContent = text || ''; m.classList.toggle('ok', !!ok); } }

function safeUrl(u) {
  try { const x = new URL(u); return x.protocol === 'https:' ? x.href : null; } catch (e) { return null; }
}

function render(user, data) {
  $('ptHello').textContent = 'Hello, ' + (data?.name || user.email);
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
    try {
      if (saveLead) await saveLead({ name, email, optIn: $('leadConsent').checked, resource: form.dataset.resource });
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
      getFirestore, doc, getDoc, collection, addDoc, serverTimestamp;
  try {
    ({ initializeApp } = await import(`https://www.gstatic.com/firebasejs/${v}/firebase-app.js`));
    ({ getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } =
      await import(`https://www.gstatic.com/firebasejs/${v}/firebase-auth.js`));
    ({ getFirestore, doc, getDoc, collection, addDoc, serverTimestamp } =
      await import(`https://www.gstatic.com/firebasejs/${v}/firebase-firestore.js`));
  } catch (e) {
    resolveLeadSaver(null);
    if ($('page-portal')) { show('ptLogin'); msg('The portal could not load. Please disable ad-blockers or try again later.'); }
    return;
  }

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  resolveLeadSaver((lead) => addDoc(collection(db, 'leads'), { ...lead, createdAt: serverTimestamp() }));
  if (!$('page-portal')) return;

  $('ptForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    msg('');
    try {
      await signInWithEmailAndPassword(auth, $('ptEmail').value.trim(), $('ptPass').value);
    } catch (err) {
      msg('Email or password is incorrect.');
    }
  });
  $('ptReset').addEventListener('click', async () => {
    const email = $('ptEmail').value.trim();
    if (!email) { msg('Type your email first, then tap "Forgot password".'); return; }
    try { await sendPasswordResetEmail(auth, email); } catch (e) {}
    msg('If that email has an account, a reset link is on its way.', true);
  });
  $('ptOut').addEventListener('click', () => signOut(auth));

  onAuthStateChanged(auth, async (user) => {
    if (!user) { show('ptLogin'); return; }
    show('ptDash');
    $('ptBody').innerHTML = '<p>Loading…</p>';
    try {
      const snap = await getDoc(doc(db, 'clients', user.uid));
      render(user, snap.exists() ? snap.data() : null);
    } catch (e) {
      $('ptBody').innerHTML = '<p>We could not load your project right now. Please try again later.</p>';
    }
  });
}

start();
