document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', toggleTheme);

    // Form Navigation
    const formSteps = document.querySelectorAll('.form-step');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    let currentStep = 1;

    // Initialize form
    initForm();

    // Event Listeners
    prevBtn.addEventListener('click', goToPreviousStep);
    nextBtn.addEventListener('click', goToNextStep);

    // Form Submission
    const signupForm = document.getElementById('signup-form');
    signupForm?.addEventListener('submit', handleFormSubmit);

    // Children radio buttons
    const hasChildrenRadios = document.querySelectorAll('input[name="has_children"]');
    hasChildrenRadios.forEach(radio => {
        radio.addEventListener('change', toggleChildrenFields);
    });

    // Add Child Modal
    const addChildBtn = document.getElementById('add-child-btn');
    const childModal = document.getElementById('child-modal');
    const closeModal = document.querySelector('.close-modal');
    const saveChildBtn = document.getElementById('save-child');

    addChildBtn?.addEventListener('click', () => childModal.style.display = 'flex');
    closeModal?.addEventListener('click', () => childModal.style.display = 'none');
    saveChildBtn?.addEventListener('click', addChild);

    // Password Strength Check
    const passwordInput = document.getElementById('password');
    passwordInput?.addEventListener('input', checkPasswordStrength);

    // Password Match Check
    const confirmPasswordInput = document.getElementById('confirm-password');
    confirmPasswordInput?.addEventListener('input', checkPasswordMatch);

    // Password Toggle
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', togglePasswordVisibility);
    });

    // Populate Kenyan counties
    populateCounties();

    // Functions
    function handleFormSubmit(e) {
        e.preventDefault();

        // Validate all steps before submission
        let allStepsValid = true;
        for (let i = 1; i <= formSteps.length; i++) {
            if (!validateStep(i)) {
                allStepsValid = false;
                // Show the step with errors
                currentStep = i;
                showStep(currentStep);
                updateProgressSteps();
                break;
            }
        }

        if (allStepsValid) {
            // Form is valid - redirect to index.html
            window.location.href = 'index.html';

            // In a real application, you would typically:
            // 1. Collect all form data
            // 2. Send to server via AJAX
            // 3. Handle response
            // 4. Redirect on success
        }
    }

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

    function initForm() {
        showStep(currentStep);
        updateProgressSteps();
    }

    function showStep(step) {
        formSteps.forEach(formStep => {
            formStep.classList.remove('active');
            if (parseInt(formStep.dataset.step) === step) {
                formStep.classList.add('active');
            }
        });

        // Update button visibility
        if (step === 1) {
            prevBtn.disabled = true;
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        } else if (step === formSteps.length) {
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            prevBtn.disabled = false;
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    function goToPreviousStep() {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
            updateProgressSteps();
        }
    }

    function goToNextStep() {
        // Validate current step before proceeding
        if (validateStep(currentStep)) {
            if (currentStep < formSteps.length) {
                currentStep++;
                showStep(currentStep);
                updateProgressSteps();
            }
        }
    }

    function validateStep(step) {
        // Simple validation - check required fields are filled
        const currentFormStep = document.querySelector(`.form-step[data-step="${step}"]`);
        const requiredInputs = currentFormStep.querySelectorAll('[required]');

        let isValid = true;

        requiredInputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = 'red';
                isValid = false;
            } else {
                input.style.borderColor = '';
            }
        });

        // Additional validation for step 4 (password match)
        if (step === 4) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                document.getElementById('password-match').textContent = 'Passwords do not match';
                document.getElementById('password-match').style.color = 'red';
                isValid = false;
            } else {
                document.getElementById('password-match').textContent = 'Passwords match';
                document.getElementById('password-match').style.color = 'green';
            }
        }

        return isValid;
    }

    function updateProgressSteps() {
        const progressSteps = document.querySelectorAll('.progress-step');

        progressSteps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) <= currentStep) {
                step.classList.add('active');
            }
        });
    }

    function toggleChildrenFields() {
        const childrenContainer = document.getElementById('children-container');
        const hasChildren = document.querySelector('input[name="has_children"]:checked').value === 'yes';

        if (hasChildren) {
            childrenContainer.classList.remove('hidden');
        } else {
            childrenContainer.classList.add('hidden');
        }
    }

    function addChild() {
        const childName = document.getElementById('child-name').value;
        const childAge = document.getElementById('child-age').value;

        if (childName && childAge) {
            const childrenList = document.getElementById('children-list');
            const childId = Date.now(); // Simple unique ID

            const childItem = document.createElement('div');
            childItem.className = 'child-item';
            childItem.dataset.id = childId;
            childItem.innerHTML = `
                <span>${childName}, ${childAge} years</span>
                <span class="remove-child" data-id="${childId}"><i class="fas fa-times"></i></span>
            `;

            childrenList.appendChild(childItem);

            // Clear inputs and close modal
            document.getElementById('child-name').value = '';
            document.getElementById('child-age').value = '';
            childModal.style.display = 'none';

            // Add event listener to remove button
            childItem.querySelector('.remove-child').addEventListener('click', removeChild);
        }
    }

    function removeChild(e) {
        const childId = e.target.closest('.remove-child').dataset.id;
        document.querySelector(`.child-item[data-id="${childId}"]`).remove();
    }

    function checkPasswordStrength() {
        const password = this.value;
        const strengthBar = document.getElementById('strength-bar');
        const strengthText = document.getElementById('strength-text');

        // Reset
        strengthBar.style.width = '0%';
        strengthBar.style.backgroundColor = 'red';
        strengthText.textContent = 'Weak';

        if (password.length === 0) return;

        // Calculate strength
        let strength = 0;

        // Length
        if (password.length > 6) strength += 40;
        if (password.length > 8) strength += 50;

        // Complexity
        if (/[A-Z]/.test(password)) strength += 30;
        if (/[0-9]/.test(password)) strength += 30;
        if (/[^A-Za-z0-9]/.test(password)) strength += 40;

        // Update UI
        strengthBar.style.width = `${strength}%`;

        if (strength < 50) {
            strengthBar.style.backgroundColor = 'red';
            strengthText.textContent = 'Weak';
        } else if (strength < 75) {
            strengthBar.style.backgroundColor = 'orange';
            strengthText.textContent = 'Moderate';
        } else {
            strengthBar.style.backgroundColor = 'green';
            strengthText.textContent = 'Strong';
        }
    }

    function checkPasswordMatch() {
        const password = document.getElementById('password').value;
        const confirmPassword = this.value;
        const matchIndicator = document.getElementById('password-match');

        if (confirmPassword.length === 0) {
            matchIndicator.textContent = '';
            return;
        }

        if (password === confirmPassword) {
            matchIndicator.textContent = 'Passwords match';
            matchIndicator.style.color = 'green';
        } else {
            matchIndicator.textContent = 'Passwords do not match';
            matchIndicator.style.color = 'red';
        }
    }

    function populateCounties() {
        const countySelect = document.getElementById('county');
        if (!countySelect) return;

        // Kenyan counties
        const counties = [
            'Mombasa', 'Kwale', 'Kilifi', 'Tana River', 'Lamu', 'Taita Taveta',
            'Garissa', 'Wajir', 'Mandera', 'Marsabit', 'Isiolo', 'Meru',
            'Tharaka Nithi', 'Embu', 'Kitui', 'Machakos', 'Makueni', 'Nyandarua',
            'Nyeri', 'Kirinyaga', 'Murang\'a', 'Kiambu', 'Turkana', 'West Pokot',
            'Samburu', 'Trans Nzoia', 'Uasin Gishu', 'Elgeyo Marakwet', 'Nandi',
            'Baringo', 'Laikipia', 'Nakuru', 'Narok', 'Kajiado', 'Kericho',
            'Bomet', 'Kakamega', 'Vihiga', 'Bungoma', 'Busia', 'Siaya',
            'Kisumu', 'Homa Bay', 'Migori', 'Kisii', 'Nyamira', 'Nairobi'
        ];

        counties.forEach(county => {
            const option = document.createElement('option');
            option.value = county;
            option.textContent = county;
            countySelect.appendChild(option);
        });
    }
});