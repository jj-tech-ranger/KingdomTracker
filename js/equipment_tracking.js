
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Initialize equipment data and pagination
    const equipmentData = generateEquipmentData(); // Generate 100 equipment items
    setupEquipmentTable(equipmentData);
    setupEquipmentFilters();
    setupPagination(equipmentData);
});

// Theme Management
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function loadThemePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// Generate mock equipment data (100 items)
function generateEquipmentData() {
    const categories = ['Media', 'IT', 'Audio', 'AV', 'Lighting', 'Furniture'];
    const conditions = ['Good', 'Needs Repair', 'Damaged'];
    const statuses = ['Available', 'In Use', 'Under Maintenance', 'Missing'];
    const locations = ['Main Hall', 'Youth Wing', 'Media Booth', 'Storage', 'Main Office', 'Classroom A', 'Classroom B'];
    const assignedTo = ['Media Team', 'Sound Team', 'Youth Team', 'Pastor John', 'Admin Team', 'Unassigned', 'Maintenance Team'];

    const equipment = [];

    for (let i = 1; i <= 100; i++) {
        const assetId = `AST-${String(i).padStart(4, '0')}`;
        const category = categories[Math.floor(Math.random() * categories.length)];

        equipment.push({
            assetId: assetId,
            name: generateEquipmentName(category, i),
            category: category,
            condition: conditions[Math.floor(Math.random() * conditions.length)],
            assignedTo: assignedTo[Math.floor(Math.random() * assignedTo.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            lastChecked: generateRandomDate()
        });
    }

    return equipment;
}

function generateEquipmentName(category, id) {
    const mediaItems = ['Canon EOS 90D Camera', 'Sony A7 III Camera', 'Nikon D850 Camera', 'GoPro Hero 10'];
    const itItems = ['MacBook Pro 16"', 'Dell XPS 15', 'iPad Pro', 'Microsoft Surface Pro'];
    const audioItems = ['Yamaha MG10XU Mixer', 'Shure SM58 Microphone', 'Bose L1 Pro8', 'Sennheiser EW 100'];
    const avItems = ['Epson EB-1781W Projector', 'Samsung 75" Smart TV', 'LG UltraShort Throw Projector'];
    const lightingItems = ['LED Par Can 64', 'Moving Head Spot 150', 'DMX Controller', 'Fog Machine'];
    const furnitureItems = ['Folding Chair', 'Round Table', 'Podium', 'Bookshelf'];

    switch(category) {
        case 'Media': return mediaItems[id % mediaItems.length];
        case 'IT': return itItems[id % itItems.length];
        case 'Audio': return audioItems[id % audioItems.length];
        case 'AV': return avItems[id % avItems.length];
        case 'Lighting': return lightingItems[id % lightingItems.length];
        case 'Furniture': return furnitureItems[id % furnitureItems.length];
        default: return 'Generic Equipment';
    }
}

function generateRandomDate() {
    const start = new Date(2023, 0, 1);
    const end = new Date();
    const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return date.toISOString().split('T')[0];
}

// Setup equipment table with pagination
let currentPage = 1;
const itemsPerPage = 5;

function setupEquipmentTable(equipment) {
    const tbody = document.querySelector('.project-summary tbody');
    tbody.innerHTML = ''; // Clear existing rows

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = equipment.slice(startIndex, endIndex);

    // Add rows for current page
    paginatedItems.forEach(item => {
        const row = document.createElement('tr');

        // Determine status class based on status text
        let statusClass = 'neutral';
        if (item.status === 'Available') statusClass = 'good';
        if (item.status === 'Under Maintenance') statusClass = 'warning';
        if (item.status === 'Missing') statusClass = 'critical';

        // Determine condition class
        let conditionClass = 'good';
        if (item.condition === 'Needs Repair') conditionClass = 'warning';
        if (item.condition === 'Damaged') conditionClass = 'critical';

        row.innerHTML = `
            <td>${item.assetId}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td><span class="status ${conditionClass}">${item.condition}</span></td>
            <td>${item.assignedTo}</td>
            <td>${item.location}</td>
            <td><span class="status ${statusClass}">${item.status}</span></td>
            <td>${item.lastChecked}</td>
            <td>
                <button class="action-btn view"><i class="fas fa-eye"></i></button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

function setupPagination(equipment) {
    const totalPages = Math.ceil(equipment.length / itemsPerPage);
    const pageNumbersContainer = document.getElementById('page-numbers');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    // Update page numbers
    function updatePageNumbers() {
        pageNumbersContainer.innerHTML = '';

        // Always show first page
        addPageNumber(1);

        // Show current page and surrounding pages
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        if (startPage > 2) {
            pageNumbersContainer.innerHTML += '<span>...</span>';
        }

        for (let i = startPage; i <= endPage; i++) {
            addPageNumber(i);
        }

        if (endPage < totalPages - 1) {
            pageNumbersContainer.innerHTML += '<span>...</span>';
        }

        // Always show last page if there's more than one page
        if (totalPages > 1) {
            addPageNumber(totalPages);
        }

        // Update button states
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }

    function addPageNumber(page) {
        const pageElement = document.createElement('span');
        pageElement.textContent = page;
        pageElement.className = 'page-number';
        if (page === currentPage) {
            pageElement.classList.add('active');
        }

        pageElement.addEventListener('click', () => {
            currentPage = page;
            setupEquipmentTable(equipment);
            updatePageNumbers();
        });

        pageNumbersContainer.appendChild(pageElement);
    }

    // Event listeners for prev/next buttons
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            setupEquipmentTable(equipment);
            updatePageNumbers();
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            setupEquipmentTable(equipment);
            updatePageNumbers();
        }
    });

    // Initial setup
    updatePageNumbers();
}

// Equipment Filter Functionality (updated to work with pagination)
function setupEquipmentFilters() {
    const locationFilter = document.getElementById('location-filter');
    const statusFilter = document.getElementById('status-filter');
    const conditionFilter = document.getElementById('condition-filter');
    const searchInput = document.querySelector('.search-bar input');

    let filteredEquipment = generateEquipmentData();

    function filterEquipment() {
        const locationValue = locationFilter.value.toLowerCase();
        const statusValue = statusFilter.value.toLowerCase();
        const conditionValue = conditionFilter.value.toLowerCase();
        const searchValue = searchInput.value.toLowerCase();

        filteredEquipment = generateEquipmentData().filter(item => {
            const locationMatch = locationValue === '' || item.location.toLowerCase().includes(locationValue);
            const statusMatch = statusValue === '' || item.status.toLowerCase().includes(statusValue);
            const conditionMatch = conditionValue === '' || item.condition.toLowerCase().includes(conditionValue);
            const searchMatch = searchValue === '' ||
                item.name.toLowerCase().includes(searchValue) ||
                item.assetId.toLowerCase().includes(searchValue);

            return locationMatch && statusMatch && conditionMatch && searchMatch;
        });

        currentPage = 1; // Reset to first page when filtering
        setupEquipmentTable(filteredEquipment);
        setupPagination(filteredEquipment);
    }

    // Add event listeners to all filters and search
    [locationFilter, statusFilter, conditionFilter, searchInput].forEach(element => {
        element.addEventListener('change', filterEquipment);
        element.addEventListener('keyup', filterEquipment);
    });
}

loadThemePreference();