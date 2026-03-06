// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    setupSidebarNavigation();
    setupModalHandlers();
    setupUserManagement();
    setupSettingsManagement();
    setupBackupManagement();
    setupSecurityManagement();
    setupLogManagement();
    setupMaintenanceTools();
    initializeSystemStatus();
}

function setupSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sections = document.querySelectorAll('.admin-section');
    
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

function setupModalHandlers() {
    // Add User Modal
    window.showAddUserModal = function() {
        const modal = document.getElementById('addUserModal');
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
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewUser(this);
        });
    }
    
    // Close modal when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
}

function addNewUser(form) {
    const formData = new FormData(form);
    const userData = {
        username: formData.get('username'),
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        position: formData.get('position'),
        role: formData.get('role'),
        password: formData.get('password')
    };
    
    // Create new user row
    const userRow = createUserRow(userData);
    const usersTable = document.querySelector('.users-table tbody');
    if (usersTable) {
        usersTable.appendChild(userRow);
        
        // Show success message
        showNotification('User added successfully!', 'success');
        
        // Close modal
        closeModal('addUserModal');
        
        // Update user count
        updateUserCount();
    }
}

function createUserRow(userData) {
    const row = document.createElement('tr');
    const userId = Date.now(); // Generate unique ID
    
    const roleBadges = {
        'admin': '<span class="role-badge admin">Admin</span>',
        'manager': '<span class="role-badge manager">Manager</span>',
        'user': '<span class="role-badge user">User</span>'
    };
    
    row.innerHTML = `
        <td>${String(userId).padStart(3, '0')}</td>
        <td>${userData.fullName}</td>
        <td>${userData.email}</td>
        <td>${userData.position}</td>
        <td>${roleBadges[userData.role] || roleBadges.user}</td>
        <td><span class="status active">Active</span></td>
        <td>
            <button class="btn btn-sm btn-info" onclick="editUser(${userId})">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-warning" onclick="suspendUser(${userId})">
                <i class="fas fa-pause"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteUser(${userId})">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    return row;
}

function setupUserManagement() {
    window.editUser = function(userId) {
        showNotification(`Editing user ${userId}`, 'info');
    };
    
    window.suspendUser = function(userId) {
        if (confirm('Are you sure you want to suspend this user?')) {
            showNotification(`User ${userId} suspended`, 'warning');
        }
    };
    
    window.deleteUser = function(userId) {
        if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            const row = event.target.closest('tr');
            row.remove();
            showNotification(`User ${userId} deleted`, 'success');
            updateUserCount();
        }
    };
}

function updateUserCount() {
    const rows = document.querySelectorAll('.users-table tbody tr');
    const count = rows.length;
    // Update user count display if it exists
    const userCountElement = document.querySelector('.user-count');
    if (userCountElement) {
        userCountElement.textContent = count;
    }
}

function setupSettingsManagement() {
    window.saveSettings = function() {
        const settings = collectSettings();
        
        // Show loading
        showNotification('Saving settings...', 'info');
        
        // Simulate save operation
        setTimeout(() => {
            showNotification('Settings saved successfully!', 'success');
        }, 1000);
    };
}

function collectSettings() {
    const settings = {};
    
    // General settings
    const businessName = document.getElementById('businessName');
    if (businessName) settings.businessName = businessName.value;
    
    const businessEmail = document.getElementById('businessEmail');
    if (businessEmail) settings.businessEmail = businessEmail.value;
    
    // Notification settings
    const emailNotifications = document.getElementById('emailNotifications');
    if (emailNotifications) settings.emailNotifications = emailNotifications.checked;
    
    const smsNotifications = document.getElementById('smsNotifications');
    if (smsNotifications) settings.smsNotifications = smsNotifications.checked;
    
    // Security settings
    const sessionTimeout = document.getElementById('sessionTimeout');
    if (sessionTimeout) settings.sessionTimeout = sessionTimeout.value;
    
    const maxLoginAttempts = document.getElementById('maxLoginAttempts');
    if (maxLoginAttempts) settings.maxLoginAttempts = maxLoginAttempts.value;
    
    return settings;
}

function setupBackupManagement() {
    window.createBackup = function() {
        showNotification('Creating backup...', 'info');
        
        // Simulate backup creation
        setTimeout(() => {
            addBackupToHistory();
            showNotification('Backup created successfully!', 'success');
        }, 2000);
    };
    
    window.downloadBackup = function(backupId) {
        showNotification(`Downloading backup ${backupId}...`, 'info');
        setTimeout(() => {
            showNotification('Backup downloaded!', 'success');
        }, 1000);
    };
    
    window.deleteBackup = function(backupId) {
        if (confirm('Are you sure you want to delete this backup?')) {
            const row = event.target.closest('tr');
            row.remove();
            showNotification('Backup deleted', 'warning');
        }
    };
}

function addBackupToHistory() {
    const backupHistory = document.querySelector('.backup-history tbody');
    if (!backupHistory) return;
    
    const row = document.createElement('tr');
    const now = new Date();
    
    row.innerHTML = `
        <td>${now.toLocaleDateString('rw-RW')} ${now.toLocaleTimeString('rw-RW')}</td>
        <td>Full</td>
        <td>${(Math.random() * 100 + 200).toFixed(1)} MB</td>
        <td><span class="status success">Success</span></td>
        <td>
            <button class="btn btn-sm btn-info" onclick="downloadBackup(${Date.now()})">
                <i class="fas fa-download"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteBackup(${Date.now()})">
                <i class="fas fa-trash"></i>
            </button>
        </td>
    `;
    
    backupHistory.insertBefore(row, backupHistory.firstChild);
}

function setupSecurityManagement() {
    window.lockSystem = function() {
        if (confirm('Are you sure you want to lock the system? This will log out all users.')) {
            showNotification('System locked successfully!', 'success');
        }
    };
    
    window.forceLogout = function() {
        if (confirm('Are you sure you want to force logout all users?')) {
            showNotification('All users logged out!', 'warning');
        }
    };
    
    window.changePassword = function() {
        const newPassword = prompt('Enter new admin password:');
        if (newPassword && newPassword.length >= 8) {
            showNotification('Admin password changed successfully!', 'success');
        } else if (newPassword) {
            showNotification('Password must be at least 8 characters!', 'error');
        }
    };
    
    // Update security stats periodically
    setInterval(updateSecurityStats, 30000);
}

function updateSecurityStats() {
    const stats = document.querySelectorAll('.security-card p');
    stats.forEach(stat => {
        const currentValue = parseInt(stat.textContent);
        const change = Math.floor(Math.random() * 10) - 5;
        const newValue = Math.max(0, currentValue + change);
        stat.textContent = newValue;
    });
}

function setupLogManagement() {
    window.filterLogs = function() {
        const logLevel = document.getElementById('logLevel').value;
        const logDate = document.getElementById('logDate').value;
        const logEntries = document.querySelectorAll('.log-entry');
        
        logEntries.forEach(entry => {
            const entryLevel = entry.querySelector('.log-level').textContent.toLowerCase();
            const entryDate = entry.querySelector('.log-time').textContent.split(' ')[0];
            
            const levelMatch = logLevel === 'all' || entryLevel === logLevel;
            const dateMatch = !logDate || entryDate === logDate;
            
            if (levelMatch && dateMatch) {
                entry.style.display = 'flex';
            } else {
                entry.style.display = 'none';
            }
        });
    };
    
    window.clearLogs = function() {
        if (confirm('Are you sure you want to clear all logs? This action cannot be undone.')) {
            const logsContainer = document.querySelector('.logs-container');
            if (logsContainer) {
                logsContainer.innerHTML = '<p>No logs available</p>';
                showNotification('Logs cleared successfully', 'success');
            }
        }
    };
    
    // Add new log entries periodically
    setInterval(addNewLogEntry, 10000);
}

function addNewLogEntry() {
    const logsContainer = document.querySelector('.logs-container');
    if (!logsContainer) return;
    
    const logLevels = ['info', 'warning', 'error'];
    const actions = ['User login', 'File upload', 'Data export', 'System backup', 'Settings update'];
    
    const entry = document.createElement('div');
    const level = logLevels[Math.floor(Math.random() * logLevels.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    entry.className = `log-entry ${level}`;
    entry.innerHTML = `
        <span class="log-time">${new Date().toLocaleString('rw-RW')}</span>
        <span class="log-level">${level.toUpperCase()}</span>
        <span class="log-message">${action} completed</span>
    `;
    
    logsContainer.insertBefore(entry, logsContainer.firstChild);
    
    // Keep only last 50 entries
    const entries = logsContainer.querySelectorAll('.log-entry');
    if (entries.length > 50) {
        entries[entries.length - 1].remove();
    }
}

function setupMaintenanceTools() {
    window.optimizeDatabase = function() {
        showNotification('Optimizing database...', 'info');
        setTimeout(() => {
            showNotification('Database optimized successfully!', 'success');
        }, 3000);
    };
    
    window.clearCache = function() {
        showNotification('Clearing cache...', 'info');
        setTimeout(() => {
            showNotification('Cache cleared successfully!', 'success');
        }, 2000);
    };
    
    window.checkUpdates = function() {
        showNotification('Checking for updates...', 'info');
        setTimeout(() => {
            showNotification('System is up to date!', 'success');
        }, 2000);
    };
    
    window.restartSystem = function() {
        if (confirm('Are you sure you want to restart the system? This will temporarily interrupt service.')) {
            showNotification('System restart initiated...', 'warning');
            setTimeout(() => {
                showNotification('System restarted successfully!', 'success');
            }, 5000);
        }
    };
}

function initializeSystemStatus() {
    // Update system status indicators
    setInterval(updateSystemStatus, 60000); // Update every minute
}

function updateSystemStatus() {
    const statusItems = document.querySelectorAll('.status-item');
    
    statusItems.forEach(item => {
        const indicator = item.querySelector('.status-indicator');
        if (indicator && Math.random() > 0.9) {
            // Randomly change status (for demonstration)
            const statuses = ['good', 'warning', 'error'];
            const currentStatus = indicator.className.split(' ').find(cls => statuses.includes(cls));
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            
            indicator.className = `status-indicator ${newStatus}`;
            indicator.textContent = newStatus === 'good' ? 'Online' : 
                                  newStatus === 'warning' ? 'Warning' : 'Offline';
        }
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
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : type === 'warning' ? '#f39c12' : '#3498db'};
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

// Add admin-specific styles
const adminStyles = document.createElement('style');
adminStyles.textContent = `
    .admin-main {
        background: #f8f9fa;
        min-height: 100vh;
    }
    
    .admin-container {
        display: flex;
        min-height: calc(100vh - 80px);
    }
    
    .admin-sidebar {
        width: 250px;
        background: #2c3e50;
        color: white;
        padding: 2rem 0;
    }
    
    .sidebar-header {
        padding: 0 1.5rem 1.5rem;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .sidebar-header h3 {
        margin: 0;
        font-size: 1.2rem;
    }
    
    .sidebar-menu {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .sidebar-link {
        display: flex;
        align-items: center;
        padding: 1rem 1.5rem;
        color: rgba(255,255,255,0.8);
        text-decoration: none;
        transition: all 0.3s ease;
    }
    
    .sidebar-link:hover,
    .sidebar-link.active {
        background: rgba(255,255,255,0.1);
        color: white;
    }
    
    .sidebar-link i {
        margin-right: 0.75rem;
        width: 20px;
    }
    
    .admin-content {
        flex: 1;
        padding: 2rem;
        overflow-y: auto;
    }
    
    .admin-section {
        display: none;
    }
    
    .admin-section.active {
        display: block;
    }
    
    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }
    
    .section-header h2 {
        margin: 0;
        color: #2c3e50;
    }
    
    .admin-table {
        width: 100%;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .admin-table th {
        background: #f8f9fa;
        padding: 1rem;
        text-align: left;
        font-weight: 600;
        color: #2c3e50;
    }
    
    .admin-table td {
        padding: 1rem;
        border-bottom: 1px solid #eee;
    }
    
    .admin-table tr:hover {
        background: #f8f9fa;
    }
    
    .role-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .role-badge.admin {
        background: #e74c3c;
        color: white;
    }
    
    .role-badge.manager {
        background: #f39c12;
        color: white;
    }
    
    .role-badge.user {
        background: #3498db;
        color: white;
    }
    
    .status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .status.active {
        background: #2ecc71;
        color: white;
    }
    
    .status.inactive {
        background: #95a5a6;
        color: white;
    }
    
    .status.suspended {
        background: #f39c12;
        color: white;
    }
    
    .status.success {
        background: #2ecc71;
        color: white;
    }
    
    .status.warning {
        background: #f39c12;
        color: white;
    }
    
    .status.error {
        background: #e74c3c;
        color: white;
    }
    
    .form-group {
        margin-bottom: 1.5rem;
    }
    
    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #2c3e50;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
    }
    
    .form-group textarea {
        resize: vertical;
    }
    
    .checkbox-label {
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    
    .checkbox-label input {
        margin-right: 0.5rem;
    }
    
    .setting-group {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .setting-group h3 {
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: #2c3e50;
    }
    
    .backup-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .stat-item {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .stat-item h4 {
        margin: 0 0 0.5rem 0;
        color: #666;
        font-size: 0.9rem;
    }
    
    .stat-item p {
        margin: 0;
        font-size: 1.5rem;
        font-weight: bold;
        color: #2c3e50;
    }
    
    .security-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
    }
    
    .security-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .security-card h4 {
        margin: 0 0 0.5rem 0;
        color: #666;
        font-size: 0.9rem;
    }
    
    .security-card p {
        margin: 0 0 0.5rem 0;
        font-size: 1.5rem;
        font-weight: bold;
        color: #2c3e50;
    }
    
    .trend {
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .trend.normal {
        color: #3498db;
    }
    
    .trend.good {
        color: #2ecc71;
    }
    
    .trend.warning {
        color: #f39c12;
    }
    
    .action-buttons {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .log-filters {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        align-items: center;
    }
    
    .logs-container {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        max-height: 400px;
        overflow-y: auto;
    }
    
    .log-entry {
        display: flex;
        align-items: center;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid #eee;
        font-family: monospace;
        font-size: 0.9rem;
    }
    
    .log-entry:hover {
        background: #f8f9fa;
    }
    
    .log-time {
        color: #666;
        margin-right: 1rem;
        min-width: 150px;
    }
    
    .log-level {
        padding: 0.25rem 0.5rem;
        border-radius: 3px;
        font-size: 0.8rem;
        font-weight: bold;
        margin-right: 1rem;
        min-width: 60px;
        text-align: center;
    }
    
    .log-entry.info .log-level {
        background: #3498db;
        color: white;
    }
    
    .log-entry.warning .log-level {
        background: #f39c12;
        color: white;
    }
    
    .log-entry.error .log-level {
        background: #e74c3c;
        color: white;
    }
    
    .log-message {
        flex: 1;
        color: #2c3e50;
    }
    
    .maintenance-tools {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
        margin-bottom: 2rem;
    }
    
    .maintenance-card {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        text-align: center;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .maintenance-card h3 {
        margin: 0 0 1rem 0;
        color: #2c3e50;
    }
    
    .maintenance-card p {
        margin: 0 0 1.5rem 0;
        color: #666;
    }
    
    .system-status h3 {
        margin: 0 0 1.5rem 0;
        color: #2c3e50;
    }
    
    .status-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
    }
    
    .status-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    .status-label {
        font-weight: 600;
        color: #2c3e50;
    }
    
    .status-indicator {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    
    .status-indicator.good {
        background: #2ecc71;
        color: white;
    }
    
    .status-indicator.warning {
        background: #f39c12;
        color: white;
    }
    
    .status-indicator.error {
        background: #e74c3c;
        color: white;
    }
    
    @media (max-width: 768px) {
        .admin-container {
            flex-direction: column;
        }
        
        .admin-sidebar {
            width: 100%;
            padding: 1rem 0;
        }
        
        .sidebar-menu {
            display: flex;
            overflow-x: auto;
        }
        
        .sidebar-link {
            white-space: nowrap;
        }
        
        .admin-content {
            padding: 1rem;
        }
        
        .security-stats,
        .maintenance-tools {
            grid-template-columns: 1fr;
        }
        
        .action-buttons {
            flex-direction: column;
        }
    }
`;
document.head.appendChild(adminStyles);
