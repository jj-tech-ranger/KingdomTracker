document.addEventListener('DOMContentLoaded', function() {
    // Sample data for demonstration
    const sampleEquipment = [
        {
            id: 'EQP-001',
            assetTag: 'EQP-001',
            serialNumber: 'SN123456789',
            name: 'Laptop Dell XPS',
            type: 'Laptop',
            manufacturer: 'Dell',
            model: 'XPS 15',
            purchaseDate: '2023-01-15',
            purchasePrice: 1299.99,
            warrantyExpiry: '2025-01-15',
            expectedLife: 36,
            assignedTo: 'John Doe',
            location: 'IT Department',
            status: 'In Use',
            condition: 'Good',
            notes: 'Issued to John Doe for development work',
            image: '../img/laptop-dell.jpg',
            lastAudit: '2023-06-01',
            activityLog: [
                { date: '2023-06-20', action: 'Assigned to John Doe', user: 'Jane Smith' },
                { date: '2023-05-15', action: 'Status changed to In Use', user: 'Mike Johnson' },
                { date: '2023-01-15', action: 'Equipment added to system', user: 'Admin' }
            ]
        },
        {
            id: 'EQP-002',
            assetTag: 'EQP-002',
            serialNumber: 'SN987654321',
            name: 'Projector Epson',
            type: 'Projector',
            manufacturer: 'Epson',
            model: 'EB-1781W',
            purchaseDate: '2022-11-10',
            purchasePrice: 899.99,
            warrantyExpiry: '2024-11-10',
            expectedLife: 48,
            assignedTo: 'Meeting Room',
            location: 'Meeting Room',
            status: 'Available',
            condition: 'Excellent',
            notes: 'Primary conference room projector',
            image: '../img/projector-epson.jpg',
            lastAudit: '2023-06-01',
            activityLog: [
                { date: '2023-03-10', action: 'Lamp replaced', user: 'IT Support' },
                { date: '2022-11-10', action: 'Equipment added to system', user: 'Admin' }
            ]
        },
        {
            id: 'EQP-003',
            assetTag: 'EQP-003',
            serialNumber: 'SN456123789',
            name: 'Printer HP',
            type: 'Printer',
            manufacturer: 'HP',
            model: 'LaserJet Pro MFP',
            purchaseDate: '2021-08-22',
            purchasePrice: 499.99,
            warrantyExpiry: '2023-08-22',
            expectedLife: 60,
            assignedTo: 'Office',
            location: 'Main Office',
            status: 'In Use',
            condition: 'Fair',
            notes: 'Needs toner replacement soon',
            image: '../img/printer-hp.jpg',
            lastAudit: '2023-05-15',
            activityLog: [
                { date: '2023-04-05', action: 'Paper jam cleared', user: 'Jane Smith' },
                { date: '2023-01-12', action: 'Toner replaced', user: 'IT Support' },
                { date: '2021-08-22', action: 'Equipment added to system', user: 'Admin' }
            ]
        },
        {
            id: 'EQP-004',
            assetTag: 'EQP-004',
            serialNumber: 'SN789321654',
            name: 'Conference Phone',
            type: 'Phone',
            manufacturer: 'Polycom',
            model: 'SoundStation 2',
            purchaseDate: '2022-05-18',
            purchasePrice: 349.99,
            warrantyExpiry: '2024-05-18',
            expectedLife: 48,
            assignedTo: 'Meeting Room',
            location: 'Meeting Room',
            status: 'Under Maintenance',
            condition: 'Poor',
            notes: 'Audio issues - sent for repair',
            image: '../img/phone-polycom.jpg',
            lastAudit: '2023-05-15',
            activityLog: [
                { date: '2023-06-10', action: 'Sent for repair', user: 'Mike Johnson' },
                { date: '2023-05-18', action: 'Reported audio issues', user: 'Sarah Williams' },
                { date: '2022-05-18', action: 'Equipment added to system', user: 'Admin' }
            ]
        },
        {
            id: 'EQP-005',
            assetTag: 'EQP-005',
            serialNumber: 'SN321654987',
            name: 'Desktop PC',
            type: 'Desktop',
            manufacturer: 'HP',
            model: 'EliteDesk 800',
            purchaseDate: '2020-10-05',
            purchasePrice: 899.99,
            warrantyExpiry: '2022-10-05',
            expectedLife: 60,
            assignedTo: 'Jane Smith',
            location: 'IT Department',
            status: 'In Use',
            condition: 'Fair',
            notes: 'Primary work computer for Jane Smith',
            image: '../img/desktop-hp.jpg',
            lastAudit: '2023-06-01',
            activityLog: [
                { date: '2023-03-15', action: 'RAM upgraded to 16GB', user: 'IT Support' },
                { date: '2022-12-01', action: 'Hard drive replaced', user: 'IT Support' },
                { date: '2020-10-05', action: 'Equipment added to system', user: 'Admin' }
            ]
        }
    ];

    // DOM elements
    const equipmentTable = document.getElementById('equipmentTable').querySelector('tbody');
    const addEquipmentBtn = document.getElementById('addEquipmentBtn');
    const scanEquipmentBtn = document.getElementById('scanEquipmentBtn');
    const equipmentModal = document.getElementById('equipmentModal');
    const detailsModal = document.getElementById('detailsModal');
    const statusModal = document.getElementById('statusModal');
    const assignModal = document.getElementById('assignModal');
    const serviceModal = document.getElementById('serviceModal');
    const retireModal = document.getElementById('retireModal');
    const auditModal = document.getElementById('auditModal');
    const equipmentForm = document.getElementById('equipmentForm');
    const statusForm = document.getElementById('statusForm');
    const assignForm = document.getElementById('assignForm');
    const serviceForm = document.getElementById('serviceForm');
    const retireForm = document.getElementById('retireForm');
    const modalTitle = document.getElementById('modalTitle');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const sortBy = document.getElementById('sortBy');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');

    // State variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredEquipment = [...sampleEquipment];
    let currentEquipmentId = null;

    // Initialize date pickers
    flatpickr('.date-picker', {
        dateFormat: 'Y-m-d',
        allowInput: true
    });

    // Initialize date range filter
    flatpickr('#dateRangeFilter', {
        mode: 'range',
        dateFormat: 'Y-m-d',
        allowInput: true
    });

    // Render equipment table
    function renderEquipmentTable(equipment) {
        equipmentTable.innerHTML = '';

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedEquipment = equipment.slice(startIndex, endIndex);

        if (paginatedEquipment.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="9" style="text-align: center;">No equipment found</td>`;
            equipmentTable.appendChild(row);
            return;
        }

        paginatedEquipment.forEach(item => {
            const row = document.createElement('tr');

            // Determine status and condition classes
            const statusClass = item.status.toLowerCase().replace(' ', '-');
            const conditionClass = item.condition.toLowerCase();

            row.innerHTML = `
                <td>${item.assetTag}</td>
                <td>${item.name}</td>
                <td>${item.serialNumber}</td>
                <td>${item.assignedTo || 'Unassigned'}</td>
                <td>${item.location}</td>
                <td><span class="status-badge ${statusClass}"><span class="status-text">${item.status}</span></span></td>
                <td><span class="condition-badge ${conditionClass}">${item.condition}</span></td>
                <td>${item.purchaseDate}</td>
                <td>
                    <button class="action-btn view" data-id="${item.id}"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn assign" data-id="${item.id}"><i class="fas fa-user"></i></button>
                    <button class="action-btn service" data-id="${item.id}"><i class="fas fa-tools"></i></button>
                    <button class="action-btn status" data-id="${item.id}"><i class="fas fa-sync-alt"></i></button>
                    ${item.status !== 'Retired' ? `<button class="action-btn retire" data-id="${item.id}"><i class="fas fa-trash"></i></button>` : ''}
                </td>
            `;
            equipmentTable.appendChild(row);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.action-btn.view').forEach(btn => {
            btn.addEventListener('click', function() {
                const equipmentId = this.getAttribute('data-id');
                showEquipmentDetails(equipmentId);
            });
        });

        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const equipmentId = this.getAttribute('data-id');
                editEquipment(equipmentId);
            });
        });

        document.querySelectorAll('.action-btn.assign').forEach(btn => {
            btn.addEventListener('click', function() {
                const equipmentId = this.getAttribute('data-id');
                assignEquipment(equipmentId);
            });
        });

        document.querySelectorAll('.action-btn.service').forEach(btn => {
            btn.addEventListener('click', function() {
                const equipmentId = this.getAttribute('data-id');
                logService(equipmentId);
            });
        });

        document.querySelectorAll('.action-btn.status').forEach(btn => {
            btn.addEventListener('click', function() {
                const equipmentId = this.getAttribute('data-id');
                changeStatus(equipmentId);
            });
        });

        document.querySelectorAll('.action-btn.retire').forEach(btn => {
            btn.addEventListener('click', function() {
                const equipmentId = this.getAttribute('data-id');
                retireEquipment(equipmentId);
            });
        });

        // Update pagination controls
        updatePaginationControls(equipment.length);
    }

    // Show equipment details
    function showEquipmentDetails(equipmentId) {
        const equipment = sampleEquipment.find(item => item.id === equipmentId);
        if (!equipment) return;

        // Update the details modal with equipment data
        document.getElementById('detailAssetTag').textContent = equipment.assetTag;
        document.getElementById('detailSerialNumber').textContent = equipment.serialNumber;
        document.getElementById('detailEquipmentName').textContent = equipment.name;
        document.getElementById('detailEquipmentType').textContent = equipment.type;
        document.getElementById('detailManufacturer').textContent = equipment.manufacturer;
        document.getElementById('detailModel').textContent = equipment.model;
        document.getElementById('detailAssignedTo').textContent = equipment.assignedTo || 'Unassigned';
        document.getElementById('detailLocation').textContent = equipment.location;
        document.getElementById('detailPurchaseDate').textContent = equipment.purchaseDate;
        document.getElementById('detailPurchasePrice').textContent = `$${equipment.purchasePrice.toFixed(2)}`;
        document.getElementById('detailWarrantyExpiry').textContent = equipment.warrantyExpiry;
        document.getElementById('detailExpectedLife').textContent = `${equipment.expectedLife} months`;
        document.getElementById('detailNotes').textContent = equipment.notes || 'N/A';

        // Update status and condition badges
        const statusBadge = document.getElementById('detailStatusBadge');
        statusBadge.className = `status-badge ${equipment.status.toLowerCase().replace(' ', '-')}`;
        statusBadge.querySelector('.status-text').textContent = equipment.status;

        const conditionBadge = document.getElementById('detailConditionBadge');
        conditionBadge.className = `condition-badge ${equipment.condition.toLowerCase()}`;
        conditionBadge.querySelector('.condition-text').textContent = equipment.condition;

        // Update equipment image
        const detailImage = document.getElementById('detailImage');
        detailImage.src = equipment.image || '../img/default-equipment.png';
        detailImage.alt = equipment.name;

        // Update activity log
        const activityLog = document.querySelector('.activity-log');
        activityLog.innerHTML = '';

        equipment.activityLog.forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.innerHTML = `
                <div class="log-date">${log.date}</div>
                <div class="log-action">${log.action}</div>
                <div class="log-user">by ${log.user}</div>
            `;
            activityLog.appendChild(logEntry);
        });

        // Show the details modal
        detailsModal.style.display = 'block';
    }

    // Edit equipment
    function editEquipment(equipmentId) {
        const equipment = sampleEquipment.find(item => item.id === equipmentId);
        if (!equipment) return;

        currentEquipmentId = equipmentId;
        modalTitle.textContent = 'Edit Equipment';

        // Populate the form with equipment data
        document.getElementById('assetTag').value = equipment.assetTag;
        document.getElementById('serialNumber').value = equipment.serialNumber;
        document.getElementById('equipmentName').value = equipment.name;
        document.getElementById('equipmentType').value = equipment.type;
        document.getElementById('manufacturer').value = equipment.manufacturer || '';
        document.getElementById('model').value = equipment.model || '';
        document.getElementById('purchaseDate').value = equipment.purchaseDate || '';
        document.getElementById('purchasePrice').value = equipment.purchasePrice || '';
        document.getElementById('warrantyExpiry').value = equipment.warrantyExpiry || '';
        document.getElementById('expectedLife').value = equipment.expectedLife || '';
        document.getElementById('assignedTo').value = equipment.assignedTo || '';
        document.getElementById('location').value = equipment.location || '';
        document.getElementById('status').value = equipment.status || 'Available';
        document.getElementById('condition').value = equipment.condition || 'Good';
        document.getElementById('notes').value = equipment.notes || '';

        // Show the equipment modal
        equipmentModal.style.display = 'block';
    }

    // Add new equipment
    function addNewEquipment() {
        currentEquipmentId = null;
        modalTitle.textContent = 'Add New Equipment';
        equipmentForm.reset();
        equipmentModal.style.display = 'block';
    }

    // Assign equipment
    function assignEquipment(equipmentId) {
        const equipment = sampleEquipment.find(item => item.id === equipmentId);
        if (!equipment) return;

        currentEquipmentId = equipmentId;
        document.getElementById('assignTo').value = equipment.assignedTo || '';
        document.getElementById('assignLocation').value = equipment.location || '';
        document.getElementById('assignNotes').value = '';
        assignModal.style.display = 'block';
    }

    // Log service
    function logService(equipmentId) {
        currentEquipmentId = equipmentId;
        serviceForm.reset();
        document.getElementById('serviceDate').value = new Date().toISOString().split('T')[0];
        serviceModal.style.display = 'block';
    }

    // Change status
    function changeStatus(equipmentId) {
        const equipment = sampleEquipment.find(item => item.id === equipmentId);
        if (!equipment) return;

        currentEquipmentId = equipmentId;
        document.getElementById('newStatus').value = equipment.status;
        document.getElementById('statusReason').value = '';
        statusModal.style.display = 'block';
    }

    // Retire equipment
    function retireEquipment(equipmentId) {
        currentEquipmentId = equipmentId;
        retireForm.reset();
        document.getElementById('retireDate').value = new Date().toISOString().split('T')[0];
        retireModal.style.display = 'block';
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
        const typeFilter = document.getElementById('equipmentTypeFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const assignedToFilter = document.getElementById('assignedToFilter').value;
        const locationFilter = document.getElementById('locationFilter').value;
        const dateRange = document.getElementById('dateRangeFilter').value;
        const searchTerm = document.getElementById('equipmentSearch').value.toLowerCase();

        filteredEquipment = sampleEquipment.filter(item => {
            // Filter by type
            if (typeFilter !== 'all' && item.type !== typeFilter) {
                return false;
            }

            // Filter by status
            if (statusFilter !== 'all' && item.status !== statusFilter) {
                return false;
            }

            // Filter by assigned to
            if (assignedToFilter !== 'all') {
                if (assignedToFilter === 'Unassigned' && item.assignedTo) {
                    return false;
                }
                if (assignedToFilter !== 'Unassigned' && item.assignedTo !== assignedToFilter) {
                    return false;
                }
            }

            // Filter by location
            if (locationFilter !== 'all' && item.location !== locationFilter) {
                return false;
            }

            // Filter by date range
            if (dateRange) {
                const dates = dateRange.split(' to ');
                const purchaseDate = new Date(item.purchaseDate).getTime();

                if (dates.length === 1) {
                    const filterDate = new Date(dates[0]).getTime();
                    if (purchaseDate !== filterDate) return false;
                } else if (dates.length === 2) {
                    const startDate = new Date(dates[0]).getTime();
                    const endDate = new Date(dates[1]).getTime();
                    if (purchaseDate < startDate || purchaseDate > endDate) return false;
                }
            }

            // Filter by search term
            if (searchTerm) {
                const searchFields = [
                    item.assetTag,
                    item.serialNumber,
                    item.name,
                    item.type,
                    item.manufacturer,
                    item.model,
                    item.assignedTo,
                    item.location,
                    item.notes
                ].join(' ').toLowerCase();

                if (!searchFields.includes(searchTerm)) {
                    return false;
                }
            }

            return true;
        });

        // Apply sorting
        applySorting();

        currentPage = 1;
        renderEquipmentTable(filteredEquipment);
    }

    // Apply sorting
    function applySorting() {
        const sortValue = sortBy.value;

        filteredEquipment.sort((a, b) => {
            switch(sortValue) {
                case 'assetTag':
                    return a.assetTag.localeCompare(b.assetTag);
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'purchaseDate':
                    return new Date(b.purchaseDate) - new Date(a.purchaseDate);
                case 'purchaseDateOldest':
                    return new Date(a.purchaseDate) - new Date(b.purchaseDate);
                case 'status':
                    return a.status.localeCompare(b.status);
                case 'assignedTo':
                    return (a.assignedTo || '').localeCompare(b.assignedTo || '');
                default:
                    return 0;
            }
        });
    }

    // Reset filters
    function resetFilters() {
        document.getElementById('equipmentTypeFilter').value = 'all';
        document.getElementById('statusFilter').value = 'all';
        document.getElementById('assignedToFilter').value = 'all';
        document.getElementById('locationFilter').value = 'all';
        document.getElementById('dateRangeFilter').value = '';
        document.getElementById('equipmentSearch').value = '';
        sortBy.value = 'assetTag';
        applyFilters();
    }

    // Save equipment (add or edit)
    function saveEquipment(e) {
        e.preventDefault();

        const equipmentData = {
            assetTag: document.getElementById('assetTag').value,
            serialNumber: document.getElementById('serialNumber').value,
            name: document.getElementById('equipmentName').value,
            type: document.getElementById('equipmentType').value,
            manufacturer: document.getElementById('manufacturer').value || null,
            model: document.getElementById('model').value || null,
            purchaseDate: document.getElementById('purchaseDate').value || null,
            purchasePrice: document.getElementById('purchasePrice').value ? parseFloat(document.getElementById('purchasePrice').value) : null,
            warrantyExpiry: document.getElementById('warrantyExpiry').value || null,
            expectedLife: document.getElementById('expectedLife').value ? parseInt(document.getElementById('expectedLife').value) : null,
            assignedTo: document.getElementById('assignedTo').value || null,
            location: document.getElementById('location').value,
            status: document.getElementById('status').value,
            condition: document.getElementById('condition').value,
            notes: document.getElementById('notes').value || null,
            activityLog: []
        };

        // Handle image upload
        const imageInput = document.getElementById('equipmentImage');
        if (imageInput.files.length > 0) {
            equipmentData.image = URL.createObjectURL(imageInput.files[0]);
        }

        if (currentEquipmentId) {
            // Edit existing equipment
            const index = sampleEquipment.findIndex(item => item.id === currentEquipmentId);
            if (index !== -1) {
                // Preserve existing activity log and image if not changed
                equipmentData.activityLog = sampleEquipment[index].activityLog;
                if (!equipmentData.image && sampleEquipment[index].image) {
                    equipmentData.image = sampleEquipment[index].image;
                }

                // Add edit log entry
                equipmentData.activityLog.unshift({
                    date: new Date().toISOString().split('T')[0],
                    action: 'Equipment details updated',
                    user: 'Current User' // In a real app, this would be the logged-in user
                });

                sampleEquipment[index] = { ...sampleEquipment[index], ...equipmentData };
            }
        } else {
            // Add new equipment
            equipmentData.id = `EQP-${new Date().getFullYear()}-${String(sampleEquipment.length + 1).padStart(3, '0')}`;
            equipmentData.activityLog.push({
                date: new Date().toISOString().split('T')[0],
                action: 'Equipment added to system',
                user: 'Current User' // In a real app, this would be the logged-in user
            });
            sampleEquipment.unshift(equipmentData);
        }

        // Reset form and close modal
        equipmentForm.reset();
        equipmentModal.style.display = 'none';

        // Refresh table
        applyFilters();

        // Show success message
        alert('Equipment saved successfully!');
    }

    // Save status change
    function saveStatusChange(e) {
        e.preventDefault();

        const newStatus = document.getElementById('newStatus').value;
        const reason = document.getElementById('statusReason').value;

        const equipment = sampleEquipment.find(item => item.id === currentEquipmentId);
        if (equipment) {
            const oldStatus = equipment.status;
            equipment.status = newStatus;

            // Add to activity log
            equipment.activityLog.unshift({
                date: new Date().toISOString().split('T')[0],
                action: `Status changed from ${oldStatus} to ${newStatus}` + (reason ? ` (Reason: ${reason})` : ''),
                user: 'Current User' // In a real app, this would be the logged-in user
            });
        }

        // Reset form and close modal
        statusForm.reset();
        statusModal.style.display = 'none';

        // Refresh table
        applyFilters();
    }

    // Save assignment
    function saveAssignment(e) {
        e.preventDefault();

        const assignTo = document.getElementById('assignTo').value;
        const location = document.getElementById('assignLocation').value;
        const notes = document.getElementById('assignNotes').value;

        const equipment = sampleEquipment.find(item => item.id === currentEquipmentId);
        if (equipment) {
            const oldAssignment = equipment.assignedTo;
            const oldLocation = equipment.location;

            equipment.assignedTo = assignTo === 'Unassigned' ? null : assignTo;
            equipment.location = location;

            // Add to activity log
            let action = '';
            if (!oldAssignment && assignTo !== 'Unassigned') {
                action = `Assigned to ${assignTo} at ${location}`;
            } else if (oldAssignment && assignTo === 'Unassigned') {
                action = `Unassigned from ${oldAssignment}`;
            } else if (oldAssignment && assignTo !== 'Unassigned') {
                action = `Reassigned from ${oldAssignment} to ${assignTo}`;
            }

            if (oldLocation !== location) {
                action += action ? ` and moved from ${oldLocation} to ${location}` : `Moved from ${oldLocation} to ${location}`;
            }

            if (notes) {
                action += ` (Notes: ${notes})`;
            }

            if (action) {
                equipment.activityLog.unshift({
                    date: new Date().toISOString().split('T')[0],
                    action: action,
                    user: 'Current User' // In a real app, this would be the logged-in user
                });
            }
        }

        // Reset form and close modal
        assignForm.reset();
        assignModal.style.display = 'none';

        // Refresh table
        applyFilters();
    }

    // Save service log
    function saveServiceLog(e) {
        e.preventDefault();

        const serviceDate = document.getElementById('serviceDate').value;
        const serviceType = document.getElementById('serviceType').value;
        const description = document.getElementById('serviceDescription').value;
        const serviceProvider = document.getElementById('serviceProvider').value;
        const cost = document.getElementById('serviceCost').value ? parseFloat(document.getElementById('serviceCost').value) : null;
        const outcome = document.getElementById('serviceOutcome').value;
        const notes = document.getElementById('serviceNotes').value;

        const equipment = sampleEquipment.find(item => item.id === currentEquipmentId);
        if (equipment) {
            // Add to activity log
            equipment.activityLog.unshift({
                date: serviceDate,
                action: `Service performed: ${serviceType} - ${outcome}` + (cost ? ` (Cost: $${cost.toFixed(2)})` : ''),
                user: 'Current User' // In a real app, this would be the logged-in user
            });

            // Update condition if outcome suggests it
            if (outcome === 'Completed' && serviceType === 'Repair') {
                equipment.condition = 'Good';
            }
        }

        // Reset form and close modal
        serviceForm.reset();
        serviceModal.style.display = 'none';

        // Refresh table
        applyFilters();

        // Show success message
        alert('Service logged successfully!');
    }

    // Save retirement
    function saveRetirement(e) {
        e.preventDefault();

        const retireDate = document.getElementById('retireDate').value;
        const reason = document.getElementById('retireReason').value;
        const notes = document.getElementById('retireNotes').value;
        const residualValue = document.getElementById('retireValue').value ? parseFloat(document.getElementById('retireValue').value) : null;

        const equipment = sampleEquipment.find(item => item.id === currentEquipmentId);
        if (equipment) {
            equipment.status = 'Retired';

            // Add to activity log
            equipment.activityLog.unshift({
                date: retireDate,
                action: `Equipment retired (Reason: ${reason})` + (residualValue ? ` (Residual value: $${residualValue.toFixed(2)})` : ''),
                user: 'Current User' // In a real app, this would be the logged-in user
            });

            if (notes) {
                equipment.activityLog.unshift({
                    date: retireDate,
                    action: `Retirement notes: ${notes}`,
                    user: 'Current User' // In a real app, this would be the logged-in user
                });
            }
        }

        // Reset form and close modal
        retireForm.reset();
        retireModal.style.display = 'none';

        // Refresh table
        applyFilters();
    }

    // Start audit
    function startAudit() {
        auditModal.style.display = 'block';
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Close modals with close button
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Event listeners
    addEquipmentBtn.addEventListener('click', addNewEquipment);
    scanEquipmentBtn.addEventListener('click', startAudit);
    applyFiltersBtn.addEventListener('click', applyFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);
    sortBy.addEventListener('change', applyFilters);
    document.getElementById('equipmentSearch').addEventListener('input', applyFilters);

    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            renderEquipmentTable(filteredEquipment);
        }
    });

    nextPageBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(filteredEquipment.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderEquipmentTable(filteredEquipment);
        }
    });

    equipmentForm.addEventListener('submit', saveEquipment);
    statusForm.addEventListener('submit', saveStatusChange);
    assignForm.addEventListener('submit', saveAssignment);
    serviceForm.addEventListener('submit', saveServiceLog);
    retireForm.addEventListener('submit', saveRetirement);

    // Cancel buttons
    document.getElementById('cancelEquipmentBtn').addEventListener('click', function() {
        equipmentModal.style.display = 'none';
    });

    document.getElementById('cancelStatusBtn').addEventListener('click', function() {
        statusModal.style.display = 'none';
    });

    document.getElementById('cancelAssignBtn').addEventListener('click', function() {
        assignModal.style.display = 'none';
    });

    document.getElementById('cancelServiceBtn').addEventListener('click', function() {
        serviceModal.style.display = 'none';
    });

    document.getElementById('cancelRetireBtn').addEventListener('click', function() {
        retireModal.style.display = 'none';
    });

    // Initialize
    applyFilters();
});