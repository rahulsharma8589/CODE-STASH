// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth');
const snippetRoute = require('./routes/snippets');

// 1. Load Environment Variables immediately
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8800;

// 2. Debugging: Check if password is being read
console.log("-----------------------------------------");
console.log("DEBUG: Checking .env file...");
if (process.env.MONGO_URI) {
    console.log("DEBUG: MONGO_URI found! (Starts with: " + process.env.MONGO_URI.substring(0, 15) + "...)");
} else {
    console.error("DEBUG: ❌ MONGO_URI is UNDEFINED. Check your .env file!");
}
console.log("-----------------------------------------");

// 3. Middleware (Fixed CORS for Localhost)
app.use(cors({
    // Using "*" with credentials: true often fails in modern browsers. 
    // We explicitly allow your frontend URL here.
    origin: ["http://localhost:5173", "https://codestash.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true 
}));
app.use(express.json()); 

// 4. Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Successfully'))
  .catch((err) => {
      console.error('❌ Connection Failed:', err.message);
      // If IP is not whitelisted, it will fail here
  });

app.use('/api/auth', authRoute);
app.use('/api/snippets', snippetRoute);

app.get('/', (req, res) => {
  res.send('CodeStash API is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});