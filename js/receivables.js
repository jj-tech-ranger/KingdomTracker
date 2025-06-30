document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle (inherited from finance.js)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Initialize charts
    initAgingReceivablesChart();
    initAgingPayablesChart();

    // Modal functionality
    const receivableModal = document.getElementById('receivableModal');
    const payableModal = document.getElementById('payableModal');
    const addReceivableBtn = document.getElementById('addReceivableBtn');
    const addPayableBtn = document.getElementById('addPayableBtn');
    const closeBtns = document.querySelectorAll('.close-btn');

    if (addReceivableBtn) {
        addReceivableBtn.addEventListener('click', function() {
            receivableModal.style.display = 'block';
        });
    }

    if (addPayableBtn) {
        addPayableBtn.addEventListener('click', function() {
            payableModal.style.display = 'block';
        });
    }

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
    document.getElementById('receivableForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Receivable added successfully!');
        this.reset();
        receivableModal.style.display = 'none';
        // In a real app, you would add the receivable to the table here
    });

    document.getElementById('payableForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Payable added successfully!');
        this.reset();
        payableModal.style.display = 'none';
        // In a real app, you would add the payable to the table here
    });

    // Filter functionality
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    const amountFilter = document.getElementById('amount-filter');
    const clearFiltersBtn = document.querySelector('.clear-filters');

    if (statusFilter && dateFilter && amountFilter) {
        [statusFilter, dateFilter, amountFilter].forEach(filter => {
            filter.addEventListener('change', applyFilters);
        });
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            statusFilter.value = 'all';
            dateFilter.value = 'all';
            amountFilter.value = 'all';
            applyFilters();
        });
    }

    // Load theme preference
    loadThemePreference();
});

function applyFilters() {
    // In a real app, this would filter the table rows based on the selected filters
    console.log('Filters applied');
}

// Initialize Aging Receivables Chart (Bar Chart)
function initAgingReceivablesChart() {
    const ctx = document.getElementById('agingReceivablesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days'],
            datasets: [{
                label: 'Amount ($)',
                data: [8500, 3200, 1800, 750, 1030],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(253, 126, 20, 0.7)',
                    'rgba(220, 53, 69, 0.7)',
                    'rgba(108, 117, 125, 0.7)'
                ],
                borderColor: [
                    'rgba(40, 167, 69, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(253, 126, 20, 1)',
                    'rgba(220, 53, 69, 1)',
                    'rgba(108, 117, 125, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '$' + context.raw.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Initialize Aging Payables Chart (Bar Chart)
function initAgingPayablesChart() {
    const ctx = document.getElementById('agingPayablesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days'],
            datasets: [{
                label: 'Amount ($)',
                data: [4200, 2500, 1200, 800, 720],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(253, 126, 20, 0.7)',
                    'rgba(220, 53, 69, 0.7)',
                    'rgba(108, 117, 125, 0.7)'
                ],
                borderColor: [
                    'rgba(40, 167, 69, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(253, 126, 20, 1)',
                    'rgba(220, 53, 69, 1)',
                    'rgba(108, 117, 125, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '$' + context.raw.toLocaleString();
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Theme Management (from finance.js)
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function loadThemePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}