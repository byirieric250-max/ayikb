// AYIKB Admin Data Loader - Database Integrated Version
class AYIKBAdminDataLoaderDB {
    constructor() {
        this.databaseService = window.databaseService;
        this.defaultData = this.getDefaultData();
        this.currentData = {};
        this.initializeDataLoader();
    }

    async initializeDataLoader() {
        console.log('AYIKB Admin Data Loader (Database Version) initialized');
        
        // Load all data from database
        await this.loadAllData();
        
        // Set up event listeners for database updates
        this.setupEventListeners();
        
        // Apply data to page
        this.applyDataToPage();
    }

    async loadAllData() {
        try {
            // Load all data from database
            this.currentData.homepage = await this.databaseService.getHomepage();
            this.currentData.stats = await this.databaseService.getStats();
            this.currentData.projects = await this.databaseService.getProjects();
            this.currentData.training = await this.databaseService.getTraining();
            this.currentData.partners = await this.databaseService.getPartners();
            this.currentData.users = await this.databaseService.getUsers();
            
            console.log('All data loaded from database:', this.currentData);
        } catch (error) {
            console.error('Error loading data from database:', error);
            // Fallback to default data
            this.currentData = { ...this.defaultData };
        }
    }

    setupEventListeners() {
        // Listen for database updates
        document.addEventListener('databaseUpdate', (event) => {
            const { endpoint, data } = event.detail;
            this.handleDatabaseUpdate(endpoint, data);
        });
    }

    handleDatabaseUpdate(endpoint, data) {
        console.log(`Database update received for ${endpoint}:`, data);
        
        // Reload specific data type
        switch (endpoint) {
            case 'homepage':
                this.reloadHomepage();
                break;
            case 'stats':
                this.reloadStats();
                break;
            case 'projects':
                this.reloadProjects();
                break;
            case 'training':
                this.reloadTraining();
                break;
            case 'partners':
                this.reloadPartners();
                break;
            case 'users':
                this.reloadUsers();
                break;
        }
    }

    async reloadHomepage() {
        try {
            this.currentData.homepage = await this.databaseService.getHomepage();
            this.updateHomepageContent();
        } catch (error) {
            console.error('Error reloading homepage data:', error);
        }
    }

    async reloadStats() {
        try {
            this.currentData.stats = await this.databaseService.getStats();
            this.updateStatsContent();
        } catch (error) {
            console.error('Error reloading stats data:', error);
        }
    }

    async reloadProjects() {
        try {
            this.currentData.projects = await this.databaseService.getProjects();
            this.updateProjectsContent();
        } catch (error) {
            console.error('Error reloading projects data:', error);
        }
    }

    async reloadTraining() {
        try {
            this.currentData.training = await this.databaseService.getTraining();
            this.updateTrainingContent();
        } catch (error) {
            console.error('Error reloading training data:', error);
        }
    }

    async reloadPartners() {
        try {
            this.currentData.partners = await this.databaseService.getPartners();
            this.updatePartnersContent();
        } catch (error) {
            console.error('Error reloading partners data:', error);
        }
    }

    async reloadUsers() {
        try {
            this.currentData.users = await this.databaseService.getUsers();
            this.updateUsersContent();
        } catch (error) {
            console.error('Error reloading users data:', error);
        }
    }

    applyDataToPage() {
        // Apply data based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch (currentPage) {
            case 'index.html':
                this.applyToHomepage();
                break;
            case 'dashboard.html':
            case 'dashboard_updated.html':
                this.applyToDashboard();
                break;
            case 'projects.html':
            case 'projects_updated.html':
                this.applyToProjects();
                break;
            case 'training.html':
            case 'training_updated.html':
                this.applyToTraining();
                break;
            case 'partners.html':
            case 'partners_updated.html':
                this.applyToPartners();
                break;
            case 'admin_management.html':
                this.applyToAdminManagement();
                break;
            case 'admin_info_view.html':
                this.applyToAdminInfo();
                break;
        }
    }

    applyToHomepage() {
        // Update hero section
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle && this.currentData.homepage.heroTitle) {
            heroTitle.textContent = this.currentData.homepage.heroTitle;
        }

        const heroSubtitle = document.querySelector('.hero p');
        if (heroSubtitle && this.currentData.homepage.heroSubtitle) {
            heroSubtitle.textContent = this.currentData.homepage.heroSubtitle;
        }

        // Update stats
        this.updateStats();
    }

    applyToDashboard() {
        // Update dashboard statistics
        const statCards = document.querySelectorAll('.stat-card h3');
        if (statCards.length >= 4 && this.currentData.stats) {
            statCards[0].textContent = this.currentData.stats.employees;
            statCards[1].textContent = this.currentData.stats.projects;
            statCards[2].textContent = this.currentData.stats.training;
            statCards[3].textContent = this.currentData.stats.partners;
        }

        // Update recent activities
        this.updateRecentActivities();
    }

    applyToProjects() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid && this.currentData.projects) {
            projectsGrid.innerHTML = '';
            this.currentData.projects.forEach(project => {
                const projectCard = this.createProjectCard(project);
                projectsGrid.appendChild(projectCard);
            });
        }
    }

    applyToTraining() {
        const trainingGrid = document.querySelector('.training-grid');
        if (trainingGrid && this.currentData.training) {
            trainingGrid.innerHTML = '';
            this.currentData.training.forEach(program => {
                const trainingCard = this.createTrainingCard(program);
                trainingGrid.appendChild(trainingCard);
            });
        }
    }

    applyToPartners() {
        const partnersGrid = document.querySelector('.partners-grid');
        if (partnersGrid && this.currentData.partners) {
            partnersGrid.innerHTML = '';
            this.currentData.partners.forEach(partner => {
                const partnerCard = this.createPartnerCard(partner);
                partnersGrid.appendChild(partnerCard);
            });
        }
    }

    applyToAdminManagement() {
        // Populate admin management forms with current data
        this.populateAdminForms();
    }

    applyToAdminInfo() {
        // Update admin information view
        this.updateAdminInfoView();
    }

    // Content update methods
    updateStats() {
        const statElements = document.querySelectorAll('.stat h3');
        if (statElements.length >= 4 && this.currentData.stats) {
            statElements[0].textContent = this.currentData.stats.employees;
            statElements[1].textContent = this.currentData.stats.projects;
            statElements[2].textContent = this.currentData.stats.training;
            statElements[3].textContent = this.currentData.stats.partners;
        }
    }

    updateRecentActivities() {
        // Update recent activities in dashboard
        const activitiesList = document.querySelector('#activitiesList');
        if (activitiesList) {
            // This would be populated from database activities
            activitiesList.innerHTML = `
                <div class="activity-item">
                    <div class="activity-icon success">
                        <i class="fas fa-user-plus"></i>
                    </div>
                    <div class="activity-content">
                        <h4>System Updated</h4>
                        <p>Data loaded from database successfully</p>
                    </div>
                    <span class="activity-time">Nonaha</span>
                </div>
            `;
        }
    }

    updateAdminInfoView() {
        // Update admin information view with database data
        const infoCards = document.querySelectorAll('.info-card');
        if (infoCards.length > 0) {
            // Update leadership info
            const leadershipCard = Array.from(infoCards).find(card => 
                card.querySelector('h3')?.textContent?.includes('Ubuyobozi')
            );
            if (leadershipCard && this.currentData.users) {
                const leadershipUsers = this.currentData.users.filter(user => 
                    ['ceo', 'admin', 'it', 'auditor', 'council'].includes(user.role)
                );
                // Update leadership card with user data
            }

            // Update stats cards
            const totalUsersCard = Array.from(infoCards).find(card => 
                card.querySelector('h3')?.textContent?.includes('Abakozi')
            );
            if (totalUsersCard && this.currentData.users) {
                const totalUsersElement = totalUsersCard.querySelector('.info-value');
                if (totalUsersElement) {
                    totalUsersElement.textContent = this.currentData.users.length;
                }
            }
        }
    }

    populateAdminForms() {
        // Populate admin management forms with current data
        const heroTitleInput = document.getElementById('heroTitle');
        if (heroTitleInput && this.currentData.homepage.heroTitle) {
            heroTitleInput.value = this.currentData.homepage.heroTitle;
        }

        const heroSubtitleInput = document.getElementById('heroSubtitle');
        if (heroSubtitleInput && this.currentData.homepage.heroSubtitle) {
            heroSubtitleInput.value = this.currentData.homepage.heroSubtitle;
        }

        // Populate stats inputs
        if (this.currentData.stats) {
            const employeesInput = document.getElementById('employeeCount');
            if (employeesInput) employeesInput.value = this.currentData.stats.employees;

            const projectsInput = document.getElementById('projectCount');
            if (projectsInput) projectsInput.value = this.currentData.stats.projects;

            const trainingInput = document.getElementById('trainingCount');
            if (trainingInput) trainingInput.value = this.currentData.stats.training;

            const partnersInput = document.getElementById('partnerCount');
            if (partnersInput) partnersInput.value = this.currentData.stats.partners;
        }
    }

    // Card creation methods
    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-status', project.status);
        card.setAttribute('data-category', project.category);
        card.setAttribute('data-progress', project.progress);
        card.setAttribute('data-budget', project.budget);
        
        const statusClass = {
            'active': 'ikora',
            'completed': 'yarangiye',
            'planning': 'itegekwa'
        }[project.status] || 'ikora';

        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.name}">
            </div>
            <div class="project-content">
                <h3>${project.name}</h3>
                <p class="project-code">${project.code}</p>
                <p class="project-description">${project.description}</p>
                <div class="project-meta">
                    <span class="project-status ${project.status}">${statusClass}</span>
                    <span class="project-budget">${this.formatNumber(project.budget)} Frw</span>
                </div>
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${project.progress}%"></div>
                    </div>
                    <span>${project.progress}% Yararangiye</span>
                </div>
                <div class="project-actions">
                    <button class="btn btn-primary" onclick="viewProjectDetails('${project.code}')">
                        <i class="fas fa-eye"></i> Reba
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    createTrainingCard(training) {
        const card = document.createElement('div');
        card.className = 'training-card';
        card.setAttribute('data-status', training.status);
        card.setAttribute('data-category', training.category);
        card.setAttribute('data-date', training.date);
        
        const statusClass = {
            'upcoming': 'iza kuba',
            'ongoing': 'iri kugenda',
            'completed': 'byarangiye'
        }[training.status] || 'iza kuba';

        card.innerHTML = `
            <div class="training-image">
                <img src="${training.image}" alt="${training.name}">
            </div>
            <div class="training-content">
                <h3>${training.name}</h3>
                <p class="training-category">${training.category}</p>
                <p class="training-description">${training.description}</p>
                <div class="training-meta">
                    <span class="training-date">${this.formatDate(training.date)}</span>
                    <span class="training-time">${training.time}</span>
                    <span class="training-location">${training.location}</span>
                </div>
                <div class="training-info">
                    <div class="info-row">
                        <strong>Abitabiriye:</strong> ${training.attendees}
                    </div>
                    <div class="info-row">
                        <strong>Inshingano:</strong> ${training.trainer}
                    </div>
                    <div class="info-row">
                        <strong>Imimerere:</strong> <span class="status ${training.status}">${statusClass}</span>
                    </div>
                </div>
                <div class="training-actions">
                    <button class="btn btn-primary" onclick="viewTrainingDetails('${training.name}')">
                        <i class="fas fa-eye"></i> Reba
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    createPartnerCard(partner) {
        const card = document.createElement('div');
        card.className = 'partner-card';
        card.setAttribute('data-type', partner.type);
        card.setAttribute('data-funding', partner.funding);
        card.setAttribute('data-projects', partner.projects);
        
        const typeClass = {
            'government': 'Leta',
            'private': 'Ibigenga',
            'ngo': 'NGOs'
        }[partner.type] || 'Ibigenga';

        card.innerHTML = `
            <div class="partner-logo">
                <img src="${partner.logo}" alt="${partner.name}">
            </div>
            <div class="partner-content">
                <h3>${partner.name}</h3>
                <p class="partner-type">${typeClass}</p>
                <p class="partner-description">${partner.description}</p>
                <div class="partner-meta">
                    <span class="partner-funding">${this.formatNumber(partner.funding)} Frw</span>
                    <span class="partner-projects">${partner.projects} Imishinga</span>
                </div>
                <div class="partner-actions">
                    <button class="btn btn-primary" onclick="viewPartnerDetails('${partner.name}')">
                        <i class="fas fa-eye"></i> Reba
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }

    // Database operations
    async saveData(type, data) {
        try {
            // Save to database
            await this.databaseService.saveData(type, data);
            
            // Update local cache
            this.currentData[type] = data;
            
            // Show success message
            this.showSuccessMessage(`Data saved successfully!`);
            
            console.log(`${type} data saved to database:`, data);
        } catch (error) {
            console.error(`Error saving ${type} data:`, error);
            this.showErrorMessage(`Error saving data: ${error.message}`);
        }
    }

    async deleteItem(type, id) {
        try {
            // Delete from database
            await this.databaseService.deleteData(type, id);
            
            // Remove from local cache
            if (Array.isArray(this.currentData[type])) {
                this.currentData[type] = this.currentData[type].filter(item => item.id !== id);
            }
            
            // Show success message
            this.showSuccessMessage(`Item deleted successfully!`);
            
            console.log(`${type} item ${id} deleted from database`);
        } catch (error) {
            console.error(`Error deleting ${type} item:`, error);
            this.showErrorMessage(`Error deleting item: ${error.message}`);
        }
    }

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-toast';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${message}</span>
        `;
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 9999;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(successDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 3000);
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-toast';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 9999;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(errorDiv);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    formatNumber(num) {
        return new Intl.NumberFormat('rw-RW').format(num);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('rw-RW');
    }

    getDefaultData() {
        return {
            homepage: {
                heroTitle: "AgriYouth Innovation Kirehe Business",
                heroSubtitle: "Iteka ry'urubyirugo ryiza mu buhinzi n'ubworozi",
                challengesTitle: "Imbogamizi Zihari",
                contactTitle: "Twandikire"
            },
            stats: {
                employees: 15,
                projects: 4,
                training: 4,
                partners: 4,
                students: 115,
                performance: 95
            },
            projects: [],
            training: [],
            partners: [],
            users: []
        };
    }
}

// Global database-integrated data loader instance
window.AYIKBAdminDataLoaderDB = AYIKBAdminDataLoaderDB;

// Auto-initialize when database service is ready
document.addEventListener('DOMContentLoaded', function() {
    // Wait for database service to be available
    if (window.databaseService) {
        window.adminDataLoaderDB = new AYIKBAdminDataLoaderDB();
        console.log('AYIKB Admin Data Loader (Database Version) initialized');
    } else {
        // Fallback to original loader if database service not available
        if (window.AYIKBAdminDataLoader) {
            window.adminDataLoader = new AYIKBAdminDataLoader();
        }
    }
});

// Add CSS for toast notifications
const toastStyles = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .success-toast, .error-toast {
        font-family: 'Poppins', sans-serif;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .success-toast i, .error-toast i {
        font-size: 1.2em;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);
