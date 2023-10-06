const { rateLimit } = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  limit: 10,
  message: "Too many request from this IP, please try again after two minutes",
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

module.exports = { apiLimiter };
