console.log("🚀 Starting backend server...");

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

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

//posts intake files to google cloud bucket
app.post("/api/upload", upload.single("file"), handleFileUpload);

app.get("/api/uploads/recent", getRecentUploads);
//gets intake files and posts them to firebase

app.post(
  "/api/intake/parse",
  upload.single("file"),
  validateFileType,
  handleIntakeParse
);

//get denials by upload
const { getDenialsByUpload } = require("./controllers/intakeController");

app.get("/api/uploads/:uploadId/denials", getDenialsByUpload);

const { handleParsedIntake } = require("./controllers/intakeController");

app.post("/api/intake", handleParsedIntake);

// Appeals functions
const { addAppeals, getAppeals } = require("./controllers/appealController")
// Add appeal or get appeals
app.post("/api/appeals/add", addAppeals);
app.get("/api/appeals/get", getAppeals);

// Add a new user to user collection
const { addUser } = require("./controllers/usersController");
app.post("/api/users/add", addUser)

// Get template to use for appeal generator
const { usePayerTemplate, useAppealTemplate } = require("./controllers/generatorController");
//Query by doing /api/template/payer?payer=Aetna as an example 
app.get("/api/template/payer", usePayerTemplate);
//Query by doing /api/template/genAppeal?cptCode=99213&denialReason=Insufficient%20documentation as an example
app.get("/api/template/genAppeal/", useAppealTemplate);
