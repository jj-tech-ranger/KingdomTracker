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
document.addEventListener('DOMContentLoaded', function() {
    // [Previous initialization code remains the same until the end]

    // Assignment modal handling
    const assignmentModal = document.getElementById('assignment-modal');
    const addAssignmentBtn = document.createElement('button');
    addAssignmentBtn.className = 'btn btn-primary';
    addAssignmentBtn.innerHTML = '<i class="fas fa-user-plus"></i> Assign Personnel';
    addAssignmentBtn.id = 'add-assignment-btn';
    document.querySelector('.events-actions').appendChild(addAssignmentBtn);

    const closeAssignmentModal = assignmentModal.querySelector('.modal-close');
    const cancelAssignmentBtn = document.getElementById('cancel-assignment');

    addAssignmentBtn.addEventListener('click', () => {
        assignmentModal.classList.remove('hidden');
    });

    closeAssignmentModal.addEventListener('click', () => {
        assignmentModal.classList.add('hidden');
    });

    cancelAssignmentBtn.addEventListener('click', () => {
        assignmentModal.classList.add('hidden');
    });

    // Handle assignment form submission
    document.getElementById('assignment-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const event = document.getElementById('assignment-event').value;
        const person = document.getElementById('assignment-person').value;
        const role = document.getElementById('assignment-role').value;
        const notes = document.getElementById('assignment-notes').value;

        // In a real app, this would save the assignment to your database
        console.log('Assignment saved:', { event, person, role, notes });

        // Add the new assignment to the personnel tab
        addAssignmentToView(event, person, role, notes);

        // Reset and close the form
        this.reset();
        assignmentModal.classList.add('hidden');
    });

    // Function to add assignment to the view
    function addAssignmentToView(event, person, role, notes) {
        const personnelTab = document.getElementById('personnel-tab');
        const assignmentList = personnelTab.querySelector('.assignment-list') || personnelTab.querySelector('.resource-card .assignment-list');

        if (!assignmentList) return;

        const assignment = document.createElement('div');
        assignment.className = 'assignment';

        // Extract person details from the selected option
        const personOption = document.querySelector(`#assignment-person option[value="${person}"]`);
        const personText = personOption ? personOption.textContent : person;

        // Create assignment HTML
        assignment.innerHTML = `
            <img src="../img/user.png" alt="User" class="member-photo">
            <div class="assignment-details">
                <span class="assignment-name">${personText.split(' (')[0]}</span>
                <span class="assignment-role">${document.querySelector(`#assignment-role option[value="${role}"]`).textContent}</span>
            </div>
            <button class="btn btn-secondary btn-sm">Message</button>
        `;

        assignmentList.appendChild(assignment);
    }

    // [Rest of the existing code remains the same]
});

// Generate sample assignments on page load
function generateSampleAssignments() {
    const assignments = [
        {
            event: "Sunday Worship Service",
            person: "John Doe (Pastor)",
            role: "Pastor",
            notes: "Main speaker for the service"
        },
        {
            event: "Sunday Worship Service",
            person: "Jane Smith (Worship Leader)",
            role: "Worship Leader",
            notes: "Leading praise and worship"
        },
        {
            event: "Thursday Counseling",
            person: "Mike Johnson (Deacon)",
            role: "Counselor",
            notes: "Evening counseling session"
        }
    ];

    assignments.forEach(assignment => {
        addAssignmentToView(
            assignment.event,
            assignment.person.toLowerCase().replace(/\s+/g, '-'),
            assignment.role.toLowerCase().replace(/\s+/g, '-'),
            assignment.notes
        );
    });
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', generateSampleAssignments);