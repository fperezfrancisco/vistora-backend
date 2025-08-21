// src/routes/meta.routes.js
const { Router } = require("express");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const attachUserRole = require("../middleware/attachUserRole");
const admin = require("../utils/firebaseAdmin"); // keep your current admin loader

const r = Router();

r.get("/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

r.get("/me", verifyFirebaseToken, attachUserRole, (req, res) => {
  res.json({
    uid: req.user?.uid || null,
    email: req.user?.email || null,
    tokenAud: req.user?.aud || null,
    adminProjectId: admin.app().options.projectId || null,
    userRole: req.authz?.role || null,
    orgId: req.authz?.orgId || null,
  });
});

module.exports = r;
