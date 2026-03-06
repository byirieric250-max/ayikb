-- AYIKB Complete Database Creation Script
-- AgriYouth Innovation Kirehe Business Database
-- Updated with Leadership Roles and Enhanced Structure

-- Create database
CREATE DATABASE IF NOT EXISTS ayikb_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ayikb_db;

-- Users Table (Updated with Leadership Roles)
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

-- Departments Table
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

-- Projects Table (Enhanced)
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

-- Project Activities Table (Enhanced)
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

-- Training Programs Table (Enhanced)
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

-- Training Participants Table
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

-- Partners Table (Enhanced)
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

-- Submissions Table (Enhanced Workflow)
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

-- Submission Comments Table
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

-- Workflow Rules Table (Enhanced)
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

-- Approval History Table
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

-- Notifications Table (Enhanced)
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

-- User Sessions Table
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

-- IT Management Table
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

-- Audit Management Table
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

-- Council Meetings Table
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

-- Financial Records Table
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

-- System Logs Table
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

-- Access Requests Table
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

-- Insert Default Departments
INSERT INTO departments (department_name, department_code, description) VALUES
('Management', 'MGMT', 'Executive and strategic management'),
('Agriculture', 'AGR', 'Crop farming and agricultural activities'),
('Livestock', 'LIV', 'Animal husbandry and livestock management'),
('Training', 'TRN', 'Training programs and capacity building'),
('Finance', 'FIN', 'Financial management and accounting'),
('IT Department', 'IT', 'Information Technology and Systems Management'),
('Audit Department', 'AUD', 'Internal Audit and Compliance'),
('Council Office', 'COUNCIL', 'AYIKB Council and Governance');

-- Insert Default Users with Leadership Roles
INSERT INTO users (username, password, full_name, email, phone, role, position, department_id, status, permissions) VALUES
-- CEO
('ceo', 'ceo123', 'Chief Executive Officer', 'ceo@ayikb.rw', '0788000001', 'ceo', 'CEO', 1, 'active', '{"all": true, "approve_all": true, "view_reports": true, "manage_users": true, "system_settings": true, "manage_council": true, "manage_auditor": true, "manage_it": true}'),

-- Admin
('admin', 'admin123', 'System Administrator', 'admin@ayikb.rw', '0788000002', 'admin', 'System Administrator', 1, 'active', '{"manage_users": true, "system_settings": true, "view_logs": true, "backup_system": true, "manage_it": false, "view_reports": false}'),

-- Coordinator
('coordinator', 'coord123', 'Project Coordinator', 'coordinator@ayikb.rw', '0788000003', 'coordinator', 'Project Coordinator', 1, 'active', '{"submit": true, "view_own": true, "edit_own": true, "view_reports": true, "approve_team": true, "manage_projects": true}'),

-- Accountable
('accountable', 'acc123', 'Accountable Officer', 'accountable@ayikb.rw', '0788000004', 'accountable', 'Accountable Officer', 5, 'active', '{"submit": true, "view_own": true, "edit_own": true, "approve_expenses": true, "view_financial": true, "view_reports": true, "manage_budget": true}'),

-- IT Administrator
('it_admin', 'it123', 'IT Administrator', 'it@ayikb.rw', '0788000005', 'it', 'IT Administrator', 6, 'active', '{"system_maintenance": true, "user_support": true, "security_management": true, "data_backup": true, "network_management": true, "view_system_logs": true}'),

-- Internal Auditor
('auditor', 'audit123', 'Internal Auditor', 'auditor@ayikb.rw', '0788000006', 'auditor', 'Internal Auditor', 7, 'active', '{"audit_reports": true, "view_financial": true, "view_operations": true, "compliance_check": true, "audit_trail": true, "generate_audit_reports": true}'),

-- Council Chair
('council_chair', 'council123', 'AYIKB Council Chair', 'council@ayikb.rw', '0788000007', 'council', 'Council Chairperson', 8, 'active', '{"strategic_oversight": true, "policy_approval": true, "performance_review": true, "view_all_reports": true, "approve_major_decisions": true, "governance": true}'),

-- Council Members
('council_member1', 'council123', 'Council Member 1', 'council1@ayikb.rw', '0788000008', 'council', 'Council Member', 8, 'active', '{"strategic_oversight": true, "policy_approval": true, "performance_review": true, "view_all_reports": true, "approve_major_decisions": true, "governance": true}'),
('council_member2', 'council123', 'Council Member 2', 'council2@ayikb.rw', '0788000009', 'council', 'Council Member', 8, 'active', '{"strategic_oversight": true, "policy_approval": true, "performance_review": true, "view_all_reports": true, "approve_major_decisions": true, "governance": true}'),

-- Sample Employees
('jean_mugisha', 'user123', 'Jean Mugisha', 'jean@ayikb.rw', '0788345678', 'employee', 'Farmer', 2, 'active', '{"view_own": true}'),
('marie_mukamana', 'user123', 'Marie Mukamana', 'marie@ayikb.rw', '0788456789', 'employee', 'Agriculture Worker', 2, 'active', '{"view_own": true}'),
('joseph_habimana', 'user123', 'Joseph Habimana', 'joseph@ayikb.rw', '0788567890', 'employee', 'Trainer', 4, 'active', '{"view_own": true}');

-- Insert Sample Projects
INSERT INTO projects (project_name, project_code, project_type, description, budget, start_date, end_date, status, priority, manager_id, created_by) VALUES
('Phase 1: Ubuhinzi', 'AGR-001', 'agriculture', 'Gutera ibigori na ibirayi', 1000000.00, '2024-01-01', '2024-12-31', 'active', 'high', 3, 1),
('Phase 2: Ubworozi bw\'Ingurube', 'LIV-001', 'livestock', 'Gutangira ubworozi bw\'ingurube', 800000.00, '2024-06-01', '2025-05-31', 'planning', 'medium', 3, 1),
('Phase 3: Ubworozi bw\'Inkoko', 'LIV-002', 'livestock', 'Gutangira ubworozi bw\'inkoko', 1000000.00, '2024-09-01', '2025-08-31', 'planning', 'medium', 3, 1),
('Amahugurwa yo ku Rubyirugo', 'TRN-001', 'training', 'Gutanga amahugurwa ku rubyirugo', 500000.00, '2024-01-15', '2024-12-31', 'active', 'medium', 3, 1);

-- Insert Sample Training Programs
INSERT INTO training_programs (training_name, training_code, category, description, trainer_name, trainer_contact, start_date, end_date, start_time, end_time, location, max_participants, cost_per_participant, status, created_by) VALUES
('Uburyo bwo guhinga bwiza', 'TRN-001', 'agriculture', 'Amahugurwa ajyanye n\'uburyo bwo guhinga bwiza', 'MINAGRI Expert', '0788123456', '2024-04-20', '2024-04-20', '09:00:00', '17:00:00', 'AYIKB Office, Nyagahama', 50, 0.00, 'upcoming', 1),
('Ubworozi bw\'Ingurube', 'TRN-002', 'livestock', 'Amahugurwa ajyanye n\'ubworozi bw\'ingurube', 'RAB Veterinarian', '0788234567', '2024-03-15', '2024-04-15', '08:00:00', '16:00:00', 'AYIKB Farm', 25, 0.00, 'ongoing', 1),
('Ubucuruzi bw\'Umusaruro', 'TRN-003', 'business', 'Amahugurwa ajyanye n\'ubucuruzi bw\'umusaruro', 'Business Consultant', '0788345678', '2024-02-10', '2024-02-10', '09:00:00', '15:00:00', 'AYIKB Office', 40, 0.00, 'completed', 1),
('Technology in Agriculture', 'TRN-004', 'technology', 'Modern technology applications in farming', 'Tech Expert', '0788456789', '2024-01-20', '2024-01-20', '10:00:00', '14:00:00', 'AYIKB Office', 30, 0.00, 'completed', 1);

-- Insert Sample Partners
INSERT INTO partners (partner_name, partner_code, partner_type, description, email, phone, address, contact_person, contact_position, partnership_date, status, contribution_amount, projects_supported, created_by) VALUES
('Akarere ka Kirehe', 'GOV-001', 'government', 'Akarere ka Kirehe dukora kumurikira no gutanga inkunga', 'info@kirehe.gov.rw', '0788867890', 'Kirehe Town', 'Mayor Office', 'Mayor', '2024-01-01', 'active', 2000000.00, 5, 1),
('MINAGRI', 'GOV-002', 'government', 'Minisiteri y\'Ubuhinzi n\'Ubworozi', 'info@minagri.gov.rw', '0788465678', 'Kigali', 'Director of Agriculture', 'Director', '2024-01-15', 'active', 1500000.00, 3, 1),
('BDF', 'FIN-001', 'financial', 'Banki ya Development Bank of Rwanda', 'info@bdf.rw', '0788345678', 'Kirehe Branch', 'Branch Manager', 'Branch Manager', '2024-02-01', 'active', 1000000.00, 2, 1),
('RYAF', 'NGO-001', 'ngo', 'Rwanda Youth Agribusiness Forum', 'info@ryaf.rw', '0788234567', 'Kigali', 'Program Coordinator', 'Program Coordinator', '2024-02-10', 'active', 800000.00, 4, 1);

-- Insert Workflow Rules
INSERT INTO workflow_rules (submission_type, priority_level, amount_threshold, required_approver_role, sequence_order, is_final) VALUES
-- Budget approvals
('budget', 'low', 0, 'coordinator', 1, FALSE),
('budget', 'low', 0, 'accountable', 2, FALSE),
('budget', 'low', 0, 'admin', 3, TRUE),
('budget', 'medium', 0, 'coordinator', 1, FALSE),
('budget', 'medium', 0, 'accountable', 2, FALSE),
('budget', 'medium', 0, 'admin', 3, TRUE),
('budget', 'high', 1000000, 'coordinator', 1, FALSE),
('budget', 'high', 1000000, 'accountable', 2, FALSE),
('budget', 'high', 1000000, 'admin', 3, TRUE),
('budget', 'critical', 5000000, 'council', 1, FALSE),
('budget', 'critical', 5000000, 'council', 2, FALSE),
('budget', 'critical', 5000000, 'council', 3, TRUE),

-- Project approvals
('project', 'low', 0, 'coordinator', 1, FALSE),
('project', 'low', 0, 'admin', 2, TRUE),
('project', 'medium', 0, 'coordinator', 1, FALSE),
('project', 'medium', 0, 'admin', 2, TRUE),
('project', 'high', 0, 'coordinator', 1, FALSE),
('project', 'high', 0, 'admin', 2, TRUE),
('project', 'critical', 0, 'council', 1, FALSE),
('project', 'critical', 0, 'council', 2, TRUE),

-- Policy approvals
('policy', 'low', 0, 'council', 1, FALSE),
('policy', 'low', 0, 'council', 2, TRUE),
('policy', 'medium', 0, 'council', 1, FALSE),
('policy', 'medium', 0, 'council', 2, TRUE),
('policy', 'high', 0, 'council', 1, FALSE),
('policy', 'high', 0, 'council', 2, TRUE),
('policy', 'critical', 0, 'council', 1, FALSE),
('policy', 'critical', 0, 'council', 2, TRUE),

-- Strategic approvals
('strategic', 'low', 0, 'council', 1, FALSE),
('strategic', 'low', 0, 'council', 2, TRUE),
('strategic', 'medium', 0, 'council', 1, FALSE),
('strategic', 'medium', 0, 'council', 2, TRUE),
('strategic', 'high', 0, 'council', 1, FALSE),
('strategic', 'high', 0, 'council', 2, TRUE),
('strategic', 'critical', 0, 'council', 1, FALSE),
('strategic', 'critical', 0, 'council', 2, TRUE),

-- Audit approvals
('audit', 'low', 0, 'auditor', 1, TRUE),
('audit', 'medium', 0, 'auditor', 1, TRUE),
('audit', 'high', 0, 'auditor', 1, TRUE),
('audit', 'critical', 0, 'auditor', 1, TRUE),

-- System approvals
('system', 'low', 0, 'it', 1, TRUE),
('system', 'medium', 0, 'it', 1, TRUE),
('system', 'high', 0, 'it', 1, TRUE),
('system', 'critical', 0, 'it', 1, TRUE);

-- Insert IT Management Records
INSERT INTO it_management (user_id, system_name, system_code, system_type, status, last_maintenance, next_maintenance, notes) VALUES
(6, 'Main Server', 'SYS-001', 'hardware', 'operational', '2024-03-01 10:00:00', '2024-04-01 10:00:00', 'Primary application server running smoothly'),
(6, 'Network Infrastructure', 'SYS-002', 'network', 'operational', '2024-03-05 14:00:00', '2024-04-05 14:00:00', 'All network devices operational'),
(6, 'Backup System', 'SYS-003', 'backup', 'operational', '2024-03-10 08:00:00', '2024-03-24 08:00:00', 'Daily backups running successfully'),
(6, 'Security Systems', 'SYS-004', 'security', 'operational', '2024-03-08 11:00:00', '2024-04-08 11:00:00', 'Firewall and antivirus up to date'),
(6, 'Application Software', 'SYS-005', 'software', 'maintenance', '2024-03-15 09:00:00', '2024-03-20 09:00:00', 'Scheduled maintenance in progress');

-- Insert Audit Management Records
INSERT INTO audit_management (auditor_id, audit_code, audit_type, audit_title, audit_period_start, audit_period_end, findings, recommendations, risk_level, status, audit_date) VALUES
(7, 'AUD-001', 'financial', 'Q1 2024 Financial Audit', '2024-01-01', '2024-03-31', 'Minor discrepancies in expense reporting', 'Implement automated expense reporting system', 'medium', 'completed', '2024-04-05'),
(7, 'AUD-002', 'operational', 'Operations Performance Audit', '2024-01-01', '2024-03-31', 'Efficiency improvements needed in project management', 'Adopt project management software with real-time tracking', 'medium', 'completed', '2024-04-10'),
(7, 'AUD-003', 'compliance', 'Regulatory Compliance Check', '2024-01-01', '2024-03-31', 'Good overall compliance with regulations', 'Continue maintaining current compliance standards', 'low', 'in_progress', NULL),
(7, 'AUD-004', 'security', 'IT Security Audit', '2024-02-01', '2024-03-31', 'Security systems functioning properly', 'Regular security updates recommended', 'low', 'planned', '2024-04-15'),
(7, 'AUD-005', 'performance', 'Project Performance Review', '2024-01-01', '2024-03-31', 'Projects progressing according to schedule', 'Continue current project management practices', 'low', 'planned', '2024-04-20');

-- Insert Council Meetings
INSERT INTO council_meetings (meeting_code, meeting_title, meeting_date, meeting_type, location, agenda, attendees, status, created_by) VALUES
('MEET-001', 'Q1 2024 Council Meeting', '2024-03-15 14:00:00', 'regular', 'AYIKB Office', 'Review Q1 performance, approve Q2 budget, discuss strategic initiatives', '[8,9,10]', 'completed', 8),
('MEET-002', 'Emergency Budget Meeting', '2024-02-20 10:00:00', 'emergency', 'AYIKB Office', 'Discuss budget reallocation for Phase 2 project', '[8,9,10]', 'completed', 8),
('MEET-003', 'Strategic Planning Session', '2024-04-10 09:00:00', 'special', 'AYIKB Office', 'Develop 2024-2026 strategic plan', '[8,9,10]', 'scheduled', 8),
('MEET-004', 'Policy Review Meeting', '2024-04-25 14:00:00', 'regular', 'AYIKB Office', 'Review and update organizational policies', '[8,9,10]', 'scheduled', 8);

-- Insert Sample Notifications
INSERT INTO notifications (user_id, title, message, notification_type, action_required) VALUES
(1, 'New Submission', 'Q2 budget proposal requires your approval', 'warning', TRUE),
(3, 'Project Update', 'Phase 1 project progress update available', 'info', FALSE),
(4, 'Financial Report', 'Q1 financial report is ready for review', 'success', TRUE),
(6, 'System Maintenance', 'Please review the latest system maintenance schedule', 'info', TRUE),
(7, 'Audit Schedule', 'Q1 financial audit has been completed. Please review findings', 'success', TRUE),
(8, 'Council Meeting', 'Strategic planning session scheduled for April 10, 2024', 'warning', TRUE),
(9, 'Council Meeting', 'Strategic planning session scheduled for April 10, 2024', 'warning', TRUE),
(10, 'Council Meeting', 'Strategic planning session scheduled for April 10, 2024', 'warning', TRUE);

-- Create Views for Enhanced Reporting

-- Leadership Dashboard View
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
LEFT JOIN submissions s ON (
    (u.role = 'ceo' AND s.workflow_level = s.max_workflow_level AND s.status = 'pending') OR
    (u.role = 'council' AND s.workflow_level = s.max_workflow_level AND s.status = 'pending') OR
    (u.role = 'auditor' AND s.submission_type = 'audit' AND s.status = 'pending') OR
    (u.role = 'it' AND s.submission_type = 'system' AND s.status = 'pending') OR
    (u.role = 'admin' AND s.status = 'pending') OR
    (u.role = 'coordinator' AND s.workflow_level = 1 AND s.status = 'pending') OR
    (u.role = 'accountable' AND s.workflow_level = 2 AND s.status = 'pending') OR
    (u.role = 'manager' AND s.workflow_level <= 2 AND s.status = 'pending')
)
LEFT JOIN notifications n ON u.user_id = n.user_id AND n.is_read = FALSE
WHERE u.role IN ('ceo', 'admin', 'coordinator', 'accountable', 'manager', 'it', 'auditor', 'council')
    AND u.status = 'active'
GROUP BY u.user_id, u.full_name, u.role, d.department_name;

-- Role Hierarchy View
CREATE VIEW role_hierarchy AS
SELECT 
    role,
    MAX(CASE 
        WHEN role = 'ceo' THEN 1
        WHEN role = 'council' THEN 2
        WHEN role = 'auditor' THEN 3
        WHEN role = 'admin' THEN 4
        WHEN role = 'coordinator' THEN 5
        WHEN role = 'accountable' THEN 6
        WHEN role = 'manager' THEN 7
        WHEN role = 'it' THEN 8
        WHEN role = 'employee' THEN 9
        ELSE 10
    END) as hierarchy_level,
    COUNT(*) as user_count
FROM users
WHERE status = 'active'
GROUP BY role;

-- System Status View
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

-- Audit Overview View
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

-- Create Stored Procedures

DELIMITER //

-- Procedure for User Authentication
CREATE PROCEDURE AuthenticateUser(
    IN p_username VARCHAR(50),
    IN p_password VARCHAR(255),
    IN p_ip_address VARCHAR(45),
    IN p_user_agent TEXT,
    OUT p_result INT,
    OUT p_user_data JSON
)
BEGIN
    DECLARE v_user_id INT;
    DECLARE v_full_name VARCHAR(100);
    DECLARE v_role VARCHAR(20);
    DECLARE v_permissions JSON;
    DECLARE v_department VARCHAR(100);
    
    -- Check if user exists and password matches
    SELECT user_id, full_name, role, permissions, department_name
    INTO v_user_id, v_full_name, v_role, v_permissions, v_department
    FROM users u
    LEFT JOIN departments d ON u.department_id = d.department_id
    WHERE u.username = p_username 
    AND u.password = p_password 
    AND u.status = 'active';
    
    IF v_user_id IS NOT NULL THEN
        -- Update last login
        UPDATE users SET last_login = NOW() WHERE user_id = v_user_id;
        
        -- Create session
        INSERT INTO user_sessions (user_id, session_token, ip_address, user_agent)
        VALUES (v_user_id, UUID(), p_ip_address, p_user_agent);
        
        -- Return success
        SET p_result = 1;
        SET p_user_data = JSON_OBJECT(
            'user_id', v_user_id,
            'full_name', v_full_name,
            'role', v_role,
            'permissions', v_permissions,
            'department', v_department
        );
    ELSE
        -- Return failure
        SET p_result = 0;
        SET p_user_data = NULL;
    END IF;
END //

-- Procedure for Submitting Item
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
BEGIN
    DECLARE v_workflow_level INT DEFAULT 1;
    DECLARE v_max_workflow_level INT DEFAULT 3;
    DECLARE v_current_approver INT;
    
    -- Generate submission code
    SET @submission_code = CONCAT(p_submission_type, '-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 1000), 3, '0'));
    
    -- Get workflow rules for this submission
    SELECT MAX(sequence_order), MAX(sequence_order)
    INTO v_max_workflow_level, v_workflow_level
    FROM workflow_rules 
    WHERE submission_type = p_submission_type 
    AND (amount_threshold = 0 OR amount_threshold <= p_amount)
    AND priority_level = p_priority
    ORDER BY sequence_order ASC;
    
    -- Get current approver
    SELECT u.user_id INTO v_current_approver
    FROM users u
    WHERE u.role = (
        SELECT required_approver_role 
        FROM workflow_rules 
        WHERE submission_type = p_submission_type 
        AND (amount_threshold = 0 OR amount_threshold <= p_amount)
        AND priority_level = p_priority
        AND sequence_order = v_workflow_level
        LIMIT 1
    );
    
    -- Insert submission
    INSERT INTO submissions (
        submission_code, title, description, submission_type, 
        priority, amount, submitted_by, current_approver,
        workflow_level, max_workflow_level, status, attachments
    ) VALUES (
        @submission_code, p_title, p_description, p_submission_type,
        p_priority, p_amount, p_submitted_by, v_current_approver,
        v_workflow_level, v_max_workflow_level, 'submitted', p_attachments
    );
    
    SET p_submission_id = LAST_INSERT_ID();
    
    -- Create approval history record
    INSERT INTO approval_history (submission_id, approver_id, action, workflow_level)
    VALUES (p_submission_id, p_submitted_by, 'submitted', v_workflow_level);
    
    -- Send notification to approver
    INSERT INTO notifications (user_id, title, message, notification_type, action_required, related_id, related_type)
    VALUES (
        v_current_approver, 
        'New Submission', 
        CONCAT('New ', p_submission_type, ' submission requires your approval'), 
        'warning', 
        TRUE, 
        p_submission_id, 
        'submission'
    );
END //

-- Procedure for Approving Item
CREATE PROCEDURE ApproveItem(
    IN p_submission_id INT,
    IN p_approver_id INT,
    IN p_comments TEXT,
    OUT p_result BOOLEAN
)
BEGIN
    DECLARE v_submission_type VARCHAR(20);
    DECLARE v_workflow_level INT;
    DECLARE v_max_workflow_level INT;
    DECLARE v_next_approver_role VARCHAR(20);
    DECLARE v_next_approver_id INT;
    DECLARE v_amount DECIMAL(12, 2);
    DECLARE v_priority VARCHAR(10);
    
    -- Get submission details
    SELECT submission_type, workflow_level, max_workflow_level, amount, priority
    INTO v_submission_type, v_workflow_level, v_max_workflow_level, v_amount, v_priority
    FROM submissions 
    WHERE submission_id = p_submission_id 
    AND current_approver = p_approver_id
    AND status = 'pending';
    
    IF v_submission_type IS NOT NULL THEN
        -- Check if this is the final approval
        IF v_workflow_level = v_max_workflow_level THEN
            -- Final approval
            UPDATE submissions 
            SET status = 'approved', 
                approved_by = p_approver_id, 
                approved_date = NOW(),
                last_action_date = NOW()
            WHERE submission_id = p_submission_id;
            
            SET p_result = TRUE;
        ELSE
            -- Move to next level
            SELECT required_approver_role INTO v_next_approver_role
            FROM workflow_rules 
            WHERE submission_type = v_submission_type 
            AND (amount_threshold = 0 OR amount_threshold <= v_amount)
            AND priority_level = v_priority
            AND sequence_order = v_workflow_level + 1;
            
            -- Get next approver user
            SELECT user_id INTO v_next_approver_id
            FROM users 
            WHERE role = v_next_approver_role 
            AND status = 'active'
            LIMIT 1;
            
            IF v_next_approver_id IS NOT NULL THEN
                UPDATE submissions 
                SET current_approver = v_next_approver_id,
                    workflow_level = workflow_level + 1,
                    last_action_date = NOW()
                WHERE submission_id = p_submission_id;
                
                SET p_result = TRUE;
                
                -- Send notification to next approver
                INSERT INTO notifications (user_id, title, message, notification_type, action_required, related_id, related_type)
                VALUES (
                    v_next_approver_id, 
                    'Submission Approval', 
                    CONCAT('Submission requires your approval at level ', v_workflow_level + 1), 
                    'warning', 
                    TRUE, 
                    p_submission_id, 
                    'submission'
                );
            ELSE
                SET p_result = FALSE;
            END IF;
        END IF;
        
        -- Create approval history record
        INSERT INTO approval_history (submission_id, approver_id, action, comments, workflow_level)
        VALUES (p_submission_id, p_approver_id, 'approved', p_comments, v_workflow_level);
        
        -- Send notification to submitter
        INSERT INTO notifications (user_id, title, message, notification_type, action_required, related_id, related_type)
        VALUES (
            (SELECT submitted_by FROM submissions WHERE submission_id = p_submission_id),
            'Submission Approved', 
            CONCAT('Your submission has been approved at level ', v_workflow_level), 
            'success', 
            FALSE, 
            p_submission_id, 
            'submission'
        );
    ELSE
        SET p_result = FALSE;
    END IF;
END //

-- Procedure for IT System Maintenance
CREATE PROCEDURE LogSystemMaintenance(
    IN p_user_id INT,
    IN p_system_name VARCHAR(100),
    IN p_system_type VARCHAR(20),
    IN p_notes TEXT
)
BEGIN
    INSERT INTO it_management (user_id, system_name, system_code, system_type, last_maintenance, next_maintenance, notes)
    VALUES (p_user_id, p_system_name, CONCAT('SYS-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 1000), 3, '0')), p_system_type, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), p_notes);
    
    -- Create notification for admin
    INSERT INTO notifications (user_id, title, message, notification_type)
    SELECT user_id, 'System Maintenance Completed', CONCAT('Maintenance completed for ', p_system_name), 'success'
    FROM users WHERE role = 'admin' AND status = 'active';
END //

-- Procedure for Audit Management
CREATE PROCEDURE CreateAudit(
    IN p_auditor_id INT,
    IN p_audit_type VARCHAR(20),
    IN p_audit_title VARCHAR(200),
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_findings TEXT,
    IN p_recommendations TEXT
)
BEGIN
    INSERT INTO audit_management (auditor_id, audit_code, audit_type, audit_title, audit_period_start, audit_period_end, findings, recommendations, status)
    VALUES (p_auditor_id, CONCAT('AUD-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 1000), 3, '0')), p_audit_type, p_audit_title, p_start_date, p_end_date, p_findings, p_recommendations, 'planned');
    
    -- Create notification for council
    INSERT INTO notifications (user_id, title, message, notification_type, action_required)
    SELECT user_id, 'New Audit Scheduled', CONCAT(p_audit_title, ' audit scheduled'), 'warning', TRUE
    FROM users WHERE role = 'council' AND status = 'active';
END //

-- Procedure for Council Meetings
CREATE PROCEDURE ScheduleCouncilMeeting(
    IN p_created_by INT,
    IN p_meeting_title VARCHAR(200),
    IN p_meeting_date DATETIME,
    IN p_meeting_type VARCHAR(20),
    IN p_location VARCHAR(200),
    IN p_agenda TEXT,
    IN p_attendees JSON
)
BEGIN
    INSERT INTO council_meetings (meeting_code, meeting_title, meeting_date, meeting_type, location, agenda, attendees, created_by)
    VALUES (CONCAT('MEET-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 1000), 3, '0')), p_meeting_title, p_meeting_date, p_meeting_type, p_location, p_agenda, p_attendees, p_created_by);
    
    -- Create notifications for all council members
    INSERT INTO notifications (user_id, title, message, notification_type, action_required)
    SELECT user_id, 'Council Meeting Scheduled', CONCAT(p_meeting_title, ' scheduled for ', DATE(p_meeting_date)), 'warning', TRUE
    FROM users WHERE role = 'council' AND status = 'active';
END //

DELIMITER ;

-- Create Triggers for Audit Trail

DELIMITER //

-- Trigger for users table audit
CREATE TRIGGER users_audit_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO system_logs (user_id, action, table_name, record_id, new_values)
    VALUES (NEW.user_id, 'INSERT', 'users', NEW.user_id, JSON_OBJECT(
        'username', NEW.username,
        'full_name', NEW.full_name,
        'role', NEW.role,
        'department_id', NEW.department_id,
        'status', NEW.status
    ));
END //

CREATE TRIGGER users_audit_update
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    INSERT INTO system_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (NEW.user_id, 'UPDATE', 'users', NEW.user_id, 
        JSON_OBJECT(
            'username', OLD.username,
            'full_name', OLD.full_name,
            'role', OLD.role,
            'department_id', OLD.department_id,
            'status', OLD.status
        ),
        JSON_OBJECT(
            'username', NEW.username,
            'full_name', NEW.full_name,
            'role', NEW.role,
            'department_id', NEW.department_id,
            'status', NEW.status
        )
    );
END //

-- Trigger for submissions audit
CREATE TRIGGER submissions_audit_insert
AFTER INSERT ON submissions
FOR EACH ROW
BEGIN
    INSERT INTO system_logs (user_id, action, table_name, record_id, new_values)
    VALUES (NEW.submitted_by, 'INSERT', 'submissions', NEW.submission_id, JSON_OBJECT(
        'submission_code', NEW.submission_code,
        'title', NEW.title,
        'submission_type', NEW.submission_type,
        'priority', NEW.priority,
        'amount', NEW.amount,
        'status', NEW.status
    ));
END //

CREATE TRIGGER submissions_audit_update
AFTER UPDATE ON submissions
FOR EACH ROW
BEGIN
    INSERT INTO system_logs (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (NEW.approved_by, 'UPDATE', 'submissions', NEW.submission_id,
        JSON_OBJECT(
            'status', OLD.status,
            'workflow_level', OLD.workflow_level,
            'current_approver', OLD.current_approver
        ),
        JSON_OBJECT(
            'status', NEW.status,
            'workflow_level', NEW.workflow_level,
            'current_approver', NEW.current_approver
        )
    );
END //

DELIMITER ;

-- Create Indexes for Performance Optimization
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_manager ON projects(manager_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_type ON submissions(submission_type);
CREATE INDEX idx_submissions_approver ON submissions(current_approver);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_training_status ON training_programs(status);
CREATE INDEX idx_partners_type ON partners(partner_type);
CREATE INDEX idx_system_logs_timestamp ON system_logs(timestamp);
CREATE INDEX idx_approval_history_submission ON approval_history(submission_id);
CREATE INDEX idx_workflow_rules_type ON workflow_rules(submission_type);

-- Create Full-text Search Indexes
CREATE FULLTEXT INDEX idx_projects_search ON projects(project_name, description);
CREATE FULLTEXT INDEX idx_training_search ON training_programs(training_name, description);
CREATE FULLTEXT INDEX idx_users_search ON users(full_name, email);

-- Final verification
SELECT 'AYIKB Complete Database Created Successfully!' as status;
SELECT 'Tables Created' as component, COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'ayikb_db';
SELECT 'Users Created' as component, COUNT(*) as count FROM users;
SELECT 'Leadership Roles' as component, COUNT(*) as count FROM users WHERE role IN ('ceo', 'admin', 'coordinator', 'accountable', 'it', 'auditor', 'council');
SELECT 'Departments Created' as component, COUNT(*) as count FROM departments;
SELECT 'Projects Created' as component, COUNT(*) as count FROM projects;
SELECT 'Training Programs Created' as component, COUNT(*) as count FROM training_programs;
SELECT 'Partners Created' as component, COUNT(*) as count FROM partners;
