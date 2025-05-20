const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Protected route - only accessible by logged-in users
router.get('/', protect, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Research Desk!',
    user: {
      _id: req.user._id,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;
