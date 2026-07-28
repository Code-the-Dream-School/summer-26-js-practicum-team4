// Security Package Imports
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

// Route Imports
const userRoutes = require("./routes/user.routes");
const patternRoutes = require("./routes/pattern.routes");
const authRoutes = require("./routes/auth.routes");
const errorHandlerMiddleware = require("./middleware/error-handler");

const app = express();

// Security & best‑practice middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patterns", patternRoutes);
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

// Handle controller errors
app.use(errorHandlerMiddleware);

module.exports = app;
