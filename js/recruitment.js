document.addEventListener('DOMContentLoaded', function() {
    // Initialize modals
    const positionModal = document.getElementById('position-modal');
    const newPositionBtn = document.getElementById('new-position-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');

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
                // Here you would update the candidate's status in your backend
                console.log('Candidate moved to:', this.id);

                // Update status badge based on the new stage
                const statusBadge = draggedItem.querySelector('.status-badge');
                if (statusBadge) {
                    switch(this.id) {
                        case 'application-received':
                            statusBadge.textContent = 'New';
                            statusBadge.className = 'status-badge new';
                            break;
                        case 'screening':
                            statusBadge.textContent = 'In Review';
                            statusBadge.className = 'status-badge';
                            break;
                        case 'interviewing':
                            statusBadge.textContent = 'Interviewing';
                            statusBadge.className = 'status-badge';
                            break;
                        case 'offer-stage':
                            statusBadge.textContent = 'Offer Pending';
                            statusBadge.className = 'status-badge';
                            break;
                    }
                }
            }
        });
    });

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

    // Initialize counts
    updateStageCounts();

    // Add candidate button
    const addCandidateBtn = document.getElementById('add-candidate-btn');
    if (addCandidateBtn) {
        addCandidateBtn.addEventListener('click', function() {
            // This would typically open a modal to add a new candidate
            alert('Open "Add New Candidate" form');
        });
    }

    // Action buttons for candidates
    document.querySelectorAll('.candidate-actions .action-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.candidate-card');
            const candidateName = card.querySelector('h5').textContent;

            if (this.classList.contains('view')) {
                alert(`View details for ${candidateName}`);
            } else if (this.classList.contains('edit')) {
                alert(`Edit ${candidateName}`);
            }
        });
    });

    // Action buttons for positions
    document.querySelectorAll('.positions-table .action-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const row = this.closest('tr');
            const positionTitle = row.querySelector('td').textContent;

            if (this.classList.contains('view')) {
                alert(`View details for ${positionTitle}`);
            } else if (this.classList.contains('edit')) {
                alert(`Edit ${positionTitle}`);
            } else if (this.classList.contains('delete')) {
                if (confirm(`Are you sure you want to delete the ${positionTitle} position?`)) {
                    row.remove();
                    alert(`${positionTitle} position deleted`);
                }
            }
        });
    });
});