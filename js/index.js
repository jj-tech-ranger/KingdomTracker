
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;


const themes = ['light', 'dark', 'black'];
let currentThemeIndex = 0;


function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentThemeIndex = themes.indexOf(savedTheme);
        if (currentThemeIndex === -1) currentThemeIndex = 0;
    }
    applyTheme(themes[currentThemeIndex]);
}

// Apply theme and update UI
function applyTheme(theme) {
    // Remove all theme classes
    body.classList.remove('light-mode', 'dark-mode', 'black-mode');
    
    // Add the selected theme class
    body.classList.add(`${theme}-mode`);
    
    // Update the icon
    switch(theme) {
        case 'light':
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            break;
        case 'dark':
            themeToggle.innerHTML = '<i class="fas fa-adjust"></i>';
            break;
        case 'black':
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            break;
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
}

// Cycle through themes
function cycleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(themes[currentThemeIndex]);
}

// Initialize on load
initializeTheme();

// Set up event listener
themeToggle.addEventListener('click', cycleTheme);

// Morph transition animation
const moduleCards = document.querySelectorAll('.module-card');
const morphOverlay = document.querySelector('.morph-overlay');

moduleCards.forEach((card, index) => {
    // Set animation delay for staggered appearance
    card.style.animationDelay = `${index * 0.2}s`;
    
    // Handle click for morph transition
    card.addEventListener('click', function(e) {
        e.preventDefault();
        const targetModule = this.getAttribute('data-module');
        const targetPage = this.querySelector('a').getAttribute('href');
        
        // Update overlay text based on module
        const moduleNames = {
            'hr': 'Human Resource',
            'finance': 'Finance',
            'procurement': 'Procurement',
            'inventory': 'Inventory',
            'crosspoint': 'CrossPoint'
        };
        
        morphOverlay.textContent = `Loading ${moduleNames[targetModule]}...`;
        morphOverlay.classList.add('active');

        // Navigate after delay
        setTimeout(() => {
            window.location.href = targetPage;
        }, 1000);
    });
    
    // Hover effects
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
        if (body.classList.contains('light-mode')) {
            this.style.boxShadow = '0 15px 30px rgba(98, 39, 37, 0.2)';
        } else {
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.6)';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        if (body.classList.contains('light-mode')) {
            this.style.boxShadow = 'var(--card-shadow)';
        } else {
            this.style.boxShadow = 'var(--dark-shadow)';
        }
    });
});