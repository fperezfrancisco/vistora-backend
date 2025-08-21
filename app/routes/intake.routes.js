// src/routes/intake.routes.js
const { Router } = require("express");
const upload = require("../middleware/upload");
const validateFileType = require("../middleware/validateFileType");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const attachUserRole = require("../middleware/attachUserRole");
const {
  handleIntakeParse,
  getDenialsByUpload,
  handleParsedIntake,
} = require("../controllers/intakeController");
// const { authorize } = require("../middleware/authorize");

const r = Router();

// POST /api/intake/parse  (parse CSV/835 to normalized JSON + parse_report)
r.post("/parse", upload.single("file"), validateFileType, handleIntakeParse);

// GET /api/uploads/:uploadId/denials  (denials by upload)
r.get(
  "/../uploads/:uploadId/denials", // still resolves to /api/uploads/:uploadId/denials via router mount, or move this to uploads.routes if preferred
  verifyFirebaseToken,
  attachUserRole,
  getDenialsByUpload
);

// POST /api/intake  (finalize parsed payload)
r.post(
  "/",
  verifyFirebaseToken,
  attachUserRole,
  // authorize("uploads:finalize:import") // if this endpoint is your import trigger
  handleParsedIntake
);

module.exports = r;
