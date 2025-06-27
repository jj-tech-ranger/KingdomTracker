document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const notificationList = document.getElementById('notification-list');
  const emptyState = document.getElementById('empty-state');
  const markAllReadBtn = document.getElementById('mark-all-read');
  const toggleNotifications = document.getElementById('toggle-notifications');
  const filterCategory = document.getElementById('filter-category');
  const sortBy = document.getElementById('sort-by');
  const searchInput = document.getElementById('notification-search');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const exportBtn = document.getElementById('export-notifications');

  // Modal Elements
  const modals = {
    preferences: document.getElementById('preferences-modal'),
    sendNotification: document.getElementById('send-notification-modal'),
    templates: document.getElementById('templates-modal'),
    advancedFilters: document.getElementById('advanced-filters-modal')
  };

  // Notification Data
  let notifications = [];
  let templates = [];
  let criticalAlerts = [];

  // Initialize the page
  init();

  function init() {
    // Load sample data
    loadSampleData();

    // Set up event listeners
    setupEventListeners();

    // Render initial view
    renderNotifications();
    updateStats();
  }

  function loadSampleData() {
    // Sample notifications
    notifications = [
      {
        id: 1,
        title: 'New prayer request from Sarah',
        message: 'Please pray for my family as we go through a difficult time with my father\'s health. We appreciate your support and prayers during this challenging season.',
        date: new Date('2023-06-15T10:30:00'),
        category: 'prayer',
        isUnread: true,
        isCritical: false,
        isPinned: false,
        mentions: false,
        type: 'user-request',
        sender: 'Sarah Johnson',
        icon: 'hands-praying'
      },
      {
        id: 2,
        title: 'System Maintenance Scheduled',
        message: 'The system will be down for maintenance on June 20th from 2-4 AM. Please save all your work before this time. We apologize for any inconvenience.',
        date: new Date('2023-06-14T15:45:00'),
        category: 'system',
        isUnread: false,
        isCritical: true,
        isPinned: true,
        mentions: false,
        type: 'system',
        sender: 'System Admin',
        icon: 'server'
      },
      {
        id: 3,
        title: 'Monthly Financial Report',
        message: 'The monthly financial report is now available for review in the documents section. Please review by Friday and provide any feedback to the finance team.',
        date: new Date('2023-06-12T09:15:00'),
        category: 'finance',
        isUnread: true,
        isCritical: false,
        isPinned: false,
        mentions: true,
        type: 'update',
        sender: 'Finance Team',
        icon: 'money-bill-wave'
      },
      {
        id: 4,
        title: 'Upcoming Volunteer Meeting',
        message: 'Reminder: Volunteer meeting this Friday at 7 PM in the main hall. We\'ll be discussing the upcoming community outreach event and assigning roles.',
        date: new Date('2023-06-10T14:20:00'),
        category: 'events',
        isUnread: false,
        isCritical: false,
        isPinned: false,
        mentions: false,
        type: 'reminder',
        sender: 'Events Team',
        icon: 'calendar-alt'
      },
      {
        id: 5,
        title: 'Food Bank Supplies Low',
        message: 'The food bank is running low on canned goods and pasta. Please consider donating or spreading the word to your small groups. Most needed items: canned vegetables, pasta, rice, and peanut butter.',
        date: new Date('2023-06-08T11:10:00'),
        category: 'finance',
        isUnread: false,
        isCritical: true,
        isPinned: true,
        mentions: false,
        type: 'alert',
        sender: 'Food Bank Team',
        icon: 'shopping-basket'
      }
    ];

    // Sample templates
    templates = [
      {
        id: 1,
        title: 'Weekly Prayer Meeting Reminder',
        description: 'Template for reminding members about weekly prayer meetings',
        category: 'prayer',
        subject: 'prayer_request',
        message: 'This is a reminder about our weekly prayer meeting tonight at 7 PM in the chapel. Please join us as we lift up the needs of our community.'
      },
      {
        id: 2,
        title: 'Financial Contribution Request',
        description: 'Template for requesting financial contributions for special projects',
        category: 'finance',
        subject: 'announcement',
        message: 'We\'re raising funds for our upcoming [project name]. Any contributions would be greatly appreciated to help us meet our goal of $[amount].'
      },
      {
        id: 3,
        title: 'Volunteer Opportunity',
        description: 'Template for announcing new volunteer opportunities',
        category: 'events',
        subject: 'event',
        message: 'We need volunteers for [event name] on [date]. Please sign up if you\'re available to help with [specific needs].'
      }
    ];

    // Sample critical alerts
    criticalAlerts = [
      {
        id: 1,
        message: 'Food bank supplies critically low - need immediate donations',
        icon: 'exclamation-triangle'
      },
      {
        id: 2,
        message: '3 unassigned prayer requests awaiting response',
        icon: 'user-clock'
      },
      {
        id: 3,
        message: 'Database backup failed - needs attention',
        icon: 'server'
      }
    ];

    renderCriticalAlerts();
    renderTemplates();
  }

  function setupEventListeners() {
    // Mark all as read
    markAllReadBtn.addEventListener('click', markAllAsRead);

    // Toggle notifications visibility
    toggleNotifications.addEventListener('change', function() {
      notificationList.style.display = this.checked ? 'block' : 'none';
      checkEmptyState();
    });

    // Filter and sort events
    filterCategory.addEventListener('change', renderNotifications);
    sortBy.addEventListener('change', renderNotifications);
    searchInput.addEventListener('input', renderNotifications);

    // Tab buttons
    tabButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        tabButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        renderNotifications();
      });
    });

    // Export button
    exportBtn.addEventListener('click', exportNotifications);

    // Modal handlers
    setupModalHandlers();
  }

  function setupModalHandlers() {
    // Open/close modals
    document.getElementById('open-preferences').addEventListener('click', () => toggleModal('preferences', true));
    document.getElementById('close-preferences').addEventListener('click', () => toggleModal('preferences', false));
    document.getElementById('send-notification-btn').addEventListener('click', () => toggleModal('sendNotification', true));
    document.getElementById('close-send-modal').addEventListener('click', () => toggleModal('sendNotification', false));
    document.getElementById('manage-templates').addEventListener('click', () => toggleModal('templates', true));
    document.getElementById('close-templates').addEventListener('click', () => toggleModal('templates', false));
    document.getElementById('advanced-filter-btn').addEventListener('click', () => toggleModal('advancedFilters', true));
    document.getElementById('close-advanced-filters').addEventListener('click', () => toggleModal('advancedFilters', false));

    // Close modals when clicking outside
    Object.values(modals).forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.style.display = 'none';
        }
      });
    });

    // Cancel buttons
    document.getElementById('cancel-preferences').addEventListener('click', () => toggleModal('preferences', false));
    document.getElementById('cancel-send-notification').addEventListener('click', () => toggleModal('sendNotification', false));
    document.getElementById('close-templates-modal').addEventListener('click', () => toggleModal('templates', false));

    // Recipient type selector
    const recipientType = document.getElementById('recipient-type');
    const recipientSelectors = {
      department: document.getElementById('department-select'),
      role: document.getElementById('role-select'),
      individual: document.getElementById('individual-select'),
      group: document.getElementById('group-select')
    };

    recipientType.addEventListener('change', function() {
      Object.values(recipientSelectors).forEach(el => el.style.display = 'none');
      if (this.value !== 'all') {
        recipientSelectors[this.value].style.display = 'block';
      }
    });

    // Initialize date pickers
    if (typeof flatpickr !== 'undefined') {
      flatpickr("#notification-expiry", {
        dateFormat: "Y-m-d",
        minDate: "today"
      });

      flatpickr("#filter-date-range", {
        mode: "range",
        dateFormat: "Y-m-d"
      });
    }

    // Send notification
    document.getElementById('send-notification').addEventListener('click', sendNotification);

    // Save template
    document.getElementById('save-template').addEventListener('click', saveTemplate);

    // New template button
    document.getElementById('new-template').addEventListener('click', function() {
      toggleModal('templates', false);
      toggleModal('sendNotification', true);
    });

    // Apply advanced filters
    document.getElementById('apply-filters').addEventListener('click', function() {
      renderNotifications();
      toggleModal('advancedFilters', false);
    });

    // Reset filters
    document.getElementById('reset-filters').addEventListener('click', function() {
      document.getElementById('advanced-filters-modal').querySelectorAll('select').forEach(select => {
        select.value = 'all';
      });
      document.getElementById('filter-date-range').value = '';
      renderNotifications();
    });
  }

  function toggleModal(modalName, show) {
    modals[modalName].style.display = show ? 'flex' : 'none';
    document.body.style.overflow = show ? 'hidden' : '';
  }

  function renderNotifications() {
    const activeFilter = document.querySelector('.tab-btn.active').dataset.filter;
    const categoryFilter = filterCategory.value;
    const searchQuery = searchInput.value.toLowerCase();
    const sortByValue = sortBy.value;

    // Filter notifications
    let filteredNotifications = notifications.filter(notification => {
      const matchesFilter = activeFilter === 'all' ||
                          (activeFilter === 'unread' && notification.isUnread) ||
                          (activeFilter === 'mentions' && notification.mentions) ||
                          (activeFilter === 'critical' && notification.isCritical) ||
                          (activeFilter === 'pinned' && notification.isPinned) ||
                          (activeFilter === 'user-requests' && notification.type === 'user-request');

      const matchesCategory = categoryFilter === 'all' || notification.category === categoryFilter;
      const matchesSearch = notification.title.toLowerCase().includes(searchQuery) ||
                           notification.message.toLowerCase().includes(searchQuery) ||
                           notification.sender.toLowerCase().includes(searchQuery);

      return matchesFilter && matchesCategory && matchesSearch;
    });

    // Sort notifications
    filteredNotifications.sort((a, b) => {
      if (sortByValue === 'newest') {
        return b.date - a.date;
      } else if (sortByValue === 'oldest') {
        return a.date - b.date;
      } else if (sortByValue === 'priority') {
        // Critical first, then unread, then read
        if (a.isCritical && !b.isCritical) return -1;
        if (!a.isCritical && b.isCritical) return 1;
        if (a.isUnread && !b.isUnread) return -1;
        if (!a.isUnread && b.isUnread) return 1;
        return b.date - a.date;
      }
      return 0;
    });

    // Render notifications
    notificationList.innerHTML = '';

    if (filteredNotifications.length === 0) {
      emptyState.style.display = 'flex';
    } else {
      emptyState.style.display = 'none';
      filteredNotifications.forEach(notification => {
        const notificationEl = createNotificationElement(notification);
        notificationList.appendChild(notificationEl);
      });
    }
  }

  function createNotificationElement(notification) {
    const notificationEl = document.createElement('div');
    notificationEl.className = `notification-item ${notification.isUnread ? 'unread' : ''}`;

    const icon = document.createElement('div');
    icon.className = 'notification-icon';
    icon.innerHTML = `<i class="fas fa-${notification.icon}"></i>`;

    const content = document.createElement('div');
    content.className = 'notification-content';

    const title = document.createElement('h4');
    title.className = 'notification-title';
    title.textContent = notification.title;

    const message = document.createElement('p');
    message.className = 'notification-message';
    message.textContent = notification.message;

    const meta = document.createElement('div');
    meta.className = 'notification-meta';

    const sender = document.createElement('span');
    sender.innerHTML = `<i class="fas fa-user"></i> ${notification.sender}`;

    const date = document.createElement('span');
    date.innerHTML = `<i class="fas fa-clock"></i> ${formatDate(notification.date)}`;

    meta.appendChild(sender);
    meta.appendChild(date);

    if (notification.mentions) {
      const mention = document.createElement('span');
      mention.innerHTML = '<i class="fas fa-at"></i> Mentioned';
      meta.appendChild(mention);
    }

    content.appendChild(title);
    content.appendChild(message);
    content.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'notification-actions';

    if (notification.isCritical) {
      const badge = document.createElement('span');
      badge.className = 'badge badge-critical';
      badge.textContent = 'Critical';
      actions.appendChild(badge);
    }

    if (notification.isPinned) {
      const pin = document.createElement('i');
      pin.className = 'fas fa-thumbtack pinned-icon';
      actions.appendChild(pin);
    }

    if (notification.isUnread) {
      const markReadBtn = document.createElement('button');
      markReadBtn.className = 'btn-mark-read';
      markReadBtn.innerHTML = '<i class="fas fa-check"></i> Mark Read';
      markReadBtn.addEventListener('click', () => markAsRead(notification.id));
      actions.appendChild(markReadBtn);
    }

    notificationEl.appendChild(icon);
    notificationEl.appendChild(content);
    notificationEl.appendChild(actions);

    return notificationEl;
  }

  function renderCriticalAlerts() {
    const alertsContainer = document.getElementById('critical-alerts');
    alertsContainer.innerHTML = '';

    criticalAlerts.forEach(alert => {
      const alertEl = document.createElement('li');
      alertEl.className = 'alert-item';

      const content = document.createElement('div');
      content.className = 'alert-content';

      const icon = document.createElement('div');
      icon.className = 'alert-icon';
      icon.innerHTML = `<i class="fas fa-${alert.icon}"></i>`;

      const text = document.createElement('div');
      text.className = 'alert-text';
      text.textContent = alert.message;

      const viewBtn = document.createElement('button');
      viewBtn.className = 'btn btn-outline';
      viewBtn.textContent = 'View';
      viewBtn.addEventListener('click', () => {
        // In a real app, this would navigate to the relevant alert
        alert(`Viewing alert: ${alert.message}`);
      });

      content.appendChild(icon);
      content.appendChild(text);

      alertEl.appendChild(content);
      alertEl.appendChild(viewBtn);

      alertsContainer.appendChild(alertEl);
    });
  }

  function renderTemplates() {
    const templatesContainer = document.getElementById('templates-list');
    templatesContainer.innerHTML = '';

    templates.forEach(template => {
      const templateEl = document.createElement('div');
      templateEl.className = 'template-item';

      const title = document.createElement('h4');
      title.textContent = template.title;

      const desc = document.createElement('p');
      desc.textContent = template.description;

      const category = document.createElement('span');
      category.className = 'template-category';
      category.textContent = template.category;

      templateEl.appendChild(title);
      templateEl.appendChild(desc);
      templateEl.appendChild(category);

      templateEl.addEventListener('click', () => {
        // Load template into send notification form
        document.getElementById('notification-subject').value = template.subject;
        document.getElementById('notification-message').value = template.message;
        toggleModal('templates', false);
        toggleModal('sendNotification', true);
      });

      templatesContainer.appendChild(templateEl);
    });
  }

  function markAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.isUnread = false;
      renderNotifications();
      updateStats();
    }
  }

  function markAllAsRead() {
    notifications.forEach(notification => {
      notification.isUnread = false;
    });
    renderNotifications();
    updateStats();
  }

  function updateStats() {
    const totalSent = notifications.length;
    const unreadCount = notifications.filter(n => n.isUnread).length;
    const criticalCount = notifications.filter(n => n.isCritical).length;
    const responseRate = totalSent > 0 ? Math.round((totalSent - unreadCount) / totalSent * 100) : 0;

    document.getElementById('total-sent').textContent = totalSent;
    document.getElementById('unread-count').textContent = unreadCount;
    document.getElementById('critical-count').textContent = criticalCount;
    document.getElementById('response-rate').textContent = `${responseRate}%`;
  }

  function checkEmptyState() {
    const hasNotifications = notificationList.children.length > 0;
    emptyState.style.display = hasNotifications || !toggleNotifications.checked ? 'none' : 'flex';
  }

  function sendNotification() {
    const subject = document.getElementById('notification-subject').value;
    const message = document.getElementById('notification-message').value;

    if (!subject || subject === 'select' || !message) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    // Create new notification
    const newNotification = {
      id: notifications.length + 1,
      title: subject === 'prayer_request' ? 'New Prayer Request' :
             subject === 'food-bank' ? 'Food Bank Update' :
             subject === 'event' ? 'Event Update' :
             subject === 'urgent' ? 'Urgent Alert' : 'New Notification',
      message: message,
      date: new Date(),
      category: document.getElementById('filter-category').value || 'general',
      isUnread: true,
      isCritical: document.getElementById('notification-priority').checked,
      isPinned: document.getElementById('notification-pin').checked,
      mentions: false,
      type: 'sent',
      sender: 'You',
      icon: getIconForSubject(subject)
    };

    // Add to notifications
    notifications.unshift(newNotification);

    // Reset form and close modal
    document.getElementById('send-notification-modal').querySelector('form').reset();
    toggleModal('sendNotification', false);

    // Update UI
    renderNotifications();
    updateStats();

    showAlert('Notification sent successfully!', 'success');
  }

  function saveTemplate() {
    const subject = document.getElementById('notification-subject').value;
    const message = document.getElementById('notification-message').value;

    if (!subject || subject === 'select' || !message) {
      showAlert('Please fill in all required fields', 'error');
      return;
    }

    // Create new template
    const newTemplate = {
      id: templates.length + 1,
      title: `Template ${templates.length + 1}`,
      description: `Saved from "${subject}" notification`,
      category: document.getElementById('filter-category').value || 'general',
      subject: subject,
      message: message
    };

    // Add to templates
    templates.push(newTemplate);

    // Update UI
    renderTemplates();

    showAlert('Template saved successfully!', 'success');
  }

  function exportNotifications() {
    // In a real app, this would generate a CSV or PDF
    showAlert('Export functionality would generate a file in a real application', 'info');
  }

  function getIconForSubject(subject) {
    switch(subject) {
      case 'prayer_request': return 'hands-praying';
      case 'food-bank': return 'shopping-basket';
      case 'event': return 'calendar-alt';
      case 'urgent': return 'exclamation-triangle';
      default: return 'bell';
    }
  }

  function formatDate(date) {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function showAlert(message, type) {
    // In a real app, this would show a nice toast notification
    alert(`${type.toUpperCase()}: ${message}`);
  }
});