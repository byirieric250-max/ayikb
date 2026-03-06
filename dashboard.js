// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    setupSidebarNavigation();
    initializeProgressBars();
    initializeCharts();
    setupRealTimeUpdates();
    initializeInteractions();
}

function setupSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.dashboard-section');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            sidebarLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

function initializeProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-in-out';
            bar.style.width = width;
        }, 100);
    });
}

function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue (Frw)',
                    data: [500000, 750000, 600000, 900000, 1200000, 1500000],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return value.toLocaleString() + ' Frw';
                            }
                        }
                    }
                }
            }
        });
    }

    // Project Progress Chart
    const progressCtx = document.getElementById('projectProgressChart');
    if (progressCtx) {
        new Chart(progressCtx, {
            type: 'doughnut',
            data: {
                labels: ['Phase 1: Ubuhinzi', 'Phase 2: Ubworozi', 'Phase 3: Ubworozi', 'Training'],
                datasets: [{
                    data: [75, 25, 10, 60],
                    backgroundColor: [
                        '#2ecc71',
                        '#3498db',
                        '#e74c3c',
                        '#f39c12'
                    ]
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

    // Training Attendance Chart
    const trainingCtx = document.getElementById('trainingChart');
    if (trainingCtx) {
        new Chart(trainingCtx, {
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

    // Partner Contributions Chart
    const partnerCtx = document.getElementById('partnerChart');
    if (partnerCtx) {
        new Chart(partnerCtx, {
            type: 'pie',
            data: {
                labels: ['Kirehe District', 'MINAGRI', 'BDF', 'RYAF', 'NGOs'],
                datasets: [{
                    data: [2000000, 1500000, 1000000, 800000, 500000],
                    backgroundColor: [
                        '#2ecc71',
                        '#3498db',
                        '#e74c3c',
                        '#f39c12',
                        '#9b59b6'
                    ]
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

function setupRealTimeUpdates() {
    // Simulate real-time updates
    setInterval(() => {
        updateStatistics();
        updateNotifications();
    }, 30000); // Update every 30 seconds
}

function updateStatistics() {
    // Update employee count
    const employeeCount = document.querySelector('.stat-card:nth-child(1) h3');
    if (employeeCount && Math.random() > 0.8) {
        const currentCount = parseInt(employeeCount.textContent);
        employeeCount.textContent = currentCount + 1;
        showNotification('New employee added!', 'success');
    }

    // Update project progress
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        if (Math.random() > 0.9) {
            const currentWidth = parseInt(bar.style.width);
            if (currentWidth < 100) {
                const newWidth = Math.min(currentWidth + 1, 100);
                bar.style.width = newWidth + '%';
                bar.parentElement.nextElementSibling.textContent = newWidth + '%';
            }
        }
    });
}

function updateNotifications() {
    // Simulate new notifications
    const notifications = [
        'New training registration received',
        'Project milestone completed',
        'Partner meeting scheduled',
        'Financial report available'
    ];
    
    if (Math.random() > 0.7) {
        const notification = notifications[Math.floor(Math.random() * notifications.length)];
        showNotification(notification, 'info');
    }
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

function initializeInteractions() {
    // Add click handlers to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const statName = this.querySelector('p').textContent;
            showDetailedStats(statName);
        });
    });

    // Add hover effects
    const cards = document.querySelectorAll('.crop-card, .livestock-card, .training-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        });
    });
}

function showDetailedStats(statName) {
    // Create modal for detailed statistics
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Detailed Statistics: ${statName}</h3>
                <span class="close" onclick="this.closest('.modal').remove()">&times;</span>
            </div>
            <div class="modal-body">
                <p>Detailed information about ${statName} would appear here.</p>
                <div class="chart-container">
                    <canvas id="detailChart"></canvas>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Create detailed chart
    const ctx = modal.querySelector('#detailChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [{
                    label: statName,
                    data: [65, 78, 90, 85],
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
}

// Export functions
function exportDashboardData(format) {
    const data = collectDashboardData();
    
    if (format === 'pdf') {
        exportToPDF(data);
    } else if (format === 'excel') {
        exportToExcel(data);
    }
}

function collectDashboardData() {
    return {
        timestamp: new Date().toISOString(),
        statistics: {
            employees: document.querySelector('.stat-card:nth-child(1) h3').textContent,
            jobs: document.querySelector('.stat-card:nth-child(2) h3').textContent,
            land: document.querySelector('.stat-card:nth-child(3) h3').textContent,
            budget: document.querySelector('.stat-card:nth-child(4) h3').textContent
        },
        projects: collectProjectData(),
        training: collectTrainingData()
    };
}

function collectProjectData() {
    const projects = [];
    document.querySelectorAll('.crop-card, .livestock-card').forEach(card => {
        projects.push({
            name: card.querySelector('h3').textContent,
            status: card.querySelector('.status').textContent,
            details: Array.from(card.querySelectorAll('.detail-item')).map(item => 
                item.textContent.trim()
            )
        });
    });
    return projects;
}

function collectTrainingData() {
    const training = [];
    document.querySelectorAll('.training-item').forEach(item => {
        training.push({
            name: item.querySelector('h3').textContent,
            status: item.querySelector('.status').textContent,
            details: Array.from(item.querySelectorAll('.detail-item')).map(detail => 
                detail.textContent.trim()
            )
        });
    });
    return training;
}

function exportToPDF(data) {
    // Simulate PDF export
    showNotification('PDF export started...', 'info');
    setTimeout(() => {
        showNotification('PDF exported successfully!', 'success');
    }, 2000);
}

function exportToExcel(data) {
    // Simulate Excel export
    showNotification('Excel export started...', 'info');
    setTimeout(() => {
        showNotification('Excel exported successfully!', 'success');
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification {
        animation: slideIn 0.3s ease;
    }
    
    .modal {
        display: flex;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        justify-content: center;
        align-items: center;
        z-index: 10000;
    }
    
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 1rem;
    }
    
    .modal-header h3 {
        margin: 0;
        color: #2ecc71;
    }
    
    .close {
        cursor: pointer;
        font-size: 1.5rem;
        color: #999;
    }
    
    .close:hover {
        color: #333;
    }
`;
document.head.appendChild(style);
