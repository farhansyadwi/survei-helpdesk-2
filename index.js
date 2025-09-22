// Capture identity on landing and go to survey page
(function () {
  const form = document.getElementById('identityForm');
  if (!form) return;
  const status = document.getElementById('identityStatus');

  // Pre-fill if exists
  ['nama','email','nohp','nrp'].forEach((k)=>{
    const v = localStorage.getItem('ident_'+k);
    if (v && form[k]) form[k].value = v;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const nama = form.nama.value.trim();
    const email = form.email.value.trim();
    const nohp = form.nohp.value.trim();
    const nrp = form.nrp.value.trim();

    if (!nama || !email || !nohp || !nrp) {
      status.textContent = 'Harap lengkapi semua data diri.';
      return;
    }

    // Save to localStorage
    localStorage.setItem('ident_nama', nama);
    localStorage.setItem('ident_email', email);
    localStorage.setItem('ident_nohp', nohp);
    localStorage.setItem('ident_nrp', nrp);

    // Go to survey page
    window.location.href = '/survey.html';
  });
})();
