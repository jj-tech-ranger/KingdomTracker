document.addEventListener('DOMContentLoaded', function() {
    // Sample food bank request data
    const bankRequests = [
        {
            id: 1,
            name: "Maria Gonzalez",
            team: "northside",
            familySize: 4,
            requestDate: "2023-07-10",
            pickupDate: "2023-07-15",
            contact: "(555) 123-4567",
            status: "approved",
            notes: "Requesting basic staples and fresh produce if available.",
            denialReason: "",
            updates: [
                {
                    text: "Request approved by Food Bank Manager",
                    date: "2023-07-10",
                    user: "Manager Smith"
                },
                {
                    text: "Pickup scheduled for July 15 at 2pm",
                    date: "2023-07-11",
                    user: "Manager Smith"
                }
            ]
        },
        {
            id: 2,
            name: "James Wilson",
            team: "rivervalley",
            familySize: 3,
            requestDate: "2023-07-08",
            pickupDate: "",
            contact: "(555) 987-6543",
            status: "pending",
            notes: "Recently lost job, needs temporary assistance.",
            denialReason: "",
            updates: [
                {
                    text: "Application received and under review",
                    date: "2023-07-08",
                    user: "Manager Smith"
                }
            ]
        },
        {
            id: 3,
            name: "Anonymous",
            team: "mountainview",
            familySize: 2,
            requestDate: "2023-07-05",
            pickupDate: "",
            contact: "(555) 456-7890",
            status: "denied",
            notes: "Request for monthly assistance",
            denialReason: "Already received assistance this month",
            updates: [
                {
                    text: "Application reviewed",
                    date: "2023-07-06",
                    user: "Manager Smith"
                },
                {
                    text: "Request denied - already received assistance this month",
                    date: "2023-07-07",
                    user: "Manager Smith"
                }
            ]
        },
        {
            id: 4,
            name: "Sarah Johnson",
            team: "lakeside",
            familySize: 5,
            requestDate: "2023-07-03",
            pickupDate: "2023-07-10",
            contact: "(555) 789-0123",
            status: "distributed",
            notes: "Large family in need of extra portions",
            denialReason: "",
            updates: [
                {
                    text: "Request approved",
                    date: "2023-07-03",
                    user: "Manager Smith"
                },
                {
                    text: "Pickup scheduled for July 10",
                    date: "2023-07-04",
                    user: "Manager Smith"
                },
                {
                    text: "Food package distributed",
                    date: "2023-07-10",
                    user: "Volunteer Davis"
                }
            ]
        },
        {
            id: 5,
            name: "Robert Chen",
            team: "centralcity",
            familySize: 1,
            requestDate: "2023-06-30",
            pickupDate: "2023-07-05",
            contact: "(555) 234-5678",
            status: "scheduled",
            notes: "Elderly individual needing easy-to-prepare meals",
            denialReason: "",
            updates: [
                {
                    text: "Request approved",
                    date: "2023-06-30",
                    user: "Manager Smith"
                },
                {
                    text: "Special meals prepared for elderly needs",
                    date: "2023-07-02",
                    user: "Volunteer Davis"
                },
                {
                    text: "Pickup scheduled for July 5 at 11am",
                    date: "2023-07-03",
                    user: "Manager Smith"
                }
            ]
        }
    ];

    // DOM Elements
    const bankGrid = document.getElementById('bank-grid');
    const emptyState = document.getElementById('empty-state');
    const detailsModal = document.getElementById('details-modal');
    const closeDetailsBtn = document.getElementById('close-details');
    const filterStatus = document.getElementById('filter-status');
    const sortBy = document.getElementById('sort-by');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const exportBankBtn = document.getElementById('export-bank');

    // Analytics elements
    const totalRequestsEl = document.getElementById('total-requests');
    const approvedRequestsEl = document.getElementById('approved-requests');
    const deniedRequestsEl = document.getElementById('denied-requests');
    const distributedRequestsEl = document.getElementById('distributed-requests');
    let bankChart;

    // Initialize the page
    renderBankRequests(bankRequests);
    updateEmptyState();
    updateAnalytics();
    initChart();

    // Event Listeners
    closeDetailsBtn.addEventListener('click', () => detailsModal.classList.remove('show'));

    filterStatus.addEventListener('change', filterAndSortRequests);
    sortBy.addEventListener('change', filterAndSortRequests);

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterAndSortRequests();
        });
    });

    exportBankBtn.addEventListener('click', exportBankData);

    // Render bank requests
    function renderBankRequests(requests) {
        bankGrid.innerHTML = '';

        const activeFilter = document.querySelector('.tab-btn.active').dataset.filter;
        const statusFilter = filterStatus.value;

        let filteredRequests = [...requests];

        // Filter by team
        if (activeFilter !== 'all') {
            filteredRequests = filteredRequests.filter(req => req.team === activeFilter);
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filteredRequests = filteredRequests.filter(req => req.status === statusFilter);
        }

        // Sort requests
        const sortValue = sortBy.value;
        switch (sortValue) {
            case 'newest':
                filteredRequests.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
                break;
            case 'oldest':
                filteredRequests.sort((a, b) => new Date(a.requestDate) - new Date(b.requestDate));
                break;
            case 'team':
                filteredRequests.sort((a, b) => a.team.localeCompare(b.team));
                break;
        }

        if (filteredRequests.length === 0) {
            emptyState.style.display = 'flex';
            bankGrid.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        bankGrid.style.display = 'grid';

        filteredRequests.forEach(request => {
            const bankCard = document.createElement('div');
            bankCard.className = `bank-card ${request.status}`;
            bankCard.dataset.id = request.id;

            bankCard.innerHTML = `
                <div class="bank-header">
                    <h3 class="bank-name">${request.name}</h3>
                    <span class="bank-status ${request.status}">${request.status}</span>
                </div>
                <div class="bank-meta">
                    <span class="bank-team">${getTeamName(request.team)}</span>
                    <span class="bank-date">${formatDate(request.requestDate)}</span>
                </div>
                <div class="bank-info">
                    <div class="info-row">
                        <span class="info-label">Family Size:</span>
                        <span class="info-value">${request.familySize}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Contact:</span>
                        <span class="info-value">${request.contact}</span>
                    </div>
                </div>
                <div class="bank-actions">
                    <button class="btn btn-view" data-id="${request.id}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            `;

            bankGrid.appendChild(bankCard);
        });

        // Add event listeners to bank cards
        document.querySelectorAll('.btn-view').forEach(button => {
            button.addEventListener('click', function() {
                const requestId = parseInt(this.dataset.id);
                loadRequestDetails(requestId);
                detailsModal.classList.add('show');
            });
        });
    }

    // Load request details into modal
    function loadRequestDetails(requestId) {
        const request = bankRequests.find(req => req.id === requestId);
        if (!request) return;

        document.getElementById('detail-team').textContent = getTeamName(request.team);
        document.getElementById('detail-date').textContent = formatDate(request.requestDate);
        document.getElementById('detail-name').textContent = request.name;
        document.getElementById('detail-family-size').textContent = request.familySize;
        document.getElementById('detail-request-date').textContent = formatDate(request.requestDate);
        document.getElementById('detail-pickup-date').textContent = request.pickupDate ? formatDate(request.pickupDate) : "Not scheduled";
        document.getElementById('detail-contact').textContent = request.contact;
        document.getElementById('detail-notes').textContent = request.notes || "No additional notes provided.";

        const statusEl = document.getElementById('detail-status');
        statusEl.textContent = request.status;
        statusEl.className = `bank-status ${request.status}`;

        // Show/hide denial reason
        const denialContainer = document.getElementById('denial-reason-container');
        const denialReasonEl = document.getElementById('detail-denial-reason');
        if (request.status === 'denied' && request.denialReason) {
            denialContainer.style.display = 'block';
            denialReasonEl.textContent = request.denialReason;
        } else {
            denialContainer.style.display = 'none';
        }

        // Load updates
        const updatesList = document.getElementById('updates-list');
        updatesList.innerHTML = '';

        if (request.updates.length === 0) {
            updatesList.innerHTML = '<p class="empty-updates">No updates yet</p>';
        } else {
            request.updates.forEach(update => {
                const updateItem = document.createElement('div');
                updateItem.className = 'update-item';
                updateItem.innerHTML = `
                    <p class="update-text">${update.text}</p>
                    <div class="update-meta">
                        <span>${update.user}</span>
                        <span>${formatDate(update.date)}</span>
                    </div>
                `;
                updatesList.appendChild(updateItem);
            });
        }
    }

    // Filter and sort requests
    function filterAndSortRequests() {
        renderBankRequests(bankRequests);
    }

    // Update empty state
    function updateEmptyState() {
        if (bankRequests.length === 0) {
            emptyState.style.display = 'flex';
            bankGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            bankGrid.style.display = 'grid';
        }
    }

    // Update analytics
    function updateAnalytics() {
        totalRequestsEl.textContent = bankRequests.length;
        approvedRequestsEl.textContent = bankRequests.filter(req => req.status === 'approved').length;
        deniedRequestsEl.textContent = bankRequests.filter(req => req.status === 'denied').length;
        distributedRequestsEl.textContent = bankRequests.filter(req => req.status === 'distributed').length;
    }

    // Initialize chart
    function initChart() {
        const ctx = document.getElementById('bank-chart').getContext('2d');

        const teamData = {
            northside: bankRequests.filter(req => req.team === 'northside').length,
            rivervalley: bankRequests.filter(req => req.team === 'rivervalley').length,
            mountainview: bankRequests.filter(req => req.team === 'mountainview').length,
            lakeside: bankRequests.filter(req => req.team === 'lakeside').length,
            centralcity: bankRequests.filter(req => req.team === 'centralcity').length
        };

        bankChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Northside', 'River Valley', 'Mountain View', 'Lakeside', 'Central City'],
                datasets: [{
                    label: 'Food Bank Requests',
                    data: [
                        teamData.northside,
                        teamData.rivervalley,
                        teamData.mountainview,
                        teamData.lakeside,
                        teamData.centralcity
                    ],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(255, 159, 64, 0.7)',
                        'rgba(153, 102, 255, 0.7)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Update chart data
    function updateChart() {
        const teamData = {
            northside: bankRequests.filter(req => req.team === 'northside').length,
            rivervalley: bankRequests.filter(req => req.team === 'rivervalley').length,
            mountainview: bankRequests.filter(req => req.team === 'mountainview').length,
            lakeside: bankRequests.filter(req => req.team === 'lakeside').length,
            centralcity: bankRequests.filter(req => req.team === 'centralcity').length
        };

        bankChart.data.datasets[0].data = [
            teamData.northside,
            teamData.rivervalley,
            teamData.mountainview,
            teamData.lakeside,
            teamData.centralcity
        ];

        bankChart.update();
    }

    // Export bank data
    function exportBankData() {
        const headers = ['ID', 'Name', 'Team', 'Status', 'Family Size', 'Request Date', 'Pickup Date', 'Contact', 'Notes', 'Denial Reason'];
        const rows = bankRequests.map(request => [
            request.id,
            `"${request.name}"`,
            `"${getTeamName(request.team)}"`,
            request.status,
            request.familySize,
            request.requestDate,
            request.pickupDate || '',
            `"${request.contact}"`,
            `"${request.notes.replace(/"/g, '""')}"`,
            `"${request.denialReason.replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        downloadCSV(csvContent, 'food_bank_requests_export.csv');
    }

    // Helper functions
    function getTeamName(teamId) {
        const teams = {
            northside: 'Northside Team',
            rivervalley: 'River Valley',
            mountainview: 'Mountain View',
            lakeside: 'Lakeside',
            centralcity: 'Central City',
            all: 'All Teams'
        };
        return teams[teamId] || teamId;
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

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