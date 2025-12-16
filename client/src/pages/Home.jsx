// client/src/pages/Home.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Home() {
  const [snippets, setSnippets] = useState([]);
  
  // Get logged in user
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchSnippets = async () => {
      if (user) {
        try {
          // Fetch snippets belonging to THIS user
          const res = await axios.get("http://localhost:8800/api/snippets/" + user._id);
          setSnippets(res.data);
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchSnippets();
  }, [user]);



  const handleDelete = async (id) => {
    // 1. Ask for confirmation (optional but good practice)
    const sure = window.confirm("Are you sure you want to delete this snippet?");
    if (!sure) return;

    try {
      // 2. Tell Backend to delete it
      await axios.delete("http://localhost:8800/api/snippets/" + id);
      
      // 3. Remove it from the screen immediately (so you don't have to refresh)
      setSnippets(snippets.filter((s) => s._id !== id));
      
    } catch (err) {
      console.log(err);
      alert("Failed to delete snippet");
    }
  };



  // 1. If NOT logged in, show the Welcome Screen
  if (!user) {
    return (
        <div style={{textAlign: "center", marginTop: "100px"}}>
            <h1>Welcome to CodeStash</h1>
            <p>Store, organize, and retrieve your code snippets instantly.</p>
            <div style={{marginTop: "20px"}}>
                <Link to="/login" style={{marginRight:"20px", color:"blue"}}>Login</Link>
                <Link to="/register" style={{color:"blue"}}>Register</Link>
            </div>
        </div>
    );
  }

  // 2. If Logged in, show the Dashboard
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px"}}>
          <h2>My Snippets</h2>
          <Link to="/create">
            <button style={{padding: "10px 20px", backgroundColor: "teal", color: "white", border: "none", borderRadius: "5px", cursor: "pointer"}}>
                + New Snippet
            </button>
          </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        
        {/* Loop through snippets and create a card for each */}
        {snippets.map((s) => (
            <div key={s._id} style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", backgroundColor: "white" }}>
                <h3 style={{margin: "0 0 10px 0", color: "#333"}}>{s.title}</h3>
                <span style={{backgroundColor: "#eee", padding: "2px 8px", borderRadius: "4px", fontSize: "12px", color: "#555"}}>{s.language}</span>
                
                <div style={{ marginTop: "15px", backgroundColor: "#282c34", color: "white", padding: "10px", borderRadius: "5px", fontSize: "12px", height: "100px", overflow: "hidden", fontFamily: "monospace" }}>
                    {s.code.substring(0, 100)}... {/* Show only first 100 chars */}
                </div>

                <div style={{marginTop: "15px", display: "flex", justifyContent: "space-between"}}>
                   <button 
                      onClick={() => handleDelete(s._id)} 
                      style={{color: "red", border: "none", background: "none", cursor: "pointer"}}>Delete
                    </button>
                    <Link to={`/edit/${s._id}`}>
                    <button style={{color: "green", border: "none", background: "none", cursor: "pointer"}}>
                      Edit
                    </button>
                    </Link>
                   <Link to={`/snippet/${s._id}`}>
                      <button style={{color: "blue", border: "none", background: "none", cursor: "pointer"}}>View Full
                      </button>
                  </Link>
                </div>
            </div>
        ))}

        {snippets.length === 0 && <p>No snippets found. Create one!</p>}
      </div>
    </div>
  );
}