document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle (inherited from sunday_school.js)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Load theme preference (inherited from sunday_school.js)
    loadThemePreference();

    // Initialize teachers data and pagination
    const teachers = generateSampleTeachers();
    let currentPage = 1;
    const teachersPerPage = 5;
    let filteredTeachers = [...teachers];

    // DOM elements
    const teachersTableBody = document.getElementById('teachers-table-body');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumbersContainer = document.getElementById('page-numbers');
    const teacherSearch = document.getElementById('teacher-search');
    const ageGroupFilter = document.getElementById('age-group-filter');
    const statusFilter = document.getElementById('status-filter');
    const sortBy = document.getElementById('sort-by');
    const addTeacherBtn = document.getElementById('add-teacher-btn');
    const addTeacherModal = document.getElementById('add-teacher-modal');
    const addTeacherForm = document.getElementById('add-teacher-form');
    const teacherDetailsModal = document.getElementById('teacher-details-modal');
    const printTeacherBtn = document.getElementById('print-teacher-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Event listeners
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTeachersTable();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < Math.ceil(filteredTeachers.length / teachersPerPage)) {
            currentPage++;
            renderTeachersTable();
        }
    });

    teacherSearch.addEventListener('input', () => {
        currentPage = 1;
        filterTeachers();
        renderTeachersTable();
    });

    ageGroupFilter.addEventListener('change', () => {
        currentPage = 1;
        filterTeachers();
        renderTeachersTable();
    });

    statusFilter.addEventListener('change', () => {
        currentPage = 1;
        filterTeachers();
        renderTeachersTable();
    });

    sortBy.addEventListener('change', () => {
        currentPage = 1;
        sortTeachers();
        renderTeachersTable();
    });

    addTeacherBtn.addEventListener('click', () => {
        addTeacherModal.style.display = 'flex';
    });

    addTeacherForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewTeacher();
    });

    printTeacherBtn.addEventListener('click', printTeacherDetails);

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            addTeacherModal.style.display = 'none';
            teacherDetailsModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addTeacherModal) {
            addTeacherModal.style.display = 'none';
        }
        if (e.target === teacherDetailsModal) {
            teacherDetailsModal.style.display = 'none';
        }
    });

    // Initial render
    sortTeachers();
    renderTeachersTable();

    // Functions
    function generateSampleTeachers() {
        const ageGroups = [
            { range: '3-5', label: 'Preschool (3-5)' },
            { range: '6-8', label: 'Early Elementary (6-8)' },
            { range: '9-12', label: 'Elementary (9-12)' },
            { range: '13-15', label: 'Early Teens (13-15)' },
            { range: '16-18', label: 'Teens (16-18)' }
        ];

        const statuses = ['active', 'inactive', 'substitute'];
        const firstNames = ['Sarah', 'Michael', 'David', 'Emily', 'James', 'Jennifer', 'Robert', 'Jessica', 'John', 'Lisa', 'Daniel', 'Amanda', 'Christopher', 'Nicole', 'Matthew'];
        const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez'];
        const classNames = ['Angels', 'Bible Heroes', 'Faith Builders', 'Grace Group', 'Joyful Journey', 'Kingdom Kids', 'Little Lambs', 'Mighty Warriors', 'Promise Keepers', 'Rainbow Room'];

        const teachers = [];

        for (let i = 0; i < 15; i++) {
            const ageGroup = ageGroups[Math.floor(Math.random() * ageGroups.length)];
            const classes = [];
            const numClasses = Math.floor(Math.random() * 3) + 1;

            for (let j = 0; j < numClasses; j++) {
                classes.push(classNames[Math.floor(Math.random() * classNames.length)]);
            }

            teachers.push({
                id: i + 1,
                name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
                email: `teacher${i + 1}@church.org`,
                phone: `(${Math.floor(100 + Math.random() * 900)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
                ageGroup: ageGroup.range,
                ageGroupLabel: ageGroup.label,
                classes: [...new Set(classes)], // Remove duplicates
                experience: Math.floor(Math.random() * 15),
                status: statuses[Math.floor(Math.random() * statuses.length)],
                bio: `Passionate about teaching ${ageGroup.label} children. Specializes in interactive Bible lessons and creative activities.`
            });
        }

        return teachers;
    }

    function filterTeachers() {
        const searchTerm = teacherSearch.value.toLowerCase();
        const ageGroupFilterValue = ageGroupFilter.value;
        const statusFilterValue = statusFilter.value;

        filteredTeachers = teachers.filter(teacher => {
            const matchesSearch = teacher.name.toLowerCase().includes(searchTerm) ||
                                 teacher.email.toLowerCase().includes(searchTerm) ||
                                 teacher.classes.some(cls => cls.toLowerCase().includes(searchTerm));

            const matchesAgeGroup = ageGroupFilterValue === 'all' || teacher.ageGroup === ageGroupFilterValue;
            const matchesStatus = statusFilterValue === 'all' || teacher.status === statusFilterValue;

            return matchesSearch && matchesAgeGroup && matchesStatus;
        });
    }

    function sortTeachers() {
        const sortValue = sortBy.value;

        filteredTeachers.sort((a, b) => {
            switch (sortValue) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'experience-asc':
                    return a.experience - b.experience;
                case 'experience-desc':
                    return b.experience - a.experience;
                default:
                    return 0;
            }
        });
    }

    function renderTeachersTable() {
        const startIndex = (currentPage - 1) * teachersPerPage;
        const endIndex = startIndex + teachersPerPage;
        const paginatedTeachers = filteredTeachers.slice(startIndex, endIndex);

        teachersTableBody.innerHTML = '';

        if (paginatedTeachers.length === 0) {
            teachersTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center;">No teachers found matching your criteria</td>
                </tr>
            `;
        } else {
            paginatedTeachers.forEach(teacher => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${teacher.name}</td>
                    <td>${teacher.ageGroupLabel}</td>
                    <td>${teacher.classes.join(', ')}</td>
                    <td>${teacher.experience} ${teacher.experience === 1 ? 'year' : 'years'}</td>
                    <td><span class="status-badge ${teacher.status}">${teacher.status}</span></td>
                    <td>
                        <button class="action-btn view-teacher" data-id="${teacher.id}" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-teacher" data-id="${teacher.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn print-teacher" data-id="${teacher.id}" title="Print">
                            <i class="fas fa-print"></i>
                        </button>
                    </td>
                `;

                teachersTableBody.appendChild(row);
            });
        }

        // Update pagination controls
        updatePaginationControls();

        // Add event listeners to action buttons
        document.querySelectorAll('.view-teacher').forEach(btn => {
            btn.addEventListener('click', () => viewTeacherDetails(parseInt(btn.dataset.id)));
        });

        document.querySelectorAll('.edit-teacher').forEach(btn => {
            btn.addEventListener('click', () => editTeacher(parseInt(btn.dataset.id)));
        });

        document.querySelectorAll('.print-teacher').forEach(btn => {
            btn.addEventListener('click', () => printTeacher(parseInt(btn.dataset.id)));
        });
    }

    function updatePaginationControls() {
        const totalPages = Math.ceil(filteredTeachers.length / teachersPerPage);

        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;

        // Clear existing page numbers
        pageNumbersContainer.innerHTML = '';

        // Add page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('span');
            pageNumber.textContent = i;
            pageNumber.className = 'page-number';
            if (i === currentPage) {
                pageNumber.classList.add('active');
            }

            pageNumber.addEventListener('click', () => {
                currentPage = i;
                renderTeachersTable();
            });

            pageNumbersContainer.appendChild(pageNumber);
        }
    }

    function viewTeacherDetails(teacherId) {
        const teacher = teachers.find(t => t.id === teacherId);
        if (!teacher) return;

        document.getElementById('teacher-details-title').textContent = `${teacher.name}'s Profile`;
        document.getElementById('teacher-details-name').textContent = teacher.name;
        document.getElementById('teacher-details-email').textContent = teacher.email;
        document.getElementById('teacher-details-phone').textContent = teacher.phone;
        document.getElementById('teacher-details-age-group').textContent = teacher.ageGroupLabel;
        document.getElementById('teacher-details-experience').textContent = `${teacher.experience} ${teacher.experience === 1 ? 'year' : 'years'}`;
        document.getElementById('teacher-details-classes').textContent = teacher.classes.join(', ');
        document.getElementById('teacher-details-bio').textContent = teacher.bio;

        const statusBadge = document.getElementById('teacher-details-status');
        statusBadge.textContent = teacher.status;
        statusBadge.className = 'teacher-status-badge ' + teacher.status;

        teacherDetailsModal.style.display = 'flex';
    }

    function editTeacher(teacherId) {
        const teacher = teachers.find(t => t.id === teacherId);
        if (!teacher) return;

        // In a real app, this would populate the add teacher form with existing data
        // and change the form to edit mode
        alert(`Edit functionality for ${teacher.name} would be implemented here.`);
    }

    function printTeacher(teacherId) {
        const teacher = teachers.find(t => t.id === teacherId);
        if (!teacher) return;

        viewTeacherDetails(teacherId);
        setTimeout(() => {
            printTeacherDetails();
        }, 300);
    }

    function printTeacherDetails() {
        const printContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #622725; border-bottom: 2px solid #FC0100; padding-bottom: 10px;">
                    ${document.getElementById('teacher-details-title').textContent}
                </h1>
                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                    <div style="flex-shrink: 0;">
                        <img src="../img/default-teacher.jpg" style="width: 150px; height: 150px; border-radius: 8px; border: 3px solid #FC0100;">
                    </div>
                    <div style="flex-grow: 1;">
                        <p><strong>Name:</strong> ${document.getElementById('teacher-details-name').textContent}</p>
                        <p><strong>Email:</strong> ${document.getElementById('teacher-details-email').textContent}</p>
                        <p><strong>Phone:</strong> ${document.getElementById('teacher-details-phone').textContent}</p>
                        <p><strong>Age Group:</strong> ${document.getElementById('teacher-details-age-group').textContent}</p>
                        <p><strong>Experience:</strong> ${document.getElementById('teacher-details-experience').textContent}</p>
                        <p><strong>Classes:</strong> ${document.getElementById('teacher-details-classes').textContent}</p>
                    </div>
                </div>
                <div>
                    <h3 style="color: #622725; border-bottom: 1px solid #F2CC80;">Bio/Notes</h3>
                    <p>${document.getElementById('teacher-details-bio').textContent}</p>
                </div>
                <div style="margin-top: 30px; font-size: 12px; text-align: center; color: #666;">
                    Printed from Kingdom Tracker on ${new Date().toLocaleDateString()}
                </div>
            </div>
        `;

        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Teacher Profile - ${document.getElementById('teacher-details-name').textContent}</title>
                    <style>
                        @media print {
                            body { -webkit-print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body>
                    ${printContent}
                    <script>
                        window.onload = function() {
                            setTimeout(function() {
                                window.print();
                                window.close();
                            }, 200);
                        };
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    }

    function addNewTeacher() {
        const name = document.getElementById('teacher-name').value;
        const email = document.getElementById('teacher-email').value;
        const phone = document.getElementById('teacher-phone').value;
        const ageGroup = document.getElementById('teacher-age-group').value;
        const ageGroupLabel = document.getElementById('teacher-age-group').options[document.getElementById('teacher-age-group').selectedIndex].text;
        const experience = parseInt(document.getElementById('teacher-experience').value) || 0;
        const status = document.getElementById('teacher-status').value;
        const bio = document.getElementById('teacher-bio').value;

        // In a real app, this would be an API call to save the teacher
        const newTeacher = {
            id: teachers.length + 1,
            name,
            email,
            phone,
            ageGroup,
            ageGroupLabel,
            classes: ['New Class'], // Default class, would be selectable in a real app
            experience,
            status,
            bio: bio || 'No bio provided.'
        };

        teachers.unshift(newTeacher); // Add to beginning of array
        addTeacherForm.reset();
        addTeacherModal.style.display = 'none';

        // Update filters and render
        currentPage = 1;
        filterTeachers();
        sortTeachers();
        renderTeachersTable();

        alert(`${name} has been added to the teachers directory.`);
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