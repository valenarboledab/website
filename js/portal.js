/* Client portal — Firebase Authentication + Firestore.
   SETUP: paste your Firebase web app config below (Firebase console →
   Project settings → Your apps → Web app). Until then the portal shows a
   "coming soon" message and no login is attempted. */
const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT.firebaseapp.com",
  projectId: "PASTE_PROJECT_ID",
  appId: "PASTE_APP_ID"
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

async function start() {
  if (!$('page-portal')) return;
  if (firebaseConfig.apiKey.startsWith('PASTE')) { show('ptSetup'); return; }

  const v = '10.12.2';
  const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${v}/firebase-app.js`);
  const { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } =
    await import(`https://www.gstatic.com/firebasejs/${v}/firebase-auth.js`);
  const { getFirestore, doc, getDoc } = await import(`https://www.gstatic.com/firebasejs/${v}/firebase-firestore.js`);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

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
