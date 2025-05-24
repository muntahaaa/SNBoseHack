const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const researchRoutes = require("./routes/researchRoutes");
const chatRoutes = require("./routes/chatRoutes");
const ttsRoutes = require("./routes/ttsRoutes");
const volunteerRoutes = require("./routes/volunteerRoutes");
// Initialize Express app

const app = express();

// Enhanced Cors configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://shikhon360.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files
app.use("/videos", express.static(path.join(__dirname, "public", "videos")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/users", authRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api", chatRoutes);
app.use("/api", ttsRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong!",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "sn_bose", // explicitly setting the database name
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.name}`);
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
    console.log(
      `Server running in ${
        process.env.NODE_ENV || "development"
      } mode on port ${PORT}`
    );
  });
});
