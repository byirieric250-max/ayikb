# AYIKB Database Design

## Overview
This document outlines the complete database design for the AgriYouth Innovation Kirehe Business (AYIKB) management system.

## Database Schema

### 1. Users Table
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'manager', 'user') DEFAULT 'user',
    position VARCHAR(100),
    department VARCHAR(50),
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);
```

### 2. Projects Table
```sql
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
```

### 3. Project Activities Table
```sql
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
```

### 4. Agriculture Crops Table
```sql
CREATE TABLE agriculture_crops (
    crop_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    crop_type VARCHAR(50) NOT NULL, -- 'maize', 'potatoes', 'beans', 'soy', 'vegetables', 'fruits'
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
```

### 5. Livestock Table
```sql
CREATE TABLE livestock (
    livestock_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    animal_type VARCHAR(50) NOT NULL, -- 'pigs', 'chickens', 'rabbits'
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
```

### 6. Training Programs Table
```sql
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
```

### 7. Training Participants Table
```sql
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
```

### 8. Partners Table
```sql
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
```

### 9. Partner Projects Table
```sql
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
```

### 10. Financial Records Table
```sql
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
```

### 11. Budget Table
```sql
CREATE TABLE budget (
    budget_id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    category VARCHAR(100) NOT NULL,
    budgeted_amount DECIMAL(12, 2) NOT NULL,
    actual_amount DECIMAL(12, 2) DEFAULT 0,
    variance DECIMAL(12, 2) GENERATED ALWAYS AS (budgeted_amount - actual_amount) STORED,
    fiscal_year INT NOT NULL,
    quarter ENUM('Q1', 'Q2', 'Q3', 'Q4') NOT NULL,
    status ENUM('active', 'closed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);
```

### 12. Contact Messages Table
```sql
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
```

### 13. System Logs Table
```sql
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
```

### 14. Backup Records Table
```sql
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
```

### 15. Settings Table
```sql
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
```

## Indexes

### Performance Indexes
```sql
-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);

-- Projects table indexes
CREATE INDEX idx_projects_type ON projects(project_type);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);

-- Training programs indexes
CREATE INDEX idx_training_dates ON training_programs(start_date, end_date);
CREATE INDEX idx_training_status ON training_programs(status);
CREATE INDEX idx_training_category ON training_programs(category);

-- Financial records indexes
CREATE INDEX idx_financial_dates ON financial_records(transaction_date);
CREATE INDEX idx_financial_type ON financial_records(transaction_type);
CREATE INDEX idx_financial_project ON financial_records(project_id);

-- System logs indexes
CREATE INDEX idx_logs_date ON system_logs(log_date);
CREATE INDEX idx_logs_level ON system_logs(log_level);
CREATE INDEX idx_logs_user ON system_logs(user_id);
```

## Sample Data

### Initial Admin User
```sql
INSERT INTO users (username, password, full_name, email, phone, role, position, department) 
VALUES ('admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'System Administrator', 'admin@ayikb.rw', '0788123456', 'admin', 'System Admin', 'IT');
```

### Initial Settings
```sql
INSERT INTO settings (setting_key, setting_value, setting_type, description, category) VALUES
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
```

## Database Relationships

### Entity Relationship Diagram
```
Users (1) -----> (N) Projects (Manager)
Users (1) -----> (N) Projects (Created By)
Users (1) -----> (N) Training Programs (Created By)
Users (1) -----> (N) Financial Records (Created By)
Users (1) -----> (N) Contact Messages (Replied By)
Users (1) -----> (N) System Logs
Users (1) -----> (N) Backup Records

Projects (1) -----> (N) Project Activities
Projects (1) -----> (N) Agriculture Crops
Projects (1) -----> (N) Livestock
Projects (1) -----> (N) Budget
Projects (1) -----> (N) Financial Records

Training Programs (1) -----> (N) Training Participants

Partners (1) -----> (N) Partner Projects
Partners (1) -----> (N) Projects (Many-to-Many through Partner Projects)
```

## Security Considerations

### Data Protection
- All passwords hashed using bcrypt
- Sensitive financial data encrypted
- Regular backups with encryption
- Access logs for all sensitive operations

### Access Control
- Role-based access control (RBAC)
- Session management
- IP-based restrictions for admin functions
- Two-factor authentication support

## Performance Optimization

### Query Optimization
- Proper indexing on frequently queried columns
- Partitioning large tables by date
- Stored procedures for complex operations
- Connection pooling

### Caching Strategy
- Application-level caching for frequently accessed data
- Database query result caching
- Static content caching

## Backup and Recovery

### Backup Strategy
- Daily incremental backups
- Weekly full backups
- Monthly archival backups
- Off-site backup storage

### Recovery Procedures
- Point-in-time recovery capability
- Disaster recovery plan
- Regular backup testing

## Maintenance

### Regular Tasks
- Database optimization
- Index rebuilding
- Statistics updates
- Log rotation

### Monitoring
- Performance metrics
- Error tracking
- Storage usage
- Query performance analysis
