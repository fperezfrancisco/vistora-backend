// src/routes/appeals.routes.js
const { Router } = require("express");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const attachUserRole = require("../middleware/attachUserRole");
const { addAppeals, getAppeals } = require("../controllers/appealController");
const {
  usePayerTemplate,
  useAppealTemplate,
} = require("../controllers/generatorController");
// const { authorize } = require("../middleware/authorize");

const r = Router();

// POST /api/appeals/add
r.post(
  "/add",
  verifyFirebaseToken,
  attachUserRole,
  // authorize("appeals:generate"),
  addAppeals
);

// GET /api/appeals/get
r.get(
  "/get",
  verifyFirebaseToken,
  attachUserRole,
  // authorize("denials:read"),
  getAppeals
);

// GET /api/appeals/template/payer?payer=...
r.get("/template/payer", verifyFirebaseToken, attachUserRole, usePayerTemplate);

// GET /api/appeals/template/genAppeal?cptCode=...&denialReason=...
r.get(
  "/template/genAppeal",
  verifyFirebaseToken,
  attachUserRole,
  useAppealTemplate
);

module.exports = r;
