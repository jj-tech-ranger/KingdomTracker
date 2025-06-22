document.addEventListener('DOMContentLoaded', function() {
    // Initialize date pickers
    flatpickr(".datepicker", {
        dateFormat: "Y-m-d",
        allowInput: true
    });

    // Show/hide custom date range
    document.getElementById('timePeriod').addEventListener('change', function() {
        const customRange = document.getElementById('customDateRange');
        customRange.style.display = this.value === 'custom' ? 'flex' : 'none';
    });

    // Export dropdown toggle
    const exportBtn = document.querySelector('.export-options button');
    if (exportBtn) {
        exportBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelector('.export-dropdown').style.display = 'block';
        });
    }

    // Close export dropdown when clicking elsewhere
    document.addEventListener('click', function() {
        const dropdown = document.querySelector('.export-dropdown');
        if (dropdown) dropdown.style.display = 'none';
    });

    // Generate report button
    document.getElementById('generateReportBtn').addEventListener('click', function() {
        generateReport();
    });

    // Quick report button
    document.getElementById('quickReportBtn').addEventListener('click', function() {
        // Set default values for quick report
        document.getElementById('reportType').value = 'income';
        document.getElementById('timePeriod').value = 'this_month';
        document.getElementById('customDateRange').style.display = 'none';
        document.getElementById('includeDetails').checked = true;
        document.getElementById('showCharts').checked = true;

        generateReport();
    });

    // View report buttons
    document.querySelectorAll('.action-btn.view').forEach(btn => {
        btn.addEventListener('click', function() {
            viewReport();
        });
    });

    // Load theme preference
    loadThemePreference();
});

function generateReport() {
    const reportType = document.getElementById('reportType').value;
    const timePeriod = document.getElementById('timePeriod').value;

    if (!reportType) {
        alert('Please select a report type');
        return;
    }

    // Show loading state
    const btn = document.getElementById('generateReportBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    btn.disabled = true;

    // Simulate report generation (in a real app, this would be an API call)
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-file-export"></i> Generate Report';
        btn.disabled = false;

        // Show the report preview modal
        viewReport();

        // Add to recent reports (in a real app, this would update the database)
        addToRecentReports(reportType, timePeriod);
    }, 1500);
}

function viewReport() {
    const modal = document.getElementById('reportModal');
    modal.style.display = 'block';

    // Initialize report charts
    initReportCharts();
}

function addToRecentReports(reportType, timePeriod) {
    // In a real implementation, this would add the generated report to the recent reports list
    console.log(`Report generated - Type: ${reportType}, Period: ${timePeriod}`);
}

function initReportCharts() {
    // Income Breakdown Chart
    const incomeCtx = document.getElementById('reportIncomeChart').getContext('2d');
    new Chart(incomeCtx, {
        type: 'doughnut',
        data: {
            labels: ['Tithes', 'Donations', 'Other Income'],
            datasets: [{
                data: [8420, 12450, 3710],
                backgroundColor: [
                    '#28a745',
                    '#17a2b8',
                    '#ffc107'
                ],
                borderWidth: 0
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
                            return `${context.label}: $${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });

    // Expense Breakdown Chart
    const expenseCtx = document.getElementById('reportExpenseChart').getContext('2d');
    new Chart(expenseCtx, {
        type: 'bar',
        data: {
            labels: ['Staff Salaries', 'Facility Costs', 'Ministry Expenses', 'Administrative', 'Other'],
            datasets: [{
                label: 'Amount',
                data: [10200, 3450, 2150, 1245, 1200],
                backgroundColor: 'rgba(252, 1, 0, 0.7)',
                borderColor: 'rgba(252, 1, 0, 1)',
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
                            return `$${context.raw.toLocaleString()}`;
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
}