// utils/gcsUploader.js
const { Storage } = require("@google-cloud/storage");

const storage = new Storage(); // ADC on Cloud Run
const BUCKET_ENV = process.env.GCP_BUCKET_NAME || process.env.GCS_BUCKET_NAME; // support either

/**
 * Upload a buffer to GCS.
 * @param {Buffer} fileBuffer
 * @param {string} filename - original filename for reference
 * @param {string} [folder="intake-uploads"]
 * @param {string} [contentType] - e.g. "application/pdf"
 * @returns {Promise<{ bucket: string, name: string, gsUri: string, publicUrl: string }>}
 */
async function uploadToGCS(
  fileBuffer,
  filename,
  folder = "intake-uploads",
  contentType
) {
  const bucketName = BUCKET_ENV;
  if (!bucketName) {
    throw new Error(
      "Missing bucket env (set GCP_BUCKET_NAME or GCS_BUCKET_NAME)."
    );
  }

  const bucket = storage.bucket(bucketName);
  const destination = `${folder}/${Date.now()}_${sanitizeName(filename)}`;
  const file = bucket.file(destination);

  // prefer save() over manual streams; supports metadata + validation
  await file.save(fileBuffer, {
    resumable: false,
    validation: "crc32c",
    metadata: contentType ? { contentType } : undefined,
  });

  return {
    bucket: bucketName,
    name: destination,
    gsUri: `gs://${bucketName}/${destination}`,
    publicUrl: `https://storage.googleapis.com/${bucketName}/${encodeURIComponent(
      destination
    )}`,
  };
}

function sanitizeName(name = "") {
  // avoid weird path chars
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 150);
}

module.exports = { uploadToGCS };
