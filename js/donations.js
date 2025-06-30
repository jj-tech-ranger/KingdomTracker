document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    let currentTab = 'donations';

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            currentTab = tabId;

            // Update active tab
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            // Refresh the current tab
            refreshCurrentTab();
        });
    });

    // Initialize data and pagination
    const itemsPerPage = 5;
    const donationsData = generateSampleData('donations', 15);
    const titheData = generateSampleData('tithe', 15);
    const offeringsData = generateSampleData('offerings', 15);

    const currentPages = {
        donations: 1,
        tithe: 1,
        offerings: 1
    };

    // Modal functionality
    const donationModal = document.getElementById('donationModal');
    const titheModal = document.getElementById('titheModal');
    const offeringModal = document.getElementById('offeringModal');
    const addDonationBtn = document.getElementById('addDonationBtn');
    const addTitheBtn = document.getElementById('addTitheBtn');
    const addOfferingBtn = document.getElementById('addOfferingBtn');
    const closeBtns = document.querySelectorAll('.close-btn');

    // Initialize modals
    if (addDonationBtn) addDonationBtn.addEventListener('click', () => donationModal.style.display = 'block');
    if (addTitheBtn) addTitheBtn.addEventListener('click', () => titheModal.style.display = 'block');
    if (addOfferingBtn) addOfferingBtn.addEventListener('click', () => offeringModal.style.display = 'block');

    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Form submissions
    document.getElementById('donationForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewDonation();
        this.reset();
        donationModal.style.display = 'none';
    });

    document.getElementById('titheForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewTithe();
        this.reset();
        titheModal.style.display = 'none';
    });

    document.getElementById('offeringForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewOffering();
        this.reset();
        offeringModal.style.display = 'none';
    });

    // Pagination controls
    setupPagination('donations');
    setupPagination('tithe');
    setupPagination('offerings');

    // Initialize charts
    initCharts();

    // Initial render
    renderDonationsTable();
    renderTitheTable();
    renderOfferingsTable();
    loadThemePreference();

    // Helper functions
    function generateSampleData(type, count) {
        const data = [];
        const types = {
            donations: ['General Donation', 'Sponsorship', 'Memorial'],
            tithe: ['Regular Tithe', 'First Fruit', 'Special Tithe'],
            offerings: ['Sunday Service', 'Wednesday Service', 'Special Service']
        };

        const paymentMethods = ['Cash', 'Check', 'Online'];
        const purposes = ['Building Fund', 'Missions', 'General Fund'];

        const today = new Date();

        for (let i = 1; i <= count; i++) {
            const randomDays = Math.floor(Math.random() * 60);
            const date = new Date();
            date.setDate(today.getDate() - randomDays);

            const formattedDate = date.toISOString().split('T')[0];
            const amount = (Math.random() * 1000 + 10).toFixed(2);
            const refNumber = `${type.toUpperCase().substr(0, 3)}-${date.getFullYear()}-${1000 + i}`;

            if (type === 'donations') {
                data.push({
                    id: i,
                    donorName: `Donor ${i}`,
                    type: types.donations[Math.floor(Math.random() * types.donations.length)],
                    amount: amount,
                    date: formattedDate,
                    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
                    purpose: purposes[Math.floor(Math.random() * purposes.length)],
                    reference: refNumber
                });
            } else if (type === 'tithe') {
                data.push({
                    id: i,
                    memberName: `Member ${i}`,
                    amount: amount,
                    date: formattedDate,
                    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
                    reference: refNumber
                });
            } else if (type === 'offerings') {
                data.push({
                    id: i,
                    memberName: `Member ${i}`,
                    amount: amount,
                    date: formattedDate,
                    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
                    service: types.offerings[Math.floor(Math.random() * types.offerings.length)],
                    reference: refNumber
                });
            }
        }

        return data;
    }

    function renderDonationsTable() {
        const tableBody = document.getElementById('donationsTableBody');
        const paginationInfo = document.getElementById('donationsPaginationInfo');
        const pageNumbers = document.getElementById('donationsPageNumbers');
        const prevBtn = document.getElementById('donationsPrevPage');
        const nextBtn = document.getElementById('donationsNextPage');

        const totalPages = Math.ceil(donationsData.length / itemsPerPage);
        const startIndex = (currentPages.donations - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, donationsData.length);
        const currentItems = donationsData.slice(startIndex, endIndex);

        tableBody.innerHTML = '';

        currentItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.donorName}</td>
                <td>${item.type}</td>
                <td>$${item.amount}</td>
                <td>${item.date}</td>
                <td>${item.paymentMethod}</td>
                <td>${item.purpose}</td>
                <td>${item.reference}</td>
                <td>
                    <button class="action-btn edit" title="Edit" data-id="${item.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn receipt" title="Generate Receipt" data-id="${item.id}">
                        <i class="fas fa-receipt"></i>
                    </button>
                    <button class="action-btn thank" title="Send Thank You" data-id="${item.id}">
                        <i class="fas fa-envelope"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        paginationInfo.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${donationsData.length} entries`;
        prevBtn.disabled = currentPages.donations === 1;
        nextBtn.disabled = currentPages.donations === totalPages;

        renderPageNumbers('donations', pageNumbers, totalPages);
    }

    function renderTitheTable() {
        const tableBody = document.getElementById('titheTableBody');
        const paginationInfo = document.getElementById('tithePaginationInfo');
        const pageNumbers = document.getElementById('tithePageNumbers');
        const prevBtn = document.getElementById('tithePrevPage');
        const nextBtn = document.getElementById('titheNextPage');

        const totalPages = Math.ceil(titheData.length / itemsPerPage);
        const startIndex = (currentPages.tithe - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, titheData.length);
        const currentItems = titheData.slice(startIndex, endIndex);

        tableBody.innerHTML = '';

        currentItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.memberName}</td>
                <td>$${item.amount}</td>
                <td>${item.date}</td>
                <td>${item.paymentMethod}</td>
                <td>${item.reference}</td>
                <td>
                    <button class="action-btn edit" title="Edit" data-id="${item.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn receipt" title="Generate Receipt" data-id="${item.id}">
                        <i class="fas fa-receipt"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        paginationInfo.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${titheData.length} entries`;
        prevBtn.disabled = currentPages.tithe === 1;
        nextBtn.disabled = currentPages.tithe === totalPages;

        renderPageNumbers('tithe', pageNumbers, totalPages);
    }

    function renderOfferingsTable() {
        const tableBody = document.getElementById('offeringsTableBody');
        const paginationInfo = document.getElementById('offeringsPaginationInfo');
        const pageNumbers = document.getElementById('offeringsPageNumbers');
        const prevBtn = document.getElementById('offeringsPrevPage');
        const nextBtn = document.getElementById('offeringsNextPage');

        const totalPages = Math.ceil(offeringsData.length / itemsPerPage);
        const startIndex = (currentPages.offerings - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, offeringsData.length);
        const currentItems = offeringsData.slice(startIndex, endIndex);

        tableBody.innerHTML = '';

        currentItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.memberName}</td>
                <td>$${item.amount}</td>
                <td>${item.date}</td>
                <td>${item.paymentMethod}</td>
                <td>${item.service}</td>
                <td>${item.reference}</td>
                <td>
                    <button class="action-btn edit" title="Edit" data-id="${item.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn receipt" title="Generate Receipt" data-id="${item.id}">
                        <i class="fas fa-receipt"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        paginationInfo.textContent = `Showing ${startIndex + 1} to ${endIndex} of ${offeringsData.length} entries`;
        prevBtn.disabled = currentPages.offerings === 1;
        nextBtn.disabled = currentPages.offerings === totalPages;

        renderPageNumbers('offerings', pageNumbers, totalPages);
    }

    function renderPageNumbers(tab, container, totalPages) {
        container.innerHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `page-number ${i === currentPages[tab] ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPages[tab] = i;
                if (tab === 'donations') renderDonationsTable();
                else if (tab === 'tithe') renderTitheTable();
                else if (tab === 'offerings') renderOfferingsTable();
            });
            container.appendChild(pageBtn);
        }
    }

    function setupPagination(tab) {
        const prevBtn = document.getElementById(`${tab}PrevPage`);
        const nextBtn = document.getElementById(`${tab}NextPage`);

        prevBtn?.addEventListener('click', () => {
            if (currentPages[tab] > 1) {
                currentPages[tab]--;
                if (tab === 'donations') renderDonationsTable();
                else if (tab === 'tithe') renderTitheTable();
                else if (tab === 'offerings') renderOfferingsTable();
            }
        });

        nextBtn?.addEventListener('click', () => {
            const totalPages = Math.ceil(
                tab === 'donations' ? donationsData.length :
                tab === 'tithe' ? titheData.length :
                offeringsData.length / itemsPerPage
            );

            if (currentPages[tab] < totalPages) {
                currentPages[tab]++;
                if (tab === 'donations') renderDonationsTable();
                else if (tab === 'tithe') renderTitheTable();
                else if (tab === 'offerings') renderOfferingsTable();
            }
        });
    }

    function addNewDonation() {
        const form = document.getElementById('donationForm');
        const today = new Date().toISOString().split('T')[0];

        const newDonation = {
            id: donationsData.length + 1,
            donorName: form.donorName.value,
            type: form.donationType.options[form.donationType.selectedIndex].text,
            amount: parseFloat(form.donationAmount.value).toFixed(2),
            date: form.donationDate.value || today,
            paymentMethod: form.paymentMethod.options[form.paymentMethod.selectedIndex].text,
            purpose: form.donationPurpose.value || 'General Fund',
            reference: `DON-${new Date().getFullYear()}-${1000 + donationsData.length + 1}`
        };

        donationsData.unshift(newDonation);
        currentPages.donations = 1;
        renderDonationsTable();
        updateCharts();
    }

    function addNewTithe() {
        const form = document.getElementById('titheForm');
        const today = new Date().toISOString().split('T')[0];

        const newTithe = {
            id: titheData.length + 1,
            memberName: form.memberName.value,
            amount: parseFloat(form.titheAmount.value).toFixed(2),
            date: form.titheDate.value || today,
            paymentMethod: form.tithePaymentMethod.options[form.tithePaymentMethod.selectedIndex].text,
            reference: form.titheReference.value || `TIT-${new Date().getFullYear()}-${1000 + titheData.length + 1}`
        };

        titheData.unshift(newTithe);
        currentPages.tithe = 1;
        renderTitheTable();
        updateCharts();
    }

    function addNewOffering() {
        const form = document.getElementById('offeringForm');
        const today = new Date().toISOString().split('T')[0];

        const newOffering = {
            id: offeringsData.length + 1,
            memberName: form.offeringMemberName.value,
            amount: parseFloat(form.offeringAmount.value).toFixed(2),
            date: form.offeringDate.value || today,
            paymentMethod: form.offeringPaymentMethod.options[form.offeringPaymentMethod.selectedIndex].text,
            service: form.offeringService.options[form.offeringService.selectedIndex].text,
            reference: `OFF-${new Date().getFullYear()}-${1000 + offeringsData.length + 1}`
        };

        offeringsData.unshift(newOffering);
        currentPages.offerings = 1;
        renderOfferingsTable();
        updateCharts();
    }

    function refreshCurrentTab() {
        switch(currentTab) {
            case 'donations': renderDonationsTable(); break;
            case 'tithe': renderTitheTable(); break;
            case 'offerings': renderOfferingsTable(); break;
        }
    }

    function initCharts() {
        // Monthly Contributions Chart
        const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
        window.monthlyChart = new Chart(monthlyCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Donations',
                    data: [2500, 3200, 2800, 4100, 3600, 2900, 3800, 4200, 3900, 4500, 5100, 4800],
                    backgroundColor: 'rgba(40, 167, 69, 0.7)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1
                }, {
                    label: 'Tithe',
                    data: [5200, 4800, 5100, 4900, 5500, 5800, 6200, 5900, 6100, 6500, 6800, 7200],
                    backgroundColor: 'rgba(23, 162, 184, 0.7)',
                    borderColor: 'rgba(23, 162, 184, 1)',
                    borderWidth: 1
                }, {
                    label: 'Offerings',
                    data: [1800, 2100, 1900, 2200, 2400, 2300, 2500, 2600, 2800, 2900, 3100, 3300],
                    backgroundColor: 'rgba(255, 193, 7, 0.7)',
                    borderColor: 'rgba(255, 193, 7, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return `$${value.toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        });

        // Contribution Types Chart
        const typesCtx = document.getElementById('typesChart').getContext('2d');
        window.typesChart = new Chart(typesCtx, {
            type: 'doughnut',
            data: {
                labels: ['General Donations', 'Tithe', 'Offerings', 'Sponsorships', 'Memorials'],
                datasets: [{
                    data: [35, 40, 15, 7, 3],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.7)',
                        'rgba(23, 162, 184, 0.7)',
                        'rgba(255, 193, 7, 0.7)',
                        'rgba(220, 53, 69, 0.7)',
                        'rgba(108, 117, 125, 0.7)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'right' },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((context.raw / total) * 100);
                                return `${context.label}: $${context.raw.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    function updateCharts() {
        // In a real app, update chart data based on new entries
        console.log('Updating charts with new data');
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    }

    function loadThemePreference() {
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }
});