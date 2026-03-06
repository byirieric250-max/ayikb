-- Update AYIKB Database with New Leadership Roles
-- Adding IT, Auditor, and AYIKB Council accounts

-- Update users table to include new roles
ALTER TABLE users MODIFY COLUMN role ENUM(
    'ceo', 'admin', 'coordinator', 'accountable', 'manager', 'employee', 'it', 'auditor', 'council'
) NOT NULL;

-- Insert new leadership accounts
INSERT INTO users (username, password, full_name, email, phone, role, position, department, status, created_at) VALUES
('it_admin', 'it123', 'IT Administrator', 'it@ayikb.rw', '0788000005', 'it', 'IT Administrator', 'Management', 'active', NOW()),
('auditor', 'audit123', 'Internal Auditor', 'auditor@ayikb.rw', '0788000006', 'auditor', 'Internal Auditor', 'Management', 'active', NOW()),
('council_chair', 'council123', 'AYIKB Council Chair', 'council@ayikb.rw', '0788000007', 'council', 'Council Chairperson', 'Management', 'active', NOW()),
('council_member1', 'council123', 'Council Member 1', 'council1@ayikb.rw', '0788000008', 'council', 'Council Member', 'Management', 'active', NOW()),
('council_member2', 'council123', 'Council Member 2', 'council2@ayikb.rw', '0788000009', 'council', 'Council Member', 'Management', 'active', NOW());

-- Update existing users with enhanced permissions
UPDATE users SET 
    permissions = CASE 
        WHEN role = 'ceo' THEN '{"all": true, "approve_all": true, "view_reports": true, "manage_users": true, "system_settings": true, "manage_council": true, "manage_auditor": true, "manage_it": true}'
        WHEN role = 'admin' THEN '{"manage_users": true, "system_settings": true, "view_logs": true, "backup_system": true, "manage_it": false, "view_reports": false}'
        WHEN role = 'coordinator' THEN '{"submit": true, "view_own": true, "edit_own": true, "view_reports": true, "approve_team": true, "manage_projects": true}'
        WHEN role = 'accountable' THEN '{"submit": true, "view_own": true, "edit_own": true, "approve_expenses": true, "view_financial": true, "view_reports": true, "manage_budget": true}'
        WHEN role = 'manager' THEN '{"submit": true, "view_team": true, "approve_team": true, "view_reports": true, "manage_projects": true}'
        WHEN role = 'it' THEN '{"system_maintenance": true, "user_support": true, "security_management": true, "data_backup": true, "network_management": true, "view_system_logs": true}'
        WHEN role = 'auditor' THEN '{"audit_reports": true, "view_financial": true, "view_operations": true, "compliance_check": true, "audit_trail": true, "generate_audit_reports": true}'
        WHEN role = 'council' THEN '{"strategic_oversight": true, "policy_approval": true, "performance_review": true, "view_all_reports": true, "approve_major_decisions": true, "governance": true}'
        ELSE '{"view_own": true}'
    END
WHERE role IN ('ceo', 'admin', 'coordinator', 'accountable', 'manager');

-- Set permissions for new roles
UPDATE users SET 
    permissions = CASE 
        WHEN role = 'it' THEN '{"system_maintenance": true, "user_support": true, "security_management": true, "data_backup": true, "network_management": true, "view_system_logs": true}'
        WHEN role = 'auditor' THEN '{"audit_reports": true, "view_financial": true, "view_operations": true, "compliance_check": true, "audit_trail": true, "generate_audit_reports": true}'
        WHEN role = 'council' THEN '{"strategic_oversight": true, "policy_approval": true, "performance_review": true, "view_all_reports": true, "approve_major_decisions": true, "governance": true}'
    END
WHERE role IN ('it', 'auditor', 'council');

-- Create IT management table
CREATE TABLE IF NOT EXISTS it_management (
    it_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    system_name VARCHAR(100) NOT NULL,
    system_type ENUM('hardware', 'software', 'network', 'security', 'backup') NOT NULL,
    status ENUM('operational', 'maintenance', 'issue', 'offline') DEFAULT 'operational',
    last_maintenance TIMESTAMP NULL,
    next_maintenance TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create audit management table
CREATE TABLE IF NOT EXISTS audit_management (
    audit_id INT PRIMARY KEY AUTO_INCREMENT,
    auditor_id INT NOT NULL,
    audit_type ENUM('financial', 'operational', 'compliance', 'security', 'performance') NOT NULL,
    audit_title VARCHAR(200) NOT NULL,
    audit_period_start DATE NOT NULL,
    audit_period_end DATE NOT NULL,
    findings TEXT,
    recommendations TEXT,
    status ENUM('planned', 'in_progress', 'completed', 'follow_up') DEFAULT 'planned',
    audit_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (auditor_id) REFERENCES users(user_id)
);

-- Create council meetings table
CREATE TABLE IF NOT EXISTS council_meetings (
    meeting_id INT PRIMARY KEY AUTO_INCREMENT,
    meeting_title VARCHAR(200) NOT NULL,
    meeting_date DATETIME NOT NULL,
    meeting_type ENUM('regular', 'special', 'emergency') DEFAULT 'regular',
    location VARCHAR(200),
    agenda TEXT,
    minutes TEXT,
    decisions TEXT,
    attendees TEXT, -- JSON array of user IDs
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Insert sample IT management records
INSERT INTO it_management (user_id, system_name, system_type, status, last_maintenance, next_maintenance, notes) VALUES
(6, 'Main Server', 'hardware', 'operational', '2024-03-01 10:00:00', '2024-04-01 10:00:00', 'Primary application server running smoothly'),
(6, 'Network Infrastructure', 'network', 'operational', '2024-03-05 14:00:00', '2024-04-05 14:00:00', 'All network devices operational'),
(6, 'Backup System', 'backup', 'operational', '2024-03-10 08:00:00', '2024-03-24 08:00:00', 'Daily backups running successfully'),
(6, 'Security Systems', 'security', 'operational', '2024-03-08 11:00:00', '2024-04-08 11:00:00', 'Firewall and antivirus up to date'),
(6, 'Application Software', 'software', 'maintenance', '2024-03-15 09:00:00', '2024-03-20 09:00:00', 'Scheduled maintenance in progress');

-- Insert sample audit records
INSERT INTO audit_management (auditor_id, audit_type, audit_title, audit_period_start, audit_period_end, status, audit_date) VALUES
(7, 'financial', 'Q1 2024 Financial Audit', '2024-01-01', '2024-03-31', 'completed', '2024-04-05'),
(7, 'operational', 'Operations Performance Audit', '2024-01-01', '2024-03-31', 'completed', '2024-04-10'),
(7, 'compliance', 'Regulatory Compliance Check', '2024-01-01', '2024-03-31', 'in_progress', NULL),
(7, 'security', 'IT Security Audit', '2024-02-01', '2024-03-31', 'planned', '2024-04-15'),
(7, 'performance', 'Project Performance Review', '2024-01-01', '2024-03-31', 'planned', '2024-04-20');

-- Insert sample council meetings
INSERT INTO council_meetings (meeting_title, meeting_date, meeting_type, location, agenda, attendees, status, created_by) VALUES
('Q1 2024 Council Meeting', '2024-03-15 14:00:00', 'regular', 'AYIKB Office', 'Review Q1 performance, approve Q2 budget, discuss strategic initiatives', '[8,9,10]', 'completed', 8),
('Emergency Budget Meeting', '2024-02-20 10:00:00', 'emergency', 'AYIKB Office', 'Discuss budget reallocation for Phase 2 project', '[8,9,10]', 'completed', 8),
('Strategic Planning Session', '2024-04-10 09:00:00', 'special', 'AYIKB Office', 'Develop 2024-2026 strategic plan', '[8,9,10]', 'scheduled', 8),
('Policy Review Meeting', '2024-04-25 14:00:00', 'regular', 'AYIKB Office', 'Review and update organizational policies', '[8,9,10]', 'scheduled', 8);

-- Update workflow rules to include new roles
INSERT INTO workflow_rules (submission_type, priority_level, amount_threshold, required_approver_role, sequence_order) VALUES
('budget', 'high', 5000000, 'council', 1),
('budget', 'high', 5000000, 'council', 2),
('budget', 'high', 5000000, 'council', 3),
('policy', 'high', 0, 'council', 1),
('policy', 'medium', 0, 'council', 1),
('policy', 'low', 0, 'council', 1),
('strategic', 'high', 0, 'council', 1),
('strategic', 'medium', 0, 'council', 1),
('strategic', 'low', 0, 'council', 1),
('audit', 'high', 0, 'auditor', 1),
('audit', 'medium', 0, 'auditor', 1),
('audit', 'low', 0, 'auditor', 1),
('system', 'high', 0, 'it', 1),
('system', 'medium', 0, 'it', 1),
('system', 'low', 0, 'it', 1);

-- Create notifications for new roles
INSERT INTO notifications (user_id, title, message, notification_type, action_required) VALUES
(6, 'IT System Update', 'Please review the latest system maintenance schedule.', 'info', TRUE),
(7, 'Audit Schedule', 'Q1 financial audit has been completed. Please review findings.', 'success', TRUE),
(8, 'Council Meeting', 'Strategic planning session scheduled for April 10, 2024.', 'warning', TRUE),
(9, 'Council Meeting', 'Strategic planning session scheduled for April 10, 2024.', 'warning', TRUE),
(10, 'Council Meeting', 'Strategic planning session scheduled for April 10, 2024.', 'warning', TRUE);

-- Update departments table to include new departments
INSERT INTO departments (department_name, department_code, description) VALUES
('IT Department', 'IT', 'Information Technology and Systems Management'),
('Audit Department', 'AUD', 'Internal Audit and Compliance'),
('Council Office', 'COUNCIL', 'AYIKB Council and Governance');

-- Update user departments
UPDATE users SET department_id = 6 WHERE role = 'it';
UPDATE users SET department_id = 7 WHERE role = 'auditor';
UPDATE users SET department_id = 8 WHERE role = 'council';

-- Create role hierarchy view
CREATE VIEW role_hierarchy AS
SELECT 
    role,
    permissions,
    CASE 
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
    END as hierarchy_level
FROM users
GROUP BY role, permissions;

-- Create leadership dashboard view
CREATE VIEW leadership_dashboard AS
SELECT 
    u.user_id,
    u.full_name,
    u.role,
    u.department,
    d.department_name,
    COUNT(DISTINCT CASE WHEN s.status = 'pending' THEN s.submission_id END) as pending_tasks,
    COUNT(DISTINCT CASE WHEN s.status = 'approved' THEN s.submission_id END) as approved_tasks,
    COUNT(DISTINCT n.notification_id) as unread_notifications
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
GROUP BY u.user_id, u.full_name, u.role, u.department, d.department_name;

-- Create stored procedures for new roles
DELIMITER //

-- Procedure for IT system maintenance
CREATE PROCEDURE LogSystemMaintenance(
    IN p_user_id INT,
    IN p_system_name VARCHAR(100),
    IN p_system_type VARCHAR(20),
    IN p_notes TEXT
)
BEGIN
    INSERT INTO it_management (user_id, system_name, system_type, last_maintenance, next_maintenance, notes)
    VALUES (p_user_id, p_system_name, p_system_type, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), p_notes);
    
    -- Create notification for admin
    INSERT INTO notifications (user_id, title, message, notification_type)
    SELECT user_id, 'System Maintenance Completed', CONCAT('Maintenance completed for ', p_system_name), 'success'
    FROM users WHERE role = 'admin' AND status = 'active';
END //

-- Procedure for audit management
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
    INSERT INTO audit_management (auditor_id, audit_type, audit_title, audit_period_start, audit_period_end, findings, recommendations, status)
    VALUES (p_auditor_id, p_audit_type, p_audit_title, p_start_date, p_end_date, p_findings, p_recommendations, 'planned');
    
    -- Create notification for council
    INSERT INTO notifications (user_id, title, message, notification_type, action_required)
    SELECT user_id, 'New Audit Scheduled', CONCAT(p_audit_title, ' audit scheduled'), 'warning', TRUE
    FROM users WHERE role = 'council' AND status = 'active';
END //

-- Procedure for council meetings
CREATE PROCEDURE ScheduleCouncilMeeting(
    IN p_created_by INT,
    IN p_meeting_title VARCHAR(200),
    IN p_meeting_date DATETIME,
    IN p_meeting_type VARCHAR(20),
    IN p_location VARCHAR(200),
    IN p_agenda TEXT,
    IN p_attendees TEXT
)
BEGIN
    INSERT INTO council_meetings (meeting_title, meeting_date, meeting_type, location, agenda, attendees, created_by)
    VALUES (p_meeting_title, p_meeting_date, p_meeting_type, p_location, p_agenda, p_attendees, p_created_by);
    
    -- Create notifications for all council members
    INSERT INTO notifications (user_id, title, message, notification_type, action_required)
    SELECT user_id, 'Council Meeting Scheduled', CONCAT(p_meeting_title, ' scheduled for ', DATE(p_meeting_date)), 'warning', TRUE
    FROM users WHERE role = 'council' AND status = 'active';
END //

DELIMITER ;

-- Final verification
SELECT 'Leadership roles updated successfully!' as status;
SELECT COUNT(*) as total_users FROM users WHERE role IN ('ceo', 'admin', 'coordinator', 'accountable', 'manager', 'it', 'auditor', 'council');
SELECT role, COUNT(*) as count FROM users WHERE role IN ('ceo', 'admin', 'coordinator', 'accountable', 'manager', 'it', 'auditor', 'council') GROUP BY role;
