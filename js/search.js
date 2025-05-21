/**
 * Proj-e-Deal - Search Page JavaScript
 * Handles search filters and view options
 */

// DOM Elements
let projects = [];
let filteredProjects = [];
const searchForm = document.querySelector('#search-form');
const resultsContainer = document.querySelector('#search-results');
const resultsCount = document.querySelector('.results-count');
const gridViewBtn = document.querySelector('.view-grid');
const listViewBtn = document.querySelector('.view-list');
const sortSelect = document.querySelector('.sort-select');
const projectsGrid = document.querySelector('.projects-grid');
const priceMinInput = document.querySelector('#price-min');
const priceMaxInput = document.querySelector('#price-max');
const categoryFilters = document.querySelectorAll('.category-filter');
const resetFiltersBtn = document.querySelector('#reset-filters');
const applyFiltersBtn = document.querySelector('#apply-filters');

// Initialize filter functionality
function initFilters() {
  // Load initial projects
  fetchProjects();
  
  // Handle view toggle
  if (gridViewBtn && listViewBtn) {
    gridViewBtn.addEventListener('click', () => {
      setViewMode('grid');
    });
    
    listViewBtn.addEventListener('click', () => {
      setViewMode('list');
    });
  }
  
  // Handle sorting
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      sortProjects(sortSelect.value);
    });
  }
  
  // Handle filter form submission
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', (e) => {
      e.preventDefault();
      applyFilters();
    });
  }
  
  // Handle filter reset
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetFilters();
    });
  }
  
  // Handle search input
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchInput = searchForm.querySelector('input');
      applyFilters();
    });
  }
}

// Fetch projects (in real app, this would be an API call)
function fetchProjects() {
  // Simulated projects data
  projects = [
    {
      id: 1,
      title: "Boutique e-commerce de mode",
      price: 12500,
      category: "e-commerce",
      image: "assets/images/project-1.jpg",
      date: new Date("2023-10-15"),
      status: "verified",
      views: 342,
      favorites: 28
    },
    {
      id: 2,
      title: "Application mobile livraison locale",
      price: 8900,
      category: "mobile",
      image: "assets/images/project-2.jpg",
      date: new Date("2023-11-05"),
      status: "new",
      views: 187,
      favorites: 12
    },
    {
      id: 3,
      title: "Blog WordPress optimisé SEO",
      price: 2500,
      category: "content",
      image: "assets/images/project-3.jpg",
      date: new Date("2023-09-22"),
      status: "popular",
      views: 560,
      favorites: 45
    },
    {
      id: 4,
      title: "Site vitrine pour restaurant",
      price: 4800,
      category: "web",
      image: "assets/images/project-4.jpg",
      date: new Date("2023-12-01"),
      status: "verified",
      views: 218,
      favorites: 19
    },
    {
      id: 5,
      title: "Plateforme éducative LMS",
      price: 18000,
      category: "saas",
      image: "assets/images/project-5.jpg",
      date: new Date("2023-08-17"),
      status: "popular",
      views: 689,
      favorites: 63
    },
    {
      id: 6,
      title: "Application de gestion de stocks",
      price: 7500,
      category: "business",
      image: "assets/images/project-6.jpg",
      date: new Date("2023-10-20"),
      status: "verified",
      views: 276,
      favorites: 31
    }
  ];
  
  // Initialize with all projects
  filteredProjects = [...projects];
  displayProjects();
}

// Apply filters to projects
function applyFilters() {
  const searchQuery = document.querySelector('#search-input')?.value?.toLowerCase() || '';
  const minPrice = priceMinInput?.value ? Number(priceMinInput.value) : 0;
  const maxPrice = priceMaxInput?.value ? Number(priceMaxInput.value) : Infinity;
  const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(el => el.value);
  
  filteredProjects = projects.filter(project => {
    // Filter by search query
    const matchesQuery = searchQuery ? 
      project.title.toLowerCase().includes(searchQuery) : true;
    
    // Filter by price range
    const matchesPrice = project.price >= minPrice && 
      (maxPrice === Infinity || project.price <= maxPrice);
    
    // Filter by categories
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(project.category);
    
    return matchesQuery && matchesPrice && matchesCategory;
  });
  
  // Apply current sort
  const currentSort = sortSelect?.value || 'newest';
  sortProjects(currentSort, false);
  
  // Display results
  displayProjects();
}

// Reset all filters
function resetFilters() {
  if (searchForm) {
    searchForm.reset();
  }
  
  if (priceMinInput) priceMinInput.value = '';
  if (priceMaxInput) priceMaxInput.value = '';
  
  categoryFilters.forEach(filter => {
    filter.checked = false;
  });
  
  filteredProjects = [...projects];
  displayProjects();
}

// Sort projects
function sortProjects(sortBy, display = true) {
  switch (sortBy) {
    case 'newest':
      filteredProjects.sort((a, b) => b.date - a.date);
      break;
    case 'oldest':
      filteredProjects.sort((a, b) => a.date - b.date);
      break;
    case 'price-high':
      filteredProjects.sort((a, b) => b.price - a.price);
      break;
    case 'price-low':
      filteredProjects.sort((a, b) => a.price - b.price);
      break;
    case 'popular':
      filteredProjects.sort((a, b) => b.views - a.views);
      break;
  }
  
  if (display) {
    displayProjects();
  }
}

// Set view mode (grid or list)
function setViewMode(mode) {
  if (projectsGrid) {
    if (mode === 'grid') {
      projectsGrid.classList.remove('projects-list');
      projectsGrid.classList.add('projects-grid');
      gridViewBtn?.classList.add('active');
      listViewBtn?.classList.remove('active');
      localStorage.setItem('viewMode', 'grid');
    } else {
      projectsGrid.classList.add('projects-list');
      projectsGrid.classList.remove('projects-grid');
      gridViewBtn?.classList.remove('active');
      listViewBtn?.classList.add('active');
      localStorage.setItem('viewMode', 'list');
    }
  }
}

// Display filtered projects
function displayProjects() {
  if (!projectsGrid) return;
  
  // Update results count
  if (resultsCount) {
    resultsCount.textContent = `${filteredProjects.length} projet${filteredProjects.length > 1 ? 's' : ''} trouvé${filteredProjects.length > 1 ? 's' : ''}`;
  }
  
  // Clear current projects
  projectsGrid.innerHTML = '';
  
  // No results message
  if (filteredProjects.length === 0) {
    const noResults = document.createElement('div');
    noResults.className = 'no-results';
    noResults.innerHTML = `
      <div class="no-results-icon">🔍</div>
      <h3>Aucun projet ne correspond à vos critères</h3>
      <p>Essayez de modifier vos filtres ou de réinitialiser votre recherche.</p>
      <button class="btn btn-primary" id="clear-search">Réinitialiser la recherche</button>
    `;
    projectsGrid.appendChild(noResults);
    
    document.querySelector('#clear-search')?.addEventListener('click', resetFilters);
    return;
  }
  
  // Create project cards
  filteredProjects.forEach(project => {
    const projectCard = document.createElement('div');
    projectCard.className = 'card';
    projectCard.innerHTML = `
      <div class="card-img">
        <img src="${project.image}" alt="${project.title}">
        ${project.status ? `<div class="card-badge badge-${project.status}">${getBadgeText(project.status)}</div>` : ''}
      </div>
      <div class="card-content">
        <h3 class="card-title">${project.title}</h3>
        <div class="card-price">${formatPrice(project.price)}</div>
        <div class="card-meta">
          <span class="card-category">${project.category}</span>
          <span class="card-date">${formatDate(project.date)}</span>
        </div>
        <div class="card-actions">
          <button class="btn btn-primary btn-sm">Voir le projet</button>
          <button class="btn btn-tertiary favorite-btn" data-project-id="${project.id}">
            <i class="fas fa-heart"></i>
          </button>
        </div>
      </div>
    `;
    
    projectsGrid.appendChild(projectCard);
  });
  
  // Initialize favorite buttons on new cards
  document.querySelectorAll('.favorite-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('active');
    });
  });
}

// Helper functions
function getBadgeText(status) {
  switch (status) {
    case 'new': return 'Nouveau';
    case 'popular': return 'Populaire';
    case 'verified': return 'Vérifié';
    default: return status;
  }
}

function formatPrice(price) {
  return price.toLocaleString('fr-FR', { style: 'currency', currency: 'MAD' });
}

function formatDate(date) {
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Initialize search page on load
document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  
  // Set initial view mode from saved preference or default to grid
  const savedViewMode = localStorage.getItem('viewMode') || 'grid';
  setViewMode(savedViewMode);
});
