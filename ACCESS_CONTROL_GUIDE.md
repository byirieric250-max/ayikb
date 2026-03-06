# AYIKB Access Control System Guide

## Overview

The AYIKB Access Control System provides comprehensive role-based access control for all pages and features. It ensures that only authorized users can access specific pages and functionality based on their roles and permissions.

## Features

### 🔐 Role-Based Access Control
- **Dynamic Navigation** - Menu items shown/hidden based on user role
- **Page Protection** - Automatic redirects for unauthorized access
- **Content Filtering** - Show/hide content based on permissions
- **Session Management** - Secure user session handling

### 🛡️ Security Features
- **Access Denied Messages** - Clear feedback for unauthorized access
- **Automatic Redirects** - Smart redirection based on authentication
- **Role Validation** - Strict role checking for all actions
- **Session Timeout** - Automatic logout for inactive sessions

## User Roles and Permissions

### 1. CEO (Chief Executive Officer)
**Access Level:** Full System Access
**Pages Available:**
- ✅ Index (Home)
- ✅ Training (Public)
- ✅ Dashboard (Admin)
- ✅ Projects (Admin)
- ✅ Partners (Admin)
- ✅ Admin Management
- ✅ Admin Information
- ✅ Reports
- ✅ All other pages

### 2. Admin (Administrator)
**Access Level:** Full Administrative Access
**Pages Available:**
- ✅ Index (Home)
- ✅ Training (Public)
- ✅ Dashboard (Admin)
- ✅ Projects (Admin)
- ✅ Partners (Admin)
- ✅ Admin Management
- ✅ Admin Information
- ✅ Reports

### 3. IT Manager
**Access Level:** Technical Access
**Pages Available:**
- ✅ Index (Home)
- ✅ Training (Public)
- ✅ Dashboard (Limited)
- ❌ Projects (Admin Only)
- ❌ Partners (Admin Only)
- ❌ Admin Management
- ❌ Admin Information
- ❌ Reports

### 4. Auditor
**Access Level:** Audit Access
**Pages Available:**
- ✅ Index (Home)
- ✅ Training (Public)
- ✅ Dashboard (Limited)
- ❌ Projects (Admin Only)
- ❌ Partners (Admin Only)
- ❌ Admin Management
- ❌ Admin Information
- ❌ Reports

### 5. AYIKB Council
**Access Level:** Council Access
**Pages Available:**
- ✅ Index (Home)
- ✅ Training (Public)
- ✅ Dashboard (Limited)
- ❌ Projects (Admin Only)
- ❌ Partners (Admin Only)
- ❌ Admin Management
- ❌ Admin Information
- ❌ Reports

### 6. Manager
**Access Level:** Management Access
**Pages Available:**
- ✅ Index (Home)
- ✅ Training (Public)
- ✅ Dashboard (Limited)
- ❌ Projects (Admin Only)
- ❌ Partners (Admin Only)
- ❌ Admin Management
- ❌ Admin Information
- ❌ Reports

### 7. Coordinator
**Access Level:** Coordination Access
**Pages Available:**
- ✅ Index (Home)
- ✅ Training (Public)
- ✅ Dashboard (Limited)
- ❌ Projects (Admin Only)
- ❌ Partners (Admin Only)
- ❌ Admin Management
- ❌ Admin Information
- ❌ Reports

### 8. Accountable
**Access Level:** Basic Access
**Pages Available:**
- ✅ Index (Home)
- ✅ Training (Public)
- ✅ Dashboard (Limited)
- ❌ Projects (Admin Only)
- ❌ Partners (Admin Only)
- ❌ Admin Management
- ❌ Admin Information
- ❌ Reports

### 9. Employee
**Access Level:** Basic User Access
**Pages Available:**
- ✅ Index (Home)
- ✅ Training (Public)
- ✅ Dashboard (Limited)
- ❌ Projects (Admin Only)
- ❌ Partners (Admin Only)
- ❌ Admin Management
- ❌ Admin Information
- ❌ Reports

### 10. Guest/Not Logged In
**Access Level:** Public Access Only
**Pages Available:**
- ✅ Index (Home)
- ✅ Training (Public)
- ✅ Login
- ✅ Registration
- ❌ Dashboard (Auth Required)
- ❌ Projects (Admin Only)
- ❌ Partners (Admin Only)
- ❌ Admin Management
- ❌ Admin Information
- ❌ Reports

## Page Access Rules

### Public Pages (No Authentication Required)
- **index.html** - Homepage (accessible to everyone)
- **training.html** - Training page (public information)
- **login.html** - Login page
- **registration.html** - Registration page

### Admin-Only Pages
- **dashboard_updated.html** - Admin dashboard
- **projects_updated.html** - Projects management
- **partners_updated.html** - Partners management
- **admin_management.html** - Admin control panel
- **admin_info_view.html** - Admin information center
- **reports.html** - Reports and analytics

### Role-Based Access
- **CEO/Admin**: Full access to all pages
- **IT/Auditor/Council**: Limited dashboard access only
- **Manager/Coordinator/Accountable/Employee**: No admin page access

## Implementation Details

### 1. Access Control Class (`AYIKBAccessControl`)
**Core functionality:**
```javascript
class AYIKBAccessControl {
    constructor() {
        this.currentUser = null;
        this.userRole = null;
        this.isAdmin = false;
        this.initializeAccessControl();
    }
}
```

### 2. Session Management
**Features:**
- **Multi-tab support** - Syncs across browser tabs
- **Persistent sessions** - Optional "Remember Me" functionality
- **Automatic cleanup** - Clears invalid sessions
- **Security validation** - Validates session integrity

### 3. Dynamic Navigation
**Implementation:**
```javascript
getNavigationItems() {
    // Returns navigation items based on user role
    const baseNavigation = [
        { text: 'Ahabanza', href: 'index.html', visible: true },
        { text: 'Amahugurwa', href: 'training.html', visible: true }
    ];
    
    const adminPages = [
        { text: 'Dashboard', href: 'dashboard_updated.html', visible: this.isAdmin },
        { text: 'Projects', href: 'projects_updated.html', visible: this.isAdmin },
        { text: 'Admin', href: 'admin_management.html', visible: this.isAdmin }
    ];
    
    return [...baseNavigation, ...adminPages, ...authPages];
}
```

### 4. Page Protection
**Automatic Redirects:**
```javascript
checkPageAccess() {
    const pageAccessRules = {
        'admin_management.html': ['admin', 'ceo'],
        'dashboard_updated.html': ['admin', 'ceo'],
        'reports.html': ['admin', 'ceo']
    };
    
    if (!requiredRoles.includes(this.userRole)) {
        this.redirectToAccessDenied(currentPage);
    }
}
```

## Navigation Structure

### Public Navigation (All Users)
```
Home (Ahabanza) → index.html
Training (Amahugurwa) → training.html
```

### Admin Navigation (Admin/CEO Only)
```
Home (Ahabanza) → index.html
Training (Amahugurwa) → training.html
Dashboard → dashboard_updated.html
Projects → projects_updated.html
Partners → partners_updated.html
Admin → admin_management.html
Info → admin_info_view.html
Reports → reports.html
Logout → [Logout Function]
```

### Guest Navigation (Not Logged In)
```
Home (Ahabanza) → index.html
Training (Amahugurwa) → training.html
Login → login.html
Register → registration.html
```

## Security Features

### 1. Access Denied Handling
**User Experience:**
- Clear error messages in Kinyarwanda
- Automatic redirect after 3 seconds
- Visual feedback with appropriate icons
- Logging of access attempts

**Message Example:**
```
Access Denied
Niba utabona admin_management.html ufite uburenganzira bwo kuyikurikira.
Urwego wawe: Employee
Urasubira kuri paji y'imbere...
```

### 2. Session Security
**Protection Measures:**
- **Session validation** on each page load
- **Automatic timeout** for inactive sessions
- **Cross-tab synchronization** for consistency
- **Secure logout** with session cleanup

### 3. Role Validation
**Strict Checking:**
- **Server-side validation** (when implemented)
- **Client-side protection** for immediate feedback
- **Permission inheritance** for role hierarchies
- **Fail-safe defaults** for edge cases

## Integration Points

### 1. HTML Integration
**Include in all pages:**
```html
<script src="access_control.js"></script>
```

### 2. Page-Level Protection
**Automatic protection:**
- Access control initializes on DOM load
- Navigation updates automatically
- Page access checks run automatically
- Content filtering applied automatically

### 3. Content-Based Access
**HTML attributes:**
```html
<div data-admin-only>Admin only content</div>
<div data-user-only>Logged in users only</div>
```

## User Experience

### 1. Seamless Navigation
- **Dynamic menus** that adapt to user role
- **Smooth transitions** between access levels
- **Consistent branding** across all pages
- **Mobile-responsive** navigation

### 2. Clear Feedback
- **Access denied messages** with helpful information
- **Logout confirmations** with visual feedback
- **Loading states** during access checks
- **Error handling** for edge cases

### 3. Intuitive Flow
- **Logical page progression** based on role
- **Quick access** to frequently used features
- **Breadcrumb navigation** for context
- **Search functionality** where appropriate

## Development Guidelines

### 1. Adding New Pages
**Steps:**
1. Create page with appropriate access level
2. Add page to `pageAccessRules` in access_control.js
3. Include access_control.js script in page
4. Test access with different user roles
5. Update documentation

### 2. Modifying User Roles
**Considerations:**
- **Role hierarchy** and inheritance
- **Permission matrix** for features
- **Impact on existing pages**
- **Backward compatibility** requirements

### 3. Security Best Practices
**Implementation:**
- **Defense in depth** - multiple validation layers
- **Principle of least privilege** - minimal required access
- **Regular security reviews** - periodic access audits
- **User feedback** - clear error messages

## Troubleshooting

### 1. Common Issues
**Access Denied Unexpectedly:**
- Check user role assignment
- Verify page access rules
- Clear browser cache and cookies
- Check for JavaScript errors

**Navigation Not Updating:**
- Verify access_control.js is included
- Check for JavaScript console errors
- Ensure user session is valid
- Test with different user roles

### 2. Debug Tools
**Console Logging:**
```javascript
// Access control logs detailed information
console.log('AYIKB Access Control initialized');
console.log('User role:', this.userRole);
console.log('Is admin:', this.isAdmin);
```

**Session Inspection:**
```javascript
// Check current session
const user = getCurrentUser();
const role = getUserRole();
const isAdmin = isAdmin();
```

## Future Enhancements

### 1. Planned Features
- **Role-based UI themes** - Different themes for different roles
- **Permission matrix editor** - Visual permission management
- **Advanced audit logging** - Detailed access tracking
- **API-based access control** - Server-side validation
- **Multi-factor authentication** - Enhanced security

### 2. Scalability Improvements
- **Role inheritance system** - Parent-child role relationships
- **Dynamic permission loading** - Database-driven permissions
- **Caching optimization** - Faster access checks
- **Load balancing** - Distributed access control

## Best Practices

### 1. Security
- **Always validate** both client and server-side
- **Use HTTPS** for all authenticated pages
- **Implement rate limiting** for login attempts
- **Regular security audits** of access controls

### 2. User Experience
- **Clear messaging** for access decisions
- **Graceful degradation** for JavaScript failures
- **Consistent navigation** across all pages
- **Mobile optimization** for touch interfaces

### 3. Maintenance
- **Regular updates** to access rules
- **Documentation maintenance** for changes
- **User testing** with different roles
- **Performance monitoring** of access checks

## Conclusion

The AYIKB Access Control System provides comprehensive, secure, and user-friendly role-based access control for all system features. With automatic navigation updates, page protection, and clear user feedback, the system ensures that users only access the features and information appropriate to their roles.

The system is designed to be secure, maintainable, and extensible, providing a solid foundation for future enhancements and additional security features.
