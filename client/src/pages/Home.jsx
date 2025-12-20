import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api'; 

export default function Home() {
  const [snippets, setSnippets] = useState([]);
  const [query, setQuery] = useState(""); 
  const user = JSON.parse(localStorage.getItem("user"));

  // --- 1. DASHBOARD LOGIC (Only runs if user is logged in) ---
  useEffect(() => {
    const fetchSnippets = async () => {
      if (user) {
        try {
          const res = await api.get("/snippets/" + user._id);
          setSnippets(res.data);
        } catch (err) {
          console.log("Error fetching projects:", err);
        }
      }
    };
    fetchSnippets();
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/"; 
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete("/snippets/" + id);
      setSnippets(snippets.filter((s) => s._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const getPreviewHtml = (files) => {
    if (!files || files.length === 0) return "<div style='color:#555; text-align:center; padding-top:40px; font-family:sans-serif'>Empty Project</div>";
    let htmlFile = files.find(f => f.name === "index.html") || files.find(f => f.name.endsWith(".html"));
    if (!htmlFile) return "<div style='color:#555; text-align:center; padding-top:40px; font-family:sans-serif'>No HTML Found</div>";

    let html = htmlFile.value;
    const cssFiles = files.filter(f => f.language === "css");
    cssFiles.forEach(css => {
        const linkRegex = new RegExp(`<link[^>]+href=['"]${css.name}['"][^>]*>`, 'g');
        if (html.match(linkRegex)) html = html.replace(linkRegex, `<style>${css.value}</style>`);
    });
    return html;
  };

  // --- 2. LANDING PAGE (Shown when NO user is logged in) ---
  if (!user) {
    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#0f0f0f", color: "white", fontFamily: "'Segoe UI', sans-serif" }}>
            
            {/* HERO SECTION */}
            <header style={{ 
                height: "500px", 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                background: "linear-gradient(180deg, #1e1e2f 0%, #0f0f0f 100%)",
                textAlign: "center",
                padding: "20px"
            }}>
                <h1 style={{ fontSize: "3.5rem", fontWeight: "800", marginBottom: "10px", background: "-webkit-linear-gradient(45deg, #007acc, #00d4ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    CodeStash
                </h1>
                <p style={{ fontSize: "1.2rem", color: "#aaa", maxWidth: "600px", marginBottom: "30px", lineHeight: "1.6" }}>
                    The ultimate online code editor. Build, test, and share your HTML, CSS, and JS projects instantly.
                </p>
                <div style={{ display: "flex", gap: "20px" }}>
                    <Link to="/login">
                        <button style={{ padding: "12px 30px", fontSize: "16px", backgroundColor: "#007acc", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 4px 15px rgba(0, 122, 204, 0.4)" }}>
                            Login
                        </button>
                    </Link>
                    <Link to="/register">
                        <button style={{ padding: "12px 30px", fontSize: "16px", backgroundColor: "transparent", color: "#007acc", border: "2px solid #007acc", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                            Register
                        </button>
                    </Link>
                </div>
            </header>

            {/* "HOW IT WORKS" SECTION */}
            <section style={{ padding: "60px 20px", maxWidth: "1000px", margin: "0 auto" }}>
                <h2 style={{ textAlign: "center", marginBottom: "50px", fontSize: "2rem" }}>How It Works</h2>
                
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "40px" }}>
                    {/* STEP 1 */}
                    <div style={{ flex: "1", minWidth: "250px", backgroundColor: "#1e1e1e", padding: "30px", borderRadius: "10px", border: "1px solid #333" }}>
                        <div style={{ fontSize: "40px", marginBottom: "15px" }}>📂</div>
                        <h3 style={{ color: "#007acc" }}>1. Create Project</h3>
                        <p style={{ color: "#ccc", lineHeight: "1.5" }}>Start a new project with a single click. We set up the environment for you.</p>
                    </div>
                    {/* STEP 2 */}
                    <div style={{ flex: "1", minWidth: "250px", backgroundColor: "#1e1e1e", padding: "30px", borderRadius: "10px", border: "1px solid #333" }}>
                        <div style={{ fontSize: "40px", marginBottom: "15px" }}>✍️</div>
                        <h3 style={{ color: "#e6a23c" }}>2. Write Code</h3>
                        <p style={{ color: "#ccc", lineHeight: "1.5" }}>Use our powerful editor with syntax highlighting to write your HTML, CSS, and JS.</p>
                    </div>
                    {/* STEP 3 */}
                    <div style={{ flex: "1", minWidth: "250px", backgroundColor: "#1e1e1e", padding: "30px", borderRadius: "10px", border: "1px solid #333" }}>
                        <div style={{ fontSize: "40px", marginBottom: "15px" }}>🚀</div>
                        <h3 style={{ color: "#28a745" }}>3. See Results</h3>
                        <p style={{ color: "#ccc", lineHeight: "1.5" }}>Watch your code come to life instantly in the live preview window.</p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer style={{ textAlign: "center", padding: "40px", color: "#555", fontSize: "14px", borderTop: "1px solid #222", marginTop: "40px" }}>
                &copy; 2024 CodeStash. All rights reserved.
            </footer>
        </div>
    );
  }

  // --- 3. DASHBOARD UI (Shown when USER IS LOGGED IN) ---
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#1e1e1e", color: "#e0e0e0", fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* NAVBAR */}
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 30px", height: "60px", backgroundColor: "#252526", borderBottom: "1px solid #333", boxShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>
          <div style={{ fontSize: "20px", fontWeight: "bold", color: "#007acc" }}>⚡ CodeStash</div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
             <span style={{ color: "#aaa", fontSize: "14px" }}>Welcome, <strong style={{ color: "white" }}>{user.username}</strong></span>
             <button onClick={handleLogout} style={{ padding: "8px 16px", backgroundColor: "#d9534f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "600" }}>Logout</button>
          </div>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <h2 style={{ margin: 0, fontSize: "24px" }}>My Projects</h2>
            <Link to="/create">
                <button style={{ padding: "10px 20px", backgroundColor: "#007acc", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold", boxShadow: "0 4px 6px rgba(0,0,0,0.2)" }}>+ New Project</button>
            </Link>
         </div>

         <input type="text" placeholder="🔍 Search projects..." value={query} onChange={(e) => setQuery(e.target.value)} style={{ width: "100%", padding: "14px", marginBottom: "40px", backgroundColor: "#2d2d2d", border: "1px solid #444", borderRadius: "6px", fontSize: "16px", color: "white", outline: "none" }} />

         {/* GRID */}
         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "25px" }}>
            {snippets
            .filter((s) => (s.title || "Untitled").toLowerCase().includes(query.toLowerCase()))
            .map((s) => (
                <div key={s._id} style={{ backgroundColor: "#252526", border: "1px solid #333", borderRadius: "8px", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 4px 10px rgba(0,0,0,0.2)", transition: "transform 0.2s" }}>
                    <div style={{ height: "150px", backgroundColor: "white", position: "relative", borderBottom: "1px solid #333", overflow: "hidden" }}>
                        <div style={{position: "absolute", inset:0, zIndex:10}}></div>
                        <iframe srcDoc={getPreviewHtml(s.files)} title="preview" style={{ width: "200%", height: "200%", border: "none", transform: "scale(0.5)", transformOrigin: "0 0" }} scrolling="no" />
                    </div>
                    <div style={{ padding: "15px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                        <h3 style={{ margin: "0 0 5px 0", fontSize: "16px", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title || "Untitled"}</h3>
                        <p style={{ margin: "0 0 15px 0", fontSize: "12px", color: "#888" }}>{s.files ? s.files.length : 0} files • {new Date(s.updatedAt || Date.now()).toLocaleDateString()}</p>
                        <div style={{ marginTop: "auto", display: "flex", gap: "10px" }}>
                            <Link to={`/edit/${s._id}`} style={{ flex: 1, textDecoration: "none" }}><button style={{ width: "100%", padding: "8px", backgroundColor: "#0e639c", color: "white", border: "none", borderRadius: "3px", cursor: "pointer", fontWeight: "600" }}>Open</button></Link>
                            <button onClick={() => handleDelete(s._id)} style={{ padding: "8px 12px", backgroundColor: "#3a3a3a", color: "#ff6b6b", border: "1px solid #555", borderRadius: "3px", cursor: "pointer" }}>🗑</button>
                        </div>
                    </div>
                </div>
            ))}
         </div>
         {snippets.length === 0 && <div style={{ textAlign: "center", marginTop: "50px", color: "#666" }}><p>No projects found. Start by creating one!</p></div>}
      </div>
    </div>
  );
}