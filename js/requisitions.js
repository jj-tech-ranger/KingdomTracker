document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts
    initRequisitionStatusChart();
    initRequisitionMinistryChart();

    // Set up event listeners
    setupRequisitionEventListeners();

    // Load any saved theme preference
    loadThemePreference();
});

function setupRequisitionEventListeners() {
    // Create Requisition Button
    document.getElementById('createRequisitionBtn')?.addEventListener('click', function() {
        openRequisitionModal();
    });

    // Close Modal Buttons
    document.querySelectorAll('.close-modal, .close-detail-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.dataset.filter;
            filterRequisitions(filter);
        });
    });

    // Add Item Button
    document.getElementById('addItemBtn')?.addEventListener('click', addNewItemRow);

    // Form submission
    document.getElementById('requisitionForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        submitRequisition();
    });

    // Save Draft Button
    document.getElementById('saveDraftBtn')?.addEventListener('click', function() {
        saveRequisitionAsDraft();
    });

    // View buttons in table
    document.querySelectorAll('.action-btn.view').forEach(btn => {
        btn.addEventListener('click', function() {
            const reqId = this.closest('tr').querySelector('td:first-child').textContent;
            viewRequisitionDetails(reqId);
        });
    });

    // Edit buttons in table
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const reqId = this.closest('tr').querySelector('td:first-child').textContent;
            editRequisition(reqId);
        });
    });

    // Submit buttons in table
    document.querySelectorAll('.action-btn.submit').forEach(btn => {
        btn.addEventListener('click', function() {
            const reqId = this.closest('tr').querySelector('td:first-child').textContent;
            submitExistingRequisition(reqId);
        });
    });

    // Convert to PO buttons
    document.querySelectorAll('.action-btn.convert').forEach(btn => {
        btn.addEventListener('click', function() {
            const reqId = this.closest('tr').querySelector('td:first-child').textContent;
            convertToPurchaseOrder(reqId);
        });
    });

    // Calculate item totals when prices or quantities change
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('item-price') || e.target.classList.contains('item-quantity')) {
            calculateItemTotal(e.target.closest('.item-row'));
        }
    });
}

function initRequisitionStatusChart() {
    const ctx = document.getElementById('requisitionStatusChart').getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Draft', 'Submitted', 'Pending', 'Approved', 'Rejected'],
            datasets: [{
                label: 'Requisitions by Status',
                data: [8, 5, 12, 15, 3],
                backgroundColor: [
                    'rgba(108, 117, 125, 0.7)',
                    'rgba(23, 162, 184, 0.7)',
                    'rgba(255, 193, 7, 0.7)',
                    'rgba(40, 167, 69, 0.7)',
                    'rgba(220, 53, 69, 0.7)'
                ],
                borderColor: [
                    'rgba(108, 117, 125, 1)',
                    'rgba(23, 162, 184, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(40, 167, 69, 1)',
                    'rgba(220, 53, 69, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.raw} requisitions`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function initRequisitionMinistryChart() {
    const ctx = document.getElementById('requisitionMinistryChart').getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Administration', 'Worship', 'Technology', 'Children', 'Outreach', 'Facilities'],
            datasets: [{
                data: [25, 15, 20, 10, 12, 18],
                backgroundColor: [
                    'rgba(252, 1, 0, 0.7)',
                    'rgba(253, 126, 20, 0.7)',
                    'rgba(23, 162, 184, 0.7)',
                    'rgba(40, 167, 69, 0.7)',
                    'rgba(98, 39, 37, 0.7)',
                    'rgba(108, 117, 125, 0.7)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
                            const percentage = Math.round((context.raw / total) * 100);
                            return `${context.label}: ${context.raw} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function openRequisitionModal() {
    document.getElementById('requisitionModal').style.display = 'block';
    // Initialize date picker
    flatpickr('#requiredByDate', {
        minDate: 'today',
        dateFormat: 'Y-m-d'
    });
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function filterRequisitions(filter) {
    const rows = document.querySelectorAll('#requisitionsTable tbody tr');

    rows.forEach(row => {
        if (filter === 'all' || row.dataset.status === filter) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function addNewItemRow() {
    const container = document.getElementById('itemsContainer');
    const newItemRow = document.createElement('div');
    newItemRow.className = 'item-row';
    newItemRow.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Description</label>
                <input type="text" class="item-description" required>
            </div>
            <div class="form-group">
                <label>Quantity</label>
                <input type="number" class="item-quantity" min="1" required>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Unit Price</label>
                <input type="number" class="item-price" min="0" step="0.01" required>
            </div>
            <div class="form-group">
                <label>Total</label>
                <input type="text" class="item-total" readonly>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label>Preferred Vendor</label>
                <input type="text" class="item-vendor">
            </div>
            <div class="form-group">
                <label>Budget Code</label>
                <select class="item-budget">
                    <option value="">Select Budget</option>
                    <option value="OPER-100">OPER-100 (Operations)</option>
                    <option value="MISC-200">MISC-200 (Miscellaneous)</option>
                    <option value="TECH-300">TECH-300 (Technology)</option>
                    <option value="FACI-400">FACI-400 (Facilities)</option>
                    <option value="EVNT-500">EVNT-500 (Events)</option>
                </select>
            </div>
        </div>
        <button type="button" class="remove-item-btn"><i class="fas fa-trash"></i> Remove Item</button>
    `;

    container.appendChild(newItemRow);

    // Add event listener to the new remove button
    newItemRow.querySelector('.remove-item-btn').addEventListener('click', function() {
        container.removeChild(newItemRow);
    });
}

function calculateItemTotal(itemRow) {
    const quantity = parseFloat(itemRow.querySelector('.item-quantity').value) || 0;
    const price = parseFloat(itemRow.querySelector('.item-price').value) || 0;
    const total = quantity * price;

    itemRow.querySelector('.item-total').value = total.toFixed(2);
}

function submitRequisition() {
    // In a real application, this would submit to a server
    alert('Requisition submitted successfully!');
    closeAllModals();
    // Refresh the table or add the new requisition to it
}

function saveRequisitionAsDraft() {
    // In a real application, this would save to local storage or a server
    alert('Requisition saved as draft.');
    closeAllModals();
}

function viewRequisitionDetails(reqId) {
    // In a real application, this would fetch details from a server
    // For now, we'll just populate with sample data
    document.getElementById('detailReqId').textContent = reqId;

    // Sample data - in a real app this would come from an API
    const sampleData = {
        status: reqId === 'REQ-2023-1142' ? 'approved' : reqId === 'REQ-2023-1141' ? 'pending' : 'draft',
        submittedDate: '2023-11-15',
        requester: 'John Doe (Administration)',
        totalAmount: '$1,250.00',
        items: [
            { description: 'Office Chairs', quantity: 5, unitPrice: 150.00, total: 750.00, budgetCode: 'OPER-100', vendor: 'Office Supplies Inc.' },
            { description: 'Desk Organizers', quantity: 10, unitPrice: 25.00, total: 250.00, budgetCode: 'OPER-100', vendor: 'Office Supplies Inc.' },
            { description: 'Printer Paper', quantity: 5, unitPrice: 50.00, total: 250.00, budgetCode: 'OPER-100', vendor: 'Office Supplies Inc.' }
        ],
        justification: 'Regular restocking of office supplies for the administration department.',
        requiredBy: '2023-11-30',
        priority: 'Medium',
        attachments: ['Quote_OfficeSupplies.pdf']
    };

    // Populate the details
    document.getElementById('detailStatus').className = `status ${sampleData.status}`;
    document.getElementById('detailStatus').textContent = sampleData.status.charAt(0).toUpperCase() + sampleData.status.slice(1);
    document.getElementById('detailSubmittedDate').textContent = sampleData.submittedDate;
    document.getElementById('detailRequester').textContent = sampleData.requester;
    document.getElementById('detailTotalAmount').textContent = sampleData.totalAmount;

    // Populate items
    const itemsBody = document.getElementById('detailItemsBody');
    itemsBody.innerHTML = '';
    sampleData.items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.description}</td>
            <td>${item.quantity}</td>
            <td>$${item.unitPrice.toFixed(2)}</td>
            <td>$${item.total.toFixed(2)}</td>
            <td>${item.budgetCode}</td>
            <td>${item.vendor}</td>
        `;
        itemsBody.appendChild(row);
    });

    // Populate additional info
    document.getElementById('detailJustification').textContent = sampleData.justification;
    document.getElementById('detailRequiredBy').textContent = sampleData.requiredBy;
    document.getElementById('detailPriority').textContent = sampleData.priority;

    // Populate attachments
    const attachmentsContainer = document.getElementById('detailAttachments');
    attachmentsContainer.innerHTML = '';
    sampleData.attachments.forEach(file => {
        const link = document.createElement('a');
        link.href = '#';
        link.className = 'attachment-link';
        link.innerHTML = `<i class="fas fa-file-pdf"></i> ${file}`;
        attachmentsContainer.appendChild(link);
    });

    // Show the modal
    document.getElementById('requisitionDetailModal').style.display = 'block';
}

function editRequisition(reqId) {
    // In a real application, this would fetch the requisition and populate the form
    alert(`Editing requisition ${reqId}`);
    openRequisitionModal();
}

function submitExistingRequisition(reqId) {
    // In a real application, this would submit to a server
    alert(`Submitting requisition ${reqId} for approval`);
}

function convertToPurchaseOrder(reqId) {
    // In a real application, this would redirect to the PO creation page with the requisition data
    alert(`Converting requisition ${reqId} to purchase order`);
    closeAllModals();
}

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        closeAllModals();
    }
});