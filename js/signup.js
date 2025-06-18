   // Toggle password visibility
        document.querySelectorAll('.toggle-password').forEach(icon => {
            icon.addEventListener('click', function() {
                const passwordInput = this.previousElementSibling;
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                this.classList.toggle('fa-eye-slash');
            });
        });

        // Password strength indicator
        const passwordInput = document.getElementById('password');
        const strengthBars = document.querySelectorAll('.strength-bar');
        const strengthText = document.querySelector('.strength-text');

        passwordInput.addEventListener('input', function() {
            const strength = calculatePasswordStrength(this.value);
            updateStrengthIndicator(strength);
        });

        function calculatePasswordStrength(password) {
            let strength = 0;

            // Length check
            if (password.length > 7) strength++;
            if (password.length > 11) strength++;

            // Character type checks
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;

            return Math.min(strength, 3);
        }

        function updateStrengthIndicator(strength) {
            strengthBars.forEach((bar, index) => {
                bar.style.backgroundColor = index < strength ?
                    (strength === 1 ? '#dc3545' : strength === 2 ? '#ffc107' : '#28a745') :
                    '#3a3a3a'; // Darker bar color for dark mode
            });

            strengthText.textContent =
                strength === 0 ? 'Weak' :
                strength === 1 ? 'Fair' :
                strength === 2 ? 'Good' : 'Strong';
        }

        // Theme toggle functionality - starts with dark mode active
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Sun icon for dark mode
        document.body.appendChild(themeToggle);

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            themeToggle.querySelector('i').classList.toggle('fa-sun');
            themeToggle.querySelector('i').classList.toggle('fa-moon');

            // Update password strength bars when switching modes
            if (passwordInput.value) {
                const strength = calculatePasswordStrength(passwordInput.value);
                updateStrengthIndicator(strength);
            }
        });

        strengthBars.forEach(bar => {
            bar.style.backgroundColor = '#3a3a3a';
        });