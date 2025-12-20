// server/models/Snippet.js
const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  
  // THE FILE SYSTEM
  // Instead of fixed html/css/js, we store a list of files
  files: [
    {
      name: { type: String, required: true }, // e.g., "script.js" or "styles/main.css"
      language: { type: String, required: true }, // "javascript", "css", "html"
      value: { type: String, default: "" } // The actual code
    }
  ],
  
  isPublic: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Snippet', SnippetSchema);