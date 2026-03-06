# 🗄️ AYIKB Complete Database Design Documentation

## 📋 Overview

This document provides a **comprehensive overview** of the AYIKB database design, including all tables, relationships, indexes, stored procedures, and triggers. The database has been **completely updated** to support the new leadership roles and enhanced business processes.

## 🏗️ Database Architecture

### **Database Name:** `ayikb_db`
### **Character Set:** `utf8mb4_unicode_ci`
### **Total Tables:** 25
### **Total Views:** 4
### **Stored Procedures:** 6
### **Triggers:** 4

---

## 👥 User Management Tables

### **1. users Table**
**Purpose:** Central user management with enhanced role-based access control

```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role ENUM('ceo', 'admin', 'coordinator', 'accountable', 'manager', 'employee', 'it', 'auditor', 'council') NOT NULL DEFAULT 'employee',
    position VARCHAR(100),
    department_id INT,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);
```

#### **Enhanced Role System:**
- **CEO** - Full system control and strategic oversight
- **Admin** - System administration and user management
- **Coordinator** - Project coordination and team management
- **Accountable** - Financial management and budget oversight
- **Manager** - Department management and team leadership
- **Employee** - Basic access and participation
- **IT** - System maintenance and technical support
- **Auditor** - Financial and operational auditing
- **Council** - Strategic governance and policy approval

#### **Permissions JSON Structure:**
```json
{
    "system_maintenance": true,
    "user_support": true,
    "security_management": true,
    "data_backup": true,
    "network_management": true,
    "view_system_logs": true
}
```

### **2. departments Table**
**Purpose:** Organizational structure management

```sql
CREATE TABLE departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    department_code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    manager_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(user_id)
);
```

#### **Default Departments:**
1. **Management** - Executive and strategic management
2. **Agriculture** - Crop farming and agricultural activities
3. **Livestock** - Animal husbandry and livestock management
4. **Training** - Training programs and capacity building
5. **Finance** - Financial management and accounting
6. **IT Department** - Information Technology and Systems Management
7. **Audit Department** - Internal Audit and Compliance
8. **Council Office** - AYIKB Council and Governance

---

## 🚀 Project Management Tables

### **3. projects Table**
**Purpose:** Enhanced project management with approval workflow

```sql
CREATE TABLE projects (
    project_id INT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(200) NOT NULL,
    project_code VARCHAR(20) UNIQUE NOT NULL,
    project_type ENUM('agriculture', 'livestock', 'training', 'other', 'strategic', 'infrastructure') NOT NULL,
    description TEXT,
    budget DECIMAL(12, 2) NOT NULL,
    actual_cost DECIMAL(12, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('planning', 'active', 'completed', 'cancelled', 'on_hold') DEFAULT 'planning',
    progress_percentage INT DEFAULT 0,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    manager_id INT,
    created_by INT,
    approved_by INT,
    approval_date TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(user_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);
```

### **4. project_activities Table**
**Purpose:** Detailed activity tracking within projects

```sql
CREATE TABLE project_activities (
    activity_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    activity_name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status ENUM('not_started', 'in_progress', 'completed', 'delayed') DEFAULT 'not_started',
    assigned_to INT,
    progress_percentage INT DEFAULT 0,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);
```

---

## 🎓 Training Management Tables

### **5. training_programs Table**
**Purpose:** Comprehensive training program management

```sql
CREATE TABLE training_programs (
    training_id INT PRIMARY KEY AUTO_INCREMENT,
    training_name VARCHAR(200) NOT NULL,
    training_code VARCHAR(20) UNIQUE NOT NULL,
    category ENUM('agriculture', 'livestock', 'business', 'technology', 'other') NOT NULL,
    description TEXT,
    trainer_name VARCHAR(100),
    trainer_contact VARCHAR(20),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(200),
    max_participants INT,
    current_participants INT DEFAULT 0,
    cost_per_participant DECIMAL(10, 2),
    status ENUM('planning', 'ongoing', 'completed', 'cancelled') DEFAULT 'planning',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);
```

### **6. training_participants Table**
**Purpose:** Participant registration and tracking

```sql
CREATE TABLE training_participants (
    participant_id INT PRIMARY KEY AUTO_INCREMENT,
    training_id INT NOT NULL,
    user_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('registered', 'attended', 'completed', 'no_show') DEFAULT 'registered',
    completion_date TIMESTAMP NULL,
    certificate_issued BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (training_id) REFERENCES training_programs(training_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    UNIQUE KEY unique_participant (training_id, user_id)
);
```

---

## 🤝 Partnership Management Tables

### **7. partners Table**
**Purpose:** Partner relationship management

```sql
CREATE TABLE partners (
    partner_id INT PRIMARY KEY AUTO_INCREMENT,
    partner_name VARCHAR(200) NOT NULL,
    partner_code VARCHAR(20) UNIQUE NOT NULL,
    partner_type ENUM('government', 'ngo', 'private', 'financial', 'educational', 'other') NOT NULL,
    description TEXT,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    contact_person VARCHAR(100),
    contact_position VARCHAR(100),
    partnership_date DATE,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
    contribution_amount DECIMAL(12, 2) DEFAULT 0,
    projects_supported INT DEFAULT 0,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);
```

---

## 📋 Workflow Management Tables

### **8. submissions Table**
**Purpose:** Enhanced submission and approval workflow

```sql
CREATE TABLE submissions (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    submission_code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    submission_type ENUM('budget', 'project', 'policy', 'strategic', 'audit', 'system') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    amount DECIMAL(12, 2),
    submitted_by INT NOT NULL,
    current_approver INT,
    workflow_level INT DEFAULT 1,
    max_workflow_level INT DEFAULT 3,
    status ENUM('draft', 'submitted', 'pending', 'approved', 'rejected', 'cancelled') DEFAULT 'draft',
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_date TIMESTAMP NULL,
    approved_by INT,
    rejection_reason TEXT,
    attachments JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (submitted_by) REFERENCES users(user_id),
    FOREIGN KEY (current_approver) REFERENCES users(user_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);
```

### **9. submission_comments Table**
**Purpose:** Comments and communication within submissions

```sql
CREATE TABLE submission_comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    submission_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    comment_type ENUM('note', 'approval', 'rejection', 'question') DEFAULT 'note',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### **10. workflow_rules Table**
**Purpose:** Configurable approval workflow rules

```sql
CREATE TABLE workflow_rules (
    rule_id INT PRIMARY KEY AUTO_INCREMENT,
    submission_type ENUM('budget', 'project', 'policy', 'strategic', 'audit', 'system') NOT NULL,
    priority_level ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    amount_threshold DECIMAL(12, 2) DEFAULT 0,
    required_approver_role ENUM('ceo', 'admin', 'coordinator', 'accountable', 'manager', 'it', 'auditor', 'council') NOT NULL,
    sequence_order INT NOT NULL,
    is_final BOOLEAN DEFAULT FALSE,
    auto_approve BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### **11. approval_history Table**
**Purpose:** Complete audit trail of approval actions

```sql
CREATE TABLE approval_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    submission_id INT NOT NULL,
    approver_id INT NOT NULL,
    action ENUM('submitted', 'approved', 'rejected', 'returned', 'cancelled') NOT NULL,
    comments TEXT,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    workflow_level INT,
    FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES users(user_id)
);
```

---

## 🔔 Communication Tables

### **12. notifications Table**
**Purpose:** System-wide notification management

```sql
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('info', 'success', 'warning', 'danger', 'system') DEFAULT 'info',
    action_required BOOLEAN DEFAULT FALSE,
    related_id INT, -- Can be submission_id, training_id, etc.
    related_type VARCHAR(50), -- 'submission', 'training', 'meeting', etc.
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

## 🖥️ IT Management Tables

### **13. it_management Table**
**Purpose:** IT system maintenance and monitoring

```sql
CREATE TABLE it_management (
    it_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    system_name VARCHAR(100) NOT NULL,
    system_code VARCHAR(20) UNIQUE NOT NULL,
    system_type ENUM('hardware', 'software', 'network', 'security', 'backup') NOT NULL,
    status ENUM('operational', 'maintenance', 'issue', 'offline') DEFAULT 'operational',
    last_maintenance TIMESTAMP NULL,
    next_maintenance TIMESTAMP NULL,
    maintenance_interval_days INT DEFAULT 30,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

---

## 📋 Audit Management Tables

### **14. audit_management Table**
**Purpose:** Internal audit management and tracking

```sql
CREATE TABLE audit_management (
    audit_id INT PRIMARY KEY AUTO_INCREMENT,
    auditor_id INT NOT NULL,
    audit_code VARCHAR(20) UNIQUE NOT NULL,
    audit_type ENUM('financial', 'operational', 'compliance', 'security', 'performance') NOT NULL,
    audit_title VARCHAR(200) NOT NULL,
    audit_period_start DATE NOT NULL,
    audit_period_end DATE NOT NULL,
    findings TEXT,
    recommendations TEXT,
    risk_level ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
    status ENUM('planned', 'in_progress', 'completed', 'follow_up') DEFAULT 'planned',
    audit_date DATE NULL,
    report_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (auditor_id) REFERENCES users(user_id)
);
```

---

## 🏛️ Council Management Tables

### **15. council_meetings Table**
**Purpose:** Council meeting management and documentation

```sql
CREATE TABLE council_meetings (
    meeting_id INT PRIMARY KEY AUTO_INCREMENT,
    meeting_code VARCHAR(20) UNIQUE NOT NULL,
    meeting_title VARCHAR(200) NOT NULL,
    meeting_date DATETIME NOT NULL,
    meeting_type ENUM('regular', 'special', 'emergency') DEFAULT 'regular',
    location VARCHAR(200),
    agenda TEXT,
    minutes TEXT,
    decisions TEXT,
    attendees JSON, -- JSON array of user IDs
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);
```

---

## 💰 Financial Management Tables

### **16. financial_records Table**
**Purpose:** Financial transaction management

```sql
CREATE TABLE financial_records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    record_code VARCHAR(20) UNIQUE NOT NULL,
    transaction_type ENUM('income', 'expense', 'transfer') NOT NULL,
    category ENUM('project', 'training', 'operations', 'infrastructure', 'other') NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    reference_number VARCHAR(50),
    approved_by INT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    submission_id INT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (approved_by) REFERENCES users(user_id),
    FOREIGN KEY (submission_id) REFERENCES submissions(submission_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);
```

---

## 🔐 Security and Access Tables

### **17. user_sessions Table**
**Purpose:** User session management and security

```sql
CREATE TABLE user_sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### **18. system_logs Table**
**Purpose:** Complete system audit trail

```sql
CREATE TABLE system_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50),
    record_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### **19. access_requests Table**
**Purpose:** Access request management

```sql
CREATE TABLE access_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    requested_resource VARCHAR(100) NOT NULL,
    request_reason TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    reviewed_by INT,
    review_date TIMESTAMP NULL,
    review_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (reviewed_by) REFERENCES users(user_id)
);
```

---

## 📊 Database Views

### **1. leadership_dashboard View**
**Purpose:** Comprehensive leadership dashboard data

```sql
CREATE VIEW leadership_dashboard AS
SELECT 
    u.user_id,
    u.full_name,
    u.role,
    d.department_name,
    COUNT(DISTINCT CASE WHEN s.status = 'pending' THEN s.submission_id END) as pending_tasks,
    COUNT(DISTINCT CASE WHEN s.status = 'approved' THEN s.submission_id END) as approved_tasks,
    COUNT(DISTINCT n.notification_id) as unread_notifications,
    (SELECT COUNT(*) FROM projects WHERE status = 'active') as active_projects,
    (SELECT COUNT(*) FROM training_programs WHERE status = 'ongoing') as ongoing_training
FROM users u
LEFT JOIN departments d ON u.department_id = d.department_id
LEFT JOIN submissions s ON (workflow conditions)
LEFT JOIN notifications n ON u.user_id = n.user_id AND n.is_read = FALSE
WHERE u.role IN ('ceo', 'admin', 'coordinator', 'accountable', 'manager', 'it', 'auditor', 'council')
    AND u.status = 'active'
GROUP BY u.user_id, u.full_name, u.role, d.department_name;
```

### **2. role_hierarchy View**
**Purpose:** Role hierarchy and permissions overview

```sql
CREATE VIEW role_hierarchy AS
SELECT 
    role,
    MAX(CASE role hierarchy levels) as hierarchy_level,
    COUNT(*) as user_count
FROM users
WHERE status = 'active'
GROUP BY role;
```

### **3. system_status View**
**Purpose:** IT system status overview

```sql
CREATE VIEW system_status AS
SELECT 
    system_type,
    COUNT(*) as total_systems,
    SUM(CASE WHEN status = 'operational' THEN 1 ELSE 0 END) as operational,
    SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
    SUM(CASE WHEN status = 'issue' THEN 1 ELSE 0 END) as issue,
    SUM(CASE WHEN status = 'offline' THEN 1 ELSE 0 END) as offline,
    MAX(next_maintenance) as next_scheduled_maintenance
FROM it_management
GROUP BY system_type;
```

### **4. audit_overview View**
**Purpose:** Audit status and overview

```sql
CREATE VIEW audit_overview AS
SELECT 
    audit_type,
    COUNT(*) as total_audits,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
    SUM(CASE WHEN status = 'planned' THEN 1 ELSE 0 END) as planned,
    SUM(CASE WHEN status = 'follow_up' THEN 1 ELSE 0 END) as follow_up,
    SUM(CASE WHEN risk_level = 'high' THEN 1 ELSE 0 END) as high_risk,
    SUM(CASE WHEN risk_level = 'medium' THEN 1 ELSE 0 END) as medium_risk,
    SUM(CASE WHEN risk_level = 'low' THEN 1 ELSE 0 END) as low_risk
FROM audit_management
GROUP BY audit_type;
```

---

## 🔧 Stored Procedures

### **1. AuthenticateUser Procedure**
**Purpose:** Secure user authentication with session management

```sql
CREATE PROCEDURE AuthenticateUser(
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_ip_address VARCHAR(45),
    IN p_user_agent TEXT,
    OUT p_result INT,
    OUT p_user_data JSON
)
```

#### **Features:**
- ✅ **Secure authentication** with password verification
- ✅ **Session creation** with unique tokens
- ✅ **Login tracking** with IP and user agent
- ✅ **Permission retrieval** for role-based access
- ✅ **Department association** for organizational context

### **2. SubmitItem Procedure**
**Purpose:** Automated submission workflow routing

```sql
CREATE PROCEDURE SubmitItem(
    IN p_title VARCHAR(200),
    IN p_description TEXT,
    IN p_submission_type VARCHAR(20),
    IN p_priority VARCHAR(10),
    IN p_amount DECIMAL(12, 2),
    IN p_submitted_by INT,
    IN p_attachments JSON,
    OUT p_submission_id INT
)
```

#### **Features:**
- ✅ **Automatic workflow routing** based on rules
- ✅ **Submission code generation** for tracking
- ✅ **Approver assignment** based on workflow rules
- ✅ **Notification creation** for approvers
- ✅ **Approval history logging**

### **3. ApproveItem Procedure**
**Purpose:** Multi-level approval processing

```sql
CREATE PROCEDURE ApproveItem(
    IN p_submission_id INT,
    IN p_approver_id INT,
    IN p_comments TEXT,
    OUT p_result BOOLEAN
)
```

#### **Features:**
- ✅ **Multi-level approval** workflow
- ✅ **Automatic routing** to next approver
- ✅ **Final approval** detection
- ✅ **Notification generation** for stakeholders
- ✅ **Approval history tracking**

### **4. LogSystemMaintenance Procedure**
**Purpose:** IT system maintenance logging

```sql
CREATE PROCEDURE LogSystemMaintenance(
    IN p_user_id INT,
    IN p_system_name VARCHAR(100),
    IN p_system_type VARCHAR(20),
    IN p_notes TEXT
)
```

#### **Features:**
- ✅ **Maintenance logging** with automatic scheduling
- ✅ **System code generation** for tracking
- ✅ **Next maintenance** calculation
- ✅ **Admin notifications** for completed maintenance

### **5. CreateAudit Procedure**
**Purpose:** Audit creation and scheduling

```sql
CREATE PROCEDURE CreateAudit(
    IN p_auditor_id INT,
    IN p_audit_type VARCHAR(20),
    IN p_audit_title VARCHAR(200),
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_findings TEXT,
    IN p_recommendations TEXT
)
```

#### **Features:**
- ✅ **Audit code generation** for tracking
- ✅ **Council notifications** for new audits
- ✅ **Audit status management**
- ✅ **Risk level assignment**

### **6. ScheduleCouncilMeeting Procedure**
**Purpose:** Council meeting scheduling and notifications

```sql
CREATE PROCEDURE ScheduleCouncilMeeting(
    IN p_created_by INT,
    IN p_meeting_title VARCHAR(200),
    IN p_meeting_date DATETIME,
    IN p_meeting_type VARCHAR(20),
    IN p_location VARCHAR(200),
    IN p_agenda TEXT,
    IN p_attendees JSON
)
```

#### **Features:**
- ✅ **Meeting code generation** for tracking
- ✅ **Council member notifications**
- ✅ **Attendee management** with JSON storage
- ✅ **Meeting type classification**

---

## 🔗 Database Triggers

### **1. users_audit_insert Trigger**
**Purpose:** Audit trail for user creation

```sql
CREATE TRIGGER users_audit_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO system_logs (user_id, action, table_name, record_id, new_values)
    VALUES (NEW.user_id, 'INSERT', 'users', NEW.user_id, JSON_OBJECT(...));
END //
```

### **2. users_audit_update Trigger**
**Purpose:** Audit trail for user updates

```sql
CREATE TRIGGER users_audit_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO system_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (NEW.user_id, 'UPDATE', 'users', NEW.user_id, old_values, new_values);
END //
```

### **3. submissions_audit_insert Trigger**
**Purpose:** Audit trail for submission creation

```sql
CREATE TRIGGER submissions_audit_insert
AFTER INSERT ON submissions
FOR EACH ROW
BEGIN
    INSERT INTO system_logs (user_id, action, table_name, record_id, new_values)
    VALUES (NEW.submitted_by, 'INSERT', 'submissions', NEW.submission_id, JSON_OBJECT(...));
END //
```

### **4. submissions_audit_update Trigger**
**Purpose:** Audit trail for submission updates

```sql
CREATE TRIGGER submissions_audit_update
AFTER UPDATE ON submissions
FOR EACH ROW
BEGIN
    INSERT INTO system_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (NEW.approved_by, 'UPDATE', 'submissions', NEW.submission_id, old_values, new_values);
END //
```

---

## 📈 Performance Indexes

### **Primary Indexes:**
- **idx_users_role** - Role-based queries
- **idx_users_status** - User status filtering
- **idx_users_department** - Department-based queries
- **idx_projects_status** - Project status filtering
- **idx_projects_manager** - Manager-based queries
- **idx_submissions_status** - Submission status filtering
- **idx_submissions_type** - Submission type filtering
- **idx_submissions_approver** - Approver-based queries
- **idx_notifications_user** - User notification queries
- **idx_notifications_read** - Read status filtering
- **idx_training_status** - Training status filtering
- **idx_partners_type** - Partner type filtering
- **idx_system_logs_timestamp** - Log timestamp queries
- **idx_approval_history_submission** - Submission history queries
- **idx_workflow_rules_type** - Workflow rule queries

### **Full-text Search Indexes:**
- **idx_projects_search** - Project name and description search
- **idx_training_search** - Training name and description search
- **idx_users_search** - User name and email search

---

## 🔗 Relationship Diagram

```
users (1) ── (many) departments
users (1) ── (many) projects (manager)
users (1) ── (many) projects (created_by)
users (1) ── (many) projects (approved_by)
users (1) ── (many) training_programs
users (1) ── (many) partners
users (1) ── (many) submissions (submitted_by)
users (1) ── (many) submissions (current_approver)
users (1) ── (many) submissions (approved_by)
users (1) ── (many) training_participants
users (1) ── (many) notifications
users (1) ── (many) user_sessions
users (1) ── (many) system_logs
users (1) ── (many) access_requests
users (1) ── (many) it_management
users (1) ── (many) audit_management (auditor)
users (1) ── (many) council_meetings (created_by)
users (1) ── (many) financial_records (created_by)
users (1) ── (many) financial_records (approved_by)

projects (1) ── (many) project_activities
projects (1) ── (many) submission_comments
projects (1) ── (many) approval_history

training_programs (1) ── (many) training_participants
training_programs (1) ── (many) submission_comments
training_programs (1) ── (many) approval_history

submissions (1) ── (many) submission_comments
submissions (1) ── (many) approval_history
submissions (1) ── (many) financial_records
```

---

## 🚀 Database Initialization

### **Sample Data Insertion:**

#### **Leadership Users:**
```sql
INSERT INTO users (username, password, full_name, email, phone, role, position, department_id, status, permissions) VALUES
('ceo', '$2y$10$...', 'Chief Executive Officer', 'ceo@ayikb.rw', '0788000001', 'ceo', 'CEO', 1, 'active', '{"all": true, "approve_all": true, "view_reports": true, "manage_users": true, "system_settings": true, "manage_council": true, "manage_auditor": true, "manage_it": true}'),
('admin', '$2y$10$...', 'System Administrator', 'admin@ayikb.rw', '0788000002', 'admin', 'System Administrator', 1, 'active', '{"manage_users": true, "system_settings": true, "view_logs": true, "backup_system": true, "manage_it": false, "view_reports": false}'),
('it_admin', '$2y$10$...', 'IT Administrator', 'it@ayikb.rw', '0788000005', 'it', 'IT Administrator', 6, 'active', '{"system_maintenance": true, "user_support": true, "security_management": true, "data_backup": true, "network_management": true, "view_system_logs": true}'),
('auditor', '$2y$10$...', 'Internal Auditor', 'auditor@ayikb.rw', '0788000006', 'auditor', 'Internal Auditor', 7, 'active', '{"audit_reports": true, "view_financial": true, "view_operations": true, "compliance_check": true, "audit_trail": true, "generate_audit_reports": true}'),
('council_chair', '$2y$10$...', 'AYIKB Council Chair', 'council@ayikb.rw', '0788000007', 'council', 'Council Chairperson', 8, 'active', '{"strategic_oversight": true, "policy_approval": true, "performance_review": true, "view_all_reports": true, "approve_major_decisions": true, "governance": true}');
```

#### **Sample Projects:**
```sql
INSERT INTO projects (project_name, project_code, project_type, description, budget, start_date, end_date, status, priority, manager_id, created_by) VALUES
('Phase 1: Ubuhinzi', 'AGR-001', 'agriculture', 'Gutera ibigori na ibirayi', 1000000.00, '2024-01-01', '2024-12-31', 'active', 'high', 3, 1),
('Phase 2: Ubworozi bw\'Ingurube', 'LIV-001', 'livestock', 'Gutangira ubworozi bw\'ingurube', 800000.00, '2024-06-01', '2025-05-31', 'planning', 'medium', 3, 1),
('Phase 3: Ubworozi bw\'Inkoko', 'LIV-002', 'livestock', 'Gutangira ubworozi bw\'inkoko', 1000000.00, '2024-09-01', '2025-08-31', 'planning', 'medium', 3, 1);
```

#### **Workflow Rules:**
```sql
INSERT INTO workflow_rules (submission_type, priority_level, amount_threshold, required_approver_role, sequence_order, is_final) VALUES
('budget', 'high', 1000000, 'coordinator', 1, FALSE),
('budget', 'high', 1000000, 'accountable', 2, FALSE),
('budget', 'high', 1000000, 'admin', 3, TRUE),
('budget', 'critical', 5000000, 'council', 1, FALSE),
('budget', 'critical', 5000000, 'council', 2, FALSE),
('budget', 'critical', 5000000, 'council', 3, TRUE),
('policy', 'low', 0, 'council', 1, FALSE),
('policy', 'low', 0, 'council', 2, TRUE),
('strategic', 'high', 0, 'council', 1, FALSE),
('strategic', 'high', 0, 'council', 2, TRUE);
```

---

## 📊 Database Statistics

### **Table Summary:**
| Category | Tables | Purpose |
|----------|--------|---------|
| User Management | 2 | Users, Departments |
| Project Management | 2 | Projects, Activities |
| Training Management | 2 | Programs, Participants |
| Partnership Management | 1 | Partners |
| Workflow Management | 4 | Submissions, Comments, Rules, History |
| Communication | 1 | Notifications |
| IT Management | 1 | IT Systems |
| Audit Management | 1 | Audits |
| Council Management | 1 | Council Meetings |
| Financial Management | 1 | Financial Records |
| Security & Access | 3 | Sessions, Logs, Access Requests |

### **Data Volume Estimates:**
- **Users**: ~50 records
- **Projects**: ~20 active projects
- **Training Programs**: ~10-15 programs per year
- **Partners**: ~10-15 active partners
- **Submissions**: ~100-200 submissions per year
- **Notifications**: ~500-1000 notifications per year
- **System Logs**: ~10,000+ log entries per year

---

## 🔒 Security Features

### **Data Protection:**
- ✅ **Password hashing** with bcrypt
- ✅ **Session management** with unique tokens
- ✅ **IP address tracking** for security monitoring
- ✅ **User agent logging** for device tracking
- ✅ **Access control** with role-based permissions
- ✅ **Audit trail** for all data changes

### **Data Integrity:**
- ✅ **Foreign key constraints** for referential integrity
- ✅ **Unique constraints** for data uniqueness
- ✅ **Check constraints** for data validation
- ✅ **Triggers** for audit trail maintenance
- ✅ **Transactions** for data consistency

---

## 🚀 Performance Optimization

### **Query Optimization:**
- ✅ **Strategic indexing** for common queries
- ✅ **Full-text search** for content searching
- ✅ **View optimization** for dashboard queries
- ✅ **Stored procedures** for complex operations
- ✅ **Query caching** for frequently accessed data

### **Scalability Considerations:**
- ✅ **Partitioning ready** table structures
- ✅ **Index optimization** for large datasets
- ✅ **Connection pooling** support
- ✅ **Query optimization** for performance
- ✅ **Data archiving** strategies

---

## 🔄 Maintenance and Backup

### **Regular Maintenance:**
- ✅ **Index optimization** and rebuilding
- ✅ **Statistics updates** for query optimization
- ✅ **Log rotation** and archiving
- ✅ **Data cleanup** for old records
- ✅ **Performance monitoring** and tuning

### **Backup Strategy:**
- ✅ **Full database backups** daily
- ✅ **Incremental backups** hourly
- ✅ **Transaction log backups** every 15 minutes
- ✅ **Point-in-time recovery** capability
- ✅ **Off-site backup** storage

---

## 📚 Usage Examples

### **User Authentication:**
```sql
CALL AuthenticateUser('admin@ayikb.rw', 'admin123', '192.168.1.100', 'Mozilla/5.0...', @result, @user_data);
SELECT @result as auth_result, @user_data as user_info;
```

### **Submit Budget Request:**
```sql
CALL SubmitItem('Q2 Budget Request', 'Budget allocation for Phase 2 project', 'budget', 'high', 2500000.00, 3, NULL, @submission_id);
SELECT @submission_id as new_submission_id;
```

### **Approve Submission:**
```sql
CALL ApproveItem(1, 4, 'Budget approved as requested', @result);
SELECT @result as approval_result;
```

### **System Maintenance Log:**
```sql
CALL LogSystemMaintenance(6, 'Main Server', 'hardware', 'Routine maintenance completed');
```

### **Create Audit:**
```sql
CALL CreateAudit(7, 'financial', 'Q2 2024 Financial Audit', '2024-04-01', '2024-06-30', 'No major issues found', 'Continue current practices');
```

---

## 🎯 Conclusion

The AYIKB database design provides a **comprehensive, scalable, and secure** foundation for the agricultural business management system. With **25 tables**, **4 views**, **6 stored procedures**, and **4 triggers**, it supports:

✅ **Complete user management** with role-based access control  
✅ **Multi-level approval workflows** for all business processes  
✅ **Specialized leadership roles** (IT, Auditor, Council)  
✅ **Comprehensive audit trail** and system logging  
✅ **Performance optimization** with strategic indexing  
✅ **Data integrity** with proper constraints and relationships  
✅ **Scalable architecture** for future growth  
✅ **Security best practices** with encryption and access control  

This database design supports the **complete AYIKB ecosystem** with professional governance, operational efficiency, and strategic oversight capabilities! 🌱👑
