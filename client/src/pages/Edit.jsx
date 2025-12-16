// client/src/pages/Edit.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Edit() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [code, setCode] = useState("");
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get ID from URL (e.g., /edit/123 -> "123")
  const path = location.pathname.split("/")[2];

  // 1. Fetch existing data when page loads
  useEffect(() => {
    const getSnippet = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/snippets/find/" + path);
        setTitle(res.data.title);
        setLanguage(res.data.language);
        setCode(res.data.code);
      } catch (err) {
        console.log(err);
      }
    };
    getSnippet();
  }, [path]);

  // 2. Handle the Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:8800/api/snippets/" + path, {
        title,
        language,
        code,
      });
      // Redirect back home
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "50px auto", padding: "20px" }}>
      <h1>Edit Snippet</h1>
      
      <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        
        <label>Title</label>
        <input 
          type="text" 
          value={title} // Pre-filled value
          style={{ padding: "15px", fontSize: "18px", border: "1px solid #ccc", borderRadius: "5px" }}
          onChange={e => setTitle(e.target.value)}
        />

        <label>Language</label>
        <select 
            value={language} // Pre-selected value
            style={{ padding: "10px", fontSize: "16px", border: "1px solid #ccc", borderRadius: "5px" }}
            onChange={e => setLanguage(e.target.value)}
        >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="html">HTML/CSS</option>
        </select>

        <label>Code</label>
        <textarea 
            value={code} // Pre-filled code
            rows="15"
            style={{ padding: "15px", fontFamily: "monospace", fontSize: "14px", backgroundColor: "#f4f4f4", border: "1px solid #ccc", borderRadius: "5px" }}
            onChange={e => setCode(e.target.value)}
        ></textarea>

        <button type="submit" style={{ padding: "15px", backgroundColor: "orange", color: "white", border: "none", borderRadius: "5px", fontSize: "18px", cursor: "pointer" }}>
            Update Snippet
        </button>
      </form>
    </div>
  );
}