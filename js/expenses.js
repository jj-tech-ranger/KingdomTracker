document.addEventListener('DOMContentLoaded', function() {
    // Initialize date pickers
    const dateRangePicker = flatpickr("#expense-date-range", {
        mode: "range",
        dateFormat: "Y-m-d",
        allowInput: true
    });

    const expenseDatePicker = flatpickr("#expense-date", {
        dateFormat: "Y-m-d",
        defaultDate: "today",
        allowInput: true
    });

    const recurringEndPicker = flatpickr("#recurring-end", {
        dateFormat: "Y-m-d",
        allowInput: true
    });

    // Recurring expense toggle
    const recurringCheckbox = document.getElementById('expense-recurring');
    const recurringOptions = document.getElementById('recurring-options');

    recurringCheckbox.addEventListener('change', function() {
        if (this.checked) {
            recurringOptions.style.display = 'block';
        } else {
            recurringOptions.style.display = 'none';
        }
    });

    // Modal functionality
    const modal = document.getElementById('expense-modal');
    const addExpenseBtn = document.getElementById('add-expense-btn');
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

    addExpenseBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Form submission
    const expenseForm = document.getElementById('expense-form');
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically send the data to your backend
        alert('Expense submitted successfully!');
        closeModal();
        expenseForm.reset();
        recurringOptions.style.display = 'none';
        recurringCheckbox.checked = false;
    });

    // Table sorting functionality
    const tableHeaders = document.querySelectorAll('.expense-table th[data-sort]');
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
    const applyFiltersBtn = document.getElementById('apply-expense-filters');
    const resetFiltersBtn = document.getElementById('reset-expense-filters');

    applyFiltersBtn.addEventListener('click', function() {
        const dateRange = dateRangePicker.selectedDates;
        const category = document.getElementById('expense-category').value;
        const status = document.getElementById('expense-status').value;

        // Here you would typically filter your data
        console.log('Applying filters:', {
            dateRange,
            category,
            status
        });
    });

    resetFiltersBtn.addEventListener('click', function() {
        dateRangePicker.clear();
        document.getElementById('expense-category').value = 'all';
        document.getElementById('expense-status').value = 'all';

        // Here you would typically reset your data
        console.log('Filters reset');
    });

    // Initialize charts
    initMonthlyExpensesChart();
    initExpenseCategoriesChart();
});

// Initialize Monthly Expenses Chart (Bar Chart)
function initMonthlyExpensesChart() {
    const ctx = document.getElementById('monthlyExpensesChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Total Expenses',
                data: [12000, 15000, 14000, 16000, 18000, 17000, 19000, 20000, 18500, 21000, 20500, 22000],
                backgroundColor: 'rgba(220, 53, 69, 0.7)',
                borderColor: 'rgba(220, 53, 69, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
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

// Initialize Expense Categories Chart (Doughnut Chart)
function initExpenseCategoriesChart() {
    const ctx = document.getElementById('expenseCategoriesChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Events', 'Other'],
            datasets: [{
                data: [40, 20, 15, 10, 10, 5],
                backgroundColor: [
                    'rgba(220, 53, 69, 0.7)',
                    'rgba(253, 126, 20, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(23, 162, 184, 0.7)',
                    'rgba(40, 167, 69, 0.7)',
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
                            return `${context.label}: ${percentage}% ($${value.toLocaleString()})`;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}