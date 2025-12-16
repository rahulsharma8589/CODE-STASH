// client/src/pages/Register.jsx
import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate(); // Hook to move between pages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");

    // --- VALIDATION RULES ---
    
    // 1. Check if all fields are filled
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        setError(true);
        setErrorMessage("Please fill in all fields.");
        return;
    }

    // 2. Check Password Length (e.g., must be at least 6 chars)
    if (password.length < 6) {
        setError(true);
        setErrorMessage("Password must be at least 6 characters long.");
        return;
    }

    // 3. Check if Passwords Match
    if (password !== confirmPassword) {
        setError(true);
        setErrorMessage("Passwords do not match!");
        return;
    }

    try {
      // Send data to backend
      await axios.post("http://localhost:8800/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });
      
      // Redirect to Login Page on success
      navigate("/login");
      
    } catch (err) {
      setError(true);
      // Try to show the specific error from backend (like "Email already exists")
      if(err.response && err.response.data) {
          setErrorMessage(typeof err.response.data === 'string' ? err.response.data : "Registration failed");
      } else {
          setErrorMessage("Something went wrong!");
      }
    }
  };

  return (
    <div className="register">
      <span className="registerTitle">Register</span>
      <form className="registerForm" onSubmit={handleSubmit}>
        
        <label>First Name</label>
        <input 
          type="text" 
          placeholder="First Name" 
          onChange={e => setFirstName(e.target.value)}
        />

        <label>Last Name</label>
        <input 
          type="text" 
          placeholder="Last Name" 
          onChange={e => setLastName(e.target.value)}
        />
        
        <label>Email</label>
        <input 
          type="email" 
          placeholder="Enter your email..." 
          onChange={e => setEmail(e.target.value)}
        />
        
        <label>Password</label>
        <input 
          type="password" 
          placeholder="Enter your password..." 
          onChange={e => setPassword(e.target.value)}
        />

        <label>Confirm Password</label>
        <input 
          type="password" 
          placeholder="Confirm your password..." 
          onChange={e => setConfirmPassword(e.target.value)}
        />
        
        <button className="registerButton" type="submit">Register</button>
      </form>
      
      <button className="registerLoginButton">
        <Link to="/login">Login</Link>
      </button>
      
      {/* Show the specific error message if validation fails */}
      {error && <span style={{color:"red", marginTop:"10px", fontWeight: "bold"}}>{errorMessage}</span>}
    </div>
  );
}