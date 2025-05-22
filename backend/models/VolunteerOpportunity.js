const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  statement: {
    type: String,
    required: true
  },
  cv: {
    name: String,
    url: String,
    type: String,
    size: Number
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  feedback: {
    content: String,
    reviewedAt: Date
  },
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

const volunteerOpportunitySchema = new mongoose.Schema({
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
  researcher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    required: true
  }],
  positions: {
    type: Number,
    required: true,
    min: [1, 'At least one position is required']
  },
  deadline: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['part-time', 'full-time'],
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open'
  },
  applications: [applicationSchema],
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for searching
volunteerOpportunitySchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('VolunteerOpportunity', volunteerOpportunitySchema);