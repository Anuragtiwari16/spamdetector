import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Register() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const register = async () => {

    if (username.trim() === "" || password.trim() === "") {
      alert("Please fill all fields");
      return;
    }

    try {

      const res = await axios.post(
        "http://127.0.0.1:5000/register",
        {
          username,
          password,
        }
      );

      alert(res.data.message);

      if (res.data.success) {
        navigate("/");
      }

    } catch (err) {

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
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={register}>
          Register
        </button>

        <p>
          Already have an account?{" "}
          <Link to="/">
            Login
          </Link>
        </p>

      </div>

    </div>

  );

}