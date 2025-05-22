const VolunteerOpportunity = require('../models/VolunteerOpportunity');

// Get all volunteer opportunities
exports.getOpportunities = async (req, res) => {
  try {
    const { filter = 'latest', department, type, status = 'open' } = req.query;
    let query = { status };
    let sort = {};

    if (department) query.department = department;
    if (type) query.type = type;

    // Apply filters
    switch (filter) {
      case 'active':
        query.deadline = { $gt: new Date() };
        sort = { deadline: 1 };
        break;
      case 'popular':
        sort = { 'applications.length': -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    const opportunities = await VolunteerOpportunity.find(query)
      .sort(sort)
      .populate('researcher', 'name email')
      .lean();

    res.json({
      success: true,
      opportunities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create a new volunteer opportunity
exports.createOpportunity = async (req, res) => {
  try {
    // Only researchers can create opportunities
    if (req.user.role !== 'researcher') {
      return res.status(403).json({
        success: false,
        message: 'Only researchers can create volunteer opportunities'
      });
    }

    const opportunity = await VolunteerOpportunity.create({
      ...req.body,
      researcher: req.user._id
    });

    await opportunity.populate('researcher', 'name email');

    res.status(201).json({
      success: true,
      opportunity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single volunteer opportunity
exports.getOpportunity = async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.findById(req.params.id)
      .populate('researcher', 'name email')
      .populate('applications.student', 'name email')
      .lean();

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    res.json({
      success: true,
      opportunity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Apply for a volunteer opportunity
exports.applyForOpportunity = async (req, res) => {
  try {
    const opportunity = await VolunteerOpportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Check if opportunity is still open
    if (opportunity.status !== 'open' || opportunity.deadline < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This opportunity is no longer accepting applications'
      });
    }

    // Check if student has already applied
    const existingApplication = opportunity.applications.find(
      app => app.student.toString() === req.user._id.toString()
    );

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this opportunity'
      });
    }

    // Check if positions are still available
    if (opportunity.applications.filter(app => app.status === 'accepted').length >= opportunity.positions) {
      return res.status(400).json({
        success: false,
        message: 'All positions have been filled'
      });
    }

    const application = {
      student: req.user._id,
      statement: req.body.statement,
      cv: req.body.cv
    };

    opportunity.applications.push(application);
    await opportunity.save();

    await opportunity.populate('applications.student', 'name email');

    res.status(201).json({
      success: true,
      application: opportunity.applications[opportunity.applications.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Review an application
exports.reviewApplication = async (req, res) => {
  try {
    const { id, applicationId } = req.params;
    const { status, feedback } = req.body;

    // Only researchers can review applications
    if (req.user.role !== 'researcher') {
      return res.status(403).json({
        success: false,
        message: 'Only researchers can review applications'
      });
    }

    const opportunity = await VolunteerOpportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Check if researcher owns this opportunity
    if (opportunity.researcher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only review applications for your own opportunities'
      });
    }

    const application = opportunity.applications.id(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update application
    application.status = status;
    application.feedback = {
      content: feedback,
      reviewedAt: new Date()
    };

    // If accepting and positions are filled, close the opportunity
    if (status === 'accepted') {
      const acceptedCount = opportunity.applications.filter(app => 
        app.status === 'accepted' || 
        (app._id.toString() === applicationId && status === 'accepted')
      ).length;

      if (acceptedCount >= opportunity.positions) {
        opportunity.status = 'closed';
      }
    }

    await opportunity.save();

    res.json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};