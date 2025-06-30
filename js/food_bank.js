document.addEventListener('DOMContentLoaded', function() {
    // Sample data for the food bank
    const inventoryItems = [
        {
            id: 1,
            name: "Canned Beans",
            description: "Assorted varieties of canned beans",
            category: "non-perishable",
            quantity: 24,
            unit: "can",
            expiration: "2023-12-15",
            received: "2023-06-10",
            source: "Community Food Drive",
            distributed: 8
        },
        {
            id: 2,
            name: "Rice",
            description: "5kg bags of white rice",
            category: "non-perishable",
            quantity: 15,
            unit: "bag",
            expiration: "2024-05-01",
            received: "2023-06-05",
            source: "Local Supermarket Donation",
            distributed: 5
        },
        {
            id: 3,
            name: "Fresh Apples",
            description: "Fresh apples from local orchard",
            category: "perishable",
            quantity: 12,
            unit: "kg",
            expiration: "2023-07-05",
            received: "2023-06-28",
            source: "Johnson Family Orchard",
            distributed: 0
        },
        {
            id: 4,
            name: "Toothpaste",
            description: "Family size toothpaste tubes",
            category: "hygiene",
            quantity: 18,
            unit: "tube",
            expiration: "2025-03-01",
            received: "2023-06-15",
            source: "Dental Health Foundation",
            distributed: 3
        },
        {
            id: 5,
            name: "Winter Coats",
            description: "Assorted sizes for adults and children",
            category: "clothing",
            quantity: 9,
            unit: "each",
            received: "2023-05-20",
            source: "Winter Warmth Campaign",
            distributed: 2
        },
        {
            id: 6,
            name: "Pasta",
            description: "Various types of dry pasta",
            category: "non-perishable",
            quantity: 7,
            unit: "box",
            expiration: "2024-02-01",
            received: "2023-06-18",
            source: "Community Food Drive",
            distributed: 0
        }
    ];

    const distributionLog = [
        {
            id: 1,
            date: "2023-06-20",
            items: [
                { id: 1, name: "Canned Beans", quantity: 2 },
                { id: 2, name: "Rice", quantity: 1 }
            ],
            beneficiary: { id: 1, name: "Maria Gonzalez" },
            notes: "Family of 4"
        },
        {
            id: 2,
            date: "2023-06-22",
            items: [
                { id: 4, name: "Toothpaste", quantity: 1 }
            ],
            beneficiary: { id: 2, name: "James Wilson" },
            notes: "Single adult"
        },
        {
            id: 3,
            date: "2023-06-25",
            items: [
                { id: 1, name: "Canned Beans", quantity: 3 },
                { id: 2, name: "Rice", quantity: 2 },
                { id: 5, name: "Winter Coats", quantity: 1 }
            ],
            beneficiary: { id: 3, name: "The Peterson Family" },
            notes: "Family of 5, received coat for 8-year-old"
        }
    ];

    const beneficiaries = [
        {
            id: 1,
            name: "Maria Gonzalez",
            contact: "555-123-4567",
            address: "123 Main St, Apt 4B",
            household: 4,
            registered: "2023-01-15",
            notes: "Has 2 school-age children"
        },
        {
            id: 2,
            name: "James Wilson",
            contact: "555-234-5678",
            address: "456 Oak Ave",
            household: 1,
            registered: "2023-03-22",
            notes: "Elderly, limited mobility"
        },
        {
            id: 3,
            name: "The Peterson Family",
            contact: "555-345-6789",
            address: "789 Pine Rd",
            household: 5,
            registered: "2023-02-10",
            notes: "Both parents work part-time"
        }
    ];

    // DOM Elements
    const inventoryGrid = document.getElementById('inventory-grid');
    const emptyState = document.getElementById('empty-state');
    const addInventoryBtn = document.getElementById('add-inventory');
    const addInventoryEmptyBtn = document.getElementById('add-inventory-empty');
    const recordDistributionBtn = document.getElementById('record-distribution');
    const manageBeneficiariesBtn = document.getElementById('manage-beneficiaries');
    const exportReportBtn = document.getElementById('export-report');
    const filterCategory = document.getElementById('filter-category');
    const sortBy = document.getElementById('sort-by');
    const foodbankSearch = document.getElementById('foodbank-search');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const addInventoryModal = document.getElementById('add-inventory-modal');
    const closeAddInventoryBtn = document.getElementById('close-add-inventory');
    const cancelAddInventoryBtn = document.getElementById('cancel-add-inventory');
    const submitAddInventoryBtn = document.getElementById('submit-add-inventory');
    const recordDistributionModal = document.getElementById('record-distribution-modal');
    const closeRecordDistributionBtn = document.getElementById('close-record-distribution');
    const cancelRecordDistributionBtn = document.getElementById('cancel-record-distribution');
    const submitRecordDistributionBtn = document.getElementById('submit-record-distribution');
    const distributionItemsSelect = document.getElementById('distribution-items');
    const distributionBeneficiarySelect = document.getElementById('distribution-beneficiary');
    const distributionQuantitiesDiv = document.getElementById('distribution-quantities');
    const manageBeneficiariesModal = document.getElementById('manage-beneficiaries-modal');
    const closeManageBeneficiariesBtn = document.getElementById('close-manage-beneficiaries');
    const beneficiaryList = document.getElementById('beneficiary-list');
    const addNewBeneficiaryBtn = document.getElementById('add-new-beneficiary');
    const beneficiaryFormContainer = document.getElementById('beneficiary-form-container');
    const submitBeneficiaryBtn = document.getElementById('submit-beneficiary');
    const cancelBeneficiaryBtn = document.getElementById('cancel-beneficiary');
    const closeBeneficiariesModalBtn = document.getElementById('close-beneficiaries-modal');
    const beneficiaryForm = document.getElementById('beneficiary-form');
    const beneficiaryFormTitle = document.getElementById('beneficiary-form-title');

    // Stats elements
    const totalItemsEl = document.getElementById('total-items');
    const familiesServedEl = document.getElementById('families-served');
    const donationsReceivedEl = document.getElementById('donations-received');
    const expiringSoonEl = document.getElementById('expiring-soon');

    let currentTab = 'inventory';
    let currentInventory = [...inventoryItems];

    // Initialize the page
    renderInventory(currentInventory);
    updateEmptyState();
    updateDashboardStats();
    populateDistributionItems();
    populateBeneficiariesSelect();
    renderBeneficiaryList();

    // Event Listeners
    addInventoryBtn.addEventListener('click', openAddInventoryModal);
    addInventoryEmptyBtn.addEventListener('click', openAddInventoryModal);
    recordDistributionBtn.addEventListener('click', openRecordDistributionModal);
    manageBeneficiariesBtn.addEventListener('click', openManageBeneficiariesModal);
    exportReportBtn.addEventListener('click', exportReport);
    filterCategory.addEventListener('change', filterAndSortContent);
    sortBy.addEventListener('change', filterAndSortContent);
    foodbankSearch.addEventListener('input', filterAndSortContent);
    closeAddInventoryBtn.addEventListener('click', closeAddInventoryModal);
    cancelAddInventoryBtn.addEventListener('click', closeAddInventoryModal);
    closeRecordDistributionBtn.addEventListener('click', closeRecordDistributionModal);
    cancelRecordDistributionBtn.addEventListener('click', closeRecordDistributionModal);
    closeManageBeneficiariesBtn.addEventListener('click', closeManageBeneficiariesModal);
    closeBeneficiariesModalBtn.addEventListener('click', closeManageBeneficiariesModal);
    addNewBeneficiaryBtn.addEventListener('click', showAddBeneficiaryForm);
    cancelBeneficiaryBtn.addEventListener('click', hideBeneficiaryForm);

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentTab = this.dataset.tab;
            // In a real app, you would load different content based on the tab
            // For this example, we'll just show the inventory
            renderInventory(currentInventory);
            updateEmptyState();
        });
    });

    // Submit handlers
    submitAddInventoryBtn.addEventListener('click', submitAddInventoryForm);
    submitRecordDistributionBtn.addEventListener('click', submitRecordDistributionForm);
    submitBeneficiaryBtn.addEventListener('click', submitBeneficiaryForm);

    // Distribution items selection
    distributionItemsSelect.addEventListener('change', updateDistributionQuantities);

    // Functions
    function renderInventory(items) {
        inventoryGrid.innerHTML = '';

        if (currentTab !== 'inventory') {
            // In a real app, you would render different content for other tabs
            return;
        }

        items.forEach(item => {
            const inventoryItem = document.createElement('div');
            inventoryItem.className = 'inventory-item';

            // Check if item is expiring soon (within 7 days)
            const today = new Date();
            const expDate = item.expiration ? new Date(item.expiration) : null;
            const daysToExpire = expDate ? Math.floor((expDate - today) / (1000 * 60 * 60 * 24)) : null;

            if (daysToExpire !== null && daysToExpire <= 7) {
                inventoryItem.classList.add('expiring-soon');
            }

            // Check if item is low in stock (less than 25% remaining)
            const originalQuantity = item.quantity + (item.distributed || 0);
            const percentageRemaining = originalQuantity > 0 ? (item.quantity / originalQuantity) : 0;

            if (percentageRemaining < 0.25) {
                inventoryItem.classList.add('low-stock');
            }

            // Determine category class and display name
            let categoryClass, categoryDisplay;
            switch(item.category) {
                case 'perishable':
                    categoryClass = 'category-perishable';
                    categoryDisplay = 'Perishable';
                    break;
                case 'non-perishable':
                    categoryClass = 'category-non-perishable';
                    categoryDisplay = 'Non-Perishable';
                    break;
                case 'hygiene':
                    categoryClass = 'category-hygiene';
                    categoryDisplay = 'Hygiene';
                    break;
                case 'clothing':
                    categoryClass = 'category-clothing';
                    categoryDisplay = 'Clothing';
                    break;
                default:
                    categoryClass = 'category-perishable';
                    categoryDisplay = 'Other';
            }

            inventoryItem.innerHTML = `
                <div class="inventory-item-header">
                    <h3 class="inventory-item-name">${item.name}</h3>
                    <span class="inventory-item-category ${categoryClass}">${categoryDisplay}</span>
                </div>
                <p class="inventory-item-description">${item.description}</p>
                <div class="inventory-item-details">
                    <div class="detail-row">
                        <span class="detail-label">Quantity:</span>
                        <span class="detail-value">${item.quantity} ${item.unit}</span>
                    </div>
                    ${item.expiration ? `
                    <div class="detail-row">
                        <span class="detail-label">Expires:</span>
                        <span class="detail-value">${formatDate(item.expiration)}</span>
                    </div>` : ''}
                    <div class="detail-row">
                        <span class="detail-label">Received:</span>
                        <span class="detail-value">${formatDate(item.received)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Source:</span>
                        <span class="detail-value">${item.source || 'Unknown'}</span>
                    </div>
                </div>
                <div class="inventory-item-actions">
                    <button class="btn btn-small inventory-item-btn" data-id="${item.id}" data-action="edit">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-small inventory-item-btn" data-id="${item.id}" data-action="distribute">
                        <i class="fas fa-hand-holding-heart"></i> Distribute
                    </button>
                </div>
            `;

            inventoryGrid.appendChild(inventoryItem);
        });

        // Add event listeners to item buttons
        document.querySelectorAll('.inventory-item-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const action = this.dataset.action;
                const item = inventoryItems.find(item => item.id === id);

                if (item) {
                    if (action === 'edit') {
                        // In a real app, you would open an edit modal
                        alert(`Editing: ${item.name}`);
                    } else if (action === 'distribute') {
                        // Pre-select this item in the distribution modal
                        document.getElementById('distribution-items').value = id;
                        updateDistributionQuantities();
                        openRecordDistributionModal();
                    }
                }
            });
        });
    }

    function updateEmptyState() {
        if (currentInventory.length === 0 && currentTab === 'inventory') {
            emptyState.style.display = 'flex';
            inventoryGrid.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            inventoryGrid.style.display = 'grid';
        }
    }

    function updateDashboardStats() {
        // Total items in stock
        const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
        totalItemsEl.textContent = totalItems;

        // Families served this week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const recentDistributions = distributionLog.filter(dist => {
            const distDate = new Date(dist.date);
            return distDate >= oneWeekAgo;
        });
        const uniqueFamilies = [...new Set(recentDistributions.map(dist => dist.beneficiary.id))];
        familiesServedEl.textContent = uniqueFamilies.length;

        // Donations received this month
        const thisMonth = new Date().getMonth();
        const thisYear = new Date().getFullYear();
        const recentDonations = inventoryItems.filter(item => {
            const receivedDate = new Date(item.received);
            return receivedDate.getMonth() === thisMonth && receivedDate.getFullYear() === thisYear;
        });
        donationsReceivedEl.textContent = recentDonations.length;

        // Items expiring soon (next 7 days)
        const today = new Date();
        const expiringSoon = inventoryItems.filter(item => {
            if (!item.expiration) return false;
            const expDate = new Date(item.expiration);
            const daysToExpire = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
            return daysToExpire <= 7 && daysToExpire >= 0;
        });
        expiringSoonEl.textContent = expiringSoon.length;
    }

    function filterAndSortContent() {
        let filtered = [...inventoryItems];
        const searchTerm = foodbankSearch.value.toLowerCase();
        const categoryFilter = filterCategory.value;
        const sortValue = sortBy.value;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.source?.toLowerCase().includes(searchTerm)
            );
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(item => {
                if (categoryFilter === 'received') {
                    // In a real app, you might have a received date filter
                    return true;
                } else if (categoryFilter === 'distributed') {
                    return item.distributed > 0;
                } else {
                    return item.category === categoryFilter;
                }
            });
        }

        // Apply sorting
        switch (sortValue) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.received) - new Date(a.received));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.received) - new Date(b.received));
                break;
            case 'quantity-high':
                filtered.sort((a, b) => b.quantity - a.quantity);
                break;
            case 'quantity-low':
                filtered.sort((a, b) => a.quantity - b.quantity);
                break;
            case 'alphabetical':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        currentInventory = filtered;
        renderInventory(filtered);
        updateEmptyState();
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function openAddInventoryModal() {
        addInventoryModal.classList.add('show');
        document.getElementById('item-received').valueAsDate = new Date();
    }

    function closeAddInventoryModal() {
        addInventoryModal.classList.remove('show');
        document.getElementById('add-inventory-form').reset();
    }

    function submitAddInventoryForm(e) {
        e.preventDefault();
        const name = document.getElementById('item-name').value;
        const description = document.getElementById('item-description').value;
        const category = document.getElementById('item-category').value;
        const quantity = parseInt(document.getElementById('item-quantity').value);
        const unit = document.getElementById('item-unit').value;
        const expiration = document.getElementById('item-expiration').value;
        const received = document.getElementById('item-received').value;
        const source = document.getElementById('item-source').value;

        if (!name || !category || !quantity || !received) {
            alert('Please fill in all required fields');
            return;
        }

        const newItem = {
            id: inventoryItems.length + 1,
            name,
            description,
            category,
            quantity,
            unit,
            expiration: expiration || null,
            received,
            source: source || 'Unknown',
            distributed: 0
        };

        inventoryItems.unshift(newItem);
        currentInventory.unshift(newItem);

        renderInventory(currentInventory);
        updateEmptyState();
        updateDashboardStats();
        closeAddInventoryModal();

        alert(`${name} added to inventory successfully!`);
    }

    function openRecordDistributionModal() {
        recordDistributionModal.classList.add('show');
        document.getElementById('distribution-date').valueAsDate = new Date();
    }

    function closeRecordDistributionModal() {
        recordDistributionModal.classList.remove('show');
        document.getElementById('record-distribution-form').reset();
        distributionQuantitiesDiv.innerHTML = '';
    }

    function populateDistributionItems() {
        distributionItemsSelect.innerHTML = '';

        inventoryItems.forEach(item => {
            if (item.quantity > 0) {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = `${item.name} (${item.quantity} ${item.unit} available)`;
                distributionItemsSelect.appendChild(option);
            }
        });
    }

    function populateBeneficiariesSelect() {
        distributionBeneficiarySelect.innerHTML = '<option value="">Select beneficiary</option>';

        beneficiaries.forEach(beneficiary => {
            const option = document.createElement('option');
            option.value = beneficiary.id;
            option.textContent = `${beneficiary.name} (Household: ${beneficiary.household})`;
            distributionBeneficiarySelect.appendChild(option);
        });
    }

    function updateDistributionQuantities() {
        distributionQuantitiesDiv.innerHTML = '';
        const selectedItems = Array.from(distributionItemsSelect.selectedOptions);

        selectedItems.forEach(option => {
            const itemId = parseInt(option.value);
            const item = inventoryItems.find(item => item.id === itemId);

            if (item) {
                const quantityDiv = document.createElement('div');
                quantityDiv.className = 'form-group';
                quantityDiv.innerHTML = `
                    <label for="quantity-${item.id}">${item.name} (Max: ${item.quantity})</label>
                    <input type="number" id="quantity-${item.id}" min="1" max="${item.quantity}" value="1" required>
                `;
                distributionQuantitiesDiv.appendChild(quantityDiv);
            }
        });
    }

    function submitRecordDistributionForm(e) {
        e.preventDefault();
        const selectedItems = Array.from(distributionItemsSelect.selectedOptions);
        const beneficiaryId = parseInt(distributionBeneficiarySelect.value);
        const date = document.getElementById('distribution-date').value;
        const notes = document.getElementById('distribution-notes').value;

        if (selectedItems.length === 0 || !beneficiaryId || !date) {
            alert('Please select at least one item and a beneficiary');
            return;
        }

        const beneficiary = beneficiaries.find(b => b.id === beneficiaryId);
        if (!beneficiary) {
            alert('Invalid beneficiary selected');
            return;
        }

        const distributedItems = [];
        let allQuantitiesValid = true;

        selectedItems.forEach(option => {
            const itemId = parseInt(option.value);
            const item = inventoryItems.find(item => item.id === itemId);

            if (item) {
                const quantityInput = document.getElementById(`quantity-${item.id}`);
                const quantity = parseInt(quantityInput.value);

                if (quantity > item.quantity) {
                    alert(`Cannot distribute ${quantity} ${item.unit} of ${item.name} - only ${item.quantity} available`);
                    allQuantitiesValid = false;
                    return;
                }

                distributedItems.push({
                    id: item.id,
                    name: item.name,
                    quantity: quantity
                });
            }
        });

        if (!allQuantitiesValid) return;

        // Update inventory quantities
        distributedItems.forEach(distItem => {
            const inventoryItem = inventoryItems.find(item => item.id === distItem.id);
            if (inventoryItem) {
                inventoryItem.quantity -= distItem.quantity;
                inventoryItem.distributed = (inventoryItem.distributed || 0) + distItem.quantity;
            }
        });

        // Add to distribution log
        const newDistribution = {
            id: distributionLog.length + 1,
            date,
            items: distributedItems,
            beneficiary: {
                id: beneficiary.id,
                name: beneficiary.name
            },
            notes
        };

        distributionLog.unshift(newDistribution);

        // Update UI
        renderInventory(currentInventory);
        updateDashboardStats();
        populateDistributionItems();
        closeRecordDistributionModal();

        alert('Distribution recorded successfully!');
    }

    function openManageBeneficiariesModal() {
        manageBeneficiariesModal.classList.add('show');
        hideBeneficiaryForm();
    }

    function closeManageBeneficiariesModal() {
        manageBeneficiariesModal.classList.remove('show');
        hideBeneficiaryForm();
        beneficiaryForm.reset();
    }

    function renderBeneficiaryList() {
        beneficiaryList.innerHTML = '';

        beneficiaries.forEach(beneficiary => {
            const beneficiaryItem = document.createElement('div');
            beneficiaryItem.className = 'beneficiary-item';
            beneficiaryItem.dataset.id = beneficiary.id;

            beneficiaryItem.innerHTML = `
                <div class="beneficiary-info">
                    <h5>${beneficiary.name}</h5>
                    <p>Household: ${beneficiary.household} | Registered: ${formatDate(beneficiary.registered)}</p>
                </div>
                <div class="beneficiary-actions">
                    <button class="btn-icon" data-action="edit" data-id="${beneficiary.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon" data-action="delete" data-id="${beneficiary.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            beneficiaryList.appendChild(beneficiaryItem);
        });

        // Add event listeners to beneficiary actions
        document.querySelectorAll('.beneficiary-item .btn-icon').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const id = parseInt(this.dataset.id);
                const action = this.dataset.action;
                const beneficiary = beneficiaries.find(b => b.id === id);

                if (beneficiary) {
                    if (action === 'edit') {
                        showEditBeneficiaryForm(beneficiary);
                    } else if (action === 'delete') {
                        if (confirm(`Are you sure you want to delete ${beneficiary.name}?`)) {
                            // In a real app, you would remove from the array and update the database
                            alert(`${beneficiary.name} would be deleted in a real app`);
                        }
                    }
                }
            });
        });

        // Add click event to view beneficiary details
        document.querySelectorAll('.beneficiary-item').forEach(item => {
            item.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const beneficiary = beneficiaries.find(b => b.id === id);
                if (beneficiary) {
                    showBeneficiaryDetails(beneficiary);
                }
            });
        });
    }

    function showAddBeneficiaryForm() {
        beneficiaryFormTitle.textContent = 'Add New Beneficiary';
        beneficiaryForm.reset();
        document.getElementById('beneficiary-id').value = '';
        document.getElementById('beneficiary-registered').valueAsDate = new Date();

        beneficiaryFormContainer.style.display = 'block';
        submitBeneficiaryBtn.style.display = 'block';
        cancelBeneficiaryBtn.style.display = 'block';
        closeBeneficiariesModalBtn.style.display = 'none';

        // Scroll to form
        beneficiaryFormContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function showEditBeneficiaryForm(beneficiary) {
        beneficiaryFormTitle.textContent = 'Edit Beneficiary';

        // Fill form with beneficiary data
        document.getElementById('beneficiary-id').value = beneficiary.id;
        document.getElementById('beneficiary-name').value = beneficiary.name;
        document.getElementById('beneficiary-contact').value = beneficiary.contact || '';
        document.getElementById('beneficiary-address').value = beneficiary.address || '';
        document.getElementById('beneficiary-household').value = beneficiary.household;
        document.getElementById('beneficiary-registered').value = beneficiary.registered;
        document.getElementById('beneficiary-notes').value = beneficiary.notes || '';

        beneficiaryFormContainer.style.display = 'block';
        submitBeneficiaryBtn.style.display = 'block';
        cancelBeneficiaryBtn.style.display = 'block';
        closeBeneficiariesModalBtn.style.display = 'none';

        // Scroll to form
        beneficiaryFormContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function showBeneficiaryDetails(beneficiary) {
        beneficiaryFormTitle.textContent = 'Beneficiary Details';

        // Fill form with beneficiary data (readonly)
        document.getElementById('beneficiary-name').value = beneficiary.name;
        document.getElementById('beneficiary-contact').value = beneficiary.contact || '';
        document.getElementById('beneficiary-address').value = beneficiary.address || '';
        document.getElementById('beneficiary-household').value = beneficiary.household;
        document.getElementById('beneficiary-registered').value = beneficiary.registered;
        document.getElementById('beneficiary-notes').value = beneficiary.notes || '';

        // Make all fields readonly
        const inputs = beneficiaryForm.querySelectorAll('input, textarea');
        inputs.forEach(input => input.readOnly = true);

        beneficiaryFormContainer.style.display = 'block';
        submitBeneficiaryBtn.style.display = 'none';
        cancelBeneficiaryBtn.style.display = 'none';
        closeBeneficiariesModalBtn.style.display = 'block';

        // Scroll to form
        beneficiaryFormContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function hideBeneficiaryForm() {
        beneficiaryFormContainer.style.display = 'none';
        submitBeneficiaryBtn.style.display = 'none';
        cancelBeneficiaryBtn.style.display = 'none';
        closeBeneficiariesModalBtn.style.display = 'block';

        // Reset readonly state
        const inputs = beneficiaryForm.querySelectorAll('input, textarea');
        inputs.forEach(input => input.readOnly = false);
    }

    function submitBeneficiaryForm(e) {
        e.preventDefault();
        const id = document.getElementById('beneficiary-id').value;
        const name = document.getElementById('beneficiary-name').value;
        const contact = document.getElementById('beneficiary-contact').value;
        const address = document.getElementById('beneficiary-address').value;
        const household = parseInt(document.getElementById('beneficiary-household').value);
        const registered = document.getElementById('beneficiary-registered').value;
        const notes = document.getElementById('beneficiary-notes').value;

        if (!name || !household || !registered) {
            alert('Please fill in all required fields');
            return;
        }

        if (id) {
            // Editing existing beneficiary
            const beneficiary = beneficiaries.find(b => b.id === parseInt(id));
            if (beneficiary) {
                beneficiary.name = name;
                beneficiary.contact = contact;
                beneficiary.address = address;
                beneficiary.household = household;
                beneficiary.registered = registered;
                beneficiary.notes = notes;

                alert(`${name} updated successfully!`);
            }
        } else {
            // Adding new beneficiary
            const newBeneficiary = {
                id: beneficiaries.length + 1,
                name,
                contact,
                address,
                household,
                registered,
                notes
            };

            beneficiaries.unshift(newBeneficiary);
            alert(`${name} added as a beneficiary successfully!`);
        }

        // Update UI
        renderBeneficiaryList();
        populateBeneficiariesSelect();
        hideBeneficiaryForm();
        beneficiaryForm.reset();
    }

    function exportReport() {
        alert('Exporting food bank report...');
        // In a real app, this would generate and download a report
    }
});