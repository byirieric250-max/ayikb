// AYIKB Notification Service - Email and SMS confirmation system
class AYIKBNotificationService {
    constructor() {
        this.emailService = new EmailService();
        this.smsService = new SMSService();
        this.templates = new NotificationTemplates();
        this.settings = this.loadNotificationSettings();
        this.initializeEventListeners();
    }

    loadNotificationSettings() {
        const saved = localStorage.getItem('ayikb_notifications');
        return saved ? JSON.parse(saved) : {
            email: true,
            sms: true,
            reports: false,
            registrations: true
        };
    }

    initializeEventListeners() {
        // Listen for user registration events
        document.addEventListener('userRegistered', (event) => {
            this.handleUserRegistration(event.detail);
        });

        // Listen for project updates
        document.addEventListener('projectUpdated', (event) => {
            this.handleProjectUpdate(event.detail);
        });

        // Listen for training events
        document.addEventListener('trainingEvent', (event) => {
            this.handleTrainingEvent(event.detail);
        });

        // Listen for admin activities
        document.addEventListener('adminActivity', (event) => {
            this.handleAdminActivity(event.detail);
        });
    }

    async handleUserRegistration(userData) {
        if (!this.settings.registrations) return;

        const emailSubject = this.templates.registrationEmail.subject(userData);
        const emailBody = this.templates.registrationEmail.body(userData);
        const smsMessage = this.templates.registrationSMS(userData);

        const notifications = [];

        // Send email confirmation
        if (this.settings.email && userData.email) {
            notifications.push(
                this.emailService.sendEmail(userData.email, emailSubject, emailBody)
            );
        }

        // Send SMS confirmation
        if (this.settings.sms && userData.phone) {
            notifications.push(
                this.smsService.sendSMS(userData.phone, smsMessage)
            );
        }

        // Send notification to admin
        if (this.settings.email) {
            const adminEmail = 'admin@ayikb.rw';
            const adminSubject = this.templates.adminRegistration.subject(userData);
            const adminBody = this.templates.adminRegistration.body(userData);
            
            notifications.push(
                this.emailService.sendEmail(adminEmail, adminSubject, adminBody)
            );
        }

        try {
            await Promise.all(notifications);
            this.logNotification('userRegistration', userData, 'success');
        } catch (error) {
            this.logNotification('userRegistration', userData, 'error', error);
        }
    }

    async handleProjectUpdate(projectData) {
        if (!this.settings.email) return;

        const subject = this.templates.projectUpdate.subject(projectData);
        const body = this.templates.projectUpdate.body(projectData);

        try {
            await this.emailService.sendEmail('admin@ayikb.rw', subject, body);
            this.logNotification('projectUpdate', projectData, 'success');
        } catch (error) {
            this.logNotification('projectUpdate', projectData, 'error', error);
        }
    }

    async handleTrainingEvent(trainingData) {
        if (!this.settings.email) return;

        const subject = this.templates.trainingEvent.subject(trainingData);
        const body = this.templates.trainingEvent.body(trainingData);

        try {
            await this.emailService.sendEmail('admin@ayikb.rw', subject, body);
            this.logNotification('trainingEvent', trainingData, 'success');
        } catch (error) {
            this.logNotification('trainingEvent', trainingData, 'error', error);
        }
    }

    async handleAdminActivity(activityData) {
        if (!this.settings.email) return;

        const subject = this.templates.adminActivity.subject(activityData);
        const body = this.templates.adminActivity.body(activityData);

        try {
            await this.emailService.sendEmail('admin@ayikb.rw', subject, body);
            this.logNotification('adminActivity', activityData, 'success');
        } catch (error) {
            this.logNotification('adminActivity', activityData, 'error', error);
        }
    }

    async sendCustomNotification(type, recipient, subject, message) {
        try {
            if (type === 'email' && this.settings.email) {
                await this.emailService.sendEmail(recipient, subject, message);
            } else if (type === 'sms' && this.settings.sms) {
                await this.smsService.sendSMS(recipient, message);
            }
            this.logNotification('custom', { type, recipient }, 'success');
        } catch (error) {
            this.logNotification('custom', { type, recipient }, 'error', error);
        }
    }

    logNotification(type, data, status, error = null) {
        const log = {
            timestamp: new Date().toISOString(),
            type,
            data,
            status,
            error: error ? error.message : null
        };

        const logs = JSON.parse(localStorage.getItem('ayikb_notification_logs') || '[]');
        logs.push(log);

        // Keep only last 100 logs
        if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
        }

        localStorage.setItem('ayikb_notification_logs', JSON.stringify(logs));
    }

    getNotificationLogs() {
        return JSON.parse(localStorage.getItem('ayikb_notification_logs') || '[]');
    }

    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('ayikb_notifications', JSON.stringify(this.settings));
    }
}

// Email Service
class EmailService {
    constructor() {
        this.emailConfig = {
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'ayikb.notifications@gmail.com',
                pass: 'ayikb2024secure'
            }
        };
    }

    async sendEmail(to, subject, body) {
        // Simulate email sending (in production, use actual email service)
        console.log('Sending Email:', { to, subject, body });
        
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) { // 90% success rate
                    resolve({
                        success: true,
                        messageId: 'email_' + Date.now(),
                        timestamp: new Date().toISOString()
                    });
                } else {
                    reject(new Error('Email service temporarily unavailable'));
                }
            }, 1000);
        });
    }

    async sendBulkEmail(recipients, subject, body) {
        const results = [];
        
        for (const recipient of recipients) {
            try {
                const result = await this.sendEmail(recipient, subject, body);
                results.push({ recipient, success: true, result });
            } catch (error) {
                results.push({ recipient, success: false, error: error.message });
            }
        }

        return results;
    }
}

// SMS Service
class SMSService {
    constructor() {
        this.smsConfig = {
            provider: 'twilio',
            accountSid: 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
            authToken: 'your_auth_token',
            fromNumber: '+250788123456'
        };
    }

    async sendSMS(to, message) {
        // Simulate SMS sending (in production, use actual SMS service)
        console.log('Sending SMS:', { to, message });
        
        // Format phone number
        const formattedPhone = this.formatPhoneNumber(to);
        
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.05) { // 95% success rate
                    resolve({
                        success: true,
                        messageId: 'sms_' + Date.now(),
                        timestamp: new Date().toISOString(),
                        phoneNumber: formattedPhone
                    });
                } else {
                    reject(new Error('SMS service temporarily unavailable'));
                }
            }, 800);
        });
    }

    async sendBulkSMS(recipients, message) {
        const results = [];
        
        for (const recipient of recipients) {
            try {
                const result = await this.sendSMS(recipient, message);
                results.push({ recipient, success: true, result });
            } catch (error) {
                results.push({ recipient, success: false, error: error.message });
            }
        }

        return results;
    }

    formatPhoneNumber(phone) {
        // Remove all non-digit characters
        let cleaned = phone.replace(/\D/g, '');
        
        // Add country code if missing
        if (cleaned.length === 9 && cleaned.startsWith('7')) {
            cleaned = '250' + cleaned;
        } else if (cleaned.length === 10 && cleaned.startsWith('07')) {
            cleaned = '25' + cleaned;
        }
        
        return '+' + cleaned;
    }
}

// Notification Templates
class NotificationTemplates {
    registrationEmail() {
        return {
            subject: (userData) => `Murakaza neza ku AYIKB - ${userData.fullName}`,
            body: (userData) => `
Mwiriwe ${userData.fullName},

Murakaza neza ku mbuga nkoranyambaga ya AYIKB (AgriYouth Innovation Kirehe Business)!

Ibyakozwe:
- Iyiandikishe: ${new Date().toLocaleDateString('rw-RW')}
- Email: ${userData.email}
- Telefone: ${userData.phone}
- Urwego: ${userData.role}

Akonti yawe yashizweho neza. Urashobora:
- Kwinjira muriyi konti ukoresheje email na ijambo banga ryawe
- Guhindura amakuru y'umuntu wawe
- Kureba ibikorwa by'Ayikb
- Guhera no gukurikanya imishinga n'amahugurwa

Ijambo banga ryawe: ${userData.password}

Niba ufite ibibazo, twandikire ku email: info@ayikb.rw
Ciga terefone: +250788123456

Murakoze guhitamo AYIKB!
Murabeho!

--
AYIKB Team
AgriYouth Innovation Kirehe Business
Email: info@ayikb.rw
Telefone: +250788123456
Website: www.ayikb.rw
            `.trim()
        };
    }

    registrationSMS() {
        return (userData) => `
Murakaza neza ${userData.fullName} ku AYIKB! Konti yawe yashizweho neza. Ijambo banga: ${userData.password}. Winjira kuri www.ayikb.rw. Murakoze!
        `.trim();
    }

    adminRegistration() {
        return {
            subject: (userData) => `Umukozi w'andikishije - ${userData.fullName}`,
            body: (userData) => `
Kumenyesha:

Umukozi mushya w'andikishije muri sisitemu ya AYIKB:

Amakuru y'umukozi:
- Izina ry'umwimerere: ${userData.fullName}
- Email: ${userData.email}
- Telefone: ${userData.phone}
            Urwego: ${userData.role}
- Iyiandikishe: ${new Date().toLocaleDateString('rw-RW')}
- IP Address: ${userData.ipAddress || 'N/A'}

Nyuma yo kwinjira, ushobora:
- Kureba ibiranga umukozi
- Guhindura urwego rw'umukozi
- Guhindura amakuru y'umukozi

Winjira muri sisitemu yo kureba ibisobanuro bya tekiniki.

--
AYIKB Admin System
            `.trim()
        };
    }

    projectUpdate() {
        return {
            subject: (projectData) => `Ibisubizo by'umushinga - ${projectData.name}`,
            body: (projectData) => `
Kumenyesha:

Ibisubizo by'umushinga wahinduwe:

Umushinga: ${projectData.name}
Code: ${projectData.code}
Imikorire: ${projectData.progress}%
Budget: ${projectData.budget} Frw
Itariki yo guhindura: ${new Date().toLocaleDateString('rw-RW')}

${projectData.description}

Winjira muri dashboard yo kureba ibisobanuro bya tekiniki.

--
AYIKB Project Management
            `.trim()
        };
    }

    trainingEvent() {
        return {
            subject: (trainingData) => `Ibikorwa by'ahugurwa - ${trainingData.name}`,
            body: (trainingData) => `
Kumenyesha:

Ibikorwa by'ahugurwa byabaye:

Ahugurwa: ${trainingData.name}
Category: ${trainingData.category}
Itariki: ${trainingData.date}
Imimerere: ${trainingData.status}
Abitabiriye: ${trainingData.attendees}
Inshingano: ${trainingData.trainer}

${trainingData.description}

Winjira muri dashboard yo kureba ibisobanuro bya tekiniki.

--
AYIKB Training System
            `.trim()
        };
    }

    adminActivity() {
        return {
            subject: (activityData) => `Ibikorwa bya admin - ${activityData.action}`,
            body: (activityData) => `
Kumenyesha:

Ikiganiro cy'ibikorwa bya admin:

Umukozi: ${activityData.userName}
Igikorwa: ${activityData.action}
Itariki: ${new Date().toLocaleDateString('rw-RW')}
Igihe: ${new Date().toLocaleTimeString('rw-RW')}
IP Address: ${activityData.ipAddress || 'N/A'}

Ibisobanuro: ${activityData.description}

Winjira muri dashboard yo kureba ibisobanuro bya tekiniki.

--
AYIKB Admin System
            `.trim()
        };
    }
}

// Initialize notification service
window.AYIKBNotificationService = AYIKBNotificationService;

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.notificationService = new AYIKBNotificationService();
    console.log('AYIKB Notification Service initialized');
});

// Utility functions for triggering notifications
window.triggerUserRegistration = (userData) => {
    const event = new CustomEvent('userRegistered', { detail: userData });
    document.dispatchEvent(event);
};

window.triggerProjectUpdate = (projectData) => {
    const event = new CustomEvent('projectUpdated', { detail: projectData });
    document.dispatchEvent(event);
};

window.triggerTrainingEvent = (trainingData) => {
    const event = new CustomEvent('trainingEvent', { detail: trainingData });
    document.dispatchEvent(event);
};

window.triggerAdminActivity = (activityData) => {
    const event = new CustomEvent('adminActivity', { detail: activityData });
    document.dispatchEvent(event);
};
