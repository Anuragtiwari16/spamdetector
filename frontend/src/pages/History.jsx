import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function History() {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    const username = localStorage.getItem("username");

    axios
      .get(`http://127.0.0.1:5000/history/${username}`)
      .then((res) => {
        setHistory(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "30px",
      }}
    >

      <h1
        style={{
          textAlign: "center",
          color: "#3b82f6",
          marginBottom: "10px",
        }}
      >
        Prediction History
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#cbd5e1",
          marginBottom: "30px",
        }}
      >
        Logged in as <b>{localStorage.getItem("username")}</b>
      </p>

      <div
        style={{
          overflowX: "auto",
        }}
      >

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#1e293b",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >

          <thead>

            <tr
              style={{
                background: "#2563eb",
                color: "white",
              }}
            >
              <th style={{ padding: "15px" }}>Message</th>
              <th style={{ padding: "15px" }}>Prediction</th>
              <th style={{ padding: "15px" }}>Confidence</th>
              <th style={{ padding: "15px" }}>Date & Time</th>
            </tr>

          </thead>

          <tbody>

            {history.length === 0 ? (

              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No Prediction History Found
                </td>
              </tr>

            ) : (

              history.map((item, index) => (

                <tr
                  key={index}
                  style={{
                    borderBottom: "1px solid #334155",
                  }}
                >

                  <td style={{ padding: "15px" }}>
                    {item.message}
                  </td>

                  <td
                    style={{
                      padding: "15px",
                      fontWeight: "bold",
                      color:
                        item.prediction === "Spam"
                          ? "#ef4444"
                          : "#22c55e",
                    }}
                  >
                    {item.prediction}
                  </td>

                  <td
                    style={{
                      padding: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    {item.confidence}%
                  </td>

                  <td style={{ padding: "15px" }}>
                    {item.created_at}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: "30px",
        }}
      >

        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            background: "#2563eb",
            color: "white",
            padding: "12px 25px",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          ← Back to Dashboard
        </Link>

      </div>

    </div>
  );
}