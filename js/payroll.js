document.addEventListener('DOMContentLoaded', function() {
    // Initialize payroll charts
    initPayrollCharts();

    // Set up event listeners
    setupPayrollEventListeners();

    // Load theme preference
    loadThemePreference();
});

function initPayrollCharts() {
    // Payroll Distribution Chart (Doughnut)
    const distributionCtx = document.getElementById('payrollDistributionChart').getContext('2d');
    new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Salaries', 'Benefits', 'Taxes', 'Bonuses'],
            datasets: [{
                data: [65, 15, 15, 5],
                backgroundColor: [
                    '#28a745',
                    '#17a2b8',
                    '#dc3545',
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
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            label += '$' + (context.raw * 1000).toLocaleString();
                            return label;
                        }
                    }
                }
            },
            cutout: '70%'
        }
    });

    // Payroll History Chart (Bar)
    const historyCtx = document.getElementById('payrollHistoryChart').getContext('2d');
    new Chart(historyCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
            datasets: [{
                label: 'Payroll Amount',
                data: [12000, 12500, 13000, 12500, 14000, 14500, 15000, 15500, 15000, 15500, 16000],
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

function setupPayrollEventListeners() {
    // Modal handling
    const modals = {
        payroll: {
            btn: document.getElementById('runPayrollBtn'),
            modal: document.getElementById('payrollModal'),
            close: document.querySelector('#payrollModal .close-modal')
        },
        employee: {
            btn: document.getElementById('addEmployeeBtn'),
            modal: document.getElementById('employeeModal'),
            close: document.querySelector('#employeeModal .close-modal')
        }
    };

    // Open modals
    Object.values(modals).forEach(({btn, modal}) => {
        if (btn && modal) {
            btn.addEventListener('click', () => {
                modal.style.display = 'block';
            });
        }
    });

    // Close modals
    Object.values(modals).forEach(({close, modal}) => {
        if (close && modal) {
            close.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
    });

    // Close when clicking outside modal
    window.addEventListener('click', (event) => {
        Object.values(modals).forEach(({modal}) => {
            if (modal && event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Form submission
    document.getElementById('employeeForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Employee would be saved here');
        modals.employee.modal.style.display = 'none';
    });

    document.getElementById('confirmPayrollBtn')?.addEventListener('click', function() {
        alert('Payroll would be processed here');
        modals.payroll.modal.style.display = 'none';
    });
}