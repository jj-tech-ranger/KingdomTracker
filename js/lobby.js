document.addEventListener('DOMContentLoaded', function() {
    // Sample data
    const regionsData = [
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
            description: "Western deserts, coastal cities, and island communities",
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

    const teamsData = [
        {
            id: 1,
            name: "Mountain Summit Team",
            regionId: 1,
            leader: "Brother Michael Brown",
            members: 28,
            engagement: 85,
            lastActivity: "2023-06-28",
            photo: "../img/team1.jpg"
        },
        {
            id: 2,
            name: "Northern Lights Team",
            regionId: 1,
            leader: "Sister Emily Davis",
            members: 24,
            engagement: 82,
            lastActivity: "2023-06-25",
            photo: "../img/team2.jpg"
        },
        {
            id: 3,
            name: "Coastal Harvest Team",
            regionId: 2,
            leader: "Brother James Wilson",
            members: 32,
            engagement: 88,
            lastActivity: "2023-06-29",
            photo: "../img/team3.jpg"
        },
        {
            id: 4,
            name: "Eastern Gate Team",
            regionId: 2,
            leader: "Sister Rachel Miller",
            members: 30,
            engagement: 90,
            lastActivity: "2023-06-30",
            photo: "../img/team4.jpg"
        },
        {
            id: 5,
            name: "Southern Cross Team",
            regionId: 3,
            leader: "Brother Daniel Taylor",
            members: 26,
            engagement: 76,
            lastActivity: "2023-06-27",
            photo: "../img/team5.jpg"
        },
        {
            id: 6,
            name: "Desert Bloom Team",
            regionId: 4,
            leader: "Sister Olivia Martinez",
            members: 18,
            engagement: 72,
            lastActivity: "2023-06-24",
            photo: "../img/team6.jpg"
        },
        {
            id: 7,
            name: "Pacific Reach Team",
            regionId: 4,
            leader: "Brother Ethan Anderson",
            members: 20,
            engagement: 78,
            lastActivity: "2023-06-26",
            photo: "../img/team7.jpg"
        },
        {
            id: 8,
            name: "Metropolitan Light Team",
            regionId: 5,
            leader: "Sister Sophia Thomas",
            members: 35,
            engagement: 92,
            lastActivity: "2023-06-30",
            photo: "../img/team8.jpg"
        },
        {
            id: 9,
            name: "Heartland Worship Team",
            regionId: 5,
            leader: "Brother Noah White",
            members: 30,
            engagement: 94,
            lastActivity: "2023-06-29",
            photo: "../img/team9.jpg"
        }
    ];

    const membersData = [
        { id: 1, name: "John Smith", email: "john.smith@example.com", teamId: 1, status: "active", lastActive: "2023-06-30", photo: "../img/member1.jpg" },
        { id: 2, name: "Sarah Johnson", email: "sarah.j@example.com", teamId: 1, status: "active", lastActive: "2023-06-29", photo: "../img/member2.jpg" },
        { id: 3, name: "Michael Brown", email: "michael.b@example.com", teamId: 2, status: "active", lastActive: "2023-06-28", photo: "../img/member3.jpg" },
        { id: 4, name: "Emily Davis", email: "emily.d@example.com", teamId: 3, status: "active", lastActive: "2023-06-30", photo: "../img/member4.jpg" },
        { id: 5, name: "James Wilson", email: "james.w@example.com", teamId: 3, status: "active", lastActive: "2023-06-29", photo: "../img/member5.jpg" },
        { id: 6, name: "Rachel Miller", email: "rachel.m@example.com", teamId: 4, status: "active", lastActive: "2023-06-30", photo: "../img/member6.jpg" },
        { id: 7, name: "Daniel Taylor", email: "daniel.t@example.com", teamId: 5, status: "active", lastActive: "2023-06-27", photo: "../img/member7.jpg" },
        { id: 8, name: "Olivia Martinez", email: "olivia.m@example.com", teamId: 6, status: "active", lastActive: "2023-06-25", photo: "../img/member8.jpg" },
        { id: 9, name: "Ethan Anderson", email: "ethan.a@example.com", teamId: 7, status: "active", lastActive: "2023-06-26", photo: "../img/member9.jpg" },
        { id: 10, name: "Sophia Thomas", email: "sophia.t@example.com", teamId: 8, status: "active", lastActive: "2023-06-30", photo: "../img/member10.jpg" },
        { id: 11, name: "Noah White", email: "noah.w@example.com", teamId: 9, status: "active", lastActive: "2023-06-29", photo: "../img/member11.jpg" },
        { id: 12, name: "Ava Jackson", email: "ava.j@example.com", teamId: 9, status: "active", lastActive: "2023-06-28", photo: "../img/member12.jpg" },
        { id: 13, name: "Liam Harris", email: "liam.h@example.com", teamId: null, status: "unassigned", lastActive: "2023-06-20", photo: "../img/member13.jpg" },
        { id: 14, name: "Isabella Clark", email: "isabella.c@example.com", teamId: null, status: "unassigned", lastActive: "2023-06-18", photo: "../img/member14.jpg" },
        { id: 15, name: "Mason Lewis", email: "mason.l@example.com", teamId: null, status: "unassigned", lastActive: "2023-06-15", photo: "../img/member15.jpg" },
        { id: 16, name: "Mia Walker", email: "mia.w@example.com", teamId: 5, status: "inactive", lastActive: "2023-05-30", photo: "../img/member16.jpg" },
        { id: 17, name: "Jacob Hall", email: "jacob.h@example.com", teamId: 6, status: "inactive", lastActive: "2023-05-28", photo: "../img/member17.jpg" },
        { id: 18, name: "Charlotte Young", email: "charlotte.y@example.com", teamId: null, status: "unassigned", lastActive: "2023-06-10", photo: "../img/member18.jpg" },
        { id: 19, name: "William Allen", email: "william.a@example.com", teamId: 2, status: "active", lastActive: "2023-06-27", photo: "../img/member19.jpg" },
        { id: 20, name: "Amelia King", email: "amelia.k@example.com", teamId: 4, status: "active", lastActive: "2023-06-29", photo: "../img/member20.jpg" }
    ];

    // DOM Elements
    const membersTableBody = document.getElementById('members-table-body');
    const unassignedMembers = document.getElementById('unassigned-members');
    const regionsGrid = document.getElementById('regions-grid');
    const filterRegion = document.getElementById('filter-region');
    const filterStatus = document.getElementById('filter-status');
    const lobbySearch = document.getElementById('lobby-search');
    const clearFilters = document.getElementById('clear-filters');
    const memberCount = document.getElementById('member-count');
    const currentPage = document.getElementById('current-page');
    const prevPage = document.getElementById('prev-page');
    const nextPage = document.getElementById('next-page');
    const selectAllMembers = document.getElementById('select-all-members');
    const quickAssignBtn = document.getElementById('quick-assign');
    const batchMessageBtn = document.getElementById('batch-message');
    const assignSelectedBtn = document.getElementById('assign-selected');
    const exportRegionsBtn = document.getElementById('export-regions');

    // Modal Elements
    const messageLeaderModal = document.getElementById('message-leader-modal');
    const viewTeamsModal = document.getElementById('view-teams-modal');
    const quickAssignModal = document.getElementById('quick-assign-modal');
    const batchMessageModal = document.getElementById('batch-message-modal');

    // Pagination variables
    let currentPageNum = 1;
    const membersPerPage = 10;
    let filteredMembers = [...membersData];

    // Initialize the page
    function initPage() {
        populateRegions();
        populateUnassignedMembers();
        populateRegionFilter();
        filterAndRenderMembers();
        setupEventListeners();
    }

    // Populate regions grid
    function populateRegions() {
        regionsGrid.innerHTML = '';
        regionsData.forEach(region => {
            const regionCard = document.createElement('div');
            regionCard.className = 'region-card';
            regionCard.innerHTML = `
                <div class="region-header">
                    <img src="${region.photo}" alt="${region.name}" class="region-avatar">
                    <div class="region-info">
                        <h4>${region.name}</h4>
                        <p>${region.description}</p>
                        <p><i class="fas fa-user"></i> Leader: ${region.leader}</p>
                    </div>
                </div>
                <div class="region-stats">
                    <div class="stat-item">
                        <div class="stat-value">${region.teams}</div>
                        <div class="stat-label">Teams</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${region.members}</div>
                        <div class="stat-label">Members</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${region.engagement}%</div>
                        <div class="stat-label">Engagement</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${formatDate(region.lastActivity)}</div>
                        <div class="stat-label">Last Active</div>
                    </div>
                </div>
                <div class="region-actions">
                    <button class="btn btn-view" data-id="${region.id}">
                        <i class="fas fa-eye"></i> View Teams
                    </button>
                    <button class="btn btn-message" data-id="${region.leaderId}" data-region="${region.id}">
                        <i class="fas fa-envelope"></i> Message Leader
                    </button>
                </div>
            `;
            regionsGrid.appendChild(regionCard);
        });
    }

    // Populate unassigned members
    function populateUnassignedMembers() {
        unassignedMembers.innerHTML = '';
        const unassigned = membersData.filter(m => m.status === 'unassigned');

        unassigned.forEach(member => {
            const memberDiv = document.createElement('div');
            memberDiv.className = 'unassigned-member';
            memberDiv.innerHTML = `
                <input type="checkbox" class="unassigned-checkbox" data-id="${member.id}">
                <img src="${member.photo}" alt="${member.name}" class="unassigned-avatar">
                <div class="unassigned-info">
                    <h5>${member.name}</h5>
                    <p>Last active: ${formatDate(member.lastActive)}</p>
                </div>
            `;
            unassignedMembers.appendChild(memberDiv);
        });
    }

    // Populate region filter dropdown
    function populateRegionFilter() {
        regionsData.forEach(region => {
            const option = document.createElement('option');
            option.value = region.id;
            option.textContent = region.name;
            filterRegion.appendChild(option);
        });
    }

    // Filter and render members table
    function filterAndRenderMembers() {
        const regionFilter = filterRegion.value;
        const statusFilter = filterStatus.value;
        const searchTerm = lobbySearch.value.toLowerCase();

        filteredMembers = membersData.filter(member => {
            // Filter by region if a region is selected
            if (regionFilter !== 'all') {
                const team = teamsData.find(t => t.id === member.teamId);
                if (!team || team.regionId !== parseInt(regionFilter)) {
                    return false;
                }
            }

            // Filter by status if a status is selected
            if (statusFilter !== 'all') {
                if (member.status !== statusFilter) {
                    return false;
                }
            }

            // Filter by search term
            if (searchTerm) {
                const nameMatch = member.name.toLowerCase().includes(searchTerm);
                const emailMatch = member.email.toLowerCase().includes(searchTerm);
                if (!nameMatch && !emailMatch) {
                    return false;
                }
            }

            return true;
        });

        renderMembersTable();
        updatePagination();
    }

    // Render members table
    function renderMembersTable() {
        membersTableBody.innerHTML = '';

        const startIndex = (currentPageNum - 1) * membersPerPage;
        const endIndex = startIndex + membersPerPage;
        const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

        paginatedMembers.forEach(member => {
            const team = member.teamId ? teamsData.find(t => t.id === member.teamId) : null;
            const region = team ? regionsData.find(r => r.id === team.regionId) : null;

            const row = document.createElement('tr');
            row.className = 'member-row';
            row.innerHTML = `
                <td><input type="checkbox" class="member-checkbox" data-id="${member.id}"></td>
                <td>
                    <div class="member-info">
                        <img src="${member.photo}" alt="${member.name}" class="member-avatar">
                        <div>
                            <div class="member-name">${member.name}</div>
                            <div class="member-email">${member.email}</div>
                        </div>
                    </div>
                </td>
                <td>${team ? team.name : 'Unassigned'}</td>
                <td>${region ? region.name : team ? 'No Region' : 'Unassigned'}</td>
                <td><span class="status-badge status-${member.status}">${capitalizeFirstLetter(member.status)}</span></td>
                <td>${formatDate(member.lastActive)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-sm btn-view" data-id="${member.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-edit" data-id="${member.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-message" data-id="${member.id}">
                            <i class="fas fa-envelope"></i>
                        </button>
                    </div>
                </td>
            `;
            membersTableBody.appendChild(row);
        });

        memberCount.textContent = `${filteredMembers.length} members`;
    }

    // Update pagination controls
    function updatePagination() {
        const totalPages = Math.ceil(filteredMembers.length / membersPerPage);

        currentPage.textContent = currentPageNum;
        prevPage.disabled = currentPageNum === 1;
        nextPage.disabled = currentPageNum === totalPages || totalPages === 0;
    }

    // Format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Show message leader modal
    function showMessageLeaderModal(leaderId, regionId) {
        const region = regionsData.find(r => r.id === parseInt(regionId));
        if (!region) return;

        document.getElementById('message-leader-recipient').textContent =
            `${region.leader} (${region.name})`;
        document.getElementById('message-leader-id').value = leaderId;
        document.getElementById('message-leader-subject').value = '';
        document.getElementById('message-leader-content').value = '';
        document.getElementById('message-leader-copy-teams').checked = false;

        messageLeaderModal.classList.add('show');
    }

    // Show view teams modal
    function showViewTeamsModal(regionId) {
        const region = regionsData.find(r => r.id === parseInt(regionId));
        if (!region) return;

        document.getElementById('view-teams-region-name').textContent = region.name;
        const teamsList = document.getElementById('teams-list');
        teamsList.innerHTML = '';

        const regionTeams = teamsData.filter(team => team.regionId === parseInt(regionId));
        regionTeams.forEach(team => {
            const teamItem = document.createElement('div');
            teamItem.className = 'team-list-item';
            teamItem.innerHTML = `
                <img src="${team.photo}" alt="${team.name}" class="team-list-avatar">
                <div class="team-list-info">
                    <h4>${team.name}</h4>
                    <p>Leader: ${team.leader} • ${team.members} members • ${team.engagement}% engagement</p>
                </div>
                <div class="team-list-actions">
                    <button class="btn btn-sm btn-message" data-id="${team.id}">
                        <i class="fas fa-envelope"></i>
                    </button>
                </div>
            `;
            teamsList.appendChild(teamItem);
        });

        viewTeamsModal.classList.add('show');
    }

    // Show quick assign modal
    function showQuickAssignModal() {
        // Populate assign members list
        const assignMembersList = document.getElementById('assign-members-list');
        assignMembersList.innerHTML = '';

        const unassigned = membersData.filter(m => m.status === 'unassigned');
        unassigned.forEach(member => {
            const memberDiv = document.createElement('div');
            memberDiv.className = 'assign-member';
            memberDiv.innerHTML = `
                <input type="checkbox" class="assign-member-checkbox" data-id="${member.id}">
                <img src="${member.photo}" alt="${member.name}" class="assign-member-avatar">
                <div class="assign-member-name">${member.name}</div>
            `;
            assignMembersList.appendChild(memberDiv);
        });

        // Populate team select dropdown
        const teamSelect = document.getElementById('assign-team-select');
        teamSelect.innerHTML = '<option value="">Select a team</option>';
        teamsData.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            teamSelect.appendChild(option);
        });

        // Populate region select dropdown
        const regionSelect = document.getElementById('new-team-region');
        regionSelect.innerHTML = '<option value="">Select region</option>';
        regionsData.forEach(region => {
            const option = document.createElement('option');
            option.value = region.id;
            option.textContent = region.name;
            regionSelect.appendChild(option);
        });

        // Reset wizard to step 1
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        document.querySelector('.step[data-step="1"]').classList.add('active');
        document.getElementById('prev-step').disabled = true;
        document.getElementById('next-step').textContent = 'Next';
        document.getElementById('confirm-assign').style.display = 'none';

        quickAssignModal.classList.add('show');
    }

    // Show batch message modal
    function showBatchMessageModal() {
        document.getElementById('recipients-tags').innerHTML = '';
        document.getElementById('batch-subject').value = '';
        document.getElementById('batch-content').value = '';
        document.getElementById('batch-send-copy').checked = false;

        batchMessageModal.classList.add('show');
    }

    // Setup event listeners
    function setupEventListeners() {
        // Filter changes
        filterRegion.addEventListener('change', filterAndRenderMembers);
        filterStatus.addEventListener('change', filterAndRenderMembers);
        lobbySearch.addEventListener('input', filterAndRenderMembers);
        clearFilters.addEventListener('click', () => {
            filterRegion.value = 'all';
            filterStatus.value = 'all';
            lobbySearch.value = '';
            filterAndRenderMembers();
        });

        // Pagination
        prevPage.addEventListener('click', () => {
            if (currentPageNum > 1) {
                currentPageNum--;
                renderMembersTable();
                updatePagination();
            }
        });

        nextPage.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
            if (currentPageNum < totalPages) {
                currentPageNum++;
                renderMembersTable();
                updatePagination();
            }
        });

        // Select all members
        selectAllMembers.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.member-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });

        // Message leader buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-message[data-region]')) {
                const btn = e.target.closest('.btn-message');
                const leaderId = btn.dataset.id;
                const regionId = btn.dataset.region;
                showMessageLeaderModal(leaderId, regionId);
            }
        });

        // View teams buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-view')) {
                const btn = e.target.closest('.btn-view');
                const regionId = btn.dataset.id;
                showViewTeamsModal(regionId);
            }
        });

        // Quick assign modal
        quickAssignBtn.addEventListener('click', showQuickAssignModal);

        // Batch message modal
        batchMessageBtn.addEventListener('click', showBatchMessageModal);

        // Assign selected unassigned members
        assignSelectedBtn.addEventListener('click', () => {
            const selected = Array.from(document.querySelectorAll('.unassigned-checkbox:checked')).map(cb => cb.dataset.id);
            if (selected.length === 0) {
                alert('Please select at least one member to assign');
                return;
            }
            alert(`Would assign members with IDs: ${selected.join(', ')}`);
        });

        // Export regions data
        exportRegionsBtn.addEventListener('click', () => {
            // Implement export logic
            alert('Regions data would be exported as CSV');
        });

        // Close modals
        document.getElementById('close-message-leader').addEventListener('click', () => {
            messageLeaderModal.classList.remove('show');
        });
        document.getElementById('cancel-message-leader').addEventListener('click', () => {
            messageLeaderModal.classList.remove('show');
        });
        document.getElementById('close-view-teams').addEventListener('click', () => {
            viewTeamsModal.classList.remove('show');
        });
        document.getElementById('close-view-teams-btn').addEventListener('click', () => {
            viewTeamsModal.classList.remove('show');
        });
        document.getElementById('close-quick-assign').addEventListener('click', () => {
            quickAssignModal.classList.remove('show');
        });
        document.getElementById('close-batch-message').addEventListener('click', () => {
            batchMessageModal.classList.remove('show');
        });
        document.getElementById('cancel-batch-message').addEventListener('click', () => {
            batchMessageModal.classList.remove('show');
        });

        // Quick assign wizard navigation
        document.getElementById('next-step').addEventListener('click', () => {
            const currentStep = document.querySelector('.step.active');
            const currentStepNum = parseInt(currentStep.dataset.step);
            const nextStepNum = currentStepNum + 1;

            if (nextStepNum <= 3) {
                document.querySelector('.step.active').classList.remove('active');
                document.querySelector(`.step[data-step="${nextStepNum}"]`).classList.add('active');
                document.getElementById('prev-step').disabled = false;

                if (nextStepNum === 3) {
                    document.getElementById('next-step').style.display = 'none';
                    document.getElementById('confirm-assign').style.display = 'block';
                    updateAssignSummary();
                }
            }
        });

        document.getElementById('prev-step').addEventListener('click', () => {
            const currentStep = document.querySelector('.step.active');
            const currentStepNum = parseInt(currentStep.dataset.step);
            const prevStepNum = currentStepNum - 1;

            if (prevStepNum >= 1) {
                document.querySelector('.step.active').classList.remove('active');
                document.querySelector(`.step[data-step="${prevStepNum}"]`).classList.add('active');
                document.getElementById('next-step').style.display = 'block';
                document.getElementById('confirm-assign').style.display = 'none';

                if (prevStepNum === 1) {
                    document.getElementById('prev-step').disabled = true;
                }
            }
        });

        // Assign option toggles
        document.querySelectorAll('.assign-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.assign-option').forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');

                const type = option.dataset.type;
                document.getElementById('existing-team-select').style.display =
                    type === 'existing' ? 'block' : 'none';
                document.getElementById('new-team-form').style.display =
                    type === 'new' ? 'block' : 'none';
            });
        });

        // Send message to leader
        document.getElementById('send-message-leader').addEventListener('click', (e) => {
            e.preventDefault();
            const subject = document.getElementById('message-leader-subject').value;
            const content = document.getElementById('message-leader-content').value;
            const copyTeams = document.getElementById('message-leader-copy-teams').checked;
            const leaderId = document.getElementById('message-leader-id').value;

            if (!subject || !content) {
                alert('Please fill in both subject and message content');
                return;
            }

            const region = regionsData.find(r => r.leaderId === parseInt(leaderId));
            if (!region) return;

            const messageData = {
                to: region.leader,
                region: region.name,
                subject: subject,
                content: content,
                copyTeams: copyTeams,
                timestamp: new Date().toISOString()
            };

            console.log('Message data:', messageData);
            alert(`Message sent to ${region.leader}${copyTeams ? ' and all team leaders in the region' : ''}`);
            messageLeaderModal.classList.remove('show');
        });

        // Confirm assignment
        document.getElementById('confirm-assign').addEventListener('click', () => {
            const selectedMembers = Array.from(document.querySelectorAll('.assign-member-checkbox:checked'))
                .map(cb => cb.dataset.id);

            const assignOption = document.querySelector('.assign-option.active').dataset.type;
            let teamId, teamName, regionId;

            if (assignOption === 'existing') {
                teamId = document.getElementById('assign-team-select').value;
                if (!teamId) {
                    alert('Please select a team');
                    return;
                }
                const team = teamsData.find(t => t.id === parseInt(teamId));
                teamName = team ? team.name : '';
                regionId = team ? team.regionId : null;
            } else {
                teamName = document.getElementById('new-team-name').value;
                regionId = document.getElementById('new-team-region').value;

                if (!teamName || !regionId) {
                    alert('Please fill in all fields for new team');
                    return;
                }

                // In a real app, you would create the new team here
                console.log('Creating new team:', { name: teamName, regionId: regionId });
            }

            console.log(`Assigning members ${selectedMembers.join(', ')} to ${assignOption === 'existing' ? 'team ' + teamId : 'new team ' + teamName}`);
            alert(`Members assigned successfully to ${assignOption === 'existing' ? teamName : 'new team ' + teamName}`);
            quickAssignModal.classList.remove('show');
        });

        // Send batch message
        document.getElementById('send-batch-message').addEventListener('click', (e) => {
            e.preventDefault();
            const subject = document.getElementById('batch-subject').value;
            const content = document.getElementById('batch-content').value;
            const sendCopy = document.getElementById('batch-send-copy').checked;

            if (!subject || !content) {
                alert('Please fill in both subject and message content');
                return;
            }

            const recipients = Array.from(document.querySelectorAll('.recipient-tag'))
                .map(tag => tag.textContent.trim().replace('×', ''));

            if (recipients.length === 0) {
                alert('Please add at least one recipient');
                return;
            }

            console.log('Batch message data:', {
                recipients: recipients,
                subject: subject,
                content: content,
                sendCopy: sendCopy
            });
            alert(`Message sent to ${recipients.length} recipient(s)`);
            batchMessageModal.classList.remove('show');
        });

        // Add recipients to batch message
        document.getElementById('add-members').addEventListener('click', () => {
            const selected = Array.from(document.querySelectorAll('.member-checkbox:checked'))
                .map(cb => {
                    const row = cb.closest('tr');
                    return {
                        id: cb.dataset.id,
                        name: row.querySelector('.member-name').textContent
                    };
                });

            if (selected.length === 0) {
                alert('Please select members from the table first');
                return;
            }

            const tagsContainer = document.getElementById('recipients-tags');
            selected.forEach(member => {
                if (!document.querySelector(`.recipient-tag[data-id="${member.id}"]`)) {
                    const tag = document.createElement('div');
                    tag.className = 'recipient-tag';
                    tag.dataset.id = member.id;
                    tag.innerHTML = `
                        ${member.name}
                        <button class="remove-tag">&times;</button>
                    `;
                    tagsContainer.appendChild(tag);
                }
            });
        });

        // Remove recipient tags
        document.getElementById('recipients-tags').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-tag')) {
                e.target.closest('.recipient-tag').remove();
            }
        });
    }

    // Update assign summary
    function updateAssignSummary() {
        const selectedMembers = Array.from(document.querySelectorAll('.assign-member-checkbox:checked'))
            .map(cb => {
                const memberId = cb.dataset.id;
                const member = membersData.find(m => m.id === parseInt(memberId));
                return member;
            });

        const summaryMembers = document.getElementById('summary-members');
        summaryMembers.innerHTML = '';

        selectedMembers.forEach(member => {
            const memberDiv = document.createElement('div');
            memberDiv.className = 'summary-member';
            memberDiv.innerHTML = `
                <img src="${member.photo}" alt="${member.name}" class="summary-member-avatar">
                <span>${member.name}</span>
            `;
            summaryMembers.appendChild(memberDiv);
        });

        const assignOption = document.querySelector('.assign-option.active').dataset.type;
        const summaryTeam = document.getElementById('summary-team');
        summaryTeam.innerHTML = '';

        if (assignOption === 'existing') {
            const teamId = document.getElementById('assign-team-select').value;
            const team = teamsData.find(t => t.id === parseInt(teamId));

            if (team) {
                summaryTeam.innerHTML = `
                    <i class="fas fa-user-friends"></i>
                    <h4>${team.name}</h4>
                    <p>Existing Team</p>
                `;
            }
        } else {
            const teamName = document.getElementById('new-team-name').value;
            const regionId = document.getElementById('new-team-region').value;
            const region = regionsData.find(r => r.id === parseInt(regionId));

            if (teamName && region) {
                summaryTeam.innerHTML = `
                    <i class="fas fa-plus-circle"></i>
                    <h4>${teamName}</h4>
                    <p>New Team in ${region.name}</p>
                `;
            }
        }
    }

    // Initialize the page
    initPage();
});