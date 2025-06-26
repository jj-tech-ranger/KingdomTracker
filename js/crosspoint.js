document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    let currentTheme = localStorage.getItem('theme') || 'light-mode';

    // Apply saved theme
    document.body.className = currentTheme;
    updateThemeIcon();

    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.remove('light-mode');
            document.body.classList.add('dark-mode');
            currentTheme = 'dark-mode';
        } else if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            document.body.classList.add('black-mode');
            currentTheme = 'black-mode';
        } else {
            document.body.classList.remove('black-mode');
            document.body.classList.add('light-mode');
            currentTheme = 'light-mode';
        }

        localStorage.setItem('theme', currentTheme);
        updateThemeIcon();
    });

    function updateThemeIcon() {
        if (document.body.classList.contains('light-mode')) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else if (document.body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '<i class="fas fa-adjust"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    // User dropdown functionality
    const userDropdown = document.querySelector('.user-dropdown');
    userDropdown.addEventListener('click', function(e) {
        // Prevent closing when clicking inside dropdown
        e.stopPropagation();
        const menu = this.querySelector('.dropdown-menu');
        menu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function() {
        const openMenu = document.querySelector('.dropdown-menu.show');
        if (openMenu) {
            openMenu.classList.remove('show');
        }
    });

    // Simulate loading progress bars
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = targetWidth;
        }, 100);
    });

    // Active nav item highlighting
    const navItems = document.querySelectorAll('.nav-menu li');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Logout functionality
    const logoutBtn = document.querySelector('.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Add your logout logic here
            alert('Logging out...');
            // window.location.href = 'login.html';
        });
    }
});