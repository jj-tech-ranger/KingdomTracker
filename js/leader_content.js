document.addEventListener('DOMContentLoaded', function() {
    // Enhanced content data with team-specific fields
    const contentItems = [
        {
            id: 1,
            title: "Sunday Sermon: The Power of Prayer",
            description: "Pastor John's sermon from last Sunday about developing a powerful prayer life.",
            category: "sermons",
            type: "video",
            date: "2 days ago",
            author: "Pastor John",
            views: 124,
            featured: true,
            thumbnail: "../img/sermon_thumb.png",
            assignedTo: ["youth", "worship"],
            dueDate: "2023-07-15",
            leaderNotes: "Great for new believers",
            engagement: {
                viewed: 18,
                completed: 15,
                comments: 7
            }
        },
        {
            id: 2,
            title: "Worship Set - June 2023",
            description: "Complete worship set with lyrics and chords for our June services.",
            category: "worship",
            type: "audio",
            date: "1 week ago",
            author: "Worship Team",
            views: 89,
            featured: false,
            thumbnail: "../img/worship_thumb.png",
            assignedTo: ["worship"],
            leaderOnly: true,
            engagement: {
                viewed: 8,
                completed: 8,
                comments: 2
            }
        },
        {
            id: 3,
            title: "Bible Study Guide - Philippians",
            description: "Complete study guide for our small group study of Philippians.",
            category: "documents",
            type: "pdf",
            date: "2 weeks ago",
            downloads: 56,
            featured: false,
            thumbnail: "../img/study_thumb.png",
            assignedTo: ["youth", "outreach"],
            dueDate: "2023-07-10",
            leaderNotes: "Focus on chapter 2 this week",
            engagement: {
                viewed: 22,
                completed: 18,
                comments: 5
            }
        },
        {
            id: 4,
            title: "Summer Youth Retreat Flyer",
            description: "Official flyer for our upcoming youth retreat in July.",
            category: "events",
            type: "image",
            date: "3 weeks ago",
            downloads: 42,
            featured: true,
            thumbnail: "../img/event_thumb.png",
            engagement: {
                viewed: 24,
                completed: 24,
                comments: 3
            }
        },
        {
            id: 5,
            title: "Sarah's Testimony of Healing",
            description: "Sarah shares her powerful testimony of physical and spiritual healing.",
            category: "testimonies",
            type: "video",
            date: "1 month ago",
            views: 215,
            featured: false,
            thumbnail: "../img/testimony_thumb.png",
            assignedTo: ["all"],
            engagement: {
                viewed: 24,
                completed: 24,
                comments: 12
            }
        },
        {
            id: 6,
            title: "Financial Stewardship Guidelines",
            description: "Biblical principles for managing finances God's way.",
            category: "documents",
            type: "pdf",
            date: "1 month ago",
            downloads: 78,
            featured: false,
            thumbnail: "../img/finance_thumb.png",
            leaderOnly: true,
            engagement: {
                viewed: 16,
                completed: 12,
                comments: 4
            }
        }
    ];

    // Team members data
    const teamMembers = [
        { id: 1, name: "John Doe", group: "youth", lastActive: "2023-06-28" },
        { id: 2, name: "Jane Smith", group: "worship", lastActive: "2023-06-30" },
        { id: 3, name: "Mike Johnson", group: "outreach", lastActive: "2023-06-25" },
        { id: 4, name: "Sarah Williams", group: "youth", lastActive: "2023-06-29" },
        { id: 5, name: "David Brown", group: "worship", lastActive: "2023-06-30" },
        { id: 6, name: "Emily Davis", group: "outreach", lastActive: "2023-06-20" }
    ];

    const contentGrid = document.getElementById('content-grid');
    const emptyState = document.getElementById('empty-state');
    const uploadBtn = document.getElementById('upload-content');
    const uploadEmptyBtn = document.getElementById('upload-empty');
    const closeUploadBtn = document.getElementById('close-upload');
    const cancelUploadBtn = document.getElementById('cancel-upload');
    const submitUploadBtn = document.getElementById('submit-upload');
    const uploadModal = document.getElementById('upload-modal');
    const filterCategory = document.getElementById('filter-category');
    const sortBy = document.getElementById('sort-by');
    const contentSearch = document.getElementById('content-search');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const assignBtn = document.getElementById('assign-content');
    const assignModal = document.getElementById('assign-modal');
    const closeAssignBtn = document.getElementById('close-assign');
    const cancelAssignBtn = document.getElementById('cancel-assign');
    const submitAssignBtn = document.getElementById('submit-assign');
    const assignTeamSelect = document.getElementById('assign-team');
    const assignIndividualsSelect = document.getElementById('assign-individuals');
    const exportReportBtn = document.getElementById('export-report');
    const requestModal = document.getElementById('request-modal');
    const submitRequestBtn = document.getElementById('submit-request');
    const cancelRequestBtn = document.getElementById('cancel-request');
    const closeRequestBtn = document.getElementById('close-request');

    let currentContent = [...contentItems];
    let selectedContent = [];

    // Initialize the page
    renderContent(currentContent);
    updateEmptyState();
    populateAssignContentSelect();

    // Upload content button
    uploadBtn.addEventListener('click', function() {
        uploadModal.classList.add('show');
    });

    uploadEmptyBtn.addEventListener('click', function() {
        uploadModal.classList.add('show');
    });

    // Close upload modal
    closeUploadBtn.addEventListener('click', function() {
        uploadModal.classList.remove('show');
    });

    cancelUploadBtn.addEventListener('click', function() {
        uploadModal.classList.remove('show');
    });

    // Submit upload form
    submitUploadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const title = document.getElementById('content-title').value;
        const description = document.getElementById('content-description').value;
        const category = document.getElementById('content-category').value;
        const featured = document.getElementById('featured-content').checked;
        const leaderOnly = document.getElementById('leader-only').checked;

        if (!title || !category) {
            alert('Please fill in all required fields');
            return;
        }

        // In a real app, you would upload the file here
        const newContent = {
            id: contentItems.length + 1,
            title: title,
            description: description,
            category: category,
            type: "pdf", // This would be determined by the file type
            date: "Just now",
            author: "You",
            downloads: 0,
            featured: featured,
            leaderOnly: leaderOnly,
            thumbnail: "../img/default_thumb.jpg",
            engagement: {
                viewed: 0,
                completed: 0,
                comments: 0
            }
        };

        contentItems.unshift(newContent);
        currentContent.unshift(newContent);

        renderContent(currentContent);
        updateEmptyState();
        uploadModal.classList.remove('show');
        document.getElementById('upload-form').reset();

        alert('Content uploaded successfully!');
    });

    // Assign content button
    assignBtn.addEventListener('click', function() {
        assignModal.classList.add('show');
    });

    // Close assign modal
    closeAssignBtn.addEventListener('click', function() {
        assignModal.classList.remove('show');
    });

    cancelAssignBtn.addEventListener('click', function() {
        assignModal.classList.remove('show');
    });

    // Team selection change
    assignTeamSelect.addEventListener('change', function() {
        if (this.value === "individuals") {
            document.getElementById('individuals-select').style.display = 'block';
            populateAssignIndividualsSelect();
        } else {
            document.getElementById('individuals-select').style.display = 'none';
        }
    });

    // Submit assign form
    submitAssignBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const contentId = parseInt(document.getElementById('assign-content-select').value);
        const assignTo = document.getElementById('assign-team').value;
        const dueDate = document.getElementById('assign-due-date').value;
        const message = document.getElementById('assign-message').value;

        if (!contentId || !assignTo) {
            alert('Please select content and assignment target');
            return;
        }

        // Find the content item
        const contentItem = contentItems.find(item => item.id === contentId);

        if (contentItem) {
            // Update assignment info
            if (assignTo === "individuals") {
                const selectedIndividuals = Array.from(document.getElementById('assign-individuals').selectedOptions)
                    .map(option => option.value);
                contentItem.assignedTo = selectedIndividuals;
            } else {
                contentItem.assignedTo = [assignTo];
            }

            if (dueDate) {
                contentItem.dueDate = dueDate;
            }

            alert(`Content "${contentItem.title}" assigned successfully!`);
            assignModal.classList.remove('show');
            document.getElementById('assign-form').reset();
            filterAndSortContent();
        }
    });

    // Export report button
    exportReportBtn.addEventListener('click', function() {
        alert('Exporting team engagement report...');
        // In a real app, this would generate and download a report
    });

    // Request content button
    document.getElementById('request-content').addEventListener('click', function() {
        requestModal.classList.add('show');
    });

    // Close request modal
    closeRequestBtn.addEventListener('click', function() {
        requestModal.classList.remove('show');
    });

    cancelRequestBtn.addEventListener('click', function() {
        requestModal.classList.remove('show');
    });

    // Submit request form
    submitRequestBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const title = document.getElementById('request-title').value;
        const category = document.getElementById('request-category').value;
        const description = document.getElementById('request-description').value;

        if (!title || !category || !description) {
            alert('Please fill in all required fields');
            return;
        }

        alert('Content request submitted successfully!');
        requestModal.classList.remove('show');
        document.getElementById('request-form').reset();
    });

    // Filter by category
    filterCategory.addEventListener('change', function() {
        filterAndSortContent();
    });

    // Sort content
    sortBy.addEventListener('change', function() {
        filterAndSortContent();
    });

    // Search content
    contentSearch.addEventListener('input', function() {
        filterAndSortContent();
    });

    // Tab filtering
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterAndSortContent();
        });
    });

    // Populate assign content select
    function populateAssignContentSelect() {
        const select = document.getElementById('assign-content-select');
        select.innerHTML = '<option value="">Choose content to assign</option>';

        contentItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = item.title;
            select.appendChild(option);
        });
    }

    // Populate assign individuals select
    function populateAssignIndividualsSelect() {
        const select = document.getElementById('assign-individuals');
        select.innerHTML = '';

        teamMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.name;
            select.appendChild(option);
        });
    }

    // Filter and sort content based on current filters
    function filterAndSortContent() {
        let filtered = [...contentItems];
        const searchTerm = contentSearch.value.toLowerCase();
        const categoryFilter = filterCategory.value;
        const sortValue = sortBy.value;
        const activeTab = document.querySelector('.tab-btn.active').dataset.filter;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm)
            );
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(item => item.category === categoryFilter);
        }

        // Apply tab filter
        switch (activeTab) {
            case 'recent':
                // Already sorted by newest by default
                break;
            case 'featured':
                filtered = filtered.filter(item => item.featured);
                break;
            case 'mine':
                filtered = filtered.filter(item => item.author === "You");
                break;
            case 'assigned':
                filtered = filtered.filter(item => item.assignedTo && item.assignedTo.length > 0);
                break;
            case 'leader':
                filtered = filtered.filter(item => item.leaderOnly);
                break;
        }

        // Apply sorting
        switch (sortValue) {
            case 'newest':
                // Already sorted by newest by default
                break;
            case 'oldest':
                filtered.reverse();
                break;
            case 'popular':
                filtered.sort((a, b) => {
                    const aValue = a.views || a.downloads || 0;
                    const bValue = b.views || b.downloads || 0;
                    return bValue - aValue;
                });
                break;
            case 'alphabetical':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        currentContent = filtered;
        renderContent(filtered);
        updateEmptyState();
    }

    // Render content to the DOM
    function renderContent(contentToRender) {
        contentGrid.innerHTML = '';

        contentToRender.forEach(item => {
            const contentItem = document.createElement('div');
            contentItem.className = 'content-item';
            if (item.leaderOnly) {
                contentItem.classList.add('leader-only');
            }

            // Determine icon based on type
            let icon, actionText;
            switch (item.type) {
                case 'video':
                    icon = '<i class="fas fa-play"></i>';
                    actionText = 'Watch';
                    break;
                case 'audio':
                    icon = '<i class="fas fa-music"></i>';
                    actionText = 'Listen';
                    break;
                case 'pdf':
                    icon = '<i class="fas fa-file-pdf"></i>';
                    actionText = 'Download';
                    break;
                case 'image':
                    icon = '<i class="fas fa-image"></i>';
                    actionText = 'View';
                    break;
                default:
                    icon = '<i class="fas fa-file"></i>';
                    actionText = 'Open';
            }

            // Determine badge color based on category
            let badgeClass;
            switch (item.category) {
                case 'sermons':
                    badgeClass = 'system';
                    break;
                case 'worship':
                    badgeClass = 'team';
                    break;
                case 'documents':
                    badgeClass = 'finance';
                    break;
                case 'events':
                    badgeClass = 'events';
                    break;
                case 'testimonies':
                    badgeClass = 'messages';
                    break;
                default:
                    badgeClass = 'system';
            }

            // Assignment info
            let assignmentInfo = '';
            if (item.assignedTo && item.assignedTo.length > 0) {
                const assignedGroups = item.assignedTo.map(group => {
                    switch(group) {
                        case 'youth': return 'Youth';
                        case 'worship': return 'Worship';
                        case 'outreach': return 'Outreach';
                        case 'all': return 'All Teams';
                        default: return group;
                    }
                }).join(', ');

                assignmentInfo = `<div class="assignment-info">
                    <i class="fas fa-user-check"></i> Assigned to: ${assignedGroups}
                    ${item.dueDate ? `| Due: ${new Date(item.dueDate).toLocaleDateString()}` : ''}
                </div>`;
            }

            // Engagement stats
            let engagementStats = '';
            if (item.engagement) {
                engagementStats = `<div class="engagement-stats">
                    <span><i class="fas fa-eye"></i> ${item.engagement.viewed}</span>
                    <span><i class="fas fa-check-circle"></i> ${item.engagement.completed}</span>
                    <span><i class="fas fa-comment"></i> ${item.engagement.comments}</span>
                </div>`;
            }

            contentItem.innerHTML = `
                <div class="content-thumbnail">
                    ${item.thumbnail ? `<img src="${item.thumbnail}" alt="${item.title}">` : icon}
                    ${item.featured ? '<div class="content-badge">Featured</div>' : ''}
                    ${item.leaderOnly ? '<div class="leader-badge">Leader Only</div>' : ''}
                </div>
                <div class="content-details">
                    <h3 class="content-title">${item.title}</h3>
                    <p class="content-description">${item.description}</p>
                    ${assignmentInfo}
                    ${engagementStats}
                    <div class="content-meta">
                        <span>${item.author}</span>
                        <span>${item.date}</span>
                    </div>
                    <div class="content-actions">
                        <button class="content-btn" data-id="${item.id}">
                            ${icon} ${actionText}
                        </button>
                        <button class="content-btn btn-assign" data-id="${item.id}">
                            <i class="fas fa-user-plus"></i> Assign
                        </button>
                        ${item.leaderOnly ? '' : `<button class="content-btn">
                            <i class="fas fa-share-alt"></i> Share
                        </button>`}
                    </div>
                </div>
            `;

            contentGrid.appendChild(contentItem);
        });

        // Add event listeners to content buttons
        document.querySelectorAll('.content-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const id = parseInt(this.dataset.id);
                const contentItem = contentItems.find(item => item.id === id);

                if (contentItem) {
                    if (this.classList.contains('btn-assign')) {
                        // Handle assign button
                        document.getElementById('assign-content-select').value = id;
                        assignModal.classList.add('show');
                    } else {
                        // Handle regular open button
                        alert(`Opening: ${contentItem.title}`);
                        // In a real app, this would open the content
                    }
                }
            });
        });
    }

    // Update empty state visibility
    function updateEmptyState() {
        if (currentContent.length === 0) {
            emptyState.style.display = 'block';
            contentGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            contentGrid.style.display = 'grid';
        }
    }
});