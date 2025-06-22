document.addEventListener('DOMContentLoaded', function() {
    // Initialize date pickers
    const dateRangePicker = flatpickr("#date-range", {
        mode: "range",
        dateFormat: "Y-m-d",
        allowInput: true
    });

    const donationDatePicker = flatpickr("#donation-date", {
        dateFormat: "Y-m-d",
        defaultDate: "today",
        allowInput: true
    });

    // Modal functionality
    const modal = document.getElementById('donation-modal');
    const addDonationBtn = document.getElementById('add-donation-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    addDonationBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Form submission
    const donationForm = document.getElementById('donation-form');
    donationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically send the data to your backend
        alert('Donation submitted successfully!');
        closeModal();
        donationForm.reset();
    });

    // Table sorting functionality
    const tableHeaders = document.querySelectorAll('.donation-table th[data-sort]');
    tableHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const sortKey = this.getAttribute('data-sort');
            const isAscending = !this.classList.contains('asc');

            // Reset all headers
            tableHeaders.forEach(h => {
                h.classList.remove('asc', 'desc');
                const icon = h.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-sort';
                }
            });

            // Set current header state
            this.classList.add(isAscending ? 'asc' : 'desc');
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = isAscending ? 'fas fa-sort-up' : 'fas fa-sort-down';
            }

            // Here you would typically sort your data
            console.log(`Sorting by ${sortKey} in ${isAscending ? 'ascending' : 'descending'} order`);
        });
    });

    // Filter application
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');

    applyFiltersBtn.addEventListener('click', function() {
        const dateRange = dateRangePicker.selectedDates;
        const donationType = document.getElementById('donation-type').value;
        const paymentMethod = document.getElementById('payment-method').value;

        // Here you would typically filter your data
        console.log('Applying filters:', {
            dateRange,
            donationType,
            paymentMethod
        });
    });

    resetFiltersBtn.addEventListener('click', function() {
        dateRangePicker.clear();
        document.getElementById('donation-type').value = 'all';
        document.getElementById('payment-method').value = 'all';

        // Here you would typically reset your data
        console.log('Filters reset');
    });

    // Initialize charts
    initMonthlyDonationsChart();
    initTitheRatioChart();
});

// Initialize Monthly Donations Chart (Bar Chart)
function initMonthlyDonationsChart() {
    const ctx = document.getElementById('monthlyDonationsChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Tithe',
                    data: [4500, 5200, 4800, 5500, 6000, 5800, 6200, 6500, 6300, 7000, 7200, 7500],
                    backgroundColor: 'rgba(40, 167, 69, 0.7)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Other Donations',
                    data: [7500, 8200, 7800, 8500, 9000, 8800, 9200, 9500, 9300, 10000, 10200, 10500],
                    backgroundColor: 'rgba(23, 162, 184, 0.7)',
                    borderColor: 'rgba(23, 162, 184, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
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

// Initialize Tithe Ratio Chart (Pie Chart)
function initTitheRatioChart() {
    const ctx = document.getElementById('titheRatioChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Tithe', 'Offerings', 'Building Fund', 'Missions', 'Other'],
            datasets: [{
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.7)',
                    'rgba(23, 162, 184, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(253, 126, 20, 0.7)',
                    'rgba(108, 117, 125, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const value = context.raw;
                            const percentage = Math.round((value / total) * 100);
                            return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}