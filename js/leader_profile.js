document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const profileNavBtns = document.querySelectorAll('.profile-nav-btn');
    const profileSections = document.querySelectorAll('.profile-section');
    const accountForm = document.getElementById('account-form');
    const passwordForm = document.getElementById('password-form');
    const teamsList = document.getElementById('teams-list');
    const addTeamBtn = document.getElementById('add-team-btn');
    const teamModal = document.getElementById('team-modal');
    const closeTeamModal = document.getElementById('close-team-modal');
    const saveTeamBtn = document.getElementById('save-team-btn');
    const cancelTeamBtn = document.getElementById('cancel-team-btn');
    const teamNameInput = document.getElementById('team-name');
    const teamDescInput = document.getElementById('team-description');
    const memberModal = document.getElementById('member-modal');
    const closeMemberModal = document.getElementById('close-member-modal');
    const saveMemberBtn = document.getElementById('save-member-btn');
    const cancelMemberBtn = document.getElementById('cancel-member-btn');
    const confirmModal = document.getElementById('confirm-modal');
    const closeConfirmModal = document.getElementById('close-confirm-modal');
    const confirmActionBtn = document.getElementById('confirm-action-btn');
    const cancelActionBtn = document.getElementById('cancel-action-btn');
    const stepDownBtn = document.getElementById('step-down-btn');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const changeAvatarBtn = document.getElementById('change-avatar');
    const profilePicture = document.getElementById('profile-picture');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const passwordMatch = document.getElementById('password-match');
    const addMemberBtn = document.getElementById('add-member-btn');
    const removeMemberBtn = document.getElementById('remove-member-btn');
    const manageRolesBtn = document.getElementById('manage-roles-btn');
    const savePermissionsBtn = document.getElementById('save-permissions-btn');
    const saveCommunicationBtn = document.getElementById('save-communication-btn');

    // Sample teams data
    let teams = [
        { id: 1, name: 'Westlands Prayer Group', members: 12, assignments: 5 },
        { id: 2, name: 'Youth Ministry Leaders', members: 8, assignments: 3 },
        { id: 3, name: 'Sunday School Teachers', members: 25, assignments: 7 }
    ];

    // Current action type for confirmation modal
    let currentAction = null;

    // Initialize the page
    renderTeamsList();

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

    // Add team button
    addTeamBtn.addEventListener('click', function() {
        teamNameInput.value = '';
        teamDescInput.value = '';
        document.getElementById('team-modal-title').textContent = 'Add New Team';
        saveTeamBtn.dataset.mode = 'add';
        teamModal.classList.add('show');
    });

    // Close team modal
    closeTeamModal.addEventListener('click', function() {
        teamModal.classList.remove('show');
    });

    cancelTeamBtn.addEventListener('click', function() {
        teamModal.classList.remove('show');
    });

    // Save team
    saveTeamBtn.addEventListener('click', function() {
        const name = teamNameInput.value.trim();
        const description = teamDescInput.value.trim();

        if (!name) {
            alert('Please enter a team name');
            return;
        }

        if (this.dataset.mode === 'add') {
            // Add new team
            const newId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;
            teams.push({ id: newId, name, description, members: 0, assignments: 0 });
        } else {
            // Update existing team
            const teamId = parseInt(this.dataset.teamId);
            const teamIndex = teams.findIndex(t => t.id === teamId);
            if (teamIndex !== -1) {
                teams[teamIndex] = { ...teams[teamIndex], name, description };
            }
        }

        renderTeamsList();
        teamModal.classList.remove('show');
    });

    // Edit team (event delegation)
    teamsList.addEventListener('click', function(e) {
        if (e.target.closest('.btn-edit-team')) {
            const btn = e.target.closest('.btn-edit-team');
            const teamId = parseInt(btn.dataset.id);
            const team = teams.find(t => t.id === teamId);

            if (team) {
                teamNameInput.value = team.name;
                teamDescInput.value = team.description || '';
                document.getElementById('team-modal-title').textContent = 'Edit Team';
                saveTeamBtn.dataset.mode = 'edit';
                saveTeamBtn.dataset.teamId = teamId;
                teamModal.classList.add('show');
            }
        }

        if (e.target.closest('.btn-view-team')) {
            const btn = e.target.closest('.btn-view-team');
            const teamId = parseInt(btn.dataset.id);
            // In a real app, this would redirect to the team dashboard
            alert(`Redirecting to team ${teamId} dashboard...`);
        }
    });

    // Add member button
    addMemberBtn.addEventListener('click', function() {
        document.getElementById('member-modal-title').textContent = 'Add Member to Team';
        memberModal.classList.add('show');
    });

    // Close member modal
    closeMemberModal.addEventListener('click', function() {
        memberModal.classList.remove('show');
    });

    cancelMemberBtn.addEventListener('click', function() {
        memberModal.classList.remove('show');
    });

    // Save member
    saveMemberBtn.addEventListener('click', function() {
        // In a real app, this would add the selected member to the team
        alert('Member added to team successfully!');
        memberModal.classList.remove('show');
    });

    // Remove member button
    removeMemberBtn.addEventListener('click', function() {
        currentAction = {
            type: 'removeMember',
            data: { teamId: document.getElementById('team-select').value }
        };

        document.getElementById('confirm-modal-title').textContent = 'Remove Member';
        document.getElementById('confirm-modal-message').textContent = 'Are you sure you want to remove this member from the team?';
        confirmModal.classList.add('show');
    });

    // Manage roles button
    manageRolesBtn.addEventListener('click', function() {
        // In a real app, this would open a role management interface
        alert('Opening role management for selected team...');
    });

    // Save permissions button
    savePermissionsBtn.addEventListener('click', function() {
        alert('Permissions updated successfully!');
    });

    // Save communication preferences button
    saveCommunicationBtn.addEventListener('click', function() {
        alert('Communication preferences saved successfully!');
    });

    // Step down as leader button
    stepDownBtn.addEventListener('click', function() {
        currentAction = {
            type: 'stepDown'
        };

        document.getElementById('confirm-modal-title').textContent = 'Step Down as Leader';
        document.getElementById('confirm-modal-message').textContent = 'Are you sure you want to step down as leader? You will lose all leader permissions and will need admin approval to regain them.';
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
            case 'removeMember':
                alert('Member removed from team successfully!');
                break;

            case 'stepDown':
                alert('You have stepped down as leader. Redirecting...');
                window.location.href = '../templates/profile.html'; // Redirect to regular profile
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

    // Helper function to render teams list
    function renderTeamsList() {
        teamsList.innerHTML = '';

        if (teams.length === 0) {
            teamsList.innerHTML = '<p class="no-teams">No teams managed yet</p>';
            return;
        }

        teams.forEach(team => {
            const teamItem = document.createElement('div');
            teamItem.className = 'team-item';
            teamItem.innerHTML = `
                <div class="team-info">
                    <span class="team-name">${team.name}</span>
                    <span class="team-meta">${team.members} members • ${team.assignments} active assignments</span>
                </div>
                <div class="team-actions">
                    <button class="btn-view-team" data-id="${team.id}">
                        <i class="fas fa-chart-line"></i> Dashboard
                    </button>
                    <button class="btn-edit-team" data-id="${team.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            `;
            teamsList.appendChild(teamItem);
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
// Add this to your existing JavaScript file

// Modal Control Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Re-enable scrolling
}

// Event Listeners for Modals
document.querySelectorAll('[data-modal-target]').forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.dataset.modalTarget;
        openModal(modalId);
    });
});

document.querySelectorAll('.modal-close, .btn-cancel').forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal.id);
    });
});

// Close modal when clicking outside content
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal.id);
        }
    });
});

// Escape key to close modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.show').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// Update your existing modal openers to use these functions:
addTeamBtn.addEventListener('click', () => openModal('team-modal'));
addMemberBtn.addEventListener('click', () => openModal('member-modal'));
stepDownBtn.addEventListener('click', () => openModal('confirm-modal'));
deleteAccountBtn.addEventListener('click', () => openModal('confirm-modal'));