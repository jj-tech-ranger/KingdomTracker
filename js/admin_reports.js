document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const generateReportBtn = document.getElementById('generate-report');
    const scheduleReportBtn = document.getElementById('schedule-report');
    const exportDataBtn = document.getElementById('export-data');
    const generateModal = document.getElementById('generate-modal');
    const scheduleModal = document.getElementById('schedule-modal');
    const exportModal = document.getElementById('export-modal');
    const closeGenerateBtn = document.getElementById('close-generate');
    const closeScheduleBtn = document.getElementById('close-schedule');
    const closeExportBtn = document.getElementById('close-export');
    const cancelGenerateBtn = document.getElementById('cancel-generate');
    const cancelScheduleBtn = document.getElementById('cancel-schedule');
    const cancelExportBtn = document.getElementById('cancel-export');
    const submitGenerateBtn = document.getElementById('submit-generate');
    const submitScheduleBtn = document.getElementById('submit-schedule');
    const submitExportBtn = document.getElementById('submit-export');
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
    const applyAuditFiltersBtn = document.getElementById('apply-audit-filters');
    const exportAuditBtn = document.getElementById('export-audit');
    const auditPrevBtn = document.getElementById('audit-prev');
    const auditNextBtn = document.getElementById('audit-next');
    const auditPageInfo = document.getElementById('audit-page-info');

    // Sample data for saved reports
    const savedReports = [
        {
            id: 1,
            title: "Monthly Membership Report",
            description: "Detailed analysis of member growth and demographics",
            type: "membership",
            category: "Monthly Report",
            date: "May 15, 2025",
            period: "monthly",
            author: "Admin User",
            file: "reports/membership-monthly-2025-05-15.pdf"
        },
        {
            id: 2,
            title: "Quarterly Financial Summary",
            description: "Income, expenses, and budget analysis for Q2 2025",
            type: "financial",
            category: "Quarterly Report",
            date: "May 1, 2025",
            period: "quarterly",
            author: "Admin User",
            file: "reports/financial-q2-2025.pdf"
        },
        {
            id: 3,
            title: "System Usage Report",
            description: "Platform activity and performance metrics",
            type: "system",
            category: "Monthly Report",
            date: "April 30, 2025",
            period: "monthly",
            author: "Admin User",
            file: "reports/system-usage-2025-04.pdf"
        }
    ];

    // Sample data for scheduled reports
    const scheduledReports = [
        {
            id: 1,
            title: "Weekly System Status",
            description: "Automated weekly report sent to IT team",
            type: "system",
            frequency: "weekly",
            day: "monday",
            time: "08:00",
            recipients: ["me", "it"],
            nextRun: "May 22, 2025",
            status: "active"
        },
        {
            id: 2,
            title: "Monthly Financial Report",
            description: "Monthly financial summary for leadership",
            type: "financial",
            frequency: "monthly",
            date: 1,
            time: "12:00",
            recipients: ["me", "leadership", "finance"],
            nextRun: "June 1, 2025",
            status: "active"
        }
    ];

    // Sample data for exports
    const dataExports = [
        {
            id: 1,
            title: "Member Database Export",
            description: "Complete member data with contact information",
            type: "members",
            format: "csv",
            date: "May 18, 2025",
            size: "4.2 MB",
            file: "exports/members-2025-05-18.csv"
        },
        {
            id: 2,
            title: "Financial Records Export",
            description: "All financial transactions for Q2 2025",
            type: "financial",
            format: "excel",
            date: "May 10, 2025",
            size: "8.1 MB",
            file: "exports/financial-q2-2025.xlsx"
        }
    ];

    // Sample data for audit logs
    const auditLogs = [
        {
            id: 1,
            timestamp: "2025-05-20 09:15:32",
            user: "Admin User",
            action: "System Settings Updated",
            details: "Changed password policy requirements",
            ip: "192.168.1.100"
        },
        {
            id: 2,
            timestamp: "2025-05-20 08:42:11",
            user: "Jonathan Williams",
            action: "User Role Changed",
            details: "Promoted Sarah Johnson to Team Leader",
            ip: "172.16.32.45"
        },
        {
            id: 3,
            timestamp: "2025-05-19 14:23:56",
            user: "Admin User",
            action: "Content Published",
            details: "New teaching: 'The Power of Prayer'",
            ip: "192.168.1.100"
        },
        {
            id: 4,
            timestamp: "2025-05-19 11:05:22",
            user: "Sarah Johnson",
            action: "Financial Approval",
            details: "Approved $1,200 for outreach materials",
            ip: "172.16.32.47"
        },
        {
            id: 5,
            timestamp: "2025-05-18 16:37:44",
            user: "Admin User",
            action: "System Maintenance",
            details: "Performed database backup",
            ip: "192.168.1.100"
        },
        {
            id: 6,
            timestamp: "2025-05-18 10:12:19",
            user: "David Thompson",
            action: "Member Registration",
            details: "Approved new member: Michael Brown",
            ip: "172.16.32.49"
        },
        {
            id: 7,
            timestamp: "2025-05-17 13:55:03",
            user: "Admin User",
            action: "Report Generated",
            details: "Exported member data to CSV",
            ip: "192.168.1.100"
        }
    ];

    // Pagination variables for audit logs
    let currentAuditPage = 1;
    const auditLogsPerPage = 10;
    let filteredAuditLogs = [...auditLogs];

    // Initialize the page
    initTabs();
    renderSavedReports();
    renderScheduledReports();
    renderDataExports();
    renderAuditLogs();
    initCharts();

    // Event listeners
    tabButtons.forEach(button => {
        button.addEventListener('click', () => switchTab(button.dataset.tab));
    });

    generateReportBtn.addEventListener('click', () => generateModal.classList.add('show'));
    scheduleReportBtn.addEventListener('click', () => scheduleModal.classList.add('show'));
    exportDataBtn.addEventListener('click', () => exportModal.classList.add('show'));
    createFirstReportBtn.addEventListener('click', () => generateModal.classList.add('show'));
    scheduleFirstReportBtn.addEventListener('click', () => scheduleModal.classList.add('show'));
    createFirstExportBtn.addEventListener('click', () => exportModal.classList.add('show'));

    closeGenerateBtn.addEventListener('click', () => generateModal.classList.remove('show'));
    closeScheduleBtn.addEventListener('click', () => scheduleModal.classList.remove('show'));
    closeExportBtn.addEventListener('click', () => exportModal.classList.remove('show'));
    cancelGenerateBtn.addEventListener('click', () => generateModal.classList.remove('show'));
    cancelScheduleBtn.addEventListener('click', () => scheduleModal.classList.remove('show'));
    cancelExportBtn.addEventListener('click', () => exportModal.classList.remove('show'));

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

    submitExportBtn.addEventListener('click', function(e) {
        e.preventDefault();
        exportData();
        exportModal.classList.remove('show');
    });

    applyAuditFiltersBtn.addEventListener('click', function() {
        filterAuditLogs();
    });

    exportAuditBtn.addEventListener('click', function() {
        exportAuditData();
    });

    auditPrevBtn.addEventListener('click', function() {
        if (currentAuditPage > 1) {
            currentAuditPage--;
            renderAuditLogs();
        }
    });

    auditNextBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredAuditLogs.length / auditLogsPerPage);
        if (currentAuditPage < totalPages) {
            currentAuditPage++;
            renderAuditLogs();
        }
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

    function renderAuditLogs() {
        const container = document.getElementById('audit-log-entries');
        container.innerHTML = '';

        const startIndex = (currentAuditPage - 1) * auditLogsPerPage;
        const endIndex = startIndex + auditLogsPerPage;
        const paginatedLogs = filteredAuditLogs.slice(startIndex, endIndex);

        paginatedLogs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDateTime(log.timestamp)}</td>
                <td>${log.user}</td>
                <td>${log.action}</td>
                <td>${log.details}</td>
                <td>${log.ip}</td>
            `;
            container.appendChild(row);
        });

        // Update pagination info
        const totalPages = Math.ceil(filteredAuditLogs.length / auditLogsPerPage);
        auditPageInfo.textContent = `Page ${currentAuditPage} of ${totalPages}`;

        // Disable/enable pagination buttons
        auditPrevBtn.disabled = currentAuditPage === 1;
        auditNextBtn.disabled = currentAuditPage === totalPages || totalPages === 0;
    }

    function filterAuditLogs() {
        const actionFilter = document.getElementById('audit-action').value;
        const userFilter = document.getElementById('audit-user').value;
        const startDate = document.getElementById('audit-start-date').value;
        const endDate = document.getElementById('audit-end-date').value;

        filteredAuditLogs = auditLogs.filter(log => {
            // Filter by action type
            if (actionFilter !== 'all') {
                const actionMatch = log.action.toLowerCase().includes(actionFilter.toLowerCase());
                if (!actionMatch) return false;
            }

            // Filter by user
            if (userFilter !== 'all') {
                const userMatch = log.user.toLowerCase().includes(userFilter.toLowerCase());
                if (!userMatch) return false;
            }

            // Filter by date range
            if (startDate) {
                const logDate = log.timestamp.split(' ')[0];
                if (logDate < startDate) return false;
            }

            if (endDate) {
                const logDate = log.timestamp.split(' ')[0];
                if (logDate > endDate) return false;
            }

            return true;
        });

        currentAuditPage = 1;
        renderAuditLogs();
    }

    function exportAuditData() {
        // In a real app, this would export the filtered audit logs
        alert(`Exporting ${filteredAuditLogs.length} audit log entries`);
    }

    function generateReport() {
        const reportName = document.getElementById('report-name').value;
        const reportType = document.getElementById('report-type').value;
        const reportRegion = document.getElementById('report-region').value;
        const startDate = document.getElementById('report-start-date').value;
        const endDate = document.getElementById('report-end-date').value;
        const reportFormat = document.getElementById('report-format').value;
        const saveTemplate = document.getElementById('save-template').checked;

        // In a real app, this would generate the actual report
        alert(`Generating ${reportType} report for ${reportRegion} from ${startDate} to ${endDate}`);

        // Add to saved reports if checked
        if (saveTemplate) {
            const newReport = {
                id: savedReports.length + 1,
                title: reportName,
                description: `${reportType} report for ${reportRegion}`,
                type: reportType,
                category: "Custom Report",
                date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                period: "custom",
                author: "Admin User",
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
                 reportName.includes('Financial') ? 'financial' :
                 reportName.includes('System') ? 'system' : 'audit',
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

    function exportData() {
        const exportType = document.getElementById('export-type').value;
        const exportRegion = document.getElementById('export-region').value;
        const startDate = document.getElementById('export-start-date').value;
        const endDate = document.getElementById('export-end-date').value;
        const exportFormat = document.getElementById('export-format').value;
        const includeSensitive = document.getElementById('include-sensitive').checked;

        // In a real app, this would export the data
        alert(`Exporting ${exportType} data for ${exportRegion} in ${exportFormat} format${includeSensitive ? ' (including sensitive data)' : ''}`);
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

    function formatDateTime(dateTimeString) {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(dateTimeString).toLocaleDateString(undefined, options);
    }

    function initCharts() {
        // System Usage Chart
        const usageCtx = document.getElementById('usage-chart').getContext('2d');
        const usageChart = new Chart(usageCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Active Users',
                        data: [420, 590, 670, 720, 840, 900],
                        borderColor: '#4a6bdf',
                        backgroundColor: 'rgba(74, 107, 223, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Content Views',
                        data: [1200, 1900, 1700, 2200, 2400, 2000],
                        borderColor: '#3bb54a',
                        backgroundColor: 'rgba(59, 181, 74, 0.1)',
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'API Requests',
                        data: [8500, 11000, 9500, 13000, 15000, 12000],
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

        // Member Distribution Chart
        const membersCtx = document.getElementById('members-chart').getContext('2d');
        const membersChart = new Chart(membersCtx, {
            type: 'bar',
            data: {
                labels: ['Northern', 'Eastern', 'Southern', 'Western', 'Central'],
                datasets: [{
                    label: 'Members by Region',
                    data: [320, 450, 380, 240, 580],
                    backgroundColor: [
                        'rgba(74, 107, 223, 0.7)',
                        'rgba(59, 181, 74, 0.7)',
                        'rgba(229, 64, 123, 0.7)',
                        'rgba(248, 156, 28, 0.7)',
                        'rgba(142, 68, 173, 0.7)'
                    ],
                    borderColor: [
                        'rgba(74, 107, 223, 1)',
                        'rgba(59, 181, 74, 1)',
                        'rgba(229, 64, 123, 1)',
                        'rgba(248, 156, 28, 1)',
                        'rgba(142, 68, 173, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Financial Chart
        const financeCtx = document.getElementById('finance-chart').getContext('2d');
        const financeChart = new Chart(financeCtx, {
            type: 'bar',
            data: {
                labels: ['Giving', 'Expenses', 'Outreach', 'Operations', 'Savings'],
                datasets: [{
                    label: 'Amount ($)',
                    data: [24580, 18700, 4500, 9200, 2180],
                    backgroundColor: [
                        'rgba(59, 181, 74, 0.7)',
                        'rgba(229, 64, 123, 0.7)',
                        'rgba(74, 107, 223, 0.7)',
                        'rgba(248, 156, 28, 0.7)',
                        'rgba(142, 68, 173, 0.7)'
                    ],
                    borderColor: [
                        'rgba(59, 181, 74, 1)',
                        'rgba(229, 64, 123, 1)',
                        'rgba(74, 107, 223, 1)',
                        'rgba(248, 156, 28, 1)',
                        'rgba(142, 68, 173, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
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
        document.querySelectorAll('.chart-period, .chart-region, .chart-team').forEach(select => {
            select.addEventListener('change', function() {
                // In a real app, this would fetch new data and update the charts
                console.log(`Updating chart with ${this.value} data`);
            });
        });
    }
});