document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle (inherited from sunday_school.js)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Load theme preference (inherited from sunday_school.js)
    loadThemePreference();

    // Initialize charts and report data
    let attendanceChart, classChart, eventChart;
    const classReportData = generateClassReportData();
    const attendanceData = generateAttendanceData();
    const eventData = generateEventData();

    // DOM elements
    const generateReportBtn = document.getElementById('generate-report-btn');
    const generateReportModal = document.getElementById('generate-report-modal');
    const generateReportForm = document.getElementById('generate-report-form');
    const timePeriodFilter = document.getElementById('time-period');
    const customRangeGroup = document.getElementById('custom-range-group');
    const customStartDate = document.getElementById('custom-start-date');
    const customEndDate = document.getElementById('custom-end-date');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const printReportBtn = document.getElementById('print-report-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const saveReportBtn = document.getElementById('save-report-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const customReportRangeGroup = document.getElementById('custom-report-range-group');
    const customReportPeriod = document.getElementById('custom-report-period');

    // Initialize charts
    initializeCharts();

    // Populate class report table
    populateClassReportTable();

    // Event listeners
    generateReportBtn.addEventListener('click', () => {
        generateReportModal.style.display = 'flex';
    });

    generateReportForm.addEventListener('submit', handleGenerateReport);

    timePeriodFilter.addEventListener('change', handleTimePeriodChange);

    customReportPeriod.addEventListener('change', function() {
        customReportRangeGroup.style.display = this.value === 'custom' ? 'block' : 'none';
    });

    applyFiltersBtn.addEventListener('click', applyReportFilters);

    printReportBtn.addEventListener('click', printReport);

    exportPdfBtn.addEventListener('click', exportAsPdf);

    exportCsvBtn.addEventListener('click', exportAsCsv);

    saveReportBtn.addEventListener('click', saveReport);

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            generateReportModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === generateReportModal) {
            generateReportModal.style.display = 'none';
        }
    });

    // Functions
    function initializeCharts() {
        // Attendance Chart
        const attendanceCtx = document.getElementById('attendance-chart').getContext('2d');
        attendanceChart = new Chart(attendanceCtx, {
            type: 'line',
            data: {
                labels: attendanceData.labels,
                datasets: [{
                    label: 'Attendance Rate',
                    data: attendanceData.rates,
                    borderColor: '#FC0100',
                    backgroundColor: 'rgba(252, 1, 0, 0.1)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true
                }]
            },
            options: getChartOptions('Attendance Rate Over Time', '%')
        });

        // Class Chart
        const classCtx = document.getElementById('class-chart').getContext('2d');
        classChart = new Chart(classCtx, {
            type: 'bar',
            data: {
                labels: classReportData.map(cls => cls.name),
                datasets: [{
                    label: 'Number of Students',
                    data: classReportData.map(cls => cls.students),
                    backgroundColor: 'rgba(76, 175, 80, 0.6)',
                    borderColor: 'rgba(76, 175, 80, 1)',
                    borderWidth: 1
                }, {
                    label: 'Average Attendance',
                    data: classReportData.map(cls => cls.attendance),
                    backgroundColor: 'rgba(33, 150, 243, 0.6)',
                    borderColor: 'rgba(33, 150, 243, 1)',
                    borderWidth: 1,
                    type: 'line',
                    yAxisID: 'y1'
                }]
            },
            options: getChartOptions('Class Statistics', 'Students', '%')
        });

        // Event Chart
        const eventCtx = document.getElementById('event-chart').getContext('2d');
        eventChart = new Chart(eventCtx, {
            type: 'doughnut',
            data: {
                labels: eventData.labels,
                datasets: [{
                    data: eventData.participation,
                    backgroundColor: [
                        '#4CAF50',
                        '#2196F3',
                        '#FF9800',
                        '#9C27B0',
                        '#F44336'
                    ],
                    borderWidth: 1
                }]
            },
            options: getChartOptions('Event Participation', 'Participants')
        });
    }

    function getChartOptions(title, unit, secondaryUnit) {
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
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y + (context.datasetIndex === 0 ? unit : secondaryUnit);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: secondaryUnit ? {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: unit
                    }
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: secondaryUnit
                    },
                    grid: {
                        drawOnChartArea: false
                    },
                    max: 100
                }
            } : {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: unit
                    }
                }
            }
        };
    }

    function generateClassReportData() {
        const classNames = [
            'Little Lambs (3-5)',
            'Bible Explorers (6-8)',
            'Faith Builders (9-12)',
            'Teen Disciples (13-15)',
            'Youth Group (16-18)'
        ];
        const teachers = [
            'Sarah Johnson',
            'Michael Smith',
            'Emily Davis',
            'Robert Wilson',
            'Jennifer Brown'
        ];

        return classNames.map((name, index) => ({
            name,
            teacher: teachers[index],
            students: Math.floor(Math.random() * 20) + 10,
            attendance: Math.floor(Math.random() * 20) + 80,
            growth: (Math.random() * 10 - 5).toFixed(1)
        }));
    }

    function generateAttendanceData() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return {
            labels: months,
            rates: months.map(() => Math.floor(Math.random() * 15) + 80)
        };
    }

    function generateEventData() {
        return {
            labels: ['Christmas Pageant', 'Teacher Training', 'Vacation Bible School', 'Easter Celebration', 'Parent Orientation'],
            participation: [142, 28, 75, 110, 45]
        };
    }

    function populateClassReportTable() {
        const tableBody = document.getElementById('class-report-data');
        tableBody.innerHTML = '';

        classReportData.forEach(cls => {
            const row = document.createElement('tr');
            const growthValue = parseFloat(cls.growth);
            const growthClass = growthValue > 0 ? 'positive' : growthValue < 0 ? 'negative' : 'neutral';
            const growthIcon = growthValue > 0 ? 'fa-arrow-up' : growthValue < 0 ? 'fa-arrow-down' : 'fa-minus';

            row.innerHTML = `
                <td>${cls.name}</td>
                <td>${cls.teacher}</td>
                <td>${cls.students}</td>
                <td>${cls.attendance}%</td>
                <td>
                    <span class="growth-indicator ${growthClass}">
                        <i class="fas ${growthIcon}"></i> ${Math.abs(growthValue)}%
                    </span>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function handleTimePeriodChange() {
        if (timePeriodFilter.value === 'custom') {
            customRangeGroup.style.display = 'flex';
        } else {
            customRangeGroup.style.display = 'none';
        }
    }

    function applyReportFilters() {
        const reportType = document.getElementById('report-type').value;
        const timePeriod = timePeriodFilter.value;
        const ageGroup = document.getElementById('age-group-filter').value;

        // In a real app, this would filter the data and update the charts
        alert(`Applying filters:\n\nReport Type: ${reportType}\nTime Period: ${timePeriod}\nAge Group: ${ageGroup}\n\nIn a real application, this would update the report data and charts.`);
    }

    function handleGenerateReport(e) {
        e.preventDefault();

        const reportName = document.getElementById('custom-report-name').value;
        const reportType = document.getElementById('custom-report-type').value;
        const timePeriod = document.getElementById('custom-report-period').value;
        const ageGroup = document.getElementById('custom-report-age-group').value;
        const metrics = Array.from(document.querySelectorAll('input[name="metrics"]:checked')).map(checkbox => checkbox.value);
        const visualization = document.getElementById('custom-report-visualization').value;

        // In a real app, this would generate the custom report
        alert(`Generating custom report:\n\nName: ${reportName}\nType: ${reportType}\nTime Period: ${timePeriod}\nAge Group: ${ageGroup}\nMetrics: ${metrics.join(', ')}\nVisualization: ${visualization}\n\nIn a real application, this would generate and display the custom report.`);

        generateReportModal.style.display = 'none';
    }

    function printReport() {
        // In a real app, this would print the report
        alert('Print functionality would be implemented here. The current report would be formatted for printing.');
    }

    function exportAsPdf() {
        // In a real app, this would export the report as PDF
        alert('PDF export functionality would be implemented here. The current report would be exported as a PDF file.');
    }

    function exportAsCsv() {
        // In a real app, this would export the report data as CSV
        alert('CSV export functionality would be implemented here. The report data would be exported as a CSV file.');
    }

    function saveReport() {
        // In a real app, this would save the report configuration
        alert('Save functionality would be implemented here. The report configuration would be saved for future use.');
    }

    // Inherit theme functions from sunday_school.js
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));

        const icon = document.querySelector('#theme-toggle i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }

        // Update charts for dark mode
        updateChartsForTheme();
    }

    function updateChartsForTheme() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const textColor = isDarkMode ? '#F2F1F2' : '#622725';
        const gridColor = isDarkMode ? 'rgba(242, 241, 242, 0.1)' : 'rgba(98, 39, 37, 0.1)';

        // Update all charts
        [attendanceChart, classChart, eventChart].forEach(chart => {
            if (chart) {
                chart.options.plugins.title.color = textColor;
                chart.options.scales.x.grid.color = gridColor;
                chart.options.scales.y.grid.color = gridColor;
                if (chart.options.scales.y1) {
                    chart.options.scales.y1.grid.color = gridColor;
                }
                chart.options.scales.x.ticks.color = textColor;
                chart.options.scales.y.ticks.color = textColor;
                if (chart.options.scales.y1) {
                    chart.options.scales.y1.ticks.color = textColor;
                }
                chart.update();
            }
        });
    }

    function loadThemePreference() {
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            const icon = document.querySelector('#theme-toggle i');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }

    // Initialize charts for current theme
    updateChartsForTheme();
});