document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding content
            const tabId = button.getAttribute('data-tab') + '-tab';
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Modal functionality
    const uploadModal = document.getElementById('upload-modal');
    const uploadBtn = document.getElementById('upload-document');
    const closeModal = document.querySelector('.close-modal');

    uploadBtn.addEventListener('click', () => {
        uploadModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        uploadModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === uploadModal) {
            uploadModal.style.display = 'none';
        }
    });

    // Document upload form handling
    const uploadForm = document.getElementById('document-upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Here you would typically handle the file upload via AJAX
            // For this example, we'll just show a success message and close the modal
            alert('Document uploaded successfully!');
            uploadModal.style.display = 'none';
            uploadForm.reset();
        });
    }

    // New incident report button
    const newIncidentBtn = document.getElementById('new-incident');
    if (newIncidentBtn) {
        newIncidentBtn.addEventListener('click', () => {
            // In a real implementation, this would open a modal or redirect to a form
            alert('New incident report form would open here');
        });
    }

    // New policy button
    const newPolicyBtn = document.getElementById('new-policy');
    if (newPolicyBtn) {
        newPolicyBtn.addEventListener('click', () => {
            // In a real implementation, this would open a modal or redirect to a form
            alert('New policy creation form would open here');
        });
    }

    // Document filter functionality
    const documentFilters = document.querySelectorAll('.document-filter select');
    documentFilters.forEach(filter => {
        filter.addEventListener('change', function() {
            const filterValue = this.value.toLowerCase();
            const documentCards = this.closest('.tab-content').querySelectorAll('.document-card');

            documentCards.forEach(card => {
                const cardCategory = card.querySelector('.document-meta span:first-child').textContent.toLowerCase();
                if (filterValue === 'all categories' || filterValue === 'all staff' || cardCategory.includes(filterValue)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Incident filter functionality
    const incidentFilter = document.querySelector('.incident-filter select');
    if (incidentFilter) {
        incidentFilter.addEventListener('change', function() {
            const filterValue = this.value.toLowerCase();
            const incidentCards = document.querySelectorAll('.incident-card');

            incidentCards.forEach(card => {
                const statusBadge = card.querySelector('.status-badge').textContent.toLowerCase();
                if (filterValue === 'all incidents' || statusBadge.includes(filterValue)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Document search functionality
    const documentSearches = document.querySelectorAll('.document-search input');
    documentSearches.forEach(search => {
        search.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const documentCards = this.closest('.tab-content').querySelectorAll('.document-card h4');

            documentCards.forEach(card => {
                const cardTitle = card.textContent.toLowerCase();
                const cardElement = card.closest('.document-card');

                if (cardTitle.includes(searchTerm)) {
                    cardElement.style.display = 'flex';
                } else {
                    cardElement.style.display = 'none';
                }
            });
        });
    });

    // Action buttons functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.action-btn.view')) {
            const docTitle = e.target.closest('.document-card').querySelector('h4').textContent;
            alert(`Viewing document: ${docTitle}`);
        }

        if (e.target.closest('.action-btn.download')) {
            const docTitle = e.target.closest('.document-card').querySelector('h4').textContent;
            alert(`Downloading document: ${docTitle}`);
        }

        if (e.target.closest('.action-btn.history')) {
            const docTitle = e.target.closest('.document-card').querySelector('h4').textContent;
            alert(`Showing version history for: ${docTitle}`);
        }

        if (e.target.closest('.action-btn.upload')) {
            const personName = e.target.closest('.document-card').querySelector('h4').textContent;
            alert(`Uploading to ${personName}'s file`);
        }
    });

    // Renewal buttons in expiry alerts
    document.addEventListener('click', function(e) {
        if (e.target.closest('.alert-item button')) {
            const alertText = e.target.closest('.alert-item').querySelector('span:first-child').textContent;
            alert(`Initiating renewal process for: ${alertText}`);
        }
    });

    // Training session buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.training-actions button:first-child')) {
            const trainingTitle = e.target.closest('.training-item').querySelector('h4').textContent;
            alert(`Viewing records for: ${trainingTitle}`);
        }

        if (e.target.closest('.training-actions button:last-child')) {
            const trainingTitle = e.target.closest('.training-item').querySelector('h4').textContent;
            alert(`Scheduling session for: ${trainingTitle}`);
        }
    });

    // Incident detail buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.incident-status button')) {
            const incidentTitle = e.target.closest('.incident-card').querySelector('h4').textContent;
            alert(`Viewing details for incident: ${incidentTitle}`);
        }
    });
});