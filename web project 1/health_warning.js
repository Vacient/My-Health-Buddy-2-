// Modal
function openModal() {
  document.getElementById('modal').classList.add('active');
}
function closeModal() {
  document.getElementById('modal').classList.remove('active');
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// Quick Mental Health Check
function runCheck(e) {
  e.preventDefault();
  const q1 = document.getElementById('q1').value;
  const q2 = document.getElementById('q2').value;
  const result = document.getElementById('result');

  if (q1 === 'yes') {
    result.innerHTML = `<strong style="color:var(--danger)">Immediate action recommended:</strong> Thoughts of self-harm. Call emergency services now.`;
    return;
  }
  if (q2 === 'yes') {
    result.innerHTML = 'Consider contacting a mental health professional soon. If symptoms worsen, seek emergency care.';
    return;
  }
  result.innerHTML = 'No immediate red flags — if concerned, reach out to someone you trust or a professional.';
}

function resetCheck() {
  document.getElementById('quick-check').reset();
  document.getElementById('result').innerHTML = '';
}

// Download Safety Checklist
function downloadChecklist() {
  const html = `
  <html><head><meta charset="utf-8"><title>Safety Checklist</title></head>
  <body><h1>Safety Checklist</h1><ul>
  <li>Emergency number: __________________</li>
  <li>Three support people: _________________</li>
  <li>Medication & important notes: _________</li>
  <li>Two coping strategies: _____________</li>
  <li>Nearest emergency department: ________</li>
  </ul></body></html>`;
  const blob = new Blob([html], {type:'text/html'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'safety-checklist.html';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Impostor Syndrome Check
function checkImposter() {
  const form = document.getElementById('imposterForm');
  const checks = form.querySelectorAll("input[type='checkbox']:checked");
  const result = document.getElementById('imposterResult');
  const resources = document.getElementById('imposterResources');

  if (checks.length >= 3) {
    result.innerHTML = 'You may be experiencing impostor syndrome. Remember: you are not alone. Talk with peers, mentors, or a counselor.';
    result.style.color = 'red';
    resources.style.display = 'block';
  } else if (checks.length >= 1) {
    result.innerHTML = 'You may sometimes experience impostor feelings, but these are common. Focus on your achievements.';
    result.style.color = 'orange';
    resources.style.display = 'none';
  } else {
    result.innerHTML = 'You seem confident in your abilities. Keep acknowledging your successes!';
    result.style.color = 'green';
    resources.style.display = 'none';
  }
}
