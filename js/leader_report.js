document.addEventListener('DOMContentLoaded', function() {
    // Sample report data
    const reports = [
        {
            id: 1,
            title: "April 2025 Financial Summary",
            description: "Complete financial report including donations, expenses, and budget analysis for April 2025.",
            type: "financial",
            category: "Monthly Report",
            date: "May 5, 2025",
            period: "monthly",
            author: "Finance Team",
            file: "reports/financial-april-2025.pdf",
            team: "Finance"
        },
        {
            id: 2,
            title: "Q1 2025 Attendance Analysis",
            description: "Attendance trends and growth metrics for the first quarter of 2025 across all services and ministries.",
            type: "attendance",
            category: "Quarterly Report",
            date: "April 15, 2025",
            period: "quarterly",
            author: "Admin Team",
            file: "reports/attendance-q1-2025.pdf",
            team: "Administration"
        },
        {
            id: 3,
            title: "Easter Sunday 2025 Event Report",
            description: "Detailed report on attendance, salvations, volunteers, and follow-up needs from Easter services.",
            type: "events",
            category: "Special Event",
            date: "April 10, 2025",
            period: "weekly",
            author: "Events Team",
            file: "reports/easter-2025.pdf",
            team: "Events"
        },
        {
            id: 4,
            title: "Discipleship Progress Q1 2025",
            description: "Growth metrics and participation in small groups, Bible studies, and discipleship programs.",
            type: "discipleship",
            category: "Quarterly Report",
            date: "April 20, 2025",
            period: "quarterly",
            author: "Discipleship Team",
            file: "reports/discipleship-q1-2025.pdf",
            team: "Discipleship"
        },
        {
            id: 5,
            title: "Annual Donations Report 2024",
            description: "Year-end giving report with donor analysis and tax statements summary.",
            type: "donations",
            category: "Annual Report",
            date: "January 30, 2025",
            period: "yearly",
            author: "Finance Team",
            file: "reports/donations-2024.pdf",
            team: "Finance"
        },
        {
            id: 6,
            title: "March 2025 Youth Ministry Report",
            description: "Attendance, salvations, and event participation for youth ministry activities in March.",
            type: "attendance",
            category: "Ministry Report",
            date: "April 5, 2025",
            period: "monthly",
            author: "Youth Team",
            file: "reports/youth-march-2025.pdf",
            team: "Youth"
        }
    ];

    // DOM Elements
    const reportsList = document.getElementById('reports-list');
    const emptyState = document.getElementById('empty-state');
    const filterType = document.getElementById('filter-type');
    const filterPeriod = document.getElementById('filter-period');
    const sortBy = document.getElementById('sort-by');
    const reportSearch = document.getElementById('report-search');
    const reportModal = document.getElementById('report-modal');
    const closeReportBtn = document.getElementById('close-report');
    const closeReportFooterBtn = document.getElementById('close-report-footer');
    const downloadReportBtn = document.getElementById('download-report');
    const reportIframe = document.getElementById('report-iframe');
    const reportModalTitle = document.getElementById('report-modal-title');
    const reportModalCategory = document.getElementById('report-modal-category');
    const reportModalDate = document.getElementById('report-modal-date');
    const reportModalAuthor = document.getElementById('report-modal-author');
    const leaderDashboard = document.getElementById('leader-dashboard');
    const viewBtns = document.querySelectorAll('.view-btn');
    const dashboardPeriod = document.getElementById('dashboard-period');
    const exportAllBtn = document.getElementById('export-all');
    const compareTeamsBtn = document.getElementById('compare-teams');
    const teamComparison = document.getElementById('team-comparison');
    const dateRangeModal = document.getElementById('date-range-modal');
    const closeDateRangeBtn = document.getElementById('close-date-range');
    const cancelDateRangeBtn = document.getElementById('cancel-date-range');
    const applyDateRangeBtn = document.getElementById('apply-date-range');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');

    let currentReports = [...reports];
    let currentReport = null;
    let attendanceChart = null;
    let discipleshipChart = null;
    let teamPerformanceChart = null;

    // Initialize the page
    renderReports(currentReports);
    updateEmptyState();

    // Event Listeners
    filterType.addEventListener('change', filterAndSortReports);
    filterPeriod.addEventListener('change', filterAndSortReports);
    sortBy.addEventListener('change', filterAndSortReports);
    reportSearch.addEventListener('input', filterAndSortReports);
    closeReportBtn.addEventListener('click', () => reportModal.classList.remove('show'));
    closeReportFooterBtn.addEventListener('click', () => reportModal.classList.remove('show'));
    downloadReportBtn.addEventListener('click', downloadCurrentReport);
    exportAllBtn.addEventListener('click', exportAllReports);
    compareTeamsBtn.addEventListener('click', toggleTeamComparison);

    // View toggle functionality
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            if (this.dataset.view === 'dashboard') {
                reportsList.style.display = 'none';
                leaderDashboard.style.display = 'block';
                renderDashboardCharts();
            } else {
                reportsList.style.display = 'grid';
                leaderDashboard.style.display = 'none';
            }
        });
    });

    // Dashboard period change
    dashboardPeriod.addEventListener('change', function() {
        if (this.value === 'custom') {
            openDateRangeModal();
        } else if (leaderDashboard.style.display === 'block') {
            renderDashboardCharts();
        }
    });

    // Date range modal
    closeDateRangeBtn.addEventListener('click', closeDateRangeModal);
    cancelDateRangeBtn.addEventListener('click', closeDateRangeModal);
    applyDateRangeBtn.addEventListener('click', applyDateRange);

    // Filter and sort reports based on current filters
    function filterAndSortReports() {
        let filtered = [...reports];
        const searchTerm = reportSearch.value.toLowerCase();
        const typeFilter = filterType.value;
        const periodFilter = filterPeriod.value;
        const sortValue = sortBy.value;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(report =>
                report.title.toLowerCase().includes(searchTerm) ||
                report.description.toLowerCase().includes(searchTerm) ||
                report.author.toLowerCase().includes(searchTerm) ||
                report.team.toLowerCase().includes(searchTerm)
            );
        }

        // Apply type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(report => report.type === typeFilter);
        }

        // Apply period filter
        if (periodFilter !== 'all') {
            filtered = filtered.filter(report => report.period === periodFilter);
        }

        // Apply sorting
        switch (sortValue) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'type':
                filtered.sort((a, b) => a.type.localeCompare(b.type));
                break;
        }

        currentReports = filtered;
        renderReports(filtered);
        updateEmptyState();
    }

    // Render reports to the DOM
    function renderReports(reportsToRender) {
        reportsList.innerHTML = '';

        reportsToRender.forEach(report => {
            const reportItem = document.createElement('div');
            reportItem.className = 'report-item';

            reportItem.innerHTML = `
                <span class="report-category ${report.type}">${report.category}</span>
                <h3 class="report-title">${report.title}</h3>
                <p class="report-description">${report.description}</p>
                <div class="report-meta">
                    <span><i class="far fa-calendar"></i> ${report.date}</span>
                    <span><i class="fas fa-user-tie"></i> ${report.author}</span>
                    <span><i class="fas fa-users"></i> ${report.team}</span>
                </div>
                <div class="report-actions">
                    <button class="btn btn-view" data-id="${report.id}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-download" data-id="${report.id}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            `;

            reportsList.appendChild(reportItem);
        });

        // Add event listeners to view buttons
        document.querySelectorAll('.btn-view').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const report = reports.find(r => r.id === id);

                if (report) {
                    currentReport = report;
                    openReportModal(report);
                }
            });
        });

        // Add event listeners to download buttons
        document.querySelectorAll('.btn-download').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const id = parseInt(this.dataset.id);
                const report = reports.find(r => r.id === id);

                if (report) {
                    triggerDownload(report);
                }
            });
        });
    }

    // Open report modal
    function openReportModal(report) {
        reportModalTitle.textContent = report.title;
        reportModalCategory.textContent = report.category;
        reportModalCategory.className = `report-category ${report.type}`;
        reportModalDate.textContent = report.date;
        reportModalAuthor.textContent = `Prepared by ${report.author}`;

        // In a real app, this would load the actual report content
        reportIframe.src = report.file;

        reportModal.classList.add('show');
    }

    // Download current report
    function downloadCurrentReport() {
        if (currentReport) {
            triggerDownload(currentReport);
        }
    }

    // Trigger download for a report
    function triggerDownload(report) {
        const link = document.createElement('a');
        link.href = report.file;
        link.download = report.title.toLowerCase().replace(/ /g, '-') + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Export all visible reports
    function exportAllReports() {
        if (currentReports.length === 0) return;

        // In a real app, this would package all reports into a zip file
        alert(`Exporting ${currentReports.length} reports. In a real application, this would generate a ZIP file with all selected reports.`);
    }

    // Update empty state visibility
    function updateEmptyState() {
        if (currentReports.length === 0) {
            emptyState.style.display = 'block';
            reportsList.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            reportsList.style.display = 'grid';
        }
    }

    // Render dashboard charts
    function renderDashboardCharts() {
        // Destroy existing charts if they exist
        if (attendanceChart) attendanceChart.destroy();
        if (discipleshipChart) discipleshipChart.destroy();
        if (teamPerformanceChart) teamPerformanceChart.destroy();

        // Get the selected period
        const period = dashboardPeriod.value;

        // Sample data - in a real app, you would fetch this from an API
        const attendanceData = getAttendanceData(period);
        const discipleshipData = getDiscipleshipData(period);

        // Create charts
        const attendanceCtx = document.getElementById('attendance-trend').getContext('2d');
        attendanceChart = new Chart(attendanceCtx, {
            type: 'line',
            data: attendanceData,
            options: getChartOptions('Attendance Trend')
        });

        const discipleshipCtx = document.getElementById('discipleship-growth').getContext('2d');
        discipleshipChart = new Chart(discipleshipCtx, {
            type: 'bar',
            data: discipleshipData,
            options: getChartOptions('Discipleship Growth')
        });

        // Update metrics based on period
        updateDashboardMetrics(period);
    }

    // Get attendance data based on period
    function getAttendanceData(period) {
        // Sample data - in a real app, this would come from your API
        const dataMap = {
            'last-week': {
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                data: [120, 80, 75, 85, 90, 70, 145]
            },
            'last-month': {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [120, 145, 132, 156]
            },
            'last-quarter': {
                labels: ['January', 'February', 'March'],
                data: [480, 520, 550]
            },
            'last-year': {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                data: [1550, 1680, 1620, 1850]
            },
            'custom': {
                labels: ['Custom Range'],
                data: [0]
            }
        };

        const data = period in dataMap ? dataMap[period] : dataMap['last-month'];

        return {
            labels: data.labels,
            datasets: [{
                label: 'Attendance',
                data: data.data,
                backgroundColor: 'rgba(59, 181, 74, 0.2)',
                borderColor: 'rgba(59, 181, 74, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        };
    }

    // Get discipleship data based on period
    function getDiscipleshipData(period) {
        // Sample data - in a real app, this would come from your API
        const dataMap = {
            'last-week': {
                labels: ['New Believers', 'Baptisms', 'Small Groups'],
                data: [5, 3, 8]
            },
            'last-month': {
                labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                data: [5, 8, 6, 10]
            },
            'last-quarter': {
                labels: ['New Believers', 'Baptisms', 'Small Groups', 'Mentorships'],
                data: [24, 18, 12, 8]
            },
            'last-year': {
                labels: ['New Believers', 'Baptisms', 'Small Groups', 'Mentorships'],
                data: [96, 72, 48, 36]
            },
            'custom': {
                labels: ['Custom Range'],
                data: [0]
            }
        };

        const data = period in dataMap ? dataMap[period] : dataMap['last-month'];

        return {
            labels: data.labels,
            datasets: [{
                label: 'Discipleship',
                data: data.data,
                backgroundColor: 'rgba(142, 68, 173, 0.2)',
                borderColor: 'rgba(142, 68, 173, 1)',
                borderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        };
    }

    // Get chart options
    function getChartOptions(title) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: title,
                    color: getComputedStyle(document.body).getPropertyValue('--light-text')
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--light-text')
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: getComputedStyle(document.body).getPropertyValue('--light-text')
                    }
                }
            }
        };
    }

    // Update dashboard metrics
    function updateDashboardMetrics(period) {
        // In a real app, these values would come from your API
        const metrics = {
            'last-week': { goal: 82, disciples: 7, attendance: 685, giving: 2450 },
            'last-month': { goal: 87, disciples: 24, attendance: 156, giving: 8450 },
            'last-quarter': { goal: 92, disciples: 64, attendance: 1550, giving: 24500 },
            'last-year': { goal: 95, disciples: 240, attendance: 6700, giving: 125000 },
            'custom': { goal: 0, disciples: 0, attendance: 0, giving: 0 }
        };

        const data = period in metrics ? metrics[period] : metrics['last-month'];

        document.querySelectorAll('.metric-value')[0].textContent = `${data.goal}%`;
        document.querySelectorAll('.metric-value')[1].textContent = data.disciples;
        document.querySelectorAll('.metric-value')[2].textContent = data.attendance;
        document.querySelectorAll('.metric-value')[3].textContent = `$${data.giving.toLocaleString()}`;
    }

    // Toggle team comparison
    function toggleTeamComparison() {
        if (teamComparison.style.display === 'none') {
            teamComparison.style.display = 'block';
            renderTeamComparisonChart();
        } else {
            teamComparison.style.display = 'none';
            if (teamPerformanceChart) {
                teamPerformanceChart.destroy();
                teamPerformanceChart = null;
            }
        }
    }

    // Render team comparison chart
    function renderTeamComparisonChart() {
        if (teamPerformanceChart) teamPerformanceChart.destroy();

        // Sample data - in a real app, this would come from your API
        const teamData = {
            labels: ['Finance', 'Administration', 'Events', 'Discipleship', 'Youth'],
            datasets: [{
                label: 'Performance Score',
                data: [85, 92, 78, 88, 95],
                backgroundColor: [
                    'rgba(74, 107, 223, 0.7)',
                    'rgba(59, 181, 74, 0.7)',
                    'rgba(229, 64, 123, 0.7)',
                    'rgba(142, 68, 173, 0.7)',
                    'rgba(248, 156, 28, 0.7)'
                ],
                borderColor: [
                    'rgba(74, 107, 223, 1)',
                    'rgba(59, 181, 74, 1)',
                    'rgba(229, 64, 123, 1)',
                    'rgba(142, 68, 173, 1)',
                    'rgba(248, 156, 28, 1)'
                ],
                borderWidth: 1
            }]
        };

        const ctx = document.getElementById('team-performance-chart').getContext('2d');
        teamPerformanceChart = new Chart(ctx, {
            type: 'bar',
            data: teamData,
            options: getChartOptions('Team Performance Comparison')
        });
    }

    // Open date range modal
    function openDateRangeModal() {
        // Set default dates (last 30 days)
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);

        startDateInput.valueAsDate = startDate;
        endDateInput.valueAsDate = endDate;

        dateRangeModal.classList.add('show');
    }

    // Close date range modal
    function closeDateRangeModal() {
        dateRangeModal.classList.remove('show');
        dashboardPeriod.value = 'last-month';
    }

    // Apply date range
    function applyDateRange() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        if (!startDate || !endDate) {
            alert('Please select both start and end dates');
            return;
        }

        // In a real app, you would fetch data for this date range
        console.log(`Fetching data from ${startDate} to ${endDate}`);

        dateRangeModal.classList.remove('show');
        renderDashboardCharts();
    }

    // Update chart colors when theme changes
    document.getElementById('theme-toggle').addEventListener('click', function() {
        setTimeout(updateChartColors, 100);
    });

    // Update chart colors for dark/light mode
    function updateChartColors() {
        const textColor = getComputedStyle(document.body).getPropertyValue('--light-text');

        if (attendanceChart) {
            attendanceChart.options.plugins.title.color = textColor;
            attendanceChart.options.scales.y.ticks.color = textColor;
            attendanceChart.options.scales.x.ticks.color = textColor;
            attendanceChart.update();
        }

        if (discipleshipChart) {
            discipleshipChart.options.plugins.title.color = textColor;
            discipleshipChart.options.scales.y.ticks.color = textColor;
            discipleshipChart.options.scales.x.ticks.color = textColor;
            discipleshipChart.update();
        }

        if (teamPerformanceChart) {
            teamPerformanceChart.options.plugins.title.color = textColor;
            teamPerformanceChart.options.scales.y.ticks.color = textColor;
            teamPerformanceChart.options.scales.x.ticks.color = textColor;
            teamPerformanceChart.update();
        }
    }
});
