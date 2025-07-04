document.addEventListener('DOMContentLoaded', function() {
    // Sample notification data for regional leader
    const notifications = [
        {
            id: 1,
            title: "System Maintenance Scheduled",
            description: "Planned system maintenance this Saturday from 2:00 AM to 4:00 AM. System may be unavailable.",
            time: "5 minutes ago",
            type: "system",
            read: false,
            critical: true,
            sender: "System"
        },
        {
            id: 2,
            title: "Prayer Request from Northside Team",
            description: "Pastor John has submitted a prayer request for a team member's health. Click to view details.",
            time: "2 hours ago",
            type: "prayer",
            read: false,
            critical: false,
            sender: "Pastor John"
        },
        {
            id: 3,
            title: "Food Bank Inventory Low",
            description: "The food bank inventory for canned goods is below threshold. Please review and order supplies.",
            time: "Yesterday",
            type: "foodbank",
            read: true,
            critical: true,
            sender: "Food Bank Team"
        },
        {
            id: 4,
            title: "Regional Meeting Reminder",
            description: "Monthly regional leaders meeting is tomorrow at 10:00 AM at the main office.",
            time: "Yesterday",
            type: "events",
            read: true,
            critical: false,
            sender: "Administration"
        },
        {
            id: 5,
            title: "You were mentioned in a report",
            description: "Sister Mary mentioned you in the River Valley Team monthly report.",
            time: "2 days ago",
            type: "messages",
            read: true,
            critical: false,
            sender: "Sister Mary"
        },
        {
            id: 6,
            title: "Upcoming Event: Regional Conference",
            description: "The regional conference is coming up next month. Final preparations needed.",
            time: "3 days ago",
            type: "events",
            read: true,
            critical: false,
            sender: "Events Team"
        },
        {
            id: 7,
            title: "Urgent: Financial Report Required",
            description: "The quarterly financial report for your region is due by end of day tomorrow.",
            time: "1 hour ago",
            type: "finance",
            read: false,
            critical: true,
            sender: "Finance Department"
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
    const sendNotificationBtn = document.getElementById('send-notification-btn');
    const sendNotificationModal = document.getElementById('send-notification-modal');
    const closeSendModalBtn = document.getElementById('close-send-modal');
    const cancelSendBtn = document.getElementById('cancel-send-notification');
    const sendNotificationFormBtn = document.getElementById('send-notification');
    const recipientType = document.getElementById('recipient-type');
    const toggleNotifications = document.getElementById('toggle-notifications');
    const notificationsContainer = document.querySelector('.notifications-container');

    let currentNotifications = [...notifications];
    let selectedNotifications = [];

    // Initialize the page
    renderNotifications(currentNotifications);
    updateStats();
    updateEmptyState();

    // Update statistics
    function updateStats() {
        document.getElementById('total-sent').textContent = currentNotifications.length;
        document.getElementById('unread-count').textContent = currentNotifications.filter(n => !n.read).length;
        document.getElementById('critical-count').textContent = currentNotifications.filter(n => n.critical).length;
        document.getElementById('prayer-count').textContent = currentNotifications.filter(n => n.type === 'prayer').length;

        // Update critical alerts list
        const criticalAlerts = document.getElementById('critical-alerts');
        criticalAlerts.innerHTML = '';
        const criticals = currentNotifications.filter(n => n.critical).slice(0, 3);
        criticals.forEach(alert => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${alert.title}</strong> - ${alert.time}`;
            criticalAlerts.appendChild(li);
        });
    }

    // Mark all as read
    markAllReadBtn.addEventListener('click', function() {
        currentNotifications = currentNotifications.map(notification => ({
            ...notification,
            read: true
        }));

        renderNotifications(currentNotifications);
        updateStats();
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
        alert('Notification preferences saved!');
        preferencesModal.classList.remove('show');
    });

    // Show/hide notifications toggle
    toggleNotifications.addEventListener('change', function() {
        notificationsContainer.style.display = this.checked ? 'block' : 'none';
    });

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

    // Handle recipient type change
    recipientType.addEventListener('change', function() {
        document.getElementById('team-select').style.display = 'none';
        document.getElementById('role-select').style.display = 'none';
        document.getElementById('individual-select').style.display = 'none';

        if (this.value === 'team') {
            document.getElementById('team-select').style.display = 'block';
        } else if (this.value === 'role') {
            document.getElementById('role-select').style.display = 'block';
        } else if (this.value === 'individual') {
            document.getElementById('individual-select').style.display = 'block';
        }
    });

    // Send notification
    sendNotificationFormBtn.addEventListener('click', function() {
        const subject = document.getElementById('notification-subject').value;
        const message = document.getElementById('notification-message').value;
        const isCritical = document.getElementById('notification-priority').checked;
        const recipientTypeValue = document.getElementById('recipient-type').value;

        if (!subject || subject === 'select' || !message) {
            alert('Please fill in both subject and message fields');
            return;
        }

        // Determine recipient text based on selection
        let recipientText = '';
        switch(recipientTypeValue) {
            case 'all':
                recipientText = 'All Users in Region';
                break;
            case 'team':
                recipientText = document.getElementById('notification-team').options[document.getElementById('notification-team').selectedIndex].text + ' Team';
                break;
            case 'role':
                const selectedRoles = Array.from(document.getElementById('notification-role').selectedOptions)
                    .map(option => option.text);
                recipientText = selectedRoles.join(', ');
                break;
            case 'individual':
                const selectedIndividuals = Array.from(document.getElementById('notification-individuals').selectedOptions)
                    .map(option => option.text);
                recipientText = selectedIndividuals.join(', ');
                break;
            case 'leaders':
                recipientText = 'All Team Leaders';
                break;
            case 'rleaders':
                recipientText = 'Other Regional Leaders';
                break;
            case 'admin':
                recipientText = 'Administrators';
                break;
        }

        // Create a new notification
        const newNotification = {
            id: notifications.length + 1,
            title: `Sent: ${subject}`,
            description: `To: ${recipientText}\nMessage: ${message}`,
            time: "Just now",
            type: "messages",
            read: true,
            critical: isCritical,
            sender: "You"
        };

        // Add to the beginning of the notifications array
        notifications.unshift(newNotification);
        currentNotifications.unshift(newNotification);

        // Re-render notifications
        renderNotifications(currentNotifications);
        updateStats();
        updateEmptyState();

        // Close modal and reset form
        sendNotificationModal.classList.remove('show');
        document.getElementById('notification-subject').value = '';
        document.getElementById('notification-message').value = '';
        document.getElementById('notification-priority').checked = false;

        // Show success message
        alert(`Notification sent to ${recipientText} successfully!`);
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
                notification.description.toLowerCase().includes(searchTerm) ||
                (notification.sender && notification.sender.toLowerCase().includes(searchTerm))
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
            case 'prayer':
                filtered = filtered.filter(notification => notification.type === 'prayer');
                break;
            case 'foodbank':
                filtered = filtered.filter(notification => notification.type === 'foodbank');
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
            notificationItem.dataset.id = notification.id;

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
                case 'prayer':
                    iconClass = 'prayer';
                    iconText = '<i class="fas fa-hands-praying"></i>';
                    break;
                case 'foodbank':
                    iconClass = 'foodbank';
                    iconText = '<i class="fas fa-utensils"></i>';
                    break;
                default:
                    iconClass = 'system';
                    iconText = '<i class="fas fa-bell"></i>';
            }

            // Create action link based on type
            let actionLink = '';
            if (notification.type === 'prayer') {
                actionLink = '<a href="../templates/rl_prayer.html" class="notification-link">View Prayer Request</a>';
            } else if (notification.type === 'foodbank') {
                actionLink = '<a href="../templates/food_bank.html" class="notification-link">View Food Bank</a>';
            } else if (notification.critical) {
                actionLink = '<a href="#" class="notification-link">Take Action</a>';
            }

            notificationItem.innerHTML = `
                <div class="notification-icon ${iconClass}">${iconText}</div>
                <div class="notification-content">
                    <h3 class="notification-title">${notification.title}</h3>
                    <p class="notification-description">${notification.description}</p>
                    <div class="notification-meta">
                        <span class="notification-sender"><i class="fas fa-user"></i> ${notification.sender || 'System'}</span>
                        <span class="notification-time"><i class="far fa-clock"></i> ${notification.time}</span>
                    </div>
                    ${actionLink ? `<div class="notification-actions">${actionLink}</div>` : ''}
                </div>
                <button class="notification-mark-read" data-id="${notification.id}">
                    <i class="far ${notification.read ? 'fa-check-circle' : 'fa-circle'}"></i>
                </button>
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
                    updateStats();
                }
            });
        });

        // Add click event to notification items to mark as read when clicked
        document.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', function(e) {
                // Don't mark as read if clicking on a link or the mark-read button
                if (e.target.tagName === 'A' || e.target.closest('.notification-mark-read')) {
                    return;
                }

                const id = parseInt(this.dataset.id);
                const notificationIndex = currentNotifications.findIndex(n => n.id === id);

                if (notificationIndex !== -1 && !currentNotifications[notificationIndex].read) {
                    currentNotifications[notificationIndex].read = true;
                    renderNotifications(currentNotifications);
                    updateStats();
                }
            });
        });
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

    // Initialize date picker for expiry date
    flatpickr("#notification-expiry", {
        dateFormat: "Y-m-d",
        minDate: "today"
    });

    // Initialize date range picker for advanced filters
    flatpickr("#filter-date-range", {
        mode: "range",
        dateFormat: "Y-m-d"
    });
});