document.addEventListener('DOMContentLoaded', function() {
    // Sample data - in a real app, this would come from an API
    const classesData = [
        {
            id: 1,
            name: "The Little Lambs",
            ageGroup: "Ages 3-4",
            teachers: ["Jane Doe"],
            enrollment: 12,
            capacity: 15,
            location: "Room 101",
            status: "active"
        },
        {
            id: 2,
            name: "Grade 1 Discoverers",
            ageGroup: "Grade 1",
            teachers: ["John Smith"],
            enrollment: 18,
            capacity: 20,
            location: "Room 205",
            status: "active"
        },
        {
            id: 3,
            name: "Youth Bible Study",
            ageGroup: "Grades 9-12",
            teachers: ["Sarah Green", "Mike Johnson"],
            enrollment: 25,
            capacity: 25,
            location: "Youth Hall",
            status: "full"
        },
        {
            id: 4,
            name: "Preschool Praise",
            ageGroup: "Ages 2-3",
            teachers: ["Emily Wilson"],
            enrollment: 8,
            capacity: 12,
            location: "Room 102",
            status: "active"
        },
        {
            id: 5,
            name: "Elementary Explorers",
            ageGroup: "Grades 2-3",
            teachers: ["David Brown"],
            enrollment: 15,
            capacity: 18,
            location: "Room 201",
            status: "active"
        },
        {
            id: 6,
            name: "Teen Discipleship",
            ageGroup: "Grades 7-8",
            teachers: ["Robert Taylor"],
            enrollment: 10,
            capacity: 15,
            location: "Room 301",
            status: "active"
        },
        {
            id: 7,
            name: "Kindergarten Joy",
            ageGroup: "Kindergarten",
            teachers: ["Lisa White"],
            enrollment: 14,
            capacity: 16,
            location: "Room 103",
            status: "active"
        },
        {
            id: 8,
            name: "Last Year's Grade 4",
            ageGroup: "Grade 4",
            teachers: ["James Wilson"],
            enrollment: 0,
            capacity: 0,
            location: "Room 202",
            status: "archived"
        }
    ];

    // DOM elements
    const classesList = document.getElementById('classes-list');
    const addClassBtn = document.getElementById('add-class');
    const exportBtn = document.getElementById('export-classes');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const ageFilter = document.getElementById('age-filter');
    const locationFilter = document.getElementById('location-filter');
    const teacherFilter = document.getElementById('teacher-filter');
    const statusFilter = document.getElementById('status-filter');
    const sortableHeaders = document.querySelectorAll('.sortable');

    // Current sorting state
    let currentSort = {
        field: 'name',
        direction: 'asc'
    };

    // Initialize the page
    function init() {
        renderClasses(classesData);
        setupEventListeners();
    }

    // Render classes to the table
    function renderClasses(classes) {
        classesList.innerHTML = '';

        classes.forEach(cls => {
            const enrollmentPercent = Math.round((cls.enrollment / cls.capacity) * 100) || 0;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="class_details.html?id=${cls.id}" class="class-link">${cls.name}</a></td>
                <td>${cls.ageGroup}</td>
                <td>${cls.teachers.join(', ')}</td>
                <td>
                    <div class="enrollment-progress">
                        <span>${cls.enrollment}</span>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${enrollmentPercent}%"></div>
                        </div>
                    </div>
                </td>
                <td>${cls.capacity}</td>
                <td>${cls.location}</td>
                <td><span class="status-badge ${cls.status}">${cls.status}</span></td>
                <td>
                    <button class="action-btn view-btn" data-id="${cls.id}" title="View Class">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" data-id="${cls.id}" title="Edit Class">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn roster-btn" data-id="${cls.id}" title="View Roster">
                        <i class="fas fa-users"></i>
                    </button>
                </td>
            `;
            classesList.appendChild(row);
        });
    }

    // Filter classes based on selected filters
    function filterClasses() {
        const ageValue = ageFilter.value;
        const locationValue = locationFilter.value;
        const teacherValue = teacherFilter.value;
        const statusValue = statusFilter.value;

        const filtered = classesData.filter(cls => {
            return (
                (ageValue === 'all' ||
                 (ageValue === 'preschool' && cls.ageGroup.includes('Ages')) ||
                 (ageValue === 'elementary' && cls.ageGroup.includes('Grade')) &&
                (locationValue === 'all' || cls.location.includes(locationValue)) &&
                (teacherValue === 'all' || cls.teachers.some(t => t.toLowerCase().includes(teacherValue))) &&
                (statusValue === 'all' || cls.status === statusValue)
            ));
        });

        renderClasses(filtered);
    }

    // Sort classes
    function sortClasses(field) {
        // If clicking the same field, toggle direction
        if (field === currentSort.field) {
            currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            // New field, default to ascending
            currentSort.field = field;
            currentSort.direction = 'asc';
        }

        // Update sort indicators
        sortableHeaders.forEach(header => {
            const icon = header.querySelector('i');
            if (header.dataset.sort === field) {
                icon.className = currentSort.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
            } else {
                icon.className = 'fas fa-sort';
            }
        });

        // Sort the data
        const sorted = [...classesData].sort((a, b) => {
            let valueA, valueB;

            // Special handling for different fields
            if (field === 'enrollment') {
                valueA = a.enrollment;
                valueB = b.enrollment;
            } else if (field === 'name') {
                valueA = a.name.toLowerCase();
                valueB = b.name.toLowerCase();
            } else if (field === 'age') {
                // Extract numbers for age sorting
                const numA = a.ageGroup.match(/\d+/)?.[0] || 0;
                const numB = b.ageGroup.match(/\d+/)?.[0] || 0;
                valueA = parseInt(numA);
                valueB = parseInt(numB);
            } else if (field === 'location') {
                valueA = a.location.toLowerCase();
                valueB = b.location.toLowerCase();
            }

            if (valueA < valueB) {
                return currentSort.direction === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return currentSort.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        renderClasses(sorted);
    }

    // Setup event listeners
    function setupEventListeners() {
        // Add new class
        addClassBtn.addEventListener('click', () => {
            alert('Add new class form would open here');
        });

        // Export classes
        exportBtn.addEventListener('click', () => {
            alert('Export functionality would run here');
        });

        // Filter controls
        ageFilter.addEventListener('change', filterClasses);
        locationFilter.addEventListener('change', filterClasses);
        teacherFilter.addEventListener('change', filterClasses);
        statusFilter.addEventListener('change', filterClasses);
        resetFiltersBtn.addEventListener('click', () => {
            ageFilter.value = 'all';
            locationFilter.value = 'all';
            teacherFilter.value = 'all';
            statusFilter.value = 'all';
            filterClasses();
        });

        // Sortable headers
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                sortClasses(header.dataset.sort);
            });
        });

        // Action buttons (delegated)
        classesList.addEventListener('click', (e) => {
            const viewBtn = e.target.closest('.view-btn');
            const editBtn = e.target.closest('.edit-btn');
            const rosterBtn = e.target.closest('.roster-btn');

            if (viewBtn) {
                const id = viewBtn.dataset.id;
                window.location.href = `class_details.html?id=${id}`;
            }

            if (editBtn) {
                const id = editBtn.dataset.id;
                alert(`Edit class with ID: ${id}`);
            }

            if (rosterBtn) {
                const id = rosterBtn.dataset.id;
                alert(`View roster for class with ID: ${id}`);
            }
        });
    }

    // Initialize the page
    init();
});