document.addEventListener('DOMContentLoaded', function() {
    // Sample notification data
    const notifications = [
        {
            id: 1,
            title: "New Donation Received",
            description: "A donation of $500.00 was received from John Smith for the Building Fund.",
            time: "5 minutes ago",
            type: "finance",
            read: false,
            critical: false
        },
        {
            id: 2,
            title: "Team Meeting Reminder",
            description: "Your weekly team meeting starts in 30 minutes. Join via the provided link.",
            time: "2 hours ago",
            type: "team",
            read: false,
            critical: true
        },
        {
            id: 3,
            title: "You were mentioned in a comment",
            description: "Michael Chen mentioned you in a comment on the Outreach Project.",
            time: "Yesterday",
            type: "messages",
            read: true,
            critical: false
        },
        {
            id: 4,
            title: "System Maintenance Scheduled",
            description: "Planned maintenance this Saturday from 2:00 AM to 4:00 AM. System may be unavailable.",
            time: "Yesterday",
            type: "system",
            read: true,
            critical: false
        },
        {
            id: 5,
            title: "Volunteer Request Approved",
            description: "Your request for additional volunteers for the Food Drive has been approved.",
            time: "2 days ago",
            type: "team",
            read: true,
            critical: false
        },
        {
            id: 6,
            title: "Upcoming Event: Youth Retreat",
            description: "The youth retreat is coming up next weekend. Final preparations needed.",
            time: "3 days ago",
            type: "events",
            read: true,
            critical: false
        }
    ];

    const notificationList = document.getElementById('notification-list');
    const emptyState = document.getElementById('empty-state');
    const markAllReadBtn = document.getElementById('mark-all-read');
    const filterCategory = document.getElementById('filter-category');
    const sortBy = document.getElementById('sort-by');
    const notificationSearch = document.getElementById('notification-search');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const openPreferencesBtn = document.getElementById('open-preferences');
    const closePreferencesBtn = document.getElementById('close-preferences');
    const cancelPreferencesBtn = document.getElementById('cancel-preferences');
    const savePreferencesBtn = document.getElementById('save-preferences');
    const preferencesModal = document.getElementById('preferences-modal');

    let currentNotifications = [...notifications];
    let selectedNotifications = [];

    // Initialize the page
    renderNotifications(currentNotifications);
    updateEmptyState();

    // Mark all as read
    markAllReadBtn.addEventListener('click', function() {
        currentNotifications = currentNotifications.map(notification => ({
            ...notification,
            read: true
        }));

        renderNotifications(currentNotifications);
    });

    // Filter by category
    filterCategory.addEventListener('change', function() {
        filterAndSortNotifications();
    });

    // Sort notifications
    sortBy.addEventListener('change', function() {
        filterAndSortNotifications();
    });

    // Search notifications
    notificationSearch.addEventListener('input', function() {
        filterAndSortNotifications();
    });

    // Tab filtering
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterAndSortNotifications();
        });
    });

    // Open preferences modal
    openPreferencesBtn.addEventListener('click', function() {
        preferencesModal.classList.add('show');
    });

    // Close preferences modal
    closePreferencesBtn.addEventListener('click', function() {
        preferencesModal.classList.remove('show');
    });

    // Cancel preferences
    cancelPreferencesBtn.addEventListener('click', function() {
        preferencesModal.classList.remove('show');
    });

    // Save preferences
    savePreferencesBtn.addEventListener('click', function() {
        // Here you would typically save preferences to a server
        alert('Notification preferences saved!');
        preferencesModal.classList.remove('show');
    });

    // Filter and sort notifications based on current filters
    function filterAndSortNotifications() {
        let filtered = [...notifications];
        const searchTerm = notificationSearch.value.toLowerCase();
        const categoryFilter = filterCategory.value;
        const sortValue = sortBy.value;
        const activeTab = document.querySelector('.tab-btn.active').dataset.filter;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(notification =>
                notification.title.toLowerCase().includes(searchTerm) ||
                notification.description.toLowerCase().includes(searchTerm)
            );
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(notification => notification.type === categoryFilter);
        }

        // Apply tab filter
        switch (activeTab) {
            case 'unread':
                filtered = filtered.filter(notification => !notification.read);
                break;
            case 'mentions':
                filtered = filtered.filter(notification =>
                    notification.description.includes('mentioned you') ||
                    notification.title.includes('mentioned')
                );
                break;
            case 'critical':
                filtered = filtered.filter(notification => notification.critical);
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
            case 'priority':
                filtered.sort((a, b) => {
                    if (a.critical && !b.critical) return -1;
                    if (!a.critical && b.critical) return 1;
                    if (!a.read && b.read) return -1;
                    if (a.read && !b.read) return 0;
                    return 0;
                });
                break;
        }

        currentNotifications = filtered;
        renderNotifications(filtered);
        updateEmptyState();
    }

    // Render notifications to the DOM
    function renderNotifications(notificationsToRender) {
        notificationList.innerHTML = '';

        notificationsToRender.forEach(notification => {
            const notificationItem = document.createElement('div');
            notificationItem.className = `notification-item ${notification.read ? '' : 'unread'} ${notification.critical ? 'critical' : ''}`;

            // Determine icon based on type
            let iconClass, iconText;
            switch (notification.type) {
                case 'system':
                    iconClass = 'system';
                    iconText = '<i class="fas fa-cog"></i>';
                    break;
                case 'team':
                    iconClass = 'team';
                    iconText = '<i class="fas fa-users"></i>';
                    break;
                case 'finance':
                    iconClass = 'finance';
                    iconText = '<i class="fas fa-dollar-sign"></i>';
                    break;
                case 'events':
                    iconClass = 'events';
                    iconText = '<i class="fas fa-calendar-alt"></i>';
                    break;
                case 'messages':
                    iconClass = 'messages';
                    iconText = '<i class="fas fa-comment-alt"></i>';
                    break;
                default:
                    iconClass = 'system';
                    iconText = '<i class="fas fa-bell"></i>';
            }

            notificationItem.innerHTML = `
                <div class="notification-icon ${iconClass}">${iconText}</div>
                <div class="notification-content">
                    <h3 class="notification-title">${notification.title}</h3>
                    <p class="notification-description">${notification.description}</p>
                    <div class="notification-time">
                        <i class="far fa-clock"></i> ${notification.time}
                    </div>
                    <div class="notification-actions">
                        <a href="#" class="notification-link">View Details</a>
                        ${notification.critical ? '<a href="#" class="notification-link">Take Action</a>' : ''}
                    </div>
                </div>
                <button class="notification-mark-read" data-id="${notification.id}">
                    <i class="far ${notification.read ? 'fa-check-circle' : 'fa-circle'}"></i>
                </button>
                <input type="checkbox" class="notification-checkbox" data-id="${notification.id}">
            `;

            notificationList.appendChild(notificationItem);
        });

        // Add event listeners to mark as read buttons
        document.querySelectorAll('.notification-mark-read').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const id = parseInt(this.dataset.id);
                const notificationIndex = currentNotifications.findIndex(n => n.id === id);

                if (notificationIndex !== -1) {
                    currentNotifications[notificationIndex].read = !currentNotifications[notificationIndex].read;
                    renderNotifications(currentNotifications);
                }
            });
        });

        // Add event listeners to checkboxes for batch actions
        document.querySelectorAll('.notification-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const id = parseInt(this.dataset.id);

                if (this.checked) {
                    selectedNotifications.push(id);
                } else {
                    selectedNotifications = selectedNotifications.filter(nId => nId !== id);
                }

                // Toggle selected class on notification item
                const notificationItem = this.closest('.notification-item');
                notificationItem.classList.toggle('selected', this.checked);

                // Show/hide batch actions
                toggleBatchActions();
            });
        });
    }

    // Toggle batch actions bar
    function toggleBatchActions() {
        const batchActions = document.querySelector('.batch-actions');

        if (!batchActions) {
            if (selectedNotifications.length > 0) {
                createBatchActionsBar();
            }
        } else {
            if (selectedNotifications.length > 0) {
                updateBatchActionsCount();
            } else {
                batchActions.remove();
            }
        }
    }

    // Create batch actions bar
    function createBatchActionsBar() {
        const batchActions = document.createElement('div');
        batchActions.className = 'batch-actions show';
        batchActions.innerHTML = `
            <div class="batch-selected">${selectedNotifications.length} selected</div>
            <div class="batch-buttons">
                <button class="btn btn-mark-all" id="mark-selected-read">
                    <i class="fas fa-check"></i> Mark as Read
                </button>
                <button class="btn btn-mark-all" id="delete-selected">
                    <i class="fas fa-trash"></i> Delete
                </button>
                <button class="btn btn-cancel" id="cancel-batch">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
        `;

        notificationList.parentNode.insertBefore(batchActions, notificationList);

        // Add event listeners to batch action buttons
        document.getElementById('mark-selected-read').addEventListener('click', markSelectedAsRead);
        document.getElementById('delete-selected').addEventListener('click', deleteSelected);
        document.getElementById('cancel-batch').addEventListener('click', cancelBatchSelection);
    }

    // Update batch actions count
    function updateBatchActionsCount() {
        const batchSelected = document.querySelector('.batch-selected');
        if (batchSelected) {
            batchSelected.textContent = `${selectedNotifications.length} selected`;
        }
    }

    // Mark selected notifications as read
    function markSelectedAsRead() {
        currentNotifications = currentNotifications.map(notification =>
            selectedNotifications.includes(notification.id)
                ? { ...notification, read: true }
                : notification
        );

        selectedNotifications = [];
        renderNotifications(currentNotifications);
        document.querySelector('.batch-actions')?.remove();
    }

    // Delete selected notifications
    function deleteSelected() {
        currentNotifications = currentNotifications.filter(
            notification => !selectedNotifications.includes(notification.id)
        );

        selectedNotifications = [];
        renderNotifications(currentNotifications);
        updateEmptyState();
        document.querySelector('.batch-actions')?.remove();
    }

    // Cancel batch selection
    function cancelBatchSelection() {
        selectedNotifications = [];
        renderNotifications(currentNotifications);
        document.querySelector('.batch-actions')?.remove();
    }

    // Update empty state visibility
    function updateEmptyState() {
        if (currentNotifications.length === 0) {
            emptyState.style.display = 'block';
            notificationList.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            notificationList.style.display = 'flex';
        }
    }
});
    // Show/hide notifications toggle
    const toggleNotifications = document.getElementById('toggle-notifications');
    const notificationsContainer = document.querySelector('.notifications-container');

    toggleNotifications.addEventListener('change', function() {
        notificationsContainer.style.display = this.checked ? 'block' : 'none';
    });

    // Send notification functionality
    const sendNotificationBtn = document.getElementById('send-notification-btn');
    const sendNotificationModal = document.getElementById('send-notification-modal');
    const closeSendModalBtn = document.getElementById('close-send-modal');
    const cancelSendBtn = document.getElementById('cancel-send-notification');
    const sendNotificationFormBtn = document.getElementById('send-notification');

    // Open send notification modal
    sendNotificationBtn.addEventListener('click', function() {
        sendNotificationModal.classList.add('show');
    });

    // Close send notification modal
    closeSendModalBtn.addEventListener('click', function() {
        sendNotificationModal.classList.remove('show');
    });

    // Cancel send notification
    cancelSendBtn.addEventListener('click', function() {
        sendNotificationModal.classList.remove('show');
    });

    // Send notification
    sendNotificationFormBtn.addEventListener('click', function() {
        const subject = document.getElementById('notification-subject').value;
        const message = document.getElementById('notification-message').value;
        const isCritical = document.getElementById('notification-priority').checked;

        if (!subject || !message) {
            alert('Please fill in both subject and message fields');
            return;
        }

        // Create a new notification (in a real app, this would send to the server)
        const newNotification = {
            id: notifications.length + 1,
            title: subject,
            description: message,
            time: "Just now",
            type: "team",
            read: false,
            critical: isCritical
        };

        // Add to the beginning of the notifications array
        notifications.unshift(newNotification);
        currentNotifications.unshift(newNotification);

        // Re-render notifications
        renderNotifications(currentNotifications);
        updateEmptyState();

        // Close modal and reset form
        sendNotificationModal.classList.remove('show');
        document.getElementById('notification-subject').value = '';
        document.getElementById('notification-message').value = '';
        document.getElementById('notification-priority').checked = false;

        // Show success message
        alert('Notification sent to your team leader successfully!');
    });