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