import { useState, useEffect, useRef } from 'react';
import { buildFileTree } from '../utils/fileSystem';

// --- ICONS ---
const NewFileIcon = () => (<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M6 1H3C2.44772 1 2 1.44772 2 2V13C2 13.5523 2.44772 14 3 14H12C12.5523 14 13 13.5523 13 13V6L8 1H6Z" stroke="#cccccc"/><path d="M7.5 6V9M9 7.5H6" stroke="#cccccc"/></svg>);
const NewFolderIcon = () => (<svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M1.5 3C1.5 2.44772 1.94772 2 2.5 2H5.5L7.5 4H12.5C13.0523 4 13.5 4.44772 13.5 5V12C13.5 12.5523 13.0523 13 12.5 13H2.5C1.94772 13 1.5 12.5523 1.5 12V3Z" stroke="#cccccc"/><path d="M7.5 7.5V10.5M9 9H6" stroke="#cccccc"/></svg>);

// --- RECURSIVE NODE ---
const FileNode = ({ name, node, onFileClick, onContextMenu, depth, activeFile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = activeFile && activeFile.name === node.fullPath;

  const handleRightClick = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Stop bubbling to parent folders
    onContextMenu(e, node);
  };

  // FOLDER
  if (node.type === 'folder') {
    return (
      <div>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          onContextMenu={handleRightClick}
          style={{ 
            cursor: "pointer", padding: "3px 0", paddingLeft: `${depth * 10 + 10}px`, 
            color: "#e0e0e0", fontSize: "13px", display: "flex", alignItems: "center", gap: "5px",
            userSelect: "none", fontWeight: "bold"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "#2a2d2e"}
          onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
        >
          <span style={{fontSize:"10px", color: "#999"}}>{isOpen ? "▼" : "▶"}</span>
          <span>{name}</span>
        </div>
        {isOpen && (
          <div>
            {Object.keys(node.children).map((childName) => (
              <FileNode key={childName} name={childName} node={node.children[childName]} onFileClick={onFileClick} onContextMenu={onContextMenu} depth={depth + 1} activeFile={activeFile} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // FILE
  return (
    <div 
      onClick={() => onFileClick(node)}
      onContextMenu={handleRightClick}
      style={{ 
        cursor: "pointer", padding: "4px 0", paddingLeft: `${depth * 10 + 22}px`, 
        fontSize: "13px", display: "flex", alignItems: "center", gap: "6px",
        backgroundColor: isActive ? "#37373d" : "transparent",
        color: isActive ? "white" : "#999",
        borderLeft: isActive ? "2px solid #007acc" : "2px solid transparent"
      }}
      onMouseOver={(e) => { if(!isActive) e.currentTarget.style.background = "#2a2d2e"; }}
      onMouseOut={(e) => { if(!isActive) e.currentTarget.style.background = "transparent"; }}
    >
      <span>{name.endsWith('.html') ? '📄' : name.endsWith('.css') ? '#️⃣' : 'JS'}</span>
      {name}
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function FileExplorer({ files, onFileClick, onCreateFile, onRenameFile, onDeleteFile, activeFile }) {
  const tree = buildFileTree(files);
  const [showInput, setShowInput] = useState(null);
  const [inputValue, setInputValue] = useState("");
  
  // CONTEXT MENU STATE
  const [menu, setMenu] = useState({ visible: false, x: 0, y: 0, node: null });

  const startCreating = (type) => { setShowInput(type); setInputValue(""); };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!inputValue) { setShowInput(null); return; }
    let finalName = inputValue.trim();
    if (showInput === 'folder') finalName = finalName + "/.keep";
    onCreateFile(finalName);
    setShowInput(null);
  };

  // --- MENU ACTIONS ---
  const handleContextMenu = (e, node) => {
    setMenu({ visible: true, x: e.clientX, y: e.clientY, node });
  };

  const handleMenuAction = (action) => {
    if (!menu.node) return;
    const { fullPath, type } = menu.node;

    if (action === "delete") {
        if (confirm(`Are you sure you want to delete ${fullPath}?`)) {
            onDeleteFile(fullPath);
        }
    } else if (action === "rename") {
        const newName = prompt("Enter new name:", fullPath.split('/').pop()); // Show only filename
        if (newName && newName !== fullPath) {
             // Logic to construct new path would go here, 
             // but for simplicity, we pass fullPath and newName to parent
             onRenameFile(fullPath, newName);
        }
    }
    setMenu({ visible: false, x: 0, y: 0, node: null });
  };

  // Close menu when clicking elsewhere
  useEffect(() => {
    const handleClick = () => setMenu({ ...menu, visible: false });
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [menu]);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#252526", color: "#ccc", fontFamily: "sans-serif", position: "relative" }}>
      
      {/* HEADER */}
      <div style={{ padding: "10px 15px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#252526" }}>
        <span style={{ fontWeight: "bold", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" }}>Explorer</span>
        <div style={{ display: "flex", gap: "10px" }}>
            <div onClick={() => startCreating('file')} title="New File" style={{cursor:"pointer"}}><NewFileIcon /></div>
            <div onClick={() => startCreating('folder')} title="New Folder" style={{cursor:"pointer"}}><NewFolderIcon /></div>
        </div>
      </div>

      {/* CREATE INPUT */}
      {showInput && (
        <div style={{ padding: "5px 10px", background: "#333" }}>
            <form onSubmit={handleCreate}>
                <input autoFocus type="text" placeholder={showInput === 'file' ? "filename.js" : "foldername"} value={inputValue} onChange={(e) => setInputValue(e.target.value)} onBlur={() => !inputValue && setShowInput(null)} style={{ width: "100%", background: "#3c3c3c", border: "1px solid #007acc", color: "white", padding: "4px", outline: "none", fontSize: "12px" }} />
            </form>
        </div>
      )}

      {/* FILE TREE */}
      <div style={{ flexGrow: 1, overflowY: "auto", padding: "5px 0" }}>
        {Object.keys(tree).map((nodeName) => (
          <FileNode key={nodeName} name={nodeName} node={tree[nodeName]} onFileClick={onFileClick} onContextMenu={handleContextMenu} depth={1} activeFile={activeFile} />
        ))}
      </div>

      {/* --- CONTEXT MENU POPUP --- */}
      {menu.visible && (
        <div style={{
            position: "fixed", top: menu.y, left: menu.x,
            backgroundColor: "#252526", border: "1px solid #454545", boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
            zIndex: 1000, borderRadius: "5px", padding: "5px 0", minWidth: "120px"
        }}>
            <div onClick={() => handleMenuAction("rename")} style={menuItemStyle}>Rename</div>
            <div onClick={() => handleMenuAction("delete")} style={{...menuItemStyle, color: "#ff6b6b"}}>Delete</div>
        </div>
      )}
    </div>
  );
}

const menuItemStyle = {
    padding: "8px 15px", fontSize: "13px", cursor: "pointer", color: "#ccc",
    transition: "background 0.2s"
};