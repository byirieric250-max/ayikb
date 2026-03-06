// Training Programs JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeTraining();
});

function initializeTraining() {
    setupTrainingFilters();
    setupModalHandlers();
    setupCalendar();
    setupRegistration();
    initializeTrainingCharts();
    setupCertificateGeneration();
}

function setupTrainingFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', filterTraining);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterTraining);
    }
}

function filterTraining() {
    const statusFilter = document.getElementById('statusFilter').value;
    const categoryFilter = document.getElementById('categoryFilter').value;
    const trainingCards = document.querySelectorAll('.training-card');
    
    trainingCards.forEach(card => {
        const cardStatus = card.dataset.status;
        const cardCategory = card.dataset.category;
        
        const statusMatch = statusFilter === 'all' || cardStatus === statusFilter;
        const categoryMatch = categoryFilter === 'all' || cardCategory === categoryFilter;
        
        if (statusMatch && categoryMatch) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
    
    updateTrainingStats();
}

function updateTrainingStats() {
    const visibleCards = document.querySelectorAll('.training-card:not([style*="display: none"])');
    const statsNumbers = document.querySelectorAll('.stat-number');
    
    if (statsNumbers.length >= 1) {
        statsNumbers[0].textContent = visibleCards.length; // Total trainings
    }
    
    const upcomingCount = Array.from(visibleCards).filter(card => 
        card.dataset.status === 'upcoming').length;
    if (statsNumbers.length >= 2) {
        statsNumbers[1].textContent = upcomingCount; // Upcoming
    }
    
    const ongoingCount = Array.from(visibleCards).filter(card => 
        card.dataset.status === 'ongoing').length;
    if (statsNumbers.length >= 3) {
        statsNumbers[2].textContent = ongoingCount; // Ongoing
    }
    
    const completedCount = Array.from(visibleCards).filter(card => 
        card.dataset.status === 'completed').length;
    if (statsNumbers.length >= 4) {
        statsNumbers[3].textContent = completedCount; // Completed
    }
}

function setupModalHandlers() {
    // Add Training Modal
    window.showAddTrainingModal = function() {
        const modal = document.getElementById('addTrainingModal');
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
    const addTrainingForm = document.getElementById('addTrainingForm');
    if (addTrainingForm) {
        addTrainingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewTraining(this);
        });
    }
    
    // Registration form
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitRegistration(this);
        });
    }
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
}

function addNewTraining(form) {
    const formData = new FormData(form);
    const trainingData = {
        name: formData.get('trainingName'),
        category: formData.get('category'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        time: formData.get('time'),
        location: formData.get('location'),
        maxParticipants: formData.get('maxParticipants'),
        trainer: formData.get('trainer'),
        description: formData.get('description')
    };
    
    // Create new training card
    const trainingCard = createTrainingCard(trainingData);
    const trainingGrid = document.getElementById('trainingGrid');
    if (trainingGrid) {
        trainingGrid.appendChild(trainingCard);
        
        // Animate the new card
        trainingCard.style.animation = 'fadeInUp 0.5s ease';
        
        // Show success message
        showNotification('Training program added successfully!', 'success');
        
        // Close modal
        closeModal('addTrainingModal');
        
        // Update stats
        updateTrainingStats();
        
        // Update calendar
        updateCalendar();
    }
}

function createTrainingCard(trainingData) {
    const card = document.createElement('div');
    card.className = 'training-card upcoming';
    card.dataset.status = 'upcoming';
    card.dataset.category = trainingData.category;
    
    const categoryIcons = {
        'agriculture': 'fas fa-seedling',
        'livestock': 'fas fa-pig',
        'business': 'fas fa-briefcase',
        'technology': 'fas fa-laptop',
        'other': 'fas fa-book'
    };
    
    const icon = categoryIcons[trainingData.category] || 'fas fa-book';
    
    card.innerHTML = `
        <div class="training-header">
            <div class="training-icon">
                <i class="${icon}"></i>
            </div>
            <div class="training-info">
                <h3>${trainingData.name}</h3>
                <span class="training-status upcoming">Iza kuba</span>
            </div>
        </div>
        <div class="training-details">
            <div class="detail-row">
                <span class="label"><i class="fas fa-calendar"></i> Itariki:</span>
                <span class="value">${formatDate(trainingData.startDate)} - ${formatDate(trainingData.endDate)}</span>
            </div>
            <div class="detail-row">
                <span class="label"><i class="fas fa-clock"></i> Igihe:</span>
                <span class="value">${trainingData.time}</span>
            </div>
            <div class="detail-row">
                <span class="label"><i class="fas fa-map-marker-alt"></i> Ahantu:</span>
                <span class="value">${trainingData.location}</span>
            </div>
            <div class="detail-row">
                <span class="label"><i class="fas fa-users"></i> Abitabiriye:</span>
                <span class="value">0/${trainingData.maxParticipants}</span>
            </div>
        </div>
        <div class="training-description">
            <p>${trainingData.description || 'Training description'}</p>
        </div>
        <div class="training-trainer">
            <span class="label"><i class="fas fa-chalkboard-teacher"></i> Inshingano:</span>
            <span class="value">${trainingData.trainer}</span>
        </div>
        <div class="training-actions">
            <button class="btn btn-sm btn-primary" onclick="registerTraining(${Date.now()})">
                <i class="fas fa-user-plus"></i> Iyandikishe
            </button>
            <button class="btn btn-sm btn-secondary" onclick="viewTrainingDetails(${Date.now()})">
                <i class="fas fa-eye"></i> Reba
            </button>
        </div>
    `;
    
    return card;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('rw-RW');
}

function setupRegistration() {
    window.registerTraining = function(trainingId) {
        const modal = document.getElementById('registrationModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            modal.dataset.trainingId = trainingId;
        }
    };
}

function submitRegistration(form) {
    const formData = new FormData(form);
    const registrationData = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        sector: formData.get('sector'),
        occupation: formData.get('occupation'),
        motivation: formData.get('motivation')
    };
    
    // Show success message
    showNotification('Registration submitted successfully! We will contact you soon.', 'success');
    
    // Close modal
    closeModal('registrationModal');
    
    // Update participant count (simulate)
    const modal = document.getElementById('registrationModal');
    const trainingId = modal.dataset.trainingId;
    if (trainingId) {
        updateParticipantCount(trainingId);
    }
}

function updateParticipantCount(trainingId) {
    // This would typically update the database
    showNotification('Participant count updated', 'info');
}

function setupCalendar() {
    generateCalendar();
    setupCalendarNavigation();
}

function generateCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');
    if (!calendarGrid) return;
    
    // Clear existing calendar days (except headers)
    const headers = calendarGrid.querySelectorAll('.calendar-day-header');
    calendarGrid.innerHTML = '';
    headers.forEach(header => calendarGrid.appendChild(header));
    
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay.getDay(); i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Check if there's training on this day
        const trainingDate = new Date(year, month, day);
        if (hasTrainingOnDate(trainingDate)) {
            dayElement.classList.add('has-training');
            dayElement.innerHTML = `${day} <span class="training-indicator">•</span>`;
        }
        
        // Highlight today
        if (day === currentDate.getDate()) {
            dayElement.classList.add('today');
        }
        
        calendarGrid.appendChild(dayElement);
    }
}

function hasTrainingOnDate(date) {
    // Check if any training falls on this date
    const trainingCards = document.querySelectorAll('.training-card');
    for (const card of trainingCards) {
        const startDateStr = card.querySelector('.detail-row:nth-child(1) .value').textContent;
        if (startDateStr.includes(date.toLocaleDateString('rw-RW'))) {
            return true;
        }
    }
    return false;
}

function setupCalendarNavigation() {
    window.previousMonth = function() {
        // Navigate to previous month
        updateCalendarMonth(-1);
    };
    
    window.nextMonth = function() {
        // Navigate to next month
        updateCalendarMonth(1);
    };
}

function updateCalendarMonth(direction) {
    const monthElement = document.getElementById('currentMonth');
    if (!monthElement) return;
    
    const currentMonthText = monthElement.textContent;
    const [monthName, year] = currentMonthText.split(' ');
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    
    let currentMonthIndex = months.indexOf(monthName);
    let currentYear = parseInt(year);
    
    currentMonthIndex += direction;
    
    if (currentMonthIndex < 0) {
        currentMonthIndex = 11;
        currentYear--;
    } else if (currentMonthIndex > 11) {
        currentMonthIndex = 0;
        currentYear++;
    }
    
    monthElement.textContent = `${months[currentMonthIndex]} ${currentYear}`;
    generateCalendar();
}

function initializeTrainingCharts() {
    // Training attendance chart
    const attendanceCtx = document.getElementById('attendanceChart');
    if (attendanceCtx) {
        new Chart(attendanceCtx, {
            type: 'bar',
            data: {
                labels: ['Modern Farming', 'Business Mgmt', 'Livestock', 'Pest Control'],
                datasets: [{
                    label: 'Registered',
                    data: [30, 40, 25, 35],
                    backgroundColor: '#3498db'
                }, {
                    label: 'Completed',
                    data: [28, 38, 20, 0],
                    backgroundColor: '#2ecc71'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Training category distribution
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'pie',
            data: {
                labels: ['Agriculture', 'Livestock', 'Business', 'Technology'],
                datasets: [{
                    data: [40, 25, 20, 15],
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

function setupCertificateGeneration() {
    window.viewCertificate = function(trainingId) {
        generateCertificate(trainingId);
    };
}

function generateCertificate(trainingId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content certificate-modal">
            <div class="modal-header">
                <h3>Icyemezo c'Ugururwa</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="certificate-container">
                <div class="certificate">
                    <div class="certificate-header">
                        <h2>AgriYouth Innovation Kirehe Business</h2>
                        <p>Icyemezo cy'Ukomezamwuga</p>
                    </div>
                    <div class="certificate-body">
                        <p>This is to certify that</p>
                        <h3 class="participant-name">Participant Name</h3>
                        <p>has successfully completed the training program</p>
                        <h4 class="training-title">Training Title</h4>
                        <p>on <span class="completion-date">${new Date().toLocaleDateString('rw-RW')}</span></p>
                    </div>
                    <div class="certificate-footer">
                        <div class="signature">
                            <p>_________________________</p>
                            <p>Trainer Signature</p>
                        </div>
                        <div class="signature">
                            <p>_________________________</p>
                            <p>Director Signature</p>
                        </div>
                    </div>
                </div>
                <div class="certificate-actions">
                    <button class="btn btn-primary" onclick="downloadCertificate()">
                        <i class="fas fa-download"></i> Download Certificate
                    </button>
                    <button class="btn btn-info" onclick="printCertificate()">
                        <i class="fas fa-print"></i> Print Certificate
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

window.downloadCertificate = function() {
    showNotification('Certificate download started...', 'info');
    setTimeout(() => {
        showNotification('Certificate downloaded successfully!', 'success');
    }, 2000);
};

window.printCertificate = function() {
    window.print();
};

// Training actions
window.viewTrainingDetails = function(trainingId) {
    showNotification(`Viewing details for training ${trainingId}`, 'info');
};

window.viewProgress = function(trainingId) {
    showNotification(`Viewing progress for training ${trainingId}`, 'info');
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

// Update calendar function
function updateCalendar() {
    generateCalendar();
}

// Add certificate styles
const certificateStyles = document.createElement('style');
certificateStyles.textContent = `
    .certificate-modal {
        max-width: 900px !important;
    }
    
    .certificate-container {
        text-align: center;
    }
    
    .certificate {
        border: 3px solid #2ecc71;
        padding: 2rem;
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        margin: 1rem 0;
        position: relative;
    }
    
    .certificate::before {
        content: '';
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        border: 1px solid #ddd;
        pointer-events: none;
    }
    
    .certificate-header h2 {
        color: #2ecc71;
        margin-bottom: 0.5rem;
    }
    
    .participant-name {
        font-size: 2rem;
        color: #2c3e50;
        margin: 1rem 0;
        font-weight: bold;
    }
    
    .training-title {
        color: #3498db;
        margin: 1rem 0;
    }
    
    .certificate-footer {
        display: flex;
        justify-content: space-around;
        margin-top: 3rem;
    }
    
    .signature {
        text-align: center;
    }
    
    .certificate-actions {
        margin-top: 1rem;
    }
    
    @media print {
        .modal-header,
        .certificate-actions {
            display: none !important;
        }
        
        .certificate-modal {
            max-width: 100% !important;
            margin: 0 !important;
            box-shadow: none !important;
        }
    }
`;
document.head.appendChild(certificateStyles);
