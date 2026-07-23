from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import sqlite3
import bcrypt

app = Flask(__name__)
CORS(app)

# Load ML Model
model = joblib.load("model/model.pkl")
vectorizer = joblib.load("model/vectorizer.pkl")


@app.route("/")
def home():
    return "Spam Detection API is Running!"


# ==========================
# Register API
# ==========================
@app.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({
            "success": False,
            "message": "Username and Password required"
        })

    hashed_password = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt()
    )

    conn = sqlite3.connect("spam.db")
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users(username,password) VALUES (?,?)",
            (username, hashed_password)
        )

        conn.commit()

        return jsonify({
            "success": True,
            "message": "User Registered Successfully"
        })

    except sqlite3.IntegrityError:

        return jsonify({
            "success": False,
            "message": "Username Already Exists"
        })

    finally:
        conn.close()


# ==========================
# Login API
# ==========================
@app.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    conn = sqlite3.connect("spam.db")
    cursor = conn.cursor()

    cursor.execute(
        "SELECT password FROM users WHERE username=?",
        (username,)
    )

    user = cursor.fetchone()

    conn.close()

    if user:

        stored_password = user[0]

        if bcrypt.checkpw(password.encode("utf-8"), stored_password):

            return jsonify({
                "success": True,
                "message": "Login Successful"
            })

    return jsonify({
        "success": False,
        "message": "Invalid Username or Password"
    })


# ==========================
# Predict API
# ==========================
@app.route("/predict", methods=["POST"])
def predict():

    data = request.get_json()

    username = data.get("username", "guest")
    message = data.get("message", "")

    if message.strip() == "":
        return jsonify({
            "prediction": "Empty Message",
            "confidence": 0
        })

    vector = vectorizer.transform([message])

    prediction = model.predict(vector)[0]

    probability = model.predict_proba(vector)[0]

    result = "Spam" if prediction == 1 else "Not Spam"

    confidence = round(max(probability) * 100, 2)

    conn = sqlite3.connect("spam.db")
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO history
        (username,message,prediction,confidence)
        VALUES (?,?,?,?)
        """,
        (
            username,
            message,
            result,
            confidence
        )
    )

    conn.commit()
    conn.close()

    return jsonify({
        "prediction": result,
        "confidence": confidence
    })


# ==========================
# History API
# ==========================
@app.route("/history/<username>", methods=["GET"])
def history(username):

    conn = sqlite3.connect("spam.db")
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT message,prediction,confidence,created_at
        FROM history
        WHERE username=?
        ORDER BY id DESC
        """,
        (username,)
    )

    rows = cursor.fetchall()

    conn.close()

    history = []

    for row in rows:
        history.append({
            "message": row[0],
            "prediction": row[1],
            "confidence": row[2],
            "created_at": row[3]
        })

    return jsonify(history)


if __name__ == "__main__":
    app.run(debug=True)