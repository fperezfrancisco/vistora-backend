const uploadToGCS = require("../utils/gcsUploader");
const { db } = require("../utils/firebaseAdmin");
const { logEvent } = require("../utils/logger");

async function handleFileUpload(req, res) {
  try {
    const file = req.file;
    const userEmail = req.body.email || "anonymous";

    if (!file) {
      logEvent("Upload attempt with no file");
      return res.status(400).send("No file uploaded");
    }

    const gcsPath = await uploadToGCS(file.buffer, file.originalname);

    const metadata = {
      filename: file.originalname,
      gcsPath,
      uploadedBy: userEmail,
      uploadedAt: new Date(),
      contentType: file.mimetype,
      size: file.size,
    };

    // Save metadata to Firestore
    await db.collection("uploads").add(metadata);

    // Log event to Firestore (persist = true)
    await logEvent(
      "File uploaded",
      { user: userEmail, filename: file.originalname, gcsPath },
      true
    );

    res.status(200).json({ message: "Upload successful", path: gcsPath });
  } catch (err) {
    console.error("Upload failed:", err);
    await logEvent("Upload failed", { error: err.message }, true);
    res.status(500).send("Upload failed");
  }
}

// Get latest 10 uploaded files
async function getRecentUploads(req, res) {
  // make this function
}

module.exports = { handleFileUpload, getRecentUploads };
