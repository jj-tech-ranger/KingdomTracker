document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);

    // Password Toggle
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', togglePasswordVisibility);
    });

    // Form Submission
    const loginForm = document.getElementById('login-form');
    loginForm?.addEventListener('submit', handleLogin);

    // Functions
    function toggleTheme() {
        const body = document.body;
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            body.classList.add('black-mode');
            themeToggle.innerHTML = '<i class="fas fa-adjust"></i>';
        } else {
            body.classList.remove('black-mode');
            body.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    function togglePasswordVisibility(e) {
        const icon = e.target;
        const targetId = icon.dataset.target;
        const passwordInput = document.getElementById(targetId);

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    }

    function handleLogin(e) {
        e.preventDefault();

        // Basic validation
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        // For demo purposes, redirect to index.html
        window.location.href = 'index.html';
    }
});