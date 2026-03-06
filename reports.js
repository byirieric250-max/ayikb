// Reports & Analytics JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeReports();
});

function initializeReports() {
    setupReportTabs();
    initializeCharts();
    setupDateRangeSelector();
    setupExportFunctions();
    initializeKPIUpdates();
    setupReportFilters();
}

function setupReportTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const reportContents = document.querySelectorAll('.report-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            reportContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content
            const tabName = this.textContent.toLowerCase();
            const targetContent = document.getElementById(`${tabName}-report`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            
            // Update charts for the active tab
            updateTabCharts(tabName);
        });
    });
}

function initializeCharts() {
    // Revenue Overview Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue (Frw)',
                    data: [500000, 750000, 600000, 900000, 1200000, 1500000],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + ' Frw';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return (value / 1000000).toFixed(1) + 'M';
                            }
                        }
                    }
                }
            }
        });
    }

    // Project Progress Chart
    const projectCtx = document.getElementById('projectProgressChart');
    if (projectCtx) {
        new Chart(projectCtx, {
            type: 'doughnut',
            data: {
                labels: ['Phase 1: Ubuhinzi', 'Phase 2: Ubworozi', 'Phase 3: Ubworozi', 'Training'],
                datasets: [{
                    data: [75, 25, 10, 60],
                    backgroundColor: ['#2ecc71', '#3498db', '#e74c3c', '#f39c12'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }

    // Training Attendance Chart
    const trainingCtx = document.getElementById('trainingChart');
    if (trainingCtx) {
        new Chart(trainingCtx, {
            type: 'bar',
            data: {
                labels: ['Modern Farming', 'Business Mgmt', 'Livestock', 'Pest Control'],
                datasets: [{
                    label: 'Registered',
                    data: [30, 40, 25, 35],
                    backgroundColor: '#3498db'
                }, {
                    label: 'Completed',
                    data: [28, 38, 20, 0],
                    backgroundColor: '#2ecc71'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + context.parsed.y + ' participants';
                            }
                        }
                    }
                }
            }
        });
    }

    // Partner Contributions Chart
    const partnerCtx = document.getElementById('partnerChart');
    if (partnerCtx) {
        new Chart(partnerCtx, {
            type: 'pie',
            data: {
                labels: ['Kirehe District', 'MINAGRI', 'BDF', 'RYAF', 'NGOs'],
                datasets: [{
                    data: [2000000, 1500000, 1000000, 800000, 500000],
                    backgroundColor: ['#2ecc71', '#3498db', '#e74c3c', '#f39c12', '#9b59b6'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return context.label + ': ' + (value / 1000000).toFixed(1) + 'M Frw (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });
    }
}

function setupDateRangeSelector() {
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const updateButton = document.querySelector('.date-range-selector button');
    
    if (updateButton) {
        updateButton.addEventListener('click', function() {
            updateReports();
        });
    }
    
    // Set default date range
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    if (startDate) startDate.value = startOfYear.toISOString().split('T')[0];
    if (endDate) endDate.value = today.toISOString().split('T')[0];
}

function updateReports() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    // Show loading state
    showNotification('Updating reports...', 'info');
    
    // Simulate data update
    setTimeout(() => {
        updateChartData(startDate, endDate);
        updateSummaryCards();
        showNotification('Reports updated successfully!', 'success');
    }, 1000);
}

function updateChartData(startDate, endDate) {
    // Update all charts with new date range
    Chart.helpers.eachChart(function(chart) {
        if (chart.canvas.id.includes('Chart')) {
            // Generate new data based on date range
            const newData = generateDataForDateRange(startDate, endDate);
            chart.data.datasets[0].data = newData;
            chart.update();
        }
    });
}

function generateDataForDateRange(startDate, endDate) {
    // Generate sample data based on date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
    
    const data = [];
    for (let i = 0; i < Math.min(months, 12); i++) {
        data.push(Math.floor(Math.random() * 1000000) + 500000);
    }
    
    return data;
}

function updateSummaryCards() {
    const cards = document.querySelectorAll('.summary-card');
    cards.forEach(card => {
        const valueElement = card.querySelector('.card-value');
        const changeElement = card.querySelector('.card-change');
        
        if (valueElement && changeElement) {
            // Simulate value changes
            const currentValue = valueElement.textContent;
            const change = Math.floor(Math.random() * 20) - 10;
            
            // Update change indicator
            if (change > 0) {
                changeElement.className = 'card-change positive';
                changeElement.textContent = `+${change}% from last period`;
            } else if (change < 0) {
                changeElement.className = 'card-change negative';
                changeElement.textContent = `${change}% from last period`;
            }
        }
    });
}

function setupExportFunctions() {
    window.exportReport = function(format) {
        if (format === 'pdf') {
            exportToPDF();
        } else if (format === 'excel') {
            exportToExcel();
        }
    };
    
    window.printReport = function() {
        window.print();
    };
}

function exportToPDF() {
    showNotification('Generating PDF report...', 'info');
    
    setTimeout(() => {
        // Simulate PDF generation
        const reportData = collectReportData();
        const pdfContent = generatePDFContent(reportData);
        
        // Create download link
        const blob = new Blob([pdfContent], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AYIKB_Report_${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification('PDF report exported successfully!', 'success');
    }, 2000);
}

function exportToExcel() {
    showNotification('Generating Excel report...', 'info');
    
    setTimeout(() => {
        const reportData = collectReportData();
        const excelContent = generateExcelContent(reportData);
        
        // Create download link
        const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `AYIKB_Report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showNotification('Excel report exported successfully!', 'success');
    }, 2000);
}

function collectReportData() {
    const data = {
        timestamp: new Date().toISOString(),
        summary: collectSummaryData(),
        financial: collectFinancialData(),
        projects: collectProjectsData(),
        training: collectTrainingData(),
        partners: collectPartnersData()
    };
    
    return data;
}

function collectSummaryData() {
    const summaryCards = document.querySelectorAll('.summary-card');
    const summary = {};
    
    summaryCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        const value = card.querySelector('.card-value').textContent;
        summary[title] = value;
    });
    
    return summary;
}

function collectFinancialData() {
    const financialTable = document.querySelector('#financial-report .report-table');
    if (!financialTable) return [];
    
    const rows = financialTable.querySelectorAll('tbody tr');
    const data = [];
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 5) {
            data.push({
                category: cells[0].textContent,
                budget: cells[1].textContent,
                actual: cells[2].textContent,
                variance: cells[3].textContent,
                status: cells[4].textContent
            });
        }
    });
    
    return data;
}

function collectProjectsData() {
    const projectsTable = document.querySelector('#projects-report .report-table');
    if (!projectsTable) return [];
    
    const rows = projectsTable.querySelectorAll('tbody tr');
    const data = [];
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 6) {
            data.push({
                name: cells[0].textContent,
                startDate: cells[1].textContent,
                endDate: cells[2].textContent,
                progress: cells[3].textContent,
                status: cells[4].textContent,
                teamSize: cells[5].textContent
            });
        }
    });
    
    return data;
}

function collectTrainingData() {
    const trainingTable = document.querySelector('#training-report .report-table');
    if (!trainingTable) return [];
    
    const rows = trainingTable.querySelectorAll('tbody tr');
    const data = [];
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 6) {
            data.push({
                name: cells[0].textContent,
                date: cells[1].textContent,
                duration: cells[2].textContent,
                registered: cells[3].textContent,
                completed: cells[4].textContent,
                successRate: cells[5].textContent
            });
        }
    });
    
    return data;
}

function collectPartnersData() {
    const partnersTable = document.querySelector('#partners-report .report-table');
    if (!partnersTable) return [];
    
    const rows = partnersTable.querySelectorAll('tbody tr');
    const data = [];
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 6) {
            data.push({
                name: cells[0].textContent,
                type: cells[1].textContent,
                partnershipDate: cells[2].textContent,
                projects: cells[3].textContent,
                contribution: cells[4].textContent,
                status: cells[5].textContent
            });
        }
    });
    
    return data;
}

function generatePDFContent(data) {
    // This would typically use a PDF library like jsPDF
    // For now, return a simple text representation
    return `AYIKB Report - ${new Date().toLocaleDateString()}\n\n` +
           `Summary:\n${JSON.stringify(data.summary, null, 2)}\n\n` +
           `Financial:\n${JSON.stringify(data.financial, null, 2)}\n\n` +
           `Projects:\n${JSON.stringify(data.projects, null, 2)}\n\n` +
           `Training:\n${JSON.stringify(data.training, null, 2)}\n\n` +
           `Partners:\n${JSON.stringify(data.partners, null, 2)}`;
}

function generateExcelContent(data) {
    // Generate CSV content for Excel
    let csvContent = 'AYIKB Report - ' + new Date().toLocaleDateString() + '\n\n';
    
    // Add summary data
    csvContent += 'Summary\n';
    csvContent += 'Metric,Value\n';
    Object.keys(data.summary).forEach(key => {
        csvContent += `"${key}","${data.summary[key]}"\n`;
    });
    
    // Add financial data
    csvContent += '\nFinancial\n';
    csvContent += 'Category,Budget,Actual,Variance,Status\n';
    data.financial.forEach(item => {
        csvContent += `"${item.category}","${item.budget}","${item.actual}","${item.variance}","${item.status}"\n`;
    });
    
    return csvContent;
}

function initializeKPIUpdates() {
    // Update KPI values periodically
    setInterval(() => {
        updateKPIValues();
    }, 30000); // Update every 30 seconds
}

function updateKPIValues() {
    const kpiCards = document.querySelectorAll('.kpi-card');
    
    kpiCards.forEach(card => {
        const valueElement = card.querySelector('.kpi-value');
        const trendElement = card.querySelector('.kpi-trend');
        
        if (valueElement && trendElement) {
            // Simulate KPI changes
            const currentValue = parseFloat(valueElement.textContent.replace('%', ''));
            const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
            const newValue = Math.max(0, currentValue + change);
            
            valueElement.textContent = newValue.toFixed(1) + (valueElement.textContent.includes('%') ? '%' : '');
            
            // Update trend
            if (change > 0) {
                trendElement.className = 'kpi-trend positive';
                trendElement.innerHTML = `↑ ${Math.abs(change).toFixed(1)}% from last period`;
            } else if (change < 0) {
                trendElement.className = 'kpi-trend negative';
                trendElement.innerHTML = `↓ ${Math.abs(change).toFixed(1)}% from last period`;
            }
        }
    });
}

function setupReportFilters() {
    // Add filter functionality for reports
    const filterButtons = document.querySelectorAll('.report-filters button');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.dataset.filter;
            applyReportFilter(filterType);
        });
    });
}

function applyReportFilter(filterType) {
    showNotification(`Applying ${filterType} filter...`, 'info');
    
    // Simulate filter application
    setTimeout(() => {
        updateReportTables(filterType);
        showNotification(`${filterType} filter applied`, 'success');
    }, 1000);
}

function updateReportTables(filterType) {
    const tables = document.querySelectorAll('.report-table');
    
    tables.forEach(table => {
        const rows = table.querySelectorAll('tbody tr');
        
        rows.forEach(row => {
            // Apply filter logic based on filter type
            if (filterType === 'active') {
                const statusCell = row.querySelector('.status');
                if (statusCell && !statusCell.classList.contains('active')) {
                    row.style.display = 'none';
                } else {
                    row.style.display = '';
                }
            } else if (filterType === 'all') {
                row.style.display = '';
            }
        });
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function updateTabCharts(tabName) {
    // Update charts when switching tabs
    setTimeout(() => {
        Chart.helpers.eachChart(function(chart) {
            if (chart.canvas.closest(`#${tabName}-report`)) {
                chart.update();
            }
        });
    }, 100);
}

// Print styles
const printStyles = document.createElement('style');
printStyles.textContent = `
    @media print {
        .reports-actions,
        .date-range-selector,
        .export-actions,
        .report-tabs,
        .modal,
        .notification {
            display: none !important;
        }
        
        .report-content {
            display: block !important;
        }
        
        .chart-container {
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        .report-table {
            break-inside: avoid;
            page-break-inside: avoid;
        }
        
        body {
            font-size: 12px;
        }
        
        .summary-cards {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .summary-card {
            flex: 1;
            min-width: 200px;
            border: 1px solid #ddd;
            padding: 1rem;
        }
    }
`;
document.head.appendChild(printStyles);
