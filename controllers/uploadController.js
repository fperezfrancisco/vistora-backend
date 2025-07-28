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
  try {
    const snapshot = await db
    .collection("uploads")
    .orderBy("uploadedAt", "desc")
    .limit(10)
    .get();

    const uploads = snapshot.docs.map((doc) => ({
      id: doc.id,
      ... doc.data(),
    }))

    res.status(200).json(uploads);
  } catch(err) {
    console.error('Failed to fetch recent uploads: ', err);
    await logEvent("Failed to fetch recent uploads", {error: err.message}, true);
    res.status(500).send("Failed to fetch recent uploads");
    
  }
}

async function getDenials(req, res) {
  try {
    const { uploadID } = req.params;
    
    if (!uploadID) {
      return res.status(400).json({ error: "Missing uploadID parameter"})
    }

    const snapshot = await db
    .collection('denials')
    .where("uploadID", "==", uploadID)
    .get();

    const denials = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json(denials);
  } catch(err) {
    console.error('Failed to fetch denials: ', err);
    await logEvent("Failed to fetch denials", {error: err.message}, true);
    res.status(500).send("Failed to fetch denials");
    
  }
}

module.exports = { handleFileUpload, getRecentUploads, getDenials };
