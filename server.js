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

//posts intake files to google cloud bucket
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    // this validates if file is uploaded and correct
    if (!file) return res.status(400).send("No file uploaded");

    const gcsPath = await uploadToGCS(file.buffer, file.originalname);

    logEvent(`Uploaded file: ${file.originalname} → ${gcsPath}`);
    res.status(200).json({ message: "Upload successful", path: gcsPath });
  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
});
