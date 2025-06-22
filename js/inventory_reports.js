document.addEventListener('DOMContentLoaded', function() {
    // Sample data for demonstration
    const sampleData = {
        inventoryItems: [
            { code: 'ITM-0042', name: 'Wireless Mouse', category: 'IT Equipment', currentStock: 3, reorderLevel: 10, unitCost: 25.99 },
            { code: 'ITM-0087', name: 'A4 Printer Paper', category: 'Office Supplies', currentStock: 5, reorderLevel: 20, unitCost: 8.50 },
            { code: 'ITM-0123', name: 'Desk Chair', category: 'Furniture', currentStock: 12, reorderLevel: 5, unitCost: 149.99 },
            { code: 'ITM-0156', name: 'Projector', category: 'IT Equipment', currentStock: 7, reorderLevel: 3, unitCost: 499.99 },
            { code: 'ITM-0189', name: 'Whiteboard Markers', category: 'Office Supplies', currentStock: 25, reorderLevel: 30, unitCost: 2.99 },
            { code: 'ITM-0221', name: 'Monitor', category: 'IT Equipment', currentStock: 9, reorderLevel: 5, unitCost: 199.99 },
            { code: 'ITM-0254', name: 'Desk', category: 'Furniture', currentStock: 15, reorderLevel: 8, unitCost: 249.99 },
            { code: 'ITM-0287', name: 'Notebooks', category: 'Office Supplies', currentStock: 42, reorderLevel: 50, unitCost: 3.50 },
            { code: 'ITM-0320', name: 'Keyboard', category: 'IT Equipment', currentStock: 6, reorderLevel: 5, unitCost: 45.99 },
            { code: 'ITM-0353', name: 'Filing Cabinet', category: 'Furniture', currentStock: 8, reorderLevel: 4, unitCost: 129.99 }
        ],
        movements: [
            { id: 'MOV-2023-001', date: '2023-06-15 09:30', type: 'receipt', itemCode: 'ITM-0042', quantity: 50, fromLocation: 'Supplier A', toLocation: 'Main Warehouse', initiatedBy: 'John Doe' },
            { id: 'MOV-2023-002', date: '2023-06-16 14:15', type: 'issue', itemCode: 'ITM-0042', quantity: 5, fromLocation: 'Main Warehouse', toLocation: 'IT Department', initiatedBy: 'Jane Smith' },
            { id: 'MOV-2023-003', date: '2023-06-17 11:00', type: 'transfer', itemCode: 'ITM-0087', quantity: 10, fromLocation: 'Main Warehouse', toLocation: 'Office Storage', initiatedBy: 'Mike Johnson' },
            { id: 'MOV-2023-004', date: '2023-06-18 16:45', type: 'adjustment', itemCode: 'ITM-0042', quantity: -2, fromLocation: 'Main Warehouse', toLocation: 'Main Warehouse', initiatedBy: 'John Doe' },
            { id: 'MOV-2023-005', date: '2023-06-19 10:20', type: 'issue', itemCode: 'ITM-0087', quantity: 3, fromLocation: 'Office Storage', toLocation: 'Meeting Room', initiatedBy: 'Sarah Williams' },
            { id: 'MOV-2023-006', date: '2023-05-20 13:45', type: 'receipt', itemCode: 'ITM-0156', quantity: 5, fromLocation: 'Supplier B', toLocation: 'Main Warehouse', initiatedBy: 'John Doe' },
            { id: 'MOV-2023-007', date: '2023-05-22 09:15', type: 'issue', itemCode: 'ITM-0156', quantity: 2, fromLocation: 'Main Warehouse', toLocation: 'IT Department', initiatedBy: 'Jane Smith' },
            { id: 'MOV-2023-008', date: '2023-04-10 11:30', type: 'receipt', itemCode: 'ITM-0123', quantity: 15, fromLocation: 'Supplier C', toLocation: 'Main Warehouse', initiatedBy: 'Mike Johnson' },
            { id: 'MOV-2023-009', date: '2023-04-12 14:00', type: 'transfer', itemCode: 'ITM-0123', quantity: 3, fromLocation: 'Main Warehouse', toLocation: 'Office Area', initiatedBy: 'Sarah Williams' },
            { id: 'MOV-2023-010', date: '2023-03-05 16:20', type: 'adjustment', itemCode: 'ITM-0189', quantity: -5, fromLocation: 'Office Storage', toLocation: 'Office Storage', initiatedBy: 'John Doe' }
        ],
        equipment: [
            { id: 'EQP-001', name: 'Laptop Dell XPS', category: 'IT Equipment', assignedTo: 'John Doe', lastUsed: '2023-06-20', utilization: 85, status: 'In Use' },
            { id: 'EQP-002', name: 'Projector Epson', category: 'IT Equipment', assignedTo: 'Meeting Room', lastUsed: '2023-06-18', utilization: 45, status: 'Available' },
            { id: 'EQP-003', name: 'Printer HP', category: 'IT Equipment', assignedTo: 'Office', lastUsed: '2023-06-19', utilization: 60, status: 'In Use' },
            { id: 'EQP-004', name: 'Conference Phone', category: 'IT Equipment', assignedTo: 'Meeting Room', lastUsed: '2023-06-15', utilization: 30, status: 'Available' },
            { id: 'EQP-005', name: 'Desktop PC', category: 'IT Equipment', assignedTo: 'Jane Smith', lastUsed: '2023-06-20', utilization: 90, status: 'In Use' }
        ]
    };

    // DOM elements
    const tabButtons = document.querySelectorAll('.tab-button');
    const reportDateRange = document.getElementById('reportDateRange');
    const applyReportFilters = document.getElementById('applyReportFilters');
    const resetReportFilters = document.getElementById('resetReportFilters');
    const movementTrendChartCtx = document.getElementById('movementTrendChart').getContext('2d');
    const categoryDistributionChartCtx = document.getElementById('categoryDistributionChart').getContext('2d');
    const stockStatusChartCtx = document.getElementById('stockStatusChart').getContext('2d');
    const topMovedChartCtx = document.getElementById('topMovedChart').getContext('2d');
    const inventoryLevelsTable = document.getElementById('inventoryLevelsTable').querySelector('tbody');
    const lowStockTable = document.getElementById('lowStockTable').querySelector('tbody');
    const stockAgingTable = document.getElementById('stockAgingTable').querySelector('tbody');
    const movementHistoryTable = document.getElementById('movementHistoryTable').querySelector('tbody');
    const valuationTable = document.getElementById('valuationTable').querySelector('tbody');
    const performanceTable = document.getElementById('performanceTable').querySelector('tbody');
    const equipmentTable = document.getElementById('equipmentTable').querySelector('tbody');

    // Initialize date range picker
    flatpickr(reportDateRange, {
        mode: 'range',
        dateFormat: 'Y-m-d',
        allowInput: true
    });

    // Tab switching functionality
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Show corresponding content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');

            // Initialize charts for the active tab if needed
            if (tabId === 'dashboard') {
                initDashboardCharts();
            } else if (tabId === 'movements') {
                initMovementCharts();
            } else if (tabId === 'valuation') {
                initValuationCharts();
            } else if (tabId === 'performance') {
                initPerformanceCharts();
            } else if (tabId === 'equipment') {
                initEquipmentCharts();
            }
        });
    });

    // Initialize dashboard charts
    function initDashboardCharts() {
        // Movement Trend Chart
        new Chart(movementTrendChartCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Items Received',
                        data: [120, 95, 150, 110, 135, 160],
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        borderWidth: 2,
                        tension: 0.3
                    },
                    {
                        label: 'Items Issued',
                        data: [85, 110, 95, 120, 105, 130],
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        borderWidth: 2,
                        tension: 0.3
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0
                        }
                    }
                }
            }
        });

        // Category Distribution Chart
        new Chart(categoryDistributionChartCtx, {
            type: 'doughnut',
            data: {
                labels: ['IT Equipment', 'Office Supplies', 'Furniture', 'Facility Items', 'Other'],
                datasets: [{
                    data: [45, 30, 15, 8, 2],
                    backgroundColor: [
                        '#28a745',
                        '#17a2b8',
                        '#fd7e14',
                        '#6c757d',
                        '#6610f2'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });

        // Stock Status Chart
        new Chart(stockStatusChartCtx, {
            type: 'bar',
            data: {
                labels: ['In Stock', 'Low Stock', 'Out of Stock'],
                datasets: [{
                    label: 'Items',
                    data: [85, 36, 12],
                    backgroundColor: [
                        'rgba(40, 167, 69, 0.7)',
                        'rgba(255, 193, 7, 0.7)',
                        'rgba(220, 53, 69, 0.7)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Top Moved Items Chart
        new Chart(topMovedChartCtx, {
            type: 'bar',
            data: {
                labels: ['Wireless Mouse', 'A4 Paper', 'Projector', 'Desk Chair', 'Notebooks'],
                datasets: [{
                    label: 'Items Moved',
                    data: [120, 95, 65, 45, 40],
                    backgroundColor: 'rgba(252, 1, 0, 0.7)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Populate inventory levels table
        renderInventoryLevelsTable();
        renderLowStockTable();
        renderStockAgingTable();
    }

    // Initialize movement charts
    function initMovementCharts() {
        // Monthly Movement Chart
        new Chart(document.getElementById('monthlyMovementChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Receipts',
                        data: [25, 20, 30, 22, 28, 35],
                        backgroundColor: 'rgba(40, 167, 69, 0.7)',
                        borderWidth: 1
                    },
                    {
                        label: 'Issues',
                        data: [18, 22, 25, 20, 24, 30],
                        backgroundColor: 'rgba(220, 53, 69, 0.7)',
                        borderWidth: 1
                    },
                    {
                        label: 'Transfers',
                        data: [12, 15, 10, 18, 14, 20],
                        backgroundColor: 'rgba(23, 162, 184, 0.7)',
                        borderWidth: 1
                    },
                    {
                        label: 'Adjustments',
                        data: [5, 8, 6, 4, 7, 10],
                        backgroundColor: 'rgba(255, 193, 7, 0.7)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Movement by Category Chart
        new Chart(document.getElementById('categoryMovementChart').getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['IT Equipment', 'Office Supplies', 'Furniture', 'Other'],
                datasets: [{
                    data: [55, 30, 12, 3],
                    backgroundColor: [
                        '#28a745',
                        '#17a2b8',
                        '#fd7e14',
                        '#6c757d'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });

        // Populate movement history table
        renderMovementHistoryTable();
    }

    // Initialize valuation charts
    function initValuationCharts() {
        // Value Trend Chart
        new Chart(document.getElementById('valueTrendChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Inventory Value',
                    data: [75000, 78000, 82000, 80000, 83000, 84750],
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });

        // Value by Category Chart
        new Chart(document.getElementById('valueByCategoryChart').getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['IT Equipment', 'Office Supplies', 'Furniture', 'Other'],
                datasets: [{
                    data: [45000, 15000, 22000, 2750],
                    backgroundColor: [
                        '#28a745',
                        '#17a2b8',
                        '#fd7e14',
                        '#6c757d'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += '$' + context.raw.toLocaleString();
                                return label;
                            }
                        }
                    }
                }
            }
        });

        // Populate valuation table
        renderValuationTable();
    }

    // Initialize performance charts
    function initPerformanceCharts() {
        // Turnover by Category Chart
        new Chart(document.getElementById('turnoverChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['IT Equipment', 'Office Supplies', 'Furniture', 'Other'],
                datasets: [{
                    label: 'Turnover Ratio',
                    data: [4.2, 3.5, 2.1, 1.8],
                    backgroundColor: 'rgba(252, 1, 0, 0.7)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Stockout Frequency Chart
        new Chart(document.getElementById('stockoutChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Stockout Events',
                    data: [5, 3, 7, 4, 2, 6],
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Populate performance table
        renderPerformanceTable();
    }

    // Initialize equipment charts
    function initEquipmentCharts() {
        // Equipment Status Chart
        new Chart(document.getElementById('equipmentStatusChart').getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['In Use', 'Available', 'Maintenance', 'Retired'],
                datasets: [{
                    data: [65, 25, 8, 2],
                    backgroundColor: [
                        '#28a745',
                        '#17a2b8',
                        '#ffc107',
                        '#dc3545'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                    }
                }
            }
        });

        // Maintenance History Chart
        new Chart(document.getElementById('maintenanceChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Maintenance Events',
                    data: [3, 5, 2, 4, 6, 3],
                    backgroundColor: 'rgba(255, 193, 7, 0.7)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Populate equipment table
        renderEquipmentTable();
    }

    // Table rendering functions
    function renderInventoryLevelsTable() {
        inventoryLevelsTable.innerHTML = '';

        sampleData.inventoryItems.forEach(item => {
            const status = item.currentStock <= 0 ? 'Out of Stock' :
                          item.currentStock < item.reorderLevel ? 'Low Stock' : 'In Stock';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.currentStock}</td>
                <td>${item.reorderLevel}</td>
                <td><span class="status ${status === 'In Stock' ? 'good' : status === 'Low Stock' ? 'warning' : 'critical'}">${status}</span></td>
            `;
            inventoryLevelsTable.appendChild(row);
        });
    }

    function renderLowStockTable() {
        lowStockTable.innerHTML = '';

        const lowStockItems = sampleData.inventoryItems.filter(item =>
            item.currentStock < item.reorderLevel
        );

        lowStockItems.forEach(item => {
            const variance = item.reorderLevel - item.currentStock;
            const suggestedOrder = Math.ceil(variance * 1.5); // Add 50% buffer

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.currentStock}</td>
                <td>${item.reorderLevel}</td>
                <td>${variance}</td>
                <td>${suggestedOrder}</td>
            `;
            lowStockTable.appendChild(row);
        });
    }

    function renderStockAgingTable() {
        stockAgingTable.innerHTML = '';

        // This is simplified - in a real app you'd calculate days since last movement
        sampleData.inventoryItems.forEach(item => {
            const daysSinceMovement = Math.floor(Math.random() * 120); // Random for demo
            let status = '';

            if (daysSinceMovement > 90) status = 'Obsolete';
            else if (daysSinceMovement > 60) status = 'Slow Moving';
            else status = 'Active';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.currentStock}</td>
                <td>${new Date(Date.now() - Math.floor(Math.random() * 120 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}</td>
                <td>${new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]}</td>
                <td>${daysSinceMovement}</td>
                <td><span class="status ${status === 'Active' ? 'good' : status === 'Slow Moving' ? 'warning' : 'critical'}">${status}</span></td>
            `;
            stockAgingTable.appendChild(row);
        });
    }

    function renderMovementHistoryTable() {
        movementHistoryTable.innerHTML = '';

        sampleData.movements.forEach(movement => {
            const item = sampleData.inventoryItems.find(i => i.code === movement.itemCode) || {};

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${movement.date.split(' ')[0]}</td>
                <td><span class="movement-type ${movement.type}">${
                    movement.type === 'receipt' ? 'Receipt' : 
                    movement.type === 'issue' ? 'Issue' : 
                    movement.type === 'transfer' ? 'Transfer' : 'Adjustment'
                }</span></td>
                <td>${movement.itemCode}</td>
                <td>${item.name || movement.itemCode}</td>
                <td>${movement.quantity > 0 ? '+' : ''}${movement.quantity}</td>
                <td>${movement.fromLocation}</td>
                <td>${movement.toLocation}</td>
                <td>${movement.initiatedBy}</td>
            `;
            movementHistoryTable.appendChild(row);
        });
    }

    function renderValuationTable() {
        valuationTable.innerHTML = '';

        let totalValue = 0;

        // Calculate total value first
        sampleData.inventoryItems.forEach(item => {
            totalValue += item.currentStock * item.unitCost;
        });

        sampleData.inventoryItems.forEach(item => {
            const itemValue = item.currentStock * item.unitCost;
            const percentage = (itemValue / totalValue * 100).toFixed(2);

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.code}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.currentStock}</td>
                <td>$${item.unitCost.toFixed(2)}</td>
                <td>$${itemValue.toFixed(2)}</td>
                <td>${percentage}%</td>
            `;
            valuationTable.appendChild(row);
        });
    }

    function renderPerformanceTable() {
        performanceTable.innerHTML = '';

        const performanceData = [
            { category: 'IT Equipment', turnover: 4.2, daysToSell: 28, stockoutFreq: 3, carryingCost: 1200, efficiency: 'High' },
            { category: 'Office Supplies', turnover: 3.5, daysToSell: 35, stockoutFreq: 5, carryingCost: 800, efficiency: 'Medium' },
            { category: 'Furniture', turnover: 2.1, daysToSell: 58, stockoutFreq: 1, carryingCost: 1500, efficiency: 'Low' },
            { category: 'Other', turnover: 1.8, daysToSell: 65, stockoutFreq: 2, carryingCost: 300, efficiency: 'Low' }
        ];

        performanceData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.category}</td>
                <td>${item.turnover}</td>
                <td>${item.daysToSell}</td>
                <td>${item.stockoutFreq}</td>
                <td>$${item.carryingCost.toFixed(2)}</td>
                <td><span class="status ${item.efficiency === 'High' ? 'good' : item.efficiency === 'Medium' ? 'warning' : 'critical'}">${item.efficiency}</span></td>
            `;
            performanceTable.appendChild(row);
        });
    }

    function renderEquipmentTable() {
        equipmentTable.innerHTML = '';

        sampleData.equipment.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.assignedTo}</td>
                <td>${item.lastUsed}</td>
                <td>${item.utilization}%</td>
                <td><span class="status ${item.status === 'In Use' ? 'good' : item.status === 'Available' ? 'neutral' : 'warning'}">${item.status}</span></td>
            `;
            equipmentTable.appendChild(row);
        });
    }

    // Filter functionality
    applyReportFilters.addEventListener('click', function() {
        // In a real app, this would filter the data before rendering
        alert('Filters applied! Data would be filtered in a real application.');
    });

    resetReportFilters.addEventListener('click', function() {
        reportDateRange.value = '';
        document.getElementById('reportCategory').value = 'all';
        document.getElementById('reportLocation').value = 'all';
        document.getElementById('reportAggregation').value = 'daily';
        alert('Filters reset! Data would be reloaded in a real application.');
    });

    // Initialize the dashboard tab by default
    initDashboardCharts();
});