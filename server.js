const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

app.use(express.json());

// Enable CORS (adjust for security later)
/*
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend.vercel.app", // Update this once deployed
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
*/

app.use(
  cors({
    origin: true,
    credentials: true, // If using cookies/auth headers
  })
);
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});

const upload = require("./middleware/upload");
const uploadToGCS = require("./utils/gcsUploader");
const { logEvent } = require("./utils/logger");
const { db } = require("./utils/firebaseAdmin");
const { handleFileUpload } = require("./controllers/uploadController");
//intakeParser
const { handleIntakeParse } = require("./controllers/intakeController");
const validateFileType = require("./middleware/validateFileType");
const { getRecentUploads } = require("./controllers/uploadController");
//verify firebase
const verifyFirebaseToken = require("./middleware/verifyFirebaseToken");
const admin = require("./utils/firebaseAdmin");
const attachUserRole = require("./middleware/attachUserRole");

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    time: new Date().toISOString(),
  });
});

app.get("/api/me", verifyFirebaseToken, (req, res) => {
  res.json({
    uid: req.user?.uid || null,
    email: req.user?.email || null,
    tokenAud: req.user?.aud || null, // token projectId
    adminProjectId: admin.app().options.projectId || null, // backend projectId
    userRole: req.user?.role || null,
    orgId: req.user?.orgId || "No Org Id",
  });
});

//posts intake files to google cloud bucket
app.post(
  "/api/upload",
  upload.single("file"),
  verifyFirebaseToken,
  attachUserRole,
  handleFileUpload
);

app.get(
  "/api/uploads/recent",
  verifyFirebaseToken,
  attachUserRole,
  getRecentUploads
);
//gets intake files and posts them to firebase

app.post(
  "/api/intake/parse",
  upload.single("file"),
  validateFileType,
  handleIntakeParse
);

//get denials by upload
const { getDenialsByUpload } = require("./controllers/intakeController");

app.get(
  "/api/uploads/:uploadId/denials",
  verifyFirebaseToken,
  attachUserRole,
  getDenialsByUpload
);

const { handleParsedIntake } = require("./controllers/intakeController");

app.post(
  "/api/intake",
  verifyFirebaseToken,
  attachUserRole,
  handleParsedIntake
);

// Appeals functions
const { addAppeals, getAppeals } = require("./controllers/appealController");
// Add appeal or get appeals
app.post("/api/appeals/add", verifyFirebaseToken, addAppeals);
app.get("/api/appeals/get", verifyFirebaseToken, getAppeals);

// Add a new user to user collection
const { addUser } = require("./controllers/usersController");
app.post("/api/users/add", verifyFirebaseToken, addUser);

// Get template to use for appeal generator
const {
  usePayerTemplate,
  useAppealTemplate,
} = require("./controllers/generatorController");

//Query by doing /api/template/payer?payer=Aetna as an example
app.get("/api/template/payer", verifyFirebaseToken, usePayerTemplate);
//Query by doing /api/template/genAppeal?cptCode=99213&denialReason=Insufficient%20documentation as an example
app.get("/api/template/genAppeal/", verifyFirebaseToken, useAppealTemplate);
