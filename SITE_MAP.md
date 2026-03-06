# AYIKB Website - Complete Site Map & Navigation Guide

## 🏠 Main Navigation Structure

### Primary Navigation (All Pages)
- **Ahabanza** (Home) → `index.html`
- **Dashboard** → `dashboard.html`
- **Projects** → `projects.html`
- **Amahugurwa** (Training) → `training.html`
- **Abafatanyabikorwa** (Partners) → `partners.html`
- **Raporo** (Reports) → `reports.html`
- **Admin** → `admin.html`

---

## 📄 Page Details & Features

### 1. **index.html** - Homepage
**Purpose**: Main landing page with business overview
**Key Features**:
- Hero section with business statistics
- About section with mission and values
- Activities overview (agriculture, livestock, training)
- Project phases timeline
- Expected benefits display
- Partner showcase
- Contact form
- Responsive design

**Navigation Links**: All main pages accessible from header

---

### 2. **dashboard.html** - Admin Dashboard
**Purpose**: Real-time business overview and analytics
**Key Features**:
- Sidebar navigation with sections:
  - Overview (statistics, charts)
  - Agriculture (crop management)
  - Livestock (animal tracking)
  - Training (program status)
  - Finance (budget overview)
  - Employees (staff management)
  - Contacts (inquiry management)
- Interactive charts (Chart.js)
- Real-time updates
- Progress indicators
- Export functionality

**JavaScript**: `dashboard.js` - Charts, real-time updates, interactions

---

### 3. **projects.html** - Projects Management
**Purpose**: Complete project lifecycle management
**Key Features**:
- Project grid with filtering (status, type)
- Add new projects (modal form)
- Project details view
- Progress tracking
- Project statistics
- Export functionality (CSV, JSON)
- Search functionality

**JavaScript**: `projects.js` - Filtering, modals, export, search

---

### 4. **training.html** - Training Programs
**Purpose**: Training program management and registration
**Key Features**:
- Training program cards with filtering
- Registration system
- Training calendar
- Certificate generation
- Training statistics
- Trainer management
- Attendance tracking

**JavaScript**: `training.js` - Registration, calendar, certificates

---

### 5. **partners.html** - Partners Management
**Purpose**: Partner relationship management
**Key Features**:
- Partner directory with filtering
- Partnership opportunities
- Contact management
- Contribution tracking
- Partnership history
- Communication logs
- Export functionality

**JavaScript**: `partners.js` - Partner management, communication

---

### 6. **reports.html** - Reports & Analytics
**Purpose**: Comprehensive reporting and analytics
**Key Features**:
- Multiple report types:
  - Financial reports
  - Project reports
  - Training reports
  - Partner reports
  - Employee reports
- Interactive charts and graphs
- Date range filtering
- Export options (PDF, Excel, Print)
- KPI tracking
- Real-time updates

**JavaScript**: `reports.js` - Charts, exports, filtering

---

### 7. **admin.html** - System Administration
**Purpose**: System administration and maintenance
**Key Features**:
- User management
- System settings
- Backup management
- Security controls
- System logs
- Maintenance tools
- System status monitoring

**JavaScript**: `admin.js` - User management, settings, maintenance

---

## 🔗 Navigation Flow

### User Journey Examples:

#### **1. Public Visitor Flow**
```
Homepage → About → Activities → Partners → Contact
```

#### **2. Admin User Flow**
```
Homepage → Login → Dashboard → Projects → Training → Reports → Admin
```

#### **3. Project Manager Flow**
```
Dashboard → Projects → [Project Details] → Reports → Admin (if needed)
```

#### **4. Training Coordinator Flow**
```
Dashboard → Training → [Program Details] → Registration → Reports
```

---

## 📱 Mobile Navigation

### Responsive Features:
- Hamburger menu for mobile devices
- Collapsible sidebar (dashboard/admin)
- Touch-friendly interface
- Optimized layouts for all screen sizes

---

## 🔐 Access Control

### Page Access Levels:
- **Public**: Homepage only
- **User**: Dashboard (view-only)
- **Manager**: Dashboard, Projects, Training, Reports
- **Admin**: All pages including admin panel

### Navigation Restrictions:
- Admin panel only accessible to admin users
- Certain features restricted by user role
- Login required for dashboard and beyond

---

## 🎯 Button & Action Mapping

### Homepage Buttons:
- **"Iyandikishe"** (Register) → Training registration modal
- **"Reba"** (View) → Project/training details
- **"Twarabize"** (Contact) → Contact form/partner contact

### Dashboard Buttons:
- **"Ohereza Umushinga"** (Add Project) → Add project modal
- **"Export"** buttons → Download reports
- **"Filter"** options → Refine data display

### Projects Page Buttons:
- **"Ohereza Project Nshya"** → Add project form
- **"Reba"** → Project details modal
- **"Hindura"** → Edit project
- **Export buttons** → Download project data

### Training Page Buttons:
- **"Iyandikishe"** → Registration form
- **"View Certificate"** → Certificate generation
- **"Add Training"** → Training creation form

### Partners Page Buttons:
- **"Ohereza Umufatanyabikorwa"** → Add partner form
- **"Twarabize"** → Contact partner modal
- **"Apply for Partnership"** → Partnership application

### Reports Page Buttons:
- **"Export PDF/Excel"** → Download reports
- **"Print"** → Print reports
- **"Update"** → Refresh data with date range

### Admin Page Buttons:
- **"Ohereza Umukozi"** → Add user form
- **"Create Backup"** → System backup
- **"Lock System"** → Security actions
- **"Save Settings"** → Update system settings

---

## 🗂️ File Structure

```
ayikbproject/
├── index.html              # Homepage
├── dashboard.html           # Admin dashboard
├── projects.html            # Projects management
├── training.html            # Training programs
├── partners.html            # Partners management
├── reports.html             # Reports & analytics
├── admin.html               # System administration
├── styles.css               # Main stylesheet
├── script.js                # Global JavaScript
├── dashboard.js             # Dashboard functionality
├── projects.js              # Projects functionality
├── training.js              # Training functionality
├── partners.js              # Partners functionality
├── reports.js               # Reports functionality
├── admin.js                 # Admin functionality
├── AYIKBWebApp.java         # Basic Java server
├── AYIKBDatabaseApp.java    # Database-connected Java server
├── database_design.md       # Database documentation
├── ayikb_database.sql       # Database creation script
├── README.md                # Project documentation
└── SITE_MAP.md              # This file
```

---

## 🔗 API Endpoints

### Database-Connected Server (`AYIKBDatabaseApp.java`):
- `/api/business-info` - Business information
- `/api/projects` - Project data
- `/api/training` - Training programs
- `/api/partners` - Partner data
- `/api/users` - User management
- `/api/statistics` - System statistics
- `/api/reports/*` - Various reports
- `/api/login` - Authentication
- `/api/contact` - Contact form submission

### Basic Server (`AYIKBWebApp.java`):
- Static file serving
- Basic API endpoints with fallback data
- Contact form handling

---

## 🎨 Design Consistency

### Common Elements Across All Pages:
- **Header**: Consistent navigation with logo and menu
- **Footer**: Business information and links
- **Color Scheme**: Green (#2ecc71) primary, blue (#3498db) secondary
- **Typography**: Poppins font family
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and micro-interactions

### Interactive Features:
- Hover effects on cards and buttons
- Smooth scrolling navigation
- Modal dialogs for forms
- Loading states and notifications
- Real-time data updates (where applicable)

---

## 📊 Data Flow

### Input → Processing → Output:
1. **User Input** (forms, clicks) → JavaScript validation
2. **API Calls** → Java backend processing
3. **Database Operations** → Data storage/retrieval
4. **Response** → JSON data → Frontend updates
5. **UI Updates** → Dynamic content refresh

### Real-time Features:
- Dashboard statistics updates
- Training registration counts
- Project progress tracking
- System status monitoring

---

## 🚀 Getting Started

### Quick Start:
1. **Static Version**: Open `index.html` in browser
2. **Full Version**: 
   - Set up MySQL database
   - Run `ayikb_database.sql`
   - Compile and run `AYIKBDatabaseApp.java`
   - Visit `http://localhost:8080`

### Default Login:
- **Username**: admin
- **Password**: admin123

---

## 🔄 Navigation Testing

### Test Scenarios:
1. **Homepage Navigation**: All links work correctly
2. **Mobile Responsiveness**: Menu collapses properly
3. **Role-Based Access**: Correct page restrictions
4. **Form Submissions**: Data saves correctly
5. **Export Functions**: Downloads work properly
6. **Real-time Updates**: Data refreshes automatically

This comprehensive navigation structure ensures a complete, professional website experience for the AYIKB business with full functionality across all aspects of agricultural business management.
