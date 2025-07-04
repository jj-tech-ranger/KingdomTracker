document.addEventListener('DOMContentLoaded', function() {
    // Sample prayer request data for admin
    const prayerRequests = [
        {
            id: 1,
            title: "Leadership Conference Preparation",
            region: "northern",
            description: "Pray for the upcoming regional leadership conference in the Northern Territories. We're expecting 50+ leaders.",
            requester: "Pastor Jonathan",
            date: "2023-07-10",
            status: "active",
            urgent: true,
            anonymous: false,
            updates: [
                {
                    text: "Venue has been secured and invitations sent",
                    date: "2023-07-08",
                    user: "Admin"
                }
            ]
        },
        {
            id: 2,
            title: "Financial Support Needed",
            region: "eastern",
            description: "Several churches in Eastern Provinces need financial support for building repairs after storms.",
            requester: "Elder Sarah",
            date: "2023-07-08",
            status: "active",
            urgent: false,
            anonymous: false,
            updates: []
        },
        {
            id: 3,
            title: "Missionary Safety",
            region: "western",
            description: "Pray for missionary safety in the Western Zones where political tensions are rising.",
            requester: "Anonymous",
            date: "2023-07-05",
            status: "active",
            urgent: true,
            anonymous: true,
            updates: []
        },
        {
            id: 4,
            title: "Youth Revival",
            region: "southern",
            description: "Pray for the youth revival movement spreading through Southern Districts.",
            requester: "Minister David",
            date: "2023-07-03",
            status: "active",
            urgent: false,
            anonymous: false,
            updates: [
                {
                    text: "Over 200 youth attended last week's event",
                    date: "2023-07-06",
                    user: "Admin"
                }
            ]
        },
        {
            id: 5,
            title: "New Church Plant",
            region: "central",
            description: "Pray for wisdom as we plan a new church plant in Central Valleys urban area.",
            requester: "Bishop Thomas",
            date: "2023-06-30",
            status: "active",
            urgent: false,
            anonymous: false,
            updates: []
        },
        {
            id: 6,
            title: "Pastoral Health",
            region: "northern",
            description: "Pray for Pastor Mark's recovery from illness in Northern Territories.",
            requester: "Anonymous",
            date: "2023-06-28",
            status: "answered",
            urgent: false,
            anonymous: true,
            updates: [
                {
                    text: "Pastor Mark has improved significantly",
                    date: "2023-07-02",
                    user: "Admin"
                },
                {
                    text: "Praise report! Pastor Mark has fully recovered!",
                    date: "2023-07-09",
                    user: "Admin"
                }
            ]
        }
    ];

    // DOM Elements
    const prayerGrid = document.getElementById('prayer-grid');
    const emptyState = document.getElementById('empty-state');
    const addPrayerBtn = document.getElementById('add-prayer');
    const addEmptyBtn = document.getElementById('add-empty');
    const prayerModal = document.getElementById('prayer-modal');
    const closePrayerBtn = document.getElementById('close-prayer');
    const cancelPrayerBtn = document.getElementById('cancel-prayer');
    const submitPrayerBtn = document.getElementById('submit-prayer');
    const prayerForm = document.getElementById('prayer-form');
    const detailsModal = document.getElementById('details-modal');
    const closeDetailsBtn = document.getElementById('close-details');
    const updateForm = document.getElementById('update-form');
    const filterStatus = document.getElementById('filter-status');
    const sortBy = document.getElementById('sort-by');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const exportPrayerBtn = document.getElementById('export-prayer');

    // Analytics elements
    const totalRequestsEl = document.getElementById('total-requests');
    const answeredRequestsEl = document.getElementById('answered-requests');
    const urgentRequestsEl = document.getElementById('urgent-requests');
    const activeRequestsEl = document.getElementById('active-requests');
    let prayerChart;

    // Initialize the page
    renderPrayerRequests(prayerRequests);
    updateEmptyState();
    updateAnalytics();
    initChart();

    // Event Listeners
    addPrayerBtn.addEventListener('click', () => prayerModal.classList.add('show'));
    addEmptyBtn.addEventListener('click', () => prayerModal.classList.add('show'));
    closePrayerBtn.addEventListener('click', () => prayerModal.classList.remove('show'));
    cancelPrayerBtn.addEventListener('click', () => prayerModal.classList.remove('show'));
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

    exportPrayerBtn.addEventListener('click', exportPrayerData);

    // Submit new prayer request
    submitPrayerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const title = document.getElementById('prayer-title').value;
        const region = document.getElementById('prayer-region').value;
        const description = document.getElementById('prayer-description').value;
        const requester = document.getElementById('prayer-requester').value || 'Anonymous';
        const urgent = document.getElementById('prayer-urgent').checked;
        const anonymous = document.getElementById('prayer-anonymous').checked;

        if (!title || !region || !description) {
            alert('Please fill in all required fields');
            return;
        }

        const newRequest = {
            id: prayerRequests.length + 1,
            title: title,
            region: region,
            description: description,
            requester: anonymous ? 'Anonymous' : requester,
            date: new Date().toISOString().split('T')[0],
            status: 'active',
            urgent: urgent,
            anonymous: anonymous,
            updates: []
        };

        prayerRequests.unshift(newRequest);
        renderPrayerRequests(prayerRequests);
        updateEmptyState();
        updateAnalytics();
        updateChart();
        prayerModal.classList.remove('show');
        prayerForm.reset();
    });

    // Submit prayer update
    updateForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const updateText = document.getElementById('update-text').value;
        const markAnswered = document.getElementById('mark-answered').checked;
        const requestId = parseInt(this.dataset.requestId);

        if (!updateText) {
            alert('Please enter an update');
            return;
        }

        const request = prayerRequests.find(req => req.id === requestId);
        if (request) {
            request.updates.push({
                text: updateText,
                date: new Date().toISOString().split('T')[0],
                user: 'Admin'
            });

            if (markAnswered) {
                request.status = 'answered';
            }

            renderPrayerRequests(prayerRequests);
            updateAnalytics();
            updateChart();
            document.getElementById('update-text').value = '';
            document.getElementById('mark-answered').checked = false;
            loadRequestDetails(requestId);
        }
    });

    // Render prayer requests
    function renderPrayerRequests(requests) {
        prayerGrid.innerHTML = '';

        const activeFilter = document.querySelector('.tab-btn.active').dataset.filter;
        const statusFilter = filterStatus.value;

        let filteredRequests = [...requests];

        // Filter by region
        if (activeFilter !== 'all') {
            filteredRequests = filteredRequests.filter(req => req.region === activeFilter);
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filteredRequests = filteredRequests.filter(req => req.status === statusFilter ||
                (statusFilter === 'urgent' && req.urgent));
        }

        // Sort requests
        const sortValue = sortBy.value;
        switch (sortValue) {
            case 'newest':
                filteredRequests.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                filteredRequests.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'region':
                filteredRequests.sort((a, b) => a.region.localeCompare(b.region));
                break;
        }

        if (filteredRequests.length === 0) {
            emptyState.style.display = 'flex';
            prayerGrid.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        prayerGrid.style.display = 'grid';

        filteredRequests.forEach(request => {
            const prayerCard = document.createElement('div');
            prayerCard.className = `prayer-card ${request.status} ${request.urgent ? 'urgent' : ''}`;
            prayerCard.dataset.id = request.id;

            prayerCard.innerHTML = `
                <div class="prayer-header">
                    <h3 class="prayer-title">${request.title}</h3>
                    <span class="prayer-status ${request.status}">${request.status}</span>
                </div>
                <div class="prayer-meta">
                    <span class="prayer-region">${getRegionName(request.region)}</span>
                    <span class="prayer-date">${formatDate(request.date)}</span>
                </div>
                <p class="prayer-description">${request.description}</p>
                ${request.anonymous ? '' : `<div class="prayer-requester"><i class="fas fa-user"></i> Requested by: ${request.requester}</div>`}
                <div class="prayer-actions">
                    <button class="btn btn-view" data-id="${request.id}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    ${request.status === 'answered' ? '' : `<button class="btn btn-primary" data-id="${request.id}">
                        <i class="fas fa-pray"></i> Pray Now
                    </button>`}
                </div>
            `;

            prayerGrid.appendChild(prayerCard);
        });

        // Add event listeners to prayer cards
        document.querySelectorAll('.btn-view').forEach(button => {
            button.addEventListener('click', function() {
                const requestId = parseInt(this.dataset.id);
                loadRequestDetails(requestId);
                detailsModal.classList.add('show');
            });
        });

        document.querySelectorAll('.btn-primary').forEach(button => {
            button.addEventListener('click', function() {
                const requestId = parseInt(this.dataset.id);
                alert(`Praying for request #${requestId}`);
                // In a real app, this might track prayer activity
            });
        });
    }

    // Load request details into modal
    function loadRequestDetails(requestId) {
        const request = prayerRequests.find(req => req.id === requestId);
        if (!request) return;

        document.getElementById('detail-region').textContent = getRegionName(request.region);
        document.getElementById('detail-date').textContent = formatDate(request.date);
        document.getElementById('detail-title').textContent = request.title;
        document.getElementById('detail-description').textContent = request.description;

        const statusEl = document.getElementById('detail-status');
        statusEl.textContent = request.status;
        statusEl.className = `prayer-status ${request.status}`;

        const requesterEl = document.getElementById('detail-requester');
        if (request.anonymous) {
            requesterEl.style.display = 'none';
        } else {
            requesterEl.style.display = 'block';
            requesterEl.querySelector('span').textContent = request.requester;
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

        // Set request ID on form
        updateForm.dataset.requestId = requestId;
    }

    // Filter and sort requests
    function filterAndSortRequests() {
        renderPrayerRequests(prayerRequests);
    }

    // Update empty state
    function updateEmptyState() {
        if (prayerRequests.length === 0) {
            emptyState.style.display = 'flex';
            prayerGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            prayerGrid.style.display = 'grid';
        }
    }

    // Update analytics
    function updateAnalytics() {
        totalRequestsEl.textContent = prayerRequests.length;
        answeredRequestsEl.textContent = prayerRequests.filter(req => req.status === 'answered').length;
        urgentRequestsEl.textContent = prayerRequests.filter(req => req.urgent).length;
        activeRequestsEl.textContent = prayerRequests.filter(req => req.status === 'active').length;
    }

    // Initialize chart
    function initChart() {
        const ctx = document.getElementById('prayer-chart').getContext('2d');

        const regionData = {
            northern: prayerRequests.filter(req => req.region === 'northern').length,
            eastern: prayerRequests.filter(req => req.region === 'eastern').length,
            southern: prayerRequests.filter(req => req.region === 'southern').length,
            western: prayerRequests.filter(req => req.region === 'western').length,
            central: prayerRequests.filter(req => req.region === 'central').length
        };

        prayerChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Northern', 'Eastern', 'Southern', 'Western', 'Central'],
                datasets: [{
                    label: 'Prayer Requests',
                    data: [
                        regionData.northern,
                        regionData.eastern,
                        regionData.southern,
                        regionData.western,
                        regionData.central
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
        const regionData = {
            northern: prayerRequests.filter(req => req.region === 'northern').length,
            eastern: prayerRequests.filter(req => req.region === 'eastern').length,
            southern: prayerRequests.filter(req => req.region === 'southern').length,
            western: prayerRequests.filter(req => req.region === 'western').length,
            central: prayerRequests.filter(req => req.region === 'central').length
        };

        prayerChart.data.datasets[0].data = [
            regionData.northern,
            regionData.eastern,
            regionData.southern,
            regionData.western,
            regionData.central
        ];

        prayerChart.update();
    }

    // Export prayer data
    function exportPrayerData() {
        const headers = ['ID', 'Title', 'Region', 'Status', 'Urgent', 'Requester', 'Date', 'Description'];
        const rows = prayerRequests.map(request => [
            request.id,
            `"${request.title}"`,
            `"${getRegionName(request.region)}"`,
            request.status,
            request.urgent ? 'Yes' : 'No',
            request.anonymous ? 'Anonymous' : `"${request.requester}"`,
            request.date,
            `"${request.description.replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
        downloadCSV(csvContent, 'prayer_requests_export.csv');
    }

    // Helper functions
    function getRegionName(regionId) {
        const regions = {
            northern: 'Northern Territories',
            eastern: 'Eastern Provinces',
            southern: 'Southern Districts',
            western: 'Western Zones',
            central: 'Central Valleys',
            all: 'All Regions'
        };
        return regions[regionId] || regionId;
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