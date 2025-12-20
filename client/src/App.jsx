import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Create from "./pages/Create";
import Home from "./pages/Home";
import Single from "./pages/Single";
import Edit from "./pages/Edit";

function App() {
  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>
        {/* Main Home / Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Public View of a Snippet */}
        <Route path="/snippet/:id" element={<Single />} />

        {/* AUTH ROUTES: If logged in, Redirect to Home immediately */}
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" replace /> : <Register />} 
        />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" replace /> : <Login />} 
        />

        {/* PROTECTED ROUTES: If NOT logged in, Redirect to Login */}
        <Route 
          path="/create" 
          element={user ? <Create /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/edit/:id" 
          element={user ? <Edit /> : <Navigate to="/login" replace />} 
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;