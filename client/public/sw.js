/* eslint-disable no-restricted-globals */
// client/public/sw.js

// 1. Store files in memory
let fileCache = {};

self.addEventListener("install", (event) => {
  // Activate immediately (don't wait for restart)
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  // Become the controller immediately
  event.waitUntil(self.clients.claim());
});

// 2. LISTEN FOR MESSAGES FROM REACT (Create.jsx / Edit.jsx)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "UPDATE_FILES") {
    fileCache = event.data.files;
    console.log("👷 Service Worker: Files Updated!", Object.keys(fileCache));
  }
});

// 3. INTERCEPT NETWORK REQUESTS
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Only intercept requests going to "/sandbox/"
  if (url.pathname.startsWith("/sandbox/")) {
    
    // Extract filename (e.g. "/sandbox/style.css" -> "style.css")
    // If it's just "/sandbox/" or "/sandbox/index.html", map it to "index.html"
    let filename = url.pathname.replace("/sandbox/", "");
    if (!filename || filename === "index.html") filename = "index.html";

    // LOOK UP FILE IN OUR CACHE
    const file = fileCache[filename];

    if (file) {
      // FOUND IT! Serve the code from memory
      const blob = new Blob([file.value], { 
        type: getMimeType(filename) 
      });
      const response = new Response(blob, { status: 200, statusText: "OK" });
      
      event.respondWith(response);
    } else {
      // File not found (e.g. user deleted it)
      console.warn(`👷 File not found: ${filename}`);
      event.respondWith(new Response("File not found", { status: 404 }));
    }
  }
});

// Helper: Determine Content-Type
function getMimeType(filename) {
  if (filename.endsWith(".html")) return "text/html";
  if (filename.endsWith(".css")) return "text/css";
  if (filename.endsWith(".js")) return "application/javascript";
  if (filename.endsWith(".json")) return "application/json";
  return "text/plain";
}