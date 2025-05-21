/**
 * Proj-e-Deal - Authentication Pages JavaScript
 * Handles login, registration forms and validation
 */

// DOM Elements
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const authTabs = document.querySelectorAll('.auth-tab');
const passwordInputs = document.querySelectorAll('.password-input');
const strengthMeters = document.querySelectorAll('.strength-meter-fill');
const strengthTexts = document.querySelectorAll('.strength-text');
const accountTypeCards = document.querySelectorAll('.type-card');

// Initialize auth page functionality
function initAuthPage() {
  // Handle tab switching
  initTabs();
  
  // Password strength
  initPasswordStrengthMeters();
  
  // Account type selection
  initAccountTypeSelection();
  
  // Form validation
  initFormValidation();
}

// Handle tab switching between login and register
function initTabs() {
  const tabContents = document.querySelectorAll('.auth-form');
  
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      
      // Update active tab
      authTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update visible form
      tabContents.forEach(content => {
        if (content.getAttribute('data-tab') === target) {
          content.style.display = 'block';
        } else {
          content.style.display = 'none';
        }
      });
    });
  });
}

// Password strength functionality
function initPasswordStrengthMeters() {
  passwordInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      const password = input.value;
      const strength = getPasswordStrength(password);
      
      // Update strength meter
      const meter = strengthMeters[index];
      const text = strengthTexts[index];
      
      if (strength === 0) {
        meter.className = 'strength-meter-fill';
        text.textContent = '';
      } else if (strength < 2) {
        meter.className = 'strength-meter-fill weak';
        text.textContent = 'Faible';
        text.style.color = '#FF3B30';
      } else if (strength < 4) {
        meter.className = 'strength-meter-fill medium';
        text.textContent = 'Moyen';
        text.style.color = '#FFCC00';
      } else if (strength < 5) {
        meter.className = 'strength-meter-fill strong';
        text.textContent = 'Fort';
        text.style.color = '#34C759';
      } else {
        meter.className = 'strength-meter-fill very-strong';
        text.textContent = 'Très fort';
        text.style.color = '#30D158';
      }
    });
  });
}

// Calculate password strength (0-5)
function getPasswordStrength(password) {
  let strength = 0;
  
  if (!password) return strength;
  
  // Length check
  if (password.length >= 8) strength += 1;
  if (password.length >= 12) strength += 1;
  
  // Character type checks
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  if (hasUppercase) strength += 1;
  if (hasLowercase) strength += 1;
  if (hasNumber) strength += 1;
  if (hasSpecial) strength += 1;
  
  return strength;
}

// Account type selection for registration
function initAccountTypeSelection() {
  accountTypeCards.forEach(card => {
    card.addEventListener('click', () => {
      accountTypeCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      const accountTypeInput = document.querySelector('#account-type');
      if (accountTypeInput) {
        accountTypeInput.value = card.getAttribute('data-type');
      }
    });
  });
}

// Form validation
function initFormValidation() {
  // Login form validation
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = loginForm.querySelector('#login-email');
      const password = loginForm.querySelector('#login-password');
      let isValid = true;
      
      // Validate email
      if (!email.value.trim()) {
        showError(email, 'Veuillez entrer votre email');
        isValid = false;
      } else if (!isValidEmail(email.value)) {
        showError(email, 'Email invalide');
        isValid = false;
      } else {
        clearError(email);
      }
      
      // Validate password
      if (!password.value.trim()) {
        showError(password, 'Veuillez entrer votre mot de passe');
        isValid = false;
      } else {
        clearError(password);
      }
      
      if (isValid) {
        // Simulate login (in a real app, this would submit to a server)
        showMessage('Connexion en cours...', 'info');
        simulateAuth();
      }
    });
  }
  
  // Registration form validation
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = registerForm.querySelector('#register-name');
      const email = registerForm.querySelector('#register-email');
      const password = registerForm.querySelector('#register-password');
      const passwordConfirm = registerForm.querySelector('#register-password-confirm');
      const terms = registerForm.querySelector('#terms');
      const accountType = registerForm.querySelector('#account-type');
      
      let isValid = true;
      
      // Validate name
      if (!name.value.trim()) {
        showError(name, 'Veuillez entrer votre nom');
        isValid = false;
      } else {
        clearError(name);
      }
      
      // Validate email
      if (!email.value.trim()) {
        showError(email, 'Veuillez entrer votre email');
        isValid = false;
      } else if (!isValidEmail(email.value)) {
        showError(email, 'Email invalide');
        isValid = false;
      } else {
        clearError(email);
      }
      
      // Validate password
      if (!password.value.trim()) {
        showError(password, 'Veuillez entrer un mot de passe');
        isValid = false;
      } else if (getPasswordStrength(password.value) < 3) {
        showError(password, 'Le mot de passe est trop faible');
        isValid = false;
      } else {
        clearError(password);
      }
      
      // Validate password confirmation
      if (!passwordConfirm.value.trim()) {
        showError(passwordConfirm, 'Veuillez confirmer votre mot de passe');
        isValid = false;
      } else if (password.value !== passwordConfirm.value) {
        showError(passwordConfirm, 'Les mots de passe ne correspondent pas');
        isValid = false;
      } else {
        clearError(passwordConfirm);
      }
      
      // Validate terms acceptance
      if (terms && !terms.checked) {
        showError(terms, 'Vous devez accepter les conditions');
        isValid = false;
      } else if (terms) {
        clearError(terms);
      }
      
      // Validate account type
      if (accountType && !accountType.value) {
        showMessage('Veuillez sélectionner un type de compte', 'error');
        isValid = false;
      }
      
      if (isValid) {
        showMessage('Création de compte en cours...', 'info');
        simulateAuth();
      }
    });
  }
}

// Helper functions
function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function showError(input, message) {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  
  input.classList.add('error');
  
  let errorElement = formGroup.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    formGroup.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
}

function clearError(input) {
  const formGroup = input.closest('.form-group');
  if (!formGroup) return;
  
  input.classList.remove('error');
  
  const errorElement = formGroup.querySelector('.error-message');
  if (errorElement) {
    errorElement.remove();
  }
}

function showMessage(message, type = 'info') {
  let messageContainer = document.querySelector('.auth-message');
  
  if (!messageContainer) {
    messageContainer = document.createElement('div');
    messageContainer.className = 'auth-message';
    
    const form = loginForm || registerForm;
    if (form) {
      form.insertBefore(messageContainer, form.firstChild);
    }
  }
  
  messageContainer.textContent = message;
  messageContainer.className = `auth-message ${type}`;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    messageContainer.style.opacity = '0';
    setTimeout(() => {
      messageContainer.remove();
    }, 500);
  }, 5000);
}

// Simulate authentication (in a real app, this would communicate with a backend)
function simulateAuth() {
  // Simulate loading
  setTimeout(() => {
    const success = Math.random() > 0.3; // 70% success rate for demo
    
    if (success) {
      showMessage('Authentification réussie. Redirection...', 'success');
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      if (loginForm && loginForm.style.display !== 'none') {
        showMessage('Identifiants invalides. Veuillez réessayer.', 'error');
      } else {
        showMessage('Erreur lors de la création du compte. Veuillez réessayer.', 'error');
      }
    }
  }, 1500);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initAuthPage);
