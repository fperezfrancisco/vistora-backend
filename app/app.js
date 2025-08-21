// src/app.js
const express = require("express");
const cors = require("cors");

const requestId = require("./middleware/requestId");
const errorHandler = require("./middleware/errorHandler");
const api = require("./routes"); // mounts all feature routers

const app = express();

// base middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(requestId);

// simple root
app.get("/", (_req, res) => res.send("API is running..."));

// all API routes live under /api
app.use("/api", api);

// global error handler (keep last)
app.use(errorHandler);

module.exports = app;
