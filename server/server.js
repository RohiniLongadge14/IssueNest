require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const issueRoutes = require("./routes/issueRoutes");
const authRoutes = require("./routes/authRoutes");

const errorHandler = require("./middleware/errorMiddleware");

const app = express();

const PORT = process.env.PORT || 5000;


// ========================================
// CONNECT TO MONGODB
// ========================================

connectDB();


// ========================================
// GLOBAL MIDDLEWARE
// ========================================

// Allow React frontend to communicate
// with the Express backend
app.use(cors());

// Read JSON request bodies
app.use(express.json());


// ========================================
// API ROUTES
// ========================================

// Issue APIs
app.use("/api/issues", issueRoutes);

// Authentication APIs
app.use("/api/auth", authRoutes);


// ========================================
// BASIC TEST ROUTE
// ========================================

app.get("/", (req, res) => {
  res.status(200).send("IssueNest API is running");
});


// ========================================
// ERROR HANDLING
// ========================================

// This middleware must come AFTER all routes
app.use(errorHandler);


// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
  console.log(
    `IssueNest server is running on http://localhost:${PORT}`
  );
});