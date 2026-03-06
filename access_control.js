// AYIKB Access Control System - Manages navigation and page access based on user roles
class AYIKBAccessControl {
    constructor() {
        this.currentUser = null;
        this.userRole = null;
        this.isAdmin = false;
        this.initializeAccessControl();
    }

    initializeAccessControl() {
        // Check for existing user session
        this.checkUserSession();
        
        // Initialize access control on page load
        document.addEventListener('DOMContentLoaded', () => {
            this.updateNavigation();
            this.checkPageAccess();
            this.setupRoleBasedContent();
        });

        // Listen for storage changes (for multi-tab support)
        window.addEventListener('storage', (e) => {
            if (e.key === 'currentUser' || e.key === 'currentUser') {
                this.checkUserSession();
                this.updateNavigation();
                this.checkPageAccess();
            }
        });
    }

    checkUserSession() {
        const userData = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.userRole = this.currentUser.role;
                this.isAdmin = this.userRole === 'admin' || this.userRole === 'ceo';
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.clearUserSession();
            }
        } else {
            this.currentUser = null;
            this.userRole = null;
            this.isAdmin = false;
        }
    }

    updateNavigation() {
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return;

        // Define navigation items based on user role
        const navigationItems = this.getNavigationItems();
        
        // Clear existing navigation
        navMenu.innerHTML = '';
        
        // Add navigation items
        navigationItems.forEach(item => {
            if (item.visible) {
                const navLink = document.createElement('a');
                navLink.href = item.href;
                navLink.className = item.className;
                navLink.textContent = item.text;
                
                if (item.icon) {
                    navLink.innerHTML = `<i class="${item.icon}"></i> ${item.text}`;
                }
                
                if (item.active) {
                    navLink.classList.add('active');
                }
                
                if (item.onClick) {
                    navLink.addEventListener('click', (e) => {
                        e.preventDefault();
                        item.onClick();
                    });
                }
                
                navMenu.appendChild(navLink);
            }
        });
    }

    getNavigationItems() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        const baseNavigation = [
            {
                text: 'Ahabanza',
                href: 'index.html',
                className: 'nav-link',
                icon: 'fas fa-home',
                active: currentPage === 'index.html',
                visible: true
            }
        ];

        // Public pages (always visible)
        const publicPages = [
            {
                text: 'Amahugurwa',
                href: 'training.html',
                className: 'nav-link',
                icon: 'fas fa-graduation-cap',
                active: currentPage === 'training.html',
                visible: true
            }
        ];

        // Admin-only pages
        const adminPages = [
            {
                text: 'Dashboard',
                href: 'dashboard_updated.html',
                className: 'nav-link',
                icon: 'fas fa-tachometer-alt',
                active: currentPage === 'dashboard_updated.html',
                visible: this.isAdmin
            },
            {
                text: 'Projects',
                href: 'projects_updated.html',
                className: 'nav-link',
                icon: 'fas fa-project-diagram',
                active: currentPage === 'projects_updated.html',
                visible: this.isAdmin
            },
            {
                text: 'Abafatanyabikorwa',
                href: 'partners_updated.html',
                className: 'nav-link',
                icon: 'fas fa-handshake',
                active: currentPage === 'partners_updated.html',
                visible: this.isAdmin
            },
            {
                text: 'Admin',
                href: 'admin_management.html',
                className: 'nav-link',
                icon: 'fas fa-cogs',
                active: currentPage === 'admin_management.html',
                visible: this.isAdmin
            },
            {
                text: 'Info',
                href: 'admin_info_view.html',
                className: 'nav-link',
                icon: 'fas fa-info-circle',
                active: currentPage === 'admin_info_view.html',
                visible: this.isAdmin
            },
            {
                text: 'Raporo',
                href: 'reports.html',
                className: 'nav-link',
                icon: 'fas fa-chart-bar',
                active: currentPage === 'reports.html',
                visible: this.isAdmin
            }
        ];

        // Authentication pages
        const authPages = this.currentUser ? [
            {
                text: 'Logout',
                href: '#',
                className: 'nav-link btn btn-primary',
                icon: 'fas fa-sign-out-alt',
                active: false,
                visible: true,
                onClick: () => this.logout()
            }
        ] : [
            {
                text: 'Login',
                href: 'login.html',
                className: 'nav-link btn btn-primary',
                icon: 'fas fa-sign-in-alt',
                active: false,
                visible: true
            },
            {
                text: 'Yandikishe',
                href: 'registration.html',
                className: 'nav-link',
                icon: 'fas fa-user-plus',
                active: false,
                visible: true
            }
        ];

        return [...baseNavigation, ...publicPages, ...adminPages, ...authPages];
    }

    checkPageAccess() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Define page access rules
        const pageAccessRules = {
            'dashboard_updated.html': ['admin', 'ceo'],
            'dashboard.html': ['admin', 'ceo'],
            'projects_updated.html': ['admin', 'ceo'],
            'projects.html': ['admin', 'ceo'],
            'partners_updated.html': ['admin', 'ceo'],
            'partners.html': ['admin', 'ceo'],
            'admin_management.html': ['admin', 'ceo'],
            'admin_info_view.html': ['admin', 'ceo'],
            'reports.html': ['admin', 'ceo'],
            'login_updated.html': ['admin', 'ceo', 'it', 'auditor', 'council', 'manager', 'coordinator', 'accountable', 'employee']
        };

        // Check if current page requires special access
        if (pageAccessRules[currentPage]) {
            const requiredRoles = pageAccessRules[currentPage];
            
            if (!this.userRole || !requiredRoles.includes(this.userRole)) {
                this.redirectToAccessDenied(currentPage);
            }
        }
    }

    redirectToAccessDenied(page) {
        console.warn(`Access denied to ${page}. User role: ${this.userRole}`);
        
        // Show access denied message
        this.showAccessDeniedMessage(page);
        
        // Redirect to appropriate page
        setTimeout(() => {
            if (this.currentUser) {
                window.location.href = 'index.html';
            } else {
                window.location.href = 'login.html';
            }
        }, 3000);
    }

    showAccessDeniedMessage(page) {
        const message = document.createElement('div');
        message.className = 'access-denied-message';
        message.innerHTML = `
            <div class="access-denied-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Access Denied</h3>
                <p>Niba utabona ${page} ufite uburenganzira bwo kuyikurikira.</p>
                <p>Urwego wawe: ${this.userRole || 'None'}</p>
                <p>Urasubira kuri paji y'imbere...</p>
            </div>
        `;
        
        // Add styles
        message.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #dc3545;
            color: white;
            padding: 20px;
            text-align: center;
            z-index: 9999;
            font-family: 'Poppins', sans-serif;
        `;
        
        document.body.appendChild(message);
        
        // Remove message after redirect
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 2500);
    }

    setupRoleBasedContent() {
        // Hide/show content based on user role
        const adminOnlyElements = document.querySelectorAll('[data-admin-only]');
        const userOnlyElements = document.querySelectorAll('[data-user-only]');
        
        adminOnlyElements.forEach(element => {
            element.style.display = this.isAdmin ? element.style.display || '' : 'none';
        });
        
        userOnlyElements.forEach(element => {
            element.style.display = this.currentUser ? element.style.display || '' : 'none';
        });
    }

    logout() {
        // Clear user session
        this.clearUserSession();
        
        // Show logout message
        this.showLogoutMessage();
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    }

    clearUserSession() {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        this.currentUser = null;
        this.userRole = null;
        this.isAdmin = false;
    }

    showLogoutMessage() {
        const message = document.createElement('div');
        message.className = 'logout-message';
        message.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Wasohotse neza muri sisitemu!</span>
        `;
        
        // Add styles
        message.style.cssText = `
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
        
        document.body.appendChild(message);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 3000);
    }

    // Public methods for external use
    hasAccess(requiredRole) {
        if (!this.currentUser) return false;
        return this.userRole === requiredRole;
    }

    hasAnyAccess(requiredRoles) {
        if (!this.currentUser) return false;
        return requiredRoles.includes(this.userRole);
    }

    isAdminUser() {
        return this.isAdmin;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getUserRole() {
        return this.userRole;
    }

    isFinanceManager() {
        const user = this.getCurrentUser();
        return user && (user.role === 'accountable' || user.role === 'finance' || user.role === 'admin' || user.role === 'ceo');
    }

    canManageFinance() {
        return this.isFinanceManager();
    }

    canManageEmployees() {
        const user = this.getCurrentUser();
        return user && ['admin', 'ceo', 'coordinator', 'accountable'].includes(user.role);
    }

    canManageTraining() {
        const user = this.getCurrentUser();
        return user && ['admin', 'ceo', 'coordinator', 'accountable', 'manager'].includes(user.role);
    }

    // Update user session (for login/register)
    updateUserSession(userData, remember = false) {
        this.currentUser = userData;
        this.userRole = userData.role;
        this.isAdmin = userData.role === 'admin' || userData.role === 'ceo';
        
        const storage = remember ? localStorage : sessionStorage;
        storage.setItem('currentUser', JSON.stringify(userData));
        
        // Trigger navigation update
        this.updateNavigation();
        this.checkPageAccess();
        this.setupRoleBasedContent();
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Redirect to login if not authenticated
    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Redirect to dashboard if authenticated
    requireGuest() {
        if (this.isLoggedIn()) {
            window.location.href = 'index.html';
            return false;
        }
        return true;
    }
}

// Global access control instance
window.AYIKBAccessControl = AYIKBAccessControl;

// Auto-initialize
document.addEventListener('DOMContentLoaded', function() {
    window.accessControl = new AYIKBAccessControl();
    console.log('AYIKB Access Control initialized');
});

// Utility functions for easy access
window.requireAuth = () => window.accessControl.requireAuth();
window.requireGuest = () => window.accessControl.requireGuest();
window.hasAccess = (role) => window.accessControl.hasAccess(role);
window.isAdmin = () => window.accessControl.isAdminUser();
window.getCurrentUser = () => window.accessControl.getCurrentUser();
window.getUserRole = () => window.accessControl.getUserRole();

// Add CSS for access control
const accessControlStyles = `
    .access-denied-message {
        font-family: 'Poppins', sans-serif;
    }
    
    .access-denied-content {
        max-width: 500px;
        margin: 0 auto;
        text-align: center;
    }
    
    .access-denied-content i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #ffc107;
    }
    
    .access-denied-content h3 {
        margin: 1rem 0;
        font-size: 1.5rem;
        font-weight: 700;
    }
    
    .access-denied-content p {
        margin: 0.5rem 0;
        opacity: 0.9;
    }
    
    .logout-message {
        font-family: 'Poppins', sans-serif;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
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
    
    [data-admin-only] {
        transition: opacity 0.3s ease;
    }
    
    [data-user-only] {
        transition: opacity 0.3s ease;
    }
`;

// Add styles to page
const styleSheet = document.createElement('style');
styleSheet.textContent = accessControlStyles;
document.head.appendChild(styleSheet);
