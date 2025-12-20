import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Editor from "@monaco-editor/react";
import FileExplorer from '../components/FileExplorer'; 
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import toast, { Toaster } from 'react-hot-toast'; 
import { api } from '../api'; // <--- Import Helper

// Icons
const MaximizeIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>);
const MinimizeIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>);
const TrashIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>);
const ConsoleIcon = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>);
const DownloadIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>);
const FormatIcon = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>);

export default function Edit() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const user = JSON.parse(localStorage.getItem("user"));
  
  const iframeRef = useRef(null);
  const containerRef = useRef(null); 
  const editorRef = useRef(null); 

  const [files, setFiles] = useState([]);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [title, setTitle] = useState("Loading...");
  const [isSaved, setIsSaved] = useState(true); 
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [logs, setLogs] = useState([]);
  const [editorWidth, setEditorWidth] = useState(50); 
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => { if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(err => console.log(err)); }, []);
  
  useEffect(() => {
    const getSnippet = async () => {
      try {
        const res = await api.get("/snippets/find/" + path);
        setTitle(res.data.title);
        if (res.data.files && res.data.files.length > 0) setFiles(res.data.files);
        else setFiles([{ name: "index.html", language: "html", value: res.data.htmlCode || "" }, { name: "style.css", language: "css", value: res.data.cssCode || "" }, { name: "script.js", language: "javascript", value: res.data.jsCode || "" }]);
        setLoading(false);
      } catch (err) { toast.error("Failed to load project"); }
    };
    if (user) getSnippet();
    else navigate("/login");
  }, [path]); 

  useEffect(() => {
    const handleMessage = (e) => {
        if (e.data.type === "CONSOLE_LOG") setLogs(p => [...p, { type: 'log', message: e.data.message }]);
        if (e.data.type === "CONSOLE_WARN") setLogs(p => [...p, { type: 'warn', message: e.data.message }]);
        if (e.data.type === "CONSOLE_ERROR") setLogs(p => [...p, { type: 'error', message: e.data.message }]);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  
  useEffect(() => { if (!showPreview) return; const timeoutId = setTimeout(() => { runCode(false); }, 1000); return () => clearTimeout(timeoutId); }, [files]); 

  const activeFile = files[activeFileIndex];

  const handleCreateFile = (val) => { let name = val.trim(); if (!name) return; if (name.endsWith("/")) name += ".keep"; if (files.some(f => f.name === name)) return toast.error("Exists!"); let lang = "plaintext"; if (name.endsWith(".js")) lang = "javascript"; else if (name.endsWith(".css")) lang = "css"; else if (name.endsWith(".html")) lang = "html"; setFiles([...files, { name, language: lang, value: "" }]); setIsSaved(false); };
  const handleDeleteFile = (fileName) => { setFiles(files.filter(f => !f.name.startsWith(fileName))); if (activeFile && activeFile.name.startsWith(fileName)) setActiveFileIndex(0); setIsSaved(false); };
  const handleRenameFile = (oldName, newName) => { setFiles(files.map(f => f.name === oldName ? { ...f, name: newName } : f)); setIsSaved(false); };
  const handleEditorChange = (value) => { setFiles(prevFiles => { const newFiles = [...prevFiles]; newFiles[activeFileIndex] = { ...newFiles[activeFileIndex], value: value }; return newFiles; }); setIsSaved(false); };
  const formatCode = () => { if (editorRef.current) { editorRef.current.getAction('editor.action.formatDocument').run(); toast.success("Code Formatted"); } };

  const runCode = (manualTrigger = true) => {
    if (!navigator.serviceWorker.controller) return;
    if (manualTrigger) { setLogs([]); setShowPreview(true); }
    const fileMap = {}; const imports = {};
    files.forEach(f => {
        if (f.language === 'javascript') {
            const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g; let match;
            while ((match = importRegex.exec(f.value)) !== null) { const pkg = match[1]; if (!pkg.startsWith(".") && !pkg.startsWith("/")) imports[pkg] = `https://esm.sh/${pkg}`; }
        }
    });
    files.forEach(f => {
        let content = f.value;
        if (f.name.endsWith(".html")) {
            const spyScript = `<script>(function(){var oldLog=console.log;var oldWarn=console.warn;var oldError=console.error;console.log=function(...args){oldLog.apply(console,args);window.parent.postMessage({type:'CONSOLE_LOG',message:args.join(' ')},'*');};console.warn=function(...args){oldWarn.apply(console,args);window.parent.postMessage({type:'CONSOLE_WARN',message:args.join(' ')},'*');};console.error=function(...args){oldError.apply(console,args);window.parent.postMessage({type:'CONSOLE_ERROR',message:args.join(' ')},'*');};window.onerror=function(msg){window.parent.postMessage({type:'CONSOLE_ERROR',message:msg},'*');};})();</script>`;
            const importMap = `<script type="importmap">{ "imports": ${JSON.stringify(imports)} }</script>`;
            content = content.replace("<head>", "<head>" + spyScript + importMap);
        }
        fileMap[f.name] = { ...f, value: content };
    });
    navigator.serviceWorker.controller.postMessage({ type: "UPDATE_FILES", files: fileMap });
    setTimeout(() => { if (iframeRef.current) { if (manualTrigger) iframeRef.current.src = "/sandbox/index.html"; else iframeRef.current.contentWindow.location.reload(); } }, 50);
  };

  const handleDownload = async () => { const zip = new JSZip(); files.forEach(file => { if (!file.name.endsWith(".keep")) zip.file(file.name, file.value); }); const content = await zip.generateAsync({ type: "blob" }); saveAs(content, `${title || "project"}.zip`); toast.success("Downloaded!"); };

  const handleUpdate = async () => {
    try {
      await api.put("/snippets/" + path, { title, files });
      setIsSaved(true); toast.success("Saved Successfully!"); 
    } catch (err) { toast.error("Failed to update"); }
  };

  const startResizing = (e) => { e.preventDefault(); setIsDragging(true); };
  const stopResizing = () => setIsDragging(false);
  const resize = (e) => { if (isDragging && containerRef.current) { const newWidth = ((e.clientX - containerRef.current.getBoundingClientRect().left) / containerRef.current.getBoundingClientRect().width) * 100; if (newWidth > 10 && newWidth < 90) setEditorWidth(newWidth); } };

  if (loading) return <div style={{height: "100vh", background: "#1e1e1e", color: "white", padding: "20px"}}>Loading Project...</div>;

  return (
    <div onMouseMove={resize} onMouseUp={stopResizing} onMouseLeave={stopResizing} style={{ height: "calc(100vh - 60px)", display: "flex", flexDirection: "column", backgroundColor: "#1e1e1e", color: "#ccc", fontFamily: "sans-serif" }}>
      <Toaster position="top-center" reverseOrder={false} />
      <div style={{ height: "50px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 15px", backgroundColor: "#252526", borderBottom: "1px solid #000" }}>
         <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
            <Link to="/" style={{textDecoration: "none", color: "#ccc", fontSize: "18px", fontWeight: "bold"}}>←</Link>
            <span style={{fontWeight: "bold", color: "#ffa500", letterSpacing: "0.5px"}}>EDIT MODE</span>
            <input type="text" value={title} onChange={e => { setTitle(e.target.value); setIsSaved(false); }} style={{ background: "transparent", color: "white", border: "1px solid #3c3c3c", padding: "4px", borderRadius: "4px", outline: "none" }} />
         </div>
         <div style={{display: "flex", gap: "10px"}}>
             <button onClick={formatCode} title="Format Code" style={{ backgroundColor: "#444", color: "white", border: "1px solid #555", padding: "6px 10px", borderRadius: "3px", cursor: "pointer", display: "flex", alignItems: "center" }}><FormatIcon /></button>
             <button onClick={handleDownload} title="Download Code" style={{ backgroundColor: "#444", color: "white", border: "1px solid #555", padding: "6px 10px", borderRadius: "3px", cursor: "pointer", display: "flex", alignItems: "center" }}><DownloadIcon /></button>
             <button onClick={() => runCode(true)} style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "6px 12px", borderRadius: "3px", cursor: "pointer", fontWeight: "bold" }}>▶ Run</button>
             <button onClick={handleUpdate} style={{ backgroundColor: isSaved ? "#007acc" : "#e6a23c", color: "white", border: "none", padding: "6px 12px", borderRadius: "3px", cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: "5px" }}>{isSaved ? "Save Changes" : "Save Changes ●"}</button>
         </div>
      </div>
      <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {!isFullScreen && (
            <div style={{ width: "240px", display: "flex", flexDirection: "column", borderRight: "1px solid #2d2d2d", backgroundColor: "#252526" }}>
                <FileExplorer files={files} activeFile={activeFile} onFileClick={(n)=>setActiveFileIndex(files.findIndex(f=>f.name===n.fullPath))} onCreateFile={handleCreateFile} onDeleteFile={handleDeleteFile} onRenameFile={handleRenameFile} />
            </div>
        )}
        <div ref={containerRef} style={{ flexGrow: 1, display: "flex", position: "relative" }}>
            <div style={{ width: isFullScreen ? "0%" : (showPreview ? `${editorWidth}%` : "100%"), display: isFullScreen ? "none" : "flex", flexDirection: "column", borderRight: "1px solid #2d2d2d" }}>
                <div style={{ height: "35px", display: "flex", alignItems: "center", background: "#1e1e1e", borderBottom: "1px solid #2d2d2d", padding: "0 15px", color: "#007acc", borderTop: "2px solid #007acc" }}>{activeFile?.name}</div>
                <div style={{ flexGrow: 1 }}>{activeFile && <Editor height="100%" language={activeFile.language} theme="vs-dark" path={activeFile.name} value={activeFile.value} onChange={handleEditorChange} onMount={(editor) => { editorRef.current = editor; }} options={{ minimap: { enabled: false }, fontSize: 14 }} />}</div>
            </div>
            {showPreview && !isFullScreen && <div onMouseDown={startResizing} style={{ width: "10px", margin: "0 -5px", cursor: "ew-resize", zIndex: 10, position: "relative" }} />}
            {showPreview && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "white", minWidth: "200px" }}>
                    <div style={{ height: "35px", display: "flex", alignItems: "center", padding: "0 10px", background: "#f0f0f0", borderBottom: "1px solid #ddd", justifyContent: "space-between" }}>
                         <span style={{fontSize: "12px", color: "#555"}}>localhost/sandbox</span>
                         <div style={{display: "flex", gap: "10px"}}>
                             <button onClick={() => setShowConsole(!showConsole)} title="Toggle Console" style={{border:"none", background: showConsole ? "#ddd" : "transparent", cursor:"pointer", padding: "2px", borderRadius: "3px", color: "#333"}}><ConsoleIcon /></button>
                             <button onClick={()=>setIsFullScreen(!isFullScreen)} style={{border:"none", background:"transparent", cursor:"pointer"}}>{isFullScreen ? <MinimizeIcon/> : <MaximizeIcon/>}</button>
                             <button onClick={()=>setShowPreview(false)} style={{border:"none", background:"transparent", cursor:"pointer", color: "red", fontWeight: "bold"}}>✕</button>
                         </div>
                    </div>
                    <div style={{ flexGrow: 1, height: showConsole ? "60%" : "100%", position: "relative", borderBottom: showConsole ? "1px solid #ccc" : "none" }}>
                        <iframe ref={iframeRef} title="output" style={{ width: "100%", height: "100%", border: "none", pointerEvents: isDragging ? "none" : "auto" }} />
                    </div>
                    {showConsole && (
                        <div style={{ height: "40%", background: "#111", color: "#fff", display: "flex", flexDirection: "column", fontFamily: "monospace", fontSize: "12px" }}>
                            <div style={{ padding: "5px 10px", background: "#333", display: "flex", justifyContent: "space-between" }}><span>CONSOLE</span><button onClick={()=>setLogs([])} style={{background:"none", border:"none", color:"#ccc", cursor:"pointer"}}><TrashIcon/></button></div>
                            <div style={{ flexGrow: 1, overflowY: "auto", padding: "10px" }}>{logs.map((log, i) => (<div key={i} style={{ padding: "2px 0", color: log.type === 'error' ? '#ff5f56' : log.type === 'warn' ? '#ffbd2e' : '#ccc', borderBottom: "1px solid #222" }}><span style={{opacity: 0.5, marginRight: "10px"}}>[{log.type}]</span>{log.message}</div>))}</div>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
}