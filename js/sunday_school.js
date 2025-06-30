document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Load theme preference
    loadThemePreference();

    // Notification bell click handler
    const notificationBell = document.querySelector('.notification-bell');
    if (notificationBell) {
        notificationBell.addEventListener('click', showNotifications);
    }

    // Quick action buttons
    setupQuickActions();

    // Sample data loading (would be replaced with real API calls in production)
    loadSampleData();
});

// Theme Management
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));

    // Update icon
    const icon = document.querySelector('#theme-toggle i');
    if (document.body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

function loadThemePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('#theme-toggle i');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// Notification handling
function showNotifications() {
    // In a real app, this would fetch actual notifications
    const notifications = [
        { id: 1, text: "2 new student registrations", read: false },
        { id: 2, text: "1 attendance reminder", read: false },
        { id: 3, text: "Teacher meeting tomorrow", read: true }
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    alert(`You have ${unreadCount} new notifications:\n\n${
        notifications.map(n => `- ${n.text}${n.read ? ' (read)' : ''}`).join('\n')
    }`);
}

// Quick action buttons
function setupQuickActions() {
    const actions = {
        'add-student': 'Add New Student',
        'record-attendance': 'Record Attendance',
        'create-lesson': 'Create Lesson Plan',
        'send-announcement': 'Send Announcement'
    };

    Object.keys(actions).forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', () => {
                alert(`Action: ${actions[id]}\n\nThis would open the appropriate form in a full implementation.`);
            });
        }
    });
}

// Sample data loading
function loadSampleData() {
    // In a real app, this would be API calls to your backend
    const sampleEvents = [
        {
            day: '15',
            month: 'Dec',
            title: 'Christmas Pageant Rehearsal',
            details: '10:00 AM - Sanctuary • All classes participate'
        },
        {
            day: '22',
            month: 'Dec',
            title: 'Christmas Pageant',
            details: '9:30 AM - Sanctuary • Special Sunday schedule'
        }
    ];

    const sampleAnnouncements = [
        {
            emoji: '🎄',
            title: 'Christmas Pageant Details',
            text: 'All students should arrive by 9:00 AM on December 22nd in their costumes.',
            date: 'Posted 2 days ago by Pastor Sarah'
        },
        {
            emoji: '📚',
            title: 'New Curriculum Materials',
            text: 'The January curriculum books have arrived. Please pick yours up from the office.',
            date: 'Posted 1 week ago by Admin'
        }
    ];

    // Render events
    const eventsList = document.getElementById('events-list');
    if (eventsList) {
        eventsList.innerHTML = sampleEvents.map(event => `
            <li class="event-item">
                <div class="event-date">
                    <div class="day">${event.day}</div>
                    <div class="month">${event.month}</div>
                </div>
                <div class="event-details">
                    <h4>${event.title}</h4>
                    <p>${event.details}</p>
                </div>
            </li>
        `).join('');
    }

    // Render announcements
    const announcementsList = document.getElementById('announcements-list');
    if (announcementsList) {
        announcementsList.innerHTML = sampleAnnouncements.map(announcement => `
            <div class="announcement-item">
                <h4><span class="emoji">${announcement.emoji}</span> ${announcement.title}</h4>
                <p>${announcement.text}</p>
                <div class="date">${announcement.date}</div>
            </div>
        `).join('');
    }
}