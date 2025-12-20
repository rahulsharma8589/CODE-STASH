// client/src/components/Editor.jsx
import Editor from "@monaco-editor/react";

export default function CodeEditor({ displayName, language, value, onChange }) {
  
  function handleChange(value, event) {
    onChange(value);
  }

  return (
    <div style={{
        display: "flex", 
        flexDirection: "column", 
        flexGrow: 1, 
        flexBasis: 0, 
        minWidth: "200px",
        height: "100%",
        backgroundColor: "#1e1e1e",
        borderRight: "2px solid #333"
    }}>
      {/* Header for the Editor (e.g., "HTML") */}
      <div style={{
          display: "flex", 
          justifyContent: "space-between", 
          backgroundColor: "#1e1e1e", 
          color: "white", 
          padding: ".5rem 1rem", 
          borderBottom: "1px solid #333",
          fontFamily: "sans-serif",
          fontWeight: "bold"
      }}>
        {displayName}
      </div>

      {/* The Monaco Editor */}
      <div style={{flexGrow: 1, height: "100%"}}>
        <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={value}
            onChange={handleChange}
            options={{
                wordWrap: "on",
                minimap: { enabled: false },
                showUnused: false,
                folding: false,
                lineNumbersMinChars: 3,
                fontSize: 14,
                scrollBeyondLastLine: false,
                automaticLayout: true,
            }}
        />
      </div>
    </div>
  );
}