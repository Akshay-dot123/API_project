// api.js - Frontend-only: show input values + redirect
const start = Date.now();
while (Date.now() - start < 3000) {
  // Busy wait
}
console.log('Slow script executed');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  if (!form) return;

  const btn = document.getElementById('submit-btn');
  const msg = document.getElementById('form-message');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get values
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    // ⚠️ In real apps: NEVER access or display password like this
    // const password = document.getElementById('password')?.value; 

    // Loading state
    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'Submitting...';
    msg.textContent = '';
    msg.className = '';

    // Simulate brief processing delay
    setTimeout(() => {
      // ✅ Show success message WITH username (demo only)
      msg.innerHTML = `
        Hi <strong>${escapeHtml(username)}</strong>! 🎉<br>
        <small>Email: ${escapeHtml(email)}</small><br>
        <small>Redirecting to about.html...</small>
      `;
      msg.classList.add('success');

      // 🔁 Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = 'about.html';
      }, 2000);
      
    }, 600);
  });

  // 🔒 Helper: Prevent XSS by escaping user input
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});