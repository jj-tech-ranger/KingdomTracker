document.addEventListener('DOMContentLoaded', function() {
    // Teams data for the regional leader
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

    // DOM Elements
    const teamsGrid = document.querySelector('.teams-grid');
    const addTeamBtn = document.getElementById('add-team');
    const exportTeamsBtn = document.getElementById('export-teams');
    const teamModal = document.getElementById('team-modal');
    const closeTeamBtn = document.getElementById('close-team');
    const cancelTeamBtn = document.getElementById('cancel-team');
    const submitTeamBtn = document.getElementById('submit-team');

    // Messaging elements
    const messageModal = document.getElementById('message-modal');
    const closeMessageBtn = document.getElementById('close-message');
    const cancelMessageBtn = document.getElementById('cancel-message');
    const sendMessageBtn = document.getElementById('send-message');
    const messageForm = document.getElementById('message-form');
    const messageRecipient = document.getElementById('message-recipient');
    const messageLeaderId = document.getElementById('message-leader-id');

    // Initialize the page
    renderTeams(regionalTeams);

    // Add team button
    addTeamBtn.addEventListener('click', function() {
        teamModal.classList.add('show');
    });

    // Close team modal
    closeTeamBtn.addEventListener('click', function() {
        teamModal.classList.remove('show');
    });

    cancelTeamBtn.addEventListener('click', function() {
        teamModal.classList.remove('show');
    });

    // Submit team form
    submitTeamBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const name = document.getElementById('team-name').value;
        const location = document.getElementById('team-location').value;
        const leader = document.getElementById('team-leader').value;
        const description = document.getElementById('team-description').value;

        if (!name || !location || !leader) {
            alert('Please fill in all required fields');
            return;
        }

        const newTeam = {
            id: regionalTeams.length + 1,
            name: name,
            location: location,
            leader: document.getElementById('team-leader').options[document.getElementById('team-leader').selectedIndex].text,
            leaderId: parseInt(leader),
            members: 0,
            activeMembers: 0,
            lastActivity: new Date().toISOString().split('T')[0],
            photo: "../img/default_team.jpg"
        };

        regionalTeams.push(newTeam);
        renderTeams(regionalTeams);
        teamModal.classList.remove('show');
        document.getElementById('team-form').reset();

        alert('Team added successfully!');
    });

    // Export teams data
    exportTeamsBtn.addEventListener('click', function() {
        const csvContent = convertTeamsToCSV(regionalTeams);
        downloadCSV(csvContent, 'regional_teams_export.csv');
    });

    // Render teams to the DOM
    function renderTeams(teams) {
        teamsGrid.innerHTML = '';

        teams.forEach(team => {
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

        // Add event listeners to team buttons
        document.querySelectorAll('.team-actions .btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const id = parseInt(this.dataset.id);

                if (this.classList.contains('btn-view')) {
                    const team = regionalTeams.find(t => t.id === id);
                    showTeamDetails(team);
                } else if (this.classList.contains('btn-message')) {
                    const team = regionalTeams.find(t => t.leaderId === id);
                    showMessageLeaderModal(team);
                }
            });
        });
    }

    // Show team details
    function showTeamDetails(team) {
        alert(`Team Details:\n\nName: ${team.name}\nLocation: ${team.location}\nLeader: ${team.leader}\nMembers: ${team.members}\nActive Members: ${team.activeMembers}\nLast Activity: ${formatDate(team.lastActivity)}`);
    }

    // Show message leader modal
    function showMessageLeaderModal(team) {
        messageRecipient.textContent = `${team.leader} (${team.name})`;
        messageLeaderId.value = team.leaderId;
        document.getElementById('message-subject').value = '';
        document.getElementById('message-content').value = '';
        document.getElementById('message-copy-team').checked = false;
        messageModal.classList.add('show');
    }

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
        const leaderId = messageLeaderId.value;

        if (!subject || !content) {
            alert('Please fill in both subject and message content');
            return;
        }

        const team = regionalTeams.find(t => t.leaderId === parseInt(leaderId));
        const messageData = {
            to: team.leader,
            team: team.name,
            subject: subject,
            content: content,
            copyTeam: copyTeam,
            timestamp: new Date().toISOString()
        };

        // In a real app, you would send this to your backend
        console.log('Message data:', messageData);
        alert(`Message sent to ${team.leader}${copyTeam ? ` and ${team.name} team` : ''}`);
        messageModal.classList.remove('show');
        messageForm.reset();
    });

    // Helper function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Convert teams data to CSV
    function convertTeamsToCSV(teams) {
        const headers = ['Name', 'Location', 'Leader', 'Members', 'Active Members', 'Engagement', 'Last Activity'];
        const rows = teams.map(team => [
            `"${team.name}"`,
            `"${team.location}"`,
            `"${team.leader}"`,
            team.members,
            team.activeMembers,
            `${Math.round((team.activeMembers / team.members) * 100)}%`,
            formatDate(team.lastActivity)
        ]);

        return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    }

    // Download CSV file
    function downloadCSV(csvContent, fileName) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});