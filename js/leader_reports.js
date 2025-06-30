document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const generateReportBtn = document.getElementById('generate-report');
    const scheduleReportBtn = document.getElementById('schedule-report');
    const generateModal = document.getElementById('generate-modal');
    const scheduleModal = document.getElementById('schedule-modal');
    const closeGenerateBtn = document.getElementById('close-generate');
    const closeScheduleBtn = document.getElementById('close-schedule');
    const cancelGenerateBtn = document.getElementById('cancel-generate');
    const cancelScheduleBtn = document.getElementById('cancel-schedule');
    const submitGenerateBtn = document.getElementById('submit-generate');
    const submitScheduleBtn = document.getElementById('submit-schedule');
    const reportTypeSelect = document.getElementById('report-type');
    const customFieldsSection = document.getElementById('custom-fields');
    const scheduleFrequency = document.getElementById('schedule-frequency');
    const scheduleDayGroup = document.getElementById('schedule-day-group');
    const scheduleDateGroup = document.getElementById('schedule-date-group');
    const scheduleTimeSelect = document.getElementById('schedule-time');
    const customTimeInput = document.getElementById('custom-time');
    const createFirstReportBtn = document.getElementById('create-first-report');
    const scheduleFirstReportBtn = document.getElementById('schedule-first-report');
    const createFirstExportBtn = document.getElementById('create-first-export');

    // Sample data for saved reports
    const savedReports = [
        {
            id: 1,
            title: "Weekly Engagement Report",
            description: "Summary of content views, comments, and member activity",
            type: "engagement",
            category: "Weekly Report",
            date: "May 15, 2025",
            period: "weekly",
            author: "Alex Meian",
            file: "reports/engagement-weekly-2025-05-15.pdf"
        },
        {
            id: 2,
            title: "Monthly Prayer Activity",
            description: "Analysis of prayer requests and answered prayers",
            type: "prayer",
            category: "Monthly Report",
            date: "May 1, 2025",
            period: "monthly",
            author: "Alex Meian",
            file: "reports/prayer-monthly-2025-05.pdf"
        },
        {
            id: 3,
            title: "Quarterly Member Growth",
            description: "Member activity and growth metrics for Q2 2025",
            type: "members",
            category: "Quarterly Report",
            date: "April 10, 2025",
            period: "quarterly",
            author: "Alex Meian",
            file: "reports/members-q2-2025.pdf"
        }
    ];

    // Sample data for scheduled reports
    const scheduledReports = [
        {
            id: 1,
            title: "Weekly Team Engagement",
            description: "Automated weekly report sent to leadership team",
            type: "engagement",
            frequency: "weekly",
            day: "monday",
            time: "08:00",
            recipients: ["me", "leadership"],
            nextRun: "May 22, 2025",
            status: "active"
        },
        {
            id: 2,
            title: "Monthly Member Activity",
            description: "Monthly summary of member engagement",
            type: "members",
            frequency: "monthly",
            date: 1,
            time: "12:00",
            recipients: ["me", "leadership"],
            nextRun: "June 1, 2025",
            status: "active"
        }
    ];

    // Sample data for exports
    const dataExports = [
        {
            id: 1,
            title: "Content Data Export",
            description: "Complete content views and engagement data",
            type: "content",
            format: "csv",
            date: "May 18, 2025",
            size: "2.4 MB",
            file: "exports/content-2025-05-18.csv"
        },
        {
            id: 2,
            title: "Member Activity Export",
            description: "All member activity for Q2 2025",
            type: "members",
            format: "excel",
            date: "May 10, 2025",
            size: "5.1 MB",
            file: "exports/members-q2-2025.xlsx"
        }
    ];

    // Initialize the page
    initTabs();
    renderSavedReports();
    renderScheduledReports();
    renderDataExports();
    initCharts();

    // Event listeners
    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });

    generateReportBtn.addEventListener('click', () => generateModal.classList.add('show'));
    scheduleReportBtn.addEventListener('click', () => scheduleModal.classList.add('show'));
    createFirstReportBtn.addEventListener('click', () => generateModal.classList.add('show'));
    scheduleFirstReportBtn.addEventListener('click', () => scheduleModal.classList.add('show'));
    createFirstExportBtn.addEventListener('click', () => generateModal.classList.add('show'));

    closeGenerateBtn.addEventListener('click', () => generateModal.classList.remove('show'));
    closeScheduleBtn.addEventListener('click', () => scheduleModal.classList.remove('show'));
    cancelGenerateBtn.addEventListener('click', () => generateModal.classList.remove('show'));
    cancelScheduleBtn.addEventListener('click', () => scheduleModal.classList.remove('show'));

    reportTypeSelect.addEventListener('change', function() {
        customFieldsSection.style.display = this.value === 'custom' ? 'block' : 'none';
    });

    scheduleFrequency.addEventListener('change', function() {
        scheduleDayGroup.style.display = this.value === 'weekly' ? 'block' : 'none';
        scheduleDateGroup.style.display = this.value === 'monthly' ? 'block' : 'none';
    });

    scheduleTimeSelect.addEventListener('change', function() {
        customTimeInput.style.display = this.value === 'custom' ? 'block' : 'none';
    });

    submitGenerateBtn.addEventListener('click', function(e) {
        e.preventDefault();
        generateReport();
        generateModal.classList.remove('show');
    });

    submitScheduleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        scheduleReport();
        scheduleModal.classList.remove('show');
    });

    // Functions
    function initTabs() {
        // Activate first tab by default
        document.querySelector('.tab-btn[data-tab="analytics"]').classList.add('active');
        document.getElementById('analytics-tab').classList.add('active');
    }

    function switchTab(tabId) {
        // Remove active class from all tabs
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to selected tab
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }

    function renderSavedReports() {
        const container = document.getElementById('saved-reports-list');
        const emptyState = document.getElementById('saved-empty-state');

        container.innerHTML = '';

        if (savedReports.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        savedReports.forEach(report => {
            const reportItem = document.createElement('div');
            reportItem.className = 'report-item';
            reportItem.innerHTML = `
                <span class="report-category ${report.type}">${report.category}</span>
                <h3 class="report-title">${report.title}</h3>
                <p class="report-description">${report.description}</p>
                <div class="report-meta">
                    <span><i class="far fa-calendar"></i> ${report.date}</span>
                    <span><i class="fas fa-user-tie"></i> ${report.author}</span>
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
            container.appendChild(reportItem);
        });

        // Add event listeners to view/download buttons
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', function() {
                const reportId = parseInt(this.dataset.id);
                const report = savedReports.find(r => r.id === reportId);
                if (report) {
                    // In a real app, this would open the report
                    alert(`Viewing report: ${report.title}`);
                }
            });
        });

        document.querySelectorAll('.btn-download').forEach(btn => {
            btn.addEventListener('click', function() {
                const reportId = parseInt(this.dataset.id);
                const report = savedReports.find(r => r.id === reportId);
                if (report) {
                    // In a real app, this would trigger a download
                    const link = document.createElement('a');
                    link.href = report.file;
                    link.download = report.title.toLowerCase().replace(/ /g, '-') + '.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
        });
    }

    function renderScheduledReports() {
        const container = document.getElementById('scheduled-reports-list');
        const emptyState = document.getElementById('scheduled-empty-state');

        container.innerHTML = '';

        if (scheduledReports.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        scheduledReports.forEach(report => {
            const reportItem = document.createElement('div');
            reportItem.className = 'report-item';
            reportItem.innerHTML = `
                <span class="report-category ${report.type}">${report.frequency}</span>
                <h3 class="report-title">${report.title}</h3>
                <p class="report-description">${report.description}</p>
                <div class="report-meta">
                    <span><i class="fas fa-clock"></i> Next run: ${report.nextRun}</span>
                    <span><i class="fas fa-users"></i> ${report.recipients.length} recipients</span>
                </div>
                <div class="report-actions">
                    <button class="btn btn-view" data-id="${report.id}">
                        <i class="fas fa-eye"></i> Details
                    </button>
                    <button class="btn btn-download" data-id="${report.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            `;
            container.appendChild(reportItem);
        });
    }

    function renderDataExports() {
        const container = document.getElementById('exports-list');
        const emptyState = document.getElementById('exports-empty-state');

        container.innerHTML = '';

        if (dataExports.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        dataExports.forEach(exportItem => {
            const exportElement = document.createElement('div');
            exportElement.className = 'report-item';
            exportElement.innerHTML = `
                <span class="report-category ${exportItem.type}">${exportItem.format.toUpperCase()}</span>
                <h3 class="report-title">${exportItem.title}</h3>
                <p class="report-description">${exportItem.description}</p>
                <div class="report-meta">
                    <span><i class="far fa-calendar"></i> ${exportItem.date}</span>
                    <span><i class="fas fa-database"></i> ${exportItem.size}</span>
                </div>
                <div class="report-actions">
                    <button class="btn btn-view" data-id="${exportItem.id}">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                    <button class="btn btn-download" data-id="${exportItem.id}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            `;
            container.appendChild(exportElement);
        });

        // Add event listeners to buttons
        document.querySelectorAll('.btn-download').forEach(btn => {
            btn.addEventListener('click', function() {
                const exportId = parseInt(this.dataset.id);
                const exportItem = dataExports.find(e => e.id === exportId);
                if (exportItem) {
                    // In a real app, this would trigger a download
                    const link = document.createElement('a');
                    link.href = exportItem.file;
                    link.download = exportItem.title.toLowerCase().replace(/ /g, '-') + '.' + exportItem.format;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            });
        });
    }

    function generateReport() {
        const reportName = document.getElementById('report-name').value;
        const reportType = document.getElementById('report-type').value;
        const reportTeam = document.getElementById('report-team').value;
        const startDate = document.getElementById('report-start-date').value;
        const endDate = document.getElementById('report-end-date').value;
        const reportFormat = document.getElementById('report-format').value;
        const saveTemplate = document.getElementById('save-template').checked;

        // In a real app, this would generate the actual report
        alert(`Generating ${reportType} report for ${reportTeam} from ${startDate} to ${endDate}`);

        // Add to saved reports if checked
        if (saveTemplate) {
            const newReport = {
                id: savedReports.length + 1,
                title: reportName,
                description: `${reportType} report for ${reportTeam}`,
                type: reportType,
                category: "Custom Report",
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                period: "custom",
                author: "Alex Meian",
                file: `reports/${reportType}-${Date.now()}.pdf`
            };
            savedReports.unshift(newReport);
            renderSavedReports();
        }
    }

    function scheduleReport() {
        const reportName = document.getElementById('schedule-report').value;
        const frequency = document.getElementById('schedule-frequency').value;
        const day = document.getElementById('schedule-day').value;
        const date = document.getElementById('schedule-date').value;
        const time = document.getElementById('schedule-time').value === 'custom'
            ? document.getElementById('custom-time').value
            : document.getElementById('schedule-time').value;
        const recipients = Array.from(document.getElementById('schedule-recipients').selectedOptions)
            .map(option => option.value);
        const format = document.getElementById('schedule-format').value;

        // In a real app, this would schedule the report
        alert(`Scheduling ${reportName} to run ${frequency} at ${time}`);

        // Add to scheduled reports
        const newScheduledReport = {
            id: scheduledReports.length + 1,
            title: reportName,
            description: `Automated ${frequency} report in ${format} format`,
            type: reportName.includes('Engagement') ? 'engagement' :
                 reportName.includes('Prayer') ? 'prayer' : 'members',
            frequency: frequency,
            day: day,
            date: date,
            time: time,
            recipients: recipients,
            nextRun: calculateNextRun(frequency, day, date),
            status: "active"
        };
        scheduledReports.unshift(newScheduledReport);
        renderScheduledReports();
    }

    function calculateNextRun(frequency, day, date) {
        const now = new Date();
        let nextRun = new Date();

        switch (frequency) {
            case 'daily':
                nextRun.setDate(now.getDate() + 1);
                break;
            case 'weekly':
                const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                const targetDay = days.indexOf(day);
                const currentDay = now.getDay();
                const daysToAdd = (targetDay - currentDay + 7) % 7 || 7;
                nextRun.setDate(now.getDate() + daysToAdd);
                break;
            case 'monthly':
                nextRun.setMonth(now.getMonth() + 1);
                nextRun.setDate(Math.min(date, daysInMonth(nextRun.getMonth(), nextRun.getFullYear())));
                break;
            case 'quarterly':
                nextRun.setMonth(now.getMonth() + 3);
                break;
        }

        return nextRun.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function daysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    function initCharts() {
        // Engagement Chart
        const engagementCtx = document.getElementById('engagement-chart').getContext('2d');
        const engagementChart = new Chart(engagementCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Content Views',
                        data: [120, 190, 170, 220, 240, 200],
                        borderColor: '#4a6bdf',
                        backgroundColor: 'rgba(74, 107, 223, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Comments',
                        data: [80, 110, 95, 130, 150, 120],
                        borderColor: '#3bb54a',
                        backgroundColor: 'rgba(59, 181, 74, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Prayer Requests',
                        data: [45, 60, 50, 70, 65, 55],
                        borderColor: '#8e44ad',
                        backgroundColor: 'rgba(142, 68, 173, 0.1)',
                        tension: 0.3,
                        fill: true
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
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Category Chart
        const categoryCtx = document.getElementById('category-chart').getContext('2d');
        const categoryChart = new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Teachings', 'Worship', 'Events', 'Documents', 'Other'],
                datasets: [{
                    data: [35, 25, 20, 15, 5],
                    backgroundColor: [
                        '#4a6bdf',
                        '#3bb54a',
                        '#e5407b',
                        '#f89c1c',
                        '#8e44ad'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right',
                    }
                }
            }
        });

        // Update charts when period changes
        document.querySelectorAll('.chart-period, .chart-team').forEach(select => {
            select.addEventListener('change', function() {
                // In a real app, this would fetch new data and update the charts
                console.log(`Updating chart with ${this.value} data`);
            });
        });
    }
});