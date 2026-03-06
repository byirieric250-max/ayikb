// AYIKB Database User Service - Handles all user operations through database
class AYIKBDatabaseUserService {
    constructor() {
        this.apiBase = 'api/ayikb'; // API endpoint for database operations
        this.cache = new Map(); // Cache for frequently accessed data
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache timeout
        this.initializeUserService();
    }

    initializeUserService() {
        console.log('AYIKB Database User Service initialized');
        
        // Set up periodic cache cleanup
        setInterval(() => {
            this.cleanupCache();
        }, 60000); // Clean cache every minute
    }

    // Simulate API call to database
    simulateAPICall(endpoint, method = 'GET', data = null) {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                try {
                    // In real implementation, this would make actual API calls
                    // For now, we'll simulate database operations
                    const response = this.handleDatabaseOperation(endpoint, method, data);
                    resolve(response);
                } catch (error) {
                    reject(error);
                }
            }, 500); // 500ms delay to simulate network
        });
    }

    // Handle database operations
    handleDatabaseOperation(endpoint, method, data) {
        const cacheKey = `${method}:${endpoint}`;
        
        // Check cache for GET operations
        if (method === 'GET' && this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        let result;
        
        switch (endpoint) {
            case 'users':
                if (method === 'GET') {
                    result = this.getAllUsers();
                } else if (method === 'POST') {
                    result = this.createUser(data);
                }
                break;
            case `users/${data?.id}`:
                if (method === 'GET') {
                    result = this.getUserById(data.id);
                } else if (method === 'PUT') {
                    result = this.updateUser(data.id, data);
                } else if (method === 'DELETE') {
                    result = this.deleteUser(data.id);
                }
                break;
            default:
                throw new Error('Unknown endpoint: ' + endpoint);
        }

        // Cache GET operations
        if (method === 'GET') {
            this.cache.set(cacheKey, {
                data: result,
                timestamp: Date.now()
            });
        }

        // Clear cache for write operations
        if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
            this.clearCache();
        }

        return result;
    }

    // Get all users from database
    getAllUsers() {
        // In real implementation, this would fetch from actual database
        // For now, we'll use localStorage as simulated database
        const users = JSON.parse(localStorage.getItem('ayikb_users_database') || '[]');
        return {
            success: true,
            data: users,
            message: 'Users retrieved successfully'
        };
    }

    // Get user by ID
    getUserById(userId) {
        const users = JSON.parse(localStorage.getItem('ayikb_users_database') || '[]');
        const user = users.find(u => u.id === parseInt(userId));
        
        if (!user) {
            throw new Error('User not found');
        }
        
        return {
            success: true,
            data: user,
            message: 'User retrieved successfully'
        };
    }

    // Create new user with all specified information
    createUser(userData) {
        const users = JSON.parse(localStorage.getItem('ayikb_users_database') || '[]');
        
        // Generate new ID
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'phone', 'position', 'department', 'role', 'status'];
        const missingFields = requiredFields.filter(field => !userData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            throw new Error('Invalid email format');
        }
        
        // Validate phone format (basic Rwanda phone format)
        const phoneRegex = /^\+250\s?7\d{2}\s?\d{3}\s?\d{3}$/;
        if (!phoneRegex.test(userData.phone.replace(/\s/g, ''))) {
            throw new Error('Invalid Rwanda phone format (+250 7XX XXX XXX)');
        }
        
        // Check for duplicate email
        const existingUser = users.find(u => u.email === userData.email);
        if (existingUser) {
            throw new Error('Email already exists');
        }
        
        // Create complete user object with all specified information
        const newUser = {
            id: newId,
            name: userData.name.trim(),
            email: userData.email.trim().toLowerCase(),
            phone: userData.phone.trim(),
            position: userData.position.trim(),
            department: userData.department.trim(),
            role: userData.role.trim(),
            status: userData.status.trim(),
            salary: userData.salary ? userData.salary.trim() : null,
            address: userData.address ? userData.address.trim() : null,
            emergencyContact: userData.emergencyContact ? userData.emergencyContact.trim() : null,
            skills: userData.skills ? userData.skills.trim() : null,
            education: userData.education ? userData.education.trim() : null,
            experience: userData.experience ? userData.experience.trim() : null,
            joinDate: userData.joinDate || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Insert into database
        users.push(newUser);
        localStorage.setItem('ayikb_users_database', JSON.stringify(users));
        
        // Log the insertion
        console.log('User inserted into database:', newUser);
        
        return {
            success: true,
            data: newUser,
            message: 'User created successfully with all specified information'
        };
    }

    // Update user with all specified information
    updateUser(userId, userData) {
        const users = JSON.parse(localStorage.getItem('ayikb_users_database') || '[]');
        const userIndex = users.findIndex(u => u.id === parseInt(userId));
        
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        
        // Validate required fields if provided
        const requiredFields = ['name', 'email', 'phone', 'position', 'department', 'role', 'status'];
        const missingFields = requiredFields.filter(field => userData[field] && !userData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
        
        // Validate email format if provided
        if (userData.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                throw new Error('Invalid email format');
            }
            
            // Check for duplicate email (excluding current user)
            const existingUser = users.find(u => u.email === userData.email.toLowerCase() && u.id !== parseInt(userId));
            if (existingUser) {
                throw new Error('Email already exists');
            }
        }
        
        // Validate phone format if provided
        if (userData.phone) {
            const phoneRegex = /^\+250\s?7\d{2}\s?\d{3}\s?\d{3}$/;
            if (!phoneRegex.test(userData.phone.replace(/\s/g, ''))) {
                throw new Error('Invalid Rwanda phone format (+250 7XX XXX XXX)');
            }
        }
        
        // Create updated user object with all specified information
        const updatedUser = {
            ...users[userIndex],
            ...userData,
            // Trim and normalize string fields
            name: userData.name ? userData.name.trim() : users[userIndex].name,
            email: userData.email ? userData.email.trim().toLowerCase() : users[userIndex].email,
            phone: userData.phone ? userData.phone.trim() : users[userIndex].phone,
            position: userData.position ? userData.position.trim() : users[userIndex].position,
            department: userData.department ? userData.department.trim() : users[userIndex].department,
            role: userData.role ? userData.role.trim() : users[userIndex].role,
            status: userData.status ? userData.status.trim() : users[userIndex].status,
            salary: userData.salary ? userData.salary.trim() : users[userIndex].salary,
            address: userData.address ? userData.address.trim() : users[userIndex].address,
            emergencyContact: userData.emergencyContact ? userData.emergencyContact.trim() : users[userIndex].emergencyContact,
            skills: userData.skills ? userData.skills.trim() : users[userIndex].skills,
            education: userData.education ? userData.education.trim() : users[userIndex].education,
            experience: userData.experience ? userData.experience.trim() : users[userIndex].experience,
            updatedAt: new Date().toISOString()
        };
        
        // Update in database
        users[userIndex] = updatedUser;
        localStorage.setItem('ayikb_users_database', JSON.stringify(users));
        
        // Log the update
        console.log('User updated in database:', updatedUser);
        
        return {
            success: true,
            data: updatedUser,
            message: 'User updated successfully with all specified information'
        };
    }

    // Delete user
    deleteUser(userId) {
        const users = JSON.parse(localStorage.getItem('ayikb_users_database') || '[]');
        const userIndex = users.findIndex(u => u.id === parseInt(userId));
        
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        
        const deletedUser = users[userIndex];
        users.splice(userIndex, 1);
        
        localStorage.setItem('ayikb_users_database', JSON.stringify(users));
        
        return {
            success: true,
            data: deletedUser,
            message: 'User deleted successfully'
        };
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }

    // Cleanup expired cache entries
    cleanupCache() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.cacheTimeout) {
                this.cache.delete(key);
            }
        }
    }

    // Public API methods
    async fetchUsers() {
        try {
            const response = await this.simulateAPICall('users', 'GET');
            return response;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    }

    async fetchUser(userId) {
        try {
            const response = await this.simulateAPICall(`users/${userId}`, 'GET', { id: userId });
            return response;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    }

    async saveUser(userData) {
        try {
            if (userData.id) {
                // Update existing user
                const response = await this.simulateAPICall(`users/${userData.id}`, 'PUT', userData);
                return response;
            } else {
                // Create new user
                const response = await this.simulateAPICall('users', 'POST', userData);
                return response;
            }
        } catch (error) {
            console.error('Error saving user:', error);
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const response = await this.simulateAPICall(`users/${userId}`, 'DELETE', { id: userId });
            return response;
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // Batch insert multiple users with all specified information
    async batchInsertUsers(usersData) {
        try {
            const results = [];
            const errors = [];
            
            for (let i = 0; i < usersData.length; i++) {
                try {
                    const result = await this.createUser(usersData[i]);
                    results.push(result);
                } catch (error) {
                    errors.push({
                        index: i,
                        data: usersData[i],
                        error: error.message
                    });
                }
            }
            
            return {
                success: errors.length === 0,
                inserted: results,
                errors: errors,
                message: `Batch insert completed: ${results.length} successful, ${errors.length} failed`
            };
        } catch (error) {
            console.error('Error in batch insert:', error);
            throw error;
        }
    }

    // Insert user with complete validation and all specified fields
    async insertUserWithAllFields(userData) {
        try {
            // Comprehensive field validation
            const allFields = [
                'name', 'email', 'phone', 'position', 'department', 
                'role', 'status', 'salary', 'address', 'emergencyContact',
                'skills', 'education', 'experience'
            ];
            
            const providedFields = Object.keys(userData);
            const missingRequired = ['name', 'email', 'phone', 'position', 'department', 'role', 'status']
                .filter(field => !providedFields.includes(field));
            
            if (missingRequired.length > 0) {
                throw new Error(`Missing required fields: ${missingRequired.join(', ')}`);
            }
            
            // Validate each field
            const validationErrors = [];
            
            // Name validation
            if (userData.name.length < 2) {
                validationErrors.push('Name must be at least 2 characters');
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(userData.email)) {
                validationErrors.push('Invalid email format');
            }
            
            // Phone validation
            const phoneRegex = /^\+250\s?7\d{2}\s?\d{3}\s?\d{3}$/;
            if (!phoneRegex.test(userData.phone.replace(/\s/g, ''))) {
                validationErrors.push('Invalid Rwanda phone format (+250 7XX XXX XXX)');
            }
            
            // Role validation
            const validRoles = ['admin', 'manager', 'employee', 'coordinator', 'accountable', 'it'];
            if (!validRoles.includes(userData.role)) {
                validationErrors.push(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
            }
            
            // Status validation
            const validStatuses = ['active', 'inactive', 'onboarding', 'suspended'];
            if (!validStatuses.includes(userData.status)) {
                validationErrors.push(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
            }
            
            // Salary validation (if provided)
            if (userData.salary && !/^\d+$/.test(userData.salary.replace(/[^0-9]/g, ''))) {
                validationErrors.push('Salary must contain only numbers');
            }
            
            // Experience validation (if provided)
            if (userData.experience && !/^\d+$/.test(userData.experience)) {
                validationErrors.push('Experience must be a number');
            }
            
            if (validationErrors.length > 0) {
                throw new Error(`Validation errors: ${validationErrors.join('; ')}`);
            }
            
            // Create user with all fields
            const result = await this.createUser(userData);
            
            // Log complete insertion
            console.log('Complete user insertion:', {
                id: result.data.id,
                fields: allFields.filter(field => userData[field]),
                timestamp: new Date().toISOString()
            });
            
            return {
                success: true,
                data: result.data,
                insertedFields: allFields.filter(field => userData[field]),
                message: 'User inserted successfully with all specified information'
            };
            
        } catch (error) {
            console.error('Error inserting user with all fields:', error);
            throw error;
        }
    }

    // Get database statistics
    async getDatabaseStats() {
        try {
            const response = await this.fetchUsers();
            const users = response.data;
            
            const stats = {
                totalUsers: users.length,
                activeUsers: users.filter(u => u.status === 'active').length,
                inactiveUsers: users.filter(u => u.status === 'inactive').length,
                onboardingUsers: users.filter(u => u.status === 'onboarding').length,
                suspendedUsers: users.filter(u => u.status === 'suspended').length,
                usersByRole: {},
                usersByDepartment: {},
                usersWithCompleteInfo: 0,
                usersWithIncompleteInfo: 0
            };
            
            // Count by role
            users.forEach(user => {
                stats.usersByRole[user.role] = (stats.usersByRole[user.role] || 0) + 1;
                stats.usersByDepartment[user.department] = (stats.usersByDepartment[user.department] || 0) + 1;
                
                // Check if user has complete information
                const requiredFields = ['name', 'email', 'phone', 'position', 'department', 'role', 'status'];
                const optionalFields = ['salary', 'address', 'emergencyContact', 'skills', 'education', 'experience'];
                
                const hasAllRequired = requiredFields.every(field => user[field]);
                const hasOptionalInfo = optionalFields.filter(field => user[field]).length >= 3;
                
                if (hasAllRequired && hasOptionalInfo) {
                    stats.usersWithCompleteInfo++;
                } else {
                    stats.usersWithIncompleteInfo++;
                }
            });
            
            return {
                success: true,
                data: stats,
                message: 'Database statistics retrieved successfully'
            };
            
        } catch (error) {
            console.error('Error getting database stats:', error);
            throw error;
        }
    }

    // Initialize with sample data if empty
    initializeSampleData() {
        const existingUsers = JSON.parse(localStorage.getItem('ayikb_users_database') || '[]');
        
        if (existingUsers.length === 0) {
            const sampleUsers = [
                {
                    id: 1,
                    name: 'Jean Pierre Nsengiyumva',
                    email: 'jean@ayikb.rw',
                    phone: '+250 788 123 456',
                    position: 'Project Manager',
                    role: 'admin',
                    status: 'active',
                    joinDate: '2023-01-15',
                    department: 'Management',
                    salary: 'Frw 800,000',
                    address: 'Kirehe, Eastern Province',
                    emergencyContact: '+250 788 123 999',
                    skills: 'Project Management, Leadership, Agriculture',
                    education: 'Bachelor in Agriculture',
                    experience: '5 years',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Alice Mukamana',
                    email: 'alice@ayikb.rw',
                    phone: '+250 788 123 457',
                    position: 'Farm Manager',
                    role: 'manager',
                    status: 'active',
                    joinDate: '2023-02-20',
                    department: 'Agriculture',
                    salary: 'Frw 600,000',
                    address: 'Kirehe, Eastern Province',
                    emergencyContact: '+250 788 123 998',
                    skills: 'Farming Management, Crop Planning, Team Leadership',
                    education: 'Diploma in Agriculture',
                    experience: '3 years',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'Marie Mukamana',
                    email: 'marie@ayikb.rw',
                    phone: '+250 788 123 458',
                    position: 'Agriculture Worker',
                    role: 'employee',
                    status: 'active',
                    joinDate: '2023-03-10',
                    department: 'Agriculture',
                    salary: 'Frw 350,000',
                    address: 'Kirehe, Eastern Province',
                    emergencyContact: '+250 788 123 997',
                    skills: 'Crop Planting, Harvesting, Farm Equipment',
                    education: 'High School Certificate',
                    experience: '2 years',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 4,
                    name: 'Eric Mugisha',
                    email: 'eric@ayikb.rw',
                    phone: '+250 788 123 459',
                    position: 'IT Officer',
                    role: 'it',
                    status: 'active',
                    joinDate: '2023-01-10',
                    department: 'IT',
                    salary: 'Frw 700,000',
                    address: 'Kirehe, Eastern Province',
                    emergencyContact: '+250 788 123 996',
                    skills: 'System Administration, Network Management, Database',
                    education: 'Bachelor in Computer Science',
                    experience: '4 years',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 5,
                    name: 'Grace Mukandayisenga',
                    email: 'grace@ayikb.rw',
                    phone: '+250 788 123 460',
                    position: 'Finance Officer',
                    role: 'accountable',
                    status: 'active',
                    joinDate: '2023-02-01',
                    department: 'Finance',
                    salary: 'Frw 650,000',
                    address: 'Kirehe, Eastern Province',
                    emergencyContact: '+250 788 123 995',
                    skills: 'Accounting, Financial Reporting, Budget Management',
                    education: 'Bachelor in Finance',
                    experience: '3 years',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];
            
            localStorage.setItem('ayikb_users_database', JSON.stringify(sampleUsers));
            console.log('Sample user data initialized');
        }
    }
}

// Global database user service instance
window.AYIKBDatabaseUserService = AYIKBDatabaseUserService;

// Auto-initialize
document.addEventListener('DOMContentLoaded', function() {
    window.databaseUserService = new AYIKBDatabaseUserService();
    window.databaseUserService.initializeSampleData();
    console.log('AYIKB Database User Service initialized');
});

// Utility functions for easy access
window.getUsers = () => window.databaseUserService.fetchUsers();
window.getUser = (id) => window.databaseUserService.fetchUser(id);
window.saveUser = (data) => window.databaseUserService.saveUser(data);
window.deleteUser = (id) => window.databaseUserService.deleteUser(id);

// Enhanced utility functions for complete data management
window.insertUserWithAllFields = (data) => window.databaseUserService.insertUserWithAllFields(data);
window.batchInsertUsers = (data) => window.databaseUserService.batchInsertUsers(data);
window.getDatabaseStats = () => window.databaseUserService.getDatabaseStats();

// Quick insert functions for common scenarios
window.insertEmployee = (name, email, phone, position, department, role, status, additionalInfo = {}) => {
    return window.databaseUserService.insertUserWithAllFields({
        name,
        email,
        phone,
        position,
        department,
        role,
        status,
        ...additionalInfo
    });
};

window.insertCompleteEmployee = (employeeData) => {
    const completeData = {
        name: employeeData.name,
        email: employeeData.email,
        phone: employeeData.phone,
        position: employeeData.position,
        department: employeeData.department,
        role: employeeData.role || 'employee',
        status: employeeData.status || 'active',
        salary: employeeData.salary || null,
        address: employeeData.address || null,
        emergencyContact: employeeData.emergencyContact || null,
        skills: employeeData.skills || null,
        education: employeeData.education || null,
        experience: employeeData.experience || null,
        joinDate: employeeData.joinDate || new Date().toISOString().split('T')[0]
    };
    
    return window.databaseUserService.insertUserWithAllFields(completeData);
};

// Bulk insert from array of employee objects
window.insertMultipleEmployees = (employeesArray) => {
    return window.databaseUserService.batchInsertUsers(employeesArray);
};

// Validate and insert user with comprehensive checking
window.validateAndInsertUser = (userData) => {
    return new Promise((resolve, reject) => {
        window.databaseUserService.insertUserWithAllFields(userData)
            .then(result => {
                console.log('User successfully inserted with all fields:', result);
                resolve(result);
            })
            .catch(error => {
                console.error('Failed to insert user:', error);
                reject(error);
            });
    });
};
