// client/src/App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Create from "./pages/Create";
import Home from "./pages/Home";
import Single from "./pages/Single";
import Edit from "./pages/Edit";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  const handleLogout = () =>{
    localStorage.removeItem("user");
    window.location.reload();
  }
  return (
    <BrowserRouter>
      
      {/* <nav style={{padding: "20px", backgroundColor: "#333", color: "white", marginBottom: "20px"}}>
        <Link to="/" style={{marginRight:"20px", color:"white", textDecoration:"none", fontWeight:"bold"}}>CodeStash</Link>
        <div>
          
            {user ? (
              <>
                <Link to="/create" style={{marginRight: "20px", color: "white", backgroundColor: "green", padding: "10px", borderRadius: "5px", textDecoration: "none"}}>+ New Snippet</Link>

                <span style={{marginRight: "20px", color: "lightgreen"}}>Hello, {user.firstName}</span>
                <span onClick={handleLogout} style={{cursor: "pointer", color: "lightcoral"}}>Logout</span>
              </>
            ) : (
              <>
                <Link to="/login" style={{marginRight:"20px", color:"white", textDecoration:"none"}}>Login</Link>
                <Link to="/register" style={{color:"white", textDecoration:"none"}}>Register</Link>
              </>
            )}
        </div>

      </nav> */}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={user ? <div style={{textAlign:"center"}}>Already Logged In</div> : <Register />} />
        <Route path="/login" element={user ? <div style={{textAlign:"center"}}>Already Logged In</div> : <Login />} />
        <Route path="/snippet/:id" element={<Single />} />


        <Route path="/create" element={user ? <Create /> : <Login />} />
        <Route path="/edit/:id" element={<Edit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;