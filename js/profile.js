document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const profileNavBtns = document.querySelectorAll('.profile-nav-btn');
    const profileSections = document.querySelectorAll('.profile-section');
    const accountForm = document.getElementById('account-form');
    const passwordForm = document.getElementById('password-form');
    const childrenList = document.getElementById('children-list');
    const addChildBtn = document.getElementById('add-child-btn');
    const childModal = document.getElementById('child-modal');
    const closeChildModal = document.getElementById('close-child-modal');
    const saveChildBtn = document.getElementById('save-child-btn');
    const cancelChildBtn = document.getElementById('cancel-child-btn');
    const childNameInput = document.getElementById('child-name');
    const childAgeInput = document.getElementById('child-age');
    const confirmModal = document.getElementById('confirm-modal');
    const closeConfirmModal = document.getElementById('close-confirm-modal');
    const confirmActionBtn = document.getElementById('confirm-action-btn');
    const cancelActionBtn = document.getElementById('cancel-action-btn');
    const leaveGroupBtn = document.getElementById('leave-group-btn');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const changeAvatarBtn = document.getElementById('change-avatar');
    const profilePicture = document.getElementById('profile-picture');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const passwordMatch = document.getElementById('password-match');

    // Sample children data
    let children = [
        { id: 1, name: 'Sarah Meian', age: 8 },
        { id: 2, name: 'David Meian', age: 5 }
    ];

    // Current action type for confirmation modal
    let currentAction = null;

    // Initialize the page
    renderChildrenList();

    // Navigation between sections
    profileNavBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const sectionId = this.dataset.section;

            // Update active nav button
            profileNavBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Show corresponding section
            profileSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${sectionId}-section`) {
                    section.classList.add('active');
                }
            });
        });
    });

    // Account form submission
    accountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Account information updated successfully!');
    });

    // Password form submission
    passwordForm.addEventListener('submit', function(e) {
        e.preventDefault();

        if (newPasswordInput.value !== confirmNewPasswordInput.value) {
            passwordMatch.textContent = 'Passwords do not match';
            return;
        }

        if (newPasswordInput.value.length < 8) {
            passwordMatch.textContent = 'Password must be at least 8 characters';
            return;
        }

        passwordMatch.textContent = '';
        alert('Password updated successfully!');
        passwordForm.reset();
        strengthBar.style.width = '0%';
        strengthText.textContent = 'Weak';
    });

    // Password strength indicator
    newPasswordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);

        strengthBar.style.width = `${strength.percentage}%`;
        strengthBar.style.backgroundColor = strength.color;
        strengthText.textContent = strength.text;
        strengthText.style.color = strength.color;
    });

    // Password match indicator
    confirmNewPasswordInput.addEventListener('input', function() {
        if (newPasswordInput.value !== this.value) {
            passwordMatch.textContent = 'Passwords do not match';
            passwordMatch.style.color = '#ff0000';
        } else {
            passwordMatch.textContent = 'Passwords match';
            passwordMatch.style.color = '#3bb54a';
        }
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const target = this.dataset.target;
            const input = document.getElementById(target);

            if (input.type === 'password') {
                input.type = 'text';
                this.classList.replace('fa-eye-slash', 'fa-eye');
            } else {
                input.type = 'password';
                this.classList.replace('fa-eye', 'fa-eye-slash');
            }
        });
    });

    // Add child button
    addChildBtn.addEventListener('click', function() {
        childNameInput.value = '';
        childAgeInput.value = '';
        document.getElementById('child-modal-title').textContent = 'Add Child';
        saveChildBtn.dataset.mode = 'add';
        childModal.classList.add('show');
    });

    // Close child modal
    closeChildModal.addEventListener('click', function() {
        childModal.classList.remove('show');
    });

    cancelChildBtn.addEventListener('click', function() {
        childModal.classList.remove('show');
    });

    // Save child
    saveChildBtn.addEventListener('click', function() {
        const name = childNameInput.value.trim();
        const age = parseInt(childAgeInput.value);

        if (!name || isNaN(age)) {
            alert('Please enter valid name and age');
            return;
        }

        if (this.dataset.mode === 'add') {
            // Add new child
            const newId = children.length > 0 ? Math.max(...children.map(c => c.id)) + 1 : 1;
            children.push({ id: newId, name, age });
        } else {
            // Update existing child
            const childId = parseInt(this.dataset.childId);
            const childIndex = children.findIndex(c => c.id === childId);
            if (childIndex !== -1) {
                children[childIndex] = { id: childId, name, age };
            }
        }

        renderChildrenList();
        childModal.classList.remove('show');
    });

    // Edit child (event delegation)
    childrenList.addEventListener('click', function(e) {
        if (e.target.closest('.btn-edit-child')) {
            const btn = e.target.closest('.btn-edit-child');
            const childId = parseInt(btn.dataset.id);
            const child = children.find(c => c.id === childId);

            if (child) {
                childNameInput.value = child.name;
                childAgeInput.value = child.age;
                document.getElementById('child-modal-title').textContent = 'Edit Child';
                saveChildBtn.dataset.mode = 'edit';
                saveChildBtn.dataset.childId = childId;
                childModal.classList.add('show');
            }
        }

        if (e.target.closest('.btn-delete-child')) {
            const btn = e.target.closest('.btn-delete-child');
            const childId = parseInt(btn.dataset.id);

            currentAction = {
                type: 'deleteChild',
                data: { childId }
            };

            document.getElementById('confirm-modal-title').textContent = 'Delete Child';
            document.getElementById('confirm-modal-message').textContent = 'Are you sure you want to delete this child? This action cannot be undone.';
            confirmModal.classList.add('show');
        }
    });

    // Leave group button
    leaveGroupBtn.addEventListener('click', function() {
        currentAction = {
            type: 'leaveGroup'
        };

        document.getElementById('confirm-modal-title').textContent = 'Leave Group';
        document.getElementById('confirm-modal-message').textContent = 'Are you sure you want to leave the group? You will be removed from all teams and activities.';
        confirmModal.classList.add('show');
    });

    // Delete account button
    deleteAccountBtn.addEventListener('click', function() {
        currentAction = {
            type: 'deleteAccount'
        };

        document.getElementById('confirm-modal-title').textContent = 'Delete Account';
        document.getElementById('confirm-modal-message').textContent = 'Are you sure you want to delete your account? This will permanently remove all your data and cannot be undone.';
        confirmModal.classList.add('show');
    });

    // Close confirm modal
    closeConfirmModal.addEventListener('click', function() {
        confirmModal.classList.remove('show');
    });

    cancelActionBtn.addEventListener('click', function() {
        confirmModal.classList.remove('show');
    });

    // Confirm action
    confirmActionBtn.addEventListener('click', function() {
        if (!currentAction) return;

        switch (currentAction.type) {
            case 'deleteChild':
                const childId = currentAction.data.childId;
                children = children.filter(c => c.id !== childId);
                renderChildrenList();
                break;

            case 'leaveGroup':
                alert('You have left the group. You can rejoin anytime.');
                break;

            case 'deleteAccount':
                alert('Your account has been deleted. Redirecting to home page...');
                window.location.href = '../templates/index.html';
                break;
        }

        confirmModal.classList.remove('show');
        currentAction = null;
    });

    // Change avatar
    changeAvatarBtn.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = e => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = event => {
                    profilePicture.src = event.target.result;
                    // Here you would typically upload the image to a server
                };
                reader.readAsDataURL(file);
            }
        };

        input.click();
    });

    // Helper function to render children list
    function renderChildrenList() {
        childrenList.innerHTML = '';

        if (children.length === 0) {
            childrenList.innerHTML = '<p class="no-children">No children added yet</p>';
            return;
        }

        children.forEach(child => {
            const childItem = document.createElement('div');
            childItem.className = 'child-item';
            childItem.innerHTML = `
                <div class="child-info">
                    <span class="child-name">${child.name}</span>
                    <span class="child-age">${child.age} years old</span>
                </div>
                <div class="child-actions">
                    <button class="btn-edit-child" data-id="${child.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete-child" data-id="${child.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            childrenList.appendChild(childItem);
        });
    }

    // Helper function to calculate password strength
    function calculatePasswordStrength(password) {
        let strength = 0;

        // Length check
        if (password.length > 0) strength += 10;
        if (password.length >= 8) strength += 20;
        if (password.length >= 12) strength += 20;

        // Character diversity
        if (/[A-Z]/.test(password)) strength += 20;
        if (/[a-z]/.test(password)) strength += 20;
        if (/[0-9]/.test(password)) strength += 20;
        if (/[^A-Za-z0-9]/.test(password)) strength += 20;

        // Special cases
        if (password.length >= 16) strength += 10;

        // Cap at 100
        strength = Math.min(strength, 100);

        // Determine color and text
        let color, text;
        if (strength < 40) {
            color = '#ff0000';
            text = 'Weak';
        } else if (strength < 70) {
            color = '#f89c1c';
            text = 'Moderate';
        } else if (strength < 90) {
            color = '#3bb54a';
            text = 'Strong';
        } else {
            color = '#006600';
            text = 'Very Strong';
        }

        return {
            percentage: strength,
            color,
            text
        };
    }
});