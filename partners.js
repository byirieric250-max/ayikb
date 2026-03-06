// Partners Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializePartners();
});

function initializePartners() {
    setupPartnerFilters();
    setupModalHandlers();
    setupPartnerActions();
    initializePartnerCharts();
    setupPartnershipOpportunities();
}

function setupPartnerFilters() {
    const typeFilter = document.getElementById('typeFilter');
    const statusFilter = document.getElementById('statusFilter');
    
    if (typeFilter) {
        typeFilter.addEventListener('change', filterPartners);
    }
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterPartners);
    }
}

function filterPartners() {
    const typeFilter = document.getElementById('typeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const partnerCards = document.querySelectorAll('.partner-card');
    
    partnerCards.forEach(card => {
        const cardType = card.dataset.type;
        const cardStatus = card.dataset.status;
        
        const typeMatch = typeFilter === 'all' || cardType === typeFilter;
        const statusMatch = statusFilter === 'all' || cardStatus === statusFilter;
        
        if (typeMatch && statusMatch) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
    
    updatePartnerStats();
}

function updatePartnerStats() {
    const visibleCards = document.querySelectorAll('.partner-card:not([style*="display: none"])');
    const statsNumbers = document.querySelectorAll('.stat-number');
    
    if (statsNumbers.length >= 1) {
        statsNumbers[0].textContent = visibleCards.length; // Total partners
    }
    
    const activeCount = Array.from(visibleCards).filter(card => 
        card.dataset.status === 'active').length;
    if (statsNumbers.length >= 2) {
        statsNumbers[1].textContent = activeCount; // Active partners
    }
    
    const pendingCount = Array.from(visibleCards).filter(card => 
        card.dataset.status === 'pending').length;
    if (statsNumbers.length >= 3) {
        statsNumbers[2].textContent = pendingCount; // Pending partners
    }
}

function setupModalHandlers() {
    // Add Partner Modal
    window.showAddPartnerModal = function() {
        const modal = document.getElementById('addPartnerModal');
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
    const addPartnerForm = document.getElementById('addPartnerForm');
    if (addPartnerForm) {
        addPartnerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewPartner(this);
        });
    }
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
}

function addNewPartner(form) {
    const formData = new FormData(form);
    const partnerData = {
        name: formData.get('partnerName'),
        type: formData.get('partnerType'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        contactPerson: formData.get('contactPerson'),
        description: formData.get('description'),
        contributions: formData.get('contributions')
    };
    
    // Create new partner card
    const partnerCard = createPartnerCard(partnerData);
    const partnersGrid = document.getElementById('partnersGrid');
    if (partnersGrid) {
        partnersGrid.appendChild(partnerCard);
        
        // Animate the new card
        partnerCard.style.animation = 'fadeInUp 0.5s ease';
        
        // Show success message
        showNotification('Partner added successfully!', 'success');
        
        // Close modal
        closeModal('addPartnerModal');
        
        // Update stats
        updatePartnerStats();
    }
}

function createPartnerCard(partnerData) {
    const card = document.createElement('div');
    card.className = 'partner-card active';
    card.dataset.type = partnerData.type;
    card.dataset.status = 'active';
    
    const typeIcons = {
        'government': 'fas fa-landmark',
        'ngo': 'fas fa-hands-helping',
        'private': 'fas fa-building',
        'financial': 'fas fa-piggy-bank',
        'educational': 'fas fa-graduation-cap',
        'other': 'fas fa-globe'
    };
    
    const typeLabels = {
        'government': 'Leta',
        'ngo': 'NGO',
        'private': 'Private',
        'financial': 'Banki',
        'educational': 'Shuli',
        'other': 'Ikindi'
    };
    
    const icon = typeIcons[partnerData.type] || 'fas fa-globe';
    const label = typeLabels[partnerData.type] || 'Ikindi';
    
    card.innerHTML = `
        <div class="partner-header">
            <div class="partner-logo">
                <i class="${icon}"></i>
            </div>
            <div class="partner-info">
                <h3>${partnerData.name}</h3>
                <span class="partner-type">${label}</span>
                <span class="partner-status active">Bakorana</span>
            </div>
        </div>
        <div class="partner-details">
            <div class="detail-row">
                <span class="label"><i class="fas fa-envelope"></i> Email:</span>
                <span class="value">${partnerData.email}</span>
            </div>
            <div class="detail-row">
                <span class="label"><i class="fas fa-phone"></i> Telefoni:</span>
                <span class="value">${partnerData.phone}</span>
            </div>
            <div class="detail-row">
                <span class="label"><i class="fas fa-map-marker-alt"></i> Address:</span>
                <span class="value">${partnerData.address}</span>
            </div>
            <div class="detail-row">
                <span class="label"><i class="fas fa-user"></i> Contact Person:</span>
                <span class="value">${partnerData.contactPerson}</span>
            </div>
        </div>
        <div class="partner-description">
            <p>${partnerData.description || 'Partner description'}</p>
        </div>
        <div class="partner-contributions">
            <h4>Twakoreye hamwe:</h4>
            <ul>
                <li>${partnerData.contributions || 'Partnership contributions'}</li>
            </ul>
        </div>
        <div class="partner-actions">
            <button class="btn btn-sm btn-primary" onclick="viewPartnerDetails(${Date.now()})">
                <i class="fas fa-eye"></i> Reba
            </button>
            <button class="btn btn-sm btn-info" onclick="contactPartner(${Date.now()})">
                <i class="fas fa-envelope"></i> Twarabize
            </button>
            <button class="btn btn-sm btn-secondary" onclick="editPartner(${Date.now()})">
                <i class="fas fa-edit"></i> Hindura
            </button>
        </div>
    `;
    
    return card;
}

function setupPartnerActions() {
    window.viewPartnerDetails = function(partnerId) {
        showPartnerDetailsModal(partnerId);
    };
    
    window.contactPartner = function(partnerId) {
        showContactModal(partnerId);
    };
    
    window.editPartner = function(partnerId) {
        showNotification(`Editing partner ${partnerId}`, 'info');
    };
    
    window.deletePartner = function(partnerId) {
        if (confirm('Are you sure you want to delete this partner?')) {
            showNotification(`Partner ${partnerId} deleted`, 'success');
        }
    };
}

function showPartnerDetailsModal(partnerId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Partner Details</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="partner-detail-view">
                    <h4>Partnership History</h4>
                    <div class="partnership-timeline">
                        <div class="timeline-item">
                            <div class="timeline-date">01/01/2024</div>
                            <div class="timeline-content">
                                <h5>Partnership Established</h5>
                                <p>Initial partnership agreement signed</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">15/02/2024</div>
                            <div class="timeline-content">
                                <h5>First Project Collaboration</h5>
                                <p>Agriculture training program initiated</p>
                            </div>
                        </div>
                        <div class="timeline-item">
                            <div class="timeline-date">20/03/2024</div>
                            <div class="timeline-content">
                                <h5>Funding Provided</h5>
                                <p>Financial support for Phase 1 project</p>
                            </div>
                        </div>
                    </div>
                    
                    <h4>Project Collaborations</h4>
                    <div class="collaboration-list">
                        <div class="collaboration-item">
                            <h5>Phase 1: Agriculture</h5>
                            <p>Contribution: 2,000,000 Frw</p>
                            <p>Status: Active</p>
                        </div>
                        <div class="collaboration-item">
                            <h5>Youth Training Program</h5>
                            <p>Contribution: 800,000 Frw</p>
                            <p>Status: Completed</p>
                        </div>
                    </div>
                    
                    <h4>Communication Log</h4>
                    <div class="communication-log">
                        <div class="log-item">
                            <span class="log-date">25/03/2024</span>
                            <span class="log-type">Email</span>
                            <span class="log-content">Meeting scheduled for next month</span>
                        </div>
                        <div class="log-item">
                            <span class="log-date">20/03/2024</span>
                            <span class="log-type">Phone</span>
                            <span class="log-content">Project progress discussion</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function showContactModal(partnerId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Contact Partner</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <form id="contactPartnerForm">
                    <div class="form-group">
                        <label>Subject:</label>
                        <input type="text" name="subject" required>
                    </div>
                    <div class="form-group">
                        <label>Message:</label>
                        <textarea name="message" rows="5" required></textarea>
                    </div>
                    <div class="form-group">
                        <label>Communication Method:</label>
                        <select name="method">
                            <option value="email">Email</option>
                            <option value="phone">Phone Call</option>
                            <option value="meeting">Meeting</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Handle form submission
    const form = modal.querySelector('#contactPartnerForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        showNotification('Message sent to partner successfully!', 'success');
        modal.remove();
    });
}

function initializePartnerCharts() {
    // Partner contribution chart
    const contributionCtx = document.getElementById('partnerContributionChart');
    if (contributionCtx) {
        new Chart(contributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Kirehe District', 'MINAGRI', 'BDF', 'RYAF', 'NGOs'],
                datasets: [{
                    data: [2000000, 1500000, 1000000, 800000, 500000],
                    backgroundColor: ['#2ecc71', '#3498db', '#e74c3c', '#f39c12', '#9b59b6']
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
    
    // Partner type distribution
    const typeCtx = document.getElementById('partnerTypeChart');
    if (typeCtx) {
        new Chart(typeCtx, {
            type: 'pie',
            data: {
                labels: ['Government', 'NGO', 'Financial', 'Private'],
                datasets: [{
                    data: [2, 1, 1, 0],
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

function setupPartnershipOpportunities() {
    const opportunityButtons = document.querySelectorAll('.opportunity-card button');
    opportunityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const opportunityTitle = this.closest('.opportunity-card').querySelector('h3').textContent;
            showOpportunityDetails(opportunityTitle);
        });
    });
}

function showOpportunityDetails(title) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="opportunity-details">
                    <h4>Opportunity Overview</h4>
                    <p>This partnership opportunity aims to enhance collaboration and mutual growth.</p>
                    
                    <h4>Benefits</h4>
                    <ul>
                        <li>Increased market reach</li>
                        <li>Resource sharing</li>
                        <li>Joint funding opportunities</li>
                        <li>Knowledge exchange</li>
                    </ul>
                    
                    <h4>Requirements</h4>
                    <ul>
                        <li>Commitment to collaboration</li>
                        <li>Regular communication</li>
                        <li>Shared goals and values</li>
                        <li>Resource contribution</li>
                    </ul>
                    
                    <h4>Next Steps</h4>
                    <p>To proceed with this partnership opportunity, please contact our partnership coordinator.</p>
                    
                    <div class="opportunity-actions">
                        <button class="btn btn-primary" onclick="applyForPartnership()">Apply for Partnership</button>
                        <button class="btn btn-info" onclick="scheduleMeeting()">Schedule Meeting</button>
                        <button class="btn btn-secondary" onclick="downloadInfo()">Download Information</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

window.applyForPartnership = function() {
    showNotification('Partnership application submitted!', 'success');
};

window.scheduleMeeting = function() {
    showNotification('Meeting scheduling interface would open here', 'info');
};

window.downloadInfo = function() {
    showNotification('Partnership information downloaded!', 'success');
};

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

// Partnership analytics
function generatePartnershipReport() {
    const partners = document.querySelectorAll('.partner-card');
    const report = {
        totalPartners: partners.length,
        activePartners: Array.from(partners).filter(p => p.dataset.status === 'active').length,
        partnerTypes: {},
        totalContributions: 0
    };
    
    partners.forEach(partner => {
        const type = partner.dataset.type;
        report.partnerTypes[type] = (report.partnerTypes[type] || 0) + 1;
    });
    
    return report;
}

// Export partnership data
function exportPartnershipData(format) {
    const report = generatePartnershipReport();
    
    if (format === 'csv') {
        exportToCSV(report);
    } else if (format === 'json') {
        exportToJSON(report);
    }
}

function exportToCSV(data) {
    const csvContent = `Metric,Value\nTotal Partners,${data.totalPartners}\nActive Partners,${data.activePartners}`;
    downloadFile(csvContent, 'partnership_report.csv', 'text/csv');
}

function exportToJSON(data) {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, 'partnership_report.json', 'application/json');
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

// Add partnership styles
const partnershipStyles = document.createElement('style');
partnershipStyles.textContent = `
    .partnership-timeline {
        position: relative;
        padding-left: 30px;
        margin: 1rem 0;
    }
    
    .partnership-timeline::before {
        content: '';
        position: absolute;
        left: 10px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: #2ecc71;
    }
    
    .timeline-item {
        position: relative;
        margin-bottom: 1.5rem;
    }
    
    .timeline-item::before {
        content: '';
        position: absolute;
        left: -25px;
        top: 5px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #2ecc71;
        border: 2px solid white;
    }
    
    .timeline-date {
        font-size: 0.9rem;
        color: #666;
        display: block;
        margin-bottom: 0.25rem;
    }
    
    .timeline-content h5 {
        margin: 0 0 0.25rem 0;
        color: #2c3e50;
    }
    
    .timeline-content p {
        margin: 0;
        color: #666;
    }
    
    .collaboration-list {
        margin: 1rem 0;
    }
    
    .collaboration-item {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 5px;
        margin-bottom: 0.5rem;
    }
    
    .collaboration-item h5 {
        margin: 0 0 0.5rem 0;
        color: #2c3e50;
    }
    
    .collaboration-item p {
        margin: 0.25rem 0;
        color: #666;
    }
    
    .communication-log {
        margin: 1rem 0;
    }
    
    .log-item {
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
    }
    
    .log-date {
        font-size: 0.9rem;
        color: #666;
        width: 100px;
    }
    
    .log-type {
        background: #3498db;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 3px;
        font-size: 0.8rem;
        margin: 0 1rem;
    }
    
    .log-content {
        flex: 1;
        color: #666;
    }
    
    .opportunity-details h4 {
        color: #2ecc71;
        margin: 1.5rem 0 0.5rem 0;
    }
    
    .opportunity-details ul {
        margin: 0.5rem 0 1rem 0;
        padding-left: 1.5rem;
    }
    
    .opportunity-details li {
        margin-bottom: 0.25rem;
    }
    
    .opportunity-actions {
        margin-top: 2rem;
        text-align: center;
    }
    
    .opportunity-actions button {
        margin: 0 0.5rem;
    }
`;
document.head.appendChild(partnershipStyles);
