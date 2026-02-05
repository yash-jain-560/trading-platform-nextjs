# trade_logic.py - Simulates the core trading logic
import json
import random
from datetime import datetime

def get_platform_status():
    """Calculates and returns the mock trading platform's status."""
    
    # Simulate trade execution status
    trade_status = random.choice(["Active", "Processing", "Idle", "Error"])
    
    # Simulate a current portfolio value
    portfolio_value = round(random.uniform(10000.00, 15000.00), 2)
    
    # Simulate recent trade data
    recent_trades = [
        {"symbol": "TSLA", "price": 800.00, "quantity": 10, "type": "BUY", "time": datetime.now().isoformat()},
        {"symbol": "MSFT", "price": 300.50, "quantity": 25, "type": "SELL", "time": datetime.now().isoformat()}
    ]

    return {
        "timestamp": datetime.now().isoformat(),
        "status": trade_status,
        "portfolio_value": portfolio_value,
        "recent_trades": recent_trades,
        "message": "Mock platform status fetched successfully"
    }

if __name__ == "__main__":
    print(json.dumps(get_platform_status(), indent=2))
