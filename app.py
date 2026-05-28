# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, auth

app = Flask(__name__)
CORS(app) # React frontend se connect karne ke liye

# 1. Firebase Admin Initialize (serviceAccountKey.json file folder me honi chahiye)
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

# 2. API: Active Tasks Fetch Karne Ke Liye
@app.route('/api/tasks', methods=['GET'])
def get_active_tasks():
    try:
        tasks_ref = db.collection('tasks').where('status', '==', 'active')
        docs = tasks_ref.stream()
        active_tasks = [{"id": doc.id, **doc.to_dict()} for doc in docs]
        return jsonify(active_tasks), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 3. API: Secure Withdraw Request Submit Karne Ke Liye
@app.route('/api/withdraw', methods=['POST'])
def request_withdraw():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Unauthorized"}), 401
        
        id_token = auth_header.split('Bearer ')[1]
        data = request.json
        amount = int(data.get('amount'))
        upi_id = data.get('upiId')

        if amount <= 0 or not upi_id:
            return jsonify({"error": "Invalid input data"}), 400

        # Token verify karke user data lena
        decoded_token = auth.verify_id_token(id_token)
        uid = decoded_token['uid']

        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        user_data = user_doc.to_dict()
        current_balance = user_data.get('walletBalance', 0)

        if current_balance < amount:
            return jsonify({"error": "Insufficient Balance!"}), 400

        # Balance minus karna aur request database me save karna
        new_balance = current_balance - amount
        user_ref.update({"walletBalance": new_balance})

        request_ref = db.collection('withdraw_requests').document()
        request_ref.set({
            "requestId": request_ref.id,
            "uid": uid,
            "name": user_data.get('name'),
            "email": user_data.get('email'),
            "amount": amount,
            "upiId": upi_id,
            "status": "PENDING",
            "createdAt": firestore.SERVER_TIMESTAMP
        })

        return jsonify({"message": "Withdrawal request submitted!", "newBalance": new_balance}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)
