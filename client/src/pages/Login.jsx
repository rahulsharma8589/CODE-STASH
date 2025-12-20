import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api'; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // const navigate = useNavigate(); // <--- Not needed for the success redirect anymore

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // 1. Save user info to Local Storage
      localStorage.setItem("user", JSON.stringify(res.data));
      
      // 2. FORCE RELOAD to Home Page (Fixes the Navbar issue)
      window.location.replace("/")
      
    } catch (err) {
      setError(true);
      setLoading(false);
      
      if (err.response && err.response.data) {
          setErrorMessage(typeof err.response.data === 'string' ? err.response.data : "Login failed");
      } else {
          setErrorMessage("Server error. Please try again.");
      }
    }
  };

  const inputStyle = { padding: "12px", borderRadius: "5px", border: "none", backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1e1e2f 0%, #161623 100%)", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ width: "350px", padding: "40px", backgroundColor: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(10px)", borderRadius: "15px", boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "white" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "28px", fontWeight: "600", letterSpacing: "1px" }}>Welcome Back</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          <button type="submit" disabled={loading} style={{ padding: "12px", border: "none", borderRadius: "5px", backgroundColor: loading ? "#555" : "#007acc", color: "white", fontWeight: "bold", cursor: loading ? "not-allowed" : "pointer", fontSize: "16px", transition: "background 0.3s", marginTop: "10px" }}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        {error && <div style={{ marginTop: "20px", padding: "10px", background: "rgba(255,0,0,0.1)", borderLeft: "4px solid #ff4d4d", color: "#ff4d4d", fontSize: "14px", textAlign: "center" }}>{errorMessage}</div>}
        <div style={{ marginTop: "25px", textAlign: "center", fontSize: "14px", color: "#ccc" }}>Don't have an account? <Link to="/register" style={{ color: "#007acc", textDecoration: "none", fontWeight: "bold", marginLeft: "5px" }}>Register</Link></div>
      </div>
    </div>
  );
}