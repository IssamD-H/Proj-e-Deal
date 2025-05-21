/**
 * Proj-e-Deal - Main JavaScript
 * Contains shared functionality across all pages
 */

// DOM elements
const header = document.querySelector('header');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

// Responsive navigation menu
if (mobileMenuToggle && navMenu) {
  mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
  });
}

// Sticky header on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
});

// Initialize tooltips
function initTooltips() {
  const tooltips = document.querySelectorAll('[data-tooltip]');
  tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseenter', function() {
      const tooltipText = this.getAttribute('data-tooltip');
      
      const tooltipEl = document.createElement('div');
      tooltipEl.className = 'tooltip';
      tooltipEl.textContent = tooltipText;
      
      document.body.appendChild(tooltipEl);
      
      const rect = this.getBoundingClientRect();
      const tooltipRect = tooltipEl.getBoundingClientRect();
      
      tooltipEl.style.top = `${rect.top - tooltipRect.height - 10}px`;
      tooltipEl.style.left = `${rect.left + (rect.width / 2) - (tooltipRect.width / 2)}px`;
    });
    
    tooltip.addEventListener('mouseleave', function() {
      const tooltipEl = document.querySelector('.tooltip');
      if (tooltipEl) tooltipEl.remove();
    });
  });
}

// Form validation helper
function validateForm(form) {
  let isValid = true;
  
  form.querySelectorAll('.form-control').forEach(input => {
    if (input.hasAttribute('required') && !input.value.trim()) {
      markInvalid(input, 'Ce champ est requis');
      isValid = false;
    } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
      markInvalid(input, 'Email invalide');
      isValid = false;
    } else if (input.classList.contains('password')) {
      const strengthValue = getPasswordStrength(input.value);
      if (strengthValue < 2) {
        markInvalid(input, 'Mot de passe trop faible');
        isValid = false;
      } else {
        markValid(input);
      }
    } else {
      markValid(input);
    }
  });
  
  return isValid;
}

function markInvalid(input, message) {
  input.classList.add('error');
  
  let errorMessage = input.parentElement.querySelector('.error-message');
  if (!errorMessage) {
    errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    input.parentElement.appendChild(errorMessage);
  }
  
  errorMessage.textContent = message;
}

function markValid(input) {
  input.classList.remove('error');
  
  const errorMessage = input.parentElement.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
}

function isValidEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function getPasswordStrength(password) {
  let strength = 0;
  
  if (password.length >= 8) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  return strength;
}

// Toggle expandable sections (FAQ, project details, etc.)
function initExpandableSections() {
  const expandableSections = document.querySelectorAll('.expandable-section');
  
  expandableSections.forEach(section => {
    const header = section.querySelector('.expandable-header');
    header.addEventListener('click', () => {
      section.classList.toggle('active');
    });
  });
  
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
}

// Handle favorite toggle
function initFavoriteButtons() {
  const favoriteButtons = document.querySelectorAll('.favorite-btn, .action-btn.favorite');
  
  favoriteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      button.classList.toggle('active');
      
      const projectId = button.getAttribute('data-project-id');
      // In a real application, this would send an AJAX request to the server
      console.log(`Project ${projectId} ${button.classList.contains('active') ? 'added to' : 'removed from'} favorites`);
    });
  });
}

// Initialize tabs
function initTabs() {
  const tabContainers = document.querySelectorAll('.tab-container');
  
  tabContainers.forEach(container => {
    const tabButtons = container.querySelectorAll('.tab-btn');
    const tabContents = container.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const target = button.getAttribute('data-tab');
        
        // Update active button
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Update active content
        tabContents.forEach(content => {
          if (content.getAttribute('data-tab') === target) {
            content.classList.add('active');
          } else {
            content.classList.remove('active');
          }
        });
      });
    });
  });
}

// Run initializations when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initTooltips();
  initExpandableSections();
  initFavoriteButtons();
  initTabs();
  
  // Initialize forms validation
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!validateForm(form)) {
        e.preventDefault();
      }
    });
  });
});
