from flask import Flask, request, jsonify, session
from flask_cors import CORS
import requests
import json
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = "any-secret-key"  # required for session

# Load users
with open("users.json", "r") as f:
    USERS = json.load(f)

# MongoDB connection
MONGO_URI = "mongodb+srv://orcohen19081999:Wtq0icojQ9EVM5qM@cryptologscluster.33uurnz.mongodb.net/?retryWrites=true&w=majority&tlsAllowInvalidCertificates=true"
client = MongoClient(MONGO_URI)
db = client.crypto_logs
wallet_logs = db.wallet_logs

@app.route('/api/login', methods=['POST'])
def login():
    print(">>> API Login request")
    data = request.json
    username = data.get('username')
    password = data.get('password')

    user = USERS.get(username)
    if user and user["password"] == password:
        session['username'] = username
        session['wallet'] = user["wallet"]
        return jsonify({
            "success": True,
            "username": username,
            "wallet": user["wallet"]
        })
    else:
        return jsonify({
            "success": False,
            "message": "Invalid username or password"
        }), 401

@app.route('/api/dashboard')
def dashboard():
    print(">>> API Dashboard request")
    
    # For API, we'll use a token-based approach instead of sessions
    # For now, let's accept a wallet address as a parameter
    wallet_address = request.args.get('wallet')
    if not wallet_address:
        return jsonify({"error": "Wallet address required"}), 400

    clean_wallet_logs()
    transactions = get_wallet_transactions(wallet_address)

    # Save transactions to MongoDB (avoid duplicates)
    for tx in transactions[:10]:
        if not wallet_logs.find_one({"hash": tx["hash"]}):
            wallet_logs.insert_one(tx)

    # Calculate total ETH sent
    total_eth = sum(float(tx.get('value', 0)) for tx in transactions) / 1e18

    return jsonify({
        "wallet": wallet_address,
        "transaction_count": len(transactions),
        "total_eth_sent": round(total_eth, 4),
        "transactions": transactions[:10]
    })

@app.route('/api/logs')
def view_logs():
    logs = list(wallet_logs.find().sort("timeStamp", -1).limit(50))
    
    # Convert ObjectId to string for JSON serialization
    for log in logs:
        log['_id'] = str(log['_id'])
    
    return jsonify(logs)

def get_wallet_transactions(address):
    api_key = "7PV9E2NFPWE3E7EG2SN1ZGYS3G35NV3XBJ"
    url = f"https://api.etherscan.io/api?module=account&action=txlist&address={address}&sort=desc&apikey={api_key}"

    print(">>> Sending request to:", url)

    response = requests.get(url)
  
    print(">>> Response status code:", response.status_code)  
 
    data = response.json()

    print(">>> Received", len(data.get("result", [])), "transactions")

    if data["status"] == "1":
        return data["result"]
    else:
        return []

def clean_wallet_logs():
    wallet_addresses = wallet_logs.distinct("to")
    for wallet in wallet_addresses:
        logs = list(wallet_logs.find({"to": wallet}).sort("timeStamp", -1))
        if len(logs) > 10:
            ids_to_delete = [log["_id"] for log in logs[10:]]
            wallet_logs.delete_many({"_id": {"$in": ids_to_delete}})
            print(f"[{wallet[:12]}...] → cleaned.")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
