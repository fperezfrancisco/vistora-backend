// src/middleware/errorHandler.js
module.exports = (err, req, res, _next) => {
  // Never log PHI; keep metadata only
  console.error(
    JSON.stringify({
      event: "error",
      route: `${req.method} ${req.originalUrl}`,
      status: err.status || 500,
      message: err.message,
      correlationId: req.correlationId,
      ts: new Date().toISOString(),
    })
  );

  res.status(err.status || 500).json({
    error: err.code || "internal_error",
    message: err.publicMessage || "Something went wrong",
    correlationId: req.correlationId,
  });
};
