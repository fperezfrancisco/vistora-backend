// src/routes/users.routes.js
const { Router } = require("express");
const verifyFirebaseToken = require("../middleware/verifyFirebaseToken");
const attachUserRole = require("../middleware/attachUserRole");
const { addUser } = require("../controllers/usersController");
// const { authorize } = require("../middleware/authorize");

const r = Router();

r.post(
  "/add",
  verifyFirebaseToken,
  attachUserRole,
  // authorize("settings:user:add"),  // when you formalize this permission
  addUser
);

module.exports = r;
