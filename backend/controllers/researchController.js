const Post = require('../models/Post');
const Challenge = require('../models/Challenge');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/zip',
    'application/x-rar-compressed',
    'image/jpeg',
    'image/png'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

// Export the multer middleware
exports.upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter
});

// File upload endpoint
exports.uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const files = req.files.map(file => ({
      name: file.originalname,
      url: `/uploads/${file.filename}`,
      type: file.mimetype,
      size: file.size
    }));

    res.json({
      success: true,
      files
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all research thoughts with filtering
exports.getThoughts = async (req, res) => {
  try {
    const { filter = 'latest' } = req.query;
    let query = {};
    let sort = {};

    // Apply filters
    switch (filter) {
      case 'trending':
        sort = { 'likes.length': -1, createdAt: -1 };
        break;
      case 'following':
        // To be implemented with user following feature
        break;
      case 'latest':
      default:
        sort = { createdAt: -1 };
    }

    const posts = await Post.find(query)
      .sort(sort)
      .populate('author', 'name email role')
      .populate('comments.user', 'name')
      .lean();

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create a new research thought
exports.createThought = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // Only researchers can create posts
    if (req.user.role !== 'researcher') {
      return res.status(403).json({
        success: false,
        message: 'Only researchers can create posts'
      });
    }

    const post = await Post.create({
      title,
      content,
      tags: tags || [],
      author: req.user._id
    });

    await post.populate('author', 'name email role');

    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Like/unlike a research thought
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const likeIndex = post.likes.indexOf(req.user._id);

    if (likeIndex === -1) {
      // Like the post
      post.likes.push(req.user._id);
    } else {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add a comment to a research thought
exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    const comment = {
      user: req.user._id,
      content
    };

    post.comments.push(comment);
    await post.save();

    // Populate the user info for the new comment
    await post.populate('comments.user', 'name');

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      comment: newComment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single research thought
exports.getThought = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email role')
      .populate('comments.user', 'name')
      .lean();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Challenge-related controllers

// Get all challenges with filtering
exports.getChallenges = async (req, res) => {
  try {
    const { filter = 'latest', category, difficulty } = req.query;
    let query = {};
    let sort = {};

    // For non-researchers, only show published challenges
    if (req.user.role !== 'researcher') {
      query.status = 'published';
    }

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    // For researchers, also filter by author
    if (req.user.role === 'researcher') {
      query.author = req.user._id;
    }

    // Apply filters
    switch (filter) {
      case 'active':
        query.deadline = { $gt: new Date() };
        sort = { deadline: 1 };
        break;
      case 'popular':
        sort = { 'submissions.length': -1 };
        break;
      case 'latest':
      default:
        sort = { createdAt: -1 };
    }

    const challenges = await Challenge.find(query)
      .sort(sort)
      .populate('author', 'name email')
      .lean();

    res.json({
      success: true,
      challenges
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create a new challenge
exports.createChallenge = async (req, res) => {
  try {
    // Only researchers can create challenges
    if (req.user.role !== 'researcher') {
      return res.status(403).json({
        success: false,
        message: 'Only researchers can create challenges'
      });
    }

    const challenge = await Challenge.create({
      ...req.body,
      author: req.user._id
    });

    await challenge.populate('author', 'name email');

    res.status(201).json({
      success: true,
      challenge
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get a single challenge
exports.getChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('author', 'name email')
      .populate('submissions.student', 'name email')
      .lean();

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    res.json({
      success: true,
      challenge
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Submit a solution to a challenge
exports.submitSolution = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    // Check if challenge is still open
    if (challenge.status !== 'published' || challenge.deadline < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This challenge is no longer accepting submissions'
      });
    }

    // Check if student has already submitted
    const existingSubmission = challenge.submissions.find(
      sub => sub.student.toString() === req.user._id.toString()
    );

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a solution to this challenge'
      });
    }

    // Check max participants if set
    if (challenge.maxParticipants && challenge.submissions.length >= challenge.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'This challenge has reached its maximum number of participants'
      });
    }

    const submission = {
      student: req.user._id,
      content: req.body.content,
      attachments: req.body.attachments || []
    };

    challenge.submissions.push(submission);
    await challenge.save();

    // Populate student info for the new submission
    await challenge.populate('submissions.student', 'name email');

    res.status(201).json({
      success: true,
      submission: challenge.submissions[challenge.submissions.length - 1]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Review a submission (researcher only)
exports.reviewSubmission = async (req, res) => {
  try {
    const { challengeId, submissionId } = req.params;
    const { feedback, grade, status } = req.body;

    // Only researchers can review submissions
    if (req.user.role !== 'researcher') {
      return res.status(403).json({
        success: false,
        message: 'Only researchers can review submissions'
      });
    }

    const challenge = await Challenge.findById(challengeId);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found'
      });
    }

    const submission = challenge.submissions.id(submissionId);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    submission.feedback = {
      content: feedback,
      grade: grade || null,
      reviewedAt: new Date()
    };
    submission.status = status || (grade !== null ? 'reviewed' : 'revision-requested');

    await challenge.save();

    res.json({
      success: true,
      submission
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};