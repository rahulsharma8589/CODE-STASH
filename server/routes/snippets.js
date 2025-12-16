// server/routes/snippets.js
const router = require('express').Router();
const Snippet = require('../models/Snippet');

// 1. CREATE A NEW SNIPPET
router.post('/', async (req, res) => {
  const newSnippet = new Snippet(req.body);
  try {
    const savedSnippet = await newSnippet.save();
    res.status(200).json(savedSnippet);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET ALL SNIPPETS (For a specific user)
// Example URL: http://localhost:8800/api/snippets/12345
router.get('/:userId', async (req, res) => {
  try {
    const snippets = await Snippet.find({ userId: req.params.userId });
    res.status(200).json(snippets);
  } catch (err) {
    res.status(500).json(err);
  }
});
// 3. GET ONE SPECIFIC SNIPPET (Add this new route)
router.get('/find/:id', async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    res.status(200).json(snippet);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.put('/:id', async (req, res) => {
  try {
    const updatedSnippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Update with new data sent from frontend
      { new: true }       // Return the updated version, not the old one
    );
    res.status(200).json(updatedSnippet);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. DELETE A SNIPPET
router.delete('/:id', async (req, res) => {
  try {
    await Snippet.findByIdAndDelete(req.params.id);
    res.status(200).json("Snippet has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;