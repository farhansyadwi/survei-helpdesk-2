async function submitSurvey(evt) {
  evt.preventDefault();
  const status = document.getElementById('formStatus');
  status.textContent = 'Mengirim...';

  const form = evt.currentTarget;

  // Get identity from localStorage
  const nama = localStorage.getItem('ident_nama') || '';
  const email = localStorage.getItem('ident_email') || '';
  const nohp = localStorage.getItem('ident_nohp') || '';
  const nrp = localStorage.getItem('ident_nrp') || '';
  if (!nama || !email || !nohp || !nrp) {
    status.textContent = 'Data diri tidak ditemukan. Silakan isi data diri terlebih dahulu.';
    window.location.href = '/';
    return;
  }

  const data = {
    nama,
    email,
    nohp,
    nrp,
    likert: {
      kemudahan: form.kemudahan.value,
      kecepatan: form.kecepatan.value,
      tampilan: form.tampilan.value,
      fitur: form.fitur.value,
      stabilitas: form.stabilitas.value,
      keamanan: form.keamanan.value,
      kesesuaian: form.kesesuaian.value,
      support: form.support.value,
      keseluruhan: form.keseluruhan.value,
    },
    saran: form.saran.value.trim(),
  };

  try {
    const resp = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await resp.json();
    if (!resp.ok || !json.ok) throw new Error(json.message || 'Gagal mengirim');
    window.location.href = '/thankyou.html';
  } catch (err) {
    console.error(err);
    status.textContent = 'Terjadi kesalahan saat mengirim. Silakan coba lagi.';
  }
}

const formEl = document.getElementById('surveyForm');
formEl.addEventListener('submit', submitSurvey);

// Populate identity summary and guard access
(function initIdentity() {
  const nama = localStorage.getItem('ident_nama');
  const email = localStorage.getItem('ident_email');
  const nohp = localStorage.getItem('ident_nohp');
  const nrp = localStorage.getItem('ident_nrp');
  if (!nama || !email || !nohp || !nrp) {
    const status = document.getElementById('formStatus') || document.getElementById('identSummary');
    if (status) status.textContent = 'Data diri belum diisi. Mengalihkan ke halaman awal...';
    setTimeout(() => (window.location.href = '/'), 600);
    return;
  }
  const el = document.getElementById('identSummary');
  if (el) {
    el.innerHTML = `<div class="chips">
      <span class="chip">${nama}</span>
      <span class="chip">${email}</span>
      <span class="chip">${nohp}</span>
      <span class="chip">NRP: ${nrp}</span>
    </div>`;
  }
})();
