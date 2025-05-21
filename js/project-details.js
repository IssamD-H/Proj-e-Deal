/**
 * Proj-e-Deal - Project Details Page JavaScript
 * Handles gallery functionality and tab navigation
 */

// Gallery functionality
class ProjectGallery {
  constructor(element) {
    this.gallery = element;
    this.mainImg = element.querySelector('.gallery-main-img');
    this.thumbs = Array.from(element.querySelectorAll('.gallery-thumb'));
    this.position = element.querySelector('.gallery-position');
    this.prevBtn = element.querySelector('.gallery-prev');
    this.nextBtn = element.querySelector('.gallery-next');
    
    this.currentIndex = 0;
    this.totalImages = this.thumbs.length;
    
    this.initGallery();
  }
  
  initGallery() {
    // Initialize thumbnails
    this.thumbs.forEach((thumb, index) => {
      thumb.addEventListener('click', () => this.setImage(index));
    });
    
    // Initialize navigation buttons
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.navigate(-1));
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.navigate(1));
    }
    
    // Enable zoom on main image click
    if (this.mainImg) {
      this.mainImg.addEventListener('click', () => this.zoomImage());
    }
    
    // Handle swipe on mobile
    let startX, moveX;
    
    this.gallery.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    });
    
    this.gallery.addEventListener('touchmove', (e) => {
      moveX = e.touches[0].clientX;
    });
    
    this.gallery.addEventListener('touchend', () => {
      if (startX - moveX > 50) {
        this.navigate(1); // Swipe left
      } else if (moveX - startX > 50) {
        this.navigate(-1); // Swipe right
      }
    });
    
    // Set initial image
    this.updateGallery();
  }
  
  setImage(index) {
    if (index >= 0 && index < this.totalImages) {
      this.currentIndex = index;
      this.updateGallery();
    }
  }
  
  navigate(direction) {
    this.currentIndex += direction;
    
    // Ensure index stays within bounds with loop around
    if (this.currentIndex < 0) {
      this.currentIndex = this.totalImages - 1;
    } else if (this.currentIndex >= this.totalImages) {
      this.currentIndex = 0;
    }
    
    this.updateGallery();
  }
  
  updateGallery() {
    // Update main image
    const activeSrc = this.thumbs[this.currentIndex].querySelector('img').src;
    this.mainImg.src = activeSrc;
    
    // Update active thumbnail
    this.thumbs.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === this.currentIndex);
    });
    
    // Update position indicator
    if (this.position) {
      this.position.textContent = `${this.currentIndex + 1}/${this.totalImages}`;
    }
  }
  
  zoomImage() {
    // Create zoomed view overlay
    const overlay = document.createElement('div');
    overlay.className = 'gallery-zoom-overlay';
    
    const closeBtn = document.createElement('div');
    closeBtn.className = 'zoom-close-btn';
    closeBtn.innerHTML = '&times;';
    
    const zoomedImg = document.createElement('img');
    zoomedImg.src = this.mainImg.src;
    zoomedImg.className = 'zoomed-image';
    
    overlay.appendChild(closeBtn);
    overlay.appendChild(zoomedImg);
    document.body.appendChild(overlay);
    
    // Handle closing
    closeBtn.addEventListener('click', () => {
      overlay.remove();
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });
    
    // Add ESC key to close
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        overlay.remove();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    
    document.addEventListener('keydown', handleEsc);
  }
}

// Handle tab navigation
function initProjectTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons and content sections
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      const targetTab = button.getAttribute('data-tab');
      document.querySelector(`.tab-content[data-tab="${targetTab}"]`).classList.add('active');
    });
  });
}

// Initialize expandable sections
function initExpandableSections() {
  const expandables = document.querySelectorAll('.expandable-section');
  
  expandables.forEach(section => {
    const header = section.querySelector('.expandable-header');
    
    header.addEventListener('click', () => {
      section.classList.toggle('active');
    });
  });
}

// Handle FAQ accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      item.classList.toggle('active');
    });
  });
}

// Track engagement analytics
function trackEngagement() {
  // In a real application, this would send data to an analytics service
  let viewDuration = 0;
  const projectId = document.querySelector('.project-detail').getAttribute('data-project-id');
  
  // Track view duration
  const interval = setInterval(() => {
    viewDuration += 1;
    // Example: send ping every 30 seconds
    if (viewDuration % 30 === 0) {
      console.log(`Project ${projectId} viewed for ${viewDuration} seconds`);
    }
  }, 1000);
  
  // Track actions
  const actionButtons = document.querySelectorAll('.action-btn');
  actionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const action = button.classList.contains('favorite') ? 'favorite' : 
                     button.classList.contains('share') ? 'share' : 'contact';
      console.log(`Action: ${action} for project ${projectId}`);
    });
  });
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(interval);
    console.log(`Total view time: ${viewDuration} seconds`);
  });
}

// Initialize project details page
document.addEventListener('DOMContentLoaded', () => {
  // Initialize gallery
  const galleryElement = document.querySelector('.project-gallery');
  if (galleryElement) {
    new ProjectGallery(galleryElement);
  }
  
  // Initialize tabs
  initProjectTabs();
  
  // Initialize expandable sections
  initExpandableSections();
  
  // Initialize FAQ accordion
  initFaqAccordion();
  
  // Track engagement
  trackEngagement();
  
  // Update view count (simulation)
  const viewsCount = document.querySelector('.views-count span');
  if (viewsCount) {
    const currentViews = parseInt(viewsCount.textContent);
    setTimeout(() => {
      viewsCount.textContent = (currentViews + 1).toString();
    }, 10000);
  }
});
