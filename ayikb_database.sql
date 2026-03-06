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

-- Projects Table
CREATE TABLE projects (
    project_id INT PRIMARY KEY AUTO_INCREMENT,
    project_name VARCHAR(200) NOT NULL,
    project_type ENUM('agriculture', 'livestock', 'training', 'other') NOT NULL,
    description TEXT,
    budget DECIMAL(12, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('planning', 'active', 'completed', 'cancelled') DEFAULT 'planning',
    progress_percentage INT DEFAULT 0,
    manager_id INT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (manager_id) REFERENCES users(user_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Project Activities Table
CREATE TABLE project_activities (
    activity_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    activity_name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(user_id)
);

-- Agriculture Crops Table
CREATE TABLE agriculture_crops (
    crop_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    crop_type VARCHAR(50) NOT NULL,
    land_size_hectares DECIMAL(6, 2) NOT NULL,
    planting_date DATE,
    expected_harvest_date DATE,
    actual_harvest_date DATE,
    expected_yield_kg DECIMAL(10, 2),
    actual_yield_kg DECIMAL(10, 2),
    expected_revenue DECIMAL(12, 2),
    actual_revenue DECIMAL(12, 2),
    status ENUM('planned', 'planted', 'growing', 'harvested') DEFAULT 'planned',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

-- Livestock Table
CREATE TABLE livestock (
    livestock_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    animal_type VARCHAR(50) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    purchase_date DATE,
    purchase_cost DECIMAL(12, 2),
    expected_monthly_revenue DECIMAL(12, 2),
    actual_monthly_revenue DECIMAL(12, 2),
    housing_status ENUM('planned', 'under_construction', 'completed') DEFAULT 'planned',
    health_status VARCHAR(100),
    feeding_cost_per_month DECIMAL(10, 2),
    status ENUM('planned', 'active', 'inactive') DEFAULT 'planned',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

-- Training Programs Table
CREATE TABLE training_programs (
    training_id INT PRIMARY KEY AUTO_INCREMENT,
    training_name VARCHAR(200) NOT NULL,
    category ENUM('agriculture', 'livestock', 'business', 'technology', 'other') NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(200) NOT NULL,
    trainer_name VARCHAR(100) NOT NULL,
    trainer_contact VARCHAR(100),
    max_participants INT NOT NULL,
    current_participants INT DEFAULT 0,
    cost_per_participant DECIMAL(8, 2) DEFAULT 0,
    status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Training Participants Table
CREATE TABLE training_participants (
    participant_id INT PRIMARY KEY AUTO_INCREMENT,
    training_id INT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    sector VARCHAR(100),
    occupation VARCHAR(100),
    motivation TEXT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('registered', 'attended', 'completed', 'no_show') DEFAULT 'registered',
    certificate_issued BOOLEAN DEFAULT FALSE,
    notes TEXT,
    FOREIGN KEY (training_id) REFERENCES training_programs(training_id) ON DELETE CASCADE
);

-- Partners Table
CREATE TABLE partners (
    partner_id INT PRIMARY KEY AUTO_INCREMENT,
    partner_name VARCHAR(200) NOT NULL,
    partner_type ENUM('government', 'ngo', 'private', 'financial', 'educational', 'other') NOT NULL,
    description TEXT,
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    contact_person VARCHAR(100),
    contact_position VARCHAR(100),
    partnership_date DATE,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Partner Projects Table
CREATE TABLE partner_projects (
    partnership_id INT PRIMARY KEY AUTO_INCREMENT,
    partner_id INT NOT NULL,
    project_id INT NOT NULL,
    contribution_description TEXT,
    contribution_value DECIMAL(12, 2),
    start_date DATE,
    end_date DATE,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (partner_id) REFERENCES partners(partner_id) ON DELETE CASCADE,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

-- Financial Records Table
CREATE TABLE financial_records (
    record_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    transaction_type ENUM('income', 'expense') NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    amount DECIMAL(12, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    payment_method VARCHAR(50),
    reference_number VARCHAR(100),
    receipt_number VARCHAR(100),
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'completed',
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id),
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Budget Table
CREATE TABLE budget (
    budget_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    budgeted_amount DECIMAL(12, 2) NOT NULL,
    actual_amount DECIMAL(12, 2) DEFAULT 0,
    fiscal_year INT NOT NULL,
    quarter ENUM('Q1', 'Q2', 'Q3', 'Q4') NOT NULL,
    status ENUM('active', 'closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

-- Contact Messages Table
CREATE TABLE contact_messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    message_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    reply_message TEXT,
    reply_date TIMESTAMP NULL,
    replied_by INT,
    FOREIGN KEY (replied_by) REFERENCES users(user_id)
);

-- System Logs Table
CREATE TABLE system_logs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    log_level ENUM('info', 'warning', 'error', 'critical') DEFAULT 'info',
    log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Backup Records Table
CREATE TABLE backup_records (
    backup_id INT PRIMARY KEY AUTO_INCREMENT,
    backup_type ENUM('full', 'incremental', 'differential') NOT NULL,
    backup_size_mb DECIMAL(10, 2),
    backup_path VARCHAR(500),
    status ENUM('in_progress', 'completed', 'failed') DEFAULT 'in_progress',
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP NULL,
    error_message TEXT,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Settings Table
CREATE TABLE settings (
    setting_id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    is_editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_projects_type ON projects(project_type);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);
CREATE INDEX idx_training_dates ON training_programs(start_date, end_date);
CREATE INDEX idx_training_status ON training_programs(status);
CREATE INDEX idx_training_category ON training_programs(category);
CREATE INDEX idx_financial_dates ON financial_records(transaction_date);
CREATE INDEX idx_financial_type ON financial_records(transaction_type);
CREATE INDEX idx_financial_project ON financial_records(project_id);
CREATE INDEX idx_logs_date ON system_logs(log_date);
CREATE INDEX idx_logs_level ON system_logs(log_level);
CREATE INDEX idx_logs_user ON system_logs(user_id);

-- Insert Initial Data

-- Insert Admin User (password: admin123)
INSERT INTO users (username, password, full_name, email, phone, role, position, department) 
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin@ayikb.rw', '0788123456', 'admin', 'System Admin', 'IT');

-- Insert Manager User
INSERT INTO users (username, password, full_name, email, phone, role, position, department) 
VALUES ('manager', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Pierre Niyonzima', 'pierre@ayikb.rw', '0788234567', 'manager', 'Project Manager', 'Management');

-- Insert Sample Employees
INSERT INTO users (username, password, full_name, email, phone, role, position, department) 
VALUES 
('jean', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jean Mugisha', 'jean@ayikb.rw', '0788345678', 'user', 'Farmer', 'Agriculture'),
('marie', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Marie Mukamana', 'marie@ayikb.rw', '0788456789', 'user', 'Agriculture Worker', 'Agriculture'),
('joseph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Joseph Habimana', 'joseph@ayikb.rw', '0788567890', 'user', 'Trainer', 'Training');

-- Insert Initial Projects
INSERT INTO projects (project_name, project_type, description, budget, start_date, end_date, status, progress_percentage, manager_id, created_by) 
VALUES 
('Phase 1: Ubuhinzi', 'agriculture', 'Gutera ibigori na ibirayi', 1000000.00, '2024-01-01', '2024-12-31', 'active', 75, 2, 1),
('Phase 2: Ubworozi bw''Ingurube', 'livestock', 'Gutangira ubworozi bw''ingurube', 800000.00, '2024-06-01', '2025-05-31', 'planning', 25, 2, 1),
('Phase 3: Ubworozi bw''Inkoko', 'livestock', 'Gutangira ubworozi bw''inkoko', 1000000.00, '2024-09-01', '2025-08-31', 'planning', 10, 2, 1),
('Amahugurwa yo ku Rubyirugo', 'training', 'Gutanga amahugurwa ku rubyirugo', 500000.00, '2024-01-15', '2024-12-31', 'active', 60, 2, 1);

-- Insert Agriculture Crops
INSERT INTO agriculture_crops (project_id, crop_type, land_size_hectares, planting_date, expected_harvest_date, expected_yield_kg, expected_revenue, status) 
VALUES 
(1, 'maize', 1.00, '2024-02-15', '2024-06-15', 3000.00, 600000.00, 'planted'),
(1, 'potatoes', 0.33, '2024-03-01', '2024-07-01', 2000.00, 400000.00, 'planted'),
(1, 'beans', 0.50, '2024-04-15', '2024-08-15', 1500.00, 300000.00, 'planned');

-- Insert Training Programs
INSERT INTO training_programs (training_name, category, description, start_date, end_date, start_time, end_time, location, trainer_name, trainer_contact, max_participants, current_participants, status, created_by) 
VALUES 
('Uburyo bwo guhinga bwiza', 'agriculture', 'Amahugurwa ajyanye n''uburyo bwo guhinga bwiza', '2024-04-20', '2024-04-20', '09:00:00', '17:00:00', 'AYIKB Office, Nyagahama', 'MINAGRI Expert', '0788123456', 50, 30, 'upcoming', 1),
('Ubworozi bw''Ingurube', 'livestock', 'Amahugurwa ajyanye n''ubworozi bw''ingurube', '2024-03-15', '2024-04-15', '08:00:00', '16:00:00', 'AYIKB Farm', 'RAB Veterinarian', '0788234567', 25, 25, 'ongoing', 1),
('Ubucuruzi bw''Umusaruro', 'business', 'Amahugurwa ajyanye n''ubucuruzi bw''umusaruro', '2024-02-10', '2024-02-10', '09:00:00', '15:00:00', 'AYIKB Office', 'Business Consultant', '0788345678', 40, 40, 'completed', 1);

-- Insert Partners
INSERT INTO partners (partner_name, partner_type, description, email, phone, address, contact_person, partnership_date, status, created_by) 
VALUES 
('Akarere ka Kirehe', 'government', 'Akarere ka Kirehe dukora kumurikira no gutanga inkunga', 'info@kirehe.gov.rw', '0788867890', 'Kirehe Town', 'Mayor Office', '2024-01-01', 'active', 1),
('MINAGRI', 'government', 'Minisiteri y''Ubuhinzi n''Ubworozi', 'info@minagri.gov.rw', '0788465678', 'Kigali', 'Director of Agriculture', '2024-01-15', 'active', 1),
('BDF', 'financial', 'Banki ya Development Bank of Rwanda', 'info@bdf.rw', '0788345678', 'Kirehe Branch', 'Branch Manager', '2024-02-01', 'active', 1),
('RYAF', 'ngo', 'Rwanda Youth Agribusiness Forum', 'info@ryaf.rw', '0788234567', 'Kigali', 'Program Coordinator', '2024-02-10', 'active', 1);

-- Insert Budget Data
INSERT INTO budget (project_id, category, budgeted_amount, actual_amount, fiscal_year, quarter, status) 
VALUES 
(1, 'Seeds and Planting', 300000.00, 250000.00, 2024, 'Q1', 'active'),
(1, 'Labor', 400000.00, 350000.00, 2024, 'Q1', 'active'),
(1, 'Fertilizer', 200000.00, 150000.00, 2024, 'Q1', 'active'),
(1, 'Equipment', 100000.00, 100000.00, 2024, 'Q1', 'active'),
(2, 'Housing Construction', 500000.00, 150000.00, 2024, 'Q2', 'active'),
(2, 'Livestock Purchase', 300000.00, 50000.00, 2024, 'Q2', 'active');

-- Insert Financial Records
INSERT INTO financial_records (project_id, transaction_type, category, description, amount, transaction_date, payment_method, status, created_by) 
VALUES 
(1, 'expense', 'Seeds', 'Purchase of maize seeds', 150000.00, '2024-02-15', 'Cash', 'completed', 1),
(1, 'expense', 'Labor', 'Monthly wages for farm workers', 200000.00, '2024-03-01', 'Bank Transfer', 'completed', 1),
(1, 'expense', 'Fertilizer', 'Purchase of NPK fertilizer', 100000.00, '2024-02-20', 'Cash', 'completed', 1),
(2, 'expense', 'Construction', 'Pig house construction materials', 150000.00, '2024-03-15', 'Bank Transfer', 'completed', 1);

-- Insert Initial Settings
INSERT INTO settings (setting_key, setting_value, setting_type, description, category) 
VALUES 
('business_name', 'AgriYouth Innovation Kirehe Business', 'string', 'Business legal name', 'general'),
('business_email', 'info@ayikb.rw', 'string', 'Primary business email', 'general'),
('business_phone', '0788123456', 'string', 'Primary business phone', 'general'),
('business_address', 'Kirehe District, Nyamugari Sector, Nyagahama Village', 'string', 'Business physical address', 'general'),
('email_notifications', 'true', 'boolean', 'Enable email notifications', 'notifications'),
('sms_notifications', 'false', 'boolean', 'Enable SMS notifications', 'notifications'),
('session_timeout', '30', 'number', 'Session timeout in minutes', 'security'),
('max_login_attempts', '5', 'number', 'Maximum login attempts before lockout', 'security'),
('backup_frequency', 'weekly', 'string', 'Automatic backup frequency', 'backup'),
('backup_retention_days', '30', 'number', 'Backup retention period in days', 'backup');

-- Create Views for Common Queries

-- Project Overview View
CREATE VIEW project_overview AS
SELECT 
    p.project_id,
    p.project_name,
    p.project_type,
    p.status,
    p.progress_percentage,
    p.budget,
    COALESCE(SUM(b.budgeted_amount), 0) as total_budget_allocated,
    COALESCE(SUM(b.actual_amount), 0) as total_spent,
    u.full_name as manager_name,
    p.start_date,
    p.end_date
FROM projects p
LEFT JOIN budget b ON p.project_id = b.project_id
LEFT JOIN users u ON p.manager_id = u.user_id
GROUP BY p.project_id;

-- Training Summary View
CREATE VIEW training_summary AS
SELECT 
    t.training_id,
    t.training_name,
    t.category,
    t.status,
    t.start_date,
    t.end_date,
    t.max_participants,
    t.current_participants,
    COUNT(tp.participant_id) as registered_participants,
    SUM(CASE WHEN tp.status = 'completed' THEN 1 ELSE 0 END) as completed_participants
FROM training_programs t
LEFT JOIN training_participants tp ON t.training_id = tp.training_id
GROUP BY t.training_id;

-- Financial Summary View
CREATE VIEW financial_summary AS
SELECT 
    fr.project_id,
    p.project_name,
    fr.transaction_type,
    fr.category,
    SUM(fr.amount) as total_amount,
    COUNT(fr.record_id) as transaction_count
FROM financial_records fr
LEFT JOIN projects p ON fr.project_id = p.project_id
GROUP BY fr.project_id, fr.transaction_type, fr.category;

-- Create Stored Procedures

-- Update Project Progress Procedure
DELIMITER //
CREATE PROCEDURE UpdateProjectProgress(IN project_id_param INT)
BEGIN
    DECLARE completed_activities INT DEFAULT 0;
    DECLARE total_activities INT DEFAULT 0;
    DECLARE progress_percentage INT DEFAULT 0;
    
    -- Count total and completed activities
    SELECT COUNT(*) INTO total_activities
    FROM project_activities 
    WHERE project_id = project_id_param;
    
    SELECT COUNT(*) INTO completed_activities
    FROM project_activities 
    WHERE project_id = project_id_param AND status = 'completed';
    
    -- Calculate progress percentage
    IF total_activities > 0 THEN
        SET progress_percentage = (completed_activities * 100) / total_activities;
    END IF;
    
    -- Update project progress
    UPDATE projects 
    SET progress_percentage = progress_percentage,
        updated_at = CURRENT_TIMESTAMP
    WHERE project_id = project_id_param;
    
    -- Update project status based on progress
    IF progress_percentage = 100 THEN
        UPDATE projects SET status = 'completed' WHERE project_id = project_id_param;
    ELSEIF progress_percentage > 0 THEN
        UPDATE projects SET status = 'active' WHERE project_id = project_id_param;
    END IF;
END //
DELIMITER ;

-- Create Trigger for System Logging
DELIMITER //
CREATE TRIGGER log_user_login
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    IF NEW.last_login IS NOT NULL AND OLD.last_login IS NULL OR NEW.last_login != OLD.last_login THEN
        INSERT INTO system_logs (user_id, action, description, ip_address, log_level)
        VALUES (NEW.user_id, 'LOGIN', CONCAT('User ', NEW.username, ' logged in'), '', 'info');
    END IF;
END //
DELIMITER ;

-- Create Trigger for Training Participants Count
DELIMITER //
CREATE TRIGGER update_training_participant_count
AFTER INSERT ON training_participants
FOR EACH ROW
BEGIN
    UPDATE training_programs 
    SET current_participants = current_participants + 1
    WHERE training_id = NEW.training_id;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER decrease_training_participant_count
AFTER DELETE ON training_participants
FOR EACH ROW
BEGIN
    UPDATE training_programs 
    SET current_participants = current_participants - 1
    WHERE training_id = OLD.training_id;
END //
DELIMITER ;
