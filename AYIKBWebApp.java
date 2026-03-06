import java.io.*;
import java.net.*;
import java.util.*;
import java.text.SimpleDateFormat;
import java.util.Date;

public class AYIKBWebApp {
    private static final int PORT = 8080;
    private static Map<String, String> businessData = new HashMap<>();
    private static List<Map<String, String>> contacts = new ArrayList<>();
    
    static {
        // Initialize business data
        businessData.put("name", "AgriYouth Innovation Kirehe Business");
        businessData.put("acronym", "AYIKB");
        businessData.put("location", "Karere ka Kirehe, Umurenge wa Nyamugari, Akagari ka Nyamugari, Umudugudu wa Nyagahama");
        businessData.put("mission", "Guteza imbere urubyiruko mu bikorwa by'ubuhinzi, ubworozi no guhanga udushya");
        businessData.put("vision", "Kuba isoko y'iterambere ry'urubyiruko mu Karere ka Kirehe");
        businessData.put("currentEmployees", "10");
        businessData.put("targetJobs", "200");
        businessData.put("currentLand", "1.3 hegitari");
        businessData.put("maizeLand", "1 hegitari");
        businessData.put("potatoLand", "1/3 hegitari");
    }
    
    public static void main(String[] args) {
        try {
            ServerSocket serverSocket = new ServerSocket(PORT);
            System.out.println("AYIKB Web Server running on port " + PORT);
            System.out.println("Visit http://localhost:" + PORT + " to view the website");
            
            while (true) {
                Socket clientSocket = serverSocket.accept();
                new Thread(new ClientHandler(clientSocket)).start();
            }
        } catch (IOException e) {
            System.err.println("Server error: " + e.getMessage());
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
                while ((headerLine = in.readLine()) != null && !headerLine.isEmpty()) {
                    // Skip headers for now
                }
                
                if (method.equals("GET")) {
                    handleGetRequest(path, out);
                } else if (method.equals("POST")) {
                    handlePostRequest(path, in, out);
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
                } else if (path.startsWith("/api/")) {
                    handleApiRequest(path, out);
                } else {
                    send404(out);
                }
            } catch (IOException e) {
                send500(out, e.getMessage());
            }
        }
        
        private void handlePostRequest(String path, BufferedReader in, PrintWriter out) {
            try {
                if (path.equals("/api/contact")) {
                    handleContactForm(in, out);
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
            
            if (path.equals("/api/business-info")) {
                // Return business information as JSON
                StringBuilder json = new StringBuilder();
                json.append("{");
                json.append("\"name\":\"").append(businessData.get("name")).append("\",");
                json.append("\"acronym\":\"").append(businessData.get("acronym")).append("\",");
                json.append("\"location\":\"").append(businessData.get("location")).append("\",");
                json.append("\"mission\":\"").append(businessData.get("mission")).append("\",");
                json.append("\"vision\":\"").append(businessData.get("vision")).append("\",");
                json.append("\"currentEmployees\":").append(businessData.get("currentEmployees")).append(",");
                json.append("\"targetJobs\":").append(businessData.get("targetJobs")).append(",");
                json.append("\"currentLand\":\"").append(businessData.get("currentLand")).append("\",");
                json.append("\"maizeLand\":\"").append(businessData.get("maizeLand")).append("\",");
                json.append("\"potatoLand\":\"").append(businessData.get("potatoLand")).append("\"");
                json.append("}");
                out.println(json.toString());
            } else if (path.equals("/api/phases")) {
                // Return project phases information
                out.println("[");
                out.println("{");
                out.println("\"id\":1,");
                out.println("\"name\":\"Phase 1: Ubuhinzi\",");
                out.println("\"budget\":\"1,000,000 Frw\",");
                out.println("\"status\":\"Iri gukora\",");
                out.println("\"description\":\"Twanahinze ibigori kuri hegitari 1 na ibirayi kuri 1/3 cya hegitari\"");
                out.println("},");
                out.println("{");
                out.println("\"id\":2,");
                out.println("\"name\":\"Phase 2: Ubworozi bw'Ingurube\",");
                out.println("\"budget\":\"800,000 Frw\",");
                out.println("\"status\":\"Ibitegurwa\",");
                out.println("\"description\":\"Gutangira ubworozi bw'ingurube\"");
                out.println("},");
                out.println("{");
                out.println("\"id\":3,");
                out.println("\"name\":\"Phase 3: Ubworozi bw'Inkoko\",");
                out.println("\"budget\":\"1,000,000 Frw\",");
                out.println("\"status\":\"Ibitegurwa\",");
                out.println("\"description\":\"Gutangira ubworozi bw'inkoko\"");
                out.println("}");
                out.println("]");
            } else if (path.equals("/api/benefits")) {
                // Return expected benefits
                out.println("[");
                out.println("{");
                out.println("\"category\":\"Ubuhinzi\",");
                out.println("\"amount\":\"1,000,000 Frw\",");
                out.println("\"frequency\":\"buri season\"");
                out.println("},");
                out.println("{");
                out.println("\"category\":\"Inkoko\",");
                out.println("\"amount\":\"7,200,000 Frw\",");
                out.println("\"frequency\":\"ku mwaka\"");
                out.println("},");
                out.println("{");
                out.println("\"category\":\"Ingurube\",");
                out.println("\"amount\":\"1,200,000 Frw\",");
                out.println("\"frequency\":\"ku mwaka\"");
                out.println("}");
                out.println("]");
            } else if (path.equals("/api/contacts")) {
                // Return contact submissions (for admin purposes)
                out.println("[");
                for (int i = 0; i < contacts.size(); i++) {
                    Map<String, String> contact = contacts.get(i);
                    out.println("{");
                    out.println("\"name\":\"").append(contact.get("name")).append("\",");
                    out.println("\"email\":\"").append(contact.get("email")).append("\",");
                    out.println("\"phone\":\"").append(contact.get("phone")).append("\",");
                    out.println("\"message\":\"").append(contact.get("message")).append("\",");
                    out.println("\"date\":\"").append(contact.get("date")).append("\"");
                    out.println("}");
                    if (i < contacts.size() - 1) out.println(",");
                }
                out.println("]");
            } else {
                out.println("{\"error\":\"API endpoint not found\"}");
            }
        }
        
        private void handleContactForm(BufferedReader in, PrintWriter out) throws IOException {
            // Read POST data
            StringBuilder postData = new StringBuilder();
            String line;
            while (in.ready() && (line = in.readLine()) != null) {
                postData.append(line);
            }
            
            // Parse form data (simplified parsing)
            String data = postData.toString();
            Map<String, String> formData = parseFormData(data);
            
            // Store contact
            Map<String, String> contact = new HashMap<>();
            contact.put("name", formData.getOrDefault("name", ""));
            contact.put("email", formData.getOrDefault("email", ""));
            contact.put("phone", formData.getOrDefault("phone", ""));
            contact.put("message", formData.getOrDefault("message", ""));
            
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            contact.put("date", sdf.format(new Date()));
            
            contacts.add(contact);
            
            // Send response
            out.println("HTTP/1.1 200 OK");
            out.println("Content-Type: application/json");
            out.println("Access-Control-Allow-Origin: *");
            out.println();
            out.println("{\"success\":true,\"message\":\"Ubutumwa bwakiriye murakoze!\"}");
            
            System.out.println("New contact received: " + contact.get("name") + " (" + contact.get("email") + ")");
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
