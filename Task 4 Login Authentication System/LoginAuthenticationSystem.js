function showRegisterForm() {
  document.getElementById('register-form').style.display = 'block';
  document.getElementById('reset-form').style.display = 'none';
}

function showResetForm() {
  document.getElementById('reset-form').style.display = 'block';
  document.getElementById('register-form').style.display = 'none';
}

function checkStrength(password) {
  const indicator = document.getElementById('strength-indicator') || document.getElementById('reset-strength-indicator');
  let strength = "Weak";
  let color = "red";
  if (password.length > 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
    strength = "Strong";
    color = "green";
  } else if (password.length > 5) {
    strength = "Medium";
    color = "orange";
  }
  if (indicator) {
    indicator.textContent = `Strength: ${strength}`;
    indicator.style.color = color;
  }
}

function handleRegister() {
  const email = document.getElementById('reg-email').value.trim();
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  const confirm = document.getElementById('reg-confirm').value.trim();
  const remember = document.getElementById('remember-me').checked;

  if (!email || !username || !password || !confirm) {
    alert("⚠️ Please fill out all fields.");
    return;
  }

  if (password !== confirm) {
    alert("❌ Passwords do not match!");
    return;
  }

  const userData = { email, username, password };
  localStorage.setItem('authUser', JSON.stringify(userData));
  if (remember) {
    localStorage.setItem('rememberMe', true);
  }
  alert("✅ Registered successfully!");
  document.getElementById('register-form').style.display = 'none';
}

function handleLogin() {
  const loginUsername = document.getElementById('login-username').value.trim();
  const loginPassword = document.getElementById('login-password').value.trim();
  const storedUser = JSON.parse(localStorage.getItem('authUser'));

  if (!storedUser) {
    alert("❗ No user registered.");
    return;
  }

  if (
    (storedUser.email === loginUsername || storedUser.username === loginUsername) &&
    storedUser.password === loginPassword
  ) {
    alert("🎉 Login successful!");
  } else {
    alert("❌ Invalid credentials!");
  }
}

function resetPassword() {
  const newPass = document.getElementById('new-password').value.trim();
  const confirmPass = document.getElementById('confirm-new-password').value.trim();

  if (newPass !== confirmPass) {
    alert("❌ Passwords do not match!");
    return;
  }

  let storedUser = JSON.parse(localStorage.getItem('authUser'));
  if (!storedUser) {
    alert("❗ No user found.");
    return;
  }

  storedUser.password = newPass;
  localStorage.setItem('authUser', JSON.stringify(storedUser));
  alert("🔁 Password updated!");
  document.getElementById('reset-form').style.display = 'none';
}
