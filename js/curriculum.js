document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle (inherited from sunday_school.js)
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Load theme preference (inherited from sunday_school.js)
    loadThemePreference();

    // Initialize curriculum data
    const curriculumItems = generateSampleCurriculum();
    let filteredCurriculum = [...curriculumItems];

    // DOM elements
    const curriculumGrid = document.getElementById('curriculum-grid');
    const teacherSearch = document.getElementById('curriculum-search');
    const ageGroupFilter = document.getElementById('age-group-filter');
    const quarterFilter = document.getElementById('quarter-filter');
    const categoryFilter = document.getElementById('category-filter');
    const addCurriculumBtn = document.getElementById('add-curriculum-btn');
    const addCurriculumModal = document.getElementById('add-curriculum-modal');
    const addCurriculumForm = document.getElementById('add-curriculum-form');
    const curriculumDetailsModal = document.getElementById('curriculum-details-modal');
    const downloadAllBtn = document.getElementById('download-all-btn');
    const feedbackForm = document.getElementById('feedback-form');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Event listeners
    teacherSearch.addEventListener('input', () => {
        filterCurriculum();
        renderCurriculumGrid();
    });

    ageGroupFilter.addEventListener('change', () => {
        filterCurriculum();
        renderCurriculumGrid();
    });

    quarterFilter.addEventListener('change', () => {
        filterCurriculum();
        renderCurriculumGrid();
    });

    categoryFilter.addEventListener('change', () => {
        filterCurriculum();
        renderCurriculumGrid();
    });

    addCurriculumBtn.addEventListener('click', () => {
        addCurriculumModal.style.display = 'flex';
    });

    addCurriculumForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addNewCurriculum();
    });

    downloadAllBtn.addEventListener('click', downloadAllFiles);

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        submitFeedback();
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            addCurriculumModal.style.display = 'none';
            curriculumDetailsModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === addCurriculumModal) {
            addCurriculumModal.style.display = 'none';
        }
        if (e.target === curriculumDetailsModal) {
            curriculumDetailsModal.style.display = 'none';
        }
    });

    // Initial render
    renderCurriculumGrid();

    // Functions
    function generateSampleCurriculum() {
        const ageGroups = [
            { range: '3-5', label: 'Preschool (3-5)' },
            { range: '6-8', label: 'Early Elementary (6-8)' },
            { range: '9-12', label: 'Elementary (9-12)' },
            { range: '13-15', label: 'Early Teens (13-15)' },
            { range: '16-18', label: 'Teens (16-18)' }
        ];

        const quarters = [
            { value: '1', label: 'Quarter 1 (Jan-Mar)' },
            { value: '2', label: 'Quarter 2 (Apr-Jun)' },
            { value: '3', label: 'Quarter 3 (Jul-Sep)' },
            { value: '4', label: 'Quarter 4 (Oct-Dec)' }
        ];

        const categories = [
            { value: 'lesson', label: 'Lesson Plan' },
            { value: 'activity', label: 'Activity' },
            { value: 'resource', label: 'Teaching Resource' },
            { value: 'assessment', label: 'Assessment' }
        ];

        const curriculumTitles = [
            'God Creates the World',
            'Noah and the Ark',
            'Abraham and Sarah',
            'Joseph and His Brothers',
            'Moses and the Exodus',
            'David and Goliath',
            'Daniel in the Lion\'s Den',
            'Jonah and the Big Fish',
            'Jesus is Born',
            'Jesus Feeds the 5000',
            'The Good Samaritan',
            'The Prodigal Son',
            'Jesus Dies and Rises Again',
            'The Holy Spirit Comes',
            'Paul\'s Missionary Journeys'
        ];

        const curriculumItems = [];

        for (let i = 0; i < 15; i++) {
            const ageGroup = ageGroups[Math.floor(Math.random() * ageGroups.length)];
            const quarter = quarters[Math.floor(Math.random() * quarters.length)];
            const category = categories[Math.floor(Math.random() * categories.length)];

            curriculumItems.push({
                id: i + 1,
                title: curriculumTitles[i],
                ageGroup: ageGroup.range,
                ageGroupLabel: ageGroup.label,
                quarter: quarter.value,
                quarterLabel: quarter.label,
                category: category.value,
                categoryLabel: category.label,
                description: `This ${category.label.toLowerCase()} covers the Bible story of ${curriculumTitles[i]}. It includes engaging activities and discussion questions suitable for ${ageGroup.label} children.`,
                files: [
                    { name: `${curriculumTitles[i]}.pdf`, type: 'pdf' },
                    { name: `${curriculumTitles[i]} Activities.docx`, type: 'doc' },
                    { name: `${curriculumTitles[i]} Visuals.pptx`, type: 'ppt' }
                ].slice(0, Math.floor(Math.random() * 3) + 1)
            });
        }

        return curriculumItems;
    }

    function filterCurriculum() {
        const searchTerm = teacherSearch.value.toLowerCase();
        const ageGroupFilterValue = ageGroupFilter.value;
        const quarterFilterValue = quarterFilter.value;
        const categoryFilterValue = categoryFilter.value;

        filteredCurriculum = curriculumItems.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchTerm) ||
                                 item.description.toLowerCase().includes(searchTerm);

            const matchesAgeGroup = ageGroupFilterValue === 'all' || item.ageGroup === ageGroupFilterValue;
            const matchesQuarter = quarterFilterValue === 'all' || item.quarter === quarterFilterValue;
            const matchesCategory = categoryFilterValue === 'all' || item.category === categoryFilterValue;

            return matchesSearch && matchesAgeGroup && matchesQuarter && matchesCategory;
        });
    }

    function renderCurriculumGrid() {
        curriculumGrid.innerHTML = '';

        if (filteredCurriculum.length === 0) {
            curriculumGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>No curriculum items found matching your criteria</p>
                </div>
            `;
        } else {
            filteredCurriculum.forEach(item => {
                const card = document.createElement('div');
                card.className = 'curriculum-card';

                card.innerHTML = `
                    <div class="curriculum-card-header">
                        <h3>${item.title}</h3>
                    </div>
                    <div class="curriculum-card-body">
                        <div class="curriculum-meta">
                            <span class="curriculum-age-group">${item.ageGroupLabel}</span>
                            <span class="curriculum-quarter">${item.quarterLabel}</span>
                        </div>
                        <div class="curriculum-description">${item.description}</div>
                        <div class="curriculum-actions">
                            <span class="curriculum-category">${item.categoryLabel}</span>
                            <a href="#" class="view-curriculum" data-id="${item.id}">
                                <i class="fas fa-eye"></i> View Details
                            </a>
                        </div>
                    </div>
                `;

                curriculumGrid.appendChild(card);
            });
        }

        // Add event listeners to view buttons
        document.querySelectorAll('.view-curriculum').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                viewCurriculumDetails(parseInt(btn.dataset.id));
            });
        });
    }

    function viewCurriculumDetails(curriculumId) {
        const item = curriculumItems.find(c => c.id === curriculumId);
        if (!item) return;

        document.getElementById('curriculum-details-title').textContent = item.title;
        document.getElementById('detail-age-group').textContent = item.ageGroupLabel;
        document.getElementById('detail-quarter').textContent = item.quarterLabel;
        document.getElementById('detail-category').textContent = item.categoryLabel;
        document.getElementById('detail-description').textContent = item.description;

        const fileList = document.getElementById('file-list');
        fileList.innerHTML = '';

        item.files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';

            fileItem.innerHTML = `
                <span class="file-name">${file.name}</span>
                <a href="#" class="file-download" data-file="${file.name}">
                    <i class="fas fa-download"></i> Download
                </a>
            `;

            fileList.appendChild(fileItem);
        });

        // Add event listeners to download buttons
        document.querySelectorAll('.file-download').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                downloadFile(btn.dataset.file);
            });
        });

        curriculumDetailsModal.style.display = 'flex';
    }

    function downloadFile(filename) {
        // In a real app, this would download the actual file from the server
        alert(`Downloading file: ${filename}\n\nIn a real application, this would initiate a file download.`);
    }

    function downloadAllFiles() {
        const files = Array.from(document.querySelectorAll('.file-download')).map(btn => btn.dataset.file);
        if (files.length === 0) return;

        alert(`Downloading all files: ${files.join(', ')}\n\nIn a real application, this would package all files into a zip for download.`);
    }

    function addNewCurriculum() {
        const title = document.getElementById('curriculum-title').value;
        const ageGroup = document.getElementById('curriculum-age-group').value;
        const ageGroupLabel = document.getElementById('curriculum-age-group').options[document.getElementById('curriculum-age-group').selectedIndex].text;
        const quarter = document.getElementById('curriculum-quarter').value;
        const quarterLabel = document.getElementById('curriculum-quarter').options[document.getElementById('curriculum-quarter').selectedIndex].text;
        const category = document.getElementById('curriculum-category').value;
        const categoryLabel = document.getElementById('curriculum-category').options[document.getElementById('curriculum-category').selectedIndex].text;
        const description = document.getElementById('curriculum-description').value;
        const fileInput = document.getElementById('curriculum-file');

        // In a real app, this would upload the file to the server
        const filename = fileInput.files.length > 0 ? fileInput.files[0].name : 'Untitled.pdf';

        const newCurriculum = {
            id: curriculumItems.length + 1,
            title,
            ageGroup,
            ageGroupLabel,
            quarter,
            quarterLabel,
            category,
            categoryLabel,
            description,
            files: [{ name: filename, type: filename.split('.').pop() }]
        };

        curriculumItems.unshift(newCurriculum); // Add to beginning of array
        addCurriculumForm.reset();
        addCurriculumModal.style.display = 'none';

        // Update filters and render
        filterCurriculum();
        renderCurriculumGrid();

        alert(`${title} has been added to the curriculum.`);
    }

    function submitFeedback() {
        const subject = document.getElementById('feedback-subject').value;
        const message = document.getElementById('feedback-message').value;

        // In a real app, this would send the feedback to the server
        alert(`Thank you for your feedback!\n\nSubject: ${subject}\nMessage: ${message}\n\nThis would be submitted to the curriculum team in a real application.`);

        feedbackForm.reset();
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