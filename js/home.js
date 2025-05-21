/**
 * Proj-e-Deal - Home Page JavaScript
 * Handles carousel functionality and animations for the homepage
 */

// Project Carousel
class Carousel {
  constructor(element) {
    this.carousel = element;
    this.track = element.querySelector('.carousel-track');
    this.items = Array.from(element.querySelectorAll('.carousel-item'));
    this.prevBtn = element.querySelector('.carousel-prev');
    this.nextBtn = element.querySelector('.carousel-next');
    this.indicators = Array.from(element.querySelectorAll('.carousel-dot'));
    
    this.itemWidth = this.items[0].getBoundingClientRect().width;
    this.currentIndex = 0;
    this.totalItems = this.items.length;
    this.itemsPerView = window.innerWidth >= 768 ? 3 : 1;
    
    this.maxIndex = Math.max(0, this.totalItems - this.itemsPerView);
    
    this.initCarousel();
  }
  
  initCarousel() {
    // Initialize listeners
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.navigate(-1));
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.navigate(1));
    }
    
    this.indicators.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    // Handle touch events for mobile
    let startX, moveX;
    
    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    this.track.addEventListener('touchmove', (e) => {
      moveX = e.touches[0].clientX;
    });
    
    this.track.addEventListener('touchend', () => {
      if (startX - moveX > 50) {
        this.navigate(1); // Swipe left
      } else if (moveX - startX > 50) {
        this.navigate(-1); // Swipe right
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      this.itemWidth = this.items[0].getBoundingClientRect().width;
      this.itemsPerView = window.innerWidth >= 768 ? 3 : 1;
      this.maxIndex = Math.max(0, this.totalItems - this.itemsPerView);
      
      if (this.currentIndex > this.maxIndex) {
        this.currentIndex = this.maxIndex;
      }
      
      this.updateCarousel();
    });
    
    // Initial state
    this.updateCarousel();
    
    // Auto slide every 5 seconds
    setInterval(() => {
      if (document.hasFocus()) {
        this.navigate(1);
      }
    }, 5000);
  }
  
  navigate(direction) {
    this.currentIndex += direction;
    
    // Ensure index stays within bounds
    if (this.currentIndex < 0) {
      this.currentIndex = 0;
    } else if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }
    
    this.updateCarousel();
  }
  
  goToSlide(index) {
    if (index > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    } else {
      this.currentIndex = index;
    }
    
    this.updateCarousel();
  }
  
  updateCarousel() {
    // Update track position
    this.track.style.transform = `translateX(-${this.currentIndex * this.itemWidth}px)`;
    
    // Update indicators
    this.indicators.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentIndex);
    });
    
    // Update button states
    if (this.prevBtn) {
      this.prevBtn.classList.toggle('disabled', this.currentIndex === 0);
    }
    
    if (this.nextBtn) {
      this.nextBtn.classList.toggle('disabled', this.currentIndex === this.maxIndex);
    }
  }
}

// Animation for statistics counters
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const speed = 200; // The lower the faster
  
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText.replace(/,/g, '');
    const increment = target / speed;
    
    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(() => animateCounters(), 1);
    } else {
      counter.innerText = target.toLocaleString();
    }
  });
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// Initialize home page
document.addEventListener('DOMContentLoaded', () => {
  // Initialize carousel
  const carousels = document.querySelectorAll('.project-carousel');
  carousels.forEach(carouselElement => {
    new Carousel(carouselElement);
  });
  
  // Animate statistics when scrolled into view
  const statsSection = document.querySelector('.statistics');
  let animatedStats = false;
  
  function checkScroll() {
    if (statsSection && isInViewport(statsSection) && !animatedStats) {
      animateCounters();
      animatedStats = true;
    }
  }
  
  // Check on scroll and initial load
  window.addEventListener('scroll', checkScroll);
  checkScroll();
  
  // Handle category card interactions
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const icon = card.querySelector('.category-icon');
      icon.style.transform = 'scale(1.2)';
      icon.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', () => {
      const icon = card.querySelector('.category-icon');
      icon.style.transform = 'scale(1)';
    });
  });
});
