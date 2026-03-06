import java.io.*;
import java.net.*;
import java.sql.*;
import java.util.*;
import java.text.SimpleDateFormat;
import org.json.JSONObject;
import org.json.JSONArray;

public class AYIKBDatabaseApp {
    private static final int PORT = 8080;
    private static Connection connection;
    
    // Database configuration
    private static final String DB_URL = "jdbc:mysql://localhost:3306/ayikb_db";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "";
    
    public static void main(String[] args) {
        try {
            // Initialize database connection
            initializeDatabase();
            
            // Start server
            ServerSocket serverSocket = new ServerSocket(PORT);
            System.out.println("AYIKB Database Web Server running on port " + PORT);
            System.out.println("Visit http://localhost:" + PORT + " to view the website");
            System.out.println("Database connected: " + (connection != null ? "Yes" : "No"));
            
            while (true) {
                Socket clientSocket = serverSocket.accept();
                new Thread(new ClientHandler(clientSocket)).start();
            }
        } catch (Exception e) {
            System.err.println("Server error: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static void initializeDatabase() {
        try {
            // Load MySQL JDBC driver
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            // Connect to database
            connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
            System.out.println("Database connection established successfully!");
            
            // Test connection
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as user_count FROM users");
            if (rs.next()) {
                System.out.println("Total users in database: " + rs.getInt("user_count"));
            }
            rs.close();
            stmt.close();
            
        } catch (Exception e) {
            System.err.println("Database connection failed: " + e.getMessage());
            System.out.println("Running without database connection...");
            connection = null;
        }
    }
    
    static class ClientHandler implements Runnable {
        private Socket clientSocket;
        
        public ClientHandler(Socket socket) {
            this.clientSocket = socket;
        }
        
        @Override
        public void run() {
            try {
                BufferedReader in = new BufferedReader(new InputStreamReader(clientSocket.getInputStream()));
                PrintWriter out = new PrintWriter(clientSocket.getOutputStream(), true);
                
                String requestLine = in.readLine();
                if (requestLine == null) return;
                
                String[] tokens = requestLine.split(" ");
                String method = tokens[0];
                String path = tokens[1];
                
                // Read headers
                String headerLine;
                int contentLength = 0;
                while ((headerLine = in.readLine()) != null && !headerLine.isEmpty()) {
                    if (headerLine.startsWith("Content-Length:")) {
                        contentLength = Integer.parseInt(headerLine.split(":")[1].trim());
                    }
                }
                
                // Read POST data if present
                StringBuilder postData = new StringBuilder();
                if (contentLength > 0) {
                    char[] buffer = new char[contentLength];
                    in.read(buffer, 0, contentLength);
                    postData.append(buffer);
                }
                
                if (method.equals("GET")) {
                    handleGetRequest(path, out);
                } else if (method.equals("POST")) {
                    handlePostRequest(path, postData.toString(), out);
                } else {
                    send404(out);
                }
                
                clientSocket.close();
            } catch (IOException e) {
                System.err.println("Client handler error: " + e.getMessage());
            }
        }
        
        private void handleGetRequest(String path, PrintWriter out) {
            try {
                if (path.equals("/") || path.equals("/index.html")) {
                    serveFile("index.html", "text/html", out);
                } else if (path.equals("/styles.css")) {
                    serveFile("styles.css", "text/css", out);
                } else if (path.equals("/script.js")) {
                    serveFile("script.js", "application/javascript", out);
                } else if (path.equals("/dashboard.html")) {
                    serveFile("dashboard.html", "text/html", out);
                } else if (path.equals("/dashboard.js")) {
                    serveFile("dashboard.js", "application/javascript", out);
                } else if (path.equals("/projects.html")) {
                    serveFile("projects.html", "text/html", out);
                } else if (path.equals("/projects.js")) {
                    serveFile("projects.js", "application/javascript", out);
                } else if (path.equals("/training.html")) {
                    serveFile("training.html", "text/html", out);
                } else if (path.equals("/training.js")) {
                    serveFile("training.js", "application/javascript", out);
                } else if (path.equals("/partners.html")) {
                    serveFile("partners.html", "text/html", out);
                } else if (path.equals("/partners.js")) {
                    serveFile("partners.js", "application/javascript", out);
                } else if (path.equals("/reports.html")) {
                    serveFile("reports.html", "text/html", out);
                } else if (path.equals("/reports.js")) {
                    serveFile("reports.js", "application/javascript", out);
                } else if (path.equals("/admin.html")) {
                    serveFile("admin.html", "text/html", out);
                } else if (path.equals("/admin.js")) {
                    serveFile("admin.js", "application/javascript", out);
                } else if (path.startsWith("/api/")) {
                    handleApiRequest(path, out);
                } else {
                    send404(out);
                }
            } catch (IOException e) {
                send500(out, e.getMessage());
            }
        }
        
        private void handlePostRequest(String path, String postData, PrintWriter out) {
            try {
                if (path.equals("/api/contact")) {
                    handleContactForm(postData, out);
                } else if (path.equals("/api/users")) {
                    handleUserManagement(postData, out);
                } else if (path.equals("/api/projects")) {
                    handleProjectManagement(postData, out);
                } else if (path.equals("/api/training")) {
                    handleTrainingManagement(postData, out);
                } else if (path.equals("/api/partners")) {
                    handlePartnerManagement(postData, out);
                } else if (path.equals("/api/login")) {
                    handleLogin(postData, out);
                } else {
                    send404(out);
                }
            } catch (IOException e) {
                send500(out, e.getMessage());
            }
        }
        
        private void handleApiRequest(String path, PrintWriter out) {
            out.println("HTTP/1.1 200 OK");
            out.println("Content-Type: application/json");
            out.println("Access-Control-Allow-Origin: *");
            out.println();
            
            try {
                if (path.equals("/api/business-info")) {
                    out.println(getBusinessInfo());
                } else if (path.equals("/api/projects")) {
                    out.println(getProjects());
                } else if (path.equals("/api/training")) {
                    out.println(getTrainingPrograms());
                } else if (path.equals("/api/partners")) {
                    out.println(getPartners());
                } else if (path.equals("/api/users")) {
                    out.println(getUsers());
                } else if (path.equals("/api/financial-summary")) {
                    out.println(getFinancialSummary());
                } else if (path.equals("/api/statistics")) {
                    out.println(getStatistics());
                } else if (path.equals("/api/reports/financial")) {
                    out.println(getFinancialReport());
                } else if (path.equals("/api/reports/projects")) {
                    out.println(getProjectsReport());
                } else if (path.equals("/api/reports/training")) {
                    out.println(getTrainingReport());
                } else if (path.equals("/api/reports/partners")) {
                    out.println(getPartnersReport());
                } else {
                    out.println("{\"error\":\"API endpoint not found\"}");
                }
            } catch (Exception e) {
                out.println("{\"error\":\"" + e.getMessage() + "\"}");
            }
        }
        
        private String getBusinessInfo() throws SQLException {
            JSONObject response = new JSONObject();
            
            if (connection != null) {
                try {
                    Statement stmt = connection.createStatement();
                    ResultSet rs = stmt.executeQuery("SELECT * FROM settings WHERE setting_key IN ('business_name', 'business_email', 'business_phone', 'business_address')");
                    
                    while (rs.next()) {
                        response.put(rs.getString("setting_key"), rs.getString("setting_value"));
                    }
                    
                    // Get user count
                    rs = stmt.executeQuery("SELECT COUNT(*) as count FROM users WHERE status = 'active'");
                    if (rs.next()) {
                        response.put("currentEmployees", rs.getInt("count"));
                    }
                    
                    rs.close();
                    stmt.close();
                } catch (SQLException e) {
                    throw e;
                }
            } else {
                // Fallback data
                response.put("business_name", "AgriYouth Innovation Kirehe Business");
                response.put("business_email", "info@ayikb.rw");
                response.put("business_phone", "0788123456");
                response.put("business_address", "Kirehe District, Nyamugari Sector");
                response.put("currentEmployees", "10");
            }
            
            return response.toString();
        }
        
        private String getProjects() throws SQLException {
            JSONArray projects = new JSONArray();
            
            if (connection != null) {
                try {
                    Statement stmt = connection.createStatement();
                    ResultSet rs = stmt.executeQuery(
                        "SELECT p.*, u.full_name as manager_name FROM projects p " +
                        "LEFT JOIN users u ON p.manager_id = u.user_id ORDER BY p.created_at DESC"
                    );
                    
                    while (rs.next()) {
                        JSONObject project = new JSONObject();
                        project.put("id", rs.getInt("project_id"));
                        project.put("name", rs.getString("project_name"));
                        project.put("type", rs.getString("project_type"));
                        project.put("description", rs.getString("description"));
                        project.put("budget", rs.getDouble("budget"));
                        project.put("startDate", rs.getString("start_date"));
                        project.put("endDate", rs.getString("end_date"));
                        project.put("status", rs.getString("status"));
                        project.put("progress", rs.getInt("progress_percentage"));
                        project.put("manager", rs.getString("manager_name"));
                        projects.put(project);
                    }
                    
                    rs.close();
                    stmt.close();
                } catch (SQLException e) {
                    throw e;
                }
            } else {
                // Fallback data
                JSONObject project1 = new JSONObject();
                project1.put("id", 1);
                project1.put("name", "Phase 1: Ubuhinzi");
                project1.put("type", "agriculture");
                project1.put("description", "Gutera ibigori na ibirayi");
                project1.put("budget", 1000000);
                project1.put("startDate", "2024-01-01");
                project1.put("endDate", "2024-12-31");
                project1.put("status", "active");
                project1.put("progress", 75);
                project1.put("manager", "Pierre Niyonzima");
                projects.put(project1);
            }
            
            return projects.toString();
        }
        
        private String getTrainingPrograms() throws SQLException {
            JSONArray trainings = new JSONArray();
            
            if (connection != null) {
                try {
                    Statement stmt = connection.createStatement();
                    ResultSet rs = stmt.executeQuery(
                        "SELECT t.*, COUNT(tp.participant_id) as participant_count " +
                        "FROM training_programs t LEFT JOIN training_participants tp ON t.training_id = tp.training_id " +
                        "GROUP BY t.training_id ORDER BY t.start_date"
                    );
                    
                    while (rs.next()) {
                        JSONObject training = new JSONObject();
                        training.put("id", rs.getInt("training_id"));
                        training.put("name", rs.getString("training_name"));
                        training.put("category", rs.getString("category"));
                        training.put("description", rs.getString("description"));
                        training.put("startDate", rs.getString("start_date"));
                        training.put("endDate", rs.getString("end_date"));
                        training.put("location", rs.getString("location"));
                        training.put("trainer", rs.getString("trainer_name"));
                        training.put("maxParticipants", rs.getInt("max_participants"));
                        training.put("currentParticipants", rs.getInt("participant_count"));
                        training.put("status", rs.getString("status"));
                        trainings.put(training);
                    }
                    
                    rs.close();
                    stmt.close();
                } catch (SQLException e) {
                    throw e;
                }
            } else {
                // Fallback data
                JSONObject training1 = new JSONObject();
                training1.put("id", 1);
                training1.put("name", "Uburyo bwo guhinga bwiza");
                training1.put("category", "agriculture");
                training1.put("description", "Amahugurwa ajyanye n'uburyo bwo guhinga bwiza");
                training1.put("startDate", "2024-04-20");
                training1.put("endDate", "2024-04-20");
                training1.put("location", "AYIKB Office, Nyagahama");
                training1.put("trainer", "MINAGRI Expert");
                training1.put("maxParticipants", 50);
                training1.put("currentParticipants", 30);
                training1.put("status", "upcoming");
                trainings.put(training1);
            }
            
            return trainings.toString();
        }
        
        private String getPartners() throws SQLException {
            JSONArray partners = new JSONArray();
            
            if (connection != null) {
                try {
                    Statement stmt = connection.createStatement();
                    ResultSet rs = stmt.executeQuery("SELECT * FROM partners ORDER BY partnership_date DESC");
                    
                    while (rs.next()) {
                        JSONObject partner = new JSONObject();
                        partner.put("id", rs.getInt("partner_id"));
                        partner.put("name", rs.getString("partner_name"));
                        partner.put("type", rs.getString("partner_type"));
                        partner.put("description", rs.getString("description"));
                        partner.put("email", rs.getString("email"));
                        partner.put("phone", rs.getString("phone"));
                        partner.put("address", rs.getString("address"));
                        partner.put("contactPerson", rs.getString("contact_person"));
                        partner.put("partnershipDate", rs.getString("partnership_date"));
                        partner.put("status", rs.getString("status"));
                        partners.put(partner);
                    }
                    
                    rs.close();
                    stmt.close();
                } catch (SQLException e) {
                    throw e;
                }
            } else {
                // Fallback data
                JSONObject partner1 = new JSONObject();
                partner1.put("id", 1);
                partner1.put("name", "Akarere ka Kirehe");
                partner1.put("type", "government");
                partner1.put("description", "Akarere ka Kirehe dukora kumurikira");
                partner1.put("email", "info@kirehe.gov.rw");
                partner1.put("phone", "0788867890");
                partner1.put("address", "Kirehe Town");
                partner1.put("contactPerson", "Mayor Office");
                partner1.put("partnershipDate", "2024-01-01");
                partner1.put("status", "active");
                partners.put(partner1);
            }
            
            return partners.toString();
        }
        
        private String getUsers() throws SQLException {
            JSONArray users = new JSONArray();
            
            if (connection != null) {
                try {
                    Statement stmt = connection.createStatement();
                    ResultSet rs = stmt.executeQuery("SELECT user_id, username, full_name, email, phone, role, position, department, status FROM users ORDER BY created_at DESC");
                    
                    while (rs.next()) {
                        JSONObject user = new JSONObject();
                        user.put("id", rs.getInt("user_id"));
                        user.put("username", rs.getString("username"));
                        user.put("fullName", rs.getString("full_name"));
                        user.put("email", rs.getString("email"));
                        user.put("phone", rs.getString("phone"));
                        user.put("role", rs.getString("role"));
                        user.put("position", rs.getString("position"));
                        user.put("department", rs.getString("department"));
                        user.put("status", rs.getString("status"));
                        users.put(user);
                    }
                    
                    rs.close();
                    stmt.close();
                } catch (SQLException e) {
                    throw e;
                }
            } else {
                // Fallback data
                JSONObject user1 = new JSONObject();
                user1.put("id", 1);
                user1.put("username", "admin");
                user1.put("fullName", "System Administrator");
                user1.put("email", "admin@ayikb.rw");
                user1.put("phone", "0788123456");
                user1.put("role", "admin");
                user1.put("position", "System Admin");
                user1.put("department", "IT");
                user1.put("status", "active");
                users.put(user1);
            }
            
            return users.toString();
        }
        
        private String getFinancialSummary() throws SQLException {
            JSONObject summary = new JSONObject();
            
            if (connection != null) {
                try {
                    Statement stmt = connection.createStatement();
                    
                    // Total income
                    ResultSet rs = stmt.executeQuery("SELECT SUM(amount) as total FROM financial_records WHERE transaction_type = 'income'");
                    if (rs.next()) {
                        summary.put("totalIncome", rs.getDouble("total"));
                    }
                    
                    // Total expenses
                    rs = stmt.executeQuery("SELECT SUM(amount) as total FROM financial_records WHERE transaction_type = 'expense'");
                    if (rs.next()) {
                        summary.put("totalExpenses", rs.getDouble("total"));
                    }
                    
                    // Budget utilization
                    rs = stmt.executeQuery("SELECT SUM(budgeted_amount) as budgeted, SUM(actual_amount) as actual FROM budget");
                    if (rs.next()) {
                        summary.put("totalBudget", rs.getDouble("budgeted"));
                        summary.put("budgetUsed", rs.getDouble("actual"));
                    }
                    
                    rs.close();
                    stmt.close();
                } catch (SQLException e) {
                    throw e;
                }
            } else {
                // Fallback data
                summary.put("totalIncome", 9400000);
                summary.put("totalExpenses", 1450000);
                summary.put("totalBudget", 3300000);
                summary.put("budgetUsed", 1450000);
            }
            
            return summary.toString();
        }
        
        private String getStatistics() throws SQLException {
            JSONObject stats = new JSONObject();
            
            if (connection != null) {
                try {
                    Statement stmt = connection.createStatement();
                    
                    // User statistics
                    ResultSet rs = stmt.executeQuery("SELECT COUNT(*) as total FROM users WHERE status = 'active'");
                    if (rs.next()) {
                        stats.put("activeUsers", rs.getInt("total"));
                    }
                    
                    // Project statistics
                    rs = stmt.executeQuery("SELECT COUNT(*) as total FROM projects WHERE status = 'active'");
                    if (rs.next()) {
                        stats.put("activeProjects", rs.getInt("total"));
                    }
                    
                    // Training statistics
                    rs = stmt.executeQuery("SELECT COUNT(*) as total FROM training_programs WHERE status = 'completed'");
                    if (rs.next()) {
                        stats.put("completedTraining", rs.getInt("total"));
                    }
                    
                    // Partner statistics
                    rs = stmt.executeQuery("SELECT COUNT(*) as total FROM partners WHERE status = 'active'");
                    if (rs.next()) {
                        stats.put("activePartners", rs.getInt("total"));
                    }
                    
                    rs.close();
                    stmt.close();
                } catch (SQLException e) {
                    throw e;
                }
            } else {
                // Fallback data
                stats.put("activeUsers", 10);
                stats.put("activeProjects", 2);
                stats.put("completedTraining", 8);
                stats.put("activePartners", 4);
            }
            
            return stats.toString();
        }
        
        private String getFinancialReport() throws SQLException {
            JSONArray report = new JSONArray();
            
            if (connection != null) {
                try {
                    Statement stmt = connection.createStatement();
                    ResultSet rs = stmt.executeQuery(
                        "SELECT category, transaction_type, SUM(amount) as total, COUNT(*) as count " +
                        "FROM financial_records GROUP BY category, transaction_type ORDER BY total DESC"
                    );
                    
                    while (rs.next()) {
                        JSONObject item = new JSONObject();
                        item.put("category", rs.getString("category"));
                        item.put("type", rs.getString("transaction_type"));
                        item.put("amount", rs.getDouble("total"));
                        item.put("count", rs.getInt("count"));
                        report.put(item);
                    }
                    
                    rs.close();
                    stmt.close();
                } catch (SQLException e) {
                    throw e;
                }
            } else {
                // Fallback data
                JSONObject item1 = new JSONObject();
                item1.put("category", "Seeds");
                item1.put("type", "expense");
                item1.put("amount", 150000);
                item1.put("count", 3);
                report.put(item1);
            }
            
            return report.toString();
        }
        
        private String getProjectsReport() throws SQLException {
            JSONArray report = new JSONArray();
            
            if (connection != null) {
                try {
                    Statement stmt = connection.createStatement();
                    ResultSet rs = stmt.executeQuery(
                        "SELECT p.project_name, p.status, p.progress_percentage, p.start_date, p.end_date, " +
                        "COUNT(pa.activity_id) as activity_count FROM projects p " +
                        "LEFT JOIN project_activities pa ON p.project_id = pa.project_id " +
                        "GROUP BY p.project_id ORDER BY p.start_date DESC"
                    );
                    
                    while (rs.next()) {
                        JSONObject item = new JSONObject();
                        item.put("name", rs.getString("project_name"));
                        item.put("status", rs.getString("status"));
                        item.put("progress", rs.getInt("progress_percentage"));
                        item.put("startDate", rs.getString("start_date"));
                        item.put("endDate", rs.getString("end_date"));
                        item.put("activityCount", rs.getInt("activity_count"));
                        report.put(item);
                    }
                    
                    rs.close();
                    stmt.close();
                } catch (SQLException e) {
                    throw e;
                }
            } else {
                // Fallback data
                JSONObject item1 = new JSONObject();
                item1.put("name", "Phase 1: Ubuhinzi");
                item1.put("status", "active");
                item1.put("progress", 75);
                item1.put("startDate", "2024-01-01");
                item1.put("endDate", "2024-12-31");
                item1.put("activityCount", 5);
                report.put(item1);
            }
            
            return report.toString();
        }
        
        private String getTrainingReport() throws SQLException {
            JSONArray report = new JSONArray();
            
            if (connection != null) {
                try {
                    Statement stmt = connection.createStatement();
                    ResultSet rs = stmt.executeQuery(
                        "SELECT t.training_name, t.category, t.start_date, t.end_date, t.max_participants, " +
                        "COUNT(tp.participant_id) as registered, " +
                        "SUM(CASE WHEN tp.status = 'completed' THEN 1 ELSE 0 END) as completed " +
                        "FROM training_programs t LEFT JOIN training_participants tp ON t.training_id = tp.training_id " +
                        "GROUP BY t.training_id ORDER BY t.start_date DESC"
                    );
                    
                    while (rs.next()) {
                        JSONObject item = new JSONObject();
                        item.put("name", rs.getString("training_name"));
                        item.put("category", rs.getString("category"));
                        item.put("startDate", rs.getString("start_date"));
                        item.put("endDate", rs.getString("end_date"));
                        item.put("maxParticipants", rs.getInt("max_participants"));
                        item.put("registered", rs.getInt("registered"));
                        item.put("completed", rs.getInt("completed"));
                        report.put(item);
                    }
                    
                    rs.close();
                    stmt.close();
                } catch (SQLException e) {
                    throw e;
                }
            } else {
                // Fallback data
                JSONObject item1 = new JSONObject();
                item1.put("name", "Uburyo bwo guhinga bwiza");
                item1.put("category", "agriculture");
                item1.put("startDate", "2024-04-20");
                item1.put("endDate", "2024-04-20");
                item1.put("maxParticipants", 50);
                item1.put("registered", 30);
                item1.put("completed", 0);
                report.put(item1);
            }
            
            return report.toString();
        }
        
        private String getPartnersReport() throws SQLException {
            JSONArray report = new JSONArray();
            
            if (connection != null) {
                try {
                    Statement stmt = connection.createStatement();
                    ResultSet rs = stmt.executeQuery(
                        "SELECT p.partner_name, p.partner_type, p.partnership_date, p.status, " +
                        "COUNT(pp.partnership_id) as project_count, COALESCE(SUM(pp.contribution_value), 0) as total_contribution " +
                        "FROM partners p LEFT JOIN partner_projects pp ON p.partner_id = pp.partner_id " +
                        "GROUP BY p.partner_id ORDER BY p.partnership_date DESC"
                    );
                    
                    while (rs.next()) {
                        JSONObject item = new JSONObject();
                        item.put("name", rs.getString("partner_name"));
                        item.put("type", rs.getString("partner_type"));
                        item.put("partnershipDate", rs.getString("partnership_date"));
                        item.put("status", rs.getString("status"));
                        item.put("projectCount", rs.getInt("project_count"));
                        item.put("totalContribution", rs.getDouble("total_contribution"));
                        report.put(item);
                    }
                    
                    rs.close();
                    stmt.close();
                } catch (SQLException e) {
                    throw e;
                }
            } else {
                // Fallback data
                JSONObject item1 = new JSONObject();
                item1.put("name", "Akarere ka Kirehe");
                item1.put("type", "government");
                item1.put("partnershipDate", "2024-01-01");
                item1.put("status", "active");
                item1.put("projectCount", 5);
                item1.put("totalContribution", 2000000);
                report.put(item1);
            }
            
            return report.toString();
        }
        
        private void handleContactForm(String postData, PrintWriter out) {
            try {
                // Parse form data
                Map<String, String> formData = parseFormData(postData);
                
                if (connection != null) {
                    // Insert into database
                    String sql = "INSERT INTO contact_messages (full_name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)";
                    PreparedStatement pstmt = connection.prepareStatement(sql);
                    pstmt.setString(1, formData.get("name"));
                    pstmt.setString(2, formData.get("email"));
                    pstmt.setString(3, formData.get("phone"));
                    pstmt.setString(4, "Website Contact");
                    pstmt.setString(5, formData.get("message"));
                    pstmt.executeUpdate();
                    pstmt.close();
                }
                
                // Send response
                out.println("HTTP/1.1 200 OK");
                out.println("Content-Type: application/json");
                out.println("Access-Control-Allow-Origin: *");
                out.println();
                out.println("{\"success\":true,\"message\":\"Ubutumwa bwakiriye murakoze!\"}");
                
                System.out.println("New contact received: " + formData.get("name") + " (" + formData.get("email") + ")");
                
            } catch (Exception e) {
                send500(out, e.getMessage());
            }
        }
        
        private void handleUserManagement(String postData, PrintWriter out) {
            try {
                Map<String, String> formData = parseFormData(postData);
                String action = formData.get("action");
                
                if ("add".equals(action) && connection != null) {
                    String sql = "INSERT INTO users (username, password, full_name, email, phone, role, position, department) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                    PreparedStatement pstmt = connection.prepareStatement(sql);
                    pstmt.setString(1, formData.get("username"));
                    pstmt.setString(2, formData.get("password")); // In production, hash this
                    pstmt.setString(3, formData.get("fullName"));
                    pstmt.setString(4, formData.get("email"));
                    pstmt.setString(5, formData.get("phone"));
                    pstmt.setString(6, formData.get("role"));
                    pstmt.setString(7, formData.get("position"));
                    pstmt.setString(8, formData.get("department"));
                    pstmt.executeUpdate();
                    pstmt.close();
                }
                
                out.println("HTTP/1.1 200 OK");
                out.println("Content-Type: application/json");
                out.println("Access-Control-Allow-Origin: *");
                out.println();
                out.println("{\"success\":true,\"message\":\"User operation completed\"}");
                
            } catch (Exception e) {
                send500(out, e.getMessage());
            }
        }
        
        private void handleProjectManagement(String postData, PrintWriter out) {
            try {
                Map<String, String> formData = parseFormData(postData);
                String action = formData.get("action");
                
                if ("add".equals(action) && connection != null) {
                    String sql = "INSERT INTO projects (project_name, project_type, description, budget, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?, 1)";
                    PreparedStatement pstmt = connection.prepareStatement(sql);
                    pstmt.setString(1, formData.get("projectName"));
                    pstmt.setString(2, formData.get("projectType"));
                    pstmt.setString(3, formData.get("description"));
                    pstmt.setDouble(4, Double.parseDouble(formData.get("budget")));
                    pstmt.setString(5, formData.get("startDate"));
                    pstmt.setString(6, formData.get("endDate"));
                    pstmt.executeUpdate();
                    pstmt.close();
                }
                
                out.println("HTTP/1.1 200 OK");
                out.println("Content-Type: application/json");
                out.println("Access-Control-Allow-Origin: *");
                out.println();
                out.println("{\"success\":true,\"message\":\"Project operation completed\"}");
                
            } catch (Exception e) {
                send500(out, e.getMessage());
            }
        }
        
        private void handleTrainingManagement(String postData, PrintWriter out) {
            try {
                Map<String, String> formData = parseFormData(postData);
                String action = formData.get("action");
                
                if ("add".equals(action) && connection != null) {
                    String sql = "INSERT INTO training_programs (training_name, category, description, start_date, end_date, start_time, end_time, location, trainer_name, trainer_contact, max_participants, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)";
                    PreparedStatement pstmt = connection.prepareStatement(sql);
                    pstmt.setString(1, formData.get("trainingName"));
                    pstmt.setString(2, formData.get("category"));
                    pstmt.setString(3, formData.get("description"));
                    pstmt.setString(4, formData.get("startDate"));
                    pstmt.setString(5, formData.get("endDate"));
                    pstmt.setString(6, formData.get("startTime"));
                    pstmt.setString(7, formData.get("endTime"));
                    pstmt.setString(8, formData.get("location"));
                    pstmt.setString(9, formData.get("trainerName"));
                    pstmt.setString(10, formData.get("trainerContact"));
                    pstmt.setInt(11, Integer.parseInt(formData.get("maxParticipants")));
                    pstmt.executeUpdate();
                    pstmt.close();
                }
                
                out.println("HTTP/1.1 200 OK");
                out.println("Content-Type: application/json");
                out.println("Access-Control-Allow-Origin: *");
                out.println();
                out.println("{\"success\":true,\"message\":\"Training operation completed\"}");
                
            } catch (Exception e) {
                send500(out, e.getMessage());
            }
        }
        
        private void handlePartnerManagement(String postData, PrintWriter out) {
            try {
                Map<String, String> formData = parseFormData(postData);
                String action = formData.get("action");
                
                if ("add".equals(action) && connection != null) {
                    String sql = "INSERT INTO partners (partner_name, partner_type, description, email, phone, address, contact_person, partnership_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, CURDATE(), 1)";
                    PreparedStatement pstmt = connection.prepareStatement(sql);
                    pstmt.setString(1, formData.get("partnerName"));
                    pstmt.setString(2, formData.get("partnerType"));
                    pstmt.setString(3, formData.get("description"));
                    pstmt.setString(4, formData.get("email"));
                    pstmt.setString(5, formData.get("phone"));
                    pstmt.setString(6, formData.get("address"));
                    pstmt.setString(7, formData.get("contactPerson"));
                    pstmt.executeUpdate();
                    pstmt.close();
                }
                
                out.println("HTTP/1.1 200 OK");
                out.println("Content-Type: application/json");
                out.println("Access-Control-Allow-Origin: *");
                out.println();
                out.println("{\"success\":true,\"message\":\"Partner operation completed\"}");
                
            } catch (Exception e) {
                send500(out, e.getMessage());
            }
        }
        
        private void handleLogin(String postData, PrintWriter out) {
            try {
                Map<String, String> formData = parseFormData(postData);
                String username = formData.get("username");
                String password = formData.get("password");
                
                boolean authenticated = false;
                String userRole = "user";
                
                if (connection != null) {
                    String sql = "SELECT role FROM users WHERE username = ? AND password = ? AND status = 'active'";
                    PreparedStatement pstmt = connection.prepareStatement(sql);
                    pstmt.setString(1, username);
                    pstmt.setString(2, password); // In production, use password hashing
                    ResultSet rs = pstmt.executeQuery();
                    
                    if (rs.next()) {
                        authenticated = true;
                        userRole = rs.getString("role");
                    }
                    
                    rs.close();
                    pstmt.close();
                } else {
                    // Fallback authentication for demo
                    if ("admin".equals(username) && "admin123".equals(password)) {
                        authenticated = true;
                        userRole = "admin";
                    }
                }
                
                out.println("HTTP/1.1 200 OK");
                out.println("Content-Type: application/json");
                out.println("Access-Control-Allow-Origin: *");
                out.println();
                
                if (authenticated) {
                    out.println("{\"success\":true,\"role\":\"" + userRole + "\",\"message\":\"Login successful\"}");
                } else {
                    out.println("{\"success\":false,\"message\":\"Invalid credentials\"}");
                }
                
            } catch (Exception e) {
                send500(out, e.getMessage());
            }
        }
        
        private Map<String, String> parseFormData(String data) {
            Map<String, String> result = new HashMap<>();
            if (data == null || data.isEmpty()) return result;
            
            String[] pairs = data.split("&");
            for (String pair : pairs) {
                String[] keyValue = pair.split("=");
                if (keyValue.length == 2) {
                    try {
                        String key = URLDecoder.decode(keyValue[0], "UTF-8");
                        String value = URLDecoder.decode(keyValue[1], "UTF-8");
                        result.put(key, value);
                    } catch (UnsupportedEncodingException e) {
                        // Ignore encoding errors
                    }
                }
            }
            return result;
        }
        
        private void serveFile(String filename, String contentType, PrintWriter out) throws IOException {
            File file = new File(filename);
            if (!file.exists()) {
                send404(out);
                return;
            }
            
            BufferedReader fileReader = new BufferedReader(new FileReader(file));
            StringBuilder content = new StringBuilder();
            String line;
            while ((line = fileReader.readLine()) != null) {
                content.append(line).append("\n");
            }
            fileReader.close();
            
            out.println("HTTP/1.1 200 OK");
            out.println("Content-Type: " + contentType);
            out.println("Content-Length: " + content.length());
            out.println();
            out.print(content.toString());
        }
        
        private void send404(PrintWriter out) {
            out.println("HTTP/1.1 404 Not Found");
            out.println("Content-Type: text/html");
            out.println();
            out.println("<html><body><h1>404 - Page Not Found</h1><p>The requested page could not be found.</p></body></html>");
        }
        
        private void send500(PrintWriter out, String message) {
            out.println("HTTP/1.1 500 Internal Server Error");
            out.println("Content-Type: text/html");
            out.println();
            out.println("<html><body><h1>500 - Internal Server Error</h1><p>" + message + "</p></body></html>");
        }
    }
}
