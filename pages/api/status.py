import json
from .trade_logic import get_portfolio_status

def handler(event, context):
    try:
        portfolio_status = get_portfolio_status()
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps(portfolio_status)
        }
    except Exception as e:
        # Log the error for debugging on Vercel logs if possible
        print(f"Error in status handler: {e}") 
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": json.dumps({
                "status": "Error fetching portfolio",
                "service": "Python",
                "message": str(e)
            })
        }
