console.log('🚀 Financial Dashboard Script loaded!');

// Global variables
let refreshInterval;
let newsUpdateInterval;
let clockInterval; // New clock interval
let apiBaseUrl = window.location.origin; // Dynamically get the base URL

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 DOM loaded, initializing Financial Dashboard...');
    console.log('🌐 API Base URL:', apiBaseUrl);
    
    // Test element availability
    const refreshBtn = document.getElementById('refresh-btn');
    const newsContainer = document.getElementById('news-items');
    
    console.log('🔍 Elements found:', {
        refreshBtn: !!refreshBtn,
        newsContainer: !!newsContainer
    });
    
    // Initialize dashboard
    initializeDashboard();
    
    // Set up event listeners
    setupEventListeners();
    
    // Start periodic updates
    startPeriodicUpdates();
    
    // Start real-time clock
    startRealtimeClock();
});

function initializeDashboard() {
    console.log('🏗️ Initializing dashboard...');
    
    // Update overview immediately with fallback data
    updateOverview();
    
    // Try to fetch real data from API, fall back to mock data
    fetchDataFromAPI();
    
    // Initialize charts after a short delay
    setTimeout(initializeCharts, 800);
    
    // Populate news
    setTimeout(() => {
        fetchNewsFromAPI();
    }, 1200);
    
    // Hide loading overlays
    setTimeout(hideAllLoadingOverlays, 2000);
    
    // Update timestamp immediately
    updateLastUpdated();
}

// NEW: Real-time clock function
function startRealtimeClock() {
    console.log('⏰ Starting real-time clock...');
    
    // Update clock immediately
    updateClockTime();
    
    // Update every second
    clockInterval = setInterval(() => {
        updateClockTime();
    }, 1000);
}

// NEW: Update clock time function
function updateClockTime() {
    const now = new Date();
    const timeString = now.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    const clockElement = document.getElementById('last-updated');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}

function updateOverview() {
    console.log('📊 Updating overview section...');
    updateElement('total-gainers', '14');
    updateElement('total-losers', '10');
    updateElement('market-trend', 'Bullish');
    
    // Update summary value classes
    const trendElement = document.getElementById('market-trend');
    if (trendElement) {
        trendElement.className = 'summary-value positive';
    }
}

function initializeMockData() {
    console.log('🎭 Initializing with mock data...');
    
    // Forex data - exactly 6 pairs
    const forexData = {
        'EUR/USD': { current: 1.0845, change: 0.23 },
        'GBP/USD': { current: 1.2534, change: -0.45 },
        'USD/JPY': { current: 149.85, change: 0.67 },
        'AUD/USD': { current: 0.6543, change: -0.12 },
        'USD/CAD': { current: 1.3567, change: 0.34 },
        'USD/CHF': { current: 0.9012, change: -0.18 }
    };
    
    // Crypto data - exactly 6 pairs
    const cryptoData = {
        'BTC/USDT': { current: 114250, change: 2.34 },
        'ETH/USDT': { current: 3485, change: 1.87 },
        'BNB/USDT': { current: 598, change: -0.92 },
        'SOL/USDT': { current: 152, change: 3.45 },
        'XRP/USDT': { current: 0.52, change: -1.23 },
        'ADA/USDT': { current: 0.45, change: 2.11 }
    };
    
    // Stocks data - exactly 6 pairs
    const stocksData = {
        'AAPL': { current: 182.45, change: 0.89 },
        'MSFT': { current: 398.23, change: -0.34 },
        'GOOGL': { current: 142.67, change: 1.23 },
        'AMZN': { current: 145.67, change: 1.45 },
        'TSLA': { current: 201.89, change: -2.11 },
        'META': { current: 512.34, change: 0.67 }
    };
    
    // Commodities data - exactly 6 pairs with real names and NO display_name conflicts
    const commoditiesData = {
        'Gold': { current: 2518.45, change: 0.45 },
        'Silver': { current: 28.67, change: -0.23 },
        'WTI Oil': { current: 89.34, change: 1.12 },
        'Brent Oil': { current: 91.23, change: 0.87 },
        'Platinum': { current: 945.67, change: -0.67 },
        'Palladium': { current: 1234.56, change: 1.34 }
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
        console.warn(`⚠️ Container not found: ${market}Prices`);
        return;
    }
    
    container.innerHTML = '';
    
    // Show exactly 6 items only
    const entries = Object.entries(data).slice(0, 6);
    
    entries.forEach(([symbol, item]) => {
        // Handle both API format and mock format
        const current = item.current || item.price || 0;
        const change = item.change || 0;
        
        // Clean symbol name - remove any undefined text
        let cleanSymbol = symbol;
        if (cleanSymbol.includes('undef')) {
            cleanSymbol = cleanSymbol.replace(/undef/g, '').trim();
        }
        if (cleanSymbol.includes('undefined')) {
            cleanSymbol = cleanSymbol.replace(/undefined/g, '').trim();
        }
        
        // Use display name if available, otherwise use clean symbol
        const displayName = item.display_name || cleanSymbol;
        
        const priceDiv = document.createElement('div');
        priceDiv.className = `price-item ${change >= 0 ? 'positive' : 'negative'}`;
        priceDiv.innerHTML = `
            <div class="price-header">
                <span class="price-symbol">${displayName}</span>
                <span class="price-value">${formatPrice(current, cleanSymbol)}</span>
            </div>
            <div class="price-change ${change >= 0 ? 'positive' : 'negative'}">
                <i class="fas fa-arrow-${change >= 0 ? 'up' : 'down'}"></i>
                ${change >= 0 ? '+' : ''}${change.toFixed(2)}%
            </div>
        `;
        container.appendChild(priceDiv);
    });
    
    console.log(`✅ Updated ${market} prices with exactly ${entries.length} items`);
}

function formatPrice(price, symbol) {
    if (typeof price !== 'number') {
        price = parseFloat(price) || 0;
    }
    
    if (symbol.includes('/USD') || symbol.includes('/USDT') || symbol.startsWith('XAU') || symbol.startsWith('XAG') || symbol.startsWith('XPT') || symbol.startsWith('XPD') || symbol.includes('OIL')) {
        if (price < 1) {
            return 
     + price.toFixed(4);
        } else if (price > 1000) {
            return 
     + price.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        } else {
            return 
     + price.toFixed(2);
        }
    } else {
        return 
     + price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}

function initializeCharts() {
    console.log('📈 Initializing charts...');
    
    if (typeof Chart === 'undefined') {
        console.error('❌ Chart.js not loaded');
        showToast('Chart.js library not available', 'error');
        return;
    }
    
    const markets = ['forex', 'crypto', 'stocks', 'commodities'];
    
    markets.forEach(market => {
        const canvas = document.getElementById(market + 'Chart');
        if (canvas) {
            createChart(canvas, market);
        } else {
            console.warn(`⚠️ Canvas not found for ${market}`);
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
    
    console.log(`✅ Created chart for ${market}`);
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

function populateNews(newsItems = null) {
    console.log('📰 Populating news section...');
    
    const newsContainer = document.getElementById('news-items');
    if (!newsContainer) {
        console.warn('⚠️ News container not found');
        return;
    }
    
    // Clear existing news first
    newsContainer.innerHTML = '';
    
    // Use provided news items or generate fresh mock data with exactly 9 unique items
    const items = newsItems || [
        {
            title: "Federal Reserve Maintains Interest Rates Amid Economic Uncertainty",
            source: "Federal Reserve",
            time: "1 hour ago",
            summary: "The Federal Reserve decided to hold interest rates steady as inflation shows signs of cooling but remains above the 2% target. Chair Powell emphasized data-dependent approach moving forward.",
            tags: ["Fed", "Interest Rates", "Monetary Policy"],
            breaking: false
        },
        {
            title: "Bitcoin Surges Past $115,000 as Institutional Adoption Accelerates",
            source: "CoinDesk",
            time: "2 hours ago",
            summary: "Bitcoin reached a new all-time high above $115,000 driven by increased corporate treasury adoption and regulatory clarity. MicroStrategy announced additional $500M purchase plan for Q1 2025.",
            tags: ["Bitcoin", "Crypto", "ATH", "Institutional"],
            breaking: true
        },
        {
            title: "Apple Reports Record Q4 Earnings Despite China Headwinds",
            source: "Apple Inc.",
            time: "3 hours ago",
            summary: "Apple exceeded analysts' expectations with $89.5B in quarterly revenue, driven by strong iPhone 15 sales and growing services business. Stock up 3.2% in after-hours trading.",
            tags: ["Apple", "Earnings", "Tech", "iPhone"],
            breaking: false
        },
        {
            title: "Oil Prices Surge 4.2% After OPEC+ Production Cut Extension",
            source: "Reuters",
            time: "4 hours ago",
            summary: "Crude oil futures jumped following OPEC+'s decision to extend production cuts through Q2 2025. Brent crude now trading above $92 per barrel amid supply concerns.",
            tags: ["Oil", "OPEC", "Energy", "Commodities"],
            breaking: false
        },
        {
            title: "European Markets Rally on ECB Rate Cut Speculation",
            source: "Bloomberg",
            time: "5 hours ago",
            summary: "European stocks surged as investors bet on potential ECB rate cuts following weaker inflation data. DAX gained 2.1%, CAC 40 up 1.8%, FTSE 100 climbed 1.5%.",
            tags: ["Europe", "ECB", "Stocks", "Inflation"],
            breaking: false
        },
        {
            title: "Gold Hits New Record High Above $2,525 Amid Dollar Weakness",
            source: "MarketWatch",
            time: "6 hours ago",
            summary: "Gold prices reached a new record high as the US dollar weakened and geopolitical tensions increased. Silver also gained 2.3% while platinum jumped 1.8%.",
            tags: ["Gold", "Precious Metals", "Dollar", "Safe Haven"],
            breaking: false
        },
        {
            title: "Microsoft Azure Revenue Grows 35% Amid AI Revolution",
            source: "Microsoft Corp.",
            time: "7 hours ago",
            summary: "Microsoft reported strong cloud growth with Azure revenue up 35% year-over-year, driven by AI services adoption. Copilot AI tools seeing rapid enterprise uptake.",
            tags: ["Microsoft", "Cloud", "AI", "Enterprise"],
            breaking: false
        },
        {
            title: "Japanese Yen Weakens as Bank of Japan Holds Ultra-Low Rates",
            source: "Nikkei Asia",
            time: "8 hours ago",
            summary: "The yen fell to fresh lows against the dollar after the Bank of Japan maintained ultra-accommodative policy. USD/JPY reached 150.25, prompting intervention warnings.",
            tags: ["Yen", "BOJ", "Forex", "Intervention"],
            breaking: false
        },
        {
            title: "Ethereum ETF Records $2.3B Weekly Inflows as Adoption Soars",
            source: "CryptoNews",
            time: "9 hours ago",
            summary: "Ethereum ETFs recorded their largest weekly inflows since launch, with $2.3B in net purchases. ETH price surged 8.5% to $3,485 as institutional demand grows rapidly.",
            tags: ["Ethereum", "ETF", "Crypto", "Institutional"],
            breaking: false
        }
    ];
    
    items.forEach((news, index) => {
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
    
    console.log(`✅ Added exactly ${items.length} unique news items`);
}

function setupEventListeners() {
    console.log('🎮 Setting up event listeners...');
    
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
    console.log('🔄 Manual refresh triggered');
    const refreshBtn = document.getElementById('refresh-btn');
    
    if (refreshBtn) {
        refreshBtn.classList.add('loading');
        refreshBtn.disabled = true;
    }
    
    // Fetch fresh data from API
    fetchDataFromAPI().finally(() => {
        if (refreshBtn) {
            refreshBtn.classList.remove('loading');
            refreshBtn.disabled = false;
        }
    });
}

function handleNewsRefresh() {
    console.log('📰 News refresh triggered');
    
    // Add loading state to news items
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        item.style.opacity = '0.5';
    });
    
    // Refresh news after delay
    setTimeout(() => {
        fetchNewsFromAPI();
    }, 1000);
}

function handleFullscreenChart(event) {
    const market = event.currentTarget.dataset.market;
    console.log(`📊 Opening fullscreen chart for ${market}`);
    
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
    console.log('⏰ Starting periodic updates...');
    
    // Update data every 30 seconds (but not the clock - that's separate now)
    refreshInterval = setInterval(() => {
        console.log('🔄 Periodic data update...');
        // Don't update clock here anymore - it has its own interval
        simulatePriceUpdates();
    }, 30000);
    
    // Update news every 5 minutes
    newsUpdateInterval = setInterval(() => {
        console.log('📰 Periodic news check...');
        // Add a "new" news item occasionally
        if (Math.random() > 0.7) {
            addBreakingNews();
        }
    }, 300000);
}

function simulatePriceUpdates() {
    console.log('🎲 Simulating price updates...');
    
    // Update random prices slightly
    const priceItems = document.querySelectorAll('.price-item');
    let updatedCount = 0;
    
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
                updatedCount++;
            }
        }
    });
    
    if (updatedCount > 0) {
        console.log(`📊 Updated ${updatedCount} price items`);
    }
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
        },
        {
            title: "ALERT: Gold Hits New All-Time High Above $2,550",
            source: "MarketWatch",
            time: "3 minutes ago",
            summary: "Precious metals surge on safe-haven demand amid geopolitical tensions. Silver and platinum also posting significant gains.",
            tags: ["Breaking", "Gold", "ATH", "Safe Haven"],
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
        console.log('📰 Added breaking news item');
    }
}

async function fetchDataFromAPI() {
    console.log('🌐 Attempting to fetch data from API...');
    
    try {
        const url = `${apiBaseUrl}/api/prices`;
        console.log('📡 Fetching from:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        console.log('📡 Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ API data received:', {
            keys: Object.keys(data),
            lastUpdated: data.last_updated
        });
        
        // Update markets with real data
        let updatedMarkets = 0;
        Object.keys(data).forEach(market => {
            if (market !== 'last_updated' && market !== 'market_stats' && data[market]) {
                updateMarketPrices(market, data[market]);
                updatedMarkets++;
            }
        });
        
        showToast('Live data updated successfully', 'success');
        console.log(`✅ Updated ${updatedMarkets} markets with live data`);
        
    } catch (error) {
        console.error('❌ API fetch failed:', error);
        console.log('🎭 Falling back to mock data...');
        
        showToast('Using simulated data - API connection issue', 'warning');
        
        // Continue with simulated updates
        initializeMockData();
    }
}

async function fetchNewsFromAPI() {
    console.log('📰 Fetching news from API...');
    
    try {
        const url = `${apiBaseUrl}/api/news`;
        console.log('📡 News URL:', url);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const newsData = await response.json();
        console.log('✅ News data received:', newsData.length, 'items');
        
        // Convert API format to display format
        const formattedNews = newsData.map(item => ({
            title: item.title,
            source: item.source,
            time: item.time,
            summary: item.summary,
            tags: item.tags || [],
            breaking: item.importance === 'high' || item.category === 'breaking'
        }));
        
        populateNews(formattedNews);
        showToast('News updated successfully', 'success');
        
    } catch (error) {
        console.error('❌ News API fetch failed:', error);
        
        // Fall back to mock news
        populateNews();
        showToast('Using mock news data', 'warning');
    }
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
        return true;
    } else {
        console.warn(`⚠️ Element not found: ${id}`);
        return false;
    }
}

function updateLastUpdated(timestamp) {
    // Don't update timestamp manually anymore - the clock handles this
    // This function is kept for API compatibility but doesn't override clock
    if (timestamp) {
        console.log('📡 Data last updated from API:', timestamp);
    }
}

function hideAllLoadingOverlays() {
    const overlays = document.querySelectorAll('.chart-overlay');
    overlays.forEach(overlay => {
        overlay.classList.add('hidden');
    });
    console.log(`✅ Hidden ${overlays.length} loading overlays`);
}

// IMPROVED: Better toast system with less intrusive design
function showToast(message, type = 'info', duration = 4000) {
    console.log(`🍞 Toast: ${message} (${type})`);
    
    let container = document.getElementById('toast-container');
    if (!container) {
        // Create container if it doesn't exist
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

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
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto remove after duration
    setTimeout(() => {
        if (container.contains(toast)) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }
    }, duration);
}

// API Health Check Function
async function checkAPIHealth() {
    try {
        console.log('🏥 Checking API health...');
        const response = await fetch(`${apiBaseUrl}/api/market-stats`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            console.log('✅ API is healthy');
            return true;
        } else {
            console.log('⚠️ API responded with non-200 status:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ API health check failed:', error.message);
        return false;
    }
}

// Test all API endpoints
async function testAllEndpoints() {
    console.log('🧪 Testing all API endpoints...');
    
    const endpoints = [
        '/api/prices',
        '/api/news',
        '/api/market-stats',
        '/api/watchlist'
    ];
    
    for (const endpoint of endpoints) {
        try {
            const response = await fetch(`${apiBaseUrl}${endpoint}`);
            console.log(`${endpoint}: ${response.ok ? '✅' : '❌'} ${response.status}`);
        } catch (error) {
            console.log(`${endpoint}: ❌ ${error.message}`);
        }
    }
}

// IMPROVED: Cleanup function now includes clock cleanup
function cleanup() {
    console.log('🧹 Cleaning up intervals...');
    if (refreshInterval) {
        clearInterval(refreshInterval);
        console.log('🧹 Cleared refresh interval');
    }
    if (newsUpdateInterval) {
        clearInterval(newsUpdateInterval);
        console.log('🧹 Cleared news interval');
    }
    if (clockInterval) {
        clearInterval(clockInterval);
        console.log('🧹 Cleared clock interval');
    }
}

// Handle page unload
window.addEventListener('beforeunload', cleanup);

// Debug helper - expose functions to window for console testing
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugDashboard = {
        testAPI: testAllEndpoints,
        checkHealth: checkAPIHealth,
        refreshData: fetchDataFromAPI,
        refreshNews: fetchNewsFromAPI,
        showToast: showToast,
        updateClock: updateClockTime
    };
    console.log('🛠️ Debug functions available: window.debugDashboard');
}