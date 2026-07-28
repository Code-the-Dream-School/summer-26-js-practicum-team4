// Security Package Imports
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Route Imports
const helloRoutes = require("./routes/hello.routes");
const userRoutes = require("./routes/user.routes");
const patternRoutes = require("./routes/pattern.routes");

const app = express();

// Security & best‑practice middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Backend API is running");
});

// Handle controller errors
app.use(errorHandlerMiddleware);

module.exports = app;
