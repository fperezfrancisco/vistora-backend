// controllers/intakeController.js
const { parseIntakeFile } = require("../utils/intakeParser");
const uploadToGCS = require("../utils/gcsUploader");
const { db, admin } = require("../utils/firebaseAdmin");
const { logEvent } = require("../utils/logger");
const { v4: uuidv4 } = require("uuid");

async function handleIntakeParse(req, res) {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Upload original intake file to GCS
    const gcsPath = await uploadToGCS(file.buffer, file.originalname);

    // Save upload metadata to Firestore
    const uploadDoc = {
      filename: file.originalname,
      gcsPath,
      uploadedBy: req.body.email || "unknown_user", // You can refine this
      uploadMethod: "manual",
      intakeSource: "835 ERA", // Optional: detect or set based on file
      parsed: true,
      createdAt: new Date(),
    };
    const uploadRef = await db.collection("uploads").add(uploadDoc);

    // Parse file (mocked for now)
    const parsedDenials = parseIntakeFile(file.buffer);

    // Batch write denials to Firestore
    const batch = db.batch();
    parsedDenials.forEach((denial) => {
      const ref = db.collection("denials").doc();
      batch.set(ref, {
        ...denial,
        uploadId: uploadRef.id, // Link each denial to its intake file
      });
    });
    await batch.commit();

    // Log the intake event
    await logEvent(
      "denial_intake_batch",
      {
        count: parsedDenials.length,
        file: file.originalname,
        gcsPath,
        uploadId: uploadRef.id,
      },
      true
    );

    // Return success
    res.status(200).json({
      message: "Intake file uploaded and parsed successfully",
      uploadId: uploadRef.id,
      file: file.originalname,
      denialsParsed: parsedDenials.length,
      gcsPath,
    });
  } catch (err) {
    console.error("Intake parsing failed:", err);
    res.status(500).json({ error: "Failed to process intake file" });
  }
}

async function getDenialsByUpload(req, res) {
  const { uploadId } = req.params;

  if (!uploadId) {
    return res.status(400).json({ error: "Missing uploadId" });
  }

  try {
    const snapshot = await db
      .collection("denials")
      .where("uploadId", "==", uploadId)
      .orderBy("createdAt", "desc")
      .get();

    const denials = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ count: denials.length, denials });
  } catch (err) {
    console.error("Error fetching denials:", err);
    res.status(500).json({ error: "Failed to fetch denials" });
  }
}

async function handleParsedIntake(req, res) {
  const { fileMeta, denials } = req.body;

  if (!fileMeta || !denials || !Array.isArray(denials)) {
    return res.status(400).json({ error: "Invalid intake format" });
  }

  try {
    // 1. Create new upload record
    const uploadRef = await db.collection("uploads").add({
      ...fileMeta,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      totalDenials: denials.length,
    });

    const uploadId = uploadRef.id;

    // 2. Batch insert denials linked to this upload
    const batch = db.batch();
    denials.forEach((denial) => {
      const denialRef = db.collection("denials").doc();
      batch.set(denialRef, {
        ...denial,
        uploadId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();

    // Log the intake event
    await logEvent(
      "denial_intake_batch",
      {
        count: denials.length,
        file: fileMeta.filename,
        user: fileMeta.uploadedBy || "unknown",
        gcsPath,
        uploadId: uploadRef.id,
      },
      true
    );

    return res.status(201).json({
      message: "Intake processed successfully",
      uploadId,
      inserted: denials.length,
    });
  } catch (err) {
    console.error("Error processing intake:", err);
    return res.status(500).json({ error: "Failed to process intake" });
  }
}

module.exports = { handleIntakeParse, getDenialsByUpload, handleParsedIntake };
