document.addEventListener('DOMContentLoaded', function() {
    // Sample content data
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
            thumbnail: "../img/sermon_thumb.png"
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
            thumbnail: "../img/worship_thumb.png"
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
            thumbnail: "../img/study_thumb.png"
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
            thumbnail: "../img/event_thumb.png"
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
            thumbnail: "../img/testimony_thumb.png"
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
            thumbnail: "../img/finance_thumb.png"
        }
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

    let currentContent = [...contentItems];
    let selectedContent = [];

    // Initialize the page
    renderContent(currentContent);
    updateEmptyState();

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
            thumbnail: "../img/default_thumb.jpg"
        };

        contentItems.unshift(newContent);
        currentContent.unshift(newContent);

        renderContent(currentContent);
        updateEmptyState();
        uploadModal.classList.remove('show');
        document.getElementById('upload-form').reset();

        alert('Content uploaded successfully!');
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

            contentItem.innerHTML = `
                <div class="content-thumbnail">
                    ${item.thumbnail ? `<img src="${item.thumbnail}" alt="${item.title}">` : icon}
                    ${item.featured ? '<div class="content-badge">Featured</div>' : ''}
                </div>
                <div class="content-details">
                    <h3 class="content-title">${item.title}</h3>
                    <p class="content-description">${item.description}</p>
                    <div class="content-meta">
                        <span>${item.author}</span>
                        <span>${item.date}</span>
                    </div>
                    <div class="content-actions">
                        <button class="content-btn" data-id="${item.id}">
                            ${icon} ${actionText}
                        </button>
                        <button class="content-btn">
                            <i class="fas fa-share-alt"></i> Share
                        </button>
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
                    alert(`Opening: ${contentItem.title}`);
                    // In a real app, this would open the content
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