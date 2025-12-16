// client/src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    try {
      const res = await axios.post("http://localhost:8800/api/auth/login", {
        email,
        password,
      });
      
      // SUCCESS! 
      // 1. Save the 'token' and 'user' info to local storage
      localStorage.setItem("user", JSON.stringify(res.data));
      
      // 2. Refresh the page to update the Navbar (we will fix this properly later)
      window.location.replace("/");
      
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div className="login" style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url('https://images.pexels.com/photos/768473/pexels-photo-768473.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')",
        backgroundSize: "cover"
    }}>
      <span className="loginTitle" style={{fontSize: "50px", marginBottom: "20px"}}>Login</span>
      <form className="loginForm" onSubmit={handleSubmit} style={{marginTop: "20px", display: "flex", flexDirection: "column", backgroundColor: "white", padding: "30px", borderRadius: "10px"}}>
        <label style={{margin: "10px 0"}}>Email</label>
        <input 
          type="text" 
          placeholder="Enter your email..." 
          style={{padding: "10px", backgroundColor: "white", border: "1px solid gray", borderRadius: "5px", minWidth: "250px"}}
          onChange={e => setEmail(e.target.value)}
        />
        
        <label style={{margin: "10px 0"}}>Password</label>
        <input 
          type="password" 
          placeholder="Enter your password..." 
          style={{padding: "10px", backgroundColor: "white", border: "1px solid gray", borderRadius: "5px", minWidth: "250px"}}
          onChange={e => setPassword(e.target.value)}
        />
        
        <button className="loginButton" type="submit" style={{marginTop: "20px", cursor: "pointer", backgroundColor: "lightcoral", border: "none", color: "white", borderRadius: "10px", padding: "10px"}}>
            Login
        </button>
      </form>
      
      <button className="loginRegisterButton" style={{position: "absolute", top: "60px", right: "20px", backgroundColor: "teal", cursor: "pointer", border: "none", padding: "10px", color: "white", borderRadius: "10px"}}>
        <Link to="/register" style={{color:"white", textDecoration:"none"}}>Register</Link>
      </button>
      
      {error && <span style={{color:"red", marginTop:"10px"}}>Wrong Credentials!</span>}
    </div>
  );
}