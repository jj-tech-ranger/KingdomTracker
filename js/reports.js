document.addEventListener('DOMContentLoaded', function() {
    // Initialize date range picker
    flatpickr("#date-range", {
        mode: "range",
        dateFormat: "Y-m-d",
        defaultDate: [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()]
    });

    // Initialize charts
    initCharts();

    // Filter button event
    document.getElementById('apply-filters').addEventListener('click', function() {
        applyFilters();
    });

    // Chart period buttons
    document.querySelectorAll('.chart-options .btn-filter').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelector('.chart-options .btn-filter.active').classList.remove('active');
            this.classList.add('active');
            updateAttendanceChart(this.dataset.period);
        });
    });

    // Export buttons
    document.getElementById('export-pdf').addEventListener('click', exportToPDF);
    document.getElementById('export-excel').addEventListener('click', exportToExcel);
    document.getElementById('print-report').addEventListener('click', printReport);
});

function initCharts() {
    // Attendance Trends Chart (Line)
    const attendanceCtx = document.getElementById('attendance-chart').getContext('2d');
    window.attendanceChart = new Chart(attendanceCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Attendance Rate',
                data: [85, 89, 92, 94],
                borderColor: '#FC0100',
                backgroundColor: 'rgba(252, 1, 0, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }]
        },
        options: getChartOptions('Weekly Attendance Trend')
    });

    // Department Performance Chart (Bar)
    const deptCtx = document.getElementById('department-chart').getContext('2d');
    window.departmentChart = new Chart(deptCtx, {
        type: 'bar',
        data: {
            labels: ['Worship', 'Children', 'Youth', 'Outreach', 'Admin'],
            datasets: [{
                label: 'Attendance Rate',
                data: [95, 88, 85, 92, 98],
                backgroundColor: [
                    'rgba(252, 1, 0, 0.7)',
                    'rgba(98, 39, 37, 0.7)',
                    'rgba(242, 204, 128, 0.7)',
                    'rgba(254, 47, 48, 0.7)',
                    'rgba(184, 15, 4, 0.7)'
                ],
                borderColor: [
                    'rgba(252, 1, 0, 1)',
                    'rgba(98, 39, 37, 1)',
                    'rgba(242, 204, 128, 1)',
                    'rgba(254, 47, 48, 1)',
                    'rgba(184, 15, 4, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: getChartOptions('Department Performance')
    });

    // Recruitment Pipeline Chart (Doughnut)
    const recruitCtx = document.getElementById('recruitment-chart').getContext('2d');
    window.recruitmentChart = new Chart(recruitCtx, {
        type: 'doughnut',
        data: {
            labels: ['New', 'Screening', 'Interview', 'Offer', 'Hired'],
            datasets: [{
                data: [12, 8, 5, 3, 2],
                backgroundColor: [
                    'rgba(0, 123, 255, 0.7)',
                    'rgba(23, 162, 184, 0.7)',
                    'rgba(252, 1, 0, 0.7)',
                    'rgba(254, 47, 48, 0.7)',
                    'rgba(40, 167, 69, 0.7)'
                ],
                borderColor: [
                    'rgba(0, 123, 255, 1)',
                    'rgba(23, 162, 184, 1)',
                    'rgba(252, 1, 0, 1)',
                    'rgba(254, 47, 48, 1)',
                    'rgba(40, 167, 69, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Recruitment Pipeline',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    });

    // Staff Engagement Chart (Radial)
    const engageCtx = document.getElementById('engagement-chart').getContext('2d');
    window.engagementChart = new Chart(engageCtx, {
        type: 'doughnut',
        data: {
            labels: ['Engaged', 'Neutral', 'Disengaged'],
            datasets: [{
                data: [80, 15, 5],
                backgroundColor: [
                    'rgba(40, 167, 69, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(252, 1, 0, 0.7)'
                ],
                borderColor: [
                    'rgba(40, 167, 69, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(252, 1, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Staff Engagement Levels',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    });
}

function getChartOptions(title) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                font: {
                    size: 16
                }
            },
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 70,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        },
        elements: {
            point: {
                radius: 4,
                hoverRadius: 6
            }
        }
    };
}

function updateAttendanceChart(period) {
    // In a real app, this would fetch new data based on the period
    let labels, data;

    if (period === 'week') {
        labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        data = [85, 89, 92, 94];
    } else if (period === 'month') {
        labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        data = [82, 85, 88, 90, 91, 92];
    } else {
        labels = ['Q1', 'Q2', 'Q3', 'Q4'];
        data = [85, 88, 90, 92];
    }

    window.attendanceChart.data.labels = labels;
    window.attendanceChart.data.datasets[0].data = data;
    window.attendanceChart.update();
}

function applyFilters() {
    const dateRange = document.getElementById('date-range').value;
    const department = document.getElementById('department-filter').value;
    const status = document.getElementById('status-filter').value;

    console.log('Applying filters:', { dateRange, department, status });
    // In a real app, this would filter the data and update charts/table
    // For now, we'll just show a loading effect
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('loading');
    });

    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('loading');
        });
    }, 1000);
}

function exportToPDF() {
    console.log('Exporting to PDF...');
    // In a real app, this would generate a PDF
    alert('PDF export would be generated here');
}

function exportToExcel() {
    console.log('Exporting to Excel...');
    // In a real app, this would generate an Excel file
    alert('Excel export would be generated here');
}

function printReport() {
    console.log('Printing report...');
    window.print();
}