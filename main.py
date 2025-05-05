from flask import Flask, render_template, request, redirect, url_for, session
import requests
import json
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
app.secret_key = "any-secret-key"  # required for session

# Load users
with open("users.json", "r") as f:
    USERS = json.load(f)

# MongoDB connection
MONGO_URI = "mongodb+srv://orcohen19081999:Wtq0icojQ9EVM5qM@cryptologscluster.33uurnz.mongodb.net/?retryWrites=true&w=majority&appName=CryptoLogsCluster"
client = MongoClient(MONGO_URI)
db = client.crypto_logs
wallet_logs = db.wallet_logs

@app.route('/')
def home():
    return render_template('home.html', page_class='home-page')

@app.route('/reg', methods=['GET', 'POST'])
def register():
    print(">>> You are in /reg")
    if request.method == 'POST':
        return redirect(url_for('dashboard'))
    return render_template('reg.html', page_class='register-page')

@app.route('/login', methods=['GET', 'POST'])
def login():
    print(">>> You are in /login")
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        user = USERS.get(username)
        if user and user["password"] == password:
            session['username'] = username
            session['wallet'] = user["wallet"]
            return redirect(url_for('dashboard'))
        else:
            return "Login failed. Invalid username or password."

    return render_template('login.html', page_class='login-page')

@app.route('/dashboard')
def dashboard():
    print(">>> You are inside the /dashboard route")
    print(">>> Wallet in session:", session.get('wallet'))

    if 'wallet' not in session:
        return redirect(url_for('login'))

    wallet_address = session['wallet']

    clean_wallet_logs()

    transactions = get_wallet_transactions(wallet_address)

    # Save transactions to MongoDB (avoid duplicates)
    # Save only last 10 transactions to MongoDB (avoid duplicates)
    for tx in transactions[:10]:
        if not wallet_logs.find_one({"hash": tx["hash"]}):
            wallet_logs.insert_one(tx)



    return render_template(
        'dashboard.html',
        page_class='dashboard-page',
        transactions=transactions
    )


@app.route('/logs')
def view_logs():
    logs = wallet_logs.find().sort("timeStamp", -1).limit(50)
    return render_template('logs.html', page_class='dashboard-page', logs=logs)


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

@app.template_filter('datetimeformat')
def datetimeformat(value):
    return datetime.fromtimestamp(int(value)).strftime('%Y-%m-%d %H:%M:%S')

def clean_wallet_logs():
    wallet_addresses = wallet_logs.distinct("to")
    for wallet in wallet_addresses:
        logs = list(wallet_logs.find({"to": wallet}).sort("timeStamp", -1))
        if len(logs) > 10:
            ids_to_delete = [log["_id"] for log in logs[10:]]
            wallet_logs.delete_many({"_id": {"$in": ids_to_delete}})
            print(f"[{wallet[:12]}...] → cleaned.")

if __name__ == '__main__':
    app.run(debug=True)
