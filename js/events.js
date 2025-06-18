  // Calendar functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize date pickers
            flatpickr(".datepicker", {
                dateFormat: "Y-m-d",
                allowInput: true
            });

            flatpickr(".timepicker", {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true
            });

            // Event modal handling
            const modal = document.getElementById('event-modal');
            const newEventBtn = document.getElementById('new-event-btn');
            const closeModal = document.querySelector('.modal-close');
            const cancelBtn = document.getElementById('cancel-event');

            newEventBtn.addEventListener('click', () => {
                modal.classList.remove('hidden');
            });

            closeModal.addEventListener('click', () => {
                modal.classList.add('hidden');
            });

            cancelBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });

            // Recurring event toggle
            const recurringCheckbox = document.getElementById('event-recurring');
            const recurrenceOptions = document.getElementById('recurrence-options');

            recurringCheckbox.addEventListener('change', function() {
                if(this.checked) {
                    recurrenceOptions.classList.remove('hidden');
                } else {
                    recurrenceOptions.classList.add('hidden');
                }
            });

            // Tab switching
            const tabs = document.querySelectorAll('[data-tab]');
            tabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const tabId = this.getAttribute('data-tab');

                    // Update active tab button
                    document.querySelectorAll('[data-tab]').forEach(t => {
                        t.classList.remove('active');
                    });
                    this.classList.add('active');

                    // Show corresponding content
                    document.querySelectorAll('.resource-content').forEach(content => {
                        content.classList.add('hidden');
                    });
                    document.getElementById(`${tabId}-tab`).classList.remove('hidden');
                });
            });

            // Calendar view switching
            const viewButtons = document.querySelectorAll('[data-view]');
            viewButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const view = this.getAttribute('data-view');

                    // Update active view button
                    document.querySelectorAll('[data-view]').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');

                    // Show corresponding view
                    document.querySelectorAll('.calendar-view-container').forEach(view => {
                        view.classList.add('hidden');
                    });
                    document.getElementById(`${view}-view`).classList.remove('hidden');
                });
            });

            // Generate calendar days (simplified example)
            generateCalendarDays();

            // Month navigation
            document.getElementById('prev-month').addEventListener('click', function() {
                // In a real app, this would update the calendar to show previous month
                console.log('Previous month');
                generateCalendarDays();
            });

            document.getElementById('next-month').addEventListener('click', function() {
                // In a real app, this would update the calendar to show next month
                console.log('Next month');
                generateCalendarDays();
            });

            function generateCalendarDays() {
                const calendarDays = document.getElementById('calendar-days');
                calendarDays.innerHTML = '';

                // This is a simplified example - a real implementation would generate days for the current month
                for (let i = 0; i < 35; i++) {
                    const day = document.createElement('div');
                    day.className = 'calendar-day';

                    if (i < 5 || i >= 30) {
                        day.classList.add('other-month');
                    } else {
                        day.textContent = i - 4;

                        // Add sample events
                        if (i === 10) {
                            const event = document.createElement('div');
                            event.className = 'calendar-event';
                            event.textContent = 'Worship Service';
                            day.appendChild(event);
                        }

                        if (i === 18) {
                            const event = document.createElement('div');
                            event.className = 'calendar-event';
                            event.textContent = 'Staff Meeting';
                            day.appendChild(event);
                        }
                    }

                    calendarDays.appendChild(day);
                }
            }


            document.getElementById('event-form').addEventListener('submit', function(e) {
                e.preventDefault();
                // In a real app, this would save the event data
                console.log('Event saved');
                modal.classList.add('hidden');
                // Reset form
                this.reset();
            });
        });