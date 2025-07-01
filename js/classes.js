document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle (inherited from sunday_school.js)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Load theme preference (inherited from sunday_school.js)
    loadThemePreference();

    // Initialize classes data
    const classes = generateSampleClasses();
    let filteredClasses = [...classes];
    let currentPage = 1;
    const classesPerPage = 5;

    // DOM elements
    const classesTableBody = document.getElementById('classes-table-body');
    const classSearch = document.getElementById('class-search');
    const ageGroupFilter = document.getElementById('age-group-filter');
    const dayFilter = document.getElementById('day-filter');
    const statusFilter = document.getElementById('status-filter');
    const addClassBtn = document.getElementById('add-class-btn');
    const addClassModal = document.getElementById('add-class-modal');
    const addClassForm = document.getElementById('add-class-form');
    const classDetailsModal = document.getElementById('class-details-modal');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Event listeners
    classSearch.addEventListener('input', () => {
        filterClasses();
        renderClassesTable();
    });

    ageGroupFilter.addEventListener('change', () => {
        filterClasses();
        renderClassesTable();
    });

    dayFilter.addEventListener('change', () => {
        filterClasses();
        renderClassesTable();
    });

    statusFilter.addEventListener('change', () => {
        filterClasses();
        renderClassesTable();
    });

    // Only open modal when add class button is clicked
    addClassBtn.addEventListener('click', function(e) {
        e.preventDefault();
        addClassModal.style.display = 'flex';
    });

    addClassForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewClass();
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderClassesTable();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredClasses.length / classesPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderClassesTable();
        }
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            addClassModal.style.display = 'none';
            classDetailsModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addClassModal) {
            addClassModal.style.display = 'none';
        }
        if (e.target === classDetailsModal) {
            classDetailsModal.style.display = 'none';
        }
    });

    // Tab functionality for class details
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    // Initial render
    filterClasses();
    renderClassesTable();
    updateStats();

    // Functions
    function generateSampleClasses() {
        const classNames = [
            'Little Lambs', 'God\'s Explorers', 'Bible Buddies',
            'Faith Friends', 'Kingdom Kids', 'Young Disciples',
            'Teen Truth Seekers', 'Youth Group', 'High School Bible Study',
            'Preschool Praise', 'Elementary Explorers', 'Junior Bible Quiz',
            'Tween Ministry', 'Kindergarten Bible Time', 'Nursery'
        ];

        const teachers = [
            'Sarah Johnson', 'Michael Brown', 'Emily Davis',
            'David Wilson', 'Jessica Martinez', 'Robert Taylor',
            'Jennifer Anderson', 'Thomas Thomas', 'Lisa Garcia',
            'Daniel Rodriguez'
        ];

        const locations = [
            'Room 101', 'Room 102', 'Room 103', 'Room 104',
            'Room 201', 'Room 202', 'Fellowship Hall', 'Youth Room',
            'Nursery Room', 'Chapel'
        ];

        const classList = [];

        for (let i = 0; i < 15; i++) {
            const ageGroup = getRandomAgeGroup();
            const teacherCount = Math.floor(Math.random() * 2) + 1;
            const classTeachers = [];

            for (let j = 0; j < teacherCount; j++) {
                let teacher;
                do {
                    teacher = teachers[Math.floor(Math.random() * teachers.length)];
                } while (classTeachers.includes(teacher));
                classTeachers.push(teacher);
            }

            const studentCount = Math.floor(Math.random() * 15) + 1;
            const maxStudents = Math.max(studentCount, 15);
            const status = getStatus(studentCount, maxStudents);

            classList.push({
                id: i + 1,
                name: classNames[i],
                ageGroup: ageGroup.range,
                ageGroupLabel: ageGroup.label,
                teachers: classTeachers,
                students: studentCount,
                maxStudents: maxStudents,
                day: ['Sunday', 'Wednesday', 'Friday'][Math.floor(Math.random() * 3)],
                time: getRandomTime(),
                location: locations[Math.floor(Math.random() * locations.length)],
                description: `This class focuses on ${getRandomTopics()} for ${ageGroup.label} children.`,
                status: status,
                curriculum: Math.random() > 0.3 ? getRandomCurriculum() : null,
                attendance: generateAttendanceData()
            });
        }

        return classList;
    }

    function getRandomAgeGroup() {
        const ageGroups = [
            { range: '3-5', label: 'Preschool (3-5)' },
            { range: '6-8', label: 'Early Elementary (6-8)' },
            { range: '9-12', label: 'Elementary (9-12)' },
            { range: '13-15', label: 'Early Teens (13-15)' },
            { range: '16-18', label: 'Teens (16-18)' }
        ];
        return ageGroups[Math.floor(Math.random() * ageGroups.length)];
    }

    function getRandomTime() {
        const hour = Math.floor(Math.random() * 4) + 9; // 9am to 12pm
        const minute = Math.random() > 0.5 ? '00' : '30';
        return `${hour}:${minute} AM`;
    }

    function getRandomTopics() {
        const topics = [
            'basic Bible stories', 'Christian values', 'prayer and worship',
            'Bible characters', 'the life of Jesus', 'the fruits of the Spirit',
            'missions and evangelism', 'Christian living', 'Bible memorization',
            'Old Testament stories', 'New Testament teachings', 'the Ten Commandments'
        ];
        return topics[Math.floor(Math.random() * topics.length)];
    }

    function getRandomCurriculum() {
        const curricula = [
            'Gospel Light', 'Group Publishing', 'David C. Cook',
            'Answers in Genesis', 'Orange Curriculum', 'Awana',
            'DiscipleLand', 'LifeWay Kids', 'Standard Publishing'
        ];
        return curricula[Math.floor(Math.random() * curricula.length)];
    }

    function getStatus(studentCount, maxStudents) {
        if (studentCount >= maxStudents) return 'Full';
        if (studentCount >= maxStudents * 0.8) return 'Active';
        if (studentCount < 5) return 'Upcoming';
        return 'Active';
    }

    function generateAttendanceData() {
        const data = [];
        for (let i = 0; i < 4; i++) {
            data.push(Math.floor(Math.random() * 20) + 10); // 10-30 students
        }
        return data;
    }

    function filterClasses() {
        const searchTerm = classSearch.value.toLowerCase();
        const ageGroupFilterValue = ageGroupFilter.value;
        const dayFilterValue = dayFilter.value;
        const statusFilterValue = statusFilter.value;

        filteredClasses = classes.filter(cls => {
            const matchesSearch = cls.name.toLowerCase().includes(searchTerm) ||
                                 cls.teachers.some(t => t.toLowerCase().includes(searchTerm)) ||
                                 cls.description.toLowerCase().includes(searchTerm);

            const matchesAgeGroup = ageGroupFilterValue === 'all' || cls.ageGroup === ageGroupFilterValue;
            const matchesDay = dayFilterValue === 'all' || cls.day === dayFilterValue;
            const matchesStatus = statusFilterValue === 'all' || cls.status === statusFilterValue;

            return matchesSearch && matchesAgeGroup && matchesDay && matchesStatus;
        });

        currentPage = 1; // Reset to first page when filtering
    }

    function renderClassesTable() {
        const startIndex = (currentPage - 1) * classesPerPage;
        const endIndex = startIndex + classesPerPage;
        const paginatedClasses = filteredClasses.slice(startIndex, endIndex);

        classesTableBody.innerHTML = '';

        if (filteredClasses.length === 0) {
            classesTableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="no-results">
                        <i class="fas fa-search"></i>
                        <p>No classes found matching your criteria</p>
                    </td>
                </tr>
            `;
        } else {
            paginatedClasses.forEach(cls => {
                const row = document.createElement('tr');
                row.className = 'class-row';
                row.dataset.id = cls.id;

                row.innerHTML = `
                    <td>${cls.name}</td>
                    <td>${cls.ageGroupLabel}</td>
                    <td>${cls.teachers.join(', ')}</td>
                    <td>${cls.students}/${cls.maxStudents}</td>
                    <td>${cls.day} ${cls.time}</td>
                    <td>${cls.location}</td>
                    <td><span class="status status-${cls.status.toLowerCase()}">${cls.status}</span></td>
                    <td>
                        <button class="action-btn view-class" data-id="${cls.id}">
                            <i class="fas fa-eye"></i> View
                        </button>
                        <button class="action-btn edit-class" data-id="${cls.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </td>
                `;

                classesTableBody.appendChild(row);
            });
        }

        // Update pagination controls
        updatePagination();

        // Add event listeners to view buttons
        document.querySelectorAll('.view-class').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                viewClassDetails(parseInt(btn.dataset.id));
            });
        });

        // Add event listeners to edit buttons
        document.querySelectorAll('.edit-class').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                editClass(parseInt(btn.dataset.id));
            });
        });
    }

    function updatePagination() {
        const totalPages = Math.ceil(filteredClasses.length / classesPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    function updateStats() {
        document.getElementById('total-classes').textContent = classes.length;

        const uniqueTeachers = new Set();
        classes.forEach(cls => {
            cls.teachers.forEach(t => uniqueTeachers.add(t));
        });
        document.getElementById('active-teachers').textContent = uniqueTeachers.size;

        const totalStudents = classes.reduce((sum, cls) => sum + cls.students, 0);
        document.getElementById('total-students').textContent = totalStudents;

        const avgAttendance = Math.round((totalStudents / (classes.length * 15)) * 100);
        document.getElementById('avg-attendance').textContent = `${Math.min(avgAttendance, 100)}%`;
    }

    function viewClassDetails(classId) {
        const cls = classes.find(c => c.id === classId);
        if (!cls) return;

        document.getElementById('class-details-title').textContent = cls.name;
        document.getElementById('detail-age-group').textContent = cls.ageGroupLabel;
        document.getElementById('detail-teachers').textContent = cls.teachers.join(', ');
        document.getElementById('detail-schedule').textContent = `${cls.day} ${cls.time}`;
        document.getElementById('detail-location').textContent = cls.location;
        document.getElementById('detail-status').textContent = cls.status;
        document.getElementById('detail-students').textContent = `${cls.students}/${cls.maxStudents} students`;
        document.getElementById('detail-description').textContent = cls.description;

        // Render roster tab
        renderRosterTab(cls);

        // Render attendance tab
        renderAttendanceTab(cls);

        // Render curriculum tab
        renderCurriculumTab(cls);

        classDetailsModal.style.display = 'flex';
    }

    function renderRosterTab(cls) {
        const rosterTableBody = document.getElementById('roster-table-body');
        rosterTableBody.innerHTML = '';

        // Generate sample roster data
        const studentNames = [
            'Emma Smith', 'Noah Johnson', 'Olivia Williams', 'Liam Brown', 'Ava Jones',
            'William Garcia', 'Isabella Miller', 'James Davis', 'Sophia Rodriguez', 'Benjamin Wilson'
        ];

        const parents = [
            'John & Mary Smith', 'Michael Johnson', 'David & Sarah Williams', 'Robert Brown', 'Daniel & Lisa Jones',
            'Paul Garcia', 'Mark & Anna Miller', 'Andrew Davis', 'Thomas Rodriguez', 'Kevin Wilson'
        ];

        const studentCount = Math.min(cls.students, 10); // Show up to 10 students

        for (let i = 0; i < studentCount; i++) {
            const row = document.createElement('tr');
            const age = Math.floor(Math.random() * (parseInt(cls.ageGroup.split('-')[1]) - parseInt(cls.ageGroup.split('-')[0]) + 1) + parseInt(cls.ageGroup.split('-')[0]));

            row.innerHTML = `
                <td>${studentNames[i]}</td>
                <td>${age}</td>
                <td>${parents[i]}</td>
                <td>${generatePhoneNumber()}</td>
            `;

            rosterTableBody.appendChild(row);
        }
    }

    function generatePhoneNumber() {
        return `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    }

    function renderAttendanceTab(cls) {
        const attendanceStatsList = document.getElementById('attendance-stats-list');
        attendanceStatsList.innerHTML = '';

        const weeks = ['Last Week', '2 Weeks Ago', '3 Weeks Ago', '4 Weeks Ago'];

        cls.attendance.forEach((count, index) => {
            const percentage = Math.round((count / cls.maxStudents) * 100);
            const li = document.createElement('li');

            li.innerHTML = `
                <span>${weeks[index]}:</span>
                <span>${count} students (${percentage}%)</span>
            `;

            attendanceStatsList.appendChild(li);
        });
    }

    function renderCurriculumTab(cls) {
        const currentCurriculum = document.getElementById('current-curriculum');
        const upcomingLessonsList = document.getElementById('upcoming-lessons-list');

        currentCurriculum.textContent = cls.curriculum || 'None assigned';
        upcomingLessonsList.innerHTML = '';

        if (cls.curriculum) {
            const lessons = [
                'Creation Story', 'Noah\'s Ark', 'Abraham and Sarah',
                'Joseph and His Brothers', 'Moses and the Exodus'
            ];

            const days = ['Sunday', 'Wednesday', 'Friday'];
            const today = new Date();

            lessons.forEach((lesson, index) => {
                const date = new Date(today);
                date.setDate(today.getDate() + (index * 7));

                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="lesson-date">${days[index % 3]} ${date.toLocaleDateString()}</div>
                    <div class="lesson-topic">${lesson}</div>
                `;

                upcomingLessonsList.appendChild(li);
            });
        }
    }

    function editClass(classId) {
        const cls = classes.find(c => c.id === classId);
        if (!cls) return;

        alert(`Editing class: ${cls.name}\n\nIn a real application, this would open an edit form.`);
    }

    function addNewClass() {
        const name = document.getElementById('class-name').value;
        const ageGroup = document.getElementById('class-age-group').value;
        const ageGroupLabel = document.getElementById('class-age-group').options[document.getElementById('class-age-group').selectedIndex].text;
        const day = document.getElementById('class-day').value;
        const time = document.getElementById('class-time').value;
        const location = document.getElementById('class-location').value;
        const description = document.getElementById('class-description').value;
        const maxStudents = parseInt(document.getElementById('class-max-students').value);

        const newClass = {
            id: classes.length + 1,
            name,
            ageGroup,
            ageGroupLabel,
            teachers: ['New Teacher'],
            students: 0,
            maxStudents,
            day,
            time: `${time} ${parseInt(time.split(':')[0]) >= 12 ? 'PM' : 'AM'}`,
            location,
            description,
            status: 'Upcoming',
            curriculum: null,
            attendance: [0, 0, 0, 0]
        };

        classes.unshift(newClass);
        addClassForm.reset();
        addClassModal.style.display = 'none';

        filterClasses();
        renderClassesTable();
        updateStats();

        alert(`${name} class has been created.`);
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