import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {

  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [confidence, setConfidence] = useState("");

  const predict = async () => {

    if (message.trim() === "") {
      alert("Please enter a message");
      return;
    }

    try {

      const res = await axios.post("http://127.0.0.1:5000/predict", {
        username,
        message,
      });

      setResult(res.data.prediction);
      setConfidence(res.data.confidence);

    } catch {
      alert("Prediction Failed");
    }

  };

  const logout = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "30px",
      }}
    >

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1 style={{ color: "#3b82f6" }}>
            Spam Detection System
          </h1>

          <p>Welcome, <b>{username}</b></p>
        </div>

        <button
          onClick={logout}
          style={{
            background: "#ef4444",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          background: "#1e293b",
          padding: "25px",
          borderRadius: "12px",
        }}
      >

        <h2>Enter Message</h2>

        <textarea
          rows="8"
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "16px",
          }}
          placeholder="Type your Email or SMS here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <br /><br />

        <button
          onClick={predict}
          style={{
            width: "100%",
            padding: "14px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "17px",
            cursor: "pointer",
          }}
        >
          Predict
        </button>

        {result !== "" && (
          <div
            style={{
              marginTop: "25px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                color:
                  result === "Spam"
                    ? "#ef4444"
                    : "#22c55e",
              }}
            >
              {result}
            </h2>

            <h3>
              Confidence : {confidence}%
            </h3>
          </div>
        )}

        <br />

        <div
          style={{
            textAlign: "center",
          }}
        >
          <Link
            to="/history"
            style={{
              color: "#60a5fa",
              fontWeight: "bold",
            }}
          >
            View Prediction History
          </Link>
        </div>

      </div>

    </div>
  );
}