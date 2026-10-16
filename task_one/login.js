const form = document.getElementById("loginForm");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const rememberInput = document.getElementById("remember");
const usernameError = document.getElementById("usernameError");
const passwordError = document.getElementById("passwordError");
const submitButton = form.querySelector("button[type='submit']");
const togglePasswordBtn = document.getElementById("togglePassword");
const googleBtn = document.getElementById("googleLogin");
const facebookBtn = document.getElementById("facebookLogin");

// --- Remember Me: prefill saved username on page load ---
try {
  const savedUsername = localStorage.getItem("rememberedUsername");
  if (savedUsername) {
    usernameInput.value = savedUsername;
    rememberInput.checked = true;
  }
} catch (e) {
  console.warn("localStorage not available", e);
}

// --- Validation helpers ---
function validateUsername() {
  const value = usernameInput.value.trim();
  let message = "";

  if (!value) {
    message = "Username is required.";
  } else if (value.length < 3) {
    message = "Username must be at least 3 characters.";
  }

  showError(usernameInput, usernameError, message);
  return message === "";
}

function validatePassword() {
  const value = passwordInput.value;
  let message = "";

  if (!value) {
    message = "Password is required.";
  } else if (value.length < 8) {
    message = "Password must be at least 8 characters.";
  }

  showError(passwordInput, passwordError, message);
  return message === "";
}

function showError(input, errorEl, message) {
  errorEl.textContent = message;
  input.classList.toggle("invalid", message !== "");
  input.setAttribute("aria-invalid", message !== "");
}

// --- Live validation ---
usernameInput.addEventListener("blur", validateUsername);
passwordInput.addEventListener("blur", validatePassword);

usernameInput.addEventListener("input", () => {
  if (usernameInput.classList.contains("invalid")) validateUsername();
});
passwordInput.addEventListener("input", () => {
  if (passwordInput.classList.contains("invalid")) validatePassword();
});

// --- Show / hide password ---
togglePasswordBtn.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";

  passwordInput.type = isHidden ? "text" : "password";
  togglePasswordBtn.textContent = isHidden ? "Hide" : "Show";
  togglePasswordBtn.setAttribute(
    "aria-label",
    isHidden ? "Hide password" : "Show password"
  );
});

// --- Social login buttons (demo only) ---
googleBtn.addEventListener("click", () => {
  alert("Google login is not connected in this demo.");
});

facebookBtn.addEventListener("click", () => {
  alert("Facebook login is not connected in this demo.");
});

// --- Submit ---
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const usernameOk = validateUsername();
  const passwordOk = validatePassword();

  if (!usernameOk || !passwordOk) return;

  try {
    if (rememberInput.checked) {
      localStorage.setItem("rememberedUsername", usernameInput.value.trim());
    } else {
      localStorage.removeItem("rememberedUsername");
    }
  } catch (e) {
    console.warn("localStorage not available", e);
  }

  // Fake login request (no real backend for this task)
  submitButton.disabled = true;
  submitButton.textContent = "Signing in...";

  setTimeout(() => {
    alert("Login successful!");
    submitButton.disabled = false;
    submitButton.textContent = "Sign in";
  }, 1000);
});