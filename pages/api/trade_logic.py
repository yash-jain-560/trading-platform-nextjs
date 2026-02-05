import yfinance as yf
import json
from datetime import datetime

def get_live_prices(tickers):
    """Fetches the current price for a list of tickers."""
    # Fetch 1-minute data for the last day
    data = yf.download(tickers, period='1d', interval='1m', progress=False)
    
    prices = {}
    
    # Ensure data is a DataFrame even for single ticker for consistent handling
    if isinstance(data.columns, yf.MultiIndex):
        # Multi-ticker: data is a MultiIndex DataFrame
        for ticker in tickers:
            try:
                # Access the 'Close' price for the specific ticker
                latest_close = data['Close'][ticker].iloc[-1]
                prices[ticker] = round(float(latest_close), 2)
            except Exception:
                prices[ticker] = 'N/A'
    elif 'Close' in data.columns:
        # Single ticker: data is a standard DataFrame
        if len(tickers) == 1:
            try:
                latest_close = data['Close'].iloc[-1]
                prices[tickers[0]] = round(float(latest_close), 2)
            except Exception:
                prices[tickers[0]] = 'N/A'
    else:
        # Data structure not as expected or empty
        return {ticker: 'N/A' for ticker in tickers}
        
    return prices

def get_portfolio_status():
    """
    Calculates and returns the current portfolio status, including live market data.
    """
    # Example Indian stock tickers for testing the connection
    INDIAN_STOCKS = ['RELIANCE.NS', 'TCS.NS', 'HDFCBANK.NS']

    live_prices = get_live_prices(INDIAN_STOCKS)

    # Initial mock/empty portfolio for Phase 6 (Focus is connection, not actual database)
    portfolio = {
        'cash_balance': 100000.00,
        'holdings': [
            {'ticker': 'RELIANCE.NS', 'quantity': 10, 'avg_price': 2500.00},
            {'ticker': 'TCS.NS', 'quantity': 5, 'avg_price': 3500.00},
            {'ticker': 'HDFCBANK.NS', 'quantity': 20, 'avg_price': 1500.00}
        ],
        'last_updated_utc': datetime.utcnow().isoformat()
    }

    # Calculate current value and P/L
    total_market_value = 0.0
    for holding in portfolio['holdings']:
        ticker = holding['ticker']
        # Fallback to avg_price if live data is not available (e.g., market is closed)
        live_price = live_prices.get(ticker)
        if live_price in ['N/A', None]:
            live_price = holding['avg_price']
        
        holding['live_price'] = live_price
        holding['current_value'] = round(holding['quantity'] * live_price, 2)
        holding['cost_basis'] = round(holding['quantity'] * holding['avg_price'], 2)
        holding['pl_absolute'] = round(holding['current_value'] - holding['cost_basis'], 2)
        holding['pl_percent'] = round((holding['pl_absolute'] / holding['cost_basis']) * 100, 2) if holding['cost_basis'] > 0 else 0.0
        
        total_market_value += holding['current_value']

    portfolio['total_portfolio_value'] = round(portfolio['cash_balance'] + total_market_value, 2)
    portfolio['total_market_value'] = round(total_market_value, 2)
    
    return portfolio

if __name__ == '__main__':
    # Test function
    status = get_portfolio_status()
def execute_trade(symbol, quantity, trade_type):
    """
    MOCK implementation for executing a trade.
    In a real system, this would interact with a brokerage API and update a database.
    """
    if trade_type not in ['BUY', 'SELL']:
        return {'success': False, 'message': 'Invalid trade type.'}

    # Use try-except for robust quantity check (in case it's not a number)
    try:
        quantity = int(quantity)
        if quantity <= 0:
            return {'success': False, 'message': 'Quantity must be a positive integer.'}
    except ValueError:
        return {'success': False, 'message': 'Quantity must be a valid number.'}
        
    if not symbol or len(symbol) < 2:
        return {'success': False, 'message': 'Invalid stock symbol.'}

    # Simulate success
    trade_time = datetime.utcnow().isoformat()
    return {
        'success': True,
        'message': f'Trade executed successfully: {trade_type} {quantity} of {symbol}. (MOCK)',
        'trade_details': {
            'symbol': symbol,
            'quantity': quantity,
            'type': trade_type,
            'timestamp': trade_time
        }
    }

