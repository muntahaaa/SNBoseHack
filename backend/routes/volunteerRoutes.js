const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getOpportunities,
  createOpportunity,
  getOpportunity,
  applyForOpportunity,
  reviewApplication
} = require('../controllers/volunteerController');

// Protect all routes
router.use(protect);

// Volunteer opportunity routes
router.route('/')
  .get(getOpportunities)
  .post(createOpportunity);

router.route('/:id')
  .get(getOpportunity);

router.post('/:id/apply', applyForOpportunity);
router.post('/:id/applications/:applicationId/review', reviewApplication);

module.exports = router;