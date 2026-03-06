# AgriYouth Innovation Kirehe Business (AYIKB) Website

## Project Overview
This is a professional website for AgriYouth Innovation Kirehe Business (AYIKB), a youth-focused agricultural and livestock business located in Kirehe District, Rwanda.

## Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Professional UI**: Modern, clean interface with smooth animations
- **Kinyarwanda Language**: Content presented in Kinyarwanda for local audience
- **Interactive Elements**: Animated statistics, progress indicators, and contact forms
- **Java Backend**: Lightweight Java web server for dynamic content
- **SEO Optimized**: Proper HTML structure and meta tags

## Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with animations and transitions
- **JavaScript**: Interactive features and dynamic content
- **Java**: Backend web server for API endpoints

## Project Structure
```
ayikbproject/
├── index.html          # Main HTML page
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
├── AYIKBWebApp.java    # Java backend server
└── README.md           # This file
```

## Website Sections

### 1. Hero Section
- Business name and tagline
- Key statistics (jobs created, location, employees)
- Call-to-action elements

### 2. About Section
- Business location and overview
- Core values and mission
- Company vision

### 3. Mission & Vision
- Detailed mission statements
- Progress indicators
- Visual representations

### 4. Activities
- **Agriculture**: Maize, potatoes, beans, soy, vegetables, fruits
- **Livestock**: Pigs, chickens, rabbits
- **Training**: Youth education programs
- **Marketing**: Product sales and distribution

### 5. Project Phases
- Phase 1: Agriculture (1,000,000 Frw)
- Phase 2: Pig Farming (800,000 Frw)
- Phase 3: Chicken Farming (1,000,000 Frw)

### 6. Expected Benefits
- Agriculture: 1,000,000 Frw per season
- Chickens: 7,200,000 Frw per year
- Pigs: 1,200,000 Frw per year

### 7. Partners
- Kirehe District
- MINAGRI
- BDF
- RYAF
- NGOs

### 8. Challenges
- Limited land
- Insufficient capital
- Inadequate equipment
- Limited project management knowledge

### 9. Contact Section
- Contact form
- Location information
- Partnership opportunities

## Running the Website

### Option 1: Static Files (Simple)
Simply open `index.html` in a web browser. This will work for most features except the backend API.

### Option 2: Java Backend (Full Features)
1. Compile the Java server:
   ```bash
   javac AYIKBWebApp.java
   ```

2. Run the server:
   ```bash
   java AYIKBWebApp
   ```

3. Open your browser and visit: `http://localhost:8080`

## API Endpoints

The Java backend provides the following API endpoints:

- `GET /api/business-info` - Returns business information
- `GET /api/phases` - Returns project phases
- `GET /api/benefits` - Returns expected benefits
- `GET /api/contacts` - Returns contact submissions (admin)
- `POST /api/contact` - Handles contact form submissions

## Customization

### Colors and Theme
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2ecc71;
    --secondary-color: #27ae60;
    --accent-color: #e74c3c;
    /* ... other variables */
}
```

### Content
Update the HTML content in `index.html` to modify text, images, or structure.

### Business Data
Modify the `businessData` map in `AYIKBWebApp.java` to update backend information.

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance Features
- Lazy loading animations
- Optimized CSS transitions
- Efficient JavaScript
- Minimal HTTP requests
- Responsive images

## Security Notes
- Input validation on contact forms
- XSS protection
- CORS headers for API
- No sensitive data exposure

## Future Enhancements
- Database integration for contacts
- Admin dashboard
- Image gallery
- News/blog section
- Multi-language support
- E-commerce functionality

## Support
For questions or support regarding this website, please use the contact form on the website or reach out through the provided contact information.

## License
This project is proprietary to AgriYouth Innovation Kirehe Business (AYIKB).
