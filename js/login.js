 // Toggle password visibility
        document.querySelectorAll('.toggle-password').forEach(icon => {
            icon.addEventListener('click', function() {
                const passwordInput = this.previousElementSibling;
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
            });
        });

        // Theme toggle functionality
        const themeToggle = document.getElementById('theme-toggle');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

        // Check for saved theme preference or use system preference
        const currentTheme = localStorage.getItem('theme') ||
                            (prefersDarkScheme.matches ? 'dark' : 'light');

        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
            localStorage.setItem('theme', theme);
        });

        // Listen for system theme changes
        prefersDarkScheme.addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                document.body.classList.toggle('dark-mode', e.matches);
            }
        });