document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Initialize vendor charts
    initVendorSpendChart();
    initVendorPerformanceChart();

    // Set up vendor modal functionality
    setupVendorModal();

    // Set up filter functionality
    setupVendorFilters();

    // Load theme preference
    loadThemePreference();
});

// Vendor Spend Chart (Bar Chart)
function initVendorSpendChart() {
    const ctx = document.getElementById('vendorSpendChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Office Supplies', 'IT Equipment', 'Facility Maintenance', 'Food Services', 'Other'],
            datasets: [{
                label: 'Spend by Category ($)',
                data: [85600, 64200, 48750, 32100, 12500],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.7)',
                    'rgba(23, 162, 184, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(253, 126, 20, 0.7)',
                    'rgba(108, 117, 125, 0.7)'
                ],
                borderColor: [
                    'rgba(40, 167, 69, 1)',
                    'rgba(23, 162, 184, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(253, 126, 20, 1)',
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
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += '$' + context.raw.toLocaleString();
                            return label;
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

// Vendor Performance Chart (Radar Chart)
function initVendorPerformanceChart() {
    const ctx = document.getElementById('vendorPerformanceChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Quality', 'Delivery', 'Price', 'Communication', 'Flexibility', 'Support'],
            datasets: [
                {
                    label: 'Office Supplies Inc.',
                    data: [4.5, 4.2, 4.0, 4.7, 4.1, 4.3],
                    backgroundColor: 'rgba(40, 167, 69, 0.2)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(40, 167, 69, 1)'
                },
                {
                    label: 'Average Vendor',
                    data: [3.8, 3.9, 3.7, 3.5, 3.6, 3.4],
                    backgroundColor: 'rgba(108, 117, 125, 0.2)',
                    borderColor: 'rgba(108, 117, 125, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(108, 117, 125, 1)'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 5,
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '/5';
                        }
                    }
                }
            }
        }
    });
}

// Vendor Modal Functionality
function setupVendorModal() {
    const modal = document.getElementById('vendorModal');
    const addVendorBtn = document.getElementById('addVendorBtn');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');

    // Open modal when Add Vendor button is clicked
    if (addVendorBtn) {
        addVendorBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            document.getElementById('modal-title').textContent = 'Add New Vendor';
        });
    }

    // Close modal when X is clicked
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Close modal when Cancel button is clicked
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside the modal
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Tab switching functionality
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs and content
            document.querySelectorAll('.tab-btn').forEach(tb => tb.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));

            // Add active class to clicked tab
            this.classList.add('active');

            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // View buttons in vendor table
    document.querySelectorAll('.vendor-table .action-btn.view').forEach(btn => {
        btn.addEventListener('click', function() {
            modal.style.display = 'block';
            document.getElementById('modal-title').textContent = 'Vendor Details';
            // In a real app, you would load the vendor data here
        });
    });
}

// Vendor Filter Functionality
function setupVendorFilters() {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const resetFiltersBtn = document.getElementById('resetFilters');

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            const status = document.getElementById('vendor-status').value;
            const category = document.getElementById('vendor-category').value;

            // In a real app, you would filter the vendor list here
            console.log('Applying filters - Status:', status, 'Category:', category);

            // For demo purposes, just show a message
            alert(`Filters applied:\nStatus: ${status}\nCategory: ${category}`);
        });
    }

    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', function() {
            document.getElementById('vendor-status').value = 'all';
            document.getElementById('vendor-category').value = 'all';

            // In a real app, you would reset the vendor list here
            console.log('Filters reset');
        });
    }
}

// Theme Management (same as in procurement.js)
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function loadThemePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}