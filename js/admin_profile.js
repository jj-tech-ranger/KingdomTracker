document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const profileNavBtns = document.querySelectorAll('.profile-nav-btn');
    const profileSections = document.querySelectorAll('.profile-section');
    const accountForm = document.getElementById('account-form');
    const passwordForm = document.getElementById('password-form');
    const regionsList = document.getElementById('regions-list');
    const addRegionBtn = document.getElementById('add-region-btn');
    const regionModal = document.getElementById('region-modal');
    const closeRegionModal = document.getElementById('close-region-modal');
    const saveRegionBtn = document.getElementById('save-region-btn');
    const cancelRegionBtn = document.getElementById('cancel-region-btn');
    const regionNameInput = document.getElementById('region-name');
    const regionDescInput = document.getElementById('region-description');
    const leaderModal = document.getElementById('leader-modal');
    const closeLeaderModal = document.getElementById('close-leader-modal');
    const saveLeaderBtn = document.getElementById('save-leader-btn');
    const cancelLeaderBtn = document.getElementById('cancel-leader-btn');
    const confirmModal = document.getElementById('confirm-modal');
    const closeConfirmModal = document.getElementById('close-confirm-modal');
    const confirmActionBtn = document.getElementById('confirm-action-btn');
    const cancelActionBtn = document.getElementById('cancel-action-btn');
    const deactivateAdminBtn = document.getElementById('deactivate-admin-btn');
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    const changeAvatarBtn = document.getElementById('change-avatar');
    const profilePicture = document.getElementById('profile-picture');
    const newPasswordInput = document.getElementById('new-password');
    const confirmNewPasswordInput = document.getElementById('confirm-new-password');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    const passwordMatch = document.getElementById('password-match');
    const assignLeaderBtn = document.getElementById('assign-leader-btn');
    const savePermissionsBtn = document.getElementById('save-permissions-btn');
    const saveCommunicationBtn = document.getElementById('save-communication-btn');

    // Sample regions data (from admin.js)
    let regions = [
        {
            id: 1,
            name: "Northern Territories",
            description: "Covers the northern provinces including mountain ranges and rural communities",
            leader: "Pastor Jonathan Williams",
            leaderId: 101,
            teams: 12,
            members: 320,
            engagement: 83,
            lastActivity: "2023-06-30",
            photo: "../img/region1.jpg"
        },
        {
            id: 2,
            name: "Eastern Provinces",
            description: "Urban and suburban areas along the eastern coastline",
            leader: "Elder Sarah Johnson",
            leaderId: 102,
            teams: 18,
            members: 450,
            engagement: 89,
            lastActivity: "2023-06-29",
            photo: "../img/region2.jpg"
        },
        {
            id: 3,
            name: "Southern Districts",
            description: "Southern agricultural regions and border towns",
            leader: "Minister David Thompson",
            leaderId: 103,
            teams: 15,
            members: 380,
            engagement: 78,
            lastActivity: "2023-06-28",
            photo: "../img/region3.jpg"
        },
        {
            id: 4,
            name: "Western Zones",
            description: "Western deserts, coastal cities and island communities",
            leader: "Prophetess Mary Anderson",
            leaderId: 104,
            teams: 9,
            members: 240,
            engagement: 75,
            lastActivity: "2023-06-27",
            photo: "../img/region4.jpg"
        },
        {
            id: 5,
            name: "Central Valleys",
            description: "Heartland regions with major metropolitan areas",
            leader: "Bishop Thomas Clark",
            leaderId: 105,
            teams: 22,
            members: 580,
            engagement: 91,
            lastActivity: "2023-06-30",
            photo: "../img/region5.jpg"
        }
    ];

    // Sample leaders data
    let leaders = [
        {
            id: 101,
            name: "Pastor Jonathan Williams",
            title: "Pastor",
            email: "jonathan@example.com",
            phone: "+254712345678",
            regionId: 1,
            region: "Northern Territories",
            photo: "../img/leader1.jpg"
        },
        {
            id: 102,
            name: "Elder Sarah Johnson",
            title: "Elder",
            email: "sarah@example.com",
            phone: "+254712345679",
            regionId: 2,
            region: "Eastern Provinces",
            photo: "../img/leader2.jpg"
        },
        {
            id: 103,
            name: "Minister David Thompson",
            title: "Minister",
            email: "david@example.com",
            phone: "+254712345680",
            regionId: 3,
            region: "Southern Districts",
            photo: "../img/leader3.jpg"
        },
        {
            id: 104,
            name: "Prophetess Mary Anderson",
            title: "Prophetess",
            email: "mary@example.com",
            phone: "+254712345681",
            regionId: 4,
            region: "Western Zones",
            photo: "../img/leader4.jpg"
        },
        {
            id: 105,
            name: "Bishop Thomas Clark",
            title: "Bishop",
            email: "thomas@example.com",
            phone: "+254712345682",
            regionId: 5,
            region: "Central Valleys",
            photo: "../img/leader5.jpg"
        }
    ];

    // Current action type for confirmation modal
    let currentAction = null;

    // Initialize the page
    renderRegionsList();
    renderLeadersList();
    populateRegionSelect();
    populateLeaderSelect();

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

    // Add region button
    addRegionBtn.addEventListener('click', function() {
        regionNameInput.value = '';
        regionDescInput.value = '';
        document.getElementById('region-modal-title').textContent = 'Add New Region';
        saveRegionBtn.dataset.mode = 'add';
        regionModal.classList.add('show');
    });

    // Close region modal
    closeRegionModal.addEventListener('click', function() {
        regionModal.classList.remove('show');
    });

    cancelRegionBtn.addEventListener('click', function() {
        regionModal.classList.remove('show');
    });

    // Save region
    saveRegionBtn.addEventListener('click', function() {
        const name = regionNameInput.value.trim();
        const description = regionDescInput.value.trim();
        const leaderId = document.getElementById('region-leader').value;

        if (!name) {
            alert('Please enter a region name');
            return;
        }

        if (this.dataset.mode === 'add') {
            // Add new region
            const newId = regions.length > 0 ? Math.max(...regions.map(r => r.id)) + 1 : 1;
            const leader = leaders.find(l => l.id === parseInt(leaderId));

            regions.push({
                id: newId,
                name,
                description,
                leader: leader ? leader.name : '',
                leaderId: leader ? leader.id : null,
                teams: 0,
                members: 0,
                engagement: 0,
                lastActivity: new Date().toISOString().split('T')[0],
                photo: "../img/region-default.jpg"
            });
        } else {
            // Update existing region
            const regionId = parseInt(this.dataset.regionId);
            const regionIndex = regions.findIndex(r => r.id === regionId);
            const leader = leaders.find(l => l.id === parseInt(leaderId));

            if (regionIndex !== -1) {
                regions[regionIndex] = {
                    ...regions[regionIndex],
                    name,
                    description,
                    leader: leader ? leader.name : '',
                    leaderId: leader ? leader.id : null
                };
            }
        }

        renderRegionsList();
        populateRegionSelect();
        regionModal.classList.remove('show');
    });

    // Edit region (event delegation)
    regionsList.addEventListener('click', function(e) {
        if (e.target.closest('.btn-edit-region')) {
            const btn = e.target.closest('.btn-edit-region');
            const regionId = parseInt(btn.dataset.id);
            const region = regions.find(r => r.id === regionId);

            if (region) {
                regionNameInput.value = region.name;
                regionDescInput.value = region.description || '';
                document.getElementById('region-leader').value = region.leaderId || '';
                document.getElementById('region-modal-title').textContent = 'Edit Region';
                saveRegionBtn.dataset.mode = 'edit';
                saveRegionBtn.dataset.regionId = regionId;
                regionModal.classList.add('show');
            }
        }

        if (e.target.closest('.btn-view-region')) {
            const btn = e.target.closest('.btn-view-region');
            const regionId = parseInt(btn.dataset.id);
            // In a real app, this would redirect to the region dashboard
            alert(`Redirecting to region ${regionId} dashboard...`);
        }
    });

    // Add leader button
    document.getElementById('add-leader-btn').addEventListener('click', function() {
        document.getElementById('leader-first-name').value = '';
        document.getElementById('leader-last-name').value = '';
        document.getElementById('leader-email').value = '';
        document.getElementById('leader-phone').value = '';
        document.getElementById('leader-title').value = '';
        document.getElementById('leader-region').value = '';
        document.getElementById('leader-modal-title').textContent = 'Add New Leader';
        saveLeaderBtn.dataset.mode = 'add';
        leaderModal.classList.add('show');
    });

    // Close leader modal
    closeLeaderModal.addEventListener('click', function() {
        leaderModal.classList.remove('show');
    });

    cancelLeaderBtn.addEventListener('click', function() {
        leaderModal.classList.remove('show');
    });

    // Save leader
    saveLeaderBtn.addEventListener('click', function() {
        const firstName = document.getElementById('leader-first-name').value.trim();
        const lastName = document.getElementById('leader-last-name').value.trim();
        const email = document.getElementById('leader-email').value.trim();
        const phone = document.getElementById('leader-phone').value.trim();
        const title = document.getElementById('leader-title').value.trim();
        const regionId = document.getElementById('leader-region').value;
        const region = regions.find(r => r.id === parseInt(regionId));

        if (!firstName || !lastName || !email) {
            alert('Please fill in all required fields');
            return;
        }

        if (this.dataset.mode === 'add') {
            // Add new leader
            const newId = leaders.length > 0 ? Math.max(...leaders.map(l => l.id)) + 1 : 101;

            leaders.push({
                id: newId,
                name: `${firstName} ${lastName}`,
                title,
                email,
                phone,
                regionId: region ? region.id : null,
                region: region ? region.name : '',
                photo: "../img/leader-default.jpg"
            });
        } else {
            // Update existing leader
            const leaderId = parseInt(this.dataset.leaderId);
            const leaderIndex = leaders.findIndex(l => l.id === leaderId);

            if (leaderIndex !== -1) {
                leaders[leaderIndex] = {
                    ...leaders[leaderIndex],
                    name: `${firstName} ${lastName}`,
                    title,
                    email,
                    phone,
                    regionId: region ? region.id : null,
                    region: region ? region.name : ''
                };
            }
        }

        renderLeadersList();
        populateLeaderSelect();
        leaderModal.classList.remove('show');
    });

    // Edit leader (event delegation)
    document.getElementById('leaders-list').addEventListener('click', function(e) {
        if (e.target.closest('.btn-edit-leader')) {
            const btn = e.target.closest('.btn-edit-leader');
            const leaderId = parseInt(btn.dataset.id);
            const leader = leaders.find(l => l.id === leaderId);

            if (leader) {
                const [firstName, ...lastNameParts] = leader.name.split(' ');
                const lastName = lastNameParts.join(' ');

                document.getElementById('leader-first-name').value = firstName;
                document.getElementById('leader-last-name').value = lastName;
                document.getElementById('leader-email').value = leader.email;
                document.getElementById('leader-phone').value = leader.phone;
                document.getElementById('leader-title').value = leader.title;
                document.getElementById('leader-region').value = leader.regionId || '';
                document.getElementById('leader-modal-title').textContent = 'Edit Leader';
                saveLeaderBtn.dataset.mode = 'edit';
                saveLeaderBtn.dataset.leaderId = leaderId;
                leaderModal.classList.add('show');
            }
        }

        if (e.target.closest('.btn-view-leader')) {
            const btn = e.target.closest('.btn-view-leader');
            const leaderId = parseInt(btn.dataset.id);
            // In a real app, this would redirect to the leader profile
            alert(`Redirecting to leader ${leaderId} profile...`);
        }
    });

    // Assign leader to region
    assignLeaderBtn.addEventListener('click', function() {
        const leaderId = document.getElementById('leader-select').value;
        const regionId = document.getElementById('region-select').value;

        if (!leaderId || !regionId) {
            alert('Please select both a leader and a region');
            return;
        }

        const leader = leaders.find(l => l.id === parseInt(leaderId));
        const region = regions.find(r => r.id === parseInt(regionId));

        if (leader && region) {
            leader.regionId = region.id;
            leader.region = region.name;

            // Also update the region's leader
            region.leader = leader.name;
            region.leaderId = leader.id;

            renderRegionsList();
            renderLeadersList();
            alert(`Leader ${leader.name} assigned to ${region.name} successfully!`);
        }
    });

    // Deactivate admin button
    deactivateAdminBtn.addEventListener('click', function() {
        currentAction = {
            type: 'deactivateAdmin'
        };

        document.getElementById('confirm-modal-title').textContent = 'Deactivate Admin';
        document.getElementById('confirm-modal-message').textContent = 'Are you sure you want to deactivate your admin permissions? You will need super admin approval to regain them.';
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
            case 'deactivateAdmin':
                alert('You have deactivated your admin permissions. Redirecting...');
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

    // Save permissions button
    savePermissionsBtn.addEventListener('click', function() {
        alert('Permissions updated successfully!');
    });

    // Save communication preferences button
    saveCommunicationBtn.addEventListener('click', function() {
        alert('Communication preferences saved successfully!');
    });

    // Helper function to render regions list
    function renderRegionsList() {
        regionsList.innerHTML = '';

        if (regions.length === 0) {
            regionsList.innerHTML = '<p class="no-regions">No regions managed yet</p>';
            return;
        }

        regions.forEach(region => {
            const regionItem = document.createElement('div');
            regionItem.className = 'region-item';
            regionItem.innerHTML = `
                <img src="${region.photo}" alt="${region.name}" class="region-photo">
                <div class="region-info">
                    <span class="region-name">${region.name}</span>
                    <span class="region-meta">${region.description}</span>
                    <div class="region-leader">
                        <i class="fas fa-user"></i>
                        <span>${region.leader || 'No leader assigned'}</span>
                    </div>
                    <div class="region-stats">
                        <div class="region-stat">
                            <i class="fas fa-users"></i>
                            <span>${region.teams} teams</span>
                        </div>
                        <div class="region-stat">
                            <i class="fas fa-user-friends"></i>
                            <span>${region.members} members</span>
                        </div>
                        <div class="region-stat">
                            <i class="fas fa-chart-line"></i>
                            <span>${region.engagement}% engagement</span>
                        </div>
                    </div>
                </div>
                <div class="region-actions">
                    <button class="btn-view-region" data-id="${region.id}">
                        <i class="fas fa-chart-line"></i> Dashboard
                    </button>
                    <button class="btn-edit-region" data-id="${region.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            `;
            regionsList.appendChild(regionItem);
        });
    }

    // Helper function to render leaders list
    function renderLeadersList() {
        const leadersList = document.getElementById('leaders-list');
        leadersList.innerHTML = '';

        if (leaders.length === 0) {
            leadersList.innerHTML = '<p class="no-leaders">No leaders managed yet</p>';
            return;
        }

        leaders.forEach(leader => {
            const leaderItem = document.createElement('div');
            leaderItem.className = 'leader-item';
            leaderItem.innerHTML = `
                <img src="${leader.photo}" alt="${leader.name}" class="leader-avatar">
                <div class="leader-info">
                    <span class="leader-name">${leader.name}</span>
                    <span class="leader-title">${leader.title}</span>
                    <div class="leader-region">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${leader.region || 'No region assigned'}</span>
                    </div>
                </div>
                <div class="leader-actions">
                    <button class="btn-view-leader" data-id="${leader.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit-leader" data-id="${leader.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            `;
            leadersList.appendChild(leaderItem);
        });
    }

    // Helper function to populate region select dropdowns
    function populateRegionSelect() {
        const regionSelects = [
            document.getElementById('region-select'),
            document.getElementById('leader-region'),
            document.getElementById('region-leader')
        ];

        regionSelects.forEach(select => {
            if (!select) return;

            // Save the current value
            const currentValue = select.value;

            // Clear existing options except the first one
            while (select.options.length > 1) {
                select.remove(1);
            }

            // Add regions
            regions.forEach(region => {
                const option = document.createElement('option');
                option.value = region.id;
                option.textContent = region.name;
                select.appendChild(option);
            });

            // Restore the current value if it still exists
            if (currentValue && Array.from(select.options).some(opt => opt.value === currentValue)) {
                select.value = currentValue;
            }
        });
    }

    // Helper function to populate leader select dropdown
    function populateLeaderSelect() {
        const select = document.getElementById('leader-select');
        if (!select) return;

        // Save the current value
        const currentValue = select.value;

        // Clear existing options except the first one
        while (select.options.length > 1) {
            select.remove(1);
        }

        // Add leaders
        leaders.forEach(leader => {
            const option = document.createElement('option');
            option.value = leader.id;
            option.textContent = `${leader.name} (${leader.region || 'No region'})`;
            select.appendChild(option);
        });

        // Restore the current value if it still exists
        if (currentValue && Array.from(select.options).some(opt => opt.value === currentValue)) {
            select.value = currentValue;
        }
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
        })
    }
});