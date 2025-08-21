// src/middleware/requestId.js
module.exports = (req, res, next) => {
  const id =
    req.headers["x-correlation-id"] ||
    req.headers["x-request-id"] ||
    Math.random().toString(36).slice(2) + Date.now().toString(36);

  req.correlationId = id;
  res.setHeader("x-correlation-id", id);
  next();
};
