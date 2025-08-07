# Advanced Financial Dashboard

A real-time financial dashboard with candlestick charts for Forex, Cryptocurrencies, Stocks, and Commodities.

## Features

- **Candlestick Charts**: Professional trading charts using TradingView's lightweight charts
- **Real-time Data**: Live market data from Alpha Vantage and Yahoo Finance APIs
- **Multiple Markets**: Forex, Cryptocurrencies, Stocks, and Commodities
- **Responsive Design**: Works on desktop and mobile devices
- **Auto-refresh**: Updates every 30 seconds

## Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Set up API Keys** (Optional - for real data):
   
   Create a `.env` file in the project root with your API keys:
   ```
   # Get Alpha Vantage API key from: https://www.alphavantage.co/support/#api-key
   ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
   
   # Get Yahoo Finance API key from: https://rapidapi.com/apidojo/api/yh-finance/
   YAHOO_FINANCE_API_KEY=your_yahoo_finance_api_key_here
   ```

   **Note**: If you don't provide API keys, the app will use realistic mock data for demonstration purposes.

3. **Run the Application**:
   ```bash
   python app.py
   ```

4. **Access the Dashboard**:
   Open your browser and go to `http://127.0.0.1:5000`

## API Keys Setup

### Alpha Vantage (Free tier available)
1. Go to [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free account
3. Get your API key
4. Add it to your `.env` file

### Yahoo Finance (Free tier available)
1. Go to [RapidAPI Yahoo Finance](https://rapidapi.com/apidojo/api/yh-finance/)
2. Sign up for a free account
3. Get your API key
4. Add it to your `.env` file

## Chart Types

The dashboard now uses **candlestick charts** instead of line charts, providing:
- Open, High, Low, Close (OHLC) data visualization
- Professional trading chart appearance
- Better price movement analysis
- Color-coded candles (green for up, red for down)

## Data Sources

- **Forex & Stocks**: Alpha Vantage API
- **Cryptocurrencies & Commodities**: Yahoo Finance API
- **Fallback**: Realistic mock data when APIs are unavailable

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Charts**: TradingView Lightweight Charts
- **HTTP Client**: Axios
- **Styling**: Font Awesome icons

## Project Structure

```
financial-dashboard/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables (create this)
├── templates/
│   └── index.html        # Main dashboard template
├── static/
│   ├── css/
│   │   └── styles.css    # Dashboard styling
│   └── js/
│       └── script.js     # Chart logic and data handling
└── README.md             # This file
```

## Customization

You can easily customize the dashboard by:
- Adding new symbols in the `SYMBOLS` dictionary in `app.py`
- Modifying chart colors in `static/js/script.js`
- Adjusting the refresh interval (currently 30 seconds)
- Changing the chart height and styling in `static/css/styles.css`

## License

This project is open source and available under the MIT License.
