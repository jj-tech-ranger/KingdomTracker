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
            file: "reports/financial-april-2025.pdf"
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
            file: "reports/attendance-q1-2025.pdf"
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
            file: "reports/easter-2025.pdf"
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
            file: "reports/discipleship-q1-2025.pdf"
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
            file: "reports/donations-2024.pdf"
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
            file: "reports/youth-march-2025.pdf"
        }
    ];

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

    let currentReports = [...reports];
    let currentReport = null;

    // Initialize the page
    renderReports(currentReports);
    updateEmptyState();

    // Filter by type
    filterType.addEventListener('change', function() {
        filterAndSortReports();
    });

    // Filter by period
    filterPeriod.addEventListener('change', function() {
        filterAndSortReports();
    });

    // Sort reports
    sortBy.addEventListener('change', function() {
        filterAndSortReports();
    });

    // Search reports
    reportSearch.addEventListener('input', function() {
        filterAndSortReports();
    });

    // Close modal buttons
    closeReportBtn.addEventListener('click', function() {
        reportModal.classList.remove('show');
    });

    closeReportFooterBtn.addEventListener('click', function() {
        reportModal.classList.remove('show');
    });

    // Download report
    downloadReportBtn.addEventListener('click', function() {
        if (currentReport) {
            // In a real app, this would trigger a download
            const link = document.createElement('a');
            link.href = currentReport.file;
            link.download = currentReport.title.toLowerCase().replace(/ /g, '-') + '.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    });

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
                report.author.toLowerCase().includes(searchTerm)
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

            // Determine icon based on type
            let iconClass;
            switch (report.type) {
                case 'financial':
                    iconClass = 'financial';
                    break;
                case 'attendance':
                    iconClass = 'attendance';
                    break;
                case 'events':
                    iconClass = 'events';
                    break;
                case 'discipleship':
                    iconClass = 'discipleship';
                    break;
                case 'donations':
                    iconClass = 'donations';
                    break;
                default:
                    iconClass = 'financial';
            }

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
});