import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api'; // <--- Import Helper

export default function Register() {
  const [inputs, setInputs] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));

  useEffect(() => {
    if (inputs.confirmPassword && inputs.password !== inputs.confirmPassword) setPasswordsMatch(false);
    else setPasswordsMatch(true);
  }, [inputs.password, inputs.confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");
    if (!inputs.firstName || !inputs.lastName || !inputs.email || !inputs.password) { setError(true); setErrorMessage("Please fill in all fields."); return; }
    if (!passwordsMatch) { setError(true); setErrorMessage("Passwords do not match!"); return; }

    try {
      await api.post("/auth/register", { firstName: inputs.firstName, lastName: inputs.lastName, email: inputs.email, password: inputs.password });
      navigate("/login");
    } catch (err) {
      setError(true);
      if (err.response && err.response.data) setErrorMessage(typeof err.response.data === 'string' ? err.response.data : "Registration failed");
      else setErrorMessage("Something went wrong.");
    }
  };

  const inputStyle = { padding: "12px", borderRadius: "5px", border: "none", backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white", fontSize: "14px", outline: "none", width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #1e1e2f 0%, #161623 100%)", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ width: "400px", padding: "40px", backgroundColor: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(10px)", borderRadius: "15px", boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "white" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px", fontSize: "28px", fontWeight: "600", letterSpacing: "1px" }}>Create Account</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
              <input name="firstName" type="text" placeholder="First Name" onChange={handleChange} style={inputStyle} />
              <input name="lastName" type="text" placeholder="Last Name" onChange={handleChange} style={inputStyle} />
          </div>
          <input name="email" type="email" placeholder="Email Address" onChange={handleChange} style={inputStyle} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} style={inputStyle} />
          <div style={{display: "flex", flexDirection: "column"}}>
            <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleChange} style={{ ...inputStyle, border: passwordsMatch ? "none" : "1px solid #ff4d4d" }} />
            {!passwordsMatch && <span style={{color: "#ff4d4d", fontSize: "12px", marginTop: "5px", fontWeight: "bold"}}>Passwords do not match!</span>}
          </div>
          <button type="submit" style={{ padding: "12px", border: "none", borderRadius: "5px", backgroundColor: "#007acc", color: "white", fontWeight: "bold", cursor: "pointer", fontSize: "16px", transition: "background 0.3s", marginTop: "10px" }}>Register</button>
        </form>
        {error && <div style={{ marginTop: "15px", padding: "10px", background: "rgba(255,0,0,0.1)", borderLeft: "4px solid #ff4d4d", color: "#ff4d4d", fontSize: "14px" }}>{errorMessage}</div>}
        <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px", color: "#ccc" }}>Already have an account? <Link to="/login" style={{ color: "#007acc", textDecoration: "none", fontWeight: "bold", marginLeft: "5px" }}>Login</Link></div>
      </div>
    </div>
  );
}