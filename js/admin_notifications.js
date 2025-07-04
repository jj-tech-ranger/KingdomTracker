document.addEventListener('DOMContentLoaded', function() {
    // Sample notification data for admin
    const notifications = [
        {
            id: 1,
            title: "System Maintenance Scheduled",
            description: "Planned system maintenance this Saturday from 2:00 AM to 4:00 AM. System may be unavailable.",
            time: "5 minutes ago",
            type: "system",
            read: false,
            critical: true,
            sender: "System",
            status: "pending"
        },
        {
            id: 2,
            title: "Security Alert: Multiple Failed Login Attempts",
            description: "There have been 5 failed login attempts to the admin panel from IP 192.168.1.45.",
            time: "2 hours ago",
            type: "security",
            read: false,
            critical: true,
            sender: "Security System",
            status: "delivered"
        },
        {
            id: 3,
            title: "New Version Available (v2.3.1)",
            description: "A new version of the application is available. Please schedule an update at your earliest convenience.",
            time: "Yesterday",
            type: "update",
            read: true,
            critical: false,
            sender: "Update System",
            status: "delivered"
        },
        {
            id: 4,
            title: "Regional Leader Meeting Reminder",
            description: "Monthly regional leaders meeting is tomorrow at 10:00 AM at the main office.",
            time: "Yesterday",
            type: "broadcast",
            read: true,
            critical: false,
            sender: "Administration",
            status: "delivered"
        },
        {
            id: 5,
            title: "Content Approval Required",
            description: "New teaching content has been submitted by Pastor John and requires your approval.",
            time: "2 days ago",
            type: "approval",
            read: true,
            critical: false,
            sender: "Content System",
            status: "delivered"
        },
        {
            id: 6,
            title: "Database Backup Failed",
            description: "The nightly database backup failed due to insufficient disk space.",
            time: "3 days ago",
            type: "system",
            read: true,
            critical: true,
            sender: "Backup System",
            status: "failed"
        },
        {
            id: 7,
            title: "Urgent: Financial Report Required",
            description: "The quarterly financial report for all regions is due by end of day tomorrow.",
            time: "1 hour ago",
            type: "broadcast",
            read: false,
            critical: true,
            sender: "Finance Department",
            status: "delivered"
        },
        {
            id: 8,
            title: "New User Registration",
            description: "A new regional leader has registered: Pastor Michael Smith (North Region).",
            time: "4 hours ago",
            type: "system",
            read: false,
            critical: false,
            sender: "User Management",
            status: "delivered"
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
    const advancedFilterBtn = document.getElementById('advanced-filter-btn');
    const advancedFiltersModal = document.getElementById('advanced-filters-modal');
    const closeAdvancedFiltersBtn = document.getElementById('close-advanced-filters');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const manageTemplatesBtn = document.getElementById('manage-templates');
    const templatesModal = document.getElementById('templates-modal');
    const closeTemplatesBtn = document.getElementById('close-templates-modal');
    const newTemplateBtn = document.getElementById('new-template');

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
        document.getElementById('failed-count').textContent = currentNotifications.filter(n => n.status === 'failed').length;

        // Update system alerts list
        const systemAlerts = document.getElementById('system-alerts');
        systemAlerts.innerHTML = '';
        const alerts = currentNotifications.filter(n => n.type === 'system' || n.critical).slice(0, 3);
        alerts.forEach(alert => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${alert.title}</strong> - ${alert.time}`;
            systemAlerts.appendChild(li);
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
        document.getElementById('region-select').style.display = 'none';
        document.getElementById('role-select').style.display = 'none';
        document.getElementById('individual-select').style.display = 'none';

        if (this.value === 'region') {
            document.getElementById('region-select').style.display = 'block';
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
        const priority = document.getElementById('notification-priority').value;
        const isCritical = priority === 'critical';
        const recipientTypeValue = document.getElementById('recipient-type').value;
        const notificationType = document.getElementById('notification-type').value;

        if (!subject || !message) {
            alert('Please fill in both subject and message fields');
            return;
        }

        // Determine recipient text based on selection
        let recipientText = '';
        switch(recipientTypeValue) {
            case 'all':
                recipientText = 'All Users';
                break;
            case 'region':
                recipientText = document.getElementById('notification-region').options[document.getElementById('notification-region').selectedIndex].text + ' Region';
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
            case 'admins':
                recipientText = 'Administrators Only';
                break;
        }

        // Create a new notification
        const newNotification = {
            id: notifications.length + 1,
            title: `Sent: ${subject}`,
            description: `To: ${recipientText}\nMessage: ${message}`,
            time: "Just now",
            type: notificationType,
            read: true,
            critical: isCritical,
            sender: "You",
            status: "delivered"
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
        document.getElementById('notification-priority').value = 'normal';

        // Show success message
        alert(`Notification sent to ${recipientText} successfully!`);
    });

    // Advanced filters
    advancedFilterBtn.addEventListener('click', function() {
        advancedFiltersModal.classList.add('show');
    });

    closeAdvancedFiltersBtn.addEventListener('click', function() {
        advancedFiltersModal.classList.remove('show');
    });

    applyFiltersBtn.addEventListener('click', function() {
        advancedFiltersModal.classList.remove('show');
        filterAndSortNotifications();
    });

    resetFiltersBtn.addEventListener('click', function() {
        document.getElementById('filter-sender').value = 'all';
        document.getElementById('filter-status').value = 'all';
        document.getElementById('filter-priority').value = 'all';
        document.getElementById('filter-type').value = 'all';
        document.getElementById('filter-date-range').value = '';
        filterAndSortNotifications();
    });

    // Templates management
    manageTemplatesBtn.addEventListener('click', function() {
        templatesModal.classList.add('show');
    });

    closeTemplatesBtn.addEventListener('click', function() {
        templatesModal.classList.remove('show');
    });

    newTemplateBtn.addEventListener('click', function() {
        sendNotificationModal.classList.add('show');
        templatesModal.classList.remove('show');
    });

    // Filter and sort notifications based on current filters
    function filterAndSortNotifications() {
        let filtered = [...notifications];
        const searchTerm = notificationSearch.value.toLowerCase();
        const categoryFilter = filterCategory.value;
        const sortValue = sortBy.value;
        const activeTab = document.querySelector('.tab-btn.active').dataset.filter;
        const senderFilter = document.getElementById('filter-sender').value;
        const statusFilter = document.getElementById('filter-status').value;
        const priorityFilter = document.getElementById('filter-priority').value;
        const typeFilter = document.getElementById('filter-type').value;
        const dateRange = document.getElementById('filter-date-range').value;

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

        // Apply sender filter
        if (senderFilter !== 'all') {
            if (senderFilter === 'me') {
                filtered = filtered.filter(notification => notification.sender === 'You');
            } else if (senderFilter === 'system') {
                filtered = filtered.filter(notification => notification.sender.includes('System'));
            } else if (senderFilter === 'admins') {
                filtered = filtered.filter(notification => notification.sender === 'Administration' || notification.sender === 'Finance Department');
            }
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(notification => notification.status === statusFilter);
        }

        // Apply priority filter
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(notification =>
                (priorityFilter === 'critical' && notification.critical) ||
                (priorityFilter === 'high' && !notification.critical && notification.type === 'security') ||
                (priorityFilter === 'normal' && !notification.critical && notification.type !== 'security')
            );
        }

        // Apply type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(notification => notification.type === typeFilter);
        }

        // Apply tab filter
        switch (activeTab) {
            case 'unread':
                filtered = filtered.filter(notification => !notification.read);
                break;
            case 'system':
                filtered = filtered.filter(notification => notification.type === 'system');
                break;
            case 'critical':
                filtered = filtered.filter(notification => notification.critical);
                break;
            case 'failed':
                filtered = filtered.filter(notification => notification.status === 'failed');
                break;
            case 'pending':
                filtered = filtered.filter(notification => notification.status === 'pending');
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
            notificationItem.className = `notification-item ${notification.read ? '' : 'unread'} ${notification.critical ? 'critical' : ''} ${notification.status === 'failed' ? 'failed' : ''}`;
            notificationItem.dataset.id = notification.id;

            // Determine icon based on type
            let iconClass, iconText;
            switch (notification.type) {
                case 'system':
                    iconClass = 'system';
                    iconText = '<i class="fas fa-cog"></i>';
                    break;
                case 'maintenance':
                    iconClass = 'maintenance';
                    iconText = '<i class="fas fa-tools"></i>';
                    break;
                case 'security':
                    iconClass = 'security';
                    iconText = '<i class="fas fa-shield-alt"></i>';
                    break;
                case 'update':
                    iconClass = 'update';
                    iconText = '<i class="fas fa-sync-alt"></i>';
                    break;
                case 'broadcast':
                    iconClass = 'broadcast';
                    iconText = '<i class="fas fa-bullhorn"></i>';
                    break;
                case 'approval':
                    iconClass = 'approval';
                    iconText = '<i class="fas fa-check-circle"></i>';
                    break;
                default:
                    iconClass = 'system';
                    iconText = '<i class="fas fa-bell"></i>';
            }

            // Create action link based on type
            let actionLink = '';
            if (notification.type === 'approval') {
                actionLink = '<a href="../templates/admin_content.html" class="notification-link">Review Content</a>';
            } else if (notification.status === 'failed') {
                actionLink = '<a href="#" class="notification-link">Retry</a>';
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
                        ${notification.status === 'failed' ? '<span class="notification-status failed"><i class="fas fa-exclamation-circle"></i> Failed</span>' : ''}
                        ${notification.status === 'pending' ? '<span class="notification-status pending"><i class="fas fa-clock"></i> Pending</span>' : ''}
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