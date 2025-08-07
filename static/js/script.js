// Initialize all charts
const charts = {
    forex: null,
    crypto: null,
    stocks: null,
    commodities: null
};

// Color palette for charts
const colors = {
    up: '#26a69a',
    down: '#ef5350',
    border: '#333333',
    background: 'rgba(255, 255, 255, 0.1)'
};

// Store historical data
const historicalData = {
    forex: {},
    crypto: {},
    stocks: {},
    commodities: {}
};

// Initialize charts
function initializeCharts() {
    const chartIds = ['forex', 'crypto', 'stocks', 'commodities'];
    
    chartIds.forEach(marketType => {
        const chartContainer = document.getElementById(`${marketType}Chart`);
        if (chartContainer) {
            try {
                console.log(`Initializing chart for ${marketType}...`);
                
                // Clear loading message
                chartContainer.innerHTML = '';
                
                // Create canvas element
                const canvas = document.createElement('canvas');
                canvas.id = `${marketType}Canvas`;
                chartContainer.appendChild(canvas);
                
                // Create Chart.js chart with candlestick-style appearance
                charts[marketType] = new Chart(canvas.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: [],
                        datasets: []
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: `${marketType.charAt(0).toUpperCase() + marketType.slice(1)} Prices`,
                                font: { size: 16, weight: 'bold' },
                                color: '#333'
                            },
                            legend: {
                                position: 'bottom',
                                labels: {
                                    padding: 20,
                                    usePointStyle: true
                                }
                            },
                            tooltip: {
                                mode: 'index',
                                intersect: false,
                                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                titleColor: '#fff',
                                bodyColor: '#fff',
                                borderColor: '#333',
                                borderWidth: 1
                            }
                        },
                        scales: {
                            x: {
                                type: 'time',
                                time: {
                                    unit: 'day',
                                    displayFormats: {
                                        day: 'MMM dd'
                                    }
                                },
                                grid: {
                                    color: '#f0f0f0'
                                },
                                ticks: {
                                    color: '#666'
                                }
                            },
                            y: {
                                beginAtZero: false,
                                grid: {
                                    color: '#f0f0f0'
                                },
                                ticks: {
                                    color: '#666',
                                    callback: function(value) {
                                        return '$' + value.toLocaleString();
                                    }
                                }
                            }
                        },
                        interaction: {
                            mode: 'nearest',
                            axis: 'x',
                            intersect: false
                        },
                        elements: {
                            point: {
                                radius: 3,
                                hoverRadius: 6
                            },
                            line: {
                                tension: 0.1
                            }
                        }
                    }
                });
                
                console.log(`Chart.js chart created for ${marketType}`);
            } catch (error) {
                console.error(`Error initializing chart for ${marketType}:`, error);
            }
        } else {
            console.error(`Chart container not found for ${marketType}`);
        }
    });
}

// Fetch data from server
async function fetchData() {
    try {
        const response = await axios.get('/api/prices');
        updateUI(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Update UI with new data
function updateUI(data) {
    // Update last updated time
    document.getElementById('last-updated').textContent = data.last_updated || 'Unknown';
    
    // Update each market section
    updateMarketSection('forex', data.forex);
    updateMarketSection('crypto', data.crypto);
    updateMarketSection('stocks', data.stocks);
    updateMarketSection('commodities', data.commodities);
    
    // Update news feed (mock data for now)
    updateNewsFeed();
}

function updateMarketSection(marketType, prices) {
    const priceListElement = document.getElementById(`${marketType}Prices`);
    priceListElement.innerHTML = '';
    
    for (const [symbol, priceData] of Object.entries(prices)) {
        if (!priceData) continue;
        
        // Create price element
        const priceElement = document.createElement('div');
        priceElement.className = 'price-item';
        
        const priceHeader = document.createElement('div');
        priceHeader.className = 'price-header';
        
        const symbolElement = document.createElement('span');
        symbolElement.className = 'symbol';
        symbolElement.textContent = symbol;
        
        const priceValueElement = document.createElement('span');
        priceValueElement.className = 'price';
        
        // Format price based on market type
        let formattedPrice;
        if (marketType === 'forex') {
            formattedPrice = parseFloat(priceData.current).toFixed(4);
        } else if (marketType === 'crypto') {
            formattedPrice = parseFloat(priceData.current).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        } else {
            formattedPrice = parseFloat(priceData.current).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        
        priceValueElement.textContent = formattedPrice;
        
        priceHeader.appendChild(symbolElement);
        priceHeader.appendChild(priceValueElement);
        
        // Add change percentage
        const changeElement = document.createElement('div');
        changeElement.className = 'change';
        
        const changeValue = priceData.change;
        const isPositive = changeValue >= 0;
        
        changeElement.innerHTML = `
            <span class="${isPositive ? 'positive' : 'negative'}">
                ${isPositive ? '+' : ''}${changeValue}%
                <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i>
            </span>
        `;
        
        priceElement.appendChild(priceHeader);
        priceElement.appendChild(changeElement);
        priceListElement.appendChild(priceElement);
    }
    
    // Update chart with historical data
    updateChart(marketType);
}

async function updateChart(marketType) {
    const chart = charts[marketType];
    if (!chart) {
        console.error(`Chart not found for ${marketType}`);
        return;
    }
    
    try {
        console.log(`Updating chart for ${marketType}...`);
        
        const symbols = getSymbolsForMarket(marketType);
        const datasets = [];
        let labels = [];
        
        for (const symbol of symbols) {
            try {
                const response = await axios.get(`/api/historical/${marketType}/${symbol}`);
                if (response.data && response.data.length > 0) {
                    // Convert to Chart.js format
                    const chartData = response.data.map(item => ({
                        x: new Date(item.date),
                        y: item.close
                    }));
                    
                    // Use first symbol's labels
                    if (datasets.length === 0) {
                        labels = response.data.map(item => new Date(item.date));
                    }
                    
                    datasets.push({
                        label: symbol,
                        data: chartData,
                        borderColor: getRandomColor(),
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        borderWidth: 2,
                        tension: 0.1,
                        fill: false
                    });
                }
            } catch (error) {
                console.error(`Error fetching historical data for ${symbol}:`, error);
            }
        }
        
        // Update the chart
        if (datasets.length > 0) {
            chart.data.labels = labels;
            chart.data.datasets = datasets;
            chart.update('none'); // Update without animation for better performance
            console.log(`Chart updated for ${marketType} with ${datasets.length} datasets`);
        } else {
            console.warn(`No data available for ${marketType}`);
        }
    } catch (error) {
        console.error(`Error updating chart for ${marketType}:`, error);
    }
}

function getSymbolsForMarket(marketType) {
    const symbolMap = {
        'forex': ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF', 'NZD/USD'],
        'crypto': ['BTC-USD', 'ETH-USD', 'BNB-USD', 'SOL-USD', 'XRP-USD', 'ADA-USD', 'DOGE-USD'],
        'stocks': ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA'],
        'commodities': ['GC=F', 'SI=F', 'CL=F', 'HG=F']
    };
    return symbolMap[marketType] || [];
}

function getRandomColor() {
    const colors = [
        '#3498db', '#2ecc71', '#e74c3c', '#f39c12',
        '#9b59b6', '#1abc9c', '#d35400', '#34495e',
        '#16a085', '#c0392b', '#8e44ad', '#27ae60'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

function updateNewsFeed() {
    const newsItems = [
        {
            title: "Fed Announces Interest Rate Decision",
            source: "Financial Times",
            time: "2 hours ago"
        },
        {
            title: "Bitcoin Surges Past $110,000 Mark",
            source: "CoinDesk",
            time: "4 hours ago"
        },
        {
            title: "Tech Stocks Rally After Earnings Reports",
            source: "Bloomberg",
            time: "6 hours ago"
        },
        {
            title: "Oil Prices Fall Amid Inventory Build",
            source: "Reuters",
            time: "8 hours ago"
        },
        {
            title: "New Regulations Proposed for Crypto Exchanges",
            source: "WSJ",
            time: "10 hours ago"
        }
    ];
    
    const newsContainer = document.getElementById('news-items');
    newsContainer.innerHTML = '';
    
    newsItems.forEach(news => {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        newsElement.innerHTML = `
            <div class="news-title">${news.title}</div>
            <div class="news-source">${news.source}</div>
            <div class="news-time">${news.time}</div>
        `;
        newsContainer.appendChild(newsElement);
    });
}

// Handle window resize
function handleResize() {
    Object.values(charts).forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
}

// Manual refresh button
document.getElementById('refresh-btn').addEventListener('click', fetchData);

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing charts...');
    
    // Wait for Chart.js to load
    const checkChartJS = () => {
        if (typeof Chart !== 'undefined') {
            console.log('Chart.js loaded, initializing charts...');
            initializeCharts();
            fetchData();
            
            // Auto-refresh every 30 seconds
            setInterval(fetchData, 30000);
            
            // Handle window resize
            window.addEventListener('resize', handleResize);
        } else {
            console.log('Chart.js not ready, retrying...');
            setTimeout(checkChartJS, 100);
        }
    };
    
    checkChartJS();
});