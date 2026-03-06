-- Enhanced AYIKB Database with Role-Based Access Control
-- Adding support for Admin, Coordinator, Accountable, and CEO roles

-- Update existing users table to include enhanced role management
ALTER TABLE users ADD COLUMN IF NOT EXISTS department_id INT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS reports_to INT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions TEXT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS session_token VARCHAR(255) NULL;

-- Create departments table for better organization
CREATE TABLE IF NOT EXISTS departments (
    department_id INT PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    department_code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    manager_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(user_id)
);

-- Create submissions table for CEO approval workflow
CREATE TABLE IF NOT EXISTS submissions (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    submission_code VARCHAR(20) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    submission_type ENUM('project', 'budget', 'report', 'training', 'partnership', 'other') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    status ENUM('draft', 'submitted', 'pending', 'under_review', 'approved', 'rejected', 'returned') DEFAULT 'draft',
    submitted_by INT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by INT NULL,
    reviewed_at TIMESTAMP NULL,
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    rejection_reason TEXT NULL,
    attachments TEXT NULL, -- JSON array of attachment paths
    workflow_level INT DEFAULT 1, -- Current level in approval workflow
    max_workflow_level INT DEFAULT 3, -- Maximum levels before CEO
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (submitted_by) REFERENCES users(user_id),
    FOREIGN KEY (reviewed_by) REFERENCES users(user_id),
    FOREIGN KEY (approved_by) REFERENCES users(user_id)
);

-- Create submission_comments table for tracking feedback
CREATE TABLE IF NOT EXISTS submission_comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    submission_id INT NOT NULL,
    user_id INT NOT NULL,
    comment TEXT NOT NULL,
    comment_type ENUM('review', 'approval', 'rejection', 'feedback', 'note') DEFAULT 'feedback',
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create workflow_rules table for approval processes
CREATE TABLE IF NOT EXISTS workflow_rules (
    rule_id INT PRIMARY KEY AUTO_INCREMENT,
    submission_type VARCHAR(50) NOT NULL,
    priority_level VARCHAR(20) NOT NULL,
    amount_threshold DECIMAL(12,2) DEFAULT 0,
    required_approver_role VARCHAR(50) NOT NULL,
    sequence_order INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (required_approver_role) REFERENCES users(role)
);

-- Create approval_history table for audit trail
CREATE TABLE IF NOT EXISTS approval_history (
    history_id INT PRIMARY KEY AUTO_INCREMENT,
    submission_id INT NOT NULL,
    user_id INT NOT NULL,
    action VARCHAR(50) NOT NULL, -- submitted, reviewed, approved, rejected, returned
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    comments TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (submission_id) REFERENCES submissions(submission_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type ENUM('info', 'warning', 'error', 'success') DEFAULT 'info',
    related_submission_id INT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    action_required BOOLEAN DEFAULT FALSE,
    action_url VARCHAR(500) NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (related_submission_id) REFERENCES submissions(submission_id)
);

-- Create user_sessions table for session management
CREATE TABLE IF NOT EXISTS user_sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Insert default departments
INSERT INTO departments (department_name, department_code, description) VALUES
('Management', 'MGT', 'Executive management and administration'),
('Operations', 'OPS', 'Daily operations and project management'),
('Finance', 'FIN', 'Financial management and budgeting'),
('Training', 'TRN', 'Training programs and capacity building'),
('Agriculture', 'AGR', 'Agricultural activities and farming'),
('Partnerships', 'PRT', 'Partner relationship management');

-- Insert enhanced user roles with specific permissions
INSERT INTO users (username, password, full_name, email, phone, role, position, department, status, permissions) VALUES
('ceo', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Chief Executive Officer', 'ceo@ayikb.rw', '0788000000', 'ceo', 'CEO', 'Management', 'active', '{"all": true, "approve_all": true, "view_reports": true, "manage_users": true, "system_settings": true}'),
('coordinator', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Project Coordinator', 'coordinator@ayikb.rw', '0788000001', 'coordinator', 'Project Coordinator', 'Operations', 'active', '{"submit": true, "view_own": true, "edit_own": true, "view_reports": false, "approve_budget": false}'),
('accountable', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Accountable Officer', 'accountable@ayikb.rw', '0788000002', 'accountable', 'Accountable Officer', 'Finance', 'active', '{"submit": true, "view_own": true, "edit_own": true, "approve_expenses": true, "view_financial": true}'),
('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin@ayikb.rw', '0788000003', 'admin', 'System Admin', 'Management', 'active', '{"manage_users": true, "system_settings": true, "view_logs": true, "backup_system": true}'),
('manager', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Operations Manager', 'manager@ayikb.rw', '0788000004', 'manager', 'Operations Manager', 'Operations', 'active', '{"submit": true, "view_team": true, "approve_team": true, "view_reports": true}');

-- Update existing users to link to departments
UPDATE users SET department_id = 1 WHERE role = 'ceo';
UPDATE users SET department_id = 2 WHERE role = 'coordinator';
UPDATE users SET department_id = 3 WHERE role = 'accountable';
UPDATE users SET department_id = 1 WHERE role = 'admin';
UPDATE users SET department_id = 2 WHERE role = 'manager';

-- Insert workflow rules for different submission types
INSERT INTO workflow_rules (submission_type, priority_level, amount_threshold, required_approver_role, sequence_order) VALUES
('budget', 'low', 100000, 'coordinator', 1),
('budget', 'low', 100000, 'accountable', 2),
('budget', 'low', 100000, 'ceo', 3),
('budget', 'medium', 500000, 'coordinator', 1),
('budget', 'medium', 500000, 'accountable', 2),
('budget', 'medium', 500000, 'ceo', 3),
('budget', 'high', 1000000, 'accountable', 1),
('budget', 'high', 1000000, 'ceo', 2),
('budget', 'urgent', 0, 'ceo', 1),
('project', 'low', 0, 'coordinator', 1),
('project', 'low', 0, 'manager', 2),
('project', 'medium', 0, 'coordinator', 1),
('project', 'medium', 0, 'manager', 2),
('project', 'medium', 0, 'ceo', 3),
('project', 'high', 0, 'manager', 1),
('project', 'high', 0, 'ceo', 2),
('project', 'urgent', 0, 'ceo', 1),
('partnership', 'low', 0, 'coordinator', 1),
('partnership', 'low', 0, 'ceo', 2),
('partnership', 'medium', 0, 'coordinator', 1),
('partnership', 'medium', 0, 'ceo', 2),
('partnership', 'high', 0, 'ceo', 1),
('partnership', 'urgent', 0, 'ceo', 1);

-- Insert sample submissions for testing
INSERT INTO submissions (submission_code, title, description, submission_type, priority, status, submitted_by, workflow_level, max_workflow_level) VALUES
('SUB001', 'Phase 2 Budget Proposal', 'Budget proposal for Phase 2 pig farming project including infrastructure and operational costs.', 'budget', 'high', 'pending', 2, 3),
('SUB002', 'Training Program Q2 2024', 'Comprehensive training program for Q2 2024 focusing on modern agricultural techniques.', 'training', 'medium', 'submitted', 2, 2),
('SUB003', 'New Partnership with MINAGRI', 'Partnership agreement with Ministry of Agriculture for technical support and funding.', 'partnership', 'high', 'pending', 2, 2),
('SUB004', 'Equipment Purchase Request', 'Request for purchase of modern farming equipment for Phase 1 expansion.', 'project', 'medium', 'approved', 2, 3),
('SUB005', 'Monthly Progress Report - March 2024', 'Detailed progress report for all ongoing projects in March 2024.', 'report', 'low', 'approved', 1, 2);

-- Insert sample comments
INSERT INTO submission_comments (submission_id, user_id, comment, comment_type) VALUES
(1, 2, 'Please provide more detailed cost breakdown for infrastructure.', 'feedback'),
(1, 3, 'Budget looks reasonable but need to verify market prices.', 'review'),
(2, 2, 'Training schedule aligned with agricultural calendar.', 'feedback'),
(3, 1, 'Partnership terms need clarification on funding timeline.', 'review');

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, notification_type, related_submission_id, action_required) VALUES
(1, 'New Submission Awaiting Approval', 'Phase 2 Budget Proposal requires your review and approval.', 'warning', 1, TRUE),
(2, 'Submission Returned for Revision', 'Training Program Q2 2024 has been returned with feedback.', 'info', 2, TRUE),
(3, 'Budget Review Required', 'Please review the Phase 2 Budget Proposal for financial feasibility.', 'warning', 1, TRUE),
(1, 'Partnership Agreement Ready', 'New partnership with MINAGRI is ready for your final approval.', 'warning', 3, TRUE);

-- Create indexes for better performance
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_type ON submissions(submission_type);
CREATE INDEX idx_submissions_submitted_by ON submissions(submitted_by);
CREATE INDEX idx_submissions_workflow ON submissions(workflow_level, max_workflow_level);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(is_read, action_required);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_active ON user_sessions(is_active, expires_at);
CREATE INDEX idx_approval_history_submission ON approval_history(submission_id);
CREATE INDEX idx_comments_submission ON submission_comments(submission_id);

-- Create views for common queries
CREATE VIEW submission_summary AS
SELECT 
    s.submission_id,
    s.submission_code,
    s.title,
    s.submission_type,
    s.priority,
    s.status,
    u.full_name as submitted_by_name,
    s.submitted_at,
    CASE 
        WHEN s.workflow_level = s.max_workflow_level THEN 'Final Approval'
        ELSE CONCAT('Level ', s.workflow_level, ' of ', s.max_workflow_level)
    END as current_stage,
    (SELECT COUNT(*) FROM submission_comments sc WHERE sc.submission_id = s.submission_id) as comment_count
FROM submissions s
JOIN users u ON s.submitted_by = u.user_id
ORDER BY s.submitted_at DESC;

CREATE VIEW user_pending_tasks AS
SELECT 
    u.user_id,
    u.full_name,
    u.role,
    COUNT(s.submission_id) as pending_count,
    COUNT(CASE WHEN s.priority IN ('high', 'urgent') THEN 1 END) as urgent_count
FROM users u
LEFT JOIN submissions s ON (
    (u.role = 'ceo' AND s.workflow_level = s.max_workflow_level AND s.status = 'pending') OR
    (u.role = 'coordinator' AND s.workflow_level = 1 AND s.status = 'pending') OR
    (u.role = 'accountable' AND s.workflow_level = 2 AND s.status = 'pending') OR
    (u.role = 'manager' AND s.workflow_level <= 2 AND s.status = 'pending')
)
WHERE u.status = 'active'
GROUP BY u.user_id, u.full_name, u.role;

-- Create stored procedures for workflow management
DELIMITER //

-- Procedure to submit new item
CREATE PROCEDURE SubmitItem(
    IN p_title VARCHAR(200),
    IN p_description TEXT,
    IN p_type VARCHAR(50),
    IN p_priority VARCHAR(20),
    IN p_submitted_by INT,
    IN p_amount DECIMAL(12,2),
    OUT p_submission_id INT
)
BEGIN
    DECLARE v_workflow_level INT DEFAULT 1;
    DECLARE v_max_level INT DEFAULT 3;
    
    -- Determine workflow based on type and amount
    IF p_type = 'budget' AND p_amount >= 1000000 THEN
        SET v_workflow_level = 2;
        SET v_max_level = 2;
    ELSEIF p_type = 'partnership' AND p_priority IN ('high', 'urgent') THEN
        SET v_workflow_level = 2;
        SET v_max_level = 2;
    ENDIF;
    
    -- Insert submission
    INSERT INTO submissions (
        submission_code, title, description, submission_type, 
        priority, submitted_by, workflow_level, max_workflow_level
    ) VALUES (
        CONCAT('SUB', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(LAST_INSERT_ID()+1, 3, '0')),
        p_title, p_description, p_type, p_priority, p_submitted_by, v_workflow_level, v_max_level
    );
    
    SET p_submission_id = LAST_INSERT_ID();
    
    -- Create notification for appropriate approver
    IF p_type = 'budget' AND v_workflow_level = 2 THEN
        INSERT INTO notifications (user_id, title, message, notification_type, related_submission_id, action_required)
        SELECT user_id, 'Budget Approval Required', CONCAT('Budget "', p_title, '" requires your approval'), 'warning', p_submission_id, TRUE
        FROM users WHERE role = 'ceo' AND status = 'active';
    ELSE
        INSERT INTO notifications (user_id, title, message, notification_type, related_submission_id, action_required)
        SELECT user_id, 'Submission Approval Required', CONCAT('Submission "', p_title, '" requires your review'), 'warning', p_submission_id, TRUE
        FROM users WHERE role = CASE 
            WHEN v_workflow_level = 1 THEN 'coordinator'
            WHEN v_workflow_level = 2 THEN 'accountable'
            ELSE 'ceo'
        END AND status = 'active';
    END IF;
    
    -- Record in approval history
    INSERT INTO approval_history (submission_id, user_id, action, previous_status, new_status)
    VALUES (p_submission_id, p_submitted_by, 'submitted', 'draft', 'submitted');
END //

-- Procedure to approve submission
CREATE PROCEDURE ApproveSubmission(
    IN p_submission_id INT,
    IN p_approved_by INT,
    IN p_comments TEXT
)
BEGIN
    DECLARE v_current_level INT;
    DECLARE v_max_level INT;
    DECLARE v_next_approver_role VARCHAR(50);
    DECLARE v_status VARCHAR(50);
    
    -- Get current submission details
    SELECT workflow_level, max_workflow_level INTO v_current_level, v_max_level
    FROM submissions WHERE submission_id = p_submission_id;
    
    -- Check if this is final approval
    IF v_current_level >= v_max_level THEN
        -- Final approval
        UPDATE submissions 
        SET status = 'approved', approved_by = p_approved_by, approved_at = NOW()
        WHERE submission_id = p_submission_id;
        
        SET v_status = 'approved';
        
        -- Notify submitter
        INSERT INTO notifications (user_id, title, message, notification_type, related_submission_id)
        SELECT submitted_by, 'Submission Approved', CONCAT('Your submission has been fully approved.'), 'success', p_submission_id
        FROM submissions WHERE submission_id = p_submission_id;
    ELSE
        -- Move to next level
        UPDATE submissions 
        SET workflow_level = workflow_level + 1, status = 'pending'
        WHERE submission_id = p_submission_id;
        
        SET v_status = 'pending';
        
        -- Determine next approver
        SET v_next_approver_role = CASE 
            WHEN v_current_level = 1 THEN 'accountable'
            WHEN v_current_level = 2 THEN 'ceo'
            ELSE 'ceo'
        END;
        
        -- Notify next approver
        INSERT INTO notifications (user_id, title, message, notification_type, related_submission_id, action_required)
        SELECT user_id, 'Submission Approval Required', CONCAT('Submission requires your review and approval.'), 'warning', p_submission_id, TRUE
        FROM users WHERE role = v_next_approver_role AND status = 'active';
    END IF;
    
    -- Add comment if provided
    IF p_comments IS NOT NULL THEN
        INSERT INTO submission_comments (submission_id, user_id, comment, comment_type)
        VALUES (p_submission_id, p_approved_by, p_comments, 'approval');
    END IF;
    
    -- Record in approval history
    INSERT INTO approval_history (submission_id, user_id, action, previous_status, new_status, comments)
    VALUES (p_submission_id, p_approved_by, 'approved', v_status, v_status, p_comments);
END //

-- Procedure to reject submission
CREATE PROCEDURE RejectSubmission(
    IN p_submission_id INT,
    IN p_rejected_by INT,
    IN p_rejection_reason TEXT
)
BEGIN
    -- Update submission status
    UPDATE submissions 
    SET status = 'rejected', reviewed_by = p_rejected_by, reviewed_at = NOW(), rejection_reason = p_rejection_reason
    WHERE submission_id = p_submission_id;
    
    -- Notify submitter
    INSERT INTO notifications (user_id, title, message, notification_type, related_submission_id)
    SELECT submitted_by, 'Submission Rejected', CONCAT('Your submission has been rejected. Reason: ', p_rejection_reason), 'error', p_submission_id
    FROM submissions WHERE submission_id = p_submission_id;
    
    -- Add rejection comment
    INSERT INTO submission_comments (submission_id, user_id, comment, comment_type)
    VALUES (p_submission_id, p_rejected_by, p_rejection_reason, 'rejection');
    
    -- Record in approval history
    INSERT INTO approval_history (submission_id, user_id, action, previous_status, new_status, comments)
    VALUES (p_submission_id, p_rejected_by, 'rejected', 'pending', 'rejected', p_rejection_reason);
END //

DELIMITER ;

-- Triggers for automatic notifications
DELIMITER //
CREATE TRIGGER notify_new_submission 
AFTER INSERT ON submissions
FOR EACH ROW
BEGIN
    IF NEW.status = 'submitted' THEN
        -- Create notification for CEO dashboard
        INSERT INTO notifications (user_id, title, message, notification_type, related_submission_id, action_required)
        SELECT user_id, 'New Submission', CONCAT('New submission "', NEW.title, '" requires attention.'), 'info', NEW.submission_id, TRUE
        FROM users WHERE role = 'ceo' AND status = 'active';
    END IF;
END //

CREATE TRIGGER log_submission_changes
AFTER UPDATE ON submissions
FOR EACH ROW
BEGIN
    IF OLD.status != NEW.status THEN
        INSERT INTO approval_history (submission_id, user_id, action, previous_status, new_status)
        VALUES (NEW.submission_id, NEW.approved_by, 'status_change', OLD.status, NEW.status);
    END IF;
END //

DELIMITER ;

-- Create function to check user permissions
DELIMITER //
CREATE FUNCTION HasPermission(p_user_id INT, p_permission VARCHAR(100)) 
RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_permissions JSON;
    DECLARE v_has_permission BOOLEAN DEFAULT FALSE;
    
    SELECT permissions INTO v_permissions 
    FROM users 
    WHERE user_id = p_user_id AND status = 'active';
    
    -- Check for all permissions (CEO)
    IF JSON_CONTAINS(v_permissions, '"all"') THEN
        SET v_has_permission = TRUE;
    -- Check for specific permission
    ELSEIF JSON_CONTAINS(v_permissions, CONCAT('"', p_permission, '"')) THEN
        SET v_has_permission = TRUE;
    END IF;
    
    RETURN v_has_permission;
END //

DELIMITER ;

-- Grant necessary permissions for application users
GRANT SELECT, INSERT, UPDATE, DELETE ON ayikb_db.* TO 'ayikb_app'@'localhost';
GRANT EXECUTE ON ayikb_db.* TO 'ayikb_app'@'localhost';

-- Final verification queries
SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_departments FROM departments;
SELECT COUNT(*) as total_submissions FROM submissions;
SELECT COUNT(*) as workflow_rules FROM workflow_rules;
