const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();

dotenv.config();

app.use(express.json());

// Enable CORS (adjust for security later)
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend origin
    credentials: true, // If using cookies/auth headers
  })
);
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
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
