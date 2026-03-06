# AYIKB Admin Management System Guide

## Overview

The AYIKB Admin Management System provides comprehensive control over all website content, data, and functionality. Admin users can update numbers, images, text content, and manage all aspects of the AYIKB website through a user-friendly interface.

## Access Requirements

### Admin Access
- **URL**: `admin_management.html`
- **Required Role**: Admin or CEO
- **Login Credentials**: 
  - Admin: `admin@ayikb.rw` / `admin123`
  - CEO: `ceo@ayikb.rw` / `ceo123`

### Navigation
- **Admin Link**: Available in main navigation for authorized users
- **Direct Access**: Go to `admin_management.html`
- **Role Detection**: System automatically detects user role and shows/hides admin features

## Admin Management Features

### 1. Homepage Management
**Location**: Admin Panel → "Ahabanza" tab

**What you can update**:
- **Hero Title**: Main headline on homepage
- **Hero Subtitle**: Main description text
- **Challenges Title**: Section heading for challenges
- **Contact Title**: Contact section heading

**How to update**:
1. Navigate to Admin Panel
2. Click "Ahabanza" tab
3. Edit text fields
4. Click "Kubika Ahabanza" button
5. Changes appear immediately on index page

### 2. Statistics Management
**Location**: Admin Panel → "Imibare" tab

**What you can update**:
- **Employee Count**: Total number of employees
- **Project Count**: Total number of projects
- **Training Count**: Total number of training programs
- **Partner Count**: Total number of partners
- **Student Count**: Total number of students
- **Performance Rate**: Overall performance percentage

**How to update**:
1. Go to "Imibare" tab
2. Enter new numbers in input fields
3. Click "Kubika Imibare" button
4. Stats update across all pages automatically

### 3. Projects Management
**Location**: Admin Panel → "Imishinga" tab

**What you can manage**:
- **Add New Projects**: Create new project entries
- **Edit Existing**: Modify project details
- **Delete Projects**: Remove completed projects
- **Project Details**: Name, code, budget, progress, dates

**How to manage**:
1. Click "Imishinga" tab
2. Use "Ohereza Umushinga" to add new projects
3. Edit existing project details in form fields
4. Click "Kubika Imishinga" to save changes
5. Projects update on projects page automatically

### 4. Training Management
**Location**: Admin Panel → "Amahugurwa" tab

**What you can manage**:
- **Training Programs**: Add/edit training sessions
- **Categories**: Agriculture, Livestock, Business
- **Scheduling**: Dates, times, locations
- **Attendance**: Track participant numbers
- **Trainer Information**: Assign trainers to programs

**How to manage**:
1. Navigate to "Amahugurwa" tab
2. Click "Ohereza Ahugurwa" for new programs
3. Fill in training details
4. Click "Kubika Amahugurwa" to save
5. Training page updates automatically

### 5. Partners Management
**Location**: Admin Panel → "Abafatanyabikorwa" tab

**What you can manage**:
- **Partner Information**: Add/edit partner details
- **Funding Details**: Track financial contributions
- **Project Associations**: Link partners to projects
- **Logo Management**: Upload partner logos

**How to manage**:
1. Go to "Abafatanyabikorwa" tab
2. Click "Ohereza Umufatanyabikorwa" for new partners
3. Enter partner details and funding info
4. Click "Kubika Abafatanyabikorwa" to save
5. Partners page updates automatically

### 6. Content Management
**Location**: Admin Panel → "Ibiganiro" tab

**What you can update**:
- **Page Titles**: Section headings across pages
- **Descriptions**: Text content for different sections
- **Labels**: Button text and form labels
- **Messages**: Error messages and notifications

**How to update**:
1. Click "Ibiganiro" tab
2. Edit text in form fields
3. Click "Kubika Ibiganiro" to save
4. Content updates across all pages

### 7. Image Management
**Location**: Admin Panel → "Amashusho" tab

**What you can update**:
- **Logo**: Main AYIKB logo
- **Hero Images**: Background images for sections
- **Project Images**: Visual content for projects
- **Training Images**: Training program visuals

**How to update**:
1. Navigate to "Amashusho" tab
2. Click on upload areas to select images
3. Images preview immediately
4. Click "Kubika Amashusho" to save
5. Images update across all pages

### 8. Contact Management
**Location**: Admin Panel → "Ibyangombwa" tab

**What you can update**:
- **Email**: Contact email address
- **Phone**: Contact phone number
- **Address**: Physical address
- **Social Media**: Facebook, Twitter, Instagram links

**How to update**:
1. Go to "Ibyangombwa" tab
2. Edit contact information fields
3. Click "Kubika Ibyangombwa" to save
4. Contact info updates across all pages

## Data Storage

### Local Storage
All admin data is stored in browser's localStorage:
- **ayikb_homepage**: Homepage content
- **ayikb_stats**: Statistics data
- **ayikb_projects**: Projects information
- **ayikb_training**: Training programs
- **ayikb_partners**: Partner details
- **ayikb_content**: General content
- **ayikb_images**: Image URLs
- **ayikb_contact**: Contact information

### Data Persistence
- **Automatic Saving**: Changes save immediately
- **Cross-Page Updates**: Data loads on all pages
- **Session Persistence**: Data survives page refreshes
- **Browser Storage**: Data stored locally

## Page Integration

### Updated Files
The following pages have been created/updated with admin management:

1. **`admin_management.html`** - Main admin control panel
2. **`admin_data_loader.js`** - Dynamic data loading system
3. **`index.html`** - Updated with admin data loader
4. **`dashboard_updated.html`** - Enhanced dashboard with admin data
5. **`projects_updated.html`** - Projects page with admin management
6. **`training_updated.html`** - Training page with admin management
7. **`partners_updated.html`** - Partners page with admin management

### Original Files
Original files remain unchanged:
- `projects.html` - Original projects page
- `training.html` - Original training page
- `partners.html` - Original partners page

## Dynamic Features

### Real-Time Updates
- **Instant Changes**: Updates appear immediately
- **No Page Refresh**: Changes apply without reload
- **Cross-Page Sync**: Data updates across all pages
- **Live Statistics**: Numbers update in real-time

### Responsive Design
- **Mobile Friendly**: Admin panel works on all devices
- **Touch Interface**: Optimized for mobile interaction
- **Adaptive Layout**: Adjusts to screen size
- **Accessible**: Keyboard navigation supported

### User Experience
- **Visual Feedback**: Success messages confirm changes
- **Error Handling**: Validation prevents data loss
- **Intuitive Interface**: Clear labeling and organization
- **Quick Actions**: Efficient workflow for common tasks

## Security Features

### Role-Based Access
- **Admin Only**: Only admin/CEO can access
- **Role Detection**: Automatic permission checking
- **Secure Routes**: Admin pages protected
- **Session Management**: Login state tracked

### Data Validation
- **Input Validation**: Prevents invalid data
- **Type Checking**: Ensures correct data types
- **Range Validation**: Numbers within acceptable ranges
- **Format Validation**: Email and URL format checking

## Best Practices

### Regular Updates
1. **Update Statistics**: Keep numbers current
2. **Refresh Content**: Update text regularly
3. **Maintain Images**: Keep visuals fresh
4. **Review Data**: Ensure accuracy

### Content Management
1. **Consistent Branding**: Maintain visual identity
2. **Quality Content**: Ensure professional presentation
3. **Regular Backups**: Export important data
4. **Version Control**: Track major changes

### User Management
1. **Monitor Access**: Review admin usage
2. **Update Credentials**: Change passwords regularly
3. **Role Management**: Assign appropriate permissions
4. **Activity Logging**: Track admin actions

## Troubleshooting

### Common Issues

**Changes Not Appearing**
- Clear browser cache
- Check localStorage quota
- Verify admin login status
- Refresh the page

**Data Not Saving**
- Check browser localStorage enabled
- Verify form validation
- Check for JavaScript errors
- Try different browser

**Images Not Loading**
- Verify image URLs are valid
- Check file size limits
- Ensure proper image formats
- Test image accessibility

### Support
For technical support:
1. Check browser console for errors
2. Verify all files are uploaded
3. Test with different browsers
4. Contact system administrator

## Future Enhancements

### Planned Features
- **Database Integration**: Server-side data storage
- **Multi-User Support**: Multiple admin accounts
- **Advanced Analytics**: Detailed reporting
- **API Integration**: External system connections
- **Mobile App**: Native admin application

### Scalability
- **Cloud Storage**: Remote data backup
- **Load Balancing**: Performance optimization
- **Caching**: Faster data retrieval
- **Security Enhancements**: Advanced protection

## Conclusion

The AYIKB Admin Management System provides comprehensive control over all website content and functionality. With intuitive interfaces, real-time updates, and robust security features, administrators can efficiently manage the entire AYIKB digital presence.

Regular use of the admin system ensures that all website content remains current, accurate, and engaging for visitors and stakeholders.
