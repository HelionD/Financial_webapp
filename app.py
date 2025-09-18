from flask import Flask, render_template, jsonify
import requests
from datetime import datetime, timedelta
import threading
import time
import random
import os
import logging
from dotenv import load_dotenv

# Configure logging to reduce noise
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

load_dotenv()

app = Flask(__name__, 
            static_folder='static',
            static_url_path='/static')

app = Flask(__name__, static_folder='static', static_url_path='/static')

if __name__ == '__main__':
    app.run(debug=True)
    
# Custom logging
class CustomFormatter(logging.Formatter):
    def format(self, record):
        if record.name == 'werkzeug' and '200' in record.getMessage():
            return None
        return super().format(record)

# Configure Flask logging
if not app.debug:
    handler = logging.StreamHandler()
    handler.setFormatter(CustomFormatter())
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)

# Enhanced data structure with more symbols
SYMBOLS = {
    'forex': ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF', 'NZD/USD'],
    'crypto': ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'XRP/USDT', 'ADA/USDT', 'DOGE/USDT', 'AVAX/USDT'],
    'stocks': ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'],
    'commodities': ['GC=F', 'SI=F', 'CL=F', 'HG=F']  # Gold, Silver, Oil, Copper futures
}

# User-friendly display names for commodities
COMMODITY_NAMES = {
    'GC=F': 'Gold',
    'SI=F': 'Silver', 
    'CL=F': 'Oil',
    'HG=F': 'Copper'
}

# Store historical OHLC data (in-memory only, no database)
historical_data = {
    'forex': {},
    'crypto': {},
    'stocks': {},
    'commodities': {}
}

# Global market data cache (in-memory only)
market_data_cache = {}

def generate_mock_ohlc_data(symbol, market_type):
    """Generate mock OHLC data for development"""
    # More realistic base prices for each market type
    if market_type == 'forex':
        forex_rates = {
            'EUR/USD': 1.0845, 'GBP/USD': 1.2534, 'USD/JPY': 149.85, 'AUD/USD': 0.6543,
            'USD/CAD': 1.3567, 'USD/CHF': 0.9012, 'NZD/USD': 0.6123
        }
        base_price = forex_rates.get(symbol, random.uniform(0.6, 1.5))
    elif market_type == 'crypto':
        crypto_prices = {
            'BTC/USDT': 114250, 'ETH/USDT': 3485, 'BNB/USDT': 598, 'SOL/USDT': 152,
            'XRP/USDT': 0.52, 'ADA/USDT': 0.45, 'DOGE/USDT': 0.08, 'AVAX/USDT': 45.67
        }
        base_price = crypto_prices.get(symbol, random.uniform(100, 1000))
    elif market_type == 'stocks':
        stock_prices = {
            'AAPL': 182.45, 'MSFT': 398.23, 'GOOGL': 142.67, 'AMZN': 145.67,
            'TSLA': 201.89, 'META': 512.34, 'NVDA': 875.43, 'NFLX': 456.78
        }
        base_price = stock_prices.get(symbol, random.uniform(50, 500))
    elif market_type == 'commodities':
        commodity_prices = {
            'GC=F': 2518.45, 'SI=F': 28.67, 'CL=F': 89.34, 'HG=F': 4.65
        }
        base_price = commodity_prices.get(symbol, random.uniform(10, 100))
    else:
        base_price = random.uniform(50, 500)
    
    ohlc_data = []
    current_price = base_price
    
    for i in range(30):  # 30 days of data
        # Generate realistic price movements with some trend
        if market_type == 'crypto':
            change_pct = random.uniform(-0.05, 0.06)  # Crypto is more volatile
        elif market_type == 'forex':
            change_pct = random.uniform(-0.008, 0.008)  # Forex is less volatile
        else:
            change_pct = random.uniform(-0.03, 0.03)  # Stocks and commodities
            
        new_price = current_price * (1 + change_pct)
        
        # Generate OHLC from the price movement
        high = max(current_price, new_price) * random.uniform(1.001, 1.025)
        low = min(current_price, new_price) * random.uniform(0.975, 0.999)
        open_price = current_price
        close_price = new_price
        
        ohlc_data.append({
            'date': (datetime.now() - timedelta(days=29-i)).strftime('%Y-%m-%d'),
            'open': round(open_price, 4),
            'high': round(high, 4),
            'low': round(low, 4),
            'close': round(close_price, 4),
            'volume': random.randint(1000000, 50000000)
        })
        
        current_price = new_price
    
    return ohlc_data

def calculate_market_stats():
    """Calculate overall market statistics"""
    gainers = 0
    losers = 0
    total_instruments = 0
    
    for market_type in ['forex', 'crypto', 'stocks', 'commodities']:
        if market_type in market_data_cache:
            for symbol, data in market_data_cache[market_type].items():
                if isinstance(data, dict) and 'change' in data:
                    total_instruments += 1
                    if data['change'] > 0:
                        gainers += 1
                    elif data['change'] < 0:
                        losers += 1
    
    # Determine overall market trend
    if gainers > losers:
        trend = "Bullish"
    elif losers > gainers:
        trend = "Bearish"  
    else:
        trend = "Neutral"
    
    return {
        'gainers': gainers,
        'losers': losers,
        'trend': trend
    }

def fetch_real_data():
    """Generate enhanced mock data for demo purposes - no external APIs or database"""
    global market_data_cache
    
    print("📊 Generating fresh market data...")
    
    data = {
        'forex': {},
        'crypto': {},
        'stocks': {},
        'commodities': {},
        'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    }
    
    # Fetch data for each market type
    for market_type, symbols in SYMBOLS.items():
        for symbol in symbols:
            # Generate mock data
            ohlc_data = generate_mock_ohlc_data(symbol, market_type)
            
            # Store the data in memory
            historical_data[market_type][symbol] = ohlc_data
            
            # Get current price (latest close)
            if ohlc_data:
                latest = ohlc_data[-1]
                previous = ohlc_data[-2] if len(ohlc_data) > 1 else latest
                
                price_change = ((latest['close'] - previous['close']) / previous['close']) * 100
                
                price_data = {
                    'current': latest['close'],
                    'change': round(price_change, 2),
                    'ohlc': latest,
                    'volume': latest['volume'],
                    'high_24h': max([d['high'] for d in ohlc_data[-7:]]),  # 7-day high
                    'low_24h': min([d['low'] for d in ohlc_data[-7:]])     # 7-day low
                }
                
                # Add display name for commodities
                if market_type == 'commodities' and symbol in COMMODITY_NAMES:
                    price_data['display_name'] = COMMODITY_NAMES[symbol]
                
                data[market_type][symbol] = price_data
    
    # Cache the data in memory
    market_data_cache = data
    
    # Add market statistics
    stats = calculate_market_stats()
    data['market_stats'] = stats
    
    print(f"✅ Generated data for {sum(len(v) for k, v in data.items() if k not in ['last_updated', 'market_stats'])} instruments")
    return data

@app.route('/')
def index():
    """Serve the main dashboard page"""
    return render_template('index.html')

@app.route('/api/prices')
def get_prices():
    """API endpoint to get current market prices"""
    try:
        data = fetch_real_data()
        return jsonify(data)
    except Exception as e:
        print(f"❌ Error in /api/prices: {e}")
        return jsonify({'error': 'Failed to fetch market data'}), 500

@app.route('/api/historical/<market_type>/<path:symbol>')
def get_historical_data(market_type, symbol):
    """API endpoint to get historical OHLC data for a specific symbol"""
    try:
        # Ensure data is populated
        if not historical_data.get(market_type, {}).get(symbol):
            fetch_real_data()
        
        if market_type in historical_data and symbol in historical_data[market_type]:
            return jsonify(historical_data[market_type][symbol])
        else:
            return jsonify([])
    except Exception as e:
        print(f"❌ Error in /api/historical: {e}")
        return jsonify({'error': 'Failed to fetch historical data'}), 500

@app.route('/api/news')
def get_news():
    """API endpoint to get enhanced mock news data"""
    try:
        current_time = datetime.now()
        
        news_items = [
            {
                "id": 1,
                "title": "Federal Reserve Maintains Interest Rates Amid Economic Uncertainty",
                "source": "Federal Reserve",
                "time": "2 hours ago",
                "timestamp": (current_time - timedelta(hours=2)).isoformat(),
                "summary": "The Federal Reserve decided to hold interest rates steady at 5.25%-5.50% as inflation shows signs of cooling but remains above target levels. Chair Powell emphasized data-dependent approach.",
                "tags": ["Fed", "Interest Rates", "Economy", "Inflation"],
                "category": "monetary_policy",
                "importance": "high",
                "market_impact": "positive"
            },
            {
                "id": 2,
                "title": "Bitcoin Surges Past $115,000 as Institutional Adoption Accelerates",
                "source": "CoinDesk",
                "time": "3 hours ago",
                "timestamp": (current_time - timedelta(hours=3)).isoformat(),
                "summary": "Bitcoin reached a new all-time high above $115,000 driven by increased corporate treasury adoption and regulatory clarity. MicroStrategy announced additional $500M purchase plan.",
                "tags": ["Bitcoin", "Crypto", "ATH", "Institutional"],
                "category": "cryptocurrency",
                "importance": "high",
                "market_impact": "positive"
            },
            {
                "id": 3,
                "title": "Apple Reports Record Q4 Earnings Despite China Headwinds",
                "source": "Apple Inc.",
                "time": "4 hours ago",
                "timestamp": (current_time - timedelta(hours=4)).isoformat(),
                "summary": "Apple exceeded analysts' expectations with $89.5B in quarterly revenue, driven by strong iPhone 15 sales and growing services business. Stock up 3.2% in after-hours trading.",
                "tags": ["Apple", "Earnings", "Tech", "iPhone"],
                "category": "earnings",
                "importance": "medium",
                "market_impact": "positive"
            },
            {
                "id": 4,
                "title": "Oil Prices Surge 4.2% After OPEC+ Production Cut Extension", 
                "source": "Reuters",
                "time": "5 hours ago",
                "timestamp": (current_time - timedelta(hours=5)).isoformat(),
                "summary": "Crude oil futures jumped following OPEC+'s decision to extend production cuts through Q2 2025. Brent crude now trading above $92 per barrel amid supply concerns.",
                "tags": ["Oil", "OPEC", "Energy", "Commodities"],
                "category": "commodities",
                "importance": "medium",
                "market_impact": "positive"
            },
            {
                "id": 5,
                "title": "European Markets Rally on ECB Rate Cut Speculation",
                "source": "Bloomberg",
                "time": "6 hours ago",
                "timestamp": (current_time - timedelta(hours=6)).isoformat(),
                "summary": "European stocks surged as investors bet on potential ECB rate cuts following weaker-than-expected inflation data. DAX gained 2.1%, CAC 40 up 1.8%, FTSE 100 climbed 1.5%.",
                "tags": ["Europe", "ECB", "Stocks", "Inflation"],
                "category": "international",
                "importance": "medium",
                "market_impact": "positive"
            }
        ]
        
        return jsonify(news_items)
    except Exception as e:
        print(f"❌ Error in /api/news: {e}")
        return jsonify({'error': 'Failed to fetch news data'}), 500

@app.route('/api/market-stats')
def get_market_stats():
    """API endpoint to get current market statistics"""
    try:
        if not market_data_cache:
            fetch_real_data()
        
        stats = calculate_market_stats()
        
        # Add additional market metrics
        stats.update({
            'total_volume': random.randint(80000000000, 120000000000),  # Mock total volume
            'market_cap': random.randint(45000000000000, 55000000000000),  # Mock total market cap
            'fear_greed_index': random.randint(25, 85),  # Mock fear & greed index
            'vix': round(random.uniform(12.5, 35.8), 2),  # Mock VIX
            'sentiment': "Cautiously Optimistic" if stats['gainers'] > stats['losers'] else "Mixed"
        })
        
        return jsonify(stats)
    except Exception as e:
        print(f"❌ Error in /api/market-stats: {e}")
        return jsonify({'error': 'Failed to fetch market stats'}), 500

@app.route('/api/watchlist')
def get_watchlist():
    """API endpoint to get user's watchlist (mock data)"""
    try:
        watchlist = [
            {'symbol': 'AAPL', 'price': 182.45, 'change': 0.89},
            {'symbol': 'BTC/USDT', 'price': 114250, 'change': 2.34},
            {'symbol': 'EUR/USD', 'price': 1.0845, 'change': 0.23},
            {'symbol': 'Gold', 'price': 2518.45, 'change': 0.45}
        ]
        return jsonify(watchlist)
    except Exception as e:
        print(f"❌ Error in /api/watchlist: {e}")
        return jsonify({'error': 'Failed to fetch watchlist'}), 500

def background_data_updater():
    """Background thread to periodically update market data"""
    while True:
        try:
            print("🔄 Background data update...")
            fetch_real_data()
            time.sleep(60)  # Update every minute
        except Exception as e:
            print(f"⚠️ Background update error: {e}")
            time.sleep(30)  # Retry in 30 seconds if error

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    print(f"❌ 404 Error: {error}")
    return jsonify({'error': 'Endpoint not found', 'message': str(error)}), 404

@app.errorhandler(500)
def internal_error(error):
    print(f"❌ 500 Error: {error}")
    return jsonify({'error': 'Internal server error', 'message': str(error)}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    print(f"❌ Unhandled exception: {e}")
    return jsonify({'error': 'An unexpected error occurred', 'message': str(e)}), 500

if __name__ == '__main__':
    # Initialize data on startup
    print("🚀 Starting Financial Dashboard Pro...")
    print("📊 Initializing market data...")
    
    try:
        fetch_real_data()
        print("✅ Market data initialized successfully!")
        
        # Start background updater thread
        updater_thread = threading.Thread(target=background_data_updater, daemon=True)
        updater_thread.start()
        print("🔄 Background data updater started")
        
        print("🌐 Server starting on http://localhost:5000")
        print("📈 Dashboard Status: Active")
        print("💡 Features: Live data, Interactive charts, Breaking news")
        print("🗂️  Database: None (In-memory only)")
        print("-" * 50)
        
    except Exception as e:
        print(f"❌ Initialization error: {e}")
        print("⚠️ Starting with limited functionality...")
    
    # Run the Flask application
    app.run(
        debug=True, 
        port=5000, 
        host='0.0.0.0',
        threaded=True,
        use_reloader=False  # Disable reloader to prevent duplicate background threads
    )