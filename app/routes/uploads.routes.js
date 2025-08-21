// src/routes/uploads.routes.js
const { Router } = require("express");
const upload = require("../middleware/upload");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const attachUserRole = require("../middleware/attachUserRole");
const {
  getRecentUploads,
  handleFileUpload,
} = require("../controllers/uploadController");
// const { authorize } = require("../middleware/authorize"); // add when you’re ready

const r = Router();

// POST /api/uploads  (file upload to GCS)
r.post(
  "/",
  upload.single("file"),
  verifyFirebaseToken,
  attachUserRole,
  // authorize("uploads:file:upload:any" | "uploads:file:upload:denials"), // optional
  handleFileUpload
);

// GET /api/uploads/recent
r.get(
  "/recent",
  verifyFirebaseToken,
  attachUserRole,
  // authorize("uploads:history:view:team|org"), // optional
  getRecentUploads
);

module.exports = r;
