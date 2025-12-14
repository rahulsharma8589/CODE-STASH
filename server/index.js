// server/index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to send requests
app.use(express.json()); // Allow backend to parse JSON data

// Basic Route
app.get('/', (req, res) => {
  res.send('CodeStash API is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});