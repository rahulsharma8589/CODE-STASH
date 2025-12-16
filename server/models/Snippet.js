// server/models/Snippet.js
const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // We need to know WHO created the snippet
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  code: {
    type: String,
    required: true, // The actual code
  },
  language: {
    type: String,
    default: "javascript", // e.g., python, java, html
  },
}, { timestamps: true });

module.exports = mongoose.model('Snippet', SnippetSchema);