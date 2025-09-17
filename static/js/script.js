console.log('Financial Dashboard Script loaded!');

// Global variables
let refreshInterval;
let newsUpdateInterval;

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Financial Dashboard...');
    
    // Test element availability
    const refreshBtn = document.getElementById('refresh-btn');
    const newsContainer = document.getElementById('news-items');
    
    console.log('Elements found:', {
        refreshBtn: !!refreshBtn,
        newsContainer: !!newsContainer
    });
    
    // Initialize dashboard
    initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start periodic updates
    startPeriodicUpdates();
});

function initializeDashboard() {
    console.log('Initializing dashboard with mock data...');
    
    // Update overview immediately
    updateOverview();
    
    // Initialize all market data
    initializeMarketData();
    
    // Initialize charts
    setTimeout(initializeCharts, 500);
    
    // Populate news
    setTimeout(populateNews, 1000);
    
    // Hide loading overlays
    setTimeout(hideAllLoadingOverlays, 1500);
    
    // Update timestamp
    updateLastUpdated();
}

function updateOverview() {
    updateElement('total-gainers', '12');
    updateElement('total-losers', '8');
    updateElement('market-trend', 'Bullish');
    
    // Update summary value classes
    const trendElement = document.getElementById('market-trend');
    if (trendElement) {
        trendElement.className = 'summary-value positive';
    }
}

function initializeMarketData() {
    console.log('Initializing market data...');
    
    // Forex data
    const forexData = {
        'EUR/USD': { current: 1.0845, change: 0.23 },
        'GBP/USD': { current: 1.2534, change: -0.45 },
        'USD/JPY': { current: 149.85, change: 0.67 },
        'AUD/USD': { current: 0.6543, change: -0.12 },
        'USD/CAD': { current: 1.3567, change: 0.34 },
        'USD/CHF': { current: 0.9012, change: -0.18 }
    };
    
    // Crypto data
    const cryptoData = {
        'BTC/USDT': { current: 114250, change: 2.34 },
        'ETH/USDT': { current: 3485, change: 1.87 },
        'BNB/USDT': { current: 598, change: -0.92 },
        'SOL/USDT': { current: 152, change: 3.45 },
        'XRP/USDT': { current: 0.52, change: -1.23 },
        'ADA/USDT': { current: 0.45, change: 2.11 }
    };
    
    // Stocks data
    const stocksData = {
        'AAPL': { current: 182.45, change: 0.89 },
        'MSFT': { current: 398.23, change: -0.34 },
        'GOOGL': { current: 142.67, change: 1.23 },
        'TSLA': { current: 201.89, change: -2.11 },
        'AMZN': { current: 145.67, change: 1.45 },
        'META': { current: 512.34, change: 0.67 }
    };
    
    // Commodities data
    const commoditiesData = {
        'Gold': { current: 2518.45, change: 0.45 },
        'Silver': { current: 28.67, change: -0.23 },
        'Oil': { current: 89.34, change: 1.12 },
        'Copper': { current: 4.65, change: -0.67 }
    };
    
    // Update all markets
    updateMarketPrices('forex', forexData);
    updateMarketPrices('crypto', cryptoData);
    updateMarketPrices('stocks', stocksData);
    updateMarketPrices('commodities', commoditiesData);
}

function updateMarketPrices(market, data) {
    const container = document.getElementById(market + 'Prices');
    if (!container) {
        console.warn('Container not found:', market + 'Prices');
        return;
    }
    
    container.innerHTML = '';
    
    // Show only first 4 items to fit the grid properly
    const entries = Object.entries(data).slice(0, 4);
    
    entries.forEach(([symbol, item]) => {
        const priceDiv = document.createElement('div');
        priceDiv.className = `price-item ${item.change >= 0 ? 'positive' : 'negative'}`;
        priceDiv.innerHTML = `
            <div class="price-header">
                <span class="price-symbol">${symbol}</span>
                <span class="price-value">${formatPrice(item.current, symbol)}</span>
            </div>
            <div class="price-change ${item.change >= 0 ? 'positive' : 'negative'}">
                <i class="fas fa-arrow-${item.change >= 0 ? 'up' : 'down'}"></i>
                ${item.change >= 0 ? '+' : ''}${item.change}%
            </div>
        `;
        container.appendChild(priceDiv);
    });
    
    console.log(`Updated ${market} prices with ${entries.length} items`);
}

function formatPrice(price, symbol) {
    if (symbol.includes('/USD') || symbol.includes('/USDT')) {
        if (price < 1) {
            return '$' + price.toFixed(4);
        } else if (price > 1000) {
            return '$' + price.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        } else {
            return '$' + price.toFixed(2);
        }
    } else if (symbol === 'Gold' || symbol === 'Silver' || symbol === 'Oil' || symbol === 'Copper') {
        return '$' + price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    } else {
        return '$' + price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

function initializeCharts() {
    console.log('Initializing charts...');
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not loaded');
        showToast('Chart.js library not available', 'error');
        return;
    }
    
    const markets = ['forex', 'crypto', 'stocks', 'commodities'];
    
    markets.forEach(market => {
        const canvas = document.getElementById(market + 'Chart');
        if (canvas) {
            createChart(canvas, market);
        } else {
            console.warn(`Canvas not found for ${market}`);
        }
    });
}

function createChart(canvas, market) {
    const ctx = canvas.getContext('2d');
    
    // Generate realistic sample data
    const data = generateChartData(market);
    const labels = generateTimeLabels();
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price',
                data: data,
                borderColor: getMarketColor(market),
                backgroundColor: getMarketColor(market) + '20',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(26, 26, 46, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#a8a8b3',
                    borderColor: getMarketColor(market),
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { 
                        color: 'rgba(255,255,255,0.1)',
                        drawBorder: false
                    },
                    ticks: { 
                        color: '#a8a8b3', 
                        font: { size: 10 },
                        maxTicksLimit: 7
                    }
                },
                y: {
                    grid: { 
                        color: 'rgba(255,255,255,0.05)',
                        drawBorder: false
                    },
                    ticks: { 
                        color: '#a8a8b3', 
                        font: { size: 10 },
                        maxTicksLimit: 6
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
    
    console.log(`Created chart for ${market}`);
}

function generateChartData(market) {
    let basePrice;
    let volatility;
    
    // Set realistic base prices and volatility for each market
    switch (market) {
        case 'forex':
            basePrice = 1.08;
            volatility = 0.005;
            break;
        case 'crypto':
            basePrice = 45000;
            volatility = 0.03;
            break;
        case 'stocks':
            basePrice = 180;
            volatility = 0.015;
            break;
        case 'commodities':
            basePrice = 2500;
            volatility = 0.01;
            break;
        default:
            basePrice = 100;
            volatility = 0.01;
    }
    
    const data = [];
    let price = basePrice;
    
    for (let i = 0; i < 24; i++) {
        // Add some realistic market movement
        const change = (Math.random() - 0.5) * volatility * 2;
        price *= (1 + change);
        data.push(Number(price.toFixed(2)));
    }
    
    return data;
}

function generateTimeLabels() {
    const labels = [];
    const now = new Date();
    
    for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        labels.push(time.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        }));
    }
    
    return labels;
}

function getMarketColor(market) {
    const colors = {
        forex: '#00d4ff',
        crypto: '#ff9500',
        stocks: '#00ff88',
        commodities: '#5f27cd'
    };
    return colors[market] || '#00d4ff';
}

function populateNews() {
    console.log('Populating news section...');
    
    const newsContainer = document.getElementById('news-items');
    if (!newsContainer) {
        console.warn('News container not found');
        return;
    }
    
    const newsItems = [
        {
            title: "Federal Reserve Maintains Interest Rates at 5.25%-5.50%",
            source: "Federal Reserve",
            time: "2 hours ago",
            summary: "The Federal Reserve decided to hold interest rates steady as inflation shows signs of cooling but remains above the 2% target. Markets responded positively to the dovish tone in the statement.",
            tags: ["Fed", "Interest Rates", "Monetary Policy"],
            breaking: false
        },
        {
            title: "Bitcoin Breaks $115,000 Barrier Amid Institutional Adoption",
            source: "CoinDesk",
            time: "3 hours ago",
            summary: "Bitcoin reached a new all-time high above $115,000 driven by increased institutional adoption and regulatory clarity. MicroStrategy announced another $500M purchase.",
            tags: ["Bitcoin", "Crypto", "ATH", "Institutions"],
            breaking: true
        },
        {
            title: "Apple Reports Record Q4 Revenue Despite China Headwinds",
            source: "Apple Inc.",
            time: "4 hours ago",
            summary: "Apple exceeded analysts' expectations with $89.5B in quarterly revenue, driven by strong iPhone 15 sales and growing services business. Stock up 3% in after-hours trading.",
            tags: ["Apple", "Earnings", "Tech", "iPhone"],
            breaking: false
        },
        {
            title: "Oil Prices Surge 4% After OPEC+ Production Cut Extension",
            source: "Reuters",
            time: "5 hours ago",
            summary: "Crude oil futures jumped following OPEC+'s decision to extend production cuts through Q2 2025. Brent crude now trading above $92 per barrel.",
            tags: ["Oil", "OPEC", "Energy", "Commodities"],
            breaking: false
        },
        {
            title: "European Markets Rally on ECB Rate Cut Speculation",
            source: "Bloomberg",
            time: "6 hours ago",
            summary: "European stocks surged as investors bet on potential ECB rate cuts following weaker inflation data. DAX gained 2.1%, CAC 40 up 1.8%.",
            tags: ["Europe", "ECB", "Stocks", "Inflation"],
            breaking: false
        },
        {
            title: "Gold Hits $2,525 Record High Amid Dollar Weakness",
            source: "MarketWatch",
            time: "7 hours ago",
            summary: "Gold prices reached a new record high as the US dollar weakened and geopolitical tensions increased. Silver also gained 2.3% to $28.90 per ounce.",
            tags: ["Gold", "Precious Metals", "Dollar", "Safe Haven"],
            breaking: false
        },
        {
            title: "Tesla Cybertruck Production Ramp Boosts Q4 Deliveries",
            source: "Tesla",
            time: "8 hours ago",
            summary: "Tesla reported stronger-than-expected Q4 deliveries of 484,507 vehicles, with Cybertruck production contributing significantly. Stock jumped 5% pre-market.",
            tags: ["Tesla", "EV", "Deliveries", "Cybertruck"],
            breaking: false
        },
        {
            title: "Microsoft Azure Revenue Growth Accelerates to 30%",
            source: "Microsoft",
            time: "9 hours ago",
            summary: "Microsoft's cloud division posted 30% year-over-year growth, beating analyst estimates. AI services driving significant portion of new revenue streams.",
            tags: ["Microsoft", "Cloud", "Azure", "AI"],
            breaking: false
        },
        {
            title: "S&P 500 Reaches New All-Time High of 5,847 Points",
            source: "S&P Dow Jones",
            time: "10 hours ago",
            summary: "The S&P 500 index closed at a record high, driven by strong tech earnings and optimistic economic outlook. All 11 sectors finished in positive territory.",
            tags: ["S&P 500", "Stocks", "Record", "Markets"],
            breaking: false
        }
    ];
    
    newsContainer.innerHTML = '';
    
    newsItems.forEach((news, index) => {
        const newsDiv = document.createElement('article');
        newsDiv.className = `news-item ${news.breaking ? 'breaking' : ''}`;
        newsDiv.style.animationDelay = `${index * 0.1}s`;
        newsDiv.innerHTML = `
            <h4 class="news-title">${news.title}</h4>
            <div class="news-meta">
                <span class="news-source">${news.source}</span>
                <span class="news-time">${news.time}</span>
            </div>
            <p class="news-summary">${news.summary}</p>
            <div class="news-tags">
                ${news.tags.map(tag => `<span class="news-tag">${tag}</span>`).join('')}
            </div>
        `;
        newsContainer.appendChild(newsDiv);
    });
    
    console.log(`Added ${newsItems.length} news items`);
}

function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Refresh button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', handleRefresh);
    }
    
    // News refresh button
    const newsRefreshBtn = document.getElementById('news-refresh');
    if (newsRefreshBtn) {
        newsRefreshBtn.addEventListener('click', handleNewsRefresh);
    }
    
    // Fullscreen chart buttons
    document.querySelectorAll('[data-action="fullscreen"]').forEach(btn => {
        btn.addEventListener('click', handleFullscreenChart);
    });
    
    // Modal close events
    const modalClose = document.getElementById('modal-close');
    const modal = document.getElementById('chart-modal');
    
    if (modalClose && modal) {
        modalClose.addEventListener('click', () => closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    
    // ESC key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

function handleRefresh() {
    console.log('Manual refresh triggered');
    const refreshBtn = document.getElementById('refresh-btn');
    
    if (refreshBtn) {
        refreshBtn.classList.add('loading');
        refreshBtn.disabled = true;
    }
    
    // Simulate data fetching
    setTimeout(() => {
        fetchDataFromAPI();
        
        if (refreshBtn) {
            refreshBtn.classList.remove('loading');
            refreshBtn.disabled = false;
        }
        
        showToast('Data refreshed successfully', 'success');
    }, 2000);
}

function handleNewsRefresh() {
    console.log('News refresh triggered');
    
    // Add loading state to news items
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        item.style.opacity = '0.5';
    });
    
    // Refresh news after delay
    setTimeout(() => {
        populateNews();
        showToast('News updated', 'success');
    }, 1000);
}

function handleFullscreenChart(event) {
    const market = event.currentTarget.dataset.market;
    console.log(`Opening fullscreen chart for ${market}`);
    
    const modal = document.getElementById('chart-modal');
    const modalTitle = document.getElementById('modal-title');
    
    if (modal && modalTitle) {
        modalTitle.textContent = `${market.charAt(0).toUpperCase() + market.slice(1)} Market Chart`;
        modal.classList.add('active');
        
        // Create larger chart in modal
        setTimeout(() => {
            createModalChart(market);
        }, 300);
    }
}

function createModalChart(market) {
    const modalCanvas = document.getElementById('modal-chart');
    if (!modalCanvas) return;
    
    const ctx = modalCanvas.getContext('2d');
    
    // Clear any existing chart
    if (modalCanvas.chart) {
        modalCanvas.chart.destroy();
    }
    
    const data = generateChartData(market);
    const labels = generateTimeLabels();
    
    modalCanvas.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price',
                data: data,
                borderColor: getMarketColor(market),
                backgroundColor: getMarketColor(market) + '20',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { 
                    display: true,
                    labels: { color: '#ffffff' }
                },
                tooltip: {
                    backgroundColor: 'rgba(26, 26, 46, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#a8a8b3',
                    borderColor: getMarketColor(market),
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#a8a8b3' }
                },
                y: {
                    grid: { color: 'rgba(255,255,255,0.05)' },
                    ticks: { color: '#a8a8b3' }
                }
            }
        }
    });
}

function closeModal() {
    const modal = document.getElementById('chart-modal');
    if (modal) {
        modal.classList.remove('active');
        
        // Destroy modal chart
        const modalCanvas = document.getElementById('modal-chart');
        if (modalCanvas && modalCanvas.chart) {
            modalCanvas.chart.destroy();
            modalCanvas.chart = null;
        }
    }
}

function startPeriodicUpdates() {
    console.log('Starting periodic updates...');
    
    // Update data every 30 seconds
    refreshInterval = setInterval(() => {
        updateLastUpdated();
        // Simulate small price changes
        simulatePriceUpdates();
    }, 30000);
    
    // Update news every 5 minutes
    newsUpdateInterval = setInterval(() => {
        // Add a "new" news item occasionally
        if (Math.random() > 0.7) {
            addBreakingNews();
        }
    }, 300000);
}

function simulatePriceUpdates() {
    console.log('Simulating price updates...');
    
    // Update random prices slightly
    const priceItems = document.querySelectorAll('.price-item');
    priceItems.forEach(item => {
        if (Math.random() > 0.8) { // 20% chance to update each item
            const changeSpan = item.querySelector('.price-change');
            if (changeSpan) {
                const currentChange = parseFloat(changeSpan.textContent.replace(/[+\-%]/g, ''));
                const newChange = currentChange + (Math.random() - 0.5) * 0.1;
                
                changeSpan.className = `price-change ${newChange >= 0 ? 'positive' : 'negative'}`;
                changeSpan.innerHTML = `
                    <i class="fas fa-arrow-${newChange >= 0 ? 'up' : 'down'}"></i>
                    ${newChange >= 0 ? '+' : ''}${newChange.toFixed(2)}%
                `;
                
                // Update border color
                item.className = `price-item ${newChange >= 0 ? 'positive' : 'negative'}`;
            }
        }
    });
}

function addBreakingNews() {
    const breakingNewsItems = [
        {
            title: "BREAKING: Major Central Bank Announces Surprise Rate Decision",
            source: "Financial Times",
            time: "Just now",
            summary: "Unexpected monetary policy shift sends shockwaves through global markets as traders reassess risk positions.",
            tags: ["Breaking", "Central Bank", "Rates"],
            breaking: true
        },
        {
            title: "URGENT: Tech Giant Reports Massive Data Breach",
            source: "Reuters",
            time: "5 minutes ago",
            summary: "Security incident affects millions of users, company stock down 8% in after-hours trading as investigation begins.",
            tags: ["Breaking", "Tech", "Security"],
            breaking: true
        }
    ];
    
    const randomNews = breakingNewsItems[Math.floor(Math.random() * breakingNewsItems.length)];
    const newsContainer = document.getElementById('news-items');
    
    if (newsContainer) {
        const newsDiv = document.createElement('article');
        newsDiv.className = 'news-item breaking';
        newsDiv.style.animationDelay = '0s';
        newsDiv.innerHTML = `
            <h4 class="news-title">${randomNews.title}</h4>
            <div class="news-meta">
                <span class="news-source">${randomNews.source}</span>
                <span class="news-time">${randomNews.time}</span>
            </div>
            <p class="news-summary">${randomNews.summary}</p>
            <div class="news-tags">
                ${randomNews.tags.map(tag => `<span class="news-tag">${tag}</span>`).join('')}
            </div>
        `;
        
        newsContainer.insertBefore(newsDiv, newsContainer.firstChild);
        showToast('Breaking news added!', 'warning');
    }
}

async function fetchDataFromAPI() {
    console.log('Attempting to fetch data from API...');
    
    try {
        const response = await fetch('/api/prices');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('API data received:', data);
        
        // Update with real data
        updateLastUpdated(data.last_updated);
        
        // Update markets with real data
        Object.keys(data).forEach(market => {
            if (market !== 'last_updated') {
                updateMarketPrices(market, data[market]);
            }
        });
        
        showToast('Live data updated successfully', 'success');
        
    } catch (error) {
        console.error('API fetch failed:', error);
        showToast('Using simulated data - API unavailable', 'warning');
        
        // Continue with simulated updates
        initializeMarketData();
    }
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
        return true;
    } else {
        console.warn('Element not found:', id);
        return false;
    }
}

function updateLastUpdated(timestamp) {
    const now = timestamp || new Date().toLocaleString();
    updateElement('last-updated', now);
}

function hideAllLoadingOverlays() {
    document.querySelectorAll('.chart-overlay').forEach(overlay => {
        overlay.classList.add('hidden');
    });
    console.log('All loading overlays hidden');
}

function showToast(message, type = 'info') {
    console.log(`Toast: ${message} (${type})`);
    
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    toast.innerHTML = `
        <div class="toast-content">
            <i class="toast-icon ${icons[type] || icons.info}"></i>
            <span class="toast-message">${message}</span>
        </div>
    `;

    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

// Cleanup function
function cleanup() {
    if (refreshInterval) clearInterval(refreshInterval);
    if (newsUpdateInterval) clearInterval(newsUpdateInterval);
}

// Handle page unload
window.addEventListener('beforeunload', cleanup);