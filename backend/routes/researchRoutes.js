const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getThoughts,
  createThought,
  getThought,
  toggleLike,
  addComment,
  getChallenges,
  createChallenge,
  getChallenge,
  submitSolution,
  reviewSubmission,
  upload,
  uploadFiles
} = require('../controllers/researchController');

// Base route welcome message
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

// Protect all routes
router.use(protect);

// File uploads
router.post('/upload', upload.array('files'), uploadFiles);

// Research thoughts routes
router.route('/thoughts')
  .get(getThoughts)
  .post(createThought);

// Challenge routes - "new" route comes before :id routes
router.get('/challenges/new', (req, res) => {
  res.json({ success: true, message: 'Create new challenge form' });
});

router.route('/challenges')
  .get(getChallenges)
  .post(createChallenge);

// ID-based challenge routes
router.route('/challenges/:id')
  .get(getChallenge);

router.post('/challenges/:id/submit', submitSolution);
router.post('/challenges/:challengeId/submissions/:submissionId/review', reviewSubmission);

// Individual thought routes
router.route('/thoughts/:id')
  .get(getThought);
router.post('/thoughts/:id/like', toggleLike);
router.post('/thoughts/:id/comment', addComment);

module.exports = router;
