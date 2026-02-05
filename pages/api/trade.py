import json
from .trade_logic import execute_trade

def handler(event, context):
    # Vercel's Python runtime puts the request body in the 'body' key of the event
    # For POST requests, we expect JSON data in the body
    if event['httpMethod'] != 'POST':
        return {
            "statusCode": 405,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"success": False, "message": "Method Not Allowed"})
        }

    try:
        data = json.loads(event['body'])
        symbol = data.get('symbol')
        quantity = data.get('quantity')
        trade_type = data.get('type')
        
        result = execute_trade(symbol, quantity, trade_type)

        return {
            "statusCode": 200 if result['success'] else 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(result)
        }

    except json.JSONDecodeError:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"success": False, "message": "Invalid JSON body."})
        }
    except Exception as e:
        print(f"Error in trade handler: {e}")
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"success": False, "message": f"Server Error: {str(e)}"})
        }
