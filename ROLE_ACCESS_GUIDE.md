# 🔐 AYIKB Role-Based Access Control System

## 📋 Overview

The AYIKB website now features a comprehensive **role-based access control system** with four distinct user roles, each with specific permissions and access levels designed for agricultural business management.

## 👥 User Roles & Permissions

### **👑 CEO (Chief Executive Officer)**
**Access Level**: Full System Control
**Dashboard**: `ceo_dashboard.html`

#### **Permissions**:
- ✅ **Approve all submissions** (final authority)
- ✅ **View all reports** and analytics
- ✅ **Manage all users** (create, edit, delete)
- ✅ **System settings** configuration
- ✅ **View all departments** and activities
- ✅ **Override any decision**
- ✅ **Access all financial data**
- ✅ **Manage partnerships** and contracts

#### **Default Login**:
- **Username**: `ceo` or `ceo@ayikb.rw`
- **Password**: `ceo123`

#### **Key Features**:
- **Submission Management**: Review, approve, reject all submissions
- **Approval Workflow**: Multi-level approval queue
- **Team Management**: View and manage all team members
- **Reports & Analytics**: Comprehensive business insights
- **Settings**: System-wide configuration

---

### **🛡️ Admin (System Administrator)**
**Access Level**: System Management
**Dashboard**: `admin.html`

#### **Permissions**:
- ✅ **Manage users** (except CEO)
- ✅ **System settings** and configuration
- ✅ **View system logs** and activities
- ✅ **Backup system** management
- ✅ **Security settings** management
- ❌ **Cannot access financial data**
- ❌ **Cannot approve submissions**
- ❌ **Cannot view CEO dashboard**

#### **Default Login**:
- **Username**: `admin` or `admin@ayikb.rw`
- **Password**: `admin123`

#### **Key Features**:
- **User Management**: Add, edit, remove users
- **System Maintenance**: Database optimization, cache clearing
- **Security**: Password policies, session management
- **Backup Management**: Automated and manual backups
- **System Monitoring**: Performance and status tracking

---

### **👥 Coordinator (Project Coordinator)**
**Access Level**: Project Management
**Dashboard**: `dashboard.html`

#### **Permissions**:
- ✅ **Submit new projects** and proposals
- ✅ **View own submissions** and projects
- ✅ **Edit own submissions** (if not approved)
- ✅ **View team reports** (limited)
- ✅ **Manage project timelines**
- ❌ **Cannot approve budgets**
- ❌ **Cannot access financial data**
- ❌ **Cannot view other departments**

#### **Default Login**:
- **Username**: `coordinator` or `coordinator@ayikb.rw`
- **Password**: `coord123`

#### **Key Features**:
- **Project Management**: Create and manage agricultural projects
- **Submission Tracking**: Monitor submission status
- **Team Coordination**: Manage project teams
- **Progress Reporting**: Submit progress reports
- **Resource Planning**: Plan and allocate resources

---

### **📊 Accountable (Financial Officer)**
**Access Level**: Financial Management
**Dashboard**: `dashboard.html`

#### **Permissions**:
- ✅ **Submit financial reports**
- ✅ **View own submissions**
- ✅ **Edit own submissions**
- ✅ **Approve expenses** (within limits)
- ✅ **View financial reports**
- ✅ **Budget management**
- ❌ **Cannot approve projects**
- ❌ **Cannot access HR data**
- ❌ **Cannot view system settings**

#### **Default Login**:
- **Username**: `accountable` or `accountable@ayikb.rw`
- **Password**: `acc123`

#### **Key Features**:
- **Budget Management**: Create and manage budgets
- **Expense Approval**: Approve day-to-day expenses
- **Financial Reporting**: Generate financial reports
- **Cost Tracking**: Monitor project costs
- **Invoice Management**: Manage invoices and payments

---

## 🔄 Approval Workflow System

### **Multi-Level Approval Process**

#### **Level 1: Initial Review**
- **Coordinator** reviews submissions
- Can approve, reject, or return for revision
- Forward to next level if approved

#### **Level 2: Department Review**
- **Accountable** reviews financial aspects
- **Manager** reviews operational aspects
- Can approve, reject, or escalate

#### **Level 3: Final Approval**
- **CEO** makes final decision
- Can approve, reject, or override
- Final authority on all submissions

### **Workflow Rules by Type**

| **Submission Type** | **Amount** | **Level 1** | **Level 2** | **Level 3** |
|-------------------|-----------|------------|------------|------------|
| **Budget - Low** | < 100K | Coordinator | Accountable | CEO |
| **Budget - Medium** | 100K-500K | Coordinator | Accountable | CEO |
| **Budget - High** | > 500K | Accountable | CEO | - |
| **Budget - Urgent** | Any | CEO | - | - |
| **Project - Low** | Any | Coordinator | Manager | - |
| **Project - Medium** | Any | Coordinator | Manager | CEO |
| **Project - High** | Any | Manager | CEO | - |
| **Project - Urgent** | Any | CEO | - | - |
| **Partnership** | Any | Coordinator | CEO | - |

---

## 🗂️ Submission Types & Status

### **Submission Categories**
- **📋 Projects**: New project proposals and plans
- **💰 Budget**: Budget requests and financial plans
- **📊 Reports**: Progress and status reports
- **🎓 Training**: Training program proposals
- **🤝 Partnerships**: Partnership agreements
- **📦 Other**: Miscellaneous submissions

### **Status Tracking**
1. **📝 Draft**: Initial creation, not submitted
2. **📤 Submitted**: Sent for review
3. **⏳ Pending**: Awaiting current level approval
4. **🔍 Under Review**: Currently being reviewed
5. **✅ Approved**: Fully approved
6. **❌ Rejected**: Rejected with reasons
7. **🔄 Returned**: Returned for revision

---

## 🚀 Access Flow

### **Login Process**
1. **User visits**: `login.html`
2. **Selects role**: Admin, Coordinator, Accountable, or CEO
3. **Enters credentials**: Role-specific login
4. **System authenticates**: Validates permissions
5. **Redirects to dashboard**: Role-appropriate interface

### **Dashboard Access**
- **CEO**: `ceo_dashboard.html` - Full system control
- **Admin**: `admin.html` - System management
- **Coordinator**: `dashboard.html` - Project management
- **Accountable**: `dashboard.html` - Financial management

### **Navigation Restrictions**
- **Role-based menus**: Only show accessible features
- **Permission checks**: Server-side validation
- **Access denied**: Redirect to login if unauthorized
- **Session timeout**: Automatic logout after inactivity

---

## 📊 CEO Dashboard Features

### **📈 Overview Section**
- **Real-time statistics**: Submissions, approvals, team metrics
- **Activity feed**: Recent system activities
- **Quick actions**: Common tasks and shortcuts
- **Status indicators**: System health and performance

### **📋 Submissions Management**
- **All submissions view**: Complete submission history
- **Filter and search**: By type, status, priority
- **Bulk actions**: Approve/reject multiple items
- **Export functionality**: Download reports

### **✅ Approval Queue**
- **Pending items**: Items requiring CEO approval
- **Priority sorting**: Urgent items first
- **Quick approval**: One-click approvals
- **Detailed review**: Full submission details

### **📊 Reports & Analytics**
- **Financial summaries**: Revenue, expenses, budgets
- **Project metrics**: Progress, completion rates
- **Team performance**: Productivity and efficiency
- **Trend analysis**: Historical data and trends

### **👥 Team Management**
- **Team member profiles**: Roles and permissions
- **Activity monitoring**: User engagement
- **Performance metrics**: Individual and team KPIs
- **Communication tools**: Messages and notifications

### **⚙️ Settings**
- **System configuration**: Global settings
- **Workflow rules**: Approval processes
- **Notification preferences**: Alert settings
- **Security settings**: Access controls

---

## 🔒 Security Features

### **Authentication**
- **Role-based login**: Separate credentials per role
- **Session management**: Secure token-based sessions
- **Password policies**: Minimum requirements
- **Failed login tracking**: Lockout protection

### **Authorization**
- **Permission checks**: Server-side validation
- **Access control**: Role-based restrictions
- **Audit trail**: Complete action logging
- **IP restrictions**: Optional location limits

### **Data Protection**
- **Encryption**: Sensitive data protection
- **Backup systems**: Regular data backups
- **Recovery procedures**: Disaster recovery plans
- **Compliance**: Data protection regulations

---

## 📱 Mobile Responsiveness

### **Responsive Design**
- **Mobile-first**: Optimized for all devices
- **Touch interface**: Mobile-friendly controls
- **Adaptive layouts**: Screen size optimization
- **Performance**: Fast loading on mobile

### **Mobile Features**
- **Quick actions**: Common tasks on mobile
- **Push notifications**: Real-time alerts
- **Offline mode**: Limited offline functionality
- **Mobile security**: Device-specific security

---

## 🎯 Implementation Benefits

### **For AYIKB Business**
- **Clear authority**: Defined decision-making hierarchy
- **Efficient workflows**: Streamlined approval processes
- **Accountability**: Clear responsibility assignment
- **Scalability**: Easy to add new roles and users

### **For Team Members**
- **Role clarity**: Clear responsibilities and permissions
- **Efficient work**: Focus on relevant tasks
- **Career progression**: Defined advancement paths
- **Collaboration**: Better team coordination

### **For Management**
- **Oversight**: Complete visibility into operations
- **Control**: Authority over critical decisions
- **Reporting**: Comprehensive business insights
- **Compliance**: Regulatory adherence

---

## 🚀 Getting Started

### **1. Database Setup**
```sql
-- Run the enhanced database setup
mysql -u root -p < roles_management.sql
```

### **2. Test Logins**
- **CEO**: `ceo@ayikb.rw` / `ceo123`
- **Admin**: `admin@ayikb.rw` / `admin123`
- **Coordinator**: `coordinator@ayikb.rw` / `coord123`
- **Accountable**: `accountable@ayikb.rw` / `acc123`

### **3. Access Dashboards**
- **CEO**: Visit `ceo_dashboard.html`
- **Others**: Visit respective dashboards
- **Login**: Use role-specific credentials

### **4. Test Workflows**
- **Create submissions** as Coordinator/Accountable
- **Review submissions** as appropriate approver
- **Approve/reject** through CEO dashboard
- **Monitor notifications** and alerts

---

## 📞 Support & Training

### **User Training**
- **Role-specific guides**: Detailed instructions per role
- **Video tutorials**: Step-by-step demonstrations
- **Best practices**: Recommended workflows
- **FAQ section**: Common questions answered

### **Technical Support**
- **Documentation**: Complete system guide
- **Troubleshooting**: Common issues and solutions
- **Contact information**: Support team details
- **Maintenance schedule**: System updates and downtime

---

## 🎉 Summary

The AYIKB Role-Based Access Control System provides:

✅ **Four distinct roles** with clear responsibilities  
✅ **Multi-level approval** workflow system  
✅ **CEO dashboard** with comprehensive oversight  
✅ **Secure authentication** and authorization  
✅ **Mobile-responsive** design for all devices  
✅ **Audit trail** and compliance features  
✅ **Scalable architecture** for business growth  

This system transforms AYIKB into a **professional, enterprise-grade agricultural business management platform** with proper governance, accountability, and efficiency! 🌱
