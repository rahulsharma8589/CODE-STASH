// server/routes/auth.js
const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) return res.status(400).json("Email already exists");

    // 2. Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 3. Create the new user with First and Last Name
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    });

    // 4. Save to Database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

  } catch (err) {
    res.status(500).json(err);
  }
});
// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    // 1. Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");

    // 2. Check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Wrong password");

    // 3. Create a Token (The digital key)
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    // 4. Send back the token and user info (but NOT the password)
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token });

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;