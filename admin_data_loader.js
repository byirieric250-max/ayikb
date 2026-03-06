// Admin Data Loader - Dynamically loads admin-updated data across all pages
class AYIKBAdminDataLoader {
    constructor() {
        this.initializeData();
        this.loadAllData();
    }

    initializeData() {
        // Default data if nothing is saved
        this.defaultData = {
            homepage: {
                heroTitle: "AgriYouth Innovation Kirehe Business",
                heroSubtitle: "Iteka ry'urubyirugo ryiza mu buhinzi n'ubworozi",
                challengesTitle: "Imbogamizi Zihari",
                contactTitle: "Twandikire"
            },
            stats: {
                employeeCount: 15,
                projectCount: 4,
                trainingCount: 4,
                partnerCount: 4,
                studentCount: 115,
                performanceRate: 95
            },
            projects: [
                {
                    name: "Phase 1: Ubuhinzi",
                    code: "AGR-001",
                    budget: 1000000,
                    progress: 75,
                    startDate: "2024-01-01",
                    endDate: "2024-12-31",
                    description: "Gutera ibigori na ibirayi",
                    image: "https://via.placeholder.com/400x300/28a745/ffffff?text=Ubuhinzi"
                },
                {
                    name: "Phase 2: Ubworozi bw'Ingurube",
                    code: "LIV-001",
                    budget: 800000,
                    progress: 40,
                    startDate: "2024-06-01",
                    endDate: "2025-05-31",
                    description: "Gutangira ubworozi bw'ingurube",
                    image: "https://via.placeholder.com/400x300/17a2b8/ffffff?text=Ingurube"
                },
                {
                    name: "Phase 3: Ubworozi bw'Inkoko",
                    code: "LIV-002",
                    budget: 1000000,
                    progress: 20,
                    startDate: "2024-09-01",
                    endDate: "2025-08-31",
                    description: "Gutangira ubworozi bw'inkoko",
                    image: "https://via.placeholder.com/400x300/ffc107/000000?text=Inkoko"
                },
                {
                    name: "Amahugurwa yo ku Rubyirugo",
                    code: "TRN-001",
                    budget: 500000,
                    progress: 100,
                    startDate: "2024-01-15",
                    endDate: "2024-12-31",
                    description: "Gutanga amahugurwa ku rubyirugo",
                    image: "https://via.placeholder.com/400x300/6f42c1/ffffff?text=Amahugurwa"
                }
            ],
            training: [
                {
                    name: "Uburyo bwo guhinga bwiza",
                    category: "agriculture",
                    date: "2024-04-20",
                    time: "09:00 - 17:00",
                    location: "AYIKB Office, Nyagahama",
                    attendees: "30/50",
                    trainer: "MINAGRI Expert",
                    status: "upcoming",
                    description: "Amahugurwa ajyanye n'uburyo bwo guhinga bwiza, gukoresha ifumbire, no kurinda ibyorezi.",
                    image: "https://via.placeholder.com/300x200/28a745/ffffff?text=Ubuhinzi"
                },
                {
                    name: "Ubworozi bw'Ingurube",
                    category: "livestock",
                    date: "2024-03-15",
                    time: "08:00 - 16:00",
                    location: "AYIKB Farm",
                    attendees: "25/25",
                    trainer: "RAB Veterinarian",
                    status: "ongoing",
                    description: "Amahugurwa ajyanye n'ubworozi bw'ingurube, kurinda indwara, no kubungabunga amafunguro.",
                    image: "https://via.placeholder.com/300x200/17a2b8/ffffff?text=Ingurube"
                },
                {
                    name: "Ubucuruzi bw'Umusaruro",
                    category: "business",
                    date: "2024-02-10",
                    time: "09:00 - 16:00",
                    location: "AYIKB Office",
                    attendees: "40/40",
                    trainer: "Business Expert",
                    status: "completed",
                    description: "Amahugurwa ajyanye n'ubucuruzi bw'umusaruro, guhanga amasoko, no kubona abakiriya.",
                    image: "https://via.placeholder.com/300x200/ffc107/000000?text=Ubucuruzi"
                },
                {
                    name: "Tekinike mu Buhinzi",
                    category: "agriculture",
                    date: "2024-05-15",
                    time: "10:00 - 15:00",
                    location: "AYIKB Office",
                    attendees: "20/30",
                    trainer: "Tech Expert",
                    status: "upcoming",
                    description: "Amahugurwa ajyanye n'ikoreshwa ry'ikoranabuhanga mu buhinzi.",
                    image: "https://via.placeholder.com/300x200/6f42c1/ffffff?text=Tekinike"
                }
            ],
            partners: [
                {
                    name: "Akarere ka Kirehe",
                    funding: 2000000,
                    projects: 5,
                    logo: "https://via.placeholder.com/100x100/3498db/ffffff?text=Kirehe",
                    description: "Inkunga y'akarere mu mikurire y'abaturage"
                },
                {
                    name: "MINAGRI",
                    funding: 1500000,
                    projects: 3,
                    logo: "https://via.placeholder.com/100x100/28a745/ffffff?text=MINAGRI",
                    description: "Minisiteri w'Ubuhinzi n'Ubworozi"
                },
                {
                    name: "BDF",
                    funding: 1000000,
                    projects: 2,
                    logo: "https://via.placeholder.com/100x100/ffc107/000000?text=BDF",
                    description: "Banki y'Iterambere ry'U Rwanda"
                },
                {
                    name: "RYAF",
                    funding: 500000,
                    projects: 1,
                    logo: "https://via.placeholder.com/100x100/6f42c1/ffffff?text=RYAF",
                    description: "Rwanda Youth Agripreneurship Forum"
                }
            ],
            content: {
                projectsTitle: "Imishinga Yacu",
                trainingTitle: "Amahugurwa Tugezeho",
                partnersTitle: "Abafatanyabikorwa Bacu",
                projectsDescription: "Reba imishinga dufatanye n'urubyirugo mu gukurikanya ubuhinzi n'ubworozi",
                trainingDescription: "Amahugurwa adufasha gukurikanya ubumenyi bw'urubyirugo",
                partnersDescription: "Abafatanyabikorwa bacu badufasha mu iterambere ry'ikigo"
            },
            images: {
                logo: "https://via.placeholder.com/100x100/3498db/ffffff?text=AYIKB",
                hero: "https://via.placeholder.com/1200x400/28a745/ffffff?text=AYIKB+Hero",
                projects: "https://via.placeholder.com/400x300/17a2b8/ffffff?text=Projects",
                training: "https://via.placeholder.com/400x300/ffc107/000000?text=Training"
            },
            contact: {
                email: "info@ayikb.rw",
                phone: "+250788123456",
                address: "Karere ka Kirehe, Umurenge wa Nyamugari, Akagari ka Nyamugari, Umudugudu wa Nyagahama",
                facebook: "https://facebook.com/ayikb",
                twitter: "https://twitter.com/ayikb",
                instagram: "https://instagram.com/ayikb"
            }
        };
    }

    updateStats() {
        const statElements = document.querySelectorAll('.stat h3');
        if (statElements.length >= 4) {
            statElements[0].textContent = this.currentData.stats.employeeCount;
            statElements[1].textContent = this.currentData.stats.projectCount;
            statElements[2].textContent = this.currentData.stats.trainingCount;
            statElements[3].textContent = this.currentData.stats.partnerCount;
        }

        // Update dashboard stats
        const dashboardStats = document.querySelectorAll('.stat-content h3');
        if (dashboardStats.length >= 4) {
            dashboardStats[0].textContent = this.currentData.stats.employeeCount;
            dashboardStats[1].textContent = this.currentData.stats.projectCount;
            dashboardStats[2].textContent = this.currentData.stats.trainingCount;
            dashboardStats[3].textContent = this.currentData.stats.partnerCount;
            dashboardStats[3].textContent = this.stats.partnerCount;
        }
    }

    updateProjects() {
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = '';
            this.projects.forEach(project => {
                const projectCard = this.createProjectCard(project);
                projectsGrid.appendChild(projectCard);
            });
        }
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-image">
                <img src="${project.image}" alt="${project.name}">
                <div class="project-overlay">
                    <button class="btn btn-primary" onclick="viewProjectDetails('${project.code}')">
                        <i class="fas fa-eye"></i> Reba
                    </button>
                </div>
            </div>
            <div class="project-content">
                <h3>${project.name}</h3>
                <p>${project.description}</p>
                <div class="project-meta">
                    <span><i class="fas fa-calendar"></i> ${project.startDate}</span>
                    <span><i class="fas fa-money-bill"></i> ${this.formatNumber(project.budget)} Frw</span>
                </div>
                <div class="project-progress">
                    <div class="progress-bar">
                        <div class="progress" style="width: ${project.progress}%"></div>
                    </div>
                    <span>${project.progress}% Yararangiye</span>
                </div>
            </div>
        `;
        return card;
    }

    updateTraining() {
        const trainingGrid = document.querySelector('.training-grid');
        if (trainingGrid) {
            trainingGrid.innerHTML = '';
            this.training.forEach(training => {
                const trainingCard = this.createTrainingCard(training);
                trainingGrid.appendChild(trainingCard);
            });
        }
    }

    createTrainingCard(training) {
        const card = document.createElement('div');
        card.className = `training-card ${training.status}`;
        card.setAttribute('data-status', training.status);
        card.setAttribute('data-category', training.category);
        
        const statusClass = {
            'upcoming': 'Iza kuba',
            'ongoing': 'Iri kugenda',
            'completed': 'Byarangiye'
        }[training.status] || 'Iza kuba';

        const categoryIcon = {
            'agriculture': 'fa-seedling',
            'livestock': 'fa-pig',
            'business': 'fa-briefcase'
        }[training.category] || 'fa-graduation-cap';

        card.innerHTML = `
            <div class="training-header">
                <div class="training-icon">
                    <i class="fas ${categoryIcon}"></i>
                </div>
                <div class="training-info">
                    <h3>${training.name}</h3>
                    <span class="training-status ${training.status}">${statusClass}</span>
                </div>
            </div>
            <div class="training-details">
                <div class="detail-row">
                    <span class="label"><i class="fas fa-calendar"></i> Itariki:</span>
                    <span class="value">${training.date}</span>
                </div>
                <div class="detail-row">
                    <span class="label"><i class="fas fa-clock"></i> Igihe:</span>
                    <span class="value">${training.time}</span>
                </div>
                <div class="detail-row">
                    <span class="label"><i class="fas fa-map-marker-alt"></i> Ahantu:</span>
                    <span class="value">${training.location}</span>
                </div>
                <div class="detail-row">
                    <span class="label"><i class="fas fa-users"></i> Abitabiriye:</span>
                    <span class="value">${training.attendees}</span>
                </div>
            </div>
            <div class="training-description">
                <p>${training.description}</p>
            </div>
            <div class="training-trainer">
                <span class="label"><i class="fas fa-chalkboard-teacher"></i> Inshingano:</span>
                <span class="value">${training.trainer}</span>
            </div>
            <div class="training-actions">
                <button class="btn btn-sm btn-primary" onclick="registerTraining('${training.name}')">
                    <i class="fas fa-user-plus"></i> Iyandikishe
                </button>
                <button class="btn btn-sm btn-secondary" onclick="viewTrainingDetails('${training.name}')">
                    <i class="fas fa-eye"></i> Reba
                </button>
            </div>
        `;
        return card;
    }

    updatePartners() {
        const partnersGrid = document.querySelector('.partners-grid');
        if (partnersGrid) {
            partnersGrid.innerHTML = '';
            this.partners.forEach(partner => {
                const partnerCard = this.createPartnerCard(partner);
                partnersGrid.appendChild(partnerCard);
            });
        }
    }

    createPartnerCard(partner) {
        const card = document.createElement('div');
        card.className = 'partner-card';
        card.innerHTML = `
            <div class="partner-logo">
                <img src="${partner.logo}" alt="${partner.name}">
            </div>
            <div class="partner-info">
                <h3>${partner.name}</h3>
                <p>${partner.description}</p>
                <div class="partner-stats">
                    <span><i class="fas fa-money-bill"></i> ${this.formatNumber(partner.funding)} Frw</span>
                    <span><i class="fas fa-project-diagram"></i> ${partner.projects} Imishinga</span>
                </div>
            </div>
        `;
        return card;
    }

    updateContent() {
        // Update page titles
        const projectsTitle = document.querySelector('.projects-header h2, .section-header h2');
        const trainingTitle = document.querySelector('.training-header h2, .section-header h2');
        const partnersTitle = document.querySelector('.partners-header h2, .section-header h2');

        if (projectsTitle && projectsTitle.textContent.includes('Imishinga')) {
            projectsTitle.textContent = this.content.projectsTitle;
        }
        if (trainingTitle && trainingTitle.textContent.includes('Amahugurwa')) {
            trainingTitle.textContent = this.content.trainingTitle;
        }
        if (partnersTitle && partnersTitle.textContent.includes('Abafatanyabikorwa')) {
            partnersTitle.textContent = this.content.partnersTitle;
        }
    }

    updateImages() {
        const logo = document.querySelector('.logo img, .navbar .logo img');
        const heroImage = document.querySelector('.hero img, .hero-image img');
        
        if (logo) logo.src = this.images.logo;
        if (heroImage) heroImage.src = this.images.hero;
    }

    updateContact() {
        const emailElements = document.querySelectorAll('.contact-email, [href^="mailto:"]');
        const phoneElements = document.querySelectorAll('.contact-phone, [href^="tel:"]');
        const addressElements = document.querySelectorAll('.contact-address');

        emailElements.forEach(el => {
            if (el.tagName === 'A') {
                el.href = `mailto:${this.contact.email}`;
            } else {
                el.textContent = this.contact.email;
            }
        });

        phoneElements.forEach(el => {
            if (el.tagName === 'A') {
                el.href = `tel:${this.contact.phone}`;
            } else {
                el.textContent = this.contact.phone;
            }
        });

        addressElements.forEach(el => {
            el.textContent = this.contact.address;
        });
    }

    formatNumber(num) {
        return new Intl.NumberFormat('rw-RW').format(num);
    }

    // Initialize all updates
    initialize() {
        this.updateHeroSection();
        this.updateStats();
        this.updateProjects();
        this.updateTraining();
        this.updatePartners();
        this.updateContent();
        this.updateImages();
        this.updateContact();
    }
}

// Global functions for page interactions
function viewProjectDetails(projectCode) {
    alert(`Reba ibisobanuro by'umushinga ${projectCode} - Iyi feature izaba ikora vuba!`);
}

function registerTraining(trainingName) {
    alert(`Iyandikishe ku ${trainingName} - Iyi feature izaba ikora vuba!`);
}

function viewTrainingDetails(trainingName) {
    alert(`Reba ibisobanuro by'ahugurwa ${trainingName} - Iyi feature izaba ikora vuba!`);
}

// Initialize on all pages
document.addEventListener('DOMContentLoaded', function() {
    const adminData = new AYIKBAdminDataLoader();
    adminData.initialize();
});

// Export for use in other scripts
window.AYIKBAdminDataLoader = AYIKBAdminDataLoader;
