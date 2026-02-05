# pages/api/status.py
# Vercel Serverless Function (Python) for Next.js API route.
import json
import random
from datetime import datetime

def handler(event, context):
    """Vercel Serverless Function handler to return trading platform status."""
    
    # Core trading logic (moved from trade_logic.py)
    trade_status = random.choice(["Active", "Processing", "Idle", "Error"])
    portfolio_value = round(random.uniform(10000.00, 15000.00), 2)
    
    recent_trades = [
        {"symbol": "TSLA", "price": round(random.uniform(700.00, 900.00), 2), "quantity": 10, "type": "BUY", "time": datetime.now().isoformat()},
        {"symbol": "MSFT", "price": round(random.uniform(280.00, 320.00), 2), "quantity": 25, "type": "SELL", "time": datetime.now().isoformat()}
    ]

    data = {
        "timestamp": datetime.now().isoformat(),
        "status": trade_status,
        "portfolio_value": portfolio_value,
        "recent_trades": recent_trades,
        "message": "Mock platform status fetched successfully (Python API)"
    }

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(data, indent=2)
    }
