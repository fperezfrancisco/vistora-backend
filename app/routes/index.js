// src/routes/index.js
const { Router } = require("express");
const meta = require("./meta.routes");
const uploads = require("./uploads.routes");
const intake = require("./intake.routes");
const appeals = require("./appeals.routes");
const users = require("./users.routes");

const router = Router();
router.use("/", meta); // /api/health, /api/me
router.use("/uploads", uploads); // /api/uploads/*
router.use("/intake", intake); // /api/intake/*
router.use("/appeals", appeals); // /api/appeals/*
router.use("/users", users); // /api/users/*

module.exports = router;
