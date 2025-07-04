document.addEventListener('DOMContentLoaded', function() {
    // Regions data for the admin
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

    // DOM Elements
    const exportRegionsBtn = document.getElementById('export-regions');
    const messageModal = document.getElementById('message-modal');
    const closeMessageBtn = document.getElementById('close-message');
    const cancelMessageBtn = document.getElementById('cancel-message');
    const sendMessageBtn = document.getElementById('send-message');
    const messageForm = document.getElementById('message-form');
    const messageRecipient = document.getElementById('message-recipient');
    const messageLeaderId = document.getElementById('message-leader-id');

    // Initialize the page
    setupEventListeners();

    function setupEventListeners() {
        // Export regions data
        exportRegionsBtn.addEventListener('click', function() {
            const csvContent = convertRegionsToCSV(regionsData);
            downloadCSV(csvContent, 'regions_export.csv');
        });

        // View teams buttons
        document.querySelectorAll('.btn-view').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const regionId = parseInt(this.dataset.id);
                const region = regionsData.find(r => r.id === regionId);
                if (region) {
                    alert(`Viewing teams for ${region.name}\n\nThis would navigate to a teams page in a real application.`);
                }
            });
        });

        // Message leader buttons
        document.querySelectorAll('.btn-message').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const leaderId = parseInt(this.dataset.id);
                const region = regionsData.find(r => r.leaderId === leaderId);
                if (region) {
                    showMessageLeaderModal(region);
                }
            });
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
            const copyTeams = document.getElementById('message-copy-teams').checked;
            const leaderId = messageLeaderId.value;

            if (!subject || !content) {
                alert('Please fill in both subject and message content');
                return;
            }

            const region = regionsData.find(r => r.leaderId === parseInt(leaderId));
            const messageData = {
                to: region.leader,
                region: region.name,
                subject: subject,
                content: content,
                copyTeams: copyTeams,
                timestamp: new Date().toISOString()
            };

            // In a real app, you would send this to your backend
            console.log('Message data:', messageData);
            alert(`Message sent to ${region.leader}${copyTeams ? ' and all team leaders in the region' : ''}`);
            messageModal.classList.remove('show');
            messageForm.reset();
        });
    }

    // Show message leader modal
    function showMessageLeaderModal(region) {
        messageRecipient.textContent = `${region.leader} (${region.name})`;
        messageLeaderId.value = region.leaderId;
        document.getElementById('message-subject').value = '';
        document.getElementById('message-content').value = '';
        document.getElementById('message-copy-teams').checked = false;
        messageModal.classList.add('show');
    }

    // Helper function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Convert regions data to CSV
    function convertRegionsToCSV(regions) {
        const headers = ['Name', 'Description', 'Leader', 'Teams', 'Members', 'Engagement', 'Last Activity'];
        const rows = regions.map(region => [
            `"${region.name}"`,
            `"${region.description}"`,
            `"${region.leader}"`,
            region.teams,
            region.members,
            `${region.engagement}%`,
            formatDate(region.lastActivity)
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