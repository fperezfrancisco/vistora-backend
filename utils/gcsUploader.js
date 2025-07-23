const { Storage } = require("@google-cloud/storage");
const path = require("path");

const storage = new Storage();
const bucket = storage.bucket(process.env.GCP_BUCKET_NAME);

async function uploadToGCS(fileBuffer, originalName) {
  const blob = bucket.file(originalName);
  const blobStream = blob.createWriteStream();

  return new Promise((resolve, reject) => {
    blobStream.on("finish", () => {
      resolve(`gs://${bucket.name}/${blob.name}`);
    });
    blobStream.on("error", reject);
    blobStream.end(fileBuffer);
  });
}

module.exports = uploadToGCS;
