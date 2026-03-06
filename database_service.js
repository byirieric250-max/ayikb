// AYIKB Database Service - Handles all data operations through database
class AYIKBDatabaseService {
    constructor() {
        this.apiBase = 'api/ayikb'; // API endpoint for database operations
        this.cache = new Map(); // Cache for frequently accessed data
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache timeout
        this.initializeDatabaseService();
    }

    initializeDatabaseService() {
        // Initialize database service
        console.log('AYIKB Database Service initialized');
        
        // Clear localStorage data that should be in database
        this.clearLocalStorageData();
        
        // Set up periodic cache cleanup
        setInterval(() => {
            this.cleanupCache();
        }, 60000); // Clean cache every minute
    }

    clearLocalStorageData() {
        // Clear data that should be managed by database
        const localStorageKeys = [
            'ayikb_homepage',
            'ayikb_stats',
            'ayikb_projects',
            'ayikb_training',
            'ayikb_partners',
            'ayikb_content',
            'ayikb_images',
            'ayikb_contact',
            'ayikb_users',
            'ayikb_notification_logs',
            'ayikb_admin_data'
        ];

        localStorageKeys.forEach(key => {
            localStorage.removeItem(key);
            console.log(`Cleared localStorage key: ${key}`);
        });
    }

    // Generic database operations
    async fetchData(endpoint, useCache = true) {
        const cacheKey = `${endpoint}_cache`;
        
        // Check cache first
        if (useCache && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log(`Returning cached data for: ${endpoint}`);
                return cached.data;
            }
        }

        try {
            // Simulate API call (replace with actual API call)
            console.log(`Fetching data from database: ${endpoint}`);
            const response = await this.simulateAPICall(endpoint);
            
            // Cache the response
            this.cache.set(cacheKey, {
                data: response,
                timestamp: Date.now()
            });

            return response;
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
            throw error;
        }
    }

    async saveData(endpoint, data, method = 'POST') {
        try {
            console.log(`Saving data to database: ${endpoint}`, data);
            
            // Simulate API call (replace with actual API call)
            const response = await this.simulateAPICall(endpoint, method, data);
            
            // Clear relevant cache
            this.clearCacheForEndpoint(endpoint);
            
            // Trigger data update event
            this.triggerDataUpdate(endpoint, data);
            
            return response;
        } catch (error) {
            console.error(`Error saving ${endpoint}:`, error);
            throw error;
        }
    }

    async deleteData(endpoint, id) {
        try {
            console.log(`Deleting data from database: ${endpoint}/${id}`);
            
            // Simulate API call (replace with actual API call)
            const response = await this.simulateAPICall(`${endpoint}/${id}`, 'DELETE');
            
            // Clear relevant cache
            this.clearCacheForEndpoint(endpoint);
            
            // Trigger data update event
            this.triggerDataUpdate(endpoint, { action: 'delete', id });
            
            return response;
        } catch (error) {
            console.error(`Error deleting from ${endpoint}:`, error);
            throw error;
        }
    }

    // Simulate API calls (replace with actual fetch calls)
    async simulateAPICall(endpoint, method = 'GET', data = null) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate different endpoints
        switch (endpoint) {
            case 'homepage':
                return this.getHomepageData();
            case 'stats':
                return this.getStatsData();
            case 'projects':
                return method === 'POST' ? this.saveProjectData(data) : this.getProjectsData();
            case 'training':
                return method === 'POST' ? this.saveTrainingData(data) : this.getTrainingData();
            case 'partners':
                return method === 'POST' ? this.savePartnerData(data) : this.getPartnersData();
            case 'users':
                return method === 'POST' ? this.saveUserData(data) : this.getUsersData();
            case 'notifications':
                return method === 'POST' ? this.saveNotificationData(data) : this.getNotificationsData();
            default:
                return { success: true, message: 'Operation completed' };
        }
    }

    // Data methods for different entities
    async getHomepageData() {
        return {
            heroTitle: "AgriYouth Innovation Kirehe Business",
            heroSubtitle: "Iteka ry'urubyirugo ryiza mu buhinzi n'ubworozi",
            challengesTitle: "Imbogamizi Zihari",
            contactTitle: "Twandikire"
        };
    }

    async getStatsData() {
        return {
            employees: 15,
            projects: 4,
            training: 4,
            partners: 4,
            students: 115,
            performance: 95
        };
    }

    async getProjectsData() {
        return [
            {
                id: 1,
                code: "AYIKB-001",
                name: "Phase 1: Ubuhinzi",
                description: "Gukora ubuhinzi bw'imbuto z'ikirere n'ibiti by'imbuto",
                budget: 1500000,
                progress: 85,
                startDate: "2024-01-15",
                endDate: "2024-06-30",
                status: "active",
                category: "agriculture",
                image: "images/project1.jpg"
            },
            {
                id: 2,
                code: "AYIKB-002",
                name: "Phase 2: Ubworozi",
                description: "Gukora ubworozi bw'inyamaswa n'ibikokwa",
                budget: 1200000,
                progress: 60,
                startDate: "2024-02-01",
                endDate: "2024-07-31",
                status: "active",
                category: "livestock",
                image: "images/project2.jpg"
            },
            {
                id: 3,
                code: "AYIKB-003",
                name: "Phase 3: Amashanyarazi",
                description: "Gukora amashanyarazi y'izuba mu buhinzi",
                budget: 800000,
                progress: 40,
                startDate: "2024-03-01",
                endDate: "2024-08-31",
                status: "active",
                category: "energy",
                image: "images/project3.jpg"
            },
            {
                id: 4,
                code: "AYIKB-004",
                name: "Phase 4: Amazi",
                description: "Gukora uruganda rw'amazi mu buhinzi n'ubworozi",
                budget: 600000,
                progress: 25,
                startDate: "2024-04-01",
                endDate: "2024-09-30",
                status: "planning",
                category: "water",
                image: "images/project4.jpg"
            }
        ];
    }

    async getTrainingData() {
        return [
            {
                id: 1,
                name: "Uburyo bwo guhinga bwiza",
                category: "agriculture",
                date: "2024-03-20",
                time: "09:00 - 17:00",
                location: "AYIKB Office, Kirehe",
                status: "upcoming",
                attendees: 40,
                trainer: "Jean Mugisha",
                description: "Amahugurwa ajyanye n'uburyo bwo guhinga buhinzi",
                image: "images/training1.jpg"
            },
            {
                id: 2,
                name: "Ubworozi bw'inyama",
                category: "livestock",
                date: "2024-03-25",
                time: "09:00 - 17:00",
                location: "AYIKB Office, Kirehe",
                status: "upcoming",
                attendees: 35,
                trainer: "Marie Uwimana",
                description: "Amahugurwa ajyanye n'ubworozi bw'inyama",
                image: "images/training2.jpg"
            },
            {
                id: 3,
                name: "Ubucuruzi bw'umusaruro",
                category: "business",
                date: "2024-02-15",
                time: "09:00 - 17:00",
                location: "AYIKB Office, Kirehe",
                status: "completed",
                attendees: 30,
                trainer: "Eric Mugisha",
                description: "Amahugurwa ajyanye n'ubucuruzi bw'umusaruro",
                image: "images/training3.jpg"
            },
            {
                id: 4,
                name: "Amashusho y'ikirere",
                category: "technology",
                date: "2024-01-10",
                time: "09:00 - 17:00",
                location: "AYIKB Office, Kirehe",
                status: "completed",
                attendees: 25,
                trainer: "Grace Mukandayisenga",
                description: "Amahugurwa ajyanye n'amashusho y'ikirere",
                image: "images/training4.jpg"
            }
        ];
    }

    async getPartnersData() {
        return [
            {
                id: 1,
                name: "Minisiteri y'Ubuhinzi n'Ubworozi",
                type: "government",
                description: "Minisiteri igamije guteza imbere ubuhinzi n'ubworozi mu Rwanda",
                funding: 2000000,
                projects: 6,
                logo: "images/partner1.jpg",
                contact: {
                    email: "info@minagri.gov.rw",
                    phone: "+250788123456",
                    address: "Kigali, Rwanda"
                }
            },
            {
                id: 2,
                name: "Banki y'u Rwanda (BRD)",
                type: "private",
                description: "Banki igamije gutanga ingunga z'imishinga y'ubukungu",
                funding: 1500000,
                projects: 3,
                logo: "images/partner2.jpg",
                contact: {
                    email: "info@brd.rw",
                    phone: "+250788123457",
                    address: "Kigali, Rwanda"
                }
            },
            {
                id: 3,
                name: "Heifer International Rwanda",
                type: "ngo",
                description: "Umuryango mpuzamahanga utanga ingunga mu buhinzi n'ubworozi",
                funding: 800000,
                projects: 2,
                logo: "images/partner3.jpg",
                contact: {
                    email: "rwanda@heifer.org",
                    phone: "+250788123458",
                    address: "Kigali, Rwanda"
                }
            },
            {
                id: 4,
                name: "TechnoServe Rwanda",
                type: "ngo",
                description: "Umuryango utanga tekinike mu buhinzi n'ubucuruzi",
                funding: 200000,
                projects: 1,
                logo: "images/partner4.jpg",
                contact: {
                    email: "rwanda@tns.org",
                    phone: "+250788123459",
                    address: "Kigali, Rwanda"
                }
            }
        ];
    }

    async getUsersData() {
        return [
            {
                id: 1,
                fullName: "Jean Pierre Nsengiyumva",
                email: "ceo@ayikb.rw",
                role: "ceo",
                department: "Leadership",
                phone: "+250788123456",
                status: "active",
                joinDate: "2024-01-01"
            },
            {
                id: 2,
                fullName: "Marie Uwimana",
                email: "admin@ayikb.rw",
                role: "admin",
                department: "Administration",
                phone: "+250788123457",
                status: "active",
                joinDate: "2024-01-01"
            },
            {
                id: 3,
                fullName: "Eric Mugisha",
                email: "it@ayikb.rw",
                role: "it",
                department: "IT",
                phone: "+250788123458",
                status: "active",
                joinDate: "2024-01-15"
            },
            {
                id: 4,
                fullName: "Grace Mukandayisenga",
                email: "auditor@ayikb.rw",
                role: "auditor",
                department: "Audit",
                phone: "+250788123459",
                status: "active",
                joinDate: "2024-01-15"
            },
            {
                id: 5,
                fullName: "Jean Paul",
                email: "council@ayikb.rw",
                role: "council",
                department: "Council",
                phone: "+250788123460",
                status: "active",
                joinDate: "2024-02-01"
            }
        ];
    }

    // Save methods (simulate database operations)
    async saveProjectData(projectData) {
        console.log('Saving project to database:', projectData);
        return { success: true, id: Date.now(), message: 'Project saved successfully' };
    }

    async saveTrainingData(trainingData) {
        console.log('Saving training to database:', trainingData);
        return { success: true, id: Date.now(), message: 'Training saved successfully' };
    }

    async savePartnerData(partnerData) {
        console.log('Saving partner to database:', partnerData);
        return { success: true, id: Date.now(), message: 'Partner saved successfully' };
    }

    async saveUserData(userData) {
        console.log('Saving user to database:', userData);
        return { success: true, id: Date.now(), message: 'User saved successfully' };
    }

    async saveNotificationData(notificationData) {
        console.log('Saving notification to database:', notificationData);
        return { success: true, id: Date.now(), message: 'Notification saved successfully' };
    }

    // Cache management
    clearCacheForEndpoint(endpoint) {
        const cacheKey = `${endpoint}_cache`;
        this.cache.delete(cacheKey);
        console.log(`Cleared cache for: ${endpoint}`);
    }

    cleanupCache() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.cacheTimeout) {
                this.cache.delete(key);
            }
        }
    }

    // Event handling
    triggerDataUpdate(endpoint, data) {
        const event = new CustomEvent('databaseUpdate', {
            detail: { endpoint, data, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }

    // Public API methods
    async getHomepage() {
        return await this.fetchData('homepage');
    }

    async getStats() {
        return await this.fetchData('stats');
    }

    async getProjects() {
        return await this.fetchData('projects');
    }

    async getTraining() {
        return await this.fetchData('training');
    }

    async getPartners() {
        return await this.fetchData('partners');
    }

    async getUsers() {
        return await this.fetchData('users');
    }

    async getNotifications() {
        return await this.fetchData('notifications');
    }

    async saveHomepage(data) {
        return await this.saveData('homepage', data);
    }

    async saveStats(data) {
        return await this.saveData('stats', data);
    }

    async saveProject(data) {
        return await this.saveData('projects', data);
    }

    async saveTraining(data) {
        return await this.saveData('training', data);
    }

    async savePartner(data) {
        return await this.saveData('partners', data);
    }

    async saveUser(data) {
        return await this.saveData('users', data);
    }

    async saveNotification(data) {
        return await this.saveData('notifications', data);
    }

    async deleteProject(id) {
        return await this.deleteData('projects', id);
    }

    async deleteTraining(id) {
        return await this.deleteData('training', id);
    }

    async deletePartner(id) {
        return await this.deleteData('partners', id);
    }

    async deleteUser(id) {
        return await this.deleteData('users', id);
    }

    // Utility methods
    formatNumber(num) {
        return new Intl.NumberFormat('rw-RW').format(num);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('rw-RW');
    }

    validateData(data, rules) {
        for (const [field, rule] of Object.entries(rules)) {
            const value = data[field];
            if (rule.required && (!value || value.toString().trim() === '')) {
                throw new Error(`${field} is required`);
            }
            if (rule.type && typeof value !== rule.type) {
                throw new Error(`${field} must be of type ${rule.type}`);
            }
            if (rule.min && value < rule.min) {
                throw new Error(`${field} must be at least ${rule.min}`);
            }
            if (rule.max && value > rule.max) {
                throw new Error(`${field} must be at most ${rule.max}`);
            }
        }
        return true;
    }
}

// Global database service instance
window.AYIKBDatabaseService = AYIKBDatabaseService;

// Auto-initialize
document.addEventListener('DOMContentLoaded', function() {
    window.databaseService = new AYIKBDatabaseService();
    console.log('AYIKB Database Service initialized');
});

// Utility functions for easy access
window.getHomepage = () => window.databaseService.getHomepage();
window.getStats = () => window.databaseService.getStats();
window.getProjects = () => window.databaseService.getProjects();
window.getTraining = () => window.databaseService.getTraining();
window.getPartners = () => window.databaseService.getPartners();
window.getUsers = () => window.databaseService.getUsers();
window.getNotifications = () => window.databaseService.getNotifications();

window.saveHomepage = (data) => window.databaseService.saveHomepage(data);
window.saveStats = (data) => window.databaseService.saveStats(data);
window.saveProject = (data) => window.databaseService.saveProject(data);
window.saveTraining = (data) => window.databaseService.saveTraining(data);
window.savePartner = (data) => window.databaseService.savePartner(data);
window.saveUser = (data) => window.databaseService.saveUser(data);
window.saveNotification = (data) => window.databaseService.saveNotification(data);

window.deleteProject = (id) => window.databaseService.deleteProject(id);
window.deleteTraining = (id) => window.databaseService.deleteTraining(id);
window.deletePartner = (id) => window.databaseService.deletePartner(id);
window.deleteUser = (id) => window.databaseService.deleteUser(id);
