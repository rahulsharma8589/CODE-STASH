// client/src/pages/Create.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Create() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  // Get the logged-in user to attach to the snippet
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);

    if (!user) {
        alert("You must be logged in!");
        return;
    }

    try {
      await axios.post("http://localhost:8800/api/snippets", {
        userId: user._id, // vital!
        title,
        language,
        code,
      });
      
      // If success, go back to Home
      navigate("/");
      
    } catch (err) {
      console.log(err);
      setError(true);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px" }}>
      <h1>Create New Snippet</h1>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        {/* Title Input */}
        <input 
          type="text" 
          placeholder="Snippet Title (e.g., Binary Search Implementation)" 
          style={{ padding: "15px", fontSize: "18px", border: "1px solid #ccc", borderRadius: "5px" }}
          onChange={e => setTitle(e.target.value)}
          required
        />

        {/* Language Selector */}
        <select 
            style={{ padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" }}
            onChange={e => setLanguage(e.target.value)}
        >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="html">HTML/CSS</option>
        </select>

        {/* Code Area (Simple Textarea for now) */}
        <textarea 
            placeholder="Paste your code here..." 
            rows="15"
            style={{ padding: "15px", fontFamily: "monospace", fontSize: "14px", backgroundColor: "#f4f4f4", border: "1px solid #ccc", borderRadius: "5px" }}
            onChange={e => setCode(e.target.value)}
            required
        ></textarea>

        <button type="submit" style={{ padding: "15px", backgroundColor: "teal", color: "white", border: "none", borderRadius: "5px", fontSize: "18px", cursor: "pointer" }}>
            Save Snippet
        </button>

        {error && <p style={{color: "red"}}>Something went wrong!</p>}
      </form>
    </div>
  );
}