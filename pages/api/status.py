import json

def handler(event, context):
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "status": "Trading API is operational",
            "service": "Python",
            "message": "Minimal Vercel Python API working"
        })
    }