const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const researchRoutes = require('./routes/researchRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files
app.use('/videos', express.static(path.join(__dirname, 'public', 'videos')));

// Routes
app.use('/api/users', authRoutes);
app.use('/api/research-desk', researchRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Connect to the database before starting the server
connectDB().then(() => {
  // Port configuration
  const PORT = process.env.PORT || 5000;

  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
