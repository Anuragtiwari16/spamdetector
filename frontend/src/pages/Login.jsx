import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    if (username === "" || password === "") {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/login", {
        username,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("username", username);
        navigate("/dashboard");
      } else {
        alert(res.data.message);
      }
    } catch {
      alert("Backend is not running");
    }
  };

  return (
    <div className="login-container">

      <div className="login-card">

        <h1>Spam Detection System</h1>

        <p>Machine Learning Based Email/SMS Spam Detector</p>

        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login}>
          Login
        </button>

        <p>
          New User? <Link to="/register">Register</Link>
        </p>

      </div>

    </div>
  );
}