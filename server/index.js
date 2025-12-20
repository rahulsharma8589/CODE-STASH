// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoute =  require('./routes/auth');
const snippetRoute = require('./routes/snippets');

dotenv.config();

const app = express();
// const PORT = process.env.PORT || 5000;
// const PORT = 8800;

// Middleware
app.use(cors({
    origin: "*",  // Allow ALL frontend URLs (localhost:5173, 5174, 5175, etc.)
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these request types
    credentials: true 
}));
app.use(express.json()); // Allow backend to parse JSON data

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('CONNECTION SUCCEFULLY'))
  .catch((err) => console.error('connection failed', err));

app.use('/api/auth', authRoute);
app.use('/api/snippets', snippetRoute);

// Basic Route
app.get('/', (req, res) => {
  res.send('CodeStash API is running!');
});

// Use the Port Render assigns, OR use 8800 if on Localhost
const PORT = process.env.PORT || 8800;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});