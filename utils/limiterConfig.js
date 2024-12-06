const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Max 100 requests per IP per windowMs
  standardHeaders: true, // Use standard rate limit headers
  legacyHeaders: false, // Disable deprecated headers
  message: "Too many requests from this IP, please try again later.",
});

module.exports = limiter;
