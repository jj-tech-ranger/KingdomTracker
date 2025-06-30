document.addEventListener('DOMContentLoaded', function() {
    // Sample data for candidates
    const candidatesData = [
        { id: 1, name: "David Johnson", position: "Worship Leader", stage: "application-received", status: "New", type: "Full-time", contract: "Permanent" },
        { id: 2, name: "Sarah Miller", position: "Children's Ministry", stage: "application-received", status: "Screened", type: "Part-time", contract: "Permanent" },
        { id: 3, name: "Michael Brown", position: "Youth Pastor", stage: "screening", status: "In Review", type: "Full-time", contract: "Permanent" },
        { id: 4, name: "Emily Wilson", position: "Administrative Assistant", stage: "interviewing", status: "Interview 1/3", type: "Part-time", contract: "Permanent" },
        { id: 5, name: "Robert Taylor", position: "Finance Manager", stage: "offer-stage", status: "Offer Pending", type: "Full-time", contract: "Permanent" },
        { id: 6, name: "Jennifer Lee", position: "Sunday School Teacher", stage: "application-received", status: "New", type: "Volunteer", contract: "Volunteer" },
        { id: 7, name: "Thomas Clark", position: "Sound Technician", stage: "screening", status: "In Review", type: "Part-time", contract: "Permanent" },
        { id: 8, name: "Lisa Wong", position: "Outreach Coordinator", stage: "interviewing", status: "Interview 2/3", type: "Full-time", contract: "Permanent" },
        { id: 9, name: "James Smith", position: "Greeter", stage: "application-received", status: "New", type: "Volunteer", contract: "Volunteer" },
        { id: 10, name: "Patricia Johnson", position: "Prayer Team Leader", stage: "offer-stage", status: "Offer Accepted", type: "Part-time", contract: "Permanent" }
    ];

    // Sample data for positions
    const positionsData = [
        { title: "Worship Leader", department: "Music Ministry", type: "Full-time", contract: "Permanent", applications: 5, status: "Active" },
        { title: "Children's Ministry Coordinator", department: "Children's Ministry", type: "Part-time", contract: "Permanent", applications: 3, status: "Active" },
        { title: "Youth Pastor", department: "Youth Ministry", type: "Full-time", contract: "Permanent", applications: 2, status: "Interviewing" },
        { title: "Sunday School Teacher", department: "Children's Ministry", type: "Volunteer", contract: "Volunteer", applications: 4, status: "Active" },
        { title: "Administrative Assistant", department: "Administration", type: "Part-time", contract: "Permanent", applications: 6, status: "Active" },
        { title: "Finance Manager", department: "Finance", type: "Full-time", contract: "Permanent", applications: 1, status: "Offer Pending" },
        { title: "Sound Technician", department: "Music Ministry", type: "Part-time", contract: "Permanent", applications: 2, status: "Active" },
        { title: "Outreach Coordinator", department: "Outreach", type: "Full-time", contract: "Permanent", applications: 3, status: "Interviewing" },
        { title: "Greeter", department: "Hospitality", type: "Volunteer", contract: "Volunteer", applications: 8, status: "Active" },
        { title: "Prayer Team Leader", department: "Prayer Ministry", type: "Part-time", contract: "Permanent", applications: 2, status: "Active" },
        { title: "Graphic Designer", department: "Communications", type: "Part-time", contract: "Fixed-term", applications: 4, status: "Active" },
        { title: "Facilities Manager", department: "Operations", type: "Full-time", contract: "Permanent", applications: 1, status: "Active" },
        { title: "Small Group Leader", department: "Adult Ministry", type: "Volunteer", contract: "Volunteer", applications: 7, status: "Active" },
        { title: "IT Support Specialist", department: "Administration", type: "Part-time", contract: "Fixed-term", applications: 2, status: "Interviewing" },
        { title: "Choir Director", department: "Music Ministry", type: "Part-time", contract: "Permanent", applications: 3, status: "Active" }
    ];

    // Sample data for onboarding
    const onboardingData = {
        name: "Robert Taylor",
        position: "Finance Manager",
        steps: [
            { name: "Offer Accepted", completed: true, date: "05/15/2023" },
            { name: "Background Check", completed: true, date: "05/18/2023" },
            { name: "Orientation Scheduled", completed: false, date: "Due by 05/25/2023", active: true },
            { name: "System Access Setup", completed: false, date: "Pending" },
            { name: "First Week Check-in", completed: false, date: "Pending" }
        ]
    };

    // Initialize modals
    const positionModal = document.getElementById('position-modal');
    const newPositionBtn = document.getElementById('new-position-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    // Render pipeline stages with candidates
    function renderPipelineStages() {
        const pipelineContainer = document.getElementById('pipeline-container');
        const stages = [
            { id: "application-received", title: "Application Received" },
            { id: "screening", title: "Screening" },
            { id: "interviewing", title: "Interviewing" },
            { id: "offer-stage", title: "Offer Stage" }
        ];

        pipelineContainer.innerHTML = stages.map(stage => {
            const stageCandidates = candidatesData.filter(candidate => candidate.stage === stage.id);
            return `
                <div class="pipeline-stage" id="${stage.id}">
                    <h4>${stage.title} <span class="stage-count">(${stageCandidates.length})</span></h4>
                    ${stageCandidates.map(candidate => `
                        <div class="candidate-card" draggable="true" id="candidate-${candidate.id}" data-id="${candidate.id}">
                            <div class="candidate-info">
                                <img src="../img/user.png" alt="Candidate" class="candidate-photo">
                                <div>
                                    <h5>${candidate.name}</h5>
                                    <p>${candidate.position}</p>
                                    <span class="status-badge ${candidate.status === 'New' ? 'new' : ''}">${candidate.status}</span>
                                </div>
                            </div>
                            <div class="candidate-actions">
                                <button class="action-btn view"><i class="fas fa-eye"></i></button>
                                <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }).join('');
    }

    // Render positions table with DataTables
   // Update the renderPositionsTable function in recruitment.js
function renderPositionsTable() {
    const table = $('#positions-table').DataTable({
        data: positionsData,
        pageLength: 5,
        lengthMenu: [5, 10, 15],
        dom: '<"top"lf>rt<"bottom"ip>',
        columns: [
            { data: 'title' },
            { data: 'department' },
            { data: 'type' },
            { data: 'contract' },
            { data: 'applications' },
            {
                data: 'status',
                render: function(data, type, row) {
                    return `<span class="status-badge ${data === 'Active' ? 'active' : ''}">${data}</span>`;
                }
            },
            {
                data: null,
                render: function(data, type, row) {
                    return `
                        <button class="action-btn view"><i class="fas fa-eye"></i></button>
                        <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                    `;
                },
                orderable: false
            }
        ],
        initComplete: function() {
            // This ensures headers are properly styled after initialization
            $('.positions-table thead th').css({
                'background': 'linear-gradient(to right, var(--primary), var(--highlight))',
                'color': 'var(--white)'
            });
        }
    });
}

    // Render onboarding process
    function renderOnboardingProcess() {
        const onboardingCard = document.getElementById('onboarding-card');
        onboardingCard.innerHTML = `
            <div class="progress-tracker">
                ${onboardingData.steps.map((step, index) => `
                    <div class="progress-step ${step.completed ? 'completed' : step.active ? 'active' : ''}">
                        ${step.completed ? '<i class="fas fa-check"></i>' : step.active ? '<i class="fas fa-spinner"></i>' : index + 1}
                    </div>
                    ${index < onboardingData.steps.length - 1 ? '<div class="progress-line"></div>' : ''}
                `).join('')}
            </div>
            <div class="onboarding-details">
                <h4>${onboardingData.name} - ${onboardingData.position}</h4>
                <div class="onboarding-tasks">
                    ${onboardingData.steps.map(step => `
                        <div class="task ${step.completed ? 'completed' : step.active ? 'active' : ''}">
                            <i class="${step.completed ? 'fas fa-check-circle' : step.active ? 'fas fa-spinner' : 'far fa-circle'}"></i>
                            <span>${step.name}</span>
                            <small>${step.date}</small>
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="onboarding-actions">
                <button class="btn btn-primary"><i class="fas fa-envelope"></i> Send Welcome Email</button>
                <button class="btn btn-secondary"><i class="fas fa-edit"></i> Edit Timeline</button>
            </div>
        `;
    }

    // Open position modal
    if (newPositionBtn) {
        newPositionBtn.addEventListener('click', function() {
            positionModal.style.display = 'block';
        });
    }

    // Close modal
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            positionModal.style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === positionModal) {
            positionModal.style.display = 'none';
        }
    });

    // Form submission
    const positionForm = document.getElementById('position-form');
    if (positionForm) {
        positionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the data to your backend
            alert('New position created successfully!');
            positionModal.style.display = 'none';
            positionForm.reset();
        });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.btn-group .btn-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            // Here you would filter the positions/candidates
            console.log('Filter applied:', this.textContent);
        });
    });

    // Drag and drop functionality
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    document.addEventListener('drop', function(e) {
        e.preventDefault();
    });

    function setupDragAndDrop() {
        let draggedItem = null;

        document.querySelectorAll('.candidate-card').forEach(item => {
            item.addEventListener('dragstart', function() {
                draggedItem = this;
                setTimeout(() => {
                    this.classList.add('dragging');
                }, 0);
            });

            item.addEventListener('dragend', function() {
                this.classList.remove('dragging');
            });
        });

        document.querySelectorAll('.pipeline-stage').forEach(stage => {
            stage.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('drop-zone');
            });

            stage.addEventListener('dragleave', function() {
                this.classList.remove('drop-zone');
            });

            stage.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('drop-zone');

                if (draggedItem) {
                    this.appendChild(draggedItem);
                    const candidateId = parseInt(draggedItem.getAttribute('data-id'));
                    const newStage = this.id;

                    // Update the candidate's stage in the data
                    const candidate = candidatesData.find(c => c.id === candidateId);
                    if (candidate) {
                        candidate.stage = newStage;
                        updateCandidateStatus(candidate, newStage);
                    }

                    // Update stage counts
                    updateStageCounts();
                }
            });
        });
    }

    function updateCandidateStatus(candidate, newStage) {
        switch(newStage) {
            case 'application-received':
                candidate.status = 'New';
                break;
            case 'screening':
                candidate.status = 'In Review';
                break;
            case 'interviewing':
                candidate.status = 'Interviewing';
                break;
            case 'offer-stage':
                candidate.status = 'Offer Pending';
                break;
        }
    }

    // Update stage counts
    function updateStageCounts() {
        document.querySelectorAll('.pipeline-stage').forEach(stage => {
            const count = stage.querySelectorAll('.candidate-card').length;
            const countElement = stage.querySelector('.stage-count');
            if (countElement) {
                countElement.textContent = `(${count})`;
            }
        });
    }

    // Add candidate button
    const addCandidateBtn = document.getElementById('add-candidate-btn');
    if (addCandidateBtn) {
        addCandidateBtn.addEventListener('click', function() {
            // This would typically open a modal to add a new candidate
            alert('Open "Add New Candidate" form');
        });
    }

    // Action buttons for candidates
    document.addEventListener('click', function(e) {
        if (e.target.closest('.candidate-actions .action-btn')) {
            const btn = e.target.closest('.candidate-actions .action-btn');
            const card = btn.closest('.candidate-card');
            const candidateId = parseInt(card.getAttribute('data-id'));
            const candidate = candidatesData.find(c => c.id === candidateId);

            if (btn.classList.contains('view')) {
                alert(`View details for ${candidate.name}`);
            } else if (btn.classList.contains('edit')) {
                alert(`Edit ${candidate.name}`);
            }
        }

        if (e.target.closest('.positions-table .action-btn')) {
            const btn = e.target.closest('.positions-table .action-btn');
            const row = btn.closest('tr');
            const positionTitle = row.querySelector('td').textContent;

            if (btn.classList.contains('view')) {
                alert(`View details for ${positionTitle}`);
            } else if (btn.classList.contains('edit')) {
                alert(`Edit ${positionTitle}`);
            } else if (btn.classList.contains('delete')) {
                if (confirm(`Are you sure you want to delete the ${positionTitle} position?`)) {
                    const table = $('#positions-table').DataTable();
                    table.row(row).remove().draw();
                    alert(`${positionTitle} position deleted`);
                }
            }
        }
    });

    // Initialize all components
    renderPipelineStages();
    renderPositionsTable();
    renderOnboardingProcess();
    setupDragAndDrop();
});