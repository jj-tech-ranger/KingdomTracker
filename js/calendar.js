document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle (inherited from sunday_school.js)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Load theme preference (inherited from sunday_school.js)
    loadThemePreference();

    // Initialize calendar and events
    let calendar;
    const events = generateSampleEvents();
    let currentView = 'month';

    // DOM elements
    const calendarEl = document.getElementById('calendar');
    const calendarListView = document.getElementById('calendar-list-view');
    const eventListEl = document.getElementById('event-list');
    const eventSearch = document.getElementById('event-search');
    const categoryFilter = document.getElementById('event-category-filter');
    const audienceFilter = document.getElementById('event-audience-filter');
    const dateRangeFilter = document.getElementById('event-date-range');
    const customRangeGroup = document.getElementById('custom-range-group');
    const customStartDate = document.getElementById('custom-start-date');
    const customEndDate = document.getElementById('custom-end-date');
    const addEventBtn = document.getElementById('add-event-btn');
    const addEventModal = document.getElementById('add-event-modal');
    const addEventForm = document.getElementById('add-event-form');
    const eventDetailsModal = document.getElementById('event-details-modal');
    const editEventBtn = document.getElementById('edit-event-btn');
    const deleteEventBtn = document.getElementById('delete-event-btn');
    const addToCalendarBtn = document.getElementById('add-to-calendar-btn');
    const viewOptions = document.querySelectorAll('.view-option');
    const exportEventsBtn = document.getElementById('export-events-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const recurringOptions = document.getElementById('recurring-options');
    const recurringSelect = document.getElementById('event-recurring');

    // Initialize calendar
    initializeCalendar();

    // Event listeners
    eventSearch.addEventListener('input', filterEvents);
    categoryFilter.addEventListener('change', filterEvents);
    audienceFilter.addEventListener('change', filterEvents);
    dateRangeFilter.addEventListener('change', handleDateRangeChange);
    customStartDate.addEventListener('change', filterEvents);
    customEndDate.addEventListener('change', filterEvents);
    addEventBtn.addEventListener('click', () => addEventModal.style.display = 'flex');
    addEventForm.addEventListener('submit', handleAddEvent);
    editEventBtn.addEventListener('click', editEvent);
    deleteEventBtn.addEventListener('click', deleteEvent);
    addToCalendarBtn.addEventListener('click', addToPersonalCalendar);
    exportEventsBtn.addEventListener('click', exportEvents);
    recurringSelect.addEventListener('change', toggleRecurringOptions);

    viewOptions.forEach(option => {
        option.addEventListener('click', () => {
            viewOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            currentView = option.dataset.view;
            toggleCalendarView();
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            addEventModal.style.display = 'none';
            eventDetailsModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addEventModal) {
            addEventModal.style.display = 'none';
        }
        if (e.target === eventDetailsModal) {
            eventDetailsModal.style.display = 'none';
        }
    });

    // Functions
    function initializeCalendar() {
        calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: ''
            },
            events: events,
            eventClick: handleEventClick,
            eventClassNames: function(arg) {
                return ['fc-event-' + arg.event.extendedProps.category];
            },
            eventContent: function(arg) {
                return {
                    html: `<div class="fc-event-title">${arg.event.title}</div>`
                };
            },
            height: 'auto',
            eventDisplay: 'block',
            eventTimeFormat: {
                hour: 'numeric',
                minute: '2-digit',
                meridiem: 'short'
            }
        });

        calendar.render();
    }

    function generateSampleEvents() {
        const categories = ['class', 'meeting', 'event', 'training', 'holiday'];
        const audiences = ['teachers', 'students', 'parents', 'volunteers'];
        const eventTitles = [
            'Sunday School Classes',
            'Teachers Meeting',
            'Christmas Pageant Rehearsal',
            'Teacher Training Workshop',
            'Easter Sunday Celebration',
            'Vacation Bible School',
            'Parent Orientation',
            'Volunteer Appreciation Dinner',
            'Curriculum Planning Session',
            'End of Year Party',
            'Thanksgiving Service',
            'New Year Sunday',
            'Bible Study Kickoff',
            'Mission Sunday',
            'Children\'s Choir Practice'
        ];

        const events = [];
        const today = new Date();

        for (let i = 0; i < 15; i++) {
            const startDate = new Date(today);
            startDate.setDate(today.getDate() + (i * 3));

            const endDate = new Date(startDate);
            endDate.setHours(startDate.getHours() + 2);

            const category = categories[Math.floor(Math.random() * categories.length)];
            const audience = [];
            const numAudiences = Math.floor(Math.random() * 3) + 1;

            for (let j = 0; j < numAudiences; j++) {
                const aud = audiences[Math.floor(Math.random() * audiences.length)];
                if (!audience.includes(aud)) {
                    audience.push(aud);
                }
            }

            events.push({
                id: i + 1,
                title: eventTitles[i],
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                extendedProps: {
                    category: category,
                    audience: audience,
                    location: ['Sanctuary', 'Fellowship Hall', 'Classroom 1', 'Classroom 2', 'Outdoor Pavilion'][Math.floor(Math.random() * 5)],
                    description: `This is a detailed description for ${eventTitles[i]}. It includes all the important information participants need to know about the event.`,
                    recurring: Math.random() > 0.7 ? ['daily', 'weekly', 'monthly', 'yearly'][Math.floor(Math.random() * 4)] : null,
                    recurringEnd: Math.random() > 0.7 ? new Date(startDate.getTime() + (30 * 24 * 60 * 60 * 1000)).toISOString() : null
                }
            });
        }

        return events;
    }

    function handleEventClick(info) {
        const event = info.event;
        const startDate = event.start ? new Date(event.start) : null;
        const endDate = event.end ? new Date(event.end) : null;

        document.getElementById('event-details-title').textContent = event.title;
        document.getElementById('event-details-date').textContent = startDate ? startDate.toLocaleDateString() : 'N/A';

        if (startDate && endDate) {
            const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            document.getElementById('event-details-time').textContent = `${startTime} - ${endTime}`;
        } else {
            document.getElementById('event-details-time').textContent = 'All day';
        }

        document.getElementById('event-details-location').textContent = event.extendedProps.location || 'TBD';
        document.getElementById('event-details-category').textContent = capitalizeFirstLetter(event.extendedProps.category);
        document.getElementById('event-details-audience').textContent = event.extendedProps.audience.map(aud => capitalizeFirstLetter(aud)).join(', ');
        document.getElementById('event-details-description').textContent = event.extendedProps.description || 'No description available.';

        if (event.extendedProps.recurring) {
            document.getElementById('event-details-recurring').textContent =
                `Repeats ${event.extendedProps.recurring} until ${event.extendedProps.recurringEnd ? new Date(event.extendedProps.recurringEnd).toLocaleDateString() : 'indefinitely'}`;
            document.getElementById('event-recurring-info').style.display = 'flex';
        } else {
            document.getElementById('event-recurring-info').style.display = 'none';
        }

        // Store event ID for edit/delete
        eventDetailsModal.dataset.eventId = event.id;

        eventDetailsModal.style.display = 'flex';
    }

    function filterEvents() {
        const searchTerm = eventSearch.value.toLowerCase();
        const categoryFilterValue = categoryFilter.value;
        const audienceFilterValue = audienceFilter.value;

        let filteredEvents = events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                                event.extendedProps.description.toLowerCase().includes(searchTerm);

            const matchesCategory = categoryFilterValue === 'all' || event.extendedProps.category === categoryFilterValue;
            const matchesAudience = audienceFilterValue === 'all' ||
                                  event.extendedProps.audience.some(aud => aud === audienceFilterValue);

            return matchesSearch && matchesCategory && matchesAudience;
        });

        // Apply date range filter
        filteredEvents = applyDateRangeFilter(filteredEvents);

        // Update calendar
        calendar.removeAllEvents();
        filteredEvents.forEach(event => calendar.addEvent(event));

        // Update list view
        renderEventList(filteredEvents);
    }

    function applyDateRangeFilter(events) {
        const dateRange = dateRangeFilter.value;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let startDate, endDate;

        switch (dateRange) {
            case 'week':
                startDate = new Date(today);
                endDate = new Date(today);
                endDate.setDate(today.getDate() + 7);
                break;
            case 'next-month':
                startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
                break;
            case 'next-3-months':
                startDate = new Date(today);
                endDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate());
                break;
            case 'custom':
                if (customStartDate.value && customEndDate.value) {
                    startDate = new Date(customStartDate.value);
                    endDate = new Date(customEndDate.value);
                }
                break;
            default: // month
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        }

        if (startDate && endDate) {
            return events.filter(event => {
                const eventDate = event.start ? new Date(event.start) : null;
                if (!eventDate) return false;

                return eventDate >= startDate && eventDate <= endDate;
            });
        }

        return events;
    }

    function handleDateRangeChange() {
        if (dateRangeFilter.value === 'custom') {
            customRangeGroup.style.display = 'flex';
        } else {
            customRangeGroup.style.display = 'none';
            filterEvents();
        }
    }

    function toggleCalendarView() {
        if (currentView === 'list') {
            calendarListView.style.display = 'block';
            calendarEl.style.display = 'none';
            renderEventList(events);
        } else {
            calendarListView.style.display = 'none';
            calendarEl.style.display = 'block';

            switch (currentView) {
                case 'month':
                    calendar.changeView('dayGridMonth');
                    break;
                case 'week':
                    calendar.changeView('timeGridWeek');
                    break;
                case 'day':
                    calendar.changeView('timeGridDay');
                    break;
            }
        }
    }

    function renderEventList(events) {
        eventListEl.innerHTML = '';

        if (events.length === 0) {
            eventListEl.innerHTML = `
                <div class="no-events">
                    <i class="fas fa-calendar-times"></i>
                    <p>No events found matching your criteria</p>
                </div>
            `;
            return;
        }

        // Sort events by date
        const sortedEvents = [...events].sort((a, b) => {
            return new Date(a.start) - new Date(b.start);
        });

        sortedEvents.forEach(event => {
            const eventDate = new Date(event.start);
            const eventItem = document.createElement('li');
            eventItem.className = 'event-item';

            eventItem.innerHTML = `
                <div class="event-date">
                    ${eventDate.toLocaleDateString()}<br>
                    ${eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div class="event-info">
                    <div class="event-title">${event.title}</div>
                    <div class="event-meta">
                        <span class="event-location"><i class="fas fa-map-marker-alt"></i> ${event.extendedProps.location}</span>
                        <span class="event-category ${event.extendedProps.category}">${capitalizeFirstLetter(event.extendedProps.category)}</span>
                    </div>
                </div>
                <div class="event-actions">
                    <button class="event-action-btn view-event" data-id="${event.id}" title="View Details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="event-action-btn edit-event" data-id="${event.id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            `;

            eventListEl.appendChild(eventItem);
        });

        // Add event listeners
        document.querySelectorAll('.view-event').forEach(btn => {
            btn.addEventListener('click', () => {
                const event = events.find(e => e.id === parseInt(btn.dataset.id));
                if (event) {
                    calendar.gotoDate(event.start);
                    handleEventClick({ event });
                }
            });
        });

        document.querySelectorAll('.edit-event').forEach(btn => {
            btn.addEventListener('click', () => {
                const event = events.find(e => e.id === parseInt(btn.dataset.id));
                if (event) {
                    editEventById(event.id);
                }
            });
        });
    }

    function handleAddEvent(e) {
        e.preventDefault();

        const title = document.getElementById('event-title').value;
        const startDate = document.getElementById('event-start-date').value;
        const startTime = document.getElementById('event-start-time').value;
        const endDate = document.getElementById('event-end-date').value || startDate;
        const endTime = document.getElementById('event-end-time').value || startTime;
        const category = document.getElementById('event-category').value;
        const audience = Array.from(document.getElementById('event-audience').selectedOptions).map(opt => opt.value);
        const location = document.getElementById('event-location').value;
        const description = document.getElementById('event-description').value;
        const recurring = document.getElementById('event-recurring').value;
        const recurringEndDate = document.getElementById('recurring-end-date').value;
        const recurringCount = document.getElementById('recurring-count').value;
        const reminder = document.getElementById('event-reminder').value;

        const start = new Date(`${startDate}T${startTime || '00:00'}`);
        const end = new Date(`${endDate}T${endTime || '00:00'}`);

        const newEvent = {
            id: events.length + 1,
            title,
            start: start.toISOString(),
            end: end.toISOString(),
            extendedProps: {
                category,
                audience,
                location,
                description,
                recurring: recurring !== 'none' ? recurring : null,
                recurringEnd: recurringEndDate ? new Date(recurringEndDate).toISOString() : null,
                reminder: reminder !== 'none' ? parseInt(reminder) : null
            }
        };

        events.push(newEvent);
        calendar.addEvent(newEvent);
        addEventForm.reset();
        addEventModal.style.display = 'none';

        // Update filters and views
        filterEvents();

        alert(`${title} has been added to the calendar.`);
    }

    function editEvent() {
        const eventId = parseInt(eventDetailsModal.dataset.eventId);
        editEventById(eventId);
    }

    function editEventById(eventId) {
        const event = events.find(e => e.id === eventId);
        if (!event) return;

        // In a real app, this would populate the add event form with existing data
        // and change the form to edit mode
        alert(`Edit functionality for "${event.title}" would be implemented here.`);
    }

    function deleteEvent() {
        const eventId = parseInt(eventDetailsModal.dataset.eventId);
        const event = events.find(e => e.id === eventId);
        if (!event) return;

        if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
            const index = events.findIndex(e => e.id === eventId);
            if (index !== -1) {
                events.splice(index, 1);
                calendar.getEventById(eventId.toString())?.remove();
                eventDetailsModal.style.display = 'none';
                filterEvents();
            }
        }
    }

    function addToPersonalCalendar() {
        const eventId = parseInt(eventDetailsModal.dataset.eventId);
        const event = events.find(e => e.id === eventId);
        if (!event) return;

        // In a real app, this would export the event to the user's personal calendar
        alert(`"${event.title}" would be added to your personal calendar in a real application.`);
    }

    function exportEvents() {
        // In a real app, this would export all filtered events
        alert('Export functionality would be implemented here. Events could be exported as CSV, PDF, or iCal format.');
    }

    function toggleRecurringOptions() {
        if (recurringSelect.value !== 'none') {
            recurringOptions.style.display = 'block';
        } else {
            recurringOptions.style.display = 'none';
        }
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Inherit theme functions from sunday_school.js
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));

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
});