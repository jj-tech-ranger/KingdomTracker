document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Modal Handling
    const modal = document.getElementById('itemModal');
    const restockModal = document.getElementById('restockModal');
    const addItemBtn = document.getElementById('addItemBtn');
    const closeBtns = document.querySelectorAll('.close-btn');
    const cancelBtns = document.querySelectorAll('.cancel-btn');
    const itemForm = document.getElementById('itemForm');
    const restockForm = document.getElementById('restockForm');

    // Add Item Button Click
    addItemBtn.addEventListener('click', function() {
        document.getElementById('modalTitle').textContent = 'Add New Inventory Item';
        itemForm.reset();
        modal.style.display = 'block';
    });

    // Close Modal Buttons
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.style.display = 'none';
            restockModal.style.display = 'none';
        });
    });

    // Cancel Buttons
    cancelBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            modal.style.display = 'none';
            restockModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === restockModal) {
            restockModal.style.display = 'none';
        }
    });

    // Form Submission
    itemForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically send data to server
        alert('Item saved successfully!');
        modal.style.display = 'none';
    });

    restockForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Here you would typically send data to server
        alert('Item restocked successfully!');
        restockModal.style.display = 'none';
    });

    // Action Buttons in Table
    document.querySelectorAll('.action-btn.view').forEach(btn => {
        btn.addEventListener('click', function() {
            // In a real app, this would show detailed view
            alert('View item details');
        });
    });

    document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = btn.closest('tr');
            // In a real app, you would populate the form with row data
            document.getElementById('modalTitle').textContent = 'Edit Inventory Item';
            modal.style.display = 'block';
        });
    });

    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this item?')) {
                // In a real app, you would send delete request
                btn.closest('tr').remove();
                alert('Item deleted successfully!');
            }
        });
    });

    document.querySelectorAll('.action-btn.restock').forEach(btn => {
        btn.addEventListener('click', function() {
            // In a real app, you would populate with item data
            restockModal.style.display = 'block';
        });
    });

    // Search Functionality
    const inventorySearch = document.getElementById('inventorySearch');
    inventorySearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#inventoryTable tbody tr');

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    });

    // Filter Functionality
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');

    [categoryFilter, statusFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
    });

    function applyFilters() {
        const categoryValue = categoryFilter.value;
        const statusValue = statusFilter.value;
        const rows = document.querySelectorAll('#inventoryTable tbody tr');

        rows.forEach(row => {
            const rowCategory = row.cells[2].textContent;
            const rowStatus = row.cells[6].textContent.trim();

            const categoryMatch = !categoryValue || rowCategory === categoryValue;
            const statusMatch = !statusValue || rowStatus.includes(statusValue);

            row.style.display = categoryMatch && statusMatch ? '' : 'none';
        });
    }

    // Sort Functionality
    const tableHeaders = document.querySelectorAll('#inventoryTable thead th');
    tableHeaders.forEach((header, index) => {
        if (index !== tableHeaders.length - 1) { // Skip actions column
            header.addEventListener('click', function() {
                sortTable(index);
            });
        }
    });

    function sortTable(columnIndex) {
        const table = document.getElementById('inventoryTable');
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));

        rows.sort((a, b) => {
            const aValue = a.cells[columnIndex].textContent;
            const bValue = b.cells[columnIndex].textContent;

            // Check if values are numeric
            if (!isNaN(aValue))
            {
                return aValue - bValue;
            }
            return aValue.localeCompare(bValue);
        });

        // Clear and re-add sorted rows
        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
    }

    // Load theme preference
    loadThemePreference();
});

// Theme Management (reused from inventory.js)
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function loadThemePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}