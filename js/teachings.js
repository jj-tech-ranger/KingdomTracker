document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        grid: document.getElementById('teachings-grid'),
        emptyState: document.getElementById('empty-state'),
        filterCategory: document.getElementById('filter-category'),
        sortBy: document.getElementById('sort-by'),
        searchInput: document.getElementById('teaching-search'),
        tabButtons: document.querySelectorAll('.tab-btn'),
        featuredBtn: document.querySelector('.featured-teaching .btn-watch'),
        modal: document.getElementById('teaching-modal'),
        closeModalBtn: document.getElementById('close-teaching'),
        modalTitle: document.querySelector('.teaching-modal-content .teaching-title'),
        modalDescription: document.querySelector('.teaching-modal-content .teaching-description'),
        modalMeta: document.querySelector('.teaching-modal-content .teaching-meta'),
        modalScriptures: document.querySelector('.teaching-modal-content .scripture-references ul'),
        modalTags: document.querySelector('.teaching-modal-content .teaching-tags'),
        commentForm: document.querySelector('.comment-form'),
        commentsList: document.querySelector('.comments-list')
    };

    // Sample teaching data
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
            thumbnail: "../img/teaching1.png",
            tags: ["Prayer", "Faith", "Spiritual Growth"],
            scripture: ["Philippians 4:6-7", "James 5:13-16", "Matthew 6:5-15"],
            comments: [
                {
                    id: 101,
                    author: "Sarah Johnson",
                    avatar: "../img/user2.png",
                    date: "2 days ago",
                    text: "This teaching came at just the right time for me. The point about persistent prayer really spoke to my heart.",
                    likes: 5,
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
                    replies: []
                }
            ]
        },
        // ... (other teaching objects from previous example)
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
        }
    };

    // Initialize the page
    function init() {
        renderTeachings();
        setupEventListeners();
        updateEmptyState();
    }

    // Set up all event listeners
    function setupEventListeners() {
        // Featured teaching click
        elements.featuredBtn.addEventListener('click', () => openTeachingModal(teachings[0]));

        // Modal close
        elements.closeModalBtn.addEventListener('click', closeTeachingModal);

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
        });
    }

    // Filter and sort teachings based on current filters
    function filterAndSortTeachings() {
        let filtered = [...teachings];

        // Apply search filter
        if (state.activeFilters.search) {
            filtered = filtered.filter(teaching =>
                teaching.title.toLowerCase().includes(state.activeFilters.search) ||
                teaching.description.toLowerCase().includes(state.activeFilters.search) ||
                teaching.speaker.toLowerCase().includes(state.activeFilters.search) ||
                teaching.tags.some(tag => tag.toLowerCase().includes(state.activeFilters.search))
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
                filtered = filtered.filter(teaching => teaching.tags.includes("Series"));
                break;
            case 'recent':
                // Already sorted by newest by default
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
                    const aSeries = a.tags.includes("Series") ? 1 : 0;
                    const bSeries = b.tags.includes("Series") ? 1 : 0;
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
            const teachingItem = document.createElement('div');
            teachingItem.className = 'teaching-item';
            teachingItem.innerHTML = `
                <div class="teaching-thumbnail">
                    <img src="${teaching.thumbnail}" alt="${teaching.title}">
                    <div class="teaching-play">
                        <i class="fas fa-play"></i>
                    </div>
                    <div class="teaching-duration">${teaching.duration}</div>
                </div>
                <div class="teaching-details">
                    <h3 class="teaching-title">${teaching.title}</h3>
                    <div class="teaching-meta">
                        <span><i class="fas fa-user"></i> ${teaching.speaker}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${teaching.date}</span>
                        <span><i class="fas fa-eye"></i> ${teaching.views}</span>
                    </div>
                    <p class="teaching-description">${teaching.description}</p>
                    <div class="teaching-actions">
                        <button class="teaching-btn" data-id="${teaching.id}">
                            <i class="fas fa-play"></i> Watch
                        </button>
                        <button class="teaching-btn">
                            <i class="fas fa-info-circle"></i> Details
                        </button>
                    </div>
                </div>
            `;
            elements.grid.appendChild(teachingItem);
        });
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
            <span><i class="fas fa-eye"></i> ${teaching.views} views</span>
            <span><i class="fas fa-heart"></i> ${teaching.likes} likes</span>
            <span><i class="fas fa-clock"></i> ${teaching.duration}</span>
        `;

        // Update scripture references
        elements.modalScriptures.innerHTML = teaching.scripture.map(ref => `<li>${ref}</li>`).join('');

        // Update tags
        elements.modalTags.innerHTML = teaching.tags.map(tag => `<span class="tag">${tag}</span>`).join('');

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

        comments.forEach(comment => {
            const commentEl = document.createElement('div');
            commentEl.className = 'comment';
            commentEl.innerHTML = `
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
                    <div class="comment reply">
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
            replies: []
        };

        state.selectedTeaching.comments.unshift(newComment);
        renderComments(state.selectedTeaching.comments);
        input.value = '';

        // In a real app, you would send this to your backend
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

    // Update empty state visibility
    function updateEmptyState() {
        if (state.currentTeachings.length === 0) {
            elements.emptyState.style.display = 'block';
            elements.grid.style.display = 'none';
        } else {
            elements.emptyState.style.display = 'none';
            elements.grid.style.display = 'grid';
        }
    }

    // Initialize the application
    init();
});