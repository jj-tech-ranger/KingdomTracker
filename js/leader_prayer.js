document.addEventListener('DOMContentLoaded', function() {
    // Sample prayer request data with more detailed information
    const prayerRequests = [
        {
            id: 1,
            member: {
                name: "Sarah Johnson",
                id: "M1001",
                email: "sarah.j@example.com",
                phone: "(555) 123-4567",
                group: "Women's Bible Study"
            },
            category: "health",
            content: "Please pray for my mother who is undergoing surgery next week. The doctors found a small tumor and we're trusting God for complete healing and successful surgery. The surgery is scheduled for May 22 at City General Hospital.",
            date: "May 15, 2025",
            status: "pending",
            priority: "high",
            updates: [
                {
                    date: "May 16, 2025",
                    text: "Prayer chain notified about the request",
                    by: "Pastor Mark"
                }
            ],
            escalated: false
        },
        {
            id: 2,
            member: {
                name: "Michael Brown",
                id: "M1002",
                email: "michael.b@example.com",
                phone: "(555) 234-5678",
                group: "Men's Fellowship"
            },
            category: "financial",
            content: "I lost my job last month and we're struggling to pay our bills. Pray for God's provision and for the right job opportunity to come soon. We have three children and mortgage payments are due.",
            date: "May 12, 2025",
            status: "pending",
            priority: "medium",
            updates: [],
            escalated: false
        },
        {
            id: 3,
            member: {
                name: "Emily Davis",
                id: "M1003",
                email: "emily.d@example.com",
                phone: "(555) 345-6789",
                group: "Young Adults"
            },
            category: "family",
            content: "My son Jason (age 19) is struggling with addiction. Please pray for his deliverance and for our family to have wisdom in how to support him through this. He's been in and out of rehab twice.",
            date: "May 10, 2025",
            status: "escalated",
            priority: "urgent",
            updates: [
                {
                    date: "May 11, 2025",
                    text: "Referred to counseling ministry",
                    by: "Deacon James"
                }
            ],
            escalated: true,
            escalatedTo: {
                name: "Pastor John Smith",
                region: "North Region",
                date: "May 11, 2025"
            },
            escalationNotes: "Family has been dealing with this for years, needs specialized pastoral care and possible intervention"
        },
        {
            id: 4,
            member: {
                name: "David Wilson",
                id: "M1004",
                email: "david.w@example.com",
                phone: "(555) 456-7890",
                group: "Sunday School Teachers"
            },
            category: "spiritual",
            content: "I've been feeling distant from God lately. Pray that I would rekindle my passion for Christ and grow in my faith. I'm struggling with consistency in prayer and Bible reading.",
            date: "May 8, 2025",
            status: "answered",
            priority: "low",
            updates: [
                {
                    date: "May 10, 2025",
                    text: "Connected with a prayer partner",
                    by: "Sister Martha"
                },
                {
                    date: "May 14, 2025",
                    text: "Reported feeling renewed after joining a small group",
                    by: "David Wilson"
                }
            ],
            answeredDate: "May 14, 2025",
            answeredNotes: "Started attending men's discipleship group and reports significant improvement"
        },
        {
            id: 5,
            member: {
                name: "Jessica Lee",
                id: "M1005",
                email: "jessica.l@example.com",
                phone: "(555) 567-8901",
                group: "Missions Team"
            },
            category: "other",
            content: "Pray for our upcoming mission trip to Kenya (June 5-20). For safe travels, effective ministry, and that God would prepare the hearts of those we'll be serving. Also pray for the $2,500 still needed for team expenses.",
            date: "May 5, 2025",
            status: "pending",
            priority: "high",
            updates: [
                {
                    date: "May 6, 2025",
                    text: "Added to weekly prayer meeting list",
                    by: "Brother Tim"
                }
            ],
            escalated: false
        }
    ];

    // DOM Elements
    const prayerList = document.getElementById('prayer-list');
    const emptyState = document.getElementById('empty-state');
    const prayerSearch = document.getElementById('prayer-search');
    const filterStatus = document.getElementById('filter-status');
    const filterCategory = document.getElementById('filter-category');
    const filterPriority = document.getElementById('filter-priority');
    const prayerModal = document.getElementById('prayer-modal');
    const closePrayerBtn = document.getElementById('close-prayer');
    const prayerModalTitle = document.getElementById('prayer-modal-title');
    const prayerModalStatus = document.getElementById('prayer-modal-status');
    const prayerModalMember = document.getElementById('prayer-modal-member');
    const prayerModalDate = document.getElementById('prayer-modal-date');
    const prayerModalCategory = document.getElementById('prayer-modal-category');
    const prayerModalPriority = document.getElementById('prayer-modal-priority');
    const prayerModalContent = document.getElementById('prayer-modal-content');
    const prayerModalMemberInfo = document.getElementById('prayer-modal-member-info');
    const prayerUpdatesContainer = document.getElementById('prayer-updates');
    const addUpdateBtn = document.getElementById('add-update');
    const updateContent = document.getElementById('update-content');
    const markAnsweredBtn = document.getElementById('mark-answered');
    const answeredNotes = document.getElementById('answered-notes');
    const escalatePrayerBtn = document.getElementById('escalate-prayer');
    const deletePrayerBtn = document.getElementById('delete-prayer');
    const newPrayerBtn = document.getElementById('new-prayer-btn');
    const newPrayerModal = document.getElementById('new-prayer-modal');
    const closeNewPrayerBtn = document.getElementById('close-new-prayer');
    const cancelNewPrayerBtn = document.getElementById('cancel-new-prayer');
    const submitPrayerBtn = document.getElementById('submit-prayer');
    const newPrayerForm = document.getElementById('new-prayer-form');
    const escalateModal = document.getElementById('escalate-modal');
    const closeEscalateBtn = document.getElementById('close-escalate');
    const cancelEscalateBtn = document.getElementById('cancel-escalate');
    const confirmEscalateBtn = document.getElementById('confirm-escalate');
    const regionalLeaderSelect = document.getElementById('regional-leader');
    const escalationNotes = document.getElementById('escalation-notes');

    // Regional leaders data
    const regionalLeaders = [
        { id: "leader1", name: "Pastor John Smith", region: "North Region", email: "john.smith@church.org" },
        { id: "leader2", name: "Pastor Sarah Johnson", region: "East Region", email: "sarah.j@church.org" },
        { id: "leader3", name: "Pastor Michael Brown", region: "West Region", email: "michael.b@church.org" },
        { id: "leader4", name: "Pastor Emily Davis", region: "South Region", email: "emily.d@church.org" }
    ];

    let currentPrayer = null;
    let currentRequests = [...prayerRequests];

    // Initialize the page
    renderRegionalLeaderOptions();
    renderPrayerRequests(currentRequests);
    updateEmptyState();

    // Event Listeners
    prayerSearch.addEventListener('input', filterPrayerRequests);
    filterStatus.addEventListener('change', filterPrayerRequests);
    filterCategory.addEventListener('change', filterPrayerRequests);
    filterPriority.addEventListener('change', filterPrayerRequests);
    closePrayerBtn.addEventListener('click', closePrayerModal);
    markAnsweredBtn.addEventListener('click', markPrayerAnswered);
    escalatePrayerBtn.addEventListener('click', openEscalateModal);
    deletePrayerBtn.addEventListener('click', deletePrayerRequest);
    newPrayerBtn.addEventListener('click', openNewPrayerModal);
    closeNewPrayerBtn.addEventListener('click', closeNewPrayerModal);
    cancelNewPrayerBtn.addEventListener('click', closeNewPrayerModal);
    submitPrayerBtn.addEventListener('click', submitNewPrayer);
    closeEscalateBtn.addEventListener('click', closeEscalateModal);
    cancelEscalateBtn.addEventListener('click', closeEscalateModal);
    confirmEscalateBtn.addEventListener('click', escalateToRegional);
    addUpdateBtn.addEventListener('click', addPrayerUpdate);

    // Render regional leader options in select dropdown
    function renderRegionalLeaderOptions() {
        regionalLeaderSelect.innerHTML = '';
        regionalLeaders.forEach(leader => {
            const option = document.createElement('option');
            option.value = leader.id;
            option.textContent = `${leader.name} (${leader.region})`;
            regionalLeaderSelect.appendChild(option);
        });
    }

    // Filter prayer requests based on search and filters
    function filterPrayerRequests() {
        let filtered = [...prayerRequests];
        const searchTerm = prayerSearch.value.toLowerCase();
        const statusFilter = filterStatus.value;
        const categoryFilter = filterCategory.value;
        const priorityFilter = filterPriority.value;

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(request =>
                request.member.name.toLowerCase().includes(searchTerm) ||
                request.content.toLowerCase().includes(searchTerm) ||
                request.member.group.toLowerCase().includes(searchTerm)
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(request => request.status === statusFilter);
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(request => request.category === categoryFilter);
        }

        // Apply priority filter
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(request => request.priority === priorityFilter);
        }

        currentRequests = filtered;
        renderPrayerRequests(filtered);
        updateEmptyState();
    }

    // Render prayer requests to the DOM
    function renderPrayerRequests(requests) {
        prayerList.innerHTML = '';

        // Sort by priority (urgent > high > medium > low) then by date (newest first)
        requests.sort((a, b) => {
            const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
            if (priorityOrder[b.priority] !== priorityOrder[a.priority]) {
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            }
            return new Date(b.date) - new Date(a.date);
        });

        requests.forEach(request => {
            const prayerItem = document.createElement('div');
            prayerItem.className = 'prayer-item';

            // Get display values
            const categoryDisplay = getCategoryDisplay(request.category);
            const priorityDisplay = getPriorityDisplay(request.priority);

            // Truncate content for preview
            const excerpt = request.content.length > 150
                ? request.content.substring(0, 150) + '...'
                : request.content;

            prayerItem.innerHTML = `
                <div class="prayer-header">
                    <span class="prayer-category ${request.category}">${categoryDisplay}</span>
                    <span class="prayer-priority ${request.priority}">${priorityDisplay}</span>
                    <span class="prayer-status ${request.status}">${request.status}</span>
                </div>
                <h3 class="prayer-title">${request.member.name}</h3>
                <p class="prayer-group"><i class="fas fa-users"></i> ${request.member.group}</p>
                <p class="prayer-excerpt">${excerpt}</p>
                <div class="prayer-meta">
                    <span><i class="far fa-calendar"></i> ${request.date}</span>
                    ${request.updates.length > 0 ? 
                        `<span><i class="fas fa-comment-dots"></i> ${request.updates.length} update${request.updates.length !== 1 ? 's' : ''}</span>` : ''}
                    ${request.escalated ? 
                        `<span class="escalated-info"><i class="fas fa-arrow-up"></i> Escalated</span>` : ''}
                </div>
                <div class="prayer-actions">
                    <button class="btn btn-view" data-id="${request.id}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            `;

            prayerList.appendChild(prayerItem);
        });

        // Add event listeners to view buttons
        document.querySelectorAll('.btn-view').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.dataset.id);
                const request = prayerRequests.find(r => r.id === id);

                if (request) {
                    currentPrayer = request;
                    openPrayerModal(request);
                }
            });
        });
    }

    // Open prayer request modal with details
    function openPrayerModal(request) {
        // Get display values
        const categoryDisplay = getCategoryDisplay(request.category);
        const priorityDisplay = getPriorityDisplay(request.priority);

        // Set modal content
        prayerModalTitle.textContent = `${request.member.name}'s Prayer Request`;
        prayerModalStatus.textContent = request.status;
        prayerModalStatus.className = `prayer-status ${request.status}`;
        prayerModalDate.textContent = request.date;
        prayerModalCategory.textContent = categoryDisplay;
        prayerModalCategory.className = `prayer-category ${request.category}`;
        prayerModalPriority.textContent = priorityDisplay;
        prayerModalPriority.className = `prayer-priority ${request.priority}`;
        prayerModalContent.textContent = request.content;

        // Set member information
        prayerModalMemberInfo.innerHTML = `
            <div class="member-detail">
                <i class="fas fa-id-card"></i>
                <span>Member ID: ${request.member.id}</span>
            </div>
            <div class="member-detail">
                <i class="fas fa-envelope"></i>
                <span>${request.member.email}</span>
            </div>
            <div class="member-detail">
                <i class="fas fa-phone"></i>
                <span>${request.member.phone}</span>
            </div>
            <div class="member-detail">
                <i class="fas fa-users"></i>
                <span>${request.member.group}</span>
            </div>
        `;

        // Render updates
        renderPrayerUpdates(request.updates);

        // Update button visibility based on status
        if (request.status === 'answered') {
            markAnsweredBtn.style.display = 'none';
            escalatePrayerBtn.style.display = 'none';
            document.getElementById('answered-section').style.display = 'block';
            answeredNotes.textContent = request.answeredNotes || 'No additional notes provided';
        } else {
            markAnsweredBtn.style.display = 'inline-block';
            escalatePrayerBtn.style.display = 'inline-block';
            document.getElementById('answered-section').style.display = 'none';
        }

        // Update escalate button if already escalated
        if (request.escalated) {
            escalatePrayerBtn.innerHTML = '<i class="fas fa-info-circle"></i> Already Escalated';
            escalatePrayerBtn.disabled = true;
            document.getElementById('escalated-section').style.display = 'block';
            document.getElementById('escalated-to').textContent = request.escalatedTo.name;
            document.getElementById('escalated-region').textContent = request.escalatedTo.region;
            document.getElementById('escalated-date').textContent = request.escalatedTo.date;
            document.getElementById('escalation-notes-display').textContent = request.escalationNotes || 'No additional notes provided';
        } else {
            escalatePrayerBtn.innerHTML = '<i class="fas fa-arrow-up"></i> Escalate to Regional';
            escalatePrayerBtn.disabled = false;
            document.getElementById('escalated-section').style.display = 'none';
        }

        // Clear update input
        updateContent.value = '';

        prayerModal.classList.add('show');
    }

    // Close prayer modal
    function closePrayerModal() {
        prayerModal.classList.remove('show');
    }

    // Render prayer updates
    function renderPrayerUpdates(updates) {
        prayerUpdatesContainer.innerHTML = '';

        if (updates.length === 0) {
            prayerUpdatesContainer.innerHTML = '<p class="no-updates">No updates yet</p>';
            return;
        }

        updates.forEach(update => {
            const updateElement = document.createElement('div');
            updateElement.className = 'prayer-update';
            updateElement.innerHTML = `
                <div class="update-header">
                    <span class="update-date">${update.date}</span>
                    <span class="update-by">by ${update.by}</span>
                </div>
                <div class="update-content">
                    ${update.text}
                </div>
            `;
            prayerUpdatesContainer.appendChild(updateElement);
        });
    }

    // Add a new update to a prayer request
    function addPrayerUpdate() {
        if (!currentPrayer || !updateContent.value.trim()) return;

        const newUpdate = {
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            text: updateContent.value.trim(),
            by: "Alex Meian" // Current user
        };

        currentPrayer.updates.push(newUpdate);
        renderPrayerUpdates(currentPrayer.updates);
        updateContent.value = '';

        // Update the list to show new update count
        filterPrayerRequests();
    }

    // Mark prayer as answered
    function markPrayerAnswered() {
        if (!currentPrayer) return;

        const notes = answeredNotes.value.trim();
        if (!notes && !confirm('Are you sure you want to mark this as answered without adding any notes?')) {
            return;
        }

        // Update prayer request
        currentPrayer.status = 'answered';
        currentPrayer.answeredDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        currentPrayer.answeredNotes = notes;

        // Add as an update
        currentPrayer.updates.push({
            date: currentPrayer.answeredDate,
            text: `Prayer marked as answered. Notes: ${notes || "No additional notes"}`,
            by: "Alex Meian"
        });

        // Update the modal
        prayerModalStatus.textContent = 'answered';
        prayerModalStatus.className = 'prayer-status answered';
        markAnsweredBtn.style.display = 'none';
        escalatePrayerBtn.style.display = 'none';
        document.getElementById('answered-section').style.display = 'block';
        answeredNotes.textContent = notes;
        renderPrayerUpdates(currentPrayer.updates);

        // Update the list
        filterPrayerRequests();
    }

    // Open escalate modal
    function openEscalateModal() {
        if (!currentPrayer || currentPrayer.escalated) return;
        escalationNotes.value = '';
        escalateModal.classList.add('show');
    }

    // Close escalate modal
    function closeEscalateModal() {
        escalateModal.classList.remove('show');
    }

    // Escalate prayer to regional leader
    function escalateToRegional() {
        if (!currentPrayer) return;

        const leaderId = regionalLeaderSelect.value;
        const leader = regionalLeaders.find(l => l.id === leaderId);
        const notes = escalationNotes.value.trim();

        if (!leader) {
            alert('Please select a regional leader');
            return;
        }

        // Update prayer request
        currentPrayer.status = 'escalated';
        currentPrayer.escalated = true;
        currentPrayer.escalatedTo = {
            name: leader.name,
            region: leader.region,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        };
        currentPrayer.escalationNotes = notes;

        // Add as an update
        currentPrayer.updates.push({
            date: currentPrayer.escalatedTo.date,
            text: `Prayer escalated to ${leader.name} (${leader.region}). Notes: ${notes || "No additional notes"}`,
            by: "Alex Meian"
        });

        // Update the modal
        prayerModalStatus.textContent = 'escalated';
        prayerModalStatus.className = 'prayer-status escalated';
        escalatePrayerBtn.innerHTML = '<i class="fas fa-info-circle"></i> Already Escalated';
        escalatePrayerBtn.disabled = true;
        document.getElementById('escalated-section').style.display = 'block';
        document.getElementById('escalated-to').textContent = leader.name;
        document.getElementById('escalated-region').textContent = leader.region;
        document.getElementById('escalated-date').textContent = currentPrayer.escalatedTo.date;
        document.getElementById('escalation-notes-display').textContent = notes || 'No additional notes provided';
        renderPrayerUpdates(currentPrayer.updates);

        // Close modal
        escalateModal.classList.remove('show');

        // Update the list
        filterPrayerRequests();

        // In a real app, you would send an email notification here
        console.log(`Sending escalation email to ${leader.email}`);
    }

    // Delete prayer request
    function deletePrayerRequest() {
        if (!currentPrayer) return;

        if (confirm('Are you sure you want to delete this prayer request? This cannot be undone.')) {
            // Find and remove from array
            const index = prayerRequests.findIndex(r => r.id === currentPrayer.id);
            if (index !== -1) {
                prayerRequests.splice(index, 1);
            }

            // Close modal and update list
            prayerModal.classList.remove('show');
            filterPrayerRequests();
        }
    }

    // Open new prayer modal
    function openNewPrayerModal() {
        newPrayerForm.reset();
        newPrayerModal.classList.add('show');
    }

    // Close new prayer modal
    function closeNewPrayerModal() {
        newPrayerModal.classList.remove('show');
    }

    // Submit new prayer request
    function submitNewPrayer() {
        const category = document.getElementById('prayer-category').value;
        const content = document.getElementById('prayer-content').value;
        const priority = document.getElementById('prayer-priority').value;
        const escalateNow = document.getElementById('escalate-now').checked;

        if (!category || !content || !priority) {
            alert('Please fill in all required fields');
            return;
        }

        // Create new prayer request
        const newRequest = {
            id: Math.max(...prayerRequests.map(r => r.id), 0) + 1,
            member: {
                name: "Alex Meian",
                id: "L2001",
                email: "alex.m@church.org",
                phone: "(555) 987-6543",
                group: "Leadership Team"
            },
            category: category,
            content: content,
            priority: priority,
            date: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            status: 'pending',
            updates: [],
            escalated: false
        };

        // Escalate immediately if selected
        if (escalateNow) {
            const leaderId = document.getElementById('immediate-leader').value;
            const leader = regionalLeaders.find(l => l.id === leaderId);
            const notes = document.getElementById('immediate-notes').value.trim();

            if (!leader) {
                alert('Please select a regional leader');
                return;
            }

            newRequest.status = 'escalated';
            newRequest.escalated = true;
            newRequest.escalatedTo = {
                name: leader.name,
                region: leader.region,
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            };
            newRequest.escalationNotes = notes;

            // Add as an update
            newRequest.updates.push({
                date: newRequest.escalatedTo.date,
                text: `Prayer escalated to ${leader.name} (${leader.region}). Notes: ${notes || "No additional notes"}`,
                by: "Alex Meian"
            });

            alert('Your prayer request has been submitted and escalated to the regional leader.');
        } else {
            alert('Your prayer request has been submitted.');
        }

        // Add to prayer requests
        prayerRequests.unshift(newRequest);

        // Reset form and close modal
        newPrayerForm.reset();
        newPrayerModal.classList.remove('show');

        // Update the list
        filterPrayerRequests();
    }

    // Update empty state visibility
    function updateEmptyState() {
        if (currentRequests.length === 0) {
            emptyState.style.display = 'block';
            prayerList.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            prayerList.style.display = 'grid';
        }
    }

    // Helper function to get category display name
    function getCategoryDisplay(category) {
        const categories = {
            health: 'Health',
            family: 'Family',
            financial: 'Financial',
            spiritual: 'Spiritual',
            other: 'Other'
        };
        return categories[category] || category;
    }

    // Helper function to get priority display
    function getPriorityDisplay(priority) {
        const priorities = {
            urgent: 'Urgent',
            high: 'High',
            medium: 'Medium',
            low: 'Low'
        };
        return priorities[priority] || priority;
    }
});