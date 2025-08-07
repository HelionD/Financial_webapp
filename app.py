from flask import Flask, render_template, jsonify
import requests
from datetime import datetime, timedelta
import threading
import time
import random
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# API Keys - you'll need to get these from the respective services
ALPHA_VANTAGE_API_KEY = os.getenv('ALPHA_VANTAGE_API_KEY', 'demo')  # Get from https://www.alphavantage.co/
YAHOO_FINANCE_API_KEY = os.getenv('YAHOO_FINANCE_API_KEY', 'demo')  # Get from https://rapidapi.com/apidojo/api/yh-finance/

# Enhanced data structure with more symbols
SYMBOLS = {
    'forex': ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'USD/CAD', 'USD/CHF'],
    'crypto': ['BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'SOL/USDT', 'XRP/USDT', 'ADA/USDT', 'DOGE/USDT'],
    'stocks': ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA'],
    'commodities': ['GC=F', 'SI=F', 'CL=F', 'HG=F']  # Gold, Silver, Oil, Copper futures
}

# User-friendly display names for commodities
COMMODITY_NAMES = {
    'GC=F': 'Gold',
    'SI=F': 'Silver', 
    'CL=F': 'Oil',
    'HG=F': 'Copper'
}

# Store historical OHLC data
historical_data = {
    'forex': {},
    'crypto': {},
    'stocks': {},
    'commodities': {}
}

def fetch_alpha_vantage_data(symbol, market_type):
    """Fetch data from Alpha Vantage API"""
    try:
        if market_type == 'forex':
            url = f'https://www.alphavantage.co/query?function=FX_DAILY&from_symbol={symbol[:3]}&to_symbol={symbol[4:7]}&apikey={ALPHA_VANTAGE_API_KEY}'
        elif market_type == 'stocks':
            url = f'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={symbol}&apikey={ALPHA_VANTAGE_API_KEY}'
        else:
            return None
            
        response = requests.get(url, timeout=10)
        data = response.json()
        
        if 'Error Message' in data or 'Note' in data:
            return None
            
        # Parse the data based on market type
        if market_type == 'forex':
            time_series = data.get('Time Series FX (Daily)', {})
        else:
            time_series = data.get('Time Series (Daily)', {})
            
        if not time_series:
            return None
            
        # Get last 15 days of data
        dates = sorted(time_series.keys(), reverse=True)[:15]
        ohlc_data = []
        
        for date in dates:
            daily_data = time_series[date]
            ohlc_data.append({
                'date': date,
                'open': float(daily_data['1. open']),
                'high': float(daily_data['2. high']),
                'low': float(daily_data['3. low']),
                'close': float(daily_data['4. close']),
                'volume': int(daily_data.get('5. volume', 0))
            })
            
        return ohlc_data
        
    except Exception as e:
        print(f"Error fetching Alpha Vantage data for {symbol}: {e}")
        return None

def fetch_yahoo_finance_data(symbol):
    """Fetch data from Yahoo Finance API"""
    try:
        url = "https://yh-finance.p.rapidapi.com/stock/v3/get-chart"
        querystring = {
            "interval": "1d",
            "symbol": symbol,
            "range": "15d",
            "region": "US",
            "includePrePost": "false",
            "useYfid": "true",
            "includeAdjustedClose": "true",
            "events": "div,jur"
        }
        
        headers = {
            "X-RapidAPI-Key": YAHOO_FINANCE_API_KEY,
            "X-RapidAPI-Host": "yh-finance.p.rapidapi.com"
        }
        
        response = requests.get(url, headers=headers, params=querystring, timeout=10)
        data = response.json()
        
        if 'chart' not in data or 'result' not in data['chart']:
            return None
            
        result = data['chart']['result'][0]
        timestamps = result['timestamp']
        quote = result['indicators']['quote'][0]
        
        ohlc_data = []
        for i in range(len(timestamps)):
            ohlc_data.append({
                'date': datetime.fromtimestamp(timestamps[i]).strftime('%Y-%m-%d'),
                'open': quote['open'][i] if quote['open'][i] else 0,
                'high': quote['high'][i] if quote['high'][i] else 0,
                'low': quote['low'][i] if quote['low'][i] else 0,
                'close': quote['close'][i] if quote['close'][i] else 0,
                'volume': quote['volume'][i] if quote['volume'][i] else 0
            })
            
        return ohlc_data
        
    except Exception as e:
        print(f"Error fetching Yahoo Finance data for {symbol}: {e}")
        return None

def generate_mock_ohlc_data(symbol, market_type):
    """Generate mock OHLC data for development"""
    # More realistic base prices for each market type
    if market_type == 'forex':
        # Realistic forex rates
        forex_rates = {
            'EUR/USD': 1.08, 'GBP/USD': 1.25, 'USD/JPY': 150.0, 'AUD/USD': 0.65,
            'USD/CAD': 1.35, 'USD/CHF': 0.90, 'NZD/USD': 0.60
        }
        base_price = forex_rates.get(symbol, random.uniform(0.6, 1.5))
    elif market_type == 'crypto':
        # Current crypto prices (as of August 2025)
        crypto_prices = {
            'BTC-USD': 114000, 'ETH-USD': 3500, 'BNB-USD': 600, 'SOL-USD': 150,
            'XRP-USD': 0.50, 'ADA-USD': 0.45, 'DOGE-USD': 0.08
        }
        base_price = crypto_prices.get(symbol, random.uniform(100, 1000))
    elif market_type == 'stocks':
        # Realistic stock prices
        stock_prices = {
            'AAPL': 180, 'MSFT': 400, 'GOOGL': 140, 'AMZN': 150,
            'TSLA': 200, 'META': 500, 'NVDA': 800
        }
        base_price = stock_prices.get(symbol, random.uniform(50, 500))
    elif market_type == 'commodities':
        # Current commodity prices (as of August 2025)
        commodity_prices = {
            'GC=F': 2500, 'SI=F': 28.5, 'CL=F': 90.5, 'HG=F': 4.66
        }
        base_price = commodity_prices.get(symbol, random.uniform(10, 100))
    else:
        base_price = random.uniform(50, 500)
    
    ohlc_data = []
    current_price = base_price
    
    for i in range(15):
        # Generate realistic price movements
        change_pct = random.uniform(-0.03, 0.03)  # ±3% daily change for more realism
        new_price = current_price * (1 + change_pct)
        
        # Generate OHLC from the price movement
        high = max(current_price, new_price) * random.uniform(1.0, 1.02)
        low = min(current_price, new_price) * random.uniform(0.98, 1.0)
        open_price = current_price
        close_price = new_price
        
        ohlc_data.append({
            'date': (datetime.now() - timedelta(days=14-i)).strftime('%Y-%m-%d'),
            'open': round(open_price, 4),
            'high': round(high, 4),
            'low': round(low, 4),
            'close': round(close_price, 4),
            'volume': random.randint(1000000, 10000000)
        })
        
        current_price = new_price
    
    return ohlc_data

def fetch_real_data():
    """Fetch real data from APIs or generate mock data if APIs are not available"""
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
            ohlc_data = None
            
            # Try to fetch real data
            if market_type in ['forex', 'stocks'] and ALPHA_VANTAGE_API_KEY != 'demo':
                ohlc_data = fetch_alpha_vantage_data(symbol, market_type)
            elif market_type in ['crypto', 'commodities'] and YAHOO_FINANCE_API_KEY != 'demo':
                ohlc_data = fetch_yahoo_finance_data(symbol)
            
            # Fall back to mock data if real data is not available
            if not ohlc_data:
                ohlc_data = generate_mock_ohlc_data(symbol, market_type)
            
            # Store the data
            historical_data[market_type][symbol] = ohlc_data
            
            # Get current price (latest close)
            if ohlc_data:
                latest = ohlc_data[-1]
                price_data = {
                    'current': latest['close'],
                    'change': round(((latest['close'] - latest['open']) / latest['open']) * 100, 2),
                    'ohlc': latest
                }
                
                # Add display name for commodities
                if market_type == 'commodities' and symbol in COMMODITY_NAMES:
                    price_data['display_name'] = COMMODITY_NAMES[symbol]
                
                data[market_type][symbol] = price_data
    
    return data

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/prices')
def get_prices():
    return jsonify(fetch_real_data())

@app.route('/api/historical/<market_type>/<path:symbol>')
def get_historical_data(market_type, symbol):
    """API endpoint to get historical OHLC data for a specific symbol"""
    # Ensure data is populated
    if not historical_data[market_type]:
        fetch_real_data()
    
    if market_type in historical_data and symbol in historical_data[market_type]:
        return jsonify(historical_data[market_type][symbol])
    return jsonify([])

if __name__ == '__main__':
    # Initialize data on startup
    print("Initializing financial data...")
    fetch_real_data()
    print("Financial dashboard ready!")
    app.run(debug=True)