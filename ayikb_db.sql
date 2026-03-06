-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 06, 2026 at 04:14 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ayikb_db`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `ApproveItem` (IN `p_submission_id` INT, IN `p_approver_id` INT, IN `p_comments` TEXT, OUT `p_result` BOOLEAN)   BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `AuthenticateUser` (IN `p_username` VARCHAR(50), IN `p_password` VARCHAR(255), IN `p_ip_address` VARCHAR(45), IN `p_user_agent` TEXT, OUT `p_result` INT, OUT `p_user_data` JSON)   BEGIN
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
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `CreateAudit` (IN `p_auditor_id` INT, IN `p_audit_type` VARCHAR(20), IN `p_audit_title` VARCHAR(200), IN `p_start_date` DATE, IN `p_end_date` DATE, IN `p_findings` TEXT, IN `p_recommendations` TEXT)   BEGIN
    INSERT INTO audit_management (auditor_id, audit_code, audit_type, audit_title, audit_period_start, audit_period_end, findings, recommendations, status)
    VALUES (p_auditor_id, CONCAT('AUD-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 1000), 3, '0')), p_audit_type, p_audit_title, p_start_date, p_end_date, p_findings, p_recommendations, 'planned');
    
    -- Create notification for council
    INSERT INTO notifications (user_id, title, message, notification_type, action_required)
    SELECT user_id, 'New Audit Scheduled', CONCAT(p_audit_title, ' audit scheduled'), 'warning', TRUE
    FROM users WHERE role = 'council' AND status = 'active';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `LogSystemMaintenance` (IN `p_user_id` INT, IN `p_system_name` VARCHAR(100), IN `p_system_type` VARCHAR(20), IN `p_notes` TEXT)   BEGIN
    INSERT INTO it_management (user_id, system_name, system_code, system_type, last_maintenance, next_maintenance, notes)
    VALUES (p_user_id, p_system_name, CONCAT('SYS-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 1000), 3, '0')), p_system_type, NOW(), DATE_ADD(NOW(), INTERVAL 1 MONTH), p_notes);
    
    -- Create notification for admin
    INSERT INTO notifications (user_id, title, message, notification_type)
    SELECT user_id, 'System Maintenance Completed', CONCAT('Maintenance completed for ', p_system_name), 'success'
    FROM users WHERE role = 'admin' AND status = 'active';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `ScheduleCouncilMeeting` (IN `p_created_by` INT, IN `p_meeting_title` VARCHAR(200), IN `p_meeting_date` DATETIME, IN `p_meeting_type` VARCHAR(20), IN `p_location` VARCHAR(200), IN `p_agenda` TEXT, IN `p_attendees` JSON)   BEGIN
    INSERT INTO council_meetings (meeting_code, meeting_title, meeting_date, meeting_type, location, agenda, attendees, created_by)
    VALUES (CONCAT('MEET-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(FLOOR(RAND() * 1000), 3, '0')), p_meeting_title, p_meeting_date, p_meeting_type, p_location, p_agenda, p_attendees, p_created_by);
    
    -- Create notifications for all council members
    INSERT INTO notifications (user_id, title, message, notification_type, action_required)
    SELECT user_id, 'Council Meeting Scheduled', CONCAT(p_meeting_title, ' scheduled for ', DATE(p_meeting_date)), 'warning', TRUE
    FROM users WHERE role = 'council' AND status = 'active';
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `SubmitItem` (IN `p_title` VARCHAR(200), IN `p_description` TEXT, IN `p_submission_type` VARCHAR(20), IN `p_priority` VARCHAR(10), IN `p_amount` DECIMAL(12,2), IN `p_submitted_by` INT, IN `p_attachments` JSON, OUT `p_submission_id` INT)   BEGIN
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
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `access_requests`
--

CREATE TABLE `access_requests` (
  `request_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `requested_resource` varchar(100) NOT NULL,
  `request_reason` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `reviewed_by` int(11) DEFAULT NULL,
  `review_date` timestamp NULL DEFAULT NULL,
  `review_comments` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `approval_history`
--

CREATE TABLE `approval_history` (
  `history_id` int(11) NOT NULL,
  `submission_id` int(11) NOT NULL,
  `approver_id` int(11) NOT NULL,
  `action` enum('submitted','approved','rejected','returned','cancelled') NOT NULL,
  `comments` text DEFAULT NULL,
  `action_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `workflow_level` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_management`
--

CREATE TABLE `audit_management` (
  `audit_id` int(11) NOT NULL,
  `auditor_id` int(11) NOT NULL,
  `audit_code` varchar(20) NOT NULL,
  `audit_type` enum('financial','operational','compliance','security','performance') NOT NULL,
  `audit_title` varchar(200) NOT NULL,
  `audit_period_start` date NOT NULL,
  `audit_period_end` date NOT NULL,
  `findings` text DEFAULT NULL,
  `recommendations` text DEFAULT NULL,
  `risk_level` enum('low','medium','high','critical') DEFAULT 'medium',
  `status` enum('planned','in_progress','completed','follow_up') DEFAULT 'planned',
  `audit_date` date DEFAULT NULL,
  `report_generated` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audit_management`
--

INSERT INTO `audit_management` (`audit_id`, `auditor_id`, `audit_code`, `audit_type`, `audit_title`, `audit_period_start`, `audit_period_end`, `findings`, `recommendations`, `risk_level`, `status`, `audit_date`, `report_generated`, `created_at`, `updated_at`) VALUES
(1, 7, 'AUD-001', 'financial', 'Q1 2024 Financial Audit', '2024-01-01', '2024-03-31', 'Minor discrepancies in expense reporting', 'Implement automated expense reporting system', 'medium', 'completed', '2024-04-05', 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(2, 7, 'AUD-002', 'operational', 'Operations Performance Audit', '2024-01-01', '2024-03-31', 'Efficiency improvements needed in project management', 'Adopt project management software with real-time tracking', 'medium', 'completed', '2024-04-10', 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(3, 7, 'AUD-003', 'compliance', 'Regulatory Compliance Check', '2024-01-01', '2024-03-31', 'Good overall compliance with regulations', 'Continue maintaining current compliance standards', 'low', 'in_progress', NULL, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(4, 7, 'AUD-004', 'security', 'IT Security Audit', '2024-02-01', '2024-03-31', 'Security systems functioning properly', 'Regular security updates recommended', 'low', 'planned', '2024-04-15', 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(5, 7, 'AUD-005', 'performance', 'Project Performance Review', '2024-01-01', '2024-03-31', 'Projects progressing according to schedule', 'Continue current project management practices', 'low', 'planned', '2024-04-20', 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57');

-- --------------------------------------------------------

--
-- Stand-in structure for view `audit_overview`
-- (See below for the actual view)
--
CREATE TABLE `audit_overview` (
`audit_type` enum('financial','operational','compliance','security','performance')
,`total_audits` bigint(21)
,`completed` decimal(22,0)
,`in_progress` decimal(22,0)
,`planned` decimal(22,0)
,`follow_up` decimal(22,0)
,`high_risk` decimal(22,0)
,`medium_risk` decimal(22,0)
,`low_risk` decimal(22,0)
);

-- --------------------------------------------------------

--
-- Table structure for table `council_meetings`
--

CREATE TABLE `council_meetings` (
  `meeting_id` int(11) NOT NULL,
  `meeting_code` varchar(20) NOT NULL,
  `meeting_title` varchar(200) NOT NULL,
  `meeting_date` datetime NOT NULL,
  `meeting_type` enum('regular','special','emergency') DEFAULT 'regular',
  `location` varchar(200) DEFAULT NULL,
  `agenda` text DEFAULT NULL,
  `minutes` text DEFAULT NULL,
  `decisions` text DEFAULT NULL,
  `attendees` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attendees`)),
  `status` enum('scheduled','in_progress','completed','cancelled') DEFAULT 'scheduled',
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `council_meetings`
--

INSERT INTO `council_meetings` (`meeting_id`, `meeting_code`, `meeting_title`, `meeting_date`, `meeting_type`, `location`, `agenda`, `minutes`, `decisions`, `attendees`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'MEET-001', 'Q1 2024 Council Meeting', '2024-03-15 14:00:00', 'regular', 'AYIKB Office', 'Review Q1 performance, approve Q2 budget, discuss strategic initiatives', NULL, NULL, '[8,9,10]', 'completed', 8, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(2, 'MEET-002', 'Emergency Budget Meeting', '2024-02-20 10:00:00', 'emergency', 'AYIKB Office', 'Discuss budget reallocation for Phase 2 project', NULL, NULL, '[8,9,10]', 'completed', 8, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(3, 'MEET-003', 'Strategic Planning Session', '2024-04-10 09:00:00', 'special', 'AYIKB Office', 'Develop 2024-2026 strategic plan', NULL, NULL, '[8,9,10]', 'scheduled', 8, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(4, 'MEET-004', 'Policy Review Meeting', '2024-04-25 14:00:00', 'regular', 'AYIKB Office', 'Review and update organizational policies', NULL, NULL, '[8,9,10]', 'scheduled', 8, '2026-03-06 12:02:57', '2026-03-06 12:02:57');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL,
  `department_name` varchar(100) NOT NULL,
  `department_code` varchar(10) NOT NULL,
  `description` text DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`department_id`, `department_name`, `department_code`, `description`, `manager_id`, `created_at`, `updated_at`) VALUES
(1, 'Management', 'MGMT', 'Executive and strategic management', NULL, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(2, 'Agriculture', 'AGR', 'Crop farming and agricultural activities', NULL, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(3, 'Livestock', 'LIV', 'Animal husbandry and livestock management', NULL, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(4, 'Training', 'TRN', 'Training programs and capacity building', NULL, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(5, 'Finance', 'FIN', 'Financial management and accounting', NULL, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(6, 'IT Department', 'IT', 'Information Technology and Systems Management', NULL, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(7, 'Audit Department', 'AUD', 'Internal Audit and Compliance', NULL, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(8, 'Council Office', 'COUNCIL', 'AYIKB Council and Governance', NULL, '2026-03-06 12:02:57', '2026-03-06 12:02:57');

-- --------------------------------------------------------

--
-- Table structure for table `financial_records`
--

CREATE TABLE `financial_records` (
  `record_id` int(11) NOT NULL,
  `record_code` varchar(20) NOT NULL,
  `transaction_type` enum('income','expense','transfer') NOT NULL,
  `category` enum('project','training','operations','infrastructure','other') NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date NOT NULL,
  `reference_number` varchar(50) DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `submission_id` int(11) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `it_management`
--

CREATE TABLE `it_management` (
  `it_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `system_name` varchar(100) NOT NULL,
  `system_code` varchar(20) NOT NULL,
  `system_type` enum('hardware','software','network','security','backup') NOT NULL,
  `status` enum('operational','maintenance','issue','offline') DEFAULT 'operational',
  `last_maintenance` timestamp NULL DEFAULT NULL,
  `next_maintenance` timestamp NULL DEFAULT NULL,
  `maintenance_interval_days` int(11) DEFAULT 30,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `it_management`
--

INSERT INTO `it_management` (`it_id`, `user_id`, `system_name`, `system_code`, `system_type`, `status`, `last_maintenance`, `next_maintenance`, `maintenance_interval_days`, `notes`, `created_at`, `updated_at`) VALUES
(1, 6, 'Main Server', 'SYS-001', 'hardware', 'operational', '2024-03-01 08:00:00', '2024-04-01 08:00:00', 30, 'Primary application server running smoothly', '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(2, 6, 'Network Infrastructure', 'SYS-002', 'network', 'operational', '2024-03-05 12:00:00', '2024-04-05 12:00:00', 30, 'All network devices operational', '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(3, 6, 'Backup System', 'SYS-003', 'backup', 'operational', '2024-03-10 06:00:00', '2024-03-24 06:00:00', 30, 'Daily backups running successfully', '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(4, 6, 'Security Systems', 'SYS-004', 'security', 'operational', '2024-03-08 09:00:00', '2024-04-08 09:00:00', 30, 'Firewall and antivirus up to date', '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(5, 6, 'Application Software', 'SYS-005', 'software', 'maintenance', '2024-03-15 07:00:00', '2024-03-20 07:00:00', 30, 'Scheduled maintenance in progress', '2026-03-06 12:02:57', '2026-03-06 12:02:57');

-- --------------------------------------------------------

--
-- Stand-in structure for view `leadership_dashboard`
-- (See below for the actual view)
--
CREATE TABLE `leadership_dashboard` (
`user_id` int(11)
,`full_name` varchar(100)
,`role` enum('ceo','admin','coordinator','accountable','manager','employee','it','auditor','council')
,`department_name` varchar(100)
,`pending_tasks` bigint(21)
,`approved_tasks` bigint(21)
,`unread_notifications` bigint(21)
,`active_projects` bigint(21)
,`ongoing_training` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `notification_type` enum('info','success','warning','danger','system') DEFAULT 'info',
  `action_required` tinyint(1) DEFAULT 0,
  `related_id` int(11) DEFAULT NULL,
  `related_type` varchar(50) DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `read_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `user_id`, `title`, `message`, `notification_type`, `action_required`, `related_id`, `related_type`, `is_read`, `created_at`, `read_at`) VALUES
(1, 1, 'New Submission', 'Q2 budget proposal requires your approval', 'warning', 1, NULL, NULL, 0, '2026-03-06 12:02:57', NULL),
(2, 3, 'Project Update', 'Phase 1 project progress update available', 'info', 0, NULL, NULL, 0, '2026-03-06 12:02:57', NULL),
(3, 4, 'Financial Report', 'Q1 financial report is ready for review', 'success', 1, NULL, NULL, 0, '2026-03-06 12:02:57', NULL),
(4, 6, 'System Maintenance', 'Please review the latest system maintenance schedule', 'info', 1, NULL, NULL, 0, '2026-03-06 12:02:57', NULL),
(5, 7, 'Audit Schedule', 'Q1 financial audit has been completed. Please review findings', 'success', 1, NULL, NULL, 0, '2026-03-06 12:02:57', NULL),
(6, 8, 'Council Meeting', 'Strategic planning session scheduled for April 10, 2024', 'warning', 1, NULL, NULL, 0, '2026-03-06 12:02:57', NULL),
(7, 9, 'Council Meeting', 'Strategic planning session scheduled for April 10, 2024', 'warning', 1, NULL, NULL, 0, '2026-03-06 12:02:57', NULL),
(8, 10, 'Council Meeting', 'Strategic planning session scheduled for April 10, 2024', 'warning', 1, NULL, NULL, 0, '2026-03-06 12:02:57', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `partners`
--

CREATE TABLE `partners` (
  `partner_id` int(11) NOT NULL,
  `partner_name` varchar(200) NOT NULL,
  `partner_code` varchar(20) NOT NULL,
  `partner_type` enum('government','ngo','private','financial','educational','other') NOT NULL,
  `description` text DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `contact_position` varchar(100) DEFAULT NULL,
  `partnership_date` date DEFAULT NULL,
  `status` enum('active','inactive','pending') DEFAULT 'active',
  `contribution_amount` decimal(12,2) DEFAULT 0.00,
  `projects_supported` int(11) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `partners`
--

INSERT INTO `partners` (`partner_id`, `partner_name`, `partner_code`, `partner_type`, `description`, `email`, `phone`, `address`, `contact_person`, `contact_position`, `partnership_date`, `status`, `contribution_amount`, `projects_supported`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Akarere ka Kirehe', 'GOV-001', 'government', 'Akarere ka Kirehe dukora kumurikira no gutanga inkunga', 'info@kirehe.gov.rw', '0788867890', 'Kirehe Town', 'Mayor Office', 'Mayor', '2024-01-01', 'active', 2000000.00, 5, 1, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(2, 'MINAGRI', 'GOV-002', 'government', 'Minisiteri y\'Ubuhinzi n\'Ubworozi', 'info@minagri.gov.rw', '0788465678', 'Kigali', 'Director of Agriculture', 'Director', '2024-01-15', 'active', 1500000.00, 3, 1, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(3, 'BDF', 'FIN-001', 'financial', 'Banki ya Development Bank of Rwanda', 'info@bdf.rw', '0788345678', 'Kirehe Branch', 'Branch Manager', 'Branch Manager', '2024-02-01', 'active', 1000000.00, 2, 1, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(4, 'RYAF', 'NGO-001', 'ngo', 'Rwanda Youth Agribusiness Forum', 'info@ryaf.rw', '0788234567', 'Kigali', 'Program Coordinator', 'Program Coordinator', '2024-02-10', 'active', 800000.00, 4, 1, '2026-03-06 12:02:57', '2026-03-06 12:02:57');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `project_id` int(11) NOT NULL,
  `project_name` varchar(200) NOT NULL,
  `project_code` varchar(20) NOT NULL,
  `project_type` enum('agriculture','livestock','training','other','strategic','infrastructure') NOT NULL,
  `description` text DEFAULT NULL,
  `budget` decimal(12,2) NOT NULL,
  `actual_cost` decimal(12,2) DEFAULT 0.00,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `status` enum('planning','active','completed','cancelled','on_hold') DEFAULT 'planning',
  `progress_percentage` int(11) DEFAULT 0,
  `priority` enum('low','medium','high','critical') DEFAULT 'medium',
  `manager_id` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approval_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`project_id`, `project_name`, `project_code`, `project_type`, `description`, `budget`, `actual_cost`, `start_date`, `end_date`, `status`, `progress_percentage`, `priority`, `manager_id`, `created_by`, `approved_by`, `approval_date`, `created_at`, `updated_at`) VALUES
(1, 'Phase 1: Ubuhinzi', 'AGR-001', 'agriculture', 'Gutera ibigori na ibirayi', 1000000.00, 0.00, '2024-01-01', '2024-12-31', 'active', 0, 'high', 3, 1, NULL, NULL, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(2, 'Phase 2: Ubworozi bw\'Ingurube', 'LIV-001', 'livestock', 'Gutangira ubworozi bw\'ingurube', 800000.00, 0.00, '2024-06-01', '2025-05-31', 'planning', 0, 'medium', 3, 1, NULL, NULL, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(3, 'Phase 3: Ubworozi bw\'Inkoko', 'LIV-002', 'livestock', 'Gutangira ubworozi bw\'inkoko', 1000000.00, 0.00, '2024-09-01', '2025-08-31', 'planning', 0, 'medium', 3, 1, NULL, NULL, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(4, 'Amahugurwa yo ku Rubyirugo', 'TRN-001', 'training', 'Gutanga amahugurwa ku rubyirugo', 500000.00, 0.00, '2024-01-15', '2024-12-31', 'active', 0, 'medium', 3, 1, NULL, NULL, '2026-03-06 12:02:57', '2026-03-06 12:02:57');

-- --------------------------------------------------------

--
-- Table structure for table `project_activities`
--

CREATE TABLE `project_activities` (
  `activity_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `activity_name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('not_started','in_progress','completed','delayed') DEFAULT 'not_started',
  `assigned_to` int(11) DEFAULT NULL,
  `progress_percentage` int(11) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `role_hierarchy`
-- (See below for the actual view)
--
CREATE TABLE `role_hierarchy` (
`role` enum('ceo','admin','coordinator','accountable','manager','employee','it','auditor','council')
,`hierarchy_level` bigint(2)
,`user_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `submission_id` int(11) NOT NULL,
  `submission_code` varchar(20) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `submission_type` enum('budget','project','policy','strategic','audit','system') NOT NULL,
  `priority` enum('low','medium','high','critical') DEFAULT 'medium',
  `amount` decimal(12,2) DEFAULT NULL,
  `submitted_by` int(11) NOT NULL,
  `current_approver` int(11) DEFAULT NULL,
  `workflow_level` int(11) DEFAULT 1,
  `max_workflow_level` int(11) DEFAULT 3,
  `status` enum('draft','submitted','pending','approved','rejected','cancelled') DEFAULT 'draft',
  `submission_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_action_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `approved_date` timestamp NULL DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `rejection_reason` text DEFAULT NULL,
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachments`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Triggers `submissions`
--
DELIMITER $$
CREATE TRIGGER `submissions_audit_insert` AFTER INSERT ON `submissions` FOR EACH ROW BEGIN
    INSERT INTO system_logs (user_id, action, table_name, record_id, new_values)
    VALUES (NEW.submitted_by, 'INSERT', 'submissions', NEW.submission_id, JSON_OBJECT(
        'submission_code', NEW.submission_code,
        'title', NEW.title,
        'submission_type', NEW.submission_type,
        'priority', NEW.priority,
        'amount', NEW.amount,
        'status', NEW.status
    ));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `submissions_audit_update` AFTER UPDATE ON `submissions` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `submission_comments`
--

CREATE TABLE `submission_comments` (
  `comment_id` int(11) NOT NULL,
  `submission_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `comment_type` enum('note','approval','rejection','question') DEFAULT 'note',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `system_logs`
--

CREATE TABLE `system_logs` (
  `log_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `old_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`old_values`)),
  `new_values` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`new_values`)),
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Stand-in structure for view `system_status`
-- (See below for the actual view)
--
CREATE TABLE `system_status` (
`system_type` enum('hardware','software','network','security','backup')
,`total_systems` bigint(21)
,`operational` decimal(22,0)
,`maintenance` decimal(22,0)
,`issue` decimal(22,0)
,`offline` decimal(22,0)
,`next_scheduled_maintenance` timestamp
);

-- --------------------------------------------------------

--
-- Table structure for table `training_participants`
--

CREATE TABLE `training_participants` (
  `participant_id` int(11) NOT NULL,
  `training_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `registration_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('registered','attended','completed','no_show') DEFAULT 'registered',
  `completion_date` timestamp NULL DEFAULT NULL,
  `certificate_issued` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `training_programs`
--

CREATE TABLE `training_programs` (
  `training_id` int(11) NOT NULL,
  `training_name` varchar(200) NOT NULL,
  `training_code` varchar(20) NOT NULL,
  `category` enum('agriculture','livestock','business','technology','other') NOT NULL,
  `description` text DEFAULT NULL,
  `trainer_name` varchar(100) DEFAULT NULL,
  `trainer_contact` varchar(20) DEFAULT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `location` varchar(200) DEFAULT NULL,
  `max_participants` int(11) DEFAULT NULL,
  `current_participants` int(11) DEFAULT 0,
  `cost_per_participant` decimal(10,2) DEFAULT NULL,
  `status` enum('planning','ongoing','completed','cancelled') DEFAULT 'planning',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `training_programs`
--

INSERT INTO `training_programs` (`training_id`, `training_name`, `training_code`, `category`, `description`, `trainer_name`, `trainer_contact`, `start_date`, `end_date`, `start_time`, `end_time`, `location`, `max_participants`, `current_participants`, `cost_per_participant`, `status`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Uburyo bwo guhinga bwiza', 'TRN-001', 'agriculture', 'Amahugurwa ajyanye n\'uburyo bwo guhinga bwiza', 'MINAGRI Expert', '0788123456', '2024-04-20', '2024-04-20', '09:00:00', '17:00:00', 'AYIKB Office, Nyagahama', 50, 0, 0.00, '', 1, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(2, 'Ubworozi bw\'Ingurube', 'TRN-002', 'livestock', 'Amahugurwa ajyanye n\'ubworozi bw\'ingurube', 'RAB Veterinarian', '0788234567', '2024-03-15', '2024-04-15', '08:00:00', '16:00:00', 'AYIKB Farm', 25, 0, 0.00, 'ongoing', 1, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(3, 'Ubucuruzi bw\'Umusaruro', 'TRN-003', 'business', 'Amahugurwa ajyanye n\'ubucuruzi bw\'umusaruro', 'Business Consultant', '0788345678', '2024-02-10', '2024-02-10', '09:00:00', '15:00:00', 'AYIKB Office', 40, 0, 0.00, 'completed', 1, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(4, 'Technology in Agriculture', 'TRN-004', 'technology', 'Modern technology applications in farming', 'Tech Expert', '0788456789', '2024-01-20', '2024-01-20', '10:00:00', '14:00:00', 'AYIKB Office', 30, 0, 0.00, 'completed', 1, '2026-03-06 12:02:57', '2026-03-06 12:02:57');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` enum('ceo','admin','coordinator','accountable','manager','employee','it','auditor','council') NOT NULL,
  `position` varchar(100) DEFAULT NULL,
  `department_id` int(11) DEFAULT NULL,
  `status` enum('active','inactive','suspended') DEFAULT 'active',
  `permissions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permissions`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `full_name`, `email`, `phone`, `role`, `position`, `department_id`, `status`, `permissions`, `created_at`, `updated_at`, `last_login`) VALUES
(1, 'ceo', 'ceo123', 'Chief Executive Officer', 'ceo@ayikb.rw', '0788000001', 'ceo', 'CEO', 1, 'active', '{\"all\": true, \"approve_all\": true, \"view_reports\": true, \"manage_users\": true, \"system_settings\": true, \"manage_council\": true, \"manage_auditor\": true, \"manage_it\": true}', '2026-03-06 12:02:57', '2026-03-06 12:02:57', NULL),
(2, 'admin', 'admin123', 'System Administrator', 'admin@ayikb.rw', '0788000002', 'admin', 'System Administrator', 1, 'active', '{\"manage_users\": true, \"system_settings\": true, \"view_logs\": true, \"backup_system\": true, \"manage_it\": false, \"view_reports\": false}', '2026-03-06 12:02:57', '2026-03-06 12:02:57', NULL),
(3, 'coordinator', 'coord123', 'Project Coordinator', 'coordinator@ayikb.rw', '0788000003', 'coordinator', 'Project Coordinator', 1, 'active', '{\"submit\": true, \"view_own\": true, \"edit_own\": true, \"view_reports\": true, \"approve_team\": true, \"manage_projects\": true}', '2026-03-06 12:02:57', '2026-03-06 12:02:57', NULL),
(4, 'accountable', 'acc123', 'Accountable Officer', 'accountable@ayikb.rw', '0788000004', 'accountable', 'Accountable Officer', 5, 'active', '{\"submit\": true, \"view_own\": true, \"edit_own\": true, \"approve_expenses\": true, \"view_financial\": true, \"view_reports\": true, \"manage_budget\": true}', '2026-03-06 12:02:57', '2026-03-06 12:02:57', NULL),
(5, 'it_admin', 'it123', 'IT Administrator', 'it@ayikb.rw', '0788000005', 'it', 'IT Administrator', 6, 'active', '{\"system_maintenance\": true, \"user_support\": true, \"security_management\": true, \"data_backup\": true, \"network_management\": true, \"view_system_logs\": true}', '2026-03-06 12:02:57', '2026-03-06 12:02:57', NULL),
(6, 'auditor', 'audit123', 'Internal Auditor', 'auditor@ayikb.rw', '0788000006', 'auditor', 'Internal Auditor', 7, 'active', '{\"audit_reports\": true, \"view_financial\": true, \"view_operations\": true, \"compliance_check\": true, \"audit_trail\": true, \"generate_audit_reports\": true}', '2026-03-06 12:02:57', '2026-03-06 12:02:57', NULL),
(7, 'council_chair', 'council123', 'AYIKB Council Chair', 'council@ayikb.rw', '0788000007', 'council', 'Council Chairperson', 8, 'active', '{\"strategic_oversight\": true, \"policy_approval\": true, \"performance_review\": true, \"view_all_reports\": true, \"approve_major_decisions\": true, \"governance\": true}', '2026-03-06 12:02:57', '2026-03-06 12:02:57', NULL),
(8, 'council_member1', 'council123', 'Council Member 1', 'council1@ayikb.rw', '0788000008', 'council', 'Council Member', 8, 'active', '{\"strategic_oversight\": true, \"policy_approval\": true, \"performance_review\": true, \"view_all_reports\": true, \"approve_major_decisions\": true, \"governance\": true}', '2026-03-06 12:02:57', '2026-03-06 12:02:57', NULL),
(9, 'council_member2', 'council123', 'Council Member 2', 'council2@ayikb.rw', '0788000009', 'council', 'Council Member', 8, 'active', '{\"strategic_oversight\": true, \"policy_approval\": true, \"performance_review\": true, \"view_all_reports\": true, \"approve_major_decisions\": true, \"governance\": true}', '2026-03-06 12:02:57', '2026-03-06 12:02:57', NULL),
(10, 'jean_mugisha', 'user123', 'Jean Mugisha', 'jean@ayikb.rw', '0788345678', 'employee', 'Farmer', 2, 'active', '{\"view_own\": true}', '2026-03-06 12:02:57', '2026-03-06 12:02:57', NULL),
(11, 'marie_mukamana', 'user123', 'Marie Mukamana', 'marie@ayikb.rw', '0788456789', 'employee', 'Agriculture Worker', 2, 'active', '{\"view_own\": true}', '2026-03-06 12:02:57', '2026-03-06 12:02:57', NULL),
(12, 'joseph_habimana', 'user123', 'Joseph Habimana', 'joseph@ayikb.rw', '0788567890', 'employee', 'Trainer', 4, 'active', '{\"view_own\": true}', '2026-03-06 12:02:57', '2026-03-06 12:02:57', NULL);

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `users_audit_insert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
    INSERT INTO system_logs (user_id, action, table_name, record_id, new_values)
    VALUES (NEW.user_id, 'INSERT', 'users', NEW.user_id, JSON_OBJECT(
        'username', NEW.username,
        'full_name', NEW.full_name,
        'role', NEW.role,
        'department_id', NEW.department_id,
        'status', NEW.status
    ));
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `users_audit_update` AFTER UPDATE ON `users` FOR EACH ROW BEGIN
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
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `user_sessions`
--

CREATE TABLE `user_sessions` (
  `session_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `session_token` varchar(255) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `login_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `logout_time` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `workflow_rules`
--

CREATE TABLE `workflow_rules` (
  `rule_id` int(11) NOT NULL,
  `submission_type` enum('budget','project','policy','strategic','audit','system') NOT NULL,
  `priority_level` enum('low','medium','high','critical') NOT NULL,
  `amount_threshold` decimal(12,2) DEFAULT 0.00,
  `required_approver_role` enum('ceo','admin','coordinator','accountable','manager','it','auditor','council') NOT NULL,
  `sequence_order` int(11) NOT NULL,
  `is_final` tinyint(1) DEFAULT 0,
  `auto_approve` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `workflow_rules`
--

INSERT INTO `workflow_rules` (`rule_id`, `submission_type`, `priority_level`, `amount_threshold`, `required_approver_role`, `sequence_order`, `is_final`, `auto_approve`, `created_at`, `updated_at`) VALUES
(1, 'budget', 'low', 0.00, 'coordinator', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(2, 'budget', 'low', 0.00, 'accountable', 2, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(3, 'budget', 'low', 0.00, 'admin', 3, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(4, 'budget', 'medium', 0.00, 'coordinator', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(5, 'budget', 'medium', 0.00, 'accountable', 2, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(6, 'budget', 'medium', 0.00, 'admin', 3, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(7, 'budget', 'high', 1000000.00, 'coordinator', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(8, 'budget', 'high', 1000000.00, 'accountable', 2, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(9, 'budget', 'high', 1000000.00, 'admin', 3, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(10, 'budget', 'critical', 5000000.00, 'council', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(11, 'budget', 'critical', 5000000.00, 'council', 2, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(12, 'budget', 'critical', 5000000.00, 'council', 3, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(13, 'project', 'low', 0.00, 'coordinator', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(14, 'project', 'low', 0.00, 'admin', 2, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(15, 'project', 'medium', 0.00, 'coordinator', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(16, 'project', 'medium', 0.00, 'admin', 2, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(17, 'project', 'high', 0.00, 'coordinator', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(18, 'project', 'high', 0.00, 'admin', 2, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(19, 'project', 'critical', 0.00, 'council', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(20, 'project', 'critical', 0.00, 'council', 2, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(21, 'policy', 'low', 0.00, 'council', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(22, 'policy', 'low', 0.00, 'council', 2, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(23, 'policy', 'medium', 0.00, 'council', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(24, 'policy', 'medium', 0.00, 'council', 2, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(25, 'policy', 'high', 0.00, 'council', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(26, 'policy', 'high', 0.00, 'council', 2, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(27, 'policy', 'critical', 0.00, 'council', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(28, 'policy', 'critical', 0.00, 'council', 2, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(29, 'strategic', 'low', 0.00, 'council', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(30, 'strategic', 'low', 0.00, 'council', 2, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(31, 'strategic', 'medium', 0.00, 'council', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(32, 'strategic', 'medium', 0.00, 'council', 2, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(33, 'strategic', 'high', 0.00, 'council', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(34, 'strategic', 'high', 0.00, 'council', 2, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(35, 'strategic', 'critical', 0.00, 'council', 1, 0, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(36, 'strategic', 'critical', 0.00, 'council', 2, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(37, 'audit', 'low', 0.00, 'auditor', 1, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(38, 'audit', 'medium', 0.00, 'auditor', 1, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(39, 'audit', 'high', 0.00, 'auditor', 1, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(40, 'audit', 'critical', 0.00, 'auditor', 1, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(41, 'system', 'low', 0.00, 'it', 1, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(42, 'system', 'medium', 0.00, 'it', 1, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(43, 'system', 'high', 0.00, 'it', 1, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57'),
(44, 'system', 'critical', 0.00, 'it', 1, 1, 0, '2026-03-06 12:02:57', '2026-03-06 12:02:57');

-- --------------------------------------------------------

--
-- Structure for view `audit_overview`
--
DROP TABLE IF EXISTS `audit_overview`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `audit_overview`  AS SELECT `audit_management`.`audit_type` AS `audit_type`, count(0) AS `total_audits`, sum(case when `audit_management`.`status` = 'completed' then 1 else 0 end) AS `completed`, sum(case when `audit_management`.`status` = 'in_progress' then 1 else 0 end) AS `in_progress`, sum(case when `audit_management`.`status` = 'planned' then 1 else 0 end) AS `planned`, sum(case when `audit_management`.`status` = 'follow_up' then 1 else 0 end) AS `follow_up`, sum(case when `audit_management`.`risk_level` = 'high' then 1 else 0 end) AS `high_risk`, sum(case when `audit_management`.`risk_level` = 'medium' then 1 else 0 end) AS `medium_risk`, sum(case when `audit_management`.`risk_level` = 'low' then 1 else 0 end) AS `low_risk` FROM `audit_management` GROUP BY `audit_management`.`audit_type` ;

-- --------------------------------------------------------

--
-- Structure for view `leadership_dashboard`
--
DROP TABLE IF EXISTS `leadership_dashboard`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `leadership_dashboard`  AS SELECT `u`.`user_id` AS `user_id`, `u`.`full_name` AS `full_name`, `u`.`role` AS `role`, `d`.`department_name` AS `department_name`, count(distinct case when `s`.`status` = 'pending' then `s`.`submission_id` end) AS `pending_tasks`, count(distinct case when `s`.`status` = 'approved' then `s`.`submission_id` end) AS `approved_tasks`, count(distinct `n`.`notification_id`) AS `unread_notifications`, (select count(0) from `projects` where `projects`.`status` = 'active') AS `active_projects`, (select count(0) from `training_programs` where `training_programs`.`status` = 'ongoing') AS `ongoing_training` FROM (((`users` `u` left join `departments` `d` on(`u`.`department_id` = `d`.`department_id`)) left join `submissions` `s` on(`u`.`role` = 'ceo' and `s`.`workflow_level` = `s`.`max_workflow_level` and `s`.`status` = 'pending' or `u`.`role` = 'council' and `s`.`workflow_level` = `s`.`max_workflow_level` and `s`.`status` = 'pending' or `u`.`role` = 'auditor' and `s`.`submission_type` = 'audit' and `s`.`status` = 'pending' or `u`.`role` = 'it' and `s`.`submission_type` = 'system' and `s`.`status` = 'pending' or `u`.`role` = 'admin' and `s`.`status` = 'pending' or `u`.`role` = 'coordinator' and `s`.`workflow_level` = 1 and `s`.`status` = 'pending' or `u`.`role` = 'accountable' and `s`.`workflow_level` = 2 and `s`.`status` = 'pending' or `u`.`role` = 'manager' and `s`.`workflow_level` <= 2 and `s`.`status` = 'pending')) left join `notifications` `n` on(`u`.`user_id` = `n`.`user_id` and `n`.`is_read` = 0)) WHERE `u`.`role` in ('ceo','admin','coordinator','accountable','manager','it','auditor','council') AND `u`.`status` = 'active' GROUP BY `u`.`user_id`, `u`.`full_name`, `u`.`role`, `d`.`department_name` ;

-- --------------------------------------------------------

--
-- Structure for view `role_hierarchy`
--
DROP TABLE IF EXISTS `role_hierarchy`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `role_hierarchy`  AS SELECT `users`.`role` AS `role`, max(case when `users`.`role` = 'ceo' then 1 when `users`.`role` = 'council' then 2 when `users`.`role` = 'auditor' then 3 when `users`.`role` = 'admin' then 4 when `users`.`role` = 'coordinator' then 5 when `users`.`role` = 'accountable' then 6 when `users`.`role` = 'manager' then 7 when `users`.`role` = 'it' then 8 when `users`.`role` = 'employee' then 9 else 10 end) AS `hierarchy_level`, count(0) AS `user_count` FROM `users` WHERE `users`.`status` = 'active' GROUP BY `users`.`role` ;

-- --------------------------------------------------------

--
-- Structure for view `system_status`
--
DROP TABLE IF EXISTS `system_status`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `system_status`  AS SELECT `it_management`.`system_type` AS `system_type`, count(0) AS `total_systems`, sum(case when `it_management`.`status` = 'operational' then 1 else 0 end) AS `operational`, sum(case when `it_management`.`status` = 'maintenance' then 1 else 0 end) AS `maintenance`, sum(case when `it_management`.`status` = 'issue' then 1 else 0 end) AS `issue`, sum(case when `it_management`.`status` = 'offline' then 1 else 0 end) AS `offline`, max(`it_management`.`next_maintenance`) AS `next_scheduled_maintenance` FROM `it_management` GROUP BY `it_management`.`system_type` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `access_requests`
--
ALTER TABLE `access_requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `reviewed_by` (`reviewed_by`);

--
-- Indexes for table `approval_history`
--
ALTER TABLE `approval_history`
  ADD PRIMARY KEY (`history_id`),
  ADD KEY `approver_id` (`approver_id`),
  ADD KEY `idx_approval_history_submission` (`submission_id`);

--
-- Indexes for table `audit_management`
--
ALTER TABLE `audit_management`
  ADD PRIMARY KEY (`audit_id`),
  ADD UNIQUE KEY `audit_code` (`audit_code`),
  ADD KEY `auditor_id` (`auditor_id`);

--
-- Indexes for table `council_meetings`
--
ALTER TABLE `council_meetings`
  ADD PRIMARY KEY (`meeting_id`),
  ADD UNIQUE KEY `meeting_code` (`meeting_code`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`department_id`),
  ADD UNIQUE KEY `department_code` (`department_code`),
  ADD KEY `manager_id` (`manager_id`);

--
-- Indexes for table `financial_records`
--
ALTER TABLE `financial_records`
  ADD PRIMARY KEY (`record_id`),
  ADD UNIQUE KEY `record_code` (`record_code`),
  ADD KEY `approved_by` (`approved_by`),
  ADD KEY `submission_id` (`submission_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `it_management`
--
ALTER TABLE `it_management`
  ADD PRIMARY KEY (`it_id`),
  ADD UNIQUE KEY `system_code` (`system_code`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `idx_notifications_user` (`user_id`),
  ADD KEY `idx_notifications_read` (`is_read`);

--
-- Indexes for table `partners`
--
ALTER TABLE `partners`
  ADD PRIMARY KEY (`partner_id`),
  ADD UNIQUE KEY `partner_code` (`partner_code`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_partners_type` (`partner_type`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`project_id`),
  ADD UNIQUE KEY `project_code` (`project_code`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `approved_by` (`approved_by`),
  ADD KEY `idx_projects_status` (`status`),
  ADD KEY `idx_projects_manager` (`manager_id`);
ALTER TABLE `projects` ADD FULLTEXT KEY `idx_projects_search` (`project_name`,`description`);

--
-- Indexes for table `project_activities`
--
ALTER TABLE `project_activities`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `assigned_to` (`assigned_to`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`submission_id`),
  ADD UNIQUE KEY `submission_code` (`submission_code`),
  ADD KEY `submitted_by` (`submitted_by`),
  ADD KEY `approved_by` (`approved_by`),
  ADD KEY `idx_submissions_status` (`status`),
  ADD KEY `idx_submissions_type` (`submission_type`),
  ADD KEY `idx_submissions_approver` (`current_approver`);

--
-- Indexes for table `submission_comments`
--
ALTER TABLE `submission_comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `submission_id` (`submission_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `system_logs`
--
ALTER TABLE `system_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_system_logs_timestamp` (`timestamp`);

--
-- Indexes for table `training_participants`
--
ALTER TABLE `training_participants`
  ADD PRIMARY KEY (`participant_id`),
  ADD UNIQUE KEY `unique_participant` (`training_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `training_programs`
--
ALTER TABLE `training_programs`
  ADD PRIMARY KEY (`training_id`),
  ADD UNIQUE KEY `training_code` (`training_code`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_training_status` (`status`);
ALTER TABLE `training_programs` ADD FULLTEXT KEY `idx_training_search` (`training_name`,`description`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_role` (`role`),
  ADD KEY `idx_users_status` (`status`),
  ADD KEY `idx_users_department` (`department_id`);
ALTER TABLE `users` ADD FULLTEXT KEY `idx_users_search` (`full_name`,`email`);

--
-- Indexes for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD PRIMARY KEY (`session_id`),
  ADD UNIQUE KEY `session_token` (`session_token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `workflow_rules`
--
ALTER TABLE `workflow_rules`
  ADD PRIMARY KEY (`rule_id`),
  ADD KEY `idx_workflow_rules_type` (`submission_type`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `access_requests`
--
ALTER TABLE `access_requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `approval_history`
--
ALTER TABLE `approval_history`
  MODIFY `history_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `audit_management`
--
ALTER TABLE `audit_management`
  MODIFY `audit_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `council_meetings`
--
ALTER TABLE `council_meetings`
  MODIFY `meeting_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `department_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `financial_records`
--
ALTER TABLE `financial_records`
  MODIFY `record_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `it_management`
--
ALTER TABLE `it_management`
  MODIFY `it_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `partners`
--
ALTER TABLE `partners`
  MODIFY `partner_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `project_activities`
--
ALTER TABLE `project_activities`
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `submission_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `submission_comments`
--
ALTER TABLE `submission_comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `system_logs`
--
ALTER TABLE `system_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `training_participants`
--
ALTER TABLE `training_participants`
  MODIFY `participant_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `training_programs`
--
ALTER TABLE `training_programs`
  MODIFY `training_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `user_sessions`
--
ALTER TABLE `user_sessions`
  MODIFY `session_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `workflow_rules`
--
ALTER TABLE `workflow_rules`
  MODIFY `rule_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `access_requests`
--
ALTER TABLE `access_requests`
  ADD CONSTRAINT `access_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `access_requests_ibfk_2` FOREIGN KEY (`reviewed_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `approval_history`
--
ALTER TABLE `approval_history`
  ADD CONSTRAINT `approval_history_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`submission_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `approval_history_ibfk_2` FOREIGN KEY (`approver_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `audit_management`
--
ALTER TABLE `audit_management`
  ADD CONSTRAINT `audit_management_ibfk_1` FOREIGN KEY (`auditor_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `council_meetings`
--
ALTER TABLE `council_meetings`
  ADD CONSTRAINT `council_meetings_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `financial_records`
--
ALTER TABLE `financial_records`
  ADD CONSTRAINT `financial_records_ibfk_1` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `financial_records_ibfk_2` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`submission_id`),
  ADD CONSTRAINT `financial_records_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `it_management`
--
ALTER TABLE `it_management`
  ADD CONSTRAINT `it_management_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `partners`
--
ALTER TABLE `partners`
  ADD CONSTRAINT `partners_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `projects_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `project_activities`
--
ALTER TABLE `project_activities`
  ADD CONSTRAINT `project_activities_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`project_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `project_activities_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `project_activities_ibfk_3` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `submissions`
--
ALTER TABLE `submissions`
  ADD CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`submitted_by`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `submissions_ibfk_2` FOREIGN KEY (`current_approver`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `submissions_ibfk_3` FOREIGN KEY (`approved_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `submission_comments`
--
ALTER TABLE `submission_comments`
  ADD CONSTRAINT `submission_comments_ibfk_1` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`submission_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `submission_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `system_logs`
--
ALTER TABLE `system_logs`
  ADD CONSTRAINT `system_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `training_participants`
--
ALTER TABLE `training_participants`
  ADD CONSTRAINT `training_participants_ibfk_1` FOREIGN KEY (`training_id`) REFERENCES `training_programs` (`training_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `training_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `training_programs`
--
ALTER TABLE `training_programs`
  ADD CONSTRAINT `training_programs_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `user_sessions`
--
ALTER TABLE `user_sessions`
  ADD CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
