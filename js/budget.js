document.addEventListener('DOMContentLoaded', function() {
    // Initialize date picker for custom period
    const customPeriodPicker = flatpickr("#custom-period", {
        mode: "range",
        dateFormat: "Y-m-d",
        allowInput: true
    });

    const budgetCustomPeriodPicker = flatpickr("#budget-custom-period", {
        mode: "range",
        dateFormat: "Y-m-d",
        allowInput: true
    });

    // Period selector functionality
    const periodButtons = document.querySelectorAll('.period-btn');
    const customPeriodInput = document.getElementById('custom-period');

    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            periodButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            if (this.textContent === 'Custom') {
                customPeriodInput.style.display = 'block';
            } else {
                customPeriodInput.style.display = 'none';
            }
        });
    });

    // Budget period selector in modal
    const budgetPeriodSelect = document.getElementById('budget-period');
    const customPeriodGroup = document.getElementById('custom-period-group');

    budgetPeriodSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customPeriodGroup.style.display = 'block';
        } else {
            customPeriodGroup.style.display = 'none';
        }
    });

    // Modal functionality
    const modal = document.getElementById('budget-modal');
    const createBudgetBtn = document.getElementById('create-budget-btn');
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

    createBudgetBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Budget category management
    const addCategoryBtn = document.getElementById('add-category-btn');
    const categoriesContainer = document.getElementById('budget-categories');
    const budgetTotalInput = document.getElementById('budget-total');

    // Add new category
    addCategoryBtn.addEventListener('click', function() {
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Category Name</label>
                    <input type="text" class="category-name" required>
                </div>
                <div class="form-group">
                    <label>Allocated Amount</label>
                    <input type="number" class="category-amount" step="0.01" min="0" required>
                </div>
                <div class="form-group">
                    <label>% of Total</label>
                    <input type="text" class="category-percent" readonly>
                </div>
                <button type="button" class="remove-category-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        categoriesContainer.appendChild(categoryItem);

        // Add event listener to new amount input
        const amountInput = categoryItem.querySelector('.category-amount');
        amountInput.addEventListener('input', updateCategoryPercentages);

        // Add event listener to remove button
        const removeBtn = categoryItem.querySelector('.remove-category-btn');
        removeBtn.addEventListener('click', function() {
            categoryItem.remove();
            updateCategoryPercentages();
        });
    });

    // Update category percentages when amounts change
    budgetTotalInput.addEventListener('input', updateCategoryPercentages);

    function updateCategoryPercentages() {
        const totalBudget = parseFloat(budgetTotalInput.value) || 0;
        const categoryItems = document.querySelectorAll('.category-item');

        categoryItems.forEach(item => {
            const amountInput = item.querySelector('.category-amount');
            const percentInput = item.querySelector('.category-percent');
            const amount = parseFloat(amountInput.value) || 0;

            if (totalBudget > 0) {
                const percent = (amount / totalBudget) * 100;
                percentInput.value = percent.toFixed(1) + '%';
            } else {
                percentInput.value = '0%';
            }
        });
    }

    // Form submission
    const budgetForm = document.getElementById('budget-form');
    budgetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically send the data to your backend
        alert('Budget created successfully!');
        closeModal();
        budgetForm.reset();
        categoriesContainer.innerHTML = `
            <div class="category-item">
                <div class="form-row">
                    <div class="form-group">
                        <label>Category Name</label>
                        <input type="text" class="category-name" required>
                    </div>
                    <div class="form-group">
                        <label>Allocated Amount</label>
                        <input type="number" class="category-amount" step="0.01" min="0" required>
                    </div>
                    <div class="form-group">
                        <label>% of Total</label>
                        <input type="text" class="category-percent" readonly>
                    </div>
                    <button type="button" class="remove-category-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    });

    // Table sorting functionality
    const tableHeaders = document.querySelectorAll('.budget-table th[data-sort]');
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

    // Initialize charts
    initBudgetVsActualChart();
    initBudgetAllocationChart();
});

// Initialize Budget vs Actual Chart (Bar Chart)
function initBudgetVsActualChart() {
    const ctx = document.getElementById('budgetVsActualChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Ministry', 'Facilities', 'Youth', 'Salaries', 'Admin'],
            datasets: [
                {
                    label: 'Budgeted',
                    data: [50000, 30000, 25000, 120000, 20000],
                    backgroundColor: 'rgba(23, 162, 184, 0.7)',
                    borderColor: 'rgba(23, 162, 184, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Actual',
                    data: [42500, 33600, 8750, 60000, 12000],
                    backgroundColor: 'rgba(220, 53, 69, 0.7)',
                    borderColor: 'rgba(220, 53, 69, 1)',
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

// Initialize Budget Allocation Chart (Doughnut Chart)
function initBudgetAllocationChart() {
    const ctx = document.getElementById('budgetAllocationChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Ministry', 'Facilities', 'Youth', 'Salaries', 'Admin', 'Other'],
            datasets: [{
                data: [50000, 30000, 25000, 120000, 20000, 15000],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.7)',
                    'rgba(253, 126, 20, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(23, 162, 184, 0.7)',
                    'rgba(108, 117, 125, 0.7)',
                    'rgba(111, 66, 193, 0.7)'
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
            },
            cutout: '70%'
        }
    });
}