// client/src/pages/Single.jsx
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Single() {
  const location = useLocation();
  // The ID is the 3rd part of the URL path ( /snippet/123 -> id is "123")
  const path = location.pathname.split("/")[2];
  
  const [snippet, setSnippet] = useState({});

  useEffect(() => {
    const getSnippet = async () => {
      try {
        // Fetch the single snippet using the new backend route
        const res = await axios.get("http://localhost:8800/api/snippets/find/" + path);
        setSnippet(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getSnippet();
  }, [path]);

  // Function to copy code to clipboard
  const handleCopy = () => {
      navigator.clipboard.writeText(snippet.code);
      alert("Code copied to clipboard!");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px" }}>
      <Link to="/" style={{textDecoration: "none", color: "gray", marginBottom: "20px", display: "inline-block"}}>← Back to Dashboard</Link>
      
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <h1 style={{margin: 0}}>{snippet.title}</h1>
          <button 
            onClick={handleCopy}
            style={{padding: "10px", backgroundColor: "#333", color: "white", border: "none", borderRadius: "5px", cursor: "pointer"}}
          >
            Copy Code
          </button>
      </div>

      <p style={{color: "gray"}}>Language: {snippet.language}</p>

      {/* The Code Box */}
      <div style={{ 
          marginTop: "20px", 
          padding: "20px", 
          backgroundColor: "#282c34", 
          color: "white", 
          borderRadius: "10px", 
          fontFamily: "monospace", 
          whiteSpace: "pre-wrap" // This keeps the formatting/indentation correct
      }}>
        {snippet.code}
      </div>
    </div>
  );
}