// Theme Management
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    updateChartsForTheme();
}

function loadThemePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

function updateChartsForTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#F2F1F2' : '#622725';
    const gridColor = isDarkMode ? 'rgba(242, 241, 242, 0.1)' : 'rgba(98, 39, 37, 0.1)';

    // Update all charts with new theme colors
    if (window.procurementSpendChart) {
        window.procurementSpendChart.options.scales.x.grid.color = gridColor;
        window.procurementSpendChart.options.scales.y.grid.color = gridColor;
        window.procurementSpendChart.options.scales.x.ticks.color = textColor;
        window.procurementSpendChart.options.scales.y.ticks.color = textColor;
        window.procurementSpendChart.update();
    }

    if (window.vendorDistributionChart) {
        window.vendorDistributionChart.options.plugins.legend.labels.color = textColor;
        window.vendorDistributionChart.update();
    }

    if (window.invoiceAgingChart) {
        window.invoiceAgingChart.options.scales.x.grid.color = gridColor;
        window.invoiceAgingChart.options.scales.y.grid.color = gridColor;
        window.invoiceAgingChart.options.scales.x.ticks.color = textColor;
        window.invoiceAgingChart.options.scales.y.ticks.color = textColor;
        window.invoiceAgingChart.update();
    }

    if (window.paymentStatusChart) {
        window.paymentStatusChart.options.plugins.legend.labels.color = textColor;
        window.paymentStatusChart.update();
    }
}

// Initialize Procurement Spend Chart (Line Chart)
function initProcurementSpendChart() {
    const ctx = document.getElementById('procurementSpendChart')?.getContext('2d');
    if (!ctx) return;

    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#F2F1F2' : '#622725';
    const gridColor = isDarkMode ? 'rgba(242, 241, 242, 0.1)' : 'rgba(98, 39, 37, 0.1)';

    window.procurementSpendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Procurement Spend',
                    data: [18500, 22000, 19500, 24000, 28000, 31500, 29500, 32000, 28750, 31000, 32500, 35000],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: 'Budget',
                    data: [20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000],
                    borderColor: '#17a2b8',
                    backgroundColor: 'rgba(23, 162, 184, 0.1)',
                    borderDash: [5, 5],
                    tension: 0,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor
                    }
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
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Initialize Vendor Distribution Chart (Doughnut Chart)
function initVendorDistributionChart() {
    const ctx = document.getElementById('vendorDistributionChart')?.getContext('2d');
    if (!ctx) return;

    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#F2F1F2' : '#622725';

    window.vendorDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Office Supplies', 'IT Equipment', 'Facility Maintenance', 'Food Services', 'Other'],
            datasets: [{
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    '#28a745',
                    '#17a2b8',
                    '#ffc107',
                    '#fd7e14',
                    '#6c757d'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.raw + '%';
                            return label;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Initialize Invoice Aging Chart (Bar Chart)
function initInvoiceAgingChart() {
    const ctx = document.getElementById('invoiceAgingChart')?.getContext('2d');
    if (!ctx) return;

    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#F2F1F2' : '#622725';
    const gridColor = isDarkMode ? 'rgba(242, 241, 242, 0.1)' : 'rgba(98, 39, 37, 0.1)';

    window.invoiceAgingChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Current', '1-30 Days', '31-60 Days', '61-90 Days', 'Over 90 Days'],
            datasets: [{
                label: 'Invoice Aging',
                data: [12500, 8500, 4200, 1800, 750],
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
            maintainAspectRatio: false,
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
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Initialize Payment Status Chart (Doughnut Chart)
function initPaymentStatusChart() {
    const ctx = document.getElementById('paymentStatusChart')?.getContext('2d');
    if (!ctx) return;

    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#F2F1F2' : '#622725';

    window.paymentStatusChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Paid', 'Pending Approval', 'Approved for Payment', 'Overdue', 'Rejected'],
            datasets: [{
                data: [45, 25, 15, 10, 5],
                backgroundColor: [
                    '#28a745',
                    '#17a2b8',
                    '#ffc107',
                    '#dc3545',
                    '#6c757d'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.raw + '%';
                            return label;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Invoice Form Handling
function setupInvoiceForm() {
    const modal = document.getElementById('invoiceModal');
    const viewModal = document.getElementById('viewInvoiceModal');
    const addBtn = document.getElementById('addInvoiceBtn');
    const closeBtns = document.querySelectorAll('.close-modal');
    const cancelBtn = document.getElementById('cancelInvoiceBtn');
    const closeViewBtn = document.getElementById('closeViewModalBtn');
    const addItemBtn = document.getElementById('addItemBtn');
    const invoiceItems = document.getElementById('invoiceItems');

    // Initialize Dropzone for file uploads
    if (document.getElementById('invoiceDropzone')) {
        Dropzone.autoDiscover = false;
        const invoiceDropzone = new Dropzone("#invoiceDropzone", {
            url: "/file-upload",
            maxFilesize: 5, // MB
            acceptedFiles: "image/*,.pdf",
            addRemoveLinks: true,
            dictDefaultMessage: "Drop files here to upload",
            dictRemoveFile: "Remove file"
        });
    }

    // Show modal when add button is clicked
    addBtn?.addEventListener('click', function() {
        modal.style.display = 'block';
    });

    // Close modals when close buttons are clicked
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.style.display = 'none';
            viewModal.style.display = 'none';
        });
    });

    // Close modal when cancel button is clicked
    cancelBtn?.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close view modal when close button is clicked
    closeViewBtn?.addEventListener('click', function() {
        viewModal.style.display = 'none';
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === viewModal) {
            viewModal.style.display = 'none';
        }
    });

    // Add new item row
    addItemBtn?.addEventListener('click', function() {
        const itemRow = document.createElement('div');
        itemRow.className = 'item-row';
        itemRow.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Description*</label>
                    <input type="text" required>
                </div>
                <div class="form-group">
                    <label>Quantity*</label>
                    <input type="number" min="1" required>
                </div>
                <div class="form-group">
                    <label>Unit Price*</label>
                    <input type="number" min="0" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>Total</label>
                    <input type="text" readonly>
                </div>
            </div>
            <button type="button" class="remove-item-btn">
                <i class="fas fa-trash"></i> Remove
            </button>
        `;
        invoiceItems.appendChild(itemRow);

        // Add event listeners for calculations
        setupItemRowCalculations(itemRow);
    });

    // Setup calculations for existing item rows
    document.querySelectorAll('.item-row').forEach(row => {
        setupItemRowCalculations(row);
    });

    // Form submission
    document.getElementById('invoiceForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Invoice would be submitted here');
        modal.style.display = 'none';
    });

    // View invoice buttons
    document.querySelectorAll('.action-btn.view').forEach(btn => {
        btn.addEventListener('click', function() {
            viewModal.style.display = 'block';
        });
    });
}

function setupItemRowCalculations(row) {
    const quantityInput = row.querySelector('input[type="number"]:nth-of-type(1)');
    const unitPriceInput = row.querySelector('input[type="number"]:nth-of-type(2)');
    const totalInput = row.querySelector('input[type="text"][readonly]');
    const removeBtn = row.querySelector('.remove-item-btn');

    // Calculate total when quantity or price changes
    const calculateTotal = () => {
        const quantity = parseFloat(quantityInput.value) || 0;
        const unitPrice = parseFloat(unitPriceInput.value) || 0;
        const total = quantity * unitPrice;
        totalInput.value = total.toFixed(2);
        calculateInvoiceTotal();
    };

    quantityInput.addEventListener('input', calculateTotal);
    unitPriceInput.addEventListener('input', calculateTotal);

    // Remove item row
    removeBtn.addEventListener('click', function() {
        row.remove();
        calculateInvoiceTotal();
    });
}

function calculateInvoiceTotal() {
    const subtotalInput = document.getElementById('subtotal');
    const taxInput = document.getElementById('tax');
    const discountInput = document.getElementById('discount');
    const totalAmountInput = document.getElementById('totalAmount');

    // Calculate subtotal from all items
    let subtotal = 0;
    document.querySelectorAll('.item-row input[type="text"][readonly]').forEach(input => {
        subtotal += parseFloat(input.value) || 0;
    });

    subtotalInput.value = subtotal.toFixed(2);

    // Calculate total amount
    const tax = parseFloat(taxInput.value) || 0;
    const discount = parseFloat(discountInput.value) || 0;
    const totalAmount = subtotal + tax - discount;

    totalAmountInput.value = totalAmount.toFixed(2);
}

// Filter buttons functionality
function setupFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // In a real app, you would filter the table data here
            console.log(`Filtering by: ${this.textContent}`);
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load theme preference
    loadThemePreference();

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Initialize charts
    initProcurementSpendChart();
    initVendorDistributionChart();
    initInvoiceAgingChart();
    initPaymentStatusChart();

    // Set up invoice processing functionality
    setupInvoiceForm();
    setupFilterButtons();

    // Calculate totals when tax or discount changes
    document.getElementById('tax')?.addEventListener('input', calculateInvoiceTotal);
    document.getElementById('discount')?.addEventListener('input', calculateInvoiceTotal);
});
// Initialize Payment Method Chart (Doughnut Chart)
function initPaymentMethodChart() {
    const ctx = document.getElementById('paymentMethodChart')?.getContext('2d');
    if (!ctx) return;

    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#F2F1F2' : '#622725';

    window.paymentMethodChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['ACH Transfer', 'Check', 'Credit Card', 'Wire Transfer'],
            datasets: [{
                data: [45, 30, 15, 10],
                backgroundColor: [
                    '#28a745',
                    '#17a2b8',
                    '#ffc107',
                    '#fd7e14'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += context.raw + '%';
                            return label;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });
}

// Payment Processing Modal Handling
function setupPaymentProcessing() {
    const paymentModal = document.getElementById('paymentModal');
    const batchModal = document.getElementById('batchModal');
    const viewPaymentModal = document.getElementById('viewPaymentModal');
    const payButtons = document.querySelectorAll('.action-btn.pay');
    const batchButtons = document.querySelectorAll('.action-btn.batch');
    const viewButtons = document.querySelectorAll('.action-btn.view');
    const createBatchBtn = document.getElementById('createBatchBtn');
    const closeBtns = document.querySelectorAll('.close-modal');
    const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
    const cancelBatchBtn = document.getElementById('cancelBatchBtn');
    const closeViewPaymentBtn = document.getElementById('closeViewPaymentBtn');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const selectAllInvoices = document.getElementById('selectAllInvoices');
    const invoiceCheckboxes = document.querySelectorAll('.invoice-checkbox');

    // Show payment modal when pay button is clicked
    payButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            // In a real app, you would populate the modal with actual data from the row
            document.getElementById('invoiceNumber').value = row.cells[0].textContent;
            document.getElementById('vendorName').value = row.cells[1].textContent;
            document.getElementById('paymentAmount').value = row.cells[2].textContent;
            document.getElementById('dueDate').value = row.cells[3].textContent;
            paymentModal.style.display = 'block';
        });
    });

    // Show batch modal when batch button is clicked
    batchButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            // In a real app, you would add this invoice to the batch list
            batchModal.style.display = 'block';
        });
    });

    // Show view modal when view button is clicked
    viewButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            viewPaymentModal.style.display = 'block';
        });
    });

    // Show batch modal when create batch button is clicked
    createBatchBtn?.addEventListener('click', function() {
        batchModal.style.display = 'block';
    });

    // Close modals when close buttons are clicked
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            paymentModal.style.display = 'none';
            batchModal.style.display = 'none';
            viewPaymentModal.style.display = 'none';
        });
    });

    // Close payment modal when cancel button is clicked
    cancelPaymentBtn?.addEventListener('click', function() {
        paymentModal.style.display = 'none';
    });

    // Close batch modal when cancel button is clicked
    cancelBatchBtn?.addEventListener('click', function() {
        batchModal.style.display = 'none';
    });

    // Close view modal when close button is clicked
    closeViewPaymentBtn?.addEventListener('click', function() {
        viewPaymentModal.style.display = 'none';
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
        if (event.target === batchModal) {
            batchModal.style.display = 'none';
        }
        if (event.target === viewPaymentModal) {
            viewPaymentModal.style.display = 'none';
        }
    });

    // Show/hide payment method details based on selection
    paymentMethodSelect?.addEventListener('change', function() {
        const method = this.value;

        // Hide all sections first
        document.getElementById('bankDetailsSection').style.display = 'none';
        document.getElementById('checkDetailsSection').style.display = 'none';
        document.getElementById('creditCardSection').style.display = 'none';

        // Show relevant section
        if (method === 'ach' || method === 'wire') {
            document.getElementById('bankDetailsSection').style.display = 'block';
        } else if (method === 'check') {
            document.getElementById('checkDetailsSection').style.display = 'block';
        } else if (method === 'credit_card') {
            document.getElementById('creditCardSection').style.display = 'block';
        }
    });

    // Select/deselect all invoices in batch
    selectAllInvoices?.addEventListener('change', function() {
        const isChecked = this.checked;
        invoiceCheckboxes.forEach(checkbox => {
            checkbox.checked = isChecked;
        });
        updateBatchSummary();
    });

    // Update batch summary when invoices are selected/deselected
    invoiceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateBatchSummary);
    });

    // Form submission for single payment
    document.getElementById('paymentForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Payment would be processed here');
        paymentModal.style.display = 'none';
        // In a real app, you would update the UI to reflect the processed payment
    });

    // Form submission for batch payment
    document.getElementById('batchForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Payment batch would be created here');
        batchModal.style.display = 'none';
        // In a real app, you would update the UI to show the new batch
    });
}

// Update batch summary information
function updateBatchSummary() {
    const checkboxes = document.querySelectorAll('.invoice-checkbox:checked');
    const count = checkboxes.length;
    let total = 0;

    checkboxes.forEach(checkbox => {
        total += parseFloat(checkbox.dataset.amount);
    });

    document.getElementById('batchCount').value = count;
    document.getElementById('batchTotal').value = '$' + total.toFixed(2);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load theme preference
    loadThemePreference();

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Initialize charts
    initProcurementSpendChart();
    initVendorDistributionChart();
    initPaymentMethodChart();
    initPaymentStatusChart();

    // Set up payment processing functionality
    setupPaymentProcessing();
});
// Initialize Reports Charts
function initReportsCharts() {
    initSpendAnalysisChart();
    initCategorySpendChart();
    initBudgetChart();
    initVendorPerformanceChart();
}

// Initialize Spend Analysis Chart
function initSpendAnalysisChart() {
    const ctx = document.getElementById('spendAnalysisChart')?.getContext('2d');
    if (!ctx) return;

    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#F2F1F2' : '#622725';
    const gridColor = isDarkMode ? 'rgba(242, 241, 242, 0.1)' : 'rgba(98, 39, 37, 0.1)';

    window.spendAnalysisChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Actual Spend',
                data: [18500, 22000, 19500, 24000, 28000, 31500, 29500, 32000, 28750, 31000, 32500, 35000],
                backgroundColor: 'rgba(252, 1, 0, 0.7)',
                borderColor: 'rgba(252, 1, 0, 1)',
                borderWidth: 1
            }, {
                label: 'Budget',
                data: [20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000, 20000],
                backgroundColor: 'rgba(23, 162, 184, 0.7)',
                borderColor: 'rgba(23, 162, 184, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor
                    }
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
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Initialize Category Spend Chart
function initCategorySpendChart() {
    const ctx = document.getElementById('categorySpendChart')?.getContext('2d');
    if (!ctx) return;

    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#F2F1F2' : '#622725';

    window.categorySpendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Office Supplies', 'IT Equipment', 'Facility Maintenance', 'Food Services', 'Other'],
            datasets: [{
                label: 'Current Year',
                data: [12500, 8500, 6500, 3200, 1500],
                backgroundColor: 'rgba(252, 1, 0, 0.7)',
                borderColor: 'rgba(252, 1, 0, 1)',
                borderWidth: 1
            }, {
                label: 'Previous Year',
                data: [11000, 7800, 6000, 3500, 1200],
                backgroundColor: 'rgba(98, 39, 37, 0.7)',
                borderColor: 'rgba(98, 39, 37, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor
                    }
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
                x: {
                    grid: {
                        color: 'transparent'
                    },
                    ticks: {
                        color: textColor
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'transparent'
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Initialize Budget Chart
function initBudgetChart() {
    const ctx = document.getElementById('budgetChart')?.getContext('2d');
    if (!ctx) return;

    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#F2F1F2' : '#622725';
    const gridColor = isDarkMode ? 'rgba(242, 241, 242, 0.1)' : 'rgba(98, 39, 37, 0.1)';

    window.budgetChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Worship', 'Youth', 'Missions', 'Facilities', 'Admin'],
            datasets: [{
                label: 'Budget',
                data: [12000, 8000, 10000, 15000, 5000],
                backgroundColor: 'rgba(23, 162, 184, 0.7)',
                borderColor: 'rgba(23, 162, 184, 1)',
                borderWidth: 1
            }, {
                label: 'Actual',
                data: [11500, 8200, 9500, 14200, 4800],
                backgroundColor: 'rgba(40, 167, 69, 0.7)',
                borderColor: 'rgba(40, 167, 69, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor
                    }
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
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor,
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// Initialize Vendor Performance Chart
function initVendorPerformanceChart() {
    const ctx = document.getElementById('vendorPerformanceChart')?.getContext('2d');
    if (!ctx) return;

    const isDarkMode = document.body.classList.contains('dark-mode');
    const textColor = isDarkMode ? '#F2F1F2' : '#622725';

    window.vendorPerformanceChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Delivery Time', 'Quality', 'Pricing', 'Communication', 'Compliance'],
            datasets: [{
                label: 'Office Supplies Inc.',
                data: [85, 90, 80, 95, 100],
                backgroundColor: 'rgba(252, 1, 0, 0.2)',
                borderColor: 'rgba(252, 1, 0, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(252, 1, 0, 1)'
            }, {
                label: 'Tech Solutions Ltd.',
                data: [95, 85, 75, 90, 95],
                backgroundColor: 'rgba(23, 162, 184, 0.2)',
                borderColor: 'rgba(23, 162, 184, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(23, 162, 184, 1)'
            }, {
                label: 'Facility Services Co.',
                data: [75, 80, 90, 85, 90],
                backgroundColor: 'rgba(255, 193, 7, 0.2)',
                borderColor: 'rgba(255, 193, 7, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(255, 193, 7, 1)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '%';
                        }
                    }
                }
            },
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(98, 39, 37, 0.1)'
                    },
                    grid: {
                        color: 'rgba(98, 39, 37, 0.1)'
                    },
                    pointLabels: {
                        color: textColor
                    },
                    ticks: {
                        backdropColor: 'transparent',
                        color: textColor,
                        stepSize: 20
                    }
                }
            }
        }
    });
}

// Setup Report View Toggle
function setupReportViewToggle() {
    const viewOptions = document.querySelectorAll('.view-option');
    const tableView = document.getElementById('reportTableView');
    const gridView = document.getElementById('reportGridView');

    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            viewOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');

            // Show the selected view
            const view = this.dataset.view;
            if (view === 'table') {
                tableView.style.display = 'block';
                gridView.style.display = 'none';
            } else {
                tableView.style.display = 'none';
                gridView.style.display = 'block';
            }
        });
    });
}

// Setup Date Range Picker
function setupDateRangePicker() {
    const dateRangeInput = document.getElementById('dateRange');
    if (!dateRangeInput) return;

    flatpickr(dateRangeInput, {
        mode: 'range',
        dateFormat: 'Y-m-d',
        defaultDate: [new Date(new Date().setMonth(new Date().getMonth() - 3)), new Date()],
        onChange: function(selectedDates, dateStr, instance) {
            // In a real app, you would update the report data based on the selected date range
            console.log('Date range selected:', dateStr);
        }
    });
}

// Setup Report Filters
function setupReportFilters() {
    const generateBtn = document.getElementById('generateReportBtn');
    const resetBtn = document.getElementById('resetFiltersBtn');
    const exportBtn = document.getElementById('exportReportBtn');

    generateBtn?.addEventListener('click', function() {
        // In a real app, you would regenerate the reports based on the selected filters
        const reportType = document.getElementById('reportType').value;
        const dateRange = document.getElementById('dateRange').value;
        const category = document.getElementById('reportCategory').value;
        const department = document.getElementById('reportDepartment').value;

        console.log('Generating report with filters:', {
            reportType,
            dateRange,
            category,
            department
        });

        alert('Report would be regenerated with the selected filters');
    });

    resetBtn?.addEventListener('click', function() {
        document.getElementById('reportType').value = 'spend_analysis';
        document.getElementById('dateRange').value = '';
        document.getElementById('reportCategory').value = '';
        document.getElementById('reportDepartment').value = '';

        // Reset the date range picker
        if (window.dateRangePicker) {
            window.dateRangePicker.clear();
        }
    });

    exportBtn?.addEventListener('click', function() {
        const reportType = document.getElementById('reportType').value;
        alert(`Exporting ${reportType} report to Excel`);
        // In a real app, you would generate and download the export file
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load theme preference
    loadThemePreference();

    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Initialize charts
    initReportsCharts();

    // Set up report functionality
    setupReportViewToggle();
    setupDateRangePicker();
    setupReportFilters();
});