// AYIKB Finance Management Service - Handles all finance operations with database integration
class AYIKBFinanceManagementService {
    constructor() {
        this.apiBase = 'api/ayikb/finance';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
        this.initializeFinanceService();
    }

    initializeFinanceService() {
        console.log('AYIKB Finance Management Service initialized');
        
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
                    const response = this.handleFinanceOperation(endpoint, method, data);
                    resolve(response);
                } catch (error) {
                    reject(error);
                }
            }, 500); // 500ms delay to simulate network
        });
    }

    // Handle finance operations
    handleFinanceOperation(endpoint, method, data) {
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
            case 'finance':
                if (method === 'GET') {
                    result = this.getAllFinanceRecords();
                } else if (method === 'POST') {
                    result = this.createFinanceRecord(data);
                }
                break;
            case `finance/${data?.id}`:
                if (method === 'GET') {
                    result = this.getFinanceRecordById(data.id);
                } else if (method === 'PUT') {
                    result = this.updateFinanceRecord(data.id, data);
                } else if (method === 'DELETE') {
                    result = this.deleteFinanceRecord(data.id);
                }
                break;
            case 'employees':
                if (method === 'GET') {
                    result = this.getAllEmployees();
                } else if (method === 'POST') {
                    result = this.createEmployee(data);
                } else if (method === 'PUT') {
                    result = this.updateEmployee(data.id, data);
                } else if (method === 'DELETE') {
                    result = this.deleteEmployee(data.id);
                }
                break;
            case 'training':
                if (method === 'GET') {
                    result = this.getAllTraining();
                } else if (method === 'POST') {
                    result = this.createTraining(data);
                } else if (method === 'PUT') {
                    result = this.updateTraining(data.id, data);
                } else if (method === 'DELETE') {
                    result = this.deleteTraining(data.id);
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

    // Finance Records Management
    getAllFinanceRecords() {
        const records = JSON.parse(localStorage.getItem('ayikb_finance_records') || '[]');
        return {
            success: true,
            data: records,
            message: 'Finance records retrieved successfully'
        };
    }

    getFinanceRecordById(recordId) {
        const records = JSON.parse(localStorage.getItem('ayikb_finance_records') || '[]');
        const record = records.find(r => r.id === parseInt(recordId));
        
        if (!record) {
            throw new Error('Finance record not found');
        }
        
        return {
            success: true,
            data: record,
            message: 'Finance record retrieved successfully'
        };
    }

    createFinanceRecord(recordData) {
        const records = JSON.parse(localStorage.getItem('ayikb_finance_records') || '[]');
        
        // Generate new ID
        const newId = records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1;
        
        // Validate required fields
        const requiredFields = ['type', 'amount', 'description', 'category', 'date'];
        const missingFields = requiredFields.filter(field => !recordData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
        
        // Validate amount
        const amount = parseFloat(recordData.amount);
        if (isNaN(amount) || amount <= 0) {
            throw new Error('Amount must be a positive number');
        }
        
        // Validate date
        const date = new Date(recordData.date);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
        }
        
        const newRecord = {
            id: newId,
            type: recordData.type, // 'income' or 'expense'
            amount: amount,
            description: recordData.description.trim(),
            category: recordData.category.trim(),
            date: recordData.date,
            reference: recordData.reference || null,
            employeeId: recordData.employeeId || null,
            trainingId: recordData.trainingId || null,
            status: recordData.status || 'pending',
            approvedBy: recordData.approvedBy || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        records.push(newRecord);
        localStorage.setItem('ayikb_finance_records', JSON.stringify(records));
        
        console.log('Finance record created:', newRecord);
        
        return {
            success: true,
            data: newRecord,
            message: 'Finance record created successfully'
        };
    }

    updateFinanceRecord(recordId, recordData) {
        const records = JSON.parse(localStorage.getItem('ayikb_finance_records') || '[]');
        const recordIndex = records.findIndex(r => r.id === parseInt(recordId));
        
        if (recordIndex === -1) {
            throw new Error('Finance record not found');
        }
        
        // Validate amount if provided
        if (recordData.amount) {
            const amount = parseFloat(recordData.amount);
            if (isNaN(amount) || amount <= 0) {
                throw new Error('Amount must be a positive number');
            }
            recordData.amount = amount;
        }
        
        // Validate date if provided
        if (recordData.date) {
            const date = new Date(recordData.date);
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date format');
            }
        }
        
        const updatedRecord = {
            ...records[recordIndex],
            ...recordData,
            updatedAt: new Date().toISOString()
        };
        
        records[recordIndex] = updatedRecord;
        localStorage.setItem('ayikb_finance_records', JSON.stringify(records));
        
        console.log('Finance record updated:', updatedRecord);
        
        return {
            success: true,
            data: updatedRecord,
            message: 'Finance record updated successfully'
        };
    }

    deleteFinanceRecord(recordId) {
        const records = JSON.parse(localStorage.getItem('ayikb_finance_records') || '[]');
        const recordIndex = records.findIndex(r => r.id === parseInt(recordId));
        
        if (recordIndex === -1) {
            throw new Error('Finance record not found');
        }
        
        const deletedRecord = records[recordIndex];
        records.splice(recordIndex, 1);
        
        localStorage.setItem('ayikb_finance_records', JSON.stringify(records));
        
        console.log('Finance record deleted:', deletedRecord);
        
        return {
            success: true,
            data: deletedRecord,
            message: 'Finance record deleted successfully'
        };
    }

    // Employee Management (Finance Manager Access)
    getAllEmployees() {
        const employees = JSON.parse(localStorage.getItem('ayikb_users_database') || '[]');
        return {
            success: true,
            data: employees,
            message: 'Employees retrieved successfully'
        };
    }

    createEmployee(employeeData) {
        // Use the existing database user service
        if (window.databaseUserService) {
            return window.databaseUserService.createUser(employeeData);
        }
        throw new Error('Database user service not available');
    }

    updateEmployee(employeeId, employeeData) {
        // Use the existing database user service
        if (window.databaseUserService) {
            return window.databaseUserService.updateUser(employeeId, employeeData);
        }
        throw new Error('Database user service not available');
    }

    deleteEmployee(employeeId) {
        // Use the existing database user service
        if (window.databaseUserService) {
            return window.databaseUserService.deleteUser(employeeId);
        }
        throw new Error('Database user service not available');
    }

    // Training Management (Finance Manager Access)
    getAllTraining() {
        const training = JSON.parse(localStorage.getItem('ayikb_training_records') || '[]');
        return {
            success: true,
            data: training,
            message: 'Training records retrieved successfully'
        };
    }

    createTraining(trainingData) {
        const training = JSON.parse(localStorage.getItem('ayikb_training_records') || '[]');
        
        // Generate new ID
        const newId = training.length > 0 ? Math.max(...training.map(t => t.id)) + 1 : 1;
        
        // Validate required fields
        const requiredFields = ['title', 'description', 'startDate', 'endDate', 'instructor', 'location'];
        const missingFields = requiredFields.filter(field => !trainingData[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }
        
        // Validate dates
        const startDate = new Date(trainingData.startDate);
        const endDate = new Date(trainingData.endDate);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid date format');
        }
        
        if (startDate > endDate) {
            throw new Error('Start date must be before end date');
        }
        
        // Validate cost if provided
        let cost = 0;
        if (trainingData.cost) {
            cost = parseFloat(trainingData.cost);
            if (isNaN(cost) || cost < 0) {
                throw new Error('Cost must be a positive number');
            }
        }
        
        const newTraining = {
            id: newId,
            title: trainingData.title.trim(),
            description: trainingData.description.trim(),
            startDate: trainingData.startDate,
            endDate: trainingData.endDate,
            instructor: trainingData.instructor.trim(),
            location: trainingData.location.trim(),
            cost: cost,
            maxParticipants: trainingData.maxParticipants || 0,
            currentParticipants: trainingData.currentParticipants || 0,
            status: trainingData.status || 'planned',
            materials: trainingData.materials || '',
            objectives: trainingData.objectives || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        training.push(newTraining);
        localStorage.setItem('ayikb_training_records', JSON.stringify(training));
        
        console.log('Training record created:', newTraining);
        
        return {
            success: true,
            data: newTraining,
            message: 'Training record created successfully'
        };
    }

    updateTraining(trainingId, trainingData) {
        const training = JSON.parse(localStorage.getItem('ayikb_training_records') || '[]');
        const trainingIndex = training.findIndex(t => t.id === parseInt(trainingId));
        
        if (trainingIndex === -1) {
            throw new Error('Training record not found');
        }
        
        // Validate dates if provided
        if (trainingData.startDate || trainingData.endDate) {
            const startDate = new Date(trainingData.startDate || training[trainingIndex].startDate);
            const endDate = new Date(trainingData.endDate || training[trainingIndex].endDate);
            
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                throw new Error('Invalid date format');
            }
            
            if (startDate > endDate) {
                throw new Error('Start date must be before end date');
            }
        }
        
        // Validate cost if provided
        if (trainingData.cost) {
            const cost = parseFloat(trainingData.cost);
            if (isNaN(cost) || cost < 0) {
                throw new Error('Cost must be a positive number');
            }
            trainingData.cost = cost;
        }
        
        const updatedTraining = {
            ...training[trainingIndex],
            ...trainingData,
            updatedAt: new Date().toISOString()
        };
        
        training[trainingIndex] = updatedTraining;
        localStorage.setItem('ayikb_training_records', JSON.stringify(training));
        
        console.log('Training record updated:', updatedTraining);
        
        return {
            success: true,
            data: updatedTraining,
            message: 'Training record updated successfully'
        };
    }

    deleteTraining(trainingId) {
        const training = JSON.parse(localStorage.getItem('ayikb_training_records') || '[]');
        const trainingIndex = training.findIndex(t => t.id === parseInt(trainingId));
        
        if (trainingIndex === -1) {
            throw new Error('Training record not found');
        }
        
        const deletedTraining = training[trainingIndex];
        training.splice(trainingIndex, 1);
        
        localStorage.setItem('ayikb_training_records', JSON.stringify(training));
        
        console.log('Training record deleted:', deletedTraining);
        
        return {
            success: true,
            data: deletedTraining,
            message: 'Training record deleted successfully'
        };
    }

    // Finance Statistics
    getFinanceStatistics() {
        const records = JSON.parse(localStorage.getItem('ayikb_finance_records') || '[]');
        
        const stats = {
            totalRecords: records.length,
            totalIncome: records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0),
            totalExpenses: records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0),
            netBalance: 0,
            recordsByCategory: {},
            recordsByMonth: {},
            pendingRecords: records.filter(r => r.status === 'pending').length,
            approvedRecords: records.filter(r => r.status === 'approved').length
        };
        
        stats.netBalance = stats.totalIncome - stats.totalExpenses;
        
        // Group by category
        records.forEach(record => {
            stats.recordsByCategory[record.category] = (stats.recordsByCategory[record.category] || 0) + record.amount;
        });
        
        // Group by month
        records.forEach(record => {
            const month = record.date.substring(0, 7); // YYYY-MM
            if (!stats.recordsByMonth[month]) {
                stats.recordsByMonth[month] = { income: 0, expenses: 0 };
            }
            if (record.type === 'income') {
                stats.recordsByMonth[month].income += record.amount;
            } else {
                stats.recordsByMonth[month].expenses += record.amount;
            }
        });
        
        return {
            success: true,
            data: stats,
            message: 'Finance statistics retrieved successfully'
        };
    }

    // Cache management
    clearCache() {
        this.cache.clear();
    }

    cleanupCache() {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > this.cacheTimeout) {
                this.cache.delete(key);
            }
        }
    }

    // Public API methods
    async fetchFinanceRecords() {
        try {
            const response = await this.simulateAPICall('finance', 'GET');
            return response;
        } catch (error) {
            console.error('Error fetching finance records:', error);
            throw error;
        }
    }

    async fetchFinanceRecord(recordId) {
        try {
            const response = await this.simulateAPICall(`finance/${recordId}`, 'GET', { id: recordId });
            return response;
        } catch (error) {
            console.error('Error fetching finance record:', error);
            throw error;
        }
    }

    async saveFinanceRecord(recordData) {
        try {
            if (recordData.id) {
                // Update existing record
                const response = await this.simulateAPICall(`finance/${recordData.id}`, 'PUT', recordData);
                return response;
            } else {
                // Create new record
                const response = await this.simulateAPICall('finance', 'POST', recordData);
                return response;
            }
        } catch (error) {
            console.error('Error saving finance record:', error);
            throw error;
        }
    }

    async deleteFinanceRecord(recordId) {
        try {
            const response = await this.simulateAPICall(`finance/${recordId}`, 'DELETE', { id: recordId });
            return response;
        } catch (error) {
            console.error('Error deleting finance record:', error);
            throw error;
        }
    }

    // Employee operations
    async fetchEmployees() {
        try {
            const response = await this.simulateAPICall('employees', 'GET');
            return response;
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }

    async saveEmployee(employeeData) {
        try {
            if (employeeData.id) {
                // Update existing employee
                const response = await this.simulateAPICall('employees', 'PUT', employeeData);
                return response;
            } else {
                // Create new employee
                const response = await this.simulateAPICall('employees', 'POST', employeeData);
                return response;
            }
        } catch (error) {
            console.error('Error saving employee:', error);
            throw error;
        }
    }

    async deleteEmployee(employeeId) {
        try {
            const response = await this.simulateAPICall('employees', 'DELETE', { id: employeeId });
            return response;
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw error;
        }
    }

    // Training operations
    async fetchTraining() {
        try {
            const response = await this.simulateAPICall('training', 'GET');
            return response;
        } catch (error) {
            console.error('Error fetching training:', error);
            throw error;
        }
    }

    async saveTraining(trainingData) {
        try {
            if (trainingData.id) {
                // Update existing training
                const response = await this.simulateAPICall('training', 'PUT', trainingData);
                return response;
            } else {
                // Create new training
                const response = await this.simulateAPICall('training', 'POST', trainingData);
                return response;
            }
        } catch (error) {
            console.error('Error saving training:', error);
            throw error;
        }
    }

    async deleteTraining(trainingId) {
        try {
            const response = await this.simulateAPICall('training', 'DELETE', { id: trainingId });
            return response;
        } catch (error) {
            console.error('Error deleting training:', error);
            throw error;
        }
    }

    async fetchFinanceStatistics() {
        try {
            const stats = this.getFinanceStatistics();
            return stats;
        } catch (error) {
            console.error('Error fetching finance statistics:', error);
            throw error;
        }
    }

    // Initialize with sample data if empty
    initializeSampleData() {
        const existingRecords = JSON.parse(localStorage.getItem('ayikb_finance_records') || '[]');
        
        if (existingRecords.length === 0) {
            const sampleRecords = [
                {
                    id: 1,
                    type: 'income',
                    amount: 5000000,
                    description: 'Monthly Revenue from Agriculture',
                    category: 'Revenue',
                    date: '2024-01-15',
                    reference: 'AGR-2024-001',
                    status: 'approved',
                    approvedBy: 'Finance Manager',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 2,
                    type: 'expense',
                    amount: 1500000,
                    description: 'Employee Salaries',
                    category: 'Salaries',
                    date: '2024-01-31',
                    reference: 'SAL-2024-001',
                    status: 'approved',
                    approvedBy: 'Finance Manager',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 3,
                    type: 'expense',
                    amount: 800000,
                    description: 'Training Program Costs',
                    category: 'Training',
                    date: '2024-02-10',
                    reference: 'TRN-2024-001',
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];
            
            localStorage.setItem('ayikb_finance_records', JSON.stringify(sampleRecords));
            console.log('Sample finance data initialized');
        }

        // Initialize training data if empty
        const existingTraining = JSON.parse(localStorage.getItem('ayikb_training_records') || '[]');
        
        if (existingTraining.length === 0) {
            const sampleTraining = [
                {
                    id: 1,
                    title: 'Modern Farming Techniques',
                    description: 'Advanced agricultural practices training',
                    startDate: '2024-03-01',
                    endDate: '2024-03-15',
                    instructor: 'Dr. Jean Pierre',
                    location: 'Kirehe Training Center',
                    cost: 500000,
                    maxParticipants: 25,
                    currentParticipants: 15,
                    status: 'planned',
                    materials: 'Training manuals, equipment',
                    objectives: 'Improve farming productivity',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: 'Financial Management Basics',
                    description: 'Basic financial management for farmers',
                    startDate: '2024-04-01',
                    endDate: '2024-04-07',
                    instructor: 'Accountant Grace',
                    location: 'Kigali Office',
                    cost: 300000,
                    maxParticipants: 20,
                    currentParticipants: 8,
                    status: 'planned',
                    materials: 'Financial worksheets',
                    objectives: 'Teach basic accounting',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            ];
            
            localStorage.setItem('ayikb_training_records', JSON.stringify(sampleTraining));
            console.log('Sample training data initialized');
        }
    }
}

// Global finance management service instance
window.AYIKBFinanceManagementService = AYIKBFinanceManagementService;

// Auto-initialize
document.addEventListener('DOMContentLoaded', function() {
    window.financeService = new AYIKBFinanceManagementService();
    window.financeService.initializeSampleData();
    console.log('AYIKB Finance Management Service initialized');
});

// Utility functions for easy access
window.getFinanceRecords = () => window.financeService.fetchFinanceRecords();
window.getFinanceRecord = (id) => window.financeService.fetchFinanceRecord(id);
window.saveFinanceRecord = (data) => window.financeService.saveFinanceRecord(data);
window.deleteFinanceRecord = (id) => window.financeService.deleteFinanceRecord(id);
window.getFinanceStatistics = () => window.financeService.fetchFinanceStatistics();

// Employee operations for finance manager
window.getEmployeesForFinance = () => window.financeService.fetchEmployees();
window.saveEmployeeFinance = (data) => window.financeService.saveEmployee(data);
window.deleteEmployeeFinance = (id) => window.financeService.deleteEmployee(id);

// Training operations for finance manager
window.getTrainingForFinance = () => window.financeService.fetchTraining();
window.saveTrainingFinance = (data) => window.financeService.saveTraining(data);
window.deleteTrainingFinance = (id) => window.financeService.deleteTraining(id);
