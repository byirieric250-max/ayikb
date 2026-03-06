// Projects Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeProjects();
});

function initializeProjects() {
    setupProjectFilters();
    setupModalHandlers();
    setupProjectActions();
    initializeProjectCharts();
    setupDragAndDrop();
}

function setupProjectFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const typeFilter = document.getElementById('typeFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterProjects);
    }
    
    if (typeFilter) {
        typeFilter.addEventListener('change', filterProjects);
    }
}

function filterProjects() {
    const statusFilter = document.getElementById('statusFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        const cardStatus = card.dataset.status;
        const cardType = card.dataset.type;
        
        const statusMatch = statusFilter === 'all' || cardStatus === statusFilter;
        const typeMatch = typeFilter === 'all' || cardType === typeFilter;
        
        if (statusMatch && typeMatch) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
    
    updateProjectStats();
}

function updateProjectStats() {
    const visibleCards = document.querySelectorAll('.project-card:not([style*="display: none"])');
    const statsNumbers = document.querySelectorAll('.stat-number');
    
    if (statsNumbers.length >= 1) {
        statsNumbers[0].textContent = visibleCards.length; // Total projects
    }
    
    const activeCount = Array.from(visibleCards).filter(card => 
        card.dataset.status === 'active').length;
    if (statsNumbers.length >= 2) {
        statsNumbers[1].textContent = activeCount; // Active projects
    }
    
    const planningCount = Array.from(visibleCards).filter(card => 
        card.dataset.status === 'planning').length;
    if (statsNumbers.length >= 3) {
        statsNumbers[2].textContent = planningCount; // Planning projects
    }
}

function setupModalHandlers() {
    // Add Project Modal
    window.showAddProjectModal = function() {
        const modal = document.getElementById('addProjectModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    };
    
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            // Reset form
            const form = modal.querySelector('form');
            if (form) form.reset();
        }
    };
    
    // Handle form submission
    const addProjectForm = document.getElementById('addProjectForm');
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewProject(this);
        });
    }
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
}

function addNewProject(form) {
    const formData = new FormData(form);
    const projectData = {
        name: formData.get('projectName'),
        type: formData.get('projectType'),
        budget: formData.get('budget'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        description: formData.get('description')
    };
    
    // Create new project card
    const projectCard = createProjectCard(projectData);
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid) {
        projectsGrid.appendChild(projectCard);
        
        // Animate the new card
        projectCard.style.animation = 'fadeInUp 0.5s ease';
        
        // Show success message
        showNotification('Project added successfully!', 'success');
        
        // Close modal
        closeModal('addProjectModal');
        
        // Update stats
        updateProjectStats();
    }
}

function createProjectCard(projectData) {
    const card = document.createElement('div');
    card.className = 'project-card active';
    card.dataset.status = 'active';
    card.dataset.type = projectData.type;
    
    const typeIcons = {
        'agriculture': 'fas fa-seedling',
        'livestock': 'fas fa-pig',
        'training': 'fas fa-graduation-cap',
        'other': 'fas fa-folder'
    };
    
    const icon = typeIcons[projectData.type] || 'fas fa-folder';
    
    card.innerHTML = `
        <div class="project-header">
            <div class="project-icon">
                <i class="${icon}"></i>
            </div>
            <div class="project-info">
                <h3>${projectData.name}</h3>
                <span class="project-status active">Active</span>
            </div>
        </div>
        <div class="project-details">
            <div class="detail-row">
                <span class="label">Ingengo y'imari:</span>
                <span class="value">${parseInt(projectData.budget).toLocaleString()} Frw</span>
            </div>
            <div class="detail-row">
                <span class="label">Itariki yo gutangira:</span>
                <span class="value">${formatDate(projectData.startDate)}</span>
            </div>
            <div class="detail-row">
                <span class="label">Itariki yo kurangira:</span>
                <span class="value">${formatDate(projectData.endDate)}</span>
            </div>
            <div class="detail-row">
                <span class="label">Progress:</span>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <span class="progress-text">0%</span>
            </div>
        </div>
        <div class="project-activities">
            <h4>Ibikorwa</h4>
            <ul>
                <li>${projectData.description || 'Project description'}</li>
            </ul>
        </div>
        <div class="project-actions">
            <button class="btn btn-sm btn-primary" onclick="viewProjectDetails(${Date.now()})">
                <i class="fas fa-eye"></i> Reba
            </button>
            <button class="btn btn-sm btn-secondary" onclick="editProject(${Date.now()})">
                <i class="fas fa-edit"></i> Hindura
            </button>
        </div>
    `;
    
    return card;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('rw-RW');
}

function setupProjectActions() {
    window.viewProjectDetails = function(projectId) {
        showNotification(`Viewing details for project ${projectId}`, 'info');
    };
    
    window.editProject = function(projectId) {
        showNotification(`Editing project ${projectId}`, 'info');
    };
    
    window.deleteProject = function(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            showNotification(`Project ${projectId} deleted`, 'success');
        }
    };
}

function initializeProjectCharts() {
    // Project timeline chart
    const timelineCtx = document.getElementById('projectTimeline');
    if (timelineCtx) {
        new Chart(timelineCtx, {
            type: 'bar',
            data: {
                labels: ['Phase 1', 'Phase 2', 'Phase 3', 'Training'],
                datasets: [{
                    label: 'Progress (%)',
                    data: [75, 25, 10, 60],
                    backgroundColor: ['#2ecc71', '#3498db', '#e74c3c', '#f39c12']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    // Budget utilization chart
    const budgetCtx = document.getElementById('budgetChart');
    if (budgetCtx) {
        new Chart(budgetCtx, {
            type: 'doughnut',
            data: {
                labels: ['Phase 1', 'Phase 2', 'Phase 3', 'Training'],
                datasets: [{
                    data: [1000000, 800000, 1000000, 500000],
                    backgroundColor: ['#2ecc71', '#3498db', '#e74c3c', '#f39c12']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

function setupDragAndDrop() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.draggable = true;
        
        card.addEventListener('dragstart', function(e) {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', this.innerHTML);
            this.classList.add('dragging');
        });
        
        card.addEventListener('dragend', function() {
            this.classList.remove('dragging');
        });
        
        card.addEventListener('dragover', function(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'move';
            this.classList.add('drag-over');
            return false;
        });
        
        card.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        card.addEventListener('drop', function(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            
            this.classList.remove('drag-over');
            showNotification('Project order updated', 'success');
            return false;
        });
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Search functionality
function setupProjectSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search projects...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        margin-bottom: 1rem;
    `;
    
    const actionsDiv = document.querySelector('.projects-actions');
    if (actionsDiv) {
        actionsDiv.appendChild(searchInput);
        
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const projectCards = document.querySelectorAll('.project-card');
            
            projectCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('.project-activities').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Initialize search when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupProjectSearch();
});

// Export functionality
function exportProjects(format) {
    const projects = [];
    document.querySelectorAll('.project-card').forEach(card => {
        projects.push({
            name: card.querySelector('h3').textContent,
            status: card.querySelector('.project-status').textContent,
            budget: card.querySelector('.detail-row:nth-child(1) .value').textContent,
            startDate: card.querySelector('.detail-row:nth-child(2) .value').textContent,
            endDate: card.querySelector('.detail-row:nth-child(3) .value').textContent
        });
    });
    
    if (format === 'csv') {
        exportToCSV(projects);
    } else if (format === 'json') {
        exportToJSON(projects);
    }
}

function exportToCSV(data) {
    const headers = ['Name', 'Status', 'Budget', 'Start Date', 'End Date'];
    const csvContent = [
        headers.join(','),
        ...data.map(project => [
            project.name,
            project.status,
            project.budget,
            project.startDate,
            project.endDate
        ].join(','))
    ].join('\n');
    
    downloadFile(csvContent, 'projects.csv', 'text/csv');
}

function exportToJSON(data) {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'projects.json', 'application/json');
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Add export buttons to the actions section
function addExportButtons() {
    const exportDiv = document.createElement('div');
    exportDiv.className = 'export-actions';
    exportDiv.innerHTML = `
        <button class="btn btn-success" onclick="exportProjects('csv')">
            <i class="fas fa-file-csv"></i> Export CSV
        </button>
        <button class="btn btn-info" onclick="exportProjects('json')">
            <i class="fas fa-file-code"></i> Export JSON
        </button>
    `;
    
    const actionsDiv = document.querySelector('.projects-actions');
    if (actionsDiv) {
        actionsDiv.appendChild(exportDiv);
    }
}

// Initialize export buttons
document.addEventListener('DOMContentLoaded', function() {
    addExportButtons();
});
