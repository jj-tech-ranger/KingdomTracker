document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    animateProgressBar();
});

// Theme Management
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

function loadThemePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// Progress Bar Animation
function animateProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        const progressPercentage = 80; // Matches the HR dashboard's 80% engagement
        progressFill.style.width = `${progressPercentage}%`;
    }
}

loadThemePreference();
// Members Page Functionality
function initializeMemberPage() {
    // Add click handlers for action buttons
    document.querySelectorAll('.action-btn.view').forEach(btn => {
        btn.addEventListener('click', () => {
            // View member details logic
            console.log('View member clicked');
        });
    });

    document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', () => {
            // Edit member logic
            console.log('Edit member clicked');
        });
    });

    document.querySelectorAll('.action-btn.delete').forEach(btn => {
        btn.addEventListener('click', () => {
            // Delete member logic with confirmation
            if (confirm('Are you sure you want to delete this member?')) {
                console.log('Delete confirmed');
            }
        });
    });

    // Pagination button handlers
    document.querySelectorAll('.pagination-btn:not(:disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.classList.contains('active')) {
                document.querySelector('.pagination-btn.active').classList.remove('active');
                btn.classList.add('active');
                // Here you would typically load the new page data
                console.log('Page changed');
            }
        });
    });

    // Add new member button
    document.querySelector('.btn-primary')?.addEventListener('click', () => {
        // Open add member modal or page
        console.log('Add new member clicked');
    });
}

if (document.querySelector('.members-table')) {
    initializeMemberPage();
}
// Recruitment Page Functionality
function initRecruitmentPage() {
    // New Position Modal
    document.getElementById('new-position-btn')?.addEventListener('click', () => {
        // Code to open position creation modal
        console.log('Open new position form');
    });

    // Pipeline Drag-and-Drop (simplified example)
    const candidateCards = document.querySelectorAll('.candidate-card');
    candidateCards.forEach(card => {
        card.setAttribute('draggable', true);
        card.addEventListener('dragstart', handleDragStart);
    });

    const stages = document.querySelectorAll('.pipeline-stage');
    stages.forEach(stage => {
        stage.addEventListener('dragover', handleDragOver);
        stage.addEventListener('drop', handleDrop);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    const card = document.getElementById(cardId);
    e.currentTarget.appendChild(card);
}

// Initialize if on recruitment page
if (document.querySelector('.pipeline-container')) {
    initRecruitmentPage();
}