document.addEventListener('DOMContentLoaded', function() {
    // Sample data for demonstration
    const sampleMovements = [
        {
            id: 'MOV-2023-001',
            date: '2023-06-15 09:30',
            type: 'receipt',
            itemCode: 'ITM-0042',
            itemName: 'Wireless Mouse',
            quantity: 50,
            fromLocation: 'Supplier A',
            toLocation: 'Main Warehouse',
            initiatedBy: 'John Doe',
            reason: 'Monthly restock order',
            status: 'completed'
        },
        {
            id: 'MOV-2023-002',
            date: '2023-06-16 14:15',
            type: 'issue',
            itemCode: 'ITM-0042',
            itemName: 'Wireless Mouse',
            quantity: 5,
            fromLocation: 'Main Warehouse',
            toLocation: 'IT Department',
            initiatedBy: 'Jane Smith',
            reason: 'New employee setup',
            status: 'completed'
        },
        {
            id: 'MOV-2023-003',
            date: '2023-06-17 11:00',
            type: 'transfer',
            itemCode: 'ITM-0087',
            itemName: 'A4 Printer Paper',
            quantity: 10,
            fromLocation: 'Main Warehouse',
            toLocation: 'Office Storage',
            initiatedBy: 'Mike Johnson',
            reason: 'Stock redistribution',
            status: 'completed'
        },
        {
            id: 'MOV-2023-004',
            date: '2023-06-18 16:45',
            type: 'adjustment',
            itemCode: 'ITM-0042',
            itemName: 'Wireless Mouse',
            quantity: -2,
            fromLocation: 'Main Warehouse',
            toLocation: 'Main Warehouse',
            initiatedBy: 'John Doe',
            reason: 'Damaged during inventory check',
            status: 'completed'
        },
        {
            id: 'MOV-2023-005',
            date: '2023-06-19 10:20',
            type: 'issue',
            itemCode: 'ITM-0087',
            itemName: 'A4 Printer Paper',
            quantity: 3,
            fromLocation: 'Office Storage',
            toLocation: 'Meeting Room',
            initiatedBy: 'Sarah Williams',
            reason: 'Client meeting materials',
            status: 'completed'
        }
    ];

    // Sample items for dropdown
    const sampleItems = [
        { code: 'ITM-0042', name: 'Wireless Mouse', category: 'IT Equipment' },
        { code: 'ITM-0087', name: 'A4 Printer Paper', category: 'Office Supplies' },
        { code: 'ITM-0123', name: 'Desk Chair', category: 'Furniture' },
        { code: 'ITM-0156', name: 'Projector', category: 'IT Equipment' },
        { code: 'ITM-0189', name: 'Whiteboard Markers', category: 'Office Supplies' }
    ];

    // DOM elements
    const movementsTable = document.getElementById('movementsTable');
    const movementModal = document.getElementById('movementModal');
    const detailsModal = document.getElementById('detailsModal');
    const newMovementBtn = document.getElementById('newMovementBtn');
    const cancelMovementBtn = document.getElementById('cancelMovementBtn');
    const closeDetailsBtn = document.getElementById('closeDetailsBtn');
    const movementForm = document.getElementById('movementForm');
    const movementTypeFilter = document.getElementById('movementTypeFilter');
    const dateRangeFilter = document.getElementById('dateRangeFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const locationFilter = document.getElementById('locationFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const movementSearch = document.getElementById('movementSearch');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');
    const itemSelect = document.getElementById('itemSelect');
    const movementType = document.getElementById('movementType');
    const fromLocationGroup = document.getElementById('fromLocationGroup');
    const toLocationGroup = document.getElementById('toLocationGroup');

    // State variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredMovements = [...sampleMovements];

    // Initialize date range picker
    flatpickr(dateRangeFilter, {
        mode: 'range',
        dateFormat: 'Y-m-d',
        allowInput: true
    });

    // Initialize item dropdown
    function populateItemDropdown() {
        itemSelect.innerHTML = '<option value="">Select item</option>';
        sampleItems.forEach(item => {
            const option = document.createElement('option');
            option.value = item.code;
            option.textContent = `${item.code} - ${item.name}`;
            option.dataset.category = item.category;
            itemSelect.appendChild(option);
        });
    }

    // Render movements table
    function renderMovementsTable(movements) {
        const tbody = movementsTable.querySelector('tbody');
        tbody.innerHTML = '';

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedMovements = movements.slice(startIndex, endIndex);

        if (paginatedMovements.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="11" style="text-align: center;">No movements found</td>`;
            tbody.appendChild(row);
            return;
        }

        paginatedMovements.forEach(movement => {
            const row = document.createElement('tr');

            // Determine movement type class and display text
            let typeClass = '';
            let typeText = '';
            switch(movement.type) {
                case 'receipt':
                    typeClass = 'receipt';
                    typeText = 'Receipt';
                    break;
                case 'issue':
                    typeClass = 'issue';
                    typeText = 'Issue';
                    break;
                case 'transfer':
                    typeClass = 'transfer';
                    typeText = 'Transfer';
                    break;
                case 'adjustment':
                    typeClass = 'adjustment';
                    typeText = 'Adjustment';
                    break;
            }

            row.innerHTML = `
                <td>${movement.id}</td>
                <td>${movement.date}</td>
                <td><span class="movement-type ${typeClass}">${typeText}</span></td>
                <td>${movement.itemCode}</td>
                <td>${movement.itemName}</td>
                <td>${movement.quantity > 0 ? '+' : ''}${movement.quantity}</td>
                <td>${movement.fromLocation}</td>
                <td>${movement.toLocation}</td>
                <td>${movement.initiatedBy}</td>
                <td><span class="status ${movement.status === 'completed' ? 'good' : 'warning'}">${movement.status}</span></td>
                <td>
                    <button class="action-btn view" data-id="${movement.id}"><i class="fas fa-eye"></i></button>
                    ${movement.status === 'pending' ? 
                        `<button class="action-btn edit" data-id="${movement.id}"><i class="fas fa-edit"></i></button>
                         <button class="action-btn delete" data-id="${movement.id}"><i class="fas fa-trash"></i></button>` : 
                        ''}
                </td>
            `;
            tbody.appendChild(row);
        });

        // Add event listeners to view buttons
        document.querySelectorAll('.action-btn.view').forEach(btn => {
            btn.addEventListener('click', function() {
                const movementId = this.getAttribute('data-id');
                showMovementDetails(movementId);
            });
        });

        // Update pagination controls
        updatePaginationControls(movements.length);
    }

    // Show movement details modal
    function showMovementDetails(movementId) {
        const movement = sampleMovements.find(m => m.id === movementId);
        if (!movement) return;

        // Determine movement type display text
        let typeText = '';
        switch(movement.type) {
            case 'receipt':
                typeText = 'Receipt (Stock In)';
                break;
            case 'issue':
                typeText = 'Issue (Stock Out)';
                break;
            case 'transfer':
                typeText = 'Transfer';
                break;
            case 'adjustment':
                typeText = 'Adjustment';
                break;
        }

        const detailsContent = document.getElementById('movementDetailsContent');
        detailsContent.innerHTML = `
            <div class="detail-row">
                <span class="detail-label">Movement ID:</span>
                <span class="detail-value">${movement.id}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date & Time:</span>
                <span class="detail-value">${movement.date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Type:</span>
                <span class="detail-value">${typeText}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Item Code:</span>
                <span class="detail-value">${movement.itemCode}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Item Name:</span>
                <span class="detail-value">${movement.itemName}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Quantity:</span>
                <span class="detail-value">${movement.quantity > 0 ? '+' : ''}${movement.quantity}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">From Location:</span>
                <span class="detail-value">${movement.fromLocation}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">To Location:</span>
                <span class="detail-value">${movement.toLocation}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Initiated By:</span>
                <span class="detail-value">${movement.initiatedBy}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Status:</span>
                <span class="detail-value"><span class="status ${movement.status === 'completed' ? 'good' : 'warning'}">${movement.status}</span></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Reason/Notes:</span>
                <span class="detail-value">${movement.reason || 'N/A'}</span>
            </div>
        `;

        detailsModal.style.display = 'block';
    }

    // Update pagination controls
    function updatePaginationControls(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Apply filters
    function applyFilters() {
        const typeFilter = movementTypeFilter.value;
        const dateRange = dateRangeFilter.value;
        const categoryFilterValue = categoryFilter.value;
        const locationFilterValue = locationFilter.value;
        const searchTerm = movementSearch.value.toLowerCase();

        filteredMovements = sampleMovements.filter(movement => {
            // Filter by type
            if (typeFilter !== 'all' && movement.type !== typeFilter) {
                return false;
            }

            // Filter by date range
            if (dateRange) {
                const dates = dateRange.split(' to ');
                const movementDate = new Date(movement.date.split(' ')[0]).getTime();

                if (dates.length === 1) {
                    const filterDate = new Date(dates[0]).getTime();
                    if (movementDate !== filterDate) return false;
                } else if (dates.length === 2) {
                    const startDate = new Date(dates[0]).getTime();
                    const endDate = new Date(dates[1]).getTime();
                    if (movementDate < startDate || movementDate > endDate) return false;
                }
            }

            // Filter by category (needs item data)
            if (categoryFilterValue !== 'all') {
                const item = sampleItems.find(item => item.code === movement.itemCode);
                if (!item || item.category !== categoryFilterValue) return false;
            }

            // Filter by location
            if (locationFilterValue !== 'all') {
                if (movement.fromLocation !== locationFilterValue && movement.toLocation !== locationFilterValue) {
                    return false;
                }
            }

            // Filter by search term
            if (searchTerm) {
                const searchFields = [
                    movement.id,
                    movement.itemCode,
                    movement.itemName,
                    movement.fromLocation,
                    movement.toLocation,
                    movement.initiatedBy,
                    movement.reason
                ].join(' ').toLowerCase();

                if (!searchFields.includes(searchTerm)) {
                    return false;
                }
            }

            return true;
        });

        currentPage = 1;
        renderMovementsTable(filteredMovements);
    }

    // Reset filters
    function resetFilters() {
        movementTypeFilter.value = 'all';
        dateRangeFilter.value = '';
        categoryFilter.value = 'all';
        locationFilter.value = 'all';
        movementSearch.value = '';
        applyFilters();
    }

    // Handle movement type change in form
    function handleMovementTypeChange() {
        const type = movementType.value;

        // Show/hide location fields based on movement type
        if (type === 'receipt') {
            fromLocationGroup.style.display = 'none';
            toLocationGroup.style.display = 'block';
            document.getElementById('fromLocation').required = false;
            document.getElementById('toLocation').required = true;
        } else if (type === 'issue') {
            fromLocationGroup.style.display = 'block';
            toLocationGroup.style.display = 'block';
            document.getElementById('fromLocation').required = true;
            document.getElementById('toLocation').required = true;
        } else if (type === 'transfer') {
            fromLocationGroup.style.display = 'block';
            toLocationGroup.style.display = 'block';
            document.getElementById('fromLocation').required = true;
            document.getElementById('toLocation').required = true;
        } else if (type === 'adjustment') {
            fromLocationGroup.style.display = 'block';
            toLocationGroup.style.display = 'none';
            document.getElementById('fromLocation').required = true;
            document.getElementById('toLocation').required = false;
        }
    }

    // Event listeners
    newMovementBtn.addEventListener('click', function() {
        populateItemDropdown();
        movementForm.reset();
        movementModal.style.display = 'block';
    });

    cancelMovementBtn.addEventListener('click', function() {
        movementModal.style.display = 'none';
    });

    closeDetailsBtn.addEventListener('click', function() {
        detailsModal.style.display = 'none';
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === movementModal) {
            movementModal.style.display = 'none';
        }
        if (event.target === detailsModal) {
            detailsModal.style.display = 'none';
        }
    });

    // Close modals with close button
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            movementModal.style.display = 'none';
            detailsModal.style.display = 'none';
        });
    });

    movementType.addEventListener('change', handleMovementTypeChange);

    movementForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Create new movement object
        const newMovement = {
            id: `MOV-${new Date().getFullYear()}-${String(sampleMovements.length + 1).padStart(3, '0')}`,
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            type: movementType.value,
            itemCode: itemSelect.value,
            itemName: sampleItems.find(item => item.code === itemSelect.value)?.name || '',
            quantity: parseInt(movementQuantity.value),
            fromLocation: movementType.value === 'receipt' ? 'Supplier' : fromLocation.value,
            toLocation: movementType.value === 'adjustment' ? fromLocation.value : toLocation.value,
            initiatedBy: 'Current User', // In a real app, this would be the logged-in user
            reason: movementReason.value,
            status: 'completed'
        };

        // Add to sample data (in a real app, this would be an API call)
        sampleMovements.unshift(newMovement);
        filteredMovements.unshift(newMovement);

        // Reset form and close modal
        movementForm.reset();
        movementModal.style.display = 'none';

        // Refresh table
        renderMovementsTable(filteredMovements);

        // Show success message
        alert('Movement recorded successfully!');
    });

    applyFiltersBtn.addEventListener('click', applyFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);
    movementSearch.addEventListener('input', applyFilters);

    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderMovementsTable(filteredMovements);
        }
    });

    nextPageBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderMovementsTable(filteredMovements);
        }
    });

    // Initialize
    populateItemDropdown();
    renderMovementsTable(filteredMovements);
    handleMovementTypeChange(); // Set initial form state
});