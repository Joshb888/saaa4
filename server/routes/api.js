const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Member = require("../models/Member");

const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Unauthorized" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalid" });
    req.user = user;
    next();
  });
}

// Register (only use initially to create an admin)
router.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ email: req.body.email, password: hashed });
  res.json(user);
});

// Login
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// Get all members
router.get("/members", auth, async (req, res) => {
  const members = await Member.find();
  res.json(members);
});

// Update member
router.put("/members/:id", auth, async (req, res) => {
  await Member.findByIdAndUpdate(req.params.id, req.body);
  res.json({ success: true });
});

module.exports = router;
