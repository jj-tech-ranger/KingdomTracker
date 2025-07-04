document.addEventListener('DOMContentLoaded', function() {
    // Sample data for inventory (25+ items)
    const inventoryItems = [
        { id: 1, name: "Canned Beans", category: "canned", quantity: 42, unit: "cans", expiry: "2025-12-15", location: "Shelf A3", status: "in-stock" },
        { id: 2, name: "Rice (5kg)", category: "grains", quantity: 18, unit: "bags", expiry: "2026-03-20", location: "Shelf B1", status: "in-stock" },
        { id: 3, name: "Whole Milk", category: "dairy", quantity: 5, unit: "gallons", expiry: "2025-07-10", location: "Fridge 1", status: "low-stock" },
        { id: 4, name: "Apples", category: "produce", quantity: 12, unit: "lbs", expiry: "2025-07-05", location: "Produce Bin 2", status: "expiring" },
        { id: 5, name: "Diapers (Size 4)", category: "baby", quantity: 3, unit: "packs", expiry: "2027-01-01", location: "Shelf C2", status: "low-stock" },
        { id: 6, name: "Tomato Sauce", category: "canned", quantity: 24, unit: "cans", expiry: "2026-02-28", location: "Shelf A4", status: "in-stock" },
        { id: 7, name: "Pasta (1kg)", category: "grains", quantity: 15, unit: "bags", expiry: "2026-05-15", location: "Shelf B2", status: "in-stock" },
        { id: 8, name: "Cheese", category: "dairy", quantity: 8, unit: "lbs", expiry: "2025-07-12", location: "Fridge 2", status: "in-stock" },
        { id: 9, name: "Bananas", category: "produce", quantity: 20, unit: "lbs", expiry: "2025-07-03", location: "Produce Bin 1", status: "expiring" },
        { id: 10, name: "Baby Formula", category: "baby", quantity: 6, unit: "cans", expiry: "2026-08-30", location: "Shelf C1", status: "in-stock" },
        { id: 11, name: "Tuna (5oz)", category: "canned", quantity: 30, unit: "cans", expiry: "2026-01-10", location: "Shelf A5", status: "in-stock" },
        { id: 12, name: "Flour (5kg)", category: "grains", quantity: 10, unit: "bags", expiry: "2026-04-05", location: "Shelf B3", status: "in-stock" },
        { id: 13, name: "Yogurt", category: "dairy", quantity: 12, unit: "units", expiry: "2025-07-08", location: "Fridge 1", status: "expiring" },
        { id: 14, name: "Potatoes", category: "produce", quantity: 25, unit: "lbs", expiry: "2025-07-20", location: "Produce Bin 3", status: "in-stock" },
        { id: 15, name: "Baby Wipes", category: "baby", quantity: 5, unit: "packs", expiry: "2027-03-15", location: "Shelf C3", status: "low-stock" },
        { id: 16, name: "Corn (15oz)", category: "canned", quantity: 22, unit: "cans", expiry: "2025-11-30", location: "Shelf A6", status: "in-stock" },
        { id: 17, name: "Oatmeal", category: "grains", quantity: 14, unit: "boxes", expiry: "2026-06-10", location: "Shelf B4", status: "in-stock" },
        { id: 18, name: "Butter", category: "dairy", quantity: 7, unit: "lbs", expiry: "2025-07-25", location: "Fridge 2", status: "in-stock" },
        { id: 19, name: "Carrots", category: "produce", quantity: 15, unit: "lbs", expiry: "2025-07-07", location: "Produce Bin 2", status: "expiring" },
        { id: 20, name: "Baby Cereal", category: "baby", quantity: 4, unit: "boxes", expiry: "2026-09-01", location: "Shelf C1", status: "low-stock" },
        { id: 21, name: "Peas (15oz)", category: "canned", quantity: 18, unit: "cans", expiry: "2025-10-15", location: "Shelf A7", status: "in-stock" },
        { id: 22, name: "Cereal", category: "grains", quantity: 12, unit: "boxes", expiry: "2026-07-20", location: "Shelf B5", status: "in-stock" },
        { id: 23, name: "Eggs", category: "dairy", quantity: 10, unit: "dozen", expiry: "2025-07-09", location: "Fridge 1", status: "expiring" },
        { id: 24, name: "Onions", category: "produce", quantity: 18, unit: "lbs", expiry: "2025-07-30", location: "Produce Bin 3", status: "in-stock" },
        { id: 25, name: "Baby Bottles", category: "baby", quantity: 8, unit: "units", expiry: "2028-01-01", location: "Shelf C4", status: "in-stock" },
        { id: 26, name: "Toothpaste", category: "hygiene", quantity: 12, unit: "tubes", expiry: "2026-12-31", location: "Shelf D1", status: "in-stock" },
        { id: 27, name: "Soap", category: "hygiene", quantity: 15, unit: "bars", expiry: "2026-11-30", location: "Shelf D2", status: "in-stock" }
    ];

    // Sample data for requests (25+ items)
    const requestItems = [
        { id: "FB-2025-0012", name: "Maria Gonzalez", date: "2025-06-28", items: "Rice, Beans, Milk, Eggs", status: "pending", household: "4 (2 adults, 2 children)", contact: "Phone: (555) 123-4567\nEmail: maria.g@example.com", notes: "First-time requester. Referred by community center." },
        { id: "FB-2025-0011", name: "James Wilson", date: "2025-06-27", items: "Pasta, Tomato Sauce, Diapers", status: "review", household: "3 (1 adult, 2 children)", contact: "Phone: (555) 234-5678\nEmail: james.w@example.com", notes: "Single father. Needs size 4 diapers." },
        { id: "FB-2025-0010", name: "Sarah Johnson", date: "2025-06-25", items: "Bread, Cheese, Vegetables", status: "approved", household: "2 (2 adults)", contact: "Phone: (555) 345-6789\nEmail: sarah.j@example.com", notes: "Both adults unemployed temporarily." },
        { id: "FB-2025-0009", name: "Robert Chen", date: "2025-06-20", items: "Cereal, Milk, Fruit", status: "fulfilled", household: "5 (2 adults, 3 children)", contact: "Phone: (555) 456-7890\nEmail: robert.c@example.com", notes: "Picked up on 2025-06-22." },
        { id: "FB-2025-0008", name: "Lisa Martinez", date: "2025-06-18", items: "Rice, Beans, Oil, Flour", status: "fulfilled", household: "6 (2 adults, 4 children)", contact: "Phone: (555) 567-8901\nEmail: lisa.m@example.com", notes: "Large family in temporary housing." },
        { id: "FB-2025-0007", name: "David Kim", date: "2025-06-15", items: "Canned Meat, Vegetables, Pasta", status: "denied", household: "1 (1 adult)", contact: "Phone: (555) 678-9012\nEmail: david.k@example.com", notes: "Did not meet eligibility criteria." },
        { id: "FB-2025-0006", name: "Emily Wilson", date: "2025-06-12", items: "Baby Formula, Diapers, Wipes", status: "fulfilled", household: "3 (1 adult, 2 infants)", contact: "Phone: (555) 789-0123\nEmail: emily.w@example.com", notes: "Single mother with twins." },
        { id: "FB-2025-0005", name: "Michael Brown", date: "2025-06-10", items: "Rice, Canned Vegetables, Oil", status: "fulfilled", household: "2 (2 adults)", contact: "Phone: (555) 890-1234\nEmail: michael.b@example.com", notes: "Seniors on fixed income." },
        { id: "FB-2025-0004", name: "Jessica Lee", date: "2025-06-08", items: "Pasta, Sauce, Cheese, Bread", status: "fulfilled", household: "4 (2 adults, 2 children)", contact: "Phone: (555) 901-2345\nEmail: jessica.l@example.com", notes: "Family displaced by fire." },
        { id: "FB-2025-0003", name: "Daniel Garcia", date: "2025-06-05", items: "Cereal, Milk, Eggs, Fruit", status: "fulfilled", household: "3 (1 adult, 2 children)", contact: "Phone: (555) 012-3456\nEmail: daniel.g@example.com", notes: "Recently laid off." },
        { id: "FB-2025-0002", name: "Amanda Taylor", date: "2025-06-03", items: "Rice, Beans, Vegetables", status: "fulfilled", household: "5 (2 adults, 3 children)", contact: "Phone: (555) 123-4567\nEmail: amanda.t@example.com", notes: "Medical bills strain budget." },
        { id: "FB-2025-0001", name: "Christopher Moore", date: "2025-06-01", items: "Pasta, Sauce, Bread, Cheese", status: "fulfilled", household: "2 (2 adults)", contact: "Phone: (555) 234-5678\nEmail: chris.m@example.com", notes: "College students in need." },
        { id: "FB-2025-0013", name: "Jennifer Harris", date: "2025-06-29", items: "Milk, Eggs, Bread, Fruit", status: "pending", household: "3 (1 adult, 2 children)", contact: "Phone: (555) 345-6789\nEmail: jennifer.h@example.com", notes: "Waiting for verification." },
        { id: "FB-2025-0014", name: "Matthew Clark", date: "2025-06-30", items: "Rice, Beans, Oil, Flour", status: "pending", household: "4 (2 adults, 2 children)", contact: "Phone: (555) 456-7890\nEmail: matthew.c@example.com", notes: "New request, needs follow-up." },
        { id: "FB-2025-0015", name: "Elizabeth Lewis", date: "2025-06-30", items: "Baby Formula, Diapers, Wipes", status: "review", household: "2 (1 adult, 1 infant)", contact: "Phone: (555) 567-8901\nEmail: elizabeth.l@example.com", notes: "Special formula needed." },
        { id: "FB-2025-0016", name: "Kevin Walker", date: "2025-07-01", items: "Canned Meat, Vegetables, Pasta", status: "pending", household: "3 (1 adult, 2 children)", contact: "Phone: (555) 678-9012\nEmail: kevin.w@example.com", notes: "Recently moved to area." },
        { id: "FB-2025-0017", name: "Melissa Hall", date: "2025-07-01", items: "Bread, Cheese, Eggs, Milk", status: "pending", household: "2 (2 adults)", contact: "Phone: (555) 789-0123\nEmail: melissa.h@example.com", notes: "Both working minimum wage jobs." },
        { id: "FB-2025-0018", name: "Andrew Young", date: "2025-07-02", items: "Rice, Beans, Vegetables, Oil", status: "pending", household: "5 (2 adults, 3 children)", contact: "Phone: (555) 890-1234\nEmail: andrew.y@example.com", notes: "Utilities shut off temporarily." },
        { id: "FB-2025-0019", name: "Nicole Allen", date: "2025-07-02", items: "Cereal, Milk, Fruit, Bread", status: "pending", household: "4 (2 adults, 2 children)", contact: "Phone: (555) 901-2345\nEmail: nicole.a@example.com", notes: "Waiting for disability approval." },
        { id: "FB-2025-0020", name: "Joshua King", date: "2025-07-03", items: "Pasta, Sauce, Cheese, Vegetables", status: "pending", household: "3 (1 adult, 2 children)", contact: "Phone: (555) 012-3456\nEmail: joshua.k@example.com", notes: "Single father, new job starts next month." },
        { id: "FB-2025-0021", name: "Stephanie Scott", date: "2025-07-03", items: "Rice, Beans, Eggs, Milk", status: "pending", household: "2 (1 adult, 1 child)", contact: "Phone: (555) 123-4567\nEmail: stephanie.s@example.com", notes: "Escaping domestic violence situation." },
        { id: "FB-2025-0022", name: "Ryan Green", date: "2025-07-04", items: "Bread, Peanut Butter, Jelly", status: "pending", household: "3 (1 adult, 2 children)", contact: "Phone: (555) 234-5678\nEmail: ryan.g@example.com", notes: "Children have peanut allergies." },
        { id: "FB-2025-0023", name: "Danielle Baker", date: "2025-07-04", items: "Canned Vegetables, Pasta, Sauce", status: "pending", household: "2 (2 adults)", contact: "Phone: (555) 345-6789\nEmail: danielle.b@example.com", notes: "Both adults in school full-time." },
        { id: "FB-2025-0024", name: "Justin Adams", date: "2025-07-05", items: "Rice, Beans, Oil, Flour", status: "pending", household: "4 (2 adults, 2 children)", contact: "Phone: (555) 456-7890\nEmail: justin.a@example.com", notes: "Recently homeless, found housing." },
        { id: "FB-2025-0025", name: "Rebecca Nelson", date: "2025-07-05", items: "Baby Formula, Diapers, Wipes", status: "pending", household: "2 (1 adult, 1 infant)", contact: "Phone: (555) 567-8901\nEmail: rebecca.n@example.com", notes: "Formula for lactose intolerance." }
    ];

    // Sample data for endorsed (15+ items)
    const endorsedItems = [
        { id: "END-2025-0042", name: "Maria Gonzalez", date: "2025-06-29", items: "Rice, Beans, Milk, Eggs", status: "scheduled", pickup: "2025-07-05, 10:00 AM", household: "4 (2 adults, 2 children)", contact: "Phone: (555) 123-4567\nEmail: maria.g@example.com", notes: "First distribution." },
        { id: "END-2025-0041", name: "James Wilson", date: "2025-06-28", items: "Pasta, Tomato Sauce, Diapers", status: "pending", pickup: "-", household: "3 (1 adult, 2 children)", contact: "Phone: (555) 234-5678\nEmail: james.w@example.com", notes: "Needs size 4 diapers." },
        { id: "END-2025-0040", name: "Sarah Johnson", date: "2025-06-26", items: "Bread, Cheese, Vegetables", status: "distributed", pickup: "2025-06-30, 2:00 PM", household: "2 (2 adults)", contact: "Phone: (555) 345-6789\nEmail: sarah.j@example.com", notes: "Both adults unemployed temporarily." },
        { id: "END-2025-0039", name: "Robert Chen", date: "2025-06-21", items: "Cereal, Milk, Fruit", status: "partial", pickup: "2025-07-12, 11:00 AM", household: "5 (2 adults, 3 children)", contact: "Phone: (555) 456-7890\nEmail: robert.c@example.com", notes: "Received partial items, rest scheduled." },
        { id: "END-2025-0038", name: "Lisa Martinez", date: "2025-06-19", items: "Rice, Beans, Oil, Flour", status: "distributed", pickup: "2025-06-22, 9:30 AM", household: "6 (2 adults, 4 children)", contact: "Phone: (555) 567-8901\nEmail: lisa.m@example.com", notes: "Large family in temporary housing." },
        { id: "END-2025-0037", name: "David Kim", date: "2025-06-16", items: "Canned Meat, Vegetables, Pasta", status: "distributed", pickup: "2025-06-18, 3:00 PM", household: "1 (1 adult)", contact: "Phone: (555) 678-9012\nEmail: david.k@example.com", notes: "Single portion distribution." },
        { id: "END-2025-0036", name: "Emily Wilson", date: "2025-06-13", items: "Baby Formula, Diapers, Wipes", status: "distributed", pickup: "2025-06-15, 1:00 PM", household: "3 (1 adult, 2 infants)", contact: "Phone: (555) 789-0123\nEmail: emily.w@example.com", notes: "Single mother with twins." },
        { id: "END-2025-0035", name: "Michael Brown", date: "2025-06-11", items: "Rice, Canned Vegetables, Oil", status: "distributed", pickup: "2025-06-13, 10:30 AM", household: "2 (2 adults)", contact: "Phone: (555) 890-1234\nEmail: michael.b@example.com", notes: "Seniors on fixed income." },
        { id: "END-2025-0034", name: "Jessica Lee", date: "2025-06-09", items: "Pasta, Sauce, Cheese, Bread", status: "distributed", pickup: "2025-06-11, 2:15 PM", household: "4 (2 adults, 2 children)", contact: "Phone: (555) 901-2345\nEmail: jessica.l@example.com", notes: "Family displaced by fire." },
        { id: "END-2025-0033", name: "Daniel Garcia", date: "2025-06-06", items: "Cereal, Milk, Eggs, Fruit", status: "distributed", pickup: "2025-06-08, 11:45 AM", household: "3 (1 adult, 2 children)", contact: "Phone: (555) 012-3456\nEmail: daniel.g@example.com", notes: "Recently laid off." },
        { id: "END-2025-0032", name: "Amanda Taylor", date: "2025-06-04", items: "Rice, Beans, Vegetables", status: "distributed", pickup: "2025-06-06, 9:00 AM", household: "5 (2 adults, 3 children)", contact: "Phone: (555) 123-4567\nEmail: amanda.t@example.com", notes: "Medical bills strain budget." },
        { id: "END-2025-0031", name: "Christopher Moore", date: "2025-06-02", items: "Pasta, Sauce, Bread, Cheese", status: "distributed", pickup: "2025-06-04, 3:30 PM", household: "2 (2 adults)", contact: "Phone: (555) 234-5678\nEmail: chris.m@example.com", notes: "College students in need." },
        { id: "END-2025-0030", name: "Jennifer Harris", date: "2025-05-30", items: "Milk, Eggs, Bread, Fruit", status: "distributed", pickup: "2025-06-01, 10:00 AM", household: "3 (1 adult, 2 children)", contact: "Phone: (555) 345-6789\nEmail: jennifer.h@example.com", notes: "Regular monthly distribution." },
        { id: "END-2025-0029", name: "Matthew Clark", date: "2025-05-28", items: "Rice, Beans, Oil, Flour", status: "distributed", pickup: "2025-05-30, 2:00 PM", household: "4 (2 adults, 2 children)", contact: "Phone: (555) 456-7890\nEmail: matthew.c@example.com", notes: "First-time distribution." },
        { id: "END-2025-0028", name: "Elizabeth Lewis", date: "2025-05-25", items: "Baby Formula, Diapers, Wipes", status: "distributed", pickup: "2025-05-27, 11:00 AM", household: "2 (1 adult, 1 infant)", contact: "Phone: (555) 567-8901\nEmail: elizabeth.l@example.com", notes: "Special formula provided." }
    ];

    // Sample data for donations (10 items)
    const donationItems = [
        { id: "DON-2025-0124", donor: "Local Grocery Store", date: "2025-06-30", type: "food", items: "25 canned goods, 10 bags rice", value: 150 },
        { id: "DON-2025-0123", donor: "John Smith", date: "2025-06-28", type: "monetary", items: "Cash Donation", value: 200 },
        { id: "DON-2025-0122", donor: "Community Church", date: "2025-06-25", type: "food", items: "50 non-perishable items", value: 300 },
        { id: "DON-2025-0121", donor: "Sarah Williams", date: "2025-06-20", type: "supplies", items: "Hygiene products (10 packs)", value: 75 },
        { id: "DON-2025-0120", donor: "City Food Drive", date: "2025-06-18", type: "food", items: "120 various food items", value: 500 },
        { id: "DON-2025-0119", donor: "Mark Johnson", date: "2025-06-15", type: "monetary", items: "Check Donation", value: 250 },
        { id: "DON-2025-0118", donor: "Local Bakery", date: "2025-06-12", type: "food", items: "Bread and pastries (daily)", value: 180 },
        { id: "DON-2025-0117", donor: "Corporate Matching", date: "2025-06-10", type: "monetary", items: "Company Match Program", value: 1000 },
        { id: "DON-2025-0116", donor: "Farmers Market", date: "2025-06-08", type: "food", items: "Fresh produce (weekly)", value: 220 },
        { id: "DON-2025-0115", donor: "Anonymous", date: "2025-06-05", type: "supplies", items: "Cleaning supplies (5 packs)", value: 60 }
    ];

    // DOM elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.foodbank-view');
    const inventoryBody = document.getElementById('inventory-body');
    const requestsBody = document.getElementById('requests-body');
    const endorsedBody = document.getElementById('endorsed-body');
    const donationsBody = document.getElementById('donations-body');
    const inventoryEmpty = document.getElementById('inventory-empty');
    const requestsEmpty = document.getElementById('requests-empty');
    const endorsedEmpty = document.getElementById('endorsed-empty');
    const donationsEmpty = document.getElementById('donations-empty');
    const addItemBtn = document.getElementById('add-item-btn');
    const addFirstItemBtn = document.getElementById('add-first-item');
    const addDonationBtn = document.getElementById('add-donation-btn');
    const addFirstDonationBtn = document.getElementById('add-first-donation');
    const addItemModal = document.getElementById('add-item-modal');
    const closeAddItem = document.getElementById('close-add-item');
    const cancelAddItem = document.getElementById('cancel-add-item');
    const viewRequestModal = document.getElementById('view-request-modal');
    const closeViewRequest = document.getElementById('close-view-request');
    const closeRequest = document.getElementById('close-request');
    const statInventory = document.getElementById('stat-inventory');
    const statRequests = document.getElementById('stat-requests');
    const statFamilies = document.getElementById('stat-families');
    const statDistributed = document.getElementById('stat-distributed');

    // Pagination variables
    let currentInventoryPage = 1;
    let currentRequestsPage = 1;
    let currentEndorsedPage = 1;
    let currentDonationsPage = 1;
    const itemsPerPage = 5;

    // Initialize the page
    function init() {
        renderInventory();
        renderRequests();
        renderEndorsed();
        renderDonations();
        updateStats();
        setupEventListeners();
    }

    // Render inventory table with pagination
    function renderInventory(page = 1) {
        currentInventoryPage = page;
        const filtered = filterInventory();
        const paginated = paginateData(filtered, page);

        inventoryBody.innerHTML = '';

        if (paginated.data.length === 0) {
            inventoryEmpty.style.display = 'block';
            document.getElementById('inventory-table').style.display = 'none';
            document.getElementById('inventory-pagination').style.display = 'none';
            return;
        }

        inventoryEmpty.style.display = 'none';
        document.getElementById('inventory-table').style.display = 'table';
        document.getElementById('inventory-pagination').style.display = 'flex';

        paginated.data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${getCategoryName(item.category)}</td>
                <td>${item.quantity} <span class="unit">${item.unit}</span></td>
                <td>${item.expiry || '-'}</td>
                <td>${item.location || '-'}</td>
                <td><span class="status-badge ${item.status}">${getStatusName(item.status)}</span></td>
                <td>
                    <button class="action-btn edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                    <button class="action-btn adjust-btn" data-id="${item.id}"><i class="fas fa-sliders-h"></i></button>
                </td>
            `;
            inventoryBody.appendChild(row);
        });

        renderPagination('inventory', paginated.totalPages, page);
    }

    // Render requests table with pagination
    function renderRequests(page = 1) {
        currentRequestsPage = page;
        const filtered = filterRequests();
        const paginated = paginateData(filtered, page);

        requestsBody.innerHTML = '';

        if (paginated.data.length === 0) {
            requestsEmpty.style.display = 'block';
            document.getElementById('requests-table').style.display = 'none';
            document.getElementById('requests-pagination').style.display = 'none';
            return;
        }

        requestsEmpty.style.display = 'none';
        document.getElementById('requests-table').style.display = 'table';
        document.getElementById('requests-pagination').style.display = 'flex';

        paginated.data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.date}</td>
                <td>${item.items}</td>
                <td><span class="status-badge ${item.status}">${getStatusName(item.status)}</span></td>
                <td>
                    <button class="action-btn view-btn" data-id="${item.id}"><i class="fas fa-eye"></i></button>
                    ${item.status === 'pending' || item.status === 'review' ? `
                    <button class="action-btn approve-btn" data-id="${item.id}"><i class="fas fa-check"></i></button>
                    <button class="action-btn deny-btn" data-id="${item.id}"><i class="fas fa-times"></i></button>
                    ` : item.status === 'approved' ? `
                    <button class="action-btn schedule-btn" data-id="${item.id}"><i class="fas fa-calendar"></i></button>
                    ` : `
                    <button class="action-btn history-btn" data-id="${item.id}"><i class="fas fa-history"></i></button>
                    `}
                </td>
            `;
            requestsBody.appendChild(row);
        });

        renderPagination('requests', paginated.totalPages, page);
    }

    // Render endorsed table with pagination
    function renderEndorsed(page = 1) {
        currentEndorsedPage = page;
        const filtered = filterEndorsed();
        const paginated = paginateData(filtered, page);

        endorsedBody.innerHTML = '';

        if (paginated.data.length === 0) {
            endorsedEmpty.style.display = 'block';
            document.getElementById('endorsed-table').style.display = 'none';
            document.getElementById('endorsed-pagination').style.display = 'none';
            return;
        }

        endorsedEmpty.style.display = 'none';
        document.getElementById('endorsed-table').style.display = 'table';
        document.getElementById('endorsed-pagination').style.display = 'flex';

        paginated.data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.date}</td>
                <td>${item.items}</td>
                <td><span class="status-badge ${item.status}">${getStatusName(item.status)}</span></td>
                <td>${item.pickup}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${item.id}"><i class="fas fa-eye"></i></button>
                    ${item.status === 'pending' ? `
                    <button class="action-btn schedule-btn" data-id="${item.id}"><i class="fas fa-calendar"></i></button>
                    ` : item.status === 'scheduled' || item.status === 'partial' ? `
                    <button class="action-btn distribute-btn" data-id="${item.id}"><i class="fas fa-check-circle"></i></button>
                    ` : `
                    <button class="action-btn history-btn" data-id="${item.id}"><i class="fas fa-history"></i></button>
                    `}
                </td>
            `;
            endorsedBody.appendChild(row);
        });

        renderPagination('endorsed', paginated.totalPages, page);
    }

    // Render donations table with pagination
    function renderDonations(page = 1) {
        currentDonationsPage = page;
        const filtered = filterDonations();
        const paginated = paginateData(filtered, page);

        donationsBody.innerHTML = '';

        if (paginated.data.length === 0) {
            donationsEmpty.style.display = 'block';
            document.getElementById('donations-table').style.display = 'none';
            document.getElementById('donations-pagination').style.display = 'none';
            return;
        }

        donationsEmpty.style.display = 'none';
        document.getElementById('donations-table').style.display = 'table';
        document.getElementById('donations-pagination').style.display = 'flex';

        paginated.data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.donor}</td>
                <td>${item.date}</td>
                <td>${item.type.charAt(0).toUpperCase() + item.type.slice(1)}</td>
                <td>${item.items}</td>
                <td>$${item.value.toFixed(2)}</td>
                <td>
                    <button class="action-btn view-btn" data-id="${item.id}"><i class="fas fa-eye"></i></button>
                    <button class="action-btn receipt-btn" data-id="${item.id}"><i class="fas fa-receipt"></i></button>
                </td>
            `;
            donationsBody.appendChild(row);
        });

        renderPagination('donations', paginated.totalPages, page);
    }

    // Filter inventory based on selected filters
    function filterInventory() {
        const categoryFilter = document.getElementById('inventory-category').value;
        const sortValue = document.getElementById('inventory-sort').value;
        const searchTerm = document.getElementById('inventory-search').value.toLowerCase();

        let filtered = [...inventoryItems];

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(item => item.category === categoryFilter);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                (item.location && item.location.toLowerCase().includes(searchTerm)))
        }

        // Apply sorting
        switch (sortValue) {
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'quantity-asc':
                filtered.sort((a, b) => a.quantity - b.quantity);
                break;
            case 'quantity-desc':
                filtered.sort((a, b) => b.quantity - a.quantity);
                break;
            case 'expiry-asc':
                filtered.sort((a, b) => {
                    if (!a.expiry && !b.expiry) return 0;
                    if (!a.expiry) return 1;
                    if (!b.expiry) return -1;
                    return new Date(a.expiry) - new Date(b.expiry);
                });
                break;
        }

        return filtered;
    }

    // Filter requests based on selected filters
    function filterRequests() {
        const statusFilter = document.getElementById('request-status').value;
        const sortValue = document.getElementById('request-sort').value;
        const searchTerm = document.getElementById('request-search').value.toLowerCase();

        let filtered = [...requestItems];

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.id.toLowerCase().includes(searchTerm) ||
                item.items.toLowerCase().includes(searchTerm))
        }

        // Apply sorting
        switch (sortValue) {
            case 'date-desc':
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-asc':
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }

        return filtered;
    }

    // Filter endorsed based on selected filters
    function filterEndorsed() {
        const statusFilter = document.getElementById('endorsed-status').value;
        const sortValue = document.getElementById('endorsed-sort').value;
        const searchTerm = document.getElementById('endorsed-search').value.toLowerCase();

        let filtered = [...endorsedItems];

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.id.toLowerCase().includes(searchTerm) ||
                item.items.toLowerCase().includes(searchTerm))
        }

        // Apply sorting
        switch (sortValue) {
            case 'date-desc':
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-asc':
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'pickup-asc':
                filtered.sort((a, b) => {
                    if (a.pickup === '-' && b.pickup === '-') return 0;
                    if (a.pickup === '-') return 1;
                    if (b.pickup === '-') return -1;
                    return new Date(a.pickup.split(',')[0]) - new Date(b.pickup.split(',')[0])
                });
                break;
        }

        return filtered;
    }

    // Filter donations based on selected filters
    function filterDonations() {
        const typeFilter = document.getElementById('donation-type').value;
        const sortValue = document.getElementById('donation-sort').value;
        const searchTerm = document.getElementById('donation-search').value.toLowerCase();

        let filtered = [...donationItems];

        // Apply type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(item => item.type === typeFilter);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(item =>
                item.donor.toLowerCase().includes(searchTerm) ||
                item.id.toLowerCase().includes(searchTerm) ||
                item.items.toLowerCase().includes(searchTerm))
        }

        // Apply sorting
        switch (sortValue) {
            case 'date-desc':
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-asc':
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'amount-desc':
                filtered.sort((a, b) => b.value - a.value);
                break;
            case 'amount-asc':
                filtered.sort((a, b) => a.value - b.value);
                break;
        }

        return filtered;
    }

    // Paginate data for tables
    function paginateData(data, currentPage) {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = data.slice(startIndex, endIndex);
        const totalPages = Math.ceil(data.length / itemsPerPage);

        return {
            data: paginatedData,
            totalPages: totalPages
        };
    }

    // Render pagination controls
    function renderPagination(type, totalPages, currentPage) {
        const pagesContainer = document.getElementById(`${type}-pages`);
        const prevBtn = document.getElementById(`${type}-prev`);
        const nextBtn = document.getElementById(`${type}-next`);

        pagesContainer.innerHTML = '';

        // Disable prev button on first page
        prevBtn.disabled = currentPage === 1;

        // Disable next button on last page
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;

        // Show page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('div');
            pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                if (type === 'inventory') renderInventory(i);
                if (type === 'requests') renderRequests(i);
                if (type === 'endorsed') renderEndorsed(i);
                if (type === 'donations') renderDonations(i);
            });
            pagesContainer.appendChild(pageBtn);
        }
    }

    // Update statistics
    function updateStats() {
        // Inventory value (sample calculation)
        const inventoryValue = inventoryItems.reduce((sum, item) => {
            // Simple estimation - in a real app this would use actual item values
            return sum + (item.quantity * 5); // Assuming average $5 per item
        }, 0);

        statInventory.textContent = `$${inventoryValue.toLocaleString()}`;

        // Active requests (pending + under review)
        const activeRequests = requestItems.filter(item =>
            item.status === 'pending' || item.status === 'review').length;
        statRequests.textContent = activeRequests;

        // Families served (unique endorsed recipients)
        const familiesServed = [...new Set(endorsedItems.map(item => item.name))].length;
        statFamilies.textContent = familiesServed;

        // Items distributed (sample count)
        const itemsDistributed = endorsedItems.length * 10; // Assuming 10 items per distribution
        statDistributed.textContent = itemsDistributed.toLocaleString();
    }

    // Get category name for display
    function getCategoryName(category) {
        const categories = {
            'canned': 'Canned Goods',
            'grains': 'Grains & Pasta',
            'dairy': 'Dairy',
            'produce': 'Produce',
            'meat': 'Meat & Protein',
            'baby': 'Baby Supplies',
            'hygiene': 'Hygiene Products'
        };
        return categories[category] || category;
    }

    // Get status name for display
    function getStatusName(status) {
        const statuses = {
            'pending': 'Pending',
            'review': 'Under Review',
            'approved': 'Approved',
            'denied': 'Denied',
            'fulfilled': 'Fulfilled',
            'in-stock': 'In Stock',
            'low-stock': 'Low Stock',
            'expiring': 'Expiring Soon',
            'scheduled': 'Scheduled',
            'distributed': 'Distributed',
            'partial': 'Partial'
        };
        return statuses[status] || status;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Tab switching
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                views.forEach(view => view.classList.remove('active'));
                const viewId = `${button.dataset.view}-view`;
                document.getElementById(viewId).classList.add('active');
            });
        });

        // Inventory filter changes
        document.getElementById('inventory-category').addEventListener('change', () => {
            renderInventory(1);
        });

        document.getElementById('inventory-sort').addEventListener('change', () => {
            renderInventory(1);
        });

        document.getElementById('inventory-search').addEventListener('input', () => {
            renderInventory(1);
        });

        // Requests filter changes
        document.getElementById('request-status').addEventListener('change', () => {
            renderRequests(1);
        });

        document.getElementById('request-sort').addEventListener('change', () => {
            renderRequests(1);
        });

        document.getElementById('request-search').addEventListener('input', () => {
            renderRequests(1);
        });

        // Endorsed filter changes
        document.getElementById('endorsed-status').addEventListener('change', () => {
            renderEndorsed(1);
        });

        document.getElementById('endorsed-sort').addEventListener('change', () => {
            renderEndorsed(1);
        });

        document.getElementById('endorsed-search').addEventListener('input', () => {
            renderEndorsed(1);
        });

        // Donations filter changes
        document.getElementById('donation-type').addEventListener('change', () => {
            renderDonations(1);
        });

        document.getElementById('donation-sort').addEventListener('change', () => {
            renderDonations(1);
        });

        document.getElementById('donation-search').addEventListener('input', () => {
            renderDonations(1);
        });

        // Pagination controls
        document.getElementById('inventory-prev').addEventListener('click', () => {
            if (currentInventoryPage > 1) renderInventory(currentInventoryPage - 1);
        });

        document.getElementById('inventory-next').addEventListener('click', () => {
            const totalPages = Math.ceil(filterInventory().length / itemsPerPage);
            if (currentInventoryPage < totalPages) renderInventory(currentInventoryPage + 1);
        });

        document.getElementById('requests-prev').addEventListener('click', () => {
            if (currentRequestsPage > 1) renderRequests(currentRequestsPage - 1);
        });

        document.getElementById('requests-next').addEventListener('click', () => {
            const totalPages = Math.ceil(filterRequests().length / itemsPerPage);
            if (currentRequestsPage < totalPages) renderRequests(currentRequestsPage + 1);
        });

        document.getElementById('endorsed-prev').addEventListener('click', () => {
            if (currentEndorsedPage > 1) renderEndorsed(currentEndorsedPage - 1);
        });

        document.getElementById('endorsed-next').addEventListener('click', () => {
            const totalPages = Math.ceil(filterEndorsed().length / itemsPerPage);
            if (currentEndorsedPage < totalPages) renderEndorsed(currentEndorsedPage + 1);
        });

        document.getElementById('donations-prev').addEventListener('click', () => {
            if (currentDonationsPage > 1) renderDonations(currentDonationsPage - 1);
        });

        document.getElementById('donations-next').addEventListener('click', () => {
            const totalPages = Math.ceil(filterDonations().length / itemsPerPage);
            if (currentDonationsPage < totalPages) renderDonations(currentDonationsPage + 1);
        });

        // Add item button
        addItemBtn.addEventListener('click', () => {
            addItemModal.classList.add('show');
        });

        addFirstItemBtn.addEventListener('click', () => {
            addItemModal.classList.add('show');
        });

        // Add donation button
        addDonationBtn.addEventListener('click', () => {
            // In a real app, this would open a donation modal
            alert('Donation form would open here');
        });

        addFirstDonationBtn.addEventListener('click', () => {
            // In a real app, this would open a donation modal
            alert('Donation form would open here');
        });

        // Close modals
        closeAddItem.addEventListener('click', () => {
            addItemModal.classList.remove('show');
        });

        cancelAddItem.addEventListener('click', () => {
            addItemModal.classList.remove('show');
        });

        closeViewRequest.addEventListener('click', () => {
            viewRequestModal.classList.remove('show');
        });

        closeRequest.addEventListener('click', () => {
            viewRequestModal.classList.remove('show');
        });

        // View request details
        document.addEventListener('click', (e) => {
            if (e.target.closest('.view-btn')) {
                const id = e.target.closest('.view-btn').dataset.id;
                const request = [...requestItems, ...endorsedItems].find(item => item.id === id);

                if (request) {
                    document.getElementById('detail-id').textContent = request.id;
                    document.getElementById('detail-name').textContent = request.name;
                    document.getElementById('detail-date').textContent = request.date;
                    document.getElementById('detail-status').innerHTML =
                        `<span class="status-badge ${request.status}">${getStatusName(request.status)}</span>`;
                    document.getElementById('detail-household').textContent = request.household || '-';

                    const itemsList = request.items.split(', ').map(item => `<li>${item}</li>`).join('');
                    document.getElementById('detail-items').innerHTML = `<ul>${itemsList}</ul>`;

                    document.getElementById('detail-contact').innerHTML =
                        request.contact.split('\n').map(line => `<p>${line}</p>`).join('');

                    document.getElementById('detail-notes').textContent = request.notes || 'No notes available';

                    viewRequestModal.classList.add('show');
                }
            }
        });

        // Approve request
        document.addEventListener('click', (e) => {
            if (e.target.closest('.approve-btn')) {
                const id = e.target.closest('.approve-btn').dataset.id;
                const requestIndex = requestItems.findIndex(item => item.id === id);

                if (requestIndex !== -1) {
                    requestItems[requestIndex].status = 'approved';

                    // Create endorsement
                    const request = requestItems[requestIndex];
                    const newEndorsement = {
                        id: `END-${new Date().getFullYear()}-${(endorsedItems.length + 1).toString().padStart(4, '0')}`,
                        name: request.name,
                        date: new Date().toISOString().split('T')[0],
                        items: request.items,
                        status: 'pending',
                        pickup: '-',
                        household: request.household,
                        contact: request.contact,
                        notes: request.notes
                    };

                    endorsedItems.unshift(newEndorsement);

                    renderRequests(currentRequestsPage);
                    renderEndorsed(1);
                    updateStats();

                    viewRequestModal.classList.remove('show');
                    alert('Request approved and endorsement created');
                }
            }
        });

        // Deny request
        document.addEventListener('click', (e) => {
            if (e.target.closest('.deny-btn')) {
                const id = e.target.closest('.deny-btn').dataset.id;
                const requestIndex = requestItems.findIndex(item => item.id === id);

                if (requestIndex !== -1) {
                    requestItems[requestIndex].status = 'denied';
                    renderRequests(currentRequestsPage);
                    updateStats();

                    viewRequestModal.classList.remove('show');
                    alert('Request denied');
                }
            }
        });

        // Schedule pickup
        document.addEventListener('click', (e) => {
            if (e.target.closest('.schedule-btn')) {
                const id = e.target.closest('.schedule-btn').dataset.id;
                const endorsedIndex = endorsedItems.findIndex(item => item.id === id);

                if (endorsedIndex !== -1) {
                    // In a real app, this would open a scheduling modal
                    const pickupDate = prompt('Enter pickup date and time (e.g., 2025-07-10, 2:00 PM)');

                    if (pickupDate) {
                        endorsedItems[endorsedIndex].status = 'scheduled';
                        endorsedItems[endorsedIndex].pickup = pickupDate;
                        renderEndorsed(currentEndorsedPage);
                        alert('Pickup scheduled successfully');
                    }
                }
            }
        });

        // Mark as distributed
        document.addEventListener('click', (e) => {
            if (e.target.closest('.distribute-btn')) {
                const id = e.target.closest('.distribute-btn').dataset.id;
                const endorsedIndex = endorsedItems.findIndex(item => item.id === id);

                if (endorsedIndex !== -1) {
                    const confirmDistribute = confirm('Mark this distribution as completed?');

                    if (confirmDistribute) {
                        endorsedItems[endorsedIndex].status = 'distributed';
                        renderEndorsed(currentEndorsedPage);
                        updateStats();
                        alert('Distribution marked as completed');
                    }
                }
            }
        });

        // Submit new inventory item
        document.getElementById('submit-add-item').addEventListener('click', (e) => {
            e.preventDefault();

            const name = document.getElementById('item-name').value;
            const category = document.getElementById('item-category').value;
            const quantity = document.getElementById('item-quantity').value;
            const unit = document.getElementById('item-unit').value;
            const expiry = document.getElementById('item-expiry').value;
            const location = document.getElementById('item-location').value;

            if (!name || !category || !quantity || !unit) {
                alert('Please fill in all required fields');
                return;
            }

            // Determine status based on quantity
            let status = 'in-stock';
            if (quantity < 5) status = 'low-stock';

            // Add new item
            const newItem = {
                id: inventoryItems.length + 1,
                name,
                category,
                quantity: parseInt(quantity),
                unit,
                expiry,
                location,
                status
            };

            inventoryItems.unshift(newItem);

            // Reset form
            document.getElementById('add-item-form').reset();

            // Close modal and refresh
            addItemModal.classList.remove('show');
            renderInventory(1);
            updateStats();

            alert('Item added successfully');
        });
    }

    // Initialize the application
    init();
});