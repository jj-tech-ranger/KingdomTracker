document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const profileNavBtns = document.querySelectorAll('.profile-nav-btn');
    const profileSections = document.querySelectorAll('.profile-section');
    const accountForm = document.getElementById('account-form');
    const passwordForm = document.getElementById('password-form');
    const teamsGrid = document.getElementById('teams-grid');
    const memberModal = document.getElementById('member-modal');
    const closeMemberModal = document.getElementById('close-member-modal');
    const saveMemberBtn = document.getElementById('save-member-btn');
    const cancelMemberBtn = document.getElementById('cancel-member-btn');
    const confirmModal = document.getElementById('confirm-modal');
    const closeConfirmModal = document.getElementById('close-confirm-modal');
    const confirmActionBtn = document.getElementById('confirm-action-btn');
    const cancelActionBtn = document.getElementById('cancel-action-btn');
    const addMemberBtn = document.getElementById('add-member-btn');
    const removeMemberBtn = document.getElementById('remove-member-btn');
    const manageRolesBtn = document.getElementById('manage-roles-btn');
    const savePermissionsBtn = document.getElementById('save-permissions-btn');
    const saveCommunicationBtn = document.getElementById('save-communication-btn');
    const changeAvatarBtn = document.getElementById('change-avatar');
    const profilePicture = document.getElementById('profile-picture');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const passwordMatch = document.getElementById('password-match');
    const messageModal = document.getElementById('message-modal');
    const closeMessageBtn = document.getElementById('close-message');
    const sendMessageBtn = document.getElementById('send-message');
    const cancelMessageBtn = document.getElementById('cancel-message');

    // Current action type for confirmation modal
    let currentAction = null;

    // Initialize the page
    renderTeams();

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
        const teamSelect = document.getElementById('team-select');
        if (!teamSelect.value) {
            alert('Please select a team first');
            return;
        }

        currentAction = {
            type: 'removeMember',
            data: { teamId: teamSelect.value }
        };

        document.getElementById('confirm-modal-title').textContent = 'Remove Member';
        document.getElementById('confirm-modal-message').textContent = 'Are you sure you want to remove this member from the team?';
        confirmModal.classList.add('show');
    });

    // Manage roles button
    manageRolesBtn.addEventListener('click', function() {
        const teamSelect = document.getElementById('team-select');
        if (!teamSelect.value) {
            alert('Please select a team first');
            return;
        }
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
                alert(`Member removed from team ${currentAction.data.teamId} successfully!`);
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

    // Message leader functionality
    teamsGrid.addEventListener('click', function(e) {
        if (e.target.closest('.btn-message')) {
            const btn = e.target.closest('.btn-message');
            const leaderId = parseInt(btn.dataset.id);
            const teamCard = btn.closest('.team-card');
            const teamName = teamCard.querySelector('h4').textContent;
            const leaderName = teamCard.querySelector('.team-info p:nth-child(3)').textContent.replace('Leader: ', '');

            document.getElementById('message-recipient').textContent = `${leaderName} (${teamName})`;
            document.getElementById('message-leader-id').value = leaderId;
            document.getElementById('message-subject').value = '';
            document.getElementById('message-content').value = '';
            document.getElementById('message-copy-team').checked = false;
            messageModal.classList.add('show');
        }
    });

    // Close message modal
    closeMessageBtn.addEventListener('click', function() {
        messageModal.classList.remove('show');
    });

    cancelMessageBtn.addEventListener('click', function() {
        messageModal.classList.remove('show');
    });

    // Send message
    sendMessageBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const subject = document.getElementById('message-subject').value;
        const content = document.getElementById('message-content').value;
        const copyTeam = document.getElementById('message-copy-team').checked;
        const leaderId = document.getElementById('message-leader-id').value;
        const recipient = document.getElementById('message-recipient').textContent;

        if (!subject || !content) {
            alert('Please fill in both subject and message content');
            return;
        }

        alert(`Message sent to ${recipient}${copyTeam ? ' and their team' : ''}`);
        messageModal.classList.remove('show');
        document.getElementById('message-form').reset();
    });

    // Helper function to render teams
    function renderTeams() {
        teamsGrid.innerHTML = '';

        // Use the teams data from rl.js
        const regionalTeams = [
            {
                id: 1,
                name: "Northside Team",
                location: "Downtown District",
                leader: "Pastor John",
                leaderId: 101,
                members: 24,
                activeMembers: 18,
                lastActivity: "2023-06-30",
                photo: "../img/team.png"
            },
            {
                id: 2,
                name: "River Valley Team",
                location: "East Suburbs",
                leader: "Sister Mary",
                leaderId: 102,
                members: 18,
                activeMembers: 15,
                lastActivity: "2023-06-28",
                photo: "../img/team.png"
            },
            {
                id: 3,
                name: "Mountain View Team",
                location: "West Hills",
                leader: "Brother David",
                leaderId: 103,
                members: 22,
                activeMembers: 19,
                lastActivity: "2023-06-29",
                photo: "../img/team.png"
            },
            {
                id: 4,
                name: "Lakeside Team",
                location: "North District",
                leader: "Pastor Sarah",
                leaderId: 104,
                members: 15,
                activeMembers: 12,
                lastActivity: "2023-06-27",
                photo: "../img/team.png"
            },
            {
                id: 5,
                name: "Central City Team",
                location: "Central Business District",
                leader: "Elder Michael",
                leaderId: 105,
                members: 30,
                activeMembers: 25,
                lastActivity: "2023-06-30",
                photo: "../img/team.png"
            }
        ];

        regionalTeams.forEach(team => {
            const teamCard = document.createElement('div');
            teamCard.className = 'team-card';
            teamCard.innerHTML = `
                <div class="team-header">
                    <img src="${team.photo}" alt="${team.name}" class="team-avatar">
                    <div class="team-info">
                        <h4>${team.name}</h4>
                        <p>${team.location}</p>
                        <p><i class="fas fa-user"></i> Leader: ${team.leader}</p>
                    </div>
                </div>
                <div class="team-stats">
                    <div class="stat-item">
                        <div class="stat-value">${team.members}</div>
                        <div class="stat-label">Members</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${team.activeMembers}</div>
                        <div class="stat-label">Active</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${Math.round((team.activeMembers / team.members) * 100)}%</div>
                        <div class="stat-label">Engagement</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${formatDate(team.lastActivity)}</div>
                        <div class="stat-label">Last Active</div>
                    </div>
                </div>
                <div class="team-actions">
                    <button class="btn btn-view" data-id="${team.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-message" data-id="${team.leaderId}">
                        <i class="fas fa-envelope"></i> Message
                    </button>
                </div>
            `;
            teamsGrid.appendChild(teamCard);
        });

        // Add click handler for view buttons
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', function() {
                const teamId = parseInt(this.dataset.id);
                const team = regionalTeams.find(t => t.id === teamId);
                alert(`Viewing details for ${team.name}`);
            });
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

    // Helper function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
});

// Modal Control Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

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