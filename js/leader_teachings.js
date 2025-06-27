document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        grid: document.getElementById('teachings-grid'),
        emptyState: document.getElementById('empty-state'),
        filterCategory: document.getElementById('filter-category'),
        sortBy: document.getElementById('sort-by'),
        searchInput: document.getElementById('teaching-search'),
        tabButtons: document.querySelectorAll('.tab-btn'),
        newTeachingBtn: document.getElementById('new-teaching'),
        addFirstTeachingBtn: document.getElementById('add-first-teaching'),
        exportReportBtn: document.getElementById('export-teaching-report'),
        modal: document.getElementById('teaching-modal'),
        closeModalBtn: document.getElementById('close-teaching'),
        modalTitle: document.querySelector('.teaching-modal-content .teaching-title'),
        modalDescription: document.querySelector('.teaching-modal-content .teaching-description'),
        modalMeta: document.querySelector('.teaching-modal-content .teaching-meta'),
        modalScriptures: document.querySelector('.teaching-modal-content .scripture-references ul'),
        modalTags: document.querySelector('.teaching-modal-content .teaching-tags'),
        commentForm: document.querySelector('.comment-form'),
        commentsList: document.querySelector('.comments-list'),
        editTeachingBtn: document.getElementById('edit-teaching'),
        deleteTeachingBtn: document.getElementById('delete-teaching'),
        newTeachingModal: document.getElementById('new-teaching-modal'),
        closeNewTeachingModal: document.getElementById('close-new-teaching'),
        saveDraftBtn: document.getElementById('save-draft'),
        publishTeachingBtn: document.getElementById('publish-teaching'),
        addResourceModal: document.getElementById('add-resource-modal'),
        closeResourceModal: document.getElementById('close-resource-modal'),
        submitResourceBtn: document.getElementById('submit-resource'),
        addResourceBtn: document.querySelector('.btn-add-resource'),
        resourcesGrid: document.querySelector('.resources-grid')
    };

    // Sample teaching data (expanded for leader view)
    const teachings = [
        {
            id: 1,
            title: "The Power of Prayer in Difficult Times",
            description: "Pastor John shares powerful insights on maintaining a prayerful life during challenging seasons.",
            category: "sermons",
            type: "video",
            date: "June 15, 2023",
            speaker: "Pastor John",
            duration: "45:22",
            views: 1245,
            likes: 87,
            featured: true,
            visibility: "public",
            thumbnail: "../img/teaching1.png",
            tags: ["Prayer", "Faith", "Spiritual Growth"],
            scripture: ["Philippians 4:6-7", "James 5:13-16", "Matthew 6:5-15"],
            resources: [
                {
                    id: 1,
                    title: "Prayer Guide.pdf",
                    type: "pdf",
                    size: "1.2 MB",
                    url: "#",
                    downloadable: true
                },
                {
                    id: 2,
                    title: "Discussion Questions.docx",
                    type: "word",
                    size: "850 KB",
                    url: "#",
                    downloadable: true
                }
            ],
            comments: [
                {
                    id: 101,
                    author: "Sarah Johnson",
                    avatar: "../img/user2.png",
                    date: "2 days ago",
                    text: "This teaching came at just the right time for me. The point about persistent prayer really spoke to my heart.",
                    likes: 5,
                    pinned: true,
                    replies: [
                        {
                            id: 201,
                            author: "Michael Chen",
                            avatar: "../img/user3.png",
                            date: "1 day ago",
                            text: "I agree Sarah! That same point stood out to me too.",
                            likes: 2
                        }
                    ]
                },
                {
                    id: 102,
                    author: "David Wilson",
                    avatar: "../img/user4.jpg",
                    date: "3 days ago",
                    text: "Does anyone have the reference to that book Pastor John mentioned about prayer?",
                    likes: 1,
                    pinned: false,
                    replies: []
                }
            ]
        },
        {
            id: 2,
            title: "Foundations of Faith: Salvation",
            description: "Part 1 of our Foundations series covering the basics of salvation through Christ.",
            category: "bible-study",
            type: "video",
            date: "June 8, 2023",
            speaker: "Pastor Mark",
            duration: "38:15",
            views: 892,
            likes: 45,
            featured: false,
            visibility: "public",
            series: "Foundations of Faith",
            thumbnail: "../img/teaching2.png",
            tags: ["Salvation", "Foundations", "Series"],
            scripture: ["Ephesians 2:8-9", "Romans 10:9-10", "John 3:16"],
            resources: [],
            comments: []
        },
        {
            id: 3,
            title: "Leadership Principles from Nehemiah",
            description: "Exclusive leadership training for ministry leaders based on the book of Nehemiah.",
            category: "leadership",
            type: "audio",
            date: "May 28, 2023",
            speaker: "Pastor Sarah",
            duration: "52:40",
            views: 156,
            likes: 23,
            featured: false,
            visibility: "department",
            thumbnail: "../img/teaching3.png",
            tags: ["Leadership", "Nehemiah", "Ministry"],
            scripture: ["Nehemiah 1-2", "Nehemiah 4:14", "Nehemiah 6:3"],
            resources: [
                {
                    id: 3,
                    title: "Leadership Workbook.pdf",
                    type: "pdf",
                    size: "2.1 MB",
                    url: "#",
                    downloadable: true
                }
            ],
            comments: []
        },
        {
            id: 4,
            title: "Youth Night: Peer Pressure",
            description: "Teaching for our youth group about standing firm against peer pressure.",
            category: "youth",
            type: "video",
            date: "May 20, 2023",
            speaker: "Youth Pastor Mike",
            duration: "35:18",
            views: 320,
            likes: 18,
            featured: false,
            visibility: "department",
            thumbnail: "../img/teaching4.png",
            tags: ["Youth", "Peer Pressure", "Teens"],
            scripture: ["Romans 12:2", "1 Corinthians 15:33", "Proverbs 13:20"],
            resources: [],
            comments: []
        },
        {
            id: 5,
            title: "Upcoming Vision Meeting (Private)",
            description: "Preview of vision and direction for leadership team only.",
            category: "leadership",
            type: "video",
            date: "May 15, 2023",
            speaker: "Pastor John",
            duration: "28:45",
            views: 24,
            likes: 5,
            featured: false,
            visibility: "private",
            thumbnail: "../img/teaching5.png",
            tags: ["Vision", "Leadership", "Private"],
            scripture: ["Proverbs 29:18", "Habakkuk 2:2-3"],
            resources: [],
            comments: []
        }
    ];

    // State management
    let state = {
        currentTeachings: [...teachings],
        selectedTeaching: null,
        activeFilters: {
            category: 'all',
            sort: 'newest',
            tab: 'all',
            search: ''
        },
        editingTeaching: null,
        draftTeachings: []
    };

    // Initialize the page
    function init() {
        renderTeachings();
        setupEventListeners();
        updateEmptyState();
    }

    // Set up all event listeners
    function setupEventListeners() {
        // New teaching buttons
        elements.newTeachingBtn.addEventListener('click', openNewTeachingModal);
        elements.addFirstTeachingBtn.addEventListener('click', openNewTeachingModal);

        // Export report
        elements.exportReportBtn.addEventListener('click', exportTeachingReport);

        // Modal close
        elements.closeModalBtn.addEventListener('click', closeTeachingModal);
        elements.closeNewTeachingModal.addEventListener('click', closeNewTeachingModal);
        elements.closeResourceModal.addEventListener('click', closeResourceModal);

        // Filter changes
        elements.filterCategory.addEventListener('change', (e) => {
            state.activeFilters.category = e.target.value;
            filterAndSortTeachings();
        });

        // Sort changes
        elements.sortBy.addEventListener('change', (e) => {
            state.activeFilters.sort = e.target.value;
            filterAndSortTeachings();
        });

        // Search input
        elements.searchInput.addEventListener('input', (e) => {
            state.activeFilters.search = e.target.value.toLowerCase();
            filterAndSortTeachings();
        });

        // Tab filtering
        elements.tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                elements.tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                state.activeFilters.tab = this.dataset.filter;
                filterAndSortTeachings();
            });
        });

        // Comment form submission
        elements.commentForm.addEventListener('submit', handleCommentSubmit);

        // Edit/delete teaching
        elements.editTeachingBtn.addEventListener('click', editSelectedTeaching);
        elements.deleteTeachingBtn.addEventListener('click', deleteSelectedTeaching);

        // Add resource
        elements.addResourceBtn.addEventListener('click', openAddResourceModal);
        elements.submitResourceBtn.addEventListener('click', handleAddResource);

        // Save/publish teaching
        elements.saveDraftBtn.addEventListener('click', saveTeachingAsDraft);
        elements.publishTeachingBtn.addEventListener('click', publishTeaching);

        // Handle clicks on dynamic elements
        document.addEventListener('click', function(e) {
            // Like button in modal
            if (e.target.closest('.btn-like')) {
                handleLikeTeaching();
            }

            // Play buttons on teaching cards
            if (e.target.closest('.teaching-play') ||
               (e.target.closest('.teaching-btn') && e.target.closest('.teaching-btn').querySelector('.fa-play'))) {
                const card = e.target.closest('.teaching-item');
                const id = parseInt(card.querySelector('.teaching-btn').dataset.id);
                const teaching = teachings.find(t => t.id === id);
                if (teaching) openTeachingModal(teaching);
            }

            // Pin comment
            if (e.target.closest('.comment-pin')) {
                const commentId = parseInt(e.target.closest('.comment-pin').closest('.comment').dataset.commentId);
                togglePinComment(commentId);
            }

            // Delete comment
            if (e.target.closest('.comment-delete')) {
                const commentId = parseInt(e.target.closest('.comment-delete').closest('.comment').dataset.commentId);
                deleteComment(commentId);
            }

            // Delete resource
            if (e.target.closest('.btn-delete-resource')) {
                const resourceId = parseInt(e.target.closest('.btn-delete-resource').closest('.resource-card').dataset.resourceId);
                deleteResource(resourceId);
            }

            // Add new series
            if (e.target.closest('.add-series')) {
                createNewSeries();
            }
        });
    }

    // Filter and sort teachings based on current filters
    function filterAndSortTeachings() {
        let filtered = [...teachings, ...state.draftTeachings];

        // Apply search filter
        if (state.activeFilters.search) {
            filtered = filtered.filter(teaching =>
                teaching.title.toLowerCase().includes(state.activeFilters.search) ||
                teaching.description.toLowerCase().includes(state.activeFilters.search) ||
                teaching.speaker.toLowerCase().includes(state.activeFilters.search) ||
                (teaching.tags && teaching.tags.some(tag => tag.toLowerCase().includes(state.activeFilters.search)))
            );
        }

        // Apply category filter
        if (state.activeFilters.category !== 'all') {
            filtered = filtered.filter(teaching => teaching.category === state.activeFilters.category);
        }

        // Apply tab filter
        switch (state.activeFilters.tab) {
            case 'featured':
                filtered = filtered.filter(teaching => teaching.featured);
                break;
            case 'series':
                filtered = filtered.filter(teaching => teaching.series);
                break;
            case 'recent':
                // Already sorted by newest by default
                break;
            case 'drafts':
                filtered = state.draftTeachings;
                break;
        }

        // Apply sorting
        switch (state.activeFilters.sort) {
            case 'newest':
                // Already in order
                break;
            case 'oldest':
                filtered.reverse();
                break;
            case 'popular':
                filtered.sort((a, b) => b.views - a.views);
                break;
            case 'series':
                filtered.sort((a, b) => {
                    const aSeries = a.series ? 1 : 0;
                    const bSeries = b.series ? 1 : 0;
                    return bSeries - aSeries || b.views - a.views;
                });
                break;
        }

        state.currentTeachings = filtered;
        renderTeachings();
        updateEmptyState();
    }

    // Render teachings to the grid
    function renderTeachings() {
        elements.grid.innerHTML = '';

        if (state.currentTeachings.length === 0) {
            updateEmptyState();
            return;
        }

        state.currentTeachings.forEach(teaching => {
            const isDraft = state.draftTeachings.some(d => d.id === teaching.id);

            const teachingItem = document.createElement('div');
            teachingItem.className = 'teaching-item';
            if (isDraft) teachingItem.classList.add('draft');

            teachingItem.innerHTML = `
                <div class="teaching-thumbnail">
                    <img src="${teaching.thumbnail}" alt="${teaching.title}">
                    <div class="teaching-play">
                        <i class="fas fa-play"></i>
                    </div>
                    ${teaching.duration ? `<div class="teaching-duration">${teaching.duration}</div>` : ''}
                    ${isDraft ? '<div class="teaching-draft">DRAFT</div>' : ''}
                </div>
                <div class="teaching-details">
                    <h3 class="teaching-title">${teaching.title}</h3>
                    <div class="teaching-meta">
                        <span><i class="fas fa-user"></i> ${teaching.speaker}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${teaching.date}</span>
                        ${teaching.views ? `<span><i class="fas fa-eye"></i> ${teaching.views}</span>` : ''}
                        ${teaching.likes ? `<span><i class="fas fa-heart"></i> ${teaching.likes}</span>` : ''}
                        <span class="visibility-badge ${teaching.visibility}">
                            <i class="fas ${getVisibilityIcon(teaching.visibility)}"></i> 
                            ${getVisibilityLabel(teaching.visibility)}
                        </span>
                    </div>
                    <p class="teaching-description">${teaching.description}</p>
                    <div class="teaching-actions">
                        <button class="teaching-btn" data-id="${teaching.id}">
                            <i class="fas fa-play"></i> ${isDraft ? 'Preview' : 'Watch'}
                        </button>
                        <button class="teaching-btn btn-edit">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="teaching-btn btn-delete">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
            elements.grid.appendChild(teachingItem);
        });
    }

    // Get visibility icon based on visibility setting
    function getVisibilityIcon(visibility) {
        switch (visibility) {
            case 'public': return 'fa-globe';
            case 'department': return 'fa-users';
            case 'private': return 'fa-lock';
            default: return 'fa-eye';
        }
    }

    // Get visibility label based on visibility setting
    function getVisibilityLabel(visibility) {
        switch (visibility) {
            case 'public': return 'Public';
            case 'department': return 'Department';
            case 'private': return 'Private';
            default: return visibility;
        }
    }

    // Open teaching modal with details
    function openTeachingModal(teaching) {
        state.selectedTeaching = teaching;

        // Update modal content
        elements.modalTitle.textContent = teaching.title;
        elements.modalDescription.innerHTML = `<p>${teaching.description}</p>`;

        // Update meta info
        elements.modalMeta.innerHTML = `
            <span><i class="fas fa-user"></i> ${teaching.speaker}</span>
            <span><i class="fas fa-calendar-alt"></i> ${teaching.date}</span>
            <span><i class="fas fa-eye"></i> ${teaching.views || 0} views</span>
            <span><i class="fas fa-heart"></i> ${teaching.likes || 0} likes</span>
            <span><i class="fas fa-comment"></i> ${teaching.comments ? teaching.comments.length : 0} comments</span>
            <span class="visibility-badge ${teaching.visibility}">
                <i class="fas ${getVisibilityIcon(teaching.visibility)}"></i> 
                ${getVisibilityLabel(teaching.visibility)}
            </span>
        `;

        // Update scripture references
        elements.modalScriptures.innerHTML = teaching.scripture.map(ref => `<li>${ref}</li>`).join('');

        // Update tags
        elements.modalTags.innerHTML = teaching.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

        // Update visibility controls
        document.querySelector(`input[name="visibility"][value="${teaching.visibility}"]`).checked = true;

        // Render resources
        renderResources(teaching.resources);

        // Render comments
        renderComments(teaching.comments);

        // Show modal
        elements.modal.classList.add('show');
    }

    // Close teaching modal
    function closeTeachingModal() {
        elements.modal.classList.remove('show');
        state.selectedTeaching = null;
    }

    // Open new teaching modal
    function openNewTeachingModal() {
        state.editingTeaching = null;
        document.getElementById('new-teaching-form').reset();
        document.getElementById('teaching-series').style.display = 'none';
        elements.newTeachingModal.classList.add('show');
    }

    // Close new teaching modal
    function closeNewTeachingModal() {
        elements.newTeachingModal.classList.remove('show');
    }

    // Open add resource modal
    function openAddResourceModal() {
        document.getElementById('add-resource-form').reset();
        elements.addResourceModal.classList.add('show');
    }

    // Close add resource modal
    function closeResourceModal() {
        elements.addResourceModal.classList.remove('show');
    }

    // Render resources section
    function renderResources(resources) {
        elements.resourcesGrid.innerHTML = '';

        if (!resources || resources.length === 0) {
            elements.resourcesGrid.innerHTML = `
                <div class="empty-resources">
                    <p>No resources attached to this teaching.</p>
                </div>
            `;
            return;
        }

        resources.forEach(resource => {
            const resourceEl = document.createElement('div');
            resourceEl.className = 'resource-card';
            resourceEl.dataset.resourceId = resource.id;

            let iconClass = 'fa-file';
            if (resource.type === 'pdf') iconClass = 'fa-file-pdf';
            else if (resource.type === 'word') iconClass = 'fa-file-word';
            else if (resource.type === 'image') iconClass = 'fa-file-image';

            resourceEl.innerHTML = `
                <div class="resource-icon">
                    <i class="fas ${iconClass}"></i>
                </div>
                <div class="resource-details">
                    <h4>${resource.title}</h4>
                    <p>${resource.size} • ${resource.type.toUpperCase()}</p>
                </div>
                <div class="resource-actions">
                    <button class="btn btn-small btn-download-resource">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn btn-small btn-delete-resource">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            elements.resourcesGrid.appendChild(resourceEl);
        });
    }

    // Render comments section
    function renderComments(comments) {
        elements.commentsList.innerHTML = '';

        if (!comments || comments.length === 0) {
            elements.commentsList.innerHTML = `
                <div class="empty-comments">
                    <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
            `;
            return;
        }

        // Sort comments with pinned first
        const sortedComments = [...comments].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

        sortedComments.forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            if (comment.pinned) commentEl.classList.add('pinned-comment');
            commentEl.dataset.commentId = comment.id;

            commentEl.innerHTML = `
                ${comment.pinned ? `
                    <div class="comment-pin-badge">
                        <i class="fas fa-thumbtack"></i> Pinned by Leader
                    </div>
                ` : ''}
                <img src="${comment.avatar}" alt="${comment.author}" class="comment-avatar">
                <div class="comment-content">
                    <div class="comment-header">
                        <span class="comment-author">${comment.author}</span>
                        <span class="comment-time">${comment.date}</span>
                    </div>
                    <p class="comment-text">${comment.text}</p>
                    <div class="comment-actions">
                        <button class="comment-like" data-comment-id="${comment.id}">
                            <i class="fas fa-heart"></i> ${comment.likes}
                        </button>
                        <button class="comment-reply">Reply</button>
                        <button class="comment-pin">
                            <i class="fas fa-thumbtack"></i> ${comment.pinned ? 'Unpin' : 'Pin'}
                        </button>
                        <button class="comment-delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    ${renderReplies(comment.replies)}
                </div>
            `;
            elements.commentsList.appendChild(commentEl);
        });
    }

    // Render comment replies
    function renderReplies(replies) {
        if (!replies || replies.length === 0) return '';

        return `
            <div class="comment-replies">
                ${replies.map(reply => `
                    <div class="comment reply" data-comment-id="${reply.id}">
                        <img src="${reply.avatar}" alt="${reply.author}" class="comment-avatar">
                        <div class="comment-content">
                            <div class="comment-header">
                                <span class="comment-author">${reply.author}</span>
                                <span class="comment-time">${reply.date}</span>
                            </div>
                            <p class="comment-text">${reply.text}</p>
                            <div class="comment-actions">
                                <button class="comment-like" data-comment-id="${reply.id}">
                                    <i class="fas fa-heart"></i> ${reply.likes}
                                </button>
                                <button class="comment-reply">Reply</button>
                                <button class="comment-delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // Handle comment submission
    function handleCommentSubmit(e) {
        e.preventDefault();
        const input = this.querySelector('.comment-input');
        const text = input.value.trim();

        if (!text) return;

        if (!state.selectedTeaching.comments) {
            state.selectedTeaching.comments = [];
        }

        // Add new comment
        const newComment = {
            id: Date.now(),
            author: "You",
            avatar: "../img/user1.png",
            date: "Just now",
            text: text,
            likes: 0,
            pinned: false,
            replies: []
        };

        state.selectedTeaching.comments.unshift(newComment);
        renderComments(state.selectedTeaching.comments);
        input.value = '';

        // In a real app, you would send this to your backend
    }

    // Toggle pin comment
    function togglePinComment(commentId) {
        const teaching = state.selectedTeaching;
        if (!teaching || !teaching.comments) return;

        const comment = teaching.comments.find(c => c.id === commentId);
        if (comment) {
            comment.pinned = !comment.pinned;
            renderComments(teaching.comments);
        }
    }

    // Delete comment
    function deleteComment(commentId) {
        const teaching = state.selectedTeaching;
        if (!teaching || !teaching.comments) return;

        if (confirm('Are you sure you want to delete this comment?')) {
            // Find and remove the comment
            teaching.comments = teaching.comments.filter(c => c.id !== commentId);
            renderComments(teaching.comments);
        }
    }

    // Handle adding a resource
    function handleAddResource() {
        const title = document.getElementById('resource-title').value.trim();
        const description = document.getElementById('resource-description').value.trim();
        const fileInput = document.getElementById('resource-file');
        const downloadable = document.getElementById('resource-downloadable').checked;

        if (!title || !fileInput.files || fileInput.files.length === 0) {
            alert('Please provide a title and select a file');
            return;
        }

        const file = fileInput.files[0];
        const fileType = file.type.split('/')[0];
        const resourceType = file.name.split('.').pop().toLowerCase();
        const size = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

        const newResource = {
            id: Date.now(),
            title: title,
            description: description,
            type: resourceType,
            size: size,
            downloadable: downloadable
        };

        if (!state.selectedTeaching.resources) {
            state.selectedTeaching.resources = [];
        }

        state.selectedTeaching.resources.push(newResource);
        renderResources(state.selectedTeaching.resources);
        closeResourceModal();

        // In a real app, you would upload the file to your server
    }

    // Delete resource
    function deleteResource(resourceId) {
        const teaching = state.selectedTeaching;
        if (!teaching || !teaching.resources) return;

        if (confirm('Are you sure you want to delete this resource?')) {
            teaching.resources = teaching.resources.filter(r => r.id !== resourceId);
            renderResources(teaching.resources);
        }
    }

    // Save teaching as draft
    function saveTeachingAsDraft() {
        const teaching = collectTeachingFormData();
        teaching.id = Date.now();
        teaching.status = 'draft';

        // Add to drafts
        state.draftTeachings.push(teaching);

        // Update UI
        filterAndSortTeachings();
        closeNewTeachingModal();
        alert('Teaching saved as draft');
    }

    // Publish teaching
    function publishTeaching() {
        const teaching = collectTeachingFormData();
        teaching.id = Date.now();
        teaching.date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        teaching.views = 0;
        teaching.likes = 0;
        teaching.comments = [];
        teaching.resources = [];

        // Add to teachings
        teachings.unshift(teaching);

        // Update UI
        filterAndSortTeachings();
        closeNewTeachingModal();
        alert('Teaching published successfully');
    }

    // Collect data from teaching form
    function collectTeachingFormData() {
        return {
            title: document.getElementById('teaching-title').value,
            description: document.getElementById('teaching-description').value,
            category: document.getElementById('teaching-category').value,
            speaker: document.getElementById('teaching-speaker').value,
            date: document.getElementById('teaching-date').value,
            visibility: document.querySelector('input[name="new-teaching-visibility"]:checked').value,
            featured: document.getElementById('feature-teaching').checked,
            series: document.getElementById('is-series').checked ? document.getElementById('teaching-series').value : null,
            scripture: document.getElementById('teaching-scriptures').value.split('\n').filter(line => line.trim()),
            tags: document.getElementById('teaching-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
    }

    // Edit selected teaching
    function editSelectedTeaching() {
        if (!state.selectedTeaching) return;

        state.editingTeaching = state.selectedTeaching;
        populateTeachingForm(state.editingTeaching);
        closeTeachingModal();
        elements.newTeachingModal.classList.add('show');
    }

    // Populate teaching form with existing data
    function populateTeachingForm(teaching) {
        document.getElementById('teaching-title').value = teaching.title;
        document.getElementById('teaching-description').value = teaching.description;
        document.getElementById('teaching-category').value = teaching.category;
        document.getElementById('teaching-speaker').value = teaching.speaker;
        document.getElementById('teaching-date').value = teaching.date;
        document.querySelector(`input[name="new-teaching-visibility"][value="${teaching.visibility}"]`).checked = true;
        document.getElementById('feature-teaching').checked = teaching.featured;
        document.getElementById('is-series').checked = !!teaching.series;
        document.getElementById('teaching-series').style.display = teaching.series ? 'block' : 'none';
        if (teaching.series) document.getElementById('teaching-series').value = teaching.series;
        document.getElementById('teaching-scriptures').value = teaching.scripture.join('\n');
        document.getElementById('teaching-tags').value = teaching.tags.join(', ');
    }

    // Delete selected teaching
    function deleteSelectedTeaching() {
        if (!state.selectedTeaching) return;

        if (confirm('Are you sure you want to delete this teaching? This action cannot be undone.')) {
            const index = teachings.findIndex(t => t.id === state.selectedTeaching.id);
            if (index !== -1) {
                teachings.splice(index, 1);
            } else {
                const draftIndex = state.draftTeachings.findIndex(t => t.id === state.selectedTeaching.id);
                if (draftIndex !== -1) {
                    state.draftTeachings.splice(draftIndex, 1);
                }
            }

            closeTeachingModal();
            filterAndSortTeachings();
        }
    }

    // Handle liking a teaching
    function handleLikeTeaching() {
        if (!state.selectedTeaching) return;

        state.selectedTeaching.likes += 1;
        document.querySelector('.btn-like').innerHTML = `<i class="fas fa-heart"></i> Liked`;
        document.querySelector('.btn-like').style.backgroundColor = 'rgba(252, 1, 0, 0.2)';

        // Update the likes count in the modal
        const likesSpan = elements.modalMeta.querySelector('span:nth-child(4)');
        if (likesSpan) {
            likesSpan.innerHTML = `<i class="fas fa-heart"></i> ${state.selectedTeaching.likes} likes`;
        }

        // In a real app, you would send this to your backend
    }

    // Export teaching report
    function exportTeachingReport() {
        // In a real app, this would generate and download a report
        alert('Exporting teaching report...');
    }

    // Create new series
    function createNewSeries() {
        const seriesName = prompt('Enter the name of the new series:');
        if (seriesName) {
            alert(`New series "${seriesName}" created!`);
            // In a real app, you would add this to your series list
        }
    }

    // Update empty state visibility
    function updateEmptyState() {
        if (state.currentTeachings.length === 0) {
            elements.emptyState.style.display = 'flex';
            elements.grid.style.display = 'none';
        } else {
            elements.emptyState.style.display = 'none';
            elements.grid.style.display = 'grid';
        }
    }

    // Initialize the application
    init();
});