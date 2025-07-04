document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    loadThemePreference();

    // Initialize data with 15 students per age group (75 total)
    const students = generateStudents();
    let filteredStudents = [...students];
    let currentGroup = 'all';
    let currentPage = 1;
    let studentsPerPage = parseInt(document.getElementById('rows-per-page').value);
    let attendanceRecords = generateAttendanceRecords(students);

    // DOM elements
    const attendanceTableBody = document.getElementById('attendance-table-body');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const rowsPerPageSelect = document.getElementById('rows-per-page');
    const studentSearch = document.getElementById('attendance-search');
    const classFilterBtns = document.querySelectorAll('.class-filter-btn');
    const saveAttendanceBtn = document.getElementById('save-attendance-btn');
    const sendNotificationsBtn = document.getElementById('send-notifications-btn');
    const bulkActionBtn = document.getElementById('bulk-action-btn');
    const todayBtn = document.getElementById('today-btn');
    const attendanceDate = document.getElementById('attendance-date');
    const selectAllCheckbox = document.getElementById('select-all');
    const totalStudentsEl = document.getElementById('total-students');
    const presentStudentsEl = document.getElementById('present-students');
    const absentStudentsEl = document.getElementById('absent-students');
    const attendanceRateEl = document.getElementById('attendance-rate');
    const historyPeriod = document.getElementById('history-period');
    const customRange = document.getElementById('custom-range');
    const startDate = document.getElementById('start-date');
    const endDate = document.getElementById('end-date');
    const viewHistoryBtn = document.getElementById('view-history-btn');
    const exportHistoryBtn = document.getElementById('export-history-btn');
    const historyTableBody = document.getElementById('history-table-body');
    const attendanceChartCtx = document.getElementById('attendance-chart');
    const attendanceDetailModal = document.getElementById('attendance-detail-modal');
    const bulkActionsModal = document.getElementById('bulk-actions-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const applyBulkActionsBtn = document.getElementById('apply-bulk-actions');
    const bulkStatusBtns = document.querySelectorAll('.bulk-status-btn');
    const bulkTimeIn = document.getElementById('bulk-time-in');
    const bulkNotes = document.getElementById('bulk-notes');

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    attendanceDate.value = today;
    startDate.value = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
    endDate.value = today;

    // Initialize Chart
    let attendanceChart = initializeChart();

    // Event listeners
    prevPageBtn.addEventListener('click', goToPrevPage);
    nextPageBtn.addEventListener('click', goToNextPage);
    rowsPerPageSelect.addEventListener('change', updateRowsPerPage);
    studentSearch.addEventListener('input', filterStudents);
    todayBtn.addEventListener('click', setDateToToday);
    attendanceDate.addEventListener('change', loadAttendanceForDate);
    selectAllCheckbox.addEventListener('change', toggleSelectAll);
    saveAttendanceBtn.addEventListener('click', saveAttendance);
    sendNotificationsBtn.addEventListener('click', sendNotifications);
    bulkActionBtn.addEventListener('click', openBulkActionsModal);
    historyPeriod.addEventListener('change', toggleCustomDateRange);
    viewHistoryBtn.addEventListener('click', viewAttendanceHistory);
    exportHistoryBtn.addEventListener('click', exportAttendanceHistory);
    applyBulkActionsBtn.addEventListener('click', applyBulkActions);

    // Add click events to class filter buttons
    classFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            classFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentGroup = btn.dataset.group;
            currentPage = 1;
            filterStudents();
            renderAttendanceTable();
        });
    });

    // Add click events to bulk status buttons
    bulkStatusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            bulkStatusBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Close modal buttons
    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeModals);
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === attendanceDetailModal) {
            attendanceDetailModal.style.display = 'none';
        }
        if (e.target === bulkActionsModal) {
            bulkActionsModal.style.display = 'none';
        }
    });

    // Tab functionality for attendance detail modal
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            tabBtns.forEach(tb => tb.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Initial render
    filterStudents();
    renderAttendanceTable();
    loadAttendanceForDate();
    updateStats();
    viewAttendanceHistory(); // Load initial history data

    // Data generation functions
    function generateStudents() {
        const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'James', 'Isabella', 'Oliver'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
        const classGroups = [
            { id: '3-5', name: 'Preschool', minAge: 3, maxAge: 5 },
            { id: '6-8', name: 'Early Elementary', minAge: 6, maxAge: 8 },
            { id: '9-12', name: 'Elementary', minAge: 9, maxAge: 12 },
            { id: '13-15', name: 'Early Teens', minAge: 13, maxAge: 15 },
            { id: '16-18', name: 'Teens', minAge: 16, maxAge: 18 }
        ];

        const students = [];
        let id = 1;

        // Generate 15 students per age group (75 total)
        classGroups.forEach(group => {
            for (let i = 0; i < 15; i++) {
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const age = Math.floor(Math.random() * (group.maxAge - group.minAge + 1)) + group.minAge;

                // Generate birthdate based on age
                const birthdate = new Date();
                birthdate.setFullYear(birthdate.getFullYear() - age);
                birthdate.setMonth(Math.floor(Math.random() * 12));
                birthdate.setDate(Math.floor(Math.random() * 28) + 1);

                students.push({
                    id: id++,
                    firstName,
                    lastName,
                    age,
                    birthdate: birthdate.toISOString().split('T')[0],
                    gender: Math.random() > 0.5 ? 'male' : 'female',
                    classGroup: group.id,
                    parentName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
                    parentPhone: `(${Math.floor(100 + Math.random() * 900)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
                    parentEmail: `parent${id}@example.com`
                });
            }
        });

        return students;
    }

    function generateAttendanceRecords(students) {
    const records = [];
    const today = new Date();

    // Generate records for the past 30 days
    for (let i = 0; i < 30; i++) {
        const recordDate = new Date();
        recordDate.setDate(today.getDate() - i);
        const dateStr = recordDate.toISOString().split('T')[0];

        const dayRecords = {
            date: dateStr,
            attendance: {}
        };

        // Calculate exact numbers for each status
        const totalStudents = students.length;
        const presentCount = Math.floor(totalStudents * 0.8); // At least 60 present (80%)
        const lateCount = Math.floor(totalStudents * 0.05); // 5% late (about 3-4)
        const absentCount = totalStudents - presentCount - lateCount; // Remainder absent (about 11-12)

        // Create an array to shuffle statuses
        const statuses = [];

        // Add present statuses
        for (let i = 0; i < presentCount; i++) {
            statuses.push('present');
        }

        // Add late statuses
        for (let i = 0; i < lateCount; i++) {
            statuses.push('late');
        }

        // Add absent statuses
        for (let i = 0; i < absentCount; i++) {
            statuses.push('absent');
        }

        // Shuffle the statuses to distribute randomly
        shuffleArray(statuses);

        // Assign statuses to students
        students.forEach((student, index) => {
            const status = statuses[index];

            dayRecords.attendance[student.id] = {
                status,
                timeIn: status === 'absent' ? null : getRandomTime(9, 10), // Between 9:00 and 10:00
                notes: status === 'late' ? 'Arrived late' : (status === 'absent' ? 'No show' : '')
            };
        });

        records.push(dayRecords);
    }

    return records;
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

    function getRandomTime(startHour, endHour) {
        const hour = Math.floor(Math.random() * (endHour - startHour)) + startHour;
        const minute = Math.floor(Math.random() * 60);
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    // Core functionality functions
    function filterStudents() {
        const searchTerm = studentSearch.value.toLowerCase();

        filteredStudents = students.filter(student => {
            const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm);

            let matchesGroup = true;
            if (currentGroup !== 'all') {
                const [minAge, maxAge] = currentGroup.split('-').map(Number);
                matchesGroup = student.age >= minAge && student.age <= maxAge;
            }

            return matchesSearch && matchesGroup;
        });

        // Reset to first page when filtering
        currentPage = 1;
        renderAttendanceTable();
    }

    function renderAttendanceTable() {
        const startIndex = (currentPage - 1) * studentsPerPage;
        const endIndex = startIndex + studentsPerPage;
        const paginatedStudents = filteredStudents.slice(startIndex, endIndex);
        const currentDate = attendanceDate.value;
        const currentRecord = attendanceRecords.find(r => r.date === currentDate) || { attendance: {} };

        attendanceTableBody.innerHTML = '';

        if (paginatedStudents.length === 0) {
            attendanceTableBody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center;">No students found matching your criteria</td>
                </tr>
            `;
        } else {
            paginatedStudents.forEach(student => {
                const attendance = currentRecord.attendance[student.id] || { status: 'absent', timeIn: null, notes: '' };

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="checkbox" class="student-checkbox" data-id="${student.id}"></td>
                    <td>${student.firstName} ${student.lastName}</td>
                    <td>${student.age}</td>
                    <td>${getClassGroupLabel(student.classGroup)}</td>
                    <td>
                        <select class="attendance-status-select" data-id="${student.id}">
                            <option value="present" ${attendance.status === 'present' ? 'selected' : ''}>Present</option>
                            <option value="absent" ${attendance.status === 'absent' ? 'selected' : ''}>Absent</option>
                            <option value="late" ${attendance.status === 'late' ? 'selected' : ''}>Late</option>
                        </select>
                    </td>
                    <td>
                        <input type="time" class="time-in-input" data-id="${student.id}" 
                               value="${attendance.timeIn || ''}" ${attendance.status === 'absent' ? 'disabled' : ''}>
                    </td>
                    <td>
                        <input type="text" class="notes-input" data-id="${student.id}" 
                               value="${attendance.notes || ''}" placeholder="Add notes...">
                    </td>
                    <td>
                        <button class="action-btn view-attendance" data-id="${student.id}" title="View History">
                            <i class="fas fa-history"></i>
                        </button>
                        <button class="action-btn notify-parent" data-id="${student.id}" title="Notify Parent">
                            <i class="fas fa-bell"></i>
                        </button>
                    </td>
                `;
                attendanceTableBody.appendChild(row);
            });
        }

        updatePaginationInfo();
        addDynamicEventListeners();
        updateStats();
    }

    function addDynamicEventListeners() {
        // Status select change
        document.querySelectorAll('.attendance-status-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const studentId = parseInt(e.target.dataset.id);
                const status = e.target.value;
                const timeInInput = document.querySelector(`.time-in-input[data-id="${studentId}"]`);

                if (status === 'absent') {
                    timeInInput.disabled = true;
                    timeInInput.value = '';
                } else {
                    timeInInput.disabled = false;
                    if (!timeInInput.value) {
                        const now = new Date();
                        timeInInput.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                    }
                }

                updateStats();
            });
        });

        // Time input change
        document.querySelectorAll('.time-in-input').forEach(input => {
            input.addEventListener('change', updateStats);
        });

        // View attendance history
        document.querySelectorAll('.view-attendance').forEach(btn => {
            btn.addEventListener('click', () => viewAttendanceHistoryForStudent(parseInt(btn.dataset.id)));
        });

        // Notify parent
        document.querySelectorAll('.notify-parent').forEach(btn => {
            btn.addEventListener('click', () => notifyParentAboutStudent(parseInt(btn.dataset.id)));
        });
    }

    function updatePaginationInfo() {
        const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    function updateStats() {
        const currentDate = attendanceDate.value;
        const currentRecord = attendanceRecords.find(r => r.date === currentDate) || { attendance: {} };

        let presentCount = 0;
        let absentCount = 0;

        // Count status from the form inputs
        const statusSelects = document.querySelectorAll('.attendance-status-select');
        statusSelects.forEach(select => {
            if (select.value === 'present' || select.value === 'late') {
                presentCount++;
            } else {
                absentCount++;
            }
        });

        totalStudentsEl.textContent = filteredStudents.length;
        presentStudentsEl.textContent = presentCount;
        absentStudentsEl.textContent = absentCount;

        const attendanceRate = filteredStudents.length > 0 ? Math.round((presentCount / filteredStudents.length) * 100) : 0;
        attendanceRateEl.textContent = `${attendanceRate}%`;
    }

    // Button action functions
    function goToPrevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderAttendanceTable();
        }
    }

    function goToNextPage() {
        if (currentPage < Math.ceil(filteredStudents.length / studentsPerPage)) {
            currentPage++;
            renderAttendanceTable();
        }
    }

    function updateRowsPerPage() {
        studentsPerPage = parseInt(rowsPerPageSelect.value);
        currentPage = 1;
        renderAttendanceTable();
    }

    function setDateToToday() {
        attendanceDate.value = today;
        loadAttendanceForDate(today);
    }

    function loadAttendanceForDate() {
        currentPage = 1;
        filterStudents();
        renderAttendanceTable();
        updateStats();
    }

    function toggleSelectAll(e) {
        const checkboxes = attendanceTableBody.querySelectorAll('.student-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = e.target.checked;
        });
    }

    function saveAttendance() {
        const currentDate = attendanceDate.value;
        let record = attendanceRecords.find(r => r.date === currentDate);

        if (!record) {
            record = { date: currentDate, attendance: {} };
            attendanceRecords.push(record);
        }

        // Get all the form data
        const rows = attendanceTableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const studentId = parseInt(row.querySelector('.student-checkbox').dataset.id);
            const status = row.querySelector('.attendance-status-select').value;
            const timeIn = row.querySelector('.time-in-input').value;
            const notes = row.querySelector('.notes-input').value;

            record.attendance[studentId] = { status, timeIn, notes };
        });

        // Sort attendance records by date (newest first)
        attendanceRecords.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Show success message
        showToast(`Attendance for ${formatDate(currentDate)} has been saved.`);
        updateStats();
    }

    function sendNotifications() {
        const currentDate = attendanceDate.value;
        const record = attendanceRecords.find(r => r.date === currentDate);

        if (!record) {
            showToast('No attendance data to notify about. Please save attendance first.', 'error');
            return;
        }

        // In a real app, this would send actual notifications
        const notificationModal = document.createElement('div');
        notificationModal.className = 'notification-modal';
        notificationModal.innerHTML = `
            <div class="notification-content">
                <h3>Send Attendance Notifications</h3>
                <div class="notification-options">
                    <label>
                        <input type="checkbox" id="general-notification" checked>
                        Send general notification to all parents
                    </label>
                    <label>
                        <input type="checkbox" id="absent-notification">
                        Send special notification to parents of absent students
                    </label>
                </div>
                <div class="notification-message">
                    <label for="custom-message">Custom Message (optional):</label>
                    <textarea id="custom-message" placeholder="Add a custom message to include with the notification..."></textarea>
                </div>
                <div class="notification-actions">
                    <button class="btn-secondary" id="cancel-notification">Cancel</button>
                    <button class="btn-primary" id="confirm-send-notification">Send Notifications</button>
                </div>
            </div>
        `;

        document.body.appendChild(notificationModal);

        // Add event listeners to modal buttons
        document.getElementById('cancel-notification').addEventListener('click', () => {
            notificationModal.remove();
        });

        document.getElementById('confirm-send-notification').addEventListener('click', () => {
            const generalNotification = document.getElementById('general-notification').checked;
            const absentNotification = document.getElementById('absent-notification').checked;
            const customMessage = document.getElementById('custom-message').value;

            // Simulate sending notifications
            let notificationCount = 0;

            if (generalNotification) {
                notificationCount += filteredStudents.length;
            }

            if (absentNotification) {
                const absentStudents = filteredStudents.filter(student => {
                    const attendance = record.attendance[student.id] || { status: 'absent' };
                    return attendance.status === 'absent';
                });
                notificationCount += absentStudents.length;
            }

            notificationModal.remove();
            showToast(`Notifications sent to ${notificationCount} parents.`, 'success');
        });
    }

    function openBulkActionsModal() {
        const selectedStudents = getSelectedStudents();

        if (selectedStudents.length === 0) {
            showToast('Please select at least one student for bulk actions.', 'error');
            return;
        }

        // Reset modal state
        bulkStatusBtns.forEach(btn => btn.classList.remove('active'));
        bulkTimeIn.value = '';
        bulkNotes.value = '';

        bulkActionsModal.style.display = 'flex';
    }

    function applyBulkActions() {
        const selectedStudents = getSelectedStudents();
        const selectedStatusBtn = document.querySelector('.bulk-status-btn.active');

        if (!selectedStatusBtn) {
            showToast('Please select a status for bulk action.', 'error');
            return;
        }

        const status = selectedStatusBtn.dataset.status;
        const timeIn = bulkTimeIn.value;
        const notes = bulkNotes.value;

        // Apply to all selected students
        selectedStudents.forEach(studentId => {
            const row = document.querySelector(`tr:has(.student-checkbox[data-id="${studentId}"])`);
            if (row) {
                const statusSelect = row.querySelector('.attendance-status-select');
                const timeInInput = row.querySelector('.time-in-input');
                const notesInput = row.querySelector('.notes-input');

                statusSelect.value = status;

                if (status === 'absent') {
                    timeInInput.value = '';
                    timeInInput.disabled = true;
                } else {
                    timeInInput.disabled = false;
                    timeInInput.value = timeIn || timeInInput.value;
                }

                if (notes) {
                    notesInput.value = notes;
                }
            }
        });

        bulkActionsModal.style.display = 'none';
        showToast(`Bulk actions applied to ${selectedStudents.length} students.`);
        updateStats();
    }

    function getSelectedStudents() {
        return Array.from(attendanceTableBody.querySelectorAll('.student-checkbox:checked'))
            .map(checkbox => parseInt(checkbox.dataset.id));
    }

    function viewAttendanceHistory() {
        const period = historyPeriod.value;
        let startDateValue, endDateValue = new Date().toISOString().split('T')[0];

        switch (period) {
            case 'week':
                startDateValue = new Date();
                startDateValue.setDate(startDateValue.getDate() - 7);
                startDateValue = startDateValue.toISOString().split('T')[0];
                break;
            case 'month':
                startDateValue = new Date();
                startDateValue.setMonth(startDateValue.getMonth() - 1);
                startDateValue = startDateValue.toISOString().split('T')[0];
                break;
            case 'year':
                startDateValue = new Date();
                startDateValue.setFullYear(startDateValue.getFullYear() - 1);
                startDateValue = startDateValue.toISOString().split('T')[0];
                break;
            case 'custom':
                startDateValue = startDate.value;
                endDateValue = endDate.value;
                if (!startDateValue || !endDateValue) {
                    showToast('Please select both start and end dates for custom range.', 'error');
                    return;
                }
                break;
        }

        // Filter records for the selected period
        const filteredRecords = attendanceRecords.filter(record => {
            return record.date >= startDateValue && record.date <= endDateValue;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));

        // Update history table
        historyTableBody.innerHTML = '';

        if (filteredRecords.length === 0) {
            historyTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center;">No attendance records found for the selected period</td>
                </tr>
            `;
        } else {
            filteredRecords.forEach(record => {
                let presentCount = 0;
                let absentCount = 0;

                Object.values(record.attendance).forEach(att => {
                    if (att.status === 'present' || att.status === 'late') {
                        presentCount++;
                    } else {
                        absentCount++;
                    }
                });

                const total = presentCount + absentCount;
                const rate = total > 0 ? Math.round((presentCount / total) * 100) : 0;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatDate(record.date)}</td>
                    <td>${presentCount}</td>
                    <td>${absentCount}</td>
                    <td>${rate}%</td>
                    <td>
                        <button class="action-btn view-day" data-date="${record.date}">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </td>
                `;
                historyTableBody.appendChild(row);
            });
        }

        // Update chart with the filtered records
        updateChart(filteredRecords);

        // Add event listeners to view buttons
        document.querySelectorAll('.view-day').forEach(btn => {
            btn.addEventListener('click', () => {
                attendanceDate.value = btn.dataset.date;
                loadAttendanceForDate(btn.dataset.date);
                document.querySelector('.attendance-table-container').scrollIntoView();
            });
        });
    }

    function viewAttendanceHistoryForStudent(studentId) {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        // Set modal title and info
        document.getElementById('detail-modal-title').textContent = `${student.firstName} ${student.lastName}'s Attendance`;
        document.getElementById('detail-student-name').textContent = `${student.firstName} ${student.lastName}`;
        document.getElementById('detail-age-group').textContent = getAgeGroupLabel(student.classGroup);
        document.getElementById('detail-class').textContent = getClassGroupLabel(student.classGroup);
        document.getElementById('detail-teacher').textContent = "Teacher Name"; // Would come from data in real app

        // Populate daily records
        const dailyRecordsBody = document.getElementById('daily-records-body');
        dailyRecordsBody.innerHTML = '';

        // Get last 10 attendance records for this student
        const studentRecords = attendanceRecords
            .filter(record => record.attendance[studentId])
            .slice(0, 10);

        if (studentRecords.length === 0) {
            dailyRecordsBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center;">No attendance records found</td>
                </tr>
            `;
        } else {
            studentRecords.forEach(record => {
                const att = record.attendance[studentId];
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${formatDate(record.date)}</td>
                    <td><span class="attendance-status ${att.status}">${att.status}</span></td>
                    <td>${att.timeIn || '-'}</td>
                    <td>${att.status === 'absent' ? '-' : '16:00'}</td>
                    <td>${att.notes || '-'}</td>
                `;
                dailyRecordsBody.appendChild(row);
            });
        }

        // Calculate monthly stats
        const currentMonth = new Date().getMonth();
        const monthlyRecords = attendanceRecords.filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getMonth() === currentMonth && record.attendance[studentId];
        });

        const presentDays = monthlyRecords.filter(record =>
            record.attendance[studentId].status === 'present' ||
            record.attendance[studentId].status === 'late'
        ).length;

        const absentDays = monthlyRecords.filter(record =>
            record.attendance[studentId].status === 'absent'
        ).length;

        const totalDays = presentDays + absentDays;
        const monthlyRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

        document.getElementById('days-present').textContent = presentDays;
        document.getElementById('days-absent').textContent = absentDays;
        document.getElementById('monthly-rate').textContent = `${monthlyRate}%`;

        // Show modal
        attendanceDetailModal.style.display = 'flex';
    }

    function notifyParentAboutStudent(studentId) {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        const currentDate = attendanceDate.value;
        const record = attendanceRecords.find(r => r.date === currentDate);
        const attendance = record?.attendance[studentId] || { status: 'absent' };

        // In a real app, this would open a modal to customize the message
        const confirmSend = confirm(`Send attendance notification to ${student.parentName} (${student.parentPhone}) about ${student.firstName}?`);

        if (confirmSend) {
            let message;
            if (attendance.status === 'absent') {
                message = `"Dear ${student.parentName.split(' ')[0]}, we noticed ${student.firstName} was absent from ${getClassGroupLabel(student.classGroup)} class today (${formatDate(currentDate)}). Please let us know if this is incorrect or if there's anything we should know."`;
            } else {
                message = `"Dear ${student.parentName.split(' ')[0]}, ${student.firstName} is present in ${getClassGroupLabel(student.classGroup)} class today (${formatDate(currentDate)})${attendance.timeIn ? ' at ' + attendance.timeIn : ''}. Thank you for bringing them!"`;
            }

            showToast(`Notification sent to ${student.parentName}:\n\n${message}`);
        }
    }

    function exportAttendanceHistory() {
        // In a real app, this would generate and download a file
        showToast('Attendance history exported successfully (simulated). In a real app, this would download a CSV or PDF file.', 'success');
    }

    function toggleCustomDateRange(e) {
        if (e.target.value === 'custom') {
            customRange.style.display = 'flex';
        } else {
            customRange.style.display = 'none';
        }
    }

    function closeModals() {
        attendanceDetailModal.style.display = 'none';
        bulkActionsModal.style.display = 'none';
    }

    // Helper functions
    function getClassGroupLabel(classGroupId) {
        switch (classGroupId) {
            case '3-5': return 'Preschool (3-5)';
            case '6-8': return 'Early Elementary (6-8)';
            case '9-12': return 'Elementary (9-12)';
            case '13-15': return 'Early Teens (13-15)';
            case '16-18': return 'Teens (16-18)';
            default: return classGroupId;
        }
    }

    function getAgeGroupLabel(classGroupId) {
        switch (classGroupId) {
            case '3-5': return '3-5 years';
            case '6-8': return '6-8 years';
            case '9-12': return '9-12 years';
            case '13-15': return '13-15 years';
            case '16-18': return '16-18 years';
            default: return classGroupId;
        }
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Chart functions
    function initializeChart() {
        const ctx = document.getElementById('attendance-chart').getContext('2d');
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Attendance Rate',
                    data: [],
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                    tension: 0.1,
                    fill: true,
                    borderWidth: 2,
                    pointBackgroundColor: '#4CAF50',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}%`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    function updateChart(records) {
        const sortedRecords = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));

        const labels = sortedRecords.map(record => formatDate(record.date));
        const data = sortedRecords.map(record => {
            let presentCount = 0;
            let totalCount = 0;

            Object.values(record.attendance).forEach(att => {
                if (att.status === 'present' || att.status === 'late') {
                    presentCount++;
                }
                totalCount++;
            });

            return totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
        });

        // Update chart data
        attendanceChart.data.labels = labels;
        attendanceChart.data.datasets[0].data = data;
        attendanceChart.update();
    }

    // Theme functions
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