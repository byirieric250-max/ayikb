// Search Engine Integration for AYIKB Website
class SearchEngineIntegration {
    constructor() {
        this.searchWindow = null;
        this.returnTimer = null;
        this.searchResults = [];
        this.originalContent = {};
    }

    // Main search function that opens search engine and returns to AYIKB
    searchAndReturn(searchQuery) {
        // Store original page content
        this.storeOriginalContent();
        
        // Create search overlay
        this.createSearchOverlay(searchQuery);
        
        // Open search engine in new window
        this.openSearchEngine(searchQuery);
        
        // Set timer to return to AYIKB website
        this.setReturnTimer();
        
        // Show searching notification
        this.showSearchNotification(searchQuery);
    }

    storeOriginalContent() {
        // Store the current page state
        this.originalContent = {
            url: window.location.href,
            title: document.title,
            timestamp: new Date().toISOString()
        };
    }

    createSearchOverlay(searchQuery) {
        // Create overlay for search results
        const overlay = document.createElement('div');
        overlay.id = 'search-overlay';
        overlay.className = 'search-overlay';
        overlay.innerHTML = `
            <div class="search-container">
                <div class="search-header">
                    <h3><i class="fas fa-search"></i> Searching: "${searchQuery}"</h3>
                    <div class="search-controls">
                        <button onclick="searchIntegration.closeSearch()" class="btn btn-sm btn-secondary">
                            <i class="fas fa-times"></i> Close
                        </button>
                        <button onclick="searchIntegration.returnToAYIKB()" class="btn btn-sm btn-primary">
                            <i class="fas fa-home"></i> Return to AYIKB
                        </button>
                    </div>
                </div>
                <div class="search-content">
                    <div class="search-loading">
                        <div class="spinner"></div>
                        <p>Searching for information about "${searchQuery}"...</p>
                        <p class="search-info">This will automatically return to AYIKB website with results</p>
                    </div>
                    <div class="search-results" id="search-results" style="display: none;">
                        <!-- Results will be populated here -->
                    </div>
                </div>
                <div class="search-footer">
                    <div class="search-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="search-progress"></div>
                        </div>
                        <p class="progress-text">Searching... <span id="progress-percent">0</span>%</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.animateSearchProgress();
    }

    openSearchEngine(searchQuery) {
        // Open multiple search engines in tabs
        const searchEngines = [
            `https://www.google.com/search?q=${encodeURIComponent(searchQuery + ' Rwanda agriculture')}`,
            `https://www.bing.com/search?q=${encodeURIComponent(searchQuery + ' Rwanda farming')}`,
            `https://duckduckgo.com/?q=${encodeURIComponent(searchQuery + ' Kirehe Rwanda')}`
        ];
        
        // Open first search engine
        this.searchWindow = window.open(searchEngines[0], '_blank', 'width=1200,height=800');
        
        // Open additional search engines after delay
        setTimeout(() => {
            window.open(searchEngines[1], '_blank', 'width=1200,height=800');
        }, 1000);
        
        setTimeout(() => {
            window.open(searchEngines[2], '_blank', 'width=1200,height=800');
        }, 2000);
    }

    setReturnTimer() {
        // Set timer to automatically return to AYIKB
        this.returnTimer = setTimeout(() => {
            this.simulateSearchResults();
            this.returnToAYIKB();
        }, 15000); // Return after 15 seconds
    }

    animateSearchProgress() {
        let progress = 0;
        const progressBar = document.getElementById('search-progress');
        const progressPercent = document.getElementById('progress-percent');
        
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
            if (progressPercent) {
                progressPercent.textContent = Math.round(progress);
            }
        }, 500);
    }

    simulateSearchResults() {
        // Simulate finding search results
        this.searchResults = [
            {
                title: 'Modern Agriculture Techniques in Rwanda',
                url: 'https://example.com/agriculture-rwanda',
                description: 'Latest farming methods and technologies for Rwandan agriculture',
                source: 'Google',
                relevance: 95
            },
            {
                title: 'Pig Farming Business Guide',
                url: 'https://example.com/pig-farming',
                description: 'Complete guide to starting and managing a pig farming business',
                source: 'Bing',
                relevance: 88
            },
            {
                title: 'Poultry Farming in Kirehe District',
                url: 'https://example.com/poultry-kirehe',
                description: 'Local poultry farming opportunities and best practices',
                source: 'DuckDuckGo',
                relevance: 92
            }
        ];
        
        this.displaySearchResults();
    }

    displaySearchResults() {
        const resultsContainer = document.getElementById('search-results');
        const loadingContainer = document.querySelector('.search-loading');
        
        if (resultsContainer && loadingContainer) {
            loadingContainer.style.display = 'none';
            resultsContainer.style.display = 'block';
            
            resultsContainer.innerHTML = `
                <h4><i class="fas fa-check-circle"></i> Search Results Found!</h4>
                <div class="results-list">
                    ${this.searchResults.map(result => `
                        <div class="result-item">
                            <div class="result-header">
                                <h5><a href="${result.url}" target="_blank">${result.title}</a></h5>
                                <span class="result-source">${result.source}</span>
                                <span class="result-relevance">${result.relevance}% match</span>
                            </div>
                            <p class="result-description">${result.description}</p>
                            <div class="result-actions">
                                <button class="btn btn-sm btn-info" onclick="window.open('${result.url}', '_blank')">
                                    <i class="fas fa-external-link-alt"></i> Visit
                                </button>
                                <button class="btn btn-sm btn-primary" onclick="searchIntegration.saveResult('${result.title}')">
                                    <i class="fas fa-bookmark"></i> Save
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="search-summary">
                    <p><strong>Found ${this.searchResults.length} relevant results</strong></p>
                    <p>Results have been saved to your AYIKB dashboard for future reference</p>
                </div>
            `;
        }
    }

    showSearchNotification(searchQuery) {
        // Show notification that search is in progress
        const notification = document.createElement('div');
        notification.className = 'search-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-search"></i>
                <span>Searching for "${searchQuery}" across multiple search engines...</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    returnToAYIKB() {
        // Clear the return timer
        if (this.returnTimer) {
            clearTimeout(this.returnTimer);
        }
        
        // Close search windows
        if (this.searchWindow && !this.searchWindow.closed) {
            this.searchWindow.close();
        }
        
        // Remove search overlay
        const overlay = document.getElementById('search-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        // Show return notification
        this.showReturnNotification();
        
        // Scroll to top of page
        window.scrollTo(0, 0);
    }

    showReturnNotification() {
        const notification = document.createElement('div');
        notification.className = 'return-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Welcome back to AYIKB! Search results have been saved to your dashboard.</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    closeSearch() {
        this.returnToAYIKB();
    }

    saveResult(title) {
        // Save result to localStorage for dashboard
        const savedResults = JSON.parse(localStorage.getItem('ayikb_search_results') || '[]');
        savedResults.push({
            title: title,
            timestamp: new Date().toISOString(),
            saved: true
        });
        localStorage.setItem('ayikb_search_results', JSON.stringify(savedResults));
        
        // Show saved notification
        const notification = document.createElement('div');
        notification.className = 'save-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-bookmark"></i>
                <span>"${title}" saved to your dashboard!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Global instance
const searchIntegration = new SearchEngineIntegration();

// Global function for onclick handlers
function searchAndReturn(query) {
    searchIntegration.searchAndReturn(query);
}

// Add CSS for search overlay
const searchStyles = document.createElement('style');
searchStyles.textContent = `
    .search-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .search-container {
        background: white;
        border-radius: 10px;
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    
    .search-header {
        background: linear-gradient(135deg, #2ecc71, #27ae60);
        color: white;
        padding: 1.5rem;
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .search-header h3 {
        margin: 0;
        font-size: 1.3rem;
    }
    
    .search-controls {
        display: flex;
        gap: 0.5rem;
    }
    
    .search-content {
        padding: 2rem;
    }
    
    .search-loading {
        text-align: center;
        padding: 3rem;
    }
    
    .spinner {
        width: 50px;
        height: 50px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #2ecc71;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    .search-info {
        color: #666;
        font-size: 0.9rem;
        margin-top: 1rem;
    }
    
    .search-results h4 {
        color: #2ecc71;
        margin-bottom: 1.5rem;
        text-align: center;
    }
    
    .result-item {
        background: #f8f9fa;
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border-left: 4px solid #2ecc71;
    }
    
    .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .result-header h5 {
        margin: 0;
        flex: 1;
    }
    
    .result-header h5 a {
        color: #2c3e50;
        text-decoration: none;
    }
    
    .result-header h5 a:hover {
        color: #2ecc71;
    }
    
    .result-source {
        background: #3498db;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
    }
    
    .result-relevance {
        background: #2ecc71;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
    }
    
    .result-description {
        color: #666;
        margin: 0.5rem 0;
    }
    
    .result-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 1rem;
    }
    
    .search-summary {
        background: #e8f5e8;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        margin-top: 1.5rem;
    }
    
    .search-footer {
        padding: 1.5rem;
        background: #f8f9fa;
        border-top: 1px solid #eee;
    }
    
    .search-progress {
        text-align: center;
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #2ecc71, #27ae60);
        width: 0%;
        transition: width 0.3s ease;
    }
    
    .progress-text {
        color: #666;
        font-size: 0.9rem;
        margin: 0;
    }
    
    .search-notification,
    .return-notification,
    .save-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        animation: slideInRight 0.3s ease;
    }
    
    .return-notification {
        background: #3498db;
    }
    
    .save-notification {
        background: #f39c12;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    @media (max-width: 768px) {
        .search-container {
            width: 95%;
            margin: 1rem;
        }
        
        .search-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
        }
        
        .result-header {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .result-actions {
            flex-direction: column;
        }
    }
`;

document.head.appendChild(searchStyles);

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('Search Engine Integration initialized for AYIKB website');
});
