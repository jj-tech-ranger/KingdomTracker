document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const elements = {
        prayerList: document.getElementById('prayer-list'),
        emptyState: document.getElementById('empty-state'),
        filterStatus: document.getElementById('filter-status'),
        filterCategory: document.getElementById('filter-category'),
        filterPriority: document.getElementById('filter-priority'),
        searchInput: document.getElementById('prayer-search'),
        tabButtons: document.querySelectorAll('.tab-btn'),
        newPrayerBtn: document.getElementById('new-prayer-btn'),
        newPrayerEmptyBtn: document.getElementById('new-prayer-empty'),
        assignPrayerBtn: document.getElementById('assign-prayer'),
        exportReportBtn: document.getElementById('export-prayer-report'),
        prayerModal: document.getElementById('prayer-modal'),
        closePrayerModal: document.getElementById('close-prayer'),
        newPrayerModal: document.getElementById('new-prayer-modal'),
        closeNewPrayerModal: document.getElementById('close-new-prayer'),
        escalateModal: document.getElementById('escalate-modal'),
        closeEscalateModal: document.getElementById('close-escalate'),
        cancelEscalateBtn: document.getElementById('cancel-escalate'),
        confirmEscalateBtn: document.getElementById('confirm-escalate'),
        submitPrayerBtn: document.getElementById('submit-prayer'),
        cancelNewPrayerBtn: document.getElementById('cancel-new-prayer'),
        markAnsweredBtn: document.getElementById('mark-answered'),
        escalatePrayerBtn: document.getElementById('escalate-prayer'),
        deletePrayerBtn: document.getElementById('delete-prayer'),
        addUpdateBtn: document.getElementById('add-update'),
        updateContent: document.getElementById('update-content'),
        escalateNowCheckbox: document.getElementById('escalate-now'),
        escalationDetails: document.getElementById('escalation-details')
    };

    // Sample prayer data
    const prayers = [
        {
            id: 1,
            title: "Healing from surgery",
            content: "Please pray for complete healing from my recent knee replacement surgery. The recovery has been more difficult than expected.",
            category: "health",
            priority: "urgent",
            status: "pending",
            date: "June 15, 2023",
            member: {
                name: "Sarah Johnson",
                avatar: "../img/user2.png",
                role: "Member"
            },
            updates: [
                {
                    id: 101,
                    date: "June 16, 2023",
                    content: "Pain has decreased slightly today. Doctor says recovery is progressing normally.",
                    author: "Sarah Johnson"
                }
            ],
            metrics: {
                praying: 12,
                comments: 3
            }
        },
        {
            id: 2,
            title: "Job opportunity",
            content: "I have a final interview next week for a position that would be perfect for our family. Pray for wisdom and favor.",
            category: "financial",
            priority: "high",
            status: "pending",
            date: "June 12, 2023",
            member: {
                name: "Michael Chen",
                avatar: "../img/user3.png",
                role: "Volunteer"
            },
            updates: [],
            metrics: {
                praying: 8,
                comments: 1
            }
        },
        {
            id: 3,
            title: "Marital reconciliation",
            content: "Pray for reconciliation with my spouse. We've been separated for 3 months and need God's intervention.",
            category: "family",
            priority: "high",
            status: "escalated",
            date: "June 5, 2023",
            escalatedTo: "Pastor John Smith",
            escalatedDate: "June 7, 2023",
            escalationNotes: "Needs specialized pastoral counseling",
            member: {
                name: "David Wilson",
                avatar: "../img/user4.jpg",
                role: "Member"
            },
            updates: [
                {
                    id: 102,
                    date: "June 8, 2023",
                    content: "Had first counseling session with Pastor John. It was difficult but productive.",
                    author: "David Wilson"
                }
            ],
            metrics: {
                praying: 15,
                comments: 5
            }
        },
        {
            id: 4,
            title: "Son's salvation",
            content: "My 16-year-old son is struggling with faith. Pray that God would draw him to Himself.",
            category: "spiritual",
            priority: "medium",
            status: "pending",
            date: "June 1, 2023",
            member: {
                name: "Lisa Rodriguez",
                avatar: "../img/user5.jpg",
                role: "Member"
            },
            updates: [],
            metrics: {
                praying: 6,
                comments: 2
            }
        },
        {
            id: 5,
            title: "Mission trip funding",
            content: "Praise report! All the funding for our youth mission trip has come in! Thank you for praying!",
            category: "financial",
            priority: "low",
            status: "answered",
            date: "May 28, 2023",
            answeredDate: "June 10, 2023",
            answeredNotes: "Received final donation to cover all expenses",
            member: {
                name: "Youth Pastor Mike",
                avatar: "../img/user6.jpg",
                role: "Staff"
            },
            updates: [
                {
                    id: 103,
                    date: "June 10, 2023",
                    content: "We've received all the funding needed for the trip! God is faithful!",
                    author: "Youth Pastor Mike"
                }
            ],
            metrics: {
                praying: 9,
                comments: 4
            }
        }
    ];

    // State management
    let state = {
        currentPrayers: [...prayers],
        selectedPrayer: null,
        activeFilters: {
            status: 'all',
            category: 'all',
            priority: 'all',
            tab: 'all',
            search: ''
        }
    };

    // Initialize the page
    function init() {
        renderPrayers();
        setupEventListeners();
        updateEmptyState();
    }

    // Set up all event listeners
    function setupEventListeners() {
        // New prayer buttons
        elements.newPrayerBtn.addEventListener('click', openNewPrayerModal);
        elements.newPrayerEmptyBtn.addEventListener('click', openNewPrayerModal);
        elements.cancelNewPrayerBtn.addEventListener('click', closeNewPrayerModal);

        // Export report
        elements.exportReportBtn.addEventListener('click', exportPrayerReport);

        // Modal close
        elements.closePrayerModal.addEventListener('click', closePrayerModal);
        elements.closeNewPrayerModal.addEventListener('click', closeNewPrayerModal);
        elements.closeEscalateModal.addEventListener('click', closeEscalateModal);

        // Filter changes
        elements.filterStatus.addEventListener('change', (e) => {
            state.activeFilters.status = e.target.value;
            filterAndSortPrayers();
        });

        elements.filterCategory.addEventListener('change', (e) => {
            state.activeFilters.category = e.target.value;
            filterAndSortPrayers();
        });

        elements.filterPriority.addEventListener('change', (e) => {
            state.activeFilters.priority = e.target.value;
            filterAndSortPrayers();
        });

        // Search input
        elements.searchInput.addEventListener('input', (e) => {
            state.activeFilters.search = e.target.value.toLowerCase();
            filterAndSortPrayers();
        });

        // Tab filtering
        elements.tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                elements.tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                state.activeFilters.tab = this.dataset.filter;
                filterAndSortPrayers();
            });
        });

        // Form submissions
        elements.submitPrayerBtn.addEventListener('click', handleNewPrayerSubmit);
        elements.markAnsweredBtn.addEventListener('click', markPrayerAnswered);
        elements.escalatePrayerBtn.addEventListener('click', openEscalateModal);
        elements.confirmEscalateBtn.addEventListener('click', confirmEscalation);
        elements.cancelEscalateBtn.addEventListener('click', closeEscalateModal);
        elements.deletePrayerBtn.addEventListener('click', deleteSelectedPrayer);
        elements.addUpdateBtn.addEventListener('click', addPrayerUpdate);

        // Escalate now toggle
        elements.escalateNowCheckbox.addEventListener('change', function() {
            elements.escalationDetails.style.display = this.checked ? 'block' : 'none';
        });

        // Handle clicks on dynamic elements
        document.addEventListener('click', function(e) {
            // View prayer buttons
            if (e.target.closest('.btn-view-prayer')) {
                const card = e.target.closest('.prayer-item');
                const id = parseInt(card.dataset.prayerId);
                const prayer = prayers.find(p => p.id === id);
                if (prayer) openPrayerModal(prayer);
            }

            // Mark as answered buttons
            if (e.target.closest('.btn-answered')) {
                const card = e.target.closest('.prayer-item');
                const id = parseInt(card.dataset.prayerId);
                markPrayerAnswered(id);
            }

            // Escalate buttons
            if (e.target.closest('.btn-escalate')) {
                const card = e.target.closest('.prayer-item');
                const id = parseInt(card.dataset.prayerId);
                const prayer = prayers.find(p => p.id === id);
                if (prayer) {
                    state.selectedPrayer = prayer;
                    openEscalateModal();
                }
            }

            // Delete buttons
            if (e.target.closest('.btn-delete-prayer')) {
                const card = e.target.closest('.prayer-item');
                const id = parseInt(card.dataset.prayerId);
                deleteSelectedPrayer(id);
            }
        });
    }

    // Filter and sort prayers based on current filters
    function filterAndSortPrayers() {
        let filtered = [...prayers];

        // Apply search filter
        if (state.activeFilters.search) {
            filtered = filtered.filter(prayer =>
                prayer.title.toLowerCase().includes(state.activeFilters.search) ||
                prayer.content.toLowerCase().includes(state.activeFilters.search) ||
                prayer.member.name.toLowerCase().includes(state.activeFilters.search)
            );
        }

        // Apply status filter
        if (state.activeFilters.status !== 'all') {
            filtered = filtered.filter(prayer => prayer.status === state.activeFilters.status);
        }

        // Apply category filter
        if (state.activeFilters.category !== 'all') {
            filtered = filtered.filter(prayer => prayer.category === state.activeFilters.category);
        }

        // Apply priority filter
        if (state.activeFilters.priority !== 'all') {
            filtered = filtered.filter(prayer => prayer.priority === state.activeFilters.priority);
        }

        // Apply tab filter
        switch (state.activeFilters.tab) {
            case 'my-requests':
                // In a real app, this would filter to the current user's requests
                filtered = filtered.filter(prayer => prayer.member.role === 'Staff');
                break;
            case 'assigned':
                // In a real app, this would filter to requests assigned to current user
                filtered = filtered.filter(prayer => prayer.status === 'escalated');
                break;
            case 'pending':
                filtered = filtered.filter(prayer => prayer.status === 'pending');
                break;
            case 'answered':
                filtered = filtered.filter(prayer => prayer.status === 'answered');
                break;
            case 'groups':
                // In a real app, this would show prayer groups
                filtered = [];
                break;
        }

        // Apply sorting (default is by date, newest first)
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

        state.currentPrayers = filtered;
        renderPrayers();
        updateEmptyState();
    }

    // Render prayers to the list
    function renderPrayers() {
        elements.prayerList.innerHTML = '';

        if (state.currentPrayers.length === 0) {
            updateEmptyState();
            return;
        }

        state.currentPrayers.forEach(prayer => {
            const prayerItem = document.createElement('div');
            prayerItem.className = 'prayer-item';
            prayerItem.dataset.prayerId = prayer.id;

            prayerItem.innerHTML = `
                <div class="prayer-header">
                    <h3 class="prayer-title">${prayer.title}</h3>
                    <span class="prayer-status ${prayer.status}">${prayer.status.charAt(0).toUpperCase() + prayer.status.slice(1)}</span>
                </div>
                <div class="prayer-meta">
                    <span class="prayer-category">
                        <i class="fas fa-tag"></i> ${prayer.category.charAt(0).toUpperCase() + prayer.category.slice(1)}
                    </span>
                    <span class="prayer-priority">
                        <i class="fas fa-exclamation-circle priority-${prayer.priority}"></i> ${prayer.priority.charAt(0).toUpperCase() + prayer.priority.slice(1)}
                    </span>
                    <span class="prayer-date">
                        <i class="fas fa-calendar-alt"></i> ${prayer.date}
                    </span>
                </div>
                <div class="prayer-content">
                    <p>${prayer.content}</p>
                </div>
                <div class="prayer-footer">
                    <div class="prayer-metrics">
                        <span><i class="fas fa-hands-praying"></i> ${prayer.metrics.praying} praying</span>
                        <span><i class="fas fa-comment"></i> ${prayer.metrics.comments} comments</span>
                    </div>
                    <div class="prayer-actions">
                        <button class="btn btn-small btn-view-prayer">
                            <i class="fas fa-eye"></i> View
                        </button>
                        ${prayer.status !== 'answered' ? `
                            <button class="btn btn-small btn-answered">
                                <i class="fas fa-check"></i> Answered
                            </button>
                        ` : ''}
                        ${prayer.status !== 'escalated' ? `
                            <button class="btn btn-small btn-escalate">
                                <i class="fas fa-arrow-up"></i> Escalate
                            </button>
                        ` : ''}
                        <button class="btn btn-small btn-delete-prayer">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            `;
            elements.prayerList.appendChild(prayerItem);
        });
    }

    // Open prayer modal with details
    function openPrayerModal(prayer) {
        state.selectedPrayer = prayer;

        // Update modal content
        document.getElementById('prayer-modal-title').textContent = prayer.title;
        document.getElementById('prayer-modal-content').textContent = prayer.content;
        document.getElementById('prayer-modal-status').textContent = prayer.status.charAt(0).toUpperCase() + prayer.status.slice(1);
        document.getElementById('prayer-modal-status').className = `prayer-status ${prayer.status}`;
        document.getElementById('prayer-modal-date').textContent = prayer.date;
        document.getElementById('prayer-modal-category').textContent = prayer.category.charAt(0).toUpperCase() + prayer.category.slice(1);
        document.getElementById('prayer-modal-priority').textContent = prayer.priority.charAt(0).toUpperCase() + prayer.priority.slice(1);
        document.getElementById('prayer-modal-priority').className = `priority-${prayer.priority}`;

        // Update member info
        const memberInfo = document.getElementById('prayer-modal-member-info');
        memberInfo.innerHTML = `
            <img src="${prayer.member.avatar}" alt="${prayer.member.name}" class="prayer-member-avatar">
            <div class="prayer-member-details">
                <h4>${prayer.member.name}</h4>
                <p>${prayer.member.role}</p>
            </div>
        `;

        // Update updates section
        renderPrayerUpdates(prayer.updates);

        // Show/hide answered section
        const answeredSection = document.getElementById('answered-section');
        if (prayer.status === 'answered') {
            answeredSection.style.display = 'block';
            document.getElementById('answered-date').textContent = prayer.answeredDate;
            document.getElementById('answered-notes').textContent = prayer.answeredNotes;
        } else {
            answeredSection.style.display = 'none';
        }

        // Show/hide escalated section
        const escalatedSection = document.getElementById('escalated-section');
        if (prayer.status === 'escalated') {
            escalatedSection.style.display = 'block';
            document.getElementById('escalated-to').textContent = prayer.escalatedTo;
            document.getElementById('escalated-date').textContent = prayer.escalatedDate;
            document.getElementById('escalation-notes-display').textContent = prayer.escalationNotes;
        } else {
            escalatedSection.style.display = 'none';
        }

        // Update button states
        elements.markAnsweredBtn.style.display = prayer.status === 'answered' ? 'none' : 'inline-block';
        elements.escalatePrayerBtn.style.display = prayer.status === 'escalated' ? 'none' : 'inline-block';

        // Show modal
        elements.prayerModal.classList.add('show');
    }

    // Close prayer modal
    function closePrayerModal() {
        elements.prayerModal.classList.remove('show');
        state.selectedPrayer = null;
    }

    // Open new prayer modal
    function openNewPrayerModal() {
        elements.newPrayerModal.classList.add('show');
    }

    // Close new prayer modal
    function closeNewPrayerModal() {
        elements.newPrayerModal.classList.remove('show');
    }

    // Open escalate modal
    function openEscalateModal() {
        elements.escalateModal.classList.add('show');
    }

    // Close escalate modal
    function closeEscalateModal() {
        elements.escalateModal.classList.remove('show');
    }

    // Render prayer updates
    function renderPrayerUpdates(updates) {
        const updatesContainer = document.getElementById('prayer-updates');
        updatesContainer.innerHTML = '';

        if (!updates || updates.length === 0) {
            updatesContainer.innerHTML = `
                <div class="empty-updates">
                    <p>No updates yet.</p>
                </div>
            `;
            return;
        }

        updates.forEach(update => {
            const updateEl = document.createElement('div');
            updateEl.className = 'update-item';
            updateEl.innerHTML = `
                <div class="update-header">
                    <span>${update.author}</span>
                    <span>${update.date}</span>
                </div>
                <div class="update-content">
                    <p>${update.content}</p>
                </div>
            `;
            updatesContainer.appendChild(updateEl);
        });
    }

    // Handle new prayer submission
    function handleNewPrayerSubmit() {
        const category = document.getElementById('prayer-category').value;
        const priority = document.getElementById('prayer-priority').value;
        const content = document.getElementById('prayer-content').value.trim();
        const escalateNow = document.getElementById('escalate-now').checked;
        const immediateLeader = document.getElementById('immediate-leader').value;
        const immediateNotes = document.getElementById('immediate-notes').value.trim();

        if (!category || !priority || !content) {
            alert('Please fill in all required fields');
            return;
        }

        if (escalateNow && !immediateLeader) {
            alert('Please select a regional leader to escalate to');
            return;
        }

        // Create new prayer
        const newPrayer = {
            id: Date.now(),
            title: content.length > 50 ? content.substring(0, 47) + '...' : content,
            content: content,
            category: category,
            priority: priority,
            status: escalateNow ? 'escalated' : 'pending',
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            member: {
                name: "You",
                avatar: "../img/user1.png",
                role: "Leader"
            },
            updates: [],
            metrics: {
                praying: 0,
                comments: 0
            }
        };

        if (escalateNow) {
            newPrayer.escalatedTo = immediateLeader;
            newPrayer.escalatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            newPrayer.escalationNotes = immediateNotes;
        }

        // Add to prayers array
        prayers.unshift(newPrayer);

        // Update UI
        state.currentPrayers = [newPrayer, ...state.currentPrayers];
        renderPrayers();
        closeNewPrayerModal();
        updateEmptyState();

        alert('Prayer request submitted successfully');
    }

    // Mark prayer as answered
    function markPrayerAnswered(prayerId) {
        let prayer;

        if (prayerId) {
            // Called from list view
            prayer = prayers.find(p => p.id === prayerId);
        } else {
            // Called from modal
            prayer = state.selectedPrayer;
        }

        if (!prayer) return;

        if (confirm('Are you sure you want to mark this prayer as answered?')) {
            prayer.status = 'answered';
            prayer.answeredDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            prayer.answeredNotes = prompt('Please enter how this prayer was answered:') || 'No details provided';

            // Update UI
            if (prayerId) {
                filterAndSortPrayers();
            } else {
                closePrayerModal();
                filterAndSortPrayers();
            }
        }
    }

    // Confirm escalation
    function confirmEscalation() {
        const leader = document.getElementById('regional-leader').value;
        const notes = document.getElementById('escalation-notes').value.trim();

        if (!leader || !notes) {
            alert('Please select a leader and provide escalation notes');
            return;
        }

        if (!state.selectedPrayer) return;

        state.selectedPrayer.status = 'escalated';
        state.selectedPrayer.escalatedTo = leader;
        state.selectedPrayer.escalatedDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        state.selectedPrayer.escalationNotes = notes;

        // Update UI
        closeEscalateModal();
        closePrayerModal();
        filterAndSortPrayers();
    }

    // Add prayer update
    function addPrayerUpdate() {
        const content = elements.updateContent.value.trim();
        if (!content) return;

        if (!state.selectedPrayer.updates) {
            state.selectedPrayer.updates = [];
        }

        const newUpdate = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
            content: content,
            author: "You"
        };

        state.selectedPrayer.updates.push(newUpdate);
        renderPrayerUpdates(state.selectedPrayer.updates);
        elements.updateContent.value = '';
    }

    // Delete selected prayer
    function deleteSelectedPrayer(prayerId) {
        let prayer;

        if (prayerId) {
            // Called from list view
            prayer = prayers.find(p => p.id === prayerId);
        } else {
            // Called from modal
            prayer = state.selectedPrayer;
        }

        if (!prayer) return;

        if (confirm('Are you sure you want to delete this prayer request? This action cannot be undone.')) {
            const index = prayers.findIndex(p => p.id === prayer.id);
            if (index !== -1) {
                prayers.splice(index, 1);
            }

            // Update UI
            if (prayerId) {
                filterAndSortPrayers();
            } else {
                closePrayerModal();
                filterAndSortPrayers();
            }
        }
    }

    // Export prayer report
    function exportPrayerReport() {
        // In a real app, this would generate and download a report
        alert('Exporting prayer report...');
    }

    // Update empty state visibility
    function updateEmptyState() {
        if (state.currentPrayers.length === 0) {
            elements.emptyState.style.display = 'flex';
            elements.prayerList.style.display = 'none';
        } else {
            elements.emptyState.style.display = 'none';
            elements.prayerList.style.display = 'block';
        }
    }

    // Initialize the application
    init();
});