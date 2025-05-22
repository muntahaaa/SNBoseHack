const mongoose = require('mongoose');

const fileAttachmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  }
});

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  attachments: [fileAttachmentSchema],
  feedback: {
    content: String,
    grade: {
      type: Number,
      min: 0,
      max: 100
    },
    reviewedAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'revision-requested'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  deadline: {
    type: Date,
    required: true
  },
  requirements: [{
    type: String,
    required: true
  }],
  resources: [{
    title: String,
    url: String
  }],
  submissions: [submissionSchema],
  maxParticipants: {
    type: Number,
    default: null // null means unlimited
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'closed'],
    default: 'draft'
  },
  tags: [{
    type: String,
    trim: true
  }],
  skillsRequired: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for searching
challengeSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Challenge', challengeSchema);