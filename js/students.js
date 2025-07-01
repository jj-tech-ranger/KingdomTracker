document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle (inherited from sunday_school.js)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Load theme preference (inherited from sunday_school.js)
    loadThemePreference();

    // Initialize students data
    const students = generateSampleStudents();
    let filteredStudents = [...students];
    let currentGroup = 'all';
    let currentPage = 1;
    const studentsPerPage = 5;

    // DOM elements
    const studentsTableBody = document.getElementById('students-table-body');
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    const pageNumbersContainer = document.getElementById('page-numbers');
    const studentSearch = document.getElementById('student-search');
    const statusFilter = document.getElementById('status-filter');
    const sortBy = document.getElementById('sort-by');
    const classGroups = document.querySelectorAll('.class-group');
    const addStudentBtn = document.getElementById('add-student-btn');
    const addStudentModal = document.getElementById('add-student-modal');
    const addStudentForm = document.getElementById('add-student-form');
    const studentDetailsModal = document.getElementById('student-details-modal');
    const editStudentBtn = document.getElementById('edit-student-btn');
    const printStudentBtn = document.getElementById('print-student-btn');
    const contactParentBtn = document.getElementById('contact-parent-btn');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Event listeners
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderStudentsTable();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < Math.ceil(filteredStudents.length / studentsPerPage)) {
            currentPage++;
            renderStudentsTable();
        }
    });

    studentSearch.addEventListener('input', () => {
        currentPage = 1;
        filterStudents();
        renderStudentsTable();
    });

    statusFilter.addEventListener('change', () => {
        currentPage = 1;
        filterStudents();
        renderStudentsTable();
    });

    sortBy.addEventListener('change', () => {
        currentPage = 1;
        sortStudents();
        renderStudentsTable();
    });

    classGroups.forEach(group => {
        group.addEventListener('click', () => {
            classGroups.forEach(g => g.classList.remove('active'));
            group.classList.add('active');
            currentGroup = group.dataset.group;
            currentPage = 1;
            filterStudents();
            renderStudentsTable();
        });
    });

    addStudentBtn.addEventListener('click', () => {
        // Set enrollment date to today by default
        document.getElementById('student-enrollment-date').valueAsDate = new Date();
        addStudentModal.style.display = 'flex';
    });

    addStudentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewStudent();
    });

    applyFiltersBtn.addEventListener('click', () => {
        currentPage = 1;
        filterStudents();
        renderStudentsTable();
    });

    printStudentBtn.addEventListener('click', printStudentDetails);

    contactParentBtn.addEventListener('click', contactParent);

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            addStudentModal.style.display = 'none';
            studentDetailsModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addStudentModal) {
            addStudentModal.style.display = 'none';
        }
        if (e.target === studentDetailsModal) {
            studentDetailsModal.style.display = 'none';
        }
    });

    // Initial render
    filterStudents();
    sortStudents();
    renderStudentsTable();

    // Functions
    function generateSampleStudents() {
        const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'James', 'Isabella', 'Oliver'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
        const classGroups = ['preschool', 'elementary', 'preteens', 'teens'];
        const statuses = ['active', 'inactive', 'visitor'];
        const allergies = ['None', 'Peanuts', 'Dairy', 'Eggs', 'Gluten', 'Bee stings'];
        const medicalConditions = ['None', 'Asthma', 'ADHD', 'Diabetes', 'Epilepsy', 'Food allergies'];

        const students = [];

        for (let i = 0; i < 60; i++) {
            const birthdate = new Date();
            birthdate.setFullYear(birthdate.getFullYear() - (Math.floor(Math.random() * 15) + 3));
            birthdate.setMonth(Math.floor(Math.random() * 12));
            birthdate.setDate(Math.floor(Math.random() * 28) + 1);

            const enrollmentDate = new Date();
            enrollmentDate.setMonth(enrollmentDate.getMonth() - Math.floor(Math.random() * 24));
            enrollmentDate.setDate(Math.floor(Math.random() * 28) + 1);

            const age = calculateAge(birthdate);
            let classGroup;

            if (age <= 5) classGroup = 'preschool';
            else if (age <= 8) classGroup = 'elementary';
            else if (age <= 12) classGroup = 'preteens';
            else classGroup = 'teens';

            students.push({
                id: i + 1,
                firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
                lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
                birthdate: birthdate.toISOString().split('T')[0],
                age,
                gender: Math.random() > 0.5 ? 'male' : 'female',
                classGroup,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                enrollmentDate: enrollmentDate.toISOString().split('T')[0],
                parentName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
                parentPhone: `(${Math.floor(100 + Math.random() * 900)}) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
                parentEmail: `parent${i + 1}@example.com`,
                allergies: Math.random() > 0.7 ? allergies[Math.floor(Math.random() * allergies.length)] : 'None',
                medicalConditions: Math.random() > 0.8 ? medicalConditions[Math.floor(Math.random() * medicalConditions.length)] : 'None',
                notes: Math.random() > 0.9 ? 'Special attention needed' : ''
            });
        }

        return students;
    }

    function calculateAge(birthdate) {
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const monthDiff = today.getMonth() - birthdate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
            age--;
        }

        return age;
    }

    function filterStudents() {
        const searchTerm = studentSearch.value.toLowerCase();
        const statusFilterValue = statusFilter.value;

        filteredStudents = students.filter(student => {
            const matchesSearch = `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm) ||
                                student.parentName.toLowerCase().includes(searchTerm) ||
                                student.parentEmail.toLowerCase().includes(searchTerm);

            const matchesGroup = currentGroup === 'all' || student.classGroup === currentGroup;
            const matchesStatus = statusFilterValue === 'all' || student.status === statusFilterValue;

            return matchesSearch && matchesGroup && matchesStatus;
        });
    }

    function sortStudents() {
        const sortValue = sortBy.value;

        filteredStudents.sort((a, b) => {
            switch (sortValue) {
                case 'name-asc':
                    return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
                case 'name-desc':
                    return `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`);
                case 'age-asc':
                    return a.age - b.age;
                case 'age-desc':
                    return b.age - a.age;
                case 'date-asc':
                    return new Date(a.enrollmentDate) - new Date(b.enrollmentDate);
                case 'date-desc':
                    return new Date(b.enrollmentDate) - new Date(a.enrollmentDate);
                default:
                    return 0;
            }
        });
    }

    function renderStudentsTable() {
        const startIndex = (currentPage - 1) * studentsPerPage;
        const endIndex = startIndex + studentsPerPage;
        const paginatedStudents = filteredStudents.slice(startIndex, endIndex);

        studentsTableBody.innerHTML = '';

        if (paginatedStudents.length === 0) {
            studentsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center;">No students found matching your criteria</td>
                </tr>
            `;
        } else {
            paginatedStudents.forEach(student => {
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${student.firstName} ${student.lastName}</td>
                    <td>${student.age}</td>
                    <td>${getClassGroupLabel(student.classGroup)}</td>
                    <td><span class="status-badge ${student.status}">${student.status}</span></td>
                    <td>${formatDate(student.enrollmentDate)}</td>
                    <td>
                        <button class="action-btn view-student" data-id="${student.id}" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit-student" data-id="${student.id}" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn print-student" data-id="${student.id}" title="Print">
                            <i class="fas fa-print"></i>
                        </button>
                    </td>
                `;

                studentsTableBody.appendChild(row);
            });
        }

        // Update pagination controls
        updatePaginationControls();

        // Add event listeners to action buttons
        document.querySelectorAll('.view-student').forEach(btn => {
            btn.addEventListener('click', () => viewStudentDetails(parseInt(btn.dataset.id)));
        });

        document.querySelectorAll('.edit-student').forEach(btn => {
            btn.addEventListener('click', () => editStudent(parseInt(btn.dataset.id)));
        });

        document.querySelectorAll('.print-student').forEach(btn => {
            btn.addEventListener('click', () => printStudent(parseInt(btn.dataset.id)));
        });
    }

    function updatePaginationControls() {
        const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

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
                renderStudentsTable();
            });

            pageNumbersContainer.appendChild(pageNumber);
        }
    }

    function getClassGroupLabel(classGroup) {
        switch (classGroup) {
            case 'preschool': return 'Preschool (3-5)';
            case 'elementary': return 'Elementary (6-8)';
            case 'preteens': return 'Preteens (9-12)';
            case 'teens': return 'Teens (13-18)';
            default: return classGroup;
        }
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function viewStudentDetails(studentId) {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        document.getElementById('student-details-title').textContent = `${student.firstName} ${student.lastName}'s Profile`;
        document.getElementById('student-details-name').textContent = `${student.firstName} ${student.lastName}`;
        document.getElementById('student-details-age').textContent = student.age;
        document.getElementById('student-details-birthdate').textContent = formatDate(student.birthdate);
        document.getElementById('student-details-gender').textContent = student.gender.charAt(0).toUpperCase() + student.gender.slice(1);
        document.getElementById('student-details-class').textContent = getClassGroupLabel(student.classGroup);
        document.getElementById('student-details-enrollment').textContent = formatDate(student.enrollmentDate);
        document.getElementById('student-details-parent').textContent = student.parentName;
        document.getElementById('student-details-phone').textContent = student.parentPhone;
        document.getElementById('student-details-email').textContent = student.parentEmail;
        document.getElementById('student-details-allergies').textContent = student.allergies || 'None';
        document.getElementById('student-details-medical').textContent = student.medicalConditions || 'None';
        document.getElementById('student-details-notes').textContent = student.notes || 'None';

        const statusBadge = document.getElementById('student-details-status');
        statusBadge.textContent = student.status;
        statusBadge.className = 'student-status-badge ' + student.status;

        // Store student ID for edit/print
        studentDetailsModal.dataset.studentId = studentId;

        studentDetailsModal.style.display = 'flex';
    }

    function editStudent(studentId) {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        // In a real app, this would populate the add student form with existing data
        // and change the form to edit mode
        alert(`Edit functionality for ${student.firstName} ${student.lastName} would be implemented here.`);
    }

    function printStudent(studentId) {
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        viewStudentDetails(studentId);
        setTimeout(() => {
            printStudentDetails();
        }, 300);
    }

    function printStudentDetails() {
        const printContent = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="color: #622725; border-bottom: 2px solid #FC0100; padding-bottom: 10px;">
                    Student Profile: ${document.getElementById('student-details-name').textContent}
                </h1>
                <div style="display: flex; gap: 20px; margin-bottom: 20px;">
                    <div style="flex-shrink: 0;">
                        <img src="../img/default-student.jpg" style="width: 150px; height: 150px; border-radius: 8px; border: 3px solid #FC0100;">
                    </div>
                    <div style="flex-grow: 1;">
                        <p><strong>Name:</strong> ${document.getElementById('student-details-name').textContent}</p>
                        <p><strong>Age:</strong> ${document.getElementById('student-details-age').textContent}</p>
                        <p><strong>Birthdate:</strong> ${document.getElementById('student-details-birthdate').textContent}</p>
                        <p><strong>Gender:</strong> ${document.getElementById('student-details-gender').textContent}</p>
                        <p><strong>Class Group:</strong> ${document.getElementById('student-details-class').textContent}</p>
                        <p><strong>Status:</strong> ${document.getElementById('student-details-status').textContent}</p>
                    </div>
                </div>
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #622725; border-bottom: 1px solid #F2CC80;">Parent/Guardian Information</h3>
                    <p><strong>Name:</strong> ${document.getElementById('student-details-parent').textContent}</p>
                    <p><strong>Contact Phone:</strong> ${document.getElementById('student-details-phone').textContent}</p>
                    <p><strong>Contact Email:</strong> ${document.getElementById('student-details-email').textContent}</p>
                </div>
                <div style="margin-bottom: 20px;">
                    <h3 style="color: #622725; border-bottom: 1px solid #F2CC80;">Health Information</h3>
                    <p><strong>Allergies:</strong> ${document.getElementById('student-details-allergies').textContent}</p>
                    <p><strong>Medical Conditions:</strong> ${document.getElementById('student-details-medical').textContent}</p>
                    <p><strong>Additional Notes:</strong> ${document.getElementById('student-details-notes').textContent}</p>
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
                    <title>Student Profile - ${document.getElementById('student-details-name').textContent}</title>
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

    function contactParent() {
        const studentId = parseInt(studentDetailsModal.dataset.studentId);
        const student = students.find(s => s.id === studentId);
        if (!student) return;

        // In a real app, this would open an email client or messaging interface
        alert(`Contacting ${student.parentName} at ${student.parentPhone} or ${student.parentEmail}\n\nIn a real application, this would open your default email client or messaging interface.`);
    }

    function addNewStudent() {
        const firstName = document.getElementById('student-first-name').value;
        const lastName = document.getElementById('student-last-name').value;
        const birthdate = document.getElementById('student-birthdate').value;
        const gender = document.getElementById('student-gender').value;
        const classGroup = document.getElementById('student-class-group').value;
        const status = document.getElementById('student-status').value;
        const enrollmentDate = document.getElementById('student-enrollment-date').value;
        const parentName = document.getElementById('student-parent-name').value;
        const parentPhone = document.getElementById('student-parent-phone').value;
        const parentEmail = document.getElementById('student-parent-email').value;
        const allergies = document.getElementById('student-allergies').value;
        const medical = document.getElementById('student-medical').value;
        const notes = document.getElementById('student-notes').value;

        const age = calculateAge(new Date(birthdate));

        const newStudent = {
            id: students.length + 1,
            firstName,
            lastName,
            birthdate,
            age,
            gender,
            classGroup,
            status,
            enrollmentDate,
            parentName,
            parentPhone,
            parentEmail,
            allergies: allergies || 'None',
            medicalConditions: medical || 'None',
            notes: notes || ''
        };

        students.unshift(newStudent); // Add to beginning of array
        addStudentForm.reset();
        addStudentModal.style.display = 'none';

        // Update filters and render
        currentPage = 1;
        filterStudents();
        sortStudents();
        renderStudentsTable();

        alert(`${firstName} ${lastName} has been added to the student directory.`);
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